function ScreenHabits({
  onNewHabit
}) {
  const {
    data,
    toggleHabitDay
  } = useData();
  const habits = data.habits || [];
  const today = Orbita.todayStr();
  const dow = new Date().getDay();
  const bestStreak = habits.reduce((best, h) => Math.max(best, Orbita.getStreak(h)), 0);
  const activeCount = habits.length;
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: "H\xE1bitos.",
    subtitle: `${activeCount} ativos · ${bestStreak} dias melhor streak`,
    actions: React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: onNewHabit
    }, "\uFF0B H\xE1bito")
  }), React.createElement("div", {
    className: "habits-grid"
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 24
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 4
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Grid anual \xB7 contribui\xE7\xF5es"), React.createElement("h3", {
    className: "panel-title",
    style: {
      marginTop: 4
    }
  }, React.createElement(YearGridCount, {
    habits: habits
  }), " dias com h\xE1bito."))), React.createElement(YearGrid, {
    habits: habits
  }), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14,
      fontSize: 10.5,
      color: 'var(--ink-3)'
    }
  }, React.createElement("span", null, "Menos"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, ['rgba(255,255,255,0.05)', 'rgba(91,141,255,0.35)', 'rgba(176,102,255,0.6)', 'rgba(255,46,136,0.85)', '#ff2e88'].map((c, i) => React.createElement("div", {
    key: i,
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: c
    }
  }))), React.createElement("span", null, "Mais"))), React.createElement("div", {
    className: "panel",
    style: {
      padding: 24
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, "Ranking de streaks"), React.createElement("h3", {
    className: "panel-title",
    style: {
      marginTop: 4,
      marginBottom: 18
    }
  }, "Top consist\xEAncia."), habits.length === 0 && React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)'
    }
  }, "Nenhum h\xE1bito criado"), habits.slice().sort((a, b) => Orbita.getStreak(b) - Orbita.getStreak(a)).map((h, i) => {
    const streak = Orbita.getStreak(h);
    const hColor = Orbita.resolveColor(h.color);
    const yg = h.yearGoal || 200;
    const totalDone = h.log ? Object.keys(h.log).length : 0;
    return React.createElement("div", {
      key: h.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderTop: i > 0 ? '1px solid var(--line)' : 'none'
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: 'var(--ink-4)',
        width: 18
      }
    }, "#", i + 1), React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 9,
        background: hColor + '22',
        border: `1px solid ${hColor}44`,
        display: 'grid',
        placeItems: 'center',
        fontSize: 14
      }
    }, h.icon || '⭐'), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, h.name), React.createElement("div", {
      style: {
        height: 3,
        marginTop: 4,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        width: `${Math.min(100, totalDone / yg * 100)}%`,
        height: '100%',
        background: hColor
      }
    }))), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        color: hColor,
        fontWeight: 500
      }
    }, "\uD83D\uDD25", streak));
  }))), React.createElement("div", {
    style: {
      padding: '0 28px 40px'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 14
    }
  }, "Seus h\xE1bitos"), habits.length === 0 && React.createElement("div", {
    className: "panel",
    style: {
      textAlign: 'center',
      padding: '48px 24px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 12
    }
  }, "\u2726"), React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      marginBottom: 4
    }
  }, "Nenhum h\xE1bito ainda"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginBottom: 16
    }
  }, "Crie seu primeiro h\xE1bito para come\xE7ar a rastrear"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 18px',
      fontSize: 13
    },
    onClick: onNewHabit
  }, "\uFF0B Novo h\xE1bito")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 14
    }
  }, habits.map(h => React.createElement(HabitCard, {
    key: h.id,
    habit: h,
    today: today,
    dow: dow,
    onEdit: () => onNewHabit && onNewHabit(h)
  })))));
}
function ContribGrid({
  habitLog,
  color,
  year,
  onToggle,
  height,
  allLogs,
  maxHabits
}) {
  const now = new Date();
  const jan1 = new Date(year, 0, 1);
  const firstSun = new Date(jan1);
  firstSun.setDate(firstSun.getDate() - firstSun.getDay());
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const isMulti = !!allLogs;
  const multiColors = ['rgba(255,255,255,0.04)', 'rgba(91,141,255,0.3)', 'rgba(176,102,255,0.55)', 'rgba(255,46,136,0.8)', '#ff2e88'];
  const weeks = [];
  let cur = new Date(firstSun);
  for (let w = 0; w < 53; w++) {
    const cells = [];
    const monDay = new Date(cur);
    monDay.setDate(monDay.getDate() + 1);
    const label = monDay.getDate() <= 7 && monDay.getFullYear() === year ? months[monDay.getMonth()] : '';
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(cur);
      cellDate.setDate(cur.getDate() + d);
      const ds = Orbita.dateToStr(cellDate);
      const inYear = cellDate.getFullYear() === year;
      const past = cellDate <= now;
      let bg;
      if (!inYear) {
        bg = 'transparent';
      } else if (isMulti) {
        const count = allLogs[ds] || 0;
        const level = !past ? 0 : count === 0 ? 0 : Math.min(4, Math.ceil(count / (maxHabits || 1) * 4));
        bg = multiColors[level];
      } else {
        const done = habitLog && habitLog[ds];
        bg = done ? color : past ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)';
      }
      const dayFmt = cellDate.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short'
      });
      const done = isMulti ? (allLogs[ds] || 0) > 0 : habitLog && habitLog[ds];
      cells.push({
        bg,
        ds,
        inYear,
        past,
        title: inYear ? `${dayFmt}${past ? done ? ' · ✓' : ' · –' : ''}` : ''
      });
    }
    weeks.push({
      cells,
      label
    });
    cur.setDate(cur.getDate() + 7);
  }
  return React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
      gap: 3,
      marginBottom: 3
    }
  }, weeks.map((w, i) => React.createElement("div", {
    key: i,
    style: {
      fontSize: height ? 8 : 10,
      color: 'var(--ink-3)',
      textAlign: 'center'
    }
  }, w.label))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: height ? 'repeat(7, 1fr)' : 'repeat(7, auto)',
      gridAutoFlow: 'column',
      gridAutoColumns: '1fr',
      gap: height ? 3 : 4,
      width: '100%',
      height: height || 'auto'
    }
  }, weeks.flatMap((w, wi) => w.cells.map((c, di) => React.createElement("div", {
    key: `${wi}-${di}`,
    onClick: c.inYear && c.past && onToggle ? () => onToggle(c.ds) : undefined,
    title: c.title,
    style: {
      borderRadius: 3,
      background: c.bg,
      aspectRatio: height ? undefined : '1 / 1',
      cursor: c.inYear && c.past && onToggle ? 'pointer' : 'default',
      transition: 'opacity 80ms'
    },
    onMouseEnter: c.inYear ? e => {
      e.currentTarget.style.opacity = '0.7';
    } : undefined,
    onMouseLeave: c.inYear ? e => {
      e.currentTarget.style.opacity = '1';
    } : undefined
  })))));
}
function HabitCard({
  habit,
  today,
  dow,
  onEdit
}) {
  const {
    toggleHabitDay,
    addHabitQuantity,
    setHabitQuantity,
    deleteHabit
  } = useData();
  const h = habit;
  const hColor = Orbita.resolveColor(h.color);
  const isQuantity = h.type === 'quantity';
  const streak = Orbita.getStreak(h);
  const yg = h.yearGoal || 200;
  const totalDone = h.log ? Object.keys(h.log).length : 0;
  const todayDone = h.log && h.log[today];
  const activeDays = h.days || [0, 1, 2, 3, 4, 5, 6];
  const freq = activeDays.length;
  const dayLabelsShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const dayLabelsFull = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const unitLabel = h.unit === 'min' ? 'min' : h.unit === 'h' ? 'h' : h.unit === 'reps' ? 'reps' : h.unit === 'km' ? 'km' : h.unit === 'pages' ? 'pág' : h.unit === 'ml' ? 'ml' : h.unit === 'sessoes' ? 'sessões' : h.unit || '';
  const target = h.target || 1;
  const targetPeriod = h.targetPeriod || 'week';
  const [logOpen, setLogOpen] = React.useState(false);
  const [logVal, setLogVal] = React.useState('');
  const weekStart = new Date();
  const todayDow = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (todayDow + 6) % 7);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const ds = Orbita.dateToStr(d);
    const dayDow = d.getDay();
    const scheduled = activeDays.includes(dayDow);
    const logVal = h.log && h.log[ds];
    const done = isQuantity ? typeof logVal === 'number' && logVal > 0 : !!logVal;
    const value = isQuantity ? typeof logVal === 'number' ? logVal : 0 : 0;
    const isToday = ds === today;
    week.push({
      ds,
      day: d.getDate(),
      dayDow,
      scheduled,
      done,
      value,
      isToday,
      label: dayLabelsFull[(dayDow + 7) % 7]
    });
  }
  const weekDone = week.filter(d => d.done).length;
  const weekScheduled = week.filter(d => d.scheduled).length;
  const weekPct = weekScheduled > 0 ? Math.round(weekDone / weekScheduled * 100) : 0;
  const weekSum = week.reduce((s, d) => s + (d.value || 0), 0);
  const todayValue = isQuantity && typeof (h.log && h.log[today]) === 'number' ? h.log[today] : 0;
  let periodSum = 0,
    periodTarget = target;
  if (isQuantity) {
    if (targetPeriod === 'day') {
      periodSum = todayValue;
    } else if (targetPeriod === 'week') {
      periodSum = weekSum;
    } else if (targetPeriod === 'month') {
      const ym = today.slice(0, 7);
      periodSum = Object.entries(h.log || {}).reduce((s, [ds, v]) => ds.startsWith(ym) && typeof v === 'number' ? s + v : s, 0);
    }
  }
  const targetPct = isQuantity && periodTarget > 0 ? Math.min(100, Math.round(periodSum / periodTarget * 100)) : 0;
  const targetMet = isQuantity && periodSum >= periodTarget;
  const periodLabel = targetPeriod === 'day' ? 'hoje' : targetPeriod === 'week' ? 'semana' : 'mês';
  function quickAdd(amount) {
    addHabitQuantity(h.id, today, amount);
  }
  function submitLog() {
    const v = parseFloat(String(logVal).replace(',', '.'));
    if (!isNaN(v) && v > 0) addHabitQuantity(h.id, today, v);
    setLogVal('');
    setLogOpen(false);
  }
  const year = new Date().getFullYear();
  const nowDate = new Date();
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: hColor + '22',
      border: `1px solid ${hColor}44`,
      display: 'grid',
      placeItems: 'center',
      fontSize: 18,
      flexShrink: 0
    }
  }, h.icon || '⭐'), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, h.name)), React.createElement("button", {
    className: "icon-btn",
    onClick: onEdit,
    style: {
      width: 30,
      height: 30,
      fontSize: 13
    }
  }, "\u270E"), React.createElement("button", {
    className: "icon-btn",
    onClick: () => {
      if (confirm('Deletar hábito "' + h.name + '"?')) deleteHabit(h.id);
    },
    style: {
      width: 30,
      height: 30,
      fontSize: 13
    }
  }, "\u2715")), isQuantity && React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: 14,
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${targetMet ? '#3ccf91' : hColor}33`
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 8
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Meta ", periodLabel), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 28,
      fontWeight: 700,
      color: targetMet ? '#3ccf91' : hColor,
      lineHeight: 1
    }
  }, Math.round(periodSum * 10) / 10), React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)'
    }
  }, "/ ", target, " ", unitLabel), targetMet && React.createElement("span", {
    style: {
      fontSize: 14,
      color: '#3ccf91'
    }
  }, "\u2713"))), !logOpen ? React.createElement("button", {
    onClick: () => setLogOpen(true),
    style: {
      padding: '6px 14px',
      borderRadius: 8,
      background: 'var(--gradient-neon)',
      border: 'none',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--font-ui)',
      cursor: 'pointer'
    }
  }, "\uFF0B Sess\xE3o") : React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    type: "text",
    inputMode: "decimal",
    placeholder: `+${unitLabel}`,
    value: logVal,
    onChange: e => setLogVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') submitLog();
      if (e.key === 'Escape') {
        setLogOpen(false);
        setLogVal('');
      }
    },
    style: {
      width: 70,
      padding: '4px 8px',
      fontSize: 12,
      textAlign: 'center'
    }
  }), React.createElement("button", {
    onClick: submitLog,
    style: {
      padding: '4px 8px',
      background: '#3ccf91',
      border: 'none',
      borderRadius: 6,
      color: '#fff',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2713"), React.createElement("button", {
    onClick: () => {
      setLogOpen(false);
      setLogVal('');
    },
    style: {
      padding: '4px 8px',
      background: 'transparent',
      border: '1px solid var(--line)',
      borderRadius: 6,
      color: 'var(--ink-3)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2715"))), React.createElement("div", {
    style: {
      height: 6,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 3,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      width: `${targetPct}%`,
      height: '100%',
      background: targetMet ? '#3ccf91' : hColor,
      borderRadius: 3,
      transition: 'width 300ms'
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 10,
      flexWrap: 'wrap'
    }
  }, [15, 30, 45, 60].map(n => React.createElement("button", {
    key: n,
    onClick: () => quickAdd(n),
    style: {
      padding: '4px 10px',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--line)',
      color: 'var(--ink-2)',
      fontSize: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)'
    }
  }, "+", n, unitLabel)), todayValue > 0 && React.createElement("button", {
    onClick: () => addHabitQuantity(h.id, today, -todayValue),
    title: "Zerar hoje",
    style: {
      padding: '4px 10px',
      borderRadius: 999,
      background: 'rgba(255,85,85,0.08)',
      border: '1px solid rgba(255,85,85,0.2)',
      color: '#ff5a3c',
      fontSize: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)'
    }
  }, "\u21BA zerar hoje (", todayValue, unitLabel, ")"))), !isQuantity && React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 14
    }
  }, dayLabelsShort.map((d, i) => React.createElement("div", {
    key: i,
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      fontSize: 9,
      fontWeight: 700,
      background: activeDays.includes(i) ? hColor : 'transparent',
      color: activeDays.includes(i) ? '#fff' : 'var(--ink-4)',
      border: activeDays.includes(i) ? 'none' : '1px solid var(--line)'
    }
  }, d)), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginLeft: 4
    }
  }, freq, "x/sem")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4,
      marginBottom: 16
    }
  }, week.map((d, i) => React.createElement("div", {
    key: i,
    onClick: () => isQuantity ? quickAdd(d.isToday ? 30 : 0) : toggleHabitDay(h.id, d.ds),
    style: {
      textAlign: 'center',
      padding: '6px 2px',
      borderRadius: 8,
      cursor: isQuantity && !d.isToday ? 'default' : 'pointer',
      background: d.isToday ? d.done ? hColor : 'rgba(255,255,255,0.06)' : d.done ? hColor + 'cc' : 'rgba(255,255,255,0.02)',
      border: d.isToday ? `2px solid ${hColor}` : '1px solid var(--line)',
      opacity: isQuantity ? 1 : d.scheduled ? 1 : 0.3,
      transition: 'all 140ms'
    }
  }, React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 8,
      color: d.done ? '#fff' : 'var(--ink-3)',
      marginBottom: 2
    }
  }, d.label), React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: d.isToday ? 700 : 400,
      color: d.done ? '#fff' : 'var(--ink-2)'
    }
  }, d.day), isQuantity && d.value > 0 && React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 8,
      color: d.done ? '#fff' : hColor,
      marginTop: 2
    }
  }, Math.round(d.value), unitLabel)))), React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Contribui\xE7\xF5es ", year), React.createElement(ContribGrid, {
    habitLog: h.log,
    color: hColor,
    year: year,
    onToggle: ds => toggleHabitDay(h.id, ds),
    height: 80
  })), React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4
    }
  }, React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "Progresso semanal"), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: hColor,
      fontWeight: 600
    }
  }, weekDone, "/", weekScheduled)), React.createElement("div", {
    style: {
      height: 4,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 2,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      width: `${weekPct}%`,
      height: '100%',
      background: hColor,
      borderRadius: 2,
      transition: 'width 300ms'
    }
  }))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 8,
      textAlign: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: hColor,
      lineHeight: 1
    }
  }, streak), React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, "\uD83D\uDD25 SEQU\xCANCIA")), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--ink-1)',
      lineHeight: 1
    }
  }, weekPct, "%"), React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, "SEMANA")), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--ink-1)',
      lineHeight: 1
    }
  }, totalDone), React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, "TOTAL"))));
}
function YearGrid({
  habits
}) {
  const year = new Date().getFullYear();
  const allLogs = {};
  (habits || []).forEach(h => {
    if (!h.log) return;
    Object.keys(h.log).forEach(ds => {
      if (ds.startsWith(String(year))) allLogs[ds] = (allLogs[ds] || 0) + 1;
    });
  });
  return React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, React.createElement(ContribGrid, {
    allLogs: allLogs,
    maxHabits: habits.length || 1,
    year: year
  }));
}
function YearGridCount({
  habits
}) {
  const year = new Date().getFullYear();
  const daysSet = new Set();
  (habits || []).forEach(h => {
    if (!h.log) return;
    Object.keys(h.log).forEach(ds => {
      if (ds.startsWith(String(year))) daysSet.add(ds);
    });
  });
  return daysSet.size;
}
window.ScreenHabits = ScreenHabits;