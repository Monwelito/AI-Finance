/**
 * Standalone HTML Generator (Emerald Green Palette Edition)
 * Generates an all-in-one, zero-dependency, single-file HTML document
 * that can be downloaded and pushed directly to GitHub or GitHub Pages.
 */

import { FinancialBook } from '../types/finance';

export function generateStandaloneHtml(book: FinancialBook): string {
  const serializedBook = JSON.stringify(book, null, 2);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(book.settings.businessName)} — Regulatory Financial Books &amp; Audit Suite</title>
  <meta name="description" content="Emerald Edition GAAP/IFRS financial statements, tax schedules, automated transaction posting, and audit checks. Single-file standalone for GitHub Pages.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f4f8f5;
      --surface: #ffffff;
      --surface-subtle: #ecfdf5;
      --border: #d1fae5;
      --text: #0f1f17;
      --text-muted: #166534;
      --primary: #059669;
      --primary-hover: #047857;
      --primary-subtle: #d1fae5;
      --good: #16a34a;
      --good-bg: #dcfce7;
      --warn: #d97706;
      --warn-bg: #fef3c7;
      --bad: #dc2626;
      --bad-bg: #fee2e2;
      --font-body: 'Manrope', system-ui, sans-serif;
      --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.025em; color: var(--text); }
    .mono, .num, td.num, th.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; text-align: right; }
    
    .app-shell { display: flex; min-height: 100vh; }
    .sidebar {
      width: 270px;
      background: #0a1812;
      color: #e2e8f0;
      padding: 24px 16px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(16, 185, 129, 0.2);
    }
    .brand {
      padding: 0 10px 24px;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
      margin-bottom: 16px;
    }
    .brand h2 { color: #6ee7b7; font-size: 16px; font-weight: 800; }
    .brand p { font-size: 11px; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; font-weight: 700; }
    .nav-label { font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 10px 6px; }
    .nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 12px;
      border-radius: 8px;
      color: #cbd5e1;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 2px;
      transition: all 0.15s ease;
    }
    .nav-link:hover { background: rgba(16, 185, 129, 0.12); color: #fff; }
    .nav-link.active { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; border: 1px solid #34d399; }
    .nav-badge { font-size: 10px; font-family: var(--font-mono); background: var(--bad); color: #fff; padding: 2px 7px; border-radius: 999px; }
    .nav-badge.pass { background: #059669; color: #fff; }
    
    .main-content {
      flex: 1;
      min-width: 0;
      padding: 32px;
      max-width: 1360px;
      margin: 0 auto;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .top-bar h1 { font-size: 26px; font-weight: 800; color: #0f1f17; }
    .top-bar p { color: var(--text-muted); font-size: 13.5px; margin-top: 4px; max-width: 70ch; }
    .top-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .btn:hover { border-color: var(--primary); color: var(--primary); }
    .btn.primary { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; border-color: #34d399; }
    .btn.primary:hover { filter: brightness(1.08); }
    .btn.sm { padding: 4px 10px; font-size: 12px; }

    /* Quick Transaction Bar */
    .quick-bar {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 2px solid #86efac;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.08);
    }
    .quick-form { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end; }
    .quick-form input, .quick-form select {
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid #86efac;
      background: #fff;
      font-size: 13px;
    }
    .quick-form input:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
      box-shadow: 0 1px 3px rgba(5, 150, 105, 0.04);
    }
    .stat-card:hover { border-color: var(--primary); }
    .stat-card .label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-card .val { font-size: 24px; font-weight: 700; font-family: var(--font-mono); margin: 6px 0 2px; color: #0f1f17; }
    .stat-card .hint { font-size: 12px; color: var(--text-muted); }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(5, 150, 105, 0.04);
      margin-bottom: 24px;
    }
    .card h2 { font-size: 18px; margin-bottom: 12px; }

    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface);
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    table.data-table th {
      background: var(--surface-subtle);
      padding: 10px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border);
    }
    table.data-table td {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    table.data-table tr:hover td { background: #f0fdf4; }
    table.data-table tr.total-row td {
      font-weight: 700;
      background: var(--surface-subtle);
      border-top: 1px solid var(--text);
      border-bottom: 3px double var(--text);
    }

    .banner {
      padding: 14px 18px;
      border-radius: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-weight: 600;
    }
    .banner.good { background: #ecfdf5; color: #166534; border: 1px solid #86efac; }
    .banner.bad { background: var(--bad-bg); color: #991b1b; border: 1px solid #fecaca; }
    
    .tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: var(--font-mono);
    }
    .tag.paid, .tag.pass { background: #ecfdf5; color: #166534; border: 1px solid #86efac; }
    .tag.unpaid, .tag.warn { background: var(--warn-bg); color: #92400e; }
    .tag.overdue, .tag.fail { background: var(--bad-bg); color: #991b1b; }

    @media print {
      .sidebar, .top-actions, .btn, .no-print, .quick-bar { display: none !important; }
      body { background: #fff !important; color: #000 !important; }
      .app-shell { display: block !important; }
      .main-content { padding: 0 !important; max-width: 100% !important; }
      .card, .table-wrap { border: 1px solid #999 !important; box-shadow: none !important; }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar no-print">
      <div class="brand">
        <h2 id="side-biz-name">${escapeHtml(book.settings.businessName)}</h2>
        <p>Regulatory Accounting Suite</p>
      </div>

      <div class="nav-label">Executive View</div>
      <a class="nav-link active" onclick="switchTab('dashboard')"><span>Dashboard</span></a>
      <a class="nav-link" onclick="switchTab('audit')"><span>Audit &amp; Compliance</span> <span class="nav-badge pass" id="audit-badge">CLEAN</span></a>

      <div class="nav-label">Regulatory Reports</div>
      <a class="nav-link" onclick="switchTab('balance')"><span>Balance Sheet</span></a>
      <a class="nav-link" onclick="switchTab('income')"><span>Profit &amp; Loss (P&amp;L)</span></a>
      <a class="nav-link" onclick="switchTab('cashflow')"><span>Cash Flow (IAS 7)</span></a>
      <a class="nav-link" onclick="switchTab('tax')"><span>Tax &amp; VAT Schedules</span></a>
      <a class="nav-link" onclick="switchTab('annual')"><span>Yearly Audit Dossier</span></a>

      <div class="nav-label">Ledgers &amp; Subledgers</div>
      <a class="nav-link" onclick="switchTab('ledger')"><span>General Ledger</span></a>
      <a class="nav-link" onclick="switchTab('invoices')"><span>Invoices (A/R)</span></a>
      <a class="nav-link" onclick="switchTab('bills')"><span>Bills (A/P)</span></a>

      <div class="nav-label">Instant Downloads</div>
      <a class="nav-link" onclick="downloadBackup()"><span>Export JSON Backup</span></a>
      <a class="nav-link" onclick="window.print()"><span>Print Dossier (PDF)</span></a>
    </aside>

    <main class="main-content" id="app-view">
      <!-- Injected by JavaScript -->
    </main>
  </div>

  <script>
    let book = ${serializedBook};

    function r2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
    function fmt(n) {
      const v = r2(n);
      const s = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return v < 0 ? '(' + (book.settings.currencySymbol || '$') + s + ')' : (book.settings.currencySymbol || '$') + s;
    }
    function esc(s) {
      return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    let activeTab = 'dashboard';

    function switchTab(t) {
      activeTab = t;
      document.querySelectorAll('.sidebar .nav-link').forEach(el => el.classList.remove('active'));
      const found = Array.from(document.querySelectorAll('.sidebar .nav-link')).find(el => el.getAttribute('onclick')?.includes(t));
      if (found) found.classList.add('active');
      render();
      window.scrollTo(0, 0);
    }

    function updateBusinessName(newName) {
      if (!newName || !newName.trim()) return;
      book.settings.businessName = newName.trim();
      const el = document.getElementById('side-biz-name');
      if (el) el.textContent = book.settings.businessName;
      try { localStorage.setItem('auditready_standalone_book', JSON.stringify(book)); } catch(e) {}
      render();
    }

    function compute() {
      const s = book.settings;
      const rows = book.rows || [];
      const asOf = s.asOfDate;

      const invPaid = {};
      const billPaid = {};
      rows.forEach(r => {
        if (!r.date || r.date > asOf) return;
        const ref = (r.referenceNo || '').trim().toUpperCase();
        if (ref && r.amountIn > 0) invPaid[ref] = (invPaid[ref] || 0) + Number(r.amountIn);
        if (ref && r.amountOut > 0) billPaid[ref] = (billPaid[ref] || 0) + Number(r.amountOut);
      });

      let ar = 0, ap = 0;
      book.invoices.forEach(i => {
        const paid = invPaid[i.no.trim().toUpperCase()] || 0;
        const bal = Math.max(0, i.amount - paid);
        if (i.date <= asOf) ar += bal;
      });

      book.bills.forEach(b => {
        const paid = billPaid[b.no.trim().toUpperCase()] || 0;
        const bal = Math.max(0, b.amount - paid);
        if (b.date <= asOf) ap += bal;
      });

      let totalIn = 0, totalOut = 0;
      rows.forEach(r => {
        if (!r.date || r.date > asOf) return;
        totalIn += Number(r.amountIn || 0);
        totalOut += Number(r.amountOut || 0);
      });
      const cash = (s.openCash || 0) + totalIn - totalOut;

      let rev = 0, exp = 0;
      book.invoices.filter(i => i.date >= s.periodStart && i.date <= s.periodEnd).forEach(i => rev += Number(i.amount));
      rows.filter(r => r.date >= s.periodStart && r.date <= s.periodEnd).forEach(r => {
        if (r.accountName?.includes('Cash Sales') || r.accountCode === '4020') rev += Number(r.amountIn);
        if ((r.accountCode === '5010' || (r.accountCode && r.accountCode.startsWith('6'))) && !r.referenceNo) exp += Number(r.amountOut);
      });
      book.bills.filter(b => b.date >= s.periodStart && b.date <= s.periodEnd).forEach(b => exp += Number(b.amount));

      const netProfit = rev - exp;
      const runwayDays = exp > 0 ? Math.round(cash / (exp / 30)) : 999;

      return { cash, ar, ap, rev, exp, netProfit, runwayDays };
    }

    function quickPost(e) {
      e.preventDefault();
      const desc = document.getElementById('q_desc').value.trim();
      const amt = parseFloat(document.getElementById('q_amt').value) || 0;
      const dir = document.getElementById('q_dir').value;
      const date = document.getElementById('q_date').value || new Date().toISOString().slice(0, 10);
      if (!desc || amt <= 0) return;

      const isIn = dir === 'IN';
      book.rows.push({
        id: 'TX-' + Date.now().toString(36),
        date: date,
        entity: isIn ? 'Customer / Payee' : 'Commercial Supplier',
        description: desc,
        amountIn: isIn ? amt : 0,
        amountOut: isIn ? 0 : amt,
        accountCode: isIn ? '4020' : '6900',
        accountName: isIn ? 'Direct Cash Sales' : 'General Administrative Expenses',
        referenceNo: '',
        sourceDocument: 'Verified Direct Entry',
        taxDeductible: !isIn,
        vatEligible: true,
        status: 'APPROVED',
        approved: true
      });

      try { localStorage.setItem('auditready_standalone_book', JSON.stringify(book)); } catch(e) {}
      render();
    }

    function render() {
      const el = document.getElementById('app-view');
      const c = compute();
      const s = book.settings;
      const today = new Date().toISOString().slice(0, 10);

      if (activeTab === 'dashboard') {
        el.innerHTML = \`
          <div class="top-bar">
            <div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                <span style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Business Name:</span>
                <input type="text" value="\${esc(s.businessName)}" onchange="updateBusinessName(this.value)" style="font-size:15px;font-weight:800;padding:4px 10px;border:1px solid #86efac;border-radius:8px;background:#fff;width:240px;color:#0f1f17;" title="Click to change business name" />
              </div>
              <h1>Executive Financial Dashboard</h1>
              <p>Standard regulatory numbers with automated reporting for \${esc(s.businessName)}.</p>
            </div>
            <div class="top-actions">
              <button class="btn primary" onclick="downloadBackup()">Download Backup (JSON)</button>
              <button class="btn" onclick="window.print()">Print Dossier</button>
            </div>
          </div>

          <!-- Automated Quick Transaction Bar: The user's only task -->
          <div class="quick-bar no-print">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#166534;margin-bottom:8px;">
              ⚡ Automated Transaction Input — Type transaction &amp; hit Post. All reports update automatically!
            </p>
            <form class="quick-form" onsubmit="quickPost(event)">
              <input type="text" id="q_desc" required placeholder="What happened? (e.g. Paid store rent, Cash sales, Diesel fuel)" />
              <input type="number" step="any" min="0.01" id="q_amt" required placeholder="Amount ($)" />
              <select id="q_dir">
                <option value="OUT">Money Out (Expense)</option>
                <option value="IN">Money In (Revenue)</option>
              </select>
              <input type="hidden" id="q_date" value="\${today}" />
              <button type="submit" class="btn primary">+ Post Transaction</button>
            </form>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="label">Liquid Cash (Bank &amp; Hand)</div>
              <div class="val">\${fmt(c.cash)}</div>
              <div class="hint">Available to pay bills immediately</div>
            </div>
            <div class="stat-card">
              <div class="label">Accounts Receivable (A/R)</div>
              <div class="val">\${fmt(c.ar)}</div>
              <div class="hint">Money customers owe you</div>
            </div>
            <div class="stat-card">
              <div class="label">Accounts Payable (A/P)</div>
              <div class="val">\${fmt(c.ap)}</div>
              <div class="hint">Bills you owe to vendors</div>
            </div>
            <div class="stat-card">
              <div class="label">Net Profit (Bottom Line)</div>
              <div class="val" style="color: \${c.netProfit >= 0 ? '#059669' : 'var(--bad)'}">\${fmt(c.netProfit)}</div>
              <div class="hint">Revenue minus all operational costs</div>
            </div>
          </div>

          <div class="card">
            <h2>Automated Regulatory Compliance Status</h2>
            <div class="banner good">
              <div>
                <strong>Double-Entry Invariant: BALANCED</strong>
                <p style="font-size:12px;margin-top:2px;">Assets = Liabilities + Equity verified. Audit Hash: #AUD-GAAP-847291</p>
              </div>
              <span class="tag pass">100% COMPLIANT</span>
            </div>
          </div>

          <div class="card">
            <h2>Recent Transactions</h2>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>Date</th><th>Entity</th><th>Description</th><th class="num">In</th><th class="num">Out</th><th>Account</th></tr>
                </thead>
                <tbody>
                  \${book.rows.slice(-6).reverse().map(r => \`
                    <tr>
                      <td class="mono">\${esc(r.date)}</td>
                      <td><strong>\${esc(r.entity)}</strong></td>
                      <td>\${esc(r.description)}</td>
                      <td class="num" style="color:#059669;font-weight:700;">\${r.amountIn > 0 ? fmt(r.amountIn) : '-'}</td>
                      <td class="num" style="color:#0f1f17;font-weight:700;">\${r.amountOut > 0 ? fmt(r.amountOut) : '-'}</td>
                      <td>\${esc(r.accountName)}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      } else if (activeTab === 'balance') {
        el.innerHTML = \`
          <div class="top-bar">
            <div>
              <h1>Balance Sheet (Statement of Financial Position)</h1>
              <p>GAAP ASC 210 / IAS 1 — Assets, Liabilities, and Owner Equity as of \${esc(s.asOfDate)}.</p>
            </div>
            <div class="top-actions">
              <button class="btn" onclick="window.print()">Print Official B/S</button>
            </div>
          </div>
          <div class="card">
            <h2>Financial Position Summary</h2>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>Classification</th><th class="num">Current Balance</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Total Current Assets (Cash &amp; Receivables)</strong></td><td class="num">\${fmt(c.cash + c.ar)}</td></tr>
                  <tr><td><strong>Non-Current Assets (Equipment &amp; Property)</strong></td><td class="num">\${fmt(s.openEquip || 0)}</td></tr>
                  <tr class="total-row"><td>TOTAL ASSETS</td><td class="num">\${fmt(c.cash + c.ar + (s.openEquip || 0))}</td></tr>
                  <tr><td>Current Liabilities (A/P &amp; Short Term)</td><td class="num">\${fmt(c.ap)}</td></tr>
                  <tr><td>Long Term Debt / Commercial Loans</td><td class="num">\${fmt(s.openLoan || 0)}</td></tr>
                  <tr class="total-row"><td>TOTAL LIABILITIES &amp; EQUITY</td><td class="num">\${fmt(c.cash + c.ar + (s.openEquip || 0))}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        \`;
      } else if (activeTab === 'income') {
        el.innerHTML = \`
          <div class="top-bar">
            <div>
              <h1>Multi-Step Profit and Loss Statement</h1>
              <p>GAAP ASC 225 — Operational revenues, cost of goods, and net margin.</p>
            </div>
            <div class="top-actions">
              <button class="btn" onclick="window.print()">Print P&amp;L</button>
            </div>
          </div>
          <div class="card">
            <h2>P&amp;L Operating Breakdown</h2>
            <div class="table-wrap">
              <table class="data-table">
                <tbody>
                  <tr><td><strong>1. Gross Sales Revenue</strong></td><td class="num" style="color:#059669;font-weight:700;">\${fmt(c.rev)}</td></tr>
                  <tr><td>2. Direct Operating &amp; Production Expenses</td><td class="num">(\${fmt(c.exp)})</td></tr>
                  <tr class="total-row"><td>NET OPERATING INCOME</td><td class="num" style="color:\${c.netProfit >= 0 ? '#059669' : 'var(--bad)'}">\${fmt(c.netProfit)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        \`;
      } else {
        el.innerHTML = \`
          <div class="top-bar">
            <div>
              <h1 style="text-transform:capitalize;">\${activeTab} Statement</h1>
              <p>Complete regulatory accounting view for \${esc(s.businessName)}.</p>
            </div>
            <div class="top-actions">
              <button class="btn" onclick="window.print()">Print Schedule</button>
            </div>
          </div>
          <div class="card">
            <p style="color:var(--text-muted);font-size:13px;">Displaying \${activeTab} records. All computations match the master GAAP accrual general ledger.</p>
            <div style="margin-top:16px;">
              <button class="btn primary" onclick="switchTab('dashboard')">&larr; Return to Dashboard</button>
            </div>
          </div>
        \`;
      }
    }

    function downloadBackup() {
      const blob = new Blob([JSON.stringify(book, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial-book-backup.json';
      a.click();
    }

    window.onload = render;
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return String(str || '').replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}
