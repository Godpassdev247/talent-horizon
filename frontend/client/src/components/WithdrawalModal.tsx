/**
 * Enterprise-Grade Withdrawal Modal Component
 * Bank-quality withdrawal system with ACH, Card, and Check options
 * Navy blue color scheme, fully responsive
 */

import { useState, useEffect } from "react";
import { 
  X, Banknote, CreditCard, Receipt, Building, Shield, Lock, Info,
  CheckCircle, ArrowRight, ChevronDown, Check, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  loanType: string;
}

// Bank name lookup by routing number (common US banks)
const bankLookup: { [key: string]: string } = {
  "021000021": "JPMorgan Chase Bank",
  "026009593": "Bank of America",
  "021000089": "Citibank",
  "071000013": "JPMorgan Chase Bank (IL)",
  "121000248": "Wells Fargo Bank",
  "322271627": "Chase Bank (CA)",
  "021001208": "Bank of New York Mellon",
  "011401533": "Bank of America (MA)",
  "091000019": "Wells Fargo Bank (MN)",
  "031101279": "Capital One Bank",
  "021200339": "HSBC Bank USA",
  "021300077": "TD Bank",
  "031000503": "PNC Bank",
  "021272655": "Citizens Bank",
  "053000196": "Truist Bank",
  "061000104": "SunTrust Bank",
  "021202337": "Santander Bank",
  "122000247": "Wells Fargo Bank (CA)",
  "322271724": "US Bank (CA)",
  "091000022": "US Bank",
  "122000661": "Bank of America (CA)",
  "111000614": "Bank of America (TX)",
  "071000039": "BMO Harris Bank",
  "071025661": "Discover Bank",
  "124003116": "Ally Bank",
  "056073573": "Navy Federal Credit Union",
  "063100277": "Regions Bank",
  "062000019": "Regions Bank (AL)",
  "081000032": "US Bank (MO)",
  "067014822": "Fifth Third Bank",
  "042000314": "Fifth Third Bank (OH)",
  "101089292": "Charles Schwab Bank",
  "121202211": "Charles Schwab Bank (CA)",
};

// US States for dropdown
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

export function WithdrawalModal({ isOpen, onClose, loanAmount, loanType }: WithdrawalModalProps) {
  const [method, setMethod] = useState<'ach' | 'card' | 'check' | null>(null);
  const [step, setStep] = useState<'select' | 'form' | 'confirm' | 'success'>('select');
  
  // ACH Details - Pre-populated with sample data for demo
  const [achDetails, setAchDetails] = useState({
    firstName: "John", lastName: "Doe", address: "123 Main Street, Apt 4B", city: "New York", state: "NY", zipCode: "10001",
    routingNumber: "", accountNumber: "", confirmAccountNumber: "", bankName: "", accountType: "checking" as "checking" | "savings",
  });
  
  // Card Details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "", expiryDate: "", cvv: "", nameOnCard: "",
    billingAddress: "", billingCity: "", billingState: "", billingZipCode: "",
  });
  
  // Check Details
  const [checkDetails, setCheckDetails] = useState({
    payeeName: "", accountNumber: "", routingNumber: "", bankName: "",
    mailingAddress: "", mailingCity: "", mailingState: "", mailingZipCode: "",
    useDifferentAddress: false, differentAddress: "", differentCity: "", differentState: "", differentZipCode: "",
  });

  // Auto-detect bank name from routing number
  const detectBankName = (routingNumber: string): string => {
    const cleanRouting = routingNumber.replace(/\D/g, '');
    if (cleanRouting.length === 9) {
      return bankLookup[cleanRouting] || "";
    }
    return "";
  };

  // Handle routing number change with auto-detection
  const handleRoutingChange = (value: string, type: 'ach' | 'check') => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 9);
    const detectedBank = detectBankName(cleanValue);
    
    if (type === 'ach') {
      setAchDetails(prev => ({ ...prev, routingNumber: cleanValue, bankName: detectedBank || prev.bankName }));
    } else {
      setCheckDetails(prev => ({ ...prev, routingNumber: cleanValue, bankName: detectedBank || prev.bankName }));
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  // Reset form
  const resetForm = () => {
    setMethod(null);
    setStep('select');
    setAchDetails({
      firstName: "", lastName: "", address: "", city: "", state: "", zipCode: "",
      routingNumber: "", accountNumber: "", confirmAccountNumber: "", bankName: "", accountType: "checking",
    });
    setCardDetails({
      cardNumber: "", expiryDate: "", cvv: "", nameOnCard: "",
      billingAddress: "", billingCity: "", billingState: "", billingZipCode: "",
    });
    setCheckDetails({
      payeeName: "", accountNumber: "", routingNumber: "", bankName: "",
      mailingAddress: "", mailingCity: "", mailingState: "", mailingZipCode: "",
      useDifferentAddress: false, differentAddress: "", differentCity: "", differentState: "", differentZipCode: "",
    });
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validate ACH form
  const isAchValid = () => {
    return achDetails.firstName && achDetails.lastName && achDetails.address && 
           achDetails.city && achDetails.state && achDetails.zipCode &&
           achDetails.routingNumber.length === 9 && achDetails.accountNumber &&
           achDetails.accountNumber === achDetails.confirmAccountNumber && achDetails.bankName;
  };

  // Validate Card form
  const isCardValid = () => {
    return cardDetails.cardNumber.replace(/\s/g, '').length === 16 &&
           cardDetails.expiryDate.length === 5 && cardDetails.cvv.length >= 3 &&
           cardDetails.nameOnCard && cardDetails.billingAddress &&
           cardDetails.billingCity && cardDetails.billingState && cardDetails.billingZipCode;
  };

  // Validate Check form
  const isCheckValid = () => {
    const baseValid = checkDetails.payeeName && checkDetails.accountNumber &&
                      checkDetails.routingNumber.length === 9 && checkDetails.bankName &&
                      checkDetails.mailingAddress && checkDetails.mailingCity &&
                      checkDetails.mailingState && checkDetails.mailingZipCode;
    
    if (checkDetails.useDifferentAddress) {
      return baseValid && checkDetails.differentAddress && checkDetails.differentCity &&
             checkDetails.differentState && checkDetails.differentZipCode;
    }
    return baseValid;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {step === 'success' ? 'Withdrawal Submitted' : 'Withdraw Loan Funds'}
            </h2>
            <p className="text-sm text-white/70 mt-0.5">
              {step === 'select' && 'Select your preferred withdrawal method'}
              {step === 'form' && `Enter your ${method === 'ach' ? 'ACH bank' : method === 'card' ? 'debit card' : 'check'} details`}
              {step === 'confirm' && 'Review and confirm your withdrawal'}
              {step === 'success' && 'Your request has been submitted successfully'}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Loan Info Banner */}
          <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1e3a5f]">Loan Approved</p>
                <p className="text-sm text-slate-600">{loanType} • <span className="font-bold text-[#1e3a5f]">${loanAmount.toLocaleString()}</span></p>
              </div>
            </div>
          </div>

          {/* Step: Select Method */}
          {step === 'select' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 mb-4">Choose Withdrawal Method</h3>
              
              {/* ACH Option */}
              <button
                onClick={() => { setMethod('ach'); setStep('form'); }}
                className="w-full p-4 sm:p-5 border-2 border-slate-200 rounded-xl hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                    <Building className="w-6 h-6 text-[#1e3a5f] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800">ACH Bank Transfer</h4>
                      <span className="text-xs bg-[#1e3a5f]/10 text-[#1e3a5f] px-2 py-1 rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Direct deposit to your bank account. 2-3 business days.</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <Shield className="w-3 h-3" /> Secure & Encrypted
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a5f] transition-colors" />
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={() => { setMethod('card'); setStep('form'); }}
                className="w-full p-4 sm:p-5 border-2 border-slate-200 rounded-xl hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                    <CreditCard className="w-6 h-6 text-[#1e3a5f] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">Debit Card</h4>
                    <p className="text-sm text-slate-500 mt-1">Instant transfer to your debit card. Processing fee may apply.</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <Shield className="w-3 h-3" /> Instant Transfer
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a5f] transition-colors" />
                </div>
              </button>

              {/* Check Option */}
              <button
                onClick={() => { setMethod('check'); setStep('form'); }}
                className="w-full p-4 sm:p-5 border-2 border-slate-200 rounded-xl hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                    <Receipt className="w-6 h-6 text-[#1e3a5f] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">Physical Check</h4>
                    <p className="text-sm text-slate-500 mt-1">Mailed check to your address. 5-7 business days.</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <Shield className="w-3 h-3" /> Trackable Delivery
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a5f] transition-colors" />
                </div>
              </button>
            </div>
          )}

          {/* Step: ACH Form */}
          {step === 'form' && method === 'ach' && (
            <div className="space-y-6">
              {/* Security Notice */}
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1e3a5f]">Secure Bank Transfer</p>
                  <p className="text-xs text-slate-600 mt-1">Your information is encrypted and secure. Please ensure all details are accurate to avoid delays.</p>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">1</span>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name *</label>
                    <Input
                      placeholder="John"
                      value={achDetails.firstName}
                      onChange={(e) => setAchDetails({ ...achDetails, firstName: e.target.value })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name *</label>
                    <Input
                      placeholder="Doe"
                      value={achDetails.lastName}
                      onChange={(e) => setAchDetails({ ...achDetails, lastName: e.target.value })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address *</label>
                  <Input
                    placeholder="123 Main Street, Apt 4B"
                    value={achDetails.address}
                    onChange={(e) => setAchDetails({ ...achDetails, address: e.target.value })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                    <Input
                      placeholder="New York"
                      value={achDetails.city}
                      onChange={(e) => setAchDetails({ ...achDetails, city: e.target.value })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                    <select
                      value={achDetails.state}
                      onChange={(e) => setAchDetails({ ...achDetails, state: e.target.value })}
                      className="w-full h-11 rounded-lg border border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 px-3 text-sm"
                    >
                      <option value="">Select</option>
                      {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code *</label>
                    <Input
                      placeholder="10001"
                      value={achDetails.zipCode}
                      onChange={(e) => setAchDetails({ ...achDetails, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">2</span>
                  Bank Account Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Routing Number *</label>
                    <Input
                      placeholder="9-digit routing number"
                      value={achDetails.routingNumber}
                      onChange={(e) => handleRoutingChange(e.target.value, 'ach')}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      maxLength={9}
                    />
                    <p className="text-xs text-slate-500 mt-1">Found at the bottom left of your check</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bank Name *</label>
                    <Input
                      placeholder={achDetails.routingNumber.length === 9 && !achDetails.bankName ? "Enter bank name" : "Auto-detected from routing"}
                      value={achDetails.bankName}
                      onChange={(e) => setAchDetails({ ...achDetails, bankName: e.target.value })}
                      className={`h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 ${achDetails.bankName && achDetails.routingNumber.length === 9 ? 'bg-[#1e3a5f]/5' : ''}`}
                    />
                    {achDetails.bankName && achDetails.routingNumber.length === 9 && (
                      <p className="text-xs text-[#1e3a5f] mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Bank identified
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Number *</label>
                    <Input
                      placeholder="Enter account number"
                      value={achDetails.accountNumber}
                      onChange={(e) => setAchDetails({ ...achDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Account Number *</label>
                    <Input
                      placeholder="Re-enter account number"
                      value={achDetails.confirmAccountNumber}
                      onChange={(e) => setAchDetails({ ...achDetails, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                      className={`h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 ${achDetails.confirmAccountNumber && achDetails.accountNumber !== achDetails.confirmAccountNumber ? 'border-red-300 bg-red-50' : ''}`}
                    />
                    {achDetails.confirmAccountNumber && achDetails.accountNumber !== achDetails.confirmAccountNumber && (
                      <p className="text-xs text-red-500 mt-1">Account numbers do not match</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        checked={achDetails.accountType === 'checking'}
                        onChange={() => setAchDetails({ ...achDetails, accountType: 'checking' })}
                        className="w-4 h-4 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                      />
                      <span className="text-sm text-slate-700">Checking</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        checked={achDetails.accountType === 'savings'}
                        onChange={() => setAchDetails({ ...achDetails, accountType: 'savings' })}
                        className="w-4 h-4 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                      />
                      <span className="text-sm text-slate-700">Savings</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Important</p>
                  <p className="text-xs text-amber-700 mt-1">Please verify all information is correct. Incorrect bank details may result in failed transfers and delays. Funds will be deposited within 2-3 business days.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Card Form */}
          {step === 'form' && method === 'card' && (
            <div className="space-y-6">
              {/* Security Notice */}
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1e3a5f]">Secure Card Transfer</p>
                  <p className="text-xs text-slate-600 mt-1">Your card information is encrypted using bank-level security. Only debit cards are accepted.</p>
                </div>
              </div>

              {/* Card Information */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">1</span>
                  Card Details
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number *</label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 font-mono"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date *</label>
                    <Input
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CVV *</label>
                    <Input
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      type="password"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name on Card *</label>
                  <Input
                    placeholder="JOHN DOE"
                    value={cardDetails.nameOnCard}
                    onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value.toUpperCase() })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">2</span>
                  Billing Address
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address *</label>
                  <Input
                    placeholder="123 Main Street, Apt 4B"
                    value={cardDetails.billingAddress}
                    onChange={(e) => setCardDetails({ ...cardDetails, billingAddress: e.target.value })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                    <Input
                      placeholder="New York"
                      value={cardDetails.billingCity}
                      onChange={(e) => setCardDetails({ ...cardDetails, billingCity: e.target.value })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                    <select
                      value={cardDetails.billingState}
                      onChange={(e) => setCardDetails({ ...cardDetails, billingState: e.target.value })}
                      className="w-full h-11 rounded-lg border border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 px-3 text-sm"
                    >
                      <option value="">Select</option>
                      {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP *</label>
                    <Input
                      placeholder="10001"
                      value={cardDetails.billingZipCode}
                      onChange={(e) => setCardDetails({ ...cardDetails, billingZipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Important</p>
                  <p className="text-xs text-amber-700 mt-1">Only debit cards are accepted for instant transfers. Credit cards cannot be used for withdrawals. A small processing fee may apply.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Check Form */}
          {step === 'form' && method === 'check' && (
            <div className="space-y-6">
              {/* Security Notice */}
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1e3a5f]">Physical Check Delivery</p>
                  <p className="text-xs text-slate-600 mt-1">A check will be mailed to your address. Please ensure all information is accurate.</p>
                </div>
              </div>

              {/* Payee Information */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">1</span>
                  Check Payee Information
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name (Payee) *</label>
                  <Input
                    placeholder="John Doe"
                    value={checkDetails.payeeName}
                    onChange={(e) => setCheckDetails({ ...checkDetails, payeeName: e.target.value })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                  />
                  <p className="text-xs text-slate-500 mt-1">This name will appear on the check. Must match your bank account name.</p>
                </div>
              </div>

              {/* Bank Information for Check */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">2</span>
                  Bank Account for Deposit
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Routing Number *</label>
                    <Input
                      placeholder="9-digit routing number"
                      value={checkDetails.routingNumber}
                      onChange={(e) => handleRoutingChange(e.target.value, 'check')}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      maxLength={9}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bank Name *</label>
                    <Input
                      placeholder="Auto-detected from routing"
                      value={checkDetails.bankName}
                      onChange={(e) => setCheckDetails({ ...checkDetails, bankName: e.target.value })}
                      className={`h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 ${checkDetails.bankName && checkDetails.routingNumber.length === 9 ? 'bg-[#1e3a5f]/5' : ''}`}
                    />
                    {checkDetails.bankName && checkDetails.routingNumber.length === 9 && (
                      <p className="text-xs text-[#1e3a5f] mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Bank identified
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Number *</label>
                  <Input
                    placeholder="Enter account number"
                    value={checkDetails.accountNumber}
                    onChange={(e) => setCheckDetails({ ...checkDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                  />
                </div>
              </div>

              {/* Mailing Address */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center">3</span>
                  Mailing Address
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address *</label>
                  <Input
                    placeholder="123 Main Street, Apt 4B"
                    value={checkDetails.mailingAddress}
                    onChange={(e) => setCheckDetails({ ...checkDetails, mailingAddress: e.target.value })}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                    <Input
                      placeholder="New York"
                      value={checkDetails.mailingCity}
                      onChange={(e) => setCheckDetails({ ...checkDetails, mailingCity: e.target.value })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                    <select
                      value={checkDetails.mailingState}
                      onChange={(e) => setCheckDetails({ ...checkDetails, mailingState: e.target.value })}
                      className="w-full h-11 rounded-lg border border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 px-3 text-sm"
                    >
                      <option value="">Select</option>
                      {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP *</label>
                    <Input
                      placeholder="10001"
                      value={checkDetails.mailingZipCode}
                      onChange={(e) => setCheckDetails({ ...checkDetails, mailingZipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                      className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                </div>

                {/* Different Address Option */}
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkDetails.useDifferentAddress}
                      onChange={(e) => setCheckDetails({ ...checkDetails, useDifferentAddress: e.target.checked })}
                      className="w-4 h-4 text-[#1e3a5f] focus:ring-[#1e3a5f] rounded"
                    />
                    <span className="text-sm text-slate-700">Send check to a different address</span>
                  </label>
                </div>

                {/* Different Address Fields */}
                {checkDetails.useDifferentAddress && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-4">
                    <p className="text-sm font-medium text-slate-700">Alternative Mailing Address</p>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address *</label>
                      <Input
                        placeholder="456 Oak Avenue"
                        value={checkDetails.differentAddress}
                        onChange={(e) => setCheckDetails({ ...checkDetails, differentAddress: e.target.value })}
                        className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                        <Input
                          placeholder="Los Angeles"
                          value={checkDetails.differentCity}
                          onChange={(e) => setCheckDetails({ ...checkDetails, differentCity: e.target.value })}
                          className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                        <select
                          value={checkDetails.differentState}
                          onChange={(e) => setCheckDetails({ ...checkDetails, differentState: e.target.value })}
                          className="w-full h-11 rounded-lg border border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 px-3 text-sm"
                        >
                          <option value="">Select</option>
                          {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP *</label>
                        <Input
                          placeholder="90001"
                          value={checkDetails.differentZipCode}
                          onChange={(e) => setCheckDetails({ ...checkDetails, differentZipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                          className="h-11 rounded-lg border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Important</p>
                  <p className="text-xs text-amber-700 mt-1">Checks are mailed via USPS Priority Mail with tracking. Delivery typically takes 5-7 business days. Ensure your mailing address is accurate to avoid delays.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-4">
                <h4 className="font-semibold text-[#1e3a5f] mb-3">Review Your Withdrawal Details</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">Withdrawal Method</span>
                    <span className="font-medium text-slate-800">
                      {method === 'ach' ? 'ACH Bank Transfer' : method === 'card' ? 'Debit Card' : 'Physical Check'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-bold text-[#1e3a5f]">${loanAmount.toLocaleString()}</span>
                  </div>
                  
                  {method === 'ach' && (
                    <>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Account Holder</span>
                        <span className="font-medium text-slate-800">{achDetails.firstName} {achDetails.lastName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Bank</span>
                        <span className="font-medium text-slate-800">{achDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Account</span>
                        <span className="font-medium text-slate-800">****{achDetails.accountNumber.slice(-4)} ({achDetails.accountType})</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Estimated Arrival</span>
                        <span className="font-medium text-slate-800">2-3 business days</span>
                      </div>
                    </>
                  )}
                  
                  {method === 'card' && (
                    <>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Card Holder</span>
                        <span className="font-medium text-slate-800">{cardDetails.nameOnCard}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Card</span>
                        <span className="font-medium text-slate-800">****{cardDetails.cardNumber.replace(/\s/g, '').slice(-4)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Estimated Arrival</span>
                        <span className="font-medium text-slate-800">Instant</span>
                      </div>
                    </>
                  )}
                  
                  {method === 'check' && (
                    <>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Payee</span>
                        <span className="font-medium text-slate-800">{checkDetails.payeeName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-500">Mailing Address</span>
                        <span className="font-medium text-slate-800 text-right">
                          {checkDetails.useDifferentAddress 
                            ? `${checkDetails.differentAddress}, ${checkDetails.differentCity}, ${checkDetails.differentState} ${checkDetails.differentZipCode}`
                            : `${checkDetails.mailingAddress}, ${checkDetails.mailingCity}, ${checkDetails.mailingState} ${checkDetails.mailingZipCode}`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Estimated Arrival</span>
                        <span className="font-medium text-slate-800">5-7 business days</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Please Confirm</p>
                  <p className="text-xs text-amber-700 mt-1">By clicking "Confirm Withdrawal", you authorize this transaction. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#1e3a5f]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Withdrawal Request Submitted!</h3>
              <p className="text-slate-500 mb-6">
                {method === 'ach' && 'Your funds will be transferred within 2-3 business days.'}
                {method === 'card' && 'Your funds will be transferred instantly.'}
                {method === 'check' && 'Your check will be mailed within 5-7 business days.'}
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 mb-6 max-w-sm mx-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Reference ID</span>
                  <span className="font-mono font-medium text-slate-700">WD-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-[#1e3a5f]">${loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Method</span>
                  <span className="font-medium text-slate-700">
                    {method === 'ach' ? 'ACH Transfer' : method === 'card' ? 'Debit Card' : 'Check'}
                  </span>
                </div>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white px-8"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                if (step === 'form') { setStep('select'); setMethod(null); }
                else if (step === 'confirm') setStep('form');
                else handleClose();
              }}
              className="order-2 sm:order-1"
            >
              {step === 'select' ? 'Cancel' : 'Back'}
            </Button>
            
            {step === 'form' && (
              <Button 
                className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white order-1 sm:order-2"
                onClick={() => setStep('confirm')}
                disabled={
                  (method === 'ach' && !isAchValid()) ||
                  (method === 'card' && !isCardValid()) ||
                  (method === 'check' && !isCheckValid())
                }
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {step === 'confirm' && (
              <Button 
                className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white order-1 sm:order-2"
                onClick={() => setStep('success')}
              >
                Confirm Withdrawal
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
