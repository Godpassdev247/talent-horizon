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
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sample job data (in real app, this would come from API)
const jobsData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechVentures Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150,000 - $200,000",
    department: "Engineering",
    posted: "2 days ago",
    experience: "5+ years",
    description: "We are seeking a talented Senior Software Engineer to join our growing engineering team. You will lead development of scalable cloud infrastructure and mentor junior engineers while working on cutting-edge technology.",
    responsibilities: [
      "Design and implement scalable, high-performance backend systems",
      "Lead technical architecture decisions and code reviews",
      "Mentor junior engineers and foster a culture of technical excellence",
      "Collaborate with product and design teams to deliver exceptional user experiences",
      "Drive best practices in testing, deployment, and monitoring",
      "Participate in on-call rotation and incident response"
    ],
    requirements: [
      "5+ years of experience in software development",
      "Strong proficiency in Python, Go, or Java",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Deep understanding of distributed systems and microservices",
      "Excellent problem-solving and communication skills",
      "BS/MS in Computer Science or equivalent experience"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Unlimited PTO and flexible work arrangements",
      "401(k) matching up to 4%",
      "Professional development budget",
      "Catered meals and snacks"
    ],
    companyDescription: "TechVentures Inc. is a leading technology company building the next generation of cloud infrastructure solutions. With over 500 employees across 10 offices worldwide, we're transforming how businesses operate in the digital age."
  },
  "2": {
    id: "2",
    title: "Chief Financial Officer",
    company: "Global Finance Corp",
    location: "New York, NY",
    type: "Full-time",
    salary: "$300,000 - $400,000",
    department: "Executive",
    posted: "1 week ago",
    experience: "15+ years",
    description: "Global Finance Corp is seeking an experienced Chief Financial Officer to drive our financial strategy and lead a team of 50+ finance professionals. This is a pivotal role in our executive leadership team.",
    responsibilities: [
      "Develop and execute comprehensive financial strategy",
      "Lead financial planning, analysis, and reporting",
      "Oversee treasury, tax, and investor relations functions",
      "Partner with CEO and board on strategic initiatives",
      "Drive operational efficiency and cost optimization",
      "Manage relationships with auditors, banks, and investors"
    ],
    requirements: [
      "15+ years of progressive finance experience",
      "Previous CFO or VP Finance experience at scale",
      "CPA and/or MBA strongly preferred",
      "Experience with public company reporting (SEC)",
      "Strong leadership and communication skills",
      "Track record of driving growth and profitability"
    ],
    benefits: [
      "Executive compensation package with equity",
      "Premium health and wellness benefits",
      "Executive coaching and development",
      "Company car allowance",
      "Relocation assistance available",
      "Board observer rights"
    ],
    companyDescription: "Global Finance Corp is a Fortune 500 financial services company with $50B in assets under management. We serve millions of customers worldwide through our banking, investment, and insurance divisions."
  }
};

// Default job for unknown IDs
const defaultJob = {
  id: "0",
  title: "Position Not Found",
  company: "Unknown Company",
  location: "Unknown",
  type: "Full-time",
  salary: "Competitive",
  department: "General",
  posted: "Recently",
  experience: "Varies",
  description: "This position is no longer available or the link may be incorrect.",
  responsibilities: [],
  requirements: [],
  benefits: [],
  companyDescription: ""
};

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id || "0";
  const job = jobsData[jobId] || defaultJob;
  
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    coverLetter: ""
  });

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

  if (job.id === "0") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-navy mb-4">Position Not Found</h1>
            <p className="text-slate-600 mb-6">This job listing may have been removed or the link is incorrect.</p>
            <Link href="/careers">
              <Button className="bg-orange hover:bg-orange-dark text-white">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Careers
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/careers">
                <span className="text-slate-500 hover:text-orange cursor-pointer">Careers</span>
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
                      {job.department}
                    </span>
                    <span className="text-sm text-slate-500">Posted {job.posted}</span>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-orange" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange" />
                      {job.experience}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-slate max-w-none mb-10">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">About the Role</h2>
                  <p className="text-slate-600 leading-relaxed">{job.description}</p>
                </div>

                {/* Responsibilities */}
                <div className="mb-10">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">Responsibilities</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="mb-10">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mb-10">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">Benefits</h2>
                  <ul className="space-y-3">
                    {job.benefits.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">About {job.company}</h2>
                  <p className="text-slate-600 leading-relaxed">{job.companyDescription}</p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                {/* Apply Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-orange" />
                    <span className="font-display font-bold text-navy">{job.salary}</span>
                  </div>
                  
                  {!isApplying ? (
                    <>
                      <Button 
                        className="w-full bg-orange hover:bg-orange-dark text-white mb-3"
                        onClick={() => setIsApplying(true)}
                      >
                        Apply Now
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          rows={4}
                          placeholder="Tell us why you're a great fit..."
                          value={formData.coverLetter}
                          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1 bg-orange hover:bg-orange-dark text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Submit
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsApplying(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Quick Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-display font-bold text-navy mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department</span>
                      <span className="font-medium text-navy">{job.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Job Type</span>
                      <span className="font-medium text-navy">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-medium text-navy">{job.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location</span>
                      <span className="font-medium text-navy">{job.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
