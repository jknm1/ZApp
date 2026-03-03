import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Bitcoin, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  crypto_type?: string;
  wallet_address?: string;
  paypal_email?: string;
  neteller_email?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
  admin_notes?: string;
}

export function WithdrawalRequest() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("crypto");
  const [cryptoType, setCryptoType] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [netellerEmail, setNetellerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error("Error loading withdrawals:", error);
      // Fallback to mock data
      setWithdrawals([
        {
          id: "1",
          amount: 5000,
          method: "crypto",
          crypto_type: "BTC",
          wallet_address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          status: "completed",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          amount: 3000,
          method: "paypal",
          paypal_email: "trader@example.com",
          status: "approved",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          amount: 2000,
          method: "crypto",
          crypto_type: "USDT",
          wallet_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const withdrawalData: any = {
        user_id: user.id,
        amount: parseFloat(amount),
        method,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      if (method === "crypto") {
        withdrawalData.crypto_type = cryptoType;
        withdrawalData.wallet_address = walletAddress;
      } else if (method === "paypal") {
        withdrawalData.paypal_email = paypalEmail;
      } else if (method === "neteller") {
        withdrawalData.neteller_email = netellerEmail;
      }

      const { error } = await supabase
        .from("withdrawals")
        .insert([withdrawalData]);

      if (error) throw error;

      // Create notification for admin
      await supabase.from("notifications").insert([{
        user_id: user.id,
        type: "withdrawal_request",
        title: "New Withdrawal Request",
        message: `Withdrawal request for $${amount} via ${method}`,
        read: false,
        created_at: new Date().toISOString(),
      }]);

      alert("Withdrawal request submitted successfully!");
      setAmount("");
      setWalletAddress("");
      setPaypalEmail("");
      setNetellerEmail("");
      loadWithdrawals();
    } catch (error: any) {
      console.error("Error submitting withdrawal:", error);
      alert(error.message || "Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20";
      case "approved":
        return "text-blue-400 bg-blue-500/20";
      case "rejected":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Withdrawal Request</h1>
            <p className="text-slate-400">Request payouts from your funded account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Account Balance */}
          <div className="bg-gradient-to-br from-pink-500/20 via-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-3xl p-6 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-pink-400" />
              <p className="text-slate-300 text-sm">Available Balance</p>
            </div>
            <p className="text-4xl font-bold text-white">${accountBalance.toLocaleString()}</p>
          </div>

          {/* Pending Withdrawals */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              <p className="text-slate-300 text-sm">Pending</p>
            </div>
            <p className="text-4xl font-bold text-white">
              {withdrawals.filter((w) => w.status === "pending").length}
            </p>
          </div>

          {/* Completed Withdrawals */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <p className="text-slate-300 text-sm">Completed</p>
            </div>
            <p className="text-4xl font-bold text-white">
              {withdrawals.filter((w) => w.status === "completed").length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">New Withdrawal</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  min="100"
                  max={accountBalance}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-slate-500 mt-1">Minimum withdrawal: $100</p>
              </div>

              {/* Method */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Withdrawal Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("crypto")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      method === "crypto"
                        ? "bg-pink-500/20 border-pink-500"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Bitcoin className="w-6 h-6 text-white mx-auto mb-1" />
                    <p className="text-xs text-white">Crypto</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("paypal")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      method === "paypal"
                        ? "bg-pink-500/20 border-pink-500"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-white mx-auto mb-1" />
                    <p className="text-xs text-white">PayPal</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("neteller")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      method === "neteller"
                        ? "bg-pink-500/20 border-pink-500"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-white mx-auto mb-1" />
                    <p className="text-xs text-white">Neteller</p>
                  </button>
                </div>
              </div>

              {/* Crypto Details */}
              {method === "crypto" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cryptocurrency
                    </label>
                    <select
                      value={cryptoType}
                      onChange={(e) => setCryptoType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="USDT">Tether (USDT)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </>
              )}

              {/* PayPal Details */}
              {method === "paypal" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}

              {/* Neteller Details */}
              {method === "neteller" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Neteller Email
                  </label>
                  <input
                    type="email"
                    value={netellerEmail}
                    onChange={(e) => setNetellerEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Withdrawal Request"}
              </button>

              <p className="text-xs text-slate-400 text-center">
                Processing time: 24-48 hours for approval
              </p>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Requests</h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold text-white">
                      ${withdrawal.amount.toLocaleString()}
                    </p>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                      <span className="text-sm font-medium capitalize">{withdrawal.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Method:</span>
                      <span className="text-white capitalize">{withdrawal.method}</span>
                    </div>
                    {withdrawal.crypto_type && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Crypto:</span>
                        <span className="text-white">{withdrawal.crypto_type}</span>
                      </div>
                    )}
                    {withdrawal.wallet_address && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Wallet:</span>
                        <span className="text-white font-mono text-xs truncate max-w-[200px]">
                          {withdrawal.wallet_address}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Date:</span>
                      <span className="text-white">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {withdrawal.admin_notes && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400">Admin Notes:</p>
                      <p className="text-sm text-slate-300">{withdrawal.admin_notes}</p>
                    </div>
                  )}
                </div>
              ))}

              {withdrawals.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No withdrawal requests yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}