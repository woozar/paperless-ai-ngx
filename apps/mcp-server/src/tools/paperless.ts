import { z } from 'zod';
import type { PaperlessClient } from '@repo/paperless-client';

// Tool Schemas
export const listDocumentsSchema = z.object({
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  tags: z.array(z.number().int()).optional(),
  correspondent_id: z.number().int().optional(),
  document_type_id: z.number().int().optional(),
});

export const getDocumentSchema = z.object({
  id: z.number().int().positive(),
});

export const getDocumentContentSchema = z.object({
  id: z.number().int().positive(),
});

export const searchTagsSchema = z.object({
  query: z.string().min(1),
});

export const searchCorrespondentsSchema = z.object({
  query: z.string().min(1),
});

export const searchDocumentTypesSchema = z.object({
  query: z.string().min(1),
});

// Tool Implementations
export class PaperlessTools {
  constructor(private client: PaperlessClient) {}

  async listDocuments(params: z.infer<typeof listDocumentsSchema>) {
    const response = await this.client.getDocuments({
      page: params.page,
      page_size: params.page_size,
      search: params.search,
      tags__id__in: params.tags,
      correspondent__id: params.correspondent_id,
      document_type__id: params.document_type_id,
    });

    return {
      count: response.count,
      next: response.next,
      previous: response.previous,
      documents: response.results.map((doc) => ({
        id: doc.id,
        title: doc.title,
        created: doc.created,
        modified: doc.modified,
        added: doc.added,
        correspondent: doc.correspondent,
        document_type: doc.document_type,
        tags: doc.tags,
        archive_serial_number: doc.archive_serial_number,
      })),
    };
  }

  async getDocument(params: z.infer<typeof getDocumentSchema>) {
    const doc = await this.client.getDocument(params.id);

    return {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      created: doc.created,
      modified: doc.modified,
      added: doc.added,
      correspondent: doc.correspondent,
      document_type: doc.document_type,
      tags: doc.tags,
      archive_serial_number: doc.archive_serial_number,
      original_file_name: doc.original_file_name,
    };
  }

  async getDocumentContent(params: z.infer<typeof getDocumentContentSchema>) {
    const content = await this.client.getDocumentContent(params.id);
    const doc = await this.client.getDocument(params.id);

    return {
      id: doc.id,
      title: doc.title,
      content: content,
    };
  }

  async searchTags(params: z.infer<typeof searchTagsSchema>) {
    const tags = await this.client.searchTags(params.query);

    return {
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
        document_count: tag.document_count,
      })),
    };
  }

  async searchCorrespondents(params: z.infer<typeof searchCorrespondentsSchema>) {
    const correspondents = await this.client.searchCorrespondents(params.query);

    return {
      correspondents: correspondents.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        document_count: c.document_count,
      })),
    };
  }

  async searchDocumentTypes(params: z.infer<typeof searchDocumentTypesSchema>) {
    const types = await this.client.searchDocumentTypes(params.query);

    return {
      document_types: types.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        document_count: t.document_count,
      })),
    };
  }

  async checkConnection() {
    const isConnected = await this.client.checkConnection();

    return {
      connected: isConnected,
    };
  }
}
