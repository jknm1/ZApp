import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ForgotPassword } from "../components/ForgotPassword";

// Apple Sign In Configuration
declare global {
  interface Window {
    AppleID: any;
  }
}

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, createAccount } = useAuth();
  const navigate = useNavigate();

  // Load Apple Sign In script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      const success = await createAccount(email, password, name);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Email already exists");
      }
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await response.json();
        
        // Create or login with Google account
        const googleEmail = userInfo.email;
        const googleName = userInfo.name || "Google User";
        const googlePassword = `google_${userInfo.sub}`; // Use Google ID as password
        
        // Try to create account first
        const accountCreated = await createAccount(googleEmail, googlePassword, googleName);
        if (accountCreated) {
          navigate("/dashboard");
        } else {
          // Account exists, try to login
          const loginSuccess = await login(googleEmail, googlePassword);
          if (loginSuccess) {
            navigate("/dashboard");
          } else {
            setError("Google authentication failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Google login error:", error);
        setError("Failed to authenticate with Google. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      // Don't show error if user closed the popup
      if (error.error !== "popup_closed_by_user") {
        setError("Google authentication was cancelled or failed.");
      }
    },
    flow: 'implicit',
  });

  // Apple Sign In
  const handleAppleLogin = async () => {
    setIsAppleLoading(true);
    setError("");
    
    // Simulate authentication delay (like real Apple Sign In)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Apple Developer credentials not configured - deny access
    setError("Apple Sign In is not available. Apple Developer credentials have not been configured yet. Please use Google Sign In or Email to continue.");
    setIsAppleLoading(false);
    
    /* DEVELOPMENT MODE CODE - Removed for now
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    const appleEmail = `apple.user${randomId}@privaterelay.appleid.com`;
    const appleName = `Apple User`;
    const applePassword = `apple_${timestamp}_${randomId}`;
    
    // Try to create account first
    if (createAccount(appleEmail, applePassword, appleName)) {
      navigate("/dashboard");
    } else {
      // Account exists, try to login
      if (login(appleEmail, applePassword)) {
        navigate("/dashboard");
      } else {
        setError("Apple authentication failed. Please try again.");
        setIsAppleLoading(false);
      }
    }
    */
    
    /* PRODUCTION CODE - Uncomment when you have Apple credentials configured:
    
    if (typeof window.AppleID !== "undefined") {
      try {
        window.AppleID.auth.init({
          clientId: "com.zynxcapital.signin", // Replace with your Apple Service ID
          scope: "name email",
          redirectURI: window.location.origin + "/auth",
          usePopup: true,
        });

        window.AppleID.auth.signIn().then((response: any) => {
          const appleUser = response.user;
          const authorization = response.authorization;
          
          // Extract user info from Apple response
          const appleEmail = appleUser?.email || `apple_${authorization.id_token.split('.')[1]}@appleid.com`;
          const appleName = appleUser?.name ? `${appleUser.name.firstName} ${appleUser.name.lastName}` : "Apple User";
          const applePassword = `apple_${authorization.id_token.split('.')[1]}`;
          
          // Try to create account first
          if (createAccount(appleEmail, applePassword, appleName)) {
            navigate("/dashboard");
          } else {
            // Account exists, try to login
            if (login(appleEmail, applePassword)) {
              navigate("/dashboard");
            } else {
              setError("Apple authentication failed. Please try again.");
              setIsAppleLoading(false);
            }
          }
        }).catch((error: any) => {
          if (error.error === "popup_closed_by_user") {
            // User closed the popup, don't show error
            return;
          }
          console.error("Apple login error:", error);
          setError("Apple authentication was cancelled or failed.");
          setIsAppleLoading(false);
        });
      } catch (error) {
        console.error("Apple Sign In initialization error:", error);
        setError("Apple Sign In is not available. Please use email login.");
        setIsAppleLoading(false);
      }
    } else {
      setError("Apple Sign In is loading. Please try again in a moment.");
      setIsAppleLoading(false);
    }
    */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-3xl font-black text-white">Z</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-1">ZYNX</h1>
          <p className="text-slate-400">Capital Trading</p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-800"
        >
          <div className="flex gap-2 mb-6 bg-slate-950/50 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-500/10 border border-pink-500/30 text-pink-400 px-4 py-3 rounded-2xl mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 rounded-2xl font-medium hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={isAppleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-950 text-white border border-slate-800 rounded-2xl font-medium hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAppleLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white py-3.5 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <AnimatePresence>
            {isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center"
              >
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot Password Modal */}
          <AnimatePresence>
            {showForgotPassword && (
              <ForgotPassword
                onClose={() => setShowForgotPassword(false)}
                email={email}
                setEmail={setEmail}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}