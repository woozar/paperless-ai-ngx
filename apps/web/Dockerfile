# syntax=docker/dockerfile:1

# ============================================
# Base stage
# ============================================
FROM node:22-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# ============================================
# Prune stage - Create optimized monorepo subset
# ============================================
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@^2 prune web --docker

# ============================================
# Dependencies stage - Install from pruned lockfile
# ============================================
FROM base AS deps
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# ============================================
# Builder stage
# ============================================
FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .

# Generate & Build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm generate
RUN pnpm --filter web build

# ============================================
# Runner stage
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy Prisma for migrations
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
# Create package.json for the runner to enable ESM imports in prisma config
RUN echo '{"type":"module"}' > /app/packages/database/package.json

# Copy entrypoint
COPY --chmod=755 apps/web/docker-entrypoint.sh /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
