import { PageIntro, Proof, Closing } from "@/components/marketing/Sections";
export default function Concepts() {
  return (
    <>
      <PageIntro
        eyebrow="Concepts / Possibilities, not promises"
        title="See where an agent"
        accent="could fit."
        description="Working logistics and legal concepts, shown with fictional data and measured fixture checks. Watch the product tours. These are not client work or live-model performance claims."
      />
      <Proof />
      <Closing />
    </>
  );
}
