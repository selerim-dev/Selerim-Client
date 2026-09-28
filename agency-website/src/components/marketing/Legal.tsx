import { PageIntro } from "./Sections";
export default function Legal({
  kind,
  description,
  sections,
}: {
  kind: string;
  description: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <>
      <PageIntro
        eyebrow="Selerim / Updated September 28, 2026"
        title={kind}
        description={description}
      />
      <article className="wrap legal-content">
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <p>
          Questions? <a href="mailto:admin@selerim.com">admin@selerim.com</a> ·
          Houston, TX.
        </p>
      </article>
    </>
  );
}
