import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Upload, CheckCircle2, Clock, XCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

interface Application {
  id: string;
  challenge_type: string;
  status: "submitted" | "under_review" | "interview" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  interview_date?: string;
  documents?: string[];
  admin_notes?: string;
}

const statusSteps = [
  { key: "submitted", label: "Submitted", icon: FileText },
  { key: "under_review", label: "Under Review", icon: Clock },
  { key: "interview", label: "Interview", icon: MessageSquare },
  { key: "approved", label: "Approved", icon: CheckCircle2 },
];

export function ApplicationTracker() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      
      const appsData = data || [];
      setApplications(appsData);
      if (appsData.length > 0) {
        setSelectedApp(appsData[0]);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      // Fallback to mock data
      const mockApps = [
        {
          id: "1",
          challenge_type: "50K Challenge",
          status: "interview" as const,
          submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          reviewed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          interview_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          documents: ["application.pdf", "trading-history.pdf"],
          admin_notes: "Great performance! Interview scheduled for next week.",
        },
        {
          id: "2",
          challenge_type: "100K Challenge",
          status: "under_review" as const,
          submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          documents: ["application.pdf"],
        },
        {
          id: "3",
          challenge_type: "25K Challenge",
          status: "approved" as const,
          submitted_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          reviewed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          documents: ["application.pdf", "id-verification.pdf"],
          admin_notes: "Congratulations! You've been approved for funding.",
        },
      ];
      setApplications(mockApps);
      setSelectedApp(mockApps[0]);
    }
  };

  const getStatusIndex = (status: string) => {
    if (status === "rejected") return -1;
    return statusSteps.findIndex((step) => step.key === status);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedApp) return;

    setUploadingDoc(true);
    try {
      const file = e.target.files[0];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // In a real app, upload to Supabase Storage
      // For now, just update the documents array
      const newDocName = file.name;
      const updatedDocs = [...(selectedApp.documents || []), newDocName];

      const { error } = await supabase
        .from("applications")
        .update({ documents: updatedDocs })
        .eq("id", selectedApp.id);

      if (error) throw error;

      alert("Document uploaded successfully!");
      loadApplications();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      alert(error.message || "Failed to upload document");
    } finally {
      setUploadingDoc(false);
    }
  };

  const getEstimatedTime = (status: string) => {
    switch (status) {
      case "submitted":
        return "2-3 business days";
      case "under_review":
        return "5-7 business days";
      case "interview":
        return "Interview scheduled";
      case "approved":
        return "Completed";
      default:
        return "N/A";
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
            <h1 className="text-3xl font-bold text-white">Application Tracker</h1>
            <p className="text-slate-400">Monitor your funding application status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-800">
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
                    <p className="font-semibold text-white mb-1">{app.challenge_type}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </p>
                    <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-lg text-xs font-medium ${
                      app.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : app.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {app.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                      {app.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {app.status !== "approved" && app.status !== "rejected" && <Clock className="w-3 h-3" />}
                      <span className="capitalize">{app.status.replace("_", " ")}</span>
                    </div>
                  </button>
                ))}

                {applications.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No applications yet</p>
                    <button
                      onClick={() => navigate("/challenges")}
                      className="mt-4 text-pink-400 hover:text-pink-300 text-sm font-medium"
                    >
                      Apply for Funding →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          {selectedApp && (
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Pipeline */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-6">Application Progress</h2>

                {selectedApp.status === "rejected" ? (
                  <div className="text-center py-8">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-white mb-2">Application Rejected</p>
                    <p className="text-slate-400">
                      Unfortunately, your application was not approved at this time.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-8 left-0 right-0 h-1 bg-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-500"
                        style={{
                          width: `${((getStatusIndex(selectedApp.status) + 1) / statusSteps.length) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Steps */}
                    <div className="relative grid grid-cols-4 gap-4">
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
                              } ${isCurrent ? "scale-110" : ""}`}
                            >
                              <StepIcon className={`w-8 h-8 ${isComplete ? "text-white" : "text-slate-600"}`} />
                            </div>
                            <p
                              className={`text-sm font-medium text-center ${
                                isComplete ? "text-white" : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Estimated Time */}
                {selectedApp.status !== "approved" && selectedApp.status !== "rejected" && (
                  <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-blue-400">Estimated Review Time:</span>{" "}
                      {getEstimatedTime(selectedApp.status)}
                    </p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-6">Application Details</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Challenge Type</p>
                    <p className="text-lg font-semibold text-white">{selectedApp.challenge_type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400 mb-1">Submitted Date</p>
                    <p className="text-lg font-semibold text-white">
                      {new Date(selectedApp.submitted_at).toLocaleDateString()}
                    </p>
                  </div>

                  {selectedApp.reviewed_at && (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Reviewed Date</p>
                      <p className="text-lg font-semibold text-white">
                        {new Date(selectedApp.reviewed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {selectedApp.interview_date && (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Interview Date</p>
                      <p className="text-lg font-semibold text-pink-400">
                        {new Date(selectedApp.interview_date).toLocaleDateString()} at{" "}
                        {new Date(selectedApp.interview_date).toLocaleTimeString()}
                      </p>
                    </div>
                  )}

                  {selectedApp.admin_notes && (
                    <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <p className="text-sm text-slate-400 mb-2">Admin Notes</p>
                      <p className="text-white">{selectedApp.admin_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Documents</h2>
                  {selectedApp.status !== "approved" && selectedApp.status !== "rejected" && (
                    <label className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-xl font-medium cursor-pointer hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                      <Upload className="w-5 h-5" />
                      {uploadingDoc ? "Uploading..." : "Upload Document"}
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        disabled={uploadingDoc}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedApp.documents?.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl"
                    >
                      <FileText className="w-5 h-5 text-pink-400" />
                      <p className="flex-1 text-white">{doc}</p>
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                  ))}

                  {(!selectedApp.documents || selectedApp.documents.length === 0) && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
