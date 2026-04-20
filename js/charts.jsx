/* Orbita v2 — Gráficos (full stats page) */

function ScreenCharts() {
  const { data } = useData();
  const tasks = data.tasks || [];
  const habits = data.habits || [];
  const goals = data.goals || [];
  const cats = data.categories || [];
  const today = Orbita.todayStr();

  // Last 7 days
  const last7 = [];
  const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = Orbita.dateToStr(d);
    const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
    const done = dayTasks.filter(t => Orbita.isTaskDone(t, ds)).length;
    last7.push({ ds, day: d.getDate(), dow: dayNames[d.getDay()], total: dayTasks.length, done, isToday: ds === today });
  }
  const maxTasks = Math.max(1, ...last7.map(d => d.done));

  // Habits last 7 days
  const last7Habits = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = Orbita.dateToStr(d);
    const dow = d.getDay();
    const scheduled = habits.filter(h => (h.days || [0,1,2,3,4,5,6]).includes(dow));
    const done = scheduled.filter(h => h.log && h.log[ds]).length;
    last7Habits.push({ ds, day: d.getDate(), dow: dayNames[d.getDay()], total: scheduled.length, done, isToday: ds === today });
  }
  const maxHabits = Math.max(1, ...last7Habits.map(d => d.done));

  // Tasks by category
  const catCounts = cats.map(c => {
    const count = tasks.filter(t => t.cat === c.id && Orbita.isTaskForDate(t, today)).length;
    return { ...c, count };
  }).sort((a, b) => b.count - a.count);
  const maxCatCount = Math.max(1, ...catCounts.map(c => c.count));

  // Completion rate by frequency
  const freqs = ['diaria','semanal','mensal','pontual'];
  const freqLabels = { diaria: 'Diária', semanal: 'Semanal', mensal: 'Mensal', pontual: 'Pontual' };
  const freqColors = { diaria: '#ff2e88', semanal: '#5b8dff', mensal: '#ffa830', pontual: '#b066ff' };
  const freqStats = freqs.map(f => {
    const ft = tasks.filter(t => t.freq === f);
    const todayFt = ft.filter(t => Orbita.isTaskForDate(t, today));
    const doneFt = todayFt.filter(t => Orbita.isTaskDone(t, today));
    return { freq: f, label: freqLabels[f], color: freqColors[f], total: todayFt.length, done: doneFt.length, pct: todayFt.length ? Math.round(doneFt.length / todayFt.length * 100) : 0 };
  });

  // Habit streaks ranking
  const habitStreaks = habits.map(h => ({
    name: h.name, icon: h.icon || '⭐', color: Orbita.resolveColor(h.color),
    streak: Orbita.getStreak(h),
  })).sort((a, b) => b.streak - a.streak);

  // Goal progress
  const goalProgress = goals.map(g => {
    const ms = g.milestones || [];
    const done = ms.filter(m => m.done).length;
    const pct = ms.length ? Math.round(done / ms.length * 100) : 0;
    return { title: g.title, pct };
  });

  // Last 7 days task+habit detail
  const last7Detail = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = Orbita.dateToStr(d);
    const dow = d.getDay();
    const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds)).slice(0, 6);
    const dayHabits = habits.filter(h => (h.days || [0,1,2,3,4,5,6]).includes(dow) && h.log && h.log[ds]);
    const more = tasks.filter(t => Orbita.isTaskForDate(t, ds)).length - 6;
    last7Detail.push({ ds, day: d.getDate(), dow: dayNames[d.getDay()], isToday: ds === today, tasks: dayTasks, habits: dayHabits, more: Math.max(0, more) });
  }

  return (
    <>
      <TopBar title="Gráficos." subtitle="Acompanhamento do seu progresso" />
      <div style={{ padding: '0 28px 40px' }}>
        {/* Top row: Tasks 7d, Habits 7d, By category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }} className="charts-grid">
          {/* Tasks 7 days */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>Tarefas concluídas.</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
              {last7.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-2)' }}>{d.done || ''}</span>
                  <div style={{
                    width: '100%', borderRadius: 4,
                    height: `${Math.max(4, (d.done / maxTasks) * 100)}%`,
                    background: d.isToday ? 'var(--gradient-neon)' : 'rgba(91,141,255,0.5)',
                    transition: 'height 300ms',
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {last7.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: 9, color: d.isToday ? '#fff' : 'var(--ink-3)', fontWeight: d.isToday ? 700 : 400 }}>{d.dow}</div>
                  <div className="mono" style={{ fontSize: 8, color: 'var(--ink-4)' }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Habits 7 days */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>Hábitos feitos.</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
              {last7Habits.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-2)' }}>{d.done || ''}</span>
                  <div style={{
                    width: '100%', borderRadius: 4,
                    height: `${Math.max(4, (d.done / maxHabits) * 100)}%`,
                    background: d.isToday ? 'var(--gradient-neon)' : 'rgba(176,102,255,0.5)',
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {last7Habits.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: 9, color: d.isToday ? '#fff' : 'var(--ink-3)', fontWeight: d.isToday ? 700 : 400 }}>{d.dow}</div>
                  <div className="mono" style={{ fontSize: 8, color: 'var(--ink-4)' }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks by category */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>Por categoria.</div>
            {catCounts.map(c => {
              const color = Orbita.resolveColor(c.color);
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, width: 60, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.icon} {c.name}</span>
                  <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${(c.count / maxCatCount) * 100}%`, height: '100%', background: color, borderRadius: 4 }} />
                    <span className="mono" style={{ position: 'absolute', right: 6, top: 1, fontSize: 10, color: '#fff', fontWeight: 600 }}>{c.count}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', width: 20 }}>{c.count}</span>
                </div>
              );
            })}
            {catCounts.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Sem categorias</div>}
          </div>
        </div>

        {/* Detail cards: last 7 days */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, overflowX: 'auto' }}>
          {last7Detail.map((d, i) => (
            <div key={i} className="panel" style={{
              padding: 12, minWidth: 140, flex: '0 0 auto',
              border: d.isToday ? '1px solid rgba(255,46,136,0.3)' : undefined,
            }}>
              <div className="mono" style={{ fontSize: 10, color: d.isToday ? 'var(--neon-a)' : 'var(--ink-3)', fontWeight: d.isToday ? 700 : 400, marginBottom: 6 }}>
                {d.dow} {d.day}
              </div>
              {d.tasks.slice(0, 5).map((t, j) => (
                <div key={j} style={{ fontSize: 10, color: Orbita.isTaskDone(t, d.ds) ? 'var(--ink-4)' : 'var(--ink-2)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: Orbita.isTaskDone(t, d.ds) ? 'line-through' : 'none' }}>
                  {t.icon && <span style={{ marginRight: 2 }}>{t.icon}</span>}{t.text}
                </div>
              ))}
              {d.habits.map((h, j) => (
                <div key={`h${j}`} style={{ fontSize: 10, color: Orbita.resolveColor(h.color), marginBottom: 2 }}>{h.icon} {h.name}</div>
              ))}
              {d.more > 0 && <div className="mono" style={{ fontSize: 9, color: 'var(--neon-a)', marginTop: 2 }}>+{d.more} mais</div>}
            </div>
          ))}
        </div>

        {/* Bottom row: completion rate, streak ranking, goal progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }} className="charts-grid">
          {/* Completion rate by type */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>Taxa de conclusão.</div>
            {freqStats.map(f => (
              <div key={f.freq} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: f.color + '22', color: f.color, fontWeight: 600, minWidth: 55 }}>{f.label}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 30 }}>{f.done}/{f.total}</span>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${f.pct}%`, height: '100%', background: f.color, borderRadius: 4 }} />
                </div>
                <span className="mono" style={{ fontSize: 11, color: f.color, fontWeight: 600, width: 30 }}>{f.pct}%</span>
              </div>
            ))}
          </div>

          {/* Streak ranking */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>Ranking de sequências.</div>
            {habitStreaks.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12 }}>{h.icon}</span>
                <span style={{ flex: 1, fontSize: 12 }}>{h.name}</span>
                <div style={{ width: 80, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, h.streak * 2)}%`, height: '100%', background: h.color, borderRadius: 4 }} />
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', width: 20, textAlign: 'right' }}>{h.streak}</span>
              </div>
            ))}
            {habitStreaks.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Sem hábitos</div>}
          </div>

          {/* Goal progress */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>Progresso dos objetivos.</div>
            {goalProgress.map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
                <div style={{ width: 80, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: 'var(--neon-c)', borderRadius: 4 }} />
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--neon-a)', fontWeight: 600, width: 30 }}>{g.pct}%</span>
              </div>
            ))}
            {goalProgress.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Sem objetivos</div>}
          </div>
        </div>
      </div>
    </>
  );
}

window.ScreenCharts = ScreenCharts;
