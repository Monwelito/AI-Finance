import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Building2,
  Edit3,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { FinancialBook, LedgerRow } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';
import { QuickTransactionBar } from './QuickTransactionBar';
import { DownloadCenter } from './DownloadCenter';

interface DashboardViewProps {
  book: FinancialBook;
  computed: any;
  onNavigate: (tab: string) => void;
  onOpenNewTransaction: () => void;
  onOpenStandaloneModal: () => void;
  onPostTransaction: (row: LedgerRow) => void;
  onUpdateBusinessName?: (name: string) => void;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  book,
  computed,
  onNavigate,
  onOpenNewTransaction,
  onOpenStandaloneModal,
  onPostTransaction,
  onUpdateBusinessName,
  terminologyMode
}) => {
  const { balanceSheet, incomeStatement, auditSuite, plainMetrics } = computed;
  const { currency, currencySymbol } = book.settings;

  const isBalanced = balanceSheet.isBalanced;
  const isAuditClean = auditSuite.overallAuditOpinion === 'UNQUALIFIED';

  const [isEditingBusinessName, setIsEditingBusinessName] = useState(false);
  const [businessNameInput, setBusinessNameInput] = useState(book.settings.businessName);

  const handleSaveBusinessName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (businessNameInput.trim() && onUpdateBusinessName) {
      onUpdateBusinessName(businessNameInput.trim());
    }
    setIsEditingBusinessName(false);
  };

  return (
    <div className="space-y-6">
      {/* 0. PROMINENT: Active Business Entity Bar with Direct Name Input */}
      <div className="bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-900/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                Registered Business Entity
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Accrual GAAP
              </span>
            </div>
            
            <div className="mt-0.5">
              {isEditingBusinessName ? (
                <form onSubmit={handleSaveBusinessName} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={businessNameInput}
                    onChange={(e) => setBusinessNameInput(e.target.value)}
                    placeholder="Enter business name..."
                    autoFocus
                    className="px-2.5 py-1 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingBusinessName(false)}
                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => {
                    setBusinessNameInput(book.settings.businessName);
                    setIsEditingBusinessName(true);
                  }}
                  title="Click to change business name"
                >
                  <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {book.settings.businessName}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Name</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400">TIN:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{book.settings.taxRegistrationNumber || 'PENDING'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400">Currency:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{book.settings.currency} ({book.settings.currencySymbol || '$'})</span>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-sans"
          >
            <span>All Fiscal Rules</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 1. FRONT-AND-CENTER: Zero-Friction Automated Quick Transaction Input Bar */}
      <QuickTransactionBar
        book={book}
        onPostTransaction={onPostTransaction}
        onOpenStandaloneModal={onOpenStandaloneModal}
      />

      {/* 2. FRONT-AND-CENTER: Instant Download & Export Center */}
      <DownloadCenter
        book={book}
        computed={computed}
        onOpenStandaloneModal={onOpenStandaloneModal}
        onNavigate={onNavigate}
      />

      {/* Regulatory Health Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isBalanced && isAuditClean
          ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
          : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isBalanced && isAuditClean ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white' : 'bg-rose-600 text-white'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {isBalanced && isAuditClean ? 'Regulatory Books are Balanced & Audit-Compliant' : 'Audit Invariant Notice'}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                {auditSuite.complianceScorePct}% COMPLIANCE SCORE
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              {isBalanced
                ? 'GAAP Double-Entry Invariant verified: Total Assets balance Total Liabilities + Owner Equity to the cent.'
                : `Balance Sheet variance of ${formatCurrency(Math.abs(balanceSheet.variance), currency, currencySymbol)}. Review ledger entries.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('audit')}
          className="shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 shadow-xs transition-colors"
        >
          View Full Audit Certificate &rarr;
        </button>
      </div>

      {/* 4 Core Metric Cards (Green-themed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Liquid Cash */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <span>
              {terminologyMode === 'PLAIN' ? 'Cash in Hand & Bank' : 'Liquid Cash (Assets)'}
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-2">
            {formatCurrency(plainMetrics.cashOnHand, currency, currencySymbol)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Available immediately for vendor bills and payroll.
          </p>
          <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cash Runway</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              ~{plainMetrics.cashRunwayDays} days
            </span>
          </div>
        </div>

        {/* Card 2: Accounts Receivable */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <span>
              {terminologyMode === 'PLAIN' ? 'Money Customers Owe You' : 'Accounts Receivable (A/R)'}
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-2">
            {formatCurrency(plainMetrics.accountsReceivable, currency, currencySymbol)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Invoiced customer orders awaiting incoming collection.
          </p>
          <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Subledger</span>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              View Invoices
            </button>
          </div>
        </div>

        {/* Card 3: Accounts Payable */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <span>
              {terminologyMode === 'PLAIN' ? 'Bills You Owe to Suppliers' : 'Accounts Payable (A/P)'}
            </span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-2">
            {formatCurrency(plainMetrics.accountsPayable, currency, currencySymbol)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Short-term vendor bills due in upcoming payment cycle.
          </p>
          <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Subledger</span>
            <button
              onClick={() => onNavigate('bills')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              View Bills
            </button>
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <span>
              {terminologyMode === 'PLAIN' ? 'True Profit Left Over' : 'Net Income (Bottom Line)'}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight mt-2 ${
            plainMetrics.netProfit >= 0 ? 'text-emerald-700 dark:text-emerald-300 font-extrabold' : 'text-rose-600'
          }`}>
            {formatCurrency(plainMetrics.netProfit, currency, currencySymbol)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Net Margin: <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{plainMetrics.netProfitMargin}%</span> of total revenue.
          </p>
          <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Gross Sales</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
              {formatCurrency(plainMetrics.grossRevenue, currency, currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Waterfall & Working Capital */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual 1: Profit & Loss Revenue Waterfall */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue &amp; Cost Breakdown (Waterfall)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where every dollar came from and where it was spent
              </p>
            </div>
            <button
              onClick={() => onNavigate('income')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Full P&amp;L &rarr;
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Step 1: Gross Revenue */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>1. Gross Billed Revenue</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(incomeStatement.grossRevenue, currency, currencySymbol)}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Step 2: Direct Costs (COGS) */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>2. Cost of Materials &amp; Resale Inventory</span>
                <span className="font-mono text-emerald-800 dark:text-emerald-400 font-semibold">
                  -{formatCurrency(incomeStatement.costOfGoodsSold, currency, currencySymbol)}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${incomeStatement.grossRevenue > 0 ? (incomeStatement.costOfGoodsSold / incomeStatement.grossRevenue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Step 3: Operating Expenses */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>3. Operating Overhead (Rent, Wages, Utilities)</span>
                <span className="font-mono text-rose-700 dark:text-rose-400 font-semibold">
                  -{formatCurrency(incomeStatement.totalOperatingExpenses, currency, currencySymbol)}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${incomeStatement.grossRevenue > 0 ? (incomeStatement.totalOperatingExpenses / incomeStatement.grossRevenue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Step 4: Net Profit */}
            <div className="pt-2 border-t border-emerald-200/80 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span>4. Net Retained Profit</span>
                <span className={`font-mono font-extrabold ${incomeStatement.netIncome >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {formatCurrency(incomeStatement.netIncome, currency, currencySymbol)}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"
                  style={{ width: `${incomeStatement.grossRevenue > 0 ? Math.max(5, (incomeStatement.netIncome / incomeStatement.grossRevenue) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: Liquidity & Working Capital Health */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Working Capital &amp; Liquidity Health
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Can the business pay all short-term obligations immediately?
              </p>
            </div>
            <button
              onClick={() => onNavigate('balance')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Balance Sheet &rarr;
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-200">
                <span>Quick Liquidity Ratio</span>
                <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
                  {plainMetrics.quickRatio >= 99 ? 'No Current Debt' : `${plainMetrics.quickRatio}x`}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {plainMetrics.quickRatio >= 1.5
                  ? 'Strong: Liquid assets cover short-term debts with comfortable safety margin.'
                  : 'Monitor: Ensure customers pay invoices on time to avoid cash crunches.'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Total Liquid Resources (Cash + A/R)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(plainMetrics.cashOnHand + plainMetrics.accountsReceivable, currency, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Total Short-Term Obligations (Bills + Taxes)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(balanceSheet.currentLiabilities.total, currency, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-emerald-200/80 dark:border-slate-800">
                <span className="text-slate-900 dark:text-white">Net Working Capital Cushion</span>
                <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(
                    (plainMetrics.cashOnHand + plainMetrics.accountsReceivable) - balanceSheet.currentLiabilities.total,
                    currency,
                    currencySymbol
                  )}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenStandaloneModal}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-950 dark:text-emerald-100 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Export Standalone HTML Ready for GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ledger Entries with Audit Status */}
      <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent General Ledger Transactions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological log of receipts, payments, and approvals
            </p>
          </div>
          <button
            onClick={() => onNavigate('ledger')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            View All Ledger Entries &rarr;
          </button>
        </div>

        <div className="overflow-x-auto border border-emerald-200/80 dark:border-emerald-900/60 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-emerald-50/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-emerald-200 dark:border-emerald-900">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Entity / Payee</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Inflow</th>
                <th className="py-2.5 px-3 text-right">Outflow</th>
                <th className="py-2.5 px-3">Account Group</th>
                <th className="py-2.5 px-3">Source Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60 dark:divide-slate-800">
              {book.rows.slice(-6).reverse().map((r) => (
                <tr key={r.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(r.date)}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                    {r.entity}
                  </td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {r.description}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {r.amountIn > 0 ? formatCurrency(r.amountIn, currency, currencySymbol) : '-'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    {r.amountOut > 0 ? formatCurrency(r.amountOut, currency, currencySymbol) : '-'}
                  </td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                    {r.accountName}
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                    {r.referenceNo || r.sourceDocument ? (
                      <span className="text-emerald-800 dark:text-emerald-400 font-semibold">
                        {r.referenceNo || r.sourceDocument.slice(0, 18)}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Unvouched</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
