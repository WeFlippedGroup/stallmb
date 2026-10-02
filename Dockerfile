FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Only needed while generating the client. Runtime must come from Compose,
# otherwise the app tries to reach Postgres on its own localhost.
ARG DATABASE_URL="postgresql://stallmb:stallmb@localhost:5432/stallmb?schema=public"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

ENV DATABASE_URL=

RUN mkdir -p /app/public/uploads
COPY docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

ENTRYPOINT ["/app/docker/entrypoint.sh"]
