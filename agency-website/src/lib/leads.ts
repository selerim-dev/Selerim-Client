export const ADMIN_EMAIL = 'admin@selerim.com';

type MailtoOptions = {
  to?: string;
  subject: string;
  body: string;
};

export function buildMailtoHref({ to = ADMIN_EMAIL, subject, body }: MailtoOptions) {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${to}?${params.toString()}`;
}

export function openMailto(options: MailtoOptions) {
  if (typeof window === 'undefined') {
    return;
  }

  window.location.href = buildMailtoHref(options);
}

export function formatLeadSection(title: string, lines: Array<string | null | undefined>) {
  const safeLines = lines.filter(Boolean) as string[];
  if (!safeLines.length) {
    return '';
  }

  return `${title}\n${safeLines.join('\n')}`;
}
