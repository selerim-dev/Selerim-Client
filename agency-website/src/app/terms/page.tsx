'use client';

import React from 'react';
import { LegalDoc } from '../../components/site';

const SECTIONS = [
  { h: 'Acceptance of terms', p: 'By accessing or using the Selerim website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our site or services.' },
  { h: 'Use of service', p: 'You agree to use the website and services only for lawful purposes and in accordance with these Terms. You may not use our services for any illegal or unauthorized purpose.' },
  { h: 'Intellectual property', p: 'All content, trademarks, logos, and data on this site are the property of Selerim or its licensors. You may not copy, reproduce, or distribute any content without our written permission.' },
  { h: 'User responsibilities', p: 'You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device. You agree to accept responsibility for all activities that occur under your account.' },
  { h: 'Disclaimers', p: 'The website and services are provided “as is” and “as available” without warranties of any kind, either express or implied. Selerim does not warrant that the site will be error-free or uninterrupted.' },
  { h: 'Limitation of liability', p: 'To the fullest extent permitted by law, Selerim shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of, or inability to use, the service.' },
  { h: 'Indemnification', p: 'You agree to indemnify and hold harmless Selerim, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the site or violation of these Terms.' },
  { h: 'Governing law', p: 'These Terms & Conditions are governed by and construed in accordance with the laws of the jurisdiction in which Selerim operates, without regard to its conflict of law provisions.' },
  { h: 'Changes to terms', p: 'Selerim reserves the right to update or modify these Terms & Conditions at any time. Continued use of the site after any changes constitutes acceptance of those changes.' },
];

export default function TermsPage() {
  return <LegalDoc eyebrow="Legal" title="Terms &" accent="conditions." updated="The fine print for using Selerim." sections={SECTIONS} />;
}
