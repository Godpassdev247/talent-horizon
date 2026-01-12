import React, { useState } from 'react';

interface TaxRefundApplication {
  id: string;
  taxYear: string;
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'business_owner' | 'retired';
  estimatedRefund: number;
  actualRefund?: number;
  serviceFee?: number;
  serviceFeePercentage?: number;
  status: 'submitted' | 'under_review' | 'documents_needed' | 'filing' | 'approved' | 'refund_issued' | 'rejected';
  submittedDate: string;
  estimatedCompletionDate?: string;
  refundIssuedDate?: string;
  documentsRequired?: string[];
  notes?: string;
}

interface TaxRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: TaxRefundApplication | null;
  onApply?: () => void;
  isNewApplication?: boolean;
}

const TaxRefundModal: React.FC<TaxRefundModalProps> = ({
  isOpen,
  onClose,
  application,
  onApply,
  isNewApplication = false
}) => {
  const [formData, setFormData] = useState({
    taxYear: '2025',
    employmentStatus: '',
    annualIncome: '',
    hasW2: false,
    has1099: false,
    hasBusinessIncome: false,
    hasInvestmentIncome: false,
    firstName: '',
    lastName: '',
    ssn: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    agreeToTerms: false
  });

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get responsive font size class based on amount length
  const getAmountFontSize = (amount: number) => {
    const formatted = formatCurrency(amount);
    const length = formatted.length;
    if (length > 12) return 'text-lg sm:text-xl'; // $1,000,000+
    if (length > 9) return 'text-xl sm:text-2xl'; // $100,000+
    if (length > 7) return 'text-2xl sm:text-3xl'; // $10,000+
    return 'text-2xl sm:text-3xl'; // Default
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-slate-100 text-slate-700';
      case 'under_review': return 'bg-slate-200 text-slate-800';
      case 'documents_needed': return 'bg-slate-200 text-slate-800';
      case 'filing': return 'bg-[#1e3a5f]/10 text-[#1e3a5f]';
      case 'approved': return 'bg-[#1e3a5f]/20 text-[#1e3a5f]';
      case 'refund_issued': return 'bg-[#1e3a5f] text-white';
      case 'rejected': return 'bg-slate-300 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return 'Application Submitted';
      case 'under_review': return 'Under Review';
      case 'documents_needed': return 'Documents Required';
      case 'filing': return 'Filing in Progress';
      case 'approved': return 'Approved';
      case 'refund_issued': return 'Refund Issued';
      case 'rejected': return 'Application Rejected';
      default: return status;
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'documents_needed': return 2;
      case 'filing': return 3;
      case 'approved': return 4;
      case 'refund_issued': return 5;
      case 'rejected': return -1;
      default: return 0;
    }
  };

  const getEmploymentLabel = (status: string) => {
    switch (status) {
      case 'employed': return 'Employed (W-2)';
      case 'self_employed': return 'Self-Employed (1099)';
      case 'unemployed': return 'Unemployed';
      case 'business_owner': return 'Business Owner';
      case 'retired': return 'Retired';
      default: return status;
    }
  };

  const getRefundRange = (employmentStatus: string) => {
    switch (employmentStatus) {
      case 'employed': return { min: 50000, max: 250000 };
      case 'self_employed': return { min: 100000, max: 500000 };
      case 'unemployed': return { min: 50000, max: 150000 };
      case 'business_owner': return { min: 200000, max: 1000000 };
      case 'retired': return { min: 50000, max: 200000 };
      default: return { min: 50000, max: 1000000 };
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

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // New Application Form
  if (isNewApplication) {
    const refundRange = getRefundRange(formData.employmentStatus);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#1e3a5f] text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Tax Refund Filing</h2>
                  <p className="text-white/70 text-sm">Maximum refund guarantee</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Refund Range Banner */}
          <div className="p-6 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8c] text-white">
            <div className="text-center">
              <p className="text-sm font-medium text-white/80">Potential Refund Range</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
                {formData.employmentStatus 
                  ? `${formatCurrency(refundRange.min)} - ${formatCurrency(refundRange.max)}`
                  : '$50,000 - $1,000,000'
                }
              </p>
              <p className="text-sm text-white/80 mt-1">Based on employment status and income sources</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-6 bg-slate-50 border-b">
            <h3 className="font-semibold text-[#1e3a5f] mb-3">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-gray-800">Apply</p>
                  <p className="text-sm text-gray-600">Submit your info</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-gray-800">Review</p>
                  <p className="text-sm text-gray-600">We assess your case</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-gray-800">File</p>
                  <p className="text-sm text-gray-600">We file for you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-medium text-gray-800">Get Paid</p>
                  <p className="text-sm text-gray-600">Receive your refund</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Tax Information */}
            <div>
              <h3 className="font-semibold text-[#1e3a5f] mb-4">Tax Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Year</label>
                  <select
                    name="taxYear"
                    value={formData.taxYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                  <select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="employed">Employed (W-2)</option>
                    <option value="self_employed">Self-Employed (1099)</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Annual Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Income Sources */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Sources (Select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="hasW2"
                      checked={formData.hasW2}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                    />
                    <span className="text-sm">W-2 Income</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="has1099"
                      checked={formData.has1099}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                    />
                    <span className="text-sm">1099 Income</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="hasBusinessIncome"
                      checked={formData.hasBusinessIncome}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                    />
                    <span className="text-sm">Business</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="hasInvestmentIncome"
                      checked={formData.hasInvestmentIncome}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                    />
                    <span className="text-sm">Investments</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="font-semibold text-[#1e3a5f] mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Social Security Number</label>
                  <input
                    type="text"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleInputChange}
                    placeholder="XXX-XX-XXXX"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    >
                      <option value="">State</option>
                      {usStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      maxLength={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
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
                  I authorize Talent Horizon to review my tax situation and file tax returns on my behalf. I understand that 
                  a service fee (to be disclosed after review) will be deducted from my refund amount. I confirm that all 
                  information provided is accurate and complete.
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

  // Map context application fields to modal fields
  const mappedApplication = {
    ...application,
    taxYear: (application as any).taxYear || new Date().getFullYear(),
    employmentStatus: (application as any).employmentStatus || 'employed',
    submittedDate: (application as any).submittedAt || (application as any).submittedDate || '',
    estimatedRefund: (application as any).estimatedRefund || 0,
    actualRefund: (application as any).actualRefund,
    serviceFee: (application as any).serviceFee || 0,
    serviceFeePercentage: (application as any).serviceFeePercentage || 0,
    status: (application as any).status || 'submitted',
    notes: (application as any).teamNotes || (application as any).notes,
  };

  const currentStep = getStatusStep(mappedApplication.status);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1e3a5f] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Tax Refund Filing</h2>
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
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(mappedApplication.status)}`}>
              {getStatusLabel(mappedApplication.status)}
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
            {['Submitted', 'Review', 'Filing', 'Approved', 'Refund Issued'].map((step, index) => (
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

        {/* Refund Summary */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-500 font-medium">Tax Year</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">{mappedApplication.taxYear}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-500 font-medium">
                {mappedApplication.actualRefund ? 'Actual Refund' : 'Estimated Refund'}
              </p>
              <p className={`${getAmountFontSize(mappedApplication.actualRefund || mappedApplication.estimatedRefund)} font-bold text-[#1e3a5f]`}>
                {formatCurrency(mappedApplication.actualRefund || mappedApplication.estimatedRefund)}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-500 font-medium">Service Fee</p>
              <p className={`${mappedApplication.serviceFee ? getAmountFontSize(mappedApplication.serviceFee) : 'text-2xl'} font-bold text-[#1e3a5f]`}>
                {mappedApplication.serviceFee > 0 ? formatCurrency(mappedApplication.serviceFee) : 'Estimating...'}
              </p>
              {mappedApplication.serviceFeePercentage > 0 && (
                <p className="text-xs text-slate-400">{mappedApplication.serviceFeePercentage}% of refund</p>
              )}
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className="font-semibold text-[#1e3a5f] mb-4">Filing Details</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="font-medium text-gray-800">{getEmploymentLabel(mappedApplication.employmentStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Filing Status</p>
                  <p className="font-medium text-gray-800">Individual</p>
                </div>
              </div>
            </div>
          </div>

          {/* Net Refund Calculation */}
          {mappedApplication.actualRefund && mappedApplication.serviceFee > 0 && (
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8c] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4">Your Net Refund</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Refund</span>
                  <span>{formatCurrency(mappedApplication.actualRefund)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee ({mappedApplication.serviceFeePercentage}%)</span>
                  <span>-{formatCurrency(mappedApplication.serviceFee)}</span>
                </div>
                <div className="border-t border-white/30 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>You Receive</span>
                    <span>{formatCurrency(mappedApplication.actualRefund - mappedApplication.serviceFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Required */}
          {mappedApplication.status === 'documents_needed' && (application as any).documentsRequired && (
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#1e3a5f] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-[#1e3a5f]">Documents Required</p>
                  <p className="text-sm text-slate-600 mt-1">Please submit the following documents:</p>
                  <ul className="mt-2 space-y-1">
                    {((application as any).documentsRequired || []).map((doc: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

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
                  <p className="text-sm text-gray-500">{formatDate(mappedApplication.submittedDate)}</p>
                </div>
              </div>
              {(application as any).estimatedCompletionDate && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-slate-400 text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Estimated Completion</p>
                    <p className="text-sm text-gray-500">{formatDate((application as any).estimatedCompletionDate)}</p>
                  </div>
                </div>
              )}
              {(application as any).refundIssuedDate && (
                <div className="flex items-center gap-4 p-3 bg-slate-100 rounded-lg">
                  <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Refund Issued</p>
                    <p className="text-sm text-gray-500">{formatDate((application as any).refundIssuedDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {mappedApplication.notes && (
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#1e3a5f] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-[#1e3a5f]">Note from Our Team</p>
                  <p className="text-sm text-slate-600 mt-1">{mappedApplication.notes}</p>
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

export default TaxRefundModal;
