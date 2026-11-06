import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  FileCheck2,
  FileBadge,
  Lock
} from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/financeEngine';

interface AuditSuiteViewProps {
  book: FinancialBook;
  computed: any;
  onRefreshAudit: () => void;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
}

export const AuditSuiteView: React.FC<AuditSuiteViewProps> = ({
  book,
  computed,
  onRefreshAudit,
  terminologyMode
}) => {
  const { auditSuite, balanceSheet } = computed;
  const { currency, currencySymbol, businessName, taxRegistrationNumber, auditorName, certifiedSignatory } = book.settings;
  const [isScanning, setIsScanning] = useState(false);

  const handleRunAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      onRefreshAudit();
      setIsScanning(false);
    }, 600);
  };

  const isClean = auditSuite.overallAuditOpinion === 'UNQUALIFIED';

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Automated Audit &amp; Regulatory Compliance Suite</span>
            <span className="text-xs font-normal text-slate-500 font-mono">ISA 700 / GAAP Standards</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {terminologyMode === 'PLAIN'
              ? 'Automatic check engine that tests your books for accounting errors, missing receipts, and duplicate payments before tax filing.'
              : 'Continuous automated compliance verification against statutory auditing standards and double-entry invariants.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAudit}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-emerald-500 shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-500' : ''}`} />
            <span>{isScanning ? 'Scanning Ledger...' : 'Run Audit Prober'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Auditor Opinion Card */}
      <div className={`p-6 rounded-2xl border ${
        isClean
          ? 'bg-gradient-to-br from-emerald-500/10 via-white to-emerald-600/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/30 border-emerald-300 dark:border-emerald-800'
          : 'bg-gradient-to-br from-amber-500/10 via-white to-rose-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-rose-950/30 border-amber-300 dark:border-amber-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isClean ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Independent Auditor's Automated Certification
              </span>
            </div>
            <h2 className={`text-xl font-bold font-display ${isClean ? 'text-emerald-950 dark:text-emerald-200' : 'text-amber-950 dark:text-amber-200'}`}>
              {auditSuite.overallAuditOpinion === 'UNQUALIFIED'
                ? 'Unqualified Opinion — Clean Financial Records'
                : auditSuite.overallAuditOpinion === 'QUALIFIED'
                ? 'Qualified Opinion — Action Required on Flagged Items'
                : 'Adverse Opinion — Material Discrepancies Detected'}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {auditSuite.opinionText}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span>Auditor: <strong className="text-slate-900 dark:text-white">{auditorName}</strong></span>
              <span>·</span>
              <span>Verification Hash: <strong className="text-emerald-700 dark:text-emerald-400">{auditSuite.auditorVerificationHash}</strong></span>
              <span>·</span>
              <span>Status: <strong className="text-emerald-600">VERIFIED ACCRUAL</strong></span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center shrink-0 min-w-[160px] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Compliance Score
            </span>
            <span className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block my-1">
              {auditSuite.complianceScorePct}%
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {auditSuite.checks.filter((c: any) => c.severity === 'PASS').length} of {auditSuite.checks.length} Tests Passed
            </span>
          </div>
        </div>
      </div>

      {/* 8 Compliance Checks Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Standard Regulatory Invariant Checks
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated automatically against GAAP ASC, ISA, and Tax Authority audit rules
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">8 OF 8 TESTS</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {auditSuite.checks.map((check: any) => {
            const isPass = check.severity === 'PASS';
            const isWarn = check.severity === 'WARNING';
            return (
              <div key={check.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isPass ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{check.id}</span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">{check.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {check.details}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span>Standard: <strong className="text-slate-700 dark:text-slate-400">{check.standardReference}</strong></span>
                      <span>·</span>
                      <span>Guidance: {check.remedyAction}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isPass
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : isWarn
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {check.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Signatory Certification Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Auditor &amp; Executive Sign-Off Certificate
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Management Representation &amp; Controller Sign-off:
            </p>
            <div className="h-12 border-b border-dashed border-slate-300 dark:border-slate-700 flex items-end pb-1">
              <span className="font-display italic text-sm text-emerald-800 dark:text-emerald-300 font-semibold">
                {certifiedSignatory}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Certified on {formatDate(book.settings.asOfDate)} · Responsible for Internal Financial Controls
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Independent CPA / Regulatory Auditor Verification:
            </p>
            <div className="h-12 border-b border-dashed border-slate-300 dark:border-slate-700 flex items-end pb-1">
              <span className="font-display italic text-sm text-emerald-800 dark:text-emerald-300 font-semibold">
                {auditorName}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Automated Checksum Hash: {auditSuite.auditorVerificationHash}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
