/* Orbita v2 — App root */

function ImportExportModal({ onClose }) {
  const { data } = useData();
  const [pasteData, setPasteData] = React.useState('');
  const [tab, setTab] = React.useState('import');

  function doImportFile() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => { doImport(ev.target.result); };
      reader.readAsText(file);
    };
    input.click();
  }

  function doImportPaste() { doImport(pasteData); }

  function doImport(raw) {
    try {
      const imported = JSON.parse(raw);
      if (!imported.tasks && !imported.habits) { alert('Formato inválido — não encontrou tasks ou habits'); return; }
      if (!confirm(`Importar ${imported.tasks?.length || 0} tarefas, ${imported.habits?.length || 0} hábitos, ${imported.goals?.length || 0} objetivos? Isso vai SUBSTITUIR os dados atuais.`)) return;
      localStorage.setItem('meuPainel_v4', raw);
      alert('Dados importados! Recarregando...');
      location.reload();
    } catch(err) { alert('Erro ao importar: ' + err.message); }
  }

  function doExport() {
    const raw = localStorage.getItem('meuPainel_v4') || '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `orbita-backup-${Orbita.todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 92vw)' }}>
        <div className="modal-header">
          <h2>Importar / Exportar</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            <button className={`tab-btn ${tab === 'import' ? 'active' : ''}`} onClick={() => setTab('import')}>Importar</button>
            <button className={`tab-btn ${tab === 'export' ? 'active' : ''}`} onClick={() => setTab('export')}>Exportar</button>
          </div>

          {tab === 'import' && (
            <>
              <div className="panel" style={{ padding: 16, marginBottom: 12, background: 'rgba(255,46,136,0.06)', border: '1px solid rgba(255,46,136,0.15)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Como pegar dados da v1:</div>
                <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  1. Abra a v1 em <span className="mono" style={{ fontSize: 10 }}>stephanosantos-sg.github.io/meu-painel</span><br/>
                  2. Pressione <span className="mono" style={{ fontSize: 10 }}>⌘+⌥+J</span> (Console)<br/>
                  3. Cole e execute:<br/>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: 6, marginTop: 6, fontSize: 10, fontFamily: 'var(--font-mono)', wordBreak: 'break-all', cursor: 'pointer' }}
                  onClick={() => { navigator.clipboard.writeText("copy(localStorage.getItem('meuPainel_v4'))"); alert('Comando copiado!'); }}>
                  copy(localStorage.getItem('meuPainel_v4'))<br/>
                  <span style={{ color: 'var(--ink-3)' }}>← clique para copiar</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 6 }}>4. Cole abaixo ou salve como .json e use o botão de arquivo</div>
              </div>

              <div className="form-group">
                <label className="form-label">Colar dados JSON</label>
                <textarea className="form-input" placeholder='Cole o JSON aqui (começa com {"tasks":...)' value={pasteData}
                  onChange={e => setPasteData(e.target.value)} style={{ minHeight: 100, fontSize: 11, fontFamily: 'var(--font-mono)' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={doImportPaste} disabled={!pasteData.trim()}>Importar do texto</button>
                <button className="btn-ghost" onClick={doImportFile}>📁 Importar arquivo .json</button>
              </div>
            </>
          )}

          {tab === 'export' && (
            <>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}>
                Exporta todos os dados do Orbita (tarefas, hábitos, objetivos, mídia, XP, conquistas, categorias, notas, ideias, compras).
              </div>
              <div className="panel" style={{ padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                  <div><div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{data.tasks?.length || 0}</div><div style={{ fontSize: 10, color: 'var(--ink-3)' }}>tarefas</div></div>
                  <div><div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{data.habits?.length || 0}</div><div style={{ fontSize: 10, color: 'var(--ink-3)' }}>hábitos</div></div>
                  <div><div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{data.goals?.length || 0}</div><div style={{ fontSize: 10, color: 'var(--ink-3)' }}>objetivos</div></div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={doExport}>⬇ Baixar backup JSON</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickBar({ onPomo, onSync }) {
  const { data, commit } = useData();
  const [syncing, setSyncing] = React.useState(false);
  const syncUrl = localStorage.getItem('meuPainel_syncUrl');

  function handleSave() {
    Orbita.persistData(JSON.parse(JSON.stringify(data)));
    window._showQuickToast && window._showQuickToast('Salvo localmente');
  }

  function handleSync() {
    if (!syncUrl) {
      const url = prompt('Cole a URL do Google Apps Script para sync:');
      if (url) localStorage.setItem('meuPainel_syncUrl', url);
      else return;
    }
    setSyncing(true);
    Orbita.persistData(JSON.parse(JSON.stringify(data)));
    setTimeout(() => {
      setSyncing(false);
      window._showQuickToast && window._showQuickToast('Sincronizado');
    }, 2000);
  }

  function handleTemplates() {
    const templates = [
      { text: 'Reunião', icon: '🏢', freq: 'pontual', prio: 2 },
      { text: 'Exercício', icon: '🏋️', freq: 'diaria', prio: 2, days: [1,3,5] },
      { text: 'Ler 30 min', icon: '📖', freq: 'diaria', prio: 3 },
      { text: 'Revisar emails', icon: '📧', freq: 'diaria', prio: 3 },
      { text: 'Compras da semana', icon: '🛒', freq: 'semanal', prio: 3, days: [6] },
      { text: 'Limpeza da casa', icon: '🧹', freq: 'semanal', prio: 3, days: [0] },
    ];
    const choice = templates.map((t, i) => `${i+1}. ${t.icon} ${t.text}`).join('\n');
    const idx = parseInt(prompt(`Escolha um template:\n\n${choice}\n\nDigite o número:`)) - 1;
    if (idx >= 0 && idx < templates.length) {
      const t = templates[idx];
      commit(D => {
        D.tasks.push({
          id: Orbita.uid(), text: t.text, icon: t.icon, freq: t.freq, prio: t.prio,
          date: Orbita.todayStr(), time: null, done: false, doneSlots: {},
          subtasks: [], times: [], cat: null, days: t.days,
        });
      });
    }
  }

  return (
    <div style={{
      position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 50,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {[
        { icon: '▶', label: 'Pomodoro', onClick: onPomo },
        { icon: '☆', label: 'Templates', onClick: handleTemplates },
        { icon: '⇅', label: syncing ? 'Sync...' : 'Nuvem', onClick: handleSync },
        { icon: '⬇', label: 'Salvar', onClick: handleSave },
      ].map(btn => (
        <button key={btn.label} onClick={btn.onClick} title={btn.label} style={{
          width: 38, height: 38, display: 'grid', placeItems: 'center',
          background: 'rgba(14,14,20,0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)', borderRadius: 10,
          color: 'var(--ink-2)', fontSize: 15, cursor: 'pointer',
          transition: 'all 120ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--ink-2)'; }}>
          {btn.icon}
        </button>
      ))}
    </div>
  );
}

function App() {
  const [active, setActive] = React.useState('today');
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [showHabitModal, setShowHabitModal] = React.useState(false);
  const [showPomo, setShowPomo] = React.useState(false);
  const [showThemes, setShowThemes] = React.useState(false);
  const [showCategories, setShowCategories] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [editHabit, setEditHabit] = React.useState(null);

  function openNewTask() { setEditTask(null); setShowTaskModal(true); }
  function openNewHabit() { setEditHabit(null); setShowHabitModal(true); }

  React.useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) openNewTask();
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey) setShowPomo(true);
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) setShowThemes(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  window._openThemes = () => setShowThemes(true);
  window._openCategories = () => setShowCategories(true);
  window._openImport = () => setShowImport(true);

  const screens = {
    today: () => <ScreenToday onNewTask={openNewTask} />,
    habits: () => <ScreenHabits onNewHabit={openNewHabit} />,
    goals: () => <ScreenGoals />,
    lembretes: () => <ScreenLembretes onNewTask={openNewTask} />,
    profile: () => <ScreenProfile />,
    ideas: () => <ScreenIdeas />,
    books: () => <ScreenBooks />,
    media: () => <ScreenMedia />,
    shopping: () => <ScreenShopping />,
    notes: () => <ScreenNotes />,
    charts: () => <ScreenCharts />,
  };

  const Screen = screens[active] || screens.today;

  return (
    <DataProvider>
      <div className="app-shell">
        <Sidebar active={active} setActive={setActive} />
        <main className="workspace">
          <Screen />
        </main>
        <QuickBar onPomo={() => setShowPomo(true)} onSync={() => {}} />
        <CommandPalette setActive={setActive} setShowTaskModal={setShowTaskModal} setShowHabitModal={setShowHabitModal} />
        <ToastLayer />
        {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} editTask={editTask} />}
        {showHabitModal && <HabitModal onClose={() => setShowHabitModal(false)} editHabit={editHabit} />}
        {showPomo && <Pomodoro onClose={() => setShowPomo(false)} />}
        {showThemes && <ThemePicker onClose={() => setShowThemes(false)} />}
        {showCategories && <ScreenCategories onClose={() => setShowCategories(false)} />}
        {showImport && <ImportExportModal onClose={() => setShowImport(false)} />}
      </div>
    </DataProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
