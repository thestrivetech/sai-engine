// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis-backed rate limiter
// This limits each IP to 10 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per 1 minute
  analytics: true, // Track usage in Upstash dashboard
  prefix: '@upstash/ratelimit',
});

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get IP address for rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 
             request.headers.get('x-real-ip') ?? 
             'anonymous';

  try {
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    );

    // If rate limit exceeded
    if (!success) {
      const now = Date.now();
      const retryAfter = Math.floor((reset - now) / 1000);

      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'You have exceeded the rate limit. Please try again later.',
          retryAfter: retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

    return response;
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    console.error('Rate limiting error:', error);
    return NextResponse.next();
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/:path*', // Apply to all API routes
  ],
};