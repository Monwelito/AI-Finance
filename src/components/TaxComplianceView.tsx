import React from 'react';
import { Printer, FileCheck, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface TaxComplianceViewProps {
  book: FinancialBook;
  computed: any;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const TaxComplianceView: React.FC<TaxComplianceViewProps> = ({
  book,
  computed,
  terminologyMode
}) => {
  const { taxCompliance, incomeStatement } = computed;
  const { currency, currencySymbol, businessName, taxRegistrationNumber, corporateTaxRate, vatSalesTaxRate } = book.settings;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Tax Authority Schedules &amp; VAT/Sales Tax Report</span>
            <span className="text-xs font-normal text-slate-500 font-mono">Tax Code Statutory Reporting</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Form-ready numbers for government tax returns: how much income is taxable, allowable deductions, and sales tax to remit.'
              : 'Regulatory tax computation schedule, deductible expense allocation, and value-added tax reconciliation.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Tax Schedule</span>
        </button>
      </div>

      {/* Taxpayer Entity Metadata Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 text-white shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registered Entity</span>
          <span className="text-sm font-bold text-white truncate block mt-0.5">{businessName}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Taxpayer ID (TIN / EIN)</span>
          <span className="text-sm font-mono font-bold text-emerald-400 block mt-0.5">
            {taxRegistrationNumber || 'PENDING ASSIGNMENT'}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Applicable Tax Rates</span>
          <span className="text-sm font-mono text-slate-200 block mt-0.5">
            {Math.round(corporateTaxRate * 100)}% Corp · {Math.round(vatSalesTaxRate * 100)}% VAT
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reporting Basis</span>
          <span className="text-sm font-semibold text-emerald-400 block mt-0.5">Accrual Method (Audit-Ready)</span>
        </div>
      </div>

      {/* 2 Tax Sections: Corporate Income Tax & Value Added Tax */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Corporate Income Tax Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Corporate Income Tax Computation
              </h2>
              <p className="text-xs text-slate-500">Taxable Net Operating Income Schedule</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">FORM 1120 REF</span>
          </div>

          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white">Line 1: Gross Commercial Billed Revenue</div>
                  <div className="text-[11px] text-slate-500">Total taxable sales before deductions</div>
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(taxCompliance.grossTaxableSales, currency, currencySymbol)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white">Line 2: Allowable Tax-Deductible Business Expenses</div>
                  <div className="text-[11px] text-slate-500">Ordinary and necessary expenses (COGS, Rent, Utilities, Wages)</div>
                </td>
                <td className="py-2.5 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  ({formatCurrency(taxCompliance.allowableDeductions, currency, currencySymbol)})
                </td>
              </tr>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold">
                <td className="py-2 px-2 text-slate-800 dark:text-slate-200">
                  Line 3: Net Taxable Income Before Exemptions
                </td>
                <td className="py-2 px-2 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(taxCompliance.taxableNetIncome, currency, currencySymbol)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white">Non-Deductible Personal Draws &amp; Distributions</div>
                  <div className="text-[11px] text-slate-500">Owner compensation drawings (not deductible under tax code)</div>
                </td>
                <td className="py-2.5 text-right font-mono text-slate-500 whitespace-nowrap">
                  {formatCurrency(taxCompliance.nonDeductibleExpenses, currency, currencySymbol)}
                </td>
              </tr>
              <tr className="bg-emerald-950/80 text-white font-bold border-t border-emerald-700/50">
                <td className="py-3 px-3 text-sm">
                  Estimated Corporate Income Tax Provision ({Math.round(corporateTaxRate * 100)}%)
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm text-emerald-300 whitespace-nowrap">
                  {formatCurrency(taxCompliance.estimatedTaxPayable, currency, currencySymbol)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: VAT / Sales Tax Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Value-Added Tax (VAT) / Sales Tax Reconciliation
              </h2>
              <p className="text-xs text-slate-500">Output Tax Collected vs Input Tax Creditable</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">VAT SCHEDULE</span>
          </div>

          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white">Gross Taxable Sales Base (VAT Applicable)</div>
                  <div className="text-[11px] text-slate-500">Commercial revenues subject to indirect sales tax</div>
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(taxCompliance.vatSchedule.vatApplicableSales, currency, currencySymbol)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white">Output Tax Collected from Customers ({Math.round(vatSalesTaxRate * 100)}%)</div>
                  <div className="text-[11px] text-slate-500">Tax held in trust for remittance to the government</div>
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {formatCurrency(taxCompliance.vatSchedule.outputVatCollected, currency, currencySymbol)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white">Less: Input Tax Credits Paid on Eligible Purchases</div>
                  <div className="text-[11px] text-slate-500">VAT paid to accredited suppliers with tax invoice receipts</div>
                </td>
                <td className="py-2.5 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  ({formatCurrency(taxCompliance.vatSchedule.inputVatCreditable, currency, currencySymbol)})
                </td>
              </tr>
              <tr className="bg-slate-900 text-white font-bold">
                <td className="py-3 px-3 text-sm">
                  Net VAT / Sales Tax Payable to Government
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm text-emerald-300 whitespace-nowrap">
                  {formatCurrency(taxCompliance.vatSchedule.netVatPayable, currency, currencySymbol)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Authority Statutory Filing Calendar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Statutory Tax Filing Deadlines &amp; Audit Requirements
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Government regulatory calendar for compliance with revenue authorities
        </p>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Statutory Form</th>
                <th className="py-2.5 px-3">Description &amp; Regulatory Purpose</th>
                <th className="py-2.5 px-3">Statutory Due Date</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {taxCompliance.filingDeadlines.map((d: any) => (
                <tr key={d.formName} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {d.formName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {d.description}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {d.dueDate}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {d.status}
                    </span>
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
