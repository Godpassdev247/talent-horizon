/**
 * Tax Refund Filing Page - Professional Enterprise Design
 * Maximum tax refund guarantee with expert team
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useFinancialApplications } from "@/contexts/FinancialApplicationsContext";
import { motion } from "framer-motion";
import { 
  FileText, Shield, Clock, CheckCircle, ArrowRight, Users,
  Award, Phone, Mail, BadgeCheck, Sparkles, DollarSign,
  Building2, Star, Quote, Calculator, TrendingUp, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Employment status options
const employmentStatuses = [
  { value: "employed", label: "Employed (W-2)" },
  { value: "self-employed", label: "Self-Employed (1099)" },
  { value: "business-owner", label: "Business Owner" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
];

// Filing status options
const filingStatuses = [
  { value: "single", label: "Single" },
  { value: "married-joint", label: "Married Filing Jointly" },
  { value: "married-separate", label: "Married Filing Separately" },
  { value: "head-household", label: "Head of Household" },
  { value: "widow", label: "Qualifying Widow(er)" },
];

// Expert team members
const expertTeam = [
  {
    name: "Dr. Robert Chen",
    title: "Chief Tax Strategist",
    experience: "25+ Years",
    image: "/images/team-meeting.jpg",
    credentials: "CPA, JD, LLM in Taxation"
  },
  {
    name: "Sarah Mitchell",
    title: "Senior Tax Consultant",
    experience: "18+ Years",
    image: "/images/interview-success.jpg",
    credentials: "CPA, EA, CFP"
  },
  {
    name: "Michael Torres",
    title: "Business Tax Specialist",
    experience: "20+ Years",
    image: "/images/career-growth.jpg",
    credentials: "CPA, MBA, CMA"
  },
  {
    name: "Jennifer Adams",
    title: "Individual Tax Expert",
    experience: "15+ Years",
    image: "/images/remote-work.jpg",
    credentials: "CPA, EA"
  }
];

// Statistics
const stats = [
  { value: "$850M+", label: "Total Refunds Secured" },
  { value: "125,000+", label: "Clients Served" },
  { value: "99.8%", label: "Approval Rate" },
  { value: "$100K-$1M", label: "Refund Range" },
];

// Success stories
const successStories = [
  {
    name: "James W.",
    refund: "$287,000",
    type: "Business Owner",
    quote: "I was skeptical at first, but Talent Horizon's tax experts found deductions I never knew existed. My refund was 4x what I expected."
  },
  {
    name: "Patricia M.",
    refund: "$156,000",
    type: "Self-Employed",
    quote: "As a freelancer, I always struggled with taxes. Their team maximized every possible deduction and got me an incredible refund."
  },
  {
    name: "David & Lisa K.",
    refund: "$423,000",
    type: "Small Business",
    quote: "Our business tax situation was complex. They handled everything professionally and secured a refund that transformed our business."
  }
];

export default function TaxRefund() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimatedRefund, setEstimatedRefund] = useState(250000);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employmentStatus: "",
    filingStatus: "",
    annualIncome: "",
    dependents: "",
    agreeTerms: false,
  });

  const { addTaxRefundApplication } = useFinancialApplications();

  const submissionSteps = [
    { label: 'Validating Information', icon: Shield },
    { label: 'Encrypting Data', icon: Shield },
    { label: 'Creating Application', icon: FileText },
    { label: 'Finalizing Submission', icon: CheckCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Scroll to top to show animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsSubmitting(true);
    setSubmissionStep(0);

    // Professional loading animation with steps
    for (let i = 0; i < submissionSteps.length; i++) {
      setSubmissionStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Save application to context (persisted in localStorage)
    addTaxRefundApplication({
      type: 'tax-refund',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      taxYear: new Date().getFullYear(),
      employmentStatus: formData.employmentStatus,
      filingStatus: formData.filingStatus,
      estimatedIncome: parseFloat(formData.annualIncome) || 0,
      estimatedRefund: estimatedRefund,
    });

    // Final delay before showing success
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Loading animation screen
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-20">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12"
            >
              {/* Animated Logo/Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8c] flex items-center justify-center"
                >
                  <FileText className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              <h2 className="font-display text-2xl font-bold text-center text-navy mb-2">
                Processing Your Tax Filing Request
              </h2>
              <p className="text-slate-500 text-center mb-8">
                Please wait while we securely process your information
              </p>

              {/* Progress Steps */}
              <div className="space-y-4 mb-8">
                {submissionSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === submissionStep;
                  const isComplete = index < submissionStep;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#1e3a5f] text-white shadow-lg' 
                          : isComplete 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20' 
                          : isComplete 
                            ? 'bg-green-100' 
                            : 'bg-slate-200'
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <StepIcon className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isActive ? 'text-white' : isComplete ? 'text-green-700' : 'text-slate-500'
                        }`}>
                          {step.label}
                        </p>
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8 }}
                            className="h-1 bg-white/30 rounded-full mt-2"
                          />
                        )}
                      </div>
                      {isComplete && (
                        <span className="text-sm font-medium text-green-600">Complete</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL Encrypted • Bank-Level Security</span>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-20">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-slate-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-navy mb-4">
                Tax Filing Request Submitted!
              </h1>
              <p className="text-slate-600 mb-8">
                Thank you for choosing Talent Horizon for your tax refund filing. 
                Our expert team will review your information and contact you within 
                <span className="font-semibold text-navy"> 24-48 hours</span> to begin 
                maximizing your refund.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
                  <Calculator className="w-4 h-4" />
                  <span className="text-sm">Estimated Refund Range</span>
                </div>
                <p className="font-display text-2xl font-bold text-navy">
                  {formatCurrency(estimatedRefund * 0.8)} - {formatCurrency(estimatedRefund * 1.2)}
                </p>
              </div>

              <div className="bg-orange/5 border border-orange/20 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-navy mb-2">What Happens Next?</h3>
                <ul className="text-sm text-slate-600 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>A tax expert will call you to discuss your situation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>We'll request necessary documents (W-2s, 1099s, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>Our team will identify all possible deductions and credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>We guarantee maximum refund or your money back</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <Link href="/dashboard?tab=financial&section=tax-refund">
                  <Button className="w-full bg-orange hover:bg-orange-dark text-white">
                    View Application Status
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-slate-300">
                    Return to Home
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl" />
          </div>
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                  <Award className="w-4 h-4" />
                  Maximum Refund Guarantee
                </span>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  File Your Taxes, Get <span className="text-orange">Maximum Refund</span>
                </h1>
                
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  Our expert tax professionals have helped over 125,000 individuals and businesses 
                  secure refunds ranging from $100,000 to $1,000,000+. It doesn't matter your 
                  employment status - we guarantee approval and maximum refund.
                </p>

                <div className="flex flex-wrap gap-6 mb-8">
                  {[
                    { icon: Shield, text: "IRS Compliant" },
                    { icon: Award, text: "25+ Years Experience" },
                    { icon: BadgeCheck, text: "Guaranteed Results" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70">
                      <item.icon className="w-5 h-5" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  className="bg-orange hover:bg-orange-dark text-white px-8 h-14 text-lg"
                  onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Tax Filing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/tax-refund.jpg" 
                    alt="Tax Refund Filing"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Average Refund Secured</p>
                          <p className="font-display text-2xl font-bold text-navy">$287,500</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-display text-3xl md:text-4xl font-bold text-navy mb-2">{stat.value}</p>
                  <p className="text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Team Section */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-navy/10 text-navy rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Expert Team
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Meet Our Tax Experts
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our team of certified professionals brings decades of combined experience 
                in tax law, accounting, and financial planning to maximize your refund.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {expertTeam.map((expert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg group"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={expert.image} 
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-navy">{expert.name}</h3>
                    <p className="text-orange font-medium text-sm mb-2">{expert.title}</p>
                    <p className="text-slate-500 text-sm mb-3">{expert.credentials}</p>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{expert.experience}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 text-orange rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                Why Choose Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                We Guarantee Maximum Refund
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                With over 25 years of experience and a 99.8% approval rate, we're the 
                trusted choice for individuals and businesses seeking maximum tax refunds.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Calculator,
                  title: "Expert Analysis",
                  description: "Our CPAs and tax attorneys analyze every aspect of your financial situation to identify all possible deductions and credits."
                },
                {
                  icon: Shield,
                  title: "IRS Compliant",
                  description: "All our tax filings are 100% IRS compliant. We handle any audits or inquiries at no additional cost to you."
                },
                {
                  icon: DollarSign,
                  title: "Maximum Refund",
                  description: "We guarantee the maximum legal refund. If you find a higher refund elsewhere, we'll match it plus pay you $100."
                },
                {
                  icon: Clock,
                  title: "Fast Processing",
                  description: "Most refunds are processed within 2-3 weeks. We offer expedited filing for urgent situations."
                },
                {
                  icon: Briefcase,
                  title: "Business Expertise",
                  description: "Specialized services for business owners, self-employed individuals, and corporations of all sizes."
                },
                {
                  icon: Award,
                  title: "Proven Track Record",
                  description: "Over $850 million in refunds secured for 125,000+ satisfied clients across all 50 states."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8"
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <feature.icon className="w-7 h-7 text-slate-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 text-orange rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                Success Stories
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Real Results from Real Clients
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-7 h-7 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-navy">{story.refund}</p>
                      <p className="text-sm text-slate-500">{story.type}</p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-slate-200 mb-4" />
                  <p className="text-slate-600 mb-6 italic">"{story.quote}"</p>
                  <p className="font-semibold text-navy">— {story.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply-form" className="py-20 bg-white">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 text-orange rounded-full text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                Start Filing
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Begin Your Tax Refund Journey
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Fill out the form below and our expert team will contact you within 24-48 hours. 
                We guarantee approval and maximum refund regardless of your employment status.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl shadow-xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8 md:p-12">
                <div className="space-y-8">
                  {/* Estimated Refund Slider */}
                  <div className="space-y-4">
                    <Label className="text-navy font-medium">Expected Refund Range</Label>
                    <div className="bg-white rounded-xl p-6">
                      <div className="text-center mb-6">
                        <span className="font-display text-4xl font-bold text-navy">
                          {formatCurrency(estimatedRefund)}
                        </span>
                      </div>
                      <Slider
                        value={[estimatedRefund]}
                        onValueChange={(value) => setEstimatedRefund(value[0])}
                        min={100000}
                        max={1000000}
                        step={10000}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm text-slate-500">
                        <span>$100,000</span>
                        <span>$1,000,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-navy font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="h-12"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-navy font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-12"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-navy font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-navy font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  {/* Employment Status */}
                  <div className="space-y-4">
                    <Label className="text-navy font-medium">Employment Status</Label>
                    <RadioGroup
                      value={formData.employmentStatus}
                      onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {employmentStatuses.map((status) => (
                        <div key={status.value} className="relative">
                          <RadioGroupItem value={status.value} id={status.value} className="peer sr-only" />
                          <Label
                            htmlFor={status.value}
                            className="flex items-center justify-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-orange peer-data-[state=checked]:bg-orange/5 hover:border-slate-300 text-center"
                          >
                            <span className="font-medium text-navy text-sm">{status.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Filing Status */}
                  <div className="space-y-2">
                    <Label htmlFor="filingStatus" className="text-navy font-medium">Filing Status</Label>
                    <Select
                      value={formData.filingStatus}
                      onValueChange={(value) => setFormData({ ...formData, filingStatus: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your filing status" />
                      </SelectTrigger>
                      <SelectContent>
                        {filingStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome" className="text-navy font-medium">Annual Income ($)</Label>
                      <Input
                        id="annualIncome"
                        type="number"
                        value={formData.annualIncome}
                        onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                        className="h-12"
                        placeholder="75000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dependents" className="text-navy font-medium">Number of Dependents</Label>
                      <Input
                        id="dependents"
                        type="number"
                        value={formData.dependents}
                        onChange={(e) => setFormData({ ...formData, dependents: e.target.value })}
                        className="h-12"
                        placeholder="2"
                      />
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    />
                    <Label htmlFor="agreeTerms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy. I authorize Talent Horizon's 
                      tax professionals to prepare and file my tax return. I understand that all information 
                      provided will be kept confidential and used solely for tax preparation purposes.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={!formData.agreeTerms}
                    className="w-full h-14 bg-orange hover:bg-orange-dark text-white text-lg font-semibold"
                  >
                    Submit Tax Filing Request
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>

              <div className="px-8 md:px-12 py-6 bg-white border-t border-slate-100">
                <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>IRS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Maximum Refund Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>99.8% Approval Rate</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
