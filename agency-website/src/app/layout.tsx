import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Atmosphere from "../components/Atmosphere";
import CursorCode from "../components/CursorCode";
import { NotificationProvider } from "../components/NotificationProvider";
import { AuthProvider } from "../lib/auth-context";
import { ThemeProvider, themeInitScript } from "../lib/theme-context";
import { pageMeta } from "../lib/seo";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
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
    title: "Selerim — Production-Ready AI Integrations for Products and Workflows",
    description:
      "Selerim helps teams add useful AI to existing products and workflows, including AI product features, internal assistants, RAG over company data, agentic workflows, and system integrations.",
    path: "/",
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${interTight.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="min-h-screen antialiased">
        <ThemeProvider defaultMode="dark">
          <NotificationProvider>
            <AuthProvider>
              <Atmosphere />
              <Header />
              <main>{children}</main>
              <Footer />
              {/* Decorative, client-only, presentational. Rendered last so it
                  never precedes real content in the DOM. */}
              <CursorCode />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
