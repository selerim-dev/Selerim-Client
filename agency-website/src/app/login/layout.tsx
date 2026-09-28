import type { Metadata } from "next";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Private access | Selerim",
  alternates: { canonical: "/login" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
