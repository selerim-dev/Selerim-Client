import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "AI Audit & Agent Build Pricing | Selerim",
  description:
    "$2,500 AI Opportunity Audit in 14 days. Fixed $7,500–$15,000 30-day agent builds. Optional care from $1,500 per month.",
  path: "/pricing",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
