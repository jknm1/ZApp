import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Star,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface Application {
  id: string;
  name: string;
  email: string;
  accountSize: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  verified: boolean;
  created_at: string;
}

interface KYCSubmission {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  document_type: "id_front" | "id_back" | "proof_of_address" | "selfie";
  file_name: string;
  file_url?: string;
  status: "pending" | "verified" | "rejected";
  submitted_at: string;
  verified_at?: string;
  rejection_reason?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  country?: string;
  created_at: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "reviews" | "users" | "kyc">("overview");
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [kycSubmissions, setKycSubmissions] = useState<KYCSubmission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewingKYC, setReviewingKYC] = useState<KYCSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Admin check - only allow specific admin email
    const isAdmin = user.email === "josephndungukamau20@gmail.com";
    
    if (!isAdmin) {
      toast.error("Access denied. Admin only.");
      navigate("/dashboard");
      return;
    }

    fetchData();

    // Set up real-time subscription for users table
    const usersSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        console.log('User data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    // Set up real-time subscription for funding_applications table
    const applicationsSubscription = supabase
      .channel('applications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'funding_applications' }, () => {
        console.log('Applications data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    // Set up real-time subscription for reviews table
    const reviewsSubscription = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        console.log('Reviews data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    // Set up real-time subscription for kyc_submissions table
    const kycSubscription = supabase
      .channel('kyc-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kyc_submissions' }, () => {
        console.log('KYC data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      usersSubscription.unsubscribe();
      applicationsSubscription.unsubscribe();
      reviewsSubscription.unsubscribe();
      kycSubscription.unsubscribe();
    };
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch real users from Supabase Auth
      const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers();
      
      // Fetch reviews from Supabase
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      } else if (reviewsData) {
        setReviews(reviewsData);
      }

      // Fetch KYC submissions from Supabase
      const { data: kycData, error: kycError } = await supabase
        .from("kyc_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (kycError) {
        console.error("Error fetching KYC submissions:", kycError);
      } else if (kycData) {
        setKycSubmissions(kycData);
      }

      // Fetch real funding applications from Supabase
      const { data: applicationsData, error: appsError } = await supabase
        .from("funding_applications")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (appsError) {
        console.error("Error fetching applications:", appsError);
        // If table doesn't exist yet, set empty array
        setApplications([]);
      } else if (applicationsData) {
        setApplications(applicationsData.map(app => ({
          id: app.id,
          name: app.name,
          email: app.email,
          accountSize: app.account_size,
          experience: app.experience,
          status: app.status,
          submittedAt: new Date(app.submitted_at).toLocaleString(),
        })));
      }

      // Fetch real users from Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (userError) {
        console.error("Error fetching users:", userError);
      } else if (userData) {
        setUsers(userData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ verified: true })
        .eq("id", reviewId);

      if (error) {
        console.error("Error approving review:", error);
        toast.error("Failed to approve review");
        return;
      }

      setReviews(reviews.map(r => r.id === reviewId ? { ...r, verified: true } : r));
      toast.success("Review approved!");
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review");
        return;
      }

      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleApproveKYC = async (kycId: string) => {
    try {
      const { error } = await supabase
        .from("kyc_submissions")
        .update({ status: "verified", verified_at: new Date().toISOString() })
        .eq("id", kycId);

      if (error) {
        console.error("Error approving KYC:", error);
        toast.error("Failed to approve KYC");
        return;
      }

      setKycSubmissions(kycSubmissions.map(k => k.id === kycId ? { ...k, status: "verified", verified_at: new Date().toISOString() } : k));
      toast.success("KYC approved!");
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error("Failed to approve KYC");
    }
  };

  const handleRejectKYC = async (kycId: string) => {
    try {
      const { error } = await supabase
        .from("kyc_submissions")
        .update({ status: "rejected", rejection_reason: rejectionReason })
        .eq("id", kycId);

      if (error) {
        console.error("Error rejecting KYC:", error);
        toast.error("Failed to reject KYC");
        return;
      }

      setKycSubmissions(kycSubmissions.map(k => k.id === kycId ? { ...k, status: "rejected", rejection_reason: rejectionReason } : k));
      toast.success("KYC rejected!");
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error("Failed to reject KYC");
    }
  };

  const handleApproveApplication = async (appId: string) => {
    try {
      const application = applications.find(a => a.id === appId);
      
      const { error } = await supabase
        .from("funding_applications")
        .update({ 
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.email
        })
        .eq("id", appId);

      if (error) {
        console.error("Error approving application:", error);
        toast.error("Failed to approve application");
        return;
      }

      // Send notification to user if they have a user_id
      if (application) {
        // Find the user in users table to get their user_id
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", application.email)
          .maybeSingle();

        if (userData) {
          // Create notification for user
          await supabase.from("notifications").insert({
            user_id: userData.id,
            type: "success",
            title: "Funding Application Approved!",
            message: `Congratulations! Your ${application.accountSize} funding application has been approved. Check your email for next steps.`,
            read: false,
          });
        }
      }

      setApplications(applications.map(a => a.id === appId ? { ...a, status: "approved" } : a));
      toast.success("Application approved!");
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      const application = applications.find(a => a.id === appId);
      
      const { error } = await supabase
        .from("funding_applications")
        .update({ 
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.email
        })
        .eq("id", appId);

      if (error) {
        console.error("Error rejecting application:", error);
        toast.error("Failed to reject application");
        return;
      }

      // Send notification to user if they have a user_id
      if (application) {
        // Find the user in users table to get their user_id
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", application.email)
          .maybeSingle();

        if (userData) {
          // Create notification for user
          await supabase.from("notifications").insert({
            user_id: userData.id,
            type: "warning",
            title: "Application Status Update",
            message: `Your ${application.accountSize} funding application has been reviewed. Please check your email for more details.`,
            read: false,
          });
        }
      }

      setApplications(applications.map(a => a.id === appId ? { ...a, status: "rejected" } : a));
      toast.success("Application rejected!");
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    }
  };

  if (!user) {
    return null;
  }

  const stats = {
    totalUsers: users.length,
    activeTraders: users.filter(u => u.balance > 0).length,
    totalRevenue: users.reduce((sum, u) => sum + u.balance, 0),
    pendingApplications: applications.filter(a => a.status === "pending").length,
    pendingReviews: reviews.filter(r => !r.verified).length,
    approvedApplications: applications.filter(a => a.status === "approved").length,
    pendingKYC: kycSubmissions.filter(k => k.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20"
                >
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-[10px] sm:text-xs text-slate-400 hidden xs:block">Manage platform operations</p>
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl backdrop-blur-sm"
            >
              <p className="text-purple-300 text-xs sm:text-sm font-medium">Admin Access</p>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Stats Grid */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-green-400 text-sm mt-1">+12 this week</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-slate-400 text-sm">Active Traders</p>
                </div>
                <p className="text-3xl font-bold text-white">{stats.activeTraders}</p>
                <p className="text-green-400 text-sm mt-1">+8 this week</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-slate-400 text-sm">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+18% this month</p>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setActiveTab("applications")}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 hover:border-pink-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      Pending Applications
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">Review trader applications</p>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{stats.pendingApplications}</p>
                        <p className="text-slate-400 text-sm">Awaiting review</p>
                      </div>
                    </div>
                  </div>
                  <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:text-pink-400 rotate-180 transition-colors" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setActiveTab("reviews")}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 hover:border-pink-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      Pending Reviews
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">Moderate user reviews</p>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{stats.pendingReviews}</p>
                        <p className="text-slate-400 text-sm">Awaiting approval</p>
                      </div>
                    </div>
                  </div>
                  <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:text-pink-400 rotate-180 transition-colors" />
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 mb-8 p-2"
        >
          <div className="grid grid-cols-2 lg:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("overview")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Overview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("applications")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                activeTab === "applications"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="hidden sm:inline">Applications ({stats.pendingApplications})</span>
              <span className="sm:hidden">Apps ({stats.pendingApplications})</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("reviews")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                activeTab === "reviews"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="hidden sm:inline">Reviews ({stats.pendingReviews})</span>
              <span className="sm:hidden">Reviews ({stats.pendingReviews})</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("users")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("kyc")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                activeTab === "kyc"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="hidden sm:inline">KYC Submissions ({stats.pendingKYC})</span>
              <span className="sm:hidden">KYC ({stats.pendingKYC})</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Funding Applications</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">No Applications Yet</h4>
                <p className="text-slate-400">Funding applications will appear here when users apply</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{app.name}</h4>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {app.email}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        app.status === "pending" ? "bg-orange-500/20 text-orange-400" :
                        app.status === "approved" ? "bg-green-500/20 text-green-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Account Size</p>
                        <p className="text-white font-medium">{app.accountSize}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Experience</p>
                        <p className="text-white font-medium">{app.experience}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Submitted</p>
                        <p className="text-white font-medium">{app.submittedAt}</p>
                      </div>
                    </div>

                    {app.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveApplication(app.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
          >
            <h3 className="text-xl font-semibold text-white mb-6">User Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{review.name}</h4>
                      <p className="text-slate-400 text-sm">{review.email}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      review.verified ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {review.verified ? "Verified" : "Pending"}
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{review.comment}</p>
                  <p className="text-slate-500 text-sm mb-4">
                    Submitted: {new Date(review.created_at).toLocaleString()}
                  </p>

                  {!review.verified && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}

                  {review.verified && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="w-full bg-slate-800 hover:bg-red-500 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete Review
                    </button>
                  )}
                </motion.div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Reviews Yet</h4>
                  <p className="text-slate-400">User reviews will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
          >
            <h3 className="text-xl font-semibold text-white mb-6">User Management</h3>
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{user.name}</h4>
                      <p className="text-slate-400 text-sm">{user.email}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 5 ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      user.balance > 0 ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {user.balance > 0 ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Balance</p>
                      <p className="text-white font-medium">${user.balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Country</p>
                      <p className="text-white font-medium">{user.country || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Created</p>
                      <p className="text-white font-medium">{new Date(user.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Users Yet</h4>
                  <p className="text-slate-400">Users will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* KYC Tab */}
        {activeTab === "kyc" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800"
          >
            <h3 className="text-xl font-semibold text-white mb-6">KYC Submissions</h3>
            <div className="space-y-4">
              {kycSubmissions.map((kyc, index) => (
                <motion.div
                  key={kyc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{kyc.user_name}</h4>
                      <p className="text-slate-400 text-sm">{kyc.user_email}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 5 ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      kyc.status === "pending" ? "bg-orange-500/20 text-orange-400" :
                      kyc.status === "verified" ? "bg-green-500/20 text-green-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Document Type</p>
                      <p className="text-white font-medium">{kyc.document_type}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">File Name</p>
                      <p className="text-white font-medium">{kyc.file_name}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Submitted</p>
                      <p className="text-white font-medium">{kyc.submitted_at}</p>
                    </div>
                  </div>

                  {kyc.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveKYC(kyc.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => setReviewingKYC(kyc)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {kycSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No KYC Submissions Yet</h4>
                  <p className="text-slate-400">KYC submissions will appear here</p>
                </div>
              )}
            </div>

            {/* KYC Review Modal */}
            {reviewingKYC && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center"
              >
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 w-full max-w-2xl">
                  <h3 className="text-xl font-semibold text-white mb-6">Reject KYC Submission</h3>
                  <p className="text-slate-400 mb-4">Enter a reason for rejecting the KYC submission:</p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full h-24 bg-slate-950/50 rounded-2xl p-4 border border-slate-800 text-slate-300 resize-none"
                    placeholder="Enter rejection reason..."
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleRejectKYC(reviewingKYC.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => setReviewingKYC(null)}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}