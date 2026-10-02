#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is missing. Set it to the Compose service, for example postgresql://stallmb:password@postgres:5432/stallmb?schema=public"
  exit 1
fi

# A copied .env uses localhost, which is the app container itself.
case "$DATABASE_URL" in
  *@localhost:*|*@localhost/*|*@127.0.0.1:*|*@127.0.0.1/*)
    echo "DATABASE_URL host is localhost. Using the postgres service instead."
    DATABASE_URL=$(printf '%s' "$DATABASE_URL" | sed -E 's/@localhost(:[0-9]+)?/@postgres:5432/; s/@127\.0\.0\.1(:[0-9]+)?/@postgres:5432/')
    export DATABASE_URL
    ;;
esac

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting Next.js..."
exec npm start
