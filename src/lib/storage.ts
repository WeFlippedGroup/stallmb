import 'server-only';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXT_BY_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
};

export function folderFor(kind: string) {
    if (kind === 'assets') return 'site-assets';
    if (kind === 'horses') return 'horse-images';
    return null;
}

export async function putImage(file: File, folder: string) {
    if (!ALLOWED_TYPES.has(file.type)) {
        throw new Error('Ogiltig bildtyp. Använd jpg, png, webp eller gif.');
    }
    if (file.size > 8 * 1024 * 1024) {
        throw new Error('Bilden får vara max 8 MB.');
    }

    const ext = EXT_BY_TYPE[file.type];
    const key = `${crypto.randomUUID()}.${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, key), Buffer.from(await file.arrayBuffer()));

    return `/uploads/${folder}/${key}`;
}
