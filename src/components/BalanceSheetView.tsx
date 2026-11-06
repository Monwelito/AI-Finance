import React from 'react';
import { Printer, Scale, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';
import { FINANCIAL_GLOSSARY } from '../utils/plainEnglish';

interface BalanceSheetViewProps {
  book: FinancialBook;
  computed: any;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
  onUpdateAsOfDate: (newDate: string) => void;
}

export const BalanceSheetView: React.FC<BalanceSheetViewProps> = ({
  book,
  computed,
  terminologyMode,
  onUpdateAsOfDate
}) => {
  const { balanceSheet } = computed;
  const { currency, currencySymbol, businessName, taxRegistrationNumber } = book.settings;

  const isBalanced = balanceSheet.isBalanced;

  return (
    <div className="space-y-6">
      {/* Header and Print Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Balance Sheet (Statement of Financial Position)</span>
            <span className="text-xs font-normal text-slate-500 font-mono">GAAP ASC 210 / IAS 1</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'A complete list of everything your company owns on one side, and who financed it (debt or owner) on the other.'
              : 'Cumulative classified statement of assets, liabilities, and shareholder equity as of reporting date.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">As of Date:</label>
            <input
              type="date"
              value={book.settings.asOfDate}
              onChange={(e) => onUpdateAsOfDate(e.target.value)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official B/S</span>
          </button>
        </div>
      </div>

      {/* Balance Verification Invariant Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        isBalanced
          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
      }`}>
        <div className="flex items-center gap-3">
          {isBalanced ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold">
              {isBalanced
                ? 'Accounting Equation Balanced to the Penny'
                : `Balance Sheet Out of Balance by ${formatCurrency(Math.abs(balanceSheet.variance), currency, currencySymbol)}`}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Total Assets ({formatCurrency(balanceSheet.totalAssets, currency, currencySymbol)}) = Total Liabilities ({formatCurrency(balanceSheet.totalLiabilities, currency, currencySymbol)}) + Total Equity ({formatCurrency(balanceSheet.equity.total, currency, currencySymbol)}).
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs font-bold shrink-0">
          <span className="text-[11px] uppercase tracking-wider block text-slate-500">Status</span>
          <span className={isBalanced ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}>
            {isBalanced ? 'AUDIT VERIFIED' : 'ACTION REQUIRED'}
          </span>
        </div>
      </div>

      {/* Official 2-Column Balance Sheet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-6">
        {/* Left Column: ASSETS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Assets (What the Business Owns)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current and fixed economic resources
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">ASSETS</span>
          </div>

          <div className="space-y-4">
            {/* Current Assets */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>Current Assets (Short-Term Liquid Resources)</span>
                <span>Code 1000s</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Cash and Cash Equivalents
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Checking, operating savings, and cash register balance
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.currentAssets.cashAndEquivalents, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Trade Accounts Receivable (A/R)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Delivered customer orders awaiting incoming payment
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.currentAssets.accountsReceivable, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold">
                    <td className="py-2 px-2 text-slate-700 dark:text-slate-300">
                      Total Current Assets
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.currentAssets.total, currency, currencySymbol)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Non-Current Assets */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>Non-Current Assets (Durable Tools &amp; Machinery)</span>
                <span>Code 1500s</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Property, Plant and Equipment (CapEx)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Hardware, computers, vehicles, and long-term machinery
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.nonCurrentAssets.propertyAndEquipment, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold">
                    <td className="py-2 px-2 text-slate-700 dark:text-slate-300">
                      Total Non-Current Assets
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.nonCurrentAssets.total, currency, currencySymbol)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Assets Footer */}
            <div className="pt-4 border-t-2 border-slate-900 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>TOTAL ASSETS</span>
                <span className="font-mono text-base text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(balanceSheet.totalAssets, currency, currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: LIABILITIES & EQUITY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Liabilities &amp; Owner Equity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Who financed the assets (Debts vs Owner stake)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">LIAB + EQUITY</span>
          </div>

          <div className="space-y-4">
            {/* Current Liabilities */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>Current Liabilities (Due Within 1 Year)</span>
                <span>Code 2000s</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Trade Accounts Payable (A/P)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Invoices received from suppliers awaiting settlement
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.currentLiabilities.accountsPayable, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Accrued Taxes &amp; Estimated Provisions
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Corporate income tax &amp; VAT provisions payable to government
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.currentLiabilities.accruedExpensesAndTaxes, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold">
                    <td className="py-2 px-2 text-slate-700 dark:text-slate-300">
                      Total Current Liabilities
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.currentLiabilities.total, currency, currencySymbol)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Long-Term Debt */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>Non-Current Liabilities (Long-Term Loans)</span>
                <span>Code 2500s</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Long-Term Bank &amp; Commercial Borrowings
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Principal loan balances payable after 12 months
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.nonCurrentLiabilities.longTermLoans, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold">
                    <td className="py-2 px-2 text-slate-700 dark:text-slate-300">
                      Total Liabilities
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.totalLiabilities, currency, currencySymbol)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Owner's Equity */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>Shareholder / Owner's Equity</span>
                <span>Code 3000s</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Contributed Capital / Prior Opening Equity
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Owner's initial capital invested when records began
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.equity.openingContributedCapital, currency, currencySymbol)}
                    </td>
                  </tr>
                  {balanceSheet.equity.additionalCapitalPaidIn > 0 && (
                    <tr>
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Additional Capital Injections
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(balanceSheet.equity.additionalCapitalPaidIn, currency, currencySymbol)}
                      </td>
                    </tr>
                  )}
                  {balanceSheet.equity.ownerDistributions > 0 && (
                    <tr>
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Less: Owner Personal Withdrawals / Draws
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Money paid out to owner for personal use
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-mono font-semibold text-rose-600 whitespace-nowrap">
                        ({formatCurrency(balanceSheet.equity.ownerDistributions, currency, currencySymbol)})
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Retained Earnings / Operating Profit
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Cumulative net profit generated and reinvested in company
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(balanceSheet.equity.currentPeriodNetIncome, currency, currencySymbol)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold">
                    <td className="py-2 px-2 text-slate-700 dark:text-slate-300">
                      Total Owner's Equity
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(balanceSheet.equity.total, currency, currencySymbol)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Liabilities & Equity Footer */}
            <div className="pt-4 border-t-2 border-slate-900 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>TOTAL LIABILITIES &amp; EQUITY</span>
                <span className="font-mono text-base text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(balanceSheet.totalLiabilitiesAndEquity, currency, currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
