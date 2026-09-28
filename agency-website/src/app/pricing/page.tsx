import {
  PageIntro,
  Offers,
  Process,
  FAQ,
  Closing,
} from "@/components/marketing/Sections";
export default function Pricing() {
  return (
    <>
      <PageIntro
        eyebrow="Offers / Fixed scope, clear ownership"
        title="Know what you’re buying."
        accent="Know what comes next."
        description="Start with a $2,500 audit. Choose a fixed-price build only when the workflow, data, and success criteria make sense."
      />
      <Offers />
      <Process />
      <FAQ />
      <Closing />
    </>
  );
}
