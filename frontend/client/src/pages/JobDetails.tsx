/**
 * Job Details Page - Executive Precision Design System
 * Individual job listing with full details and application form
 */

import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building2,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
  Send,
  Loader2,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";

// Helper function to format salary
function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Competitive";
  if (min && max) {
    return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
  }
  if (min) return `From $${(min / 1000).toFixed(0)}K`;
  if (max) return `Up to $${(max / 1000).toFixed(0)}K`;
  return "Competitive";
}

// Helper function to format job type
function formatJobType(type?: string | null): string {
  if (!type) return "Full-time";
  return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
}

// Helper function to format experience level
function formatExperience(level?: string | null): string {
  const levels: Record<string, string> = {
    'entry': 'Entry Level',
    'mid': 'Mid Level (2-5 years)',
    'senior': 'Senior (5+ years)',
    'executive': 'Executive (10+ years)',
  };
  return levels[level || 'mid'] || 'Mid Level';
}

// Helper to parse requirements/benefits from text
function parseListFromText(text?: string | null): string[] {
  if (!text) return [];
  // Try to split by newlines or bullet points
  const lines = text.split(/[\n•\-\*]+/).map(l => l.trim()).filter(l => l.length > 0);
  return lines.length > 0 ? lines : [text];
}

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id || "0";
  
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    coverLetter: ""
  });

  // Fetch job from API
  const { data, isLoading, error } = trpc.jobs.getById.useQuery(
    { id: parseInt(jobId) },
    { enabled: !!jobId && jobId !== "0" }
  );

  const job = data?.job;
  const company = data?.company;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted successfully! We'll be in touch soon.");
    setIsApplying(false);
    setFormData({ name: "", email: "", phone: "", linkedin: "", coverLetter: "" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading job details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!job || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-navy mb-4">Position Not Found</h1>
            <p className="text-slate-600 mb-6">This job listing may have been removed or the link is incorrect.</p>
            <Link href="/jobs">
              <Button className="bg-orange hover:bg-orange-dark text-white">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const requirements = parseListFromText(job.requirements);
  const benefits = parseListFromText(job.benefits);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/jobs">
                <span className="text-slate-500 hover:text-orange cursor-pointer">Jobs</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-navy font-medium">{job.title}</span>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full">
                      {job.department || formatJobType(job.jobType)}
                    </span>
                    <span className="text-sm text-slate-500">
                      Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange" />
                      {company?.name || 'Company'}
                      {company?.verified && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50/90 to-blue-100/70 text-blue-600 text-sm font-medium rounded-full shadow-sm" title="Verified Company">
                          <BadgeCheck className="w-4 h-4" />
                          Verified Employer
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-orange" />
                      {formatJobType(job.jobType)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange" />
                      {formatExperience(job.experienceLevel)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-slate max-w-none mb-10">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">About the Role</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>

                {/* Requirements */}
                {requirements.length > 0 && (
                  <div className="mb-10">
                    <h2 className="font-display text-xl font-bold text-navy mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {requirements.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {benefits.length > 0 && (
                  <div className="mb-10">
                    <h2 className="font-display text-xl font-bold text-navy mb-4">Benefits</h2>
                    <ul className="space-y-3">
                      {benefits.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Company Info */}
                {company && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="font-display text-xl font-bold text-navy mb-4">About {company.name}</h2>
                    <p className="text-slate-600 leading-relaxed">
                      {company.description || `${company.name} is a leading company in the ${company.industry || 'industry'} sector.`}
                    </p>
                    {company.website && (
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange hover:underline mt-4 inline-block"
                      >
                        Visit Company Website →
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                {/* Job Summary Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden relative">
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
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-navy">{company?.name || 'Company'}</h3>
                        {company?.verified && (
                          <BadgeCheck className="w-5 h-5 text-blue-500" title="Verified Company" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{company?.industry || 'Technology'}</p>
                      {company?.verified && (
                        <span className="text-xs text-blue-500/80">Verified Employer</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Salary</span>
                      <span className="font-semibold text-navy flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Job Type</span>
                      <span className="font-medium text-navy">{formatJobType(job.jobType)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-medium text-navy">{formatExperience(job.experienceLevel)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location</span>
                      <span className="font-medium text-navy">{job.locationType === 'remote' ? 'Remote' : job.location}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href={`/jobs/${job.id}/apply`}>
                      <Button className="w-full bg-orange hover:bg-orange-dark text-white">
                        <Send className="mr-2 w-4 h-4" />
                        Apply Now
                      </Button>
                    </Link>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-2 w-4 h-4" />
                        Share
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Heart className="mr-2 w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Back to Jobs */}
                <Link href="/jobs">
                  <Button variant="ghost" className="w-full text-slate-600 hover:text-navy">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to All Jobs
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
