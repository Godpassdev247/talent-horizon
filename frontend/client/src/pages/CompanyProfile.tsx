/**
 * Company Profile Page
 * Individual company details with job listings
 */

import { useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  MapPin, Users, Globe, Building2, Briefcase, Star, 
  CheckCircle2, ArrowLeft, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import JobCard from "@/components/jobs/JobCard";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Sample company data
const companies: Record<string, {
  id: number;
  name: string;
  industry: string;
  description: string;
  longDescription: string;
  location: string;
  size: string;
  founded: string;
  website: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  benefits: string[];
  culture: string[];
  openPositions: number;
}> = {
  "1": {
    id: 1,
    name: "TechVentures Inc.",
    industry: "Technology",
    description: "Leading technology company specializing in cloud infrastructure and enterprise solutions.",
    longDescription: "TechVentures Inc. is a pioneering technology company at the forefront of cloud computing and enterprise software solutions. Founded in 2010, we've grown from a small startup to a global leader serving Fortune 500 companies across the world. Our mission is to empower businesses with cutting-edge technology that drives innovation and growth.",
    location: "San Francisco, CA",
    size: "201-500 employees",
    founded: "2010",
    website: "techventures.com",
    verified: true,
    rating: 4.5,
    reviewCount: 234,
    benefits: ["Health Insurance", "401(k) Match", "Unlimited PTO", "Remote Work", "Stock Options", "Learning Budget"],
    culture: ["Innovation-Driven", "Collaborative", "Diverse & Inclusive", "Work-Life Balance"],
    openPositions: 12
  },
  "2": {
    id: 2,
    name: "Global Finance Corp",
    industry: "Finance",
    description: "Premier financial services firm providing investment banking, asset management, and advisory services.",
    longDescription: "Global Finance Corp is a premier financial services firm with over 50 years of experience in investment banking, asset management, and strategic advisory services. We serve institutional investors, corporations, and high-net-worth individuals with tailored financial solutions that drive long-term value creation.",
    location: "New York, NY",
    size: "1000+ employees",
    founded: "1975",
    website: "globalfinancecorp.com",
    verified: true,
    rating: 4.3,
    reviewCount: 456,
    benefits: ["Competitive Salary", "Annual Bonus", "Health & Dental", "Gym Membership", "Parental Leave", "Retirement Plan"],
    culture: ["Excellence-Focused", "Client-Centric", "Professional Growth", "Team Oriented"],
    openPositions: 8
  }
};

export default function CompanyProfile() {
  const params = useParams<{ id: string }>();
  const companyId = params.id || "1";
  const company = companies[companyId] || companies["1"];

  // Fetch jobs for this company
  const { data: jobsData } = trpc.jobs.search.useQuery({
    limit: 6
  });

  const companyJobs = jobsData?.jobs?.slice(0, 4) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy py-16">
          <div className="container">
            <Link href="/companies">
              <Button variant="ghost" className="text-white/80 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Company Logo */}
              <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-12 h-12 text-navy" />
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <Badge className="bg-slate-600 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-white/80 text-lg mb-4">{company.description}</p>
                
                <div className="flex flex-wrap gap-4 text-white/70">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {company.size}
                  </span>
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {company.website}
                  </span>
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {company.rating} ({company.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <Button className="bg-orange hover:bg-orange-dark text-white">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View {company.openPositions} Open Jobs
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Company Details */}
        <AnimatedSection className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-navy mb-4">About {company.name}</h2>
                  <p className="text-slate-600 leading-relaxed">{company.longDescription}</p>
                </motion.div>

                {/* Benefits */}
                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-navy mb-6">Benefits & Perks</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {company.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Culture */}
                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-navy mb-6">Company Culture</h2>
                  <div className="flex flex-wrap gap-3">
                    {company.culture.map((value) => (
                      <Badge key={value} variant="secondary" className="px-4 py-2 text-sm bg-orange/10 text-orange">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </motion.div>

                {/* Open Positions */}
                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-bold text-navy">Open Positions</h2>
                    <Link href="/jobs">
                      <Button variant="outline" className="text-orange border-orange hover:bg-orange hover:text-white">
                        View All Jobs
                      </Button>
                    </Link>
                  </div>
                  
                  {companyJobs.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {companyJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">No open positions at this time.</p>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-navy mb-4">Company Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Industry</span>
                      <span className="font-medium text-navy">{company.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Company Size</span>
                      <span className="font-medium text-navy">{company.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Founded</span>
                      <span className="font-medium text-navy">{company.founded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Headquarters</span>
                      <span className="font-medium text-navy">{company.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Open Positions</span>
                      <span className="font-medium text-orange">{company.openPositions}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Similar Companies */}
                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-navy mb-4">Similar Companies</h3>
                  <div className="space-y-4">
                    {Object.values(companies).filter(c => c.id !== company.id).slice(0, 3).map((c) => (
                      <Link key={c.id} href={`/companies/${c.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-navy">{c.name}</p>
                            <p className="text-sm text-slate-500">{c.industry}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
