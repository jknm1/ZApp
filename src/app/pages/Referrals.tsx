import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Gift,
  Copy,
  Users,
  DollarSign,
  Share2,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { toast } from "sonner";

export function Referrals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const referralCode = `ZYNX-${user.id.slice(0, 8).toUpperCase()}`;
  const referralLink = `https://zynxcapital.com/ref/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join ZYNX CAPITAL",
          text: "Get funded for free! Use my referral link to join ZYNX CAPITAL and start trading with a funded account.",
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  // Mock referral data
  const referralStats = {
    totalReferrals: 3,
    activeReferrals: 2,
    totalEarnings: 200,
    pendingEarnings: 100,
  };

  const referralHistory = [
    {
      id: "1",
      name: "John Smith",
      status: "funded",
      earnings: 100,
      date: "2026-02-15",
    },
    {
      id: "2",
      name: "Sarah Williams",
      status: "funded",
      earnings: 100,
      date: "2026-02-20",
    },
    {
      id: "3",
      name: "Mike Johnson",
      status: "pending",
      earnings: 100,
      date: "2026-03-01",
    },
  ];

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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Referral Program</h1>
                  <p className="text-xs text-slate-400">Earn $100 per funded trader</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl p-8 mb-8 shadow-2xl shadow-pink-500/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-3">
                Earn $100 per Referral! 🎉
              </h2>
              <p className="text-pink-100 text-lg mb-4">
                Invite friends to ZYNX CAPITAL. When they get funded, you earn $100 and
                they get a $50 bonus!
              </p>
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Your Bonus</p>
                  <p className="text-xl font-bold text-white">$100</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Friend Bonus</p>
                  <p className="text-xl font-bold text-white">$50</p>
                </div>
              </div>
            </div>
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <Gift className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-slate-400 text-sm">Total Referrals</p>
            </div>
            <p className="text-3xl font-bold text-white">{referralStats.totalReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-slate-400 text-sm">Funded Traders</p>
            </div>
            <p className="text-3xl font-bold text-white">{referralStats.activeReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-slate-400 text-sm">Total Earnings</p>
            </div>
            <p className="text-3xl font-bold text-white">${referralStats.totalEarnings}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-slate-400 text-sm">Pending</p>
            </div>
            <p className="text-3xl font-bold text-white">${referralStats.pendingEarnings}</p>
          </motion.div>
        </div>

        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Your Referral Link</h3>
          <p className="text-slate-400 mb-6">
            Share this link with friends to start earning rewards
          </p>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 flex items-center justify-between">
              <code className="text-pink-400 text-sm font-mono">{referralLink}</code>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyLink}
                className="ml-3 p-2 text-slate-400 hover:text-pink-400 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-400 text-sm">
              💡 <strong>Pro Tip:</strong> Share on social media, trading communities, or with
              friends who want to become funded traders!
            </p>
          </div>
        </motion.div>

        {/* Referral History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Referral History</h3>

          <div className="space-y-3">
            {referralHistory.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {referral.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{referral.name}</p>
                    <p className="text-slate-400 text-sm">
                      Joined {new Date(referral.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold mb-1 ${
                      referral.status === "funded" ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    ${referral.earnings}
                  </p>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      referral.status === "funded"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {referral.status === "funded" ? "Funded" : "Pending"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {referralHistory.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No Referrals Yet</h4>
              <p className="text-slate-400">
                Share your referral link to start earning rewards!
              </p>
            </div>
          )}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">How It Works</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-pink-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">1. Share Your Link</h4>
              <p className="text-slate-400 text-sm">
                Send your unique referral link to friends who want to become traders
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">2. They Sign Up</h4>
              <p className="text-slate-400 text-sm">
                Your friend creates an account and passes the challenge
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">3. Earn Rewards</h4>
              <p className="text-slate-400 text-sm">
                Get $100 when they're funded. They get $50 bonus too!
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
