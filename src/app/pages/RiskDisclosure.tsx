import { useNavigate } from "react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Footer } from "../components/Footer";

export function RiskDisclosure() {
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
                <h1 className="text-2xl font-bold text-white">ZYNX CAPITAL</h1>
                <p className="text-xs text-slate-400">Risk Disclosure</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-3xl p-6 mb-6 flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              Important Risk Warning
            </h3>
            <p className="text-slate-300">
              Trading foreign exchange, stocks, commodities, and other financial
              instruments carries a high level of risk and may not be suitable
              for all investors. Please read this disclosure carefully before
              participating in the Zynx Capital funding program.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-6">
            Risk Disclosure Statement
          </h1>
          <p className="text-slate-400 mb-6">Last Updated: March 2, 2026</p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. General Risk Warning
              </h2>
              <p className="text-slate-400">
                Trading in financial markets involves substantial risk of loss.
                The high degree of leverage available can work against you as
                well as for you. Before deciding to participate in funded
                trading, you should carefully consider your investment
                objectives, level of experience, and risk appetite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Market Volatility
              </h2>
              <p className="text-slate-400 mb-3">Financial markets are subject to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Rapid and significant price fluctuations</li>
                <li>Unpredictable market movements</li>
                <li>Gap openings and slippage</li>
                <li>Low liquidity conditions</li>
                <li>Economic and political events affecting prices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Leverage Risk
              </h2>
              <p className="text-slate-400">
                Leverage can amplify both profits and losses. While trading with
                Zynx Capital funded accounts, you should be aware that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>Small market movements can result in large account changes</li>
                <li>You can lose your entire funded account balance</li>
                <li>Leverage magnifies the impact of adverse market movements</li>
                <li>Risk management is critical to long-term success</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. No Guarantee of Profits
              </h2>
              <p className="text-slate-400">
                Zynx Capital makes no representations or guarantees that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>You will earn profits from trading activities</li>
                <li>Past performance is indicative of future results</li>
                <li>Any specific trading strategy will be successful</li>
                <li>You will maintain your funded account status</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Technical Risks
              </h2>
              <p className="text-slate-400 mb-3">
                Trading platforms are subject to technical risks including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Internet connectivity issues</li>
                <li>Platform malfunctions or outages</li>
                <li>Delays in order execution</li>
                <li>Data feed errors or interruptions</li>
                <li>Hardware or software failures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Funding Program Risks
              </h2>
              <p className="text-slate-400">
                Participation in the Zynx Capital funding program involves
                specific risks:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>Accounts may be terminated for rule violations</li>
                <li>Drawdown limits must be strictly adhered to</li>
                <li>Trading restrictions may limit your strategy options</li>
                <li>Profit splits reduce your share of gains</li>
                <li>Not all applicants will be approved for funding</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Psychological Factors
              </h2>
              <p className="text-slate-400">
                Trading can be emotionally challenging. Traders should be aware
                of:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>Emotional decision-making during volatile markets</li>
                <li>Stress from managing losing positions</li>
                <li>Pressure to meet profit targets</li>
                <li>Fear of missing out (FOMO) on trades</li>
                <li>Overconfidence after winning streaks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                8. Regulatory Considerations
              </h2>
              <p className="text-slate-400">
                Trading regulations vary by jurisdiction. You are responsible
                for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>Understanding local trading regulations</li>
                <li>Ensuring compliance with tax obligations</li>
                <li>Verifying your eligibility to trade in your country</li>
                <li>Reporting income from trading activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                9. Information Accuracy
              </h2>
              <p className="text-slate-400">
                While we strive to provide accurate information, Zynx Capital:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>Does not guarantee the accuracy of market data</li>
                <li>Is not responsible for third-party information</li>
                <li>May experience delays in data transmission</li>
                <li>Cannot prevent all technical errors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                10. Acknowledgment
              </h2>
              <p className="text-slate-400">
                By using Zynx Capital services, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4 mt-3">
                <li>You have read and understood this Risk Disclosure</li>
                <li>You accept all risks associated with trading</li>
                <li>You will not hold Zynx Capital liable for trading losses</li>
                <li>You understand that trading involves substantial risk</li>
                <li>You are solely responsible for your trading decisions</li>
              </ul>
            </section>

            <section className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-6 mt-8">
              <h2 className="text-xl font-semibold text-pink-400 mb-3">
                Seek Professional Advice
              </h2>
              <p className="text-slate-300">
                If you do not understand the risks involved in trading or if you
                have any doubts about the suitability of trading for your
                personal circumstances, we strongly recommend that you seek
                independent financial advice from a qualified professional.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                11. Contact Information
              </h2>
              <p className="text-slate-400">
                For questions regarding this Risk Disclosure, please contact:
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