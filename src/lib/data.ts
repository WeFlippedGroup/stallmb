import { prisma } from '@/lib/prisma';
import { MOCK_HORSES } from '@/lib/mockData';
import { Horse } from '@/components/HorseCard';
import { toGuestbook, toHorse, type GuestbookEntry } from '@/lib/map';

export type { GuestbookEntry };

export async function getHorses(): Promise<Horse[]> {
    try {
        const rows = await prisma.horse.findMany({ orderBy: { createdAt: 'desc' } });
        if (rows.length === 0) return MOCK_HORSES;
        return rows.map(toHorse);
    } catch (e) {
        console.error('Error fetching horses:', e);
        return MOCK_HORSES;
    }
}

export async function getHorse(id: string): Promise<Horse | undefined> {
    try {
        const row = await prisma.horse.findUnique({ where: { id } });
        let horseData = row ? toHorse(row) : MOCK_HORSES.find((h) => h.id === id);

        if (horseData) {
            const mockMatch = MOCK_HORSES.find(m => m.name === horseData?.name || m.id === horseData?.id);
            if (mockMatch && mockMatch.images && (!horseData.images || horseData.images.length === 0)) {
                horseData = {
                    ...horseData,
                    images: mockMatch.images
                };
            }
        }

        return horseData;
    } catch (e) {
        console.error('Error fetching horse:', e);
        return MOCK_HORSES.find((h) => h.id === id);
    }
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
    try {
        const rows = await prisma.guestbookEntry.findMany({ orderBy: { createdAt: 'desc' } });
        return rows.map(toGuestbook);
    } catch (e) {
        console.error('Error fetching guestbook:', e);
        return [];
    }
}

export async function getSiteContent(id: string) {
    try {
        const row = await prisma.siteContent.findUnique({
            where: { id },
            select: { content: true },
        });
        return (row?.content ?? null) as Record<string, string> | null;
    } catch (e) {
        console.error('Error fetching site content:', e);
        return null;
    }
}
