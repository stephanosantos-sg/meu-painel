/* Imperium — Legio screen: live agent dashboard, queue board, review gate */

const LEGIO_AGENTS = [
  { slug: 'augustus',     name: 'Augustus',        role: 'Task Scanner',         clientId: null,         order: 1,  defaultModel: 'claude-opus-4-7' },
  { slug: 'trajan',       name: 'Trajan',          role: 'TLC Specialist',       clientId: 'tlc',        order: 2,  defaultModel: 'claude-sonnet-4-6' },
  { slug: 'marcus',       name: 'Marcus Aurelius', role: 'MadCap Specialist',    clientId: 'madcap',     order: 3,  defaultModel: 'claude-sonnet-4-6' },
  { slug: 'hadrian',      name: 'Hadrian',         role: 'Hyperdrive Specialist',clientId: 'hyperdrive', order: 4,  defaultModel: 'claude-sonnet-4-6' },
  { slug: 'vespasian',    name: 'Vespasian',       role: 'UpKeep Specialist',    clientId: 'upkeep',     order: 5,  defaultModel: 'claude-sonnet-4-6' },
  { slug: 'lucius_verus', name: 'Lucius Verus',    role: 'LCI/RGI Specialist',   clientId: 'lci_rgi',    order: 6,  defaultModel: 'claude-sonnet-4-6' },
  { slug: 'diocletian',   name: 'Diocletian',      role: 'Reviewer',             clientId: null,         order: 7,  defaultModel: 'claude-opus-4-7' },
  { slug: 'caesar',       name: 'Caesar',          role: 'Executor',             clientId: null,         order: 8,  defaultModel: 'claude-opus-4-7' },
  { slug: 'tiberius',     name: 'Tiberius',        role: 'Auditor',              clientId: null,         order: 9,  defaultModel: 'claude-sonnet-4-6' },
  { slug: 'claudius',     name: 'Claudius',        role: 'Routine',              clientId: null,         order: 10, defaultModel: 'claude-haiku-4-5-20251001' },
];

const LEGIO_MODELS = [
  { id: 'claude-opus-4-7',           label: 'Opus 4.7',   tier: 'premium',  hint: 'mais capaz, mais caro' },
  { id: 'claude-sonnet-4-6',         label: 'Sonnet 4.6', tier: 'standard', hint: 'equilibrado' },
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5',  tier: 'fast',     hint: 'rápido, mais barato' },
];

const LEGIO_CLIENTS = {
  tlc:        { id: 'tlc',        name: 'Tax Lien Code', color: '#C8102E' },
  madcap:     { id: 'madcap',     name: 'MadCap',        color: '#D4AF37' },
  hyperdrive: { id: 'hyperdrive', name: 'Hyperdrive',    color: '#5b8dff' },
  upkeep:     { id: 'upkeep',     name: 'UpKeep',        color: '#3ccf91' },
  lci_rgi:    { id: 'lci_rgi',    name: 'LCI / RGI',     color: '#b066ff' },
};

const STATUS_COLUMNS = [
  { id: 'pending',      label: 'Pendente',   accent: '#a8a8bc' },
  { id: 'in-progress',  label: 'Executando', accent: '#5b8dff' },
  { id: 'needs-review', label: 'Revisão',    accent: '#D4AF37' },
  { id: 'approved',     label: 'Aprovada',   accent: '#3ccf91' },
  { id: 'executed',     label: 'Executada',  accent: '#9A7B1F' },
  { id: 'failed',       label: 'Falhou',     accent: '#ff5a3c' },
];

function defaultImperiumState() {
  const agents = {};
  LEGIO_AGENTS.forEach(a => {
    agents[a.slug] = {
      id: a.slug, name: a.name, role: a.role, clientId: a.clientId,
      status: 'offline', lastHeartbeat: 0, lastError: null, currentTaskId: null,
      model: a.defaultModel, systemPromptRef: `${a.slug}.md`,
      avatarKey: a.slug, enabled: a.slug === 'augustus',
    };
  });
  return {
    agents,
    tasks: [],
    clients: { ...LEGIO_CLIENTS },
    recentLogs: [],
    config: {
      workerUrl: 'http://127.0.0.1:5181',
      workerToken: '',
      autoApproveDiocletian: false,
      executorRequiresDoubleConfirm: true,
      paused: false,
      auditRotation: { mon: 'tlc', tue: 'madcap', wed: 'hyperdrive', thu: 'upkeep', fri: 'lci_rgi' },
    },
  };
}

function ensureImperiumState(data) {
  if (!data._imperium) return false;
  return true;
}

function agentStatusOf(agent) {
  if (!agent.enabled) return { code: 'disabled', color: '#3a3a4a', label: 'Desabilitado' };
  const now = Date.now();
  const age = now - (agent.lastHeartbeat || 0);
  if (agent.lastError && age > 60_000) return { code: 'error', color: '#ff5a3c', label: 'Erro' };
  if (age <= 60_000) return { code: 'online', color: '#3ccf91', label: 'Online' };
  if (age <= 5 * 60_000) return { code: 'stale', color: '#D4AF37', label: 'Stale' };
  return { code: 'offline', color: '#ff5a3c', label: 'Offline' };
}

function fmtAgo(ts) {
  if (!ts) return 'nunca';
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s atrás`;
  if (s < 3600) return `${Math.round(s/60)}min atrás`;
  if (s < 86400) return `${Math.round(s/3600)}h atrás`;
  return `${Math.round(s/86400)}d atrás`;
}

function EmperorAvatar({ slug, size = 64, status, onClick, label, sublabel, badge, activity }) {
  const svg = window.LegioAvatars ? window.LegioAvatars.getAvatarSVG(slug) : '';
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: onClick ? 'pointer' : 'default', minWidth: size + 24 }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: size, height: size, borderRadius: '50%', overflow: 'hidden',
            background: 'radial-gradient(circle, #1a0606, #08080c)',
            boxShadow: `0 0 0 2px ${status ? status.color : '#3a3a4a'}, 0 0 ${size * 0.4}px ${status ? status.color + '55' : 'transparent'}`,
            transition: 'all 200ms',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div style={{
          position: 'absolute', bottom: 2, right: 2,
          width: 12, height: 12, borderRadius: '50%',
          background: status ? status.color : '#3a3a4a',
          border: '2px solid #08080c',
        }} title={status ? status.label : ''}/>
        {badge ? (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, fontSize: 10, fontWeight: 700,
            background: '#C8102E', color: '#fff', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-mono)', boxShadow: '0 0 10px rgba(200,16,46,0.6)',
          }}>{badge}</div>
        ) : null}
      </div>
      {label ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-1)', lineHeight: 1.1 }}>{label}</div>
          {sublabel ? <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{sublabel}</div> : null}
        </div>
      ) : null}
      {activity ? (
        <div style={{
          fontSize: 9, fontFamily: 'var(--font-mono)', color: '#D4AF37',
          padding: '3px 8px', borderRadius: 999,
          background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
          maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }} title={activity}>
          {activity}
        </div>
      ) : null}
    </div>
  );
}

function TaskCard({ task, agent, client, onClick, onDragStart }) {
  const dotColor = STATUS_COLUMNS.find(c => c.id === task.status)?.accent || '#a8a8bc';
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        padding: 12, borderRadius: 10,
        background: 'rgba(212,175,55,0.04)',
        border: '1px solid rgba(212,175,55,0.16)',
        cursor: 'pointer',
        marginBottom: 8,
        transition: 'all 150ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.16)'; e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)', lineHeight: 1.35, flex: 1 }}>{task.title}</div>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 4 }}/>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, fontSize: 10, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
        {client ? <span style={{ padding: '2px 7px', borderRadius: 999, background: client.color + '22', color: client.color, fontWeight: 600 }}>{client.name}</span> : null}
        {agent ? <span style={{ padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.04)' }}>{agent.name}</span> : null}
        <span style={{ padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.04)' }}>{task.sourceType}</span>
        {task.priority === 1 ? <span style={{ padding: '2px 7px', borderRadius: 999, background: '#C8102E33', color: '#ff7a8a', fontWeight: 600 }}>Urgente</span> : null}
      </div>
      {task.outputSummary ? (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.4, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
          {task.outputSummary.slice(0, 140)}{task.outputSummary.length > 140 ? '…' : ''}
        </div>
      ) : null}
    </div>
  );
}

function ScreenLegio() {
  const { data, commit, toast } = useData();
  const [selectedAgent, setSelectedAgent] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [filterClient, setFilterClient] = React.useState('all');
  const [showNewTask, setShowNewTask] = React.useState(false);
  const [, force] = React.useReducer(x => x + 1, 0);

  // Initialize _imperium on first mount if missing
  React.useEffect(() => {
    if (!data._imperium) {
      commit(D => { D._imperium = defaultImperiumState(); });
    }
  }, []);

  // Re-render every 15s to refresh agent online/offline status from heartbeat age
  React.useEffect(() => {
    const t = setInterval(() => force(), 15_000);
    return () => clearInterval(t);
  }, []);

  // Subscribe to Firestore doc changes so worker heartbeats land in the UI in real time
  const dataRef = React.useRef(data);
  dataRef.current = data;
  React.useEffect(() => {
    if (!window.firebase) return;
    let unsub = null;
    function attach(user) {
      if (!user) return;
      try {
        const db = window.firebase.firestore();
        unsub = db.collection('users').doc(user.uid).onSnapshot(doc => {
          if (!doc.exists) return;
          const cloud = doc.data();
          const cloudImp = cloud?.data?._imperium;
          if (!cloudImp) return;
          // Always re-dispatch — React will reconcile and the diff is cheap.
          // Equality check (JSON.stringify) was unreliable due to undefined
          // values + key ordering differences between local + Firestore.
          const merged = { ...dataRef.current, _imperium: cloudImp };
          window.dispatchEvent(new CustomEvent('orbita:dataPulled', { detail: merged }));
        }, err => console.warn('imperium onSnapshot:', err.message));
      } catch (e) { console.warn('imperium subscribe failed:', e.message); }
    }
    const auth = window.firebase.auth();
    if (auth.currentUser) attach(auth.currentUser);
    else auth.onAuthStateChanged(attach);
    return () => { if (unsub) unsub(); };
  }, []);

  const imp = data._imperium || defaultImperiumState();
  const agents = imp.agents || {};
  const tasks = imp.tasks || [];

  const visibleTasks = filterClient === 'all'
    ? tasks
    : tasks.filter(t => t.clientId === filterClient);

  const tasksByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.id] = visibleTasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  const needsReview = tasksByStatus['needs-review'] || [];
  const reviewByAgent = {};
  LEGIO_AGENTS.forEach(a => {
    reviewByAgent[a.slug] = tasks.filter(t => t.status === 'needs-review' && t.assignedTo === a.slug).length;
  });

  // Health: agents whose status is offline or error and enabled
  const healthIssues = LEGIO_AGENTS
    .map(a => ({ ...a, agent: agents[a.slug] }))
    .filter(({ agent }) => agent && agent.enabled && agentStatusOf(agent).code !== 'online' && agentStatusOf(agent).code !== 'stale');

  function setTaskStatus(taskId, newStatus, extra = {}) {
    commit(D => {
      const t = (D._imperium.tasks || []).find(x => x.id === taskId);
      if (!t) return;
      t.status = newStatus;
      Object.assign(t, extra);
    });
  }

  function reassignTask(taskId, agentSlug) {
    commit(D => {
      const t = (D._imperium.tasks || []).find(x => x.id === taskId);
      if (!t) return;
      t.assignedTo = agentSlug;
      if (t.status === 'in-progress') t.status = 'pending';
    });
    toast(`↪ Reatribuído para ${LEGIO_AGENTS.find(a => a.slug === agentSlug)?.name || agentSlug}`);
  }

  function approveTask(taskId) {
    setTaskStatus(taskId, 'approved', { assignedTo: 'caesar', approvedAt: Date.now() });
    toast('✓ Aprovada · Caesar pronto para executar');
  }

  function rejectTask(taskId) {
    setTaskStatus(taskId, 'rejected', { rejectedAt: Date.now() });
    toast('✕ Rejeitada');
  }

  function createTask(taskData) {
    commit(D => {
      if (!D._imperium) D._imperium = defaultImperiumState();
      if (!D._imperium.tasks) D._imperium.tasks = [];
      D._imperium.tasks.unshift({
        id: 't_' + Orbita.uid(),
        title: taskData.title,
        clientId: taskData.clientId || null,
        sourceType: taskData.sourceType || 'manual',
        sourceRef: taskData.sourceRef || '',
        assignedTo: taskData.assignedTo || null,
        status: 'pending',
        priority: taskData.priority || 2,
        createdAt: Date.now(),
        claimedAt: null,
        completedAt: null,
        outputRef: null,
        outputSummary: '',
        reviewerNotes: null,
        executorLogs: null,
        idempotencyKey: 'manual:' + Date.now(),
      });
    });
    toast('＋ Tarefa criada');
  }

  function onDropOnAgent(e, agentSlug) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/x-imperium-task');
    if (taskId) reassignTask(taskId, agentSlug);
  }

  return (
    <>
      <TopBar
        title="Legio."
        subtitle={`${tasks.length} tarefa${tasks.length === 1 ? '' : 's'} · ${needsReview.length} para revisão`}
        actions={
          <button className="btn btn-primary" onClick={() => setShowNewTask(true)}>
            ＋ Nova tarefa
          </button>
        }
      />

      <div style={{ padding: '20px 28px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Top strip: 10 emperors */}
        <div className="glass" style={{ padding: '20px 18px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 6px' }}>
            <div className="eyebrow">Legio Imperialis</div>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--ink-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3ccf91' }}/>Online</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D4AF37' }}/>Stale</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5a3c' }}/>Offline / Erro</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3a3a4a' }}/>Desabilitado</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {LEGIO_AGENTS.map(a => {
              const agent = agents[a.slug] || { enabled: false, lastHeartbeat: 0 };
              const status = agentStatusOf(agent);
              const reviewBadge = reviewByAgent[a.slug] || 0;
              return (
                <div
                  key={a.slug}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onDragLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onDrop={e => { e.currentTarget.style.transform = 'scale(1)'; onDropOnAgent(e, a.slug); }}
                  style={{ transition: 'transform 150ms' }}
                >
                  <EmperorAvatar
                    slug={a.slug}
                    size={72}
                    status={status}
                    onClick={() => setSelectedAgent(a.slug)}
                    label={a.name}
                    sublabel={a.role}
                    badge={reviewBadge || null}
                    activity={(agent.status === 'thinking' || agent.status === 'calling') && agent.activity ? agent.activity : null}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Para minha revisão hero */}
        {needsReview.length > 0 ? (
          <div className="glass" style={{ padding: 20, border: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 0 40px rgba(212,175,55,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="eyebrow" style={{ color: '#D4AF37' }}>Para minha revisão</div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: 'var(--ink-0)', marginTop: 4 }}>
                  {needsReview.length} tarefa{needsReview.length === 1 ? '' : 's'} aguardando aprovação
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {needsReview.map(task => {
                const agent = agents[task.assignedTo];
                const client = imp.clients[task.clientId];
                return (
                  <div key={task.id} style={{ padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{task.title}</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', fontSize: 10 }}>
                      {client ? <span style={{ padding: '2px 7px', borderRadius: 999, background: client.color + '22', color: client.color, fontWeight: 600 }}>{client.name}</span> : null}
                      {agent ? <span style={{ padding: '2px 7px', borderRadius: 999, background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>{agent.name}</span> : null}
                    </div>
                    {task.outputSummary ? (
                      <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 12, padding: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 8, maxHeight: 80, overflow: 'hidden' }}>
                        {task.outputSummary.slice(0, 200)}{task.outputSummary.length > 200 ? '…' : ''}
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setSelectedTask(task.id)} style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--glass-border)',
                        background: 'transparent', color: 'var(--ink-2)', fontSize: 12, cursor: 'pointer',
                      }}>Ver</button>
                      <button onClick={() => rejectTask(task.id)} style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid rgba(255,90,60,0.4)',
                        background: 'rgba(255,90,60,0.08)', color: '#ff7a5a', fontSize: 12, cursor: 'pointer', fontWeight: 600,
                      }}>✕ Rejeitar</button>
                      <button onClick={() => approveTask(task.id)} style={{
                        flex: 1.4, padding: '8px 0', borderRadius: 8, border: 'none',
                        background: 'linear-gradient(135deg, #D4AF37, #C8102E)', color: '#08080c', fontSize: 12, cursor: 'pointer', fontWeight: 700,
                      }}>✓ Aprovar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="eyebrow" style={{ marginRight: 4 }}>Filtrar</span>
          <button onClick={() => setFilterClient('all')} className={`chip ${filterClient === 'all' ? 'chip-neon' : ''}`} style={{ cursor: 'pointer' }}>
            Todos ({tasks.length})
          </button>
          {Object.values(LEGIO_CLIENTS).map(c => {
            const count = tasks.filter(t => t.clientId === c.id).length;
            return (
              <button key={c.id} onClick={() => setFilterClient(c.id)} className="chip" style={{
                cursor: 'pointer',
                background: filterClient === c.id ? c.color + '33' : 'var(--glass-bg)',
                border: filterClient === c.id ? `1px solid ${c.color}` : '1px solid var(--glass-border)',
                color: filterClient === c.id ? c.color : 'var(--ink-2)',
                fontWeight: filterClient === c.id ? 600 : 400,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }}/>
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Kanban */}
        <div className="legio-kanban" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(220px, 1fr))', gap: 12, overflowX: 'auto' }}>
          {STATUS_COLUMNS.map(col => {
            const colTasks = tasksByStatus[col.id] || [];
            return (
              <div key={col.id} style={{ minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.accent }}/>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.label}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{colTasks.length}</span>
                </div>
                <div style={{ padding: 10, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', minHeight: 100 }}>
                  {colTasks.length === 0 ? (
                    <div style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>—</div>
                  ) : colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      agent={agents[task.assignedTo]}
                      client={imp.clients[task.clientId]}
                      onClick={() => setSelectedTask(task.id)}
                      onDragStart={e => { e.dataTransfer.setData('text/x-imperium-task', task.id); }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Health panel */}
        {healthIssues.length > 0 ? (
          <div className="glass" style={{ padding: 16, borderColor: 'rgba(255,90,60,0.3)' }}>
            <div className="eyebrow" style={{ color: '#ff7a5a', marginBottom: 10 }}>Saúde do exército</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {healthIssues.map(({ slug, name, role, agent }) => {
                const status = agentStatusOf(agent);
                return (
                  <div key={slug} onClick={() => setSelectedAgent(slug)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,90,60,0.2)' }}>
                    <EmperorAvatar slug={slug} size={36} status={status}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{role} · {status.label}</div>
                      <div style={{ fontSize: 10, color: '#ff7a5a', marginTop: 2 }}>
                        {agent.lastError?.msg || `Último sinal: ${fmtAgo(agent.lastHeartbeat)}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

      </div>

      {selectedAgent ? (
        <AgentDrawer slug={selectedAgent} onClose={() => setSelectedAgent(null)} />
      ) : null}

      {selectedTask ? (
        <TaskDrawer
          taskId={selectedTask}
          onClose={() => setSelectedTask(null)}
          onApprove={approveTask}
          onReject={rejectTask}
          onReassign={reassignTask}
        />
      ) : null}

      {showNewTask ? (
        <NewTaskModal onClose={() => setShowNewTask(false)} onCreate={createTask} />
      ) : null}
    </>
  );
}

function AgentDrawer({ slug, onClose }) {
  const { data, commit, toast } = useData();
  const imp = data._imperium || defaultImperiumState();
  const agent = imp.agents[slug];
  const meta = LEGIO_AGENTS.find(a => a.slug === slug);
  if (!agent || !meta) return null;
  const status = agentStatusOf(agent);
  const client = meta.clientId ? imp.clients[meta.clientId] : null;
  const recentLogs = (imp.recentLogs || []).filter(l => l.agentId === slug).slice(0, 10);
  const myTasks = (imp.tasks || []).filter(t => t.assignedTo === slug);

  function toggleEnabled() {
    commit(D => {
      D._imperium.agents[slug].enabled = !D._imperium.agents[slug].enabled;
    });
    toast(agent.enabled ? `${meta.name} desabilitado` : `${meta.name} habilitado`);
  }

  function setModel(modelId) {
    commit(D => { D._imperium.agents[slug].model = modelId; });
    const lbl = LEGIO_MODELS.find(m => m.id === modelId)?.label || modelId;
    toast(`${meta.name} → ${lbl}`);
  }

  async function triggerNow() {
    const url = imp.config?.workerUrl + '/trigger/' + slug;
    const token = imp.config?.workerToken;
    if (!token) { toast('✕ Configure o worker token em Configurações'); return; }
    try {
      const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      toast(`⚡ ${meta.name} disparado`);
    } catch (e) {
      toast('✕ Worker indisponível · ' + e.message);
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(480px, 92vw)', height: '100vh', overflowY: 'auto',
        background: 'linear-gradient(180deg, #1a0606 0%, #0a0604 100%)',
        borderLeft: '1px solid rgba(212,175,55,0.3)', padding: 28,
        boxShadow: '-20px 0 60px -20px rgba(0,0,0,0.8)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <EmperorAvatar slug={slug} size={96} status={status}/>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 38, lineHeight: 1, marginBottom: 4 }}>
          {meta.name}
        </div>
        <div style={{ fontSize: 14, color: '#D4AF37', marginBottom: 16 }}>{meta.role}</div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span className="chip" style={{ background: status.color + '22', borderColor: status.color, color: status.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.color }}/> {status.label}
          </span>
          {client ? (
            <span className="chip" style={{ background: client.color + '22', borderColor: client.color, color: client.color }}>{client.name}</span>
          ) : null}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Modelo</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LEGIO_MODELS.map(m => {
              const active = (agent.model || meta.defaultModel) === m.id;
              return (
                <button key={m.id} onClick={() => setModel(m.id)} style={{
                  flex: 1, minWidth: 110, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                  background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(200,16,46,0.12))' : 'var(--glass-bg)',
                  border: active ? '1px solid #D4AF37' : '1px solid var(--glass-border)',
                  color: active ? '#F4D17A' : 'var(--ink-2)', textAlign: 'center',
                  fontFamily: 'var(--font-ui)', transition: 'all 150ms',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: 9.5, color: active ? '#D4AF37bb' : 'var(--ink-3)', marginTop: 2 }}>{m.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button onClick={triggerNow} disabled={!agent.enabled} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: agent.enabled ? 1 : 0.5 }}>
            ⚡ Disparar agora
          </button>
          <button onClick={toggleEnabled} className="btn" style={{ flex: 1, justifyContent: 'center' }}>
            {agent.enabled ? '⏸ Desabilitar' : '▶ Habilitar'}
          </button>
        </div>

        {(agent.status === 'thinking' || agent.status === 'calling') ? (() => {
          const step = agent.lastStep || 0;
          const total = agent.maxSteps || 16;
          const startedAt = agent.runStartedAt || Date.now();
          const elapsedMs = Date.now() - startedAt;
          const elapsedS = Math.round(elapsedMs / 1000);
          const fmtSec = s => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
          const etaS = step > 0 && step < total
            ? Math.round((elapsedMs / step) * (total - step) / 1000)
            : null;
          return (
            <div style={{ marginBottom: 20, padding: 14, borderRadius: 10, background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(200,16,46,0.06))', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="eyebrow" style={{ color: '#D4AF37' }}>
                  {agent.status === 'thinking' ? '◐ Pensando' : '⚡ Chamando ferramenta'}
                </div>
                <span className="mono" style={{ fontSize: 11, color: '#D4AF37' }}>
                  {step}/{total}
                </span>
              </div>
              {agent.activity ? (
                <div style={{ fontSize: 12, color: 'var(--ink-1)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{agent.activity}</div>
              ) : null}
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(100, (step / total) * 100)}%`,
                  background: 'linear-gradient(90deg, #C8102E, #D4AF37)',
                  transition: 'width 400ms ease-out',
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                <span>⏱ {fmtSec(elapsedS)} decorrido{etaS != null ? ` · ~${fmtSec(etaS)} restante` : ''}</span>
                {agent.lastSpendUSD ? <span>${agent.lastSpendUSD.toFixed(3)}</span> : null}
              </div>
            </div>
          );
        })() : null}

        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Heartbeat</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>
            Último sinal: {fmtAgo(agent.lastHeartbeat)}
          </div>
          {agent.currentTaskId ? (
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
              Trabalhando em: <span className="mono">{agent.currentTaskId}</span>
            </div>
          ) : null}
        </div>

        {agent.lastError ? (
          <div style={{ marginBottom: 20, padding: 12, borderRadius: 10, background: 'rgba(255,90,60,0.08)', border: '1px solid rgba(255,90,60,0.3)' }}>
            <div className="eyebrow" style={{ color: '#ff7a5a', marginBottom: 6 }}>Último erro</div>
            <div style={{ fontSize: 12, color: '#ffa896', lineHeight: 1.5 }}>{agent.lastError.msg}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>{fmtAgo(agent.lastError.at)}</div>
          </div>
        ) : null}

        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Tarefas atribuídas ({myTasks.length})</div>
          {myTasks.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--ink-4)', fontStyle: 'italic' }}>—</div>
          ) : myTasks.slice(0, 5).map(t => (
            <div key={t.id} style={{ padding: 10, borderRadius: 8, background: 'rgba(0,0,0,0.2)', marginBottom: 6, fontSize: 12 }}>
              <div style={{ fontWeight: 500 }}>{t.title}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{STATUS_COLUMNS.find(c => c.id === t.status)?.label} · {fmtAgo(t.createdAt)}</div>
            </div>
          ))}
        </div>

        {recentLogs.length > 0 ? (
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Atividade recente</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              {recentLogs.map(l => (
                <div key={l.id || l.at} style={{ padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: l.level === 'error' ? '#ff7a5a' : l.level === 'warn' ? '#D4AF37' : 'var(--ink-2)' }}>{l.level}</span>
                  {' · '}{l.msg}
                  <span style={{ float: 'right' }}>{fmtAgo(l.at)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TaskDrawer({ taskId, onClose, onApprove, onReject, onReassign }) {
  const { data } = useData();
  const imp = data._imperium || defaultImperiumState();
  const task = (imp.tasks || []).find(t => t.id === taskId);
  if (!task) return null;
  const agent = imp.agents[task.assignedTo];
  const client = imp.clients[task.clientId];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(560px, 95vw)', height: '100vh', overflowY: 'auto',
        background: 'linear-gradient(180deg, #1a0606 0%, #0a0604 100%)',
        borderLeft: '1px solid rgba(212,175,55,0.3)', padding: 28,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div className="eyebrow">Tarefa</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1.15, marginBottom: 16 }}>
          {task.title}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {client ? <span className="chip" style={{ background: client.color + '22', borderColor: client.color, color: client.color }}>{client.name}</span> : null}
          {agent ? <span className="chip">{agent.name}</span> : null}
          <span className="chip">{task.sourceType}</span>
          <span className="chip" style={{ background: STATUS_COLUMNS.find(c => c.id === task.status)?.accent + '22', color: STATUS_COLUMNS.find(c => c.id === task.status)?.accent }}>
            {STATUS_COLUMNS.find(c => c.id === task.status)?.label}
          </span>
          {task.priority === 1 ? <span className="chip" style={{ background: '#C8102E33', color: '#ff7a8a' }}>Urgente</span> : null}
        </div>

        {task.outputSummary ? (
          <div style={{ marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Resumo do output</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 10, whiteSpace: 'pre-wrap' }}>
              {task.outputSummary}
            </div>
          </div>
        ) : null}

        {task.reviewerNotes ? (
          <div style={{ marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 8, color: '#D4AF37' }}>Notas do revisor</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6, padding: 12, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10 }}>
              {task.reviewerNotes}
            </div>
          </div>
        ) : null}

        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Reatribuir</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LEGIO_AGENTS.map(a => (
              <button key={a.slug} onClick={() => onReassign(task.id, a.slug)} className="chip" style={{ cursor: 'pointer', opacity: task.assignedTo === a.slug ? 1 : 0.7, border: task.assignedTo === a.slug ? '1px solid #D4AF37' : '1px solid var(--glass-border)' }}>
                {a.name}
              </button>
            ))}
          </div>
        </div>

        {task.status === 'needs-review' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { onReject(task.id); onClose(); }} className="btn" style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,90,60,0.08)', borderColor: 'rgba(255,90,60,0.4)', color: '#ff7a5a' }}>
              ✕ Rejeitar
            </button>
            <button onClick={() => { onApprove(task.id); onClose(); }} className="btn btn-primary" style={{ flex: 1.5, justifyContent: 'center' }}>
              ✓ Aprovar · Enviar a Caesar
            </button>
          </div>
        ) : null}

        <div style={{ marginTop: 24, fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
          ID: {task.id} · Criada: {fmtAgo(task.createdAt)}
        </div>
      </div>
    </div>
  );
}

function NewTaskModal({ onClose, onCreate }) {
  const [title, setTitle] = React.useState('');
  const [clientId, setClientId] = React.useState('');
  const [assignedTo, setAssignedTo] = React.useState('');
  const [priority, setPriority] = React.useState(2);

  function submit() {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), clientId: clientId || null, assignedTo: assignedTo || null, priority });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 92vw)' }}>
        <div className="modal-header">
          <h2>Nova tarefa</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Revisar search terms TLC semana 19" onKeyDown={e => { if (e.key === 'Enter') submit(); }}/>
          </div>
          <div className="form-group">
            <label className="form-label">Cliente</label>
            <select className="form-input" value={clientId} onChange={e => setClientId(e.target.value)}>
              <option value="">— Sem cliente —</option>
              {Object.values(LEGIO_CLIENTS).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Atribuir a</label>
            <select className="form-input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
              <option value="">— Decidir depois —</option>
              {LEGIO_AGENTS.map(a => <option key={a.slug} value={a.slug}>{a.name} · {a.role}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Prioridade</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{v:1,l:'Urgente'},{v:2,l:'Normal'},{v:3,l:'Baixa'}].map(p => (
                <button key={p.v} onClick={() => setPriority(p.v)} className="chip" style={{
                  cursor: 'pointer', flex: 1, justifyContent: 'center', padding: '8px 12px',
                  background: priority === p.v ? 'var(--gradient-neon-soft)' : 'var(--glass-bg)',
                  borderColor: priority === p.v ? 'var(--neon-a)' : 'var(--glass-border)',
                }}>{p.l}</button>
              ))}
            </div>
          </div>
          <button onClick={submit} className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px 0' }} disabled={!title.trim()}>
            ＋ Criar tarefa
          </button>
        </div>
      </div>
    </div>
  );
}

window.ScreenLegio = ScreenLegio;
window.LEGIO_AGENTS = LEGIO_AGENTS;
window.LEGIO_CLIENTS = LEGIO_CLIENTS;
window.defaultImperiumState = defaultImperiumState;
