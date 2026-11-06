import React, { useState } from 'react';
import {
  Download,
  FileCode,
  Printer,
  FileSpreadsheet,
  FileCheck,
  Calendar,
  Check
} from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator';

interface DownloadCenterProps {
  book: FinancialBook;
  computed: any;
  onOpenStandaloneModal: () => void;
  onNavigate: (tab: string) => void;
}

export const DownloadCenter: React.FC<DownloadCenterProps> = ({
  book,
  onOpenStandaloneModal,
  onNavigate
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadIndexHtml = () => {
    const htmlContent = generateStandaloneHtml(book);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
    setDownloadSuccess('Standalone index.html ready for GitHub upload!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['Date', 'Entity', 'Description', 'Amount In', 'Amount Out', 'Account Code', 'Account Name', 'Reference #', 'Source Document', 'Tax Deductible', 'Approved'];
    const rows = book.rows.map(r => [
      r.date,
      `"${(r.entity || '').replace(/"/g, '""')}"`,
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.amountIn || 0,
      r.amountOut || 0,
      r.accountCode,
      `"${(r.accountName || '').replace(/"/g, '""')}"`,
      r.referenceNo || '',
      `"${(r.sourceDocument || '').replace(/"/g, '""')}"`,
      r.taxDeductible ? 'YES' : 'NO',
      r.approved ? 'YES' : 'NO'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `general-ledger-${(book.settings.businessName || 'export').toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
    setDownloadSuccess('General Ledger CSV downloaded!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportJson = () => {
    const jsonContent = JSON.stringify(book, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-backup-${(book.settings.businessName || 'export').toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
    setDownloadSuccess('Full fiscal JSON backup downloaded!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Instant Download &amp; Compliance Export Center</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
              Auto-Compiled &amp; Ready
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            All statements, tax returns, and audit certifications update automatically with every posted transaction.
          </p>
        </div>

        {downloadSuccess && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{downloadSuccess}</span>
          </span>
        )}
      </div>

      {/* Grid of Ready-to-Download Artifacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Item 1: Standalone GitHub HTML */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <FileCode className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">
                GITHUB PAGES
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Standalone index.html
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Complete offline web app containing all reports &amp; active data. Drop into GitHub root.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
            <button
              onClick={handleDownloadIndexHtml}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </button>
            <button
              onClick={onOpenStandaloneModal}
              className="text-[11px] text-emerald-800 dark:text-emerald-300 hover:underline font-semibold"
            >
              Guide
            </button>
          </div>
        </div>

        {/* Item 2: Annual Audit Dossier */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">
                ANNUAL AUDIT
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Annual Audit Dossier (PDF)
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Official annual package with notes to financial statements, accounting disclosures, and sign-offs.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
            <button
              onClick={() => { onNavigate('annual'); setTimeout(() => window.print(), 200); }}
              className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={() => onNavigate('annual')}
              className="text-[11px] text-emerald-800 dark:text-emerald-300 hover:underline font-semibold"
            >
              View
            </button>
          </div>
        </div>

        {/* Item 3: Tax Authority Return Schedule */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <FileCheck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">
                TAX &amp; VAT
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Tax Authority Schedule (PDF)
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Form 1120 income tax schedule, allowable deductions, and VAT reconciliation report.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
            <button
              onClick={() => { onNavigate('tax'); setTimeout(() => window.print(), 200); }}
              className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Print Return</span>
            </button>
            <button
              onClick={() => onNavigate('tax')}
              className="text-[11px] text-emerald-800 dark:text-emerald-300 hover:underline font-semibold"
            >
              View
            </button>
          </div>
        </div>

        {/* Item 4: General Ledger CSV & Data Backup */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">
                SPREADSHEET
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Ledger Spreadsheet (CSV)
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Complete chronological journal with accounts, references, and verification timestamps.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="text-[11px] text-emerald-800 dark:text-emerald-300 hover:underline font-semibold"
            >
              JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
