import React from 'react';
import { Printer, TrendingUp, HelpCircle } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface IncomeStatementViewProps {
  book: FinancialBook;
  computed: any;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
  onUpdatePeriod: (start: string, end: string) => void;
}

export const IncomeStatementView: React.FC<IncomeStatementViewProps> = ({
  book,
  computed,
  terminologyMode,
  onUpdatePeriod
}) => {
  const { incomeStatement } = computed;
  const { currency, currencySymbol, businessName } = book.settings;

  const setThisMonth = () => {
    const today = new Date().toISOString().slice(0, 10);
    const start = today.slice(0, 8) + '01';
    onUpdatePeriod(start, today);
  };

  const setYearToDate = () => {
    const today = new Date().toISOString().slice(0, 10);
    const start = `${today.slice(0, 4)}-01-01`;
    onUpdatePeriod(start, today);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Income Statement (Profit &amp; Loss / Comprehensive Income)</span>
            <span className="text-xs font-normal text-slate-500 font-mono">IAS 1 / GAAP ASC 225</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Measures money earned minus direct costs and daily overhead to show true net take-home profit.'
              : 'Multi-step statement of operating revenue, cost of sales, SG&A overhead, and net earnings.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-slate-600 dark:text-slate-400">From:</label>
            <input
              type="date"
              value={book.settings.periodStart}
              onChange={(e) => onUpdatePeriod(e.target.value, book.settings.periodEnd)}
              className="px-2 py-1 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <label className="font-semibold text-slate-600 dark:text-slate-400">To:</label>
            <input
              type="date"
              value={book.settings.periodEnd}
              onChange={(e) => onUpdatePeriod(book.settings.periodStart, e.target.value)}
              className="px-2 py-1 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={setThisMonth}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            This Month
          </button>
          <button
            onClick={setYearToDate}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            YTD
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print P&amp;L</span>
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gross Sales Revenue</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(incomeStatement.grossRevenue, currency, currencySymbol)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Invoiced &amp; counter receipts</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gross Profit Margin</span>
          <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
            {incomeStatement.grossMarginPct}%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">After direct production costs</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Net Income Margin</span>
          <span className={`text-xl font-bold font-mono mt-1 block ${incomeStatement.netIncome >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
            {incomeStatement.netMarginPct}%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">True bottom-line profitability</span>
        </div>
      </div>

      {/* Formal Multi-Step P&L Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Statement of Profit or Loss and Other Comprehensive Income
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              For Period: {formatDate(book.settings.periodStart)} to {formatDate(book.settings.periodEnd)}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">Amounts in {currency}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Financial Line Item</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* REVENUE */}
              <tr className="bg-slate-50/30 dark:bg-slate-800/20 font-bold">
                <td colSpan={3} className="py-2 px-3 text-slate-700 dark:text-slate-300">
                  1. REVENUE FROM CONTRACTS &amp; COMMERCIAL SALES
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Commercial Invoiced &amp; Direct Sales</div>
                  <div className="text-[11px] text-slate-500">Gross billings for goods delivered and services rendered</div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(incomeStatement.grossRevenue, currency, currencySymbol)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                  100.0%
                </td>
              </tr>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 px-3 pl-6 text-slate-800 dark:text-slate-200">
                  Net Commercial Revenue
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(incomeStatement.netRevenue, currency, currencySymbol)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-500">100.0%</td>
              </tr>

              {/* COGS */}
              <tr className="bg-slate-50/30 dark:bg-slate-800/20 font-bold">
                <td colSpan={3} className="py-2 px-3 text-slate-700 dark:text-slate-300">
                  2. COST OF GOODS SOLD (DIRECT PRODUCTION COSTS)
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Direct Raw Materials, Consumables &amp; Resale Inventory</div>
                  <div className="text-[11px] text-slate-500">Materials and direct supplier costs tied directly to product sales</div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                  ({formatCurrency(incomeStatement.costOfGoodsSold, currency, currencySymbol)})
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                  {incomeStatement.grossRevenue > 0 ? ((incomeStatement.costOfGoodsSold / incomeStatement.grossRevenue) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr className="bg-emerald-50/50 dark:bg-emerald-950/30 font-bold border-t border-b border-emerald-200 dark:border-emerald-800">
                <td className="py-2.5 px-3 text-emerald-900 dark:text-emerald-200">
                  GROSS PROFIT (GROSS MARGIN)
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800 dark:text-emerald-300 font-bold whitespace-nowrap">
                  {formatCurrency(incomeStatement.grossProfit, currency, currencySymbol)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  {incomeStatement.grossMarginPct}%
                </td>
              </tr>

              {/* OPERATING EXPENSES (SG&A) */}
              <tr className="bg-slate-50/30 dark:bg-slate-800/20 font-bold">
                <td colSpan={3} className="py-2 px-3 text-slate-700 dark:text-slate-300">
                  3. OPERATING OVERHEAD EXPENSES (SG&amp;A)
                </td>
              </tr>
              {incomeStatement.operatingExpenses.map((exp: any) => (
                <tr key={exp.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 pl-6">
                    <div className="font-semibold text-slate-900 dark:text-white">{exp.name}</div>
                    <div className="text-[11px] text-slate-500">{exp.plainEnglish} · Code {exp.code}</div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-slate-200 whitespace-nowrap">
                    {formatCurrency(exp.amount, currency, currencySymbol)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-500">
                    {exp.pctOfRevenue.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                  Total Operating Expenses
                </td>
                <td className="py-2 px-3 text-right font-mono text-rose-700 dark:text-rose-400 whitespace-nowrap">
                  ({formatCurrency(incomeStatement.totalOperatingExpenses, currency, currencySymbol)})
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-500">
                  {incomeStatement.grossRevenue > 0 ? ((incomeStatement.totalOperatingExpenses / incomeStatement.grossRevenue) * 100).toFixed(1) : 0}%
                </td>
              </tr>

              {/* OPERATING INCOME (EBIT) */}
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 font-bold border-t border-b border-slate-300 dark:border-slate-700">
                <td className="py-2.5 px-3 text-slate-900 dark:text-white">
                  OPERATING INCOME (EBITDA / EBIT)
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(incomeStatement.operatingIncomeEBIT, currency, currencySymbol)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                  {incomeStatement.operatingMarginPct}%
                </td>
              </tr>

              {/* TAX PROVISION */}
              <tr>
                <td className="py-2.5 px-3 pl-6">
                  <div className="font-semibold text-slate-900 dark:text-white">Estimated Provision for Corporate Income Tax</div>
                  <div className="text-[11px] text-slate-500">Calculated at statutory corporate tax rate ({Math.round(book.settings.corporateTaxRate * 100)}%)</div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  ({formatCurrency(incomeStatement.estimatedTaxProvision, currency, currencySymbol)})
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                  {incomeStatement.grossRevenue > 0 ? ((incomeStatement.estimatedTaxProvision / incomeStatement.grossRevenue) * 100).toFixed(1) : 0}%
                </td>
              </tr>

              {/* NET INCOME */}
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-b-4 border-double border-slate-950">
                <td className="py-3 px-3 text-sm">
                  NET PROFIT (NET INCOME FOR THE PERIOD)
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm text-emerald-400 whitespace-nowrap">
                  {formatCurrency(incomeStatement.netIncome, currency, currencySymbol)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-xs text-slate-300">
                  {incomeStatement.netMarginPct}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
