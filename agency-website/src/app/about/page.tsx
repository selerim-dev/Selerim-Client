import {
  PageIntro,
  Trust,
  Security,
  Closing,
} from "@/components/marketing/Sections";
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="The studio / Houston, Texas"
        title="Built around the work."
        accent="And the people doing it."
        description="Selerim is Daniel Mireles’s founder-led AI integration studio. Senior engineering, thoughtful data boundaries, and a practical focus on the operations that keep your business moving."
      />
      <Trust />
      <Security />
      <Closing />
    </>
  );
}
