'use server';

import { getSession } from '@/lib/auth';
import { folderFor, putImage } from '@/lib/storage';

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
    const session = await getSession();
    if (!session) return { error: 'Inte inloggad' };

    const kind = String(formData.get('kind') || '');
    const folder = folderFor(kind);
    if (!folder) return { error: 'Ogiltig bildtyp' };

    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
        return { error: 'Ingen fil' };
    }

    try {
        const url = await putImage(file, folder);
        return { url };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Uppladdning misslyckades';
        return { error: message };
    }
}
