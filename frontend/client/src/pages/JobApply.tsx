/**
 * Job Application Page - Apply with CV upload
 */

import { useState, useRef, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Upload, FileText, X, CheckCircle2, 
  Briefcase, Building2, MapPin, Loader2, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// Application interface for localStorage
interface StoredApplication {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  jobType: string;
  coverLetter?: string;
  resumeName?: string;
  status: 'applied' | 'review' | 'interview' | 'offer' | 'rejected';
  appliedAt: string;
}

export default function JobApply() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedResume, setSelectedResume] = useState<"existing" | "new">("new");
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Fetch job details
  const { data: jobData, isLoading: jobLoading } = trpc.jobs.getById.useQuery(
    { id: parseInt(id || "0") },
    { enabled: !!id }
  );

  // Check if already applied
  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]') as StoredApplication[];
    const hasApplied = applications.some(app => app.jobId === parseInt(id || "0"));
    setAlreadyApplied(hasApplied);
  }, [id]);

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

    if (alreadyApplied) {
      toast.error("You have already applied to this job");
      return;
    }

    setIsSubmitting(true);

    try {
      const job = jobData?.job;
      const company = jobData?.company;

      if (!job) {
        toast.error("Job not found");
        setIsSubmitting(false);
        return;
      }

      // Create application object
      const newApplication: StoredApplication = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        jobId: parseInt(id || "0"),
        jobTitle: job.title,
        company: company?.name || 'Unknown Company',
        companyLogo: company?.logoUrl,
        location: job.location || 'Remote',
        salary: job.salaryMin && job.salaryMax 
          ? `$${(job.salaryMin / 1000).toFixed(0)}K - $${(job.salaryMax / 1000).toFixed(0)}K`
          : undefined,
        jobType: job.jobType || 'full-time',
        coverLetter: coverLetter || undefined,
        resumeName: newResumeFile?.name,
        status: 'applied',
        appliedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]') as StoredApplication[];
      applications.unshift(newApplication);
      localStorage.setItem('applications', JSON.stringify(applications));

      setSubmitted(true);
      toast.success("Application submitted successfully!");

    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
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

  if (alreadyApplied && !submitted) {
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
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-orange" />
              </div>
              <h1 className="font-display text-3xl font-bold text-navy mb-4">
                Already Applied
              </h1>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                You have already submitted an application for this position. Check your applications to track its status.
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

      <main className="flex-1 py-4 sm:py-8">
        <div className="container max-w-3xl px-4 sm:px-6">
          {/* Back Button */}
          <Link href={`/jobs/${id}`}>
            <Button variant="ghost" className="mb-4 sm:mb-6 text-slate-600 hover:text-navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Button>
          </Link>

          {/* Job Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                {company?.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                ) : (
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                )}
                {company?.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-white to-blue-50 rounded-full p-1 sm:p-1.5 shadow-lg">
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <h1 className="font-display text-lg sm:text-xl font-bold text-navy mb-1">
                  Apply for {job?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-slate-600 font-medium text-sm sm:text-base">{company?.name}</p>
                  {company?.verified && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50/90 to-blue-100/70 text-blue-600 text-xs sm:text-sm font-medium rounded-full shadow-sm">
                      <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      Verified Employer
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500">
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {job?.location}
                  </span>
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    {job?.jobType?.replace('-', ' ') || 'Full-time'}
                  </span>
                </div>
              </div>
            </div>
            {company?.verified && (
              <div className="mt-4 pt-4 border-t border-slate-100/80">
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg">
                  <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-blue-700">Verified Employer</p>
                    <p className="text-xs text-blue-600/70">This company has been verified by Talent Horizon. Your application is secure.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Application Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
          >
            {/* Resume Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-display text-base sm:text-lg font-semibold text-navy mb-3 sm:mb-4">Resume / CV</h2>
              <RadioGroup value={selectedResume} onValueChange={(v) => setSelectedResume(v as "existing" | "new")}>
                {/* Upload New Resume */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 sm:p-6 hover:border-slate-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="new" id="resume-new" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="resume-new" className="text-sm sm:text-base font-medium text-navy cursor-pointer">
                        Upload a new resume
                      </Label>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">PDF or Word document, max 5MB</p>
                      
                      {newResumeFile ? (
                        <div className="mt-3 sm:mt-4 flex items-center gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-navy truncate">{newResumeFile.name}</p>
                            <p className="text-xs text-slate-500">{(newResumeFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setNewResumeFile(null)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 sm:mt-4 flex flex-col items-center justify-center p-4 sm:p-6 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mb-2" />
                          <p className="text-xs sm:text-sm text-slate-600">Click to upload</p>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Cover Letter */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-display text-base sm:text-lg font-semibold text-navy mb-2">Cover Letter (Optional)</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">Tell the employer why you're a great fit for this role.</p>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter here..."
                className="min-h-[120px] sm:min-h-[150px] resize-none text-sm sm:text-base"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange hover:bg-orange-dark text-white py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
              <Link href={`/jobs/${id}`}>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
            </div>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
