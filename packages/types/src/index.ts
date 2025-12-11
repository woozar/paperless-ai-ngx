// Paperless-ngx API Types

export interface PaperlessDocument {
  id: number;
  title: string;
  content: string;
  correspondent: number | null;
  document_type: number | null;
  tags: number[];
  created: string;
  modified: string;
  added: string;
  archive_serial_number: string | null;
  original_file_name: string;
  archived_file_name: string | null;
}

export interface PaperlessTag {
  id: number;
  name: string;
  slug: string;
  color: string;
  match: string;
  matching_algorithm: number;
  is_insensitive: boolean;
  is_inbox_tag: boolean;
  document_count: number;
}

export interface PaperlessCorrespondent {
  id: number;
  name: string;
  slug: string;
  match: string;
  matching_algorithm: number;
  is_insensitive: boolean;
  document_count: number;
  last_correspondence: string | null;
}

export interface PaperlessDocumentType {
  id: number;
  name: string;
  slug: string;
  match: string;
  matching_algorithm: number;
  is_insensitive: boolean;
  document_count: number;
}

export interface PaperlessPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// AI Analysis Types

export interface DocumentAnalysis {
  title: string;
  correspondent: string | null;
  documentType: string | null;
  tags: string[];
  date: string | null;
  language: string | null;
  summary?: string;
}

// App Configuration Types

export interface AppConfig {
  paperlessUrl: string;
  paperlessToken: string;
  aiProvider: 'openai' | 'google' | 'anthropic';
  aiApiKey: string;
  aiModel: string;
  scanInterval: string;
  autoProcess: boolean;
}

// Processing History Types

export interface ProcessingHistoryEntry {
  id: string;
  documentId: number;
  documentTitle: string;
  processedAt: Date;
  aiProvider: string;
  changes: DocumentChanges;
  inputTokens: number;
  outputTokens: number;
}

export interface DocumentChanges {
  title?: { from: string | null; to: string };
  correspondent?: { from: string | null; to: string };
  documentType?: { from: string | null; to: string };
  tags?: { added: string[]; removed: string[] };
}
