# Paperless AI NGX - MCP Server

Model Context Protocol (MCP) server for Paperless AI NGX, providing AI assistants with access to Paperless-ngx documents via HTTP transport.

## Features

- **HTTP Transport**: Accessible via standard HTTP endpoints
- **HTTP Basic Auth**: Secure authentication using Paperless URL and API token
- **Session Management**: Credentials stored securely per session (24h lifetime)
- **Document Management**: List, search, and retrieve documents from Paperless-ngx
- **Metadata Search**: Search for tags, correspondents, and document types
- **Connection Testing**: Verify Paperless-ngx instance connectivity

## Available Tools

### `paperless_list_documents`

List documents with optional filtering.

**Parameters:**

- `page` (optional): Page number for pagination
- `page_size` (optional): Results per page (max 100)
- `search` (optional): Search query for title/content
- `tags` (optional): Array of tag IDs
- `correspondent_id` (optional): Filter by correspondent
- `document_type_id` (optional): Filter by document type

### `paperless_get_document`

Get detailed document information.

**Parameters:**

- `id` (required): Document ID

### `paperless_get_document_content`

Get full text content of a document.

**Parameters:**

- `id` (required): Document ID

### `paperless_search_tags`

Search for tags by name or slug.

**Parameters:**

- `query` (required): Search query

### `paperless_search_correspondents`

Search for correspondents by name or slug.

**Parameters:**

- `query` (required): Search query

### `paperless_search_document_types`

Search for document types by name or slug.

**Parameters:**

- `query` (required): Search query

### `paperless_check_connection`

Check connection to Paperless-ngx instance.

## Configuration

Create a `.env` file based on `.env.example`:

```bash
# MCP Server Configuration
MCP_PORT=3001
MCP_HOST=localhost
```

**Note:** Paperless-ngx credentials are NOT stored in environment variables. They are provided via HTTP Basic Auth when connecting to the server.

## Usage

### Development

```bash
pnpm --filter @repo/mcp-server dev
```

### Build

```bash
pnpm --filter @repo/mcp-server build
```

### Run

```bash
pnpm --filter @repo/mcp-server start
```

## Authentication

The MCP server uses **HTTP Basic Authentication** to securely handle Paperless-ngx credentials:

- **Username**: Your Paperless-ngx URL (e.g., `https://paperless.example.com`)
- **Password**: Your Paperless-ngx API token

When you first connect with valid credentials:

1. The server validates the connection to Paperless-ngx
2. Creates a session and returns a session ID in the `X-MCP-Session-ID` header
3. Stores your credentials securely in-memory for the session (24h lifetime)
4. All subsequent requests automatically use the session

## Integration with Claude Code

Add the MCP server to Claude Code with Basic Auth:

```bash
# Format: http://username:password@host:port/path
# Username = Paperless URL (URL-encoded)
# Password = Paperless API token
claude mcp add paperless-ai-ngx http://https%3A%2F%2Fpaperless.example.com:your-token-here@localhost:3001/mcp
```

Or test with curl:

```bash
curl -u "https://paperless.example.com:your-token-here" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  http://localhost:3001/mcp
```

## Architecture

The MCP server uses:

- **@modelcontextprotocol/sdk**: Official MCP SDK for TypeScript
- **StreamableHTTPServerTransport**: HTTP-based transport with SSE support
- **Express**: HTTP server framework
- **@repo/paperless-client**: Existing Paperless-ngx API client
- **Zod**: Runtime schema validation for tool parameters

## Endpoints

- `GET /health` - Health check endpoint
- `POST /mcp` - MCP protocol endpoint (HTTP/SSE)
