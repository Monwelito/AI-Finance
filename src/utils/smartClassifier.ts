/**
 * Smart Financial Classifier
 * Automatically infers standard accounting categorization, GAAP account codes,
 * tax deductibility, and subledger links from natural user transaction descriptions.
 */

import { STANDARD_CHART_OF_ACCOUNTS } from './financeEngine';
import { FinancialBook } from '../types/finance';

export interface ClassificationResult {
  direction: 'IN' | 'OUT';
  accountCode: string;
  accountName: string;
  category: string;
  taxDeductible: boolean;
  vatEligible: boolean;
  suggestedEntity: string;
  suggestedReference: string;
  sourceDocument: string;
  confidence: 'HIGH' | 'MEDIUM';
}

export function autoClassifyTransaction(
  description: string,
  userDirection: 'AUTO' | 'IN' | 'OUT' = 'AUTO',
  book?: FinancialBook
): ClassificationResult {
  const text = (description || '').toLowerCase().trim();

  // 1. Check for matching invoices if incoming or auto
  if (book && book.invoices && (userDirection === 'AUTO' || userDirection === 'IN')) {
    const matchedInv = book.invoices.find(inv => {
      const noMatch = text.includes(inv.no.toLowerCase());
      const custMatch = text.includes(inv.customerId.toLowerCase());
      return noMatch || custMatch;
    });
    if (matchedInv) {
      const cust = book.customers?.find(c => c.id === matchedInv.customerId);
      return {
        direction: 'IN',
        accountCode: '1100',
        accountName: 'Accounts Receivable',
        category: 'ASSET_CURRENT',
        taxDeductible: false,
        vatEligible: true,
        suggestedEntity: cust ? cust.name : matchedInv.customerId,
        suggestedReference: matchedInv.no,
        sourceDocument: `Payment against Tax Invoice #${matchedInv.no}`,
        confidence: 'HIGH'
      };
    }
  }

  // 2. Check for matching bills if outgoing or auto
  if (book && book.bills && (userDirection === 'AUTO' || userDirection === 'OUT')) {
    const matchedBill = book.bills.find(b => {
      const noMatch = text.includes(b.no.toLowerCase());
      const vendorMatch = text.includes(b.vendor.toLowerCase());
      return noMatch || vendorMatch;
    });
    if (matchedBill) {
      return {
        direction: 'OUT',
        accountCode: matchedBill.accountCode || '2010',
        accountName: matchedBill.accountName || 'Accounts Payable',
        category: 'LIABILITY_CURRENT',
        taxDeductible: true,
        vatEligible: true,
        suggestedEntity: matchedBill.vendor,
        suggestedReference: matchedBill.no,
        sourceDocument: `Settlement of Vendor Bill #${matchedBill.no}`,
        confidence: 'HIGH'
      };
    }
  }

  // 3. Keyword Pattern Matching
  // Rent & Lease
  if (/rent|lease|occupancy|warehouse space|office lease/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '6200',
      accountName: 'Rent & Leasehold Occupancy',
      category: 'EXPENSE_OPERATING',
      taxDeductible: true,
      vatEligible: false,
      suggestedEntity: 'Commercial Plaza Landlord',
      suggestedReference: 'LEASE-RENT',
      sourceDocument: 'Commercial Lease Agreement & Wire Receipt',
      confidence: 'HIGH'
    };
  }

  // Utilities & Telecom
  if (/electric|electricity|power|water|utility|utilities|internet|phone|wifi|telecom|broadband/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '6300',
      accountName: 'Utilities & Telecommunications',
      category: 'EXPENSE_OPERATING',
      taxDeductible: true,
      vatEligible: true,
      suggestedEntity: 'City Utility & Telecom Provider',
      suggestedReference: 'UTIL-BILL',
      sourceDocument: 'Official Utility Statement / Tax Invoice',
      confidence: 'HIGH'
    };
  }

  // Payroll, Wages, Staff
  if (/payroll|salary|salaries|wage|wages|staff|helper|worker|personnel|compensation|labor/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '6100',
      accountName: 'Wages & Compensation',
      category: 'EXPENSE_OPERATING',
      taxDeductible: true,
      vatEligible: false,
      suggestedEntity: 'Operations Staff & Employees',
      suggestedReference: 'PAYROLL',
      sourceDocument: 'Signed Periodic Payroll Ledger',
      confidence: 'HIGH'
    };
  }

  // Fuel, Transportation, Delivery, Shipping
  if (/fuel|gas|gasoline|diesel|freight|delivery|courier|transport|shipping|toll|vehicle/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '6400',
      accountName: 'Freight, Delivery & Transportation',
      category: 'EXPENSE_OPERATING',
      taxDeductible: true,
      vatEligible: true,
      suggestedEntity: 'Logistics & Fuel Station',
      suggestedReference: 'FUEL-RCPT',
      sourceDocument: 'Gas Station Electronic Tax Receipt',
      confidence: 'HIGH'
    };
  }

  // Materials, Inventory, Raw Supplies, COGS
  if (/material|inventory|raw|stock|resale|supplies|packaging|boxes|ingredients|wholesale/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '5010',
      accountName: 'Direct Materials & Inventory',
      category: 'COGS',
      taxDeductible: true,
      vatEligible: true,
      suggestedEntity: 'Wholesale Supplier Co.',
      suggestedReference: 'SUPP-INV',
      sourceDocument: 'Supplier Commercial Delivery Tax Invoice',
      confidence: 'HIGH'
    };
  }

  // Long-Term Equipment / Machinery / CapEx
  if (/computer|laptop|macbook|printer|hardware|equipment|machinery|scanner|forklift|camera|server/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '1500',
      accountName: 'Property, Plant & Equipment',
      category: 'ASSET_NON_CURRENT',
      taxDeductible: false, // Capitalized asset, expensed via depreciation
      vatEligible: true,
      suggestedEntity: 'Equipment Technology Corp',
      suggestedReference: 'CAPEX-EQ',
      sourceDocument: 'Capital Asset Purchase Invoice & Warranty Card',
      confidence: 'HIGH'
    };
  }

  // Owner Drawings / Withdrawals
  if (/draw|drawing|draws|dividend|owner personal|personal take|withdraw|proprietor/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '3020',
      accountName: 'Owner Distributions / Draws',
      category: 'EQUITY',
      taxDeductible: false,
      vatEligible: false,
      suggestedEntity: 'Company Proprietor / Owner',
      suggestedReference: 'OWNER-DRAW',
      sourceDocument: 'Authorized Owner Distribution Memo',
      confidence: 'HIGH'
    };
  }

  // Owner Capital Injection
  if (/capital|owner put in|investment|contribute|equity injection|owner deposit/.test(text)) {
    return {
      direction: 'IN',
      accountCode: '3010',
      accountName: 'Owner Contributed Capital',
      category: 'EQUITY',
      taxDeductible: false,
      vatEligible: false,
      suggestedEntity: 'Company Proprietor / Owner',
      suggestedReference: 'CAP-ADD',
      sourceDocument: 'Personal Capital Injection Bank Wire Advice',
      confidence: 'HIGH'
    };
  }

  // Loan Repayments or Proceeds
  if (/loan|debt|bank borrowing|principal|amortization/.test(text)) {
    const isPay = /payment|repay|pay/.test(text) || userDirection === 'OUT';
    return {
      direction: isPay ? 'OUT' : 'IN',
      accountCode: '2500',
      accountName: 'Long-Term Commercial Debt',
      category: 'LIABILITY_NON_CURRENT',
      taxDeductible: false,
      vatEligible: false,
      suggestedEntity: 'Commercial Financing Bank',
      suggestedReference: 'LN-001',
      sourceDocument: isPay ? 'Loan Principal Debit Advice' : 'Commercial Loan Credit Advice',
      confidence: 'HIGH'
    };
  }

  // Professional Services & Software
  if (/software|saas|app|cpa|lawyer|legal|accounting|consulting|subscription|cloud/.test(text)) {
    return {
      direction: 'OUT',
      accountCode: '6600',
      accountName: 'Professional Services & Software',
      category: 'EXPENSE_OPERATING',
      taxDeductible: true,
      vatEligible: true,
      suggestedEntity: 'Service Provider / Software Vendor',
      suggestedReference: 'SUB-INV',
      sourceDocument: 'Electronic VAT Subscription Receipt',
      confidence: 'HIGH'
    };
  }

  // Default Inflow: Direct Cash Sales / Customer Revenue
  if (userDirection === 'IN' || /sale|sales|customer|payment|sold|pos|cash register|order|client/.test(text)) {
    return {
      direction: 'IN',
      accountCode: '4020',
      accountName: 'Direct Cash Sales',
      category: 'REVENUE',
      taxDeductible: false,
      vatEligible: true,
      suggestedEntity: 'Walk-In / Direct Customer',
      suggestedReference: 'POS-REC',
      sourceDocument: 'Customer Sales Receipt / Register Audit Roll',
      confidence: 'MEDIUM'
    };
  }

  // Default Outflow: General Administrative Overhead
  return {
    direction: 'OUT',
    accountCode: '6900',
    accountName: 'General Administrative Expenses',
    category: 'EXPENSE_OPERATING',
    taxDeductible: true,
    vatEligible: true,
    suggestedEntity: 'Commercial Vendor',
    suggestedReference: 'EXP-DOC',
    sourceDocument: 'Commercial Invoice / Voucher Receipt',
    confidence: 'MEDIUM'
  };
}
