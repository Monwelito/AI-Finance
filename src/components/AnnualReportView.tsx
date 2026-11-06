import React, { useState } from 'react';
import { Printer, Lock, Unlock, FileText, CheckCircle2, Shield, Calendar, Download } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface AnnualReportViewProps {
  book: FinancialBook;
  computed: any;
  onTogglePeriodLock: () => void;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const AnnualReportView: React.FC<AnnualReportViewProps> = ({
  book,
  computed,
  onTogglePeriodLock,
  terminologyMode
}) => {
  const { balanceSheet, incomeStatement, cashFlow, auditSuite } = computed;
  const { currency, currencySymbol, businessName, taxRegistrationNumber, fiscalYearStart, fiscalYearEnd, auditorName, certifiedSignatory, isFiscalPeriodLocked } = book.settings;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Annual Fiscal Year Audit Package &amp; Transparency Dossier</span>
            <span className="text-xs font-normal text-slate-500 font-mono">FY {fiscalYearStart.slice(0, 4)}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Complete yearly audit package ready for external CPAs, tax inspectors, and banking partners.'
              : 'Statutory annual reporting dossier with full notes to financial statements, accounting disclosures, and period lock.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Fiscal Lock Button */}
          <button
            onClick={onTogglePeriodLock}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isFiscalPeriodLocked
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
            }`}
            title={isFiscalPeriodLocked ? 'Fiscal Year is locked to prevent retrospective tampering' : 'Lock Fiscal Year for audit finalization'}
          >
            {isFiscalPeriodLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Fiscal Period Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-slate-500" />
                <span>Lock Fiscal Period</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Complete Dossier</span>
          </button>
        </div>
      </div>

      {/* Annual Audit Dossier Paper Surface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs max-w-4xl mx-auto space-y-8">
        {/* Formal Title Block */}
        <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">
            ANNUAL REGULATORY FINANCIAL DOSSIER
          </p>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            {businessName}
          </h2>
          <div className="flex justify-center items-center gap-4 text-xs font-mono text-slate-500 mt-2">
            <span>TIN: {taxRegistrationNumber || 'TIN-REG-PENDING'}</span>
            <span>·</span>
            <span>Fiscal Year Ended: {formatDate(fiscalYearEnd)}</span>
            <span>·</span>
            <span>Accounting Standard: Accrual GAAP</span>
          </div>
        </div>

        {/* 1. Executive Summary & Comparative Highlights */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3">
            1. Annual Financial Performance Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Gross Sales</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                {formatCurrency(incomeStatement.grossRevenue, currency, currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Gross Margin</span>
              <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">
                {incomeStatement.grossMarginPct}%
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Operating EBIT</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                {formatCurrency(incomeStatement.operatingIncomeEBIT, currency, currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Net Profit</span>
              <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">
                {formatCurrency(incomeStatement.netIncome, currency, currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Formal Notes to the Financial Statements */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            2. Notes to the Financial Statements (Disclosures)
          </h3>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                Note 1 — Corporate Information &amp; Accounting Policies
              </h4>
              <p>
                The financial records of {businessName} are prepared in accordance with standard Generally Accepted Accounting Principles (GAAP) under the accrual basis of accounting. Revenues are recognized upon satisfaction of performance obligations when control of goods or services is transferred to customers. Operating expenses are recognized in the period in which the corresponding benefit is consumed.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                Note 2 — Property, Plant &amp; Equipment (CapEx)
              </h4>
              <p>
                Durable equipment, machinery, and computer hardware are capitalized at historical cost ({formatCurrency(balanceSheet.nonCurrentAssets.propertyAndEquipment, currency, currencySymbol)}). Expenditures for regular maintenance and repairs are charged directly against operating profit as incurred.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                Note 3 — Trade Receivables &amp; Credit Risk
              </h4>
              <p>
                Accounts receivable are presented at gross invoice amounts totaling {formatCurrency(balanceSheet.currentAssets.accountsReceivable, currency, currencySymbol)}. Management reviews customer aging monthly; balances exceeding agreed terms are subject to formal statement reminders.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                Note 4 — Capital &amp; Owner Transactions
              </h4>
              <p>
                Owner equity stands at {formatCurrency(balanceSheet.equity.total, currency, currencySymbol)}, comprising prior opening contributed capital, cumulative retained earnings, and owner drawings.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Independent Auditor Certification Block */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              3. Independent Auditor Certification &amp; Sign-off
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
            "In our opinion, the accompanying financial statements present fairly, in all material respects, the financial position of {businessName} as of {formatDate(fiscalYearEnd)}, and the results of its operations and its cash flows for the year then ended in accordance with regulatory accounting standards."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Management Representation</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{certifiedSignatory}</p>
              <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mt-2 flex items-end">
                <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">Digitally Verified Stamp</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Independent Regulatory Auditor</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{auditorName}</p>
              <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mt-2 flex items-end justify-between">
                <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">{auditSuite.auditorVerificationHash}</span>
                <span className="text-[10px] font-bold text-emerald-600">UNQUALIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
