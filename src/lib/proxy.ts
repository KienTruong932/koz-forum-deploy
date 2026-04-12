import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((request) => {
  if (request.auth) {
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/login', '/register'],
};
