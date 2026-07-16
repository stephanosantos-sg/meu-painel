function SettingsModal({
  onClose
}) {
  const {
    data,
    commit
  } = useData();
  const [tab, setTab] = React.useState('ias');
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
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Conex\xF5es e integra\xE7\xF5es"), React.createElement("h2", null, "Configura\xE7\xF5es")), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: '0 20px',
      borderBottom: '1px solid var(--line)',
      flexWrap: 'wrap'
    }
  }, [{
    v: 'ias',
    l: '🤖 IAs'
  }, {
    v: 'dados',
    l: '💾 Dados'
  }, {
    v: 'notif',
    l: '🔔 Notificações'
  }, {
    v: 'imperium',
    l: '⚔ Imperium'
  }, {
    v: 'calendar',
    l: '📅 Calendar'
  }, {
    v: 'asana',
    l: '✓ Asana'
  }].map(t => React.createElement("button", {
    key: t.v,
    className: `tab-btn ${tab === t.v ? 'active' : ''}`,
    onClick: () => setTab(t.v)
  }, t.l))), React.createElement("div", {
    className: "modal-body",
    style: {
      overflowY: 'auto',
      flex: 1
    }
  }, tab === 'ias' && React.createElement(SettingsIAs, {
    data: data,
    commit: commit
  }), tab === 'dados' && React.createElement(SettingsDados, {
    data: data,
    commit: commit
  }), tab === 'notif' && React.createElement(SettingsNotif, {
    data: data,
    commit: commit
  }), tab === 'imperium' && React.createElement(SettingsImperium, {
    data: data,
    commit: commit
  }), tab === 'calendar' && React.createElement(SettingsCalendar, null), tab === 'asana' && React.createElement(SettingsAsana, {
    data: data,
    commit: commit
  }))));
}
function SettingsDados({
  data,
  commit
}) {
  const [backups, setBackups] = React.useState(() => Orbita.loadBackups());
  const [status, setStatus] = React.useState('');
  const fileRef = React.useRef();
  function refresh() {
    setBackups(Orbita.loadBackups());
  }
  function doExport() {
    Orbita.exportData();
    setStatus('✓ Backup baixado');
    setTimeout(() => setStatus(''), 3000);
  }
  function onPickFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const restored = Orbita.importData(reader.result);
        window.dispatchEvent(new CustomEvent('orbita:dataPulled', {
          detail: restored
        }));
        setStatus('✓ Dados importados — recarregando...');
        setTimeout(() => window.location.reload(), 900);
      } catch (err) {
        setStatus('✕ ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }
  function doRestore(ts) {
    if (!confirm('Restaurar este backup? O estado atual será salvo como backup antes.')) return;
    const current = Orbita.loadData();
    if (current) Orbita.pushLocalBackup(current);
    const restored = Orbita.restoreBackup(ts);
    if (restored) {
      window.dispatchEvent(new CustomEvent('orbita:dataPulled', {
        detail: restored
      }));
      setStatus('✓ Backup restaurado — recarregando...');
      setTimeout(() => window.location.reload(), 900);
    } else {
      setStatus('✕ Backup não encontrado');
    }
  }
  function fmtWhen(ts) {
    const d = new Date(ts);
    const diff = Date.now() - ts;
    const h = Math.floor(diff / 3600000);
    const rel = h < 1 ? 'agora há pouco' : h < 24 ? `há ${h}h` : `há ${Math.floor(h / 24)}d`;
    return `${d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })} · ${rel}`;
  }
  const cell = {
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid var(--line)',
    background: 'rgba(255,255,255,0.02)'
  };
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: cell
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Backup manual"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginBottom: 12
    }
  }, "Baixa um arquivo .json com TUDO. Guarde num lugar seguro. Importar substitui os dados atuais (o estado de agora vira um backup antes)."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 16px',
      fontSize: 12
    },
    onClick: doExport
  }, "\u2B07 Exportar backup"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => fileRef.current && fileRef.current.click()
  }, "\u2B06 Importar backup"), React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "application/json,.json",
    style: {
      display: 'none'
    },
    onChange: onPickFile
  })), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 10
    }
  }, "\u2139\uFE0F Um backup autom\xE1tico \xE9 baixado 1\xD7/semana (domingos) enquanto voc\xEA usa o app.")), React.createElement("div", {
    style: cell
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "Backups autom\xE1ticos locais"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: refresh,
    style: {
      fontSize: 10
    }
  }, "\u21BB")), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginBottom: 12
    }
  }, "Snapshots dos \xFAltimos ", backups.length ? backups.length : 8, " pontos (m\xE1x 8), guardados neste navegador. Rede de seguran\xE7a contra sync ruim."), backups.length === 0 && React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, "Nenhum backup ainda \u2014 aparecem conforme voc\xEA usa o app."), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, backups.map(b => React.createElement("div", {
    key: b.ts,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 8,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--line)'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12
    }
  }, fmtWhen(b.ts)), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, b.counts ? `${b.counts.tasks} tarefas · ${b.counts.habits} hábitos · ${b.counts.goals} metas · ${b.counts.tx} lançamentos` : '')), React.createElement("button", {
    className: "btn-ghost small",
    style: {
      fontSize: 11
    },
    onClick: () => doRestore(b.ts)
  }, "Restaurar"))))), status && React.createElement("div", {
    style: {
      fontSize: 12,
      color: status.startsWith('✕') ? '#ff5555' : '#3ccf91'
    }
  }, status));
}
function SettingsNotif({
  data,
  commit
}) {
  const settings = data._settings || {};
  const notif = settings.notif || {};
  const [perm, setPerm] = React.useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');
  const [status, setStatus] = React.useState('');
  function setFlag(key, val) {
    commit(D => {
      if (!D._settings) D._settings = {};
      if (!D._settings.notif) D._settings.notif = {};
      D._settings.notif[key] = val;
    });
  }
  async function requestPerm() {
    if (typeof Notification === 'undefined') {
      setStatus('Este navegador não suporta notificações');
      return;
    }
    const p = await Notification.requestPermission();
    setPerm(p);
    if (p === 'granted') {
      setFlag('enabled', true);
      if (window.OrbitaNotify) window.OrbitaNotify.notify('Imperium', {
        body: 'Notificações ativadas ✓'
      });
      setStatus('✓ Ativado');
    } else {
      setStatus('Permissão negada — habilite nas configurações do navegador');
    }
  }
  const row = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--line)'
  };
  const Toggle = ({
    on,
    onClick
  }) => React.createElement("button", {
    onClick: onClick,
    style: {
      width: 42,
      height: 24,
      borderRadius: 12,
      border: 'none',
      cursor: 'pointer',
      background: on ? 'linear-gradient(135deg, #b066ff, #5b8dff)' : 'rgba(255,255,255,0.12)',
      position: 'relative',
      transition: 'background .2s'
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 21 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left .2s'
    }
  }));
  const cell = {
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid var(--line)',
    background: 'rgba(255,255,255,0.02)'
  };
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: cell
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Permiss\xE3o"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginBottom: 12
    }
  }, "Estado: ", perm === 'granted' ? '✓ concedida' : perm === 'denied' ? '✕ negada' : perm === 'unsupported' ? 'não suportado' : 'não solicitada'), perm !== 'granted' && React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 16px',
      fontSize: 12
    },
    onClick: requestPerm,
    disabled: perm === 'unsupported'
  }, "\uD83D\uDD14 Ativar notifica\xE7\xF5es"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 10
    }
  }, "\u2139\uFE0F Lembretes disparam enquanto o app est\xE1 aberto (numa aba ou instalado). Ao abrir o app, voc\xEA v\xEA o que perdeu.")), perm === 'granted' && React.createElement("div", {
    style: cell
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 8
    }
  }, "O que notificar"), React.createElement("div", {
    style: row
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Lembrete de h\xE1bitos"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "No hor\xE1rio do h\xE1bito, se ainda n\xE3o foi feito")), React.createElement(Toggle, {
    on: notif.habits !== false,
    onClick: () => setFlag('habits', notif.habits === false)
  })), React.createElement("div", {
    style: row
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Tarefas vencendo"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "Tarefa pontual com data de hoje ainda pendente")), React.createElement(Toggle, {
    on: notif.tasks !== false,
    onClick: () => setFlag('tasks', notif.tasks === false)
  })), React.createElement("div", {
    style: {
      ...row,
      borderBottom: 'none'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Or\xE7amento estourado"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "Quando uma categoria passa da aloca\xE7\xE3o do m\xEAs")), React.createElement(Toggle, {
    on: notif.budget !== false,
    onClick: () => setFlag('budget', notif.budget === false)
  }))), status && React.createElement("div", {
    style: {
      fontSize: 12,
      color: status.startsWith('✕') ? '#ff5555' : '#3ccf91'
    }
  }, status));
}
function SettingsIAs({
  data,
  commit
}) {
  const settings = data._settings || {};
  const aiKeys = settings.aiKeys || {};
  const [openaiKey, setOpenaiKey] = React.useState(aiKeys.openai || data._diet?.openaiKey || '');
  const [anthropicKey, setAnthropicKey] = React.useState(aiKeys.anthropic || '');
  const [openaiStatus, setOpenaiStatus] = React.useState('');
  const [anthropicStatus, setAnthropicStatus] = React.useState('');
  const [testing, setTesting] = React.useState(null);
  function save() {
    commit(D => {
      if (!D._settings) D._settings = {};
      if (!D._settings.aiKeys) D._settings.aiKeys = {};
      D._settings.aiKeys.openai = openaiKey.trim() || null;
      D._settings.aiKeys.anthropic = anthropicKey.trim() || null;
      if (!D._diet) D._diet = {};
      D._diet.openaiKey = openaiKey.trim() || null;
    });
    setOpenaiStatus('✓ Salvo');
    setAnthropicStatus('✓ Salvo');
    setTimeout(() => {
      setOpenaiStatus('');
      setAnthropicStatus('');
    }, 2000);
  }
  async function testOpenAI() {
    if (!openaiKey.trim()) return;
    setTesting('openai');
    setOpenaiStatus('⟳ testando...');
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openaiKey.trim()}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const json = await res.json();
      const count = (json.data || []).length;
      setOpenaiStatus(`✓ Conectado · ${count} modelos disponíveis`);
    } catch (e) {
      setOpenaiStatus('✕ ' + e.message);
    } finally {
      setTesting(null);
    }
  }
  async function testAnthropic() {
    if (!anthropicKey.trim()) return;
    setTesting('anthropic');
    setAnthropicStatus('⟳ testando...');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [{
            role: 'user',
            content: 'ping'
          }]
        })
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      setAnthropicStatus('✓ Conectado · Claude responde');
    } catch (e) {
      setAnthropicStatus('✕ ' + e.message);
    } finally {
      setTesting(null);
    }
  }
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      padding: '0 0 8px'
    }
  }, "Suas chaves ficam salvas localmente neste navegador. Use para Coach \uD83E\uDD57, Imperium IA \uD83C\uDF0C e Assistente Financeiro \uD83D\uDCB0."), React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
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
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#10a37f22',
      border: '1px solid #10a37f44',
      display: 'grid',
      placeItems: 'center',
      fontSize: 16
    }
  }, "\uD83E\uDD16"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, "OpenAI"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "gpt-4o-mini \xB7 platform.openai.com/api-keys")), openaiKey && React.createElement("span", {
    className: "chip",
    style: {
      background: 'rgba(60,207,145,0.1)',
      color: '#3ccf91',
      borderColor: 'rgba(60,207,145,0.3)'
    }
  }, "conectado")), React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 10
    }
  }, React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "sk-...",
    value: openaiKey,
    onChange: e => setOpenaiKey(e.target.value)
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: testOpenAI,
    disabled: testing === 'openai' || !openaiKey.trim()
  }, testing === 'openai' ? '⟳' : '⚡', " Testar"), openaiStatus && React.createElement("span", {
    style: {
      fontSize: 11,
      color: openaiStatus.startsWith('✕') ? '#ff5555' : openaiStatus.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)'
    }
  }, openaiStatus))), React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
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
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#cc785c22',
      border: '1px solid #cc785c44',
      display: 'grid',
      placeItems: 'center',
      fontSize: 16
    }
  }, "\u2726"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, "Anthropic Claude"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "claude-haiku-4-5 \xB7 console.anthropic.com")), anthropicKey && React.createElement("span", {
    className: "chip",
    style: {
      background: 'rgba(60,207,145,0.1)',
      color: '#3ccf91',
      borderColor: 'rgba(60,207,145,0.3)'
    }
  }, "conectado")), React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 10
    }
  }, React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "sk-ant-...",
    value: anthropicKey,
    onChange: e => setAnthropicKey(e.target.value)
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: testAnthropic,
    disabled: testing === 'anthropic' || !anthropicKey.trim()
  }, testing === 'anthropic' ? '⟳' : '⚡', " Testar"), anthropicStatus && React.createElement("span", {
    style: {
      fontSize: 11,
      color: anthropicStatus.startsWith('✕') ? '#ff5555' : anthropicStatus.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)'
    }
  }, anthropicStatus))), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '12px 24px',
      fontSize: 13,
      alignSelf: 'flex-start'
    },
    onClick: save
  }, "Salvar chaves"));
}
function SettingsCalendar() {
  const {
    calendarConnected
  } = useData();
  const [user, setUser] = React.useState(window.OrbitaFirebase ? window.OrbitaFirebase.getCurrentUser() : null);
  React.useEffect(() => {
    const onA = e => setUser(e.detail);
    window.addEventListener('orbita:authChanged', onA);
    return () => window.removeEventListener('orbita:authChanged', onA);
  }, []);
  function handleConnect() {
    if (calendarConnected) {
      if (confirm('Desconectar Google Calendar?')) window.OrbitaFirebase.disconnectGoogleCalendar();
    } else if (user) {
      window.OrbitaFirebase.connectGoogleCalendar();
    } else {
      window.OrbitaFirebase.signInWithGoogle(true);
    }
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
      padding: 18
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#4285f422',
      border: '1px solid #4285f444',
      display: 'grid',
      placeItems: 'center',
      fontSize: 16
    }
  }, "\uD83D\uDCC5"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, "Google Calendar"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "eventos aparecem na Home e Calend\xE1rio")), calendarConnected && React.createElement("span", {
    className: "chip",
    style: {
      background: 'rgba(60,207,145,0.1)',
      color: '#3ccf91',
      borderColor: 'rgba(60,207,145,0.3)'
    }
  }, React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#3ccf91'
    }
  }), " conectado")), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-2)',
      lineHeight: 1.5,
      marginBottom: 14
    }
  }, calendarConnected ? 'Os eventos do seu Google Calendar são puxados automaticamente e aparecem na Home, Calendário e Histórico.' : 'Conecte para ver seus eventos do Google Calendar lado a lado com tarefas e hábitos.'), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 22px',
      fontSize: 13
    },
    onClick: handleConnect
  }, calendarConnected ? '⏻ Desconectar' : '⚡ Conectar Google Calendar'), !user && !calendarConnected && React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 10
    }
  }, "\u2139 Voc\xEA far\xE1 login com Google ao conectar.")));
}
function SettingsAsana({
  data,
  commit
}) {
  const settings = data._settings || {};
  const asana = settings.asana || {};
  const [pat, setPat] = React.useState(asana.pat || '');
  const [workspaceId, setWorkspaceId] = React.useState(asana.workspaceId || '');
  const [workspaces, setWorkspaces] = React.useState(asana.workspaces || []);
  const [me, setMe] = React.useState(asana.me || null);
  const [status, setStatus] = React.useState('');
  const [testing, setTesting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  async function testConnection() {
    if (!pat.trim()) return;
    setTesting(true);
    setStatus('⟳ conectando...');
    try {
      const meRes = await fetch('https://app.asana.com/api/1.0/users/me', {
        headers: {
          'Authorization': `Bearer ${pat.trim()}`
        }
      });
      if (!meRes.ok) throw new Error(`Auth falhou (HTTP ${meRes.status})`);
      const meJson = await meRes.json();
      const myUser = {
        gid: meJson.data.gid,
        name: meJson.data.name,
        email: meJson.data.email
      };
      setMe(myUser);
      const wsRes = await fetch('https://app.asana.com/api/1.0/workspaces', {
        headers: {
          'Authorization': `Bearer ${pat.trim()}`
        }
      });
      const wsJson = await wsRes.json();
      const ws = (wsJson.data || []).map(w => ({
        gid: w.gid,
        name: w.name
      }));
      setWorkspaces(ws);
      if (!workspaceId && ws.length > 0) setWorkspaceId(ws[0].gid);
      commit(D => {
        if (!D._settings) D._settings = {};
        if (!D._settings.asana) D._settings.asana = {};
        D._settings.asana.pat = pat.trim();
        D._settings.asana.me = myUser;
        D._settings.asana.workspaces = ws;
        if (!D._settings.asana.workspaceId && ws.length > 0) D._settings.asana.workspaceId = ws[0].gid;
      });
      setStatus(`✓ Conectado como ${myUser.name} · ${ws.length} workspace${ws.length > 1 ? 's' : ''}`);
    } catch (e) {
      setStatus('✕ ' + e.message);
    } finally {
      setTesting(false);
    }
  }
  async function importTasks() {
    if (!pat.trim() || !workspaceId) return;
    setImporting(true);
    setStatus('⟳ buscando tarefas...');
    try {
      const url = `https://app.asana.com/api/1.0/tasks?assignee=me&workspace=${workspaceId}&completed_since=now&opt_fields=name,notes,completed,due_on,projects.name,permalink_url,gid`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${pat.trim()}`
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const asanaTasks = (json.data || []).filter(t => !t.completed);
      let added = 0,
        updated = 0;
      commit(D => {
        if (!D.tasks) D.tasks = [];
        if (!D.categories) D.categories = [];
        let asanaCat = D.categories.find(c => c.name === 'Asana');
        if (!asanaCat) {
          asanaCat = {
            id: Orbita.uid(),
            name: 'Asana',
            icon: '✓',
            color: 'orange'
          };
          D.categories.push(asanaCat);
        }
        asanaTasks.forEach(t => {
          const existing = D.tasks.find(x => x.external && x.external.source === 'asana' && x.external.gid === t.gid);
          const project = t.projects && t.projects[0] ? t.projects[0].name : null;
          if (existing) {
            existing.text = t.name;
            existing.desc = t.notes || project || '';
            existing.date = t.due_on || existing.date || null;
            updated++;
          } else {
            D.tasks.push({
              id: Orbita.uid(),
              text: t.name,
              desc: t.notes || project || '',
              freq: 'pontual',
              prio: 2,
              done: false,
              doneSlots: {},
              date: t.due_on || null,
              time: null,
              cat: asanaCat.id,
              icon: '✓',
              external: {
                source: 'asana',
                gid: t.gid,
                url: t.permalink_url,
                project
              }
            });
            added++;
          }
        });
        if (!D._settings) D._settings = {};
        if (!D._settings.asana) D._settings.asana = {};
        D._settings.asana.lastSync = Date.now();
      });
      setStatus(`✓ ${added} novas · ${updated} atualizadas`);
    } catch (e) {
      setStatus('✕ ' + e.message);
    } finally {
      setImporting(false);
    }
  }
  function saveWorkspace(gid) {
    setWorkspaceId(gid);
    commit(D => {
      if (!D._settings) D._settings = {};
      if (!D._settings.asana) D._settings.asana = {};
      D._settings.asana.workspaceId = gid;
    });
  }
  function disconnect() {
    if (!confirm('Desconectar Asana? As tarefas já importadas continuam.')) return;
    setPat('');
    setWorkspaceId('');
    setWorkspaces([]);
    setMe(null);
    setStatus('');
    commit(D => {
      if (D._settings) D._settings.asana = {};
    });
  }
  const lastSync = asana.lastSync ? new Date(asana.lastSync) : null;
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#f06a6a22',
      border: '1px solid #f06a6a44',
      display: 'grid',
      placeItems: 'center',
      fontSize: 16,
      color: '#f06a6a'
    }
  }, "\u2713"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, "Asana"), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "tarefas do trabalho \xB7 personal access token")), me && React.createElement("span", {
    className: "chip",
    style: {
      background: 'rgba(60,207,145,0.1)',
      color: '#3ccf91',
      borderColor: 'rgba(60,207,145,0.3)'
    }
  }, me.name)), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-2)',
      lineHeight: 1.6,
      marginBottom: 10,
      padding: 10,
      background: 'rgba(255,46,136,0.04)',
      border: '1px solid rgba(255,46,136,0.12)',
      borderRadius: 8
    }
  }, React.createElement("strong", null, "Como pegar o token:"), React.createElement("br", null), "1. V\xE1 em ", React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10
    }
  }, "app.asana.com/0/my-apps"), React.createElement("br", null), "2. Clique em ", React.createElement("strong", null, "+ Create new token"), " \xB7 d\xEA um nome (ex: Imperium)", React.createElement("br", null), "3. Copie o token (come\xE7a com ", React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10
    }
  }, "1/"), " ou ", React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10
    }
  }, "2/"), ") e cole abaixo"), React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 10
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Personal Access Token"), React.createElement("input", {
    className: "form-input",
    type: "password",
    placeholder: "1/...",
    value: pat,
    onChange: e => setPat(e.target.value)
  })), workspaces.length > 0 && React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 10
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Workspace"), React.createElement("select", {
    className: "form-input",
    value: workspaceId,
    onChange: e => saveWorkspace(e.target.value)
  }, workspaces.map(w => React.createElement("option", {
    key: w.gid,
    value: w.gid
  }, w.name)))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, React.createElement("button", {
    className: "btn-ghost small",
    onClick: testConnection,
    disabled: testing || !pat.trim()
  }, testing ? '⟳' : '⚡', " Testar conex\xE3o"), me && workspaceId && React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 16px',
      fontSize: 12
    },
    onClick: importTasks,
    disabled: importing
  }, importing ? '⟳ importando...' : '⬇ Importar minhas tarefas'), me && React.createElement("button", {
    className: "btn-ghost small",
    onClick: disconnect,
    style: {
      color: '#ff5555',
      marginLeft: 'auto'
    }
  }, "Desconectar")), status && React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 11,
      color: status.startsWith('✕') ? '#ff5555' : status.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)'
    }
  }, status), lastSync && !status && React.createElement("div", {
    className: "mono",
    style: {
      marginTop: 12,
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "\xFAltima sincroniza\xE7\xE3o: ", lastSync.toLocaleString('pt-BR')), me && React.createElement("div", {
    style: {
      marginTop: 14,
      padding: 10,
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
      fontSize: 11,
      color: 'var(--ink-2)'
    }
  }, "\u2139 Importa tarefas ", React.createElement("strong", null, "incompletas"), " atribu\xEDdas a voc\xEA do workspace selecionado, criando-as com a categoria ", React.createElement("strong", null, "Asana"), ". Tarefas j\xE1 importadas s\xE3o atualizadas (n\xE3o duplica).")));
}
function SettingsImperium({
  data,
  commit
}) {
  const imp = data._imperium || (window.defaultImperiumState ? window.defaultImperiumState() : {
    config: {}
  });
  const cfg = imp.config || {};
  const [workerUrl, setWorkerUrl] = React.useState(cfg.workerUrl || 'http://127.0.0.1:5181');
  const [workerToken, setWorkerToken] = React.useState(cfg.workerToken || '');
  const [paused, setPaused] = React.useState(!!cfg.paused);
  const [status, setStatus] = React.useState('');
  const [testing, setTesting] = React.useState(false);
  function save() {
    commit(D => {
      if (!D._imperium && window.defaultImperiumState) D._imperium = window.defaultImperiumState();
      if (!D._imperium.config) D._imperium.config = {};
      D._imperium.config.workerUrl = workerUrl.trim();
      D._imperium.config.workerToken = workerToken.trim();
      D._imperium.config.paused = paused;
    });
    setStatus('✓ Salvo');
    setTimeout(() => setStatus(''), 2000);
  }
  async function testWorker() {
    setTesting(true);
    setStatus('');
    try {
      const r = await fetch(workerUrl.trim() + '/health', {
        headers: workerToken ? {
          Authorization: 'Bearer ' + workerToken.trim()
        } : {}
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      setStatus(`✓ Worker online · ${j.agents || 0} agentes registrados`);
    } catch (e) {
      setStatus('✕ Worker indisponível · ' + e.message);
    } finally {
      setTesting(false);
    }
  }
  const agents = imp.agents || {};
  const enabled = Object.values(agents).filter(a => a && a.enabled).length;
  const tasks = (imp.tasks || []).length;
  const review = (imp.tasks || []).filter(t => t.status === 'needs-review').length;
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      padding: '0 0 8px',
      lineHeight: 1.5
    }
  }, "O Imperium roda em um worker Node.js separado, com o Claude Agent SDK conectado ao SingleGrain Gateway. Configure aqui a URL local do worker e o token compartilhado. Veja ", React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10
    }
  }, "~/Downloads/orbita-imperium/README.md"), " para subir."), React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
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
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#C8102E22',
      border: '1px solid #D4AF3744',
      display: 'grid',
      placeItems: 'center',
      fontSize: 16
    }
  }, "\u2694"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Worker local"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "LaunchAgent em ", React.createElement("span", {
    className: "mono"
  }, "com.stephano.orbita-imperium")))), React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 10
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "URL do Worker"), React.createElement("input", {
    className: "form-input",
    value: workerUrl,
    onChange: e => setWorkerUrl(e.target.value),
    placeholder: "http://127.0.0.1:5181"
  })), React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 10
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Worker Token (Bearer)"), React.createElement("input", {
    className: "form-input",
    type: "password",
    value: workerToken,
    onChange: e => setWorkerToken(e.target.value),
    placeholder: "Token compartilhado (gerado no .env do worker)"
  })), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '12px 0'
    }
  }, React.createElement("input", {
    type: "checkbox",
    id: "imp-paused",
    checked: paused,
    onChange: e => setPaused(e.target.checked),
    style: {
      width: 16,
      height: 16
    }
  }), React.createElement("label", {
    htmlFor: "imp-paused",
    style: {
      fontSize: 12,
      color: 'var(--ink-2)',
      cursor: 'pointer'
    }
  }, "\u23F8 Pausar todos os agentes (Vacation mode)")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, React.createElement("button", {
    onClick: save,
    className: "btn btn-primary",
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  }, "Salvar"), React.createElement("button", {
    onClick: testWorker,
    disabled: testing,
    className: "btn",
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  }, testing ? 'Testando...' : 'Testar conexão')), status && React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 12,
      color: status.startsWith('✓') ? '#3ccf91' : '#ff7a5a'
    }
  }, status)), React.createElement("div", {
    className: "panel",
    style: {
      padding: 18
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Estado atual"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: '#D4AF37'
    }
  }, enabled, "/10"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "Agentes ativos")), React.createElement("div", null, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 22,
      fontWeight: 700
    }
  }, tasks), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "Tarefas totais")), React.createElement("div", null, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: review > 0 ? '#D4AF37' : 'var(--ink-2)'
    }
  }, review), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "Para revis\xE3o")))), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-4)',
      padding: '0 4px',
      lineHeight: 1.5
    }
  }, React.createElement("strong", null, "Seguran\xE7a"), " \xB7 O agente Caesar (Executor) nunca aplica mudan\xE7as em plataformas de m\xEDdia sem voc\xEA aprovar manualmente cada tarefa. Tarefas precisam passar por: especialista \u2192 Diocletian (revisor) \u2192 sua aprova\xE7\xE3o \u2192 confirma\xE7\xE3o dupla com slug do cliente."));
}
window.SettingsModal = SettingsModal;