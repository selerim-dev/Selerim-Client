import type { Metadata } from "next";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NotificationProvider } from '../components/NotificationProvider';
import { AuthProvider } from '../lib/auth-context';

export const metadata: Metadata = {
  title: "Selerim - Custom Software Development",
  description: "Transform your ideas into reality with our custom software development services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-dark-blue">
        <NotificationProvider>
          <AuthProvider>
            <Header />
            <main className="pt-[48px] md:pt-[56px]">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
