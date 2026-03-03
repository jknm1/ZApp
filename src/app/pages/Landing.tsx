import { useNavigate } from "react-router";
import { TrendingUp, Trophy, Target, Users, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-pink-600/20 to-purple-600/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/50"
            >
              <span className="text-4xl font-black text-white">Z</span>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">ZYNX CAPITAL</h1>
              <p className="text-slate-400">Professional Trading</p>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Get Funded.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500">
                Trade for Free.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Join elite traders funded by Zynx Capital. We acquire prop firms,
              pass challenges, and fund the best traders at zero cost.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 text-center">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
                $50K+
              </p>
              <p className="text-slate-300">Starting Capital</p>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 text-center">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
                40%
              </p>
              <p className="text-slate-300">Profit Split</p>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 text-center">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
                100%
              </p>
              <p className="text-slate-300">Free Funding</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              How Zynx Capital Works
            </h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our unique model removes all barriers to trading success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Trophy,
                title: "We Acquire Firms",
                description:
                  "Zynx Corporation acquires and partners with established prop trading firms globally.",
              },
              {
                icon: Target,
                title: "Pass Challenges",
                description:
                  "Our team completes trading challenges and evaluation processes to secure funded accounts.",
              },
              {
                icon: Users,
                title: "Interview & Vet",
                description:
                  "We carefully interview and vet traders, analyzing history, strategy, and risk management.",
              },
              {
                icon: Shield,
                title: "Fund the Best",
                description:
                  "Only the best traders receive funded accounts at zero cost. Keep up to 40% of profits!",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
              >
                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-pink-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3 text-center">
                  {step.title}
                </h4>
                <p className="text-slate-400 text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              Why Choose Zynx Capital?
            </h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join thousands of funded traders worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "No Upfront Costs",
                description:
                  "Zero fees, no challenge purchase required. We cover everything.",
              },
              {
                title: "Fast Approval",
                description:
                  "Applications reviewed within 72 hours. Start trading quickly.",
              },
              {
                title: "Elite Community",
                description:
                  "Join a select group of vetted, professional traders.",
              },
              {
                title: "Fair Profit Split",
                description:
                  "Keep 40% of your trading profits with fast withdrawals.",
              },
              {
                title: "MT5 Platform",
                description:
                  "Trade on the industry-standard MetaTrader 5 platform.",
              },
              {
                title: "24/7 Support",
                description:
                  "Round-the-clock assistance from our dedicated support team.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
              >
                <CheckCircle2 className="w-10 h-10 text-pink-400 mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-pink-500/10 via-pink-600/10 to-rose-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Funded?
            </h3>
            <p className="text-xl text-slate-300 mb-8">
              Join the elite. Start your journey to becoming a funded trader today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm mb-1">
            Powered by{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              Zynx Corporation
            </span>
          </p>
          <p className="text-slate-500 text-xs">
            © 2026 Zynx Capital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}