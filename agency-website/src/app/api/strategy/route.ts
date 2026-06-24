import { NextResponse } from 'next/server';
import { generateStrategy } from '../../../lib/ai-strategy';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_IDEA_LENGTH = 600;

export async function POST(request: Request) {
  let idea = '';
  try {
    const body = await request.json().catch(() => ({}));
    idea = typeof body?.idea === 'string' ? body.idea.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!idea) {
    return NextResponse.json({ error: 'Describe your product or business idea first.' }, { status: 400 });
  }
  if (idea.length > MAX_IDEA_LENGTH) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_IDEA_LENGTH} characters so we can focus.` },
      { status: 400 },
    );
  }

  try {
    const result = await generateStrategy(idea);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/strategy] unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong generating your strategy. Please try again.' },
      { status: 500 },
    );
  }
}
