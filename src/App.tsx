/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FinancialBook, LedgerRow, BookSettings, Invoice, Bill } from './types/finance';
import { createSampleBook, createBlankBook, computeFinancialStatements } from './utils/financeEngine';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BalanceSheetView } from './components/BalanceSheetView';
import { IncomeStatementView } from './components/IncomeStatementView';
import { CashFlowView } from './components/CashFlowView';
import { EquityStatementView } from './components/EquityStatementView';
import { TaxComplianceView } from './components/TaxComplianceView';
import { AuditSuiteView } from './components/AuditSuiteView';
import { AnnualReportView } from './components/AnnualReportView';
import { LedgerView } from './components/LedgerView';
import { SubledgersView } from './components/SubledgersView';
import { SettingsView } from './components/SettingsView';
import { TransactionModal } from './components/TransactionModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';

const LOCAL_STORAGE_KEY = 'auditready_book_v2';

export default function App() {
  const [book, setBook] = useState<FinancialBook>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.v === 2 && parsed.settings) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load local storage book:', e);
    }
    return createSampleBook();
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [terminologyMode, setTerminologyMode] = useState<'DUAL' | 'PLAIN' | 'REGULATORY'>('DUAL');
  
  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<LedgerRow | null>(null);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(book));
    } catch (e) {
      console.warn('Failed to persist book to local storage:', e);
    }
  }, [book]);

  // Compute all statements & audit checks
  const computed = useMemo(() => {
    return computeFinancialStatements(book);
  }, [book]);

  // Handlers
  const handleSaveTransaction = (row: LedgerRow) => {
    setBook((prev) => {
      const existsIndex = prev.rows.findIndex((r) => r.id === row.id);
      let newRows = [...prev.rows];
      if (existsIndex >= 0) {
        newRows[existsIndex] = row;
      } else {
        newRows.push(row);
      }
      return {
        ...prev,
        rows: newRows,
        updatedAt: Date.now()
      };
    });
    setEditingRow(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (!confirm('Are you sure you want to delete this ledger entry?')) return;
    setBook((prev) => ({
      ...prev,
      rows: prev.rows.filter((r) => r.id !== id),
      updatedAt: Date.now()
    }));
  };

  const handleToggleApproval = (id: string) => {
    setBook((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)),
      updatedAt: Date.now()
    }));
  };

  const handleApproveAllValid = () => {
    setBook((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => ({ ...r, approved: true })),
      updatedAt: Date.now()
    }));
  };

  const handleUpdateAsOfDate = (newDate: string) => {
    setBook((prev) => ({
      ...prev,
      settings: { ...prev.settings, asOfDate: newDate },
      updatedAt: Date.now()
    }));
  };

  const handleUpdatePeriod = (start: string, end: string) => {
    setBook((prev) => ({
      ...prev,
      settings: { ...prev.settings, periodStart: start, periodEnd: end },
      updatedAt: Date.now()
    }));
  };

  const handleUpdateSettings = (newSettings: BookSettings) => {
    setBook((prev) => ({
      ...prev,
      settings: newSettings,
      updatedAt: Date.now()
    }));
  };

  const handleUpdateBusinessName = (name: string) => {
    setBook((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        businessName: name
      },
      updatedAt: Date.now()
    }));
  };

  const handleTogglePeriodLock = () => {
    setBook((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        isFiscalPeriodLocked: !prev.settings.isFiscalPeriodLocked
      },
      updatedAt: Date.now()
    }));
  };

  const handleResetToSample = () => {
    if (confirm('Load pre-populated audit sample books? Unsaved custom data will be replaced.')) {
      setBook(createSampleBook());
    }
  };

  const handleResetToBlank = () => {
    if (confirm('Start fresh with an empty set of books?')) {
      setBook(createBlankBook());
    }
  };

  const handleAddInvoice = () => {
    const no = prompt('Invoice Number (e.g. INV-105):');
    if (!no) return;
    const customer = book.customers[0]?.id || 'CUST-001';
    const amountStr = prompt('Invoice Amount ($):');
    const amount = parseFloat(amountStr || '0') || 0;
    if (amount <= 0) return;

    const today = new Date().toISOString().slice(0, 10);
    const dueDate = new Date(Date.now() + 15 * 864e5).toISOString().slice(0, 10);

    const newInvoice: Invoice = {
      no: no.trim().toUpperCase(),
      customerId: customer,
      date: today,
      dueDate,
      amount,
      taxAmount: Math.round(amount * 0.12 * 100) / 100,
      description: 'Commercial invoice billing',
      status: 'UNPAID'
    };

    setBook(prev => ({
      ...prev,
      invoices: [...prev.invoices, newInvoice],
      updatedAt: Date.now()
    }));
  };

  const handleAddBill = () => {
    const no = prompt('Vendor Bill # (e.g. BILL-501):');
    if (!no) return;
    const vendor = prompt('Vendor Name (e.g. City Power / Office Depot):') || 'Commercial Vendor';
    const amountStr = prompt('Bill Amount ($):');
    const amount = parseFloat(amountStr || '0') || 0;
    if (amount <= 0) return;

    const today = new Date().toISOString().slice(0, 10);
    const dueDate = new Date(Date.now() + 15 * 864e5).toISOString().slice(0, 10);

    const newBill: Bill = {
      no: no.trim().toUpperCase(),
      vendor,
      date: today,
      dueDate,
      amount,
      taxAmount: Math.round(amount * 0.12 * 100) / 100,
      accountCode: '6900',
      accountName: 'General Administrative Expenses',
      description: 'Vendor supplier invoice',
      status: 'UNPAID'
    };

    setBook(prev => ({
      ...prev,
      bills: [...prev.bills, newBill],
      updatedAt: Date.now()
    }));
  };

  const auditPassCount = computed.auditSuite.checks.filter((c: any) => c.severity === 'PASS').length;
  const auditTotalCount = computed.auditSuite.checks.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* 3-Zone Top Bar */}
      <Header
        book={book}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'export') {
            setIsStandaloneModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenNewTransaction={() => {
          setEditingRow(null);
          setIsTxModalOpen(true);
        }}
        onOpenStandaloneModal={() => setIsStandaloneModalOpen(true)}
        terminologyMode={terminologyMode}
        setTerminologyMode={setTerminologyMode}
        onUpdateBusinessName={handleUpdateBusinessName}
      />

      {/* Main Workspace: Sidebar + Content Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          book={book}
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'export') {
              setIsStandaloneModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          auditPassCount={auditPassCount}
          auditTotalCount={auditTotalCount}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              book={book}
              computed={computed}
              onNavigate={setActiveTab}
              onOpenNewTransaction={() => {
                setEditingRow(null);
                setIsTxModalOpen(true);
              }}
              onOpenStandaloneModal={() => setIsStandaloneModalOpen(true)}
              onPostTransaction={handleSaveTransaction}
              onUpdateBusinessName={handleUpdateBusinessName}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'balance' && (
            <BalanceSheetView
              book={book}
              computed={computed}
              terminologyMode={terminologyMode}
              onUpdateAsOfDate={handleUpdateAsOfDate}
            />
          )}

          {activeTab === 'income' && (
            <IncomeStatementView
              book={book}
              computed={computed}
              terminologyMode={terminologyMode}
              onUpdatePeriod={handleUpdatePeriod}
            />
          )}

          {activeTab === 'cashflow' && (
            <CashFlowView
              book={book}
              computed={computed}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'equity' && (
            <EquityStatementView
              book={book}
              computed={computed}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'tax' && (
            <TaxComplianceView
              book={book}
              computed={computed}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'audit' && (
            <AuditSuiteView
              book={book}
              computed={computed}
              onRefreshAudit={() => setBook((prev) => ({ ...prev, updatedAt: Date.now() }))}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'annual' && (
            <AnnualReportView
              book={book}
              computed={computed}
              onTogglePeriodLock={handleTogglePeriodLock}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'ledger' && (
            <LedgerView
              book={book}
              onOpenNewTransaction={() => {
                setEditingRow(null);
                setIsTxModalOpen(true);
              }}
              onEditTransaction={(row) => {
                setEditingRow(row);
                setIsTxModalOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              onToggleApproval={handleToggleApproval}
              onApproveAllValid={handleApproveAllValid}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'invoices' && (
            <SubledgersView
              book={book}
              computed={computed}
              subledgerType="INVOICES"
              onAddInvoice={handleAddInvoice}
              onAddBill={handleAddBill}
              onAddCustomer={() => {}}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'bills' && (
            <SubledgersView
              book={book}
              computed={computed}
              subledgerType="BILLS"
              onAddInvoice={handleAddInvoice}
              onAddBill={handleAddBill}
              onAddCustomer={() => {}}
              terminologyMode={terminologyMode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              book={book}
              onUpdateSettings={handleUpdateSettings}
              onResetToSample={handleResetToSample}
              onResetToBlank={handleResetToBlank}
              onTogglePeriodLock={handleTogglePeriodLock}
            />
          )}
        </main>
      </div>

      {/* Transaction Entry / Edit Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSaveTransaction}
        editRow={editingRow}
        book={book}
      />

      {/* Standalone GitHub HTML Export Modal */}
      <StandaloneExportModal
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
        book={book}
      />
    </div>
  );
}
