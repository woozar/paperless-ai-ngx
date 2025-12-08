# Paperless AI NGX

A web application for managing AI-powered document processing with [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx).

## Release Notes

### v1.9.0

- Deploy with a single `docker compose up` command

### v1.8.0

- Share AI bots, providers, and Paperless instances with other users
- Users with full access can reshare resources
- Deactivate users instead of deleting them, with option to restore

### v1.7.0

- New header navigation for easier access
- Switch between light, dark, and system theme

### v1.6.0

- Browse large lists with pagination
- Faster page loads

### v1.5.0

- German and English translations for login page
- Improved visual design

### v1.4.0

- Admins can configure application settings

### v1.3.0

- See how many documents will be affected before deleting a Paperless instance

### v1.2.0

- Manage AI providers, AI bots, and Paperless instances
- Import documents from Paperless instances

### v1.1.0

- Secure storage for API keys and tokens

### v1.0.0

- Initial release with user authentication and MCP server

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

### Docker

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

The Docker setup includes:

- **web**: Next.js application on port 3000
- **postgres**: PostgreSQL 17 database
- **mcp-server**: MCP server on port 3001

Environment variables are configured in `docker-compose.yml`. For production, update:

- `JWT_SECRET` - Secret for JWT tokens (min 32 characters)
- `ENCRYPTION_KEY` - Secret for API key encryption (min 32 characters)
- `ADMIN_INITIAL_PASSWORD` - Initial admin password

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
