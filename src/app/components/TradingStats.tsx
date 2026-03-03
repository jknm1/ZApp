import { motion, AnimatePresence } from "motion/react";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  AlertCircle,
  Link as LinkIcon,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { LinkMT5 } from "./LinkMT5";
import {
  fetchMT5AccountInfo,
  fetchMT5TradeHistory,
  fetchMT5OpenPositions,
  calculateTradingStatistics,
  MT5AccountInfo,
  MT5Trade,
  MT5TradeHistory,
  TradingStatistics,
} from "../lib/mt5Service";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TradingStatsProps {
  onClose: () => void;
}

export function TradingStats({ onClose }: TradingStatsProps) {
  const { user } = useAuth();
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [showLinkMT5, setShowLinkMT5] = useState(false);

  // MT5 Real-time Data
  const [mt5AccountInfo, setMt5AccountInfo] = useState<MT5AccountInfo | null>(null);
  const [openPositions, setOpenPositions] = useState<MT5Trade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<MT5TradeHistory[]>([]);
  const [statistics, setStatistics] = useState<TradingStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAccountData();
  }, [user]);

  useEffect(() => {
    if (isAccountLinked && accountData) {
      loadMT5Data();
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadMT5Data(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAccountLinked, accountData]);

  const fetchAccountData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("mt5_accounts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (data) {
        setIsAccountLinked(true);
        setAccountData(data);
      } else {
        setIsAccountLinked(false);
      }
    }
  };

  const loadMT5Data = async (isRefresh = false) => {
    if (!accountData) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch all MT5 data in parallel
      const [accountInfo, positions, history] = await Promise.all([
        fetchMT5AccountInfo(
          accountData.broker_server,
          accountData.account_number,
          accountData.investor_password
        ),
        fetchMT5OpenPositions(
          accountData.broker_server,
          accountData.account_number,
          accountData.investor_password,
          accountData.metaapi_account_id // Pass MetaAPI ID
        ),
        fetchMT5TradeHistory(
          accountData.broker_server,
          accountData.account_number,
          accountData.investor_password,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          new Date(),
          accountData.metaapi_account_id // Pass MetaAPI ID
        ),
      ]);

      setMt5AccountInfo(accountInfo);
      setOpenPositions(positions);
      setTradeHistory(history);

      if (history.length > 0) {
        const stats = calculateTradingStatistics(history);
        setStatistics(stats);
      }

      if (isRefresh) {
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      console.error("Error loading MT5 data:", error);
      toast.error("Failed to load trading data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Generate chart data from trade history
  const getProfitChartData = () => {
    if (!tradeHistory || tradeHistory.length === 0) return [];

    // Group trades by day and calculate cumulative profit
    const dailyProfits: { [key: string]: number } = {};
    let cumulativeProfit = 0;

    const sortedHistory = [...tradeHistory].sort(
      (a, b) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime()
    );

    sortedHistory.forEach((trade) => {
      const date = new Date(trade.closeTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      cumulativeProfit += trade.profit;
      dailyProfits[date] = cumulativeProfit;
    });

    return Object.entries(dailyProfits).map(([date, profit]) => ({
      date,
      profit: Math.round(profit * 100) / 100,
    }));
  };

  // Generate trades by symbol data
  const getTradesBySymbol = () => {
    if (!tradeHistory || tradeHistory.length === 0) return [];

    const symbolCounts: { [key: string]: number } = {};
    tradeHistory.forEach((trade) => {
      symbolCounts[trade.symbol] = (symbolCounts[trade.symbol] || 0) + 1;
    });

    return Object.entries(symbolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symbol, count]) => ({
        pair: symbol,
        trades: count,
      }));
  };

  // Generate win/loss pie chart data
  const getWinLossData = () => {
    if (!statistics) {
      return [
        { name: "Wins", value: 0, color: "#10b981" },
        { name: "Losses", value: 0, color: "#ef4444" },
      ];
    }

    return [
      { name: "Wins", value: statistics.winningTrades, color: "#10b981" },
      { name: "Losses", value: statistics.losingTrades, color: "#ef4444" },
    ];
  };

  const profitData = getProfitChartData();
  const tradesData = getTradesBySymbol();
  const winLossData = getWinLossData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-800 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-rose-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-pink-500" />
              Trading Performance
            </h2>
            {isAccountLinked && mt5AccountInfo && (
              <p className="text-sm text-slate-400 mt-1">
                {mt5AccountInfo.server} • Account #{mt5AccountInfo.login}
                {mt5AccountInfo.name && ` • ${mt5AccountInfo.name}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAccountLinked && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadMT5Data(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="text-sm font-medium">Refresh</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {!isAccountLinked ? (
            // Empty State - No MT5 Account Linked
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/30">
                <LinkIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Link Your MT5 Account
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Connect your MetaTrader 5 account to view real-time trading
                statistics, performance metrics, and detailed analytics.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLinkMT5(true)}
                className="bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-pink-500/30 transition-all inline-flex items-center gap-2"
              >
                <LinkIcon className="w-5 h-5" />
                Link MT5 Account
              </motion.button>

              {/* Preview Stats (Greyed Out) */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Total Trades</p>
                  <p className="text-3xl font-bold text-white">---</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Win Rate</p>
                  <p className="text-3xl font-bold text-white">---%</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Net Profit</p>
                  <p className="text-3xl font-bold text-white">$---</p>
                </div>
              </div>
            </div>
          ) : loading ? (
            // Loading State
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full mx-auto mb-4"
              />
              <p className="text-slate-400">Loading trading data...</p>
            </div>
          ) : (
            // Full Trading Statistics Dashboard
            <div className="space-y-6">
              {/* Account Overview Cards */}
              {mt5AccountInfo && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Balance */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-pink-500/10 to-rose-600/10 rounded-2xl p-5 border border-pink-500/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-pink-400" />
                      </div>
                      <p className="text-slate-300 text-sm font-medium">Balance</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${mt5AccountInfo.balance.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {mt5AccountInfo.currency}
                    </p>
                  </motion.div>

                  {/* Equity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-5 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-slate-300 text-sm font-medium">Equity</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${mt5AccountInfo.equity.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Free: ${mt5AccountInfo.freeMargin.toLocaleString()}
                    </p>
                  </motion.div>

                  {/* Profit/Loss */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`bg-gradient-to-br ${
                      mt5AccountInfo.profit >= 0
                        ? "from-green-500/10 to-green-600/10 border-green-500/20"
                        : "from-red-500/10 to-red-600/10 border-red-500/20"
                    } rounded-2xl p-5 border`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 ${
                          mt5AccountInfo.profit >= 0 ? "bg-green-500/20" : "bg-red-500/20"
                        } rounded-xl flex items-center justify-center`}
                      >
                        {mt5AccountInfo.profit >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-slate-300 text-sm font-medium">P&L</p>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        mt5AccountInfo.profit >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {mt5AccountInfo.profit >= 0 ? "+" : ""}$
                      {mt5AccountInfo.profit.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {((mt5AccountInfo.profit / mt5AccountInfo.balance) * 100).toFixed(2)}%
                    </p>
                  </motion.div>

                  {/* Margin Level */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-slate-300 text-sm font-medium">Margin Level</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {mt5AccountInfo.marginLevel.toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Leverage: 1:{mt5AccountInfo.leverage}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Trading Statistics */}
              {statistics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Total Trades</p>
                    <p className="text-2xl font-bold text-white">{statistics.totalTrades}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                      {statistics.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Profit Factor</p>
                    <p className="text-2xl font-bold text-white">
                      {statistics.profitFactor > 100
                        ? "∞"
                        : statistics.profitFactor.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Net Profit</p>
                    <p
                      className={`text-2xl font-bold ${
                        statistics.netProfit >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${statistics.netProfit.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profit Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    Cumulative Profit
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={profitData}>
                      <defs>
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#ec4899"
                        fill="url(#profitGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Win/Loss Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-pink-400" />
                    Win/Loss Ratio
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={winLossData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {winLossData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Trades by Symbol */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-pink-400" />
                    Most Traded Pairs
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={tradesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="pair" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="trades" fill="#ec4899" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Additional Stats */}
                {statistics && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-400" />
                      Performance Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Average Win</p>
                        <p className="text-xl font-bold text-green-400 mt-1">
                          ${statistics.averageWin.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Average Loss</p>
                        <p className="text-xl font-bold text-red-400 mt-1">
                          ${statistics.averageLoss.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Largest Win</p>
                        <p className="text-xl font-bold text-green-400 mt-1">
                          ${statistics.largestWin.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Largest Loss</p>
                        <p className="text-xl font-bold text-red-400 mt-1">
                          ${statistics.largestLoss.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Open Positions */}
              {openPositions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Open Positions ({openPositions.length})
                  </h3>
                  <div className="space-y-3">
                    {openPositions.map((position) => (
                      <div
                        key={position.id}
                        className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-semibold">
                              {position.symbol}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                position.type === "BUY"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {position.type}
                            </span>
                            <span className="text-slate-400 text-sm">
                              {position.volume} lots
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Open: {position.openPrice}</span>
                            <span>Current: {position.currentPrice}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xl font-bold ${
                              position.profit >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {position.profit >= 0 ? "+" : ""}$
                            {position.profit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* LinkMT5 Modal */}
      <AnimatePresence>
        {showLinkMT5 && user && (
          <LinkMT5
            onClose={() => setShowLinkMT5(false)}
            userId={user.id}
            onSuccess={() => {
              fetchAccountData();
              setShowLinkMT5(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}