/**
 * Core Financial Data Types & Standard Regulatory Accounting Interfaces
 * Supports GAAP & IFRS standards with plain-language bridging.
 */

export type AccountCategory = 
  | 'ASSET_CURRENT'
  | 'ASSET_NON_CURRENT'
  | 'LIABILITY_CURRENT'
  | 'LIABILITY_NON_CURRENT'
  | 'EQUITY'
  | 'REVENUE'
  | 'COGS'
  | 'EXPENSE_OPERATING'
  | 'EXPENSE_TAX';

export interface AccountDefinition {
  code: string;
  name: string;
  standardTerm: string;
  plainEnglish: string;
  category: AccountCategory;
  normalBalance: 'DEBIT' | 'CREDIT';
  taxDeductibleDefault: boolean;
}

export type TransactionKind = 
  | 'REVENUE_INVOICE'
  | 'REVENUE_CASH'
  | 'EXPENSE_BILL'
  | 'EXPENSE_DIRECT'
  | 'ASSET_PURCHASE'
  | 'LIABILITY_LOAN_RECEIVED'
  | 'LIABILITY_LOAN_PAID'
  | 'EQUITY_CONTRIBUTION'
  | 'EQUITY_DRAW';

export interface LedgerRow {
  id: string;
  date: string;
  entity: string;         // Customer, Vendor, Payee
  description: string;    // What it was for
  amountIn: number;       // Inflow / Receipt
  amountOut: number;      // Outflow / Payment
  accountCode: string;    // e.g. "4000", "6100"
  accountName: string;    // e.g. "Sales Revenue", "Utilities"
  referenceNo: string;    // Invoice #, Bill #, Check #
  sourceDocument: string; // e.g. "Official Tax Invoice #102", "Bank Transfer Stmt"
  taxDeductible: boolean; // Applicable for corporate income tax calculation
  vatEligible: boolean;   // Applicable for VAT / Sales tax input/output
  status: 'APPROVED' | 'PENDING_REVIEW' | 'FLAGGED';
  notes?: string;
  approved: boolean;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  taxId?: string;
  contact: string;
  creditTermsDays: number;
}

export interface Invoice {
  no: string;
  customerId: string;
  date: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  description: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
}

export interface Bill {
  no: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  accountCode: string;
  accountName: string;
  description: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface BookSettings {
  businessName: string;
  taxRegistrationNumber: string; // Tax ID / EIN / VAT Reg
  legalStructure: string;        // e.g. "Sole Proprietorship", "LLC", "Corporation"
  currency: string;
  currencySymbol: string;
  fiscalYearStart: string;       // e.g. "2026-01-01"
  fiscalYearEnd: string;         // e.g. "2026-12-31"
  accountingBasis: 'ACCRUAL' | 'CASH';
  recordsStartDate: string;
  asOfDate: string;
  periodStart: string;
  periodEnd: string;
  auditThreshold: number;        // Threshold for mandatory supervisory audit check
  corporateTaxRate: number;      // e.g. 0.20 for 20%
  vatSalesTaxRate: number;       // e.g. 0.12 for 12%
  auditorName: string;
  certifiedSignatory: string;
  isFiscalPeriodLocked: boolean; // Prevents back-dated alteration for annual audit compliance
  openCash: number;
  openEquipment: number;
  openLoan: number;
}

export interface MonthEndReconciliation {
  bankStatementEndingBalance: number;
  depositsInTransit: number;      // Add: Recorded receipts not yet on bank stmt
  outstandingChecks: number;       // Deduct: Recorded checks not yet cleared
  manualChecklist: boolean[];
}

export interface FinancialBook {
  v: number;
  updatedAt: number;
  isSampleData: boolean;
  settings: BookSettings;
  rows: LedgerRow[];
  customers: Customer[];
  invoices: Invoice[];
  bills: Bill[];
  auditLogs: AuditLogEntry[];
  monthEnd: MonthEndReconciliation;
}

// Reporting Structures
export interface BalanceSheetReport {
  asOfDate: string;
  currentAssets: {
    cashAndEquivalents: number;
    accountsReceivable: number;
    otherCurrentAssets: number;
    total: number;
  };
  nonCurrentAssets: {
    propertyAndEquipment: number;
    accumulatedDepreciation: number;
    total: number;
  };
  totalAssets: number;

  currentLiabilities: {
    accountsPayable: number;
    accruedExpensesAndTaxes: number;
    total: number;
  };
  nonCurrentLiabilities: {
    longTermLoans: number;
    total: number;
  };
  totalLiabilities: number;

  equity: {
    openingContributedCapital: number;
    additionalCapitalPaidIn: number;
    ownerDistributions: number;
    retainedEarningsPrior: number;
    currentPeriodNetIncome: number;
    total: number;
  };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  variance: number;
}

export interface IncomeStatementReport {
  periodStart: string;
  periodEnd: string;
  grossRevenue: number;
  salesDiscountsAndReturns: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossMarginPct: number;
  
  operatingExpenses: {
    code: string;
    name: string;
    plainEnglish: string;
    amount: number;
    pctOfRevenue: number;
  }[];
  totalOperatingExpenses: number;
  
  operatingIncomeEBIT: number;
  operatingMarginPct: number;
  
  interestExpense: number;
  incomeBeforeTax: number;
  estimatedTaxProvision: number;
  netIncome: number;
  netMarginPct: number;
}

export interface CashFlowReport {
  periodStart: string;
  periodEnd: string;
  beginningCash: number;
  
  operatingActivities: {
    collectionsFromCustomers: number;
    cashSales: number;
    paymentsToSuppliers: number;
    paymentsForOperatingExpenses: number;
    taxPayments: number;
    netCashFromOperations: number;
  };

  investingActivities: {
    equipmentAndCapExPurchases: number;
    netCashFromInvesting: number;
  };

  financingActivities: {
    loanProceedsReceived: number;
    loanPrincipalRepaid: number;
    ownerCapitalInjections: number;
    ownerDrawsAndDividends: number;
    netCashFromFinancing: number;
  };

  netCashChange: number;
  endingCashCalculated: number;
  balanceSheetEndingCash: number;
  isReconciled: boolean;
  reconciliationVariance: number;
}

export interface TaxComplianceReport {
  taxYear: string;
  reportingPeriod: string;
  businessName: string;
  taxRegistrationNumber: string;
  grossTaxableSales: number;
  allowableDeductions: number;
  nonDeductibleExpenses: number;
  taxableNetIncome: number;
  estimatedCorporateTaxRate: number;
  estimatedTaxPayable: number;
  
  vatSchedule: {
    vatApplicableSales: number;
    outputVatCollected: number;
    vatApplicablePurchases: number;
    inputVatCreditable: number;
    netVatPayable: number;
  };

  filingDeadlines: {
    formName: string;
    description: string;
    dueDate: string;
    status: 'READY' | 'ATTENTION_NEEDED' | 'FILE_BY_AUDITOR';
  }[];
}

export interface ComplianceCheckResult {
  id: string;
  title: string;
  standardReference: string; // e.g. "GAAP ASC 210", "IAS 1", "IRS Code Sec 162"
  plainExplanation: string;
  severity: 'PASS' | 'WARNING' | 'FAIL';
  details: string;
  remedyAction: string;
}

export interface AuditSuiteResult {
  overallAuditOpinion: 'UNQUALIFIED' | 'QUALIFIED' | 'ADVERSE';
  opinionText: string;
  complianceScorePct: number;
  checks: ComplianceCheckResult[];
  unresolvedCount: number;
  auditTrailCount: number;
  auditorVerificationHash: string;
}
