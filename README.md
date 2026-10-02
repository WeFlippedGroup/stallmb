This is a [Next.js](https://nextjs.org) project for StallMB (Connemara-uppfödning).

## Getting Started

```bash
cp .env.example .env
# fyll i DATABASE_URL, ADMIN_EMAIL och ADMIN_PASSWORD

npm install
npx prisma migrate deploy
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Deploy med Docker Compose + Prisma

Projektet körs på egen server med Postgres (Prisma). Uppladdade bilder sparas på disk i `public/uploads` (en Docker-volym i Compose). Supabase och Vercel Analytics används inte längre. Befintliga bild-URL:er från Supabase fungerar fortfarande om data importeras med de adresserna.

Admin loggar in med `ADMIN_EMAIL` och `ADMIN_PASSWORD`. Sessionen är en httpOnly-cookie.

### Lokalt med Docker

```bash
cp .env.example .env
# Sätt starka lösenord: POSTGRES_PASSWORD och ADMIN_PASSWORD

docker compose up --build
```

- App: http://localhost:3000
- Postgres: localhost:5432

Stoppa med `docker compose down`. Data ligger kvar i volymerna `postgres_data` och `uploads_data`.

### Utan Docker (dev mot lokal Postgres)

```bash
# starta bara databasen
docker compose up -d postgres

cp .env.example .env
# DATABASE_URL ska peka på localhost:5432

npm install
npx prisma migrate deploy
npm run dev
```

### På servern

På [Openship](https://openship.io/docs/guides/compose-multi-service) blir ett Next.js-repo en ensam app. Tjänsterna `app` och `postgres` syns först när projektet läser `docker-compose.yml`. Det styrs av `openship.json`. Öppna projektet, fliken Services, och deploya om. Är listan fortfarande tom: sätt Compose file till `docker-compose.yml` och tryck Scan.

`.env` ligger inte i repot. Sätt variablerna i Openship innan du deployar:

- `POSTGRES_PASSWORD` (krävs, annars startar inte databasen)
- `POSTGRES_USER` (standard `stallmb`)
- `POSTGRES_DB` (standard `stallmb`)
- `ADMIN_EMAIL` och `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL` (t.ex. `https://stallmb.com`)

Lösenordet får inte innehålla `@`. Öppna inte Postgres-porten mot internet. Lägg en reverse proxy framför appen på port 3000.

På en egen maskin utan panel: kopiera `.env.example` till `.env`, sätt samma variabler, och kör `docker compose up -d --build`.

Migreringarna körs i app-containern vid start. Importera ev. data från Supabase:

```bash
# På en maskin med tillgång till Supabase
pg_dump --no-owner --no-acl "$SUPABASE_DB_URL" > stallmb.dump.sql

# På servern (schema måste matcha Prisma-tabellerna)
docker compose exec -T postgres psql -U stallmb -d stallmb < stallmb.dump.sql
```

`site_content.updated_by` (FK mot `auth.users`) finns inte i Prisma-schemat. Ta bort den kolumnen ur dumpen om importen klagar, eller hoppa över den tabellen och låt migrationen skapa den.

### Nyttiga kommandon

| Kommando | Syfte |
| --- | --- |
| `npx prisma migrate deploy` | Kör migrationer (prod/Docker) |
| `npx prisma migrate dev` | Ny migration under utveckling |
| `npx prisma studio` | Bläddra i databasen |
| `npx prisma generate` | Regenerera klienten |

## Miljövariabler

Se [`.env.example`](./.env.example). De som appen faktiskt läser idag:

| Variabel | Används av |
| --- | --- |
| `DATABASE_URL` | Prisma (`src/lib/prisma.ts`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Inloggning (`src/actions/auth.ts`) |
| `ADMIN_SESSION_SECRET` | Signerar admin-cookien. Faller tillbaka på `ADMIN_PASSWORD`. |
| `HASTANNONS_API_KEY` | `src/lib/hastannons.ts` |

`RESEND_API_KEY` finns i `.env.example` men används inte i koden.

## Vad som ersatt Supabase

Datamodellen är rekonstruerad från SQL-filerna i repo-roten. RLS och `auth.users` finns inte i Postgres. Åtkomst till admin sköts i appen.

| Tidigare | Nu |
| --- | --- |
| PostgREST (`src/lib/data.ts`, admin, analytics) | Prisma |
| `supabase.auth` | httpOnly-cookie mot `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| Storage `horse-images` och `site-assets` | Filer i `public/uploads`, volymen `uploads_data` |
| Vercel Analytics | Borttagen. `visitor_stats` räknar besök |
| `auth.users`-kopplingen på `site_content.updated_by` | Borttagen |

PostHog-rewrites i `vercel.json` används inte av appen. Ignorera dem på egen server. Resend ligger kvar i `package.json` men anropas inte.

Importerade bilder som fortfarande pekar på Supabase Storage tillåts i `next.config.ts`. Nya uppladdningar sparas som `/uploads/...`.
