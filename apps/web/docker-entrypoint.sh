#!/bin/sh
set -e

echo "Running database migrations..."

# Find prisma in pnpm store and run migrations from database package directory
PRISMA_BIN="/app/node_modules/.pnpm/node_modules/.bin/prisma"
if [ -x "$PRISMA_BIN" ]; then
  cd /app/packages/database
  "$PRISMA_BIN" migrate deploy --config=./prisma.config.ts
  cd /app
else
  echo "Warning: Prisma CLI not found, skipping migrations"
fi

echo "Starting Next.js server..."
exec node apps/web/server.js
