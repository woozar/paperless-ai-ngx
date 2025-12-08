# syntax=docker/dockerfile:1

# ============================================
# Base stage - Node.js with pnpm
# ============================================
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# ============================================
# Prune stage - Create optimized monorepo subset
# ============================================
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@^2 prune @repo/mcp-server --docker

# ============================================
# Dependencies stage - Install from pruned lockfile
# ============================================
FROM base AS deps
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# ============================================
# Builder stage - Build the application
# ============================================
FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .

# Build the MCP server (esbuild bundles all dependencies)
RUN pnpm --filter @repo/mcp-server build

# ============================================
# Runner stage - Production image
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 mcpserver

# Copy bundled application (single file with all dependencies)
COPY --from=builder /app/apps/mcp-server/dist/index.js ./index.js
COPY --from=builder /app/apps/mcp-server/package.json ./

USER mcpserver

EXPOSE 3001

ENV MCP_PORT=3001
ENV MCP_HOST="0.0.0.0"

CMD ["node", "index.js"]
