/* Orbita v2 — Screen: Hábitos — fully functional */

function ScreenHabits({ onNewHabit }) {
  const { data, toggleHabitDay } = useData();
  const habits = data.habits || [];
  const today = Orbita.todayStr();
  const dow = new Date().getDay();

  const bestStreak = habits.reduce((best, h) => Math.max(best, Orbita.getStreak(h)), 0);
  const activeCount = habits.length;

  return (
    <>
      <TopBar title="Hábitos." subtitle={`${activeCount} ativos · ${bestStreak} dias melhor streak`}
        actions={<button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={onNewHabit}>＋ Hábito</button>}
      />

      <div className="habits-grid">
        {/* Year contribution grid */}
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div className="eyebrow">Grid anual · contribuições</div>
              <h3 className="panel-title" style={{ marginTop: 4 }}>
                <YearGridCount habits={habits} /> dias com hábito.
              </h3>
            </div>
          </div>
          <YearGrid habits={habits} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 10.5, color: 'var(--ink-3)' }}>
            <span>Menos</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {['rgba(255,255,255,0.05)','rgba(91,141,255,0.35)','rgba(176,102,255,0.6)','rgba(255,46,136,0.85)','#ff2e88'].map((c,i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              ))}
            </div>
            <span>Mais</span>
          </div>
        </div>

        {/* Streak ranking */}
        <div className="panel" style={{ padding: 24 }}>
          <div className="eyebrow">Ranking de streaks</div>
          <h3 className="panel-title" style={{ marginTop: 4, marginBottom: 18 }}>Top consistência.</h3>
          {habits.length === 0 && <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Nenhum hábito criado</div>}
          {habits.slice().sort((a, b) => Orbita.getStreak(b) - Orbita.getStreak(a)).map((h, i) => {
            const streak = Orbita.getStreak(h);
            const hColor = Orbita.resolveColor(h.color);
            const yg = h.yearGoal || 200;
            const totalDone = h.log ? Object.keys(h.log).length : 0;
            return (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', width: 18 }}>#{i + 1}</div>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: hColor + '22', border: `1px solid ${hColor}44`, display: 'grid', placeItems: 'center', fontSize: 14 }}>{h.icon || '⭐'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{h.name}</div>
                  <div style={{ height: 3, marginTop: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (totalDone / yg) * 100)}%`, height: '100%', background: hColor }} />
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 12, color: hColor, fontWeight: 500 }}>🔥{streak}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit cards */}
      <div style={{ padding: '0 28px 40px' }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Seus hábitos</div>
        {habits.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Nenhum hábito ainda</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16 }}>Crie seu primeiro hábito para começar a rastrear</div>
            <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={onNewHabit}>＋ Novo hábito</button>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {habits.map(h => (
            <HabitCard key={h.id} habit={h} today={today} dow={dow} onEdit={() => onNewHabit && onNewHabit(h)} />
          ))}
        </div>
      </div>
    </>
  );
}

/* Shared contribution grid — 7 rows × 53 cols, fills width */
function ContribGrid({ habitLog, color, year, onToggle, height, allLogs, maxHabits }) {
  const now = new Date();
  const jan1 = new Date(year, 0, 1);
  const firstSun = new Date(jan1); firstSun.setDate(firstSun.getDate() - firstSun.getDay());
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const isMulti = !!allLogs;
  const multiColors = ['rgba(255,255,255,0.04)','rgba(91,141,255,0.3)','rgba(176,102,255,0.55)','rgba(255,46,136,0.8)','#ff2e88'];

  const weeks = [];
  let cur = new Date(firstSun);
  for (let w = 0; w < 53; w++) {
    const cells = [];
    const monDay = new Date(cur); monDay.setDate(monDay.getDate() + 1);
    const label = monDay.getDate() <= 7 && monDay.getFullYear() === year ? months[monDay.getMonth()] : '';
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(cur); cellDate.setDate(cur.getDate() + d);
      const ds = Orbita.dateToStr(cellDate);
      const inYear = cellDate.getFullYear() === year;
      const past = cellDate <= now;
      let bg;
      if (!inYear) { bg = 'transparent'; }
      else if (isMulti) {
        const count = allLogs[ds] || 0;
        const level = !past ? 0 : count === 0 ? 0 : Math.min(4, Math.ceil(count / (maxHabits || 1) * 4));
        bg = multiColors[level];
      } else {
        const done = habitLog && habitLog[ds];
        bg = done ? color : past ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)';
      }
      const dayFmt = cellDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
      const done = isMulti ? (allLogs[ds] || 0) > 0 : (habitLog && habitLog[ds]);
      cells.push({ bg, ds, inYear, past, title: inYear ? `${dayFmt}${past ? (done ? ' · ✓' : ' · –') : ''}` : '' });
    }
    weeks.push({ cells, label });
    cur.setDate(cur.getDate() + 7);
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeks.length}, 1fr)`, gap: 3, marginBottom: 3 }}>
        {weeks.map((w, i) => <div key={i} style={{ fontSize: 8, color: 'var(--ink-3)', textAlign: 'center' }}>{w.label}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateRows: `repeat(7, 1fr)`, gridAutoFlow: 'column', gridAutoColumns: '1fr', gap: 3, width: '100%', height: height || 80 }}>
        {weeks.flatMap((w, wi) => w.cells.map((c, di) => (
          <div key={`${wi}-${di}`}
            onClick={c.inYear && c.past && onToggle ? () => onToggle(c.ds) : undefined}
            title={c.title}
            style={{ borderRadius: 3, background: c.bg, cursor: c.inYear && c.past && onToggle ? 'pointer' : 'default', transition: 'opacity 80ms' }}
            onMouseEnter={c.inYear ? e => { e.currentTarget.style.opacity = '0.7'; } : undefined}
            onMouseLeave={c.inYear ? e => { e.currentTarget.style.opacity = '1'; } : undefined}
          />
        )))}
      </div>
    </div>
  );
}

function HabitCard({ habit, today, dow, onEdit }) {
  const { toggleHabitDay, deleteHabit } = useData();
  const h = habit;
  const hColor = Orbita.resolveColor(h.color);
  const streak = Orbita.getStreak(h);
  const yg = h.yearGoal || 200;
  const totalDone = h.log ? Object.keys(h.log).length : 0;
  const todayDone = h.log && h.log[today];
  const activeDays = h.days || [0,1,2,3,4,5,6];
  const freq = activeDays.length;
  const dayLabelsShort = ['D','S','T','Q','Q','S','S'];
  const dayLabelsFull = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];

  // Current week (Mon→Sun)
  const weekStart = new Date();
  const todayDow = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - ((todayDow + 6) % 7)); // go to Monday
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const ds = Orbita.dateToStr(d);
    const dayDow = d.getDay();
    const scheduled = activeDays.includes(dayDow);
    const done = h.log && h.log[ds];
    const isToday = ds === today;
    week.push({ ds, day: d.getDate(), dayDow, scheduled, done, isToday, label: dayLabelsFull[(dayDow + 7) % 7] });
  }
  const weekDone = week.filter(d => d.done).length;
  const weekScheduled = week.filter(d => d.scheduled).length;
  const weekPct = weekScheduled > 0 ? Math.round(weekDone / weekScheduled * 100) : 0;

  const year = new Date().getFullYear();
  const nowDate = new Date();

  return (
    <div className="panel" style={{ padding: 20 }}>
      {/* Header: icon + name + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: hColor + '22', border: `1px solid ${hColor}44`, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>{h.icon || '⭐'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{h.name}</div>
        </div>
        <button className="icon-btn" onClick={onEdit} style={{ width: 30, height: 30, fontSize: 13 }}>✎</button>
        <button className="icon-btn" onClick={() => { if (confirm('Deletar hábito "' + h.name + '"?')) deleteHabit(h.id); }} style={{ width: 30, height: 30, fontSize: 13 }}>✕</button>
      </div>

      {/* Active days + frequency */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        {dayLabelsShort.map((d, i) => (
          <div key={i} style={{
            width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center',
            fontSize: 9, fontWeight: 700,
            background: activeDays.includes(i) ? hColor : 'transparent',
            color: activeDays.includes(i) ? '#fff' : 'var(--ink-4)',
            border: activeDays.includes(i) ? 'none' : '1px solid var(--line)',
          }}>{d}</div>
        ))}
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 4 }}>{freq}x/sem</span>
      </div>

      {/* Current week calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 16 }}>
        {week.map((d, i) => (
          <div key={i} onClick={() => toggleHabitDay(h.id, d.ds)}
            style={{
              textAlign: 'center', padding: '6px 2px', borderRadius: 8, cursor: 'pointer',
              background: d.isToday ? (d.done ? hColor : 'rgba(255,255,255,0.06)') : (d.done ? hColor + 'cc' : 'rgba(255,255,255,0.02)'),
              border: d.isToday ? `2px solid ${hColor}` : '1px solid var(--line)',
              opacity: d.scheduled ? 1 : 0.3,
              transition: 'all 140ms',
            }}>
            <div className="mono" style={{ fontSize: 8, color: d.done ? '#fff' : 'var(--ink-3)', marginBottom: 2 }}>{d.label}</div>
            <div style={{ fontSize: 14, fontWeight: d.isToday ? 700 : 400, color: d.done ? '#fff' : 'var(--ink-2)' }}>{d.day}</div>
          </div>
        ))}
      </div>

      {/* Year contribution grid — 7 rows × 53 cols like GitHub */}
      <div style={{ marginBottom: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Contribuições {year}</div>
        <ContribGrid habitLog={h.log} color={hColor} year={year} onToggle={ds => toggleHabitDay(h.id, ds)} height={80} />
      </div>

      {/* Weekly progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Progresso semanal</span>
          <span className="mono" style={{ fontSize: 12, color: hColor, fontWeight: 600 }}>{weekDone}/{weekScheduled}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${weekPct}%`, height: '100%', background: hColor, borderRadius: 2, transition: 'width 300ms' }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: hColor, lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 2 }}>🔥 SEQUÊNCIA</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', lineHeight: 1 }}>{weekPct}%</div>
          <div style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 2 }}>SEMANA</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', lineHeight: 1 }}>{totalDone}</div>
          <div style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 2 }}>TOTAL</div>
        </div>
      </div>
    </div>
  );
}

function YearGrid({ habits }) {
  const year = new Date().getFullYear();
  const allLogs = {};
  (habits || []).forEach(h => {
    if (!h.log) return;
    Object.keys(h.log).forEach(ds => {
      if (ds.startsWith(String(year))) allLogs[ds] = (allLogs[ds] || 0) + 1;
    });
  });
  return (
    <div style={{ marginTop: 16 }}>
      <ContribGrid allLogs={allLogs} maxHabits={habits.length || 1} year={year} height={110} />
    </div>
  );
}

function YearGridCount({ habits }) {
  const year = new Date().getFullYear();
  const daysSet = new Set();
  (habits || []).forEach(h => {
    if (!h.log) return;
    Object.keys(h.log).forEach(ds => { if (ds.startsWith(String(year))) daysSet.add(ds); });
  });
  return daysSet.size;
}

window.ScreenHabits = ScreenHabits;
