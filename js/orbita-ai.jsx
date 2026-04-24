/* Orbita v2 — Orbita IA: general assistant on Home */

function OrbitaAIBar() {
  const { data, commit } = useData();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [messages, setMessages] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('orbita_ai_chat') || '[]'); }
    catch { return []; }
  });
  const scrollRef = React.useRef();

  React.useEffect(() => {
    localStorage.setItem('orbita_ai_chat', JSON.stringify(messages.slice(-30)));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Use openai key from diet (shared)
  const openaiKey = data._diet?.openaiKey;
  const today = Orbita.todayStr();

  function buildContext() {
    const profile = data._profile || {};
    const tasks = data.tasks || [];
    const habits = data.habits || [];
    const goals = data.goals || [];
    const xp = data.xp || {};

    const todayTasks = tasks.filter(t => Orbita.isTaskForDate(t, today));
    const overdueTasks = tasks.filter(t => t.freq === 'pontual' && !t.done && t.date && t.date < today);
    const todayHabitsDone = habits.filter(h => h.log && h.log[today]).length;

    let ctx = `Contexto do usuário:\n`;
    ctx += `- Nome: ${profile.name || 'Stephano'}\n`;
    ctx += `- Nível ${xp.level || 1} (${xp.total || 0} XP${xp.class ? `, classe ${xp.class}` : ''})\n`;
    ctx += `- Tarefas hoje: ${todayTasks.length} (${todayTasks.filter(t => Orbita.isTaskDone(t, today)).length} feitas)\n`;
    ctx += `- Atrasadas: ${overdueTasks.length}\n`;
    ctx += `- Hábitos hoje: ${todayHabitsDone}/${habits.length}\n`;
    ctx += `- Objetivos ativos: ${goals.filter(g => (g.milestones||[]).some(m => !m.done)).length}\n`;
    if (todayTasks.length > 0) {
      ctx += `\nTarefas pendentes hoje: ${todayTasks.filter(t => !Orbita.isTaskDone(t, today)).slice(0, 8).map(t => t.text).join(', ')}\n`;
    }
    if (overdueTasks.length > 0) {
      ctx += `Tarefas atrasadas: ${overdueTasks.slice(0, 5).map(t => `${t.text} (${t.date})`).join(', ')}\n`;
    }
    if (goals.length > 0) {
      ctx += `Objetivos: ${goals.slice(0, 5).map(g => g.title).join(', ')}\n`;
    }
    return ctx;
  }

  async function send() {
    if (!input.trim()) return;
    if (!openaiKey) { setError('Configure sua chave OpenAI em Dieta → Objetivos'); return; }
    setLoading(true); setError('');

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
            { role: 'system', content: `Você é a Orbita IA, assistente pessoal do usuário. Ajude com produtividade, organização, motivação e conselhos sobre suas tarefas, hábitos e objetivos. Seja conciso, direto e em português.\n\n${buildContext()}` },
            ...newMessages.slice(-10),
          ],
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const json = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: json.choices[0].message.content }]);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function clearChat() {
    if (!confirm('Limpar conversa?')) return;
    setMessages([]);
    localStorage.removeItem('orbita_ai_chat');
  }

  if (!open) {
    const tasks = data.tasks || [];
    const todayPending = tasks.filter(t => Orbita.isTaskForDate(t, today) && !Orbita.isTaskDone(t, today)).length;
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 500,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 28,
        background: 'linear-gradient(135deg, #b066ff, #5b8dff)', border: 'none', color: '#fff',
        cursor: 'pointer', fontSize: 13, fontWeight: 500,
        boxShadow: '0 4px 20px rgba(176,102,255,0.4)',
        fontFamily: 'var(--font-ui)',
      }}>
        <span style={{ fontSize: 16 }}>🌌</span>
        <span>Orbita IA{todayPending ? ` · ${todayPending} pendente${todayPending > 1 ? 's' : ''}` : ''}</span>
      </button>
    );
  }

  const suggestions = [
    'Resumo do meu dia',
    'O que devo priorizar agora?',
    'Como estou nos meus hábitos?',
    'Sugira como organizar minha semana',
  ];

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
        <span style={{ fontSize: 16 }}>🌌</span>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Orbita IA</div>
        {messages.length > 0 && <button className="btn-ghost small" onClick={clearChat} style={{ fontSize: 10 }}>Limpar</button>}
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 12, minHeight: 200 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🌌</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 12 }}>Pergunte sobre suas tarefas, hábitos, objetivos. A IA conhece seu dia.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {suggestions.map(s => (
                <button key={s} className="btn-ghost small" onClick={() => setInput(s)} style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 11 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <div style={{
              maxWidth: '85%', padding: '8px 12px', borderRadius: 12,
              background: m.role === 'user' ? 'linear-gradient(135deg, rgba(176,102,255,0.2), rgba(91,141,255,0.15))' : 'rgba(255,255,255,0.04)',
              border: m.role === 'user' ? '1px solid rgba(176,102,255,0.3)' : '1px solid var(--line)',
              fontSize: 12.5, lineHeight: 1.5, whiteSpace: 'pre-wrap',
            }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ fontSize: 11, color: 'var(--ink-3)', padding: 8 }}>⟳ pensando...</div>}
      </div>

      {error && (
        <div style={{ margin: 10, padding: 8, background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 6, fontSize: 11, color: '#ff5555' }}>
          {error}
        </div>
      )}

      <div style={{ padding: 10, borderTop: '1px solid var(--line)', display: 'flex', gap: 6 }}>
        <input className="form-input" placeholder="Pergunte algo..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) { e.preventDefault(); send(); } }}
          style={{ flex: 1, fontSize: 12, padding: '8px 10px' }} disabled={loading} />
        <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12, background: 'linear-gradient(135deg, #b066ff, #5b8dff)' }} onClick={send} disabled={loading || !input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}

window.OrbitaAIBar = OrbitaAIBar;
