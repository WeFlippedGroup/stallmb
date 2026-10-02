const COOKIE_NAME = 'stallmb_admin';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function sessionCookieName() {
    return COOKIE_NAME;
}

export function sessionMaxAgeSeconds() {
    return MAX_AGE_MS / 1000;
}

export function sessionSecret() {
    return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function bytesToBase64Url(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToString(value: string) {
    const pad = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4));
    const b64 = value.replace(/-/g, '+').replace(/_/g, '/') + pad;
    return atob(b64);
}

export function safeEqual(a: string, b: string) {
    const aa = new TextEncoder().encode(a);
    const bb = new TextEncoder().encode(b);
    const len = Math.max(aa.length, bb.length);
    let diff = aa.length === bb.length ? 0 : 1;
    for (let i = 0; i < len; i++) {
        diff |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
    }
    return diff === 0;
}

async function hmac(value: string, secret: string) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
    return bytesToBase64Url(new Uint8Array(sig));
}

export async function createSessionToken(email: string) {
    const secret = sessionSecret();
    if (!secret) throw new Error('ADMIN_SESSION_SECRET eller ADMIN_PASSWORD saknas');
    const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({
        email,
        exp: Date.now() + MAX_AGE_MS,
    })));
    const sig = await hmac(payload, secret);
    return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null) {
    const secret = sessionSecret();
    if (!token || !secret) return null;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expected = await hmac(payload, secret);
    if (!safeEqual(sig, expected)) return null;
    try {
        const data = JSON.parse(base64UrlToString(payload)) as { email?: unknown; exp?: unknown };
        if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
        if (typeof data.email !== 'string' || !data.email) return null;
        return { email: data.email };
    } catch {
        return null;
    }
}
