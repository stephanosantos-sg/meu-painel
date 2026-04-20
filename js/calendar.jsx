/* Orbita v2 — Calendar screen (day/week/month views) */

function ScreenCalendar() {
  const { data, toggleTask, toggleSlot } = useData();
  const [view, setView] = React.useState('week');
  const [baseDate, setBaseDate] = React.useState(new Date());
  const tasks = data.tasks || [];
  const cats = data.categories || [];
  const catMap = {}; cats.forEach(c => { catMap[c.id] = c; });

  function nav(dir) {
    const d = new Date(baseDate);
    if (view === 'day') d.setDate(d.getDate() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setBaseDate(d);
  }

  function goToday() { setBaseDate(new Date()); }

  const fmt = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(baseDate);

  return (
    <>
      <TopBar title="Calendário."
        actions={
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="btn-ghost small" onClick={goToday}>Hoje</button>
            <button className="btn-ghost small" onClick={() => nav(-1)}>←</button>
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', textTransform: 'capitalize' }}>{fmt}</span>
            <button className="btn-ghost small" onClick={() => nav(1)}>→</button>
            <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
              {['day','week','month'].map(v => (
                <button key={v} className={`tab-btn ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
                  {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
          </div>
        }
      />
      <div style={{ padding: '0 28px 40px' }}>
        {view === 'month' && <MonthView baseDate={baseDate} tasks={tasks} catMap={catMap} />}
        {view === 'week' && <WeekView baseDate={baseDate} tasks={tasks} catMap={catMap} />}
        {view === 'day' && <DayView baseDate={baseDate} tasks={tasks} catMap={catMap} />}
      </div>
    </>
  );
}

function MonthView({ baseDate, tasks, catMap }) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = Orbita.todayStr();
  const dayLabels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="panel" style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
        {dayLabels.map(d => (
          <div key={d} className="mono" style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-4)', padding: 6 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isToday = ds === today;
          const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
          const doneCount = dayTasks.filter(t => Orbita.isTaskDone(t, ds)).length;
          const hasOverdue = dayTasks.length > 0 && doneCount < dayTasks.length && ds < today;
          return (
            <div key={i} style={{
              padding: '8px 4px', borderRadius: 8, textAlign: 'center', minHeight: 60,
              background: isToday ? 'var(--gradient-neon-soft)' : 'rgba(255,255,255,0.02)',
              border: isToday ? '1px solid rgba(255,46,136,0.3)' : '1px solid transparent',
            }}>
              <div style={{ fontSize: 12, fontWeight: isToday ? 600 : 400, color: isToday ? '#fff' : 'var(--ink-2)' }}>{d}</div>
              {dayTasks.length > 0 && (
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                  {dayTasks.slice(0, 4).map((t, j) => {
                    const cat = catMap[t.cat];
                    const color = cat ? Orbita.resolveColor(cat.color) : 'var(--neon-c)';
                    const done = Orbita.isTaskDone(t, ds);
                    return <div key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: done ? 'var(--ink-4)' : color }} />;
                  })}
                  {dayTasks.length > 4 && <div className="mono" style={{ fontSize: 7, color: 'var(--ink-3)' }}>+{dayTasks.length - 4}</div>}
                </div>
              )}
              {dayTasks.length > 0 && (
                <div className="mono" style={{ fontSize: 8, color: hasOverdue ? 'var(--neon-a)' : 'var(--ink-4)', marginTop: 2 }}>
                  {doneCount}/{dayTasks.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ baseDate, tasks, catMap }) {
  const { toggleTask } = useData();
  const today = Orbita.todayStr();
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  const dayLabels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {days.map((d, i) => {
        const ds = Orbita.dateToStr(d);
        const isToday = ds === today;
        const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
        return (
          <div key={i} className="panel" style={{
            padding: 14,
            border: isToday ? '1px solid rgba(255,46,136,0.3)' : undefined,
            background: isToday ? 'rgba(255,46,136,0.06)' : undefined,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{dayLabels[i]}</div>
              <div style={{ fontSize: 20, fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : 'var(--ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                {d.getDate()}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {dayTasks.map(t => {
                const done = Orbita.isTaskDone(t, ds);
                const cat = catMap[t.cat];
                const color = cat ? Orbita.resolveColor(cat.color) : 'var(--neon-c)';
                return (
                  <div key={t.id} onClick={() => toggleTask(t.id, ds)} style={{
                    padding: '6px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    borderLeft: `2px solid ${color}`,
                    background: done ? 'rgba(255,255,255,0.02)' : `${color}11`,
                    opacity: done ? 0.45 : 1,
                    textDecoration: done ? 'line-through' : 'none',
                    color: done ? 'var(--ink-3)' : 'var(--ink-1)',
                  }}>
                    {t.icon && <span style={{ marginRight: 3 }}>{t.icon}</span>}
                    {t.text}
                    {t.time && <div className="mono" style={{ fontSize: 9, color: 'var(--ink-4)', marginTop: 2 }}>{t.time}</div>}
                  </div>
                );
              })}
              {dayTasks.length === 0 && <div style={{ fontSize: 10, color: 'var(--ink-4)', textAlign: 'center', padding: 8 }}>—</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayView({ baseDate, tasks, catMap }) {
  const { toggleTask, toggleSlot } = useData();
  const ds = Orbita.dateToStr(baseDate);
  const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
  const timed = [];
  const untimed = [];
  dayTasks.forEach(t => {
    if (t.times && t.times.length) {
      t.times.forEach(s => timed.push({ task: t, time: s.time, label: s.label, type: 'slot' }));
    } else if (t.time) {
      timed.push({ task: t, time: t.time, type: 'single' });
    } else {
      untimed.push(t);
    }
  });
  timed.sort((a, b) => a.time.localeCompare(b.time));
  const isToday = ds === Orbita.todayStr();
  const dayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(baseDate);

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="eyebrow" style={{ textTransform: 'capitalize' }}>{dayFmt}{isToday && ' · hoje'}</div>
      <h3 className="panel-title" style={{ marginTop: 4, marginBottom: 18 }}>{dayTasks.length} tarefas.</h3>
      {timed.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Com horário</div>
          {timed.map((item, i) => {
            const done = item.type === 'slot'
              ? Orbita.isSlotDone(item.task, ds, item.time)
              : Orbita.isTaskDone(item.task, ds);
            const cat = catMap[item.task.cat];
            const color = cat ? Orbita.resolveColor(cat.color) : 'var(--neon-c)';
            return (
              <div key={i} onClick={() => item.type === 'slot' ? toggleSlot(item.task.id, ds, item.time) : toggleTask(item.task.id, ds)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                  borderLeft: `3px solid ${color}`, marginBottom: 6, cursor: 'pointer',
                  background: done ? 'rgba(255,255,255,0.02)' : `${color}08`,
                  opacity: done ? 0.45 : 1,
                }}>
                <div className={`check ${done ? 'checked' : ''}`} style={{ width: 16, height: 16, fontSize: 8 }}>{done && '✓'}</div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', width: 40 }}>{item.time}</span>
                <span style={{ fontSize: 13, fontWeight: 500, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--ink-3)' : 'var(--ink-1)' }}>
                  {item.task.icon && <span style={{ marginRight: 4 }}>{item.task.icon}</span>}
                  {item.label || item.task.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {untimed.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Sem horário</div>
          <div className="task-list">
            {untimed.map(t => <TaskItem key={t.id} task={t} dateCtx={ds} catMap={catMap} />)}
          </div>
        </div>
      )}
      {dayTasks.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: 'var(--ink-3)' }}>Nenhuma tarefa neste dia</div>}
    </div>
  );
}

window.ScreenCalendar = ScreenCalendar;
