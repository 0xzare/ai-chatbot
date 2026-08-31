#!/bin/sh
set -e

echo "🚀 Running database migrations..."
pnpm db:generate
pnpm db:migrate

echo "🚀 Starting Next.js server..."

# این خط حتماً باید باشد!
exec "$@"
