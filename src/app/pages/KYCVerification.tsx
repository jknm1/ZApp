import { useState, useEffect } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle2, Clock, XCircle, Shield, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface KYCDocument {
  id: string;
  document_type: "id_front" | "id_back" | "proof_of_address" | "selfie";
  file_name: string;
  file_url?: string;
  status: "pending" | "verified" | "rejected";
  submitted_at: string;
  verified_at?: string;
  rejection_reason?: string;
}

export function KYCVerification() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Add this line
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"not_started" | "pending" | "verified" | "rejected">("not_started");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("kyc_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      const docs = data || [];
      setDocuments(docs);

      // Determine overall verification status
      if (docs.length === 0) {
        setVerificationStatus("not_started");
      } else if (docs.some((d: KYCDocument) => d.status === "rejected")) {
        setVerificationStatus("rejected");
      } else if (docs.every((d: KYCDocument) => d.status === "verified") && docs.length >= 3) {
        setVerificationStatus("verified");
      } else {
        setVerificationStatus("pending");
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      // If table doesn't exist, show empty state
      setDocuments([]);
      setVerificationStatus("not_started");
    }
  };

  const handleFileUpload = async (documentType: KYCDocument["document_type"], e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setUploading(documentType);
    try {
      const file = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        setUploading(null);
        return;
      }

      // Check if user is logged in
      if (!user) {
        toast.error("Not authenticated. Please log in and try again.");
        setUploading(null);
        return;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;
      
      console.log("📤 Uploading file:", fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      console.log("✅ Upload successful:", uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      console.log("🔗 Public URL:", publicUrl);

      // Save document record to database
      const { error: dbError } = await supabase
        .from("kyc_submissions")
        .insert([{
          user_id: user.id,
          user_email: user.email,
          user_name: user.name || user.email,
          document_type: documentType,
          file_name: file.name,
          file_url: publicUrl,
          status: "pending",
          submitted_at: new Date().toISOString(),
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Failed to save document record: ${dbError.message}`);
      }

      console.log("✅ Document record saved to database");

      toast.success("Document uploaded successfully! Our team will review it within 24-48 hours.");
      loadDocuments();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(null);
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case "id_front":
        return "ID Document (Front)";
      case "id_back":
        return "ID Document (Back)";
      case "proof_of_address":
        return "Proof of Address";
      case "selfie":
        return "Selfie with ID";
      default:
        return type;
    }
  };

  const getDocumentDescription = (type: string) => {
    switch (type) {
      case "id_front":
        return "Upload front of your passport, driver's license, or national ID";
      case "id_back":
        return "Upload back of your ID (if applicable)";
      case "proof_of_address":
        return "Upload utility bill, bank statement, or official document (max 3 months old)";
      case "selfie":
        return "Upload a selfie holding your ID next to your face";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-400 bg-green-500/20";
      case "rejected":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const documentTypes: KYCDocument["document_type"][] = ["id_front", "id_back", "proof_of_address", "selfie"];
  const uploadedTypes = documents.map((d) => d.document_type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
            <p className="text-slate-400">Verify your identity to access funding</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`mb-8 rounded-3xl p-8 border ${
          verificationStatus === "verified"
            ? "bg-green-500/20 border-green-500/30"
            : verificationStatus === "rejected"
            ? "bg-red-500/20 border-red-500/30"
            : verificationStatus === "pending"
            ? "bg-yellow-500/20 border-yellow-500/30"
            : "bg-blue-500/20 border-blue-500/30"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              verificationStatus === "verified"
                ? "bg-green-500/30"
                : verificationStatus === "rejected"
                ? "bg-red-500/30"
                : verificationStatus === "pending"
                ? "bg-yellow-500/30"
                : "bg-blue-500/30"
            }`}>
              {verificationStatus === "verified" ? (
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              ) : verificationStatus === "rejected" ? (
                <XCircle className="w-8 h-8 text-red-400" />
              ) : verificationStatus === "pending" ? (
                <Clock className="w-8 h-8 text-yellow-400" />
              ) : (
                <Shield className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-1 ${
                verificationStatus === "verified"
                  ? "text-green-400"
                  : verificationStatus === "rejected"
                  ? "text-red-400"
                  : verificationStatus === "pending"
                  ? "text-yellow-400"
                  : "text-blue-400"
              }`}>
                {verificationStatus === "verified" && "✓ Verification Complete"}
                {verificationStatus === "rejected" && "⚠ Verification Rejected"}
                {verificationStatus === "pending" && "⏳ Verification Pending"}
                {verificationStatus === "not_started" && "🔒 Verification Required"}
              </h2>
              <p className="text-slate-300">
                {verificationStatus === "verified" && "Your identity has been verified. You can now access all features."}
                {verificationStatus === "rejected" && "Some documents were rejected. Please review and resubmit."}
                {verificationStatus === "pending" && "Your documents are under review. This usually takes 24-48 hours."}
                {verificationStatus === "not_started" && "Upload your documents to verify your identity and access funding."}
              </p>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Required Documents</h2>
          <p className="text-slate-400 mb-6">
            To comply with financial regulations and ensure account security, we need to verify your identity.
            All information is encrypted and stored securely.
          </p>

          <div className="space-y-4">
            {documentTypes.map((docType) => {
              const existingDoc = documents.find((d) => d.document_type === docType);
              const isUploaded = uploadedTypes.includes(docType);

              return (
                <div
                  key={docType}
                  className={`border-2 rounded-2xl p-6 transition-all ${
                    existingDoc?.status === "verified"
                      ? "bg-green-500/10 border-green-500/30"
                      : existingDoc?.status === "rejected"
                      ? "bg-red-500/10 border-red-500/30"
                      : isUploaded
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-slate-800/50 border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-white" />
                        <h3 className="text-lg font-semibold text-white">{getDocumentTitle(docType)}</h3>
                        {existingDoc && (
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(existingDoc.status)}`}>
                            {getStatusIcon(existingDoc.status)}
                            <span className="text-sm font-medium capitalize">{existingDoc.status}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{getDocumentDescription(docType)}</p>

                      {existingDoc && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-300">
                            <span className="text-slate-500">File:</span> {existingDoc.file_name}
                          </p>
                          <p className="text-sm text-slate-300">
                            <span className="text-slate-500">Submitted:</span>{" "}
                            {new Date(existingDoc.submitted_at).toLocaleDateString()}
                          </p>
                          {existingDoc.verified_at && (
                            <p className="text-sm text-green-400">
                              Verified on {new Date(existingDoc.verified_at).toLocaleDateString()}
                            </p>
                          )}
                          {existingDoc.rejection_reason && (
                            <p className="text-sm text-red-400">
                              <span className="font-semibold">Reason:</span> {existingDoc.rejection_reason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      {existingDoc?.status !== "verified" && (
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium cursor-pointer transition-all ${
                          uploading === docType
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:shadow-pink-500/30"
                        }`}>
                          <Upload className="w-5 h-5" />
                          {uploading === docType ? "Uploading..." : isUploaded ? "Replace" : "Upload"}
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(docType, e)}
                            className="hidden"
                            accept="image/*,.pdf"
                            disabled={uploading === docType}
                          />
                        </label>
                      )}
                      {existingDoc?.status === "verified" && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">📋 Important Information</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• All documents must be clear, readable, and not expired</li>
            <li>• Proof of address must be dated within the last 3 months</li>
            <li>• Accepted formats: JPG, PNG, PDF (max 10MB per file)</li>
            <li>• Documents are reviewed within 24-48 business hours</li>
            <li>• Your data is encrypted and stored securely in compliance with regulations</li>
            <li>• KYC verification is required before accessing funded accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}