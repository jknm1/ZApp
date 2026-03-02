import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Footer } from "../components/Footer";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                <span className="text-2xl font-black text-white">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ZYNX Capital</h1>
                <p className="text-xs text-slate-400">Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-slate-400 mb-6">
            Last Updated: March 2, 2026
          </p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Information We Collect
              </h2>
              <p className="text-slate-400 mb-3">
                Zynx Capital ("we," "our," or "us") collects the following types
                of information when you use our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Personal identification information (name, email address, country)</li>
                <li>Trading experience and preferences</li>
                <li>Account credentials and authentication data</li>
                <li>Trading activity and performance metrics</li>
                <li>Payment and withdrawal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-400 mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>To evaluate funding applications and vet traders</li>
                <li>To provide and maintain our trading platform</li>
                <li>To process withdrawals and manage profit distributions</li>
                <li>To communicate important updates and notifications</li>
                <li>To improve our services and user experience</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Data Security
              </h2>
              <p className="text-slate-400">
                We implement industry-standard security measures to protect your
                personal information. However, no method of transmission over the
                Internet or electronic storage is 100% secure. While we strive to
                use commercially acceptable means to protect your data, we cannot
                guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-slate-400 mb-3">
                We do not sell, trade, or rent your personal information to third
                parties. We may share your information only in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>With prop trading firms as part of the funding process</li>
                <li>With payment processors for withdrawal transactions</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, property, or safety</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Your Rights
              </h2>
              <p className="text-slate-400 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Cookies and Tracking
              </h2>
              <p className="text-slate-400">
                We use cookies and similar tracking technologies to enhance user
                experience and analyze platform usage. You can control cookie
                preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Data Retention
              </h2>
              <p className="text-slate-400">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this Privacy Policy, unless a
                longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                8. Changes to This Policy
              </h2>
              <p className="text-slate-400">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                9. Contact Us
              </h2>
              <p className="text-slate-400">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <p className="text-pink-400 mt-2">
                Email: hello@zynxcorp.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}