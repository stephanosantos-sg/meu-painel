/* Orbita v2 — Screens: Goals, Lembretes, Profile, Categories, Placeholders */

/* ── Lembretes (was "Fazer quando der") ── */
function ScreenLembretes({ onNewTask }) {
  const { data, toggleTask, toggleSubtask, commit } = useData();
  const catMap = {}; (data.categories || []).forEach(c => { catMap[c.id] = c; });
  const tasks = (data.tasks || []).filter(t => !t.date && !t.done);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [newText, setNewText] = React.useState('');
  const [newPrio, setNewPrio] = React.useState(3);
  const [newDate, setNewDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');

  function openAdd() { setEditingId(null); setNewText(''); setNewPrio(3); setNewDate(''); setNewTime(''); setShowAdd(true); }
  function openEdit(t) { setEditingId(t.id); setNewText(t.text); setNewPrio(t.prio || 3); setNewDate(t.date || ''); setNewTime(t.time || ''); setShowAdd(true); }

  function quickSave() {
    if (!newText.trim()) return;
    commit(D => {
      if (editingId) {
        const t = D.tasks.find(x => x.id === editingId);
        if (t) { t.text = newText.trim(); t.prio = newPrio; t.date = newDate || null; t.time = newTime || null; }
      } else {
        D.tasks.push({ id: Orbita.uid(), text: newText.trim(), freq: 'pontual', prio: newPrio, done: false, doneSlots: {}, date: newDate || null, time: newTime || null, subtasks: [], times: [], cat: null, icon: null });
      }
    });
    setShowAdd(false);
  }

  function deleteTask(id) { commit(D => { D.tasks = D.tasks.filter(x => x.id !== id); }); }

  const allTasks = (data.tasks || []).filter(t => !t.done && ((!t.date) || t.freq === 'pontual'));
  const byPrio = [1,2,3,4].map(p => ({ prio: p, tasks: tasks.filter(t => (t.prio || 4) === p) })).filter(g => g.tasks.length > 0);
  const prioLabels = { 1: '🔴 Urgente', 2: '🟠 Alta', 3: '🟣 Normal', 4: '🔵 Baixa' };

  return (
    <>
      <TopBar title="Lembretes." subtitle={`${tasks.length} pendentes`}
        actions={<>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={onNewTask}>＋ Completa</button>
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={openAdd}>＋ Lembrete</button>
        </>}
      />
      <div style={{ padding: '0 28px 40px' }}>
        {tasks.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>↓</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Sem lembretes</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Adicione tarefas sem data para fazer quando der</div>
          </div>
        )}
        {byPrio.map(group => (
          <div key={group.prio} style={{ marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{prioLabels[group.prio]} · {group.tasks.length}</div>
            <div className="task-list">
              {group.tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ flex: 1 }}><TaskItem task={t} dateCtx={Orbita.todayStr()} catMap={catMap} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                    {(t.date || t.time) && <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{t.date && Orbita.fmtDate(t.date)}{t.time && ` ${t.time}`}</span>}
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', fontSize: 11, padding: '2px 4px' }}>✎</button>
                      <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 11, padding: '2px 4px' }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(440px, 90vw)' }}>
            <div className="modal-header"><h2>{editingId ? 'Editar lembrete' : 'Novo lembrete'}</h2><button className="modal-close" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <input className="form-input" autoFocus placeholder="O que precisa lembrar?" value={newText} onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') quickSave(); }} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data (opcional)</label>
                  <input className="form-input" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora (opcional)</label>
                  <input className="form-input" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Prioridade</label>
                <div className="form-chips">
                  {[{v:1,l:'Urgente'},{v:2,l:'Alta'},{v:3,l:'Normal'},{v:4,l:'Baixa'}].map(p => (
                    <div key={p.v} className={`form-chip ${newPrio === p.v ? 'active' : ''}`} onClick={() => setNewPrio(p.v)}>{p.l}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={quickSave}>{editingId ? 'Salvar' : 'Adicionar'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Goals with create/edit modal + cover icon ── */
function ScreenGoals() {
  const { data, toggleMilestone, saveGoal, deleteGoal, commit } = useData();
  const goals = data.goals || [];
  const [editing, setEditing] = React.useState(null); // null = closed, 'new' = create, goalId = edit

  function openNew() { setEditing('new'); }
  function openEdit(g) { setEditing(g.id); }

  const editGoal = editing && editing !== 'new' ? goals.find(g => g.id === editing) : null;

  return (
    <>
      <TopBar title="Objetivos." subtitle={`${goals.length} metas ativas`}
        actions={<button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={openNew}>＋ Objetivo</button>}
      />
      <div style={{ padding: '0 28px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {goals.length === 0 && (
          <div className="panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhum objetivo</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, marginBottom: 16 }}>Defina metas com etapas para acompanhar seu progresso</div>
            <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={openNew}>＋ Criar objetivo</button>
          </div>
        )}
        {goals.map(g => {
          const ms = g.milestones || [];
          const doneMilestones = ms.filter(m => m.done).length;
          const pct = ms.length ? Math.round(doneMilestones / ms.length * 100) : 0;
          const coverIcon = g.icon || '◎';
          const hasCoverImage = g.coverImage;
          return (
            <div key={g.id} className="panel" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
              {/* Cover image banner */}
              {hasCoverImage && (
                <div style={{ width: '100%', height: 120, overflow: 'hidden', position: 'relative' }}>
                  <img src={g.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${g.coverY ?? 50}%` }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,12,0.9) 0%, transparent 60%)' }} />
                </div>
              )}
              {/* Header */}
              <div style={{ padding: hasCoverImage ? '0 24px 16px' : '20px 24px 16px', marginTop: hasCoverImage ? -30 : 0, position: 'relative', background: hasCoverImage ? 'transparent' : 'linear-gradient(135deg, rgba(255,46,136,0.08), rgba(91,141,255,0.06))', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0, backdropFilter: 'blur(10px)' }}>{coverIcon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>{g.title}</div>
                    {g.desc && <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.4 }}>{g.desc}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="icon-btn" onClick={() => openEdit(g)} style={{ width: 30, height: 30, fontSize: 13 }}>✎</button>
                    <button className="icon-btn" onClick={() => { if (confirm('Deletar "' + g.title + '"?')) deleteGoal(g.id); }} style={{ width: 30, height: 30, fontSize: 13 }}>✕</button>
                  </div>
                </div>
                {g.deadline && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8 }}>prazo · {Orbita.fmtDate(g.deadline)}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gradient-neon)', borderRadius: 3 }} />
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--neon-a)', fontWeight: 600 }}>{pct}%</span>
                </div>
              </div>
              {/* Milestones with progress sliders */}
              <div style={{ padding: '12px 24px 20px' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 10 }}>{doneMilestones}/{ms.length} etapas</div>
                {ms.map((m, idx) => {
                  const mProg = m.done ? 100 : (m.progress || 0);
                  const mColor = m.done ? 'var(--neon-a)' : mProg > 0 ? 'var(--neon-c)' : 'var(--ink-4)';
                  return (
                    <div key={idx} style={{ padding: '10px 0', borderBottom: idx < ms.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', width: 16 }}>{idx + 1}</span>
                        <div className={`check ${m.done ? 'checked' : ''}`} style={{ width: 20, height: 20, fontSize: 10, cursor: 'pointer' }}
                          onClick={() => toggleMilestone(g.id, idx)}>{m.done && '✓'}</div>
                        <span style={{ fontSize: 13, flex: 1, fontWeight: 500, textDecoration: m.done ? 'line-through' : 'none', color: m.done ? 'var(--ink-3)' : 'var(--ink-1)' }}>{m.text}</span>
                        <span className="mono" style={{ fontSize: 11, color: mColor, fontWeight: 600 }}>{mProg}%</span>
                      </div>
                      <div style={{ paddingLeft: 26, marginTop: 4 }}>
                        <input type="range" min="0" max="100" value={mProg}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            commit(D => {
                              const goal = D.goals.find(x => x.id === g.id);
                              if (goal && goal.milestones[idx]) {
                                goal.milestones[idx].progress = val;
                                if (val >= 100) goal.milestones[idx].done = true;
                                else goal.milestones[idx].done = false;
                              }
                            });
                          }}
                          style={{ width: '100%', accentColor: mColor }} />
                      </div>
                    </div>
                  );
                })}
                {ms.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-4)', padding: '8px 0' }}>Nenhuma etapa definida</div>}
              </div>
            </div>
          );
        })}
      </div>

      {editing && <GoalModal onClose={() => setEditing(null)} editGoal={editGoal} />}
    </>
  );
}

function GoalModal({ onClose, editGoal }) {
  const { saveGoal } = useData();
  const [title, setTitle] = React.useState(editGoal?.title || '');
  const [desc, setDesc] = React.useState(editGoal?.desc || '');
  const [deadline, setDeadline] = React.useState(editGoal?.deadline || '');
  const [icon, setIcon] = React.useState(editGoal?.icon || '🎯');
  const [coverImage, setCoverImage] = React.useState(editGoal?.coverImage || '');
  const [coverY, setCoverY] = React.useState(editGoal?.coverY ?? 50);
  const [dragging, setDragging] = React.useState(false);
  const [milestones, setMilestones] = React.useState(editGoal?.milestones ? editGoal.milestones.map(m => ({...m})) : []);
  const [newMs, setNewMs] = React.useState('');
  const fileRef = React.useRef();
  const dragRef = React.useRef({ startY: 0, startCoverY: 0 });

  const [newMsDate, setNewMsDate] = React.useState('');
  function addMilestone() { if (!newMs.trim()) return; setMilestones(p => [...p, { text: newMs.trim(), done: false, progress: 0, suggestedDate: newMsDate || null }]); setNewMs(''); setNewMsDate(''); }

  function handleSave() {
    if (!title.trim()) return;
    saveGoal({ title: title.trim(), desc: desc.trim(), deadline: deadline || null, icon, coverImage: coverImage || null, coverY, milestones }, editGoal?.id);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editGoal ? 'Editar objetivo' : 'Novo objetivo'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Cover image */}
          <div className="form-group">
            <label className="form-label">Capa (imagem)</label>
            {coverImage && (
              <div style={{ position: 'relative', marginBottom: 8, borderRadius: 12, overflow: 'hidden', height: 120, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
                onMouseDown={e => {
                  setDragging(true);
                  dragRef.current = { startY: e.clientY, startCoverY: coverY };
                  const onMove = ev => {
                    const dy = ev.clientY - dragRef.current.startY;
                    const newY = Math.max(0, Math.min(100, dragRef.current.startCoverY - dy * 0.5));
                    setCoverY(newY);
                  };
                  const onUp = () => { setDragging(false); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
                onTouchStart={e => {
                  const touch = e.touches[0];
                  dragRef.current = { startY: touch.clientY, startCoverY: coverY };
                  setDragging(true);
                  const onMove = ev => {
                    const dy = ev.touches[0].clientY - dragRef.current.startY;
                    const newY = Math.max(0, Math.min(100, dragRef.current.startCoverY - dy * 0.5));
                    setCoverY(newY);
                  };
                  const onEnd = () => { setDragging(false); window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
                  window.addEventListener('touchmove', onMove);
                  window.addEventListener('touchend', onEnd);
                }}>
                <img src={coverImage} alt="" draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${coverY}%`, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,12,0.4) 0%, transparent 40%)' }} />
                <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
                  ↕ Arraste para reposicionar
                </div>
                <button onClick={e => { e.stopPropagation(); setCoverImage(''); setCoverY(50); }} style={{
                  position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 6,
                  background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12,
                  display: 'grid', placeItems: 'center',
                }}>✕</button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxW = 600;
                    const scale = Math.min(1, maxW / img.width);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    setCoverImage(canvas.toDataURL('image/jpeg', 0.7));
                  };
                  img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
              }} />
            <button className="btn-ghost small" onClick={() => fileRef.current.click()}>
              📷 {coverImage ? 'Trocar imagem' : 'Upload imagem'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div className="form-group">
              <label className="form-label">Ícone</label>
              <EmojiPicker value={icon} onChange={setIcon} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Título</label>
              <input className="form-input" autoFocus placeholder="Ex: Ler 24 livros em 2026" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="form-input" placeholder="Detalhes..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Prazo</label>
            <input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Etapas</label>
            {milestones.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {milestones.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)' }}>
                    <div className={`check ${m.done ? 'checked' : ''}`} style={{ width: 14, height: 14, fontSize: 7 }}
                      onClick={() => setMilestones(p => p.map((x,j) => j === i ? {...x, done: !x.done} : x))}>{m.done && '✓'}</div>
                    <span style={{ flex: 1, fontSize: 12, textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
                    {m.suggestedDate && <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{Orbita.fmtDate(m.suggestedDate)}</span>}
                    <input type="date" value={m.suggestedDate || ''} onChange={e => setMilestones(p => p.map((x,j) => j === i ? {...x, suggestedDate: e.target.value || null} : x))}
                      style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', fontSize: 10, width: 20, cursor: 'pointer', padding: 0 }} title="Data" />
                    <button onClick={() => setMilestones(p => p.filter((_,j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="form-input" placeholder="Nova etapa..." value={newMs} onChange={e => setNewMs(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', fontSize: 12 }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMilestone(); } }} />
              <input className="form-input" type="date" value={newMsDate} onChange={e => setNewMsDate(e.target.value)}
                style={{ width: 120, padding: '6px 8px', fontSize: 11 }} title="Data da etapa (opcional)" />
              <button className="btn-ghost small" onClick={addMilestone}>＋</button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>
            {editGoal ? 'Salvar' : 'Criar objetivo'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Categories CRUD ── */
function ScreenCategories({ onClose }) {
  const { data, saveCategory, deleteCategory } = useData();
  const cats = data.categories || [];
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState('📋');
  const [color, setColor] = React.useState('blue');
  const colors = [
    { v: 'blue', c: '#5b8dff' }, { v: 'green', c: '#3ccf91' }, { v: 'purple', c: '#b066ff' },
    { v: 'orange', c: '#ffa830' }, { v: 'red', c: '#ff5a3c' }, { v: 'pink', c: '#ff2e88' },
    { v: 'cyan', c: '#64d2ff' }, { v: 'yellow', c: '#ffd60a' },
  ];

  function addCat() {
    if (!name.trim()) return;
    saveCategory({ name: name.trim(), icon, color });
    setName(''); setIcon('📋'); setColor('blue');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 90vw)' }}>
        <div className="modal-header"><h2>Categorias</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          {cats.map(c => {
            const clr = Orbita.resolveColor(c.color);
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: clr + '22', border: `1px solid ${clr}44`, display: 'grid', placeItems: 'center', fontSize: 14 }}>{c.icon}</div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{c.name}</span>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: clr }} />
                <button onClick={() => deleteCategory(c.id)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 12 }}>✕</button>
              </div>
            );
          })}
          <div style={{ borderTop: cats.length ? '1px solid var(--line)' : 'none', paddingTop: 12, marginTop: 8 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Nova categoria</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <EmojiPicker value={icon} onChange={setIcon} />
              <div className="form-group" style={{ flex: 1 }}>
                <input className="form-input" placeholder="Nome" value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCat(); }} style={{ padding: '8px 12px', fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {colors.map(c => (
                <div key={c.v} onClick={() => setColor(c.v)} style={{
                  width: 22, height: 22, borderRadius: 6, background: c.c, cursor: 'pointer',
                  border: color === c.v ? '2px solid #fff' : '2px solid transparent', transition: 'all 120ms',
                }} />
              ))}
            </div>
            <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 12, marginTop: 12 }} onClick={addCat}>＋ Criar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Profile ── */
function ScreenProfile() {
  const { data } = useData();
  const xp = data.xp || { total: 0, level: 1, class: null };
  const cls = xp.class;
  const clsInfo = cls ? Orbita.CLASSES_MAP[cls] : null;
  const clsEn = clsInfo ? clsInfo.en : 'warrior';
  const spriteIdx = Orbita.getSpriteIndex(xp.level, cls);
  const title = Orbita.TITLES_MAP(xp.level);
  const lvlStart = Orbita.getTotalXPForLevel(xp.level);
  const lvlEnd = Orbita.getTotalXPForLevel(xp.level + 1);
  const pct = lvlEnd > lvlStart ? Math.round((xp.total - lvlStart) / (lvlEnd - lvlStart) * 100) : 0;
  const totalTasks = (data.tasks || []).filter(t => t.done || (t.doneSlots && Object.keys(t.doneSlots).length > 0)).length;
  const bestStreak = (data.habits || []).reduce((best, h) => Math.max(best, Orbita.getStreak(h)), 0);
  const achievements = data._achievements || {};
  const achCount = Object.keys(achievements).length;

  const avatarLevels = [
    { lvl: 1, title: 'Novato' }, { lvl: 4, title: 'Explorador' }, { lvl: 7, title: 'Batalhador' },
    { lvl: 10, title: 'Desbravador' }, { lvl: 15, title: 'Aventureiro' },
    { lvl: 30, title: '???' }, { lvl: 50, title: '???' }, { lvl: 70, title: '???' }, { lvl: 90, title: '???' }, { lvl: 100, title: '???' },
  ];

  const xpGuide = [
    { action: 'Tarefa simples', xp: '+5' },
    { action: 'Tarefa concluída', xp: '+10' },
    { action: 'Hábito do dia', xp: '+10' },
    { action: 'Pomodoro', xp: '+25' },
  ];

  return (
    <>
      <TopBar title="Perfil." subtitle={`${title} — Nível ${xp.level}`} />
      <div style={{ padding: '0 28px 40px' }}>
        {/* Hero card */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, marginBottom: 20 }}>
          <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <SpriteRender cls={clsEn} spriteIndex={spriteIdx} size={140} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, lineHeight: 1 }}>Stephano</div>
            <div style={{ fontSize: 12, color: 'var(--neon-a)', fontWeight: 500, marginTop: 4 }}>{title}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, marginTop: 8, color: 'var(--neon-a)' }}>Lvl {xp.level}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* XP bar */}
            <div className="panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Experiência</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{xp.total.toLocaleString()} XP total</span>
              </div>
              <div className="xp-bar" style={{ height: 10, marginTop: 8 }}><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>Lvl {xp.level}: {(xp.total - lvlStart).toLocaleString()} / {(lvlEnd - lvlStart).toLocaleString()} XP</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>Faltam {(lvlEnd - xp.total).toLocaleString()} XP</span>
              </div>
            </div>

            {/* XP Guide */}
            <div className="panel" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Como ganhar XP</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {xpGuide.map(g => (
                  <div key={g.action} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ fontSize: 12 }}>{g.action}</span>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--neon-a)', fontWeight: 600 }}>{g.xp}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Conquistas dão XP bônus (20-500 XP)</span>
                <span>🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Level', value: xp.level, color: 'var(--neon-a)' },
            { label: 'Streak', value: `🔥 ${bestStreak}`, color: '#ff5a3c' },
            { label: 'Tarefas', value: totalTasks, color: 'var(--neon-b)' },
            { label: 'Conquistas', value: `${achCount}/55`, color: '#ffd60a' },
          ].map(s => (
            <div key={s.label} className="panel" style={{ padding: 16 }}>
              <div className="eyebrow">{s.label}</div>
              <div className="mono" style={{ fontSize: 24, fontWeight: 500, color: s.color, lineHeight: 1, marginTop: 6 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Avatar Evolution */}
        <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Evolução do Avatar</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {avatarLevels.map((a, i) => {
              const unlocked = xp.level >= a.lvl;
              const isCurrent = i < avatarLevels.length - 1 ? (xp.level >= a.lvl && xp.level < avatarLevels[i+1].lvl) : xp.level >= a.lvl;
              return (
                <div key={a.lvl} style={{
                  minWidth: 80, textAlign: 'center', opacity: unlocked ? 1 : 0.4,
                  padding: '8px 4px', borderRadius: 12,
                  border: isCurrent ? '2px solid var(--neon-a)' : '2px solid transparent',
                  background: isCurrent ? 'var(--gradient-neon-soft)' : 'transparent',
                }}>
                  <div style={{ height: 60, display: 'grid', placeItems: 'center' }}>
                    <SpriteRender cls={clsEn} spriteIndex={i >= 5 ? 5 + (i-5) : i} size={50} />
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: unlocked ? '#fff' : 'var(--ink-4)', marginTop: 4 }}>Lvl {a.lvl}</div>
                  <div style={{ fontSize: 9, color: unlocked ? 'var(--ink-2)' : 'var(--ink-4)' }}>{unlocked ? (Orbita.TITLES_MAP(a.lvl)) : a.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements by category */}
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, marginBottom: 16 }}>🏆 Conquistas ({achCount}/{window.ACHIEVEMENT_DEFS ? ACHIEVEMENT_DEFS.length : 55})</div>
          {window.ACHIEVEMENT_CATS && Object.entries(ACHIEVEMENT_CATS).map(([catName, achs]) => {
            const catDone = achs.filter(a => achievements[a.id]).length;
            return (
              <div key={catName} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{catName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${achs.length ? (catDone/achs.length)*100 : 0}%`, height: '100%', background: 'var(--gradient-neon)' }} />
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{catDone}/{achs.length}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6, paddingLeft: 8 }}>
                  {achs.map(a => {
                    const unlocked = !!achievements[a.id];
                    return (
                      <div key={a.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
                        background: unlocked ? 'rgba(255,214,10,0.06)' : 'rgba(255,255,255,0.02)',
                        border: unlocked ? '1px solid rgba(255,214,10,0.15)' : '1px solid var(--line)',
                        opacity: unlocked ? 1 : 0.45,
                      }}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{a.desc}</div>
                        </div>
                        <span className="mono" style={{ fontSize: 9, color: unlocked ? '#ffd60a' : 'var(--ink-4)' }}>+{a.xp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PlaceholderScreen({ title, icon, msg }) {
  return (
    <>
      <TopBar title={title} />
      <div style={{ padding: '0 28px 40px' }}>
        <div className="panel" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{msg || 'Em breve na v2'}</div>
        </div>
      </div>
    </>
  );
}

window.ScreenGoals = ScreenGoals;
window.ScreenLembretes = ScreenLembretes;
window.ScreenProfile = ScreenProfile;
window.ScreenCategories = ScreenCategories;
window.PlaceholderScreen = PlaceholderScreen;
