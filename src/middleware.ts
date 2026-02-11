import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest | any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Allow auth-related requests, static files, and public status pages
    if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/heartbeat') ||
        pathname.startsWith('/api/services') ||
        pathname.startsWith('/api/leads') ||
        pathname.startsWith('/api/config') ||
        pathname.startsWith('/status') ||
        pathname.startsWith('/_next') ||
        pathname.includes('favicon.ico') ||
        pathname === '/login'
    ) {
        return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/leads|api/config|api/heartbeat|_next/static|_next/image|favicon.ico).*)'],
};
