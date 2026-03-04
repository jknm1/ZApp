import { useState, useEffect } from "react";
import { ArrowLeft, FileText, CheckCircle2, Clock, XCircle, MessageSquare, Mail, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  account_size: string;
  trading_experience: string;
  experience: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

const statusSteps = [
  { key: "pending", label: "Submitted", icon: FileText, description: "Application received" },
  { key: "under_review", label: "Under Review", icon: Clock, description: "Being evaluated" },
  { key: "approved", label: "Approved", icon: CheckCircle2, description: "Congratulations!" },
];

export function ApplicationTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadApplications();
  }, [user, navigate]);

  const loadApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      console.log("🔍 Loading applications for user:", user.email);
      console.log("🔍 User ID:", user.id);
      
      // Try BOTH user_id AND email to find applications
      const { data, error } = await supabase
        .from("funding_applications")
        .select("*")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("❌ Error loading applications:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setApplications([]);
        setLoading(false);
        return;
      }

      console.log("✅ Loaded applications:", data);
      console.log("Total applications found:", data?.length || 0);
      
      if (data && data.length > 0) {
        console.log("📋 First application:", data[0]);
      }

      const appsData = data || [];
      setApplications(appsData);
      if (appsData.length > 0) {
        setSelectedApp(appsData[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Error loading applications:", error);
      setApplications([]);
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    if (status === "rejected") return -1;
    return statusSteps.findIndex((step) => step.key === status);
  };

  const getEstimatedTime = (status: string) => {
    switch (status) {
      case "pending":
        return "2-3 business days";
      case "under_review":
        return "5-7 business days";
      case "approved":
        return "Completed";
      default:
        return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "under_review":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Application Tracker</h1>
            <p className="text-slate-400">Monitor your funding application status</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications List */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
              >
                <h2 className="text-xl font-bold text-white mb-4">Your Applications</h2>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedApp?.id === app.id
                          ? "bg-pink-500/20 border-pink-500"
                          : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <p className="font-semibold text-white mb-1">{app.account_size} Challenge</p>
                      <p className="text-xs text-slate-400">
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                        {app.status === "rejected" && <XCircle className="w-3 h-3" />}
                        {app.status === "pending" && <Clock className="w-3 h-3" />}
                        {app.status === "under_review" && <MessageSquare className="w-3 h-3" />}
                        <span className="capitalize">{app.status.replace("_", " ")}</span>
                      </div>
                    </button>
                  ))}

                  {applications.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm mb-4">No applications yet</p>
                      <p className="text-xs text-slate-500 mb-4">
                        Debug: Email = {user?.email}
                      </p>
                      <button
                        onClick={() => navigate("/challenges")}
                        className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                      >
                        Apply for Funding →
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Application Details */}
            {selectedApp && (
              <div className="lg:col-span-2 space-y-6">
                {/* Application Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedApp.account_size} Challenge
                      </h2>
                      <p className="text-slate-400">
                        Submitted on {new Date(selectedApp.submitted_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-xl border ${getStatusColor(selectedApp.status)}`}
                    >
                      <span className="font-semibold capitalize">
                        {selectedApp.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-pink-400" />
                        <p className="text-slate-400 text-sm">Full Name</p>
                      </div>
                      <p className="text-white font-medium">{selectedApp.name}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-pink-400" />
                        <p className="text-slate-400 text-sm">Email</p>
                      </div>
                      <p className="text-white font-medium">{selectedApp.email}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-pink-400" />
                        <p className="text-slate-400 text-sm">Trading Experience</p>
                      </div>
                      <p className="text-white font-medium">{selectedApp.trading_experience || selectedApp.experience}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <p className="text-slate-400 text-sm">Estimated Time</p>
                      </div>
                      <p className="text-white font-medium">{getEstimatedTime(selectedApp.status)}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Progress Pipeline */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Application Progress</h2>

                  {selectedApp.status === "rejected" ? (
                    <div className="text-center py-8">
                      <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-white mb-2">Application Not Approved</p>
                      <p className="text-slate-400 mb-4">
                        Unfortunately, your application was not approved at this time.
                      </p>
                      <button
                        onClick={() => navigate("/challenges")}
                        className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                      >
                        Apply Again
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-8 left-0 right-0 h-1 bg-slate-700 hidden md:block">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-500"
                          style={{
                            width: `${((getStatusIndex(selectedApp.status) + 1) / statusSteps.length) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Steps */}
                      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
                        {statusSteps.map((step, index) => {
                          const isComplete = index <= getStatusIndex(selectedApp.status);
                          const isCurrent = index === getStatusIndex(selectedApp.status);
                          const StepIcon = step.icon;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                                  isComplete
                                    ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30"
                                    : "bg-slate-800"
                                } ${isCurrent ? "scale-110 ring-4 ring-pink-500/30" : ""}`}
                              >
                                <StepIcon
                                  className={`w-8 h-8 ${isComplete ? "text-white" : "text-slate-600"}`}
                                />
                              </div>
                              <p
                                className={`font-semibold text-center mb-1 ${
                                  isComplete ? "text-white" : "text-slate-500"
                                }`}
                              >
                                {step.label}
                              </p>
                              <p className="text-slate-400 text-xs text-center">{step.description}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Additional Info */}
                      {selectedApp.status === "approved" && (
                        <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                          <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-white font-semibold mb-2">Congratulations! 🎉</p>
                              <p className="text-slate-300 text-sm">
                                Your application has been approved! Check your email for next steps and account setup instructions.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedApp.status === "under_review" && (
                        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                          <div className="flex items-start gap-4">
                            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-white font-semibold mb-2">Under Review</p>
                              <p className="text-slate-300 text-sm">
                                Our team is carefully reviewing your application. We'll notify you once a decision has been made.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedApp.status === "pending" && (
                        <div className="mt-8 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
                          <div className="flex items-start gap-4">
                            <FileText className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-white font-semibold mb-2">Application Received</p>
                              <p className="text-slate-300 text-sm">
                                Your application has been successfully submitted. Our team will review it shortly.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}