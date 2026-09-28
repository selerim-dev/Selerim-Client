import {
  PageIntro,
  Offers,
  Security,
  Closing,
} from "@/components/marketing/Sections";
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Services / AI that fits the way you work"
        title="One useful workflow."
        accent="A meaningful difference."
        description="Agents for document intake, operational follow-up, knowledge retrieval, and repetitive coordination. Connected to your existing systems, with defined permissions and human review."
      />
      <Offers />
      <Security />
      <Closing />
    </>
  );
}
