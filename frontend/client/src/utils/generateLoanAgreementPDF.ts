/**
 * Professional Loan Agreement PDF Generator
 * Industry-standard format compliant with Truth in Lending Act (TILA) requirements
 */

export interface LoanDetails {
  loanId: string;
  borrowerName: string;
  borrowerAddress: string;
  borrowerCity: string;
  borrowerState: string;
  borrowerZip: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerSSNLast4: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  originationFee: number;
  totalInterest: number;
  totalPayments: number;
  apr: number;
  firstPaymentDate: string;
  maturityDate: string;
  disbursementDate: string;
  loanPurpose: string;
  applicationDate: string;
}

export async function generateLoanAgreementPDF(loan: LoanDetails): Promise<Blob> {
  // Create PDF content as HTML for conversion
  const html = generateLoanAgreementHTML(loan);
  
  // Convert HTML to PDF using the server endpoint
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html, filename: `Loan_Agreement_${loan.loanId}.pdf` }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }
  
  return response.blob();
}

export function generateLoanAgreementHTML(loan: LoanDetails): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const formatPercent = (rate: number) => `${rate.toFixed(3)}%`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter;
      margin: 0.75in;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px double #1e3a5f;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .company-name {
      font-size: 24pt;
      font-weight: bold;
      color: #1e3a5f;
      letter-spacing: 2px;
    }
    
    .company-subtitle {
      font-size: 10pt;
      color: #666;
      margin-top: 5px;
    }
    
    .document-title {
      font-size: 16pt;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .loan-number {
      text-align: center;
      font-size: 10pt;
      color: #666;
      margin-bottom: 20px;
    }
    
    .tila-box {
      border: 2px solid #000;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    
    .tila-header {
      background: #1e3a5f;
      color: #fff;
      padding: 8px;
      font-weight: bold;
      font-size: 12pt;
      text-align: center;
    }
    
    .tila-grid {
      display: table;
      width: 100%;
      border-collapse: collapse;
    }
    
    .tila-row {
      display: table-row;
    }
    
    .tila-cell {
      display: table-cell;
      border: 1px solid #000;
      padding: 10px;
      text-align: center;
      width: 25%;
      vertical-align: top;
    }
    
    .tila-label {
      font-weight: bold;
      font-size: 9pt;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .tila-value {
      font-size: 14pt;
      font-weight: bold;
    }
    
    .tila-description {
      font-size: 8pt;
      color: #666;
      margin-top: 5px;
    }
    
    .section {
      margin: 20px 0;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1e3a5f;
      border-bottom: 1px solid #1e3a5f;
      padding-bottom: 5px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    
    .section-content {
      text-align: justify;
    }
    
    .parties-table {
      width: 100%;
      margin: 15px 0;
    }
    
    .parties-table td {
      padding: 5px 0;
      vertical-align: top;
    }
    
    .parties-table .label {
      font-weight: bold;
      width: 150px;
    }
    
    .payment-schedule {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    .payment-schedule th,
    .payment-schedule td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    
    .payment-schedule th {
      background: #f5f5f5;
      font-weight: bold;
    }
    
    .terms-list {
      margin-left: 20px;
    }
    
    .terms-list li {
      margin: 8px 0;
      text-align: justify;
    }
    
    .signature-section {
      margin-top: 40px;
      page-break-inside: avoid;
    }
    
    .signature-grid {
      display: table;
      width: 100%;
      margin-top: 30px;
    }
    
    .signature-col {
      display: table-cell;
      width: 45%;
      padding: 10px;
    }
    
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 50px;
      padding-top: 5px;
    }
    
    .signature-label {
      font-size: 10pt;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ccc;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .important-notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 10px;
      margin: 15px 0;
      font-size: 10pt;
    }
    
    .important-notice strong {
      color: #856404;
    }
    
    .checkbox-item {
      margin: 10px 0;
      display: flex;
      align-items: flex-start;
    }
    
    .checkbox {
      width: 14px;
      height: 14px;
      border: 1px solid #000;
      margin-right: 10px;
      flex-shrink: 0;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">TALENT HORIZON FINANCIAL</div>
    <div class="company-subtitle">A Division of Talent Horizon Corporation | NMLS #1234567</div>
    <div class="company-subtitle">123 Financial District, Suite 4500 | New York, NY 10004</div>
    <div class="company-subtitle">Tel: (800) 555-LOAN | Fax: (800) 555-5263 | www.talenthorizonfinancial.com</div>
  </div>

  <div class="document-title">Consumer Loan Agreement and Promissory Note</div>
  <div class="loan-number">Loan Number: ${loan.loanId} | Date: ${currentDate}</div>

  <!-- TILA DISCLOSURE BOX - Required by Federal Law -->
  <div class="tila-box">
    <div class="tila-header">FEDERAL TRUTH IN LENDING DISCLOSURES</div>
    <div class="tila-grid">
      <div class="tila-row">
        <div class="tila-cell">
          <div class="tila-label">Annual Percentage Rate</div>
          <div class="tila-value">${formatPercent(loan.apr)}</div>
          <div class="tila-description">The cost of your credit as a yearly rate</div>
        </div>
        <div class="tila-cell">
          <div class="tila-label">Finance Charge</div>
          <div class="tila-value">${formatCurrency(loan.totalInterest + loan.originationFee)}</div>
          <div class="tila-description">The dollar amount the credit will cost you</div>
        </div>
        <div class="tila-cell">
          <div class="tila-label">Amount Financed</div>
          <div class="tila-value">${formatCurrency(loan.loanAmount - loan.originationFee)}</div>
          <div class="tila-description">The amount of credit provided to you or on your behalf</div>
        </div>
        <div class="tila-cell">
          <div class="tila-label">Total of Payments</div>
          <div class="tila-value">${formatCurrency(loan.totalPayments)}</div>
          <div class="tila-description">The amount you will have paid after making all payments as scheduled</div>
        </div>
      </div>
    </div>
    <div style="padding: 10px; border-top: 1px solid #000;">
      <strong>PAYMENT SCHEDULE:</strong> Your payment schedule will be ${loan.termMonths} monthly payments of ${formatCurrency(loan.monthlyPayment)} beginning ${loan.firstPaymentDate} and continuing on the same day of each month thereafter until ${loan.maturityDate}.
    </div>
    <div style="padding: 10px; border-top: 1px solid #000; font-size: 10pt;">
      <strong>SECURITY:</strong> This is an unsecured loan. No collateral is required.
      <br><strong>LATE CHARGE:</strong> If a payment is more than 15 days late, you will be charged 5% of the payment amount or $25, whichever is greater.
      <br><strong>PREPAYMENT:</strong> If you pay off early, you will not have to pay a penalty. You may be entitled to a refund of part of the finance charge.
    </div>
  </div>

  <!-- PARTIES TO THE AGREEMENT -->
  <div class="section">
    <div class="section-title">1. Parties to This Agreement</div>
    <div class="section-content">
      <p>This Consumer Loan Agreement and Promissory Note ("Agreement") is entered into as of ${currentDate} by and between:</p>
      
      <table class="parties-table">
        <tr>
          <td class="label">LENDER:</td>
          <td>
            <strong>Talent Horizon Financial Services, LLC</strong><br>
            123 Financial District, Suite 4500<br>
            New York, NY 10004<br>
            NMLS #1234567
          </td>
        </tr>
        <tr>
          <td class="label">BORROWER:</td>
          <td>
            <strong>${loan.borrowerName}</strong><br>
            ${loan.borrowerAddress}<br>
            ${loan.borrowerCity}, ${loan.borrowerState} ${loan.borrowerZip}<br>
            SSN: XXX-XX-${loan.borrowerSSNLast4}<br>
            Email: ${loan.borrowerEmail}<br>
            Phone: ${loan.borrowerPhone}
          </td>
        </tr>
      </table>
    </div>
  </div>

  <!-- PROMISE TO PAY -->
  <div class="section">
    <div class="section-title">2. Promise to Pay</div>
    <div class="section-content">
      <p>FOR VALUE RECEIVED, the undersigned Borrower promises to pay to the order of Talent Horizon Financial Services, LLC, or its successors and assigns ("Lender"), at the address stated above or at such other place as the holder of this Note may designate in writing, the principal sum of <strong>${formatCurrency(loan.loanAmount)}</strong> (the "Principal Amount"), together with interest thereon at the rate and in the manner set forth below.</p>
    </div>
  </div>

  <!-- LOAN TERMS -->
  <div class="section">
    <div class="section-title">3. Loan Terms and Conditions</div>
    <div class="section-content">
      <table class="payment-schedule">
        <tr>
          <th>Loan Detail</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Principal Amount</td>
          <td>${formatCurrency(loan.loanAmount)}</td>
        </tr>
        <tr>
          <td>Annual Interest Rate (Fixed)</td>
          <td>${formatPercent(loan.interestRate)}</td>
        </tr>
        <tr>
          <td>Annual Percentage Rate (APR)</td>
          <td>${formatPercent(loan.apr)}</td>
        </tr>
        <tr>
          <td>Loan Term</td>
          <td>${loan.termMonths} months</td>
        </tr>
        <tr>
          <td>Monthly Payment Amount</td>
          <td>${formatCurrency(loan.monthlyPayment)}</td>
        </tr>
        <tr>
          <td>Origination Fee</td>
          <td>${formatCurrency(loan.originationFee)} (${((loan.originationFee / loan.loanAmount) * 100).toFixed(2)}%)</td>
        </tr>
        <tr>
          <td>Total Interest Over Life of Loan</td>
          <td>${formatCurrency(loan.totalInterest)}</td>
        </tr>
        <tr>
          <td>Total Amount to be Repaid</td>
          <td>${formatCurrency(loan.totalPayments)}</td>
        </tr>
        <tr>
          <td>First Payment Due Date</td>
          <td>${loan.firstPaymentDate}</td>
        </tr>
        <tr>
          <td>Final Payment Due Date</td>
          <td>${loan.maturityDate}</td>
        </tr>
        <tr>
          <td>Disbursement Date</td>
          <td>${loan.disbursementDate}</td>
        </tr>
        <tr>
          <td>Loan Purpose</td>
          <td>${loan.loanPurpose}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- INTEREST CALCULATION -->
  <div class="section">
    <div class="section-title">4. Interest Calculation</div>
    <div class="section-content">
      <p>Interest on this loan shall be calculated using the simple interest method based on a 365-day year and the actual number of days elapsed. The annual interest rate is fixed at ${formatPercent(loan.interestRate)} for the entire term of the loan. Interest shall accrue on the outstanding principal balance from the date of disbursement until the loan is paid in full.</p>
      
      <p style="margin-top: 10px;">The Annual Percentage Rate (APR) of ${formatPercent(loan.apr)} reflects the total cost of credit, including the origination fee, expressed as a yearly rate. This rate is provided in accordance with the Truth in Lending Act (15 U.S.C. § 1601 et seq.) and Regulation Z (12 C.F.R. Part 1026).</p>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PAYMENT TERMS -->
  <div class="section">
    <div class="section-title">5. Payment Terms</div>
    <div class="section-content">
      <p><strong>5.1 Monthly Payments.</strong> Borrower agrees to make ${loan.termMonths} consecutive monthly payments of ${formatCurrency(loan.monthlyPayment)} each, beginning on ${loan.firstPaymentDate} and continuing on the same day of each succeeding month until the loan is paid in full. The final payment shall be due on ${loan.maturityDate}.</p>
      
      <p style="margin-top: 10px;"><strong>5.2 Application of Payments.</strong> Each payment shall be applied first to any fees and charges due, then to accrued interest, and finally to the reduction of principal, unless otherwise required by applicable law.</p>
      
      <p style="margin-top: 10px;"><strong>5.3 Payment Methods.</strong> Payments may be made by:</p>
      <ul class="terms-list">
        <li>Automated Clearing House (ACH) transfer from a U.S. bank account</li>
        <li>Debit card payment through our secure online portal</li>
        <li>Check or money order payable to "Talent Horizon Financial Services, LLC"</li>
        <li>Wire transfer (additional fees may apply)</li>
      </ul>
      
      <p style="margin-top: 10px;"><strong>5.4 Payment Address.</strong> Unless paying electronically, all payments should be mailed to: Talent Horizon Financial Services, LLC, Payment Processing Center, P.O. Box 12345, New York, NY 10004-0001.</p>
    </div>
  </div>

  <!-- LATE PAYMENTS AND DEFAULT -->
  <div class="section">
    <div class="section-title">6. Late Payments, Default, and Remedies</div>
    <div class="section-content">
      <p><strong>6.1 Late Payment Fee.</strong> If any payment is not received within fifteen (15) calendar days after its due date, Borrower shall pay a late fee equal to the greater of five percent (5%) of the overdue payment amount or Twenty-Five Dollars ($25.00). This late fee is in addition to, and not in lieu of, any other remedies available to Lender.</p>
      
      <p style="margin-top: 10px;"><strong>6.2 Events of Default.</strong> The following shall constitute events of default under this Agreement:</p>
      <ul class="terms-list">
        <li>Failure to make any payment within thirty (30) days of its due date;</li>
        <li>Breach of any representation, warranty, or covenant contained in this Agreement;</li>
        <li>Filing of a petition in bankruptcy by or against Borrower;</li>
        <li>Death or legal incapacity of Borrower;</li>
        <li>Any material adverse change in Borrower's financial condition;</li>
        <li>Any false or misleading statement made by Borrower in connection with this loan.</li>
      </ul>
      
      <p style="margin-top: 10px;"><strong>6.3 Acceleration.</strong> Upon the occurrence of any event of default, Lender may, at its option and without notice or demand, declare the entire unpaid principal balance, together with all accrued interest and other charges, immediately due and payable.</p>
      
      <p style="margin-top: 10px;"><strong>6.4 Collection Costs.</strong> If this loan is placed with an attorney or collection agency for collection, Borrower agrees to pay all reasonable costs of collection, including but not limited to attorney's fees, court costs, and collection agency fees, to the extent permitted by applicable law.</p>
    </div>
  </div>

  <!-- PREPAYMENT -->
  <div class="section">
    <div class="section-title">7. Prepayment Rights</div>
    <div class="section-content">
      <p>Borrower may prepay this loan in whole or in part at any time without penalty. Any partial prepayment shall be applied to the principal balance and shall not postpone the due date of any subsequent payment unless Lender agrees otherwise in writing. Upon full prepayment, Borrower may be entitled to a refund of unearned interest calculated using the actuarial method.</p>
    </div>
  </div>

  <!-- REPRESENTATIONS AND WARRANTIES -->
  <div class="section">
    <div class="section-title">8. Borrower's Representations and Warranties</div>
    <div class="section-content">
      <p>Borrower represents and warrants to Lender that:</p>
      <ul class="terms-list">
        <li>Borrower is at least 18 years of age and a legal resident of the United States;</li>
        <li>All information provided in the loan application is true, accurate, and complete;</li>
        <li>Borrower has the legal capacity and authority to enter into this Agreement;</li>
        <li>Borrower is not subject to any pending bankruptcy proceedings;</li>
        <li>The loan proceeds will be used for lawful purposes only;</li>
        <li>Borrower has not concealed any material information that would affect Lender's decision to extend credit;</li>
        <li>Borrower's Social Security Number and other identifying information are accurate.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- CREDIT REPORTING -->
  <div class="section">
    <div class="section-title">9. Credit Reporting and Privacy</div>
    <div class="section-content">
      <p><strong>9.1 Credit Bureau Reporting.</strong> Lender may report information about Borrower's account to credit bureaus. Late payments, missed payments, or other defaults on this account may be reflected in Borrower's credit report. Lender reports to Equifax, Experian, and TransUnion.</p>
      
      <p style="margin-top: 10px;"><strong>9.2 Credit Disputes.</strong> If Borrower believes that any information reported to a credit bureau is inaccurate, Borrower may dispute the information directly with the credit bureau or contact Lender's Customer Service department at (800) 555-LOAN.</p>
      
      <p style="margin-top: 10px;"><strong>9.3 Privacy Policy.</strong> Lender's collection, use, and disclosure of Borrower's personal information is governed by our Privacy Policy, a copy of which has been provided to Borrower and is available at www.talenthorizonfinancial.com/privacy. Lender will not sell Borrower's personal information to third parties for marketing purposes.</p>
    </div>
  </div>

  <!-- ELECTRONIC COMMUNICATIONS -->
  <div class="section">
    <div class="section-title">10. Electronic Communications and Disclosures</div>
    <div class="section-content">
      <p>By signing this Agreement, Borrower consents to receive all communications, disclosures, notices, and documents related to this loan electronically. This includes, but is not limited to:</p>
      <ul class="terms-list">
        <li>Monthly statements and payment reminders;</li>
        <li>Notices of changes to terms or policies;</li>
        <li>Tax documents (Form 1098, if applicable);</li>
        <li>Collection notices and default notifications;</li>
        <li>Any other legally required disclosures.</li>
      </ul>
      <p style="margin-top: 10px;">Borrower may withdraw consent to electronic communications at any time by contacting Customer Service, but doing so may result in a paper delivery fee of $5.00 per statement.</p>
    </div>
  </div>

  <!-- GOVERNING LAW -->
  <div class="section">
    <div class="section-title">11. Governing Law and Dispute Resolution</div>
    <div class="section-content">
      <p><strong>11.1 Governing Law.</strong> This Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of laws principles, and applicable federal law.</p>
      
      <p style="margin-top: 10px;"><strong>11.2 Arbitration.</strong> Any dispute, claim, or controversy arising out of or relating to this Agreement shall be resolved by binding arbitration administered by the American Arbitration Association in accordance with its Consumer Arbitration Rules. The arbitration shall take place in New York, New York, or at another mutually agreed location. The arbitrator's decision shall be final and binding, and judgment on the award may be entered in any court of competent jurisdiction.</p>
      
      <p style="margin-top: 10px;"><strong>11.3 Class Action Waiver.</strong> BORROWER AGREES THAT ANY ARBITRATION OR COURT PROCEEDING SHALL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. Borrower waives any right to participate in a class action lawsuit or class-wide arbitration.</p>
      
      <p style="margin-top: 10px;"><strong>11.4 Small Claims Exception.</strong> Notwithstanding the arbitration provision, either party may bring an individual action in small claims court for disputes within the court's jurisdictional limits.</p>
    </div>
  </div>

  <!-- MISCELLANEOUS -->
  <div class="section">
    <div class="section-title">12. General Provisions</div>
    <div class="section-content">
      <p><strong>12.1 Entire Agreement.</strong> This Agreement, together with any schedules and exhibits attached hereto, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, warranties, and agreements between the parties.</p>
      
      <p style="margin-top: 10px;"><strong>12.2 Amendment.</strong> This Agreement may not be amended or modified except by a written instrument signed by both parties.</p>
      
      <p style="margin-top: 10px;"><strong>12.3 Assignment.</strong> Lender may assign, sell, or transfer this Agreement and the loan evidenced hereby without notice to or consent of Borrower. Borrower may not assign this Agreement or any rights hereunder without Lender's prior written consent.</p>
      
      <p style="margin-top: 10px;"><strong>12.4 Severability.</strong> If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
      
      <p style="margin-top: 10px;"><strong>12.5 Waiver.</strong> No waiver by Lender of any default shall be deemed a waiver of any subsequent default. No delay or omission by Lender in exercising any right shall operate as a waiver of such right.</p>
      
      <p style="margin-top: 10px;"><strong>12.6 Notices.</strong> All notices required or permitted under this Agreement shall be in writing and shall be deemed delivered when personally delivered, sent by certified mail (return receipt requested), or sent by overnight courier to the addresses set forth above.</p>
      
      <p style="margin-top: 10px;"><strong>12.7 Headings.</strong> The section headings in this Agreement are for convenience only and shall not affect the interpretation of this Agreement.</p>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- IMPORTANT NOTICES -->
  <div class="section">
    <div class="section-title">13. Important Notices and Disclosures</div>
    <div class="section-content">
      <div class="important-notice">
        <strong>NOTICE TO BORROWER:</strong> Do not sign this Agreement before you read it or if it contains any blank spaces. You are entitled to a completely filled-in copy of this Agreement. Keep this copy to protect your legal rights.
      </div>
      
      <div class="important-notice">
        <strong>RIGHT TO CANCEL:</strong> You may have the right to cancel this transaction within three (3) business days if the loan is secured by your principal dwelling. If this right applies, you will receive a separate Notice of Right to Cancel.
      </div>
      
      <div class="important-notice">
        <strong>CREDIT INSURANCE:</strong> Credit insurance is not required to obtain this loan and has not been included in the finance charge or payment calculations. If you wish to purchase credit insurance, it is available at an additional cost.
      </div>
      
      <p style="margin-top: 15px;"><strong>MILITARY LENDING ACT DISCLOSURE:</strong> Federal law provides important protections to members of the Armed Forces and their dependents relating to extensions of consumer credit. In general, the cost of consumer credit to a member of the Armed Forces and his or her dependent may not exceed an annual percentage rate of 36 percent. This rate must include, as applicable to the credit transaction or account: the costs associated with any credit insurance premium; fee for participation in a debt cancellation or debt suspension agreement; finance charge; guarantee fee; application fee; and any fee imposed for a credit-related ancillary product sold in connection with the credit transaction.</p>
    </div>
  </div>

  <!-- ACKNOWLEDGMENTS -->
  <div class="section">
    <div class="section-title">14. Borrower Acknowledgments</div>
    <div class="section-content">
      <p>By signing below, Borrower acknowledges and agrees that:</p>
      
      <div class="checkbox-item">
        <div class="checkbox"></div>
        <span>I have read and understand all terms and conditions of this Agreement.</span>
      </div>
      
      <div class="checkbox-item">
        <div class="checkbox"></div>
        <span>I have received a copy of the Truth in Lending disclosures before signing this Agreement.</span>
      </div>
      
      <div class="checkbox-item">
        <div class="checkbox"></div>
        <span>I understand that this is a legally binding contract and that I am obligated to repay the loan according to its terms.</span>
      </div>
      
      <div class="checkbox-item">
        <div class="checkbox"></div>
        <span>I authorize Lender to verify my employment, income, and credit history.</span>
      </div>
      
      <div class="checkbox-item">
        <div class="checkbox"></div>
        <span>I consent to receive electronic communications regarding this loan.</span>
      </div>
      
      <div class="checkbox-item">
        <div class="checkbox"></div>
        <span>I acknowledge that late payments may be reported to credit bureaus and may negatively affect my credit score.</span>
      </div>
    </div>
  </div>

  <!-- SIGNATURES -->
  <div class="signature-section">
    <div class="section-title">15. Signatures</div>
    <p>IN WITNESS WHEREOF, the parties have executed this Consumer Loan Agreement and Promissory Note as of the date first written above.</p>
    
    <div class="signature-grid">
      <div class="signature-col">
        <div class="signature-line">
          <div class="signature-label"><strong>BORROWER:</strong></div>
          <div style="margin-top: 5px;">${loan.borrowerName}</div>
          <div style="font-size: 9pt; color: #666;">Signature</div>
        </div>
        <div style="margin-top: 20px;">
          <div class="signature-line">
            <div class="signature-label">Date: _____________________</div>
          </div>
        </div>
      </div>
      <div class="signature-col">
        <div class="signature-line">
          <div class="signature-label"><strong>LENDER:</strong></div>
          <div style="margin-top: 5px;">Talent Horizon Financial Services, LLC</div>
          <div style="font-size: 9pt; color: #666;">By: Authorized Representative</div>
        </div>
        <div style="margin-top: 20px;">
          <div class="signature-line">
            <div class="signature-label">Date: ${currentDate}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>Talent Horizon Financial Services, LLC | NMLS #1234567</p>
    <p>This document contains ${loan.termMonths + 3} pages including this signature page.</p>
    <p>Loan Agreement Version 2024.1 | Generated: ${currentDate}</p>
    <p style="margin-top: 10px; font-size: 8pt;">
      Equal Housing Lender. Talent Horizon Financial Services, LLC is licensed to conduct business in all 50 states. 
      For licensing information, visit www.nmlsconsumeraccess.org.
    </p>
  </div>

</body>
</html>
`;
}

export function downloadLoanAgreement(loan: LoanDetails): void {
  const html = generateLoanAgreementHTML(loan);
  
  // Create a Blob with the HTML content
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open in new window for printing/saving as PDF
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      // Add print styles and trigger print dialog
      printWindow.document.title = `Loan_Agreement_${loan.loanId}`;
    };
  }
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Generate sample loan data for testing
export function generateSampleLoanDetails(loanId: string, amount: number, rate: number, termMonths: number): LoanDetails {
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalPayments = monthlyPayment * termMonths;
  const totalInterest = totalPayments - amount;
  const originationFee = amount * 0.02; // 2% origination fee
  const apr = ((totalInterest + originationFee) / amount / (termMonths / 12)) * 100;
  
  const today = new Date();
  const firstPayment = new Date(today);
  firstPayment.setMonth(firstPayment.getMonth() + 1);
  
  const maturity = new Date(firstPayment);
  maturity.setMonth(maturity.getMonth() + termMonths - 1);
  
  return {
    loanId,
    borrowerName: 'John Doe',
    borrowerAddress: '123 Main Street, Apt 4B',
    borrowerCity: 'New York',
    borrowerState: 'NY',
    borrowerZip: '10001',
    borrowerEmail: 'john@talenthorizon.com',
    borrowerPhone: '(555) 123-4567',
    borrowerSSNLast4: '1234',
    loanAmount: amount,
    interestRate: rate,
    termMonths,
    monthlyPayment,
    originationFee,
    totalInterest,
    totalPayments,
    apr,
    firstPaymentDate: firstPayment.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    maturityDate: maturity.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    disbursementDate: today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    loanPurpose: 'Debt Consolidation',
    applicationDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}
