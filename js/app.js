function ImportExportModal({
  onClose
}) {
  const {
    data
  } = useData();
  const [pasteData, setPasteData] = React.useState('');
  const [tab, setTab] = React.useState('import');
  function doImportFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        doImport(ev.target.result);
      };
      reader.readAsText(file);
    };
    input.click();
  }
  function doImportPaste() {
    doImport(pasteData);
  }
  function doImport(raw) {
    try {
      const imported = JSON.parse(raw);
      if (!imported.tasks && !imported.habits) {
        alert('Formato inválido — não encontrou tasks ou habits');
        return;
      }
      if (!confirm(`Importar ${imported.tasks?.length || 0} tarefas, ${imported.habits?.length || 0} hábitos, ${imported.goals?.length || 0} objetivos? Isso vai SUBSTITUIR os dados atuais.`)) return;
      localStorage.setItem('meuPainel_v4', raw);
      alert('Dados importados! Recarregando...');
      location.reload();
    } catch (err) {
      alert('Erro ao importar: ' + err.message);
    }
  }
  function doExport() {
    const raw = localStorage.getItem('meuPainel_v4') || '{}';
    const blob = new Blob([raw], {
      type: 'application/json'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `orbita-backup-${Orbita.todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
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
  }, React.createElement("h2", null, "Importar / Exportar"), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 16
    }
  }, React.createElement("button", {
    className: `tab-btn ${tab === 'import' ? 'active' : ''}`,
    onClick: () => setTab('import')
  }, "Importar"), React.createElement("button", {
    className: `tab-btn ${tab === 'export' ? 'active' : ''}`,
    onClick: () => setTab('export')
  }, "Exportar")), tab === 'import' && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "panel",
    style: {
      padding: 16,
      marginBottom: 12,
      background: 'rgba(255,46,136,0.06)',
      border: '1px solid rgba(255,46,136,0.15)'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 6
    }
  }, "Como pegar dados da v1:"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-2)',
      lineHeight: 1.6
    }
  }, "1. Abra a v1 em ", React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10
    }
  }, "stephanosantos-sg.github.io/meu-painel"), React.createElement("br", null), "2. Pressione ", React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10
    }
  }, "\u2318+\u2325+J"), " (Console)", React.createElement("br", null), "3. Cole e execute:", React.createElement("br", null)), React.createElement("div", {
    style: {
      background: 'rgba(0,0,0,0.2)',
      padding: '8px 10px',
      borderRadius: 6,
      marginTop: 6,
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      wordBreak: 'break-all',
      cursor: 'pointer'
    },
    onClick: () => {
      navigator.clipboard.writeText("copy(localStorage.getItem('meuPainel_v4'))");
      alert('Comando copiado!');
    }
  }, "copy(localStorage.getItem('meuPainel_v4'))", React.createElement("br", null), React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "\u2190 clique para copiar")), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-2)',
      marginTop: 6
    }
  }, "4. Cole abaixo ou salve como .json e use o bot\xE3o de arquivo")), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Colar dados JSON"), React.createElement("textarea", {
    className: "form-input",
    placeholder: "Cole o JSON aqui (come\xE7a com {\"tasks\":...)",
    value: pasteData,
    onChange: e => setPasteData(e.target.value),
    style: {
      minHeight: 100,
      fontSize: 11,
      fontFamily: 'var(--font-mono)'
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 20px',
      fontSize: 13
    },
    onClick: doImportPaste,
    disabled: !pasteData.trim()
  }, "Importar do texto"), React.createElement("button", {
    className: "btn-ghost",
    onClick: doImportFile
  }, "\uD83D\uDCC1 Importar arquivo .json"))), tab === 'export' && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      marginBottom: 12
    }
  }, "Exporta todos os dados do Orbita (tarefas, h\xE1bitos, objetivos, m\xEDdia, XP, conquistas, categorias, notas, ideias, compras)."), React.createElement("div", {
    className: "panel",
    style: {
      padding: 14,
      marginBottom: 12
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 8,
      textAlign: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, data.tasks?.length || 0), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "tarefas")), React.createElement("div", null, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, data.habits?.length || 0), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "h\xE1bitos")), React.createElement("div", null, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, data.goals?.length || 0), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "objetivos")))), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 20px',
      fontSize: 13
    },
    onClick: doExport
  }, "\u2B07 Baixar backup JSON")))));
}
function QuickBar({
  onPomo,
  onSync
}) {
  const {
    data,
    commit
  } = useData();
  const [syncing, setSyncing] = React.useState(false);
  const syncUrl = localStorage.getItem('meuPainel_syncUrl');
  function handleSave() {
    Orbita.persistData(JSON.parse(JSON.stringify(data)));
    window._showQuickToast && window._showQuickToast('Salvo localmente');
  }
  function handleSync() {
    if (!syncUrl) {
      const url = prompt('Cole a URL do Google Apps Script para sync:');
      if (url) localStorage.setItem('meuPainel_syncUrl', url);else return;
    }
    setSyncing(true);
    Orbita.persistData(JSON.parse(JSON.stringify(data)));
    setTimeout(() => {
      setSyncing(false);
      window._showQuickToast && window._showQuickToast('Sincronizado');
    }, 2000);
  }
  function handleTemplates() {
    const templates = [{
      text: 'Reunião',
      icon: '🏢',
      freq: 'pontual',
      prio: 2
    }, {
      text: 'Exercício',
      icon: '🏋️',
      freq: 'diaria',
      prio: 2,
      days: [1, 3, 5]
    }, {
      text: 'Ler 30 min',
      icon: '📖',
      freq: 'diaria',
      prio: 3
    }, {
      text: 'Revisar emails',
      icon: '📧',
      freq: 'diaria',
      prio: 3
    }, {
      text: 'Compras da semana',
      icon: '🛒',
      freq: 'semanal',
      prio: 3,
      days: [6]
    }, {
      text: 'Limpeza da casa',
      icon: '🧹',
      freq: 'semanal',
      prio: 3,
      days: [0]
    }];
    const choice = templates.map((t, i) => `${i + 1}. ${t.icon} ${t.text}`).join('\n');
    const idx = parseInt(prompt(`Escolha um template:\n\n${choice}\n\nDigite o número:`)) - 1;
    if (idx >= 0 && idx < templates.length) {
      const t = templates[idx];
      commit(D => {
        D.tasks.push({
          id: Orbita.uid(),
          text: t.text,
          icon: t.icon,
          freq: t.freq,
          prio: t.prio,
          date: Orbita.todayStr(),
          time: null,
          done: false,
          doneSlots: {},
          subtasks: [],
          times: [],
          cat: null,
          days: t.days
        });
      });
    }
  }
  return React.createElement("div", {
    style: {
      position: 'fixed',
      right: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, [{
    icon: '▶',
    label: 'Pomodoro',
    onClick: onPomo
  }, {
    icon: '☆',
    label: 'Templates',
    onClick: handleTemplates
  }, {
    icon: '⇅',
    label: syncing ? 'Sync...' : 'Nuvem',
    onClick: handleSync
  }, {
    icon: '⬇',
    label: 'Salvar',
    onClick: handleSave
  }].map(btn => React.createElement("button", {
    key: btn.label,
    onClick: btn.onClick,
    title: btn.label,
    style: {
      width: 38,
      height: 38,
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(14,14,20,0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--glass-border)',
      borderRadius: 10,
      color: 'var(--ink-2)',
      fontSize: 15,
      cursor: 'pointer',
      transition: 'all 120ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--glass-border)';
      e.currentTarget.style.color = 'var(--ink-2)';
    }
  }, btn.icon)));
}
function App() {
  const HASH_ROUTES = {
    financeiro: 'finance',
    financas: 'finance',
    finance: 'finance',
    dash: 'finance',
    habitos: 'habits',
    dieta: 'diet',
    midia: 'media',
    livros: 'books',
    metas: 'goals'
  };
  const [active, setActive] = React.useState(() => HASH_ROUTES[(location.hash || '').replace('#', '').toLowerCase()] || 'today');
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [showHabitModal, setShowHabitModal] = React.useState(false);
  const [showPomo, setShowPomo] = React.useState(false);
  const [showThemes, setShowThemes] = React.useState(false);
  const [showCategories, setShowCategories] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [editHabit, setEditHabit] = React.useState(null);
  function openNewTask() {
    setEditTask(null);
    setShowTaskModal(true);
  }
  function openNewHabit(habit) {
    setEditHabit(habit && habit.id ? habit : null);
    setShowHabitModal(true);
  }
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        if (showTaskModal) {
          setShowTaskModal(false);
          return;
        }
        if (showHabitModal) {
          setShowHabitModal(false);
          return;
        }
        if (showThemes) {
          setShowThemes(false);
          return;
        }
        if (showCategories) {
          setShowCategories(false);
          return;
        }
        if (showImport) {
          setShowImport(false);
          return;
        }
        if (showSettings) {
          setShowSettings(false);
          return;
        }
        return;
      }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) openNewTask();
      if (e.key === 'h' && !e.metaKey && !e.ctrlKey) openNewHabit();
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey) setShowPomo(true);
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) setShowThemes(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, showTaskModal, showHabitModal, showThemes, showCategories, showImport]);
  React.useEffect(() => {
    if (window.OrbitaNotify) {
      window.OrbitaNotify.init(() => {
        try {
          return Orbita.loadData();
        } catch (e) {
          return null;
        }
      });
    }
    if (window.Orbita && Orbita.maybeAutoExport) {
      setTimeout(() => Orbita.maybeAutoExport(), 8000);
    }
  }, []);
  window._openThemes = () => setShowThemes(true);
  window._openCategories = () => setShowCategories(true);
  window._openImport = () => setShowImport(true);
  window._openSettings = () => setShowSettings(true);
  window._startPomo = () => setShowPomo(true);
  window._editTask = task => {
    setEditTask(task);
    setShowTaskModal(true);
  };
  window._toggleMobileMenu = () => setMobileMenu(m => !m);
  window._goHome = () => setActive('today');
  window._goScreen = id => setActive(id);
  const screens = {
    today: () => React.createElement(ScreenToday, {
      onNewTask: openNewTask
    }),
    legio: () => React.createElement(ScreenLegio, null),
    habits: () => React.createElement(ScreenHabits, {
      onNewHabit: openNewHabit
    }),
    goals: () => React.createElement(ScreenGoals, null),
    diet: () => React.createElement(ScreenDiet, null),
    finance: () => React.createElement(ScreenFinance, null),
    profile: () => React.createElement(ScreenProfile, null),
    ideas: () => React.createElement(ScreenIdeas, null),
    books: () => React.createElement(ScreenBooks, null),
    media: () => React.createElement(ScreenMedia, null),
    shopping: () => React.createElement(ScreenShopping, null),
    notes: () => React.createElement(ScreenNotes, null),
    history: () => React.createElement(ScreenHistory, null),
    charts: () => React.createElement(ScreenCharts, null),
    weekly: () => React.createElement(ScreenWeekly, null)
  };
  const Screen = screens[active] || screens.today;
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  function mobileNav(id) {
    setActive(id);
    setMobileMenu(false);
  }
  return React.createElement(DataProvider, null, React.createElement("div", {
    className: "app-shell"
  }, React.createElement(Sidebar, {
    active: active,
    setActive: id => {
      setActive(id);
      setMobileMenu(false);
    },
    className: mobileMenu ? 'mobile-open' : ''
  }), mobileMenu && React.createElement("div", {
    className: "mobile-overlay",
    onClick: () => setMobileMenu(false)
  }), React.createElement("main", {
    className: "workspace"
  }, active === 'today' && window.WeeklyBanner && React.createElement("div", {
    style: {
      padding: '20px 32px 0'
    }
  }, React.createElement(WeeklyBanner, {
    onOpen: () => setActive('weekly')
  })), React.createElement(ScreenBoundary, {
    key: active,
    goHome: () => setActive('today')
  }, React.createElement(Screen, null))), React.createElement("div", {
    className: "mobile-nav"
  }, [{
    id: 'today',
    icon: '☀︎',
    label: 'Home'
  }, {
    id: 'habits',
    icon: '✦',
    label: 'Hábitos'
  }, {
    id: 'diet',
    icon: '◕',
    label: 'Dieta'
  }, {
    id: 'finance',
    icon: '$',
    label: 'Finanças'
  }, {
    id: 'goals',
    icon: '◎',
    label: 'Metas'
  }].map(it => React.createElement("button", {
    key: it.id,
    className: `mobile-nav-item ${active === it.id ? 'active' : ''}`,
    onClick: () => mobileNav(it.id)
  }, React.createElement("span", {
    className: "mn-icon"
  }, it.icon), React.createElement("span", null, it.label)))), React.createElement(CommandPalette, {
    setActive: setActive,
    setShowTaskModal: setShowTaskModal,
    setShowHabitModal: setShowHabitModal
  }), window.OrbitaAIBar && React.createElement(OrbitaAIBar, {
    screen: active
  }), React.createElement(ToastLayer, null), showTaskModal && React.createElement(TaskModal, {
    onClose: () => setShowTaskModal(false),
    editTask: editTask
  }), showHabitModal && React.createElement(HabitModal, {
    onClose: () => setShowHabitModal(false),
    editHabit: editHabit
  }), showPomo && React.createElement(Pomodoro, {
    onClose: () => setShowPomo(false)
  }), showThemes && React.createElement(ThemePicker, {
    onClose: () => setShowThemes(false)
  }), showCategories && React.createElement(ScreenCategories, {
    onClose: () => setShowCategories(false)
  }), showImport && React.createElement(ImportExportModal, {
    onClose: () => setShowImport(false)
  }), showSettings && window.SettingsModal && React.createElement(SettingsModal, {
    onClose: () => setShowSettings(false)
  })));
}
class ScreenBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: null
    };
  }
  static getDerivedStateFromError(err) {
    return {
      err
    };
  }
  componentDidCatch(err, info) {
    console.error('Tela quebrou:', err, info && info.componentStack);
  }
  render() {
    if (this.state.err) {
      return React.createElement("div", {
        style: {
          padding: 48,
          textAlign: 'center',
          fontFamily: 'var(--font-ui)'
        }
      }, React.createElement("div", {
        style: {
          fontSize: '2.2rem'
        }
      }, "\uD83D\uDCA5"), React.createElement("div", {
        style: {
          fontWeight: 700,
          margin: '12px 0 6px',
          fontSize: '1.05rem'
        }
      }, "Esta tela encontrou um erro"), React.createElement("div", {
        style: {
          color: 'var(--ink-3)',
          fontSize: 12,
          marginBottom: 18,
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      }, String(this.state.err && this.state.err.message || this.state.err)), React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          justifyContent: 'center'
        }
      }, React.createElement("button", {
        className: "btn btn-primary",
        style: {
          padding: '10px 22px'
        },
        onClick: () => {
          this.setState({
            err: null
          });
          this.props.goHome && this.props.goHome();
        }
      }, "\u2190 Voltar pra Home"), React.createElement("button", {
        className: "btn-ghost",
        onClick: () => this.setState({
          err: null
        })
      }, "Tentar de novo")));
    }
    return this.props.children;
  }
}
function AppRoot() {
  const [authState, setAuthState] = React.useState('loading');
  const [user, setUser] = React.useState(null);
  const [needsOnboarding, setNeedsOnboarding] = React.useState(false);
  React.useEffect(() => {
    if (window.OrbitaFirebase) window.OrbitaFirebase.init();
    const skipped = localStorage.getItem('orbita_skipLogin');
    function checkOnboarding() {
      const d = JSON.parse(localStorage.getItem('meuPainel_v4') || '{}');
      const hasData = d.tasks && d.tasks.length > 0 || d.habits && d.habits.length > 0;
      if (hasData && (!d._profile || !d._profile.onboardingDone)) {
        d._profile = {
          ...(d._profile || {}),
          onboardingDone: true,
          name: d._profile?.name || 'Stephano'
        };
        localStorage.setItem('meuPainel_v4', JSON.stringify(d));
        return false;
      }
      return !d._profile || !d._profile.onboardingDone;
    }
    function onAuth(e) {
      if (e.detail) {
        setUser(e.detail);
        function onDataPulled() {
          clearTimeout(fallback);
          setNeedsOnboarding(checkOnboarding());
          setAuthState('logged-in');
        }
        const fallback = setTimeout(() => {
          if (checkOnboarding()) setNeedsOnboarding(true);
          setAuthState('logged-in');
        }, 15000);
        window.addEventListener('orbita:dataPulled', onDataPulled);
        const local = JSON.parse(localStorage.getItem('meuPainel_v4') || '{}');
        if (local.tasks && local.tasks.length > 0) {
          clearTimeout(fallback);
          if (checkOnboarding()) setNeedsOnboarding(true);
          setAuthState('logged-in');
        }
      } else if (skipped) {
        if (checkOnboarding()) setNeedsOnboarding(true);
        setAuthState('skipped');
      } else {
        setAuthState('logged-out');
      }
    }
    function onSkip() {
      localStorage.setItem('orbita_skipLogin', '1');
      if (checkOnboarding()) setNeedsOnboarding(true);
      setAuthState('skipped');
    }
    window.addEventListener('orbita:authChanged', onAuth);
    window.addEventListener('orbita:skipLogin', onSkip);
    setTimeout(() => {
      setAuthState(prev => {
        if (prev === 'loading') return skipped ? 'skipped' : 'logged-out';
        return prev;
      });
    }, 2000);
    return () => {
      window.removeEventListener('orbita:authChanged', onAuth);
      window.removeEventListener('orbita:skipLogin', onSkip);
    };
  }, []);
  function handleOnboardingComplete(profile) {
    const d = JSON.parse(localStorage.getItem('meuPainel_v4') || JSON.stringify(Orbita.defaultData()));
    d._profile = profile;
    if (!d.tasks) Object.assign(d, Orbita.defaultData());
    localStorage.setItem('meuPainel_v4', JSON.stringify(d));
    setNeedsOnboarding(false);
    window.dispatchEvent(new CustomEvent('orbita:dataPulled', {
      detail: d
    }));
  }
  if (authState === 'loading') {
    return React.createElement("div", {
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, React.createElement("div", {
      style: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, React.createElement(OrbLogo, {
      size: 40
    }), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        marginTop: 12
      }
    }, "Carregando...")));
  }
  if (authState === 'logged-out') {
    return React.createElement(LandingPage, null);
  }
  if (needsOnboarding) {
    return React.createElement(Onboarding, {
      onComplete: handleOnboardingComplete
    });
  }
  return React.createElement(App, null);
}
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(React.createElement(AppRoot, null));