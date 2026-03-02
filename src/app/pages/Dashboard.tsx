import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import {
  TrendingUp,
  Wallet,
  LogOut,
  Target,
  Copy,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { LiveSupport } from "../components/LiveSupport";
import { ReviewForm } from "../components/ReviewForm";
import { Testimonials } from "../components/Testimonials";
import { motion, AnimatePresence } from "motion/react";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleReviewSubmit = (review: {
    rating: number;
    comment: string;
    name: string;
  }) => {
    const newReview = {
      id: Date.now(),
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      verified: false,
    };
    setUserReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20"
              >
                <span className="text-2xl font-black text-white">Z</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">ZYNX Capital</h1>
                <p className="text-xs text-slate-400">Professional Trading</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)" }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl p-6 shadow-2xl shadow-pink-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-pink-100 text-sm">Account Balance</p>
                <h2 className="text-3xl font-bold text-white">
                  ${user.balance.toLocaleString()}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-300 rounded-full"
              />
              Active Trading Account
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/challenges")}
                className="bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-6 py-4 rounded-2xl font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Apply for Funding
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/wallet")}
                className="bg-slate-800/80 text-white px-6 py-4 rounded-2xl font-medium hover:bg-slate-800 transition-all border border-slate-700 flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                View Wallet
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* MT5 Login Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Your MT5 Login Credentials
          </h3>
          <div className="space-y-4">
            {user.mt5Accounts.map((account) => (
              <motion.div
                key={account.id}
                whileHover={{ scale: 1.01 }}
                className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Account Type</p>
                    <p className="text-white font-medium">
                      {account.accountType}
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Login ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono">{account.login}</p>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(account.login)}
                        className="p-1 text-slate-400 hover:text-pink-400 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-1">Password</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono">
                        {showPasswords[account.id]
                          ? account.password
                          : "••••••••"}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => togglePasswordVisibility(account.id)}
                        className="p-1 text-slate-400 hover:text-pink-400 transition-colors"
                      >
                        {showPasswords[account.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(account.password)}
                        className="p-1 text-slate-400 hover:text-pink-400 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-1">Server</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono">{account.server}</p>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(account.server)}
                        className="p-1 text-slate-400 hover:text-pink-400 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <p className="text-slate-400 text-sm mb-1">Total Profit</p>
            <p className="text-2xl font-bold text-green-400">+$2,450.00</p>
            <p className="text-sm text-slate-500 mt-1">+12.5% this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <p className="text-slate-400 text-sm mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-white">68.5%</p>
            <p className="text-sm text-slate-500 mt-1">142 trades</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <p className="text-slate-400 text-sm mb-1">Active Challenges</p>
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-sm text-slate-500 mt-1">Apply for funding</p>
          </motion.div>
        </div>

        {/* Leave Review Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReviewForm(true)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-2xl font-medium shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Leave a Review
          </motion.button>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Testimonials userReviews={userReviews} />
        </motion.div>
      </main>

      <Footer />

      {/* Live Support Widget */}
      <LiveSupport />

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            onClose={() => setShowReviewForm(false)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}