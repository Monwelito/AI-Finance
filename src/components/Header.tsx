import React, { useState } from 'react';
import { Download, Plus, ShieldCheck, Building2, Edit3, Check } from 'lucide-react';
import { FinancialBook } from '../types/finance';

interface HeaderProps {
  book: FinancialBook;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenNewTransaction: () => void;
  onOpenStandaloneModal: () => void;
  terminologyMode: 'DUAL' | 'PLAIN' | 'REGULATORY';
  setTerminologyMode: (mode: 'DUAL' | 'PLAIN' | 'REGULATORY') => void;
  onUpdateBusinessName?: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  book,
  activeTab,
  onTabChange,
  onOpenNewTransaction,
  onOpenStandaloneModal,
  terminologyMode,
  setTerminologyMode,
  onUpdateBusinessName
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(book.settings.businessName);

  const handleSaveName = () => {
    if (nameVal.trim() && onUpdateBusinessName) {
      onUpdateBusinessName(nameVal.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#f4f8f5] dark:bg-[#07130e] border-b border-emerald-200/80 dark:border-emerald-900/60 px-6 py-3 no-print shadow-xs">
      <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
        {/* Zone 1: Wordmark & Interactive Business Name Input */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="#dashboard"
            onClick={(e) => { e.preventDefault(); onTabChange('dashboard'); }}
            className="flex items-center gap-2.5 text-slate-900 dark:text-white font-display text-lg font-bold tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white flex items-center justify-center text-sm font-extrabold shadow-sm border border-emerald-300">
              AR
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-emerald-100">AuditReady</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Books</span>
            </div>
          </a>

          {/* Business Name Input / Indicator Chip */}
          <div className="hidden sm:flex items-center">
            {isEditingName ? (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-emerald-400 rounded-lg px-2 py-0.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <input
                  type="text"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  placeholder="Enter business name..."
                  autoFocus
                  className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent outline-none w-44"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 text-emerald-600 hover:text-emerald-700"
                  title="Save Business Name"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNameVal(book.settings.businessName);
                  setIsEditingName(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 border border-emerald-300/70 dark:border-emerald-800 text-xs font-semibold transition-all group"
                title="Click to rename business"
              >
                <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[160px] truncate">{book.settings.businessName}</span>
                <Edit3 className="w-2.5 h-2.5 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`transition-colors whitespace-nowrap hover:text-emerald-700 dark:hover:text-emerald-300 ${activeTab === 'dashboard' ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('balance')}
            className={`transition-colors whitespace-nowrap hover:text-emerald-700 dark:hover:text-emerald-300 ${activeTab === 'balance' ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => onTabChange('income')}
            className={`transition-colors whitespace-nowrap hover:text-emerald-700 dark:hover:text-emerald-300 ${activeTab === 'income' ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}`}
          >
            Profit &amp; Loss
          </button>
          <button
            onClick={() => onTabChange('audit')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-emerald-700 dark:hover:text-emerald-300 ${activeTab === 'audit' ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit Suite</span>
          </button>
          <button
            onClick={() => onTabChange('annual')}
            className={`transition-colors whitespace-nowrap hover:text-emerald-700 dark:hover:text-emerald-300 ${activeTab === 'annual' ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}`}
          >
            Annual Dossier
          </button>
        </nav>

        {/* Zone 3: Mode Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Terminology Mode Toggle */}
          <div className="hidden sm:flex items-center bg-emerald-100/60 dark:bg-slate-900 rounded-lg p-0.5 border border-emerald-200 dark:border-emerald-900/60 text-xs font-medium">
            <button
              onClick={() => setTerminologyMode('DUAL')}
              title="Standard Accounting Terms with Plain English Translations"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${terminologyMode === 'DUAL' ? 'bg-white dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 shadow-xs font-bold border border-emerald-200/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              Dual Mode
            </button>
            <button
              onClick={() => setTerminologyMode('PLAIN')}
              title="Everyday Plain Language for Non-Accountants"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${terminologyMode === 'PLAIN' ? 'bg-white dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 shadow-xs font-bold border border-emerald-200/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              Plain English
            </button>
            <button
              onClick={() => setTerminologyMode('REGULATORY')}
              title="Official GAAP / IFRS Terminology for Auditors & Tax Authorities"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${terminologyMode === 'REGULATORY' ? 'bg-white dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 shadow-xs font-bold border border-emerald-200/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              Auditor View
            </button>
          </div>

          {/* Standalone GitHub HTML Download CTA */}
          <button
            onClick={onOpenStandaloneModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/80 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            title="Download single-file standalone HTML ready to push to GitHub"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span className="hidden md:inline">Download HTML for GitHub</span>
            <span className="md:hidden">GitHub HTML</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap border border-emerald-500/50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Entry</span>
          </button>
        </div>
      </div>
    </header>
  );
};
