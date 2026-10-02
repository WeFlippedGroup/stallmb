import 'server-only';
import { cookies } from 'next/headers';
import { createSessionToken, sessionCookieName, sessionMaxAgeSeconds, verifySessionToken } from '@/lib/session-token';

function cookieSecure() {
    return (process.env.NEXT_PUBLIC_SITE_URL || '').startsWith('https://');
}

export async function getSession() {
    const jar = await cookies();
    return verifySessionToken(jar.get(sessionCookieName())?.value);
}

export async function setSessionCookie(email: string) {
    const token = await createSessionToken(email);
    const jar = await cookies();
    jar.set(sessionCookieName(), token, {
        httpOnly: true,
        secure: cookieSecure(),
        sameSite: 'lax',
        path: '/',
        maxAge: sessionMaxAgeSeconds(),
    });
}

export async function clearSessionCookie() {
    const jar = await cookies();
    jar.delete(sessionCookieName());
}
