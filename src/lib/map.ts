import type { GuestbookEntry as GuestbookRow, Horse as HorseRow } from '@prisma/client';
import type { Horse } from '@/components/HorseCard';

export type GuestbookEntry = {
    id: number;
    name: string;
    message: string;
    created_at: string;
};

export function toHorse(row: HorseRow): Horse {
    return {
        id: row.id,
        name: row.name,
        breed: row.breed ?? '',
        age: row.age ?? '',
        description: row.description ?? '',
        image_url: row.imageUrl ?? '',
        images: row.images ?? [],
        category: (row.category ?? '') as Horse['category'],
        pedigree: row.pedigree ?? {},
        blabasen_link: row.blabasenLink ?? '',
        results: row.results ?? undefined,
    };
}

export function toGuestbook(row: GuestbookRow): GuestbookEntry {
    return {
        id: Number(row.id),
        name: row.name,
        message: row.message,
        created_at: row.createdAt.toISOString(),
    };
}
