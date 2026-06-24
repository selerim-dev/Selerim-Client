/**
 * Booking link. Set NEXT_PUBLIC_BOOKING_URL (e.g. a Cal.com / Calendly link)
 * to send "Book a 15-minute intro" CTAs there. Falls back to the contact page
 * so the CTA is never broken.
 */
const rawBooking = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

export const BOOKING_URL = rawBooking && rawBooking.length > 0 ? rawBooking : '/contact';
export const BOOKING_IS_EXTERNAL = /^https?:\/\//i.test(BOOKING_URL);

/** Props to spread on a Link/anchor for the booking URL (handles external safely). */
export const bookingLinkProps = BOOKING_IS_EXTERNAL
  ? { href: BOOKING_URL, target: '_blank', rel: 'noopener noreferrer' }
  : { href: BOOKING_URL };
