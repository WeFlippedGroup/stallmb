-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "horses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "breed" TEXT DEFAULT 'Connemara',
    "age" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "category" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pedigree" JSONB NOT NULL DEFAULT '{}',
    "blabasen_link" TEXT,
    "results" TEXT,

    CONSTRAINT "horses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guestbook" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guestbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_content" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_stats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visited_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "visitor_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_visitor_stats_visited_at" ON "visitor_stats"("visited_at");

-- Seed default CMS keys so admin/public pages have a row to upsert against
INSERT INTO "site_content" ("id", "content")
VALUES
  ('about_page', '{
    "history_text": "",
    "history_image": "",
    "philosophy_text": "",
    "philosophy_image": ""
  }'::jsonb),
  ('connemara_page', '{
    "origin_image": "",
    "character_image": "",
    "usage_image": ""
  }'::jsonb)
ON CONFLICT ("id") DO NOTHING;
