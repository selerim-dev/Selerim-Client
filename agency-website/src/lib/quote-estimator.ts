const HOURLY_RATE = 120;

const FEATURE_HOURS: Record<string, number> = {
  Auth: 18,
  Login: 10,
  Location: 14,
  'Push Notifications': 14,
  Payments: 28,
  Chat: 32,
  Profile: 10,
  Feed: 24,
  Search: 12,
  Settings: 8,
  Analytics: 20,
  'Admin Panel': 28,
  'File Upload': 14,
  Calendar: 16,
  Notifications: 12,
};

const KEYWORD_HOURS: Array<{ pattern: RegExp; hours: number; note: string }> = [
  { pattern: /\b(ai|llm|rag|agent|nlp|automation|recommendation)\b/i, hours: 36, note: 'AI-assisted workflow or model integration' },
  { pattern: /\b(auth|roles|permissions|multi-tenant)\b/i, hours: 18, note: 'Authentication or permission model' },
  { pattern: /\b(payment|billing|subscription|invoice|checkout)\b/i, hours: 28, note: 'Payments or subscription handling' },
  { pattern: /\b(admin|cms|dashboard|backoffice)\b/i, hours: 22, note: 'Administrative dashboard' },
  { pattern: /\b(realtime|websocket|live|chat|messaging)\b/i, hours: 26, note: 'Real-time interactions' },
  { pattern: /\b(api|integration|sync|erp|crm|hubspot|salesforce|stripe)\b/i, hours: 20, note: 'Third-party integration work' },
  { pattern: /\b(analytics|reporting|insights|metrics)\b/i, hours: 18, note: 'Analytics and reporting' },
  { pattern: /\b(upload|file|document|storage|s3|media)\b/i, hours: 16, note: 'File or document handling' },
  { pattern: /\b(offline|cache|sync)\b/i, hours: 18, note: 'Offline or synchronization support' },
  { pattern: /\b(mobile|ios|android|react native|flutter)\b/i, hours: 30, note: 'Mobile delivery requirements' },
];

const TIMELINE_FACTORS: Record<string, number> = {
  Unknown: 1,
  '1-2 weeks': 1.3,
  '2-4 weeks': 1.2,
  '1-2 months': 1.08,
  '2-4 months': 1,
  '4+ months': 0.95,
};

const RELIABILITY_FACTORS: Record<string, number> = {
  standard: 1,
  elevated: 1.15,
  critical: 1.3,
};

const SCALE_FACTORS: Record<string, number> = {
  internal: 0.95,
  startup: 1,
  growth: 1.12,
  scale: 1.24,
};

export type EstimateInput = {
  components: string[];
  brief: string;
  timeline: string;
  reliability: 'standard' | 'elevated' | 'critical';
  scale: 'internal' | 'startup' | 'growth' | 'scale';
};

export type EstimateResult = {
  hours: number;
  basePrice: number;
  priceLow: number;
  priceHigh: number;
  recommendation: string;
  assumptions: string[];
  hourlyRate: number;
};

function roundToNearestFive(value: number) {
  return Math.max(10, Math.round(value / 5) * 5);
}

function formatRecommendation(hours: number) {
  if (hours <= 80) {
    return 'Lean sprint. Best for a focused MVP or internal tool with a narrow release scope.';
  }

  if (hours <= 180) {
    return 'Core product build. Good fit for a polished first launch with a few critical workflows.';
  }

  if (hours <= 320) {
    return 'Growth-stage delivery. Expect deeper QA, stronger architecture, and more operational planning.';
  }

  return 'High-complexity program. This needs phased delivery, tighter discovery, and production hardening.';
}

export function estimateProject(input: EstimateInput): EstimateResult {
  const componentHours = input.components.reduce((total, component) => {
    return total + (FEATURE_HOURS[component] ?? 10);
  }, 24);

  const keywordMatches = KEYWORD_HOURS.filter(({ pattern }) => pattern.test(input.brief));
  const keywordHours = keywordMatches.reduce((total, item) => total + item.hours, 0);

  const timelineFactor = TIMELINE_FACTORS[input.timeline] ?? 1;
  const reliabilityFactor = RELIABILITY_FACTORS[input.reliability] ?? 1;
  const scaleFactor = SCALE_FACTORS[input.scale] ?? 1;

  const rawHours = (componentHours + keywordHours) * timelineFactor * reliabilityFactor * scaleFactor;
  const hours = roundToNearestFive(rawHours);
  const basePrice = hours * HOURLY_RATE;

  return {
    hours,
    basePrice,
    priceLow: roundToNearestFive(basePrice * 0.9),
    priceHigh: roundToNearestFive(basePrice * 1.18),
    recommendation: formatRecommendation(hours),
    hourlyRate: HOURLY_RATE,
    assumptions: [
      `Timeline pressure: ${input.timeline || 'Unknown'}`,
      `Reliability target: ${input.reliability}`,
      `Expected usage scale: ${input.scale}`,
      ...keywordMatches.map((item) => item.note),
    ],
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
