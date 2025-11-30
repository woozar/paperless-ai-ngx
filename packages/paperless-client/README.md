# @repo/paperless-client

TypeScript client library for the Paperless-ngx REST API.

## Features

- ✅ Type-safe API client with full TypeScript support
- ✅ Comprehensive error handling with custom error types
- ✅ Support for documents, tags, correspondents, and document types
- ✅ Built-in search functionality
- ✅ Connection health checks

## Installation

This is an internal workspace package. Add it to your package.json:

```json
{
  "dependencies": {
    "@repo/paperless-client": "workspace:*"
  }
}
```

## Usage

```typescript
import { PaperlessClient } from '@repo/paperless-client';

const client = new PaperlessClient({
  baseUrl: 'https://paperless.example.com',
  token: 'your-api-token',
});

// Get documents with filtering
const documents = await client.getDocuments({
  page: 1,
  page_size: 25,
  search: 'invoice',
  tags__id__in: [1, 2, 3],
  correspondent__id: 5,
});

// Get single document
const document = await client.getDocument(123);

// Get document text content
const content = await client.getDocumentContent(123);

// Update document metadata
const updated = await client.updateDocument(123, {
  title: 'New Title',
  tags: [1, 2, 3],
});

// Search tags
const tags = await client.searchTags('invoice');

// Create new tag
const newTag = await client.createTag('Important');

// Search correspondents
const correspondents = await client.searchCorrespondents('Company');

// Create correspondent
const newCorrespondent = await client.createCorrespondent('ACME Corp');

// Search document types
const docTypes = await client.searchDocumentTypes('receipt');

// Check connection
const isConnected = await client.checkConnection();
```

## API Coverage

### Documents

- ✅ `GET /api/documents/` - List and filter documents
- ✅ `GET /api/documents/{id}/` - Get document details
- ✅ `GET /api/documents/{id}/preview/` - Get document text content
- ✅ `PATCH /api/documents/{id}/` - Update document metadata
- ❌ `POST /api/documents/post_document/` - Upload document (not implemented)
- ❌ `DELETE /api/documents/{id}/` - Delete document (not implemented)
- ❌ `POST /api/documents/bulk_edit/` - Bulk operations (not implemented)

### Tags

- ✅ `GET /api/tags/` - List all tags
- ✅ `POST /api/tags/` - Create tag
- ✅ Client-side search by name/slug
- ❌ `PATCH /api/tags/{id}/` - Update tag (not implemented)
- ❌ `DELETE /api/tags/{id}/` - Delete tag (not implemented)

### Correspondents

- ✅ `GET /api/correspondents/` - List all correspondents
- ✅ `POST /api/correspondents/` - Create correspondent
- ✅ Client-side search by name/slug
- ❌ `PATCH /api/correspondents/{id}/` - Update correspondent (not implemented)
- ❌ `DELETE /api/correspondents/{id}/` - Delete correspondent (not implemented)

### Document Types

- ✅ `GET /api/document_types/` - List all document types
- ✅ Client-side search by name/slug
- ❌ `POST /api/document_types/` - Create document type (not implemented)
- ❌ `PATCH /api/document_types/{id}/` - Update document type (not implemented)
- ❌ `DELETE /api/document_types/{id}/` - Delete document type (not implemented)

### Not Implemented

- ❌ Storage paths (`/api/storage_paths/`)
- ❌ Custom fields (`/api/custom_fields/`)
- ❌ Tasks monitoring (`/api/tasks/`)
- ❌ Autocomplete search (`/api/search/autocomplete/`)
- ❌ UI settings (`/api/ui_settings/`)
- ❌ Mail accounts/rules
- ❌ Workflows
- ❌ Groups and permissions

## Error Handling

The client throws `PaperlessApiError` for API errors:

```typescript
import { PaperlessApiError } from '@repo/paperless-client';

try {
  const document = await client.getDocument(999);
} catch (error) {
  if (error instanceof PaperlessApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  }
}
```

## Types

The client exports all Paperless-ngx types from `@repo/types`:

- `PaperlessDocument` - Document with metadata
- `PaperlessTag` - Tag with matching rules
- `PaperlessCorrespondent` - Correspondent with matching rules
- `PaperlessDocumentType` - Document type with matching rules
- `PaperlessPaginatedResponse<T>` - Paginated API response

### Type Completeness

The current types cover the most commonly used fields but may be missing some optional fields returned by the Paperless-ngx API:

**Missing optional fields (examples):**

- `notes` (string) - Document notes
- `custom_fields` (array) - Custom field values
- `owner` (number) - Document owner ID
- `user_can_change` (boolean) - Permission flag
- `permissions` (object) - Detailed permissions
- Various metadata timestamps

These fields can be accessed via index signature but are not typed.

## Authentication

The client uses token-based authentication. Get your API token from Paperless-ngx:

1. Log into Paperless-ngx
2. Go to Settings → API Tokens
3. Create a new token
4. Use the token in the client configuration

## Roadmap

Future additions could include:

- [ ] Document upload functionality
- [ ] Delete operations for all resources
- [ ] Bulk edit operations
- [ ] Storage paths support
- [ ] Custom fields support
- [ ] Task monitoring
- [ ] Server-side autocomplete search
- [ ] Complete type definitions with all optional fields
- [ ] Pagination helpers
- [ ] Retry logic and request queuing
- [ ] Rate limiting support

## References

- [Paperless-ngx API Documentation](https://docs.paperless-ngx.com/api/)
- [Paperless-ngx GitHub](https://github.com/paperless-ngx/paperless-ngx)
