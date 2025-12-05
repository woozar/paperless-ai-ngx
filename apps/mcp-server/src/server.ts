import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { PaperlessClient } from '@repo/paperless-client';
import type { Config } from './config.js';
import {
  PaperlessTools,
  listDocumentsSchema,
  getDocumentSchema,
  getDocumentContentSchema,
  searchTagsSchema,
  searchCorrespondentsSchema,
  searchDocumentTypesSchema,
} from './tools/paperless.js';
import { SessionData, SessionManager } from './session-manager.js';
import { Logger } from './logger.js';
import { version } from './version.js';

export class PaperlessMCPServer {
  private server: McpServer;
  private sessionManager: SessionManager;
  private app: express.Application;
  private config: Config;
  private currentSessionId: string | null = null;
  private logger: Logger;

  constructor(config: Config) {
    this.config = config;
    this.logger = new Logger(config.LOG_LEVEL);
    this.sessionManager = new SessionManager();
    this.server = new McpServer({
      name: 'paperless-ai-ngx-mcp',
      version,
    });

    this.app = express();
    this.registerTools();
    this.setupHttpRoutes();
    this.startSessionCleanup();
  }

  private startSessionCleanup() {
    // Cleanup expired sessions every hour
    setInterval(
      () => {
        this.sessionManager.cleanupExpiredSessions();
      },
      60 * 60 * 1000
    );
  }

  private generateJWT(sessionId: string, audience: string): string {
    return jwt.sign(
      {
        sessionId,
        aud: audience,
      },
      this.config.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '24h',
      }
    );
  }

  private verifyJWT(token: string, audience: string): { sessionId: string } | null {
    try {
      const decoded = jwt.verify(token, this.config.JWT_SECRET, {
        algorithms: ['HS256'],
        audience,
      }) as { sessionId: string; aud: string };

      return { sessionId: decoded.sessionId };
    } catch (error) {
      /* v8 ignore next -- @preserve */
      this.logger.debug(
        `❌ JWT verification failed: ${error instanceof Error ? error.message : 'Unknown'}`
      );
      return null;
    }
  }

  private getAudience(req: Request): string {
    const protocol = req.protocol;
    const host = req.get('host') || `${this.config.HOST}:${this.config.PORT}`;
    return `${protocol}://${host}`;
  }

  private validateBearerToken(req: Request): {
    valid: boolean;
    sessionId?: string;
    session?: SessionData;
    error?: string;
  } {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'No Bearer token provided' };
    }

    const token = authHeader.slice(7);
    const audience = this.getAudience(req);
    const decoded = this.verifyJWT(token, audience);

    if (!decoded) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    const session = this.sessionManager.getSession(decoded.sessionId);
    if (!session) {
      return { valid: false, error: 'Session not found or expired' };
    }

    return { valid: true, sessionId: decoded.sessionId, session };
  }

  private async authenticateRequest(
    req: Request & { mcpSessionId?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.logger.debug('\n=== Incoming Request ===');
    this.logger.debug(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    this.logger.debug('Headers:', {
      'content-type': req.headers['content-type'],
      authorization: req.headers.authorization ? 'Bearer ***' : 'none',
    });
    this.logger.debug(`Body size: ${JSON.stringify(req.body).length} bytes`);
    if (req.body?.method) {
      this.logger.debug(`MCP Method: ${req.body.method}`);
    }

    const result = this.validateBearerToken(req);

    if (!result.valid) {
      this.logger.info(`❌ Authentication failed: ${result.error}`);

      // Determine error response based on error type
      let error: string;
      let message: string;

      if (result.error === 'No Bearer token provided') {
        error = 'Authentication required';
        message = 'Please provide a valid Bearer token in the Authorization header';
      } else if (result.error === 'Session not found or expired') {
        error = 'Invalid token';
        message = 'Session not found or expired. Please login again.';
      } else {
        error = 'Invalid token';
        message = 'The provided token is invalid or has expired';
      }

      res.status(401).json({ error, message });
      return;
    }

    /* v8 ignore start -- @preserve */
    this.logger.debug(`🔑 Token verified, session ID: ${result.sessionId}`);
    this.logger.debug(`✅ Session found: ${result.sessionId}`);

    // Store session ID for later use
    req.mcpSessionId = result.sessionId;
    this.logger.debug('✅ Authentication successful\n');
    next();
    /* v8 ignore stop -- @preserve */
  }

  private getToolsForRequest(): PaperlessTools {
    const sessionId = this.currentSessionId;

    if (!sessionId) {
      throw new Error('No session ID found');
    }

    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found or expired');
    }

    return new PaperlessTools(session.client);
  }

  // HTTP endpoint handlers
  private handleVerify(req: Request, res: Response): void {
    this.logger.debug('\n📨 GET /verify');

    const result = this.validateBearerToken(req);

    if (!result.valid) {
      this.logger.info(`❌ ${result.error}`);
      res.status(401).json({
        valid: false,
        error: result.error,
      });
      return;
    }

    this.logger.debug(`✅ Token valid, session: ${result.sessionId}`);
    res.json({
      valid: true,
      sessionId: result.sessionId,
      expiresAt: new Date(
        result.session!.lastAccessedAt.getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  private async handleLogin(req: Request, res: Response): Promise<void> {
    this.logger.debug('\n📨 POST /login');

    const loginSchema = z.object({
      mcpToken: z.string().optional(),
      paperlessUrl: z.url(),
      paperlessToken: z.string().min(1),
    });

    // Validate request body
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      this.logger.info('❌ Invalid request body:', parseResult.error.format());
      res.status(400).json({
        error: 'Invalid request',
        message: 'Invalid request body',
        details: parseResult.error.format(),
      });
      return;
    }

    const { mcpToken, paperlessUrl, paperlessToken } = parseResult.data;

    // Validate API token if configured
    if (this.config.API_TOKEN) {
      if (!mcpToken) {
        this.logger.info('❌ API token required but not provided');
        res.status(401).json({
          error: 'API token required',
          message: 'API token is required for this server',
        });
        return;
      }

      if (mcpToken !== this.config.API_TOKEN) {
        this.logger.info('❌ Invalid API token');
        res.status(401).json({
          error: 'Invalid API token',
          message: 'The provided API token is invalid',
        });
        return;
      }

      this.logger.debug('✅ API token validated');
    } else {
      this.logger.debug('ℹ️  API token validation skipped (not configured)');
    }

    // Test Paperless connection
    try {
      this.logger.info(`🔌 Testing connection to ${paperlessUrl}...`);
      const testClient = new PaperlessClient({
        baseUrl: paperlessUrl,
        token: paperlessToken,
      });
      const tools = new PaperlessTools(testClient);
      const result = await tools.checkConnection();

      if (!result.connected) {
        this.logger.info('❌ Paperless connection test failed');
        res.status(401).json({
          error: 'Invalid Paperless credentials',
          message: 'Could not connect to Paperless-ngx with provided credentials',
        });
        return;
      }

      this.logger.info('✅ Paperless connection successful');
    } catch (error) {
      /* v8 ignore next -- @preserve */
      this.logger.error(
        `❌ Connection error: ${error instanceof Error ? error.message : 'Unknown'}`
      );
      res.status(401).json({
        error: 'Connection failed',
        /* v8 ignore next -- @preserve */
        message: error instanceof Error ? error.message : 'Failed to connect to Paperless-ngx',
      });
      return;
    }

    // Create session
    const sessionId = this.sessionManager.createSession(paperlessUrl, paperlessToken);
    this.logger.info(`✅ Session created: ${sessionId}`);

    // Generate JWT token
    const audience = this.getAudience(req);
    const token = this.generateJWT(sessionId, audience);
    this.logger.debug(`✅ JWT token generated for audience: ${audience}`);

    res.json({
      token,
      expiresIn: 86400, // 24 hours in seconds
    });
  }

  /* v8 ignore next -- @preserve */
  private async handleMcpRequest(
    req: Request & { mcpSessionId?: string },
    res: Response
  ): Promise<void> {
    this.logger.debug('🔧 Processing MCP request...');

    // Store session ID for tool handlers
    this.currentSessionId = req.mcpSessionId ?? null;

    // Create new transport per request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on('close', () => {
      this.logger.debug('✅ Request completed\n');
      this.currentSessionId = null; // Clear after request
      transport.close();
    });

    await this.server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }

  // Tool handler methods
  private async handleListDocuments(params: unknown) {
    const tools = this.getToolsForRequest();
    const validated = listDocumentsSchema.parse(params);
    const result = await tools.listDocuments(validated);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetDocument(params: unknown) {
    const tools = this.getToolsForRequest();
    const validated = getDocumentSchema.parse(params);
    const result = await tools.getDocument(validated);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetDocumentContent(params: unknown) {
    const tools = this.getToolsForRequest();
    const validated = getDocumentContentSchema.parse(params);
    const result = await tools.getDocumentContent(validated);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchTags(params: unknown) {
    const tools = this.getToolsForRequest();
    const validated = searchTagsSchema.parse(params);
    const result = await tools.searchTags(validated);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchCorrespondents(params: unknown) {
    const tools = this.getToolsForRequest();
    const validated = searchCorrespondentsSchema.parse(params);
    const result = await tools.searchCorrespondents(validated);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchDocumentTypes(params: unknown) {
    const tools = this.getToolsForRequest();
    const validated = searchDocumentTypesSchema.parse(params);
    const result = await tools.searchDocumentTypes(validated);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleCheckConnection() {
    const tools = this.getToolsForRequest();
    const result = await tools.checkConnection();
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private registerTools() {
    // List documents
    this.server.registerTool(
      'paperless_list_documents',
      {
        title: 'List Documents',
        description:
          'List documents from Paperless-ngx with optional filtering by search query, tags, correspondent, or document type',
        inputSchema: {
          page: z.number().int().positive().optional(),
          page_size: z.number().int().positive().max(100).optional(),
          search: z.string().optional(),
          tags: z.array(z.number().int()).optional(),
          correspondent_id: z.number().int().optional(),
          document_type_id: z.number().int().optional(),
        },
      },
      this.handleListDocuments.bind(this)
    );

    // Get document
    this.server.registerTool(
      'paperless_get_document',
      {
        title: 'Get Document',
        description: 'Get detailed information about a specific document by ID',
        inputSchema: {
          id: z.number().int().positive(),
        },
      },
      this.handleGetDocument.bind(this)
    );

    // Get document content
    this.server.registerTool(
      'paperless_get_document_content',
      {
        title: 'Get Document Content',
        description: 'Get the full text content of a specific document',
        inputSchema: {
          id: z.number().int().positive(),
        },
      },
      this.handleGetDocumentContent.bind(this)
    );

    // Search tags
    this.server.registerTool(
      'paperless_search_tags',
      {
        title: 'Search Tags',
        description: 'Search for tags by name or slug',
        inputSchema: {
          query: z.string().min(1),
        },
      },
      this.handleSearchTags.bind(this)
    );

    // Search correspondents
    this.server.registerTool(
      'paperless_search_correspondents',
      {
        title: 'Search Correspondents',
        description: 'Search for correspondents by name or slug',
        inputSchema: {
          query: z.string().min(1),
        },
      },
      this.handleSearchCorrespondents.bind(this)
    );

    // Search document types
    this.server.registerTool(
      'paperless_search_document_types',
      {
        title: 'Search Document Types',
        description: 'Search for document types by name or slug',
        inputSchema: {
          query: z.string().min(1),
        },
      },
      this.handleSearchDocumentTypes.bind(this)
    );

    // Check connection
    this.server.registerTool(
      'paperless_check_connection',
      {
        title: 'Check Connection',
        description: 'Check connection to Paperless-ngx instance',
        inputSchema: {},
      },
      this.handleCheckConnection.bind(this)
    );
  }

  private setupHttpRoutes() {
    // Enable CORS for all routes
    this.app.use(
      cors({
        origin: true, // Allow all origins in development
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'mcp-protocol-version'],
        exposedHeaders: ['X-MCP-Session-ID'],
      })
    );

    this.app.use(express.json());

    // Request logger for all requests
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      if (!req.path.includes('/health')) {
        this.logger.info(`\n📨 ${req.method} ${req.path} from ${req.ip}`);
      }
      next();
    });

    // Health check endpoint (no auth required)
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok', version });
    });

    // Verify token endpoint
    this.app.get('/verify', this.handleVerify.bind(this));

    // Login endpoint (no auth required)
    this.app.post('/login', this.handleLogin.bind(this));

    // MCP endpoint info (GET)
    this.app.get('/mcp', (_req: Request, res: Response) => {
      res.json({
        name: 'paperless-ai-ngx-mcp',
        version,
        description: 'Model Context Protocol server for Paperless-ngx',
        authentication: 'Bearer token required',
        endpoints: {
          login: '/login',
          verify: '/verify',
          mcp: '/mcp (POST)',
        },
      });
    });

    // MCP endpoint (requires auth)
    this.app.post('/mcp', this.authenticateRequest.bind(this), this.handleMcpRequest.bind(this));
  }

  /* v8 ignore next -- @preserve */
  async start() {
    this.app.listen(this.config.PORT, this.config.HOST, () => {
      this.logger.info(`MCP Server running on http://${this.config.HOST}:${this.config.PORT}`);
      this.logger.info(`\nEndpoints:`);
      this.logger.info(`  Health:   http://${this.config.HOST}:${this.config.PORT}/health`);
      this.logger.info(`  Login:    http://${this.config.HOST}:${this.config.PORT}/login`);
      this.logger.info(`  Verify:   http://${this.config.HOST}:${this.config.PORT}/verify`);
      this.logger.info(`  MCP:      http://${this.config.HOST}:${this.config.PORT}/mcp`);
      this.logger.info('\nAuthentication Flow:');
      this.logger.info('  1. POST to /login with your credentials:');
      this.logger.info('     {');
      if (this.config.API_TOKEN) {
        this.logger.info(`       "mcpToken": "your-mcp-token",`);
      }
      this.logger.info('       "paperlessUrl": "https://paperless.example.com",');
      this.logger.info('       "paperlessToken": "your-paperless-token"');
      this.logger.info('     }');
      this.logger.info('  2. Receive a Bearer token in the response');
      this.logger.info('  3. Use the Bearer token for all /mcp requests:');
      this.logger.info('     Authorization: Bearer <token>');
      this.logger.info('\nExample with curl:');
      this.logger.info(`  # Login`);
      this.logger.info(
        `  TOKEN=$(curl -s -X POST http://localhost:3001/login -H "Content-Type: application/json" -d '{"paperlessUrl":"https://paperless.example.com","paperlessToken":"your-token"}' | jq -r .token)`
      );
      this.logger.info(`  # Use token for MCP requests`);
      this.logger.info(`  curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/mcp`);
    });
  }
}
