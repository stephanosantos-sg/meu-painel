/* Orbita v2 — Task History (completed tasks by day/month/year) */

function ScreenHistory() {
  const { data } = useData();
  const [viewMode, setViewMode] = React.useState('day');
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`;
  });
  const [selectedYear, setSelectedYear] = React.useState(() => new Date().getFullYear());

  const tasks = data.tasks || [];
  const catMap = {};
  (data.categories || []).forEach(c => { catMap[c.id] = c; });

  function getCompletedTasks() {
    const completed = [];
    tasks.forEach(t => {
      if (t.freq === 'pontual' && t.done && t.doneAt) {
        completed.push({ task: t, date: t.doneAt });
      }
      if (t.doneSlots && typeof t.doneSlots === 'object') {
        Object.keys(t.doneSlots).forEach(ds => {
          if (t.doneSlots[ds]) {
            completed.push({ task: t, date: ds });
          }
        });
      }
    });
    return completed.sort((a, b) => b.date.localeCompare(a.date));
  }

  const allCompleted = getCompletedTasks();

  function groupByDay(items) {
    const groups = {};
    items.forEach(({ task, date }) => {
      if (!groups[date]) groups[date] = [];
      if (!groups[date].find(x => x.id === task.id)) groups[date].push(task);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }

  function groupByMonth(items) {
    const groups = {};
    items.forEach(({ task, date }) => {
      const ym = date.substring(0, 7);
      if (!groups[ym]) groups[ym] = new Set();
      groups[ym].add(task.id);
    });
    const result = {};
    Object.entries(groups).forEach(([ym, ids]) => {
      result[ym] = { count: ids.size, ids: [...ids] };
    });
    return Object.entries(result).sort((a, b) => b[0].localeCompare(a[0]));
  }

  function groupByYear(items) {
    const groups = {};
    items.forEach(({ task, date }) => {
      const y = date.substring(0, 4);
      if (!groups[y]) groups[y] = new Set();
      groups[y].add(task.id);
    });
    const result = {};
    Object.entries(groups).forEach(([y, ids]) => {
      result[y] = { count: ids.size };
    });
    return Object.entries(result).sort((a, b) => b[0].localeCompare(a[0]));
  }

  const dayGroups = viewMode === 'day' ? groupByDay(allCompleted) : [];
  const monthGroups = viewMode === 'month' ? groupByMonth(allCompleted) : [];
  const yearGroups = viewMode === 'year' ? groupByYear(allCompleted) : [];

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  function fmtDayLabel(ds) {
    const d = new Date(ds + 'T12:00:00');
    const today = Orbita.todayStr();
    const yesterday = (() => { const y = new Date(); y.setDate(y.getDate()-1); return Orbita.dateToStr(y); })();
    if (ds === today) return 'Hoje';
    if (ds === yesterday) return 'Ontem';
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  }

  function fmtMonthLabel(ym) {
    const [y, m] = ym.split('-');
    return `${monthNames[parseInt(m)-1]} ${y}`;
  }

  // Month detail view
  const [expandedMonth, setExpandedMonth] = React.useState(null);
  function getTasksForMonth(ym) {
    return groupByDay(allCompleted.filter(({ date }) => date.startsWith(ym)));
  }

  return (
    <>
      <TopBar title="Histórico." subtitle={`${allCompleted.length} conclusões registradas`} />

      <div style={{ padding: '0 28px 8px', display: 'flex', gap: 6 }}>
        {[
          { id: 'day', label: 'Por dia' },
          { id: 'month', label: 'Por mês' },
          { id: 'year', label: 'Por ano' },
        ].map(v => (
          <button key={v.id} onClick={() => setViewMode(v.id)} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: viewMode === v.id ? 'var(--gradient-neon-soft)' : 'transparent',
            border: viewMode === v.id ? '1px solid rgba(255,46,136,0.22)' : '1px solid var(--line)',
            color: viewMode === v.id ? '#fff' : 'var(--ink-3)',
            fontFamily: 'var(--font-ui)', transition: 'all 120ms',
          }}>{v.label}</button>
        ))}
      </div>

      <div style={{ padding: '16px 28px 40px' }}>

        {/* Day view */}
        {viewMode === 'day' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dayGroups.length === 0 && (
              <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>▤</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhuma tarefa concluída</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Complete tarefas para vê-las aqui</div>
              </div>
            )}
            {dayGroups.slice(0, 30).map(([date, tasks]) => (
              <div key={date} className="panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div className="eyebrow">{fmtDayLabel(date)}</div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{tasks.length} tarefa{tasks.length > 1 ? 's' : ''}</span>
                </div>
                <div className="task-list">
                  {tasks.map(t => {
                    const cat = catMap[t.cat];
                    const color = cat ? Orbita.resolveColor(cat.color) : null;
                    return (
                      <div key={t.id} className="task-item done" style={{ opacity: 0.8 }}>
                        <div className="check checked" style={{ width: 20, height: 20, fontSize: 10, flexShrink: 0 }}>✓</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="task-text" style={{ textDecoration: 'line-through', color: 'var(--ink-3)' }}>
                            {t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}{t.text}
                          </div>
                          <div className="task-meta">
                            {cat && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: color + '22', color: color }}>{cat.icon} {cat.name}</span>}
                            {t.freq !== 'pontual' && <span className="mono" style={{ fontSize: 9.5, color: 'var(--ink-3)' }}>{t.freq}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {dayGroups.length > 30 && (
              <div style={{ textAlign: 'center', padding: 12, color: 'var(--ink-3)', fontSize: 12 }}>
                Mostrando os últimos 30 dias com atividade
              </div>
            )}
          </div>
        )}

        {/* Month view */}
        {viewMode === 'month' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {monthGroups.length === 0 && (
              <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>▤</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhuma tarefa concluída</div>
              </div>
            )}
            {monthGroups.map(([ym, info]) => (
              <div key={ym}>
                <div className="panel" style={{ padding: 16, cursor: 'pointer' }}
                  onClick={() => setExpandedMonth(expandedMonth === ym ? null : ym)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 8, color: 'var(--ink-3)', transition: 'transform 150ms', transform: expandedMonth === ym ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>▶</span>
                      <span style={{ fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{fmtMonthLabel(ym)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{info.count}</span>
                      <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>tarefas</span>
                    </div>
                  </div>
                </div>
                {expandedMonth === ym && (
                  <div style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {getTasksForMonth(ym).map(([date, tasks]) => (
                      <div key={date} className="panel" style={{ padding: 14 }}>
                        <div className="eyebrow" style={{ marginBottom: 8 }}>{fmtDayLabel(date)} · {tasks.length}</div>
                        {tasks.map(t => (
                          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', opacity: 0.7 }}>
                            <span style={{ fontSize: 10, color: 'var(--neon-a)' }}>✓</span>
                            <span style={{ fontSize: 12, color: 'var(--ink-3)', textDecoration: 'line-through' }}>
                              {t.icon && <span style={{ marginRight: 4 }}>{t.icon}</span>}{t.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Year view */}
        {viewMode === 'year' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {yearGroups.length === 0 && (
              <div className="panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>▤</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhuma tarefa concluída</div>
              </div>
            )}
            {yearGroups.map(([year, info]) => (
              <div key={year} className="panel" style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, marginBottom: 8 }}>{year}</div>
                <div style={{ fontSize: 32, fontWeight: 300, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>{info.count}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>tarefas concluídas</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

window.ScreenHistory = ScreenHistory;
