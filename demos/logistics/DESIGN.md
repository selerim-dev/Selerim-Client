# The exception desk — interface direction

This concept uses Selerim's existing Inter Tight / Instrument Serif typography and lavender accent. The product is a document review workspace: one shipment, its evidence, and one explicit human decision.

## Research references

- [Linear Intake](https://linear.app/intake) and [Triage](https://linear.app/docs/triage): focused inbox, compact status filters, keyboard navigation, and one selected item at a time.
- [Ramp Accounts Payable](https://ramp.com/accounts-payable): source evidence alongside a review action. The shipment record comparison stays visible while the document scrolls.
- [Attio](https://attio.com/): restrained surfaces, clear typography, compact navigation, and deliberate spacing.
- [Pallet](https://www.pallet.com/): logistics documents and operational exceptions as the product's concrete subject matter.

These informed interaction patterns, not copied layouts or assets. Icons and document treatment are authored locally. No third-party scripts, remote fonts, or product screenshots ship with the application.

## Implemented interactions

Review / Ready / Sent filters; shipment and finding search; original PDF links; BOL/POD switching; document-to-record discrepancy comparison; approval followed by a separate simulated send; decision history; complete activity log; command menu (Cmd/Ctrl+K); shipment navigation (J/K); search focus (/); responsive navigation and stacked mobile review; reduced-motion support.

The read-only source, approval gate, synthetic recipient restrictions, and append-only event handling remain server-side. Styling and JavaScript cannot authorize sends. Template mode and the local outbox are explicitly identified.

## Verification

The 20 dataset, parsing, approval, audit, drafting, and HTTP tests pass. Browser checks cover desktop and narrow mobile layouts, keyboard controls, and the two-step approval flow. Automated accessibility checks supplement visual inspection; they are not a complete accessibility certification.
