'use server';

import { Prisma } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toHorse } from '@/lib/map';
import type { Horse } from '@/components/HorseCard';

export type HorseWriteInput = {
    name: string;
    breed: string;
    age: string;
    description: string;
    category: string;
    images: string[];
    pedigree: Record<string, { name: string }>;
    blabasen_link: string;
    results: string;
};

async function requireAdmin() {
    const session = await getSession();
    if (!session) return 'Inte inloggad';
    return null;
}

function toWrite(input: HorseWriteInput) {
    return {
        name: input.name.trim(),
        breed: input.breed.trim() || 'Connemara',
        age: input.age.trim() || null,
        description: input.description.trim() || null,
        category: input.category.trim() || null,
        imageUrl: input.images[0] || null,
        images: input.images.slice(0, 20),
        pedigree: input.pedigree as Prisma.InputJsonValue,
        blabasenLink: input.blabasen_link.trim() || null,
        results: input.results.trim() || null,
    };
}

export async function listHorses(): Promise<{ horses: Horse[]; error?: string }> {
    const denied = await requireAdmin();
    if (denied) return { horses: [], error: denied };

    const rows = await prisma.horse.findMany({ orderBy: { createdAt: 'desc' } });
    return { horses: rows.map(toHorse) };
}

export async function getHorseForAdmin(id: string): Promise<{ horse: Horse | null; error?: string }> {
    const denied = await requireAdmin();
    if (denied) return { horse: null, error: denied };

    const row = await prisma.horse.findUnique({ where: { id } });
    return { horse: row ? toHorse(row) : null };
}

export async function createHorse(input: HorseWriteInput) {
    const denied = await requireAdmin();
    if (denied) return { error: denied };
    if (!input.name.trim()) return { error: 'Namn saknas' };

    await prisma.horse.create({ data: toWrite(input) });
    return { ok: true as const };
}

export async function updateHorse(id: string, input: HorseWriteInput) {
    const denied = await requireAdmin();
    if (denied) return { error: denied };
    if (!input.name.trim()) return { error: 'Namn saknas' };

    await prisma.horse.update({ where: { id }, data: toWrite(input) });
    return { ok: true as const };
}

export async function deleteHorse(id: string) {
    const denied = await requireAdmin();
    if (denied) return { error: denied };

    await prisma.horse.delete({ where: { id } });
    return { ok: true as const };
}
