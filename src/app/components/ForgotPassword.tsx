import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ForgotPasswordProps {
  onClose: () => void;
  email?: string;
  setEmail?: (email: string) => void;
}

export function ForgotPassword({ onClose, email: propEmail = "", setEmail: propSetEmail }: ForgotPasswordProps) {
  const [email, setEmail] = useState(propEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (propSetEmail) {
      propSetEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      // Validate email format
      if (!email || !email.includes("@")) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      console.log("Attempting to send password reset email to:", email);
      console.log("Redirect URL:", `${window.location.origin}/reset-password`);

      // Send password reset email via Supabase Auth
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error sending reset email:", error);
        
        // Check for specific error types
        if (error.message.includes("Email not confirmed")) {
          setStatus("error");
          setMessage("Your email is not confirmed. Please check your inbox for a confirmation email.");
        } else if (error.message.includes("not found")) {
          // For security, don't reveal if email exists or not
          setStatus("success");
          setMessage(
            "If this email is registered, you'll receive a password reset link. Please check your inbox and spam folder."
          );
        } else {
          setStatus("error");
          setMessage(`Failed to send reset email: ${error.message}`);
        }
        setDebugInfo(JSON.stringify(error, null, 2));
      } else {
        console.log("Reset email sent successfully!");
        setStatus("success");
        setMessage(
          "Password reset link sent! Please check your inbox and spam folder. The link will expire in 1 hour."
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred. Please try again.");
      setDebugInfo(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
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
        className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-800 w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Mail className="w-6 h-6 text-pink-500" />
              Reset Password
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Enter your email to receive a reset link
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            // Success Message
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Email Sent!
              </h3>
              <p className="text-slate-400 mb-6">{message}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium shadow-lg shadow-pink-500/30"
              >
                Close
              </motion.button>
            </motion.div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white py-3.5 rounded-2xl font-medium shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-slate-400">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-pink-400 hover:text-pink-300 font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}