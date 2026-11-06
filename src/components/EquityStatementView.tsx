import React from 'react';
import { Printer, Scale, Users } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface EquityStatementViewProps {
  book: FinancialBook;
  computed: any;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const EquityStatementView: React.FC<EquityStatementViewProps> = ({
  book,
  computed,
  terminologyMode
}) => {
  const { balanceSheet, incomeStatement } = computed;
  const { currency, currencySymbol, businessName, recordsStartDate } = book.settings;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Statement of Changes in Equity</span>
            <span className="text-xs font-normal text-slate-500 font-mono">IAS 1 / GAAP ASC 505</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Shows the owner\'s true financial stake: what you invested, what you drew out, and accumulated profit.'
              : 'Reconciliation of opening to closing equity, paid-in capital, distributions, and retained earnings.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Equity Statement</span>
        </button>
      </div>

      {/* Equity Statement Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-4xl">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Statement of Owner &amp; Shareholder Equity
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              From Records Start ({formatDate(recordsStartDate)}) to {formatDate(book.settings.asOfDate)}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">Equity Subledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Equity Component</th>
                <th className="py-2.5 px-3 text-right">Contributed Capital</th>
                <th className="py-2.5 px-3 text-right">Retained Earnings</th>
                <th className="py-2.5 px-3 text-right">Total Equity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">Balance at Commencement of Records</div>
                  <div className="text-[11px] text-slate-500">Initial proprietor investment and opening net worth</div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.openingContributedCapital, currency, currencySymbol)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                  $0.00
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.openingContributedCapital, currency, currencySymbol)}
                </td>
              </tr>

              {balanceSheet.equity.additionalCapitalPaidIn > 0 && (
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">Additional Capital Injections</div>
                    <div className="text-[11px] text-slate-500">Personal funds deposited to finance operations</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(balanceSheet.equity.additionalCapitalPaidIn, currency, currencySymbol)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">-</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap">
                    {formatCurrency(balanceSheet.equity.additionalCapitalPaidIn, currency, currencySymbol)}
                  </td>
                </tr>
              )}

              {balanceSheet.equity.ownerDistributions > 0 && (
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">Less: Owner Personal Drawings / Dividends</div>
                    <div className="text-[11px] text-slate-500">Proprietor distributions taken out for personal use</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-rose-600 whitespace-nowrap">
                    ({formatCurrency(balanceSheet.equity.ownerDistributions, currency, currencySymbol)})
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">-</td>
                  <td className="py-3 px-3 text-right font-mono text-rose-600 font-semibold whitespace-nowrap">
                    ({formatCurrency(balanceSheet.equity.ownerDistributions, currency, currencySymbol)})
                  </td>
                </tr>
              )}

              <tr>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">Net Operating Earnings for the Period</div>
                  <div className="text-[11px] text-slate-500">Cumulative operating profits generated by commercial business activities</div>
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">-</td>
                <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.currentPeriodNetIncome, currency, currencySymbol)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.currentPeriodNetIncome, currency, currencySymbol)}
                </td>
              </tr>

              <tr className="bg-slate-900 text-white font-bold border-t-2 border-b-4 border-double border-slate-950">
                <td className="py-3.5 px-3 text-sm">
                  TOTAL OWNER'S EQUITY AS OF {formatDate(book.settings.asOfDate)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-xs text-slate-300 whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.openingContributedCapital + balanceSheet.equity.additionalCapitalPaidIn - balanceSheet.equity.ownerDistributions, currency, currencySymbol)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-xs text-slate-300 whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.currentPeriodNetIncome, currency, currencySymbol)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-sm text-emerald-300 whitespace-nowrap">
                  {formatCurrency(balanceSheet.equity.total, currency, currencySymbol)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
