/* Orbita v2 — Modals: Task + Habit (full feature parity with v1) */

function TaskModal({ onClose, editTask }) {
  const { saveTask, data } = useData();
  const [text, setText] = React.useState(editTask?.text || '');
  const [desc, setDesc] = React.useState(editTask?.desc || '');
  const [date, setDate] = React.useState(editTask?.date || Orbita.todayStr());
  const [noDate, setNoDate] = React.useState(editTask ? !editTask.date : false);
  const [time, setTime] = React.useState(editTask?.time || '');
  const [freq, setFreq] = React.useState(editTask?.freq || 'pontual');
  const [prio, setPrio] = React.useState(editTask?.prio || 3);
  const [cat, setCat] = React.useState(editTask?.cat || (data.categories && data.categories[0] ? data.categories[0].id : ''));
  const [icon, setIcon] = React.useState(editTask?.icon || '');
  const [days, setDays] = React.useState(editTask?.days || [1,2,3,4,5]);
  const [interval_, setInterval_] = React.useState(editTask?.interval || 7);
  const [subtasks, setSubtasks] = React.useState(editTask?.subtasks ? editTask.subtasks.map(s => ({...s})) : []);
  const [newSubtask, setNewSubtask] = React.useState('');
  const [times, setTimes] = React.useState(editTask?.times ? editTask.times.map(t => ({...t})) : []);
  const [newTimeVal, setNewTimeVal] = React.useState('');
  const [newTimeLabel, setNewTimeLabel] = React.useState('');
  const [dependsOn, setDependsOn] = React.useState(editTask?.dependsOn || '');

  const dayLabels = ['D','S','T','Q','Q','S','S'];
  const freqs = [
    { v: 'pontual', l: 'Pontual' },
    { v: 'diaria', l: 'Diária' },
    { v: 'semanal', l: 'Semanal' },
    { v: 'mensal', l: 'Mensal' },
    { v: 'anual', l: 'Anual' },
    { v: 'periodica', l: 'Periódica' },
  ];
  const prios = [
    { v: 1, l: 'P1 Urgente', c: 'p1' },
    { v: 2, l: 'P2 Alta', c: 'p2' },
    { v: 3, l: 'P3 Normal', c: 'p3' },
    { v: 4, l: 'P4 Baixa', c: 'p4' },
  ];

  const otherTasks = (data.tasks || []).filter(t => t.id !== editTask?.id && !t.done);

  function toggleDay(d) { setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort()); }

  function addSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, { text: newSubtask.trim(), done: false }]);
    setNewSubtask('');
  }
  function removeSubtask(idx) { setSubtasks(prev => prev.filter((_, i) => i !== idx)); }

  function addTimeSlot() {
    if (!newTimeVal) return;
    setTimes(prev => [...prev, { time: newTimeVal, label: newTimeLabel.trim() || '' }].sort((a,b) => a.time.localeCompare(b.time)));
    setNewTimeVal(''); setNewTimeLabel('');
  }
  function removeTimeSlot(idx) { setTimes(prev => prev.filter((_, i) => i !== idx)); }

  function handleSave() {
    if (!text.trim()) return;
    const taskData = {
      text: text.trim(),
      desc: desc.trim() || null,
      date: noDate ? null : (date || null),
      time: (freq === 'pontual' && times.length === 0) ? (time || null) : null,
      freq,
      prio,
      cat: cat || null,
      icon: icon || null,
      days: freq === 'semanal' ? days : undefined,
      interval: freq === 'periodica' ? interval_ : undefined,
      subtasks,
      times: times.length > 0 ? times : (editTask?.times || []),
      dependsOn: dependsOn || null,
    };
    saveTask(taskData, editTask?.id);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editTask ? 'Editar tarefa' : 'Nova Tarefa'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Tarefa</label>
            <input className="form-input" autoFocus placeholder="O que voce precisa fazer?" value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && text.trim()) handleSave(); }} />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Descrição (opcional)</label>
            <textarea className="form-input" placeholder="Detalhes..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          {/* Frequency */}
          <div className="form-group">
            <label className="form-label">Frequência</label>
            <div className="form-chips">
              {freqs.map(f => (
                <div key={f.v} className={`form-chip ${freq === f.v ? 'active' : ''}`} onClick={() => setFreq(f.v)}>{f.l}</div>
              ))}
            </div>
          </div>

          {/* Weekly days */}
          {freq === 'semanal' && (
            <div className="form-group">
              <label className="form-label">Dias da semana</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {dayLabels.map((d, i) => (
                  <div key={i} className={`form-chip-day ${days.includes(i) ? 'active' : ''}`} onClick={() => toggleDay(i)}>{d}</div>
                ))}
              </div>
            </div>
          )}

          {/* Periodic interval */}
          {freq === 'periodica' && (
            <div className="form-group">
              <label className="form-label">A cada quantos dias?</label>
              <input className="form-input" type="number" min="1" value={interval_} onChange={e => setInterval_(parseInt(e.target.value) || 7)} style={{ width: 100 }} />
            </div>
          )}

          {/* Date + No date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Data início</label>
              <input className="form-input" type="date" value={noDate ? '' : date} onChange={e => setDate(e.target.value)} disabled={noDate} style={{ opacity: noDate ? 0.4 : 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 10, cursor: 'pointer' }} onClick={() => setNoDate(n => !n)}>
              <div className={`check ${noDate ? 'checked' : ''}`} style={{ width: 16, height: 16, fontSize: 8 }}>{noDate && '✓'}</div>
              <span style={{ fontSize: 11, color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>Sem data</span>
            </div>
            <div className="form-group">
              <label className="form-label">Hora (tarefa única)</label>
              <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          {/* Multi-time slots */}
          <div className="form-group">
            <label className="form-label">Multi-horários (opcional)</label>
            {times.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {times.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)' }}>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{s.time}</span>
                    <span style={{ fontSize: 12, flex: 1, color: 'var(--ink-1)' }}>{s.label || '—'}</span>
                    <button onClick={() => removeTimeSlot(i)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="form-input" type="time" value={newTimeVal} onChange={e => setNewTimeVal(e.target.value)} style={{ width: 110, padding: '6px 10px', fontSize: 12 }} />
              <input className="form-input" placeholder="Label (opcional)" value={newTimeLabel} onChange={e => setNewTimeLabel(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', fontSize: 12 }} onKeyDown={e => { if (e.key === 'Enter') addTimeSlot(); }} />
              <button className="btn-ghost small" onClick={addTimeSlot} disabled={!newTimeVal}>＋</button>
            </div>
          </div>

          {/* Category */}
          {(data.categories || []).length > 0 && (
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <div className="form-chips">
                {(data.categories || []).map(c => {
                  const color = Orbita.resolveColor(c.color);
                  return (
                    <div key={c.id} className={`form-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}
                      style={cat === c.id ? { background: color + '22', borderColor: color + '55', color: '#fff' } : {}}>
                      {c.icon} {c.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Icon */}
          <div className="form-group">
            <label className="form-label">Ícone da tarefa (opcional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20, width: 30, textAlign: 'center' }}>{icon || '—'}</span>
              <EmojiPicker value={icon} onChange={setIcon} />
              {icon && <button className="btn-ghost small" onClick={() => setIcon('')}>Limpar</button>}
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Prioridade</label>
            <div className="form-chips">
              {prios.map(p => (
                <div key={p.v} className={`form-chip ${prio === p.v ? 'active' : ''}`} onClick={() => setPrio(p.v)}
                  style={prio === p.v ? {} : {}}>
                  <span className={`priority ${p.c}`} style={{ marginRight: 2 }}>●</span> {p.l}
                </div>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div className="form-group">
            <label className="form-label">Subtarefas</label>
            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {subtasks.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)' }}>
                    <div className={`check ${s.done ? 'checked' : ''}`} style={{ width: 14, height: 14, fontSize: 8 }}
                      onClick={() => setSubtasks(prev => prev.map((x, j) => j === i ? { ...x, done: !x.done } : x))}>{s.done && '✓'}</div>
                    <span style={{ flex: 1, fontSize: 12, textDecoration: s.done ? 'line-through' : 'none', color: s.done ? 'var(--ink-3)' : 'var(--ink-1)' }}>{s.text}</span>
                    <button onClick={() => removeSubtask(i)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="form-input" placeholder="Nova subtarefa..." value={newSubtask} onChange={e => setNewSubtask(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', fontSize: 12 }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } }} />
              <button className="btn-ghost small" onClick={addSubtask}>＋ Subtarefa</button>
            </div>
          </div>

          {/* Dependencies */}
          {otherTasks.length > 0 && (
            <div className="form-group">
              <label className="form-label">Depende de (tarefa que precisa ser feita antes)</label>
              <select className="form-input" value={dependsOn} onChange={e => setDependsOn(e.target.value)}>
                <option value="">Nenhuma dependência</option>
                {otherTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.icon ? t.icon + ' ' : ''}{t.text}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>
            {editTask ? 'Salvar' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HabitModal({ onClose, editHabit }) {
  const { saveHabit } = useData();
  const [name, setName] = React.useState(editHabit?.name || '');
  const [icon, setIcon] = React.useState(editHabit?.icon || '🏋️');
  const [color, setColor] = React.useState(editHabit?.color || 'green');
  const [days, setDays] = React.useState(editHabit?.days || [0,1,2,3,4,5,6]);
  const [yearGoal, setYearGoal] = React.useState(editHabit?.yearGoal || 200);

  const dayLabels = ['D','S','T','Q','Q','S','S'];
  const colors = [
    { v: 'green', c: '#3ccf91' }, { v: 'blue', c: '#5b8dff' }, { v: 'purple', c: '#b066ff' },
    { v: 'orange', c: '#ffa830' }, { v: 'red', c: '#ff5a3c' }, { v: 'pink', c: '#ff2e88' },
    { v: 'cyan', c: '#64d2ff' }, { v: 'yellow', c: '#ffd60a' },
  ];

  function toggleDay(d) { setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort()); }

  function handleSave() {
    if (!name.trim()) return;
    saveHabit({ name: name.trim(), icon, color, days, goal: days.length, yearGoal: parseInt(yearGoal) || 200 }, editHabit?.id);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editHabit ? 'Editar hábito' : 'Novo hábito'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" autoFocus placeholder="Ex: Meditar, Ler, Treinar..." value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && name.trim()) handleSave(); }} />
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <EmojiPicker label="Ícone" value={icon} onChange={setIcon} />
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Meta anual</label>
              <input className="form-input" type="number" min="1" value={yearGoal} onChange={e => setYearGoal(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Dias da semana</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {dayLabels.map((d, i) => (
                <div key={i} className={`form-chip-day ${days.includes(i) ? 'active' : ''}`} onClick={() => toggleDay(i)}>{d}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cor</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {colors.map(c => (
                <div key={c.v} onClick={() => setColor(c.v)} style={{
                  width: 28, height: 28, borderRadius: 8, background: c.c, cursor: 'pointer',
                  border: color === c.v ? '2px solid #fff' : '2px solid transparent',
                  boxShadow: color === c.v ? `0 0 12px ${c.c}` : 'none', transition: 'all 120ms',
                }} />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>
            {editHabit ? 'Salvar' : 'Criar hábito'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.TaskModal = TaskModal;
window.HabitModal = HabitModal;
