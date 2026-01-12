import { useState, useMemo } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  Percent, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  CreditCard,
  Shield,
  Printer,
  ExternalLink,
  ChevronRight,
  Info,
  TrendingUp,
  Banknote
} from 'lucide-react';
import { 
  generateLoanAgreementHTML, 
  generateSampleLoanDetails,
  type LoanDetails 
} from '../utils/generateLoanAgreementPDF';

interface LoanApplication {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  interestRate?: number;
  term?: string;
  monthlyPayment?: number;
  nextPaymentDate?: string;
  remainingBalance?: number;
  paidAmount?: number;
  disbursementDate?: string;
}

interface LoanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanApplication;
  onWithdraw?: () => void;
}

export default function LoanDetailsModal({ isOpen, onClose, loan, onWithdraw }: LoanDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'documents'>('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Parse term to get months - ensure we have valid numbers
  const termMonths = useMemo(() => parseInt(String(loan.term || '36').replace(/[^0-9]/g, '')) || 36, [loan.term]);
  const interestRate = useMemo(() => Number(loan.interestRate) || 8.99, [loan.interestRate]);
  const loanAmount = useMemo(() => Number(loan.amount) || 75000, [loan.amount]);
  
  // Calculate loan metrics directly
  const { monthlyPayment, totalPayments, totalInterest, originationFee, apr } = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const mp = monthlyRate > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
      : loanAmount / termMonths;
    const tp = mp * termMonths;
    const ti = tp - loanAmount;
    const of = loanAmount * 0.02; // 2% origination fee
    const a = ((ti + of) / loanAmount / (termMonths / 12)) * 100;
    return { monthlyPayment: mp, totalPayments: tp, totalInterest: ti, originationFee: of, apr: a };
  }, [loanAmount, interestRate, termMonths]);
  
  // Generate full loan details for the agreement
  const loanDetails = useMemo(() => generateSampleLoanDetails(String(loan.id), loanAmount, interestRate, termMonths), [loan.id, loanAmount, interestRate, termMonths]);

  if (!isOpen) return null;

  // Generate payment schedule
  const generatePaymentSchedule = () => {
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);

    for (let i = 1; i <= Math.min(termMonths, 12); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i - 1);

      schedule.push({
        number: i,
        date: paymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }
    return schedule;
  };

  const paymentSchedule = generatePaymentSchedule();

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Get responsive font size class based on amount length
  const getAmountFontSize = (amount: number) => {
    const formatted = formatCurrency(amount);
    const length = formatted.length;
    if (length > 15) return 'text-lg sm:text-xl'; // $1,000,000.00+
    if (length > 12) return 'text-xl sm:text-2xl'; // $100,000.00+
    if (length > 9) return 'text-2xl sm:text-3xl'; // $10,000.00+
    return 'text-2xl sm:text-3xl'; // Default
  };

  const handleDownloadAgreement = () => {
    setIsGeneratingPDF(true);
    
    try {
      const html = generateLoanAgreementHTML(loanDetails);
      
      // Create a new window with the agreement
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.document.title = `Loan_Agreement_${loan.id}`;
        
        // Add print button to the document
        const printButton = printWindow.document.createElement('div');
        printButton.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; gap: 10px;">
            <button onclick="window.print()" style="
              background: #1e3a5f; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 14px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print / Save as PDF
            </button>
            <button onclick="window.close()" style="
              background: #6b7280; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
              Close
            </button>
          </div>
        `;
        printWindow.document.body.appendChild(printButton);
      }
    } catch (error) {
      console.error('Error generating agreement:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disbursed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
      case 'under review':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8b] text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{loan.type}</h2>
                  <p className="text-white/70 text-sm">Loan ID: {loan.id}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs uppercase tracking-wide">Loan Amount</p>
              <p className={`${getAmountFontSize(loanAmount)} font-bold mt-1`}>{formatCurrency(loanAmount)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs uppercase tracking-wide">Interest Rate</p>
              <p className="text-2xl font-bold mt-1">{interestRate}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs uppercase tracking-wide">Term</p>
              <p className="text-2xl font-bold mt-1">{loan.term || '36 months'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/70 text-xs uppercase tracking-wide">Status</p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(loan.status)}`}>
                {getStatusIcon(loan.status)}
                {loan.status}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'schedule', label: 'Payment Schedule', icon: Calendar },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#1e3a5f] text-[#1e3a5f]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-380px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* TILA Disclosure Box */}
              <div className="border-2 border-[#1e3a5f] rounded-xl overflow-hidden">
                <div className="bg-[#1e3a5f] text-white px-4 py-3 font-semibold text-center">
                  FEDERAL TRUTH IN LENDING DISCLOSURES
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-gray-200">
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Annual Percentage Rate</p>
                    <p className="text-2xl font-bold text-[#1e3a5f] mt-1">{apr.toFixed(3)}%</p>
                    <p className="text-xs text-gray-400 mt-1">The cost of your credit as a yearly rate</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Finance Charge</p>
                    <p className={`${getAmountFontSize(totalInterest + originationFee)} font-bold text-[#1e3a5f] mt-1`}>{formatCurrency(totalInterest + originationFee)}</p>
                    <p className="text-xs text-gray-400 mt-1">The dollar amount the credit will cost you</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Amount Financed</p>
                    <p className={`${getAmountFontSize(loanAmount - originationFee)} font-bold text-[#1e3a5f] mt-1`}>{formatCurrency(loanAmount - originationFee)}</p>
                    <p className="text-xs text-gray-400 mt-1">The amount of credit provided to you</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total of Payments</p>
                    <p className={`${getAmountFontSize(totalPayments)} font-bold text-[#1e3a5f] mt-1`}>{formatCurrency(totalPayments)}</p>
                    <p className="text-xs text-gray-400 mt-1">The amount you will have paid</p>
                  </div>
                </div>
              </div>

              {/* Loan Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#1e3a5f]" />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment</span>
                      <span className="font-semibold">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Payment Date</span>
                      <span className="font-semibold">{loanDetails.firstPaymentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Final Payment Date</span>
                      <span className="font-semibold">{loanDetails.maturityDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Payments</span>
                      <span className="font-semibold">{termMonths}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-[#1e3a5f]" />
                    Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal Amount</span>
                      <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origination Fee (2%)</span>
                      <span className="font-semibold">{formatCurrency(originationFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-900 font-semibold">Total Cost of Loan</span>
                      <span className="font-bold text-[#1e3a5f]">{formatCurrency(totalPayments)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notices */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Notices
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Late Payment:</strong> If a payment is more than 15 days late, you will be charged 5% of the payment amount or $25, whichever is greater.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Prepayment:</strong> You may prepay this loan in whole or in part at any time without penalty.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Security:</strong> This is an unsecured loan. No collateral is required.</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              {loan.status.toLowerCase() === 'approved' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onWithdraw}
                    className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8b] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Banknote className="w-5 h-5" />
                    Withdraw Funds
                  </button>
                  <button
                    onClick={handleDownloadAgreement}
                    disabled={isGeneratingPDF}
                    className="flex-1 bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] py-3 px-6 rounded-xl font-semibold hover:bg-[#1e3a5f]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {isGeneratingPDF ? 'Generating...' : 'Download Agreement'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Payment Schedule:</strong> Your payment of {formatCurrency(monthlyPayment)} is due on the same day each month. 
                  Showing first 12 months of {termMonths} total payments.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentSchedule.map((payment) => (
                      <tr key={payment.number} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{payment.number}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.date}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(payment.payment)}</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(payment.principal)}</td>
                        <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(payment.interest)}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(payment.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {termMonths > 12 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  ... and {termMonths - 12} more payments until {loanDetails.maturityDate}
                </p>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Loan Agreement */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-[#1e3a5f] hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Consumer Loan Agreement</h4>
                      <p className="text-sm text-gray-500 mt-1">Complete loan terms, conditions, and TILA disclosures</p>
                      <p className="text-xs text-gray-400 mt-2">PDF • ~4 pages • Generated {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadAgreement}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8b] transition-colors text-sm font-medium"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Truth in Lending Disclosure */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-[#1e3a5f] hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Truth in Lending Disclosure</h4>
                      <p className="text-sm text-gray-500 mt-1">Federal TILA disclosure statement (included in agreement)</p>
                      <p className="text-xs text-gray-400 mt-2">PDF • 1 page • Required by federal law</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadAgreement}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-[#1e3a5f] hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Amortization Schedule</h4>
                      <p className="text-sm text-gray-500 mt-1">Complete payment breakdown for all {termMonths} months</p>
                      <p className="text-xs text-gray-400 mt-2">PDF • {Math.ceil(termMonths / 20)} pages • Detailed breakdown</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-[#1e3a5f] hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Privacy Policy & Disclosures</h4>
                      <p className="text-sm text-gray-500 mt-1">How we collect, use, and protect your information</p>
                      <p className="text-xs text-gray-400 mt-2">PDF • 3 pages • Last updated Jan 2026</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <ExternalLink className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>

              {/* Print All */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDownloadAgreement}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  <Printer className="w-5 h-5" />
                  Print All Documents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
