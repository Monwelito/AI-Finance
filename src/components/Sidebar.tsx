import React from 'react';
import {
  LayoutDashboard,
  Scale,
  TrendingUp,
  Receipt,
  FileCheck2,
  CalendarCheck,
  BookOpen,
  Users,
  Settings,
  Download,
  ShieldCheck,
  FileText,
  Sparkles
} from 'lucide-react';
import { FinancialBook } from '../types/finance';

interface SidebarProps {
  book: FinancialBook;
  activeTab: string;
  onTabChange: (tab: string) => void;
  auditPassCount: number;
  auditTotalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  book,
  activeTab,
  onTabChange,
  auditPassCount,
  auditTotalCount
}) => {
  const isAllPassing = auditPassCount === auditTotalCount;

  const navGroups = [
    {
      label: 'Executive Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard & Visuals', icon: LayoutDashboard },
        { 
          id: 'audit', 
          label: 'Audit & Compliance', 
          icon: ShieldCheck,
          badge: isAllPassing ? 'CLEAN' : `${auditTotalCount - auditPassCount} CHECKS`,
          badgeColor: isAllPassing ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300'
        }
      ]
    },
    {
      label: 'Standard Financial Statements',
      items: [
        { id: 'balance', label: 'Balance Sheet (B/S)', icon: Scale },
        { id: 'income', label: 'Profit & Loss (P&L)', icon: TrendingUp },
        { id: 'cashflow', label: 'Cash Flow (IAS 7)', icon: Receipt },
        { id: 'equity', label: 'Changes in Equity', icon: Users }
      ]
    },
    {
      label: 'Regulatory & Tax Compliance',
      items: [
        { id: 'tax', label: 'Tax & VAT Schedules', icon: FileCheck2 },
        { id: 'annual', label: 'Yearly Audit Package', icon: CalendarCheck }
      ]
    },
    {
      label: 'General Ledger & Ledgers',
      items: [
        { id: 'ledger', label: 'General Ledger Entries', icon: BookOpen },
        { id: 'invoices', label: 'Invoices (A/R)', icon: FileText },
        { id: 'bills', label: 'Vendor Bills (A/P)', icon: Receipt }
      ]
    },
    {
      label: 'Instant Downloads & Tools',
      items: [
        { id: 'export', label: 'Download GitHub HTML', icon: Download },
        { id: 'settings', label: 'Fiscal Setup & Rules', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a1812] text-slate-200 p-4 shrink-0 flex flex-col justify-between border-r border-emerald-900/40 no-print min-h-[calc(100vh-57px)]">
      <div className="space-y-6">
        {/* Business Card Snapshot */}
        <div className="px-3.5 py-3 rounded-xl bg-gradient-to-br from-[#0e241c] to-[#091a13] border border-emerald-800/40 shadow-xs">
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Active Financial Entity</span>
          </p>
          <p className="text-sm font-bold text-white truncate mt-1" title={book.settings.businessName}>
            {book.settings.businessName}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-200/80 font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Accrual GAAP · FY {book.settings.fiscalYearStart.slice(0, 4)}</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs border border-emerald-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400/80'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-emerald-900/40 px-2 text-[11px] text-slate-400">
        <p className="font-semibold text-emerald-300">Audit-Ready Books</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Automated Multi-Standard GAAP / IFRS</p>
      </div>
    </aside>
  );
};
