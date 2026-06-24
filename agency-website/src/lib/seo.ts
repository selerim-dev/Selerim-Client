import type { Metadata } from 'next';

/** Build complete, consistent per-page metadata (title, description, canonical, OG, Twitter). */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'Selerim',
      title,
      description,
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
