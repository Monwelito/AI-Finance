import React, { useState } from 'react';
import { X, Download, Github, Check, Copy, ExternalLink, FileCode, ShieldCheck } from 'lucide-react';
import { FinancialBook } from '../types/finance';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: FinancialBook;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
  book
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneHtml(book);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html'; // Ideal for dropping directly into GitHub repository root
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
  };

  const handleDownloadNamedHtml = () => {
    const htmlContent = generateStandaloneHtml(book);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-books-${(book.settings.businessName || 'export').toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
  };

  const gitCommands = `# Upload your standalone books to GitHub Pages in 3 steps:
# 1. Download index.html above
# 2. In your terminal or GitHub Web UI:
git init
git add index.html
git commit -m "Deploy audit-ready finance books"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
# 3. Enable GitHub Pages: Repo Settings > Pages > Source: main branch`;

  const copyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-xl relative animate-in fade-in duration-150 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Standalone HTML for GitHub &amp; GitHub Pages
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-dependency, single-file distribution with embedded calculations and your active data.
            </p>
          </div>
        </div>

        {/* Big Download Hero */}
        <div className="p-5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Single-File HTML (Ready for GitHub Pages)</span>
              </p>
              <p className="text-xs text-emerald-900 dark:text-emerald-300 mt-1">
                Contains the complete accounting interface, balance sheet, P&amp;L, tax schedules, audit suite, and your currently loaded {book.rows.length} transactions.
              </p>
            </div>

            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 border border-emerald-400/40"
            >
              <Download className="w-4 h-4" />
              <span>Download index.html</span>
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
            <span>Also saved at: <code className="font-mono text-[11px] bg-white/70 dark:bg-slate-900/60 px-1.5 py-0.5 rounded">/finance-books-standalone.html</code></span>
            <a
              href="/finance-books-standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold hover:underline"
            >
              <span>Preview Standalone File</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 3-Step GitHub Deployment Guide */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            How to Host on GitHub in 3 Simple Steps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Step 1: Download</span>
              <p className="text-slate-600 dark:text-slate-400">
                Click the button above to download <code className="font-mono bg-white dark:bg-slate-900 px-1">index.html</code> to your computer.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Step 2: Upload to Repo</span>
              <p className="text-slate-600 dark:text-slate-400">
                Create a repo on GitHub (e.g. <code>my-finance-books</code>) and drag-and-drop <code>index.html</code> into the repo root.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Step 3: Enable Pages</span>
              <p className="text-slate-600 dark:text-slate-400">
                Go to Repo Settings &rarr; Pages &rarr; Set source to "main branch / root". It's immediately live!
              </p>
            </div>
          </div>

          {/* Quick Terminal Snippet */}
          <div className="relative mt-2">
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {gitCommands}
            </pre>
            <button
              onClick={copyGitCommands}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
              title="Copy Git Commands"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDownloadNamedHtml}
            className="text-xs text-slate-500 hover:text-emerald-600 transition-colors"
          >
            Download with custom business name
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
