'use server';

import { prisma } from '@/lib/prisma';
import { toGuestbook, type GuestbookEntry } from '@/lib/map';

export async function addGuestbookEntry(name: string, message: string): Promise<{ entry?: GuestbookEntry; error?: string }> {
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) return { error: 'Namn och meddelande krävs' };
    if (cleanName.length > 80) return { error: 'Namnet är för långt' };
    if (cleanMessage.length > 2000) return { error: 'Meddelandet är för långt' };

    const row = await prisma.guestbookEntry.create({
        data: { name: cleanName, message: cleanMessage },
    });
    return { entry: toGuestbook(row) };
}
