import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "AI Agent Concept Builds | Selerim",
  description:
    "Explore clearly labeled logistics and legal AI agent concepts: workflows, security boundaries, and outcome metrics to validate. Not client case studies.",
  path: "/case-studies",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
