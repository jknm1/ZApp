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
  Edit,
  Save,
  X,
  BookOpen,
  GraduationCap,
  DollarSign,
  Activity,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";

type TabType = "accounts" | "certificates" | "details" | "leaderboard" | "withdrawal" | "payouts" | "applications" | "achievements" | "kyc" | "referrals" | "journal" | "education";

export function Profile() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(("leaderboard"));
  const [showCertificateMessage, setShowCertificateMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedCountry, setEditedCountry] = useState("United States");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSaveProfile = () => {
    if (updateUserProfile) {
      updateUserProfile({ name: editedName });
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user.name);
    setEditedCountry("United States");
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "accounts" as TabType, label: "Active Accounts", icon: TrendingUp },
    { id: "certificates" as TabType, label: "Certificates", icon: Award },
    { id: "details" as TabType, label: "Personal Details", icon: UserIcon },
    { id: "leaderboard" as TabType, label: "Leaderboard", icon: Trophy },
    { id: "withdrawal" as TabType, label: "Withdrawal", icon: DollarSign },
    { id: "payouts" as TabType, label: "Payouts", icon: Activity },
    { id: "applications" as TabType, label: "Applications", icon: FileText },
    { id: "achievements" as TabType, label: "Achievements", icon: Award },
    { id: "kyc" as TabType, label: "KYC", icon: Shield },
    { id: "referrals" as TabType, label: "Referrals", icon: Gift },
    { id: "journal" as TabType, label: "Journal", icon: BookOpen },
    { id: "education" as TabType, label: "Education", icon: GraduationCap },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <span className="text-xl sm:text-2xl font-black text-white">Z</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">Profile</h1>
                  <p className="text-[10px] sm:text-xs text-slate-400">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 w-full">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl shadow-pink-500/20"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-pink-100 mb-3 text-sm sm:text-base">{user.email}</p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
                  <p className="text-xs text-pink-100">Account Balance</p>
                  <p className="text-base sm:text-lg font-semibold text-white">${user.balance.toFixed(2)}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
                  <p className="text-xs text-pink-100">Total Trades</p>
                  <p className="text-base sm:text-lg font-semibold text-white">0</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
                  <p className="text-xs text-pink-100">Status</p>
                  <p className="text-base sm:text-lg font-semibold text-white">Active</p>
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
          className="bg-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-800 mb-6 sm:mb-8"
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-pink-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline text-xs sm:text-sm">{tab.label}</span>
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
                  <button
                    onClick={() => {
                      setShowCertificateMessage(true);
                      setTimeout(() => setShowCertificateMessage(false), 3000);
                    }}
                    className="ml-auto bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {showCertificateMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-2xl text-sm"
                  >
                    No certificate available for download at this time.
                  </motion.div>
                )}

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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Personal Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-2xl text-sm"
                >
                  {saveMessage}
                </motion.div>
              )}

              <div className="space-y-4">
                {/* Full Name - Editable */}
                <div className="bg-slate-950/50 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <UserIcon className="w-5 h-5 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-2">Full Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                        />
                      ) : (
                        <p className="text-white font-medium">{user.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email - Not Editable */}
                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4">
                  <Mail className="w-5 h-5 text-pink-400" />
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">Email Address</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  {isEditing && (
                    <span className="text-xs text-slate-500 italic">Cannot be changed</span>
                  )}
                </div>

                {/* Country - Editable */}
                <div className="bg-slate-950/50 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-2">Country</p>
                      {isEditing ? (
                        <select
                          value={editedCountry}
                          onChange={(e) => setEditedCountry(e.target.value)}
                          className="w-full bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                        >
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Spain">Spain</option>
                          <option value="Italy">Italy</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="Singapore">Singapore</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-white font-medium">{editedCountry}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Since - Not Editable */}
                <div className="bg-slate-950/50 rounded-2xl p-4 flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Member Since</p>
                    <p className="text-white font-medium">March 2026</p>
                  </div>
                </div>
              </div>

              {/* Edit/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl font-medium transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 overflow-hidden">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Top Traders This Month
                </h3>
                <div className="relative h-[500px] overflow-hidden">
                  {/* Fade gradient at top */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-transparent z-10 pointer-events-none" />
                  
                  {/* Scrolling container */}
                  <motion.div
                    animate={{
                      y: [0, -400],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="space-y-3"
                  >
                    {/* Duplicate leaderboard for seamless loop */}
                    {[...leaderboard, ...leaderboard, ...leaderboard].map((trader, index) => (
                      <motion.div
                        key={`${trader.rank}-${index}`}
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
                  </motion.div>
                  
                  {/* Fade gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/60 via-slate-900/40 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Withdrawal */}
          {activeTab === "withdrawal" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
              <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Withdrawal Request
              </h3>
              <p className="text-slate-400 mb-6">
                Request a withdrawal from your funded account.
              </p>
              <button
                onClick={() => navigate("/withdrawal")}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                Go to Withdrawal Page
              </button>
            </div>
          )}

          {/* Payouts */}
          {activeTab === "payouts" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
              <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Payout History
              </h3>
              <p className="text-slate-400 mb-6">
                View all your past payouts and transaction logs.
              </p>
              <button
                onClick={() => navigate("/payout-history")}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                View Payout History
              </button>
            </div>
          )}

          {/* Applications */}
          {activeTab === "applications" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
              <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Application Tracker
              </h3>
              <p className="text-slate-400 mb-6">
                Track the status of your funding applications.
              </p>
              <button
                onClick={() => navigate("/application-tracker")}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                View Applications
              </button>
            </div>
          )}

          {/* Achievements */}
          {activeTab === "achievements" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Your Achievements
              </h3>
              <p className="text-slate-400 mb-6">
                You have 0 achievements unlocked.
              </p>
              <div className="text-slate-500 text-sm">
                Start trading to unlock your first achievement!
              </div>
            </div>
          )}

          {/* KYC */}
          {activeTab === "kyc" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
              <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                KYC Verification
              </h3>
              <p className="text-slate-400 mb-6">
                Complete your identity verification to access all features.
              </p>
              <button
                onClick={() => navigate("/kyc")}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                Start Verification
              </button>
            </div>
          )}

          {/* Referrals */}
          {activeTab === "referrals" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-800 text-center">
              <Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Referral Program Coming Soon
              </h3>
              <p className="text-slate-400">
                We're working on building an amazing referral program for our traders.
                Stay tuned for updates!
              </p>
            </div>
          )}

          {/* Journal */}
          {activeTab === "journal" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Trading Journal</h3>
                <button
                  onClick={() => navigate("/journal")}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  Open Journal
                </button>
              </div>
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Start Your Trading Journal</h4>
                <p className="text-slate-400 mb-6">
                  Track your trades, emotions, and strategies to improve your trading performance.
                </p>
              </div>
            </div>
          )}

          {/* Education */}
          {activeTab === "education" && (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-pink-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white">Trading Education</h3>
                  <p className="text-slate-400">Join our exclusive Telegram community</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500/10 via-pink-600/10 to-rose-600/10 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 text-center">
                <p className="text-slate-300 mb-6">
                  Get access to exclusive trading courses, live market analysis, expert strategies, 
                  and connect with our community of successful traders.
                </p>
                <a
                  href="https://t.me/+0j1pp2Wk75IzODE0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  <GraduationCap className="w-5 h-5" />
                  Join Telegram Community
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}