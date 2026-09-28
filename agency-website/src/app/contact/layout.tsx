import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "Request an AI Opportunity Audit | Selerim",
  description:
    "Tell us about your workflow. Request a $2,500, 14-day AI Opportunity Audit. Founder-led, async-first, with a reply within 24 hours.",
  path: "/contact",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
