# Paperless AI NGX

A web application for managing AI-powered document processing with [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx).

## Release Notes

### v1.5.0

- Login page translations (DE/EN hero section)
- DRY route wrapper refactoring
- UI design improvements with refined styling and animations

### v1.4.0

- Settings system with auto-generated UI
- Shared form components

### v1.3.0

- Delete warning with document count for Paperless instances

### v1.2.0

- Admin pages for AI providers, AI bots, and Paperless instances
- Document import from Paperless instances

### v1.1.0

- API routes for PaperlessInstance, AiProvider, and AiBot
- Encryption utilities
- Renamed AiAccess → AiProvider

### v1.0.2

- MCP server with 100% test coverage
- Comprehensive README for paperless-client package
- Favicon

### v1.0.1

- Initial application
- Unit test coverage
- Username validation
- Login/logout flow

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/paperless-ai-ngx.git
cd paperless-ai-ngx

# Install dependencies
pnpm install

# Generate database client and API types
pnpm generate
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start only the web app
pnpm dev --filter web
```

### Build

```bash
# Build all apps and packages
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

This is a Turborepo monorepo with the following structure:

### Apps

- `apps/web` - Next.js web application
- `apps/mcp-server` - MCP (Model Context Protocol) server

### Packages

- `packages/api-client` - Generated TypeScript API client
- `packages/database` - Prisma database client
- `packages/ui` - Shared React component library
- `packages/eslint-config` - ESLint configurations
- `packages/typescript-config` - TypeScript configurations

## Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | Start development servers              |
| `pnpm build`         | Build all apps and packages            |
| `pnpm test`          | Run tests                              |
| `pnpm test:coverage` | Run tests with coverage                |
| `pnpm lint`          | Lint all packages                      |
| `pnpm format`        | Format code with Prettier              |
| `pnpm generate`      | Generate database client and API types |
