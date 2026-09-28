import Legal from "@/components/marketing/Legal";
export default function Privacy() {
  return (
    <Legal
      kind="Privacy policy."
      description="A practical explanation of the information this website handles."
      sections={[
        {
          title: "Information you choose to share",
          text: "The audit intake collects your name, email, company, revenue band, workflow description, systems, timeline, and budget band. We use these details to review your inquiry, respond, and discuss a potential engagement. Do not submit confidential documents, credentials, or personal information about your customers or clients through this form.",
        },
        {
          title: "How inquiries are delivered",
          text: "The website is hosted on Vercel. Intake information is validated in your browser and sent through Web3Forms to the Selerim inbox. These providers process the information needed to host the site and deliver your inquiry. Hosting and security services may process technical information such as IP addresses and request details.",
        },
        {
          title: "No AI processing of the intake",
          text: "This intake does not send your answers to an AI model. The former public strategy generator is no longer available. Any model use involving your business data is discussed separately as part of an engagement, including access, provider settings, and retention requirements.",
        },
        {
          title: "Preferences and site storage",
          text: "The site stores your chosen light or dark appearance in your browser’s local storage. This version of the site does not add advertising trackers or marketing analytics. Service providers may maintain technical logs for hosting, security, and delivery.",
        },
        {
          title: "Access and retention",
          text: "Inquiry details are used for evaluating and responding to your request and, if applicable, arranging an engagement. We limit access to what is needed for those purposes. Project data handling and retention are agreed separately before sensitive system access. Contact us to ask about information held about you or to request correction or deletion, subject to applicable recordkeeping obligations.",
        },
        {
          title: "Confidential projects",
          text: "An initial inquiry is not a place to exchange sensitive records. We can arrange an NDA and agree on an appropriate exchange method before reviewing confidential material. A project’s security requirements, access permissions, and third-party processing are defined in its scope.",
        },
        {
          title: "Changes and contact",
          text: "We may update this page as the website or its providers change. The date above identifies this version. For privacy questions or requests, contact admin@selerim.com.",
        },
      ]}
    />
  );
}
