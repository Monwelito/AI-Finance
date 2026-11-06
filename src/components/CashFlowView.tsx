import React from 'react';
import { Printer, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface CashFlowViewProps {
  book: FinancialBook;
  computed: any;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const CashFlowView: React.FC<CashFlowViewProps> = ({
  book,
  computed,
  terminologyMode
}) => {
  const { cashFlow } = computed;
  const { currency, currencySymbol } = book.settings;

  const isReconciled = cashFlow.isReconciled;

  return (
    <div className="space-y-6">
      {/* Header and Print Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Statement of Cash Flows (Direct Method)</span>
            <span className="text-xs font-normal text-slate-500 font-mono">IAS 7 / GAAP ASC 230</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Tracks real bank and register cash moving in and out: operations, buying gear, and owner investments.'
              : 'Classified cash inflows and outflows from operating, investing, and financing activities.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Cash Flow</span>
        </button>
      </div>

      {/* Cash Reconciliation Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        isReconciled
          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
      }`}>
        <div className="flex items-center gap-3">
          {isReconciled ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold">
              {isReconciled
                ? 'Ending Cash Perfectly Reconciled with Balance Sheet Cash'
                : `Reconciliation Variance: ${formatCurrency(Math.abs(cashFlow.reconciliationVariance), currency, currencySymbol)}`}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Beginning Cash ({formatCurrency(cashFlow.beginningCash, currency, currencySymbol)}) + Net Cash Flow ({formatCurrency(cashFlow.netCashChange, currency, currencySymbol)}) = Ending Cash ({formatCurrency(cashFlow.endingCashCalculated, currency, currencySymbol)}).
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs font-bold shrink-0">
          <span className="text-[11px] uppercase tracking-wider block text-slate-500">Reconciliation</span>
          <span className={isReconciled ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600'}>
            {isReconciled ? 'RECONCILED' : 'DISCREPANCY'}
          </span>
        </div>
      </div>

      {/* Structured Cash Flow Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Method Cash Inflows and Outflows
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Period: {formatDate(book.settings.periodStart)} to {formatDate(book.settings.periodEnd)}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">Cash &amp; Bank Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <tbody>
              {/* Beginning Cash */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                <td className="py-2.5 px-3 text-slate-900 dark:text-white">
                  Cash and Cash Equivalents at Beginning of Period
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(cashFlow.beginningCash, currency, currencySymbol)}
                </td>
              </tr>

              {/* 1. Operating Activities */}
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td colSpan={2} className="py-2.5 px-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  1. Cash Flows from Operating Activities
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Cash Collections from Invoiced Customers</div>
                  <div className="text-[11px] text-slate-500">Payments received against trade accounts receivable</div>
                </td>
                <td className="py-2 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {formatCurrency(cashFlow.operatingActivities.collectionsFromCustomers, currency, currencySymbol)}
                </td>
              </tr>
              {cashFlow.operatingActivities.cashSales > 0 && (
                <tr>
                  <td className="py-2 px-3 pl-6">
                    <div className="font-semibold text-slate-900 dark:text-white">Direct Cash Sales Receipts</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(cashFlow.operatingActivities.cashSales, currency, currencySymbol)}
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-2 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Cash Payments to Suppliers for Materials &amp; Resale Inventory</div>
                  <div className="text-[11px] text-slate-500">Direct production supplies and vendor invoices paid</div>
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  ({formatCurrency(cashFlow.operatingActivities.paymentsToSuppliers, currency, currencySymbol)})
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Cash Payments for Operating Overhead (Rent, Wages, Utilities)</div>
                  <div className="text-[11px] text-slate-500">Day-to-day administrative and operating disbursements</div>
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  ({formatCurrency(cashFlow.operatingActivities.paymentsForOperatingExpenses, currency, currencySymbol)})
                </td>
              </tr>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 px-3 pl-6 text-slate-800 dark:text-slate-200">
                  Net Cash Generated by Operating Activities
                </td>
                <td className={`py-2 px-3 text-right font-mono whitespace-nowrap ${cashFlow.operatingActivities.netCashFromOperations >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {formatCurrency(cashFlow.operatingActivities.netCashFromOperations, currency, currencySymbol)}
                </td>
              </tr>

              {/* 2. Investing Activities */}
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td colSpan={2} className="py-2.5 px-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  2. Cash Flows from Investing Activities (CapEx)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Purchases of Property, Plant &amp; Equipment (Hardware &amp; Machinery)</div>
                  <div className="text-[11px] text-slate-500">Capital investments in long-term durable equipment</div>
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  {cashFlow.investingActivities.equipmentAndCapExPurchases > 0
                    ? `(${formatCurrency(cashFlow.investingActivities.equipmentAndCapExPurchases, currency, currencySymbol)})`
                    : '-'}
                </td>
              </tr>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 px-3 pl-6 text-slate-800 dark:text-slate-200">
                  Net Cash Used in Investing Activities
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  {formatCurrency(cashFlow.investingActivities.netCashFromInvesting, currency, currencySymbol)}
                </td>
              </tr>

              {/* 3. Financing Activities */}
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td colSpan={2} className="py-2.5 px-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  3. Cash Flows from Financing Activities
                </td>
              </tr>
              {cashFlow.financingActivities.loanProceedsReceived > 0 && (
                <tr>
                  <td className="py-2 px-3 pl-6">
                    <div className="font-semibold text-slate-900 dark:text-white">Proceeds from Bank Borrowings &amp; Commercial Loans</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(cashFlow.financingActivities.loanProceedsReceived, currency, currencySymbol)}
                  </td>
                </tr>
              )}
              {cashFlow.financingActivities.loanPrincipalRepaid > 0 && (
                <tr>
                  <td className="py-2 px-3 pl-6">
                    <div className="font-semibold text-slate-900 dark:text-white">Repayment of Commercial Loan Principal</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                    ({formatCurrency(cashFlow.financingActivities.loanPrincipalRepaid, currency, currencySymbol)})
                  </td>
                </tr>
              )}
              {cashFlow.financingActivities.ownerCapitalInjections > 0 && (
                <tr>
                  <td className="py-2 px-3 pl-6">
                    <div className="font-semibold text-slate-900 dark:text-white">Owner Capital Injections / Paid-in Equity</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(cashFlow.financingActivities.ownerCapitalInjections, currency, currencySymbol)}
                  </td>
                </tr>
              )}
              {cashFlow.financingActivities.ownerDrawsAndDividends > 0 && (
                <tr>
                  <td className="py-2 px-3 pl-6">
                    <div className="font-semibold text-slate-900 dark:text-white">Owner Personal Distributions &amp; Drawings</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-rose-600 whitespace-nowrap">
                    ({formatCurrency(cashFlow.financingActivities.ownerDrawsAndDividends, currency, currencySymbol)})
                  </td>
                </tr>
              )}
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 px-3 pl-6 text-slate-800 dark:text-slate-200">
                  Net Cash Flows from Financing Activities
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  {formatCurrency(cashFlow.financingActivities.netCashFromFinancing, currency, currencySymbol)}
                </td>
              </tr>

              {/* Net Change and Ending Cash */}
              <tr className="bg-emerald-50 dark:bg-emerald-950/40 font-bold border-t-2 border-b border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100">
                <td className="py-2.5 px-3">
                  NET INCREASE / (DECREASE) IN CASH AND CASH EQUIVALENTS
                </td>
                <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap font-bold">
                  {formatCurrency(cashFlow.netCashChange, currency, currencySymbol)}
                </td>
              </tr>

              <tr className="bg-slate-900 text-white font-bold border-b-4 border-double border-slate-950">
                <td className="py-3 px-3 text-sm">
                  CASH AND CASH EQUIVALENTS AT END OF PERIOD
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm text-emerald-400 whitespace-nowrap">
                  {formatCurrency(cashFlow.endingCashCalculated, currency, currencySymbol)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
