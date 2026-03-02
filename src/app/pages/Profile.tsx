import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User as UserIcon,
  Award,
  FileText,
  Gift,
  Trophy,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Download,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";

type TabType = "accounts" | "certificates" | "details" | "offers" | "leaderboard";

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("accounts");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "accounts" as TabType, label: "Active Accounts", icon: TrendingUp },
    { id: "certificates" as TabType, label: "Certificates", icon: Award },
    { id: "details" as TabType, label: "Personal Details", icon: UserIcon },
    { id: "offers" as TabType, label: "Offers", icon: Gift },
    { id: "leaderboard" as TabType, label: "Leaderboard", icon: Trophy },
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: "Alex Thompson", profit: "$45,230", winRate: "78%" },
    { rank: 2, name: "Sarah Chen", profit: "$38,950", winRate: "74%" },
    { rank: 3, name: "Marcus Johnson", profit: "$35,680", winRate: "72%" },
    { rank: 4, name: user.name, profit: "$2,450", winRate: "68.5%" },
    { rank: 5, name: "Emma Williams", profit: "$1,890", winRate: "65%" },
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
                  <span className="text-2xl font-black text-white">Z</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Profile</h1>
                  <p className="text-xs text-slate-400">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl p-8 mb-8 shadow-2xl shadow-pink-500/20"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-5xl font-black text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-pink-100 mb-3">{user.email}</p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Account Balance</p>
                  <p className="text-lg font-semibold text-white">${user.balance.toFixed(2)}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Total Trades</p>
                  <p className="text-lg font-semibold text-white">0</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-pink-100">Status</p>
                  <p className="text-lg font-semibold text-white">Active</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 mb-8"
        >
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-pink-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Active Accounts */}
          {activeTab === "accounts" && (
            <div className="space-y-6">
              {user.mt5Accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {account.accountType}
                      </h3>
                      <p className="text-slate-400 text-sm">Login: {account.login}</p>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-950/50 rounded-2xl p-4">
                      <p className="text-slate-400 text-sm mb-1">Balance</p>
                      <p className="text-2xl font-bold text-white">${user.balance.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl p-4">
                      <p className="text-slate-400 text-sm mb-1">Total Trades</p>
                      <p className="text-2xl font-bold text-slate-300">0</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl p-4">
                      <p className="text-slate-400 text-sm mb-1">Profit/Loss</p>
                      <p className="text-2xl font-bold text-slate-300">$0.00</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                    View Account Details
                  </button>
                </div>
              ))}

              {user.mt5Accounts.length === 0 && (
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
                  <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Active Accounts
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Apply for funding to get your first trading account
                  </p>
                  <button
                    onClick={() => navigate("/challenges")}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                  >
                    Apply for Funding
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Certificates */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Funded Trader Certificate
                    </h3>
                    <p className="text-slate-400">Issued: March 2, 2026</p>
                  </div>
                  <button className="ml-auto bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-300 mb-4">
                    This certifies that <span className="text-white font-semibold">{user.name}</span> has
                    successfully completed the Zynx Capital evaluation process and
                    is authorized to trade with a funded account.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">Certificate ID: #ZC-{user.id}</p>
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-black text-white">Z</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personal Details */}
          {activeTab === "details" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4">
                  <UserIcon className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Full Name</p>
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4">
                  <Mail className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Email Address</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Country</p>
                    <p className="text-white font-medium">United States</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Member Since</p>
                    <p className="text-white font-medium">March 2026</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl font-medium transition-all">
                Edit Profile
              </button>
            </div>
          )}

          {/* Offers */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-500/10 via-pink-600/10 to-rose-600/10 backdrop-blur-xl rounded-3xl p-8 border border-pink-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Referral Bonus: $100
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Invite friends to Zynx Capital and earn $100 for each funded trader.
                      Your friend gets $50 bonus too!
                    </p>
                    <button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                      Get Referral Link
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Scale-Up Program
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Reach profit targets and scale your account up to $200,000.
                      Available after 3 months of consistent trading.
                    </p>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      Eligible in 3 months
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Top Traders This Month
              </h3>
              <div className="space-y-3">
                {leaderboard.map((trader) => (
                  <motion.div
                    key={trader.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: trader.rank * 0.1 }}
                    className={`bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4 ${
                      trader.name === user.name
                        ? "border-2 border-pink-500/50"
                        : "border border-slate-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        trader.rank === 1
                          ? "bg-yellow-500/20 text-yellow-400"
                          : trader.rank === 2
                          ? "bg-slate-400/20 text-slate-300"
                          : trader.rank === 3
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      #{trader.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{trader.name}</p>
                      <p className="text-slate-400 text-sm">
                        Win Rate: {trader.winRate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{trader.profit}</p>
                      <p className="text-slate-400 text-sm">Total Profit</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}