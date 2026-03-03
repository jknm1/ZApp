import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Wallet as WalletIcon,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "motion/react";

type WithdrawMethod = "crypto" | "neteller" | "paypal" | null;
type CryptoType = "btc" | "usdt" | null;

export function Wallet() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Calculate profit split - trader gets 40%, company gets 60%
  const totalProfit = user.balance;
  const traderShare = totalProfit * 0.4;
  const companyShare = totalProfit * 0.6;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    
    // Check for insufficient balance
    if (user.balance === 0) {
      alert("Insufficient Balance\n\nAvailable Balance: $0.00\n\nYou don't have sufficient funds to withdraw. Please ensure you have a positive balance before attempting a withdrawal.");
      return;
    }
    
    if (amount > user.balance) {
      alert(`Insufficient Balance\n\nAvailable Balance: $${user.balance.toFixed(2)}\n\nWithdrawal amount ($${amount.toFixed(2)}) exceeds your available balance.`);
      return;
    }
    
    if (selectedMethod && amount > 0) {
      let message = `Withdrawal request of $${withdrawAmount} via ${selectedMethod.toUpperCase()}`;
      if (selectedMethod === "crypto") {
        message += ` (${selectedCrypto?.toUpperCase()}) to address: ${walletAddress}`;
      }
      message += " has been submitted. Processing time: 1-3 business days.";
      
      alert(message);
      setShowWithdraw(false);
      setSelectedMethod(null);
      setSelectedCrypto(null);
      setWithdrawAmount("");
      setWalletAddress("");
    }
  };

  const resetWithdraw = () => {
    setShowWithdraw(false);
    setSelectedMethod(null);
    setSelectedCrypto(null);
    setWithdrawAmount("");
    setWalletAddress("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800">
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
                  <h1 className="text-2xl font-bold text-white">
                    ZYNX CAPITAL
                  </h1>
                  <p className="text-xs text-slate-400">Wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-3xl p-8 shadow-2xl shadow-pink-500/20 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <WalletIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-pink-100 text-sm">Available Balance</p>
              <h2 className="text-4xl font-bold text-white">
                ${user.balance.toFixed(2)}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-pink-100 text-sm mb-1">Total Profit</p>
              <p className="text-xl font-semibold text-white">
                ${totalProfit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-pink-100 text-sm mb-1">Your Share (40%)</p>
              <p className="text-xl font-semibold text-white">
                ${traderShare.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profit Split Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            Profit Split Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl">
              <div>
                <p className="text-slate-400 text-sm">Trader Share</p>
                <p className="text-white font-semibold">You receive 40%</p>
              </div>
              <p className="text-2xl font-bold text-pink-400">
                ${traderShare.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl">
              <div>
                <p className="text-slate-400 text-sm">Company Share</p>
                <p className="text-white font-semibold">Zynx Capital 60%</p>
              </div>
              <p className="text-2xl font-bold text-slate-300">
                ${companyShare.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Withdraw Section */}
        <AnimatePresence mode="wait">
          {!showWithdraw ? (
            <motion.button
              key="withdraw-button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWithdraw(true)}
              className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
            >
              <ArrowDownLeft className="w-5 h-5" />
              Withdraw Funds
            </motion.button>
          ) : (
            <motion.div
              key="withdraw-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Withdraw Funds
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Available for withdrawal: ${traderShare.toFixed(2)}
              </p>

              <form onSubmit={handleWithdrawSubmit} className="space-y-6">
                {/* Withdrawal Methods */}
                {!selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Select Withdrawal Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMethod("crypto")}
                        className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/50 hover:border-pink-500 transition-all"
                      >
                        <DollarSign className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <p className="text-white font-medium text-sm">
                          Cryptocurrency
                        </p>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMethod("neteller")}
                        className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/50 hover:border-pink-500 transition-all"
                      >
                        <WalletIcon className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <p className="text-white font-medium text-sm">Neteller</p>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMethod("paypal")}
                        className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/50 hover:border-pink-500 transition-all"
                      >
                        <DollarSign className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <p className="text-white font-medium text-sm">PayPal</p>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Crypto Selection */}
                {selectedMethod === "crypto" && !selectedCrypto && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Select Cryptocurrency
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCrypto("btc")}
                        className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/50 hover:border-pink-500 transition-all"
                      >
                        <p className="text-white font-medium">Bitcoin (BTC)</p>
                        <p className="text-slate-400 text-xs mt-1">Network fee: ~$2</p>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCrypto("usdt")}
                        className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/50 hover:border-pink-500 transition-all"
                      >
                        <p className="text-white font-medium">Tether (USDT)</p>
                        <p className="text-slate-400 text-xs mt-1">Network fee: ~$1</p>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Wallet Address Input for Crypto */}
                {selectedMethod === "crypto" && selectedCrypto && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedCrypto.toUpperCase()} Wallet Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full px-4 py-3.5 pr-12 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-mono text-sm"
                        placeholder={`Paste your ${selectedCrypto.toUpperCase()} address`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.readText().then(text => {
                            setWalletAddress(text);
                          });
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                      Double-check your wallet address. Transactions cannot be reversed.
                    </p>
                  </motion.div>
                )}

                {/* Amount (show only after method selection) */}
                {((selectedMethod === "crypto" && selectedCrypto && walletAddress) || 
                  (selectedMethod && selectedMethod !== "crypto")) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Withdrawal Amount
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={traderShare}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      placeholder="Enter amount"
                      required
                    />
                    <p className="text-slate-500 text-xs mt-2">
                      Maximum: ${traderShare.toFixed(2)}
                    </p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetWithdraw}
                    className="flex-1 bg-slate-800 text-white py-3.5 rounded-2xl font-medium hover:bg-slate-700 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !selectedMethod || 
                      !withdrawAmount || 
                      (selectedMethod === "crypto" && (!selectedCrypto || !walletAddress))
                    }
                    className="flex-1 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white py-3.5 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Withdrawal
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-4 border border-slate-800"
        >
          <p className="text-slate-400 text-sm">
            <span className="text-pink-400 font-semibold">Note:</span>{" "}
            Withdrawals are processed within 1-3 business days. A profit split
            of 40/60 applies to all funded accounts.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}