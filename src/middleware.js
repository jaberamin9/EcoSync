import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/ui/reset-password' || path === '/ui/login' || path === '/api/auth/login' || path === '/api/auth/reset-password/confirm' || path === '/api/auth/reset-password/initiate' || path === '/api/auth/reset-password/reset'

    const token = request.cookies.get('token') || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/ui/dashboard', request.nextUrl))
    }
    if (path === '/' && token) {
        return NextResponse.redirect(new URL('/ui/dashboard', request.nextUrl))
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/ui/login', request.nextUrl))
    }
}


export const config = {
    matcher: [
        '/api/:path*',
        '/ui/:path*',
        '/'
    ]
}