import React, { useState } from 'react';
import { Plus, Printer, FileText, CheckCircle2, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { FinancialBook, Invoice, Bill, Customer } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface SubledgersViewProps {
  book: FinancialBook;
  computed: any;
  subledgerType: 'INVOICES' | 'BILLS' | 'CUSTOMERS';
  onAddInvoice: () => void;
  onAddBill: () => void;
  onAddCustomer: () => void;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const SubledgersView: React.FC<SubledgersViewProps> = ({
  book,
  computed,
  subledgerType,
  onAddInvoice,
  onAddBill,
  onAddCustomer,
  terminologyMode
}) => {
  const { detailedInvoices, detailedBills } = computed;
  const { currency, currencySymbol } = book.settings;
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    book.customers.length > 0 ? book.customers[0].id : ''
  );

  return (
    <div className="space-y-6">
      {/* INVOICES (ACCOUNTS RECEIVABLE) */}
      {subledgerType === 'INVOICES' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Accounts Receivable (Customer Invoices)</span>
                <span className="text-xs font-normal text-slate-500 font-mono">A/R Subledger</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {terminologyMode === 'PLAIN'
                  ? 'Track customer billing and payments. See who owes money and follow up on late accounts.'
                  : 'Trade accounts receivable subsidiary ledger matched to general ledger cash receipts.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print A/R Aging</span>
              </button>
              <button
                onClick={onAddInvoice}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Invoice Amount</th>
                    <th className="py-2.5 px-3 text-right">Collected</th>
                    <th className="py-2.5 px-3 text-right">Balance Due</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Aging Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detailedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No customer invoices recorded yet. Click "Create Invoice" above.
                      </td>
                    </tr>
                  ) : (
                    detailedInvoices.map((inv: any) => {
                      const customer = book.customers.find(c => c.id === inv.customerId);
                      return (
                        <tr key={inv.no} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {inv.no}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {customer ? customer.name : inv.customerId}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {formatDate(inv.date)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {formatDate(inv.dueDate)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(inv.amount, currency, currencySymbol)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                            {formatCurrency(inv.paidAmount, currency, currencySymbol)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(inv.balanceDue, currency, currencySymbol)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                                : inv.status === 'PARTIAL'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                                : inv.status === 'OVERDUE'
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200'
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-xs">
                            {inv.status === 'PAID' ? (
                              <span className="text-slate-400">Settled in full</span>
                            ) : inv.daysLate > 0 ? (
                              <span className="text-rose-600 font-semibold">{inv.daysLate} days past due</span>
                            ) : (
                              <span className="text-slate-500">Within terms</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BILLS (ACCOUNTS PAYABLE) */}
      {subledgerType === 'BILLS' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Accounts Payable (Supplier &amp; Vendor Bills)</span>
                <span className="text-xs font-normal text-slate-500 font-mono">A/P Subledger</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {terminologyMode === 'PLAIN'
                  ? 'Track bills you need to pay to suppliers, landlords, and service providers.'
                  : 'Trade accounts payable subsidiary ledger with due-date tracking and payment clearing.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print A/P Summary</span>
              </button>
              <button
                onClick={onAddBill}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Vendor Bill</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Bill #</th>
                    <th className="py-2.5 px-3">Vendor / Payee</th>
                    <th className="py-2.5 px-3">Expense Category</th>
                    <th className="py-2.5 px-3">Bill Date</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Bill Total</th>
                    <th className="py-2.5 px-3 text-right">Settled</th>
                    <th className="py-2.5 px-3 text-right">Balance Due</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detailedBills.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No vendor bills recorded yet. Click "Log Vendor Bill" above.
                      </td>
                    </tr>
                  ) : (
                    detailedBills.map((b: any) => (
                      <tr key={b.no} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {b.no}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {b.vendor}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {b.accountName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(b.date)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(b.dueDate)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(b.amount, currency, currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                          {formatCurrency(b.paidAmount, currency, currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(b.balanceDue, currency, currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'PAID'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                              : b.status === 'OVERDUE'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
