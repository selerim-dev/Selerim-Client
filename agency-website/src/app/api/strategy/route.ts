import { NextResponse } from 'next/server';
import { generateStrategy } from '../../../lib/ai-strategy';
import { rateLimit, getClientIp } from '../../../lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MIN_IDEA_LENGTH = 3;
const MAX_IDEA_LENGTH = 600;
const MAX_BODY_BYTES = 8 * 1024; // 8 KB is plenty for a single idea

function secHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    ...extra,
  };
}

function json(body: unknown, status: number, extra: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: secHeaders(extra) });
}

/** Only accept requests that originate from our own site (blocks scripted/cross-site abuse). */
function isSameOrigin(req: Request): boolean {
  const host = req.headers.get('host');
  if (!host) return false;
  const source = req.headers.get('origin') || req.headers.get('referer');
  if (!source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // 1) Origin lock
  if (!isSameOrigin(request)) {
    return json({ error: 'Forbidden.' }, 403);
  }

  // 2) Content type
  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return json({ error: 'Unsupported media type.' }, 415);
  }

  // 3) Rate limit (per IP, multi-window)
  const ip = getClientIp(request);
  const limit = await rateLimit(ip);
  if (!limit.success) {
    return json({ error: 'Too many requests. Please wait a moment and try again.' }, 429, {
      'Retry-After': String(limit.retryAfter ?? 60),
      'RateLimit-Limit': String(limit.limit ?? ''),
      'RateLimit-Remaining': String(limit.remaining ?? 0),
      'RateLimit-Reset': limit.reset ? String(Math.ceil(limit.reset / 1000)) : '',
    });
  }

  // 4) Parse + validate body (size guarded)
  let idea = '';
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'Request too large.' }, 413);
    }
    const body = JSON.parse(raw || '{}');
    idea = typeof body?.idea === 'string' ? body.idea.trim() : '';
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  if (idea.length < MIN_IDEA_LENGTH) {
    return json({ error: 'Describe your product or business idea first.' }, 400);
  }
  if (idea.length > MAX_IDEA_LENGTH) {
    return json({ error: `Keep it under ${MAX_IDEA_LENGTH} characters so we can focus.` }, 400);
  }

  // 5) Generate
  try {
    const result = await generateStrategy(idea);
    return json(result, 200);
  } catch (error) {
    console.error('[api/strategy] unexpected error:', error);
    return json({ error: 'Something went wrong generating your strategy. Please try again.' }, 500);
  }
}

// Reject every other method.
export async function GET() {
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
