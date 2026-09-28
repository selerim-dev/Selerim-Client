import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Effects from "@/components/marketing/Effects";
import { ThemeProvider, themeInitScript } from "@/lib/theme-context";
import { pageMeta } from "@/lib/seo";
const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://www.selerim.com"),
  robots: { index: true, follow: true },
  ...pageMeta({
    title: "Secure AI Agents for Your Business | Selerim, Houston",
    description:
      "Founder-led AI agents for US businesses. Secure, confidential workflows. Start with a $2,500 opportunity audit, then a fixed-price 30-day build.",
    path: "/",
  }),
};
const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Selerim",
  url: "https://www.selerim.com",
  email: "admin@selerim.com",
  description: "Founder-led AI integration studio for US businesses.",
  areaServed: "US",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Houston",
    addressRegion: "TX",
    addressCountry: "US",
  },
  founder: { "@type": "Person", name: "Daniel Mireles" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI integration services",
    itemListElement: [
      {
        "@type": "Offer",
        price: "2500",
        priceCurrency: "USD",
        itemOffered: {
          "@type": "Service",
          name: "AI Opportunity Audit",
          description:
            "14-day workflow, data-readiness, and security review with ranked use cases and a fixed-price build quote.",
        },
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${sans.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body id="top">
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Effects />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
