'use client';

import React from 'react';
import { LegalDoc } from '../../components/site';

const SECTIONS = [
  { h: 'Information collection', p: 'We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us. We may also collect information automatically through cookies and similar technologies.' },
  { h: 'Use of information', p: 'We use your information to provide, maintain, and improve our services, communicate with you, and comply with legal obligations. We may also send you updates and marketing communications, which you can opt out of at any time.' },
  { h: 'Cookies', p: 'We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.' },
  { h: 'Data security', p: 'We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.' },
  { h: 'Third-party services', p: 'We may use third-party services to help operate our business and the site. These third parties may have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for other purposes.' },
  { h: 'User rights', p: 'You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the email provided below.' },
  { h: 'Children’s privacy', p: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us to have it removed.' },
  { h: 'Changes to policy', p: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Continued use of the site constitutes acceptance of the new policy.' },
  {
    h: 'Contact information',
    p: (
      <>
        If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
        <a href="mailto:admin@selerim.com" className="link-underline text-ink">admin@selerim.com</a>.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalDoc eyebrow="Legal" title="Privacy" accent="policy." updated="How we handle your data." sections={SECTIONS} />;
}
