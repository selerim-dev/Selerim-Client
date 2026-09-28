import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "src/app/dashboard/**",
      "src/app/owner/**",
      "src/components/CompanyLogosCarousel.tsx",
      "src/components/ContactForm.tsx",
      "src/components/DashboardHome.tsx",
      "src/components/DashboardSidebar.tsx",
      "src/components/Layout.tsx",
      "src/components/Modal.tsx",
      "src/components/ProjectPaymentManager.tsx",
      "src/components/TestimonialCarousel.tsx",
      "src/components/Toast.tsx",
      "src/components/owner/**",
      "src/config/api.ts",
      "src/interfaces/auth.ts",
      "src/lib/auth.ts",
      "src/lib/auth-context.tsx",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
