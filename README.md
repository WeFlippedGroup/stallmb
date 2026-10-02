This is a [Next.js](https://nextjs.org) project for StallMB (Connemara-uppfödning).

## Getting Started

```bash
cp .env.example .env
# fyll i minst DATABASE_URL och ev. Supabase-nycklar under övergången

npm install
npx prisma migrate deploy
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Deploy med Docker Compose + Prisma

Projektet är förberett för egen server. Postgres ersätter Supabase-databasen. MinIO finns med som S3-kompatibel storage (ersätter Supabase Storage när admin-uppladdning kopplas om).

**Viktigt:** den publika sajten och admin använder fortfarande `supabase-js` för databas, auth och bilduppladdning. Docker-stacken ger databasen och Prisma-schemat. Själva applikationen måste fortfarande ha `NEXT_PUBLIC_SUPABASE_*` satta *eller* migreras enligt tabellen längst ner.

### Lokalt med Docker

```bash
cp .env.example .env
# Sätt starka lösenord: POSTGRES_PASSWORD, MINIO_ROOT_PASSWORD
# För lokal Next.js mot Docker-Postgres: DATABASE_URL=...@localhost:5432/...

docker compose up --build
```

- App: http://localhost:3000
- Postgres: localhost:5432
- MinIO API: http://localhost:9000
- MinIO Console: http://localhost:9001

Stoppa med `docker compose down`. Data ligger kvar i volymerna `postgres_data` och `minio_data`.

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

1. Klona repot och kopiera `.env.example` till `.env`.
2. Sätt starka lösenord och `NEXT_PUBLIC_SITE_URL` till serverns publika URL (t.ex. `https://stallmb.com`).
3. Öppna inte Postgres- eller MinIO-portarna mot internet. Lägg en reverse proxy (Caddy/nginx) framför appen på port 3000.
4. Starta:

```bash
docker compose up -d --build
```

5. Körda migrationer loggas i app-containern vid start (`prisma migrate deploy`).
6. Importera ev. data från Supabase:

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
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` |
| `HASTANNONS_API_KEY` | `src/lib/hastannons.ts` |

Övriga variabler i `.env.example` är för Docker (Postgres/MinIO) eller planerade ersättningar (admin-lösenord, Resend).

## Supabase-beroenden och föreslagna ersättningar

Det fanns inget Prisma-schema sedan tidigare. Datamodellen är rekonstruerad från SQL-filerna i repo-roten och `src/`. **RLS och `auth.users` är medvetet borttagna** – på egen server sköts åtkomst i appen, inte i databasen.

### Databastabeller (klart i Prisma)

| Tabell | Källa | Prisma-modell |
| --- | --- | --- |
| `horses` | `src/db_setup.sql` + alter/migration-SQL | `Horse` |
| `guestbook` | `supabase_guestbook_setup.sql` | `GuestbookEntry` |
| `site_content` | `create_site_content_table.sql` | `SiteContent` |
| `visitor_stats` | `create_analytics_table.sql` | `VisitorStat` |

### Var Supabase används i koden

| Feature | Var | Ersättning |
| --- | --- | --- |
| **Postgres via PostgREST** | `src/lib/data.ts` (hästar, gästbok, CMS) | Prisma (`src/lib/prisma.ts`) + server actions. `addGuestbookEntry` anropas från en client-komponent och måste då bli en server action. |
| **Postgres via PostgREST** | `src/actions/analytics.ts` | Prisma i samma server action |
| **Postgres via PostgREST** | `src/app/admin/page.tsx`, `new/page.tsx`, `edit/[id]/page.tsx`, `hastannons/page.tsx`, `content/page.tsx` | Server actions / Route Handlers som använder Prisma. Flytta skrivningar från browsern. |
| **Auth** (`signInWithPassword`, `getSession`, `onAuthStateChange`, `signOut`) | `src/app/admin/login/page.tsx`, `src/app/admin/layout.tsx` | Enkel cookie-session (t.ex. `jose` + httpOnly cookie) mot `ADMIN_EMAIL`/`ADMIN_PASSWORD`, eller en `AdminUser`-tabell med bcrypt. Ingen Realtime behövs – kolla sessionen mot en API-route. |
| **Storage** bucket `horse-images` | `src/app/admin/new/page.tsx`, `edit/[id]/page.tsx` | MinIO (redan i `docker-compose.yml`) + `@aws-sdk/client-s3` via en upload-route. Spara publika URL:er (`MINIO_PUBLIC_URL/horse-images/...`) i `horses.images`. |
| **Storage** bucket `site-assets` (fallback `horse-images`) | `src/app/admin/content/page.tsx` | Samma MinIO-buckets som `minio-init` skapar. |
| **RLS-policies** | SQL-filerna | Tas bort. Appen ska inte exponera databasen. Skydda admin-skrivningar bakom inloggning. |
| **`auth.users` FK** | `site_content.updated_by` i `create_site_content_table.sql` | Borttagen i Prisma. Lägg ev. till `updatedBy String?` senare. |
| **Edge Functions** | — | Används inte. |
| **Realtime** | Bara `onAuthStateChange` | Behövs inte. |
| **Supabase-bilder i Next** | `next.config.ts` | Behåll hostname under övergången. MinIO (`localhost:9000`) är tillagt. På produktion: lägg till serverns hostname. |
| **Vercel Analytics** | `src/app/layout.tsx` (`@vercel/analytics`) | Fungerar inte meningsfullt utanför Vercel. Ta bort eller byt till Plausible/Umami. `visitor_stats` täcker enkel räkning. |
| **PostHog-rewrites** | `vercel.json` | Ingen PostHog-kod i appen. Ignorera på egen server, eller lägg motsvarande rewrite i Caddy/nginx om ni inför PostHog. |
| **Resend** | `package.json` | Installerat men oanvänt. Behåll `RESEND_API_KEY` om kontaktformulär ska mejla senare. |

Redis behövs inte (ingen kö, cache eller session store idag).

### Föreslagen migrationsordning

1. Peka `DATABASE_URL` mot Postgres (klart i schema + Compose).
2. Byt `src/lib/data.ts` och `src/actions/analytics.ts` till Prisma.
3. Inför admin-session (cookie) och sluta använda `supabase.auth`.
4. Byt admin-CRUD till server actions + Prisma.
5. Byt bilduppladdning till MinIO.
6. Ta bort `@supabase/supabase-js` och `NEXT_PUBLIC_SUPABASE_*`.
7. Ta bort `@vercel/analytics` när ni lämnar Vercel.

Steg 2–6 är medvetet inte gjorda i denna ändring – de skriver om admin och skulle lämna sajten med två databaser om bara halva lagret byttes.
