import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Send credentials to NestJS backend
    console.log(body, request)
    const backendRes = await fetch(`${process.env.BACKEND_API_BASE_URI}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: backendRes.status }
      );
    }

    const token = data.data?.token;
    // Set HTTP-only cookie on intra-client.vercel.app
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 1000,
      });
    }

    return NextResponse.json({
      message: data?.message || 'Login successful',
      status: data?.status || true,
      statusCode: data?.statusCode || 200,
      data: data?.data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error instanceof Error)? error?.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}