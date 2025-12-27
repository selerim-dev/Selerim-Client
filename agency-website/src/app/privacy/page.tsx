"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-blue py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Privacy Policy</h1>
        <div className="space-y-8 text-white/80 text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">1. Information Collection</h2>
            <p>We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us. We may also collect information automatically through cookies and similar technologies.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">2. Use of Information</h2>
            <p>We use your information to provide, maintain, and improve our services, communicate with you, and comply with legal obligations. We may also use your information to send you updates and marketing communications, which you can opt out of at any time.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">3. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">4. Data Security</h2>
            <p>We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">5. Third-Party Services</h2>
            <p>We may use third-party services to help operate our business and the site. These third parties may have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for other purposes.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">6. User Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the email provided below.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">7. Children's Privacy</h2>
            <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us to have it removed.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">8. Changes to Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Continued use of the site constitutes acceptance of the new policy.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">9. Contact Information</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:contact@selerim.com" className="underline text-blue-300">contact@selerim.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 