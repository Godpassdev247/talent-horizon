/**
 * Credit Card Debt Clear Page - Professional Enterprise Design
 * Free credit card debt clearing service with professional content
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useFinancialApplications } from "@/contexts/FinancialApplicationsContext";
import { motion } from "framer-motion";
import { 
  CreditCard, Shield, Clock, CheckCircle, ArrowRight, Users,
  Award, Phone, Mail, BadgeCheck, Sparkles, TrendingDown,
  FileText, Building2, Star, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Major banks list
const majorBanks = [
  "Chase", "Bank of America", "Wells Fargo", "Citibank", "Capital One",
  "Discover", "American Express", "US Bank", "PNC Bank", "TD Bank",
  "HSBC", "Barclays", "Goldman Sachs", "Morgan Stanley", "Navy Federal",
  "USAA", "Synchrony Bank", "Ally Bank", "Marcus by Goldman Sachs", "Other"
];

// Success stories
const successStories = [
  {
    name: "Michael R.",
    amount: "$47,500",
    bank: "Chase",
    quote: "I was drowning in credit card debt for years. Talent Horizon's team cleared my entire balance in just 6 weeks. I still can't believe it's real.",
    image: "/images/team-meeting.jpg"
  },
  {
    name: "Sarah L.",
    amount: "$82,000",
    bank: "Bank of America",
    quote: "After losing my job, my credit card debt spiraled out of control. The experts here gave me a fresh start without paying a dime.",
    image: "/images/interview-success.jpg"
  },
  {
    name: "David K.",
    amount: "$125,000",
    bank: "Multiple Banks",
    quote: "I had debt across 5 different cards. They handled everything professionally and cleared all of it. Life-changing service.",
    image: "/images/career-growth.jpg"
  }
];

// Statistics
const stats = [
  { value: "$2.5B+", label: "Total Debt Cleared" },
  { value: "50,000+", label: "Clients Helped" },
  { value: "100%", label: "Free Service" },
  { value: "24-48hrs", label: "Response Time" },
];

export default function CreditCardDebt() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [creditLimit, setCreditLimit] = useState(50000);
  const [creditLimitError, setCreditLimitError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bankName: "",
    currentBalance: "",
    agreeTerms: false,
  });

  const { addCreditCardApplication } = useFinancialApplications();

  const submissionSteps = [
    { label: 'Validating Information', icon: Shield },
    { label: 'Encrypting Data', icon: Shield },
    { label: 'Creating Application', icon: FileText },
    { label: 'Finalizing Submission', icon: CheckCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate credit limit minimum
    if (creditLimit < 100) {
      setCreditLimitError("Credit limit must be at least $100");
      return;
    }
    
    // Clear any previous error
    setCreditLimitError("");
    
    // Scroll to top to show animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set submitting state immediately and show animation
    setIsSubmitting(true);
    setShowAnimation(true);
    setSubmissionStep(0);

    // Wait for React to render the animation screen
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(undefined);
        });
      });
    });

    // Add initial delay to ensure animation is visible
    await new Promise(resolve => setTimeout(resolve, 500));

    // Professional loading animation with steps
    for (let i = 0; i < submissionSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSubmissionStep(i + 1);
    }

    // Save application to context (persisted in localStorage)
    addCreditCardApplication({
      type: 'credit-card',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      bankName: formData.bankName,
      cardType: '', // Will be filled by admin after review
      cardLast4: '', // Will be filled by admin after review
      creditLimit: creditLimit,
      currentBalance: parseFloat(formData.currentBalance) || 0,
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
  if (showAnimation && isSubmitting) {
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
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              <h2 className="font-display text-2xl font-bold text-center text-navy mb-2">
                Processing Your Application
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
                Application Submitted Successfully!
              </h1>
              <p className="text-slate-600 mb-8">
                Thank you for choosing Talent Horizon's Credit Card Debt Clear program. 
                Our expert team will review your application and contact you within 
                <span className="font-semibold text-navy"> 24-48 hours</span>.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Expected Response Time</span>
                </div>
                <p className="font-display text-2xl font-bold text-navy">24-48 Hours</p>
              </div>

              <div className="bg-orange/5 border border-orange/20 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-navy mb-2">What Happens Next?</h3>
                <ul className="text-sm text-slate-600 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>Our debt specialist will call you to verify your information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>We'll analyze your credit card statements and debt structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a personalized debt clearance plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>Our team handles everything - you pay nothing</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <Link href="/dashboard?tab=financial&section=credit-card">
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
                  <Sparkles className="w-4 h-4" />
                  100% Free Service - No Hidden Fees
                </span>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Clear Your <span className="text-orange">Credit Card Debt</span> Completely Free
                </h1>
                
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  Struggling with credit card debt? Our expert team has helped over 50,000 
                  individuals eliminate their credit card balances completely free of charge. 
                  No matter your credit limit or balance, we can help.
                </p>

                <div className="flex flex-wrap gap-6 mb-8">
                  {[
                    { icon: Shield, text: "100% Confidential" },
                    { icon: Clock, text: "24-48hr Response" },
                    { icon: Award, text: "Expert Team" },
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
                  Apply Now - It's Free
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
                    src="/images/credit-card-debt.jpg" 
                    alt="Credit Card Debt Relief"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <TrendingDown className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Average Debt Cleared</p>
                          <p className="font-display text-2xl font-bold text-navy">$67,500</p>
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

        {/* How It Works */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-navy/10 text-navy rounded-full text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                Simple Process
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                How Our Debt Clearance Works
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our proven process has helped thousands of people become debt-free. 
                Here's how we can help you too.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Submit Application",
                  description: "Fill out our simple online form with your basic information and credit card details."
                },
                {
                  step: "02",
                  title: "Expert Review",
                  description: "Our debt specialists analyze your situation and create a personalized clearance plan."
                },
                {
                  step: "03",
                  title: "Verification Call",
                  description: "We'll contact you within 24-48 hours to verify details and explain the process."
                },
                {
                  step: "04",
                  title: "Debt Cleared",
                  description: "Our team handles everything with your bank. You pay nothing and become debt-free."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                    <span className="font-display text-5xl font-bold text-slate-100">{item.step}</span>
                    <h3 className="font-display text-xl font-bold text-navy mt-4 mb-3">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
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
                Success Stories
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Real People, Real Results
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here are stories from people who have 
                successfully cleared their credit card debt with our help.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8"
                >
                  <Quote className="w-10 h-10 text-slate-200 mb-4" />
                  <p className="text-slate-600 mb-6 italic">"{story.quote}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{story.name}</p>
                      <p className="text-sm text-slate-500">Cleared {story.amount} from {story.bank}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply-form" className="py-20 bg-slate-50">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 text-orange rounded-full text-sm font-medium mb-4">
                <BadgeCheck className="w-4 h-4" />
                Free Application
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Apply for Free Debt Clearance
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Fill out the form below and our expert team will contact you within 24-48 hours. 
                It doesn't matter your credit card limit - we can help.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8 md:p-12">
                <div className="space-y-8">
                  {/* Credit Limit Input */}
                  <div className="space-y-4">
                    <Label className="text-navy font-medium">Credit Card Limit</Label>
                    <div className="bg-slate-50 rounded-xl p-6">
                      {/* Manual Input Field */}
                      <div className="mb-4">
                        <Label htmlFor="creditLimitInput" className="text-sm text-slate-600 mb-2 block">Enter your credit limit (or use slider below)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                          <Input
                            id="creditLimitInput"
                            type="number"
                            value={creditLimit}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setCreditLimit(Math.min(value, 1000000));
                              // Clear error when user types
                              if (value >= 100) {
                                setCreditLimitError("");
                              }
                            }}
                            className={`h-12 pl-8 text-lg font-semibold text-navy ${creditLimitError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="50000"
                            min={0}
                            max={1000000}
                          />
                          {creditLimitError && (
                            <p className="text-red-500 text-sm mt-1">{creditLimitError}</p>
                          )}
                        </div>
                      </div>
                      {/* Display formatted value */}
                      <div className="text-center mb-4">
                        <span className="font-display text-3xl font-bold text-navy">
                          {formatCurrency(creditLimit)}
                        </span>
                      </div>
                      {/* Slider for quick adjustment */}
                      <Slider
                        value={[creditLimit]}
                        onValueChange={(value) => setCreditLimit(value[0])}
                        min={100}
                        max={1000000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm text-slate-500">
                        <span>$100</span>
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

                  {/* Bank Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-navy font-medium">Credit Card Bank</Label>
                    <Select
                      value={formData.bankName}
                      onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {majorBanks.map((bank) => (
                          <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Balance */}
                  <div className="space-y-2">
                    <Label htmlFor="currentBalance" className="text-navy font-medium">Current Balance ($)</Label>
                    <Input
                      id="currentBalance"
                      type="number"
                      value={formData.currentBalance}
                      onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                      className="h-12"
                      placeholder="Enter your current credit card balance"
                      required
                    />
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-100">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    />
                    <Label htmlFor="agreeTerms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy. I understand that Talent Horizon 
                      will contact me regarding my credit card debt clearance application. This service is 
                      completely free with no hidden fees.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={!formData.agreeTerms}
                    className="w-full h-14 bg-orange hover:bg-orange-dark text-white text-lg font-semibold"
                  >
                    Submit Application
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>

              <div className="px-8 md:px-12 py-6 bg-slate-50 border-t border-slate-100">
                <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Bank-Level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>24-48 Hour Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    <span>100% Free Service</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold text-navy mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  q: "Is this service really free?",
                  a: "Yes, our credit card debt clearance service is 100% free. We do not charge any fees, hidden costs, or commissions. Our mission is to help people become debt-free."
                },
                {
                  q: "How does the debt clearance process work?",
                  a: "Our team of financial experts works directly with your credit card company using proven legal strategies to negotiate and clear your debt. You don't need to do anything except provide us with the necessary information."
                },
                {
                  q: "Will this affect my credit score?",
                  a: "Our debt clearance process is designed to minimize any negative impact on your credit score. In many cases, clients see their credit scores improve after becoming debt-free."
                },
                {
                  q: "How long does the process take?",
                  a: "The timeline varies depending on your specific situation and the credit card company involved. Typically, the process takes 4-8 weeks from start to finish."
                },
                {
                  q: "What credit card limits do you accept?",
                  a: "We help clients with credit card limits ranging from $100 to over $1,000,000. No matter how much you owe, we can help you become debt-free."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-50 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-navy mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
