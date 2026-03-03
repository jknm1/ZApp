import { motion } from "motion/react";
import { TrendingUp, Users, DollarSign, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function SocialProofTicker() {
  const [tradersFunded, setTradersFunded] = useState(0);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [activeTraders, setActiveTraders] = useState(0);

  // Animate numbers on mount
  useEffect(() => {
    // Animate traders funded from 0 to 20
    animateNumber(0, 20, 2000, setTradersFunded);

    // Animate total payouts from 0 to 2.4M
    animateNumber(0, 2.4, 2500, setTotalPayouts);

    // Animate active traders from 0 to 15
    animateNumber(0, 15, 1800, setActiveTraders);
  }, []);

  const animateNumber = (
    start: number,
    end: number,
    duration: number,
    setter: (value: number) => void
  ) => {
    const startTime = Date.now();
    const difference = end - start;

    const step = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + difference * easeOutQuart;

      setter(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 border-b border-pink-500/20 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-8 flex-wrap text-sm">
          {/* Traders Funded */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={tradersFunded}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-bold text-white"
              >
                {Math.floor(tradersFunded)}
              </motion.span>
              <span className="text-slate-400">
                trader{Math.floor(tradersFunded) !== 1 ? "s" : ""} funded this month
              </span>
            </div>
          </motion.div>

          {/* Separator */}
          <div className="hidden md:block w-px h-6 bg-slate-700" />

          {/* Total Payouts */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400">$</span>
              <motion.span
                key={totalPayouts}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-bold text-green-400"
              >
                {totalPayouts.toFixed(1)}M
              </motion.span>
              <span className="text-slate-400">in payouts</span>
            </div>
          </motion.div>

          {/* Separator */}
          <div className="hidden md:block w-px h-6 bg-slate-700" />

          {/* Active Traders Now */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-4 h-4 text-white" />
              </div>
              {/* Pulse animation */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={activeTraders}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-bold text-blue-400"
              >
                {Math.floor(activeTraders)}
              </motion.span>
              <span className="text-slate-400">active traders now</span>
            </div>
          </motion.div>

          {/* Trending Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 border border-pink-500/30 rounded-full"
          >
            <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs font-semibold text-pink-300">
              🔥 Trending
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
