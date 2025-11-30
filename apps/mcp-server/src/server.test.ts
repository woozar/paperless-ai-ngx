import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { PaperlessMCPServer } from './server.js';
import type { Config } from './config.js';
import type { Request } from 'express';
import { PaperlessTools } from './tools/paperless.js';
import type { SessionManager, SessionData } from './session-manager.js';
import type { Application } from 'express';

// Type for mock Request objects used in tests
type MockRequest = Partial<Request> & {
  body?: unknown;
  headers?: { authorization?: string };
  protocol?: string;
  // Simplified get method for tests - not fully type-compatible with Express but works for our needs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get?: any;
};

// Type for mock Response objects used in tests
type MockResponse = {
  json: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
};

// Interface for accessing private members in tests
interface TestableServer {
  // Private properties
  app: Application;
  sessionManager: SessionManager;
  currentSessionId: string | null;
  server: unknown; // McpServer from SDK

  // Private methods
  generateJWT(sessionId: string, audience: string): string;
  verifyJWT(token: string, audience: string): { sessionId: string } | null;
  getAudience(req: MockRequest): string;
  validateBearerToken(req: MockRequest): {
    valid: boolean;
    sessionId?: string;
    session?: SessionData;
    error?: string;
  };
  getToolsForRequest(): PaperlessTools;
  handleLogin(req: MockRequest, res: MockResponse): Promise<void>;
  handleVerify(req: MockRequest, res: MockResponse): void;
  handleMcpRequest(req: MockRequest, res: MockResponse): Promise<void>;
  handleListDocuments(params: unknown): Promise<{ content: Array<{ type: string; text: string }> }>;
  handleGetDocument(params: unknown): Promise<{ content: Array<{ type: string; text: string }> }>;
  handleGetDocumentContent(
    params: unknown
  ): Promise<{ content: Array<{ type: string; text: string }> }>;
  handleSearchTags(params: unknown): Promise<{ content: Array<{ type: string; text: string }> }>;
  handleSearchCorrespondents(
    params: unknown
  ): Promise<{ content: Array<{ type: string; text: string }> }>;
  handleSearchDocumentTypes(
    params: unknown
  ): Promise<{ content: Array<{ type: string; text: string }> }>;
  handleCheckConnection(): Promise<{ content: Array<{ type: string; text: string }> }>;
}

describe('PaperlessMCPServer', () => {
  let config: Config;
  let server: PaperlessMCPServer;
  let testableServer: TestableServer;

  beforeEach(() => {
    config = {
      PORT: 3001,
      HOST: 'localhost',
      JWT_SECRET: 'test-jwt-secret',
      API_TOKEN: undefined,
      LOG_LEVEL: 'none',
    };
    server = new PaperlessMCPServer(config);
    testableServer = server as unknown as TestableServer;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Health endpoint', () => {
    it('should return health status', async () => {
      const response = await request(testableServer.app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        version: '0.0.1',
      });
    });
  });

  describe('MCP info endpoint', () => {
    it('should return MCP server information', async () => {
      const response = await request(testableServer.app).get('/mcp');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        name: 'paperless-ai-ngx-mcp',
        version: '0.0.1',
        description: 'Model Context Protocol server for Paperless-ngx',
        authentication: 'Bearer token required',
        endpoints: {
          login: '/login',
          verify: '/verify',
          mcp: '/mcp (POST)',
        },
      });
    });
  });

  describe('Login endpoint', () => {
    it('should reject request without required fields', async () => {
      const response = await request(testableServer.app).post('/login').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request');
    });

    it('should reject request with invalid paperlessUrl', async () => {
      const response = await request(testableServer.app).post('/login').send({
        paperlessUrl: 'not-a-url',
        paperlessToken: 'test-token',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request');
    });

    it('should reject request without paperlessToken', async () => {
      const response = await request(testableServer.app).post('/login').send({
        paperlessUrl: 'https://paperless.example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request');
    });

    it('should reject request with empty paperlessToken', async () => {
      const response = await request(testableServer.app).post('/login').send({
        paperlessUrl: 'https://paperless.example.com',
        paperlessToken: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request');
    });

    it('should require API token when configured', async () => {
      const configWithToken = {
        ...config,
        API_TOKEN: 'required-mcp-token',
      };
      const serverWithToken = new PaperlessMCPServer(configWithToken);
      const testableServerWithToken = serverWithToken as unknown as TestableServer;

      const response = await request(testableServerWithToken.app).post('/login').send({
        paperlessUrl: 'https://paperless.example.com',
        paperlessToken: 'test-token',
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('API token required');
    });

    it('should reject invalid API token', async () => {
      const configWithToken = {
        ...config,
        API_TOKEN: 'correct-token',
      };
      const serverWithToken = new PaperlessMCPServer(configWithToken);
      const testableServerWithToken = serverWithToken as unknown as TestableServer;

      const response = await request(testableServerWithToken.app).post('/login').send({
        mcpToken: 'wrong-token',
        paperlessUrl: 'https://paperless.example.com',
        paperlessToken: 'test-token',
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid API token');
    });
  });

  describe('Verify endpoint', () => {
    it('should reject request without authorization header', async () => {
      const response = await request(testableServer.app).get('/verify');

      expect(response.status).toBe(401);
      expect(response.body.valid).toBe(false);
      expect(response.body.error).toBe('No Bearer token provided');
    });

    it('should reject request with invalid authorization header', async () => {
      const response = await request(testableServer.app)
        .get('/verify')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
      expect(response.body.valid).toBe(false);
    });

    it('should reject invalid JWT token', async () => {
      const response = await request(testableServer.app)
        .get('/verify')
        .set('Authorization', 'Bearer invalid-jwt-token');

      expect(response.status).toBe(401);
      expect(response.body.valid).toBe(false);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('should verify valid token and return session info', async () => {
      // Create a session
      const sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );

      // Generate JWT with the audience that will match the request
      // Supertest automatically sets a host header, so we need to match it
      // We'll set the host header explicitly to match our audience
      const audience = `http://localhost:3001`;
      const token = testableServer.generateJWT(sessionId, audience);

      const response = await request(testableServer.app)
        .get('/verify')
        .set('Host', 'localhost:3001')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
      expect(response.body.sessionId).toBe(sessionId);
      expect(response.body.expiresAt).toBeDefined();
    });

    it('should reject expired session', async () => {
      // Create a session
      const sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );

      // Generate JWT with the audience that matches the request
      const audience = `http://localhost:3001`;
      const token = testableServer.generateJWT(sessionId, audience);

      // Delete the session to simulate expiration
      testableServer.sessionManager.deleteSession(sessionId);

      const response = await request(testableServer.app)
        .get('/verify')
        .set('Host', 'localhost:3001')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.valid).toBe(false);
      expect(response.body.error).toBe('Session not found or expired');
    });
  });

  describe('MCP endpoint authentication', () => {
    it('should reject requests without authorization header', async () => {
      const response = await request(testableServer.app)
        .post('/mcp')
        .send({ method: 'tools/list' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should reject requests with invalid Bearer token format', async () => {
      const response = await request(testableServer.app)
        .post('/mcp')
        .set('Authorization', 'Basic token')
        .send({ method: 'tools/list' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should reject requests with invalid JWT', async () => {
      const response = await request(testableServer.app)
        .post('/mcp')
        .set('Authorization', 'Bearer invalid-token')
        .send({ method: 'tools/list' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(response.body.message).toBe('The provided token is invalid or has expired');
    });

    it('should reject requests when session is not found or expired', async () => {
      // Create a session and then delete it
      const sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );

      const fixedHost = 'localhost:3001';
      const audience = `http://${fixedHost}`;
      const token = testableServer.generateJWT(sessionId, audience);

      // Delete the session to simulate expiration
      testableServer.sessionManager.deleteSession(sessionId);

      const response = await request(testableServer.app)
        .post('/mcp')
        .set('Host', fixedHost)
        .set('Authorization', `Bearer ${token}`)
        .send({ method: 'tools/list' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(response.body.message).toBe('Session not found or expired. Please login again.');
    });

    it('should accept requests with valid JWT and call middleware successfully', async () => {
      // Create a session
      const sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );

      // Set a fixed host that we control
      const fixedHost = 'localhost:3001';
      const audience = `http://${fixedHost}`;
      const token = testableServer.generateJWT(sessionId, audience);

      const response = await request(testableServer.app)
        .post('/mcp')
        .set('Host', fixedHost) // Set the Host header to match our audience
        .set('Authorization', `Bearer ${token}`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'test-client',
              version: '1.0.0',
            },
          },
        });

      // Should not be 401 - authentication was successful
      // The actual MCP request might fail for other reasons, but auth should pass
      expect(response.status).not.toBe(401);

      // If we get a different error, that's fine - we just want to verify auth worked
      if (response.status !== 200) {
        expect(response.body.error).not.toBe('Authentication required');
        expect(response.body.error).not.toBe('Invalid token');
      }
    });

    it('should accept requests with valid JWT and no method in body', async () => {
      // Create a session
      const sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );

      // Set a fixed host that we control
      const fixedHost = 'localhost:3001';
      const audience = `http://${fixedHost}`;
      const token = testableServer.generateJWT(sessionId, audience);

      const response = await request(testableServer.app)
        .post('/mcp')
        .set('Host', fixedHost)
        .set('Authorization', `Bearer ${token}`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          // No method property - this tests the else branch of req.body?.method
        });

      // Should not be 401 - authentication was successful
      expect(response.status).not.toBe(401);
    });
  });

  describe('CORS configuration', () => {
    it('should include CORS headers in response', async () => {
      const response = await request(testableServer.app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should handle OPTIONS preflight request', async () => {
      const response = await request(testableServer.app)
        .options('/mcp')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-headers']).toContain('Authorization');
    });
  });

  describe('JWT generation and verification', () => {
    it('should generate valid JWT token', () => {
      const sessionId = 'test-session-id';
      const audience = 'http://localhost:3001';
      const token = testableServer.generateJWT(sessionId, audience);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const decoded = testableServer.verifyJWT(token, audience);
      expect(decoded).toBeTruthy();
      expect(decoded!.sessionId).toBe(sessionId);
    });

    it('should reject JWT with wrong audience', () => {
      const sessionId = 'test-session-id';
      const audience1 = 'http://localhost:3001';
      const audience2 = 'http://localhost:3002';
      const token = testableServer.generateJWT(sessionId, audience1);

      const decoded = testableServer.verifyJWT(token, audience2);
      expect(decoded).toBeNull();
    });

    it('should reject JWT with wrong secret', () => {
      const sessionId = 'test-session-id';
      const audience = 'http://localhost:3001';
      const token = testableServer.generateJWT(sessionId, audience);

      // Create new server with different secret
      const newConfig = { ...config, JWT_SECRET: 'different-secret' };
      const newServer = new PaperlessMCPServer(newConfig);
      const testableNewServer = newServer as unknown as TestableServer;

      const decoded = testableNewServer.verifyJWT(token, audience);
      expect(decoded).toBeNull();
    });

    it('should reject malformed JWT', () => {
      const audience = 'http://localhost:3001';
      const decoded = testableServer.verifyJWT('not-a-jwt-token', audience);

      expect(decoded).toBeNull();
    });
  });

  describe('Audience extraction', () => {
    it('should extract audience from request with host header', () => {
      const mockReq = {
        protocol: 'http',
        get: (header: string) => {
          if (header === 'host') return 'example.com:3001';
          return undefined;
        },
      } as MockRequest;

      const audience = testableServer.getAudience(mockReq);

      expect(audience).toBe('http://example.com:3001');
    });

    it('should use config values when host header is missing', () => {
      const mockReq = {
        protocol: 'http',
        get: () => undefined,
      } as MockRequest;

      const audience = testableServer.getAudience(mockReq);

      expect(audience).toBe('http://localhost:3001');
    });

    it('should handle https protocol', () => {
      const mockReq = {
        protocol: 'https',
        get: (header: string) => {
          if (header === 'host') return 'secure.example.com';
          return undefined;
        },
      } as MockRequest;

      const audience = testableServer.getAudience(mockReq);

      expect(audience).toBe('https://secure.example.com');
    });
  });

  describe('Session cleanup', () => {
    it('should start session cleanup interval', () => {
      vi.useFakeTimers();

      // Create new server after fake timers are enabled
      const testConfig: Config = {
        PORT: 3001,
        HOST: 'localhost',
        JWT_SECRET: 'test-jwt-secret',
        API_TOKEN: undefined,
        LOG_LEVEL: 'none',
      };
      const testServer = new PaperlessMCPServer(testConfig);
      const testableTestServer = testServer as unknown as TestableServer;

      const cleanupSpy = vi.spyOn(testableTestServer.sessionManager, 'cleanupExpiredSessions');

      // Fast-forward 1 hour
      vi.advanceTimersByTime(60 * 60 * 1000);

      expect(cleanupSpy).toHaveBeenCalledTimes(1);

      // Fast-forward another hour
      vi.advanceTimersByTime(60 * 60 * 1000);

      expect(cleanupSpy).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });

  describe('Request logging', () => {
    it('should log non-health endpoint requests', async () => {
      // Create server with info level for this test
      const loggingConfig = { ...config, LOG_LEVEL: 'info' as const };
      const loggingServer = new PaperlessMCPServer(loggingConfig);
      const testableLoggingServer = loggingServer as unknown as TestableServer;
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await request(testableLoggingServer.app).get('/mcp');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('GET /mcp'));

      consoleSpy.mockRestore();
    });

    it('should not log health endpoint requests', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await request(testableServer.app).get('/health');

      const healthLogs = consoleSpy.mock.calls.filter((call) =>
        call.some((arg) => String(arg).includes('GET /health'))
      );

      expect(healthLogs).toHaveLength(0);

      consoleSpy.mockRestore();
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON in request body', async () => {
      const response = await request(testableServer.app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    it('should return proper error format', async () => {
      const response = await request(testableServer.app).post('/login').send({
        paperlessUrl: 'invalid-url',
      });

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('getToolsForRequest', () => {
    it('should throw error when no session ID', () => {
      testableServer.currentSessionId = null;

      expect(() => {
        testableServer.getToolsForRequest();
      }).toThrow('No session ID found');
    });

    it('should throw error when session not found', () => {
      testableServer.currentSessionId = 'non-existent-session';

      expect(() => {
        testableServer.getToolsForRequest();
      }).toThrow('Session not found or expired');
    });

    it('should return PaperlessTools when session exists', () => {
      // Create a session
      const sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );
      testableServer.currentSessionId = sessionId;

      const tools = testableServer.getToolsForRequest();

      expect(tools).toBeDefined();
      expect(tools.constructor.name).toBe('PaperlessTools');
    });
  });

  describe('Tool handlers', () => {
    let sessionId: string;
    let mockClient: {
      getDocuments: ReturnType<typeof vi.fn>;
      getDocument: ReturnType<typeof vi.fn>;
      getDocumentContent: ReturnType<typeof vi.fn>;
      searchTags: ReturnType<typeof vi.fn>;
      searchCorrespondents: ReturnType<typeof vi.fn>;
      searchDocumentTypes: ReturnType<typeof vi.fn>;
      checkConnection: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      // Create a mock client
      mockClient = {
        getDocuments: vi.fn().mockResolvedValue({
          count: 1,
          results: [{ id: 1, title: 'Test Doc' }],
        }),
        getDocument: vi.fn().mockResolvedValue({
          id: 1,
          title: 'Test Doc',
        }),
        getDocumentContent: vi.fn().mockResolvedValue('Test content'),
        searchTags: vi
          .fn()
          .mockResolvedValue([
            { id: 1, name: 'Test Tag', slug: 'test-tag', color: '#000000', document_count: 5 },
          ]),
        searchCorrespondents: vi
          .fn()
          .mockResolvedValue([
            { id: 1, name: 'Test Correspondent', slug: 'test-correspondent', document_count: 3 },
          ]),
        searchDocumentTypes: vi
          .fn()
          .mockResolvedValue([{ id: 1, name: 'Test Type', slug: 'test-type', document_count: 2 }]),
        checkConnection: vi.fn().mockResolvedValue(true),
      };

      // Create a session with the mock client
      sessionId = testableServer.sessionManager.createSession(
        'https://paperless.example.com',
        'test-token'
      );

      // Replace the client in the session with our mock
      const session = testableServer.sessionManager.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).client = mockClient;

      testableServer.currentSessionId = sessionId;
    });

    afterEach(() => {
      testableServer.currentSessionId = null;
    });

    describe('handleListDocuments', () => {
      it('should call listDocuments and return formatted result', async () => {
        const result = await testableServer.handleListDocuments({
          page: 1,
          page_size: 10,
        });

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"count"');
        expect(mockClient.getDocuments).toHaveBeenCalledWith({
          page: 1,
          page_size: 10,
        });
      });

      it('should throw when session not found', async () => {
        testableServer.currentSessionId = 'invalid-session';

        await expect(testableServer.handleListDocuments({})).rejects.toThrow(
          'Session not found or expired'
        );
      });
    });

    describe('handleGetDocument', () => {
      it('should call getDocument and return formatted result', async () => {
        const result = await testableServer.handleGetDocument({ id: 1 });

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"id"');
        expect(mockClient.getDocument).toHaveBeenCalledWith(1);
      });
    });

    describe('handleGetDocumentContent', () => {
      it('should call getDocumentContent and return formatted result', async () => {
        const result = await testableServer.handleGetDocumentContent({ id: 1 });

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"content"');
        expect(mockClient.getDocumentContent).toHaveBeenCalledWith(1);
      });
    });

    describe('handleSearchTags', () => {
      it('should call searchTags and return formatted result', async () => {
        const result = await testableServer.handleSearchTags({ query: 'test' });

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"tags"');
        expect(mockClient.searchTags).toHaveBeenCalledWith('test');
      });
    });

    describe('handleSearchCorrespondents', () => {
      it('should call searchCorrespondents and return formatted result', async () => {
        const result = await testableServer.handleSearchCorrespondents({
          query: 'test',
        });

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"correspondents"');
        expect(mockClient.searchCorrespondents).toHaveBeenCalledWith('test');
      });
    });

    describe('handleSearchDocumentTypes', () => {
      it('should call searchDocumentTypes and return formatted result', async () => {
        const result = await testableServer.handleSearchDocumentTypes({
          query: 'test',
        });

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"document_types"');
        expect(mockClient.searchDocumentTypes).toHaveBeenCalledWith('test');
      });
    });

    describe('handleCheckConnection', () => {
      it('should call checkConnection and return formatted result', async () => {
        const result = await testableServer.handleCheckConnection();

        expect(result).toBeDefined();
        expect(result.content).toHaveLength(1);
        expect(result.content[0]!.type).toBe('text');
        expect(result.content[0]!.text).toContain('"connected"');
        expect(mockClient.checkConnection).toHaveBeenCalled();
      });
    });
  });

  describe('HTTP endpoint handlers', () => {
    // Helper functions for creating mock request/response objects
    const createMockRequest = (
      body: unknown = {},
      headers: Record<string, string> = {}
    ): MockRequest => {
      return {
        body,
        headers,
        protocol: 'http',
        get: (header: string) => {
          if (header === 'host') return 'localhost:3001';
          return headers[header];
        },
      } as MockRequest;
    };

    const createMockResponse = (): MockResponse => {
      const res = {
        json: vi.fn(),
        status: vi.fn(),
      };
      res.status.mockReturnValue(res);
      return res;
    };

    describe('handleLogin', () => {
      it('should successfully login with valid credentials', async () => {
        const mockReq = createMockRequest({
          paperlessUrl: 'https://paperless.example.com',
          paperlessToken: 'valid-token',
        });
        const mockRes = createMockResponse();

        // Mock the PaperlessTools.checkConnection to return success
        const checkConnectionSpy = vi
          .spyOn(PaperlessTools.prototype, 'checkConnection')
          .mockResolvedValue({ connected: true });

        await (
          server as unknown as {
            handleLogin: (req: MockRequest, res: MockResponse) => Promise<void>;
          }
        ).handleLogin(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            token: expect.any(String),
            expiresIn: 86400,
          })
        );

        checkConnectionSpy.mockRestore();
      });

      it('should reject login with invalid request body', async () => {
        const mockReq = createMockRequest({
          paperlessUrl: 'not-a-url',
        });
        const mockRes = createMockResponse();

        await (
          server as unknown as {
            handleLogin: (req: MockRequest, res: MockResponse) => Promise<void>;
          }
        ).handleLogin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Invalid request',
          })
        );
      });

      it('should reject login when API token is required but not provided', async () => {
        const configWithToken = {
          ...config,
          API_TOKEN: 'required-token',
        };
        const serverWithToken = new PaperlessMCPServer(configWithToken);

        const mockReq = createMockRequest({
          paperlessUrl: 'https://paperless.example.com',
          paperlessToken: 'valid-token',
        });
        const mockRes = createMockResponse();

        await (
          serverWithToken as unknown as {
            handleLogin: (req: MockRequest, res: MockResponse) => Promise<void>;
          }
        ).handleLogin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'API token required',
          })
        );
      });

      it('should reject login with invalid API token', async () => {
        const configWithToken = {
          ...config,
          API_TOKEN: 'correct-token',
        };
        const serverWithToken = new PaperlessMCPServer(configWithToken);

        const mockReq = createMockRequest({
          mcpToken: 'wrong-token',
          paperlessUrl: 'https://paperless.example.com',
          paperlessToken: 'valid-token',
        });
        const mockRes = createMockResponse();

        await (
          serverWithToken as unknown as {
            handleLogin: (req: MockRequest, res: MockResponse) => Promise<void>;
          }
        ).handleLogin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Invalid API token',
          })
        );
      });

      it('should successfully login with valid API token', async () => {
        const configWithToken = {
          ...config,
          API_TOKEN: 'correct-token',
        };
        const serverWithToken = new PaperlessMCPServer(configWithToken);

        const mockReq = createMockRequest({
          mcpToken: 'correct-token',
          paperlessUrl: 'https://paperless.example.com',
          paperlessToken: 'valid-token',
        });
        const mockRes = createMockResponse();

        // Mock the PaperlessTools.checkConnection to return success
        const checkConnectionSpy = vi
          .spyOn(PaperlessTools.prototype, 'checkConnection')
          .mockResolvedValue({ connected: true });

        await (
          serverWithToken as unknown as {
            handleLogin: (req: MockRequest, res: MockResponse) => Promise<void>;
          }
        ).handleLogin(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            token: expect.any(String),
            expiresIn: 86400,
          })
        );

        checkConnectionSpy.mockRestore();
      });

      it('should handle connection error when checkConnection throws', async () => {
        const mockReq = createMockRequest({
          paperlessUrl: 'https://paperless.example.com',
          paperlessToken: 'valid-token',
        });
        const mockRes = createMockResponse();

        // Mock the PaperlessTools.checkConnection to throw an error
        const checkConnectionSpy = vi
          .spyOn(PaperlessTools.prototype, 'checkConnection')
          .mockRejectedValue(new Error('Network timeout'));

        await testableServer.handleLogin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Connection failed',
            message: 'Network timeout',
          })
        );

        checkConnectionSpy.mockRestore();
      });

      it('should reject login with invalid Paperless credentials', async () => {
        const mockReq = createMockRequest({
          paperlessUrl: 'https://paperless.example.com',
          paperlessToken: 'invalid-token',
        });
        const mockRes = createMockResponse();

        // Mock the PaperlessTools.checkConnection to return connection failed
        const checkConnectionSpy = vi
          .spyOn(PaperlessTools.prototype, 'checkConnection')
          .mockResolvedValue({ connected: false });

        await testableServer.handleLogin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Invalid Paperless credentials',
            message: 'Could not connect to Paperless-ngx with provided credentials',
          })
        );

        checkConnectionSpy.mockRestore();
      });
    });
  });
});
