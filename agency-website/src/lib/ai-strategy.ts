import { generateObject, type LanguageModel } from 'ai';
import { z } from 'zod';

/**
 * Structured AI integration strategy returned to the homepage hero.
 * Each field is intentionally tight so the UI stays clean.
 */
export const StrategySchema = z.object({
  headline: z
    .string()
    .describe('One punchy sentence framing the AI opportunity for this specific business. No buzzwords, no em dashes.'),
  opportunity: z
    .string()
    .describe('2 to 3 sentences on the single highest-leverage place AI fits this business.'),
  integration: z
    .string()
    .describe('2 to 3 sentences on the concrete integration: whether it is a product feature, internal tool, or agent, and how it plugs into their existing stack.'),
  connections: z
    .array(z.string())
    .describe('3 to 5 specific systems or data sources to connect, e.g. "Postgres customer DB", "Stripe billing", "internal docs via RAG", "CRM API through an MCP-style tool layer".'),
  agenticWorkflow: z
    .string()
    .describe('2 to 3 sentences describing one concrete agentic workflow that automates a real task for this business.'),
  mvpPlan: z
    .array(z.string())
    .describe('3 to 5 short, sequential build steps to ship an MVP integration.'),
  whySelerim: z
    .string()
    .describe('2 to 3 sentences on why Selerim, a US-based studio that ships and maintains production AI, is a fit. Confident, not salesy.'),
});

export type Strategy = z.infer<typeof StrategySchema>;

const SYSTEM_PROMPT = `You are the strategy engine for Selerim, a US-based software studio that builds production-ready AI into real products and businesses.

Selerim specializes in:
- AI-powered product features
- Internal AI assistants
- Agentic workflow automation
- RAG and knowledge assistants over a company's own data
- MCP-style tool and data access layers that connect AI to real systems
- Modernizing existing apps with AI
- Implementation across mobile, web, backend, and cloud
- Ongoing maintenance and scaling

Given a business or product idea, produce a concrete, tailored AI integration strategy. Be specific to the idea. Reference real systems, data sources, and workflows where sensible. Favor integrations into existing products and stacks over standalone apps.

Tone: premium, technical, trustworthy, founder-led, production-focused. Avoid generic "AI agency" fluff, hype words, and clichés. Never use em dashes; use periods or commas instead. Keep every field tight and free of filler.`;

/** Pick a model from env. Returns null when no provider is configured (demo mode). */
async function resolveModel(): Promise<LanguageModel | string | null> {
  const modelId = process.env.AI_MODEL?.trim();

  // Preferred: Vercel AI Gateway (a single key routes to any provider/model).
  if (process.env.AI_GATEWAY_API_KEY) {
    return modelId || 'openai/gpt-4o-mini';
  }

  // Direct OpenAI key. Cheap default (gpt-4o-mini) that handles this well;
  // override with AI_MODEL.
  if (process.env.AI_API_KEY) {
    const { createOpenAI } = await import('@ai-sdk/openai');
    const openai = createOpenAI({ apiKey: process.env.AI_API_KEY });
    return openai(modelId || 'gpt-4o-mini');
  }

  return null;
}

/** Deterministic, idea-aware fallback so the demo always works without a token. */
export function mockStrategy(idea: string): Strategy {
  const clean = idea.replace(/\s+/g, ' ').trim();
  const snippet = clean.length > 90 ? `${clean.slice(0, 87)}...` : clean;

  return {
    headline: `There is a clear, production-ready place for AI inside "${snippet}".`,
    opportunity:
      'The highest-leverage win is removing repetitive manual work and surfacing answers from data you already hold. In practice that means an assistant or agent that handles intake, retrieval, and drafting so your team spends its time on judgment calls.',
    integration:
      'We build this as a focused feature or internal tool inside your existing product and stack, not a separate app. It connects to your current backend and data so it works against real records from day one.',
    connections: [
      'Your primary database of customers, records, and transactions',
      'Internal documents and knowledge, indexed for RAG',
      'Core third-party APIs such as CRM, billing, and comms via an MCP-style tool layer',
      'Your auth and permissions, so the AI respects existing access rules',
    ],
    agenticWorkflow:
      'An agent watches for a trigger such as a new request, ticket, or document, gathers context from your systems, drafts the next action, and either completes it or routes it for a quick human approval.',
    mvpPlan: [
      'Scope the single highest-value workflow and its success metric',
      'Wire secure access to the data and tools it needs',
      'Ship a working assistant or agent behind your auth',
      'Add guardrails, evals, and logging',
      'Roll out to a pilot team and iterate',
    ],
    whySelerim:
      'Selerim is a US-based studio that ships production-ready AI, not prototypes. We build the integration into your real systems, keep your data under your control, and maintain and scale it after launch.',
  };
}

/**
 * Generate a tailored strategy. Uses the configured AI provider when available,
 * otherwise returns the mock. Never throws; falls back to mock on any error.
 */
export async function generateStrategy(idea: string): Promise<{ strategy: Strategy; demo: boolean }> {
  const model = await resolveModel();
  if (!model) {
    return { strategy: mockStrategy(idea), demo: true };
  }

  try {
    const { object } = await generateObject({
      model,
      schema: StrategySchema,
      system: SYSTEM_PROMPT,
      prompt: `Business or product idea:\n"""${idea}"""\n\nProduce the AI integration strategy now.`,
      temperature: 0.6,
      maxRetries: 1,
    });
    return { strategy: object, demo: false };
  } catch (error) {
    console.error('[ai-strategy] generation failed, falling back to mock:', error);
    return { strategy: mockStrategy(idea), demo: true };
  }
}
