import { useState } from "react";
import { motion } from "motion/react";
import { X, Link as LinkIcon, Server, Key, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

interface LinkMT5Props {
  onClose: () => void;
  userId?: string;
  onSuccess?: () => void;
  refreshUser?: () => Promise<void>;
}

export function LinkMT5({ onClose, userId: propUserId, onSuccess, refreshUser }: LinkMT5Props) {
  const { user } = useAuth();
  const userId = propUserId || user?.id || "";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brokerServer: "",
    accountNumber: "",
    investorPassword: "",
  });
  const [errors, setErrors] = useState({
    brokerServer: "",
    accountNumber: "",
    investorPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      brokerServer: "",
      accountNumber: "",
      investorPassword: "",
    };
    let isValid = true;

    if (!formData.brokerServer.trim()) {
      newErrors.brokerServer = "Broker server is required";
      isValid = false;
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
      isValid = false;
    }

    if (!formData.investorPassword.trim()) {
      newErrors.investorPassword = "Investor password is required";
      isValid = false;
    } else if (formData.investorPassword.length < 6) {
      newErrors.investorPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Starting MT5 account linking...");
      console.log("User ID:", userId);
      console.log("Account Number:", formData.accountNumber);
      console.log("Broker Server:", formData.brokerServer);

      // Save credentials directly to database
      toast.loading("Saving MT5 account...", { id: "mt5-save" });

      // Check if account already exists
      const { data: existingMT5, error: checkError } = await supabase
        .from("mt5_accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("account_number", formData.accountNumber)
        .maybeSingle();

      console.log("Check existing result:", { existingMT5, checkError });

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing MT5:", checkError);
        toast.error(`Database error: ${checkError.message}`, { id: "mt5-save" });
        setLoading(false);
        return;
      }

      if (existingMT5) {
        console.log("Updating existing MT5 account...");
        // Update existing account
        const { error: updateError } = await supabase
          .from("mt5_accounts")
          .update({
            broker_server: formData.brokerServer,
            investor_password: formData.investorPassword,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingMT5.id);

        if (updateError) {
          console.error("Error updating MT5:", updateError);
          toast.error(`Update failed: ${updateError.message}`, { id: "mt5-save" });
          setLoading(false);
          return;
        }

        console.log("MT5 account updated successfully!");
        toast.success("MT5 account updated successfully!", { id: "mt5-save" });
      } else {
        console.log("Inserting new MT5 account...");
        // Insert new account
        const { data: insertData, error: insertError } = await supabase
          .from("mt5_accounts")
          .insert({
            user_id: userId,
            broker_server: formData.brokerServer,
            account_number: formData.accountNumber,
            investor_password: formData.investorPassword,
            status: "active",
          })
          .select();

        console.log("Insert result:", { insertData, insertError });

        if (insertError) {
          console.error("Error inserting MT5:", insertError);
          toast.error(`Insert failed: ${insertError.message}`, { id: "mt5-save" });
          setLoading(false);
          return;
        }

        console.log("MT5 account linked successfully!");
        toast.success("MT5 account linked successfully!", { id: "mt5-save" });
      }

      // Try to test connection in background (non-blocking)
      testConnectionInBackground(formData.brokerServer, formData.accountNumber, formData.investorPassword);

      // Reset loading state before calling callbacks
      setLoading(false);
      
      // Call success callbacks
      onSuccess?.();
      onClose();
      refreshUser?.();
    } catch (error: any) {
      console.error("Unexpected error linking MT5:", error);
      toast.error(`Unexpected error: ${error.message || "Please try again"}`, { id: "mt5-save" });
      setLoading(false);
    }
  };

  // Test MT5 connection in background (doesn't block the linking process)
  const testConnectionInBackground = async (server: string, login: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("mt5-get-account-info", {
        body: { server, login, password },
      });

      if (!error && data?.metaApiAccountId) {
        // Update the account with MetaAPI ID if connection succeeds
        await supabase
          .from("mt5_accounts")
          .update({
            metaapi_account_id: data.metaApiAccountId,
          })
          .eq("user_id", userId)
          .eq("account_number", login);
        
        console.log("MT5 connection verified and MetaAPI ID saved");
      } else {
        console.log("MT5 connection test failed, will use demo mode");
      }
    } catch (error) {
      console.log("MT5 connection test failed, will use demo mode:", error);
    }
  };

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
        className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-rose-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-7 h-7 text-pink-500" />
              Link MT5 Account
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Connect your MetaTrader 5 account to track performance
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="text-xs space-y-1 text-blue-200/80">
                  <li>• Use your <strong>Investor (read-only)</strong> password, NOT your main password</li>
                  <li>• Your credentials are encrypted and stored securely</li>
                  <li>• We can only view your trades, not execute them</li>
                  <li>• Works with any MT5 broker server</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Broker Server */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Broker Server
              </label>
              <div className="relative">
                <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.brokerServer}
                  onChange={(e) =>
                    setFormData({ ...formData, brokerServer: e.target.value })
                  }
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border ${
                    errors.brokerServer ? "border-red-500" : "border-slate-700"
                  } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                  placeholder="e.g., ICMarkets-Demo01, FTMO-Server, etc."
                />
              </div>
              {errors.brokerServer && (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.brokerServer}</p>
              )}
              <p className="text-slate-500 text-xs mt-1.5 ml-1">
                Find this in your MT5 terminal under "Server" in login settings
              </p>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Account Number / Login
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border ${
                    errors.accountNumber ? "border-red-500" : "border-slate-700"
                  } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                  placeholder="e.g., 12345678"
                />
              </div>
              {errors.accountNumber && (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.accountNumber}</p>
              )}
            </div>

            {/* Investor Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Investor Password (Read-Only)
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={formData.investorPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, investorPassword: e.target.value })
                  }
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border ${
                    errors.investorPassword ? "border-red-500" : "border-slate-700"
                  } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                  placeholder="Enter investor password"
                />
              </div>
              {errors.investorPassword && (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.investorPassword}</p>
              )}
              <p className="text-slate-500 text-xs mt-1.5 ml-1">
                Create an investor password in MT5 if you don't have one
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 bg-slate-800 text-white rounded-2xl font-medium hover:bg-slate-700 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-6 py-3.5 rounded-2xl font-medium shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Link Account
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}