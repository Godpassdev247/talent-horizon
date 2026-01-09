/**
 * Job Application Page - Apply with CV upload
 */

import { useState, useRef } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Upload, FileText, X, CheckCircle2, 
  Briefcase, Building2, MapPin, Loader2, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function JobApply() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedResume, setSelectedResume] = useState<"existing" | "new">("existing");
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch job details
  const { data: jobData, isLoading: jobLoading } = trpc.jobs.getById.useQuery(
    { id: parseInt(id || "0") },
    { enabled: !!id }
  );

  // Fetch user's resumes
  const { data: resumes, isLoading: resumesLoading } = trpc.resumes.getAll.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Upload resume mutation
  const uploadResumeMutation = trpc.resumes.upload.useMutation();

  // Create application mutation
  const createApplicationMutation = trpc.applications.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setNewResumeFile(file);
      setSelectedResume("new");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to apply");
      return;
    }

    setIsSubmitting(true);

    try {
      let resumeId = selectedResumeId;

      // Upload new resume if selected
      if (selectedResume === "new" && newResumeFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", newResumeFile);
        
        // Convert file to base64 for upload
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(newResumeFile);
        });

        const uploadResult = await uploadResumeMutation.mutateAsync({
          name: newResumeFile.name,
          fileData: base64.split(',')[1] || base64,
          fileType: newResumeFile.type,
          fileName: newResumeFile.name,
        });
        
        resumeId = uploadResult.id ?? null;
        setIsUploading(false);
      }

      if (!resumeId && selectedResume === "existing") {
        toast.error("Please select a resume or upload a new one");
        setIsSubmitting(false);
        return;
      }

      // Submit application
      await createApplicationMutation.mutateAsync({
        jobId: parseInt(id || "0"),
        resumeId: resumeId || undefined,
        coverLetter: coverLetter || undefined,
      });

    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-16">
          <div className="container text-center">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-navy mb-2">Sign In Required</h1>
            <p className="text-slate-500 mb-6">Please sign in to apply for this position.</p>
            <Link href="/login">
              <Button className="bg-orange hover:bg-orange-dark text-white">
                Sign In to Apply
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-16">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-12 shadow-sm text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-slate-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-navy mb-4">
                Application Submitted!
              </h1>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your application has been successfully submitted. The employer will review your application and contact you if you're a good fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/applications">
                  <Button className="bg-orange hover:bg-orange-dark text-white">
                    View My Applications
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline">
                    Browse More Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (jobLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded w-1/4" />
              <div className="h-32 bg-slate-200 rounded" />
              <div className="h-64 bg-slate-200 rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const job = jobData?.job;
  const company = jobData?.company;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          {/* Back Button */}
          <Link href={`/jobs/${id}`}>
            <Button variant="ghost" className="mb-6 text-slate-600 hover:text-navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Button>
          </Link>

          {/* Job Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                {company?.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-12 h-12 object-contain" />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-400" />
                )}
                {company?.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-white to-blue-50 rounded-full p-1.5 shadow-lg">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold text-navy mb-1">
                  Apply for {job?.title}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600 font-medium">{company?.name}</p>
                  {company?.verified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50/90 to-blue-100/70 text-blue-600 text-sm font-medium rounded-full shadow-sm">
                      <BadgeCheck className="w-4 h-4" />
                      Verified Employer
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job?.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {job?.jobType?.replace('-', ' ') || 'Full-time'}
                  </span>
                </div>
              </div>
            </div>
            {company?.verified && (
              <div className="mt-4 pt-4 border-t border-slate-100/80">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg">
                  <div className="p-1.5 bg-gradient-to-br from-blue-100/80 to-blue-50/60 rounded-full">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 text-sm">Verified Employer</p>
                    <p className="text-slate-500 text-sm">This company has been verified by Talent Horizon. Your application is secure.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Resume Selection */}
              <div>
                <h2 className="font-display text-lg font-semibold text-navy mb-4">
                  Resume / CV
                </h2>
                
                <RadioGroup
                  value={selectedResume}
                  onValueChange={(v: "existing" | "new") => setSelectedResume(v)}
                  className="space-y-4"
                >
                  {/* Existing Resumes */}
                  {resumes && resumes.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-500">Select from your saved resumes:</p>
                      {resumes.map((resume: any) => (
                        <div
                          key={resume.id}
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedResume === "existing" && selectedResumeId === resume.id
                              ? "border-orange bg-orange/5"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          onClick={() => {
                            setSelectedResume("existing");
                            setSelectedResumeId(resume.id);
                          }}
                        >
                          <RadioGroupItem value="existing" id={`resume-${resume.id}`} />
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div className="flex-1">
                            <p className="font-medium text-navy">{resume.name}</p>
                            <p className="text-sm text-slate-500">
                              Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {resume.isDefault && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload New Resume */}
                  <div
                    className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      selectedResume === "new"
                        ? "border-orange bg-orange/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => {
                      setSelectedResume("new");
                      if (!newResumeFile) {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="new" id="resume-new" />
                      <div className="flex-1">
                        {newResumeFile ? (
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-orange" />
                            <div className="flex-1">
                              <p className="font-medium text-navy">{newResumeFile.name}</p>
                              <p className="text-sm text-slate-500">
                                {(newResumeFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewResumeFile(null);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="font-medium text-navy">Upload a new resume</p>
                            <p className="text-sm text-slate-500">PDF or Word document, max 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <Label htmlFor="coverLetter" className="text-lg font-semibold text-navy mb-2 block">
                  Cover Letter (Optional)
                </Label>
                <p className="text-sm text-slate-500 mb-3">
                  Tell the employer why you're a great fit for this role.
                </p>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || (selectedResume === "existing" && !selectedResumeId) || (selectedResume === "new" && !newResumeFile)}
                  className="flex-1 bg-orange hover:bg-orange-dark text-white h-12 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isUploading ? "Uploading Resume..." : "Submitting..."}
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <Link href={`/jobs/${id}`}>
                  <Button type="button" variant="outline" className="h-12">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
