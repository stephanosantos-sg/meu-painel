/* Orbita v2 — Screen: Hoje — with view tabs (Lista, Timeline, Kanban, Semana, Mês) */

function ScreenToday({ onNewTask }) {
  const { data, toggleTask, toggleSlot, toggleHabitDay } = useData();
  const [view, setView] = React.useState('list');
  const [weekBase, setWeekBase] = React.useState(new Date());
  const [monthBase, setMonthBase] = React.useState(new Date());
  const [filterCat, setFilterCat] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    function onFilterCat(e) { setFilterCat(e.detail); }
    window.addEventListener('orbita:filterCat', onFilterCat);
    return () => window.removeEventListener('orbita:filterCat', onFilterCat);
  }, []);
  const [filterTypes, setFilterTypes] = React.useState({ pontual: true, recorrente: true, evento: true, habito: true });
  const today = Orbita.todayStr();
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  const fmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const dow = now.getDay();

  const tasks = data.tasks || [];
  const cats = data.categories || [];
  const catMap = {}; cats.forEach(c => { catMap[c.id] = c; });

  const allTodayTasks = tasks.filter(t => Orbita.isTaskForDate(t, today));
  const catFiltered = filterCat === 'all' ? allTodayTasks : allTodayTasks.filter(t => t.cat === filterCat);
  const todayTasks = catFiltered.filter(t => {
    const hasTime = t.time || (t.times && t.times.length > 0);
    if (t.freq === 'pontual' && !filterTypes.pontual) return false;
    if (t.freq !== 'pontual' && !filterTypes.recorrente) return false;
    if (hasTime && !filterTypes.evento) return false;
    return true;
  });
  const showHabitsInList = filterTypes.habito;
  const overdueTasks = tasks.filter(t => {
    if (t.done || !t.date || t.date >= today) return false;
    if (t.freq !== 'pontual') return false;
    if (filterCat !== 'all' && t.cat !== filterCat) return false;
    return !t.done;
  });

  const todayHabits = (data.habits || []).filter(hab => (hab.days || [0,1,2,3,4,5,6]).includes(dow));
  const habitsDone = todayHabits.filter(hab => hab.log && hab.log[today]).length;
  const xp = data.xp || { total: 0, level: 1 };
  const lvlStart = Orbita.getTotalXPForLevel(xp.level);
  const lvlEnd = Orbita.getTotalXPForLevel(xp.level + 1);
  const pct = lvlEnd > lvlStart ? Math.round((xp.total - lvlStart) / (lvlEnd - lvlStart) * 100) : 0;
  const doneTodayCount = todayTasks.filter(t => Orbita.isTaskDone(t, today)).length;


  const views = [
    { id: 'list', label: 'Lista' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'kanban', label: 'Kanban' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' },
  ];

  return (
    <>
      <TopBar title={`${greet}, Stephano.`} subtitle={fmt}
        actions={<>
          <span className="chip chip-neon">Lvl {xp.level} · {pct}%</span>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={onNewTask}>＋ Nova tarefa</button>
          <button onClick={() => window._startPomo && window._startPomo()} style={{
            width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 10, fontSize: 16, cursor: 'pointer',
            background: 'rgba(255,46,136,0.12)', border: '1px solid rgba(255,46,136,0.3)', color: 'var(--neon-a)', transition: 'all 120ms',
          }} title="Pomodoro">🍅</button>
        </>}
      />

      {/* Daily quote */}
      <DailyQuote />

      {/* Upcoming holidays */}
      <UpcomingHolidays />

      {/* View tabs */}
      <div className="tab-scroll" style={{ padding: '0 28px 8px', display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto' }}>
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: view === v.id ? 'var(--gradient-neon-soft)' : 'transparent',
            border: view === v.id ? '1px solid rgba(255,46,136,0.22)' : '1px solid var(--line)',
            color: view === v.id ? '#fff' : 'var(--ink-3)',
            fontFamily: 'var(--font-ui)', transition: 'all 120ms', whiteSpace: 'nowrap',
          }}>{v.label}</button>
        ))}
        {(view === 'week' || view === 'month') && <>
          <div style={{ width: 1, height: 20, background: 'var(--line)', marginLeft: 4 }} />
          <button className="btn-ghost small" onClick={() => { view === 'week' ? setWeekBase(new Date()) : setMonthBase(new Date()); }}>Hoje</button>
          <button className="btn-ghost small" onClick={() => { const d = new Date(view === 'week' ? weekBase : monthBase); view === 'week' ? d.setDate(d.getDate() - 7) : d.setMonth(d.getMonth() - 1); view === 'week' ? setWeekBase(d) : setMonthBase(d); }}>←</button>
          <button className="btn-ghost small" onClick={() => { const d = new Date(view === 'week' ? weekBase : monthBase); view === 'week' ? d.setDate(d.getDate() + 7) : d.setMonth(d.getMonth() + 1); view === 'week' ? setWeekBase(d) : setMonthBase(d); }}>→</button>
        </>}
      </div>

      {/* Filters row */}
      <div className="tab-scroll" style={{ padding: '0 28px 14px', display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto' }}>
        {[
          { key: 'pontual', label: 'Pontuais', color: '#b066ff' },
          { key: 'recorrente', label: 'Recorrentes', color: '#5b8dff' },
          { key: 'evento', label: 'Eventos', color: '#ffa830' },
          { key: 'habito', label: 'Hábitos', color: '#3ccf91' },
        ].map(f => {
          const on = filterTypes[f.key];
          return (
            <button key={f.key} onClick={() => setFilterTypes(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                background: on ? f.color + '18' : 'transparent', border: on ? `1px solid ${f.color}44` : '1px solid var(--line)',
                color: on ? f.color : 'var(--ink-4)', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-ui)',
                transition: 'all 120ms', whiteSpace: 'nowrap',
              }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: on ? f.color : 'var(--ink-4)', flexShrink: 0 }} />
              {f.label}
            </button>
          );
        })}
        {cats.length > 0 && <>
          <div style={{ width: 1, height: 16, background: 'var(--line)', marginLeft: 2 }} />
          <button onClick={() => setFilterCat('all')} style={{
            padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
            background: filterCat === 'all' ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: filterCat === 'all' ? '1px solid var(--line-2)' : '1px solid transparent',
            color: filterCat === 'all' ? 'var(--ink-1)' : 'var(--ink-4)', fontFamily: 'var(--font-ui)',
          }}>Todas</button>
          {cats.map(c => {
            const color = Orbita.resolveColor(c.color);
            return (
              <button key={c.id} onClick={() => setFilterCat(filterCat === c.id ? 'all' : c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
                background: filterCat === c.id ? color + '22' : 'transparent',
                border: filterCat === c.id ? `1px solid ${color}44` : '1px solid transparent',
                color: filterCat === c.id ? color : 'var(--ink-4)', fontFamily: 'var(--font-ui)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: color }} /> {c.name}
              </button>
            );
          })}
        </>}
      </div>

      {/* List view (default) */}
      {view === 'list' && (
        <div className="screen-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {overdueTasks.length > 0 && (
              <div className="panel" style={{ borderLeft: '3px solid var(--neon-a)' }}>
                <div className="eyebrow" style={{ color: 'var(--neon-a)', marginBottom: 12 }}>⚠ Atrasadas · {overdueTasks.length}</div>
                <div className="task-list">
                  {overdueTasks.map(t => <TaskItem key={t.id} task={t} dateCtx={t.date} catMap={catMap} />)}
                </div>
              </div>
            )}
            {(() => {
              const pending = todayTasks.filter(t => !Orbita.isTaskDone(t, today));
              const done = todayTasks.filter(t => Orbita.isTaskDone(t, today));
              const sortByTime = (a, b) => {
                const aT = a.time || (a.times && a.times[0] && a.times[0].time) || 'zz';
                const bT = b.time || (b.times && b.times[0] && b.times[0].time) || 'zz';
                return aT !== bT ? aT.localeCompare(bT) : (a.prio || 4) - (b.prio || 4);
              };
              return <>
                {pending.length > 0 && (
                  <div className="panel">
                    <div className="eyebrow" style={{ marginBottom: 12 }}>Pendentes · {pending.length}</div>
                    <div className="task-list">
                      {pending.sort(sortByTime).map(t => <TaskItem key={t.id} task={t} dateCtx={today} catMap={catMap} />)}
                    </div>
                  </div>
                )}
                {pending.length === 0 && todayTasks.length > 0 && (
                  <div className="panel" style={{ textAlign: 'center', padding: '24px', background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#30d158' }}>Tudo feito por hoje!</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{doneTodayCount} tarefas concluídas</div>
                  </div>
                )}
                {pending.length === 0 && todayTasks.length === 0 && (
                  <div className="panel" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-3)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
                    <div style={{ fontSize: 13 }}>Nenhuma tarefa neste filtro</div>
                  </div>
                )}
                {done.length > 0 && (
                  <details style={{ marginTop: 4 }}>
                    <summary style={{ cursor: 'pointer', padding: '8px 0', fontSize: 12, color: 'var(--ink-3)', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10 }}>▸</span> Feitos hoje · {done.length}
                    </summary>
                    <div className="panel" style={{ marginTop: 4, opacity: 0.6 }}>
                      <div className="task-list">
                        {done.sort(sortByTime).map(t => <TaskItem key={t.id} task={t} dateCtx={today} catMap={catMap} />)}
                      </div>
                    </div>
                  </details>
                )}
              </>;
            })()}
            {showHabitsInList && todayHabits.length > 0 && (
              <div className="panel">
                <div className="eyebrow" style={{ marginBottom: 12 }}>Hábitos de hoje · {habitsDone}/{todayHabits.length}</div>
                <div className="task-list">
                  {todayHabits.map(hab => {
                    const done = hab.log && hab.log[today];
                    const streak = Orbita.getStreak(hab);
                    const hColor = Orbita.resolveColor(hab.color);
                    return (
                      <div key={hab.id} className={`task-item ${done ? 'done' : ''}`} onClick={() => toggleHabitDay(hab.id, today)} style={{ cursor: 'pointer' }}>
                        <div className={`check ${done ? 'checked' : ''}`} style={{ width: 22, height: 22, fontSize: 11, background: done ? hColor : undefined, borderColor: done ? 'transparent' : undefined }}>{done && '✓'}</div>
                        <div style={{ flex: 1 }}>
                          <div className="task-text">{hab.icon && <span style={{ marginRight: 6 }}>{hab.icon}</span>}{hab.name}</div>
                          <div className="task-meta">
                            <span className="mono" style={{ fontSize: 10, color: hColor }}>🔥 {streak}</span>
                            <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{(hab.days||[]).length}x/sem</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <RightPanel xp={xp} pct={pct} lvlEnd={lvlEnd} doneTodayCount={doneTodayCount} todayTasks={todayTasks}
            todayHabits={todayHabits} habitsDone={habitsDone} today={today} />
        </div>
      )}

      {/* Timeline view */}
      {view === 'timeline' && <TimelineView tasks={tasks} catMap={catMap} today={today} nowH={h + now.getMinutes()/60}
        xp={xp} pct={pct} lvlEnd={lvlEnd} doneTodayCount={doneTodayCount} todayTasks={todayTasks}
        todayHabits={todayHabits} habitsDone={habitsDone} />}

      {/* Kanban view */}
      {view === 'kanban' && <KanbanView tasks={todayTasks} cats={cats} catMap={catMap} today={today} />}

      {/* Week view */}
      {view === 'week' && <WeekViewInline baseDate={weekBase} tasks={tasks} catMap={catMap} />}

      {/* Month view */}
      {view === 'month' && <MonthViewInline baseDate={monthBase} tasks={tasks} catMap={catMap} />}

    </>
  );
}

/* ── Right panel (XP + stats + habits) ── */
function RightPanel({ xp, pct, lvlEnd, doneTodayCount, todayTasks, todayHabits, habitsDone, today }) {
  const { toggleHabitDay } = useData();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel" style={{ padding: 20 }}>
        <div className="eyebrow">Progresso do nível</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6, marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 30, lineHeight: 1 }}>Lvl {xp.level} → {xp.level + 1}</h3>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{pct}%</span>
        </div>
        <div className="xp-bar" style={{ height: 8 }}><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{xp.total.toLocaleString()} xp</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>faltam {(lvlEnd - xp.total).toLocaleString()}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="panel" style={{ padding: 16 }}>
          <div className="eyebrow">Feitas hoje</div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1, marginTop: 6 }}>{doneTodayCount}/{todayTasks.length}</div>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div className="eyebrow">Hábitos</div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1, marginTop: 6 }}>{habitsDone}/{todayHabits.length}</div>
        </div>
      </div>
      <div className="panel" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Hábitos de hoje</div>
        {todayHabits.length === 0 && <div style={{ fontSize: 13, color: 'var(--ink-3)', padding: '12px 0' }}>Nenhum hábito para hoje</div>}
        {todayHabits.map(hab => {
          const done = hab.log && hab.log[today];
          const streak = Orbita.getStreak(hab);
          const hColor = Orbita.resolveColor(hab.color);
          return (
            <div key={hab.id} onClick={() => toggleHabitDay(hab.id, today)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', marginBottom: 2, borderRadius: 8, cursor: 'pointer', opacity: done ? 0.5 : 1, transition: 'all 200ms', background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
              <div className={`check ${done ? 'checked' : ''}`} style={done ? { background: hColor, borderColor: 'transparent' } : {}}>{done && '✓'}</div>
              <span style={{ fontSize: 14 }}>{hab.icon || '⭐'}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, textDecoration: done ? 'line-through' : 'none' }}>{hab.name}</span>
              {streak > 0 && <span className="mono" style={{ fontSize: 10, color: '#ff5a3c' }}>🔥 {streak}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Timeline view ── */
function TimelineView({ tasks, catMap, today, nowH, xp, pct, lvlEnd, doneTodayCount, todayTasks, todayHabits, habitsDone }) {
  const { toggleTask, toggleSlot } = useData();
  const timedItems = [];
  todayTasks.forEach(t => {
    if (t.times && t.times.length) {
      t.times.forEach(s => timedItems.push({ task: t, time: s.time, label: s.label, type: 'slot' }));
    } else if (t.time) {
      timedItems.push({ task: t, time: t.time, type: 'single' });
    }
  });
  timedItems.sort((a, b) => a.time.localeCompare(b.time));

  const events = timedItems.map(item => {
    const [hh, mm] = item.time.split(':').map(Number);
    const start = hh + mm / 60;
    const done = item.type === 'slot' ? Orbita.isSlotDone(item.task, today, item.time) : Orbita.isTaskDone(item.task, today);
    const cat = catMap[item.task.cat];
    const color = cat ? Orbita.resolveColor(cat.color) : '#b066ff';
    return { start, end: start + 0.5, text: item.label || item.task.text, done, color, icon: item.task.icon || '', taskId: item.task.id, slotTime: item.type === 'slot' ? item.time : null };
  });

  const hours = [];
  for (let i = 6; i <= 22; i++) hours.push(String(i).padStart(2, '0'));

  return (
    <div className="screen-grid">
      <div className="panel">
        <div className="panel-head">
          <div>
            <div className="eyebrow">Timeline · 6h → 22h</div>
            <h3 className="panel-title">Seu dia.</h3>
          </div>
        </div>
        <div className="timeline">
          {hours.map((hr, i) => (
            <div key={hr} className="timeline-row">
              <div className="timeline-hour mono">{hr}:00</div>
              <div className="timeline-slot">
                {parseInt(hr) === Math.floor(nowH) && (
                  <div className="now-line" style={{ top: `${(nowH - parseInt(hr)) * 60}px` }}>
                    <span className="now-dot" /><span className="mono">agora</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {events.map((e, i) => {
            const top = (e.start - 6) * 60;
            const height = Math.max(32, (e.end - e.start) * 60 - 4);
            return (
              <div key={i} className={`timeline-event ${e.done ? 'done' : ''}`}
                onClick={() => e.slotTime ? toggleSlot(e.taskId, today, e.slotTime) : toggleTask(e.taskId, today)}
                style={{ top, height, borderLeftColor: e.color, background: `linear-gradient(90deg, ${e.color}22, ${e.color}08)`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className={`check ${e.done ? 'checked' : ''}`} style={{ width: 14, height: 14, fontSize: 7 }}>{e.done && '✓'}</div>
                  {e.icon && <span style={{ fontSize: 12 }}>{e.icon}</span>}
                  <span style={{ fontSize: 12, fontWeight: 500, flex: 1, textDecoration: e.done ? 'line-through' : 'none', color: e.done ? 'var(--ink-3)' : 'var(--ink-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.text}</span>
                  <span className="mono" style={{ fontSize: 9, color: e.done ? 'var(--ink-4)' : e.color }}>+5</span>
                </div>
              </div>
            );
          })}
        </div>
        {events.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: 'var(--ink-3)' }}>Nenhuma tarefa com horário hoje</div>}
      </div>
      <RightPanel xp={xp} pct={pct} lvlEnd={lvlEnd} doneTodayCount={doneTodayCount} todayTasks={todayTasks}
        todayHabits={todayHabits} habitsDone={habitsDone} today={today} />
    </div>
  );
}

/* ── Kanban view ── */
function KanbanView({ tasks, cats, catMap, today }) {
  const { toggleTask } = useData();
  const groups = {};
  const noCat = { id: '_none', name: 'Sem categoria', icon: '📋', color: '#b066ff' };
  tasks.forEach(t => {
    const catId = t.cat || '_none';
    if (!groups[catId]) {
      const cat = cats.find(c => c.id === catId) || noCat;
      groups[catId] = { cat, items: [] };
    }
    groups[catId].items.push(t);
  });
  const cols = Object.values(groups);
  if (cols.length === 0) cols.push({ cat: noCat, items: [] });

  return (
    <div className="kanban" style={{ height: 'calc(100vh - 220px)' }}>
      {cols.map(col => {
        const color = Orbita.resolveColor(col.cat.color);
        return (
          <div key={col.cat.id} className="kanban-col">
            <div className="kanban-col-head" style={{ borderBottom: `1px solid ${color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{col.cat.icon} {col.cat.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{col.items.length}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10, overflowY: 'auto' }}>
              {col.items.map(t => {
                const done = Orbita.isTaskDone(t, today);
                const prioClass = t.prio === 1 ? 'p1' : t.prio === 2 ? 'p2' : t.prio === 3 ? 'p3' : 'p4';
                const prioLabel = t.prio === 1 ? 'urgente' : t.prio === 2 ? 'alta' : t.prio === 3 ? 'média' : 'normal';
                return (
                  <div key={t.id} className="kanban-card" onClick={() => toggleTask(t.id, today)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div className={`check ${done ? 'checked' : ''}`} style={{ marginTop: 2 }}>{done && '✓'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--ink-3)' : 'var(--ink-1)' }}>
                          {t.icon && <span style={{ marginRight: 4 }}>{t.icon}</span>}{t.text}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                          <span className={`priority ${prioClass}`}>{prioLabel}</span>
                          {t.time && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>⏱ {t.time}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Week view (inline) ── */
function WeekViewInline({ baseDate, tasks, catMap }) {
  const { toggleTask } = useData();
  const today = Orbita.todayStr();
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(d.getDate() + i); days.push(d); }
  const dayLabels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, padding: '0 28px 40px' }}>
      {days.map((d, i) => {
        const ds = Orbita.dateToStr(d);
        const isToday = ds === today;
        const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
        return (
          <div key={i} className="panel" style={{
            padding: 14, minHeight: 200,
            border: isToday ? '1px solid rgba(255,46,136,0.3)' : undefined,
            background: isToday ? 'rgba(255,46,136,0.06)' : undefined,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{dayLabels[i]}</div>
              <div style={{ fontSize: 20, fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : 'var(--ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{d.getDate()}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {dayTasks.map(t => {
                const done = Orbita.isTaskDone(t, ds);
                const cat = catMap[t.cat];
                const color = cat ? Orbita.resolveColor(cat.color) : 'var(--neon-c)';
                return (
                  <div key={t.id} onClick={() => toggleTask(t.id, ds)} style={{
                    padding: '6px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    borderLeft: `2px solid ${color}`, background: done ? 'rgba(255,255,255,0.02)' : `${color}11`,
                    opacity: done ? 0.45 : 1, textDecoration: done ? 'line-through' : 'none',
                    color: done ? 'var(--ink-3)' : 'var(--ink-1)',
                  }}>
                    {t.icon && <span style={{ marginRight: 3 }}>{t.icon}</span>}{t.text}
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

/* ── Month view (inline) ── */
function MonthViewInline({ baseDate, tasks, catMap }) {
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
    <div className="panel" style={{ padding: 20, margin: '0 28px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
        {dayLabels.map(d => <div key={d} className="mono" style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-4)', padding: 6 }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isToday = ds === today;
          const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
          const doneCount = dayTasks.filter(t => Orbita.isTaskDone(t, ds)).length;
          return (
            <div key={i} style={{
              padding: '8px 4px', borderRadius: 8, textAlign: 'center', minHeight: 60,
              background: isToday ? 'var(--gradient-neon-soft)' : 'rgba(255,255,255,0.02)',
              border: isToday ? '1px solid rgba(255,46,136,0.3)' : '1px solid transparent',
            }}>
              <div style={{ fontSize: 12, fontWeight: isToday ? 600 : 400, color: isToday ? '#fff' : 'var(--ink-2)' }}>{d}</div>
              {dayTasks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 4, textAlign: 'left' }}>
                  {dayTasks.slice(0, 3).map((t, j) => {
                    const ct = catMap[t.cat];
                    const clr = ct ? Orbita.resolveColor(ct.color) : 'var(--neon-c)';
                    const dn = Orbita.isTaskDone(t, ds);
                    return (
                      <div key={j} style={{ fontSize: 8, lineHeight: 1.3, padding: '1px 3px', borderRadius: 3, borderLeft: `2px solid ${clr}`, background: `${clr}11`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: dn ? 0.4 : 1, textDecoration: dn ? 'line-through' : 'none' }}>
                        {t.icon && <span style={{ marginRight: 1 }}>{t.icon}</span>}{t.text}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && <div className="mono" style={{ fontSize: 7, color: 'var(--ink-3)', textAlign: 'center' }}>+{dayTasks.length - 3} mais</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── TaskItem — with working subtask toggles and bigger click targets ── */
function TaskItem({ task, dateCtx, catMap }) {
  const { toggleTask, toggleSlot, toggleSubtask } = useData();
  const t = task;
  const done = Orbita.isTaskDone(t, dateCtx);
  const cat = catMap[t.cat];
  const color = cat ? Orbita.resolveColor(cat.color) : null;
  const prioClass = t.prio === 1 ? 'p1' : t.prio === 2 ? 'p2' : t.prio === 3 ? 'p3' : 'p4';
  const prioLabel = t.prio === 1 ? 'urgente' : t.prio === 2 ? 'alta' : t.prio === 3 ? 'média' : '';
  const hasSlots = t.times && t.times.length > 0;

  function onMainClick(e) {
    if (hasSlots) return;
    toggleTask(t.id, dateCtx);
  }

  return (
    <div className={`task-item ${done ? 'done' : ''}`}
      onClick={onMainClick}
      style={{ cursor: hasSlots ? 'default' : 'pointer' }}>
      {!hasSlots && (
        <div className={`check ${done ? 'checked' : ''}`} style={{ width: 22, height: 22, fontSize: 11, flexShrink: 0 }}>
          {done && '✓'}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="task-text">
          {t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}{t.text}
        </div>
        <div className="task-meta">
          {prioLabel && <span className={`priority ${prioClass}`}>{prioLabel}</span>}
          {t.time && !hasSlots && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>⏱ {t.time}</span>}
          {cat && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: color + '22', color: color }}>{cat.icon} {cat.name}</span>}
          {t.freq !== 'pontual' && <span className="mono" style={{ fontSize: 9.5, color: 'var(--ink-3)' }}>{t.freq}</span>}
        </div>
        {/* Multi-slot times */}
        {hasSlots && (
          <div className="task-slots">
            {t.times.map(s => {
              const slotDone = Orbita.isSlotDone(t, dateCtx, s.time);
              return (
                <div key={s.time} className={`task-slot ${slotDone ? 'done' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleSlot(t.id, dateCtx, s.time); }}
                  style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: 8, background: slotDone ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', transition: 'all 140ms' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = slotDone ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)'}>
                  <div className={`check ${slotDone ? 'checked' : ''}`} style={{ width: 16, height: 16, fontSize: 8 }}>{slotDone && '✓'}</div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.time}</span>
                  <span style={{ fontSize: 12.5, textDecoration: slotDone ? 'line-through' : 'none', color: slotDone ? 'var(--ink-3)' : 'var(--ink-1)' }}>{s.label || t.text}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* Subtasks — clickable! */}
        {t.subtasks && t.subtasks.length > 0 && (
          <div className="subtask-list" style={{ marginTop: 8 }}>
            {t.subtasks.map((s, i) => (
              <div key={i} className="subtask-item"
                onClick={e => { e.stopPropagation(); toggleSubtask(t.id, i); }}
                style={{ cursor: 'pointer', padding: '4px 6px', borderRadius: 6, transition: 'background 100ms' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className={`check ${s.done ? 'checked' : ''}`} style={{ width: 14, height: 14, fontSize: 7 }}>{s.done && '✓'}</div>
                <span style={{ textDecoration: s.done ? 'line-through' : 'none', color: s.done ? 'var(--ink-3)' : 'var(--ink-2)' }}>{s.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Daily Stoic Quote ── */
function DailyQuote() {
  const quotes = [
    { text: 'Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.', author: 'Sêneca' },
    { text: 'A felicidade da sua vida depende da qualidade dos seus pensamentos.', author: 'Marco Aurélio' },
    { text: 'Temos duas orelhas e uma boca para que possamos ouvir o dobro do que falamos.', author: 'Epicteto' },
    { text: 'A alma toma a cor dos seus pensamentos.', author: 'Marco Aurélio' },
    { text: 'Não é o homem que tem pouco, mas o que deseja muito, que é pobre.', author: 'Sêneca' },
    { text: 'O impedimento à ação impulsiona a ação. O que está no caminho se torna o caminho.', author: 'Marco Aurélio' },
    { text: 'Somos o que repetidamente fazemos. A excelência, portanto, não é um ato, mas um hábito.', author: 'Aristóteles' },
    { text: 'A vida não examinada não vale a pena ser vivida.', author: 'Sócrates' },
    { text: 'Sorte é o que acontece quando a preparação encontra a oportunidade.', author: 'Sêneca' },
    { text: 'Você tem poder sobre sua mente — não sobre eventos externos. Perceba isso e encontrará força.', author: 'Marco Aurélio' },
    { text: 'A riqueza não consiste em ter grandes posses, mas em ter poucas necessidades.', author: 'Epicteto' },
    { text: 'O segredo da mudança é focar toda a sua energia não em lutar contra o velho, mas em construir o novo.', author: 'Sócrates' },
    { text: 'Quem conquista a si mesmo é mais poderoso do que quem conquista mil vezes mil homens em batalha.', author: 'Buda' },
    { text: 'A disciplina é a ponte entre metas e conquistas.', author: 'Jim Rohn' },
    { text: 'Perde-se frequentemente pela hesitação o que se poderia ganhar pelo risco.', author: 'Sêneca' },
    { text: 'Não busque que os eventos aconteçam como você deseja, mas deseje que aconteçam como acontecem, e tudo ficará bem.', author: 'Epicteto' },
    { text: 'Quando você se levantar de manhã, pense no privilégio que é estar vivo — respirar, pensar, aproveitar, amar.', author: 'Marco Aurélio' },
    { text: 'O homem que move montanhas começa carregando pequenas pedras.', author: 'Confúcio' },
    { text: 'A virtude é o único bem verdadeiro; o vício, o único mal verdadeiro.', author: 'Sêneca' },
    { text: 'Nada grandioso foi jamais realizado sem entusiasmo.', author: 'Emerson' },
    { text: 'Primeiro diga a si mesmo o que você quer ser; depois faça o que tem que fazer.', author: 'Epicteto' },
    { text: 'A melhor vingança é não ser como seu inimigo.', author: 'Marco Aurélio' },
    { text: 'Não é que tenhamos pouco tempo, é que desperdiçamos muito.', author: 'Sêneca' },
    { text: 'Conhece-te a ti mesmo.', author: 'Sócrates' },
    { text: 'Tudo o que ouvimos é uma opinião, não um fato. Tudo o que vemos é uma perspectiva, não a verdade.', author: 'Marco Aurélio' },
    { text: 'A mente que se abre a uma nova ideia jamais volta ao seu tamanho original.', author: 'Einstein' },
    { text: 'Sofrer antes do necessário é sofrer mais do que o necessário.', author: 'Sêneca' },
    { text: 'A educação é a arma mais poderosa que você pode usar para mudar o mundo.', author: 'Mandela' },
    { text: 'Cuide do seu corpo. É o único lugar que você tem para viver.', author: 'Jim Rohn' },
    { text: 'Se queres prever o futuro, estuda o passado.', author: 'Confúcio' },
    { text: 'A persistência é o caminho do êxito.', author: 'Charles Chaplin' },
  ];
  // One quote per day based on day-of-year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const q = quotes[dayOfYear % quotes.length];

  return (
    <div style={{ padding: '0 28px 10px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.5 }}>
        "{q.text}"
      </div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>— {q.author}</div>
    </div>
  );
}

/* ── Upcoming Holidays (Brazil) ── */
function UpcomingHolidays() {
  const year = new Date().getFullYear();

  function easter(y) {
    const a=y%19, b=Math.floor(y/100), c=y%100, d=Math.floor(b/4), e=b%4, f=Math.floor((b+8)/25);
    const g=Math.floor((b-f+1)/3), h=(19*a+b-d-g+15)%30, i=Math.floor(c/4), k=c%4;
    const l=(32+2*e+2*i-h-k)%7, m=Math.floor((a+11*h+22*l)/451);
    const month=Math.floor((h+l-7*m+114)/31), day=((h+l-7*m+114)%31)+1;
    return new Date(y, month-1, day);
  }
  const e = easter(year);
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const fmtMD = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;

  const holidays = [
    { date: new Date(year, 0, 1), name: 'Confraternização Universal', icon: '🎆' },
    { date: addDays(e, -47), name: 'Carnaval', icon: '🎭' },
    { date: addDays(e, -46), name: 'Quarta de Cinzas', icon: '✝️' },
    { date: addDays(e, -2), name: 'Sexta-Feira Santa', icon: '✝️' },
    { date: e, name: 'Páscoa', icon: '🐣' },
    { date: new Date(year, 3, 21), name: 'Tiradentes', icon: '🇧🇷' },
    { date: new Date(year, 4, 1), name: 'Dia do Trabalho', icon: '👷' },
    { date: addDays(e, 60), name: 'Corpus Christi', icon: '✝️' },
    { date: new Date(year, 5, 12), name: 'Dia dos Namorados', icon: '💕' },
    { date: new Date(year, 5, 24), name: 'São João', icon: '🎆' },
    { date: new Date(year, 7, 11), name: 'Dia dos Pais', icon: '👨' },
    { date: new Date(year, 8, 7), name: 'Independência', icon: '🇧🇷' },
    { date: new Date(year, 9, 12), name: 'N. Sra. Aparecida', icon: '🙏' },
    { date: new Date(year, 10, 2), name: 'Finados', icon: '🕯️' },
    { date: new Date(year, 10, 15), name: 'Proclamação da República', icon: '🇧🇷' },
    { date: new Date(year, 10, 20), name: 'Consciência Negra', icon: '✊' },
    { date: new Date(year, 11, 25), name: 'Natal', icon: '🎄' },
    { date: new Date(year, 11, 31), name: 'Réveillon', icon: '🎆' },
    { date: new Date(year + 1, 0, 1), name: 'Confraternização Universal', icon: '🎆' },
  ];

  const now = new Date(); now.setHours(0,0,0,0);
  const limit = new Date(now); limit.setDate(limit.getDate() + 15);
  const upcoming = holidays.filter(h => h.date >= now && h.date <= limit);

  if (upcoming.length === 0) return null;

  return (
    <div style={{ padding: '0 28px 8px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <span className="eyebrow" style={{ fontSize: 9 }}>Próximos feriados:</span>
      {upcoming.map((h, i) => (
        <span key={i} style={{ fontSize: 11, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{h.icon}</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{fmtMD(h.date)}</span>
          <span>{h.name}</span>
        </span>
      ))}
    </div>
  );
}

window.ScreenToday = ScreenToday;
window.TaskItem = TaskItem;
