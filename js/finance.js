const FIN_DEFAULT_ACCOUNTS = [{
  id: 'itau-stephano',
  name: 'Itaú Stephano',
  type: 'credit',
  color: '#ec7000',
  closingDay: 25,
  dueDay: 5
}, {
  id: 'nubank-sheida',
  name: 'Nubank Sheida',
  type: 'credit',
  color: '#820ad1',
  closingDay: 18,
  dueDay: 25
}, {
  id: 'visa-sheida',
  name: 'Visa Sheida',
  type: 'credit',
  color: '#1a1f71',
  closingDay: 10,
  dueDay: 17
}, {
  id: 'pix-stephano',
  name: 'PIX Stephano',
  type: 'pix',
  color: '#3ccf91'
}, {
  id: 'pix-sheida',
  name: 'PIX Sheida',
  type: 'pix',
  color: '#3ccf91'
}, {
  id: 'pix-lica',
  name: 'PIX Lica',
  type: 'pix',
  color: '#3ccf91'
}, {
  id: 'pix-babajam',
  name: 'PIX Babajam',
  type: 'pix',
  color: '#3ccf91'
}, {
  id: 'boleto',
  name: 'Boleto',
  type: 'boleto',
  color: '#9ea5b8'
}, {
  id: 'dinheiro',
  name: 'Dinheiro',
  type: 'cash',
  color: '#ffd60a'
}];
const FIN_META_CATS = [{
  id: 'necessidades',
  name: 'Necessidades Básicas',
  color: '#5b8dff',
  pct: 0.55
}, {
  id: 'lazer',
  name: 'Lazer',
  color: '#ff2e88',
  pct: 0.10
}, {
  id: 'dividas',
  name: 'Dívidas',
  color: '#ff5555',
  pct: 0.10
}, {
  id: 'liberdade',
  name: 'Liberdade Financeira',
  color: '#3ccf91',
  pct: 0.10
}, {
  id: 'longo-prazo',
  name: 'Longo Prazo',
  color: '#b066ff',
  pct: 0.10
}, {
  id: 'colchao',
  name: 'Colchão',
  color: '#ffa830',
  pct: 0.05
}];
const FIN_DEFAULT_CATEGORIES = [{
  id: 'moradia',
  name: 'Moradia',
  icon: '🏠',
  color: '#5b8dff',
  meta: 'necessidades'
}, {
  id: 'saude',
  name: 'Saúde',
  icon: '🏥',
  color: '#3ccf91',
  meta: 'necessidades'
}, {
  id: 'comida',
  name: 'Comida',
  icon: '🍽️',
  color: '#ffa830',
  meta: 'necessidades'
}, {
  id: 'servicos',
  name: 'Serviços',
  icon: '⚙️',
  color: '#64d2ff',
  meta: 'necessidades'
}, {
  id: 'impostos',
  name: 'Impostos e Taxas',
  icon: '📋',
  color: '#9ea5b8',
  meta: 'necessidades'
}, {
  id: 'nina',
  name: 'Nina',
  icon: '👶',
  color: '#ffd76a',
  meta: 'necessidades'
}, {
  id: 'transporte',
  name: 'Transporte',
  icon: '🚗',
  color: '#64d2ff',
  meta: 'necessidades'
}, {
  id: 'mercado',
  name: 'Mercado',
  icon: '🛒',
  color: '#3ccf91',
  meta: 'necessidades'
}, {
  id: 'lazer',
  name: 'Lazer',
  icon: '🎬',
  color: '#ff2e88',
  meta: 'lazer'
}, {
  id: 'compras',
  name: 'Compras',
  icon: '🛍️',
  color: '#b066ff',
  meta: 'lazer'
}, {
  id: 'presentes',
  name: 'Presentes',
  icon: '🎁',
  color: '#ff5a3c',
  meta: 'lazer'
}, {
  id: 'delivery',
  name: 'Delivery',
  icon: '🛵',
  color: '#ffd60a',
  meta: 'lazer'
}, {
  id: 'dividas',
  name: 'Dívidas',
  icon: '💸',
  color: '#ff5555',
  meta: 'dividas'
}, {
  id: 'cartao',
  name: 'Cartão de Crédito',
  icon: '💳',
  color: '#ff5a3c',
  meta: 'dividas'
}, {
  id: 'investimento',
  name: 'Investimento',
  icon: '💎',
  color: '#3ccf91',
  meta: 'liberdade'
}, {
  id: 'longo-prazo',
  name: 'Longo Prazo',
  icon: '🌱',
  color: '#b066ff',
  meta: 'longo-prazo'
}, {
  id: 'colchao',
  name: 'Colchão',
  icon: '🛡️',
  color: '#ffa830',
  meta: 'colchao'
}];
function finFmt(v) {
  const n = parseFloat(v) || 0;
  return 'R$ ' + n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function finFmtShort(v) {
  const n = parseFloat(v) || 0;
  if (Math.abs(n) >= 1000) return 'R$ ' + (n / 1000).toFixed(1) + 'k';
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
  return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}
function finCurrentMonth() {
  return Orbita.todayStr().slice(0, 7);
}
function finEnsure(D) {
  if (!D._finance) D._finance = {};
  const F = D._finance;
  if (!F.accounts) F.accounts = JSON.parse(JSON.stringify(FIN_DEFAULT_ACCOUNTS));
  if (!F.categories) F.categories = JSON.parse(JSON.stringify(FIN_DEFAULT_CATEGORIES));
  if (!F.transactions) F.transactions = [];
  if (!F.recurring) F.recurring = [];
  if (!F.investments) F.investments = [];
  if (!F.contributions) F.contributions = [];
  if (!F.debts) F.debts = [];
  if (typeof F.monthlyIncome !== 'number') F.monthlyIncome = 0;
  if (!F.incomeByMonth) F.incomeByMonth = {};
  if (!F.budgetAllocation) {
    F.budgetAllocation = {};
    FIN_META_CATS.forEach(m => F.budgetAllocation[m.id] = m.pct);
  }
  return F;
}
const FIN_INVESTMENT_TYPES = [{
  v: 'reserva',
  l: '🛡️ Reserva de emergência',
  color: '#ffa830'
}, {
  v: 'tesouro',
  l: '📜 Tesouro Direto',
  color: '#3ccf91'
}, {
  v: 'cdb',
  l: '🏦 CDB / LCI / LCA',
  color: '#5b8dff'
}, {
  v: 'fundo',
  l: '📊 Fundo',
  color: '#b066ff'
}, {
  v: 'acoes',
  l: '📈 Ações / FIIs',
  color: '#ff2e88'
}, {
  v: 'cripto',
  l: '₿ Cripto',
  color: '#ffd60a'
}, {
  v: 'poupanca',
  l: '💰 Poupança',
  color: '#3ccf91'
}, {
  v: 'previdencia',
  l: '👴 Previdência',
  color: '#9ea5b8'
}, {
  v: 'outro',
  l: '📦 Outro',
  color: '#64d2ff'
}];
window.finEnsure = finEnsure;
function finGetIncome(fin, ym) {
  if (fin && fin.incomeByMonth && fin.incomeByMonth[ym] !== undefined && fin.incomeByMonth[ym] !== null && fin.incomeByMonth[ym] !== '') {
    return parseFloat(fin.incomeByMonth[ym]) || 0;
  }
  return parseFloat(fin && fin.monthlyIncome) || 0;
}
window.finGetIncome = finGetIncome;
const FIN_LEGACY_TABS = ['lancamentos', 'cartoes', 'resumo', 'graficos', 'patrimonio', 'recorrentes', 'config', 'investimentos', 'dividas'];
function FinPainelNovo({
  path = '/'
}) {
  const URL_FIN = 'http://localhost:5188';
  const [status, setStatus] = React.useState('loading');
  const [tryN, setTryN] = React.useState(0);
  React.useEffect(() => {
    setStatus('loading');
    const onMsg = e => {
      if (e.data === 'financas-ok') setStatus('ok');
    };
    window.addEventListener('message', onMsg);
    const t = setTimeout(() => setStatus(s => s === 'loading' ? 'off' : s), 3500);
    return () => {
      window.removeEventListener('message', onMsg);
      clearTimeout(t);
    };
  }, [tryN]);
  const overlay = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    textAlign: 'center',
    padding: 20,
    background: 'var(--bg-0)',
    borderRadius: 'var(--r-md)',
    fontFamily: 'var(--font-ui)'
  };
  return React.createElement("div", {
    style: {
      position: 'relative',
      height: 'calc(100vh - 200px)',
      minHeight: 480
    }
  }, status !== 'off' && React.createElement("iframe", {
    key: `${path}-${tryN}`,
    src: `${URL_FIN}${path}?embed=1`,
    title: "Orbita Finan\xE7as",
    style: {
      width: '100%',
      height: '100%',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--r-md)',
      background: 'transparent'
    }
  }), status === 'loading' && React.createElement("div", {
    style: overlay
  }, React.createElement("div", {
    style: {
      fontSize: '2rem'
    }
  }, "\uD83E\uDE99"), React.createElement("div", {
    style: {
      color: 'var(--ink-2)'
    }
  }, "Conectando ao Orbita Finan\xE7as\u2026")), status === 'off' && React.createElement("div", {
    style: overlay
  }, React.createElement("div", {
    style: {
      fontSize: '2.4rem'
    }
  }, "\uD83E\uDE99"), React.createElement("div", {
    style: {
      fontSize: '1.05rem',
      fontWeight: 700,
      color: 'var(--ink-1)'
    }
  }, "O servidor do Finan\xE7as n\xE3o est\xE1 rodando"), React.createElement("div", {
    style: {
      color: 'var(--ink-2)',
      maxWidth: 460,
      fontSize: '0.85rem',
      lineHeight: 1.6
    }
  }, "O painel roda localmente no seu Mac (os dados ficam s\xF3 com voc\xEA). Abra o Terminal e rode:"), React.createElement("code", {
    style: {
      background: 'var(--glass-bg-strong)',
      border: '1px solid var(--glass-border)',
      borderRadius: 10,
      padding: '10px 16px',
      fontSize: '0.75rem',
      userSelect: 'all',
      fontFamily: 'var(--font-mono)'
    }
  }, "python3 \"/Users/stephano/Downloads/Claude Code/Pessoal/Financas/app/app.py\""), React.createElement("button", {
    onClick: () => setTryN(n => n + 1),
    style: {
      background: 'var(--gradient-neon)',
      border: 'none',
      color: '#fff',
      fontWeight: 700,
      padding: '10px 22px',
      borderRadius: 12,
      cursor: 'pointer',
      fontSize: '0.9rem'
    }
  }, "Tentar de novo"), React.createElement("div", {
    style: {
      color: 'var(--ink-3)',
      fontSize: '0.75rem'
    }
  }, "Dispon\xEDvel no Mac. No celular, as outras abas do Financeiro continuam funcionando normalmente.")));
}
window.FinPainelNovo = FinPainelNovo;
function ScreenFinance() {
  const {
    data,
    commit
  } = useData();
  const [tab, setTab] = React.useState(() => {
    const t = localStorage.getItem('orbita_fin_tab') || 'painel';
    if (t === 'investimentos' || t === 'dividas') return 'patrimonio';
    if (t === 'categorias' || t === 'orcamento') return 'config';
    return t;
  });
  const [month, setMonth] = React.useState(finCurrentMonth());
  const [revealed, setRevealed] = React.useState(() => localStorage.getItem('orbita_fin_revealed') === '1');
  const fin = data._finance || {};
  const accounts = fin.accounts || FIN_DEFAULT_ACCOUNTS;
  const categories = fin.categories || FIN_DEFAULT_CATEGORIES;
  const txs = fin.transactions || [];
  const recurring = fin.recurring || [];
  const income = finGetIncome(fin, month);
  const monthTxs = txs.filter(t => finMonth(t.date) === month);
  const totalSpent = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const balance = income - totalSpent;
  React.useEffect(() => {
    localStorage.setItem('orbita_fin_tab', tab);
  }, [tab]);
  React.useEffect(() => {
    localStorage.setItem('orbita_fin_revealed', revealed ? '1' : '0');
  }, [revealed]);
  React.useEffect(() => {
    if (!data._finance || !data._finance.accounts || !data._finance.incomeByMonth) {
      commit(D => {
        finEnsure(D);
      });
    }
  }, []);
  const showMonthSwitcher = ['resumo', 'lancamentos', 'cartoes', 'config'].includes(tab);
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "Financeiro.",
    actions: React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        alignItems: 'center'
      }
    }, React.createElement("button", {
      onClick: () => setRevealed(v => !v),
      title: revealed ? 'Ocultar valores' : 'Revelar valores',
      className: "fin-reveal-btn",
      style: {
        width: 32,
        height: 32,
        display: 'grid',
        placeItems: 'center',
        background: revealed ? 'rgba(60,207,145,0.1)' : 'var(--glass-bg)',
        border: revealed ? '1px solid rgba(60,207,145,0.3)' : '1px solid var(--glass-border)',
        color: revealed ? '#3ccf91' : 'var(--ink-3)',
        fontSize: 14,
        cursor: 'pointer',
        borderRadius: 8,
        fontFamily: 'var(--font-ui)'
      }
    }, revealed ? '👁' : '⊘'), [{
      v: 'painel',
      l: '✨ Painel'
    }, {
      v: 'dash',
      l: 'Σ Dash'
    }].map(t => React.createElement("button", {
      key: t.v,
      className: `tab-btn ${tab === t.v ? 'active' : ''}`,
      onClick: () => setTab(t.v)
    }, t.l)), React.createElement("button", {
      className: `tab-btn ${FIN_LEGACY_TABS.includes(tab) ? 'active' : ''}`,
      onClick: () => setTab('lancamentos'),
      title: "M\xF3dulo antigo do Financeiro (dados locais/Firestore)"
    }, "Antigo", FIN_LEGACY_TABS.includes(tab) ? ' ▾' : ''), FIN_LEGACY_TABS.includes(tab) && [{
      v: 'lancamentos',
      l: 'Lançamentos'
    }, {
      v: 'cartoes',
      l: 'Cartões'
    }, {
      v: 'resumo',
      l: 'Resumo'
    }, {
      v: 'graficos',
      l: 'Gráficos'
    }, {
      v: 'patrimonio',
      l: 'Patrimônio'
    }, {
      v: 'recorrentes',
      l: 'Recorrentes'
    }, {
      v: 'config',
      l: 'Config'
    }].map(t => React.createElement("button", {
      key: t.v,
      style: {
        opacity: 0.75,
        fontSize: '0.75rem'
      },
      className: `tab-btn ${tab === t.v ? 'active' : ''}`,
      onClick: () => setTab(t.v)
    }, t.l)))
  }), React.createElement("div", {
    className: "fin-screen-pad"
  }, showMonthSwitcher && React.createElement(FinMonthSwitcher, {
    month: month,
    setMonth: setMonth,
    totalSpent: totalSpent,
    balance: balance,
    revealed: revealed
  }), tab === 'painel' && React.createElement(FinPainelNovo, {
    path: "/"
  }), tab === 'dash' && React.createElement(FinPainelNovo, {
    path: "/dash"
  }), tab === 'lancamentos' && React.createElement(FinLancamentos, {
    month: month,
    setMonth: setMonth,
    fin: fin,
    commit: commit
  }), tab === 'resumo' && React.createElement(FinResumo, {
    month: month,
    fin: fin,
    commit: commit,
    revealed: revealed,
    setRevealed: setRevealed
  }), tab === 'graficos' && React.createElement(FinGraficos, {
    fin: fin,
    revealed: revealed,
    setRevealed: setRevealed
  }), tab === 'patrimonio' && React.createElement(FinPatrimonio, {
    fin: fin,
    commit: commit,
    revealed: revealed
  }), tab === 'investimentos' && React.createElement(FinInvestimentos, {
    fin: fin,
    commit: commit,
    revealed: revealed,
    setRevealed: setRevealed
  }), tab === 'dividas' && React.createElement(FinDividas, {
    fin: fin,
    commit: commit,
    revealed: revealed,
    setRevealed: setRevealed
  }), tab === 'cartoes' && React.createElement(FinCartoes, {
    month: month,
    fin: fin,
    commit: commit
  }), tab === 'recorrentes' && React.createElement(FinRecorrentes, {
    fin: fin,
    commit: commit
  }), tab === 'config' && React.createElement(FinConfig, {
    month: month,
    fin: fin,
    commit: commit
  })));
}
function BlurValue({
  revealed,
  children,
  style
}) {
  if (revealed) return React.createElement("span", {
    style: style
  }, children);
  return React.createElement("span", {
    style: {
      ...(style || {}),
      filter: 'blur(8px)',
      userSelect: 'none',
      transition: 'filter 200ms'
    }
  }, children);
}
function FinMonthSwitcher({
  month,
  setMonth,
  totalSpent,
  balance,
  revealed
}) {
  function shift(delta) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  }
  const showStats = revealed && (typeof totalSpent === 'number' || typeof balance === 'number');
  return React.createElement("div", {
    className: "fin-month-switcher",
    style: {
      marginBottom: 18
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("button", {
    className: "icon-btn",
    onClick: () => shift(-1),
    style: {
      width: 32,
      height: 32,
      fontSize: 14,
      flexShrink: 0
    }
  }, "\u2039"), React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22,
      lineHeight: 1,
      textTransform: 'capitalize'
    }
  }, finMonthLabel(month)), React.createElement("button", {
    className: "icon-btn",
    onClick: () => shift(1),
    style: {
      width: 32,
      height: 32,
      fontSize: 14,
      flexShrink: 0
    }
  }, "\u203A"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setMonth(finCurrentMonth()),
    style: {
      fontSize: 11,
      flexShrink: 0
    }
  }, "Hoje")), showStats && React.createElement("div", {
    className: "fin-month-stats",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 8,
      fontSize: 12,
      color: 'var(--ink-3)',
      flexWrap: 'wrap'
    }
  }, React.createElement("span", null, React.createElement("span", {
    className: "mono",
    style: {
      color: '#ff5a3c',
      fontWeight: 600
    }
  }, finFmt(totalSpent)), " gastos"), React.createElement("span", {
    style: {
      color: 'var(--ink-4)'
    }
  }, "\xB7"), React.createElement("span", null, React.createElement("span", {
    className: "mono",
    style: {
      color: balance >= 0 ? '#3ccf91' : '#ff5555',
      fontWeight: 600
    }
  }, finFmt(balance)), " ", balance >= 0 ? 'sobra' : 'estouro')));
}
function FinResumo({
  month,
  fin,
  commit,
  revealed: revealedProp,
  setRevealed: setRevealedProp
}) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const income = finGetIncome(fin, month);
  const incomeOverride = fin.incomeByMonth && fin.incomeByMonth[month] !== undefined && fin.incomeByMonth[month] !== null && fin.incomeByMonth[month] !== '';
  const budgetAlloc = fin.budgetAllocation || {};
  const [editingIncome, setEditingIncome] = React.useState(false);
  const [incomeDraft, setIncomeDraft] = React.useState('');
  function saveIncome() {
    const v = parseFloat(String(incomeDraft).replace(',', '.'));
    if (isNaN(v)) {
      setEditingIncome(false);
      return;
    }
    commit(D => {
      finEnsure(D);
      D._finance.incomeByMonth[month] = v;
    });
    setEditingIncome(false);
  }
  function clearOverride() {
    commit(D => {
      finEnsure(D);
      delete D._finance.incomeByMonth[month];
    });
    setEditingIncome(false);
  }
  const revealed = revealedProp;
  const setRevealed = setRevealedProp || (() => {});
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
  const variation = prevSpent ? (totalSpent - prevSpent) / prevSpent * 100 : 0;
  const byCat = {};
  monthTxs.forEach(t => {
    const c = categories.find(x => x.id === t.categoryId) || {
      id: '_uncat',
      name: 'Sem categoria',
      color: '#666',
      icon: '•'
    };
    if (!byCat[c.id]) byCat[c.id] = {
      cat: c,
      value: 0,
      count: 0
    };
    byCat[c.id].value += parseFloat(t.value) || 0;
    byCat[c.id].count += 1;
  });
  const catRows = Object.values(byCat).sort((a, b) => b.value - a.value);
  const byMeta = {};
  FIN_META_CATS.forEach(m => byMeta[m.id] = 0);
  monthTxs.forEach(t => {
    const c = categories.find(x => x.id === t.categoryId);
    if (c && c.meta) byMeta[c.meta] = (byMeta[c.meta] || 0) + (parseFloat(t.value) || 0);
  });
  const byAccount = {};
  monthTxs.forEach(t => {
    const a = accounts.find(x => x.id === t.accountId) || {
      id: '_unk',
      name: 'Outro',
      color: '#666'
    };
    if (!byAccount[a.id]) byAccount[a.id] = {
      account: a,
      value: 0,
      count: 0
    };
    byAccount[a.id].value += parseFloat(t.value) || 0;
    byAccount[a.id].count += 1;
  });
  const accRows = Object.values(byAccount).sort((a, b) => b.value - a.value);
  const top5 = [...monthTxs].sort((a, b) => (parseFloat(b.value) || 0) - (parseFloat(a.value) || 0)).slice(0, 5);
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '40%',
      background: balance >= 0 ? 'radial-gradient(ellipse at right, rgba(60,207,145,0.18), transparent 70%)' : 'radial-gradient(ellipse at right, rgba(255,85,85,0.18), transparent 70%)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    className: "eyebrow"
  }, "Saldo do m\xEAs"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 56,
      lineHeight: 1,
      marginTop: 6,
      color: balance >= 0 ? '#3ccf91' : '#ff5555'
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(balance))), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginTop: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, React.createElement("span", null, "renda"), editingIncome ? React.createElement(React.Fragment, null, React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    autoFocus: true,
    value: incomeDraft,
    onChange: e => setIncomeDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') saveIncome();
      if (e.key === 'Escape') setEditingIncome(false);
    },
    style: {
      width: 120,
      padding: '4px 8px',
      fontSize: 12
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: saveIncome,
    style: {
      fontSize: 10,
      color: '#3ccf91'
    }
  }, "\u2713"), incomeOverride && React.createElement("button", {
    className: "btn-ghost small",
    onClick: clearOverride,
    style: {
      fontSize: 10
    }
  }, "\u21BA usar padr\xE3o"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setEditingIncome(false),
    style: {
      fontSize: 10
    }
  }, "\u2715")) : React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => {
      setIncomeDraft(income);
      setEditingIncome(true);
    },
    title: "Editar renda deste m\xEAs",
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--glass-border)',
      padding: '4px 10px',
      borderRadius: 8,
      color: 'var(--ink-1)',
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 120ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--neon-a)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--glass-border)';
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(income)), React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "\u270E")), incomeOverride && React.createElement("span", {
    className: "chip",
    style: {
      fontSize: 9,
      padding: '1px 6px',
      background: 'rgba(176,102,255,0.1)',
      color: 'var(--neon-c)',
      border: '1px solid rgba(176,102,255,0.25)'
    }
  }, "espec\xEDfica"), React.createElement("span", null, "\u2212"), React.createElement("span", null, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(totalSpent)), " gastos"))), React.createElement("div", {
    style: {
      marginTop: 16,
      height: 8,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: income ? `${Math.min(100, totalSpent / income * 100)}%` : '0%',
      background: totalSpent > income ? '#ff5555' : 'var(--gradient-neon)'
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 6,
      fontSize: 10,
      color: 'var(--ink-3)'
    },
    className: "mono"
  }, React.createElement("span", null, income ? Math.round(totalSpent / income * 100) : 0, "% da renda usado"), React.createElement("span", null, prevSpent ? (variation > 0 ? '↑' : '↓') + ' ' + Math.abs(variation).toFixed(0) + '% vs mês anterior' : ''))), React.createElement("div", {
    className: "fin-stats-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 12
    }
  }, [{
    label: 'Renda',
    value: finFmt(income),
    color: '#3ccf91'
  }, {
    label: 'Gastos',
    value: finFmt(totalSpent),
    color: '#ff5a3c'
  }, {
    label: 'Falta pagar',
    value: finFmt(totalPending),
    color: '#ffa830'
  }, {
    label: 'Investido',
    value: finFmt(totalInvested),
    color: 'var(--neon-c)'
  }].map(s => React.createElement("div", {
    key: s.label,
    className: "panel",
    style: {
      padding: 14
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, s.label), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 18,
      fontWeight: 500,
      color: s.color,
      marginTop: 4
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, s.value))))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    },
    className: "screen-grid"
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Por categoria"), catRows.length === 0 && React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, "Sem lan\xE7amentos neste m\xEAs"), catRows.length > 0 && React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      marginBottom: 16
    }
  }, React.createElement(FinDonut, {
    data: catRows.map(r => ({
      value: r.value,
      color: r.cat.color
    })),
    size: 120,
    total: totalSpent,
    blurred: !revealed
  }), React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, catRows.slice(0, 5).map(r => React.createElement("div", {
    key: r.cat.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 11
    }
  }, React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: r.cat.color,
      flexShrink: 0
    }
  }), React.createElement("span", {
    style: {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, r.cat.icon, " ", r.cat.name), React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--ink-2)'
    }
  }, Math.round(r.value / totalSpent * 100), "%"))))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, catRows.map(r => React.createElement("div", {
    key: r.cat.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, r.cat.icon), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 3
    }
  }, React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500
    }
  }, r.cat.name), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: r.cat.color,
      fontWeight: 600
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(r.value)))), React.createElement("div", {
    style: {
      height: 4,
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 2,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: totalSpent ? `${r.value / totalSpent * 100}%` : '0%',
      background: r.cat.color
    }
  }))))))), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Por meio"), accRows.length === 0 && React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, "Sem lan\xE7amentos"), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, accRows.map(r => React.createElement("div", {
    key: r.account.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 8
    }
  }, React.createElement("div", {
    style: {
      width: 8,
      height: 28,
      borderRadius: 2,
      background: r.account.color,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500
    }
  }, r.account.name), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: 'var(--ink-3)'
    }
  }, r.count, " lan\xE7amentos")), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(r.value)))))))), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Regra do or\xE7amento (55/10/10/10/10/5)"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "real vs ideal \xB7 base ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(income)))), React.createElement("div", {
    className: "fin-meta-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 10
    }
  }, FIN_META_CATS.map(m => {
    const real = byMeta[m.id] || 0;
    const target = income * (budgetAlloc[m.id] || m.pct);
    const pct = target ? Math.round(real / target * 100) : 0;
    const over = real > target;
    return React.createElement("div", {
      key: m.id,
      style: {
        padding: 12,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500
      }
    }, m.name), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: over ? '#ff5555' : 'var(--ink-3)'
      }
    }, pct, "%")), React.createElement("div", {
      style: {
        height: 5,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 5
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        width: `${Math.min(100, pct)}%`,
        background: over ? '#ff5555' : m.color
      }
    })), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10
      },
      className: "mono"
    }, React.createElement("span", {
      style: {
        color: m.color
      }
    }, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(real))), React.createElement("span", {
      style: {
        color: 'var(--ink-3)'
      }
    }, "/ ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(target)))));
  }))), top5.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Top 5 maiores gastos"), top5.map((t, i) => {
    const cat = categories.find(c => c.id === t.categoryId);
    const acc = accounts.find(a => a.id === t.accountId);
    return React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderBottom: i < top5.length - 1 ? '1px solid var(--line)' : 'none'
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-4)',
        width: 14
      }
    }, i + 1), React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, cat?.icon || '•'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, t.description), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, Orbita.fmtDate(t.date), " \xB7 ", acc?.name || '—', t.installment ? ` · ${t.installment.current}/${t.installment.total}` : '')), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: '#ff5a3c'
      }
    }, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(t.value))));
  })));
}
function FinDonut({
  data,
  size = 120,
  total,
  blurred
}) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      flexShrink: 0
    }
  }, React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "rgba(255,255,255,0.05)",
    strokeWidth: "14"
  }), data.map((d, i) => {
    const len = d.value / sum * c;
    const seg = React.createElement("circle", {
      key: i,
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: d.color,
      strokeWidth: "14",
      strokeDasharray: `${len} ${c - len}`,
      strokeDashoffset: -offset,
      transform: `rotate(-90 ${size / 2} ${size / 2})`
    });
    offset += len;
    return seg;
  }), React.createElement("text", {
    x: size / 2,
    y: size / 2 - 4,
    textAnchor: "middle",
    fontSize: "10",
    fill: "var(--ink-3)",
    fontFamily: "var(--font-mono)"
  }, "total"), React.createElement("text", {
    x: size / 2,
    y: size / 2 + 12,
    textAnchor: "middle",
    fontSize: "13",
    fill: "#fff",
    fontWeight: "600",
    fontFamily: "var(--font-mono)"
  }, finFmtShort(total)));
}
function FinLancamentos({
  month,
  setMonth,
  fin,
  commit
}) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const [showAdd, setShowAdd] = React.useState(false);
  const [editTx, setEditTx] = React.useState(null);
  const [filterCat, setFilterCat] = React.useState(null);
  const [filterAcc, setFilterAcc] = React.useState(null);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [moveMenuFor, setMoveMenuFor] = React.useState(null);
  const [dragId, setDragId] = React.useState(null);
  const [dragOverId, setDragOverId] = React.useState(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  let monthTxs = txs.filter(t => finMonth(t.date) === month);
  const isFiltered = !!filterCat || !!filterAcc || filterStatus !== 'all' || !!search.trim();
  if (filterCat) monthTxs = monthTxs.filter(t => t.categoryId === filterCat);
  if (filterAcc) monthTxs = monthTxs.filter(t => t.accountId === filterAcc);
  if (filterStatus !== 'all') monthTxs = monthTxs.filter(t => (t.status || 'paid') === filterStatus);
  if (search.trim()) {
    const s = search.toLowerCase();
    monthTxs = monthTxs.filter(t => (t.description || '').toLowerCase().includes(s));
  }
  monthTxs = [...monthTxs].sort((a, b) => {
    const ao = a.customOrder,
      bo = b.customOrder;
    if (ao !== undefined && bo !== undefined) return ao - bo;
    if (ao !== undefined) return -1;
    if (bo !== undefined) return 1;
    return (b.date || '').localeCompare(a.date || '');
  });
  const totalFiltered = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  function deleteTx(id) {
    const tx = txs.find(t => t.id === id);
    if (!tx) return;
    const groupId = tx.parentId || tx.id;
    const siblings = txs.filter(t => (t.parentId === groupId || t.id === groupId) && t.installment);
    if (siblings.length > 1) {
      const choice = confirm(`Esta compra tem ${siblings.length} parcelas. Deletar TODAS as parcelas?\n\nOK = todas · Cancelar = só esta`);
      if (choice) {
        commit(D => {
          finEnsure(D);
          D._finance.transactions = D._finance.transactions.filter(t => !(t.parentId === groupId || t.id === groupId));
        });
        return;
      }
      if (!confirm('Deletar somente esta parcela?')) return;
    } else {
      if (!confirm('Deletar este lançamento?')) return;
    }
    commit(D => {
      finEnsure(D);
      D._finance.transactions = D._finance.transactions.filter(t => t.id !== id);
    });
  }
  function toggleStatus(id) {
    commit(D => {
      finEnsure(D);
      const t = D._finance.transactions.find(x => x.id === id);
      if (t) t.status = t.status === 'paid' || !t.status ? 'pending' : 'paid';
    });
  }
  function moveToMonth(id, deltaMonths) {
    commit(D => {
      finEnsure(D);
      const t = D._finance.transactions.find(x => x.id === id);
      if (!t || !t.date) return;
      const [y, m, day] = t.date.split('-').map(Number);
      const d = new Date(y, m - 1 + deltaMonths, day);
      const lastDayOfTarget = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const newDay = Math.min(day, lastDayOfTarget);
      const target = new Date(d.getFullYear(), d.getMonth(), newDay);
      t.date = target.getFullYear() + '-' + String(target.getMonth() + 1).padStart(2, '0') + '-' + String(target.getDate()).padStart(2, '0');
    });
    setMoveMenuFor(null);
  }
  function moveToSpecificMonth(id, ym) {
    commit(D => {
      finEnsure(D);
      const t = D._finance.transactions.find(x => x.id === id);
      if (!t || !t.date) return;
      const day = parseInt(t.date.split('-')[2]);
      const [y, m] = ym.split('-').map(Number);
      const lastDay = new Date(y, m, 0).getDate();
      t.date = `${ym}-${String(Math.min(day, lastDay)).padStart(2, '0')}`;
    });
    setMoveMenuFor(null);
  }
  function handleDrop(targetId) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const visibleIds = monthTxs.map(t => t.id);
    const fromIdx = visibleIds.indexOf(dragId);
    const toIdx = visibleIds.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const newOrder = [...visibleIds];
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, dragId);
    commit(D => {
      finEnsure(D);
      newOrder.forEach((id, idx) => {
        const t = D._finance.transactions.find(x => x.id === id);
        if (t) t.customOrder = idx;
      });
    });
    setDragId(null);
    setDragOverId(null);
  }
  function clearCustomOrder() {
    if (!confirm('Voltar à ordenação por data nesse mês?')) return;
    commit(D => {
      finEnsure(D);
      D._finance.transactions.forEach(t => {
        if (finMonth(t.date) === month) delete t.customOrder;
      });
    });
  }
  const hasCustomOrder = monthTxs.some(t => t.customOrder !== undefined);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "panel fin-filters",
    style: {
      padding: 14,
      marginBottom: 14
    }
  }, React.createElement("div", {
    className: "fin-filters-mobile-bar mobile-only",
    style: {
      display: 'none',
      alignItems: 'center',
      gap: 8,
      marginBottom: filtersOpen ? 10 : 0
    }
  }, React.createElement("button", {
    className: `btn-ghost small ${filtersOpen || isFiltered ? 'active' : ''}`,
    onClick: () => setFiltersOpen(v => !v),
    style: {
      fontSize: 12,
      padding: '8px 12px',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      borderColor: isFiltered ? 'var(--neon-a)' : undefined,
      color: isFiltered ? 'var(--neon-a)' : undefined
    }
  }, React.createElement("span", null, "\u2699"), React.createElement("span", null, "Filtros"), isFiltered && React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 3,
      background: 'var(--neon-a)'
    }
  })), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '9px 14px',
      fontSize: 12,
      marginLeft: 'auto'
    },
    onClick: () => {
      setEditTx(null);
      setShowAdd(true);
    }
  }, "\uFF0B")), React.createElement("div", {
    className: `fin-filters-row ${filtersOpen ? 'open' : ''}`,
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Buscar...",
    value: search,
    onChange: e => setSearch(e.target.value),
    style: {
      flex: '1 1 200px',
      minWidth: 160,
      fontSize: 12,
      padding: '8px 12px'
    }
  }), React.createElement("select", {
    className: "form-input",
    value: filterCat || '',
    onChange: e => setFilterCat(e.target.value || null),
    style: {
      fontSize: 12,
      padding: '8px 12px',
      minWidth: 140
    }
  }, React.createElement("option", {
    value: ""
  }, "Todas categorias"), categories.map(c => React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.icon, " ", c.name))), React.createElement("select", {
    className: "form-input",
    value: filterAcc || '',
    onChange: e => setFilterAcc(e.target.value || null),
    style: {
      fontSize: 12,
      padding: '8px 12px',
      minWidth: 140
    }
  }, React.createElement("option", {
    value: ""
  }, "Todos meios"), accounts.map(a => React.createElement("option", {
    key: a.id,
    value: a.id
  }, a.name))), React.createElement("select", {
    className: "form-input",
    value: filterStatus,
    onChange: e => setFilterStatus(e.target.value),
    style: {
      fontSize: 12,
      padding: '8px 12px',
      minWidth: 110
    }
  }, React.createElement("option", {
    value: "all"
  }, "Todos status"), React.createElement("option", {
    value: "paid"
  }, "Pagos"), React.createElement("option", {
    value: "pending"
  }, "Pendentes")), React.createElement("button", {
    className: "btn btn-primary fin-add-tx-desktop",
    style: {
      padding: '9px 18px',
      fontSize: 12
    },
    onClick: () => {
      setEditTx(null);
      setShowAdd(true);
    }
  }, "\uFF0B Lan\xE7amento"), isFiltered && React.createElement("button", {
    className: "btn-ghost small fin-clear-filters mobile-only",
    onClick: () => {
      setSearch('');
      setFilterCat(null);
      setFilterAcc(null);
      setFilterStatus('all');
    },
    style: {
      fontSize: 11
    }
  }, "Limpar filtros")), React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 11,
      color: 'var(--ink-3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, React.createElement("span", null, monthTxs.length, " lan\xE7amentos ", !isFiltered && monthTxs.length > 1 && React.createElement("span", {
    className: "desktop-only",
    style: {
      color: 'var(--ink-4)'
    }
  }, "\xB7 arraste \u22EE\u22EE para reordenar")), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, hasCustomOrder && !isFiltered && React.createElement("button", {
    className: "btn-ghost small",
    onClick: clearCustomOrder,
    style: {
      fontSize: 10
    }
  }, "\u21BB ordem por data"), React.createElement("span", {
    className: "mono"
  }, "total filtrado: ", React.createElement("strong", {
    style: {
      color: '#ff5a3c'
    }
  }, finFmt(totalFiltered)))))), React.createElement("div", {
    className: "panel",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, monthTxs.length === 0 && React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\uD83D\uDCB0"), React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, "Nenhum lan\xE7amento"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "Adicione o primeiro gasto deste m\xEAs")), monthTxs.map((t, i) => {
    const cat = categories.find(c => c.id === t.categoryId);
    const acc = accounts.find(a => a.id === t.accountId);
    const status = t.status || 'paid';
    const isDragging = dragId === t.id;
    const isDragOver = dragOverId === t.id && dragId !== t.id;
    const draggable = !isFiltered;
    return React.createElement("div", {
      key: t.id,
      className: "fin-tx-row",
      draggable: draggable,
      onDragStart: e => {
        if (!draggable) return;
        setDragId(t.id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', t.id);
      },
      onDragOver: e => {
        if (!dragId || dragId === t.id) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverId !== t.id) setDragOverId(t.id);
      },
      onDragLeave: e => {
        if (dragOverId === t.id) setDragOverId(null);
      },
      onDrop: e => {
        e.preventDefault();
        handleDrop(t.id);
      },
      onDragEnd: () => {
        setDragId(null);
        setDragOverId(null);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderBottom: i < monthTxs.length - 1 ? '1px solid var(--line)' : 'none',
        borderTop: isDragOver ? '2px solid var(--neon-a)' : 'none',
        marginTop: isDragOver ? -2 : 0,
        opacity: status === 'pending' ? 0.65 : isDragging ? 0.4 : 1,
        background: isDragging ? 'rgba(255,46,136,0.06)' : 'transparent',
        transition: 'background 120ms, opacity 120ms',
        cursor: draggable ? 'default' : 'default'
      }
    }, draggable && React.createElement("span", {
      title: "Arraste para reordenar",
      style: {
        display: 'grid',
        placeItems: 'center',
        width: 14,
        height: 24,
        cursor: 'grab',
        color: 'var(--ink-4)',
        fontSize: 14,
        lineHeight: 1,
        flexShrink: 0,
        userSelect: 'none'
      }
    }, "\u22EE\u22EE"), React.createElement("button", {
      onClick: () => toggleStatus(t.id),
      title: status === 'paid' ? 'Pago · clique para marcar como pendente' : 'Pendente · clique para marcar como pago',
      style: {
        width: 22,
        height: 22,
        borderRadius: 6,
        flexShrink: 0,
        background: status === 'paid' ? '#3ccf91' : 'transparent',
        border: status === 'paid' ? '1px solid #3ccf91' : '1.5px dashed #ffa830',
        color: '#fff',
        fontSize: 12,
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700
      }
    }, status === 'paid' ? '✓' : React.createElement("span", {
      style: {
        color: '#ffa830',
        fontSize: 12,
        fontWeight: 700
      }
    }, "!")), React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: (cat?.color || '#666') + '22',
        border: `1px solid ${cat?.color || '#666'}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 14,
        flexShrink: 0
      }
    }, cat?.icon || '•'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, t.description), status !== 'paid' && React.createElement("span", {
      className: "chip",
      style: {
        padding: '1px 7px',
        fontSize: 9,
        background: 'rgba(255,168,48,0.14)',
        color: '#ffa830',
        border: '1px solid rgba(255,168,48,0.35)',
        flexShrink: 0,
        fontWeight: 600,
        letterSpacing: '0.05em'
      }
    }, "PENDENTE")), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        marginTop: 2
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, Orbita.fmtDate(t.date)), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, "\xB7"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: acc?.color || 'var(--ink-3)',
        fontWeight: 500
      }
    }, acc?.name || '—'), t.installment && React.createElement(React.Fragment, null, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, "\xB7"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--neon-c)'
      }
    }, t.installment.current, "/", t.installment.total)), cat && React.createElement("span", {
      className: "chip",
      style: {
        padding: '1px 7px',
        fontSize: 9
      }
    }, cat.name))), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: '#ff5a3c',
        flexShrink: 0
      }
    }, finFmt(t.value)), React.createElement("div", {
      className: "fin-tx-actions",
      style: {
        display: 'flex',
        gap: 2,
        flexShrink: 0,
        position: 'relative'
      }
    }, React.createElement("button", {
      onClick: () => setMoveMenuFor(moveMenuFor === t.id ? null : t.id),
      title: "Mover para outro m\xEAs",
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u21A6"), React.createElement("button", {
      onClick: () => {
        setEditTx(t);
        setShowAdd(true);
      },
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u270E"), React.createElement("button", {
      onClick: () => deleteTx(t.id),
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u2715"), moveMenuFor === t.id && React.createElement(FinMoveMonthMenu, {
      currentDate: t.date,
      onPick: (delta, ym) => {
        if (ym) moveToSpecificMonth(t.id, ym);else moveToMonth(t.id, delta);
      },
      onClose: () => setMoveMenuFor(null)
    })));
  })), showAdd && React.createElement(FinTxModal, {
    onClose: () => {
      setShowAdd(false);
      setEditTx(null);
    },
    editTx: editTx,
    fin: fin,
    commit: commit,
    defaultMonth: month,
    onSaved: savedDate => {
      const ym = (savedDate || '').slice(0, 7);
      if (setMonth && ym && ym !== month) setMonth(ym);
    }
  }));
}
function FinMoveMonthMenu({
  currentDate,
  onPick,
  onClose
}) {
  const ref = React.useRef();
  React.useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const cur = currentDate ? currentDate.slice(0, 7) : finCurrentMonth();
  const [y, m] = cur.split('-').map(Number);
  const options = [];
  for (let d = -6; d <= 6; d++) {
    if (d === 0) continue;
    const dt = new Date(y, m - 1 + d, 1);
    const ym = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
    options.push({
      delta: d,
      ym,
      label: dt.toLocaleDateString('pt-BR', {
        month: 'short',
        year: '2-digit'
      })
    });
  }
  return React.createElement("div", {
    ref: ref,
    style: {
      position: 'absolute',
      right: 0,
      top: 30,
      zIndex: 100,
      background: 'rgba(14,14,20,0.98)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--glass-border)',
      borderRadius: 10,
      boxShadow: 'var(--shadow-float)',
      width: 220,
      maxHeight: 320,
      overflowY: 'auto',
      padding: 6
    }
  }, React.createElement("div", {
    style: {
      padding: '8px 10px 4px',
      fontSize: 10,
      color: 'var(--ink-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, "Mover para o m\xEAs"), options.map(o => React.createElement("button", {
    key: o.ym,
    onClick: () => onPick(o.delta, o.ym),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '8px 10px',
      background: 'none',
      border: 'none',
      borderRadius: 6,
      color: 'var(--ink-1)',
      fontSize: 12,
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-ui)',
      textTransform: 'capitalize'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, React.createElement("span", null, o.label.replace('.', '')), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: o.delta > 0 ? 'var(--neon-c)' : 'var(--ink-3)'
    }
  }, o.delta > 0 ? '+' : '', o.delta, "m"))), React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line)',
      marginTop: 4,
      paddingTop: 4
    }
  }, React.createElement("input", {
    type: "month",
    defaultValue: cur,
    onChange: e => {
      if (e.target.value) onPick(0, e.target.value);
    },
    style: {
      width: '100%',
      padding: '8px 10px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--line)',
      borderRadius: 6,
      color: 'var(--ink-1)',
      fontSize: 12,
      fontFamily: 'var(--font-mono)'
    }
  })));
}
function FinTxModal({
  onClose,
  editTx,
  fin,
  commit,
  defaultMonth,
  onSaved
}) {
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
            description: description.trim(),
            value: v,
            date,
            accountId,
            categoryId,
            status,
            installment: isInstallment ? {
              current: startCur,
              total: totalInst
            } : null
          };
        }
      } else {
        const groupId = Orbita.uid();
        const baseTx = {
          id: groupId,
          description: description.trim(),
          value: v,
          date,
          accountId,
          categoryId,
          status,
          installment: isInstallment ? {
            current: startCur,
            total: totalInst
          } : null,
          parentId: isInstallment && totalInst > 1 ? groupId : null
        };
        D._finance.transactions.push(baseTx);
        if (isInstallment && totalInst > 1) {
          for (let i = startCur + 1; i <= totalInst; i++) {
            const [y, m, d] = date.split('-').map(Number);
            const next = new Date(y, m - 1 + (i - startCur), d);
            const nextDate = next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0') + '-' + String(next.getDate()).padStart(2, '0');
            D._finance.transactions.push({
              id: Orbita.uid(),
              description: description.trim(),
              value: v,
              date: nextDate,
              accountId,
              categoryId,
              status: 'pending',
              installment: {
                current: i,
                total: totalInst
              },
              parentId: groupId
            });
          }
        }
      }
    });
    if (onSaved) onSaved(date);
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(520px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editTx ? 'Editar lançamento' : 'Novo lançamento'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Descri\xE7\xE3o"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Almo\xE7o, Aluguel, Netflix...",
    value: description,
    onChange: e => setDescription(e.target.value)
  })), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Valor"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: value,
    onChange: e => setValue(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') save();
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Data"), React.createElement("input", {
    className: "form-input",
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value)
  }))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Categoria"), React.createElement("select", {
    className: "form-input",
    value: categoryId,
    onChange: e => setCategoryId(e.target.value)
  }, categories.map(c => React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.icon, " ", c.name)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Meio / Cart\xE3o"), React.createElement("select", {
    className: "form-input",
    value: accountId,
    onChange: e => setAccountId(e.target.value)
  }, accounts.map(a => React.createElement("option", {
    key: a.id,
    value: a.id
  }, a.name))))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Status"), React.createElement("div", {
    className: "form-chips"
  }, [{
    v: 'paid',
    l: '✓ Pago'
  }, {
    v: 'pending',
    l: '⏳ Pendente'
  }].map(s => React.createElement("div", {
    key: s.v,
    className: `form-chip ${status === s.v ? 'active' : ''}`,
    onClick: () => setStatus(s.v)
  }, s.l)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("input", {
    type: "checkbox",
    checked: isInstallment,
    onChange: e => setIsInstallment(e.target.checked),
    style: {
      accentColor: 'var(--neon-a)'
    }
  }), "Parcelado"), isInstallment && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginTop: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "parcela"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: currentInst,
    onChange: e => setCurrentInst(e.target.value),
    style: {
      width: 70
    }
  }), React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "de"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: installments,
    onChange: e => setInstallments(e.target.value),
    style: {
      width: 70
    }
  })), !editTx && futureCount > 0 && React.createElement("div", {
    style: {
      marginTop: 8,
      padding: '8px 10px',
      background: 'rgba(176,102,255,0.08)',
      border: '1px solid rgba(176,102,255,0.2)',
      borderRadius: 6,
      fontSize: 11,
      color: 'var(--ink-2)'
    }
  }, "\u26A1 ", React.createElement("strong", null, futureCount), " parcela", futureCount > 1 ? 's' : '', " futura", futureCount > 1 ? 's' : '', " de ", finFmt(parseFloat(String(value).replace(',', '.')) || 0), " ser", futureCount > 1 ? 'ão' : 'á', " criada", futureCount > 1 ? 's' : '', " automaticamente nos pr\xF3ximos meses.")))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, editTx ? 'Salvar' : 'Adicionar'))));
}
function FinCartoes({
  month,
  fin,
  commit
}) {
  const accounts = fin.accounts || [];
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const [editAcc, setEditAcc] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [detailAcc, setDetailAcc] = React.useState(null);
  const [bulkAddAcc, setBulkAddAcc] = React.useState(null);
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      flexWrap: 'wrap',
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, accounts.length, " meios \xB7 clique para detalhar \xB7 use \uFF0B para lan\xE7ar a fatura do m\xEAs"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      setEditAcc(null);
      setShowAdd(true);
    },
    style: {
      fontSize: 12
    }
  }, "\uFF0B Novo meio")), React.createElement("div", {
    className: "fin-cards-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 14
    }
  }, accounts.map(a => {
    const accTxs = txs.filter(t => t.accountId === a.id && finMonth(t.date) === month);
    const total = accTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const pending = accTxs.filter(t => t.status === 'pending').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const isCard = a.type === 'credit';
    return React.createElement("div", {
      key: a.id,
      className: "panel",
      onClick: () => setDetailAcc(a),
      style: {
        padding: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 120ms'
      },
      onMouseEnter: e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = a.color + '88';
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '';
      }
    }, React.createElement("div", {
      style: {
        padding: '16px 18px',
        background: `linear-gradient(135deg, ${a.color}33, ${a.color}11)`,
        borderBottom: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    }, a.type === 'credit' ? 'Cartão' : a.type === 'pix' ? 'PIX' : a.type === 'boleto' ? 'Boleto' : 'Outro'), React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 600,
        marginTop: 4
      }
    }, a.name)), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, React.createElement("button", {
      className: "icon-btn",
      title: "Lan\xE7ar gastos do m\xEAs",
      onClick: e => {
        e.stopPropagation();
        setBulkAddAcc(a);
      },
      style: {
        width: 28,
        height: 28,
        fontSize: 14,
        background: 'var(--gradient-neon-soft)',
        borderColor: 'rgba(255,46,136,0.3)',
        color: '#fff'
      }
    }, "\uFF0B"), React.createElement("button", {
      className: "icon-btn",
      title: "Editar meio",
      onClick: e => {
        e.stopPropagation();
        setEditAcc(a);
        setShowAdd(true);
      },
      style: {
        width: 28,
        height: 28,
        fontSize: 11
      }
    }, "\u270E"))), isCard && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)',
        marginTop: 8
      }
    }, "fecha dia ", a.closingDay || '—', " \xB7 vence dia ", a.dueDay || '—')), React.createElement("div", {
      style: {
        padding: '14px 18px'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4
      }
    }, React.createElement("span", {
      className: "eyebrow"
    }, "M\xEAs"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 16,
        fontWeight: 600,
        color: a.color
      }
    }, finFmt(total))), pending > 0 && React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, React.createElement("span", null, "Pendente"), React.createElement("span", {
      className: "mono"
    }, finFmt(pending))), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)',
        marginTop: 4
      }
    }, accTxs.length, " lan\xE7amentos"), accTxs.length > 0 && React.createElement("div", {
      style: {
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid var(--line)'
      }
    }, accTxs.sort((x, y) => y.value - x.value).slice(0, 3).map(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      return React.createElement("div", {
        key: t.id,
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 0',
          fontSize: 11
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          overflow: 'hidden'
        }
      }, React.createElement("span", null, cat?.icon || '•'), React.createElement("span", {
        style: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, t.description), t.installment && React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 9,
          color: 'var(--neon-c)'
        }
      }, t.installment.current, "/", t.installment.total)), React.createElement("span", {
        className: "mono",
        style: {
          color: 'var(--ink-2)',
          flexShrink: 0,
          marginLeft: 8
        }
      }, finFmtShort(t.value)));
    }), accTxs.length > 3 && React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--ink-3)',
        textAlign: 'center',
        marginTop: 6,
        fontStyle: 'italic'
      }
    }, "+ ", accTxs.length - 3, " outros \xB7 clique para ver todos"))));
  })), showAdd && React.createElement(FinAccountModal, {
    onClose: () => {
      setShowAdd(false);
      setEditAcc(null);
    },
    editAcc: editAcc,
    commit: commit
  }), detailAcc && React.createElement(FinAccountDetailModal, {
    onClose: () => setDetailAcc(null),
    account: detailAcc,
    month: month,
    fin: fin,
    commit: commit,
    onAddBulk: () => {
      setBulkAddAcc(detailAcc);
      setDetailAcc(null);
    }
  }), bulkAddAcc && React.createElement(FinBulkAddModal, {
    onClose: () => setBulkAddAcc(null),
    account: bulkAddAcc,
    month: month,
    categories: categories,
    commit: commit
  }));
}
function FinBulkAddModal({
  onClose,
  account,
  month,
  categories,
  commit
}) {
  const monthLabel = finMonthLabel(month);
  const defaultDay = account && account.type === 'credit' && account.dueDay ? Math.min(28, account.dueDay) : 5;
  const [rows, setRows] = React.useState(() => [makeRow(categories, defaultDay), makeRow(categories, defaultDay), makeRow(categories, defaultDay)]);
  function makeRow(cats, day) {
    return {
      id: Math.random().toString(36).slice(2),
      description: '',
      value: '',
      categoryId: cats[0]?.id || '',
      day: String(day),
      installmentTotal: '',
      installmentCurrent: '1'
    };
  }
  function updateRow(idx, patch) {
    setRows(r => r.map((row, i) => i === idx ? {
      ...row,
      ...patch
    } : row));
    if (idx === rows.length - 1 && (patch.description || patch.value)) {
      setTimeout(() => setRows(r => r[r.length - 1].description || r[r.length - 1].value ? [...r, makeRow(categories, defaultDay)] : r), 0);
    }
  }
  function removeRow(idx) {
    setRows(r => r.length > 1 ? r.filter((_, i) => i !== idx) : [makeRow(categories, defaultDay)]);
  }
  function addRow() {
    setRows(r => [...r, makeRow(categories, defaultDay)]);
  }
  const validRows = rows.filter(r => r.description.trim() && parseFloat(String(r.value).replace(',', '.')) > 0);
  const totalPreview = validRows.reduce((s, r) => s + parseFloat(String(r.value).replace(',', '.')), 0);
  function save() {
    if (validRows.length === 0) return;
    commit(D => {
      finEnsure(D);
      validRows.forEach(r => {
        const v = parseFloat(String(r.value).replace(',', '.'));
        const day = Math.min(28, Math.max(1, parseInt(r.day) || defaultDay));
        const date = `${month}-${String(day).padStart(2, '0')}`;
        const totalInst = parseInt(r.installmentTotal) || 1;
        const curInst = Math.max(1, Math.min(totalInst, parseInt(r.installmentCurrent) || 1));
        const groupId = Orbita.uid();
        const baseTx = {
          id: groupId,
          description: r.description.trim(),
          value: v,
          date,
          accountId: account.id,
          categoryId: r.categoryId,
          status: 'paid',
          installment: totalInst > 1 ? {
            current: curInst,
            total: totalInst
          } : null,
          parentId: totalInst > 1 ? groupId : null
        };
        D._finance.transactions.push(baseTx);
        if (totalInst > 1) {
          for (let i = curInst + 1; i <= totalInst; i++) {
            const [y, m, d] = date.split('-').map(Number);
            const next = new Date(y, m - 1 + (i - curInst), d);
            const nextDate = next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0') + '-' + String(next.getDate()).padStart(2, '0');
            D._finance.transactions.push({
              id: Orbita.uid(),
              description: r.description.trim(),
              value: v,
              date: nextDate,
              accountId: account.id,
              categoryId: r.categoryId,
              status: 'pending',
              installment: {
                current: i,
                total: totalInst
              },
              parentId: groupId
            });
          }
        }
      });
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel fin-bulk-modal",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(820px, 96vw)',
      maxHeight: '92vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    className: "modal-header",
    style: {
      background: `linear-gradient(135deg, ${account.color}33, ${account.color}11)`,
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, account.type === 'credit' ? 'Lançar fatura · ' : 'Lançar gastos · ', monthLabel), React.createElement("h2", {
    style: {
      marginTop: 2
    }
  }, account.name), account.type === 'credit' && React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "fecha dia ", account.closingDay || '—', " \xB7 vence dia ", account.dueDay || '—')), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body",
    style: {
      overflowY: 'auto',
      flex: 1,
      padding: '14px 16px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 10
    }
  }, "Itemize os gastos da fatura/extrato. Linhas vazias s\xE3o ignoradas. Use parcela ", `>`, " 1 para parcelar automaticamente nos pr\xF3ximos meses."), React.createElement("div", {
    className: "fin-bulk-rows"
  }, React.createElement("div", {
    className: "fin-bulk-row fin-bulk-header",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 130px 100px 60px 80px 28px',
      gap: 6,
      fontSize: 10,
      color: 'var(--ink-4)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '0 4px 6px',
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("div", null, "Descri\xE7\xE3o"), React.createElement("div", null, "Categoria"), React.createElement("div", null, "Valor"), React.createElement("div", null, "Dia"), React.createElement("div", null, "Parcela"), React.createElement("div", null)), rows.map((row, idx) => React.createElement("div", {
    key: row.id,
    className: "fin-bulk-row",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 130px 100px 60px 80px 28px',
      gap: 6,
      padding: '6px 4px',
      borderBottom: '1px solid var(--line)',
      alignItems: 'center'
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Ex: Mercado, Uber, Spotify...",
    value: row.description,
    onChange: e => updateRow(idx, {
      description: e.target.value
    }),
    style: {
      padding: '8px 10px',
      fontSize: 12
    }
  }), React.createElement("select", {
    className: "form-input",
    value: row.categoryId,
    onChange: e => updateRow(idx, {
      categoryId: e.target.value
    }),
    style: {
      padding: '8px 6px',
      fontSize: 11
    }
  }, categories.map(c => React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.icon, " ", c.name))), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: row.value,
    onChange: e => updateRow(idx, {
      value: e.target.value
    }),
    style: {
      padding: '8px 10px',
      fontSize: 12,
      textAlign: 'right'
    }
  }), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    max: "28",
    value: row.day,
    onChange: e => updateRow(idx, {
      day: e.target.value
    }),
    style: {
      padding: '8px 6px',
      fontSize: 12,
      textAlign: 'center'
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      alignItems: 'center'
    }
  }, React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    placeholder: "1",
    title: "Atual",
    value: row.installmentCurrent,
    onChange: e => updateRow(idx, {
      installmentCurrent: e.target.value
    }),
    style: {
      padding: '6px 4px',
      fontSize: 10,
      textAlign: 'center',
      width: 32
    }
  }), React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--ink-4)'
    }
  }, "/"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    placeholder: "x",
    title: "Total parcelas",
    value: row.installmentTotal,
    onChange: e => updateRow(idx, {
      installmentTotal: e.target.value
    }),
    style: {
      padding: '6px 4px',
      fontSize: 10,
      textAlign: 'center',
      width: 32
    }
  })), React.createElement("button", {
    onClick: () => removeRow(idx),
    title: "Remover",
    style: {
      width: 24,
      height: 24,
      padding: 0,
      background: 'transparent',
      border: '1px solid var(--line)',
      borderRadius: 6,
      color: 'var(--ink-4)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2715")))), React.createElement("button", {
    className: "btn-ghost small",
    onClick: addRow,
    style: {
      marginTop: 10,
      fontSize: 11
    }
  }, "\uFF0B Adicionar linha")), React.createElement("div", {
    className: "modal-footer",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-2)'
    }
  }, React.createElement("strong", null, validRows.length), " lan\xE7amento", validRows.length === 1 ? '' : 's', " \xB7 total ", React.createElement("span", {
    className: "mono",
    style: {
      color: '#ff5a3c',
      fontWeight: 600
    }
  }, finFmt(totalPreview))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    disabled: validRows.length === 0,
    onClick: save,
    style: {
      padding: '10px 20px',
      fontSize: 13,
      opacity: validRows.length === 0 ? 0.5 : 1
    }
  }, "Salvar ", validRows.length || '')))));
}
function FinAccountDetailModal({
  onClose,
  account,
  month,
  fin,
  commit,
  onAddBulk
}) {
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const accTxs = txs.filter(t => t.accountId === account.id && finMonth(t.date) === month).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const total = accTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalPaid = accTxs.filter(t => (t.status || 'paid') === 'paid').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const totalPending = accTxs.filter(t => t.status === 'pending').reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
  const futureInstallments = txs.filter(t => t.accountId === account.id && t.installment && finMonth(t.date) > month).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const futureByMonth = {};
  futureInstallments.forEach(t => {
    const m = finMonth(t.date);
    if (!futureByMonth[m]) futureByMonth[m] = {
      total: 0,
      txs: []
    };
    futureByMonth[m].total += parseFloat(t.value) || 0;
    futureByMonth[m].txs.push(t);
  });
  const byCat = {};
  accTxs.forEach(t => {
    const c = categories.find(x => x.id === t.categoryId) || {
      id: '_uncat',
      name: 'Sem categoria',
      color: '#666',
      icon: '•'
    };
    if (!byCat[c.id]) byCat[c.id] = {
      cat: c,
      value: 0,
      count: 0
    };
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
        commit(D => {
          finEnsure(D);
          D._finance.transactions = D._finance.transactions.filter(t => !(t.parentId === groupId || t.id === groupId));
        });
        return;
      }
      if (!confirm('Deletar somente esta parcela?')) return;
    } else {
      if (!confirm('Deletar este lançamento?')) return;
    }
    commit(D => {
      finEnsure(D);
      D._finance.transactions = D._finance.transactions.filter(t => t.id !== id);
    });
  }
  function toggleStatus(id) {
    commit(D => {
      finEnsure(D);
      const t = D._finance.transactions.find(x => x.id === id);
      if (t) t.status = t.status === 'paid' || !t.status ? 'pending' : 'paid';
    });
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(640px, 95vw)',
      maxHeight: '88vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    className: "modal-header",
    style: {
      background: `linear-gradient(135deg, ${account.color}33, ${account.color}11)`,
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, account.type === 'credit' ? 'Fatura ' : '', finMonthLabel(month)), React.createElement("h2", {
    style: {
      marginTop: 2
    }
  }, account.name), account.type === 'credit' && React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "fecha dia ", account.closingDay || '—', " \xB7 vence dia ", account.dueDay || '—')), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body",
    style: {
      overflowY: 'auto',
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10,
      marginBottom: 16
    }
  }, React.createElement("div", {
    style: {
      padding: 12,
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 10,
      border: '1px solid var(--line)'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      fontSize: 9
    }
  }, "Total"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: account.color,
      marginTop: 2
    }
  }, finFmt(total))), React.createElement("div", {
    style: {
      padding: 12,
      background: 'rgba(60,207,145,0.06)',
      borderRadius: 10,
      border: '1px solid rgba(60,207,145,0.18)'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      fontSize: 9
    }
  }, "Pago"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: '#3ccf91',
      marginTop: 2
    }
  }, finFmt(totalPaid))), React.createElement("div", {
    style: {
      padding: 12,
      background: 'rgba(255,168,48,0.06)',
      borderRadius: 10,
      border: '1px solid rgba(255,168,48,0.18)'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      fontSize: 9
    }
  }, "Pendente"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: '#ffa830',
      marginTop: 2
    }
  }, finFmt(totalPending)))), catRows.length > 0 && React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Por categoria"), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, catRows.map(r => React.createElement("div", {
    key: r.cat.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, r.cat.icon), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 3
    }
  }, React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500
    }
  }, r.cat.name), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: r.cat.color,
      fontWeight: 600
    }
  }, finFmt(r.value))), React.createElement("div", {
    style: {
      height: 4,
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 2,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: total ? `${r.value / total * 100}%` : '0%',
      background: r.cat.color
    }
  }))))))), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, "Lan\xE7amentos \xB7 ", accTxs.length), onAddBulk && React.createElement("button", {
    className: "btn-ghost small",
    onClick: onAddBulk,
    style: {
      fontSize: 11,
      background: 'var(--gradient-neon-soft)',
      borderColor: 'rgba(255,46,136,0.3)',
      color: '#fff'
    }
  }, "\uFF0B Adicionar gastos")), accTxs.length === 0 && React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 16px',
      color: 'var(--ink-3)',
      fontSize: 12
    }
  }, "Nenhum lan\xE7amento neste m\xEAs"), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid var(--line)'
    }
  }, accTxs.map((t, i) => {
    const cat = categories.find(c => c.id === t.categoryId);
    const status = t.status || 'paid';
    return React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        borderBottom: i < accTxs.length - 1 ? '1px solid var(--line)' : 'none',
        background: status === 'pending' ? 'rgba(255,168,48,0.04)' : 'transparent',
        opacity: status === 'pending' ? 0.85 : 1
      }
    }, React.createElement("button", {
      onClick: () => toggleStatus(t.id),
      title: status === 'paid' ? 'Pago · clique para marcar como pendente' : 'Pendente · clique para marcar como pago',
      style: {
        width: 20,
        height: 20,
        borderRadius: 5,
        flexShrink: 0,
        background: status === 'paid' ? '#3ccf91' : 'transparent',
        border: status === 'paid' ? '1px solid #3ccf91' : '1.5px dashed #ffa830',
        color: '#fff',
        fontSize: 11,
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700
      }
    }, status === 'paid' ? '✓' : React.createElement("span", {
      style: {
        color: '#ffa830'
      }
    }, "!")), React.createElement("span", {
      style: {
        fontSize: 13,
        flexShrink: 0
      }
    }, cat?.icon || '•'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, t.description), status !== 'paid' && React.createElement("span", {
      className: "chip",
      style: {
        padding: '1px 6px',
        fontSize: 9,
        background: 'rgba(255,168,48,0.14)',
        color: '#ffa830',
        border: '1px solid rgba(255,168,48,0.35)',
        flexShrink: 0,
        fontWeight: 600,
        letterSpacing: '0.05em'
      }
    }, "PENDENTE")), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        marginTop: 2
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, Orbita.fmtDate(t.date)), cat && React.createElement("span", {
      style: {
        fontSize: 9,
        color: cat.color
      }
    }, "\xB7 ", cat.name), t.installment && React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--neon-c)'
      }
    }, "\xB7 ", t.installment.current, "/", t.installment.total))), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: '#ff5a3c',
        flexShrink: 0
      }
    }, finFmt(t.value)), React.createElement("button", {
      onClick: () => deleteTx(t.id),
      className: "icon-btn",
      style: {
        width: 22,
        height: 22,
        fontSize: 10
      }
    }, "\u2715"));
  })), Object.keys(futureByMonth).length > 0 && React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Parcelas futuras"), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, Object.entries(futureByMonth).map(([m, info]) => React.createElement("div", {
    key: m,
    style: {
      padding: '10px 12px',
      background: 'rgba(176,102,255,0.06)',
      border: '1px solid rgba(176,102,255,0.18)',
      borderRadius: 8
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'capitalize'
    }
  }, finMonthLabel(m)), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: 'var(--neon-c)',
      fontWeight: 600
    }
  }, finFmt(info.total))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, info.txs.slice(0, 4).map(t => React.createElement("div", {
    key: t.id,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      color: 'var(--ink-2)'
    }
  }, React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, t.description, " ", React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--ink-4)'
    }
  }, t.installment.current, "/", t.installment.total)), React.createElement("span", {
    className: "mono",
    style: {
      flexShrink: 0,
      marginLeft: 6
    }
  }, finFmtShort(t.value)))), info.txs.length > 4 && React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      fontStyle: 'italic'
    }
  }, "+ ", info.txs.length - 4, " outros")))))))));
}
function FinAccountModal({
  onClose,
  editAcc,
  commit
}) {
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
        name: name.trim(),
        type,
        color,
        closingDay: type === 'credit' ? parseInt(closingDay) || null : null,
        dueDay: type === 'credit' ? parseInt(dueDay) || null : null
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
    commit(D => {
      finEnsure(D);
      D._finance.accounts = D._finance.accounts.filter(a => a.id !== editAcc.id);
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(440px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editAcc ? 'Editar meio' : 'Novo meio'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Nome"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Ita\xFA Stephano",
    value: name,
    onChange: e => setName(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Tipo"), React.createElement("div", {
    className: "form-chips"
  }, [{
    v: 'credit',
    l: '💳 Crédito'
  }, {
    v: 'debit',
    l: '🏦 Débito'
  }, {
    v: 'pix',
    l: '⚡ PIX'
  }, {
    v: 'boleto',
    l: '📄 Boleto'
  }, {
    v: 'cash',
    l: '💵 Dinheiro'
  }].map(t => React.createElement("div", {
    key: t.v,
    className: `form-chip ${type === t.v ? 'active' : ''}`,
    onClick: () => setType(t.v)
  }, t.l)))), type === 'credit' && React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Fechamento"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    max: "31",
    placeholder: "25",
    value: closingDay,
    onChange: e => setClosingDay(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Vencimento"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    max: "31",
    placeholder: "5",
    value: dueDay,
    onChange: e => setDueDay(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Cor"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, colors.map(c => React.createElement("div", {
    key: c,
    onClick: () => setColor(c),
    style: {
      width: 26,
      height: 26,
      borderRadius: 6,
      background: c,
      cursor: 'pointer',
      border: color === c ? '2px solid #fff' : '2px solid transparent',
      transition: 'all 120ms'
    }
  }))))), React.createElement("div", {
    className: "modal-footer",
    style: {
      justifyContent: 'space-between'
    }
  }, editAcc ? React.createElement("button", {
    className: "btn-ghost",
    style: {
      color: '#ff5555'
    },
    onClick: del
  }, "Deletar") : React.createElement("span", null), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, editAcc ? 'Salvar' : 'Criar')))));
}
function FinCategorias({
  month,
  fin,
  commit
}) {
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const [editCat, setEditCat] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const months = [];
  let cur = month;
  for (let i = 0; i < 6; i++) {
    months.unshift(cur);
    cur = finPrevMonth(cur);
  }
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, categories.length, " categorias"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      setEditCat(null);
      setShowAdd(true);
    },
    style: {
      fontSize: 12
    }
  }, "\uFF0B Categoria")), React.createElement("div", {
    className: "fin-cats-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
      gap: 12
    }
  }, categories.map(c => {
    const monthTxs = txs.filter(t => t.categoryId === c.id && finMonth(t.date) === month);
    const total = monthTxs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const monthSeries = months.map(ym => ({
      month: ym,
      value: txs.filter(t => t.categoryId === c.id && finMonth(t.date) === ym).reduce((s, t) => s + (parseFloat(t.value) || 0), 0)
    }));
    const maxVal = Math.max(...monthSeries.map(s => s.value), 1);
    const meta = FIN_META_CATS.find(m => m.id === c.meta);
    return React.createElement("div", {
      key: c.id,
      className: "panel",
      style: {
        padding: 16
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
      }
    }, React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 10,
        background: c.color + '22',
        border: `1px solid ${c.color}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 18
      }
    }, c.icon), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, c.name), meta && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: meta.color
      }
    }, meta.name)), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: c.color
      }
    }, finFmt(total)), React.createElement("button", {
      className: "icon-btn",
      onClick: () => {
        setEditCat(c);
        setShowAdd(true);
      },
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u270E")), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        height: 50,
        padding: '4px 0'
      }
    }, monthSeries.map((s, i) => React.createElement("div", {
      key: s.month,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4
      }
    }, React.createElement("div", {
      style: {
        width: '100%',
        height: `${s.value / maxVal * 100}%`,
        minHeight: s.value > 0 ? 2 : 0,
        background: s.month === month ? c.color : c.color + '55',
        borderRadius: '3px 3px 0 0'
      },
      title: `${finMonthLabel(s.month)}: ${finFmt(s.value)}`
    }), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 8,
        color: 'var(--ink-4)'
      }
    }, s.month.slice(5))))), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)',
        marginTop: 4
      }
    }, monthTxs.length, " lan\xE7amentos no m\xEAs"));
  })), showAdd && React.createElement(FinCategoryModal, {
    onClose: () => {
      setShowAdd(false);
      setEditCat(null);
    },
    editCat: editCat,
    commit: commit
  }));
}
function FinCategoryModal({
  onClose,
  editCat,
  commit
}) {
  const [name, setName] = React.useState(editCat?.name || '');
  const [icon, setIcon] = React.useState(editCat?.icon || '📋');
  const [color, setColor] = React.useState(editCat?.color || '#5b8dff');
  const [meta, setMeta] = React.useState(editCat?.meta || 'necessidades');
  const colors = ['#5b8dff', '#3ccf91', '#ffa830', '#ff2e88', '#b066ff', '#ff5a3c', '#64d2ff', '#ffd60a', '#9ea5b8', '#ff5555'];
  function save() {
    if (!name.trim()) return;
    commit(D => {
      finEnsure(D);
      const cat = {
        id: editCat?.id || Orbita.uid(),
        name: name.trim(),
        icon,
        color,
        meta
      };
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
    commit(D => {
      finEnsure(D);
      D._finance.categories = D._finance.categories.filter(c => c.id !== editCat.id);
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(440px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editCat ? 'Editar categoria' : 'Nova categoria'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-end'
    }
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "\xCDcone"), React.createElement(EmojiPicker, {
    value: icon,
    onChange: setIcon
  })), React.createElement("div", {
    className: "form-group",
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Nome"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Mercado",
    value: name,
    onChange: e => setName(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Meta-categoria"), React.createElement("div", {
    className: "form-chips"
  }, FIN_META_CATS.map(m => React.createElement("div", {
    key: m.id,
    className: `form-chip ${meta === m.id ? 'active' : ''}`,
    onClick: () => setMeta(m.id),
    style: meta === m.id ? {
      borderColor: m.color,
      background: m.color + '22'
    } : {}
  }, m.name)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Cor"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, colors.map(c => React.createElement("div", {
    key: c,
    onClick: () => setColor(c),
    style: {
      width: 26,
      height: 26,
      borderRadius: 6,
      background: c,
      cursor: 'pointer',
      border: color === c ? '2px solid #fff' : '2px solid transparent'
    }
  }))))), React.createElement("div", {
    className: "modal-footer",
    style: {
      justifyContent: 'space-between'
    }
  }, editCat ? React.createElement("button", {
    className: "btn-ghost",
    style: {
      color: '#ff5555'
    },
    onClick: del
  }, "Deletar") : React.createElement("span", null), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, editCat ? 'Salvar' : 'Criar')))));
}
function FinRecorrentes({
  fin,
  commit
}) {
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
      const existingDescs = new Set(D._finance.transactions.filter(t => finMonth(t.date) === ym && t.recurringId).map(t => t.recurringId));
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
          recurringId: r.id
        });
        added++;
      });
    });
    alert(`${added} lançamentos recorrentes adicionados ao mês atual.`);
  }
  function deleteRec(id) {
    if (!confirm('Deletar recorrente?')) return;
    commit(D => {
      finEnsure(D);
      D._finance.recurring = D._finance.recurring.filter(r => r.id !== id);
    });
  }
  function toggle(id) {
    commit(D => {
      finEnsure(D);
      const r = D._finance.recurring.find(x => x.id === id);
      if (r) r.active = !(r.active === undefined ? true : r.active);
    });
  }
  const totalActive = recurring.filter(r => r.active !== false).reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 16,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Total mensal recorrente"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 22,
      fontWeight: 600,
      color: '#ff5a3c',
      marginTop: 2
    }
  }, finFmt(totalActive))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: generateThisMonth
  }, "\u26A1 Gerar do m\xEAs"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 18px',
      fontSize: 12
    },
    onClick: () => {
      setEditR(null);
      setShowAdd(true);
    }
  }, "\uFF0B Recorrente"))), recurring.length === 0 && React.createElement("div", {
    className: "panel",
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\uD83D\uDD01"), React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, "Nenhum gasto recorrente"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "Cadastre Aluguel, Plano de Sa\xFAde, Streaming, etc.")), React.createElement("div", {
    className: "panel",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, recurring.map((r, i) => {
    const cat = categories.find(c => c.id === r.categoryId);
    const acc = accounts.find(a => a.id === r.accountId);
    const active = r.active !== false;
    return React.createElement("div", {
      key: r.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderBottom: i < recurring.length - 1 ? '1px solid var(--line)' : 'none',
        opacity: active ? 1 : 0.5
      }
    }, React.createElement("button", {
      onClick: () => toggle(r.id),
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, active ? '⏸' : '▶'), React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: (cat?.color || '#666') + '22',
        border: `1px solid ${cat?.color || '#666'}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 14,
        flexShrink: 0
      }
    }, cat?.icon || '🔁'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, r.description), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, "dia ", r.dayOfMonth, " \xB7 ", acc?.name || '—')), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: cat?.color || '#ff5a3c'
      }
    }, finFmt(r.value)), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, React.createElement("button", {
      onClick: () => {
        setEditR(r);
        setShowAdd(true);
      },
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u270E"), React.createElement("button", {
      onClick: () => deleteRec(r.id),
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u2715")));
  })), showAdd && React.createElement(FinRecurringModal, {
    onClose: () => {
      setShowAdd(false);
      setEditR(null);
    },
    editR: editR,
    fin: fin,
    commit: commit
  }));
}
function FinRecurringModal({
  onClose,
  editR,
  fin,
  commit
}) {
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
        description: description.trim(),
        value: v,
        dayOfMonth: parseInt(dayOfMonth) || 1,
        accountId,
        categoryId,
        active: editR?.active !== false
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
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(480px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editR ? 'Editar recorrente' : 'Novo recorrente'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Descri\xE7\xE3o"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Aluguel, Netflix...",
    value: description,
    onChange: e => setDescription(e.target.value)
  })), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Valor"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: value,
    onChange: e => setValue(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Dia do m\xEAs"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    max: "31",
    value: dayOfMonth,
    onChange: e => setDayOfMonth(e.target.value)
  }))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Categoria"), React.createElement("select", {
    className: "form-input",
    value: categoryId,
    onChange: e => setCategoryId(e.target.value)
  }, categories.map(c => React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.icon, " ", c.name)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Meio"), React.createElement("select", {
    className: "form-input",
    value: accountId,
    onChange: e => setAccountId(e.target.value)
  }, accounts.map(a => React.createElement("option", {
    key: a.id,
    value: a.id
  }, a.name)))))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, editR ? 'Salvar' : 'Criar'))));
}
function FinOrcamento({
  fin,
  commit
}) {
  const [income, setIncome] = React.useState(fin.monthlyIncome || 0);
  const [alloc, setAlloc] = React.useState(() => {
    const a = {};
    FIN_META_CATS.forEach(m => a[m.id] = (fin.budgetAllocation && fin.budgetAllocation[m.id]) ?? m.pct);
    return a;
  });
  const [openaiKey, setOpenaiKey] = React.useState(fin.openaiKey || fin._diet?.openaiKey || '');
  const totalPct = Object.values(alloc).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  function save() {
    commit(D => {
      finEnsure(D);
      D._finance.monthlyIncome = parseFloat(income) || 0;
      D._finance.budgetAllocation = {
        ...alloc
      };
      if (openaiKey) {
        if (!D._diet) D._diet = {};
        D._diet.openaiKey = openaiKey;
      }
    });
    alert('Orçamento salvo!');
  }
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      maxWidth: 720
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Renda mensal padr\xE3o"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 18,
      color: 'var(--ink-3)'
    }
  }, "R$"), React.createElement("input", {
    className: "form-input",
    type: "number",
    placeholder: "0",
    value: income,
    onChange: e => setIncome(e.target.value),
    style: {
      flex: 1,
      fontSize: 22,
      fontFamily: 'var(--font-mono)',
      padding: '12px 16px'
    }
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 6
    }
  }, "Padr\xE3o usado em meses sem renda espec\xEDfica. Como sua renda \xE9 vari\xE1vel, edite cada m\xEAs no ", React.createElement("strong", null, "Resumo"), " (clique no valor de renda) ou abaixo.")), React.createElement(FinIncomeOverrides, {
    fin: fin,
    commit: commit
  }), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Aloca\xE7\xE3o ideal por meta-categoria"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: Math.abs(totalPct - 1) < 0.001 ? '#3ccf91' : '#ff5555'
    }
  }, "soma: ", (totalPct * 100).toFixed(1), "%")), FIN_META_CATS.map(m => {
    const pct = alloc[m.id] || 0;
    const target = (income || 0) * pct;
    return React.createElement("div", {
      key: m.id,
      style: {
        padding: '10px 0',
        borderBottom: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6
      }
    }, React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: m.color,
        flexShrink: 0
      }
    }), React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 500
      }
    }, m.name), React.createElement("input", {
      className: "form-input",
      type: "number",
      step: "0.01",
      min: "0",
      max: "1",
      value: pct,
      onChange: e => setAlloc(p => ({
        ...p,
        [m.id]: parseFloat(e.target.value) || 0
      })),
      style: {
        width: 80,
        fontSize: 12,
        padding: '6px 10px'
      }
    }), React.createElement("span", {
      style: {
        width: 50,
        fontSize: 11,
        color: 'var(--ink-3)'
      },
      className: "mono"
    }, (pct * 100).toFixed(1), "%"), React.createElement("span", {
      style: {
        width: 110,
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 600,
        color: m.color
      },
      className: "mono"
    }, finFmt(target))), React.createElement("input", {
      type: "range",
      min: "0",
      max: "1",
      step: "0.01",
      value: pct,
      onChange: e => setAlloc(p => ({
        ...p,
        [m.id]: parseFloat(e.target.value)
      })),
      style: {
        width: '100%',
        accentColor: m.color
      }
    }));
  }), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 12,
      padding: 12,
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 8
    }
  }, React.createElement("strong", null, "Padr\xE3o Stephano:"), " 55% Necessidades \xB7 10% Lazer \xB7 10% D\xEDvidas \xB7 10% Liberdade Financeira \xB7 10% Longo Prazo \xB7 5% Colch\xE3o")), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 8
    }
  }, "Chave OpenAI (assistente IA \uD83D\uDCB0)"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 10
    }
  }, "Compartilhada com o Coach \uD83E\uDD57 e Orbita IA \uD83C\uDF0C. Salva localmente no navegador."), React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "sk-...",
    value: openaiKey,
    onChange: e => setOpenaiKey(e.target.value)
  })), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '12px 24px',
      fontSize: 13,
      alignSelf: 'flex-start'
    },
    onClick: save
  }, "Salvar or\xE7amento"), React.createElement(FinImportPlanilha, {
    fin: fin,
    commit: commit
  }));
}
function FinIncomeOverrides({
  fin,
  commit
}) {
  const overrides = fin.incomeByMonth || {};
  const defaultIncome = parseFloat(fin.monthlyIncome) || 0;
  const months = Object.keys(overrides).sort();
  const [showAll, setShowAll] = React.useState(false);
  const [newMonth, setNewMonth] = React.useState(finCurrentMonth());
  const [newValue, setNewValue] = React.useState('');
  function addOverride() {
    const v = parseFloat(String(newValue).replace(',', '.'));
    if (!newMonth || isNaN(v)) return;
    commit(D => {
      finEnsure(D);
      D._finance.incomeByMonth[newMonth] = v;
    });
    setNewValue('');
  }
  function updateOverride(ym, value) {
    const v = parseFloat(String(value).replace(',', '.'));
    if (isNaN(v)) return;
    commit(D => {
      finEnsure(D);
      D._finance.incomeByMonth[ym] = v;
    });
  }
  function deleteOverride(ym) {
    commit(D => {
      finEnsure(D);
      delete D._finance.incomeByMonth[ym];
    });
  }
  const visible = showAll ? months : months.slice(-6);
  const total = Object.values(overrides).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const avg = months.length ? total / months.length : 0;
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Renda vari\xE1vel por m\xEAs"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, months.length, " meses espec\xEDficos \xB7 m\xE9dia ", finFmt(avg))), months.length > 6 && React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setShowAll(s => !s),
    style: {
      fontSize: 10
    }
  }, showAll ? `mostrar últimos 6` : `ver todos (${months.length})`)), months.length > 0 && React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginBottom: 14
    }
  }, visible.map(ym => React.createElement(FinIncomeRow, {
    key: ym,
    ym: ym,
    value: overrides[ym],
    defaultIncome: defaultIncome,
    onSave: v => updateOverride(ym, v),
    onDelete: () => deleteOverride(ym)
  }))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      paddingTop: months.length > 0 ? 12 : 0,
      borderTop: months.length > 0 ? '1px solid var(--line)' : 'none'
    }
  }, React.createElement("input", {
    className: "form-input",
    type: "month",
    value: newMonth,
    onChange: e => setNewMonth(e.target.value),
    style: {
      fontSize: 12,
      padding: '8px 10px',
      flex: '0 0 150px'
    }
  }), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "renda do m\xEAs (R$)",
    value: newValue,
    onChange: e => setNewValue(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addOverride();
    },
    style: {
      flex: 1,
      fontSize: 12,
      padding: '8px 10px'
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: addOverride,
    disabled: !newValue.trim(),
    style: {
      fontSize: 12
    }
  }, "\uFF0B Adicionar")));
}
function FinIncomeRow({
  ym,
  value,
  defaultIncome,
  onSave,
  onDelete
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));
  const diff = parseFloat(value) - defaultIncome;
  return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 8px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 6
    }
  }, React.createElement("span", {
    style: {
      flex: '0 0 130px',
      fontSize: 12,
      textTransform: 'capitalize'
    }
  }, finMonthLabel(ym)), editing ? React.createElement(React.Fragment, null, React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    autoFocus: true,
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        onSave(draft);
        setEditing(false);
      }
      if (e.key === 'Escape') setEditing(false);
    },
    style: {
      flex: 1,
      padding: '4px 8px',
      fontSize: 12
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      onSave(draft);
      setEditing(false);
    },
    style: {
      fontSize: 10,
      color: '#3ccf91'
    }
  }, "\u2713"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setEditing(false),
    style: {
      fontSize: 10
    }
  }, "\u2715")) : React.createElement(React.Fragment, null, React.createElement("span", {
    className: "mono",
    style: {
      flex: 1,
      fontSize: 13,
      fontWeight: 600
    }
  }, finFmt(value)), defaultIncome > 0 && Math.abs(diff) > 0.5 && React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9,
      color: diff > 0 ? '#3ccf91' : '#ff5a3c'
    }
  }, diff > 0 ? '+' : '', (diff / defaultIncome * 100).toFixed(0), "%"), React.createElement("button", {
    className: "icon-btn",
    onClick: () => {
      setDraft(String(value));
      setEditing(true);
    },
    style: {
      width: 24,
      height: 24,
      fontSize: 10
    }
  }, "\u270E"), React.createElement("button", {
    className: "icon-btn",
    onClick: onDelete,
    style: {
      width: 24,
      height: 24,
      fontSize: 10
    }
  }, "\u2715")));
}
function FinImportPlanilha({
  fin,
  commit
}) {
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState(null);
  async function loadPreview() {
    setLoading(true);
    setStatus('⟳ baixando...');
    try {
      const res = await fetch('financas-import.json?t=' + Date.now());
      if (!res.ok) throw new Error('Não foi possível baixar (HTTP ' + res.status + ')');
      const json = await res.json();
      const txs = json.transactions || [];
      const incomeMap = json.income_by_month || {};
      const byYear = {};
      txs.forEach(t => {
        const y = (t.date || '').slice(0, 4);
        byYear[y] = (byYear[y] || 0) + 1;
      });
      const totalValue = txs.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
      setPreview({
        count: txs.length,
        byYear,
        totalValue,
        incomeMonths: Object.keys(incomeMap).length,
        raw: json
      });
      setStatus(`✓ ${txs.length} lançamentos prontos para importar`);
    } catch (e) {
      setStatus('✕ ' + e.message);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }
  function doImport(mode) {
    if (!preview) return;
    if (mode === 'replace' && !confirm(`Isso vai SUBSTITUIR todos os ${(fin.transactions || []).length} lançamentos existentes por ${preview.count} da planilha. Continuar?`)) return;
    if (mode === 'merge' && !confirm(`Adicionar ${preview.count} lançamentos da planilha aos existentes? Não detecta duplicatas.`)) return;
    commit(D => {
      finEnsure(D);
      const newTxs = preview.raw.transactions || [];
      if (mode === 'replace') {
        D._finance.transactions = newTxs;
      } else {
        D._finance.transactions = [...(D._finance.transactions || []), ...newTxs];
      }
      const incomeMap = preview.raw.income_by_month || {};
      if (mode === 'replace') D._finance.incomeByMonth = {};
      if (!D._finance.incomeByMonth) D._finance.incomeByMonth = {};
      Object.entries(incomeMap).forEach(([ym, v]) => {
        D._finance.incomeByMonth[ym] = v;
      });
      const lastMonth = Object.keys(incomeMap).sort().pop();
      if (lastMonth && (!D._finance.monthlyIncome || mode === 'replace')) {
        D._finance.monthlyIncome = incomeMap[lastMonth];
      }
    });
    setStatus('✓ Importação concluída');
    setPreview(null);
  }
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 20,
      borderColor: 'rgba(176,102,255,0.25)'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, "\uD83D\uDCCA"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Importar planilha hist\xF3rica"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "809 lan\xE7amentos de 2023 a 2027 da sua \"Controle Financeiro - Stephano.xlsx\""))), !preview && React.createElement("button", {
    className: "btn-ghost small",
    onClick: loadPreview,
    disabled: loading,
    style: {
      marginTop: 8
    }
  }, loading ? '⟳ carregando...' : '📥 Carregar prévia'), preview && React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, React.createElement("div", {
    style: {
      padding: 12,
      background: 'rgba(176,102,255,0.06)',
      border: '1px solid rgba(176,102,255,0.18)',
      borderRadius: 8,
      marginBottom: 10
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 6
    }
  }, "Pr\xE9via:"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-2)',
      lineHeight: 1.7
    }
  }, React.createElement("div", null, React.createElement("strong", null, preview.count), " lan\xE7amentos \xB7 total ", finFmt(preview.totalValue)), React.createElement("div", null, "renda registrada em ", React.createElement("strong", null, preview.incomeMonths), " meses"), React.createElement("div", {
    style: {
      marginTop: 4,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, Object.entries(preview.byYear).sort().map(([y, n]) => React.createElement("span", {
    key: y,
    className: "chip",
    style: {
      fontSize: 10
    }
  }, y, ": ", n))))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 16px',
      fontSize: 12,
      background: 'linear-gradient(135deg, #b066ff, #5b8dff)'
    },
    onClick: () => doImport('merge')
  }, "\uFF0B Adicionar aos existentes"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => doImport('replace'),
    style: {
      color: '#ff5a3c'
    }
  }, "Substituir tudo"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      setPreview(null);
      setStatus('');
    }
  }, "Cancelar"))), status && React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 11,
      color: status.startsWith('✕') ? '#ff5555' : status.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)'
    }
  }, status));
}
function FinanceHomeBar() {
  const {
    data,
    commit
  } = useData();
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState('chat');
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [parsed, setParsed] = React.useState(null);
  const [messages, setMessages] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orbita_fin_chat') || '[]');
    } catch {
      return [];
    }
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
    const income = finGetIncome(fin, month);
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
    ctx += `- Total gasto: ${finFmt(total)} (${income ? Math.round(total / income * 100) : 0}% da renda)\n`;
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
    if (!openaiKey) {
      setError('Configure sua chave OpenAI em ⚙ Configurações');
      return;
    }
    setLoading(true);
    setError('');
    if (mode === 'lancamento') {
      try {
        const accNames = accounts.map(a => `"${a.id}":"${a.name}"`).join(', ');
        const catNames = categories.map(c => `"${c.id}":"${c.name}"`).join(', ');
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: {
              type: 'json_object'
            },
            messages: [{
              role: 'system',
              content: `Extraia um lançamento financeiro do texto. Responda SOMENTE com JSON no formato:
{"description":"...", "value": numero, "categoryId":"id", "accountId":"id", "date":"YYYY-MM-DD", "installment":{"current":1,"total":1} ou null}

Categorias disponíveis (id:nome): ${catNames}
Meios disponíveis (id:nome): ${accNames}
Use a categoria e meio mais apropriados. Se não tiver data, use ${Orbita.todayStr()}. Se não for parcelado, installment = null.`
            }, {
              role: 'user',
              content: input.trim()
            }],
            temperature: 0.2
          })
        });
        if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
        const json = await res.json();
        const obj = JSON.parse(json.choices[0].message.content);
        setParsed(obj);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    const userMsg = {
      role: 'user',
      content: input.trim()
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'system',
            content: `Você é o assistente financeiro do Stephano. Ajude com análise de gastos, orçamento, dívidas, conselhos práticos. Seja conciso, direto e em português. Use os dados reais do contexto, não invente valores.\n\n${buildContext()}`
          }, ...newMessages.slice(-10)],
          temperature: 0.6
        })
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const json = await res.json();
      setMessages(m => [...m, {
        role: 'assistant',
        content: json.choices[0].message.content
      }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
        installment: parsed.installment || null
      });
    });
    setInput('');
    setParsed(null);
  }
  function clearChat() {
    if (!confirm('Limpar conversa?')) return;
    setMessages([]);
    localStorage.removeItem('orbita_fin_chat');
  }
  if (!open) {
    const monthSpent = txs.filter(t => finMonth(t.date) === month).reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    return React.createElement("button", {
      onClick: () => setOpen(true),
      style: {
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 18px',
        borderRadius: 28,
        background: 'linear-gradient(135deg, #3ccf91, #5b8dff)',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        boxShadow: '0 4px 20px rgba(60,207,145,0.4)',
        fontFamily: 'var(--font-ui)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\uD83D\uDCB0"), React.createElement("span", null, "Financeiro \xB7 ", finFmtShort(monthSpent)));
  }
  const suggestions = mode === 'chat' ? ['Onde mais gastei esse mês?', 'Como estou no orçamento?', 'Qual cartão tenho mais gasto?', 'Sugira economias possíveis'] : ['almoço sushi 80 itau', 'aluguel 2150 boleto', 'netflix 55 nubank', 'gasolina 200 dia 15 itau'];
  const accForParsed = parsed && accounts.find(a => a.id === parsed.accountId);
  const catForParsed = parsed && categories.find(c => c.id === parsed.categoryId);
  return React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 500,
      width: 'min(420px, calc(100vw - 32px))',
      borderRadius: 18,
      overflow: 'hidden',
      background: 'rgba(14,14,20,0.96)',
      backdropFilter: 'blur(30px)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-float)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '70vh'
    }
  }, React.createElement("div", {
    style: {
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD83D\uDCB0"), React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13,
      fontWeight: 500
    }
  }, "Assistente Financeiro"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, React.createElement("button", {
    onClick: () => {
      setMode('chat');
      setParsed(null);
    },
    className: "btn-ghost small",
    style: {
      fontSize: 10,
      padding: '3px 8px',
      background: mode === 'chat' ? 'rgba(60,207,145,0.15)' : 'transparent'
    }
  }, "\uD83D\uDCAC Chat"), React.createElement("button", {
    onClick: () => {
      setMode('lancamento');
    },
    className: "btn-ghost small",
    style: {
      fontSize: 10,
      padding: '3px 8px',
      background: mode === 'lancamento' ? 'rgba(60,207,145,0.15)' : 'transparent'
    }
  }, "\u26A1 Lan\xE7ar")), React.createElement("button", {
    onClick: () => setOpen(false),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-3)',
      cursor: 'pointer',
      fontSize: 14
    }
  }, "\u2715")), mode === 'chat' && React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 12,
      minHeight: 200
    }
  }, messages.length === 0 && React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 16
    }
  }, React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83D\uDCB0"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginBottom: 12
    }
  }, "Pergunte sobre seus gastos. A IA tem contexto do m\xEAs atual."), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, suggestions.map(s => React.createElement("button", {
    key: s,
    className: "btn-ghost small",
    onClick: () => setInput(s),
    style: {
      justifyContent: 'flex-start',
      textAlign: 'left',
      fontSize: 11
    }
  }, s)))), messages.map((m, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: 8
    }
  }, React.createElement("div", {
    style: {
      maxWidth: '85%',
      padding: '8px 12px',
      borderRadius: 12,
      background: m.role === 'user' ? 'linear-gradient(135deg, rgba(60,207,145,0.15), rgba(91,141,255,0.12))' : 'rgba(255,255,255,0.04)',
      border: m.role === 'user' ? '1px solid rgba(60,207,145,0.25)' : '1px solid var(--line)',
      fontSize: 12.5,
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap'
    }
  }, m.content))), loading && React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      padding: 8
    }
  }, "\u27F3 pensando...")), mode === 'lancamento' && React.createElement("div", {
    style: {
      padding: 12,
      minHeight: 100
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 8
    }
  }, "Descreva o gasto em linguagem natural. Ex: \"almo\xE7o 50 itau\""), !parsed && React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, suggestions.map(s => React.createElement("button", {
    key: s,
    className: "btn-ghost small",
    onClick: () => setInput(s),
    style: {
      justifyContent: 'flex-start',
      textAlign: 'left',
      fontSize: 11
    }
  }, s))), parsed && React.createElement("div", {
    style: {
      padding: 12,
      background: 'linear-gradient(135deg, rgba(60,207,145,0.12), rgba(91,141,255,0.08))',
      border: '1px solid rgba(60,207,145,0.25)',
      borderRadius: 10
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
    }
  }, React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22
    }
  }, finFmt(parsed.value)), React.createElement("button", {
    className: "btn-ghost small",
    onClick: saveParsed,
    style: {
      fontSize: 11,
      color: '#3ccf91'
    }
  }, "\u2713 Adicionar")), React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 6
    }
  }, parsed.description), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      fontSize: 10
    }
  }, catForParsed && React.createElement("span", {
    className: "chip",
    style: {
      fontSize: 10
    }
  }, catForParsed.icon, " ", catForParsed.name), accForParsed && React.createElement("span", {
    className: "chip",
    style: {
      fontSize: 10
    }
  }, "\uD83D\uDCB3 ", accForParsed.name), React.createElement("span", {
    className: "chip",
    style: {
      fontSize: 10
    }
  }, "\uD83D\uDCC5 ", Orbita.fmtDate(parsed.date)), parsed.installment && React.createElement("span", {
    className: "chip",
    style: {
      fontSize: 10
    }
  }, parsed.installment.current, "/", parsed.installment.total)))), error && React.createElement("div", {
    style: {
      margin: 10,
      padding: 8,
      background: 'rgba(255,85,85,0.1)',
      border: '1px solid rgba(255,85,85,0.3)',
      borderRadius: 6,
      fontSize: 11,
      color: '#ff5555'
    }
  }, error), React.createElement("div", {
    style: {
      padding: 10,
      borderTop: '1px solid var(--line)',
      display: 'flex',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: mode === 'chat' ? 'Pergunte sobre seus gastos...' : 'Ex: almoço 50 itau',
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && !loading) {
        e.preventDefault();
        send();
      }
    },
    style: {
      flex: 1,
      fontSize: 12,
      padding: '8px 10px'
    },
    disabled: loading
  }), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 14px',
      fontSize: 12,
      background: 'linear-gradient(135deg, #3ccf91, #5b8dff)'
    },
    onClick: send,
    disabled: loading || !input.trim()
  }, mode === 'chat' ? 'Enviar' : '⚡ Analisar'), mode === 'chat' && messages.length > 0 && React.createElement("button", {
    className: "btn-ghost small",
    onClick: clearChat,
    style: {
      fontSize: 10
    }
  }, "\u21BA")));
}
function FinGraficos({
  fin,
  revealed = false,
  setRevealed = () => {}
}) {
  const categories = fin.categories || [];
  const txs = fin.transactions || [];
  const curMonthForChart = finCurrentMonth();
  const income = finGetIncome(fin, curMonthForChart);
  const today = new Date();
  const curMonth = finCurrentMonth();
  const last12 = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    last12.push(ym);
  }
  const monthly = last12.map(ym => {
    const ms = txs.filter(t => finMonth(t.date) === ym);
    return {
      month: ym,
      total: ms.reduce((s, t) => s + (parseFloat(t.value) || 0), 0),
      count: ms.length
    };
  });
  const last6 = last12.slice(-6);
  const last6ByCat = last6.map(ym => {
    const row = {
      month: ym,
      total: 0,
      byCat: {}
    };
    txs.filter(t => finMonth(t.date) === ym).forEach(t => {
      const c = categories.find(x => x.id === t.categoryId) || {
        id: '_uncat',
        name: 'Outro',
        color: '#666'
      };
      row.byCat[c.id] = (row.byCat[c.id] || 0) + (parseFloat(t.value) || 0);
      row.total += parseFloat(t.value) || 0;
    });
    return row;
  });
  const cumByCat = {};
  last6ByCat.forEach(r => {
    Object.entries(r.byCat).forEach(([cid, v]) => {
      cumByCat[cid] = (cumByCat[cid] || 0) + v;
    });
  });
  const topCatIds = Object.entries(cumByCat).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  const otherColor = '#555';
  const yearlyMap = {};
  txs.forEach(t => {
    const y = (t.date || '').slice(0, 4);
    if (!y) return;
    yearlyMap[y] = (yearlyMap[y] || 0) + (parseFloat(t.value) || 0);
  });
  const years = Object.keys(yearlyMap).sort().slice(-5);
  const ninetyAgo = new Date();
  ninetyAgo.setDate(ninetyAgo.getDate() - 90);
  const dowSpend = [0, 0, 0, 0, 0, 0, 0];
  txs.forEach(t => {
    if (!t.date) return;
    const d = new Date(t.date + 'T12:00:00');
    if (d < ninetyAgo) return;
    dowSpend[d.getDay()] += parseFloat(t.value) || 0;
  });
  const ninetyAgoStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  })();
  const oneEightyAgoStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 180);
    return d.toISOString().slice(0, 10);
  })();
  const todayStr = today.toISOString().slice(0, 10);
  const trendByCat = categories.map(c => {
    const cur = txs.filter(t => t.categoryId === c.id && t.date >= ninetyAgoStr && t.date <= todayStr).reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const prev = txs.filter(t => t.categoryId === c.id && t.date >= oneEightyAgoStr && t.date < ninetyAgoStr).reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const delta = prev ? (cur - prev) / prev * 100 : cur > 0 ? 100 : 0;
    return {
      cat: c,
      cur,
      prev,
      delta
    };
  }).filter(t => t.cur > 0 || t.prev > 0);
  const topGrowing = trendByCat.filter(t => t.delta > 10 && t.prev > 0).sort((a, b) => b.delta - a.delta).slice(0, 3);
  const topShrinking = trendByCat.filter(t => t.delta < -10 && t.prev > 0).sort((a, b) => a.delta - b.delta).slice(0, 3);
  const totals12 = monthly.map(m => m.total);
  const avg12 = totals12.length ? totals12.reduce((s, v) => s + v, 0) / totals12.length : 0;
  const max12 = monthly.reduce((m, x) => x.total > m.total ? x : m, {
    total: 0,
    month: null
  });
  const min12 = monthly.reduce((m, x) => (m.total === null || x.total < m.total) && x.total > 0 ? x : m, {
    total: null,
    month: null
  });
  const curTotal = monthly[monthly.length - 1].total;
  const prevTotal = monthly[monthly.length - 2]?.total || 0;
  const monthVariation = prevTotal ? (curTotal - prevTotal) / prevTotal * 100 : 0;
  const sameMonLastYear = monthly.length >= 12 ? monthly[monthly.length - 12]?.total || null : null;
  const yoyVariation = sameMonLastYear ? (curTotal - sameMonLastYear) / sameMonLastYear * 100 : null;
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const projection = dayOfMonth ? curTotal / dayOfMonth * daysInMonth : 0;
  const inBudgetStreak = (() => {
    if (!income) return 0;
    let s = 0;
    for (let i = monthly.length - 2; i >= 0; i--) {
      if (monthly[i].total > 0 && monthly[i].total <= income) s++;else if (monthly[i].total > 0) break;
    }
    return s;
  })();
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 12
    }
  }, React.createElement(FinInsightCard, {
    icon: monthVariation >= 0 ? '↑' : '↓',
    color: monthVariation > 0 ? '#ff5a3c' : '#3ccf91',
    label: "M\xEAs atual vs anterior",
    value: prevTotal > 0 ? `${monthVariation > 0 ? '+' : ''}${monthVariation.toFixed(1)}%` : '—',
    sub: prevTotal > 0 ? React.createElement("span", null, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(curTotal)), " vs ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(prevTotal))) : 'sem dados anteriores'
  }), yoyVariation !== null && React.createElement(FinInsightCard, {
    icon: yoyVariation >= 0 ? '↑' : '↓',
    color: yoyVariation > 0 ? '#ff5a3c' : '#3ccf91',
    label: "vs mesmo m\xEAs ano passado",
    value: `${yoyVariation > 0 ? '+' : ''}${yoyVariation.toFixed(1)}%`,
    sub: React.createElement("span", null, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(curTotal)), " vs ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(sameMonLastYear)))
  }), React.createElement(FinInsightCard, {
    icon: "\u223C",
    color: "var(--neon-b)",
    label: "M\xE9dia mensal (12m)",
    value: React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(avg12)),
    sub: `baseado nos últimos 12 meses`
  }), max12.month && React.createElement(FinInsightCard, {
    icon: "\u25B2",
    color: "#ff5a3c",
    label: "M\xEAs mais caro",
    value: React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(max12.total)),
    sub: React.createElement("span", {
      style: {
        textTransform: 'capitalize'
      }
    }, finMonthLabel(max12.month))
  }), projection > 0 && React.createElement(FinInsightCard, {
    icon: "\u25CE",
    color: income && projection > income ? '#ff5555' : 'var(--neon-c)',
    label: "Proje\xE7\xE3o fim do m\xEAs",
    value: React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(projection)),
    sub: income ? `${Math.round(projection / income * 100)}% da renda` : `${dayOfMonth}/${daysInMonth} dias do mês`
  }), inBudgetStreak > 0 && React.createElement(FinInsightCard, {
    icon: "\uD83D\uDD25",
    color: "#ffa830",
    label: "Meses dentro do or\xE7amento",
    value: `${inBudgetStreak}`,
    sub: "seguidos antes deste m\xEAs"
  })), (topGrowing.length > 0 || topShrinking.length > 0) && React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 12
    }
  }, topGrowing.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "\u2191 Crescendo nos \xFAltimos 90 dias"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginBottom: 10
    }
  }, "vs 90 dias anteriores"), topGrowing.map(t => React.createElement("div", {
    key: t.cat.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: t.cat.color + '22',
      border: `1px solid ${t.cat.color}44`,
      display: 'grid',
      placeItems: 'center',
      fontSize: 14,
      flexShrink: 0
    }
  }, t.cat.icon), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500
    }
  }, t.cat.name), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: 'var(--ink-3)'
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(t.prev)), " \u2192 ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(t.cur)))), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#ff5a3c'
    }
  }, "+", t.delta.toFixed(0), "%")))), topShrinking.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "\u2193 Diminuindo nos \xFAltimos 90 dias"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginBottom: 10
    }
  }, "vs 90 dias anteriores"), topShrinking.map(t => React.createElement("div", {
    key: t.cat.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: t.cat.color + '22',
      border: `1px solid ${t.cat.color}44`,
      display: 'grid',
      placeItems: 'center',
      fontSize: 14,
      flexShrink: 0
    }
  }, t.cat.icon), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500
    }
  }, t.cat.name), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: 'var(--ink-3)'
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(t.prev)), " \u2192 ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(t.cur)))), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#3ccf91'
    }
  }, t.delta.toFixed(0), "%"))))), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Tend\xEAncia mensal \xB7 12 meses"), income > 0 && React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "linha pontilhada = renda")), React.createElement(FinLineChart, {
    data: monthly.map(m => ({
      label: m.month.slice(5) + '/' + m.month.slice(2, 4),
      value: m.total
    })),
    height: 200,
    color: "var(--neon-a)",
    referenceLine: income > 0 ? income : null,
    revealed: revealed
  })), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Por categoria nos \xFAltimos 6 meses"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 14
    }
  }, "top 5 categorias + outras"), React.createElement(FinStackedBars, {
    data: last6ByCat,
    categories: categories,
    topCatIds: topCatIds,
    otherColor: otherColor,
    revealed: revealed
  })), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Gastos por dia da semana \xB7 \xFAltimos 90 dias"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 14
    }
  }, "quando voc\xEA mais gasta"), React.createElement(FinDayOfWeekChart, {
    data: dowSpend,
    revealed: revealed
  })), years.length > 1 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Total por ano"), React.createElement(FinYearlyChart, {
    data: years.map(y => ({
      year: y,
      value: yearlyMap[y]
    })),
    revealed: revealed
  })));
}
function FinInsightCard({
  icon,
  color,
  label,
  value,
  sub
}) {
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 16
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, React.createElement("span", {
    style: {
      fontSize: 18,
      color,
      lineHeight: 1
    }
  }, icon), React.createElement("div", {
    className: "eyebrow",
    style: {
      fontSize: 10
    }
  }, label)), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 22,
      fontWeight: 600,
      color,
      lineHeight: 1.1
    }
  }, value), sub && React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, sub));
}
function FinLineChart({
  data,
  height = 180,
  color = 'var(--neon-a)',
  referenceLine,
  revealed
}) {
  if (!data || data.length === 0) return React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      padding: 20
    }
  }, "Sem dados");
  const maxVal = Math.max(...data.map(d => d.value), referenceLine || 0, 1);
  const w = 100;
  const h = 100;
  const xStep = data.length > 1 ? w / (data.length - 1) : 0;
  const points = data.map((d, i) => `${i * xStep},${(1 - d.value / maxVal) * h}`).join(' ');
  const areaPoints = `0,${h} ${points} ${(data.length - 1) * xStep},${h}`;
  const refY = referenceLine ? (1 - referenceLine / maxVal) * h : null;
  return React.createElement("div", {
    style: {
      position: 'relative',
      height,
      filter: revealed ? 'none' : 'blur(8px)',
      transition: 'filter 200ms'
    }
  }, React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height: '100%',
      overflow: 'visible'
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "lineGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.4"
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75].map(p => React.createElement("line", {
    key: p,
    x1: "0",
    y1: h * p,
    x2: w,
    y2: h * p,
    stroke: "rgba(255,255,255,0.04)",
    strokeWidth: "0.3"
  })), refY !== null && React.createElement("line", {
    x1: "0",
    y1: refY,
    x2: w,
    y2: refY,
    stroke: "#3ccf91",
    strokeWidth: "0.4",
    strokeDasharray: "1,1",
    opacity: "0.6"
  }), React.createElement("polygon", {
    points: areaPoints,
    fill: "url(#lineGrad)"
  }), React.createElement("polyline", {
    points: points,
    fill: "none",
    stroke: color,
    strokeWidth: "0.6",
    strokeLinejoin: "round",
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke"
  }), data.map((d, i) => React.createElement("circle", {
    key: i,
    cx: i * xStep,
    cy: (1 - d.value / maxVal) * h,
    r: "0.9",
    fill: color,
    stroke: "var(--bg-1)",
    strokeWidth: "0.3",
    vectorEffect: "non-scaling-stroke"
  }))), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 6,
      fontSize: 9,
      color: 'var(--ink-3)',
      fontFamily: 'var(--font-mono)'
    }
  }, data.map((d, i) => React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      textAlign: i === 0 ? 'left' : i === data.length - 1 ? 'right' : 'center'
    }
  }, d.label))), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      fontSize: 9,
      color: 'var(--ink-3)',
      fontFamily: 'var(--font-mono)'
    },
    className: "mono"
  }, finFmtShort(maxVal)), React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 22,
      right: 0,
      fontSize: 9,
      color: 'var(--ink-4)',
      fontFamily: 'var(--font-mono)'
    },
    className: "mono"
  }, finFmtShort(0)));
}
function FinStackedBars({
  data,
  categories,
  topCatIds,
  otherColor,
  revealed
}) {
  if (!data || data.length === 0) return React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, "Sem dados");
  const max = Math.max(...data.map(r => r.total), 1);
  const legendCats = topCatIds.map(cid => categories.find(c => c.id === cid)).filter(Boolean);
  return React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      height: 240,
      padding: '4px 0'
    }
  }, data.map(r => React.createElement("div", {
    key: r.month,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      height: 14,
      color: revealed ? 'var(--ink-2)' : 'transparent',
      textShadow: revealed ? 'none' : '0 0 8px rgba(255,255,255,0.4)'
    }
  }, finFmtShort(r.total)), React.createElement("div", {
    style: {
      flex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      marginTop: 4,
      marginBottom: 6
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: `${r.total / max * 100}%`,
      minHeight: r.total > 0 ? 2 : 0,
      display: 'flex',
      flexDirection: 'column-reverse',
      borderRadius: '4px 4px 0 0',
      overflow: 'hidden'
    }
  }, topCatIds.map(cid => {
    const v = r.byCat[cid] || 0;
    if (v <= 0) return null;
    const cat = categories.find(c => c.id === cid);
    return React.createElement("div", {
      key: cid,
      style: {
        flex: v,
        background: cat?.color || '#666'
      },
      title: `${cat?.name}: ${finFmt(v)}`
    });
  }), (() => {
    const other = Object.entries(r.byCat).reduce((s, [cid, v]) => topCatIds.includes(cid) ? s : s + v, 0);
    return other > 0 ? React.createElement("div", {
      style: {
        flex: other,
        background: otherColor
      },
      title: `Outros: ${finFmt(other)}`
    }) : null;
  })())), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: 'var(--ink-3)'
    }
  }, r.month.slice(5), "/", r.month.slice(2, 4))))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid var(--line)'
    }
  }, legendCats.map(c => React.createElement("div", {
    key: c.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11
    }
  }, React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: c.color
    }
  }), React.createElement("span", null, c.icon, " ", c.name))), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: otherColor
    }
  }), "Outros")));
}
function FinDayOfWeekChart({
  data,
  revealed
}) {
  const max = Math.max(...data, 1);
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      height: 180,
      padding: '4px 0'
    }
  }, data.map((v, i) => {
    const h = v / max * 100;
    const isWeekend = i === 0 || i === 6;
    return React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        height: 14,
        color: revealed ? 'var(--ink-2)' : 'transparent',
        textShadow: revealed ? 'none' : '0 0 8px rgba(255,255,255,0.4)'
      }
    }, finFmtShort(v)), React.createElement("div", {
      style: {
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        width: '70%',
        height: `${h}%`,
        minHeight: v > 0 ? 2 : 0,
        background: isWeekend ? 'var(--neon-c)' : 'var(--neon-b)',
        borderRadius: '4px 4px 0 0'
      }
    })), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: isWeekend ? 'var(--neon-c)' : 'var(--ink-3)'
      }
    }, labels[i]));
  }));
}
function FinYearlyChart({
  data,
  revealed
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      height: 220,
      padding: '4px 0'
    }
  }, data.map((d, i) => {
    const h = d.value / max * 100;
    const isLast = i === data.length - 1;
    return React.createElement("div", {
      key: d.year,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        height: 16,
        color: revealed ? isLast ? 'var(--neon-a)' : 'var(--ink-2)' : 'transparent',
        textShadow: revealed ? 'none' : '0 0 8px rgba(255,255,255,0.4)',
        fontWeight: 600
      }
    }, finFmtShort(d.value)), React.createElement("div", {
      style: {
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 6,
        marginBottom: 8
      }
    }, React.createElement("div", {
      style: {
        width: '60%',
        height: `${h}%`,
        minHeight: d.value > 0 ? 4 : 0,
        background: isLast ? 'var(--gradient-neon)' : 'rgba(91,141,255,0.4)',
        borderRadius: '6px 6px 0 0',
        boxShadow: isLast ? '0 0 20px rgba(255,46,136,0.3)' : 'none'
      }
    })), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        color: isLast ? 'var(--neon-a)' : 'var(--ink-2)',
        fontWeight: isLast ? 600 : 400
      }
    }, d.year));
  }));
}
function FinPatrimonio({
  fin,
  commit,
  revealed
}) {
  const [sub, setSub] = React.useState(() => localStorage.getItem('orbita_fin_patrimonio_sub') || 'investimentos');
  React.useEffect(() => {
    localStorage.setItem('orbita_fin_patrimonio_sub', sub);
  }, [sub]);
  return React.createElement("div", null, React.createElement("div", {
    className: "fin-subtabs",
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 14
    }
  }, React.createElement("button", {
    className: `tab-btn ${sub === 'investimentos' ? 'active' : ''}`,
    onClick: () => setSub('investimentos')
  }, "\uD83D\uDCC8 Investimentos"), React.createElement("button", {
    className: `tab-btn ${sub === 'dividas' ? 'active' : ''}`,
    onClick: () => setSub('dividas')
  }, "\uD83D\uDCB8 D\xEDvidas")), sub === 'investimentos' && React.createElement(FinInvestimentos, {
    fin: fin,
    commit: commit,
    revealed: revealed
  }), sub === 'dividas' && React.createElement(FinDividas, {
    fin: fin,
    commit: commit,
    revealed: revealed
  }));
}
function FinConfig({
  month,
  fin,
  commit
}) {
  const [sub, setSub] = React.useState(() => localStorage.getItem('orbita_fin_config_sub') || 'categorias');
  React.useEffect(() => {
    localStorage.setItem('orbita_fin_config_sub', sub);
  }, [sub]);
  return React.createElement("div", null, React.createElement("div", {
    className: "fin-subtabs",
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 14
    }
  }, React.createElement("button", {
    className: `tab-btn ${sub === 'categorias' ? 'active' : ''}`,
    onClick: () => setSub('categorias')
  }, "\uD83C\uDFF7 Categorias"), React.createElement("button", {
    className: `tab-btn ${sub === 'orcamento' ? 'active' : ''}`,
    onClick: () => setSub('orcamento')
  }, "\uD83D\uDCD0 Or\xE7amento")), sub === 'categorias' && React.createElement(FinCategorias, {
    month: month,
    fin: fin,
    commit: commit
  }), sub === 'orcamento' && React.createElement(FinOrcamento, {
    fin: fin,
    commit: commit
  }));
}
function FinInvestimentos({
  fin,
  commit,
  revealed = false,
  setRevealed = () => {}
}) {
  const investments = fin.investments || [];
  const contributions = fin.contributions || [];
  const [editInv, setEditInv] = React.useState(null);
  const [showAddInv, setShowAddInv] = React.useState(false);
  const [contribFor, setContribFor] = React.useState(null);
  const [showHistory, setShowHistory] = React.useState(false);
  const total = investments.reduce((s, i) => s + (parseFloat(i.currentValue) || 0), 0);
  const goalTotal = investments.filter(i => i.goal).reduce((s, i) => s + (parseFloat(i.goal) || 0), 0);
  const overallProgress = goalTotal > 0 ? Math.min(100, total / goalTotal * 100) : 0;
  const curMonth = finCurrentMonth();
  const monthContribs = contributions.filter(c => finMonth(c.date) === curMonth);
  const monthContribTotal = monthContribs.reduce((s, c) => s + (parseFloat(c.value) || 0), 0);
  const last12 = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    last12.push(ym);
  }
  const monthlyContribs = last12.map(ym => ({
    label: ym.slice(5) + '/' + ym.slice(2, 4),
    value: contributions.filter(c => finMonth(c.date) === ym).reduce((s, c) => s + (parseFloat(c.value) || 0), 0)
  }));
  const distribData = investments.filter(i => (parseFloat(i.currentValue) || 0) > 0).map(i => ({
    value: parseFloat(i.currentValue) || 0,
    color: i.color || FIN_INVESTMENT_TYPES.find(t => t.v === i.type)?.color || '#5b8dff'
  }));
  function deleteInvestment(id) {
    const inv = investments.find(i => i.id === id);
    if (!inv) return;
    if (!confirm(`Deletar "${inv.name}"? Os aportes ficarão órfãos mas não serão deletados.`)) return;
    commit(D => {
      finEnsure(D);
      D._finance.investments = D._finance.investments.filter(i => i.id !== id);
    });
  }
  function deleteContrib(id) {
    if (!confirm('Deletar este aporte?')) return;
    commit(D => {
      finEnsure(D);
      const c = D._finance.contributions.find(x => x.id === id);
      if (!c) return;
      const inv = D._finance.investments.find(i => i.id === c.investmentId);
      if (inv && c.affectsValue !== false) inv.currentValue = (parseFloat(inv.currentValue) || 0) - (parseFloat(c.value) || 0);
      D._finance.contributions = D._finance.contributions.filter(x => x.id !== id);
    });
  }
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '40%',
      background: 'radial-gradient(ellipse at right, rgba(60,207,145,0.18), transparent 70%)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative'
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Total guardado"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 56,
      lineHeight: 1,
      marginTop: 6,
      color: '#3ccf91'
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(total))), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginTop: 6
    }
  }, "em ", investments.length, " ", investments.length === 1 ? 'investimento' : 'investimentos', " \xB7 ", contributions.length, " aporte", contributions.length === 1 ? '' : 's', " totais"), monthContribTotal > 0 && React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--neon-c)',
      marginTop: 6
    },
    className: "mono"
  }, "+ ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(monthContribTotal)), " aportado este m\xEAs")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setShowHistory(true),
    style: {
      fontSize: 12
    }
  }, "\uD83D\uDCDC Hist\xF3rico"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => {
      setEditInv(null);
      setShowAddInv(true);
    }
  }, "\uFF0B Investimento"))), goalTotal > 0 && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      marginTop: 16,
      height: 8,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: `${overallProgress}%`,
      background: 'linear-gradient(135deg, #3ccf91, #5b8dff)'
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 6,
      fontSize: 10,
      color: 'var(--ink-3)'
    },
    className: "mono"
  }, React.createElement("span", null, overallProgress.toFixed(1), "% das metas"), React.createElement("span", null, "meta total: ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(goalTotal)))))), investments.length === 0 && React.createElement("div", {
    className: "panel",
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\uD83D\uDC8E"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Nenhum investimento ainda"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4,
      marginBottom: 16
    }
  }, "Adicione Tesouro, CDB, reservas, cripto, fundos\u2026"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => {
      setEditInv(null);
      setShowAddInv(true);
    }
  }, "\uFF0B Criar primeiro")), investments.length > 0 && React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: distribData.length > 0 ? '300px 1fr' : '1fr',
      gap: 16
    },
    className: "screen-grid"
  }, distribData.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Distribui\xE7\xE3o"), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, React.createElement(FinDonut, {
    data: distribData,
    size: 160,
    total: total,
    blurred: !revealed
  })), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, investments.filter(i => (parseFloat(i.currentValue) || 0) > 0).sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0)).map(i => {
    const color = i.color || FIN_INVESTMENT_TYPES.find(t => t.v === i.type)?.color || '#5b8dff';
    return React.createElement("div", {
      key: i.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11
      }
    }, React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: color,
        flexShrink: 0
      }
    }), React.createElement("span", {
      style: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, i.name), React.createElement("span", {
      className: "mono",
      style: {
        color: 'var(--ink-2)'
      }
    }, total ? Math.round(i.currentValue / total * 100) : 0, "%"));
  }))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 12
    }
  }, investments.map(inv => {
    const typeInfo = FIN_INVESTMENT_TYPES.find(t => t.v === inv.type);
    const color = inv.color || typeInfo?.color || '#5b8dff';
    const cv = parseFloat(inv.currentValue) || 0;
    const goal = parseFloat(inv.goal) || 0;
    const progress = goal > 0 ? Math.min(100, cv / goal * 100) : 0;
    const invContribs = contributions.filter(c => c.investmentId === inv.id);
    const totalContrib = invContribs.reduce((s, c) => s + (parseFloat(c.value) || 0), 0);
    return React.createElement("div", {
      key: inv.id,
      className: "panel",
      style: {
        padding: 0,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        padding: '14px 16px',
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        borderBottom: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: color + '22',
        border: `1px solid ${color}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 18,
        flexShrink: 0
      }
    }, inv.icon || '💎'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, inv.name), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, typeInfo?.l.replace(/^[^ ]+ /, '') || inv.type, inv.institution ? ` · ${inv.institution}` : ''))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, React.createElement("button", {
      className: "icon-btn",
      onClick: () => {
        setEditInv(inv);
        setShowAddInv(true);
      },
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u270E"), React.createElement("button", {
      className: "icon-btn",
      onClick: () => deleteInvestment(inv.id),
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u2715")))), React.createElement("div", {
      style: {
        padding: '14px 16px'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 6
      }
    }, React.createElement("span", {
      className: "eyebrow"
    }, "Saldo atual"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 18,
        fontWeight: 600,
        color
      }
    }, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(cv)))), goal > 0 && React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        height: 5,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        width: `${progress}%`,
        background: color
      }
    })), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        color: 'var(--ink-3)'
      },
      className: "mono"
    }, React.createElement("span", null, progress.toFixed(0), "% da meta"), React.createElement("span", null, "meta: ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(goal))))), React.createElement("div", {
      style: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid var(--line)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      },
      className: "mono"
    }, invContribs.length, " aporte", invContribs.length === 1 ? '' : 's', " \xB7 ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(totalContrib))), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => setContribFor(inv),
      style: {
        fontSize: 11,
        padding: '4px 10px',
        color
      }
    }, "\uFF0B Aportar"))));
  }))), contributions.length > 0 && React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    },
    className: "screen-grid"
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Aportes mensais \xB7 12 meses"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 14
    }
  }, "quanto voc\xEA guardou cada m\xEAs"), React.createElement(FinLineChart, {
    data: monthlyContribs,
    height: 160,
    color: "#3ccf91",
    revealed: revealed
  })), React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Aportes recentes"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setShowHistory(true),
    style: {
      fontSize: 11
    }
  }, "Ver todos")), [...contributions].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 6).map((c, i, arr) => {
    const inv = investments.find(x => x.id === c.investmentId);
    const color = inv?.color || FIN_INVESTMENT_TYPES.find(t => t.v === inv?.type)?.color || '#3ccf91';
    return React.createElement("div", {
      key: c.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none'
      }
    }, React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: color + '22',
        border: `1px solid ${color}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 14,
        flexShrink: 0
      }
    }, inv?.icon || '💎'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, inv?.name || 'Investimento removido'), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, Orbita.fmtDate(c.date), c.description ? ` · ${c.description}` : '')), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: '#3ccf91'
      }
    }, "+ ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(c.value))));
  }))), showAddInv && React.createElement(FinInvestmentModal, {
    onClose: () => {
      setShowAddInv(false);
      setEditInv(null);
    },
    editInv: editInv,
    commit: commit
  }), contribFor && React.createElement(FinContribModal, {
    onClose: () => setContribFor(null),
    investment: contribFor,
    commit: commit
  }), showHistory && React.createElement(FinContribHistoryModal, {
    onClose: () => setShowHistory(false),
    fin: fin,
    commit: commit,
    revealed: revealed,
    deleteContrib: deleteContrib
  }));
}
function FinInvestmentModal({
  onClose,
  editInv,
  commit
}) {
  const [name, setName] = React.useState(editInv?.name || '');
  const [type, setType] = React.useState(editInv?.type || 'reserva');
  const [institution, setInstitution] = React.useState(editInv?.institution || '');
  const [currentValue, setCurrentValue] = React.useState(editInv?.currentValue || '');
  const [goal, setGoal] = React.useState(editInv?.goal || '');
  const [icon, setIcon] = React.useState(editInv?.icon || '💎');
  const [color, setColor] = React.useState(editInv?.color || FIN_INVESTMENT_TYPES.find(t => t.v === (editInv?.type || 'reserva'))?.color || '#3ccf91');
  const colors = ['#3ccf91', '#5b8dff', '#b066ff', '#ff2e88', '#ffd60a', '#ffa830', '#9ea5b8', '#64d2ff', '#ff5a3c', '#ff5555'];
  function save() {
    if (!name.trim()) return;
    commit(D => {
      finEnsure(D);
      const inv = {
        id: editInv?.id || Orbita.uid(),
        name: name.trim(),
        type,
        institution: institution.trim() || null,
        currentValue: parseFloat(String(currentValue).replace(',', '.')) || 0,
        goal: goal ? parseFloat(String(goal).replace(',', '.')) : null,
        icon,
        color
      };
      if (editInv) {
        const idx = D._finance.investments.findIndex(i => i.id === editInv.id);
        if (idx >= 0) D._finance.investments[idx] = inv;
      } else {
        D._finance.investments.push(inv);
      }
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(520px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editInv ? 'Editar investimento' : 'Novo investimento'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-end'
    }
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "\xCDcone"), React.createElement(EmojiPicker, {
    value: icon,
    onChange: setIcon
  })), React.createElement("div", {
    className: "form-group",
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Nome"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Reserva de emerg\xEAncia, Tesouro IPCA+",
    value: name,
    onChange: e => setName(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Tipo"), React.createElement("div", {
    className: "form-chips"
  }, FIN_INVESTMENT_TYPES.map(t => React.createElement("div", {
    key: t.v,
    className: `form-chip ${type === t.v ? 'active' : ''}`,
    onClick: () => {
      setType(t.v);
      setColor(t.color);
    },
    style: type === t.v ? {
      borderColor: t.color,
      background: t.color + '22'
    } : {}
  }, t.l)))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Institui\xE7\xE3o"), React.createElement("input", {
    className: "form-input",
    placeholder: "Ex: XP, Ita\xFA, C6, Nubank",
    value: institution,
    onChange: e => setInstitution(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Saldo atual (R$)"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: currentValue,
    onChange: e => setCurrentValue(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Meta (R$, opcional)"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "Ex: 50000",
    value: goal,
    onChange: e => setGoal(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Cor"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, colors.map(c => React.createElement("div", {
    key: c,
    onClick: () => setColor(c),
    style: {
      width: 26,
      height: 26,
      borderRadius: 6,
      background: c,
      cursor: 'pointer',
      border: color === c ? '2px solid #fff' : '2px solid transparent'
    }
  }))))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, editInv ? 'Salvar' : 'Criar'))));
}
function FinContribModal({
  onClose,
  investment,
  commit
}) {
  const [value, setValue] = React.useState('');
  const [date, setDate] = React.useState(Orbita.todayStr());
  const [description, setDescription] = React.useState('');
  const [updateBalance, setUpdateBalance] = React.useState(true);
  function save() {
    const v = parseFloat(String(value).replace(',', '.'));
    if (isNaN(v) || v === 0) return;
    commit(D => {
      finEnsure(D);
      D._finance.contributions.push({
        id: Orbita.uid(),
        investmentId: investment.id,
        value: v,
        date,
        description: description.trim() || null,
        affectsValue: updateBalance
      });
      if (updateBalance) {
        const inv = D._finance.investments.find(i => i.id === investment.id);
        if (inv) inv.currentValue = (parseFloat(inv.currentValue) || 0) + v;
      }
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(440px, 92vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, investment.name), React.createElement("h2", null, "Novo aporte")), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Valor (R$)"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: value,
    onChange: e => setValue(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') save();
    }
  }), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "use negativo para resgate (ex: -1000)")), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Data"), React.createElement("input", {
    className: "form-input",
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Descri\xE7\xE3o (opcional)"), React.createElement("input", {
    className: "form-input",
    placeholder: "Ex: Sal\xE1rio, 13\xBA, rendimento",
    value: description,
    onChange: e => setDescription(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      cursor: 'pointer'
    }
  }, React.createElement("input", {
    type: "checkbox",
    checked: updateBalance,
    onChange: e => setUpdateBalance(e.target.checked),
    style: {
      accentColor: 'var(--neon-a)'
    }
  }), "Atualizar saldo do investimento automaticamente"))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, "Adicionar aporte"))));
}
function FinContribHistoryModal({
  onClose,
  fin,
  commit,
  revealed,
  deleteContrib
}) {
  const investments = fin.investments || [];
  const contribs = [...(fin.contributions || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const [filterInv, setFilterInv] = React.useState('all');
  const filtered = filterInv === 'all' ? contribs : contribs.filter(c => c.investmentId === filterInv);
  const total = filtered.reduce((s, c) => s + (parseFloat(c.value) || 0), 0);
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(640px, 95vw)',
      maxHeight: '88vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, "Hist\xF3rico de aportes"), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, React.createElement("select", {
    className: "form-input",
    value: filterInv,
    onChange: e => setFilterInv(e.target.value),
    style: {
      flex: 1,
      minWidth: 200,
      fontSize: 12,
      padding: '8px 12px'
    }
  }, React.createElement("option", {
    value: "all"
  }, "Todos investimentos"), investments.map(i => React.createElement("option", {
    key: i.id,
    value: i.id
  }, i.icon, " ", i.name))), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12,
      color: '#3ccf91',
      fontWeight: 600
    }
  }, filtered.length, " aportes \xB7 ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(total)))), React.createElement("div", {
    className: "modal-body",
    style: {
      overflowY: 'auto',
      flex: 1,
      padding: 0
    }
  }, filtered.length === 0 && React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '48px 20px',
      color: 'var(--ink-3)'
    }
  }, "Nenhum aporte ainda"), filtered.map((c, i) => {
    const inv = investments.find(x => x.id === c.investmentId);
    const color = inv?.color || '#3ccf91';
    const isWithdraw = (parseFloat(c.value) || 0) < 0;
    return React.createElement("div", {
      key: c.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 20px',
        borderBottom: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: color + '22',
        border: `1px solid ${color}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 14,
        flexShrink: 0
      }
    }, inv?.icon || '💎'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, inv?.name || 'Investimento removido'), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, Orbita.fmtDate(c.date), c.description ? ` · ${c.description}` : '')), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: isWithdraw ? '#ff5a3c' : '#3ccf91'
      }
    }, isWithdraw ? '' : '+ ', React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(c.value))), React.createElement("button", {
      onClick: () => deleteContrib(c.id),
      className: "icon-btn",
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u2715"));
  }))));
}
function FinDividas({
  fin,
  commit,
  revealed = false,
  setRevealed = () => {}
}) {
  const debts = fin.debts || [];
  const txs = fin.transactions || [];
  const accounts = fin.accounts || [];
  const [editDebt, setEditDebt] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showAuto, setShowAuto] = React.useState(false);
  const today = Orbita.todayStr();
  const detectedGroups = {};
  txs.forEach(t => {
    if (!t.installment) return;
    const groupId = t.parentId || t.id;
    const fallbackKey = `${(t.description || '').toLowerCase().trim()}|${t.accountId}|${t.installment.total}`;
    const key = t.parentId ? groupId : fallbackKey;
    if (!detectedGroups[key]) {
      detectedGroups[key] = {
        description: t.description,
        total: t.installment.total,
        paid: 0,
        remaining: 0,
        totalValue: 0,
        accountId: t.accountId,
        txs: [],
        lastDate: ''
      };
    }
    const g = detectedGroups[key];
    g.txs.push(t);
    g.totalValue += parseFloat(t.value) || 0;
    if (t.date > g.lastDate) g.lastDate = t.date;
    const isPaid = (t.status || 'paid') === 'paid' || t.date < today;
    if (isPaid) g.paid += 1;else g.remaining += parseFloat(t.value) || 0;
  });
  const detectedActive = Object.values(detectedGroups).filter(g => g.txs.length > 1 && g.paid < g.txs.length && g.remaining > 0).sort((a, b) => b.remaining - a.remaining);
  const totalActive = debts.filter(d => d.status !== 'paid').reduce((s, d) => s + Math.max(0, (parseFloat(d.totalValue) || 0) - (parseFloat(d.paidValue) || 0)), 0);
  const totalMonthly = debts.filter(d => d.status !== 'paid').reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0), 0);
  const totalDetected = detectedActive.reduce((s, g) => s + g.remaining, 0);
  function deleteDebt(id) {
    if (!confirm('Deletar essa dívida?')) return;
    commit(D => {
      finEnsure(D);
      D._finance.debts = D._finance.debts.filter(d => d.id !== id);
    });
  }
  function importDetected(g) {
    commit(D => {
      finEnsure(D);
      D._finance.debts.push({
        id: Orbita.uid(),
        name: g.description,
        creditor: '',
        totalValue: g.totalValue,
        paidValue: g.totalValue - g.remaining,
        monthlyPayment: g.txs[0]?.value || 0,
        installmentsTotal: g.total,
        installmentsPaid: g.paid,
        accountId: g.accountId,
        status: 'active',
        notes: 'Detectado a partir de parcelas'
      });
    });
  }
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '40%',
      background: 'radial-gradient(ellipse at right, rgba(255,85,85,0.18), transparent 70%)',
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative'
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Total devedor"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 56,
      lineHeight: 1,
      marginTop: 6,
      color: '#ff5555'
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(totalActive))), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginTop: 6
    }
  }, "em ", debts.filter(d => d.status !== 'paid').length, " ", debts.filter(d => d.status !== 'paid').length === 1 ? 'dívida ativa' : 'dívidas ativas', totalMonthly > 0 && React.createElement(React.Fragment, null, " \xB7 ", React.createElement("span", {
    style: {
      color: '#ffa830'
    }
  }, React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(totalMonthly)), "/m\xEAs"))), totalDetected > 0 && React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--neon-c)',
      marginTop: 6
    }
  }, "+ ", React.createElement(BlurValue, {
    revealed: revealed
  }, finFmt(totalDetected)), " em ", detectedActive.length, " parcelamento", detectedActive.length === 1 ? '' : 's', " detectado", detectedActive.length === 1 ? '' : 's', " ", React.createElement("button", {
    onClick: () => setShowAuto(s => !s),
    className: "btn-ghost small",
    style: {
      fontSize: 10,
      padding: '2px 8px',
      marginLeft: 4
    }
  }, showAuto ? 'ocultar' : 'mostrar'))), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => {
      setEditDebt(null);
      setShowAdd(true);
    }
  }, "\uFF0B D\xEDvida"))), showAuto && detectedActive.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Parcelamentos detectados automaticamente"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginBottom: 12
    }
  }, "compras parceladas com parcelas futuras pendentes \xB7 clique em \"Anotar\" para adicionar como d\xEDvida"), detectedActive.map((g, i) => {
    const acc = accounts.find(a => a.id === g.accountId);
    const progress = g.txs.length ? g.paid / g.txs.length * 100 : 0;
    return React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 0',
        borderBottom: i < detectedActive.length - 1 ? '1px solid var(--line)' : 'none'
      }
    }, React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'rgba(255,85,85,0.1)',
        border: '1px solid rgba(255,85,85,0.3)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 14
      }
    }, "\uD83D\uDCB8"), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, g.description), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        fontSize: 9,
        color: 'var(--ink-3)'
      },
      className: "mono"
    }, React.createElement("span", null, g.paid, "/", g.total, " pagas"), React.createElement("span", null, "\xB7"), React.createElement("span", null, acc?.name || '—'), React.createElement("span", null, "\xB7"), React.createElement("span", null, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(g.txs[0]?.value || 0)), "/parcela")), React.createElement("div", {
      style: {
        height: 3,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 4
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(135deg, #ff5555, #ffa830)'
      }
    }))), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: '#ff5555'
      }
    }, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(g.remaining))), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => importDetected(g),
      style: {
        fontSize: 10
      }
    }, "\uFF0B Anotar"));
  })), debts.length === 0 && !showAuto && React.createElement("div", {
    className: "panel",
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\uD83D\uDCB8"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Nenhuma d\xEDvida anotada"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 4,
      marginBottom: 16
    }
  }, "Empr\xE9stimos, financiamentos, parcelamentos longos\u2026"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: () => {
      setEditDebt(null);
      setShowAdd(true);
    }
  }, "\uFF0B Adicionar d\xEDvida"), detectedActive.length > 0 && React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setShowAuto(true)
  }, "Ver detectadas"))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 12
    }
  }, debts.map(d => {
    const total = parseFloat(d.totalValue) || 0;
    const paid = parseFloat(d.paidValue) || 0;
    const remaining = Math.max(0, total - paid);
    const progress = total > 0 ? Math.min(100, paid / total * 100) : 0;
    const isPaid = d.status === 'paid' || progress >= 100;
    const acc = accounts.find(a => a.id === d.accountId);
    return React.createElement("div", {
      key: d.id,
      className: "panel",
      style: {
        padding: 0,
        overflow: 'hidden',
        opacity: isPaid ? 0.6 : 1
      }
    }, React.createElement("div", {
      style: {
        padding: '14px 16px',
        background: isPaid ? 'linear-gradient(135deg, rgba(60,207,145,0.18), rgba(60,207,145,0.04))' : 'linear-gradient(135deg, rgba(255,85,85,0.14), rgba(255,85,85,0.04))',
        borderBottom: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, isPaid ? '✓' : '💸'), React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, d.name)), d.creditor && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, "credor: ", d.creditor)), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, React.createElement("button", {
      className: "icon-btn",
      onClick: () => {
        setEditDebt(d);
        setShowAdd(true);
      },
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u270E"), React.createElement("button", {
      className: "icon-btn",
      onClick: () => deleteDebt(d.id),
      style: {
        width: 26,
        height: 26,
        fontSize: 11
      }
    }, "\u2715")))), React.createElement("div", {
      style: {
        padding: '14px 16px'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 6
      }
    }, React.createElement("span", {
      className: "eyebrow"
    }, isPaid ? 'Quitada' : 'Faltam'), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 18,
        fontWeight: 600,
        color: isPaid ? '#3ccf91' : '#ff5555'
      }
    }, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(remaining)))), React.createElement("div", {
      style: {
        height: 5,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        width: `${progress}%`,
        background: isPaid ? '#3ccf91' : 'linear-gradient(135deg, #ff5555, #ffa830)'
      }
    })), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        color: 'var(--ink-3)'
      },
      className: "mono"
    }, React.createElement("span", null, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(paid)), " pago"), React.createElement("span", null, progress.toFixed(0), "% de ", React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(total)))), React.createElement("div", {
      style: {
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid var(--line)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        fontSize: 11
      }
    }, d.monthlyPayment > 0 && React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9
      }
    }, "Parcela"), React.createElement("div", {
      className: "mono",
      style: {
        color: '#ffa830',
        fontWeight: 600
      }
    }, React.createElement(BlurValue, {
      revealed: revealed
    }, finFmt(d.monthlyPayment)), "/m\xEAs")), d.installmentsTotal && React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9
      }
    }, "Parcelas"), React.createElement("div", {
      className: "mono"
    }, d.installmentsPaid || 0, "/", d.installmentsTotal)), d.interestRate && React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9
      }
    }, "Juros"), React.createElement("div", {
      className: "mono",
      style: {
        color: '#ff5555'
      }
    }, d.interestRate, "%/m\xEAs")), acc && React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9
      }
    }, "Meio"), React.createElement("div", {
      className: "mono",
      style: {
        color: acc.color
      }
    }, acc.name))), d.notes && React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 11,
        color: 'var(--ink-2)',
        lineHeight: 1.4
      }
    }, d.notes)));
  })), showAdd && React.createElement(FinDebtModal, {
    onClose: () => {
      setShowAdd(false);
      setEditDebt(null);
    },
    editDebt: editDebt,
    fin: fin,
    commit: commit
  }));
}
function FinDebtModal({
  onClose,
  editDebt,
  fin,
  commit
}) {
  const accounts = fin.accounts || [];
  const [name, setName] = React.useState(editDebt?.name || '');
  const [creditor, setCreditor] = React.useState(editDebt?.creditor || '');
  const [totalValue, setTotalValue] = React.useState(editDebt?.totalValue || '');
  const [paidValue, setPaidValue] = React.useState(editDebt?.paidValue || '');
  const [monthlyPayment, setMonthlyPayment] = React.useState(editDebt?.monthlyPayment || '');
  const [installmentsTotal, setInstallmentsTotal] = React.useState(editDebt?.installmentsTotal || '');
  const [installmentsPaid, setInstallmentsPaid] = React.useState(editDebt?.installmentsPaid || '');
  const [interestRate, setInterestRate] = React.useState(editDebt?.interestRate || '');
  const [accountId, setAccountId] = React.useState(editDebt?.accountId || '');
  const [status, setStatus] = React.useState(editDebt?.status || 'active');
  const [notes, setNotes] = React.useState(editDebt?.notes || '');
  function save() {
    if (!name.trim()) return;
    commit(D => {
      finEnsure(D);
      const debt = {
        id: editDebt?.id || Orbita.uid(),
        name: name.trim(),
        creditor: creditor.trim() || null,
        totalValue: parseFloat(String(totalValue).replace(',', '.')) || 0,
        paidValue: parseFloat(String(paidValue).replace(',', '.')) || 0,
        monthlyPayment: parseFloat(String(monthlyPayment).replace(',', '.')) || 0,
        installmentsTotal: installmentsTotal ? parseInt(installmentsTotal) : null,
        installmentsPaid: installmentsPaid ? parseInt(installmentsPaid) : 0,
        interestRate: interestRate ? parseFloat(String(interestRate).replace(',', '.')) : null,
        accountId: accountId || null,
        status,
        notes: notes.trim() || null
      };
      if (editDebt) {
        const idx = D._finance.debts.findIndex(x => x.id === editDebt.id);
        if (idx >= 0) D._finance.debts[idx] = debt;
      } else {
        D._finance.debts.push(debt);
      }
    });
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(560px, 95vw)'
    }
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editDebt ? 'Editar dívida' : 'Nova dívida'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group",
    style: {
      flex: 2
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Nome"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Empr\xE9stimo Lila, Financiamento carro...",
    value: name,
    onChange: e => setName(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Credor"), React.createElement("input", {
    className: "form-input",
    placeholder: "Banco, pessoa...",
    value: creditor,
    onChange: e => setCreditor(e.target.value)
  }))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Valor total (R$)"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: totalValue,
    onChange: e => setTotalValue(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "J\xE1 pago (R$)"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: paidValue,
    onChange: e => setPaidValue(e.target.value)
  }))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Parcela mensal (R$)"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0,00",
    value: monthlyPayment,
    onChange: e => setMonthlyPayment(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Juros (% ao m\xEAs)"), React.createElement("input", {
    className: "form-input",
    type: "text",
    inputMode: "decimal",
    placeholder: "0",
    value: interestRate,
    onChange: e => setInterestRate(e.target.value)
  }))), React.createElement("div", {
    className: "form-row"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Parcela atual"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "0",
    placeholder: "0",
    value: installmentsPaid,
    onChange: e => setInstallmentsPaid(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Total parcelas"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "0",
    placeholder: "0",
    value: installmentsTotal,
    onChange: e => setInstallmentsTotal(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Meio"), React.createElement("select", {
    className: "form-input",
    value: accountId,
    onChange: e => setAccountId(e.target.value)
  }, React.createElement("option", {
    value: ""
  }, "\u2014"), accounts.map(a => React.createElement("option", {
    key: a.id,
    value: a.id
  }, a.name))))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Status"), React.createElement("div", {
    className: "form-chips"
  }, [{
    v: 'active',
    l: '💸 Ativa'
  }, {
    v: 'paid',
    l: '✓ Quitada'
  }].map(s => React.createElement("div", {
    key: s.v,
    className: `form-chip ${status === s.v ? 'active' : ''}`,
    onClick: () => setStatus(s.v)
  }, s.l)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Notas"), React.createElement("textarea", {
    className: "form-input",
    placeholder: "Detalhes, plano de pagamento...",
    value: notes,
    onChange: e => setNotes(e.target.value),
    style: {
      minHeight: 60
    }
  }))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: save
  }, editDebt ? 'Salvar' : 'Criar'))));
}
window.ScreenFinance = ScreenFinance;
window.FinanceHomeBar = FinanceHomeBar;