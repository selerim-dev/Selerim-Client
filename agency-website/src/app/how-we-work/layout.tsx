import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "Audit, Blueprint, Build, Handover | Selerim",
  description:
    "A clear, async-first process: a 14-day opportunity audit, an agreed blueprint, a fixed-price 30-day agent build, and a complete handover.",
  path: "/how-we-work",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
