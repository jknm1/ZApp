import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  date: string;
  pair: string;
  type: "buy" | "sell";
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  profit: number;
  notes: string;
  emotions: string;
  strategy: string;
}

export function TradingJournal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<JournalEntry>>({});

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleAddEntry = () => {
    if (!formData.date || !formData.pair || !formData.type || !formData.entryPrice || !formData.exitPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: formData.date!,
      pair: formData.pair!,
      type: formData.type!,
      entryPrice: formData.entryPrice!,
      exitPrice: formData.exitPrice!,
      lotSize: formData.lotSize || 0.1,
      profit: ((formData.exitPrice! - formData.entryPrice!) * (formData.lotSize || 0.1) * 100000) * (formData.type === "buy" ? 1 : -1),
      notes: formData.notes || "",
      emotions: formData.emotions || "",
      strategy: formData.strategy || "",
    };

    setEntries([newEntry, ...entries]);
    setShowNewEntry(false);
    setFormData({});
    toast.success("Trade journal entry added!");
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    toast.success("Entry deleted");
  };

  const totalProfit = entries.reduce((sum, entry) => sum + entry.profit, 0);
  const winRate = entries.length > 0 
    ? (entries.filter((e) => e.profit > 0).length / entries.length) * 100 
    : 0;
  const totalTrades = entries.length;
  const winningTrades = entries.filter((e) => e.profit > 0).length;

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
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">Trading Journal</h1>
                  <p className="text-[10px] sm:text-xs text-slate-400 hidden xs:block">Track your trading performance</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewEntry(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-3 sm:px-4 py-2 rounded-xl font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline text-sm">New Entry</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">Total Trades</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{totalTrades}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${
                totalProfit >= 0 ? "bg-green-500/20" : "bg-red-500/20"
              }`}>
                <DollarSign className={`w-4 h-4 sm:w-5 sm:h-5 ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`} />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">Total P/L</p>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">Win Rate</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{winRate.toFixed(1)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">Winning Trades</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{winningTrades}</p>
          </motion.div>
        </div>

        {/* Journal Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Journal Entries</h3>

          <div className="space-y-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        entry.profit >= 0 ? "bg-green-500/20" : "bg-red-500/20"
                      }`}>
                        {entry.profit >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-400" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{entry.pair}</h4>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          entry.profit >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {entry.profit >= 0 ? "+" : ""}${entry.profit.toFixed(2)}
                        </p>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.type === "buy" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {entry.type.toUpperCase()}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Trade Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Entry Price</p>
                      <p className="text-white font-medium">{entry.entryPrice.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Exit Price</p>
                      <p className="text-white font-medium">{entry.exitPrice.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Lot Size</p>
                      <p className="text-white font-medium">{entry.lotSize}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Strategy</p>
                      <p className="text-white font-medium">{entry.strategy || "N/A"}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {entry.notes && (
                    <div className="bg-slate-900/50 rounded-xl p-4 mb-3">
                      <p className="text-slate-400 text-xs mb-2">Trade Notes</p>
                      <p className="text-white text-sm">{entry.notes}</p>
                    </div>
                  )}

                  {/* Emotions */}
                  {entry.emotions && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">Emotions:</span>
                      <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                        {entry.emotions}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No Journal Entries</h4>
              <p className="text-slate-400 mb-6">
                Start logging your trades to improve your trading performance
              </p>
              <button
                onClick={() => setShowNewEntry(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-pink-500/30 transition-all"
              >
                Add Your First Trade
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewEntry(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">New Journal Entry</h3>
                <button
                  onClick={() => setShowNewEntry(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Date and Pair */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Date *</label>
                    <input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Currency Pair *</label>
                    <input
                      type="text"
                      placeholder="EUR/USD"
                      value={formData.pair || ""}
                      onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Trade Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, type: "buy" })}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        formData.type === "buy"
                          ? "bg-green-500 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, type: "sell" })}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        formData.type === "sell"
                          ? "bg-red-500 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      SELL
                    </button>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Entry Price *</label>
                    <input
                      type="number"
                      step="0.00001"
                      placeholder="1.08500"
                      value={formData.entryPrice || ""}
                      onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Exit Price *</label>
                    <input
                      type="number"
                      step="0.00001"
                      placeholder="1.09200"
                      value={formData.exitPrice || ""}
                      onChange={(e) => setFormData({ ...formData, exitPrice: parseFloat(e.target.value) })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Lot Size</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.5"
                      value={formData.lotSize || ""}
                      onChange={(e) => setFormData({ ...formData, lotSize: parseFloat(e.target.value) })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Strategy and Emotions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Strategy</label>
                    <input
                      type="text"
                      placeholder="Breakout Strategy"
                      value={formData.strategy || ""}
                      onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Emotions</label>
                    <input
                      type="text"
                      placeholder="Confident"
                      value={formData.emotions || ""}
                      onChange={(e) => setFormData({ ...formData, emotions: e.target.value })}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Trade Notes</label>
                  <textarea
                    rows={4}
                    placeholder="What went well? What could be improved?"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddEntry}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Entry
                  </button>
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}