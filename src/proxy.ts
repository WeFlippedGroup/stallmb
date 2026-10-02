import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionCookieName, verifySessionToken } from '@/lib/session-token';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get(sessionCookieName())?.value;
    const session = await verifySessionToken(token);
    if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.search = '';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
