import React, { useState } from 'react';
import { Save, RotateCcw, Lock, Unlock, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { FinancialBook, BookSettings } from '../types/finance';

interface SettingsViewProps {
  book: FinancialBook;
  onUpdateSettings: (newSettings: BookSettings) => void;
  onResetToSample: () => void;
  onResetToBlank: () => void;
  onTogglePeriodLock: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  book,
  onUpdateSettings,
  onResetToSample,
  onResetToBlank,
  onTogglePeriodLock
}) => {
  const [settings, setSettings] = useState<BookSettings>({ ...book.settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof BookSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Fiscal Rules &amp; Statutory Setup</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure entity information, tax registration numbers, and audit materiality thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-200">
              Settings Saved
            </span>
          )}
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs hover:shadow transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Rules</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Legal Entity & Regulatory Identification */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal Business Entity Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Business Name *
              </label>
              <input
                type="text"
                required
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Taxpayer ID / EIN / VAT Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g. TIN-984-204-118-000"
                value={settings.taxRegistrationNumber}
                onChange={(e) => handleChange('taxRegistrationNumber', e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Legal Entity Structure
              </label>
              <select
                value={settings.legalStructure}
                onChange={(e) => handleChange('legalStructure', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Sole Proprietorship">Sole Proprietorship / Single Member</option>
                <option value="Partnership">General / Limited Partnership</option>
                <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                <option value="Corporation (C-Corp / S-Corp)">Corporation (Accrual GAAP)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency &amp; Symbol
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="USD, PHP, EUR"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="$, ₱, €"
                  value={settings.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Audit Materiality & Statutory Tax Rates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Audit Materiality &amp; Tax Authority Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audit Review Threshold ({settings.currencySymbol || '$'})
              </label>
              <input
                type="number"
                step="any"
                value={settings.auditThreshold}
                onChange={(e) => handleChange('auditThreshold', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Transactions &gt;= this amount require controller authorization
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Income Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.corporateTaxRate}
                onChange={(e) => handleChange('corporateTaxRate', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Enter decimal (e.g. 0.20 for 20% tax)
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                VAT / Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.vatSalesTaxRate}
                onChange={(e) => handleChange('vatSalesTaxRate', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Enter decimal (e.g. 0.12 for 12% VAT)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Opening Balances (Day Records Started) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Opening Balances (When Accounting Records Commenced)
            </h2>
            <span className="text-xs text-slate-400 font-mono">Records Start: {settings.recordsStartDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Opening Cash Balance
              </label>
              <input
                type="number"
                step="any"
                value={settings.openCash}
                onChange={(e) => handleChange('openCash', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Opening Equipment / CapEx
              </label>
              <input
                type="number"
                step="any"
                value={settings.openEquipment}
                onChange={(e) => handleChange('openEquipment', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Opening Loans / Debt
              </label>
              <input
                type="number"
                step="any"
                value={settings.openLoan}
                onChange={(e) => handleChange('openLoan', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* 4. Reset & Template Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Template &amp; Data Maintenance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch between pre-populated audit sample books and blank books.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetToSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Audit Sample Books</span>
            </button>
            <button
              type="button"
              onClick={onResetToBlank}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Blank</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
