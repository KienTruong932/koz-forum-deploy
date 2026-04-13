import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UserStatus } from '@/lib/enums';

export default auth((request) => {
  if (request.auth) {
    if (request.auth.user.status === UserStatus.BANNED) {
      const clearCookies = (response: NextResponse) => {
        response.cookies.delete('authjs.session-token');
        response.cookies.delete('__Secure-authjs.session-token');
        return response;
      };

      if (request.nextUrl.pathname !== '/login' || request.nextUrl.searchParams.get('error') !== 'Banned') {
        const url = new URL('/login?error=Banned', request.url);
        return clearCookies(NextResponse.redirect(url));
      }
      
      return clearCookies(NextResponse.next());
    }

    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
