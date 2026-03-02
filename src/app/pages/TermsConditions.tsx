import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Footer } from "../components/Footer";

export function TermsConditions() {
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
                <p className="text-xs text-slate-400">Terms & Conditions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-6">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 mb-6">Last Updated: March 2, 2026</p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Agreement to Terms
              </h2>
              <p className="text-slate-400">
                By accessing or using the Zynx Capital platform, you agree to be
                bound by these Terms and Conditions. If you do not agree with any
                part of these terms, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Eligibility
              </h2>
              <p className="text-slate-400 mb-3">
                To use Zynx Capital services, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from trading under applicable laws</li>
                <li>Provide accurate and complete information during registration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Funding Application Process
              </h2>
              <p className="text-slate-400 mb-3">
                Zynx Capital operates a selective funding program:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Applications are reviewed within 72 hours of submission</li>
                <li>
                  We reserve the right to accept or reject any application at our
                  sole discretion
                </li>
                <li>Selected traders must pass our vetting and interview process</li>
                <li>Funding is provided at no cost to qualified traders</li>
                <li>Not all applicants will be approved for funding</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Profit Split Agreement
              </h2>
              <p className="text-slate-400 mb-3">
                For all funded accounts, the profit distribution is as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Trader receives 40% of profits generated</li>
                <li>Zynx Capital receives 60% of profits generated</li>
                <li>Profit splits are calculated on realized profits only</li>
                <li>Withdrawals are processed within 1-3 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Trading Rules and Requirements
              </h2>
              <p className="text-slate-400 mb-3">
                Funded traders must adhere to the following rules:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Maximum daily loss limits as specified in the account terms</li>
                <li>Maximum overall drawdown limits</li>
                <li>No use of prohibited trading strategies (e.g., hedging, arbitrage)</li>
                <li>Compliance with all risk management guidelines</li>
                <li>No sharing of account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Account Termination
              </h2>
              <p className="text-slate-400 mb-3">
                Zynx Capital reserves the right to terminate a funded account if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Trading rules are violated</li>
                <li>Fraudulent activity is detected</li>
                <li>Maximum drawdown limits are exceeded</li>
                <li>The trader fails to meet performance requirements</li>
                <li>Any breach of these Terms and Conditions occurs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Intellectual Property
              </h2>
              <p className="text-slate-400">
                All content, trademarks, logos, and intellectual property on the
                Zynx Capital platform are owned by Zynx Corporation. You may not
                use, reproduce, or distribute any content without express written
                permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                8. Disclaimer of Warranties
              </h2>
              <p className="text-slate-400">
                The Zynx Capital platform is provided "as is" without warranties
                of any kind. We do not guarantee uninterrupted service,
                profitability, or specific trading results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                9. Limitation of Liability
              </h2>
              <p className="text-slate-400">
                Zynx Capital and Zynx Corporation shall not be liable for any
                indirect, incidental, special, or consequential damages arising
                from your use of the platform or participation in the funding
                program.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                10. Modifications to Terms
              </h2>
              <p className="text-slate-400">
                We reserve the right to modify these Terms and Conditions at any
                time. Changes will be effective immediately upon posting. Your
                continued use of the platform constitutes acceptance of the
                modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                11. Governing Law
              </h2>
              <p className="text-slate-400">
                These Terms and Conditions are governed by and construed in
                accordance with applicable international trading laws and
                regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                12. Contact Information
              </h2>
              <p className="text-slate-400">
                For questions or concerns regarding these Terms and Conditions,
                please contact us at:
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