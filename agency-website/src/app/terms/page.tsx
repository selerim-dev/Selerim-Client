import Legal from "@/components/marketing/Legal";
export default function Terms() {
  return (
    <Legal
      kind="Terms & conditions."
      description="The terms for using this website. Paid work is governed by a separate service agreement."
      sections={[
        {
          title: "Using this website",
          text: "You may use the site to learn about Selerim and submit a genuine business inquiry. Do not attempt to disrupt the site, misuse its forms, or submit information you are not authorized to share.",
        },
        {
          title: "Inquiries and paid engagements",
          text: "Submitting the intake is not a purchase, does not reserve a start date, and does not create a service agreement. Before paid work begins, we agree on scope, deliverables, fees, timing, access requirements, and acceptance terms in writing. An invoice and agreed kickoff follow that discussion.",
        },
        {
          title: "Prices, timelines, and scope",
          text: "Published prices are in US dollars. The AI Opportunity Audit is $2,500 for a 14-day engagement. A 30-Day Agent Build is quoted at a fixed price of $7,500–$15,000 for one workflow or agent. Timelines depend on the agreed kickoff, required access, and timely client input. Optional care is $1,500–$3,000 per month for an agreed scope. Third-party usage and hosting are separate.",
        },
        {
          title: "Concept builds and outcomes",
          text: "Concept builds are illustrative designs, not completed client engagements or live product demonstrations. Proposed outcome metrics have not been measured. They do not guarantee savings, revenue, accuracy, or other results. Project success measures and evaluation criteria are agreed before a build.",
        },
        {
          title: "Ownership and third-party services",
          text: "The service agreement defines ownership of custom code and deliverables, account access, and handover. Our engagement model provides client ownership of custom deliverables, keys, and documentation. Open-source libraries and third-party products remain subject to their own licenses and terms. Website content and branding belong to Selerim or their respective owners.",
        },
        {
          title: "Review, acceptance, and support",
          text: "A build includes an evaluation harness and agreed acceptance checks. Work is reviewed against its defined scope before sign-off. Remedies, change requests, payment terms, and any support commitments are stated in the service agreement. Optional care is separate from the build; the studio does not provide a general 24/7 on-call service.",
        },
        {
          title: "Website availability and general information",
          text: "We aim to keep information accurate and the site available, but website content is provided as general information and may change. The website is not legal, regulatory, or compliance advice. Specific commitments and responsibilities for an engagement must be agreed in writing.",
        },
        {
          title: "Contact",
          text: "Questions about the website or a potential engagement can be sent to admin@selerim.com. Selerim is based in Houston, Texas.",
        },
      ]}
    />
  );
}
