#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PaperlessClient } from '@repo/paperless-client';

// Environment variables for configuration
const PAPERLESS_URL = process.env.PAPERLESS_URL || '';
const PAPERLESS_TOKEN = process.env.PAPERLESS_TOKEN || '';

let client: PaperlessClient | null = null;

function getClient(): PaperlessClient {
  if (!client) {
    if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
      throw new Error('PAPERLESS_URL and PAPERLESS_TOKEN environment variables are required');
    }
    client = new PaperlessClient({
      baseUrl: PAPERLESS_URL,
      token: PAPERLESS_TOKEN,
    });
  }
  return client;
}

// Tool schemas
const SearchTagsSchema = z.object({
  query: z.string().describe('Search query for tag names'),
});

const SearchCorrespondentsSchema = z.object({
  query: z.string().describe('Search query for correspondent names'),
});

const SearchDocumentsSchema = z.object({
  query: z.string().describe('Full-text search query'),
  tags: z.array(z.number()).optional().describe('Filter by tag IDs'),
  correspondent: z.number().optional().describe('Filter by correspondent ID'),
  limit: z.number().optional().default(10).describe('Maximum number of results'),
});

const GetDocumentSchema = z.object({
  id: z.number().describe('Document ID'),
});

// Create the MCP server
const server = new Server(
  {
    name: 'paperless-ngx',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_tags',
      description: 'Search for tags in Paperless-ngx by name',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for tag names',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'search_correspondents',
      description: 'Search for correspondents in Paperless-ngx by name',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for correspondent names',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'search_documents',
      description: 'Search for documents in Paperless-ngx',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Full-text search query',
          },
          tags: {
            type: 'array',
            items: { type: 'number' },
            description: 'Filter by tag IDs',
          },
          correspondent: {
            type: 'number',
            description: 'Filter by correspondent ID',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results (default: 10)',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_document',
      description: 'Get details of a specific document by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Document ID',
          },
        },
        required: ['id'],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const paperless = getClient();

    switch (name) {
      case 'search_tags': {
        const { query } = SearchTagsSchema.parse(args);
        const tags = await paperless.searchTags(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                tags.map((t) => ({
                  id: t.id,
                  name: t.name,
                  documentCount: t.document_count,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'search_correspondents': {
        const { query } = SearchCorrespondentsSchema.parse(args);
        const correspondents = await paperless.searchCorrespondents(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                correspondents.map((c) => ({
                  id: c.id,
                  name: c.name,
                  documentCount: c.document_count,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'search_documents': {
        const { query, tags, correspondent, limit } = SearchDocumentsSchema.parse(args);
        const result = await paperless.getDocuments({
          search: query,
          tags__id__in: tags,
          correspondent__id: correspondent,
          page_size: limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                result.results.map((d) => ({
                  id: d.id,
                  title: d.title,
                  correspondent: d.correspondent,
                  documentType: d.document_type,
                  tags: d.tags,
                  created: d.created,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_document': {
        const { id } = GetDocumentSchema.parse(args);
        const document = await paperless.getDocument(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(document, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Paperless-ngx MCP server running on stdio');
}

main().catch(console.error);
