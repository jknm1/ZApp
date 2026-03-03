import { motion } from "motion/react";
import { Target, TrendingUp, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

interface Challenge {
  id: string;
  name: string;
  accountSize: number;
  profitTarget: number;
  currentProfit: number;
  maxDrawdown: number;
  currentDrawdown: number;
  tradingDays: number;
  daysCompleted: number;
  status: "active" | "completed" | "failed";
  startDate: string;
}

export function ChallengeProgress() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      name: "$10K Challenge",
      accountSize: 10000,
      profitTarget: 1000,
      currentProfit: 450,
      maxDrawdown: 500,
      currentDrawdown: 120,
      tradingDays: 30,
      daysCompleted: 12,
      status: "active",
      startDate: "2026-02-15",
    },
    {
      id: "2",
      name: "$50K Challenge",
      accountSize: 50000,
      profitTarget: 3000,
      currentProfit: 0,
      maxDrawdown: 2500,
      currentDrawdown: 0,
      tradingDays: 60,
      daysCompleted: 0,
      status: "active",
      startDate: "2026-03-01",
    },
  ]);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-400 bg-blue-500/20";
      case "completed":
        return "text-green-400 bg-green-500/20";
      case "failed":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {challenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 p-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
                  <p className="text-slate-400 text-sm">
                    Account Size: {formatCurrency(challenge.accountSize)}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(challenge.status)}`}>
                {challenge.status}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Current Profit</p>
                <p className="text-green-400 font-semibold">
                  {formatCurrency(challenge.currentProfit)}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Profit Target</p>
                <p className="text-white font-semibold">
                  {formatCurrency(challenge.profitTarget)}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Max Drawdown</p>
                <p className="text-orange-400 font-semibold">
                  {formatCurrency(challenge.maxDrawdown)}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Days Left</p>
                <p className="text-blue-400 font-semibold">
                  {challenge.tradingDays - challenge.daysCompleted}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="p-6 space-y-6">
            {/* Profit Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Profit Progress</span>
                </div>
                <span className="text-slate-400 text-sm">
                  {calculateProgress(challenge.currentProfit, challenge.profitTarget).toFixed(1)}%
                </span>
              </div>
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${calculateProgress(challenge.currentProfit, challenge.profitTarget)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>${challenge.currentProfit.toLocaleString()}</span>
                <span>${challenge.profitTarget.toLocaleString()}</span>
              </div>
            </div>

            {/* Drawdown Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">Drawdown Used</span>
                </div>
                <span className="text-slate-400 text-sm">
                  {calculateProgress(challenge.currentDrawdown, challenge.maxDrawdown).toFixed(1)}%
                </span>
              </div>
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${calculateProgress(challenge.currentDrawdown, challenge.maxDrawdown)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute h-full rounded-full ${
                    calculateProgress(challenge.currentDrawdown, challenge.maxDrawdown) > 80
                      ? "bg-gradient-to-r from-red-500 to-rose-500"
                      : "bg-gradient-to-r from-orange-500 to-amber-500"
                  }`}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>${challenge.currentDrawdown.toLocaleString()}</span>
                <span>${challenge.maxDrawdown.toLocaleString()}</span>
              </div>
            </div>

            {/* Trading Days Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Trading Days</span>
                </div>
                <span className="text-slate-400 text-sm">
                  {challenge.daysCompleted} / {challenge.tradingDays}
                </span>
              </div>
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${calculateProgress(challenge.daysCompleted, challenge.tradingDays)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{challenge.daysCompleted} days completed</span>
                <span>{challenge.tradingDays - challenge.daysCompleted} days left</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-pink-500/30 transition-all"
            >
              View Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-all"
            >
              Trade Now
            </motion.button>
          </div>
        </motion.div>
      ))}

      {/* No Challenges State */}
      {challenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center"
        >
          <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Active Challenges
          </h3>
          <p className="text-slate-400 mb-6">
            Start a challenge to track your progress towards getting funded
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all">
            Start Challenge
          </button>
        </motion.div>
      )}
    </div>
  );
}
