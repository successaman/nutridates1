import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin2026';
    const expectedUsername = 'admin';

    if (username === expectedUsername && password === expectedPassword) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      
      // Set secure HTTP-only cookie
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
