import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "Secure AI Agent Integration Services | Selerim",
  description:
    "AI agents for operations-heavy US businesses. Start with a data and security review, then build one workflow with human oversight and client ownership.",
  path: "/services",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
