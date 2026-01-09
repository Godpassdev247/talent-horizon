/**
 * Loan Application Page - Executive Precision Design System
 * Employee loan application form
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  FileText, 
  CheckCircle2,
  ArrowLeft,
  Send,
  Info,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const loanTypes = [
  "Personal Loan",
  "Emergency Loan",
  "Education Loan",
  "Medical Loan",
  "Home Improvement Loan"
];

const repaymentTerms = [
  "6 months",
  "12 months",
  "18 months",
  "24 months",
  "36 months"
];

export default function LoanApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    department: "",
    loanType: "",
    amount: "",
    repaymentTerm: "",
    purpose: "",
    additionalInfo: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Loan application submitted successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-navy py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Link href="/">
                <span className="inline-flex items-center text-white/70 hover:text-white mb-6 cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </span>
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Employee Loan Application
              </h1>
              <p className="text-white/80">
                Apply for a loan through our employee assistance program. 
                All applications are reviewed within 3-5 business days.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-8 shadow-sm text-center"
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="font-display text-2xl font-bold text-navy mb-4">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Your loan application has been received. Our team will review 
                    your application and contact you within 3-5 business days.
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    Reference Number: <span className="font-mono font-bold">LN-{Date.now().toString().slice(-8)}</span>
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link href="/">
                      <Button variant="outline">Return Home</Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          employeeId: "",
                          fullName: "",
                          email: "",
                          phone: "",
                          department: "",
                          loanType: "",
                          amount: "",
                          repaymentTerm: "",
                          purpose: "",
                          additionalInfo: ""
                        });
                      }}
                      className="bg-orange hover:bg-orange-dark text-white"
                    >
                      Submit Another Application
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Info Banner */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700">
                      <p className="font-medium mb-1">Before you apply</p>
                      <p>Please ensure you have your employee ID and department information ready. 
                      Loan amounts are subject to approval based on employment tenure and company policy.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm">
                    <h2 className="font-display text-xl font-bold text-navy mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange" />
                      Application Details
                    </h2>

                    {/* Employee Information */}
                    <div className="mb-8">
                      <h3 className="font-medium text-navy mb-4 pb-2 border-b border-gray-100">
                        Employee Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="employeeId">Employee ID *</Label>
                          <Input
                            id="employeeId"
                            required
                            placeholder="e.g., EMP-12345"
                            value={formData.employeeId}
                            onChange={(e) => handleChange("employeeId", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            required
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Work Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="department">Department *</Label>
                          <Input
                            id="department"
                            required
                            placeholder="e.g., Engineering, Marketing, HR"
                            value={formData.department}
                            onChange={(e) => handleChange("department", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Loan Details */}
                    <div className="mb-8">
                      <h3 className="font-medium text-navy mb-4 pb-2 border-b border-gray-100">
                        Loan Details
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="loanType">Loan Type *</Label>
                          <Select 
                            value={formData.loanType} 
                            onValueChange={(value) => handleChange("loanType", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                            <SelectContent>
                              {loanTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="amount">Requested Amount *</Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              id="amount"
                              type="number"
                              required
                              min="100"
                              max="50000"
                              placeholder="Enter amount"
                              value={formData.amount}
                              onChange={(e) => handleChange("amount", e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="repaymentTerm">Preferred Repayment Term *</Label>
                          <Select 
                            value={formData.repaymentTerm} 
                            onValueChange={(value) => handleChange("repaymentTerm", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select repayment term" />
                            </SelectTrigger>
                            <SelectContent>
                              {repaymentTerms.map((term) => (
                                <SelectItem key={term} value={term}>{term}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="purpose">Purpose of Loan *</Label>
                          <Textarea
                            id="purpose"
                            required
                            rows={3}
                            placeholder="Please describe why you need this loan..."
                            value={formData.purpose}
                            onChange={(e) => handleChange("purpose", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="additionalInfo">Additional Information</Label>
                          <Textarea
                            id="additionalInfo"
                            rows={2}
                            placeholder="Any additional details you'd like to share..."
                            value={formData.additionalInfo}
                            onChange={(e) => handleChange("additionalInfo", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-600">
                          <p className="font-medium mb-1">Terms & Conditions</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-500">
                            <li>Loan approval is subject to company policy and available funds</li>
                            <li>Repayment will be deducted from monthly salary</li>
                            <li>Early repayment is allowed without penalty</li>
                            <li>Maximum loan amount depends on employment tenure</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-6">
                      <input type="checkbox" id="terms" required className="mt-1" />
                      <Label htmlFor="terms" className="text-sm text-slate-600 font-normal">
                        I confirm that all information provided is accurate and I agree to the 
                        loan terms and conditions.
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-orange hover:bg-orange-dark text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Submit Application
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
