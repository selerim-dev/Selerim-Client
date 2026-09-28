import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "Daniel Mireles — Founder-led AI Studio | Selerim",
  description:
    "Meet Selerim, a Houston-based, founder-led AI integration studio. Senior-only engineering, async collaboration, and client-owned systems.",
  path: "/about",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
