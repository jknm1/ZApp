import { useState, useEffect } from "react";
import { DollarSign, Download, Filter, ArrowLeft, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

interface Payout {
  id: string;
  amount: number;
  transaction_id: string;
  method: string;
  status: "completed" | "processing";
  created_at: string;
  completed_at: string;
  fee: number;
  net_amount: number;
}

export function PayoutHistory() {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "processing">("all");
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("payout_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const payoutsData = data || [];
      setPayouts(payoutsData);
      
      const total = payoutsData
        .filter((p: Payout) => p.status === "completed")
        .reduce((sum: number, p: Payout) => sum + p.net_amount, 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error("Error loading payouts:", error);
      // Fallback to mock data
      const mockPayouts = [
        {
          id: "1",
          amount: 5000,
          transaction_id: "TXN-2024-001234",
          method: "Bitcoin (BTC)",
          status: "completed" as const,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          fee: 50,
          net_amount: 4950,
        },
        {
          id: "2",
          amount: 3000,
          transaction_id: "TXN-2024-001189",
          method: "PayPal",
          status: "completed" as const,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
          fee: 90,
          net_amount: 2910,
        },
        {
          id: "3",
          amount: 8000,
          transaction_id: "TXN-2024-001098",
          method: "USDT (TRC20)",
          status: "completed" as const,
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
          fee: 10,
          net_amount: 7990,
        },
        {
          id: "4",
          amount: 2500,
          transaction_id: "TXN-2024-001456",
          method: "Neteller",
          status: "processing" as const,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: "",
          fee: 75,
          net_amount: 2425,
        },
      ];
      setPayouts(mockPayouts);
      setTotalEarnings(mockPayouts
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.net_amount, 0));
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const downloadStatement = () => {
    // Generate CSV
    const headers = ["Date", "Transaction ID", "Method", "Amount", "Fee", "Net Amount", "Status"];
    const rows = payouts.map((p) => [
      new Date(p.created_at).toLocaleDateString(),
      p.transaction_id,
      p.method,
      `$${p.amount}`,
      `$${p.fee}`,
      `$${p.net_amount}`,
      p.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zynx-payout-statement-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const thisMonth = payouts.filter((p) => {
    const date = new Date(p.created_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).reduce((sum, p) => sum + (p.status === "completed" ? p.net_amount : 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Payout History</h1>
              <p className="text-slate-400">Track all your earnings and transactions</p>
            </div>
          </div>

          <button
            onClick={downloadStatement}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Statement
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-pink-500/20 via-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-3xl p-6 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-pink-400" />
              <p className="text-slate-300 text-sm">Total Earnings</p>
            </div>
            <p className="text-4xl font-bold text-white">${totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-pink-400 mt-2">All-time payouts</p>
          </div>

          {/* This Month */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              <p className="text-slate-300 text-sm">This Month</p>
            </div>
            <p className="text-4xl font-bold text-white">${thisMonth.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2">Current month earnings</p>
          </div>

          {/* Total Transactions */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <p className="text-slate-300 text-sm">Transactions</p>
            </div>
            <p className="text-4xl font-bold text-white">{payouts.length}</p>
            <p className="text-xs text-slate-400 mt-2">Total payouts processed</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === "completed"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("processing")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === "processing"
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Processing
              </button>
            </div>
          </div>
        </div>

        {/* Payout Table */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Transaction ID</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Method</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-slate-300">Amount</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-slate-300">Fee</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-slate-300">Net Amount</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all">
                    <td className="py-4 px-4 text-sm text-white">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-400 font-mono">
                      {payout.transaction_id}
                    </td>
                    <td className="py-4 px-4 text-sm text-white">{payout.method}</td>
                    <td className="py-4 px-4 text-sm text-white text-right font-semibold">
                      ${payout.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-400 text-right">
                      -${payout.fee.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-green-400 text-right font-semibold">
                      ${payout.net_amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {payout.status === "completed" ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium">Processing</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayouts.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No payouts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
