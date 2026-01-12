/**
 * Financial Applications Context
 * Manages credit card debt clearing and tax refund applications across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Credit Card Application Type
export interface CreditCardApplication {
  id: string;
  applicationNumber: string;
  type: 'credit-card';
  status: 'submitted' | 'under-review' | 'approved' | 'clearing' | 'cleared' | 'rejected';
  submittedAt: string;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Card Info
  bankName: string;
  cardType: string;
  cardLast4: string;
  creditLimit: number;
  currentBalance: number;
  // Calculated
  serviceFee: number;
  serviceFeePercentage: number;
  // Timeline
  estimatedClearDate?: string;
  clearedDate?: string;
  // Notes
  teamNotes?: string;
}

// Tax Refund Application Type
export interface TaxRefundApplication {
  id: string;
  applicationNumber: string;
  type: 'tax-refund';
  status: 'submitted' | 'review' | 'filing' | 'approved' | 'refund-issued' | 'rejected';
  submittedAt: string;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Tax Info
  taxYear: number;
  employmentStatus: string;
  filingStatus: string;
  estimatedIncome: number;
  // Calculated
  estimatedRefund: number;
  actualRefund?: number;
  serviceFee: number;
  serviceFeePercentage: number;
  netRefund: number;
  // Timeline
  estimatedCompletionDate?: string;
  completedDate?: string;
  // Notes
  teamNotes?: string;
}

// Context Type
interface FinancialApplicationsContextType {
  creditCardApplications: CreditCardApplication[];
  taxRefundApplications: TaxRefundApplication[];
  addCreditCardApplication: (application: Omit<CreditCardApplication, 'id' | 'applicationNumber' | 'serviceFee' | 'serviceFeePercentage'>) => CreditCardApplication;
  addTaxRefundApplication: (application: Omit<TaxRefundApplication, 'id' | 'applicationNumber' | 'serviceFee' | 'serviceFeePercentage' | 'netRefund'>) => TaxRefundApplication;
  updateCreditCardApplication: (id: string, updates: Partial<CreditCardApplication>) => void;
  updateTaxRefundApplication: (id: string, updates: Partial<TaxRefundApplication>) => void;
  getCreditCardApplication: (id: string) => CreditCardApplication | undefined;
  getTaxRefundApplication: (id: string) => TaxRefundApplication | undefined;
}

const FinancialApplicationsContext = createContext<FinancialApplicationsContextType | undefined>(undefined);

// Generate unique application number (numeric only)
const generateApplicationNumber = (): string => {
  return `${Date.now()}`;
};

// Generate unique ID (numeric only)
const generateId = (): string => {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Service fee percentage
const SERVICE_FEE_PERCENTAGE = 15;

// Local storage keys
const CREDIT_CARD_STORAGE_KEY = 'talent-horizon-credit-card-applications';
const TAX_REFUND_STORAGE_KEY = 'talent-horizon-tax-refund-applications';

// Provider Component
export function FinancialApplicationsProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [creditCardApplications, setCreditCardApplications] = useState<CreditCardApplication[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CREDIT_CARD_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [taxRefundApplications, setTaxRefundApplications] = useState<TaxRefundApplication[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TAX_REFUND_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Persist to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem(CREDIT_CARD_STORAGE_KEY, JSON.stringify(creditCardApplications));
  }, [creditCardApplications]);

  useEffect(() => {
    localStorage.setItem(TAX_REFUND_STORAGE_KEY, JSON.stringify(taxRefundApplications));
  }, [taxRefundApplications]);

  // Add Credit Card Application
  const addCreditCardApplication = (
    application: Omit<CreditCardApplication, 'id' | 'applicationNumber' | 'serviceFee' | 'serviceFeePercentage'>
  ): CreditCardApplication => {
    // Service fee is 0 initially - admin will set it after review
    const newApplication: CreditCardApplication = {
      ...application,
      id: generateId(),
      applicationNumber: generateApplicationNumber(),
      serviceFee: 0, // Will be set by admin
      serviceFeePercentage: 0, // Will be set by admin
    };

    setCreditCardApplications(prev => [newApplication, ...prev]);
    return newApplication;
  };

  // Add Tax Refund Application
  const addTaxRefundApplication = (
    application: Omit<TaxRefundApplication, 'id' | 'applicationNumber' | 'serviceFee' | 'serviceFeePercentage' | 'netRefund'>
  ): TaxRefundApplication => {
    // Service fee is 0 initially - admin will set it after review
    const newApplication: TaxRefundApplication = {
      ...application,
      id: generateId(),
      applicationNumber: generateApplicationNumber(),
      serviceFee: 0, // Will be set by admin
      serviceFeePercentage: 0, // Will be set by admin
      netRefund: 0, // Will be calculated by admin
    };

    setTaxRefundApplications(prev => [newApplication, ...prev]);
    return newApplication;
  };

  // Update Credit Card Application
  const updateCreditCardApplication = (id: string, updates: Partial<CreditCardApplication>) => {
    setCreditCardApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          const updated = { ...app, ...updates };
          // Recalculate service fee if balance changed
          if (updates.currentBalance !== undefined) {
            updated.serviceFee = updates.currentBalance * (SERVICE_FEE_PERCENTAGE / 100);
          }
          return updated;
        }
        return app;
      })
    );
  };

  // Update Tax Refund Application
  const updateTaxRefundApplication = (id: string, updates: Partial<TaxRefundApplication>) => {
    setTaxRefundApplications(prev =>
      prev.map(app => {
        if (app.id === id) {
          const updated = { ...app, ...updates };
          // Recalculate fees if refund amount changed
          if (updates.actualRefund !== undefined || updates.estimatedRefund !== undefined) {
            const refundAmount = updates.actualRefund || updates.estimatedRefund || app.estimatedRefund;
            updated.serviceFee = refundAmount * (SERVICE_FEE_PERCENTAGE / 100);
            updated.netRefund = refundAmount - updated.serviceFee;
          }
          return updated;
        }
        return app;
      })
    );
  };

  // Get Credit Card Application by ID
  const getCreditCardApplication = (id: string): CreditCardApplication | undefined => {
    return creditCardApplications.find(app => app.id === id || app.applicationNumber === id);
  };

  // Get Tax Refund Application by ID
  const getTaxRefundApplication = (id: string): TaxRefundApplication | undefined => {
    return taxRefundApplications.find(app => app.id === id || app.applicationNumber === id);
  };

  return (
    <FinancialApplicationsContext.Provider
      value={{
        creditCardApplications,
        taxRefundApplications,
        addCreditCardApplication,
        addTaxRefundApplication,
        updateCreditCardApplication,
        updateTaxRefundApplication,
        getCreditCardApplication,
        getTaxRefundApplication,
      }}
    >
      {children}
    </FinancialApplicationsContext.Provider>
  );
}

// Hook to use the context
export function useFinancialApplications() {
  const context = useContext(FinancialApplicationsContext);
  if (context === undefined) {
    throw new Error('useFinancialApplications must be used within a FinancialApplicationsProvider');
  }
  return context;
}

export default FinancialApplicationsContext;
