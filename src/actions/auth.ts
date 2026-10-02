'use server';

import { clearSessionCookie, setSessionCookie } from '@/lib/auth';
import { safeEqual } from '@/lib/session-token';

export async function login(email: string, password: string) {
    const expectedEmail = (process.env.ADMIN_EMAIL || '').trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || '';

    if (!expectedEmail || !expectedPassword) {
        return { error: 'Admin är inte konfigurerad. Sätt ADMIN_EMAIL och ADMIN_PASSWORD.' };
    }

    const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail.toLowerCase());
    const passwordOk = safeEqual(password, expectedPassword);
    if (!emailOk || !passwordOk) {
        return { error: 'Fel e-post eller lösenord' };
    }

    await setSessionCookie(expectedEmail);
    return { ok: true as const };
}

export async function logout() {
    await clearSessionCookie();
}
