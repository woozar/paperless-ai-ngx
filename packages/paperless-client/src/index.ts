import type {
  PaperlessDocument,
  PaperlessTag,
  PaperlessCorrespondent,
  PaperlessDocumentType,
  PaperlessPaginatedResponse,
} from '@repo/types';

export interface PaperlessClientConfig {
  baseUrl: string;
  token: string;
}

export class PaperlessClient {
  private baseUrl: string;
  private token: string;

  constructor(config: PaperlessClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Token ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new PaperlessApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return response.json() as Promise<T>;
  }

  // Documents
  async getDocuments(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    tags__id__in?: number[];
    correspondent__id?: number;
    document_type__id?: number;
  }): Promise<PaperlessPaginatedResponse<PaperlessDocument>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.tags__id__in) searchParams.set('tags__id__in', params.tags__id__in.join(','));
    if (params?.correspondent__id)
      searchParams.set('correspondent__id', String(params.correspondent__id));
    if (params?.document_type__id)
      searchParams.set('document_type__id', String(params.document_type__id));

    const query = searchParams.toString();
    return this.fetch<PaperlessPaginatedResponse<PaperlessDocument>>(
      `/documents/${query ? `?${query}` : ''}`
    );
  }

  async getDocument(id: number): Promise<PaperlessDocument> {
    return this.fetch<PaperlessDocument>(`/documents/${id}/`);
  }

  async getDocumentContent(id: number): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/preview/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new PaperlessApiError(
        `Failed to get document content: ${response.status}`,
        response.status
      );
    }

    return response.text();
  }

  async getDocumentPreview(id: number): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/preview/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new PaperlessApiError(
        `Failed to get document preview: ${response.status}`,
        response.status
      );
    }

    return response;
  }

  async updateDocument(
    id: number,
    data: Partial<Pick<PaperlessDocument, 'title' | 'correspondent' | 'document_type' | 'tags'>>
  ): Promise<PaperlessDocument> {
    return this.fetch<PaperlessDocument>(`/documents/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Tags
  async getTags(): Promise<PaperlessPaginatedResponse<PaperlessTag>> {
    return this.fetch<PaperlessPaginatedResponse<PaperlessTag>>('/tags/?page_size=9999');
  }

  async searchTags(query: string): Promise<PaperlessTag[]> {
    const response = await this.getTags();
    const lowercaseQuery = query.toLowerCase();
    return response.results.filter(
      (tag) =>
        tag.name.toLowerCase().includes(lowercaseQuery) ||
        tag.slug.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createTag(name: string): Promise<PaperlessTag> {
    return this.fetch<PaperlessTag>('/tags/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Correspondents
  async getCorrespondents(): Promise<PaperlessPaginatedResponse<PaperlessCorrespondent>> {
    return this.fetch<PaperlessPaginatedResponse<PaperlessCorrespondent>>(
      '/correspondents/?page_size=9999'
    );
  }

  async searchCorrespondents(query: string): Promise<PaperlessCorrespondent[]> {
    const response = await this.getCorrespondents();
    const lowercaseQuery = query.toLowerCase();
    return response.results.filter(
      (correspondent) =>
        correspondent.name.toLowerCase().includes(lowercaseQuery) ||
        correspondent.slug.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createCorrespondent(name: string): Promise<PaperlessCorrespondent> {
    return this.fetch<PaperlessCorrespondent>('/correspondents/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Document Types
  async getDocumentTypes(): Promise<PaperlessPaginatedResponse<PaperlessDocumentType>> {
    return this.fetch<PaperlessPaginatedResponse<PaperlessDocumentType>>(
      '/document_types/?page_size=9999'
    );
  }

  async searchDocumentTypes(query: string): Promise<PaperlessDocumentType[]> {
    const response = await this.getDocumentTypes();
    const lowercaseQuery = query.toLowerCase();
    return response.results.filter(
      (docType) =>
        docType.name.toLowerCase().includes(lowercaseQuery) ||
        docType.slug.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Health Check
  async checkConnection(): Promise<boolean> {
    try {
      await this.fetch('/tags/?page_size=1');
      return true;
    } catch {
      return false;
    }
  }
}

export class PaperlessApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'PaperlessApiError';
  }
}

export * from '@repo/types';
