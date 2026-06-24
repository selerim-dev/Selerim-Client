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
  title: "Selerim | Production-ready AI inside your product",
  description:
    "Selerim builds production-ready AI into real products and businesses: agents wired to your systems, RAG over your company data, MCP-style tool layers, and internal automation. We ship it and maintain it.",
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
              <CursorCode />
              <Header />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
