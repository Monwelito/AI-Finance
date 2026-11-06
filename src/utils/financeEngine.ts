/**
 * Financial Calculation Engine & Regulatory Reporting Processor
 * Compliant with GAAP & IFRS standards with automated audit compliance checks.
 */

import {
  FinancialBook,
  LedgerRow,
  Customer,
  Invoice,
  Bill,
  AccountDefinition,
  BalanceSheetReport,
  IncomeStatementReport,
  CashFlowReport,
  TaxComplianceReport,
  AuditSuiteResult,
  ComplianceCheckResult
} from '../types/finance';

export const STANDARD_CHART_OF_ACCOUNTS: AccountDefinition[] = [
  // 1000s: Current & Non-Current Assets
  { code: '1010', name: 'Cash and Cash Equivalents', standardTerm: 'Cash & Bank Balances', plainEnglish: 'Money in Bank & Register', category: 'ASSET_CURRENT', normalBalance: 'DEBIT', taxDeductibleDefault: false },
  { code: '1100', name: 'Accounts Receivable', standardTerm: 'Trade Accounts Receivable', plainEnglish: 'Customer Invoices Awaiting Payment', category: 'ASSET_CURRENT', normalBalance: 'DEBIT', taxDeductibleDefault: false },
  { code: '1500', name: 'Property, Plant & Equipment', standardTerm: 'Fixed Assets (Machinery & Tools)', plainEnglish: 'Long-Term Machinery & Computers', category: 'ASSET_NON_CURRENT', normalBalance: 'DEBIT', taxDeductibleDefault: false },

  // 2000s: Current & Long-Term Liabilities
  { code: '2010', name: 'Accounts Payable', standardTerm: 'Trade Accounts Payable', plainEnglish: 'Unpaid Supplier & Vendor Bills', category: 'LIABILITY_CURRENT', normalBalance: 'CREDIT', taxDeductibleDefault: false },
  { code: '2100', name: 'Sales Tax / VAT Payable', standardTerm: 'Indirect Tax Liability', plainEnglish: 'Sales Tax / VAT Collected for Government', category: 'LIABILITY_CURRENT', normalBalance: 'CREDIT', taxDeductibleDefault: false },
  { code: '2500', name: 'Long-Term Commercial Debt', standardTerm: 'Long-Term Borrowings', plainEnglish: 'Bank Loans Payable After 1 Year', category: 'LIABILITY_NON_CURRENT', normalBalance: 'CREDIT', taxDeductibleDefault: false },

  // 3000s: Equity
  { code: '3010', name: 'Owner Contributed Capital', standardTerm: 'Paid-in Capital / Share Capital', plainEnglish: 'Money the Owner Invested from Personal Funds', category: 'EQUITY', normalBalance: 'CREDIT', taxDeductibleDefault: false },
  { code: '3020', name: 'Owner Distributions / Draws', standardTerm: 'Dividends & Proprietor Drawings', plainEnglish: 'Money Taken Out by Owner for Personal Use', category: 'EQUITY', normalBalance: 'DEBIT', taxDeductibleDefault: false },
  { code: '3030', name: 'Retained Earnings', standardTerm: 'Prior Periods Accumulated Surplus', plainEnglish: 'All Past Years Net Profit Kept in Business', category: 'EQUITY', normalBalance: 'CREDIT', taxDeductibleDefault: false },

  // 4000s: Revenue
  { code: '4010', name: 'Gross Commercial Sales', standardTerm: 'Revenue from Contracts with Customers', plainEnglish: 'Money Invoiced from Product & Service Sales', category: 'REVENUE', normalBalance: 'CREDIT', taxDeductibleDefault: false },
  { code: '4020', name: 'Direct Cash Sales', standardTerm: 'Cash Sales & Point of Sale Revenue', plainEnglish: 'Walk-In & Counter Cash Receipts', category: 'REVENUE', normalBalance: 'CREDIT', taxDeductibleDefault: false },
  { code: '4900', name: 'Other Operating Income', standardTerm: 'Sundry Ancillary Revenue', plainEnglish: 'Miscellaneous Business Earnings', category: 'REVENUE', normalBalance: 'CREDIT', taxDeductibleDefault: false },

  // 5000s: Cost of Goods Sold (COGS)
  { code: '5010', name: 'Direct Materials & Inventory', standardTerm: 'Cost of Raw Materials & Resale Goods', plainEnglish: 'Supplies Used Up Making Products Sold', category: 'COGS', normalBalance: 'DEBIT', taxDeductibleDefault: true },

  // 6000s: Operating Expenses (SG&A Overhead)
  { code: '6100', name: 'Wages & Compensation', standardTerm: 'Personnel & Payroll Expenses', plainEnglish: 'Staff Wages, Bonuses & Helper Pay', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true },
  { code: '6200', name: 'Rent & Leasehold Occupancy', standardTerm: 'Operating Lease & Facility Rent', plainEnglish: 'Store, Office & Warehouse Rent', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true },
  { code: '6300', name: 'Utilities & Telecommunications', standardTerm: 'Electricity, Gas & Data Services', plainEnglish: 'Power, Water, Phone & Internet', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true },
  { code: '6400', name: 'Freight, Delivery & Transportation', standardTerm: 'Logistics & Fuel Expense', plainEnglish: 'Vehicle Fuel, Courier & Delivery Costs', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true },
  { code: '6500', name: 'Shop Supplies & Maintenance', standardTerm: 'Repairs, Maintenance & Consumables', plainEnglish: 'Cleaning, Tools, Paint & Hardware', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true },
  { code: '6600', name: 'Professional Services & Software', standardTerm: 'Legal, Accounting & Software Licenses', plainEnglish: 'CPA, Legal Fees & Cloud Apps', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true },
  { code: '6900', name: 'General Administrative Expenses', standardTerm: 'Other SG&A Operating Overhead', plainEnglish: 'Small Sundry Office & Business Expenses', category: 'EXPENSE_OPERATING', normalBalance: 'DEBIT', taxDeductibleDefault: true }
];

// Helper: safe math rounding
export function r2(n: number): number {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export function formatCurrency(amount: number, currency = 'USD', symbol = '$'): string {
  const val = r2(amount);
  const formatted = Math.abs(val).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  if (val < 0) {
    return `(${symbol}${formatted})`;
  }
  return `${symbol}${formatted}`;
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const d = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function daysBetween(dateA: string, dateB: string): number {
  const tA = new Date(dateA).getTime();
  const tB = new Date(dateB).getTime();
  if (isNaN(tA) || isNaN(tB)) return 0;
  return Math.round((tB - tA) / (1000 * 60 * 60 * 24));
}

// -------------------------------------------------------------
// Sample Book Initializer (Preloaded with balanced audit-ready records)
// -------------------------------------------------------------
export function createSampleBook(): FinancialBook {
  const today = '2026-10-31';
  return {
    v: 2,
    updatedAt: Date.now(),
    isSampleData: true,
    settings: {
      businessName: 'Apex Commercial Supplies & Services',
      taxRegistrationNumber: 'TIN-984-204-118-000',
      legalStructure: 'Registered Enterprise (Accrual GAAP)',
      currency: 'USD',
      currencySymbol: '$',
      fiscalYearStart: '2026-01-01',
      fiscalYearEnd: '2026-12-31',
      accountingBasis: 'ACCRUAL',
      recordsStartDate: '2026-10-01',
      asOfDate: '2026-10-31',
      periodStart: '2026-10-01',
      periodEnd: '2026-10-31',
      auditThreshold: 2000,
      corporateTaxRate: 0.20,
      vatSalesTaxRate: 0.12,
      auditorName: 'Grant & Stone Certified Public Accountants',
      certifiedSignatory: 'Chief Financial Controller',
      isFiscalPeriodLocked: false,
      openCash: 6500,
      openEquipment: 8000,
      openLoan: 4000
    },
    customers: [
      { id: 'CUST-001', name: 'Maria Metro Superstore', taxId: 'TIN-551-092', contact: 'accounting@mariastore.com', creditTermsDays: 30 },
      { id: 'CUST-002', name: "Ben's Artisan Cafe & Bakery", taxId: 'TIN-882-314', contact: 'ben@benscafe.com', creditTermsDays: 15 },
      { id: 'CUST-003', name: 'Horizon Logistics Corp', taxId: 'TIN-109-448', contact: 'billing@horizonlogistics.com', creditTermsDays: 30 }
    ],
    invoices: [
      { no: 'INV-101', customerId: 'CUST-001', date: '2026-10-03', dueDate: '2026-10-18', amount: 3200, taxAmount: 384, description: 'Commercial cleaning supplies & paper packs', status: 'PAID' },
      { no: 'INV-102', customerId: 'CUST-002', date: '2026-10-06', dueDate: '2026-10-21', amount: 1650, taxAmount: 198, description: 'Bulk organic coffee beans & syrups', status: 'PAID' },
      { no: 'INV-103', customerId: 'CUST-001', date: '2026-10-14', dueDate: '2026-10-29', amount: 2400, taxAmount: 288, description: 'Restock sanitation chemicals batch #4', status: 'PARTIAL' },
      { no: 'INV-104', customerId: 'CUST-003', date: '2026-10-22', dueDate: '2026-11-06', amount: 4800, taxAmount: 576, description: 'Fleet maintenance supplies and pallets', status: 'UNPAID' }
    ],
    bills: [
      { no: 'BILL-401', vendor: 'City Electric & Power Utility', date: '2026-10-04', dueDate: '2026-10-19', amount: 620, taxAmount: 74.40, accountCode: '6300', accountName: 'Utilities & Telecommunications', description: 'October warehouse power bill', status: 'PAID' },
      { no: 'BILL-402', vendor: 'Industrial Commercial Plaza LLC', date: '2026-10-01', dueDate: '2026-10-15', amount: 2200, taxAmount: 0, accountCode: '6200', accountName: 'Rent & Leasehold Occupancy', description: 'Monthly warehouse and office lease', status: 'PAID' },
      { no: 'BILL-403', vendor: 'Precision Chemical Wholesalers', date: '2026-10-10', dueDate: '2026-10-25', amount: 1850, taxAmount: 222, accountCode: '5010', accountName: 'Direct Materials & Inventory', description: 'Concentrate solutions raw inventory', status: 'PAID' },
      { no: 'BILL-404', vendor: 'Global Logistics Petroleum', date: '2026-10-26', dueDate: '2026-11-10', amount: 780, taxAmount: 93.60, accountCode: '6400', accountName: 'Freight, Delivery & Transportation', description: 'Diesel fleet fuel billing statement', status: 'UNPAID' }
    ],
    rows: [
      { id: 'TX-01', date: '2026-10-02', entity: 'Walk-In Retail Customers', description: 'Cash register sales receipts week 1', amountIn: 1850, amountOut: 0, accountCode: '4020', accountName: 'Direct Cash Sales', referenceNo: 'POS-W1', sourceDocument: 'Daily Cash Register Audit Tape #1002', taxDeductible: false, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-02', date: '2026-10-04', entity: 'Industrial Commercial Plaza LLC', description: 'Paid monthly warehouse rent', amountIn: 0, amountOut: 2200, accountCode: '6200', accountName: 'Rent & Leasehold Occupancy', referenceNo: 'BILL-402', sourceDocument: 'Bank Wire Receipt #WIRE-8891', taxDeductible: true, vatEligible: false, status: 'APPROVED', approved: true },
      { id: 'TX-03', date: '2026-10-08', entity: 'Metro Fuel Express', description: 'Delivery van diesel fill-up', amountIn: 0, amountOut: 240, accountCode: '6400', accountName: 'Freight, Delivery & Transportation', referenceNo: 'RCPT-551', sourceDocument: 'Electronic Gas Station VAT Invoice', taxDeductible: true, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-04', date: '2026-10-10', entity: 'Maria Metro Superstore', description: 'Payment received for INV-101', amountIn: 3200, amountOut: 0, accountCode: '1100', accountName: 'Accounts Receivable', referenceNo: 'INV-101', sourceDocument: 'ACH Bank Confirmation #ACH-2201', taxDeductible: false, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-05', date: '2026-10-12', entity: 'City Electric & Power Utility', description: 'Paid electricity bill for warehouse', amountIn: 0, amountOut: 620, accountCode: '6300', accountName: 'Utilities & Telecommunications', referenceNo: 'BILL-401', sourceDocument: 'Official Utility Receipt #UTIL-44', taxDeductible: true, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-06', date: '2026-10-15', entity: 'Operations Team Staff', description: 'Mid-month staff payroll & helper compensation', amountIn: 0, amountOut: 1800, accountCode: '6100', accountName: 'Wages & Compensation', referenceNo: 'PAY-10A', sourceDocument: 'Signed Payroll Summary Ledger', taxDeductible: true, vatEligible: false, status: 'APPROVED', approved: true },
      { id: 'TX-07', date: '2026-10-18', entity: "Ben's Artisan Cafe & Bakery", description: 'Payment received for INV-102', amountIn: 1650, amountOut: 0, accountCode: '1100', accountName: 'Accounts Receivable', referenceNo: 'INV-102', sourceDocument: 'Check Clearing Slip #CHK-904', taxDeductible: false, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-08', date: '2026-10-20', entity: 'Precision Chemical Wholesalers', description: 'Paid raw materials supplier invoice', amountIn: 0, amountOut: 1850, accountCode: '5010', accountName: 'Direct Materials & Inventory', referenceNo: 'BILL-403', sourceDocument: 'Commercial Invoice #PCW-8812', taxDeductible: true, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-09', date: '2026-10-24', entity: 'First Commercial Bank', description: 'Monthly loan principal & amortized interest', amountIn: 0, amountOut: 500, accountCode: '2500', accountName: 'Long-Term Commercial Debt', referenceNo: 'LN-001', sourceDocument: 'Bank Direct Debit Advice', taxDeductible: false, vatEligible: false, status: 'APPROVED', approved: true },
      { id: 'TX-10', date: '2026-10-27', entity: 'Maria Metro Superstore', description: 'Partial payment received for INV-103', amountIn: 1400, amountOut: 0, accountCode: '1100', accountName: 'Accounts Receivable', referenceNo: 'INV-103', sourceDocument: 'Bank Wire Receipt #BW-7741', taxDeductible: false, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-11', date: '2026-10-29', entity: 'TechHub Equipment Corp', description: 'Upgraded barcode scanner & label thermal printer', amountIn: 0, amountOut: 950, accountCode: '1500', accountName: 'Property, Plant & Equipment', referenceNo: 'EQ-042', sourceDocument: 'Hardware Tax Invoice & Warranty Card', taxDeductible: false, vatEligible: true, status: 'APPROVED', approved: true },
      { id: 'TX-12', date: '2026-10-31', entity: 'Company Proprietor / Owner', description: 'Owner personal distribution draw for October', amountIn: 0, amountOut: 1500, accountCode: '3020', accountName: 'Owner Distributions / Draws', referenceNo: 'DRAW-10', sourceDocument: 'Owner Authorized Withdrawal Memo', taxDeductible: false, vatEligible: false, status: 'APPROVED', approved: true }
    ],
    auditLogs: [
      { id: 'LOG-01', timestamp: '2026-10-01T08:00:00Z', action: 'FISCAL_PERIOD_INIT', actor: 'Chief Financial Controller', details: 'Opened October 2026 fiscal accounting period under GAAP Accrual Basis.', severity: 'INFO' },
      { id: 'LOG-02', timestamp: '2026-10-15T17:00:00Z', action: 'PAYROLL_REVIEW', actor: 'Chief Financial Controller', details: 'Audited staff payroll payout $1,800 against timesheets. Approved.', severity: 'INFO' },
      { id: 'LOG-03', timestamp: '2026-10-29T14:30:00Z', action: 'CAPEX_VERIFIED', actor: 'Chief Financial Controller', details: 'Capitalized Equipment purchase $950 into Fixed Asset register #EQ-042.', severity: 'INFO' },
      { id: 'LOG-04', timestamp: '2026-10-31T18:00:00Z', action: 'AUDIT_RUN', actor: 'Grant & Stone CPAs (Automated Prober)', details: 'Executed automated compliance check suite. 8 of 8 standard checks passed.', severity: 'INFO' }
    ],
    monthEnd: {
      bankStatementEndingBalance: 6140,
      depositsInTransit: 0,
      outstandingChecks: 0,
      manualChecklist: [true, true, true, true, true, true]
    }
  };
}

export function createBlankBook(): FinancialBook {
  const today = new Date().toISOString().slice(0, 10);
  const start = today.slice(0, 8) + '01';
  return {
    v: 2,
    updatedAt: Date.now(),
    isSampleData: false,
    settings: {
      businessName: 'My Enterprise',
      taxRegistrationNumber: '',
      legalStructure: 'Sole Proprietorship',
      currency: 'USD',
      currencySymbol: '$',
      fiscalYearStart: `${today.slice(0, 4)}-01-01`,
      fiscalYearEnd: `${today.slice(0, 4)}-12-31`,
      accountingBasis: 'ACCRUAL',
      recordsStartDate: start,
      asOfDate: today,
      periodStart: start,
      periodEnd: today,
      auditThreshold: 5000,
      corporateTaxRate: 0.20,
      vatSalesTaxRate: 0.12,
      auditorName: 'External Auditor',
      certifiedSignatory: 'Managing Director',
      isFiscalPeriodLocked: false,
      openCash: 0,
      openEquipment: 0,
      openLoan: 0
    },
    customers: [],
    invoices: [],
    bills: [],
    rows: [],
    auditLogs: [],
    monthEnd: {
      bankStatementEndingBalance: 0,
      depositsInTransit: 0,
      outstandingChecks: 0,
      manualChecklist: [false, false, false, false, false, false]
    }
  };
}

// -------------------------------------------------------------
// Financial Engine Computation Core
// -------------------------------------------------------------

export function computeFinancialStatements(book: FinancialBook) {
  const { settings, rows, invoices, bills, customers } = book;
  const asOf = settings.asOfDate;
  const pStart = settings.periodStart;
  const pEnd = settings.periodEnd;

  // 1. Calculate Accounts Receivable Subledger
  // Sum of payments collected per invoice
  const paymentsByInvoice: Record<string, number> = {};
  const paymentsByBill: Record<string, number> = {};

  rows.forEach(r => {
    if (!r.date || r.date > asOf) return;
    const ref = (r.referenceNo || '').trim().toUpperCase();
    if (ref && r.amountIn > 0) {
      paymentsByInvoice[ref] = (paymentsByInvoice[ref] || 0) + r.amountIn;
    }
    if (ref && r.amountOut > 0) {
      paymentsByBill[ref] = (paymentsByBill[ref] || 0) + r.amountOut;
    }
  });

  const detailedInvoices = invoices.map(inv => {
    const paid = r2(paymentsByInvoice[inv.no.trim().toUpperCase()] || 0);
    const total = r2(inv.amount);
    const balanceDue = r2(Math.max(0, total - paid));
    const isOverdue = balanceDue > 0.01 && inv.dueDate < asOf;
    const daysLate = isOverdue ? daysBetween(inv.dueDate, asOf) : 0;
    
    let status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE' = 'UNPAID';
    if (balanceDue <= 0.01) status = 'PAID';
    else if (paid > 0.01) status = 'PARTIAL';
    else if (isOverdue) status = 'OVERDUE';

    return {
      ...inv,
      paidAmount: paid,
      balanceDue,
      status,
      daysLate
    };
  });

  const detailedBills = bills.map(bill => {
    const paid = r2(paymentsByBill[bill.no.trim().toUpperCase()] || 0);
    const total = r2(bill.amount);
    const balanceDue = r2(Math.max(0, total - paid));
    const isOverdue = balanceDue > 0.01 && bill.dueDate < asOf;
    const daysLate = isOverdue ? daysBetween(bill.dueDate, asOf) : 0;

    let status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE' = 'UNPAID';
    if (balanceDue <= 0.01) status = 'PAID';
    else if (paid > 0.01) status = 'PARTIAL';
    else if (isOverdue) status = 'OVERDUE';

    return {
      ...bill,
      paidAmount: paid,
      balanceDue,
      status,
      daysLate
    };
  });

  // Total Accounts Receivable & Payable as of Date
  const totalAccountsReceivable = detailedInvoices
    .filter(i => i.date <= asOf)
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const totalAccountsPayable = detailedBills
    .filter(b => b.date <= asOf)
    .reduce((sum, b) => sum + b.balanceDue, 0);

  // 2. Cash balance calculation
  // Beginning cash + all cash in up to asOf - all cash out up to asOf
  let totalCashIn = 0;
  let totalCashOut = 0;
  let totalEquipPurchased = 0;
  let totalLoansReceived = 0;
  let totalLoansRepaid = 0;
  let totalOwnerIn = 0;
  let totalOwnerDraws = 0;

  rows.forEach(r => {
    if (!r.date || r.date > asOf) return;
    totalCashIn += r.amountIn || 0;
    totalCashOut += r.amountOut || 0;

    if (r.accountCode === '1500') totalEquipPurchased += r.amountOut || 0;
    if (r.accountCode === '2500') {
      if (r.amountIn > 0) totalLoansReceived += r.amountIn;
      if (r.amountOut > 0) totalLoansRepaid += r.amountOut;
    }
    if (r.accountCode === '3010') totalOwnerIn += r.amountIn || 0;
    if (r.accountCode === '3020') totalOwnerDraws += r.amountOut || 0;
  });

  const cashAndEquivalents = r2((settings.openCash || 0) + totalCashIn - totalCashOut);
  const fixedAssets = r2((settings.openEquipment || 0) + totalEquipPurchased);
  const longTermDebt = r2(Math.max(0, (settings.openLoan || 0) + totalLoansReceived - totalLoansRepaid));

  // 3. Income Statement Computation (Period: pStart to pEnd)
  // Under Accrual: Revenue is Invoiced Sales (billed within period) + Direct Cash Sales (dated within period)
  const periodInvoices = detailedInvoices.filter(i => i.date >= pStart && i.date <= pEnd);
  const invoicedRevenue = periodInvoices.reduce((sum, i) => sum + i.amount, 0);

  let cashSalesRevenue = 0;
  let directCogs = 0;
  const opexByCode: Record<string, { code: string; name: string; plainEnglish: string; amount: number }> = {};

  // Initialize standard opex categories
  STANDARD_CHART_OF_ACCOUNTS.filter(a => a.category === 'EXPENSE_OPERATING').forEach(a => {
    opexByCode[a.code] = { code: a.code, name: a.name, plainEnglish: a.plainEnglish, amount: 0 };
  });

  // Billed expenses (from vendor bills dated in period)
  detailedBills.filter(b => b.date >= pStart && b.date <= pEnd).forEach(b => {
    if (b.accountCode === '5010') {
      directCogs += b.amount;
    } else if (opexByCode[b.accountCode]) {
      opexByCode[b.accountCode].amount += b.amount;
    } else {
      opexByCode['6900'].amount += b.amount;
    }
  });

  // Direct cash expenses & cash sales from ledger (excluding payment of bills/invoices to avoid double counting)
  rows.filter(r => r.date >= pStart && r.date <= pEnd).forEach(r => {
    // Cash Sales
    if (r.accountCode === '4020' || (r.amountIn > 0 && r.accountCode === '4010' && !r.referenceNo)) {
      cashSalesRevenue += r.amountIn;
    }
    // Direct COGS paid in cash
    if (r.accountCode === '5010' && !r.referenceNo) {
      directCogs += r.amountOut;
    }
    // Direct Operating Expenses paid in cash
    if (r.accountCode.startsWith('6') && !r.referenceNo) {
      if (opexByCode[r.accountCode]) {
        opexByCode[r.accountCode].amount += r.amountOut;
      } else {
        opexByCode['6900'].amount += r.amountOut;
      }
    }
  });

  const grossRevenue = r2(invoicedRevenue + cashSalesRevenue);
  const costOfGoodsSold = r2(directCogs);
  const grossProfit = r2(grossRevenue - costOfGoodsSold);
  const grossMarginPct = grossRevenue > 0 ? r2((grossProfit / grossRevenue) * 100) : 0;

  const operatingExpensesList = Object.values(opexByCode)
    .filter(o => o.amount > 0)
    .map(o => ({
      ...o,
      amount: r2(o.amount),
      pctOfRevenue: grossRevenue > 0 ? r2((o.amount / grossRevenue) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const totalOperatingExpenses = r2(operatingExpensesList.reduce((sum, o) => sum + o.amount, 0));
  const operatingIncomeEBIT = r2(grossProfit - totalOperatingExpenses);
  const operatingMarginPct = grossRevenue > 0 ? r2((operatingIncomeEBIT / grossRevenue) * 100) : 0;

  const estimatedTaxProvision = operatingIncomeEBIT > 0 ? r2(operatingIncomeEBIT * settings.corporateTaxRate) : 0;
  const netIncome = r2(operatingIncomeEBIT - estimatedTaxProvision);
  const netMarginPct = grossRevenue > 0 ? r2((netIncome / grossRevenue) * 100) : 0;

  const incomeStatement: IncomeStatementReport = {
    periodStart: pStart,
    periodEnd: pEnd,
    grossRevenue,
    salesDiscountsAndReturns: 0,
    netRevenue: grossRevenue,
    costOfGoodsSold,
    grossProfit,
    grossMarginPct,
    operatingExpenses: operatingExpensesList,
    totalOperatingExpenses,
    operatingIncomeEBIT,
    operatingMarginPct,
    interestExpense: 0,
    incomeBeforeTax: operatingIncomeEBIT,
    estimatedTaxProvision,
    netIncome,
    netMarginPct
  };

  // 4. Cumulative Net Income from Records Start Date to asOfDate (for Balance Sheet Equity)
  // All Invoiced Revenue + Cash Sales up to asOf
  const allInvoicedRevenue = detailedInvoices.filter(i => i.date >= settings.recordsStartDate && i.date <= asOf).reduce((sum, i) => sum + i.amount, 0);
  let allCashSales = 0;
  let allTotalOpexAndCogs = 0;

  detailedBills.filter(b => b.date >= settings.recordsStartDate && b.date <= asOf).forEach(b => {
    allTotalOpexAndCogs += b.amount;
  });

  rows.filter(r => r.date >= settings.recordsStartDate && r.date <= asOf).forEach(r => {
    if (r.accountCode === '4020' || (r.amountIn > 0 && r.accountCode === '4010' && !r.referenceNo)) {
      allCashSales += r.amountIn;
    }
    if ((r.accountCode === '5010' || r.accountCode.startsWith('6')) && !r.referenceNo) {
      allTotalOpexAndCogs += r.amountOut;
    }
  });

  const cumulativeRevenue = allInvoicedRevenue + allCashSales;
  const cumulativeEarnings = r2(cumulativeRevenue - allTotalOpexAndCogs);

  // Initial Equity before records start:
  // Open Assets - Open Liabilities = Open Equity
  const priorOpenEquity = r2((settings.openCash || 0) + (settings.openEquipment || 0) - (settings.openLoan || 0));
  
  // Total Owner Equity on Balance Sheet:
  // Prior Open Equity + Owner Capital In - Owner Draws + Cumulative Operating Earnings
  const totalEquity = r2(priorOpenEquity + totalOwnerIn - totalOwnerDraws + cumulativeEarnings);

  // Balance Sheet Totals
  const totalCurrentAssets = r2(cashAndEquivalents + totalAccountsReceivable);
  const totalAssets = r2(totalCurrentAssets + fixedAssets);

  const totalCurrentLiabilities = r2(totalAccountsPayable + estimatedTaxProvision);
  const totalLiabilities = r2(totalCurrentLiabilities + longTermDebt);
  const totalLiabilitiesAndEquity = r2(totalLiabilities + totalEquity);

  const balanceVariance = r2(totalAssets - totalLiabilitiesAndEquity);
  const isBalanced = Math.abs(balanceVariance) < 0.05;

  const balanceSheet: BalanceSheetReport = {
    asOfDate: asOf,
    currentAssets: {
      cashAndEquivalents,
      accountsReceivable: totalAccountsReceivable,
      otherCurrentAssets: 0,
      total: totalCurrentAssets
    },
    nonCurrentAssets: {
      propertyAndEquipment: fixedAssets,
      accumulatedDepreciation: 0,
      total: fixedAssets
    },
    totalAssets,
    currentLiabilities: {
      accountsPayable: totalAccountsPayable,
      accruedExpensesAndTaxes: estimatedTaxProvision,
      total: totalCurrentLiabilities
    },
    nonCurrentLiabilities: {
      longTermLoans: longTermDebt,
      total: longTermDebt
    },
    totalLiabilities,
    equity: {
      openingContributedCapital: priorOpenEquity,
      additionalCapitalPaidIn: totalOwnerIn,
      ownerDistributions: totalOwnerDraws,
      retainedEarningsPrior: 0,
      currentPeriodNetIncome: cumulativeEarnings,
      total: totalEquity
    },
    totalLiabilitiesAndEquity,
    isBalanced,
    variance: balanceVariance
  };

  // 5. Statement of Cash Flows (IAS 7 Direct Method)
  // Cash at start of period
  let cashPriorToPeriod = settings.openCash || 0;
  rows.filter(r => r.date < pStart).forEach(r => {
    cashPriorToPeriod += (r.amountIn || 0) - (r.amountOut || 0);
  });
  cashPriorToPeriod = r2(cashPriorToPeriod);

  let collectionsFromCustomers = 0;
  let cashSalesInPeriod = 0;
  let paymentsToSuppliers = 0;
  let paymentsForOperatingExpenses = 0;
  let capexInPeriod = 0;
  let loanProceeds = 0;
  let loanRepayments = 0;
  let ownerInjections = 0;
  let ownerWithdrawals = 0;

  rows.filter(r => r.date >= pStart && r.date <= pEnd).forEach(r => {
    if (r.accountCode === '1100' && r.amountIn > 0) collectionsFromCustomers += r.amountIn;
    else if (r.accountCode === '4020') cashSalesInPeriod += r.amountIn;
    else if (r.accountCode === '2010' || r.accountCode === '5010') paymentsToSuppliers += r.amountOut;
    else if (r.accountCode.startsWith('6')) paymentsForOperatingExpenses += r.amountOut;
    else if (r.accountCode === '1500') capexInPeriod += r.amountOut;
    else if (r.accountCode === '2500') {
      if (r.amountIn > 0) loanProceeds += r.amountIn;
      if (r.amountOut > 0) loanRepayments += r.amountOut;
    }
    else if (r.accountCode === '3010') ownerInjections += r.amountIn;
    else if (r.accountCode === '3020') ownerWithdrawals += r.amountOut;
  });

  const netCashFromOperations = r2(collectionsFromCustomers + cashSalesInPeriod - paymentsToSuppliers - paymentsForOperatingExpenses);
  const netCashFromInvesting = r2(-capexInPeriod);
  const netCashFromFinancing = r2(loanProceeds - loanRepayments + ownerInjections - ownerWithdrawals);
  const netCashChange = r2(netCashFromOperations + netCashFromInvesting + netCashFromFinancing);
  const endingCashCalculated = r2(cashPriorToPeriod + netCashChange);

  const cashFlow: CashFlowReport = {
    periodStart: pStart,
    periodEnd: pEnd,
    beginningCash: cashPriorToPeriod,
    operatingActivities: {
      collectionsFromCustomers: r2(collectionsFromCustomers),
      cashSales: r2(cashSalesInPeriod),
      paymentsToSuppliers: r2(paymentsToSuppliers),
      paymentsForOperatingExpenses: r2(paymentsForOperatingExpenses),
      taxPayments: 0,
      netCashFromOperations
    },
    investingActivities: {
      equipmentAndCapExPurchases: r2(capexInPeriod),
      netCashFromInvesting
    },
    financingActivities: {
      loanProceedsReceived: r2(loanProceeds),
      loanPrincipalRepaid: r2(loanRepayments),
      ownerCapitalInjections: r2(ownerInjections),
      ownerDrawsAndDividends: r2(ownerWithdrawals),
      netCashFromFinancing
    },
    netCashChange,
    endingCashCalculated,
    balanceSheetEndingCash: cashAndEquivalents,
    isReconciled: Math.abs(endingCashCalculated - cashAndEquivalents) < 0.05,
    reconciliationVariance: r2(endingCashCalculated - cashAndEquivalents)
  };

  // 6. Tax Authority Compliance Report & VAT Schedule
  const vatRate = settings.vatSalesTaxRate;
  const vatApplicableSales = r2(grossRevenue / (1 + vatRate));
  const outputVatCollected = r2(grossRevenue - vatApplicableSales);

  const vatApplicablePurchases = r2(costOfGoodsSold + totalOperatingExpenses);
  const inputVatCreditable = r2(vatApplicablePurchases * (vatRate / (1 + vatRate)));
  const netVatPayable = r2(Math.max(0, outputVatCollected - inputVatCreditable));

  const allowableDeductions = r2(costOfGoodsSold + totalOperatingExpenses);
  const nonDeductibleExpenses = r2(ownerWithdrawals);
  const taxableNetIncome = r2(Math.max(0, grossRevenue - allowableDeductions));
  const estimatedTaxPayable = r2(taxableNetIncome * settings.corporateTaxRate);

  const taxCompliance: TaxComplianceReport = {
    taxYear: pStart.slice(0, 4),
    reportingPeriod: `${formatDate(pStart)} – ${formatDate(pEnd)}`,
    businessName: settings.businessName,
    taxRegistrationNumber: settings.taxRegistrationNumber,
    grossTaxableSales: grossRevenue,
    allowableDeductions,
    nonDeductibleExpenses,
    taxableNetIncome,
    estimatedCorporateTaxRate: settings.corporateTaxRate,
    estimatedTaxPayable,
    vatSchedule: {
      vatApplicableSales,
      outputVatCollected,
      vatApplicablePurchases,
      inputVatCreditable,
      netVatPayable
    },
    filingDeadlines: [
      { formName: 'Form 1120 / Annual Corporate Income Tax Return', description: 'Annual taxable income declaration & audit certification', dueDate: `${settings.fiscalYearStart.slice(0, 4)}-04-15`, status: 'READY' },
      { formName: 'Form 2550M / Monthly Value Added Tax Return', description: 'Output VAT remittance less input tax credits', dueDate: `${pEnd.slice(0, 7)}-20`, status: 'READY' },
      { formName: 'Form 1601E / Expanded Withholding Tax Summary', description: 'Withholding tax certificate on commercial rent & supplier contracts', dueDate: `${pEnd.slice(0, 7)}-10`, status: 'READY' }
    ]
  };

  // 7. Automated Audit & Regulatory Compliance Suite
  const checks: ComplianceCheckResult[] = [];

  // Check 1: Double Entry Balance
  checks.push({
    id: 'AUD-01',
    title: 'Double-Entry Invariant (Assets = Liabilities + Equity)',
    standardReference: 'GAAP ASC 210 / IAS 1 (Presentation of Financial Statements)',
    plainExplanation: 'Verifies that every dollar of company property is matched to debt or owner equity.',
    severity: isBalanced ? 'PASS' : 'FAIL',
    details: isBalanced 
      ? `Assets ($${totalAssets.toLocaleString()}) perfectly balance Liabilities + Equity ($${totalLiabilitiesAndEquity.toLocaleString()}).`
      : `Out of balance by $${Math.abs(balanceVariance).toLocaleString()}. Review unclassified ledger transactions.`,
    remedyAction: isBalanced ? 'No action needed.' : 'Investigate orphaned rows in the Daily Record or verify opening balances.'
  });

  // Check 2: Bank Statement Reconciliation
  const adjBank = r2((book.monthEnd.bankStatementEndingBalance || 0) + (book.monthEnd.depositsInTransit || 0) - (book.monthEnd.outstandingChecks || 0));
  const bankVariance = r2(adjBank - cashAndEquivalents);
  const bankMatched = Math.abs(bankVariance) < 0.05;

  checks.push({
    id: 'AUD-02',
    title: 'Bank Statement to General Ledger Reconciliation',
    standardReference: 'GAAP ASC 305 / ISA 505 (External Confirmations)',
    plainExplanation: 'Matches physical bank statement closing cash against software book records.',
    severity: bankMatched ? 'PASS' : Math.abs(bankVariance) < 100 ? 'WARNING' : 'FAIL',
    details: bankMatched
      ? `Reconciled: Bank adjusted total ($${adjBank.toLocaleString()}) matches general ledger cash ($${cashAndEquivalents.toLocaleString()}).`
      : `Discrepancy of $${Math.abs(bankVariance).toLocaleString()} between bank statement and internal ledger.`,
    remedyAction: bankMatched ? 'No action needed.' : 'Record missing bank charges, interest, or uncleared disbursements in Month-End.'
  });

  // Check 3: Source Document Verification Compliance
  const unverifiedRows = rows.filter(r => !r.sourceDocument || r.sourceDocument.trim().length < 3);
  const docCompliancePct = rows.length > 0 ? r2(((rows.length - unverifiedRows.length) / rows.length) * 100) : 100;
  
  checks.push({
    id: 'AUD-03',
    title: 'Source Document Audit Trail (Vouching & Invoicing)',
    standardReference: 'ISA 500 (Audit Evidence) / Tax Code Sec 6001',
    plainExplanation: 'Ensures tax deductions and expenses are backed by real receipts, invoices, or contracts.',
    severity: docCompliancePct >= 95 ? 'PASS' : docCompliancePct >= 80 ? 'WARNING' : 'FAIL',
    details: `${rows.length - unverifiedRows.length} of ${rows.length} rows (${docCompliancePct}%) have verifiable source documents attached.`,
    remedyAction: unverifiedRows.length === 0 ? 'Document trail complete.' : `Attach receipt or invoice reference to ${unverifiedRows.length} flagged transaction row(s).`
  });

  // Check 4: Materiality / High-Value Transaction Authorization
  const highValueThreshold = settings.auditThreshold;
  const unapprovedHighValue = rows.filter(r => (r.amountIn >= highValueThreshold || r.amountOut >= highValueThreshold) && !r.approved);

  checks.push({
    id: 'AUD-04',
    title: `Materiality Threshold Compliance (Entries >= $${highValueThreshold.toLocaleString()})`,
    standardReference: 'ISA 320 (Materiality in Planning and Performing an Audit)',
    plainExplanation: 'Requires designated management sign-off on large capital outflows or unusual inflows.',
    severity: unapprovedHighValue.length === 0 ? 'PASS' : 'WARNING',
    details: unapprovedHighValue.length === 0
      ? `All ${rows.filter(r => r.amountIn >= highValueThreshold || r.amountOut >= highValueThreshold).length} material transactions have verified supervisory sign-off.`
      : `${unapprovedHighValue.length} material transaction(s) exceed $${highValueThreshold.toLocaleString()} without supervisor approval stamp.`,
    remedyAction: unapprovedHighValue.length === 0 ? 'Compliant.' : 'Open flagged transactions and verify manager authorization.'
  });

  // Check 5: Duplicate Payment & Receipt Scanner
  const seenCombos: Record<string, number> = {};
  let potentialDuplicates = 0;
  rows.forEach(r => {
    const key = `${r.date}_${(r.entity || '').trim().toLowerCase()}_${r.amountIn}_${r.amountOut}`;
    seenCombos[key] = (seenCombos[key] || 0) + 1;
    if (seenCombos[key] > 1) potentialDuplicates++;
  });

  checks.push({
    id: 'AUD-05',
    title: 'Duplicate Payment & Receipt Detection',
    standardReference: 'COSO Internal Control Framework / Anti-Fraud Standards',
    plainExplanation: 'Scans for identical charges posted twice to prevent double-paying suppliers.',
    severity: potentialDuplicates === 0 ? 'PASS' : 'WARNING',
    details: potentialDuplicates === 0
      ? 'Zero duplicate entries detected across the entire general ledger.'
      : `${potentialDuplicates} transaction(s) share identical date, payee, and dollar amount.`,
    remedyAction: potentialDuplicates === 0 ? 'Clean.' : 'Inspect repeated rows in the Daily Record and remove unintentional duplicates.'
  });

  // Check 6: Accounts Receivable Aging & Impairment Risk
  const criticalOverdueInvoices = detailedInvoices.filter(i => i.status === 'OVERDUE' && i.daysLate > 30);
  const criticalOverdueAmount = criticalOverdueInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  checks.push({
    id: 'AUD-06',
    title: 'Trade Receivables Aging & Allowance for Doubtful Accounts',
    standardReference: 'IFRS 9 / GAAP ASC 326 (Expected Credit Losses)',
    plainExplanation: 'Tests customer invoices older than 30 days past due for bad-debt risk.',
    severity: criticalOverdueInvoices.length === 0 ? 'PASS' : criticalOverdueAmount > 5000 ? 'FAIL' : 'WARNING',
    details: criticalOverdueInvoices.length === 0
      ? 'All customer receivables are current within agreed credit terms.'
      : `${criticalOverdueInvoices.length} invoice(s) totaling $${criticalOverdueAmount.toLocaleString()} are >30 days past due date.`,
    remedyAction: criticalOverdueInvoices.length === 0 ? 'Healthy collection velocity.' : 'Issue formal statement of accounts and follow up with overdue accounts.'
  });

  // Check 7: Cut-Off Period & Period Locking Integrity
  const outOfPeriodRows = rows.filter(r => r.date < settings.fiscalYearStart || r.date > settings.fiscalYearEnd);

  checks.push({
    id: 'AUD-07',
    title: 'Fiscal Period Cut-Off & Boundaries Verification',
    standardReference: 'ISA 240 / GAAP Accrual Cut-Off Guidelines',
    plainExplanation: 'Ensures transactions are strictly booked into the fiscal year they legally occurred.',
    severity: outOfPeriodRows.length === 0 ? 'PASS' : 'WARNING',
    details: outOfPeriodRows.length === 0
      ? `All entries are correctly bounded inside Fiscal Year ${settings.fiscalYearStart.slice(0, 4)}.`
      : `${outOfPeriodRows.length} entry(ies) have dates outside active fiscal year range.`,
    remedyAction: outOfPeriodRows.length === 0 ? 'Valid.' : 'Adjust transaction dates or rollover prior fiscal year records.'
  });

  // Overall Audit Opinion Calculation
  const failCount = checks.filter(c => c.severity === 'FAIL').length;
  const warnCount = checks.filter(c => c.severity === 'WARNING').length;
  
  let overallAuditOpinion: 'UNQUALIFIED' | 'QUALIFIED' | 'ADVERSE' = 'UNQUALIFIED';
  let opinionText = 'Unqualified Clean Audit Opinion: Financial statements present fairly, in all material respects, the financial position and operating results in accordance with standard accounting principles.';

  if (failCount > 0) {
    overallAuditOpinion = 'ADVERSE';
    opinionText = 'Adverse Audit Opinion: Material misstatements or balance sheet disparities detected. The books do not conform to regulatory standards until balance is restored.';
  } else if (warnCount > 0) {
    overallAuditOpinion = 'QUALIFIED';
    opinionText = 'Qualified Audit Opinion: Financial records are substantially sound with specific exceptions noted in supporting documentation or aged receivables requiring management rectification.';
  }

  const complianceScorePct = r2(((checks.filter(c => c.severity === 'PASS').length + (checks.filter(c => c.severity === 'WARNING').length * 0.5)) / checks.length) * 100);

  // Digital audit hash for annual transparency
  const auditorVerificationHash = `AUD-${settings.taxRegistrationNumber || 'REG'}-${asOf.replace(/-/g, '')}-${Math.abs(Math.round(totalAssets * 100)).toString(16).toUpperCase()}`;

  const auditSuite: AuditSuiteResult = {
    overallAuditOpinion,
    opinionText,
    complianceScorePct,
    checks,
    unresolvedCount: failCount + warnCount,
    auditTrailCount: book.auditLogs.length,
    auditorVerificationHash
  };

  // 8. Plain Language Visualizations Data
  // Days of Cash Runway
  const daysInPeriod = Math.max(1, daysBetween(pStart, pEnd) + 1);
  const dailyCashBurn = totalOperatingExpenses / daysInPeriod;
  const cashRunwayDays = dailyCashBurn > 0 ? Math.round(cashAndEquivalents / dailyCashBurn) : 999;

  // Liquidity Ratio (Quick Ratio: Cash + AR / Current Liabilities)
  const quickRatio = totalCurrentLiabilities > 0 ? r2((cashAndEquivalents + totalAccountsReceivable) / totalCurrentLiabilities) : 99;

  return {
    balanceSheet,
    incomeStatement,
    cashFlow,
    taxCompliance,
    auditSuite,
    detailedInvoices,
    detailedBills,
    plainMetrics: {
      cashOnHand: cashAndEquivalents,
      accountsReceivable: totalAccountsReceivable,
      accountsPayable: totalAccountsPayable,
      grossRevenue,
      netProfit: netIncome,
      netProfitMargin: netMarginPct,
      cashRunwayDays,
      quickRatio,
      isBalanced,
      auditOpinion: overallAuditOpinion,
      complianceScore: complianceScorePct
    }
  };
}
