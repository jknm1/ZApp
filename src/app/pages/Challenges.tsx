import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Loader2,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { ChallengeProgress } from "../components/ChallengeProgress";
import { supabase } from "../lib/supabase";

interface Challenge {
  id: string;
  accountSize: number;
  profitTarget: number;
  maxDrawdown: number;
  tradingDays: number;
  features: string[];
}

const challenges: Challenge[] = [
  {
    id: "1",
    accountSize: 50000,
    profitTarget: 4000,
    maxDrawdown: 2500,
    tradingDays: 30,
    features: [
      "Up to 80% profit split",
      "1-Step evaluation",
      "MT5 platform access",
      "24/7 support",
    ],
  },
  {
    id: "2",
    accountSize: 100000,
    profitTarget: 8000,
    maxDrawdown: 5000,
    tradingDays: 30,
    features: [
      "Up to 80% profit split",
      "1-Step evaluation",
      "MT5 platform access",
      "24/7 support",
      "Priority withdrawal",
    ],
  },
  {
    id: "3",
    accountSize: 200000,
    profitTarget: 16000,
    maxDrawdown: 10000,
    tradingDays: 45,
    features: [
      "Up to 90% profit split",
      "1-Step evaluation",
      "MT5 platform access",
      "24/7 support",
      "Priority withdrawal",
      "Personal account manager",
    ],
  },
];

export function Challenges() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    tradingPair: "",
    country: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleApply = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowApplicationForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Send to Formspree (your email)
      const formspreeResponse = await fetch("https://formspree.io/f/mqelrneo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          experience: formData.experience,
          tradingPair: formData.tradingPair,
          country: formData.country,
          email: formData.email,
          accountSize: selectedChallenge?.accountSize,
          submittedAt: new Date().toLocaleString(),
        }),
      });

      // Save to Supabase database
      const { error: dbError } = await supabase
        .from("funding_applications")
        .insert([{
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          account_size: `$${selectedChallenge?.accountSize.toLocaleString()}`,
          experience: formData.experience,
          trading_pair: formData.tradingPair,
          country: formData.country,
          status: "pending",
          submitted_at: new Date().toISOString(),
        }]);

      if (dbError) {
        console.error("Error saving to database:", dbError);
        // Continue anyway - Formspree submission is more important
      }

      if (formspreeResponse.ok) {
        setShowSuccess(true);
        setShowApplicationForm(false);
        setFormData({
          name: "",
          experience: "",
          tradingPair: "",
          country: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (showApplicationForm) {
                    setShowApplicationForm(false);
                  } else {
                    navigate("/dashboard");
                  }
                }}
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
                  <p className="text-xs text-slate-400">Funding Application</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Available Balance</p>
              <p className="text-white font-medium">
                ${user.balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/10 border-2 border-green-500/50 rounded-3xl p-8 mb-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Application Submitted Successfully!
            </h3>
            <p className="text-slate-300 mb-4">
              Your funding application has been received and will be reviewed by
              our team within the next 72 hours.
            </p>
            <p className="text-slate-400 text-sm">
              We'll contact you at {formData.email} with the results.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/dashboard");
              }}
              className="mt-6 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all active:scale-[0.98]"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Application Form */}
        {showApplicationForm && !showSuccess && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Apply for ${selectedChallenge?.accountSize.toLocaleString()}{" "}
                  Account
                </h2>
                <p className="text-slate-400">
                  Fill out the form below to apply for funding
                </p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Trading Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (0-1 year)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="advanced">Advanced (3-5 years)</option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Favorite Trading Pair *
                  </label>
                  <input
                    type="text"
                    name="tradingPair"
                    value={formData.tradingPair}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="e.g., EUR/USD, BTC/USDT"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your country"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                  <p className="text-slate-400 text-sm">
                    By submitting this application, you agree to our{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/terms")}
                      className="text-pink-400 hover:text-pink-300"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/privacy")}
                      className="text-pink-400 hover:text-pink-300"
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white py-4 rounded-2xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Challenge Selection */}
        {!showApplicationForm && !showSuccess && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full mb-4">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">Free Funded Accounts</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Apply for Funding
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Join Zynx Capital's elite trading program. We acquire prop
                firms, pass their challenges, and fund the best traders at no
                cost to you.
              </p>
            </div>

            {/* Challenge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                    selectedChallenge?.id === challenge.id
                      ? "border-pink-500 shadow-xl shadow-pink-500/20"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => handleSelectChallenge(challenge)}
                >
                  {challenge.accountSize === 100000 && (
                    <div className="inline-block bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-medium mb-4 shadow-lg shadow-pink-500/20">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-slate-400 text-sm mb-1">Account Size</p>
                    <h3 className="text-3xl font-bold text-white">
                      ${challenge.accountSize.toLocaleString()}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">Profit Target</span>
                      </div>
                      <span className="text-white font-medium">
                        ${challenge.profitTarget.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Trading Days</span>
                      </div>
                      <span className="text-white font-medium">
                        {challenge.tradingDays} days
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-2">
                    {challenge.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-slate-300 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-pink-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <div className="mb-4 text-center">
                      <p className="text-green-400 font-semibold text-lg">
                        100% Free Funding
                      </p>
                      <p className="text-slate-500 text-xs">
                        No cost to qualified traders
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(challenge);
                      }}
                      className={`w-full py-3.5 rounded-2xl font-medium transition-all active:scale-[0.98] ${
                        selectedChallenge?.id === challenge.id
                          ? "bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/20"
                          : "bg-slate-800 text-white hover:bg-slate-700"
                      }`}
                    >
                      Apply for Funding
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* How It Works Section */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                How Zynx Capital Works
              </h3>
              <p className="text-slate-400 text-center mb-8 max-w-3xl mx-auto">
                We've built a unique model that removes all barriers to trading
                success. Here's how we fund elite traders at no cost.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-pink-500/10">
                    <Trophy className="w-8 h-8 text-pink-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    We Acquire Firms
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Zynx Corporation acquires and partners with established prop
                    trading firms globally.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-pink-500/10">
                    <Target className="w-8 h-8 text-pink-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Pass Challenges
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Our team completes the trading challenges and evaluation
                    processes to secure funded accounts.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-pink-500/10">
                    <Users className="w-8 h-8 text-pink-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Interview & Vet
                  </h4>
                  <p className="text-slate-400 text-sm">
                    We carefully interview and vet traders, analyzing trading
                    history, strategy, and risk management.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-pink-500/10">
                    <Award className="w-8 h-8 text-pink-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Fund the Best
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Only the best traders receive funded accounts at zero cost.
                    Trade and keep up to 40% of profits!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}