'use server';

import { Prisma } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ALLOWED_IDS = new Set(['about_page', 'connemara_page']);

async function requireAdmin() {
    const session = await getSession();
    if (!session) return 'Inte inloggad';
    return null;
}

function asRecord(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const out: Record<string, string> = {};
    for (const [key, entry] of Object.entries(value)) {
        if (typeof entry === 'string') out[key] = entry;
    }
    return out;
}

export async function getAdminSiteContent(id: string) {
    const denied = await requireAdmin();
    if (denied) return { content: null, error: denied };
    if (!ALLOWED_IDS.has(id)) return { content: null, error: 'Okänt innehåll' };

    const row = await prisma.siteContent.findUnique({ where: { id } });
    return { content: asRecord(row?.content) };
}

export async function saveSiteContent(id: string, content: object) {
    const denied = await requireAdmin();
    if (denied) return { error: denied };
    if (!ALLOWED_IDS.has(id)) return { error: 'Okänt innehåll' };

    const json = content as Prisma.InputJsonValue;
    await prisma.siteContent.upsert({
        where: { id },
        create: { id, content: json },
        update: { content: json },
    });
    return { ok: true as const };
}
