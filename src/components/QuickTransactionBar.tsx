import React, { useState } from 'react';
import { Plus, Sparkles, CheckCircle2, ArrowDownLeft, ArrowUpRight, Download, Zap } from 'lucide-react';
import { FinancialBook, LedgerRow } from '../types/finance';
import { autoClassifyTransaction } from '../utils/smartClassifier';
import { formatCurrency } from '../utils/financeEngine';

interface QuickTransactionBarProps {
  book: FinancialBook;
  onPostTransaction: (row: LedgerRow) => void;
  onOpenStandaloneModal: () => void;
}

export const QuickTransactionBar: React.FC<QuickTransactionBarProps> = ({
  book,
  onPostTransaction,
  onOpenStandaloneModal
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [userDirection, setUserDirection] = useState<'AUTO' | 'IN' | 'OUT'>('AUTO');
  const [lastPosted, setLastPosted] = useState<string | null>(null);

  // Live auto-classification preview as user types
  const classified = autoClassifyTransaction(description, userDirection, book);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newRow: LedgerRow = {
      id: `TX-${Date.now().toString(36)}`,
      date,
      entity: classified.suggestedEntity,
      description: description.trim(),
      amountIn: classified.direction === 'IN' ? parsedAmount : 0,
      amountOut: classified.direction === 'OUT' ? parsedAmount : 0,
      accountCode: classified.accountCode,
      accountName: classified.accountName,
      referenceNo: classified.suggestedReference,
      sourceDocument: classified.sourceDocument,
      taxDeductible: classified.taxDeductible,
      vatEligible: classified.vatEligible,
      status: 'APPROVED',
      approved: true,
      createdAt: new Date().toISOString()
    };

    onPostTransaction(newRow);

    // Reset form and show success toast
    setDescription('');
    setAmount('');
    setUserDirection('AUTO');
    setLastPosted(`Successfully posted "${newRow.description}" (${formatCurrency(parsedAmount, book.settings.currency, book.settings.currencySymbol)}). All financial statements, tax schedules & audit dossier regenerated!`);
    
    setTimeout(() => {
      setLastPosted(null);
    }, 4500);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-emerald-600/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Title & Automated Pipeline Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Automated Transaction Portal</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                Single-Task Workflow
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Just input transactions. The system auto-classifies, balances the books, and prepares all reports for instant download.
            </p>
          </div>
        </div>

        {/* Instant Download Action Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenStandaloneModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-emerald-950 dark:text-emerald-100 bg-emerald-100/90 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800/80 border border-emerald-300 dark:border-emerald-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>Download All Reports / GitHub HTML</span>
          </button>
        </div>
      </div>

      {/* Main Single-Input Form Bar */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Description Input */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              What happened? (Natural description) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Paid warehouse rent, Client Maria paid INV-103, Diesel fuel, Coffee beans"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* Amount Input */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
              className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* Date Input */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* Inflow / Outflow Quick Direction */}
          <div className="md:col-span-3 flex items-center gap-2">
            <div className="flex bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setUserDirection('AUTO')}
                className={`px-2 py-1.5 rounded-lg transition-colors text-[11px] ${
                  userDirection === 'AUTO' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setUserDirection('IN')}
                className={`px-2 py-1.5 rounded-lg transition-colors text-[11px] flex items-center gap-0.5 ${
                  userDirection === 'IN' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-3 h-3" />
                <span>In</span>
              </button>
              <button
                type="button"
                onClick={() => setUserDirection('OUT')}
                className={`px-2 py-1.5 rounded-lg transition-colors text-[11px] flex items-center gap-0.5 ${
                  userDirection === 'OUT' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-3 h-3" />
                <span>Out</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!description.trim() || !amount}
              className="flex-1 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </div>

        {/* Live Auto-Classification Preview Strip */}
        {description.trim().length > 2 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in duration-100">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-Detected:</span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-[11px]">
              {classified.direction === 'IN' ? '↑ Money In (Receipt)' : '↓ Money Out (Disbursement)'}
            </span>
            <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-[11px]">
              {classified.accountName} <span className="font-mono text-slate-400">({classified.accountCode})</span>
            </span>
            <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-[11px]">
              Payee: <strong>{classified.suggestedEntity}</strong>
            </span>
            {classified.taxDeductible && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                ✓ Tax Deductible
              </span>
            )}
          </div>
        )}

        {/* Success Confirmation Toast */}
        {lastPosted && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-100 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{lastPosted}</span>
          </div>
        )}
      </form>
    </div>
  );
};
