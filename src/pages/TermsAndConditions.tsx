import Navbar from "../components/Navbar";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-sm text-gray-400 mb-10">
            Last Updated: 25 January 2026
          </p>

          <div className="space-y-10 text-gray-300 leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
              <p>
                By using DevConnect, you agree to these Terms & Conditions. If you do not agree, you must not use
                the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">2. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining your account security</li>
                <li>You must provide accurate information</li>
                <li>You must not impersonate others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">3. Platform Usage</h2>
              <p>
                DevConnect is meant for professional and educational developer networking. You may not use it
                to post illegal, abusive, or misleading content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">4. User Content</h2>
              <p>
                You retain ownership of the content you post. By uploading content, you grant DevConnect
                permission to display and distribute it within the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">5. Prohibited Activities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Spamming, scraping, or abusing the platform</li>
                <li>Uploading malicious code or links</li>
                <li>Harassment, hate speech, or threats</li>
                <li>Attempting to hack or disrupt the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">6. Termination</h2>
              <p>
                We reserve the right to suspend or delete accounts that violate these terms or harm the
                platform or its users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">7. Disclaimer</h2>
              <p>
                DevConnect is provided "as is". We do not guarantee uninterrupted or error-free service.
                We are not responsible for user-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">8. Limitation of Liability</h2>
              <p>
                DevConnect shall not be liable for any indirect, incidental, or consequential damages arising
                from use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">9. Changes to Terms</h2>
              <p>
                These terms may be updated. Continued use of DevConnect means you accept the revised terms.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
