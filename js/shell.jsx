/* Orbita v2 — Shell: Sidebar, TopBar, CommandPalette */

const NAV = [
  { section: 'WORKSPACE', items: [
    { id: 'today', icon: '☀︎', label: 'Home' },
  ]},
  { section: 'JORNADA', items: [
    { id: 'habits', icon: '✦', label: 'Hábitos' },
    { id: 'goals', icon: '◎', label: 'Objetivos' },
    { id: 'ideas', icon: '◆', label: 'Ideias' },
  ]},
  { section: 'BIBLIOTECA', items: [
    { id: 'books', icon: '▢', label: 'Livros' },
    { id: 'media', icon: '▷', label: 'Mídia' },
    { id: 'shopping', icon: '⊞', label: 'Listas' },
    { id: 'notes', icon: '✎', label: 'Notas' },
  ]},
  { section: 'VOCÊ', items: [
    { id: 'profile', icon: '★', label: 'Perfil' },
    { id: 'charts', icon: '◉', label: 'Gráficos' },
    { id: 'history', icon: '▤', label: 'Histórico' },
  ]},
];

function Sidebar({ active, setActive, className }) {
  const { data } = useData();
  const xp = data.xp || { total: 0, level: 1, class: null };
  const cls = xp.class;
  const clsInfo = cls ? Orbita.CLASSES_MAP[cls] : null;
  const clsEn = clsInfo ? clsInfo.en : 'warrior';
  const spriteIdx = Orbita.getSpriteIndex(xp.level, cls);
  const lvlStart = Orbita.getTotalXPForLevel(xp.level);
  const lvlEnd = Orbita.getTotalXPForLevel(xp.level + 1);
  const pct = lvlEnd > lvlStart ? Math.round((xp.total - lvlStart) / (lvlEnd - lvlStart) * 100) : 0;

  const today = Orbita.todayStr();
  const todayTasks = (data.tasks || []).filter(t => Orbita.isTaskForDate(t, today) && !Orbita.isTaskDone(t, today));
  const dow = new Date().getDay();
  const bestStreak = (data.habits || []).reduce((best, h) => Math.max(best, Orbita.getStreak(h)), 0);

  function getBadge(id) {
    if (id === 'today') return todayTasks.length || null;
    return null;
  }

  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo" onClick={() => setActive('today')} style={{ cursor: 'pointer' }}>
          <OrbLogo size={26} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, lineHeight: 1, letterSpacing: '-0.02em' }}>Orbita</div>
            <div className="mono" style={{ fontSize: 9.5, color: 'var(--ink-3)', marginTop: 2, letterSpacing: '0.08em' }}>v2.0</div>
          </div>
        </div>
      </div>

      <div className="sidebar-avatar" style={{ cursor: 'pointer' }} onClick={() => setActive('profile')}>
        <div className="avatar-orb" style={{ background: `radial-gradient(circle, ${clsInfo ? `var(--class-${clsEn})` : 'rgba(255,255,255,0.1)'}33, transparent 65%)` }}>
          <SpriteRender cls={clsEn} spriteIndex={spriteIdx} size={54} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span className={`class-chip ${clsInfo ? clsEn : 'novice'}`}>
              {clsInfo ? (clsInfo.icon + ' ' + clsInfo.name) : ('🧭 ' + Orbita.TITLES_MAP(xp.level))}
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(data._profile && data._profile.name) || 'Aventureiro'}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
            Lvl {xp.level} · {xp.total >= 1000 ? (xp.total/1000).toFixed(1)+'k' : xp.total} xp
          </div>
          <div className="xp-bar" style={{ marginTop: 6 }}>
            <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.section} className="nav-section">
            <div className="nav-section-title">{section.section}</div>
            {section.items.map(it => {
              const badge = getBadge(it.id);
              return (
                <button key={it.id} onClick={() => setActive(it.id)} className={`nav-item ${active === it.id ? 'active' : ''}`}>
                  <span className="nav-icon">{it.icon}</span>
                  <span className="nav-label">{it.label}</span>
                  {badge && <span className="nav-badge">{badge}</span>}
                </button>
              );
            })}
          </div>
        ))}

        {/* Categories */}
        {(data.categories || []).length > 0 && (
          <div className="nav-section">
            <div className="nav-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>CATEGORIAS</span>
              <button onClick={() => window._openCategories && window._openCategories()} style={{
                width: 18, height: 18, borderRadius: 5, display: 'grid', placeItems: 'center',
                background: 'var(--gradient-neon)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 700,
              }}>＋</button>
            </div>
            {(data.categories || []).map(c => {
              const count = todayTasks.filter(t => t.cat === c.id).length;
              const color = Orbita.resolveColor(c.color);
              return (
                <button key={c.id} onClick={() => { setActive('today'); window.dispatchEvent(new CustomEvent('orbita:filterCat', { detail: c.id })); }} className="nav-item" style={{ paddingRight: 8 }}>
                  <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 3, background: color, flexShrink: 0 }} />
                  </span>
                  <span className="nav-label">{c.name}</span>
                  <span style={{
                    minWidth: 20, height: 20, borderRadius: 10, display: 'grid', placeItems: 'center',
                    fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
                    background: count > 0 ? color + '33' : 'rgba(255,255,255,0.04)',
                    color: count > 0 ? color : 'var(--ink-4)',
                    border: count > 0 ? `1px solid ${color}55` : '1px solid var(--line)',
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="sidebar-bottom">
        <button className="cmd-button" onClick={() => window.dispatchEvent(new CustomEvent('orbita:openCmd'))}>
          <span style={{ fontSize: 13 }}>⌘</span>
          <span>Comandos</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 'auto' }}>⌘K</span>
        </button>
        {bestStreak > 0 && (
          <div className="streak-mini">
            <span style={{ fontSize: 14 }}>🔥</span>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 11, color: '#ff5a3c', fontWeight: 500 }}>{bestStreak} dias</div>
              <div style={{ fontSize: 9, color: 'var(--ink-3)' }}>melhor streak</div>
            </div>
          </div>
        )}
        <button className="cmd-button" onClick={() => { if (confirm('Sair da conta?')) { window.OrbitaFirebase && window.OrbitaFirebase.signOut(); localStorage.removeItem('orbita_skipLogin'); location.reload(); } }}
          style={{ opacity: 0.6 }}>
          <span style={{ fontSize: 12 }}>⏻</span>
          <span style={{ fontSize: 11 }}>Sair</span>
        </button>
      </div>
    </aside>
  );
}

/* SyncStatus removed — login is handled by landing page, sync is automatic */
function SyncStatus() {
  const [user, setUser] = React.useState(window.OrbitaFirebase ? window.OrbitaFirebase.getCurrentUser() : null);
  const [showLogin, setShowLogin] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

  React.useEffect(() => {
    if (window.OrbitaFirebase) window.OrbitaFirebase.init();
    function onAuth(e) { setUser(e.detail); }
    window.addEventListener('orbita:authChanged', onAuth);
    return () => window.removeEventListener('orbita:authChanged', onAuth);
  }, []);

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: '#30d158', fontWeight: 500 }}>Sincronizado</div>
          <div style={{ fontSize: 9, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
        </div>
        <button onClick={() => window.OrbitaFirebase.signOut()} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 9 }}>sair</button>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0' }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 6, padding: '6px 8px', color: 'var(--ink-1)', fontSize: 11, fontFamily: 'var(--font-ui)', outline: 'none' }} />
        <input placeholder="Senha" type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') window.OrbitaFirebase.signInWithEmail(email, pass); }}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 6, padding: '6px 8px', color: 'var(--ink-1)', fontSize: 11, fontFamily: 'var(--font-ui)', outline: 'none' }} />
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-ghost small" style={{ flex: 1, justifyContent: 'center', fontSize: 10 }}
            onClick={() => window.OrbitaFirebase.signInWithEmail(email, pass)}>Entrar</button>
          <button className="btn-ghost small" style={{ fontSize: 10 }} onClick={() => setShowLogin(false)}>✕</button>
        </div>
        <button onClick={() => window.OrbitaFirebase.signInWithGoogle()} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '7px 0',
          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 6,
          color: 'var(--ink-2)', fontSize: 10, fontFamily: 'var(--font-ui)', cursor: 'pointer',
        }}>
          <span style={{ fontSize: 13 }}>G</span> Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <button className="cmd-button" onClick={() => setShowLogin(true)}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-4)' }} />
      <span style={{ fontSize: 11 }}>Fazer login para sync</span>
    </button>
  );
}

function TopBarCalendarBtn() {
  const { calendarConnected } = useData();
  const [connected, setConnected] = React.useState(calendarConnected);
  React.useEffect(() => {
    const onC = () => setConnected(true);
    const onD = () => setConnected(false);
    window.addEventListener('orbita:calendarConnected', onC);
    window.addEventListener('orbita:calendarDisconnected', onD);
    return () => { window.removeEventListener('orbita:calendarConnected', onC); window.removeEventListener('orbita:calendarDisconnected', onD); };
  }, []);
  function handleClick() {
    if (connected) {
      if (confirm('Desconectar Google Calendar?')) window.OrbitaFirebase.disconnectGoogleCalendar();
    } else {
      if (window.OrbitaFirebase && window.OrbitaFirebase.getCurrentUser()) {
        window.OrbitaFirebase.connectGoogleCalendar();
      } else {
        window.OrbitaFirebase.signInWithGoogle(true);
      }
    }
  }
  return (
    <button onClick={handleClick} title={connected ? 'Google Calendar conectado' : 'Conectar Google Calendar'}
      style={{
        width: 36, height: 36, display: 'grid', placeItems: 'center', position: 'relative',
        background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10,
        color: connected ? '#30d158' : 'var(--ink-2)', fontSize: 15, cursor: 'pointer', transition: 'all 120ms',
      }}>
      ⏻
      {connected && <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />}
    </button>
  );
}

function TopBar({ title, subtitle, actions }) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const fmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now);
  return (
    <div className="topbar">
      <div>
        <div className="eyebrow" style={{ marginBottom: 4 }}>{subtitle || fmt}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 42, lineHeight: 1, letterSpacing: '-0.03em' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', padding: '8px 12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10 }}>{time}</div>
        <button onClick={() => window.dispatchEvent(new CustomEvent('orbita:openCmd'))} style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--ink-2)', fontSize: 15, cursor: 'pointer', transition: 'all 120ms' }} title="Buscar">⌕</button>
        <button onClick={() => window._openThemes && window._openThemes()} style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--ink-2)', fontSize: 15, cursor: 'pointer', transition: 'all 120ms' }} title="Temas">◐</button>
        <TopBarCalendarBtn />
        {actions}
      </div>
    </div>
  );
}

function CommandPalette({ setActive, setShowTaskModal, setShowHabitModal }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const { data } = useData();

  React.useEffect(() => {
    const toggle = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    const ext = () => setOpen(true);
    window.addEventListener('keydown', toggle);
    window.addEventListener('orbita:openCmd', ext);
    return () => { window.removeEventListener('keydown', toggle); window.removeEventListener('orbita:openCmd', ext); };
  }, []);

  const commands = [
    { icon: '＋', label: 'Nova tarefa', hint: 'N', cat: 'Ação', action: () => { setShowTaskModal(true); setOpen(false); } },
    { icon: '✦', label: 'Novo hábito', hint: 'H', cat: 'Ação', action: () => { setShowHabitModal(true); setOpen(false); } },
    { icon: '◉', label: 'Pomodoro', hint: 'P', cat: 'Ação', action: () => { window._startPomo && window._startPomo(); setOpen(false); } },
    { icon: '◐', label: 'Temas', hint: 'T', cat: 'Ação', action: () => { window._openThemes && window._openThemes(); setOpen(false); } },
    { icon: '☀︎', label: 'Home', cat: 'Nav', action: () => { setActive('today'); setOpen(false); } },
    { icon: '✦', label: 'Hábitos', cat: 'Nav', action: () => { setActive('habits'); setOpen(false); } },
    { icon: '◎', label: 'Objetivos', cat: 'Nav', action: () => { setActive('goals'); setOpen(false); } },
    { icon: '▢', label: 'Livros', cat: 'Nav', action: () => { setActive('books'); setOpen(false); } },
    { icon: '▷', label: 'Mídia', cat: 'Nav', action: () => { setActive('media'); setOpen(false); } },
    { icon: '⊞', label: 'Listas', cat: 'Nav', action: () => { setActive('shopping'); setOpen(false); } },
    { icon: '✎', label: 'Notas', cat: 'Nav', action: () => { setActive('notes'); setOpen(false); } },
    { icon: '▤', label: 'Histórico', cat: 'Nav', action: () => { setActive('history'); setOpen(false); } },
    { icon: '◉', label: 'Gráficos', cat: 'Nav', action: () => { setActive('charts'); setOpen(false); } },
    { icon: '★', label: 'Perfil', cat: 'Nav', action: () => { setActive('profile'); setOpen(false); } },
  ];

  const ql = q.toLowerCase().trim();
  let items = [];

  if (!ql) {
    items = commands;
  } else {
    const cmdMatches = commands.filter(c => c.label.toLowerCase().includes(ql));
    const contentResults = [];
    const seen = new Set();
    function addResult(icon, label, sub, cat, action) {
      const key = cat + label;
      if (seen.has(key)) return;
      seen.add(key);
      contentResults.push({ icon, label, sub, cat, action });
    }

    (data.tasks || []).forEach(t => {
      if ((t.text || '').toLowerCase().includes(ql) || (t.desc || '').toLowerCase().includes(ql)) {
        addResult(t.icon || '☀︎', t.text, t.freq + (t.date ? ` · ${t.date}` : ''), 'Tarefa',
          () => { setActive('today'); setOpen(false); });
      }
    });
    (data.habits || []).forEach(h => {
      if ((h.name || '').toLowerCase().includes(ql)) {
        addResult(h.icon || '✦', h.name, null, 'Hábito',
          () => { setActive('habits'); setOpen(false); });
      }
    });
    (data.goals || []).forEach(g => {
      if ((g.title || '').toLowerCase().includes(ql) || (g.desc || '').toLowerCase().includes(ql)) {
        addResult('◎', g.title, g.deadline ? `prazo ${g.deadline}` : null, 'Objetivo',
          () => { setActive('goals'); setOpen(false); });
      }
    });
    const media = data.media || {};
    (media.livros || []).forEach(b => {
      if ((b.title || '').toLowerCase().includes(ql) || (b.author || '').toLowerCase().includes(ql)) {
        addResult('▢', b.title, b.author || null, 'Livro',
          () => { setActive('books'); setOpen(false); });
      }
    });
    (media.filmes || []).forEach(f => {
      if ((f.title || '').toLowerCase().includes(ql) || (f.director || '').toLowerCase().includes(ql)) {
        addResult('▷', f.title, f.director || f.year || null, 'Filme',
          () => { setActive('media'); setOpen(false); });
      }
    });
    (media.series || []).forEach(s => {
      if ((s.title || '').toLowerCase().includes(ql)) {
        addResult('▷', s.title, s.year || null, 'Série',
          () => { setActive('media'); setOpen(false); });
      }
    });
    (data.notes || []).forEach(n => {
      if ((n.text || '').toLowerCase().includes(ql)) {
        addResult('✎', n.text.substring(0, 60) + (n.text.length > 60 ? '...' : ''), n.date || null, 'Nota',
          () => { setActive('notes'); setOpen(false); });
      }
    });
    (data.ideias || []).forEach(idea => {
      if ((idea.title || '').toLowerCase().includes(ql) || (idea.desc || '').toLowerCase().includes(ql)) {
        addResult('◆', idea.title, null, 'Ideia',
          () => { setActive('ideas'); setOpen(false); });
      }
    });
    (data.shopLists || []).forEach(list => {
      if ((list.name || '').toLowerCase().includes(ql)) {
        addResult('⊞', list.name, `${(list.items||[]).length} itens`, 'Lista',
          () => { setActive('shopping'); setOpen(false); });
      }
      (list.items || []).forEach(item => {
        if ((item.text || '').toLowerCase().includes(ql)) {
          addResult('⊞', item.text, `em ${list.name}`, 'Item',
            () => { setActive('shopping'); setOpen(false); });
        }
      });
    });

    items = [...cmdMatches, ...contentResults.slice(0, 20)];
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, items.length-1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    if (e.key === 'Enter' && items[sel]) { items[sel].action(); }
  }

  if (!open) return null;
  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-panel" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-row">
          <span style={{ fontSize: 15, color: 'var(--ink-3)' }}>⌕</span>
          <input autoFocus placeholder="Buscar tarefas, livros, hábitos..." value={q} onChange={e => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} />
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', padding: '3px 8px', border: '1px solid var(--line)', borderRadius: 6 }}>ESC</span>
        </div>
        <div className="cmd-list">
          {items.length === 0 && ql && (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              Nenhum resultado para "{q}"
            </div>
          )}
          {items.map((it, i) => (
            <div key={i} className={`cmd-item ${i === sel ? 'selected' : ''}`} onClick={() => it.action()}>
              <div className="cmd-icon">{it.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</div>
                {it.sub && <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 1 }}>{it.sub}</div>}
              </div>
              {it.hint && <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 6px', borderRadius: 4, border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', color: 'var(--ink-3)' }}>{it.hint}</kbd>}
              <span className="chip" style={{ fontSize: 10 }}>{it.cat}</span>
            </div>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navegar</span>
          <span><kbd>⏎</kbd> selecionar</span>
          <span><kbd>⌘K</kbd> fechar</span>
        </div>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.TopBar = TopBar;
window.CommandPalette = CommandPalette;
