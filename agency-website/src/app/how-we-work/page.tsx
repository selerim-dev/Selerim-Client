import {
  PageIntro,
  Process,
  Trust,
  FAQ,
  Closing,
} from "@/components/marketing/Sections";
export default function How() {
  return (
    <>
      <PageIntro
        eyebrow="Process / Direct, deliberate delivery"
        title="A clear path from"
        accent="idea to ownership."
        description="Audit → Blueprint → Build → Handover. One accountable engineer, written decisions, and working progress you can review asynchronously."
      />
      <Process />
      <Trust />
      <FAQ />
      <Closing />
    </>
  );
}
