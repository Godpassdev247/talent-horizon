/**
 * Home Page - Enterprise Recruitment Platform
 * World-class job search and recruitment landing page
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Search, MapPin, ArrowRight, Users, Target, Award, TrendingUp,
  Building2, Briefcase, Shield, Clock, CheckCircle2, Star, ChevronRight,
  Zap, Globe, Heart, DollarSign, CreditCard, Receipt, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import JobCard from "@/components/jobs/JobCard";

// Animation variants
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

// Animated section wrapper
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

// Stats data
const stats = [
  { value: "50K+", label: "Active Jobs" },
  { value: "10K+", label: "Companies" },
  { value: "2M+", label: "Job Seekers" },
  { value: "98%", label: "Success Rate" },
];

// Categories with realistic images
const categories = [
  { icon: Briefcase, title: "Technology", count: "12,500+ jobs", color: "bg-slate-700", image: "/images/job-tech.jpg" },
  { icon: TrendingUp, title: "Finance", count: "8,200+ jobs", color: "bg-slate-600", image: "/images/job-finance.jpg" },
  { icon: Heart, title: "Healthcare", count: "6,800+ jobs", color: "bg-slate-500", image: "/images/job-healthcare.jpg" },
  { icon: Building2, title: "Engineering", count: "9,100+ jobs", color: "bg-slate-700", image: "/images/job-engineering.jpg" },
  { icon: Users, title: "Sales", count: "7,400+ jobs", color: "bg-slate-600", image: "/images/job-marketing.jpg" },
  { icon: Globe, title: "Marketing", count: "5,600+ jobs", color: "bg-slate-500", image: "/images/job-marketing.jpg" },
];

// Financial services data
const financialServices = [
  {
    icon: DollarSign,
    title: "Apply for Loan",
    description: "Personal & Business loans from $50K to $5M with competitive rates",
    href: "/financial/loan-application",
    image: "/images/loan-hero.jpg",
    badge: "Fast Approval"
  },
  {
    icon: CreditCard,
    title: "Credit Card Debt Clear",
    description: "Clear your credit card debt completely free of charge",
    href: "/financial/credit-card-debt",
    image: "/images/credit-card-debt.jpg",
    badge: "100% Free"
  },
  {
    icon: Receipt,
    title: "Tax Refund Filing",
    description: "Maximum refund guaranteed with our expert tax professionals",
    href: "/financial/tax-refund",
    image: "/images/tax-refund.jpg",
    badge: "Max Refund"
  }
];

// Testimonials
const testimonials = [
  {
    quote: "Found my dream job within 2 weeks. The platform's matching algorithm is incredibly accurate.",
    author: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "TechVentures Inc.",
    avatar: "SC"
  },
  {
    quote: "As an employer, we've hired 50+ top talents through Talent Horizon. Best recruitment platform we've used.",
    author: "Michael Roberts",
    role: "VP of Human Resources",
    company: "Global Finance Corp",
    avatar: "MR"
  },
  {
    quote: "The application tracking and resume management features are game-changers for job seekers.",
    author: "Jennifer Walsh",
    role: "Product Manager",
    company: "Innovation Labs",
    avatar: "JW"
  }
];

export default function Home() {
  const [, navigate] = useLocation();
  const [keyword, setKeyword] = useState("");
  const [location, setLocationInput] = useState("");

  // Fetch featured jobs
  const { data: featuredJobs, isLoading: loadingFeatured } = trpc.jobs.getFeatured.useQuery({ limit: 6 });
  
  // Seed data on first load (development only)
  const seedMutation = trpc.seed.init.useMutation();
  
  useEffect(() => {
    // Trigger seed once
    seedMutation.mutate();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  #1 Job Platform for Professionals
                </span>
              </motion.div>

              <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Find Your{" "}
                <span className="text-orange">Dream Career</span>
                <br />
                Start Today
              </motion.h1>

              <motion.p
                className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Connect with top employers worldwide. Over 50,000 jobs from leading 
                companies across every industry. Your next opportunity awaits.
              </motion.p>

              {/* Search Box */}
              <motion.form
                onSubmit={handleSearch}
                className="bg-white rounded-2xl p-3 shadow-2xl max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="pl-12 h-14 text-lg border-0 bg-slate-50 focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="pl-12 h-14 text-lg border-0 bg-slate-50 focus-visible:ring-0"
                    />
                  </div>
                  <Button 
                    type="submit"
                    size="lg" 
                    className="h-14 px-8 bg-orange hover:bg-orange-dark text-white text-lg font-semibold"
                  >
                    Search Jobs
                  </Button>
                </div>
              </motion.form>

              {/* Popular searches */}
              <motion.div
                className="mt-6 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="text-white/60 text-sm">Popular:</span>
                {["Software Engineer", "Product Manager", "Data Scientist", "Marketing", "Remote"].map((term) => (
                  <button
                    key={term}
                    onClick={() => { setKeyword(term); }}
                    className="text-sm text-white/80 hover:text-orange transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Financial Services Hero Section */}
        <AnimatedSection className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-600 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                <BadgeCheck className="w-4 h-4" />
                Financial Services
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
                Your Financial <span className="text-orange">Success Partner</span>
              </h2>
              <p className="text-xl text-white/70">
                Beyond careers, we help you achieve financial freedom with our trusted loan services, 
                debt relief programs, and expert tax filing assistance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {financialServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className="group"
                >
                  <Link href={service.href}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-orange text-white text-xs font-semibold rounded-full">
                            {service.badge}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <service.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-display text-xl font-bold text-navy mb-3 group-hover:text-orange transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center text-orange font-medium">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap justify-center gap-8 items-center">
              <div className="flex items-center gap-3 text-white/60">
                <Shield className="w-6 h-6" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <CheckCircle2 className="w-6 h-6" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Users className="w-6 h-6" />
                <span>500K+ Clients Served</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Award className="w-6 h-6" />
                <span>A+ BBB Rating</span>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-navy mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <AnimatedSection className="py-20 bg-slate-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="flex justify-between items-end mb-12">
              <div>
                <span className="text-orange font-medium mb-2 block">Featured Opportunities</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">
                  Latest Job Openings
                </h2>
              </div>
              <Link href="/jobs">
                <Button variant="outline" className="hidden md:flex border-orange text-orange hover:bg-orange hover:text-white">
                  View All Jobs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {loadingFeatured ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : featuredJobs && featuredJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job, index) => (
                  <motion.div key={job.id} variants={fadeInUp}>
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No featured jobs available yet.</p>
                <p className="text-sm text-slate-400 mt-2">Check back soon for new opportunities!</p>
              </div>
            )}

            <motion.div variants={fadeInUp} className="text-center mt-8 md:hidden">
              <Link href="/jobs">
                <Button className="bg-orange hover:bg-orange-dark text-white">
                  View All Jobs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Categories Section */}
        <AnimatedSection className="py-20 bg-white">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-orange font-medium mb-2 block">Browse by Category</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Explore Jobs by Industry
              </h2>
              <p className="text-slate-600">
                Find opportunities in your field of expertise from our extensive job database
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div key={category.title} variants={fadeInUp}>
                  <Link href={`/jobs?department=${category.title}`}>
                    <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-orange/30 hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                        <div className={`absolute bottom-3 left-3 w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-navy text-lg mb-1">
                          {category.title}
                        </h3>
                        <p className="text-slate-500 text-sm">{category.count}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection className="py-20 bg-navy text-white">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-2 block">How It Works</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Your Path to Success
              </h2>
              <p className="text-white/70">
                Three simple steps to land your dream job
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Create Profile", desc: "Build your professional profile and upload your resume to get started", icon: Users },
                { step: "02", title: "Search & Apply", desc: "Browse thousands of jobs and apply with one click using your saved profile", icon: Search },
                { step: "03", title: "Get Hired", desc: "Track your applications and connect directly with employers", icon: CheckCircle2 },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  className="relative"
                >
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10 hover:border-orange/50 transition-colors">
                    <div className="text-orange/30 font-display text-6xl font-bold absolute top-4 right-4">
                      {item.step}
                    </div>
                    <div className="w-14 h-14 bg-orange rounded-xl flex items-center justify-center mb-6">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection className="py-20 bg-slate-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-orange font-medium mb-2 block">Success Stories</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                What Our Users Say
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-8 shadow-sm border border-slate-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange text-orange" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-display font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-navy">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange to-orange-dark text-white">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Take the Next Step?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join millions of professionals who have found their dream careers through Talent Horizon.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="bg-white text-orange hover:bg-slate-100 text-lg px-8">
                    Browse Jobs
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/employers">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange text-lg px-8">
                    For Employers
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
