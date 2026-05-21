import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('mibank_session');
  
  if (!session) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Menentukan rute mana saja yang akan diproses oleh proxy
export const config = {
  matcher: [
    '/chat/:path*',
    '/karir/:path*',
    '/webform/:path*',
    '/promo/smile-umkm/daftar/:path*',
  ],
};
