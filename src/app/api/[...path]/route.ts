import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_BASE_URL = process.env.BACKEND_API_BASE_URI || 'http://localhost:3000';

async function handleProxy(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathString = path.join('/');

    // 1. Extract query parameters from incoming request
    const { search } = new URL(request.url);

    // 2. Build full target URL on NestJS
    const targetUrl = `${BACKEND_BASE_URL.replace(/\/$/, '')}/api/${pathString}${search}`;

    // 3. Extract the HTTP-only 'jwt' cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    // 4. Prepare headers to forward to NestJS
    const headers = new Headers(request.headers);
    headers.set('host', new URL(BACKEND_BASE_URL).host);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // 5. Extract body for non-GET/HEAD methods
    let body: string | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    // 6. Forward the request to NestJS
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: 'no-store',
    });

    const data = await backendRes.json().catch(() => ({}));

    // 7. Return response directly to frontend client
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error instanceof Error)?  error?.message : 'Internal Proxy Error' },
      { status: 500 }
    );
  }
}

// Export HTTP Methods supported by the proxy
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;