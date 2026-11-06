/**
 * Plain English Dictionary & Terminology Translator
 * Bridges formal accounting concepts (GAAP/IFRS) to intuitive, everyday explanations.
 */

export interface TermDefinition {
  standardTerm: string;
  abbreviation?: string;
  plainEnglish: string;
  oneLiner: string;
  whyItMatters: string;
  example: string;
}

export const FINANCIAL_GLOSSARY: Record<string, TermDefinition> = {
  // Financial Statements
  BALANCE_SHEET: {
    standardTerm: 'Balance Sheet (Statement of Financial Position)',
    abbreviation: 'B/S',
    plainEnglish: 'What You Own vs. What You Owe Snapshot',
    oneLiner: 'A financial snapshot on a single day showing what the business owns, what it owes to outsiders, and the leftover value belonging to the owner.',
    whyItMatters: 'Banks, auditors, and investors read this first to see if your company is financially sound or drowning in debt.',
    example: 'If you have $10,000 in cash/gear and owe $3,000 in loans, the owner\'s leftover share is $7,000.'
  },
  INCOME_STATEMENT: {
    standardTerm: 'Income Statement (Profit & Loss / P&L)',
    abbreviation: 'P&L',
    plainEnglish: 'Money Earned vs. Money Spent Scorecard',
    oneLiner: 'A summary of all revenues earned minus all business expenses over a specific period of time.',
    whyItMatters: 'Shows whether the business actually makes money after paying bills, or if it is losing money month-over-month.',
    example: 'Earned $25,000 in sales, spent $18,000 in supplies and rent = $7,000 Net Profit.'
  },
  CASH_FLOW: {
    standardTerm: 'Statement of Cash Flows (IAS 7 / GAAP)',
    abbreviation: 'CFS',
    plainEnglish: 'Real Cash In vs. Real Cash Out Tracker',
    oneLiner: 'Tracks literal bank and pocket cash moving in and out from daily operations, buying equipment, and loans/owner investments.',
    whyItMatters: 'A business can look profitable on paper while still going bankrupt if customer money hasn\'t actually arrived in the bank.',
    example: 'You sent $10,000 in invoices (P&L shows profit), but if customers haven\'t paid yet, your Cash Flow is $0.'
  },
  EQUITY_STATEMENT: {
    standardTerm: 'Statement of Changes in Equity',
    abbreviation: 'SOCE',
    plainEnglish: 'Owner Investment & Retained Profit Log',
    oneLiner: 'Shows how much money the owner put in, took out as drawings/dividends, and the profits kept inside the company.',
    whyItMatters: 'Essential for tax authorities and business partners to verify owner compensation and retained capital growth.',
    example: 'Started with $5,000 capital, added $2,000 profit, withdrew $1,000 for personal use = $6,000 Ending Equity.'
  },

  // Balance Sheet Items
  CURRENT_ASSETS: {
    standardTerm: 'Current Assets',
    abbreviation: 'CA',
    plainEnglish: 'Cash & Short-Term Money You Can Use Within a Year',
    oneLiner: 'Resources that are already cash or can be turned into cash within 12 months (like unpaid customer bills).',
    whyItMatters: 'This is the immediate fuel your business uses to pay monthly bills and staff payroll.',
    example: 'Bank checking account ($8,500) + Money owed by customers ($3,200).'
  },
  NON_CURRENT_ASSETS: {
    standardTerm: 'Non-Current / Fixed Assets (CapEx)',
    abbreviation: 'NCA',
    plainEnglish: 'Long-Term Tools, Machinery & Property',
    oneLiner: 'Durable equipment, vehicles, computers, or buildings used to run the business for multiple years.',
    whyItMatters: 'These aren\'t counted as simple daily expenses; their cost is spread over several years of productive use.',
    example: 'A commercial coffee machine ($4,500) or delivery van ($18,000).'
  },
  ACCOUNTS_RECEIVABLE: {
    standardTerm: 'Accounts Receivable',
    abbreviation: 'A/R',
    plainEnglish: 'Money Customers Owe You for Invoices Sent',
    oneLiner: 'The total value of goods or services already delivered to customers that they have not yet paid for.',
    whyItMatters: 'If this number gets too high or old, customers might default, starving your business of usable cash.',
    example: 'You completed a $2,400 project for client ABC on 30-day terms; ABC owes you $2,400.'
  },
  CURRENT_LIABILITIES: {
    standardTerm: 'Current Liabilities',
    abbreviation: 'CL',
    plainEnglish: 'Bills & Short-Term Debts Due Within 12 Months',
    oneLiner: 'All supplier bills, employee salaries, and loan payments you must pay within the upcoming year.',
    whyItMatters: 'If your Current Liabilities exceed your Current Assets, you may face immediate liquidity distress.',
    example: 'Next month\'s utility bills ($400) + supplier invoices ($1,800).'
  },
  ACCOUNTS_PAYABLE: {
    standardTerm: 'Accounts Payable',
    abbreviation: 'A/P',
    plainEnglish: 'Bills You Owe to Suppliers and Vendors',
    oneLiner: 'Bills received for products or services already received that your business has not paid yet.',
    whyItMatters: 'Paying on time protects your vendor relationships and avoids late payment penalties.',
    example: 'An invoice from your packaging supplier for $750 due in 15 days.'
  },
  RETAINED_EARNINGS: {
    standardTerm: 'Retained Earnings',
    abbreviation: 'RE',
    plainEnglish: 'All Past Profits Reinvested into the Business',
    oneLiner: 'The accumulated cumulative net profit of the company since day one, minus any money the owner took home.',
    whyItMatters: 'Proves the business has built self-sustaining wealth over time without relying purely on outside debt.',
    example: 'After 3 years of operations, $42,000 of past profits remain safely inside the company bank reserves.'
  },
  OWNER_EQUITY: {
    standardTerm: 'Owner\'s Equity / Shareholder Capital',
    abbreviation: 'OE',
    plainEnglish: 'Net Worth of the Business Belonging to You',
    oneLiner: 'The true financial stake you have in the business: Total Assets minus Total Liabilities.',
    whyItMatters: 'If you sold all company property today and paid off every loan, this is the exact cash you would walk away with.',
    example: '$50,000 total assets - $20,000 total debts = $30,000 Owner\'s Equity.'
  },

  // Income Statement Items
  GROSS_REVENUE: {
    standardTerm: 'Gross Revenue (Top Line)',
    abbreviation: 'REV',
    plainEnglish: 'Total Sales Billed Before Any Deductions',
    oneLiner: 'The full dollar amount of all products and services sold to customers.',
    whyItMatters: 'Measures total market demand for what you offer, before calculating what it cost to make.',
    example: 'Sold 100 subscriptions at $50 each = $5,000 Gross Revenue.'
  },
  COGS: {
    standardTerm: 'Cost of Goods Sold (Cost of Sales)',
    abbreviation: 'COGS',
    plainEnglish: 'Direct Costs to Produce What You Sold',
    oneLiner: 'Raw ingredients, inventory purchases, or direct worker wages needed specifically to create the product.',
    whyItMatters: 'If COGS is too high, you lose money on every unit sold no matter how many you sell.',
    example: 'For a $15 meal, $4.50 spent on meat, vegetables, and packaging is COGS.'
  },
  GROSS_PROFIT: {
    standardTerm: 'Gross Profit (Gross Margin)',
    abbreviation: 'GP',
    plainEnglish: 'Sales Money Left After Direct Production Costs',
    oneLiner: 'Gross Revenue minus Cost of Goods Sold. The pool of money available to pay overhead and rent.',
    whyItMatters: 'High gross margins give you breathing room to pay for marketing, administration, and expansion.',
    example: '$10,000 revenue - $3,500 direct costs = $6,500 Gross Profit (65% margin).'
  },
  OPERATING_EXPENSES: {
    standardTerm: 'Operating Expenses (SG&A Overhead)',
    abbreviation: 'OPEX',
    plainEnglish: 'Day-to-Day Overhead Costs (Rent, Power, Payroll)',
    oneLiner: 'The routine expenses required to keep the lights on and doors open, regardless of sales volume.',
    whyItMatters: 'Controlling overhead during slow sales months is what prevents businesses from running out of cash.',
    example: 'Store rent ($2,000) + Electricity & Internet ($350) + Office software ($150).'
  },
  OPERATING_INCOME: {
    standardTerm: 'Operating Income (EBIT)',
    abbreviation: 'EBIT',
    plainEnglish: 'Profit Generated Purely by Core Operations',
    oneLiner: 'Earnings Before Interest and Taxes; shows the true profitability of your business model.',
    whyItMatters: 'Lenders and buyers look at EBIT to evaluate operational competence stripped of financing tricks.',
    example: '$6,500 gross profit - $4,000 operating expenses = $2,500 Operating Income.'
  },
  NET_INCOME: {
    standardTerm: 'Net Income (Bottom Line / Net Profit)',
    abbreviation: 'NI',
    plainEnglish: 'The Final Cash Profit You Truly Keep',
    oneLiner: 'What remains after paying every single cost: COGS, overhead, loan interest, and government taxes.',
    whyItMatters: 'This is the ultimate score of business profitability that increases owner equity or funds dividends.',
    example: '$2,500 operating profit - $100 loan interest - $480 taxes = $1,920 Net Income.'
  },

  // Compliance & Regulatory
  DOUBLE_ENTRY: {
    standardTerm: 'Double-Entry Accounting Invariant (Assets = Liabilities + Equity)',
    abbreviation: 'A = L + E',
    plainEnglish: 'The Universal Balancing Scale',
    oneLiner: 'Every transaction has two sides (inflow and source); the balance sheet must always stay balanced to the penny.',
    whyItMatters: 'Mandated by regulatory standards and tax authorities worldwide to prevent unrecorded cash leakages.',
    example: 'Borrowing $5,000 increases Cash by +$5,000 (Asset) and increases Bank Loan by +$5,000 (Liability). Perfectly balanced.'
  },
  TAX_DEDUCTIBLE: {
    standardTerm: 'Tax-Deductible Business Expense',
    abbreviation: 'TAX-DED',
    plainEnglish: 'Legitimate Expense that Reduces Your Tax Bill',
    oneLiner: 'An ordinary and necessary business cost that legally lowers your taxable income under tax law.',
    whyItMatters: 'Proper categorization ensures you never pay more taxes than legally required while remaining audit-proof.',
    example: 'Spending $1,200 on business internet saves ~$240 in corporate income taxes at a 20% tax rate.'
  },
  VAT_SALES_TAX: {
    standardTerm: 'Value Added Tax (VAT) / Sales Tax Net Liability',
    abbreviation: 'VAT',
    plainEnglish: 'Tax Collected for Government Minus Tax You Paid on Purchases',
    oneLiner: 'The difference between Output Tax collected from customers and Input Tax credits paid to your vendors.',
    whyItMatters: 'Failure to remit collected VAT leads to severe tax authority penalties and immediate audits.',
    example: 'Collected $1,200 VAT on sales, paid $450 VAT on supplies = Remit $750 to the tax authority.'
  },
  AUDIT_TRAIL: {
    standardTerm: 'Immutable Audit Trail & Verifiable Source Documents',
    abbreviation: 'AUDIT',
    plainEnglish: 'Proof and History Log for Regulators',
    oneLiner: 'A chronological, tamper-evident log linking every single dollar in the books to a real invoice, bill, or receipt.',
    whyItMatters: 'External auditors and tax examiners require verifiable evidence before signing off on annual tax returns.',
    example: 'Transaction #402 is tied to verified PDF Tax Receipt #REC-9821 approved by Business Owner on Oct 14.'
  }
};

/**
 * Returns formatted dual label: "Standard Term [Abbr] · Plain English"
 */
export function getDualLabel(key: keyof typeof FINANCIAL_GLOSSARY, mode: 'DUAL' | 'PLAIN' | 'REGULATORY' = 'DUAL'): string {
  const item = FINANCIAL_GLOSSARY[key];
  if (!item) return key;

  if (mode === 'PLAIN') {
    return item.plainEnglish;
  }
  if (mode === 'REGULATORY') {
    return item.standardTerm;
  }
  return `${item.standardTerm} — ${item.plainEnglish}`;
}
