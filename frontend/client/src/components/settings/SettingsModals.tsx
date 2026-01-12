/**
 * Settings Modals - All modal dialogs for Settings section
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CreditCard, Building, DollarSign, Plus, Check, AlertCircle,
  Mail, Phone, User, Globe, MapPin, FileText, Key, Calendar
} from 'lucide-react';

// Modal Backdrop
const ModalBackdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 z-50"
    onClick={onClick}
  />
);

// Modal Container
const ModalContainer: React.FC<{
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, title, onClose, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-[#1e3a5f]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
      </motion.div>
    </>
  );
};

// Add Payment Method Modal
export const AddPaymentMethodModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: any) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod = {
      id: Date.now().toString(),
      type,
      name: type === 'card' ? `${cardName} ending in ${cardNumber.slice(-4)}` : `PayPal - ${paypalEmail}`,
      last4: type === 'card' ? cardNumber.slice(-4) : undefined,
      expiryDate: type === 'card' ? expiry : undefined,
      isDefault,
      isVerified: true,
    };
    onAdd(newMethod);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContainer title="Add Payment Method" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Payment Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('card')}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    type === 'card' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${type === 'card' ? 'text-[#1e3a5f]' : 'text-slate-400'}`} />
                  <span className="font-medium">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('paypal')}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    type === 'paypal' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <DollarSign className={`w-6 h-6 ${type === 'paypal' ? 'text-[#1e3a5f]' : 'text-slate-400'}`} />
                  <span className="font-medium">PayPal</span>
                </button>
              </div>
            </div>

            {type === 'card' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PayPal Email</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="your@email.com"
                  required
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
              />
              <span className="text-sm text-slate-600">Set as default payment method</span>
            </label>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
              >
                Add Payment Method
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};

// Add Withdrawal Method Modal
export const AddWithdrawalMethodModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: any) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState<'bank' | 'paypal' | 'payoneer'>('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [payoneerEmail, setPayoneerEmail] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newMethod;
    if (type === 'bank') {
      newMethod = {
        id: Date.now().toString(),
        type: 'bank',
        name: `${bankName} - ${accountType.charAt(0).toUpperCase() + accountType.slice(1)} ****${accountNumber.slice(-4)}`,
        accountLast4: accountNumber.slice(-4),
        isDefault,
        isVerified: true,
      };
    } else if (type === 'paypal') {
      newMethod = {
        id: Date.now().toString(),
        type: 'paypal',
        name: `PayPal - ${paypalEmail}`,
        isDefault,
        isVerified: true,
      };
    } else {
      newMethod = {
        id: Date.now().toString(),
        type: 'payoneer',
        name: `Payoneer - ${payoneerEmail}`,
        isDefault,
        isVerified: true,
      };
    }
    onAdd(newMethod);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContainer title="Add Withdrawal Method" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Method Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Withdrawal Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setType('bank')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    type === 'bank' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Building className={`w-6 h-6 ${type === 'bank' ? 'text-[#1e3a5f]' : 'text-slate-400'}`} />
                  <span className="font-medium text-sm">Bank Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('paypal')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    type === 'paypal' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <DollarSign className={`w-6 h-6 ${type === 'paypal' ? 'text-[#1e3a5f]' : 'text-slate-400'}`} />
                  <span className="font-medium text-sm">PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('payoneer')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    type === 'payoneer' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Globe className={`w-6 h-6 ${type === 'payoneer' ? 'text-[#1e3a5f]' : 'text-slate-400'}`} />
                  <span className="font-medium text-sm">Payoneer</span>
                </button>
              </div>
            </div>

            {type === 'bank' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="Chase Bank"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('checking')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        accountType === 'checking' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200'
                      }`}
                    >
                      Checking
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('savings')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        accountType === 'savings' ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200'
                      }`}
                    >
                      Savings
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="123456789"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="123456789012"
                    required
                  />
                </div>
              </>
            ) : type === 'paypal' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PayPal Email</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="your@email.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payoneer Email</label>
                <input
                  type="email"
                  value={payoneerEmail}
                  onChange={(e) => setPayoneerEmail(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="your@email.com"
                  required
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
              />
              <span className="text-sm text-slate-600">Set as default withdrawal method</span>
            </label>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
              >
                Add Withdrawal Method
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};

// Edit Billing Address Modal
export const EditBillingAddressModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentAddress: any;
  onSave: (address: any) => void;
}> = ({ isOpen, onClose, currentAddress, onSave }) => {
  const [street, setStreet] = useState(currentAddress?.street || '');
  const [city, setCity] = useState(currentAddress?.city || '');
  const [state, setState] = useState(currentAddress?.state || '');
  const [zipCode, setZipCode] = useState(currentAddress?.zipCode || '');
  const [country, setCountry] = useState(currentAddress?.country || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ street, city, state, zipCode, country });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContainer title="Edit Billing Address" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="San Francisco"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="CA"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="94102"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder="United States"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};

// Edit Tax Info Modal
export const EditTaxInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentTaxInfo: any;
  onSave: (taxInfo: any) => void;
}> = ({ isOpen, onClose, currentTaxInfo, onSave }) => {
  const [taxIdType, setTaxIdType] = useState(currentTaxInfo?.taxIdType || 'ssn');
  const [taxId, setTaxId] = useState(currentTaxInfo?.taxId || '');
  const [taxCountry, setTaxCountry] = useState(currentTaxInfo?.taxCountry || 'United States');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...currentTaxInfo, taxIdType, taxId, taxCountry });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContainer title="Update Tax Information" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID Type</label>
              <select
                value={taxIdType}
                onChange={(e) => setTaxIdType(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              >
                <option value="ssn">SSN (Social Security Number)</option>
                <option value="ein">EIN (Employer Identification Number)</option>
                <option value="itin">ITIN (Individual Taxpayer Identification Number)</option>
                <option value="vat">VAT Number</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                placeholder="XXX-XX-XXXX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax Country</label>
              <input
                type="text"
                value={taxCountry}
                onChange={(e) => setTaxCountry(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                placeholder="United States"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
              >
                Save Tax Info
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};

// Generate API Key Modal
export const GenerateApiKeyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (name: string, permissions: string[]) => void;
}> = ({ isOpen, onClose, onGenerate }) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['read']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(name, permissions);
    onClose();
    setName('');
    setPermissions(['read']);
  };

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContainer title="Generate API Key" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                placeholder="My API Key"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
              <div className="space-y-2">
                {[
                  { id: 'read', label: 'Read', description: 'View data and resources' },
                  { id: 'write', label: 'Write', description: 'Create and update resources' },
                  { id: 'delete', label: 'Delete', description: 'Remove resources' },
                  { id: 'admin', label: 'Admin', description: 'Full administrative access' },
                ].map((perm) => (
                  <label
                    key={perm.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      permissions.includes(perm.id) ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{perm.label}</p>
                      <p className="text-sm text-slate-500">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Important</p>
                  <p className="text-sm text-amber-700">
                    Your API key will only be shown once after generation. Make sure to copy and store it securely.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
              >
                Generate Key
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};

// Edit Personal Info Modal
export const EditPersonalInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  field: 'email' | 'phone' | 'username';
  currentValue: string;
  onSave: (value: string) => void;
}> = ({ isOpen, onClose, field, currentValue, onSave }) => {
  const [value, setValue] = useState(currentValue);

  const fieldConfig = {
    email: { title: 'Email Address', type: 'email', placeholder: 'your@email.com', icon: Mail },
    phone: { title: 'Phone Number', type: 'tel', placeholder: '+1 (555) 123-4567', icon: Phone },
    username: { title: 'Username', type: 'text', placeholder: '@username', icon: User },
  };

  const config = fieldConfig[field];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalContainer title={`Edit ${config.title}`} onClose={onClose} size="sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{config.title}</label>
              <div className="relative">
                <config.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={config.type}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full p-3 pl-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  placeholder={config.placeholder}
                  required
                />
              </div>
            </div>
            {field === 'email' && (
              <p className="text-sm text-slate-500">
                A verification email will be sent to your new email address.
              </p>
            )}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};

// Success Toast Component
export const SuccessToast: React.FC<{
  message: string;
  isVisible: boolean;
  onClose: () => void;
}> = ({ message, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <Check className="w-5 h-5" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
