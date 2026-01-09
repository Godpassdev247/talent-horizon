/**
 * Careers Page - Executive Precision Design System
 * Job listings with search, filter, and application functionality
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Filter,
  ChevronRight,
  Building2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

// Sample job listings
const jobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechVentures Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150,000 - $200,000",
    department: "Engineering",
    posted: "2 days ago",
    description: "Lead development of scalable cloud infrastructure and mentor junior engineers.",
    featured: true
  },
  {
    id: "2",
    title: "Chief Financial Officer",
    company: "Global Finance Corp",
    location: "New York, NY",
    type: "Full-time",
    salary: "$300,000 - $400,000",
    department: "Executive",
    posted: "1 week ago",
    description: "Drive financial strategy and lead a team of 50+ finance professionals.",
    featured: true
  },
  {
    id: "3",
    title: "VP of Marketing",
    company: "Consumer Brands Co.",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$180,000 - $250,000",
    department: "Marketing",
    posted: "3 days ago",
    description: "Lead global marketing initiatives and brand strategy for Fortune 500 company.",
    featured: false
  },
  {
    id: "4",
    title: "Director of Human Resources",
    company: "HealthFirst Systems",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    department: "Human Resources",
    posted: "5 days ago",
    description: "Oversee HR operations for 2,000+ employees across multiple locations.",
    featured: false
  },
  {
    id: "5",
    title: "Sales Director - Enterprise",
    company: "SaaS Solutions Ltd.",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$160,000 - $220,000 + Commission",
    department: "Sales",
    posted: "1 day ago",
    description: "Build and lead enterprise sales team targeting Fortune 1000 accounts.",
    featured: true
  },
  {
    id: "6",
    title: "Operations Manager",
    company: "Manufacturing Excellence",
    location: "Detroit, MI",
    type: "Full-time",
    salary: "$95,000 - $120,000",
    department: "Operations",
    posted: "1 week ago",
    description: "Optimize manufacturing processes and manage production teams.",
    featured: false
  },
  {
    id: "7",
    title: "Data Science Lead",
    company: "AI Innovations",
    location: "Remote",
    type: "Full-time",
    salary: "$170,000 - $230,000",
    department: "Engineering",
    posted: "4 days ago",
    description: "Lead ML/AI initiatives and build predictive analytics platforms.",
    featured: false
  },
  {
    id: "8",
    title: "Product Manager - Fintech",
    company: "PayTech Solutions",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    department: "Product",
    posted: "6 days ago",
    description: "Drive product strategy for next-generation payment solutions.",
    featured: false
  }
];

const departments = ["All Departments", "Engineering", "Executive", "Marketing", "Human Resources", "Sales", "Operations", "Product"];
const locations = ["All Locations", "San Francisco, CA", "New York, NY", "Chicago, IL", "Boston, MA", "Austin, TX", "Detroit, MI", "Seattle, WA", "Remote"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract"];

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === "All Locations" || job.location === selectedLocation;
    const matchesType = selectedType === "All Types" || job.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const regularJobs = filteredJobs.filter(job => !job.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-navy overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                Career Opportunities
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Find Your <span className="text-orange italic">Dream</span> Career
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Explore executive and professional opportunities with leading 
                organizations across industries.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-xl p-4 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search jobs by title or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-0 bg-gray-50"
                    />
                  </div>
                  <Button size="lg" className="bg-orange hover:bg-orange-dark text-white h-12 px-8">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Listings */}
        <section className="py-12 md:py-20">
          <div className="container">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 rounded-xl p-6 mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-navy" />
                <span className="font-medium text-navy">Filter Jobs</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-600">
                Showing <span className="font-semibold text-navy">{filteredJobs.length}</span> positions
              </p>
            </div>

            {/* Featured Jobs */}
            {featuredJobs.length > 0 && (
              <AnimatedSection className="mb-12">
                <motion.h2 variants={fadeInUp} className="font-display text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange rounded-full" />
                  Featured Positions
                </motion.h2>
                <div className="grid gap-6">
                  {featuredJobs.map((job) => (
                    <motion.div key={job.id} variants={fadeInUp}>
                      <Link href={`/careers/${job.id}`}>
                        <div className="bg-white rounded-xl p-6 border-2 border-orange/20 hover:border-orange/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-1 bg-orange/10 text-orange text-xs font-medium rounded">
                                  Featured
                                </span>
                                <span className="text-sm text-slate-500">{job.posted}</span>
                              </div>
                              <h3 className="font-display text-xl font-bold text-navy mb-2 group-hover:text-orange transition-colors">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {job.company}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </span>
                              </div>
                              <p className="text-slate-600">{job.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-orange font-medium group-hover:gap-3 transition-all">
                              View Details <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Regular Jobs */}
            <AnimatedSection>
              <motion.h2 variants={fadeInUp} className="font-display text-2xl font-bold text-navy mb-6">
                All Positions
              </motion.h2>
              <div className="grid gap-4">
                {regularJobs.map((job) => (
                  <motion.div key={job.id} variants={fadeInUp}>
                    <Link href={`/careers/${job.id}`}>
                      <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-orange/30 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-1 bg-gray-100 text-slate-600 text-xs font-medium rounded">
                                {job.department}
                              </span>
                              <span className="text-sm text-slate-500">{job.posted}</span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-navy mb-2 group-hover:text-orange transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">
                  No positions found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your search or filters to find more opportunities.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDepartment("All Departments");
                    setSelectedLocation("All Locations");
                    setSelectedType("All Types");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="bg-navy rounded-2xl p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Don't See the Right Fit?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Submit your resume and our recruiters will match you with opportunities 
                that align with your skills and career goals.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                  Submit Your Resume
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
