/**
 * Loan Application Page - Enterprise-Grade Multi-Step Form
 * Professional loan application for personal and business loans
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, Building2, User, CheckCircle, ArrowRight, ArrowLeft,
  Shield, Clock, Award, FileText, Briefcase, Home,
  BadgeCheck, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

// Credit score ranges
const creditScoreRanges = [
  { value: "excellent", label: "Excellent (750+)", description: "Best rates available" },
  { value: "good", label: "Good (700-749)", description: "Competitive rates" },
  { value: "fair", label: "Fair (650-699)", description: "Standard rates" },
  { value: "poor", label: "Poor (600-649)", description: "Higher rates apply" },
  { value: "bad", label: "Bad (Below 600)", description: "Limited options" },
];

// Employment types
const employmentTypes = [
  { value: "employed", label: "Employed Full-Time" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "part-time", label: "Part-Time" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
];

// Loan purposes
const loanPurposes = [
  { value: "debt-consolidation", label: "Debt Consolidation" },
  { value: "home-improvement", label: "Home Improvement" },
  { value: "major-purchase", label: "Major Purchase" },
  { value: "medical", label: "Medical Expenses" },
  { value: "vacation", label: "Vacation" },
  { value: "business", label: "Business Expenses" },
  { value: "other", label: "Other" },
];

// Business types
const businessTypes = [
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "sole-proprietor", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "nonprofit", label: "Non-Profit" },
];

// States
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export default function LoanApplication() {
  const [, navigate] = useLocation();
  const [loanType, setLoanType] = useState<"personal" | "business" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    loanAmount: 100000,
    loanPurpose: "",
    creditScore: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    employmentType: "",
    employerName: "",
    jobTitle: "",
    yearsEmployed: "",
    annualIncome: "",
    monthlyRent: "",
    businessName: "",
    businessType: "",
    yearsInBusiness: "",
    annualRevenue: "",
    numberOfEmployees: "",
    ein: "",
    agreeTerms: false,
    agreeCredit: false,
  });

  const generateApplicationNumber = () => {
    const prefix = loanType === "personal" ? "PL" : "BL";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = () => {
    const appNumber = generateApplicationNumber();
    setApplicationNumber(appNumber);
    setIsSubmitted(true);
  };

  const personalSteps = [
    { id: "loan-details", title: "Loan Details", icon: DollarSign },
    { id: "personal-info", title: "Personal Information", icon: User },
    { id: "address", title: "Address", icon: Home },
    { id: "employment", title: "Employment & Income", icon: Briefcase },
    { id: "review", title: "Review & Submit", icon: CheckCircle },
  ];

  const businessSteps = [
    { id: "loan-details", title: "Loan Details", icon: DollarSign },
    { id: "personal-info", title: "Personal Information", icon: User },
    { id: "address", title: "Address", icon: Home },
    { id: "business-info", title: "Business Information", icon: Building2 },
    { id: "financials", title: "Financials", icon: TrendingUp },
    { id: "review", title: "Review & Submit", icon: CheckCircle },
  ];

  const steps = loanType === "business" ? businessSteps : personalSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const minAmount = loanType === "business" ? 200000 : 50000;
  const maxAmount = loanType === "business" ? 5000000 : 900000;

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
                Thank you for your {loanType} loan application. Our team will review your 
                information and contact you within 24-48 hours.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-slate-500 mb-2">Your Application Number</p>
                <p className="font-display text-2xl font-bold text-navy">{applicationNumber}</p>
              </div>

              <div className="space-y-4">
                <Link href="/dashboard?tab=financial">
                  <Button className="w-full bg-orange hover:bg-orange-dark text-white">
                    Check Application Status
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

  // Loan type selection
  if (!loanType) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-72 h-72 bg-orange rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl" />
            </div>
            
            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                    <BadgeCheck className="w-4 h-4" />
                    Fast & Secure Loan Application
                  </span>
                </motion.div>
                
                <motion.h1
                  className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Apply for a <span className="text-orange">Loan</span> Today
                </motion.h1>
                
                <motion.p
                  className="text-xl text-white/80 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Get competitive rates on personal loans from $50K to $900K or business 
                  loans from $200K to $5M. Quick approval process with flexible terms.
                </motion.p>
              </div>
            </div>
          </section>

          {/* Loan Type Selection */}
          <section className="py-20 bg-slate-50">
            <div className="container max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h2 className="font-display text-3xl font-bold text-navy mb-4">Select Your Loan Type</h2>
                <p className="text-slate-600">Choose the type of loan that best fits your needs</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.button
                  onClick={() => setLoanType("personal")}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left group border-2 border-transparent hover:border-orange"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange/10 transition-colors">
                    <User className="w-8 h-8 text-slate-600 group-hover:text-orange transition-colors" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy mb-3">Personal Loan</h3>
                  <p className="text-slate-600 mb-4">
                    For individuals seeking funds for personal expenses, debt consolidation, 
                    home improvement, or major purchases.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">Loan Range</span>
                    <span className="font-display font-bold text-navy">$50K - $900K</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setLoanType("business")}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left group border-2 border-transparent hover:border-orange"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange/10 transition-colors">
                    <Building2 className="w-8 h-8 text-slate-600 group-hover:text-orange transition-colors" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy mb-3">Business Loan</h3>
                  <p className="text-slate-600 mb-4">
                    For businesses seeking capital for expansion, equipment, inventory, 
                    working capital, or other business needs.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">Loan Range</span>
                    <span className="font-display font-bold text-navy">$200K - $5M</span>
                  </div>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 flex flex-wrap justify-center gap-8 items-center"
              >
                <div className="flex items-center gap-3 text-slate-500">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">24-48 Hour Approval</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">A+ BBB Rating</span>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Multi-step form
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200">
                <div 
                  className="h-full bg-orange transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step, index) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStep 
                        ? "bg-orange text-white" 
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden md:block ${
                    index <= currentStep ? "text-navy" : "text-slate-400"
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Loan Details */}
                  {currentStep === 0 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Loan Details</h2>
                        <p className="text-slate-500">Tell us about the loan you're looking for</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-navy font-medium">Loan Amount</Label>
                        <div className="bg-slate-50 rounded-xl p-6">
                          <div className="text-center mb-6">
                            <span className="font-display text-4xl font-bold text-navy">
                              {formatCurrency(formData.loanAmount)}
                            </span>
                          </div>
                          <Slider
                            value={[formData.loanAmount]}
                            onValueChange={(value) => setFormData({ ...formData, loanAmount: value[0] })}
                            min={minAmount}
                            max={maxAmount}
                            step={loanType === "business" ? 50000 : 10000}
                            className="w-full"
                          />
                          <div className="flex justify-between mt-2 text-sm text-slate-500">
                            <span>{formatCurrency(minAmount)}</span>
                            <span>{formatCurrency(maxAmount)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-navy font-medium">Credit Score Range</Label>
                        <RadioGroup
                          value={formData.creditScore}
                          onValueChange={(value) => setFormData({ ...formData, creditScore: value })}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                          {creditScoreRanges.map((range) => (
                            <div key={range.value} className="relative">
                              <RadioGroupItem value={range.value} id={range.value} className="peer sr-only" />
                              <Label
                                htmlFor={range.value}
                                className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-orange peer-data-[state=checked]:bg-orange/5 hover:border-slate-300"
                              >
                                <div>
                                  <p className="font-medium text-navy">{range.label}</p>
                                  <p className="text-sm text-slate-500">{range.description}</p>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-navy font-medium">Loan Purpose</Label>
                        <Select
                          value={formData.loanPurpose}
                          onValueChange={(value) => setFormData({ ...formData, loanPurpose: value })}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            {loanPurposes.map((purpose) => (
                              <SelectItem key={purpose.value} value={purpose.value}>
                                {purpose.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Personal Information</h2>
                        <p className="text-slate-500">Please provide your personal details</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-navy font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="h-12"
                            placeholder="John"
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
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dob" className="text-navy font-medium">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ssn" className="text-navy font-medium">Social Security Number</Label>
                          <Input
                            id="ssn"
                            type="password"
                            value={formData.ssn}
                            onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                            className="h-12"
                            placeholder="XXX-XX-XXXX"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Address Information</h2>
                        <p className="text-slate-500">Please provide your current residential address</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street" className="text-navy font-medium">Street Address</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="h-12"
                          placeholder="123 Main Street, Apt 4B"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-navy font-medium">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="h-12"
                            placeholder="New York"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-navy font-medium">State</Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData({ ...formData, state: value })}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {usStates.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode" className="text-navy font-medium">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            className="h-12"
                            placeholder="10001"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Employment (Personal) */}
                  {currentStep === 3 && loanType === "personal" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Employment & Income</h2>
                        <p className="text-slate-500">Tell us about your employment and income</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-navy font-medium">Employment Status</Label>
                        <RadioGroup
                          value={formData.employmentType}
                          onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                          className="grid grid-cols-2 md:grid-cols-3 gap-3"
                        >
                          {employmentTypes.map((type) => (
                            <div key={type.value} className="relative">
                              <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                              <Label
                                htmlFor={type.value}
                                className="flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-orange peer-data-[state=checked]:bg-orange/5 hover:border-slate-300 text-center"
                              >
                                <span className="font-medium text-navy">{type.label}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="employerName" className="text-navy font-medium">Employer Name</Label>
                          <Input
                            id="employerName"
                            value={formData.employerName}
                            onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                            className="h-12"
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle" className="text-navy font-medium">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            className="h-12"
                            placeholder="Software Engineer"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="yearsEmployed" className="text-navy font-medium">Years Employed</Label>
                          <Input
                            id="yearsEmployed"
                            type="number"
                            value={formData.yearsEmployed}
                            onChange={(e) => setFormData({ ...formData, yearsEmployed: e.target.value })}
                            className="h-12"
                            placeholder="5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="annualIncome" className="text-navy font-medium">Annual Income ($)</Label>
                          <Input
                            id="annualIncome"
                            type="number"
                            value={formData.annualIncome}
                            onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                            className="h-12"
                            placeholder="75000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyRent" className="text-navy font-medium">Monthly Rent/Mortgage ($)</Label>
                          <Input
                            id="monthlyRent"
                            type="number"
                            value={formData.monthlyRent}
                            onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                            className="h-12"
                            placeholder="2000"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Info Step */}
                  {currentStep === 3 && loanType === "business" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Business Information</h2>
                        <p className="text-slate-500">Tell us about your business</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName" className="text-navy font-medium">Business Name</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="h-12"
                            placeholder="Acme Corporation"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType" className="text-navy font-medium">Business Type</Label>
                          <Select
                            value={formData.businessType}
                            onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="yearsInBusiness" className="text-navy font-medium">Years in Business</Label>
                          <Input
                            id="yearsInBusiness"
                            type="number"
                            value={formData.yearsInBusiness}
                            onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                            className="h-12"
                            placeholder="5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numberOfEmployees" className="text-navy font-medium">Number of Employees</Label>
                          <Input
                            id="numberOfEmployees"
                            type="number"
                            value={formData.numberOfEmployees}
                            onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                            className="h-12"
                            placeholder="25"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ein" className="text-navy font-medium">EIN (Employer Identification Number)</Label>
                        <Input
                          id="ein"
                          value={formData.ein}
                          onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                          className="h-12"
                          placeholder="XX-XXXXXXX"
                        />
                      </div>
                    </div>
                  )}

                  {/* Financials Step (Business only) */}
                  {currentStep === 4 && loanType === "business" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Financial Information</h2>
                        <p className="text-slate-500">Provide your business and personal financial details</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="annualRevenue" className="text-navy font-medium">Annual Business Revenue ($)</Label>
                          <Input
                            id="annualRevenue"
                            type="number"
                            value={formData.annualRevenue}
                            onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                            className="h-12"
                            placeholder="500000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="annualIncome" className="text-navy font-medium">Personal Annual Income ($)</Label>
                          <Input
                            id="annualIncome"
                            type="number"
                            value={formData.annualIncome}
                            onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                            className="h-12"
                            placeholder="150000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyRent" className="text-navy font-medium">Monthly Business Rent/Mortgage ($)</Label>
                        <Input
                          id="monthlyRent"
                          type="number"
                          value={formData.monthlyRent}
                          onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                          className="h-12"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                  )}

                  {/* Review Step */}
                  {((currentStep === 4 && loanType === "personal") || (currentStep === 5 && loanType === "business")) && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">Review Your Application</h2>
                        <p className="text-slate-500">Please review your information before submitting</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 rounded-xl p-6">
                          <h3 className="font-display font-semibold text-navy mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-slate-500" />
                            Loan Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Loan Type</span>
                              <span className="font-medium text-navy capitalize">{loanType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Amount</span>
                              <span className="font-medium text-navy">{formatCurrency(formData.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Credit Score</span>
                              <span className="font-medium text-navy capitalize">{formData.creditScore || "Not specified"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6">
                          <h3 className="font-display font-semibold text-navy mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-slate-500" />
                            Personal Information
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Name</span>
                              <span className="font-medium text-navy">{formData.firstName} {formData.lastName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Email</span>
                              <span className="font-medium text-navy">{formData.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Phone</span>
                              <span className="font-medium text-navy">{formData.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="agreeTerms"
                            checked={formData.agreeTerms}
                            onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                          />
                          <Label htmlFor="agreeTerms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                            I agree to the Terms of Service and Privacy Policy. I understand that by submitting this 
                            application, I am authorizing Talent Horizon to process my loan application.
                          </Label>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="agreeCredit"
                            checked={formData.agreeCredit}
                            onCheckedChange={(checked) => setFormData({ ...formData, agreeCredit: checked as boolean })}
                          />
                          <Label htmlFor="agreeCredit" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                            I authorize Talent Horizon to obtain my credit report and verify the information 
                            provided in this application.
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="px-8 md:px-12 py-6 bg-slate-50 border-t border-slate-100 flex justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 0 ? () => setLoanType(null) : prevStep}
                className="border-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 0 ? "Change Loan Type" : "Previous"}
              </Button>

              {((currentStep === 4 && loanType === "personal") || (currentStep === 5 && loanType === "business")) ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreeTerms || !formData.agreeCredit}
                  className="bg-orange hover:bg-orange-dark text-white"
                >
                  Submit Application
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-orange hover:bg-orange-dark text-white"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
