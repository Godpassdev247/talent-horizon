import React, { useState } from 'react';

interface CreditCardApplication {
  id: string;
  cardType: string;
  lastFourDigits: string;
  currentBalance: number;
  creditLimit: number;
  bankName: string;
  status: 'submitted' | 'under_review' | 'approved' | 'clearing' | 'cleared' | 'rejected';
  submittedDate: string;
  estimatedClearDate?: string;
  clearedDate?: string;
  serviceFee?: number;
  serviceFeePercentage?: number;
  notes?: string;
}

interface CreditCardDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CreditCardApplication | null;
  onApply?: () => void;
  isNewApplication?: boolean;
}

const CreditCardDebtModal: React.FC<CreditCardDebtModalProps> = ({
  isOpen,
  onClose,
  application,
  onApply,
  isNewApplication = false
}) => {
  const [formData, setFormData] = useState({
    cardType: '',
    bankName: '',
    lastFourDigits: '',
    currentBalance: '',
    creditLimit: '',
    cardholderName: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get responsive font size class based on amount length
  const getAmountFontSize = (amount: number) => {
    const formatted = formatCurrency(amount);
    const length = formatted.length;
    if (length > 15) return 'text-lg sm:text-xl'; // $1,000,000.00+
    if (length > 12) return 'text-xl sm:text-2xl'; // $100,000.00+
    if (length > 9) return 'text-2xl sm:text-3xl'; // $10,000.00+
    return 'text-2xl'; // Default
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'clearing': return 'bg-purple-100 text-purple-800';
      case 'cleared': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return 'Application Submitted';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved - Pending Clearing';
      case 'clearing': return 'Clearing in Progress';
      case 'cleared': return 'Debt Cleared';
      case 'rejected': return 'Application Rejected';
      default: return status;
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'approved': return 3;
      case 'clearing': return 4;
      case 'cleared': return 5;
      case 'rejected': return -1;
      default: return 0;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onApply) {
      onApply();
    }
    onClose();
  };

  // New Application Form
  if (isNewApplication) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#1e3a5f] text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Credit Card Debt Clearing</h2>
                  <p className="text-white/70 text-sm">Free debt clearing service</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="font-semibold text-[#1e3a5f] mb-3">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-gray-800">Submit Application</p>
                  <p className="text-sm text-gray-600">Provide your credit card details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-gray-800">We Clear Your Debt</p>
                  <p className="text-sm text-gray-600">We pay off your balance for FREE</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-gray-800">Service Fee</p>
                  <p className="text-sm text-gray-600">Pay our fee after card is topped up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-[#1e3a5f] mb-4">Credit Card Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  >
                    <option value="">Select card type</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank/Issuer Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="e.g., Chase, Bank of America"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits of Card</label>
                  <input
                    type="text"
                    name="lastFourDigits"
                    value={formData.lastFourDigits}
                    onChange={handleInputChange}
                    placeholder="1234"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance (Debt)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="currentBalance"
                      value={formData.currentBalance}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="creditLimit"
                      value={formData.creditLimit}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#1e3a5f] mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="As it appears on card"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                  required
                />
                <span className="text-sm text-gray-600">
                  I understand that Talent Horizon will clear my credit card debt for free, and I agree to pay the service fee 
                  (to be determined based on my balance) after my credit card balance is cleared and topped up. I authorize 
                  Talent Horizon to contact me regarding this application.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.agreeToTerms}
                className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a6f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View Application Status
  if (!application) return null;

  const currentStep = getStatusStep(application.status);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1e3a5f] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Credit Card Debt Clearing</h2>
                <p className="text-white/70 text-sm">Application ID: {application.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {getStatusLabel(application.status)}
            </span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-semibold text-[#1e3a5f] mb-4">Application Progress</h3>
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-[#1e3a5f] transition-all duration-500"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {['Submitted', 'Under Review', 'Approved', 'Clearing', 'Cleared'].map((step, index) => (
              <div key={step} className="relative flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > index 
                    ? 'bg-[#1e3a5f] text-white' 
                    : currentStep === index + 1 
                      ? 'bg-[#1e3a5f] text-white ring-4 ring-blue-200' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > index ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= index + 1 ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Details */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-[#1e3a5f] mb-4">Credit Card Details</h3>
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] rounded-xl p-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/70 text-sm">Card Type</p>
                  <p className="text-lg font-semibold">{application.cardType || 'Pending Verification'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Bank</p>
                  <p className="text-lg font-semibold">{application.bankName || 'Pending'}</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/70 text-sm">Card Number</p>
                  <p className="text-xl font-mono">•••• •••• •••• {application.lastFourDigits || '••••'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Credit Limit</p>
                  <p className="text-lg font-semibold">
                    {application.creditLimit && application.creditLimit > 0 
                      ? formatCurrency(application.creditLimit) 
                      : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 font-medium">Original Debt Balance</p>
              <p className={`${getAmountFontSize(application.currentBalance)} font-bold text-red-700`}>{formatCurrency(application.currentBalance)}</p>
              <p className="text-xs text-red-500 mt-1">Amount we will clear for you</p>
            </div>
            {application.status === 'cleared' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-600 font-medium">Current Balance</p>
                <p className="text-2xl font-bold text-green-700">$0.00</p>
                <p className="text-xs text-green-500 mt-1">Debt successfully cleared!</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-600 font-medium">Estimated Service Fee</p>
                <p className={`${application.serviceFee && application.serviceFee > 0 ? getAmountFontSize(application.serviceFee) : 'text-2xl'} font-bold text-blue-700`}>
                  {application.serviceFee && application.serviceFee > 0 
                    ? formatCurrency(application.serviceFee) 
                    : <span className="text-amber-600 italic">Estimating...</span>}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  {application.serviceFeePercentage && application.serviceFeePercentage > 0
                    ? `${application.serviceFeePercentage}% of cleared amount` 
                    : 'To be determined after review'}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-[#1e3a5f] mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Application Submitted</p>
                  <p className="text-sm text-gray-500">
                    {formatDate((application as any).submittedAt || application.submittedDate)}
                  </p>
                </div>
              </div>
              {application.estimatedClearDate && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Estimated Clear Date</p>
                    <p className="text-sm text-gray-500">{formatDate(application.estimatedClearDate)}</p>
                  </div>
                </div>
              )}
              {application.clearedDate && (
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Debt Cleared</p>
                    <p className="text-sm text-gray-500">{formatDate(application.clearedDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {application.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Note from Our Team</p>
                  <p className="text-sm text-yellow-700 mt-1">{application.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your information is secure and encrypted</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a6f] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardDebtModal;
