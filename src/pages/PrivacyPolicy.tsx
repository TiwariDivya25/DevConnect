import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-10">
            Last Updated: 25 January 2026
          </p>

          <div className="space-y-10 text-gray-300 leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
              <p>
                DevConnect is a developer networking platform designed to help users connect, collaborate, 
                share projects, and grow professionally. Your privacy is important to us. This Privacy Policy 
                explains how we collect, use, store, and protect your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><b>Account Data:</b> Name, username, email, profile photo, bio, skills.</li>
                <li><b>Content:</b> Posts, comments, project links, messages, and interactions.</li>
                <li><b>Usage Data:</b> Pages visited, actions taken, IP address, device and browser type.</li>
                <li><b>Authentication:</b> Login tokens and identifiers used for secure access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To create and manage your DevConnect account</li>
                <li>To allow you to connect with other developers</li>
                <li>To display your profile, posts, and projects</li>
                <li>To improve security and prevent misuse</li>
                <li>To improve features, performance, and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">4. Data Sharing</h2>
              <p>
                We do not sell your personal data. Your profile information and posts are visible to other users
                as part of the platform’s purpose. We may share limited data with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Cloud hosting and database providers</li>
                <li>Authentication and security services</li>
                <li>Legal authorities if required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">5. Cookies & Tracking</h2>
              <p>
                DevConnect uses cookies and similar technologies to keep you logged in, maintain sessions, 
                and understand how users interact with the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">6. Data Security</h2>
              <p>
                We use encrypted connections, secure databases, and access controls to protect your data. 
                However, no online service can be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">7. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>View and update your profile information</li>
                <li>Delete your posts or account</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy. Continued use of DevConnect after changes means you accept
                the revised policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
