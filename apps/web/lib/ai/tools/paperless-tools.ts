import { tool } from 'ai';
import { z } from 'zod';
import type { PaperlessClient } from '@repo/paperless-client';

// Zod schema for tool input (AI SDK v5 uses inputSchema with native Zod)
const queryInputSchema = z.object({
  query: z.string().optional().describe('Optional search term to filter results'),
});

/**
 * Creates AI tools that allow the model to query Paperless metadata.
 * These tools enable the AI to search for existing tags, correspondents,
 * and document types to make informed suggestions.
 */
export function createPaperlessTools(paperlessClient: PaperlessClient) {
  return {
    searchTags: tool({
      description:
        'Search for tags in Paperless. Use without query to get all tags. Always call this to see available tags before making suggestions.',
      inputSchema: queryInputSchema,
      execute: async ({ query }) => {
        const response = await paperlessClient.getTags();
        const tags = response.results;
        const filtered = query
          ? tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
          : tags;
        return filtered.map((t) => ({ id: t.id, name: t.name }));
      },
    }),

    searchCorrespondents: tool({
      description:
        'Search for correspondents (senders/recipients) in Paperless. Use without query to get all. Always call this to see available correspondents before making suggestions.',
      inputSchema: queryInputSchema,
      execute: async ({ query }) => {
        const response = await paperlessClient.getCorrespondents();
        const correspondents = response.results;
        const filtered = query
          ? correspondents.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
          : correspondents;
        return filtered.map((c) => ({ id: c.id, name: c.name }));
      },
    }),

    searchDocumentTypes: tool({
      description:
        'Search for document types in Paperless. Use without query to get all. Always call this to see available document types before making suggestions.',
      inputSchema: queryInputSchema,
      execute: async ({ query }) => {
        const response = await paperlessClient.getDocumentTypes();
        const types = response.results;
        const filtered = query
          ? types.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
          : types;
        return filtered.map((t) => ({ id: t.id, name: t.name }));
      },
    }),
  };
}

export type PaperlessTools = ReturnType<typeof createPaperlessTools>;
