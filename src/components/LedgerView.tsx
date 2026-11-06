import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { FinancialBook, LedgerRow } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface LedgerViewProps {
  book: FinancialBook;
  onOpenNewTransaction: () => void;
  onEditTransaction: (row: LedgerRow) => void;
  onDeleteTransaction: (id: string) => void;
  onToggleApproval: (id: string) => void;
  onApproveAllValid: () => void;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  book,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onToggleApproval,
  onApproveAllValid,
  terminologyMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterUnapprovedOnly, setFilterUnapprovedOnly] = useState(false);

  const { currency, currencySymbol } = book.settings;

  // Extract available months
  const availableMonths = Array.from(
    new Set(book.rows.map(r => r.date ? r.date.slice(0, 7) : '').filter(Boolean))
  ).sort().reverse();

  // Filter rows
  const filteredRows = book.rows.filter(r => {
    if (filterUnapprovedOnly && r.approved) return false;
    if (filterMonth && (!r.date || !r.date.startsWith(filterMonth))) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = (r.entity || '').toLowerCase().includes(q) ||
                    (r.description || '').toLowerCase().includes(q) ||
                    (r.accountName || '').toLowerCase().includes(q) ||
                    (r.referenceNo || '').toLowerCase().includes(q) ||
                    (r.sourceDocument || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  let totalInflow = 0;
  let totalOutflow = 0;
  filteredRows.forEach(r => {
    totalInflow += Number(r.amountIn || 0);
    totalOutflow += Number(r.amountOut || 0);
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>General Ledger (Daily Financial Records)</span>
            <span className="text-xs font-normal text-slate-500 font-mono">Double-Entry Source</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Every single dollar coming in or going out is recorded here with proof of receipt.'
              : 'Chronological transaction register mapped to standard Chart of Accounts.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onApproveAllValid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approve Verified</span>
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payee, description, invoice#, account..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="">All Months</option>
          {availableMonths.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterUnapprovedOnly}
            onChange={(e) => setFilterUnapprovedOnly(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Pending Approval Only</span>
        </label>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Entity / Counterparty</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Inflow ($)</th>
                <th className="py-2.5 px-3 text-right">Outflow ($)</th>
                <th className="py-2.5 px-3">Standard Account</th>
                <th className="py-2.5 px-3">Source Proof</th>
                <th className="py-2.5 px-3 text-center">Approved</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(r.date)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {r.entity}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {r.description}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {r.amountIn > 0 ? formatCurrency(r.amountIn, currency, currencySymbol) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.amountOut > 0 ? formatCurrency(r.amountOut, currency, currencySymbol) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      <div>{r.accountName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Code {r.accountCode}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {r.referenceNo ? (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">{r.referenceNo}</span>
                      ) : null}
                      <span className="text-[10px] text-slate-400 truncate block max-w-[120px]">{r.sourceDocument || 'No document'}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.approved}
                        onChange={() => onToggleApproval(r.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title={r.approved ? 'Approved by Supervisor' : 'Click to approve row'}
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onEditTransaction(r)}
                        className="p-1 text-slate-500 hover:text-emerald-600 transition-colors"
                        title="Edit Entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(r.id)}
                        className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredRows.length > 0 && (
              <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3">
                    Total of {filteredRows.length} Entry(ies)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(totalInflow, currency, currencySymbol)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {formatCurrency(totalOutflow, currency, currencySymbol)}
                  </td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
