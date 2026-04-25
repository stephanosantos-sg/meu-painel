/* Orbita v2 — Settings: IAs, Google Calendar, Asana */

function SettingsModal({ onClose }) {
  const { data, commit } = useData();
  const [tab, setTab] = React.useState('ias');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(640px, 95vw)', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Conexões e integrações</div>
            <h2>Configurações</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '0 20px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
          {[
            { v: 'ias', l: '🤖 IAs' },
            { v: 'calendar', l: '📅 Calendar' },
            { v: 'asana', l: '✓ Asana' },
          ].map(t => (
            <button key={t.v} className={`tab-btn ${tab === t.v ? 'active' : ''}`} onClick={() => setTab(t.v)}>{t.l}</button>
          ))}
        </div>
        <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
          {tab === 'ias' && <SettingsIAs data={data} commit={commit} />}
          {tab === 'calendar' && <SettingsCalendar />}
          {tab === 'asana' && <SettingsAsana data={data} commit={commit} />}
        </div>
      </div>
    </div>
  );
}

/* ── IAs ── */
function SettingsIAs({ data, commit }) {
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
      // Backward compat: keep _diet.openaiKey synced
      if (!D._diet) D._diet = {};
      D._diet.openaiKey = openaiKey.trim() || null;
    });
    setOpenaiStatus('✓ Salvo');
    setAnthropicStatus('✓ Salvo');
    setTimeout(() => { setOpenaiStatus(''); setAnthropicStatus(''); }, 2000);
  }

  async function testOpenAI() {
    if (!openaiKey.trim()) return;
    setTesting('openai'); setOpenaiStatus('⟳ testando...');
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${openaiKey.trim()}` },
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const json = await res.json();
      const count = (json.data || []).length;
      setOpenaiStatus(`✓ Conectado · ${count} modelos disponíveis`);
    } catch (e) { setOpenaiStatus('✕ ' + e.message); }
    finally { setTesting(null); }
  }

  async function testAnthropic() {
    if (!anthropicKey.trim()) return;
    setTesting('anthropic'); setAnthropicStatus('⟳ testando...');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'ping' }],
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      setAnthropicStatus('✓ Conectado · Claude responde');
    } catch (e) { setAnthropicStatus('✕ ' + e.message); }
    finally { setTesting(null); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', padding: '0 0 8px' }}>
        Suas chaves ficam salvas localmente neste navegador. Use para Coach 🥗, Orbita IA 🌌 e Assistente Financeiro 💰.
      </div>

      {/* OpenAI */}
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#10a37f22', border: '1px solid #10a37f44', display: 'grid', placeItems: 'center', fontSize: 16 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>OpenAI</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>gpt-4o-mini · platform.openai.com/api-keys</div>
          </div>
          {openaiKey && <span className="chip" style={{ background: 'rgba(60,207,145,0.1)', color: '#3ccf91', borderColor: 'rgba(60,207,145,0.3)' }}>conectado</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <input className="form-input" type="password" placeholder="sk-..." value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn-ghost small" onClick={testOpenAI} disabled={testing === 'openai' || !openaiKey.trim()}>
            {testing === 'openai' ? '⟳' : '⚡'} Testar
          </button>
          {openaiStatus && (
            <span style={{ fontSize: 11, color: openaiStatus.startsWith('✕') ? '#ff5555' : openaiStatus.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)' }}>{openaiStatus}</span>
          )}
        </div>
      </div>

      {/* Anthropic */}
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#cc785c22', border: '1px solid #cc785c44', display: 'grid', placeItems: 'center', fontSize: 16 }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Anthropic Claude</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>claude-haiku-4-5 · console.anthropic.com</div>
          </div>
          {anthropicKey && <span className="chip" style={{ background: 'rgba(60,207,145,0.1)', color: '#3ccf91', borderColor: 'rgba(60,207,145,0.3)' }}>conectado</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <input className="form-input" type="password" placeholder="sk-ant-..." value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn-ghost small" onClick={testAnthropic} disabled={testing === 'anthropic' || !anthropicKey.trim()}>
            {testing === 'anthropic' ? '⟳' : '⚡'} Testar
          </button>
          {anthropicStatus && (
            <span style={{ fontSize: 11, color: anthropicStatus.startsWith('✕') ? '#ff5555' : anthropicStatus.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)' }}>{anthropicStatus}</span>
          )}
        </div>
      </div>

      <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 13, alignSelf: 'flex-start' }} onClick={save}>Salvar chaves</button>
    </div>
  );
}

/* ── Google Calendar ── */
function SettingsCalendar() {
  const { calendarConnected } = useData();
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#4285f422', border: '1px solid #4285f444', display: 'grid', placeItems: 'center', fontSize: 16 }}>📅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Google Calendar</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>eventos aparecem na Home e Calendário</div>
          </div>
          {calendarConnected && (
            <span className="chip" style={{ background: 'rgba(60,207,145,0.1)', color: '#3ccf91', borderColor: 'rgba(60,207,145,0.3)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3ccf91' }} /> conectado
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 14 }}>
          {calendarConnected
            ? 'Os eventos do seu Google Calendar são puxados automaticamente e aparecem na Home, Calendário e Histórico.'
            : 'Conecte para ver seus eventos do Google Calendar lado a lado com tarefas e hábitos.'}
        </div>
        <button className="btn btn-primary" style={{ padding: '10px 22px', fontSize: 13 }} onClick={handleConnect}>
          {calendarConnected ? '⏻ Desconectar' : '⚡ Conectar Google Calendar'}
        </button>
        {!user && !calendarConnected && (
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 10 }}>
            ℹ Você fará login com Google ao conectar.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Asana ── */
function SettingsAsana({ data, commit }) {
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
    setTesting(true); setStatus('⟳ conectando...');
    try {
      const meRes = await fetch('https://app.asana.com/api/1.0/users/me', {
        headers: { 'Authorization': `Bearer ${pat.trim()}` },
      });
      if (!meRes.ok) throw new Error(`Auth falhou (HTTP ${meRes.status})`);
      const meJson = await meRes.json();
      const myUser = { gid: meJson.data.gid, name: meJson.data.name, email: meJson.data.email };
      setMe(myUser);

      const wsRes = await fetch('https://app.asana.com/api/1.0/workspaces', {
        headers: { 'Authorization': `Bearer ${pat.trim()}` },
      });
      const wsJson = await wsRes.json();
      const ws = (wsJson.data || []).map(w => ({ gid: w.gid, name: w.name }));
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
    } catch (e) { setStatus('✕ ' + e.message); }
    finally { setTesting(false); }
  }

  async function importTasks() {
    if (!pat.trim() || !workspaceId) return;
    setImporting(true); setStatus('⟳ buscando tarefas...');
    try {
      const url = `https://app.asana.com/api/1.0/tasks?assignee=me&workspace=${workspaceId}&completed_since=now&opt_fields=name,notes,completed,due_on,projects.name,permalink_url,gid`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${pat.trim()}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const asanaTasks = (json.data || []).filter(t => !t.completed);

      let added = 0, updated = 0;
      commit(D => {
        if (!D.tasks) D.tasks = [];
        if (!D.categories) D.categories = [];
        // Ensure Asana category exists
        let asanaCat = D.categories.find(c => c.name === 'Asana');
        if (!asanaCat) {
          asanaCat = { id: Orbita.uid(), name: 'Asana', icon: '✓', color: 'orange' };
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
              external: { source: 'asana', gid: t.gid, url: t.permalink_url, project },
            });
            added++;
          }
        });
        if (!D._settings) D._settings = {};
        if (!D._settings.asana) D._settings.asana = {};
        D._settings.asana.lastSync = Date.now();
      });
      setStatus(`✓ ${added} novas · ${updated} atualizadas`);
    } catch (e) { setStatus('✕ ' + e.message); }
    finally { setImporting(false); }
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
    setPat(''); setWorkspaceId(''); setWorkspaces([]); setMe(null); setStatus('');
    commit(D => { if (D._settings) D._settings.asana = {}; });
  }

  const lastSync = asana.lastSync ? new Date(asana.lastSync) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f06a6a22', border: '1px solid #f06a6a44', display: 'grid', placeItems: 'center', fontSize: 16, color: '#f06a6a' }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Asana</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>tarefas do trabalho · personal access token</div>
          </div>
          {me && (
            <span className="chip" style={{ background: 'rgba(60,207,145,0.1)', color: '#3ccf91', borderColor: 'rgba(60,207,145,0.3)' }}>
              {me.name}
            </span>
          )}
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 10, padding: 10, background: 'rgba(255,46,136,0.04)', border: '1px solid rgba(255,46,136,0.12)', borderRadius: 8 }}>
          <strong>Como pegar o token:</strong><br/>
          1. Vá em <span className="mono" style={{ fontSize: 10 }}>app.asana.com/0/my-apps</span><br/>
          2. Clique em <strong>+ Create new token</strong> · dê um nome (ex: Orbita)<br/>
          3. Copie o token (começa com <span className="mono" style={{ fontSize: 10 }}>1/</span> ou <span className="mono" style={{ fontSize: 10 }}>2/</span>) e cole abaixo
        </div>

        <div className="form-group" style={{ marginBottom: 10 }}>
          <label className="form-label">Personal Access Token</label>
          <input className="form-input" type="password" placeholder="1/..." value={pat} onChange={e => setPat(e.target.value)} />
        </div>

        {workspaces.length > 0 && (
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label">Workspace</label>
            <select className="form-input" value={workspaceId} onChange={e => saveWorkspace(e.target.value)}>
              {workspaces.map(w => <option key={w.gid} value={w.gid}>{w.name}</option>)}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn-ghost small" onClick={testConnection} disabled={testing || !pat.trim()}>
            {testing ? '⟳' : '⚡'} Testar conexão
          </button>
          {me && workspaceId && (
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 12 }} onClick={importTasks} disabled={importing}>
              {importing ? '⟳ importando...' : '⬇ Importar minhas tarefas'}
            </button>
          )}
          {me && (
            <button className="btn-ghost small" onClick={disconnect} style={{ color: '#ff5555', marginLeft: 'auto' }}>Desconectar</button>
          )}
        </div>

        {status && (
          <div style={{ marginTop: 12, fontSize: 11, color: status.startsWith('✕') ? '#ff5555' : status.startsWith('✓') ? '#3ccf91' : 'var(--ink-3)' }}>{status}</div>
        )}
        {lastSync && !status && (
          <div className="mono" style={{ marginTop: 12, fontSize: 10, color: 'var(--ink-3)' }}>
            última sincronização: {lastSync.toLocaleString('pt-BR')}
          </div>
        )}

        {me && (
          <div style={{ marginTop: 14, padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11, color: 'var(--ink-2)' }}>
            ℹ Importa tarefas <strong>incompletas</strong> atribuídas a você do workspace selecionado, criando-as com a categoria <strong>Asana</strong>. Tarefas já importadas são atualizadas (não duplica).
          </div>
        )}
      </div>
    </div>
  );
}

window.SettingsModal = SettingsModal;
