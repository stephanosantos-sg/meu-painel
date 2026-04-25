/* Orbita v2 — Financeiro: controle de gastos, cartões, orçamento + IA assistant */

/* ── Defaults: contas/cartões e categorias inferidos da planilha do Stephano ── */
const FIN_DEFAULT_ACCOUNTS = [
  { id: 'itau-stephano', name: 'Itaú Stephano', type: 'credit', color: '#ec7000', closingDay: 25, dueDay: 5 },
  { id: 'nubank-sheida', name: 'Nubank Sheida', type: 'credit', color: '#820ad1', closingDay: 18, dueDay: 25 },
  { id: 'visa-sheida', name: 'Visa Sheida', type: 'credit', color: '#1a1f71', closingDay: 10, dueDay: 17 },
  { id: 'pix-stephano', name: 'PIX Stephano', type: 'pix', color: '#3ccf91' },
  { id: 'pix-sheida', name: 'PIX Sheida', type: 'pix', color: '#3ccf91' },
  { id: 'pix-lica', name: 'PIX Lica', type: 'pix', color: '#3ccf91' },
  { id: 'pix-babajam', name: 'PIX Babajam', type: 'pix', color: '#3ccf91' },
  { id: 'boleto', name: 'Boleto', type: 'boleto', color: '#9ea5b8' },
  { id: 'dinheiro', name: 'Dinheiro', type: 'cash', color: '#ffd60a' },
];

const FIN_META_CATS = [
  { id: 'necessidades', name: 'Necessidades Básicas', color: '#5b8dff', pct: 0.55 },
  { id: 'lazer', name: 'Lazer', color: '#ff2e88', pct: 0.10 },
  { id: 'dividas', name: 'Dívidas', color: '#ff5555', pct: 0.10 },
  { id: 'liberdade', name: 'Liberdade Financeira', color: '#3ccf91', pct: 0.10 },
  { id: 'longo-prazo', name: 'Longo Prazo', color: '#b066ff', pct: 0.10 },
  { id: 'colchao', name: 'Colchão', color: '#ffa830', pct: 0.05 },
];

const FIN_DEFAULT_CATEGORIES = [
  { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#5b8dff', meta: 'necessidades' },
  { id: 'saude', name: 'Saúde', icon: '🏥', color: '#3ccf91', meta: 'necessidades' },
  { id: 'comida', name: 'Comida', icon: '🍽️', color: '#ffa830', meta: 'necessidades' },
  { id: 'servicos', name: 'Serviços', icon: '⚙️', color: '#64d2ff', meta: 'necessidades' },
  { id: 'impostos', name: 'Impostos e Taxas', icon: '📋', color: '#9ea5b8', meta: 'necessidades' },
  { id: 'nina', name: 'Nina', icon: '👶', color: '#ffd76a', meta: 'necessidades' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#64d2ff', meta: 'necessidades' },
  { id: 'mercado', name: 'Mercado', icon: '🛒', color: '#3ccf91', meta: 'necessidades' },
  { id: 'lazer', name: 'Lazer', icon: '🎬', color: '#ff2e88', meta: 'lazer' },
  { id: 'compras', name: 'Compras', icon: '🛍️', color: '#b066ff', meta: 'lazer' },
  { id: 'presentes', name: 'Presentes', icon: '🎁', color: '#ff5a3c', meta: 'lazer' },
  { id: 'delivery', name: 'Delivery', icon: '🛵', color: '#ffd60a', meta: 'lazer' },
  { id: 'dividas', name: 'Dívidas', icon: '💸', color: '#ff5555', meta: 'dividas' },
  { id: 'cartao', name: 'Cartão de Crédito', icon: '💳', color: '#ff5a3c', meta: 'dividas' },
  { id: 'investimento', name: 'Investimento', icon: '💎', color: '#3ccf91', meta: 'liberdade' },
  { id: 'longo-prazo', name: 'Longo Prazo', icon: '🌱', color: '#b066ff', meta: 'longo-prazo' },
  { id: 'colchao', name: 'Colchão', icon: '🛡️', color: '#ffa830', meta: 'colchao' },
];

/* ── Helpers ── */
function finFmt(v) {
  const n = parseFloat(v) || 0;
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function finFmtShort(v) {
  const n = parseFloat(v) || 0;
  if (Math.abs(n) >= 1000) return 'R$ ' + (n/1000).toFixed(1) + 'k';
  return 'R$ ' + n.toFixed(0);
}
function finMonth(date) {
  if (!date) return '';
  return date.slice(0, 7);
}
function finPrevMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function finMonthLabel(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
function finCurrentMonth() { return Orbita.todayStr().slice(0, 7); }
function finEnsure(D) {
  if (!D._finance) D._finance = {};
  const F = D._finance;
  if (!F.accounts) F.accounts = JSON.parse(JSON.stringify(FIN_DEFAULT_ACCOUNTS));
  if (!F.categories) F.categories = JSON.parse(JSON.stringify(FIN_DEFAULT_CATEGORIES));
  if (!F.transactions) F.transactions = [];
  if (!F.recurring) F.recurring = [];
  if (typeof F.monthlyIncome !== 'number') F.monthlyIncome = 0;
  if (!F.budgetAllocation) {
    F.budgetAllocation = {};
    FIN_META_CATS.forEach(m => F.budgetAllocation[m.id] = m.pct);
  }
  return F;
}
window.finEnsure = finEnsure;

/* ────────────────────────────────────────────────────────── */
/* Main screen */
/* ────────────────────────────────────────────────────────── */
function ScreenFinance() {
  const { data, commit } = useData();
  const [tab, setTab] = React.useState('resumo');
  const [month, setMonth] = React.useState(finCurrentMonth());
  const fin = data._finance || {};
  const accounts = fin.accounts || FIN_DEFAULT_ACCOUNTS;
  const categories = fin.categories || FIN_DEFAULT_CATEGORIES;
  const txs = fin.transactions || [];
  const recurring = fin.recurring || [];
  const income = fin.monthlyIncome || 0;

  const monthTxs = txs.filter(t => finMonth(t.date) === month);
  const totalSpent = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const balance = income - totalSpent;

  // Init defaults if first time
  React.useEffect(() => {
    if (!data._finance || !data._finance.accounts) {
      commit(D => { finEnsure(D); });
    }
  }, []);

  return (
    <>
      <TopBar title="Financeiro." subtitle={`${finFmt(totalSpent)} gastos · ${finFmt(balance)} ${balance >= 0 ? 'sobra' : 'estouro'}`}
        actions={
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { v: 'resumo', l: 'Resumo' },
              { v: 'lancamentos', l: 'Lançamentos' },
              { v: 'cartoes', l: 'Cartões' },
              { v: 'categorias', l: 'Categorias' },
              { v: 'recorrentes', l: 'Recorrentes' },
              { v: 'orcamento', l: 'Orçamento' },
            ].map(t => (
              <button key={t.v} className={`tab-btn ${tab === t.v ? 'active' : ''}`} onClick={() => setTab(t.v)}>{t.l}</button>
            ))}
          </div>
        }
      />
      <div style={{ padding: '0 28px 100px' }}>
        <FinMonthSwitcher month={month} setMonth={setMonth} />
        {tab === 'resumo' && <FinResumo month={month} fin={fin} commit={commit} />}
        {tab === 'lancamentos' && <FinLancamentos month={month} fin={fin} commit={commit} />}
        {tab === 'cartoes' && <FinCartoes month={month} fin={fin} commit={commit} />}
        {tab === 'categorias' && <FinCategorias month={month} fin={fin} commit={commit} />}
        {tab === 'recorrentes' && <FinRecorrentes fin={fin} commit={commit} />}
        {tab === 'orcamento' && <FinOrcamento fin={fin} commit={commit} />}
      </div>
    </>
  );
}

/* ── Month switcher ── */
function FinMonthSwitcher({ month, setMonth }) {
  function shift(delta) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <button className="icon-btn" onClick={() => shift(-1)} style={{ width: 32, height: 32, fontSize: 14 }}>‹</button>
      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, lineHeight: 1, textTransform: 'capitalize', minWidth: 180 }}>{finMonthLabel(month)}</div>
      <button className="icon-btn" onClick={() => shift(1)} style={{ width: 32, height: 32, fontSize: 14 }}>›</button>
      <button className="btn-ghost small" onClick={() => setMonth(finCurrentMonth())} style={{ fontSize: 11 }}>Hoje</button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Resumo / Dashboard */
/* ────────────────────────────────────────────────────────── */
function FinResumo({ month, fin, commit }) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const income = fin.monthlyIncome || 0;
  const budgetAlloc = fin.budgetAllocation || {};

  const monthTxs = txs.filter(t => finMonth(t.date) === month);
  const prevMonthTxs = txs.filter(t => finMonth(t.date) === finPrevMonth(month));

  const totalSpent = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalPending = monthTxs.filter(t => t.status === 'pending').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalInvested = monthTxs.filter(t => {
    const c = categories.find(x => x.id === t.categoryId);
    return c && (c.meta === 'liberdade' || c.meta === 'longo-prazo' || c.meta === 'colchao');
  }).reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const balance = income - totalSpent;
  const prevSpent = prevMonthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const variation = prevSpent ? ((totalSpent - prevSpent) / prevSpent * 100) : 0;

  // By category
  const byCat = {};
  monthTxs.forEach(t => {
    const c = categories.find(x => x.id === t.categoryId) || { id: '_uncat', name: 'Sem categoria', color: '#666', icon: '•' };
    if (!byCat[c.id]) byCat[c.id] = { cat: c, value: 0, count: 0 };
    byCat[c.id].value += parseFloat(t.value) || 0;
    byCat[c.id].count += 1;
  });
  const catRows = Object.values(byCat).sort((a, b) => b.value - a.value);

  // By meta-cat (for budget rule)
  const byMeta = {};
  FIN_META_CATS.forEach(m => byMeta[m.id] = 0);
  monthTxs.forEach(t => {
    const c = categories.find(x => x.id === t.categoryId);
    if (c && c.meta) byMeta[c.meta] = (byMeta[c.meta] || 0) + (parseFloat(t.value) || 0);
  });

  // By account/meio
  const byAccount = {};
  monthTxs.forEach(t => {
    const a = accounts.find(x => x.id === t.accountId) || { id: '_unk', name: 'Outro', color: '#666' };
    if (!byAccount[a.id]) byAccount[a.id] = { account: a, value: 0, count: 0 };
    byAccount[a.id].value += parseFloat(t.value) || 0;
    byAccount[a.id].count += 1;
  });
  const accRows = Object.values(byAccount).sort((a, b) => b.value - a.value);

  // Top 5 transactions
  const top5 = [...monthTxs].sort((a, b) => (parseFloat(b.value) || 0) - (parseFloat(a.value) || 0)).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero */}
      <div className="panel" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%',
          background: balance >= 0
            ? 'radial-gradient(ellipse at right, rgba(60,207,145,0.18), transparent 70%)'
            : 'radial-gradient(ellipse at right, rgba(255,85,85,0.18), transparent 70%)',
          pointerEvents: 'none' }} />
        <div className="eyebrow">Saldo do mês</div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 56, lineHeight: 1, marginTop: 6, color: balance >= 0 ? '#3ccf91' : '#ff5555' }}>
          {finFmt(balance)}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>
          {finFmt(income)} renda − {finFmt(totalSpent)} gastos
        </div>
        <div style={{ marginTop: 16, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: income ? `${Math.min(100, totalSpent / income * 100)}%` : '0%',
            background: totalSpent > income ? '#ff5555' : 'var(--gradient-neon)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--ink-3)' }} className="mono">
          <span>{income ? Math.round(totalSpent / income * 100) : 0}% da renda usado</span>
          <span>{prevSpent ? (variation > 0 ? '↑' : '↓') + ' ' + Math.abs(variation).toFixed(0) + '% vs mês anterior' : ''}</span>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Renda', value: finFmt(income), color: '#3ccf91' },
          { label: 'Gastos', value: finFmt(totalSpent), color: '#ff5a3c' },
          { label: 'Falta pagar', value: finFmt(totalPending), color: '#ffa830' },
          { label: 'Investido', value: finFmt(totalInvested), color: 'var(--neon-c)' },
        ].map(s => (
          <div key={s.label} className="panel" style={{ padding: 14 }}>
            <div className="eyebrow">{s.label}</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 500, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Two columns: by category + by account */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="screen-grid">
        {/* By category */}
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Por categoria</div>
          {catRows.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Sem lançamentos neste mês</div>}
          {/* Donut chart */}
          {catRows.length > 0 && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <FinDonut data={catRows.map(r => ({ value: r.value, color: r.cat.color }))} size={120} total={totalSpent} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {catRows.slice(0, 5).map(r => (
                  <div key={r.cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: r.cat.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.cat.icon} {r.cat.name}</span>
                    <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(r.value / totalSpent * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Full list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {catRows.map(r => (
              <div key={r.cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{r.cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{r.cat.name}</span>
                    <span className="mono" style={{ fontSize: 11, color: r.cat.color, fontWeight: 600 }}>{finFmt(r.value)}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: totalSpent ? `${r.value / totalSpent * 100}%` : '0%', background: r.cat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By account/meio */}
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Por meio</div>
          {accRows.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Sem lançamentos</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {accRows.map(r => (
              <div key={r.account.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <div style={{ width: 8, height: 28, borderRadius: 2, background: r.account.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{r.account.name}</div>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{r.count} lançamentos</div>
                </div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{finFmt(r.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget rule (55/10/10/10/10/5) */}
      <div className="panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div style={{ fontWeight: 600 }}>Regra do orçamento (55/10/10/10/10/5)</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>real vs ideal · base {finFmt(income)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {FIN_META_CATS.map(m => {
            const real = byMeta[m.id] || 0;
            const target = income * (budgetAlloc[m.id] || m.pct);
            const pct = target ? Math.round(real / target * 100) : 0;
            const over = real > target;
            return (
              <div key={m.id} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</span>
                  <span className="mono" style={{ fontSize: 10, color: over ? '#ff5555' : 'var(--ink-3)' }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: over ? '#ff5555' : m.color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }} className="mono">
                  <span style={{ color: m.color }}>{finFmt(real)}</span>
                  <span style={{ color: 'var(--ink-3)' }}>/ {finFmt(target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 + last transactions */}
      {top5.length > 0 && (
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Top 5 maiores gastos</div>
          {top5.map((t, i) => {
            const cat = categories.find(c => c.id === t.categoryId);
            const acc = accounts.find(a => a.id === t.accountId);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < top5.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', width: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 14 }}>{cat?.icon || '•'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{Orbita.fmtDate(t.date)} · {acc?.name || '—'}{t.installment ? ` · ${t.installment.current}/${t.installment.total}` : ''}</div>
                </div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: '#ff5a3c' }}>{finFmt(t.value)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Donut chart (SVG) ── */
function FinDonut({ data, size = 120, total }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
      {data.map((d, i) => {
        const len = (d.value / sum) * c;
        const seg = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth="14"
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`} />
        );
        offset += len;
        return seg;
      })}
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">total</text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" fontSize="13" fill="#fff" fontWeight="600" fontFamily="var(--font-mono)">{finFmtShort(total)}</text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Lançamentos */
/* ────────────────────────────────────────────────────────── */
function FinLancamentos({ month, fin, commit }) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const [showAdd, setShowAdd] = React.useState(false);
  const [editTx, setEditTx] = React.useState(null);
  const [filterCat, setFilterCat] = React.useState(null);
  const [filterAcc, setFilterAcc] = React.useState(null);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [search, setSearch] = React.useState('');

  let monthTxs = txs.filter(t => finMonth(t.date) === month);
  if (filterCat) monthTxs = monthTxs.filter(t => t.categoryId === filterCat);
  if (filterAcc) monthTxs = monthTxs.filter(t => t.accountId === filterAcc);
  if (filterStatus !== 'all') monthTxs = monthTxs.filter(t => (t.status || 'paid') === filterStatus);
  if (search.trim()) {
    const s = search.toLowerCase();
    monthTxs = monthTxs.filter(t => (t.description || '').toLowerCase().includes(s));
  }
  monthTxs = [...monthTxs].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const totalFiltered = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);

  function deleteTx(id) {
    const tx = txs.find(t => t.id === id);
    if (!tx) return;
    const groupId = tx.parentId || tx.id;
    const siblings = txs.filter(t => (t.parentId === groupId || t.id === groupId) && (t.installment));
    if (siblings.length > 1) {
      const choice = confirm(`Esta compra tem ${siblings.length} parcelas. Deletar TODAS as parcelas?\n\nOK = todas · Cancelar = só esta`);
      if (choice) {
        commit(D => { finEnsure(D); D._finance.transactions = D._finance.transactions.filter(t => !(t.parentId === groupId || t.id === groupId)); });
        return;
      }
      if (!confirm('Deletar somente esta parcela?')) return;
    } else {
      if (!confirm('Deletar este lançamento?')) return;
    }
    commit(D => { finEnsure(D); D._finance.transactions = D._finance.transactions.filter(t => t.id !== id); });
  }
  function toggleStatus(id) {
    commit(D => {
      finEnsure(D);
      const t = D._finance.transactions.find(x => x.id === id);
      if (t) t.status = (t.status === 'paid' || !t.status) ? 'pending' : 'paid';
    });
  }

  return (
    <>
      {/* Filters */}
      <div className="panel" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="form-input" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: '1 1 200px', minWidth: 160, fontSize: 12, padding: '8px 12px' }} />
          <select className="form-input" value={filterCat || ''} onChange={e => setFilterCat(e.target.value || null)} style={{ fontSize: 12, padding: '8px 12px', minWidth: 140 }}>
            <option value="">Todas categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select className="form-input" value={filterAcc || ''} onChange={e => setFilterAcc(e.target.value || null)} style={{ fontSize: 12, padding: '8px 12px', minWidth: 140 }}>
            <option value="">Todos meios</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 12, padding: '8px 12px', minWidth: 110 }}>
            <option value="all">Todos status</option>
            <option value="paid">Pagos</option>
            <option value="pending">Pendentes</option>
          </select>
          <button className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 12 }} onClick={() => { setEditTx(null); setShowAdd(true); }}>＋ Lançamento</button>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{monthTxs.length} lançamentos</span>
          <span className="mono">total filtrado: <strong style={{ color: '#ff5a3c' }}>{finFmt(totalFiltered)}</strong></span>
        </div>
      </div>

      {/* Transactions table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {monthTxs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💰</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Nenhum lançamento</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Adicione o primeiro gasto deste mês</div>
          </div>
        )}
        {monthTxs.map((t, i) => {
          const cat = categories.find(c => c.id === t.categoryId);
          const acc = accounts.find(a => a.id === t.accountId);
          const status = t.status || 'paid';
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderBottom: i < monthTxs.length - 1 ? '1px solid var(--line)' : 'none',
              opacity: status === 'pending' ? 0.65 : 1,
            }}>
              <button onClick={() => toggleStatus(t.id)} title={status === 'paid' ? 'Marcado como pago' : 'Pendente'} style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                background: status === 'paid' ? 'var(--gradient-neon)' : 'transparent',
                border: status === 'paid' ? '1px solid rgba(255,46,136,0.4)' : '1px solid var(--line-2)',
                color: '#fff', fontSize: 10, cursor: 'pointer', display: 'grid', placeItems: 'center',
              }}>{status === 'paid' && '✓'}</button>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: (cat?.color || '#666') + '22', border: `1px solid ${(cat?.color || '#666')}44`, display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0 }}>{cat?.icon || '•'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{Orbita.fmtDate(t.date)}</span>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>·</span>
                  <span className="mono" style={{ fontSize: 9, color: acc?.color || 'var(--ink-3)', fontWeight: 500 }}>{acc?.name || '—'}</span>
                  {t.installment && (
                    <>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>·</span>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--neon-c)' }}>{t.installment.current}/{t.installment.total}</span>
                    </>
                  )}
                  {cat && <span className="chip" style={{ padding: '1px 7px', fontSize: 9 }}>{cat.name}</span>}
                </div>
              </div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: '#ff5a3c', flexShrink: 0 }}>{finFmt(t.value)}</div>
              <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                <button onClick={() => { setEditTx(t); setShowAdd(true); }} className="icon-btn" style={{ width: 26, height: 26, fontSize: 11 }}>✎</button>
                <button onClick={() => deleteTx(t.id)} className="icon-btn" style={{ width: 26, height: 26, fontSize: 11 }}>✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && <FinTxModal onClose={() => { setShowAdd(false); setEditTx(null); }} editTx={editTx} fin={fin} commit={commit} defaultMonth={month} />}
    </>
  );
}

/* ── Transaction modal ── */
function FinTxModal({ onClose, editTx, fin, commit, defaultMonth }) {
  const accounts = fin.accounts || FIN_DEFAULT_ACCOUNTS;
  const categories = fin.categories || FIN_DEFAULT_CATEGORIES;

  const todayDef = editTx?.date || (defaultMonth ? defaultMonth + '-' + String(new Date().getDate()).padStart(2, '0') : Orbita.todayStr());
  const [description, setDescription] = React.useState(editTx?.description || '');
  const [value, setValue] = React.useState(editTx?.value || '');
  const [date, setDate] = React.useState(todayDef);
  const [accountId, setAccountId] = React.useState(editTx?.accountId || accounts[0]?.id);
  const [categoryId, setCategoryId] = React.useState(editTx?.categoryId || categories[0]?.id);
  const [status, setStatus] = React.useState(editTx?.status || 'paid');
  const [installments, setInstallments] = React.useState(editTx?.installment?.total || 1);
  const [currentInst, setCurrentInst] = React.useState(editTx?.installment?.current || 1);
  const [isInstallment, setIsInstallment] = React.useState(!!editTx?.installment);

  const totalInst = Math.max(1, parseInt(installments) || 1);
  const startCur = Math.max(1, parseInt(currentInst) || 1);
  const futureCount = isInstallment && !editTx ? Math.max(0, totalInst - startCur) : 0;

  function save() {
    const v = parseFloat(String(value).replace(',', '.'));
    if (!description.trim() || isNaN(v) || v <= 0) return;
    commit(D => {
      finEnsure(D);
      if (editTx) {
        const idx = D._finance.transactions.findIndex(t => t.id === editTx.id);
        if (idx >= 0) {
          D._finance.transactions[idx] = {
            ...D._finance.transactions[idx],
            description: description.trim(), value: v, date, accountId, categoryId, status,
            installment: isInstallment ? { current: startCur, total: totalInst } : null,
          };
        }
      } else {
        const groupId = Orbita.uid();
        const baseTx = {
          id: groupId,
          description: description.trim(), value: v, date, accountId, categoryId, status,
          installment: isInstallment ? { current: startCur, total: totalInst } : null,
          parentId: isInstallment && totalInst > 1 ? groupId : null,
        };
        D._finance.transactions.push(baseTx);

        // Auto-generate remaining installments for future months
        if (isInstallment && totalInst > 1) {
          for (let i = startCur + 1; i <= totalInst; i++) {
            const [y, m, d] = date.split('-').map(Number);
            const next = new Date(y, m - 1 + (i - startCur), d);
            const nextDate = next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0') + '-' + String(next.getDate()).padStart(2, '0');
            D._finance.transactions.push({
              id: Orbita.uid(),
              description: description.trim(), value: v, date: nextDate, accountId, categoryId, status: 'pending',
              installment: { current: i, total: totalInst },
              parentId: groupId,
            });
          }
        }
      }
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 92vw)' }}>
        <div className="modal-header">
          <h2>{editTx ? 'Editar lançamento' : 'Novo lançamento'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input className="form-input" autoFocus placeholder="Ex: Almoço, Aluguel, Netflix..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Valor</label>
              <input className="form-input" type="text" inputMode="decimal" placeholder="0,00" value={value} onChange={e => setValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') save(); }} />
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Meio / Cartão</label>
              <select className="form-input" value={accountId} onChange={e => setAccountId(e.target.value)}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="form-chips">
              {[{v:'paid',l:'✓ Pago'},{v:'pending',l:'⏳ Pendente'}].map(s => (
                <div key={s.v} className={`form-chip ${status === s.v ? 'active' : ''}`} onClick={() => setStatus(s.v)}>{s.l}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={isInstallment} onChange={e => setIsInstallment(e.target.checked)} style={{ accentColor: 'var(--neon-a)' }} />
              Parcelado
            </label>
            {isInstallment && (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>parcela</span>
                  <input className="form-input" type="number" min="1" value={currentInst} onChange={e => setCurrentInst(e.target.value)} style={{ width: 70 }} />
                  <span style={{ color: 'var(--ink-3)' }}>de</span>
                  <input className="form-input" type="number" min="1" value={installments} onChange={e => setInstallments(e.target.value)} style={{ width: 70 }} />
                </div>
                {!editTx && futureCount > 0 && (
                  <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(176,102,255,0.08)', border: '1px solid rgba(176,102,255,0.2)', borderRadius: 6, fontSize: 11, color: 'var(--ink-2)' }}>
                    ⚡ <strong>{futureCount}</strong> parcela{futureCount > 1 ? 's' : ''} futura{futureCount > 1 ? 's' : ''} de {finFmt(parseFloat(String(value).replace(',', '.')) || 0)} ser{futureCount > 1 ? 'ão' : 'á'} criada{futureCount > 1 ? 's' : ''} automaticamente nos próximos meses.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={save}>{editTx ? 'Salvar' : 'Adicionar'}</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Cartões */
/* ────────────────────────────────────────────────────────── */
function FinCartoes({ month, fin, commit }) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const [editAcc, setEditAcc] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [detailAcc, setDetailAcc] = React.useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{accounts.length} meios cadastrados · clique no card para detalhar</div>
        <button className="btn-ghost small" onClick={() => { setEditAcc(null); setShowAdd(true); }} style={{ fontSize: 12 }}>＋ Novo meio</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {accounts.map(a => {
          const accTxs = txs.filter(t => t.accountId === a.id && finMonth(t.date) === month);
          const total = accTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
          const pending = accTxs.filter(t => t.status === 'pending').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
          const isCard = a.type === 'credit';
          return (
            <div key={a.id} className="panel" onClick={() => setDetailAcc(a)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'all 120ms' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = a.color + '88'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = ''; }}>
              <div style={{ padding: '16px 18px', background: `linear-gradient(135deg, ${a.color}33, ${a.color}11)`, borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{a.type === 'credit' ? 'Cartão' : a.type === 'pix' ? 'PIX' : a.type === 'boleto' ? 'Boleto' : 'Outro'}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{a.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="icon-btn" onClick={e => { e.stopPropagation(); setEditAcc(a); setShowAdd(true); }} style={{ width: 28, height: 28, fontSize: 11 }}>✎</button>
                  </div>
                </div>
                {isCard && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 8 }}>
                    fecha dia {a.closingDay || '—'} · vence dia {a.dueDay || '—'}
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span className="eyebrow">Mês</span>
                  <span className="mono" style={{ fontSize: 16, fontWeight: 600, color: a.color }}>{finFmt(total)}</span>
                </div>
                {pending > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-3)' }}>
                    <span>Pendente</span>
                    <span className="mono">{finFmt(pending)}</span>
                  </div>
                )}
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>{accTxs.length} lançamentos</div>
                {accTxs.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                    {accTxs.sort((x,y)=>y.value-x.value).slice(0, 3).map(t => {
                      const cat = categories.find(c => c.id === t.categoryId);
                      return (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 11 }}>
                          <span style={{ display: 'flex', gap: 6, alignItems: 'center', overflow: 'hidden' }}>
                            <span>{cat?.icon || '•'}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</span>
                            {t.installment && <span className="mono" style={{ fontSize: 9, color: 'var(--neon-c)' }}>{t.installment.current}/{t.installment.total}</span>}
                          </span>
                          <span className="mono" style={{ color: 'var(--ink-2)', flexShrink: 0, marginLeft: 8 }}>{finFmtShort(t.value)}</span>
                        </div>
                      );
                    })}
                    {accTxs.length > 3 && (
                      <div style={{ fontSize: 10, color: 'var(--ink-3)', textAlign: 'center', marginTop: 6, fontStyle: 'italic' }}>
                        + {accTxs.length - 3} outros · clique para ver todos
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {showAdd && <FinAccountModal onClose={() => { setShowAdd(false); setEditAcc(null); }} editAcc={editAcc} commit={commit} />}
      {detailAcc && <FinAccountDetailModal onClose={() => setDetailAcc(null)} account={detailAcc} month={month} fin={fin} commit={commit} />}
    </div>
  );
}

/* ── Account/Card detail modal ── */
function FinAccountDetailModal({ onClose, account, month, fin, commit }) {
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const accTxs = txs.filter(t => t.accountId === account.id && finMonth(t.date) === month)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const total = accTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalPaid = accTxs.filter(t => (t.status || 'paid') === 'paid').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalPending = accTxs.filter(t => t.status === 'pending').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);

  // Forward look: pending installments in future months
  const futureInstallments = txs.filter(t => t.accountId === account.id && t.installment && finMonth(t.date) > month)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const futureByMonth = {};
  futureInstallments.forEach(t => {
    const m = finMonth(t.date);
    if (!futureByMonth[m]) futureByMonth[m] = { total: 0, txs: [] };
    futureByMonth[m].total += parseFloat(t.value) || 0;
    futureByMonth[m].txs.push(t);
  });

  // By category breakdown
  const byCat = {};
  accTxs.forEach(t => {
    const c = categories.find(x => x.id === t.categoryId) || { id: '_uncat', name: 'Sem categoria', color: '#666', icon: '•' };
    if (!byCat[c.id]) byCat[c.id] = { cat: c, value: 0, count: 0 };
    byCat[c.id].value += parseFloat(t.value) || 0;
    byCat[c.id].count += 1;
  });
  const catRows = Object.values(byCat).sort((a, b) => b.value - a.value);

  function deleteTx(id) {
    const tx = txs.find(t => t.id === id);
    if (!tx) return;
    const groupId = tx.parentId || tx.id;
    const siblings = txs.filter(t => (t.parentId === groupId || t.id === groupId) && t.installment);
    if (siblings.length > 1) {
      const choice = confirm(`Esta compra tem ${siblings.length} parcelas. Deletar TODAS as parcelas?\n\nOK = todas · Cancelar = só esta`);
      if (choice) {
        commit(D => { finEnsure(D); D._finance.transactions = D._finance.transactions.filter(t => !(t.parentId === groupId || t.id === groupId)); });
        return;
      }
      if (!confirm('Deletar somente esta parcela?')) return;
    } else {
      if (!confirm('Deletar este lançamento?')) return;
    }
    commit(D => { finEnsure(D); D._finance.transactions = D._finance.transactions.filter(t => t.id !== id); });
  }
  function toggleStatus(id) {
    commit(D => {
      finEnsure(D);
      const t = D._finance.transactions.find(x => x.id === id);
      if (t) t.status = (t.status === 'paid' || !t.status) ? 'pending' : 'paid';
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(640px, 95vw)', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ background: `linear-gradient(135deg, ${account.color}33, ${account.color}11)`, borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {account.type === 'credit' ? 'Fatura ' : ''}{finMonthLabel(month)}
            </div>
            <h2 style={{ marginTop: 2 }}>{account.name}</h2>
            {account.type === 'credit' && (
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>
                fecha dia {account.closingDay || '—'} · vence dia {account.dueDay || '—'}
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--line)' }}>
              <div className="eyebrow" style={{ fontSize: 9 }}>Total</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: account.color, marginTop: 2 }}>{finFmt(total)}</div>
            </div>
            <div style={{ padding: 12, background: 'rgba(60,207,145,0.06)', borderRadius: 10, border: '1px solid rgba(60,207,145,0.18)' }}>
              <div className="eyebrow" style={{ fontSize: 9 }}>Pago</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: '#3ccf91', marginTop: 2 }}>{finFmt(totalPaid)}</div>
            </div>
            <div style={{ padding: 12, background: 'rgba(255,168,48,0.06)', borderRadius: 10, border: '1px solid rgba(255,168,48,0.18)' }}>
              <div className="eyebrow" style={{ fontSize: 9 }}>Pendente</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: '#ffa830', marginTop: 2 }}>{finFmt(totalPending)}</div>
            </div>
          </div>

          {/* By category */}
          {catRows.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Por categoria</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {catRows.map(r => (
                  <div key={r.cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{r.cat.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{r.cat.name}</span>
                        <span className="mono" style={{ fontSize: 11, color: r.cat.color, fontWeight: 600 }}>{finFmt(r.value)}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: total ? `${r.value / total * 100}%` : '0%', background: r.cat.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions list */}
          <div className="eyebrow" style={{ marginBottom: 8 }}>Lançamentos · {accTxs.length}</div>
          {accTxs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--ink-3)', fontSize: 12 }}>
              Nenhum lançamento neste mês
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
            {accTxs.map((t, i) => {
              const cat = categories.find(c => c.id === t.categoryId);
              const status = t.status || 'paid';
              return (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  borderBottom: i < accTxs.length - 1 ? '1px solid var(--line)' : 'none',
                  background: status === 'pending' ? 'rgba(255,168,48,0.04)' : 'transparent',
                  opacity: status === 'pending' ? 0.85 : 1,
                }}>
                  <button onClick={() => toggleStatus(t.id)} title={status === 'paid' ? 'Pago' : 'Pendente'} style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    background: status === 'paid' ? 'var(--gradient-neon)' : 'transparent',
                    border: status === 'paid' ? '1px solid rgba(255,46,136,0.4)' : '1px solid var(--line-2)',
                    color: '#fff', fontSize: 9, cursor: 'pointer', display: 'grid', placeItems: 'center',
                  }}>{status === 'paid' && '✓'}</button>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{cat?.icon || '•'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{Orbita.fmtDate(t.date)}</span>
                      {cat && <span style={{ fontSize: 9, color: cat.color }}>· {cat.name}</span>}
                      {t.installment && <span className="mono" style={{ fontSize: 9, color: 'var(--neon-c)' }}>· {t.installment.current}/{t.installment.total}</span>}
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: '#ff5a3c', flexShrink: 0 }}>{finFmt(t.value)}</div>
                  <button onClick={() => deleteTx(t.id)} className="icon-btn" style={{ width: 22, height: 22, fontSize: 10 }}>✕</button>
                </div>
              );
            })}
          </div>

          {/* Future installments preview */}
          {Object.keys(futureByMonth).length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Parcelas futuras</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(futureByMonth).map(([m, info]) => (
                  <div key={m} style={{ padding: '10px 12px', background: 'rgba(176,102,255,0.06)', border: '1px solid rgba(176,102,255,0.18)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{finMonthLabel(m)}</span>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--neon-c)', fontWeight: 600 }}>{finFmt(info.total)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {info.txs.slice(0, 4).map(t => (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-2)' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description} <span className="mono" style={{ color: 'var(--ink-4)' }}>{t.installment.current}/{t.installment.total}</span></span>
                          <span className="mono" style={{ flexShrink: 0, marginLeft: 6 }}>{finFmtShort(t.value)}</span>
                        </div>
                      ))}
                      {info.txs.length > 4 && <div style={{ fontSize: 10, color: 'var(--ink-3)', fontStyle: 'italic' }}>+ {info.txs.length - 4} outros</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FinAccountModal({ onClose, editAcc, commit }) {
  const [name, setName] = React.useState(editAcc?.name || '');
  const [type, setType] = React.useState(editAcc?.type || 'credit');
  const [color, setColor] = React.useState(editAcc?.color || '#5b8dff');
  const [closingDay, setClosingDay] = React.useState(editAcc?.closingDay || '');
  const [dueDay, setDueDay] = React.useState(editAcc?.dueDay || '');
  const colors = ['#ec7000', '#820ad1', '#1a1f71', '#3ccf91', '#9ea5b8', '#ffd60a', '#ff2e88', '#5b8dff', '#b066ff', '#ff5a3c'];

  function save() {
    if (!name.trim()) return;
    commit(D => {
      finEnsure(D);
      const acc = {
        id: editAcc?.id || Orbita.uid(),
        name: name.trim(), type, color,
        closingDay: type === 'credit' ? (parseInt(closingDay) || null) : null,
        dueDay: type === 'credit' ? (parseInt(dueDay) || null) : null,
      };
      if (editAcc) {
        const idx = D._finance.accounts.findIndex(a => a.id === editAcc.id);
        if (idx >= 0) D._finance.accounts[idx] = acc;
      } else {
        D._finance.accounts.push(acc);
      }
    });
    onClose();
  }

  function del() {
    if (!editAcc || !confirm(`Deletar "${editAcc.name}"? As transações ficarão sem meio.`)) return;
    commit(D => { finEnsure(D); D._finance.accounts = D._finance.accounts.filter(a => a.id !== editAcc.id); });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(440px, 92vw)' }}>
        <div className="modal-header"><h2>{editAcc ? 'Editar meio' : 'Novo meio'}</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" autoFocus placeholder="Ex: Itaú Stephano" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <div className="form-chips">
              {[
                {v:'credit',l:'💳 Crédito'},
                {v:'debit',l:'🏦 Débito'},
                {v:'pix',l:'⚡ PIX'},
                {v:'boleto',l:'📄 Boleto'},
                {v:'cash',l:'💵 Dinheiro'},
              ].map(t => (
                <div key={t.v} className={`form-chip ${type === t.v ? 'active' : ''}`} onClick={() => setType(t.v)}>{t.l}</div>
              ))}
            </div>
          </div>
          {type === 'credit' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fechamento</label>
                <input className="form-input" type="number" min="1" max="31" placeholder="25" value={closingDay} onChange={e => setClosingDay(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Vencimento</label>
                <input className="form-input" type="number" min="1" max="31" placeholder="5" value={dueDay} onChange={e => setDueDay(e.target.value)} />
              </div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Cor</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {colors.map(c => (
                <div key={c} onClick={() => setColor(c)} style={{
                  width: 26, height: 26, borderRadius: 6, background: c, cursor: 'pointer',
                  border: color === c ? '2px solid #fff' : '2px solid transparent', transition: 'all 120ms',
                }} />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          {editAcc ? <button className="btn-ghost" style={{ color: '#ff5555' }} onClick={del}>Deletar</button> : <span />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={save}>{editAcc ? 'Salvar' : 'Criar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Categorias */
/* ────────────────────────────────────────────────────────── */
function FinCategorias({ month, fin, commit }) {
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const [editCat, setEditCat] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);

  // Last 6 months for trend
  const months = [];
  let cur = month;
  for (let i = 0; i < 6; i++) { months.unshift(cur); cur = finPrevMonth(cur); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{categories.length} categorias</div>
        <button className="btn-ghost small" onClick={() => { setEditCat(null); setShowAdd(true); }} style={{ fontSize: 12 }}>＋ Categoria</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
        {categories.map(c => {
          const monthTxs = txs.filter(t => t.categoryId === c.id && finMonth(t.date) === month);
          const total = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
          const monthSeries = months.map(ym => ({
            month: ym,
            value: txs.filter(t => t.categoryId === c.id && finMonth(t.date) === ym).reduce((s, t) => s + (parseFloat(t.value) || 0), 0),
          }));
          const maxVal = Math.max(...monthSeries.map(s => s.value), 1);
          const meta = FIN_META_CATS.find(m => m.id === c.meta);
          return (
            <div key={c.id} className="panel" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: c.color + '22', border: `1px solid ${c.color}44`, display: 'grid', placeItems: 'center', fontSize: 18 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                  {meta && <div className="mono" style={{ fontSize: 9, color: meta.color }}>{meta.name}</div>}
                </div>
                <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: c.color }}>{finFmt(total)}</div>
                <button className="icon-btn" onClick={() => { setEditCat(c); setShowAdd(true); }} style={{ width: 26, height: 26, fontSize: 11 }}>✎</button>
              </div>
              {/* Mini bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50, padding: '4px 0' }}>
                {monthSeries.map((s, i) => (
                  <div key={s.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <div style={{
                      width: '100%', height: `${(s.value / maxVal) * 100}%`,
                      minHeight: s.value > 0 ? 2 : 0,
                      background: s.month === month ? c.color : c.color + '55',
                      borderRadius: '3px 3px 0 0',
                    }} title={`${finMonthLabel(s.month)}: ${finFmt(s.value)}`} />
                    <div className="mono" style={{ fontSize: 8, color: 'var(--ink-4)' }}>{s.month.slice(5)}</div>
                  </div>
                ))}
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>{monthTxs.length} lançamentos no mês</div>
            </div>
          );
        })}
      </div>
      {showAdd && <FinCategoryModal onClose={() => { setShowAdd(false); setEditCat(null); }} editCat={editCat} commit={commit} />}
    </div>
  );
}

function FinCategoryModal({ onClose, editCat, commit }) {
  const [name, setName] = React.useState(editCat?.name || '');
  const [icon, setIcon] = React.useState(editCat?.icon || '📋');
  const [color, setColor] = React.useState(editCat?.color || '#5b8dff');
  const [meta, setMeta] = React.useState(editCat?.meta || 'necessidades');
  const colors = ['#5b8dff', '#3ccf91', '#ffa830', '#ff2e88', '#b066ff', '#ff5a3c', '#64d2ff', '#ffd60a', '#9ea5b8', '#ff5555'];

  function save() {
    if (!name.trim()) return;
    commit(D => {
      finEnsure(D);
      const cat = { id: editCat?.id || Orbita.uid(), name: name.trim(), icon, color, meta };
      if (editCat) {
        const idx = D._finance.categories.findIndex(c => c.id === editCat.id);
        if (idx >= 0) D._finance.categories[idx] = cat;
      } else {
        D._finance.categories.push(cat);
      }
    });
    onClose();
  }
  function del() {
    if (!editCat || !confirm(`Deletar "${editCat.name}"?`)) return;
    commit(D => { finEnsure(D); D._finance.categories = D._finance.categories.filter(c => c.id !== editCat.id); });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(440px, 92vw)' }}>
        <div className="modal-header"><h2>{editCat ? 'Editar categoria' : 'Nova categoria'}</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div className="form-group">
              <label className="form-label">Ícone</label>
              <EmojiPicker value={icon} onChange={setIcon} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nome</label>
              <input className="form-input" autoFocus placeholder="Ex: Mercado" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Meta-categoria</label>
            <div className="form-chips">
              {FIN_META_CATS.map(m => (
                <div key={m.id} className={`form-chip ${meta === m.id ? 'active' : ''}`} onClick={() => setMeta(m.id)}
                  style={meta === m.id ? { borderColor: m.color, background: m.color + '22' } : {}}>{m.name}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cor</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {colors.map(c => (
                <div key={c} onClick={() => setColor(c)} style={{
                  width: 26, height: 26, borderRadius: 6, background: c, cursor: 'pointer',
                  border: color === c ? '2px solid #fff' : '2px solid transparent',
                }} />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          {editCat ? <button className="btn-ghost" style={{ color: '#ff5555' }} onClick={del}>Deletar</button> : <span />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={save}>{editCat ? 'Salvar' : 'Criar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Recorrentes */
/* ────────────────────────────────────────────────────────── */
function FinRecorrentes({ fin, commit }) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const recurring = fin.recurring || [];
  const [editR, setEditR] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);

  function generateThisMonth() {
    const ym = finCurrentMonth();
    let added = 0;
    commit(D => {
      finEnsure(D);
      const existingDescs = new Set(
        D._finance.transactions.filter(t => finMonth(t.date) === ym && t.recurringId).map(t => t.recurringId)
      );
      (D._finance.recurring || []).filter(r => r.active !== false).forEach(r => {
        if (existingDescs.has(r.id)) return;
        const day = String(Math.min(28, parseInt(r.dayOfMonth) || 1)).padStart(2, '0');
        const date = `${ym}-${day}`;
        D._finance.transactions.push({
          id: Orbita.uid(),
          description: r.description,
          value: r.value,
          date,
          accountId: r.accountId,
          categoryId: r.categoryId,
          status: 'pending',
          recurringId: r.id,
        });
        added++;
      });
    });
    alert(`${added} lançamentos recorrentes adicionados ao mês atual.`);
  }

  function deleteRec(id) {
    if (!confirm('Deletar recorrente?')) return;
    commit(D => { finEnsure(D); D._finance.recurring = D._finance.recurring.filter(r => r.id !== id); });
  }
  function toggle(id) {
    commit(D => {
      finEnsure(D);
      const r = D._finance.recurring.find(x => x.id === id);
      if (r) r.active = !(r.active === undefined ? true : r.active);
    });
  }

  const totalActive = recurring.filter(r => r.active !== false).reduce((s, r) => s + (parseFloat(r.value) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="panel" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="eyebrow">Total mensal recorrente</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: '#ff5a3c', marginTop: 2 }}>{finFmt(totalActive)}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost small" onClick={generateThisMonth}>⚡ Gerar do mês</button>
          <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 12 }} onClick={() => { setEditR(null); setShowAdd(true); }}>＋ Recorrente</button>
        </div>
      </div>

      {recurring.length === 0 && (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔁</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Nenhum gasto recorrente</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Cadastre Aluguel, Plano de Saúde, Streaming, etc.</div>
        </div>
      )}

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {recurring.map((r, i) => {
          const cat = categories.find(c => c.id === r.categoryId);
          const acc = accounts.find(a => a.id === r.accountId);
          const active = r.active !== false;
          return (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              borderBottom: i < recurring.length - 1 ? '1px solid var(--line)' : 'none',
              opacity: active ? 1 : 0.5,
            }}>
              <button onClick={() => toggle(r.id)} className="icon-btn" style={{ width: 26, height: 26, fontSize: 11 }}>{active ? '⏸' : '▶'}</button>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: (cat?.color || '#666') + '22', border: `1px solid ${(cat?.color || '#666')}44`, display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0 }}>{cat?.icon || '🔁'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.description}</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>dia {r.dayOfMonth} · {acc?.name || '—'}</div>
              </div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: cat?.color || '#ff5a3c' }}>{finFmt(r.value)}</div>
              <div style={{ display: 'flex', gap: 2 }}>
                <button onClick={() => { setEditR(r); setShowAdd(true); }} className="icon-btn" style={{ width: 26, height: 26, fontSize: 11 }}>✎</button>
                <button onClick={() => deleteRec(r.id)} className="icon-btn" style={{ width: 26, height: 26, fontSize: 11 }}>✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && <FinRecurringModal onClose={() => { setShowAdd(false); setEditR(null); }} editR={editR} fin={fin} commit={commit} />}
    </div>
  );
}

function FinRecurringModal({ onClose, editR, fin, commit }) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const [description, setDescription] = React.useState(editR?.description || '');
  const [value, setValue] = React.useState(editR?.value || '');
  const [dayOfMonth, setDayOfMonth] = React.useState(editR?.dayOfMonth || 5);
  const [accountId, setAccountId] = React.useState(editR?.accountId || accounts[0]?.id);
  const [categoryId, setCategoryId] = React.useState(editR?.categoryId || categories[0]?.id);

  function save() {
    const v = parseFloat(String(value).replace(',', '.'));
    if (!description.trim() || isNaN(v)) return;
    commit(D => {
      finEnsure(D);
      const r = {
        id: editR?.id || Orbita.uid(),
        description: description.trim(), value: v, dayOfMonth: parseInt(dayOfMonth) || 1,
        accountId, categoryId, active: editR?.active !== false,
      };
      if (editR) {
        const idx = D._finance.recurring.findIndex(x => x.id === editR.id);
        if (idx >= 0) D._finance.recurring[idx] = r;
      } else {
        D._finance.recurring.push(r);
      }
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 92vw)' }}>
        <div className="modal-header"><h2>{editR ? 'Editar recorrente' : 'Novo recorrente'}</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input className="form-input" autoFocus placeholder="Ex: Aluguel, Netflix..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Valor</label>
              <input className="form-input" type="text" inputMode="decimal" placeholder="0,00" value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Dia do mês</label>
              <input className="form-input" type="number" min="1" max="31" value={dayOfMonth} onChange={e => setDayOfMonth(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Meio</label>
              <select className="form-input" value={accountId} onChange={e => setAccountId(e.target.value)}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={save}>{editR ? 'Salvar' : 'Criar'}</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Orçamento */
/* ────────────────────────────────────────────────────────── */
function FinOrcamento({ fin, commit }) {
  const [income, setIncome] = React.useState(fin.monthlyIncome || 0);
  const [alloc, setAlloc] = React.useState(() => {
    const a = {};
    FIN_META_CATS.forEach(m => a[m.id] = (fin.budgetAllocation && fin.budgetAllocation[m.id]) ?? m.pct);
    return a;
  });
  const [openaiKey, setOpenaiKey] = React.useState(fin.openaiKey || (fin._diet?.openaiKey || ''));

  const totalPct = Object.values(alloc).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  function save() {
    commit(D => {
      finEnsure(D);
      D._finance.monthlyIncome = parseFloat(income) || 0;
      D._finance.budgetAllocation = { ...alloc };
      if (openaiKey) {
        if (!D._diet) D._diet = {};
        D._diet.openaiKey = openaiKey;
      }
    });
    alert('Orçamento salvo!');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
      <div className="panel" style={{ padding: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 14 }}>Renda mensal</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 18, color: 'var(--ink-3)' }}>R$</span>
          <input className="form-input" type="number" placeholder="0" value={income} onChange={e => setIncome(e.target.value)}
            style={{ flex: 1, fontSize: 22, fontFamily: 'var(--font-mono)', padding: '12px 16px' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>Use para calcular metas de orçamento por categoria</div>
      </div>

      <div className="panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div style={{ fontWeight: 600 }}>Alocação ideal por meta-categoria</div>
          <div className="mono" style={{ fontSize: 11, color: Math.abs(totalPct - 1) < 0.001 ? '#3ccf91' : '#ff5555' }}>
            soma: {(totalPct * 100).toFixed(1)}%
          </div>
        </div>
        {FIN_META_CATS.map(m => {
          const pct = alloc[m.id] || 0;
          const target = (income || 0) * pct;
          return (
            <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                <input className="form-input" type="number" step="0.01" min="0" max="1" value={pct}
                  onChange={e => setAlloc(p => ({ ...p, [m.id]: parseFloat(e.target.value) || 0 }))}
                  style={{ width: 80, fontSize: 12, padding: '6px 10px' }} />
                <span style={{ width: 50, fontSize: 11, color: 'var(--ink-3)' }} className="mono">{(pct * 100).toFixed(1)}%</span>
                <span style={{ width: 110, textAlign: 'right', fontSize: 12, fontWeight: 600, color: m.color }} className="mono">{finFmt(target)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={pct}
                onChange={e => setAlloc(p => ({ ...p, [m.id]: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: m.color }} />
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
          <strong>Padrão Stephano:</strong> 55% Necessidades · 10% Lazer · 10% Dívidas · 10% Liberdade Financeira · 10% Longo Prazo · 5% Colchão
        </div>
      </div>

      <div className="panel" style={{ padding: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Chave OpenAI (assistente IA 💰)</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 10 }}>Compartilhada com o Coach 🥗 e Orbita IA 🌌. Salva localmente no navegador.</div>
        <input className="form-input" type="password" placeholder="sk-..." value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} />
      </div>

      <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 13, alignSelf: 'flex-start' }} onClick={save}>Salvar orçamento</button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* IA Assistant 💰 (FinanceHomeBar) */
/* ────────────────────────────────────────────────────────── */
function FinanceHomeBar() {
  const { data, commit } = useData();
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState('chat');
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [parsed, setParsed] = React.useState(null);
  const [messages, setMessages] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('orbita_fin_chat') || '[]'); }
    catch { return []; }
  });
  const scrollRef = React.useRef();

  const fin = data._finance || {};
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const month = finCurrentMonth();

  React.useEffect(() => {
    localStorage.setItem('orbita_fin_chat', JSON.stringify(messages.slice(-30)));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const openaiKey = data._settings?.aiKeys?.openai || data._diet?.openaiKey;

  function buildContext() {
    const monthTxs = txs.filter(t => finMonth(t.date) === month);
    const total = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const income = fin.monthlyIncome || 0;
    const balance = income - total;

    const byCat = {};
    monthTxs.forEach(t => {
      const c = categories.find(x => x.id === t.categoryId);
      const k = c?.name || 'Sem categoria';
      byCat[k] = (byCat[k] || 0) + (parseFloat(t.value) || 0);
    });
    const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const byAcc = {};
    monthTxs.forEach(t => {
      const a = accounts.find(x => x.id === t.accountId);
      const k = a?.name || 'Outro';
      byAcc[k] = (byAcc[k] || 0) + (parseFloat(t.value) || 0);
    });

    let ctx = `Contexto financeiro do usuário (${finMonthLabel(month)}):\n`;
    ctx += `- Renda: ${finFmt(income)}\n`;
    ctx += `- Total gasto: ${finFmt(total)} (${income ? Math.round(total/income*100) : 0}% da renda)\n`;
    ctx += `- Saldo: ${finFmt(balance)}\n`;
    ctx += `- Lançamentos: ${monthTxs.length}\n`;
    if (topCats.length) ctx += `\nTop categorias do mês: ${topCats.map(([n, v]) => `${n} ${finFmt(v)}`).join(' · ')}\n`;
    if (Object.keys(byAcc).length) ctx += `Por meio: ${Object.entries(byAcc).map(([n, v]) => `${n} ${finFmt(v)}`).join(' · ')}\n`;
    ctx += `\nMeios disponíveis: ${accounts.map(a => a.name).join(', ')}\n`;
    ctx += `Categorias disponíveis: ${categories.map(c => c.name).join(', ')}\n`;
    ctx += `\nRegra de orçamento: 55% Necessidades, 10% Lazer, 10% Dívidas, 10% Liberdade Financeira, 10% Longo Prazo, 5% Colchão.`;
    return ctx;
  }

  async function send() {
    if (!input.trim()) return;
    if (!openaiKey) { setError('Configure sua chave OpenAI em ⚙ Configurações'); return; }
    setLoading(true); setError('');

    if (mode === 'lancamento') {
      try {
        const accNames = accounts.map(a => `"${a.id}":"${a.name}"`).join(', ');
        const catNames = categories.map(c => `"${c.id}":"${c.name}"`).join(', ');
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: `Extraia um lançamento financeiro do texto. Responda SOMENTE com JSON no formato:
{"description":"...", "value": numero, "categoryId":"id", "accountId":"id", "date":"YYYY-MM-DD", "installment":{"current":1,"total":1} ou null}

Categorias disponíveis (id:nome): ${catNames}
Meios disponíveis (id:nome): ${accNames}
Use a categoria e meio mais apropriados. Se não tiver data, use ${Orbita.todayStr()}. Se não for parcelado, installment = null.` },
              { role: 'user', content: input.trim() },
            ],
            temperature: 0.2,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
        const json = await res.json();
        const obj = JSON.parse(json.choices[0].message.content);
        setParsed(obj);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
      return;
    }

    // Chat mode
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `Você é o assistente financeiro do Stephano. Ajude com análise de gastos, orçamento, dívidas, conselhos práticos. Seja conciso, direto e em português. Use os dados reais do contexto, não invente valores.\n\n${buildContext()}` },
            ...newMessages.slice(-10),
          ],
          temperature: 0.6,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const json = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: json.choices[0].message.content }]);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function saveParsed() {
    if (!parsed) return;
    commit(D => {
      finEnsure(D);
      D._finance.transactions.push({
        id: Orbita.uid(),
        description: parsed.description || input,
        value: parseFloat(parsed.value) || 0,
        date: parsed.date || Orbita.todayStr(),
        accountId: parsed.accountId || accounts[0]?.id,
        categoryId: parsed.categoryId || categories[0]?.id,
        status: 'paid',
        installment: parsed.installment || null,
      });
    });
    setInput(''); setParsed(null);
  }

  function clearChat() {
    if (!confirm('Limpar conversa?')) return;
    setMessages([]); localStorage.removeItem('orbita_fin_chat');
  }

  if (!open) {
    const monthSpent = txs.filter(t => finMonth(t.date) === month).reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 500,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 28,
        background: 'linear-gradient(135deg, #3ccf91, #5b8dff)', border: 'none', color: '#fff',
        cursor: 'pointer', fontSize: 13, fontWeight: 500,
        boxShadow: '0 4px 20px rgba(60,207,145,0.4)',
        fontFamily: 'var(--font-ui)',
      }}>
        <span style={{ fontSize: 16 }}>💰</span>
        <span>Financeiro · {finFmtShort(monthSpent)}</span>
      </button>
    );
  }

  const suggestions = mode === 'chat' ? [
    'Onde mais gastei esse mês?',
    'Como estou no orçamento?',
    'Qual cartão tenho mais gasto?',
    'Sugira economias possíveis',
  ] : [
    'almoço sushi 80 itau',
    'aluguel 2150 boleto',
    'netflix 55 nubank',
    'gasolina 200 dia 15 itau',
  ];

  const accForParsed = parsed && accounts.find(a => a.id === parsed.accountId);
  const catForParsed = parsed && categories.find(c => c.id === parsed.categoryId);

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 500,
      width: 'min(420px, calc(100vw - 32px))',
      borderRadius: 18, overflow: 'hidden',
      background: 'rgba(14,14,20,0.96)', backdropFilter: 'blur(30px)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-float)',
      display: 'flex', flexDirection: 'column',
      maxHeight: '70vh',
    }}>
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--line)' }}>
        <span style={{ fontSize: 16 }}>💰</span>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Assistente Financeiro</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => { setMode('chat'); setParsed(null); }} className="btn-ghost small" style={{ fontSize: 10, padding: '3px 8px', background: mode === 'chat' ? 'rgba(60,207,145,0.15)' : 'transparent' }}>💬 Chat</button>
          <button onClick={() => { setMode('lancamento'); }} className="btn-ghost small" style={{ fontSize: 10, padding: '3px 8px', background: mode === 'lancamento' ? 'rgba(60,207,145,0.15)' : 'transparent' }}>⚡ Lançar</button>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>

      {mode === 'chat' && (
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 12, minHeight: 200 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 12 }}>Pergunte sobre seus gastos. A IA tem contexto do mês atual.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {suggestions.map(s => (
                  <button key={s} className="btn-ghost small" onClick={() => setInput(s)} style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 11 }}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <div style={{
                maxWidth: '85%', padding: '8px 12px', borderRadius: 12,
                background: m.role === 'user' ? 'linear-gradient(135deg, rgba(60,207,145,0.15), rgba(91,141,255,0.12))' : 'rgba(255,255,255,0.04)',
                border: m.role === 'user' ? '1px solid rgba(60,207,145,0.25)' : '1px solid var(--line)',
                fontSize: 12.5, lineHeight: 1.5, whiteSpace: 'pre-wrap',
              }}>{m.content}</div>
            </div>
          ))}
          {loading && <div style={{ fontSize: 11, color: 'var(--ink-3)', padding: 8 }}>⟳ pensando...</div>}
        </div>
      )}

      {mode === 'lancamento' && (
        <div style={{ padding: 12, minHeight: 100 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8 }}>Descreva o gasto em linguagem natural. Ex: "almoço 50 itau"</div>
          {!parsed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {suggestions.map(s => (
                <button key={s} className="btn-ghost small" onClick={() => setInput(s)} style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 11 }}>{s}</button>
              ))}
            </div>
          )}
          {parsed && (
            <div style={{ padding: 12, background: 'linear-gradient(135deg, rgba(60,207,145,0.12), rgba(91,141,255,0.08))', border: '1px solid rgba(60,207,145,0.25)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22 }}>{finFmt(parsed.value)}</span>
                <button className="btn-ghost small" onClick={saveParsed} style={{ fontSize: 11, color: '#3ccf91' }}>✓ Adicionar</button>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{parsed.description}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10 }}>
                {catForParsed && <span className="chip" style={{ fontSize: 10 }}>{catForParsed.icon} {catForParsed.name}</span>}
                {accForParsed && <span className="chip" style={{ fontSize: 10 }}>💳 {accForParsed.name}</span>}
                <span className="chip" style={{ fontSize: 10 }}>📅 {Orbita.fmtDate(parsed.date)}</span>
                {parsed.installment && <span className="chip" style={{ fontSize: 10 }}>{parsed.installment.current}/{parsed.installment.total}</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ margin: 10, padding: 8, background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 6, fontSize: 11, color: '#ff5555' }}>{error}</div>
      )}

      <div style={{ padding: 10, borderTop: '1px solid var(--line)', display: 'flex', gap: 6 }}>
        <input className="form-input" placeholder={mode === 'chat' ? 'Pergunte sobre seus gastos...' : 'Ex: almoço 50 itau'}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) { e.preventDefault(); send(); } }}
          style={{ flex: 1, fontSize: 12, padding: '8px 10px' }} disabled={loading} />
        <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12, background: 'linear-gradient(135deg, #3ccf91, #5b8dff)' }} onClick={send} disabled={loading || !input.trim()}>
          {mode === 'chat' ? 'Enviar' : '⚡ Analisar'}
        </button>
        {mode === 'chat' && messages.length > 0 && <button className="btn-ghost small" onClick={clearChat} style={{ fontSize: 10 }}>↺</button>}
      </div>
    </div>
  );
}

window.ScreenFinance = ScreenFinance;
window.FinanceHomeBar = FinanceHomeBar;
