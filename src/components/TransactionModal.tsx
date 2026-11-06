import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { LedgerRow, FinancialBook } from '../types/finance';
import { STANDARD_CHART_OF_ACCOUNTS } from '../utils/financeEngine';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (row: LedgerRow) => void;
  editRow?: LedgerRow | null;
  book: FinancialBook;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editRow,
  book
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(editRow?.date || new Date().toISOString().slice(0, 10));
  const [direction, setDirection] = useState<'IN' | 'OUT'>(
    editRow ? (editRow.amountIn > 0 ? 'IN' : 'OUT') : 'IN'
  );
  const [amount, setAmount] = useState<string>(
    editRow ? String(editRow.amountIn > 0 ? editRow.amountIn : editRow.amountOut) : ''
  );
  const [entity, setEntity] = useState(editRow?.entity || '');
  const [description, setDescription] = useState(editRow?.description || '');
  const [accountCode, setAccountCode] = useState(editRow?.accountCode || (direction === 'IN' ? '4020' : '6900'));
  const [referenceNo, setReferenceNo] = useState(editRow?.referenceNo || '');
  const [sourceDocument, setSourceDocument] = useState(editRow?.sourceDocument || 'Tax Receipt / Bank Record');
  const [taxDeductible, setTaxDeductible] = useState(editRow?.taxDeductible ?? (direction === 'OUT'));
  const [approved, setApproved] = useState(editRow?.approved ?? true);
  const [error, setError] = useState('');

  const filteredAccounts = STANDARD_CHART_OF_ACCOUNTS.filter(a => {
    if (direction === 'IN') {
      return a.category === 'REVENUE' || a.category === 'ASSET_CURRENT' || a.category === 'EQUITY' || a.category === 'LIABILITY_NON_CURRENT';
    } else {
      return a.category === 'EXPENSE_OPERATING' || a.category === 'COGS' || a.category === 'ASSET_NON_CURRENT' || a.category === 'LIABILITY_CURRENT' || a.category === 'LIABILITY_NON_CURRENT' || a.category === 'EQUITY';
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!date) {
      setError('Please select a valid transaction date.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please specify a positive transaction amount.');
      return;
    }
    if (!entity.trim()) {
      setError('Please provide the counterparty (Customer, Vendor, or Payee).');
      return;
    }

    const matchedAccount = STANDARD_CHART_OF_ACCOUNTS.find(a => a.code === accountCode);

    const newRow: LedgerRow = {
      id: editRow?.id || `TX-${Date.now().toString(36)}`,
      date,
      entity: entity.trim(),
      description: description.trim() || 'Commercial transaction',
      amountIn: direction === 'IN' ? parsedAmount : 0,
      amountOut: direction === 'OUT' ? parsedAmount : 0,
      accountCode,
      accountName: matchedAccount ? matchedAccount.name : 'General Administrative Expenses',
      referenceNo: referenceNo.trim(),
      sourceDocument: sourceDocument.trim() || 'Verified Entry',
      taxDeductible,
      vatEligible: true,
      status: approved ? 'APPROVED' : 'PENDING_REVIEW',
      approved,
      createdAt: editRow?.createdAt || new Date().toISOString()
    };

    onSave(newRow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in fade-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {editRow ? 'Edit General Ledger Entry' : 'Record New Transaction Entry'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Standard double-entry classification with automated audit verification trail.
        </p>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Direction Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => { setDirection('IN'); setAccountCode('4020'); setTaxDeductible(false); }}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                direction === 'IN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Money IN (Inflow / Receipt)
            </button>
            <button
              type="button"
              onClick={() => { setDirection('OUT'); setAccountCode('6900'); setTaxDeductible(true); }}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                direction === 'OUT'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Money OUT (Outflow / Expense)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount ({book.settings.currencySymbol || '$'}) *
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Counterparty (Entity / Payee / Customer / Vendor) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Fuel, Maria Superstore, Landlord LLC"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Business Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. October warehouse power bill, delivery fuel, customer invoice payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Standard Account Classification *
            </label>
            <select
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {filteredAccounts.map(a => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.name} ({a.plainEnglish})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reference / Invoice # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. INV-101, BILL-402, LN-001"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Source Document Proof
              </label>
              <input
                type="text"
                placeholder="e.g. Bank Wire Slip, Tax Invoice #551"
                value={sourceDocument}
                onChange={(e) => setSourceDocument(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={taxDeductible}
                onChange={(e) => setTaxDeductible(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Tax-Deductible Business Expense</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Approved by Controller</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
            >
              {editRow ? 'Update Entry' : 'Post to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
