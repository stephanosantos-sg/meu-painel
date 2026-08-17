function ScreenToday({
  onNewTask
}) {
  const {
    data,
    toggleTask,
    toggleSlot,
    toggleHabitDay,
    calendarEvents,
    calendarConnected,
    fetchCalendarEvents,
    fetchCalendarRange
  } = useData();
  const [view, setView] = React.useState('list');
  const [weekBase, setWeekBase] = React.useState(new Date());
  const [monthBase, setMonthBase] = React.useState(new Date());
  const [filterCat, setFilterCat] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  React.useEffect(() => {
    function onFilterCat(e) {
      setFilterCat(e.detail);
    }
    window.addEventListener('orbita:filterCat', onFilterCat);
    return () => window.removeEventListener('orbita:filterCat', onFilterCat);
  }, []);
  React.useEffect(() => {
    if (calendarConnected) {
      fetchCalendarEvents(Orbita.dateToStr(selectedDate));
    } else if (localStorage.getItem('orbita_gcalToken')) {
      const t = setTimeout(() => fetchCalendarEvents(Orbita.dateToStr(selectedDate)), 500);
      return () => clearTimeout(t);
    }
  }, [selectedDate, calendarConnected]);
  const [filterTypes, setFilterTypes] = React.useState({
    pontual: true,
    recorrente: true,
    evento: true,
    habito: true,
    atrasada: true,
    objetivo: true,
    feitas: false
  });
  const realToday = Orbita.todayStr();
  const today = Orbita.dateToStr(selectedDate);
  const isToday = today === realToday;
  const now = new Date();
  const h = now.getHours();
  const greet = isToday ? h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite' : '';
  const fmtDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(selectedDate);
  const dow = selectedDate.getDay();
  function shiftDay(n) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + n);
    setSelectedDate(d);
  }
  const tasks = data.tasks || [];
  const cats = data.categories || [];
  const catMap = {};
  cats.forEach(c => {
    catMap[c.id] = c;
  });
  const allTodayTasks = tasks.filter(t => Orbita.isTaskForDate(t, today));
  const catFiltered = filterCat === 'all' ? allTodayTasks : allTodayTasks.filter(t => t.cat === filterCat);
  const todayTasks = catFiltered.filter(t => {
    if (t.freq === 'pontual' && !filterTypes.pontual) return false;
    if (t.freq !== 'pontual' && !filterTypes.recorrente) return false;
    return true;
  });
  const showHabitsInList = filterTypes.habito;
  const showCalendarEvents = filterTypes.evento;
  const overdueTasks = tasks.filter(t => {
    if (t.done || !t.date || t.date >= today) return false;
    if (t.freq !== 'pontual') return false;
    if (filterCat !== 'all' && t.cat !== filterCat) return false;
    return !t.done;
  });
  const todayHabits = (data.habits || []).filter(hab => (hab.days || [0, 1, 2, 3, 4, 5, 6]).includes(dow));
  const habitsDone = todayHabits.filter(hab => hab.log && hab.log[today]).length;
  const xp = data.xp || {
    total: 0,
    level: 1
  };
  const lvlStart = Orbita.getTotalXPForLevel(xp.level);
  const lvlEnd = Orbita.getTotalXPForLevel(xp.level + 1);
  const pct = lvlEnd > lvlStart ? Math.round((xp.total - lvlStart) / (lvlEnd - lvlStart) * 100) : 0;
  const doneTodayCount = todayTasks.filter(t => Orbita.isTaskDone(t, today)).length;
  const views = [{
    id: 'list',
    label: 'Lista'
  }, {
    id: 'timeline',
    label: 'Timeline'
  }, {
    id: 'kanban',
    label: 'Kanban'
  }, {
    id: 'week',
    label: 'Semana'
  }, {
    id: 'month',
    label: 'Mês'
  }];
  return React.createElement(React.Fragment, null, React.createElement(TopBar, {
    title: isToday ? `${greet}, ${data._profile && data._profile.name || 'Aventureiro'}.` : fmtDate.charAt(0).toUpperCase() + fmtDate.slice(1),
    subtitle: isToday ? fmtDate : greet ? `${greet} · Vendo outro dia` : 'Vendo outro dia',
    actions: React.createElement(React.Fragment, null, React.createElement("button", {
      className: "btn-ghost desktop-only",
      onClick: () => window._startPomo && window._startPomo(),
      style: {
        fontSize: 13,
        gap: 6
      }
    }, "\u25C9 Pomodoro"), React.createElement("div", {
      className: "desktop-only",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        background: 'var(--gradient-neon-soft)',
        borderRadius: 12,
        border: '1px solid rgba(255,46,136,0.22)',
        overflow: 'hidden'
      }
    }, React.createElement("button", {
      onClick: () => shiftDay(-1),
      style: {
        padding: '10px 12px',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 100ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)',
      onMouseLeave: e => e.currentTarget.style.background = 'none'
    }, "\u2190"), !isToday && React.createElement("button", {
      onClick: () => setSelectedDate(new Date()),
      style: {
        padding: '10px 14px',
        background: 'none',
        border: 'none',
        borderLeft: '1px solid rgba(255,255,255,0.12)',
        borderRight: '1px solid rgba(255,255,255,0.12)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--font-ui)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 100ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)',
      onMouseLeave: e => e.currentTarget.style.background = 'none'
    }, "Hoje"), React.createElement("button", {
      onClick: () => shiftDay(1),
      style: {
        padding: '10px 12px',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 100ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)',
      onMouseLeave: e => e.currentTarget.style.background = 'none'
    }, "\u2192")), React.createElement("button", {
      className: "btn btn-primary desktop-only",
      style: {
        padding: '10px 18px',
        fontSize: 13
      },
      onClick: onNewTask
    }, "\uFF0B Nova tarefa"))
  }), React.createElement(MobileDateNavWithQuote, {
    isToday: isToday,
    shiftDay: shiftDay,
    setSelectedDate: setSelectedDate
  }), React.createElement("button", {
    className: "mobile-only",
    onClick: onNewTask,
    style: {
      position: 'fixed',
      bottom: 80,
      right: 16,
      zIndex: 600,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--gradient-neon)',
      border: 'none',
      color: '#fff',
      fontSize: 28,
      fontWeight: 300,
      lineHeight: 1,
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(255,46,136,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 2
    }
  }, "+"), React.createElement(BirthdayBanner, {
    profile: data._profile
  }), React.createElement(DailyQuote, null), React.createElement(UpcomingHolidays, null), React.createElement(StarredInbox, null), React.createElement("div", {
    className: "tab-scroll",
    style: {
      padding: '0 28px 8px',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      overflowX: 'auto'
    }
  }, views.map(v => React.createElement("button", {
    key: v.id,
    onClick: () => setView(v.id),
    style: {
      padding: '6px 14px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 500,
      cursor: 'pointer',
      background: view === v.id ? 'var(--gradient-neon-soft)' : 'transparent',
      border: view === v.id ? '1px solid rgba(255,46,136,0.22)' : '1px solid var(--line)',
      color: view === v.id ? '#fff' : 'var(--ink-3)',
      fontFamily: 'var(--font-ui)',
      transition: 'all 120ms',
      whiteSpace: 'nowrap'
    }
  }, v.label)), (view === 'week' || view === 'month') && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      width: 1,
      height: 20,
      background: 'var(--line)',
      marginLeft: 4
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      view === 'week' ? setWeekBase(new Date()) : setMonthBase(new Date());
    }
  }, "Hoje"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      const d = new Date(view === 'week' ? weekBase : monthBase);
      view === 'week' ? d.setDate(d.getDate() - 7) : d.setMonth(d.getMonth() - 1);
      view === 'week' ? setWeekBase(d) : setMonthBase(d);
    }
  }, "\u2190"), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => {
      const d = new Date(view === 'week' ? weekBase : monthBase);
      view === 'week' ? d.setDate(d.getDate() + 7) : d.setMonth(d.getMonth() + 1);
      view === 'week' ? setWeekBase(d) : setMonthBase(d);
    }
  }, "\u2192"))), React.createElement("div", {
    className: "tab-scroll",
    style: {
      padding: '0 28px 14px',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      overflowX: 'auto'
    }
  }, [{
    key: 'pontual',
    label: 'Pontuais',
    color: '#b066ff'
  }, {
    key: 'recorrente',
    label: 'Recorrentes',
    color: '#5b8dff'
  }, {
    key: 'evento',
    label: 'Eventos',
    color: '#ffa830'
  }, {
    key: 'habito',
    label: 'Hábitos',
    color: '#64d2ff'
  }, {
    key: 'atrasada',
    label: 'Atrasadas',
    color: '#ff2e88'
  }, {
    key: 'objetivo',
    label: 'Objetivos',
    color: '#a855f7'
  }, {
    key: 'feitas',
    label: 'Feitas',
    color: '#6b7280'
  }].map(f => {
    const on = filterTypes[f.key];
    return React.createElement("button", {
      key: f.key,
      onClick: () => setFilterTypes(prev => ({
        ...prev,
        [f.key]: !prev[f.key]
      })),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 6,
        cursor: 'pointer',
        background: on ? f.color + '18' : 'transparent',
        border: on ? `1px solid ${f.color}44` : '1px solid var(--line)',
        color: on ? f.color : 'var(--ink-4)',
        fontSize: 11,
        fontWeight: 500,
        fontFamily: 'var(--font-ui)',
        transition: 'all 120ms',
        whiteSpace: 'nowrap'
      }
    }, React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: on ? f.color : 'var(--ink-4)',
        flexShrink: 0
      }
    }), f.label);
  })), cats.length > 0 && React.createElement("div", {
    className: "tab-scroll",
    style: {
      padding: '0 28px 14px',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      overflowX: 'auto'
    }
  }, React.createElement("button", {
    onClick: () => setFilterCat('all'),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 11,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      background: filterCat === 'all' ? 'rgba(255,255,255,0.06)' : 'transparent',
      border: filterCat === 'all' ? '1px solid var(--line-2)' : '1px solid transparent',
      color: filterCat === 'all' ? 'var(--ink-1)' : 'var(--ink-4)',
      fontFamily: 'var(--font-ui)'
    }
  }, "Todas categorias"), cats.map(c => {
    const color = Orbita.resolveColor(c.color);
    return React.createElement("button", {
      key: c.id,
      onClick: () => setFilterCat(filterCat === c.id ? 'all' : c.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 11,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        background: filterCat === c.id ? color + '22' : 'transparent',
        border: filterCat === c.id ? `1px solid ${color}44` : '1px solid var(--line)',
        color: filterCat === c.id ? color : 'var(--ink-4)',
        fontFamily: 'var(--font-ui)'
      }
    }, React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 2,
        background: color
      }
    }), " ", c.name);
  })), view === 'list' && React.createElement("div", {
    className: "screen-grid"
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, filterTypes.atrasada && overdueTasks.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      borderLeft: '3px solid var(--neon-a)'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--neon-a)',
      marginBottom: 12
    }
  }, "\u26A0 Atrasadas \xB7 ", overdueTasks.length), React.createElement("div", {
    className: "task-list"
  }, overdueTasks.map(t => React.createElement(TaskItem, {
    key: t.id,
    task: t,
    dateCtx: t.date,
    catMap: catMap
  })))), (() => {
    const showDone = filterTypes.feitas;
    const pending = todayTasks.filter(t => !Orbita.isTaskDone(t, today));
    const done = todayTasks.filter(t => Orbita.isTaskDone(t, today));
    const sortByTime = (a, b) => {
      const aT = a.time || a.times && a.times[0] && a.times[0].time || 'zz';
      const bT = b.time || b.times && b.times[0] && b.times[0].time || 'zz';
      return aT !== bT ? aT.localeCompare(bT) : (a.prio || 4) - (b.prio || 4);
    };
    return React.createElement(React.Fragment, null, showDone ? React.createElement("div", {
      className: "panel"
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 12
      }
    }, "Todas \xB7 ", todayTasks.length, " (", done.length, " feitas)"), React.createElement("div", {
      className: "task-list"
    }, todayTasks.sort(sortByTime).map(t => React.createElement(TaskItem, {
      key: t.id,
      task: t,
      dateCtx: today,
      catMap: catMap
    })))) : React.createElement(React.Fragment, null, pending.length > 0 && React.createElement("div", {
      className: "panel"
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 12
      }
    }, "\u2600\uFE0E Pendentes \xB7 ", pending.length), React.createElement("div", {
      className: "task-list"
    }, pending.sort(sortByTime).map(t => React.createElement(TaskItem, {
      key: t.id,
      task: t,
      dateCtx: today,
      catMap: catMap
    })))), pending.length === 0 && todayTasks.length > 0 && React.createElement("div", {
      className: "panel",
      style: {
        textAlign: 'center',
        padding: '24px',
        background: 'rgba(48,209,88,0.06)',
        border: '1px solid rgba(48,209,88,0.15)'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 28,
        marginBottom: 8
      }
    }, "\uD83C\uDF89"), React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 500,
        color: '#30d158'
      }
    }, "Tudo feito por hoje!"), React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-3)',
        marginTop: 4
      }
    }, doneTodayCount, " tarefas conclu\xEDdas")), pending.length === 0 && todayTasks.length === 0 && React.createElement("div", {
      className: "panel",
      style: {
        textAlign: 'center',
        padding: '32px 0',
        color: 'var(--ink-3)'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 28,
        marginBottom: 8
      }
    }, "\uD83C\uDFAF"), React.createElement("div", {
      style: {
        fontSize: 13
      }
    }, "Nenhuma tarefa neste filtro")), done.length > 0 && React.createElement("details", {
      style: {
        marginTop: 4
      }
    }, React.createElement("summary", {
      style: {
        cursor: 'pointer',
        padding: '8px 0',
        fontSize: 12,
        color: 'var(--ink-3)',
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 10
      }
    }, "\u25B8"), " Feitos hoje \xB7 ", done.length), React.createElement("div", {
      className: "panel",
      style: {
        marginTop: 4,
        opacity: 0.6
      }
    }, React.createElement("div", {
      className: "task-list"
    }, done.sort(sortByTime).map(t => React.createElement(TaskItem, {
      key: t.id,
      task: t,
      dateCtx: today,
      catMap: catMap
    })))))));
  })()), React.createElement(RightPanel, {
    xp: xp,
    pct: pct,
    lvlEnd: lvlEnd,
    doneTodayCount: doneTodayCount,
    todayTasks: todayTasks,
    todayHabits: todayHabits,
    habitsDone: habitsDone,
    today: today,
    overdueTasks: overdueTasks,
    catMap: catMap,
    goals: data.goals || [],
    showHabits: filterTypes.habito,
    showOverdue: filterTypes.atrasada,
    showGoals: filterTypes.objetivo,
    showEvents: filterTypes.evento,
    calendarEvents: calendarEvents,
    calendarConnected: calendarConnected,
    diet: data._diet
  })), view === 'timeline' && React.createElement(TimelineView, {
    tasks: tasks,
    catMap: catMap,
    today: today,
    nowH: h + now.getMinutes() / 60,
    xp: xp,
    pct: pct,
    lvlEnd: lvlEnd,
    doneTodayCount: doneTodayCount,
    todayTasks: todayTasks,
    todayHabits: todayHabits,
    habitsDone: habitsDone,
    calendarEvents: calendarEvents
  }), view === 'kanban' && React.createElement(KanbanView, {
    tasks: todayTasks,
    cats: cats,
    catMap: catMap,
    today: today,
    calendarEvents: calendarEvents
  }), view === 'week' && React.createElement(WeekViewInline, {
    baseDate: weekBase,
    tasks: tasks,
    catMap: catMap,
    fetchCalendarRange: fetchCalendarRange,
    calendarConnected: calendarConnected
  }), view === 'month' && React.createElement(MonthViewInline, {
    baseDate: monthBase,
    tasks: tasks,
    catMap: catMap,
    fetchCalendarRange: fetchCalendarRange,
    calendarConnected: calendarConnected
  }));
}
function RightPanel({
  xp,
  pct,
  lvlEnd,
  doneTodayCount,
  todayTasks,
  todayHabits,
  habitsDone,
  today,
  overdueTasks,
  catMap,
  goals,
  showHabits,
  showOverdue,
  showGoals,
  showEvents,
  calendarEvents,
  calendarConnected,
  diet
}) {
  const {
    toggleHabitDay
  } = useData();
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, "Progresso do n\xEDvel"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginTop: 6,
      marginBottom: 12
    }
  }, React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 30,
      lineHeight: 1
    }
  }, "Lvl ", xp.level, " \u2192 ", xp.level + 1), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, pct, "%")), React.createElement("div", {
    className: "xp-bar",
    style: {
      height: 8
    }
  }, React.createElement("div", {
    className: "xp-bar-fill",
    style: {
      width: `${pct}%`
    }
  })), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8
    }
  }, React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, xp.total.toLocaleString(), " xp"), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "faltam ", (lvlEnd - xp.total).toLocaleString()))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 16
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, "Feitas hoje"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 28,
      lineHeight: 1,
      marginTop: 6
    }
  }, doneTodayCount, "/", todayTasks.length)), React.createElement("div", {
    className: "panel",
    style: {
      padding: 16
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, "H\xE1bitos"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 28,
      lineHeight: 1,
      marginTop: 6
    }
  }, habitsDone, "/", todayHabits.length))), showEvents && calendarEvents && calendarEvents.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 20,
      borderLeft: '3px solid #ea4335'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: '#ea4335',
      marginBottom: 12
    }
  }, "\u25C8 Eventos Google \xB7 ", calendarEvents.length), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, calendarEvents.map(ev => {
    const startTime = ev.allDay ? 'Dia inteiro' : new Date(ev.start).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = !ev.allDay ? new Date(ev.end).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }) : null;
    const isPast = !ev.allDay && new Date(ev.end) < new Date();
    return React.createElement("div", {
      key: ev.id,
      onClick: () => ev.htmlLink && window.open(ev.htmlLink, '_blank'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px',
        borderRadius: 8,
        cursor: ev.htmlLink ? 'pointer' : 'default',
        opacity: isPast ? 0.5 : 1,
        background: 'rgba(255,255,255,0.02)',
        transition: 'all 120ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
      onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, ev.title), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: '#ea4335',
        marginTop: 2
      }
    }, startTime, endTime ? ` — ${endTime}` : '', ev.location && React.createElement("span", {
      style: {
        color: 'var(--ink-3)',
        marginLeft: 6
      }
    }, "\uD83D\uDCCD ", ev.location))), ev.htmlLink && React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--ink-4)'
      }
    }, "\u2197"));
  }))), showHabits && todayHabits.length > 0 && React.createElement("div", {
    className: "panel",
    style: {
      padding: 20,
      borderLeft: '3px solid #64d2ff'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: '#64d2ff',
      marginBottom: 14
    }
  }, "\u2726 H\xE1bitos de hoje \xB7 ", habitsDone, "/", todayHabits.length), todayHabits.map(hab => {
    const done = hab.log && hab.log[today];
    const streak = Orbita.getStreak(hab);
    const hColor = Orbita.resolveColor(hab.color);
    return React.createElement("div", {
      key: hab.id,
      onClick: () => toggleHabitDay(hab.id, today),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 8px',
        marginBottom: 2,
        borderRadius: 8,
        cursor: 'pointer',
        opacity: done ? 0.5 : 1,
        transition: 'all 200ms',
        background: 'rgba(255,255,255,0.02)'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
      onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
    }, React.createElement("div", {
      className: `check ${done ? 'checked' : ''}`,
      style: done ? {
        background: hColor,
        borderColor: 'transparent'
      } : {}
    }, done && '✓'), React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, hab.icon || '⭐'), React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: done ? 'line-through' : 'none'
      }
    }, hab.name), streak > 0 && React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: '#ff5a3c'
      }
    }, "\uD83D\uDD25 ", streak));
  })), showGoals && React.createElement(GoalsOverview, {
    goals: goals || []
  }), diet && React.createElement(DietWidget, {
    diet: diet,
    today: today
  }));
}
function TimelineView({
  tasks,
  catMap,
  today,
  nowH,
  xp,
  pct,
  lvlEnd,
  doneTodayCount,
  todayTasks,
  todayHabits,
  habitsDone,
  calendarEvents
}) {
  const {
    toggleTask,
    toggleSlot
  } = useData();
  const timedItems = [];
  todayTasks.forEach(t => {
    if (t.times && t.times.length) {
      t.times.forEach(s => timedItems.push({
        task: t,
        time: s.time,
        label: s.label,
        type: 'slot'
      }));
    } else if (t.time) {
      timedItems.push({
        task: t,
        time: t.time,
        type: 'single'
      });
    }
  });
  (calendarEvents || []).forEach(ev => {
    if (ev.allDay) return;
    const d = new Date(ev.start);
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    timedItems.push({
      calEvent: ev,
      time,
      label: ev.title,
      type: 'gcal',
      color: ev.color || '#ffa830'
    });
  });
  timedItems.sort((a, b) => a.time.localeCompare(b.time));
  const byHour = {};
  timedItems.forEach(item => {
    const hr = item.time.split(':')[0];
    if (!byHour[hr]) byHour[hr] = [];
    if (item.type === 'gcal') {
      const isPast = item.calEvent && new Date(item.calEvent.end) < new Date();
      byHour[hr].push({
        ...item,
        done: isPast,
        color: item.color
      });
    } else {
      const done = item.type === 'slot' ? Orbita.isSlotDone(item.task, today, item.time) : Orbita.isTaskDone(item.task, today);
      const cat = catMap[item.task.cat];
      const color = cat ? Orbita.resolveColor(cat.color) : '#b066ff';
      byHour[hr].push({
        ...item,
        done,
        color
      });
    }
  });
  const nowHour = Math.floor(nowH);
  return React.createElement("div", {
    className: "screen-grid"
  }, React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, "Timeline"), React.createElement("h3", {
    className: "panel-title"
  }, "Seu dia."))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, Array.from({
    length: 17
  }, (_, i) => i + 6).map(hr => {
    const hrStr = String(hr).padStart(2, '0');
    const items = byHour[hrStr] || [];
    const isNow = hr === nowHour;
    if (items.length === 0 && !isNow) return null;
    const nowMinPct = isNow ? Math.round((nowH - hr) * 100) : 0;
    return React.createElement("div", {
      key: hr,
      style: {
        display: 'flex',
        gap: 12,
        padding: '6px 0',
        borderTop: '1px solid var(--line)',
        position: 'relative',
        minHeight: isNow ? 40 : undefined
      }
    }, isNow && React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${Math.max(4, nowMinPct)}%`,
        height: 2,
        background: '#ff2e88',
        zIndex: 2,
        pointerEvents: 'none',
        boxShadow: '0 0 6px #ff2e88'
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: -4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#ff2e88'
      }
    })), React.createElement("div", {
      className: "mono",
      style: {
        width: 40,
        fontSize: 11,
        color: isNow ? '#ff2e88' : 'var(--ink-4)',
        paddingTop: 4,
        flexShrink: 0,
        fontWeight: isNow ? 600 : 400
      }
    }, hrStr, ":00"), React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, isNow && items.length === 0 && React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 0'
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: '#ff2e88'
      }
    }, "agora")), items.map((e, i) => React.createElement("div", {
      key: i,
      onClick: () => {
        if (e.type === 'gcal') {
          if (e.calEvent.htmlLink) window.open(e.calEvent.htmlLink, '_blank');
        } else if (e.type === 'slot') toggleSlot(e.task.id, today, e.time);else toggleTask(e.task.id, today);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 10,
        cursor: 'pointer',
        borderLeft: `3px solid ${e.color}`,
        background: `linear-gradient(90deg, ${e.color}11, transparent)`,
        opacity: e.done ? 0.5 : 1,
        transition: 'all 140ms'
      }
    }, e.type === 'gcal' ? React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "\uD83D\uDCC5") : React.createElement("div", {
      className: `check ${e.done ? 'checked' : ''}`,
      style: {
        width: 18,
        height: 18,
        fontSize: 9
      }
    }, e.done && '✓'), e.type !== 'gcal' && e.task.icon && React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, e.task.icon), React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: e.done ? 'line-through' : 'none',
        color: e.done ? 'var(--ink-3)' : 'var(--ink-1)'
      }
    }, e.label || e.task && e.task.text || ''), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, e.time), e.type !== 'gcal' && React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: e.done ? 'var(--ink-4)' : e.color
      }
    }, "+5"), e.type === 'gcal' && React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--ink-4)'
      }
    }, "\u2197")))));
  })), timedItems.length === 0 && React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 24,
      color: 'var(--ink-3)'
    }
  }, "Nenhuma tarefa com hor\xE1rio hoje")), React.createElement(RightPanel, {
    xp: xp,
    pct: pct,
    lvlEnd: lvlEnd,
    doneTodayCount: doneTodayCount,
    todayTasks: todayTasks,
    todayHabits: todayHabits,
    habitsDone: habitsDone,
    today: today
  }));
}
function KanbanView({
  tasks,
  cats,
  catMap,
  today,
  calendarEvents
}) {
  const {
    toggleTask
  } = useData();
  const groups = {};
  const noCat = {
    id: '_none',
    name: 'Sem categoria',
    icon: '📋',
    color: '#b066ff'
  };
  tasks.forEach(t => {
    const catId = t.cat || '_none';
    if (!groups[catId]) {
      const cat = cats.find(c => c.id === catId) || noCat;
      groups[catId] = {
        cat,
        items: []
      };
    }
    groups[catId].items.push(t);
  });
  const cols = Object.values(groups);
  if (cols.length === 0) cols.push({
    cat: noCat,
    items: []
  });
  return React.createElement("div", {
    className: "kanban",
    style: {
      height: 'calc(100vh - 220px)'
    }
  }, calendarEvents && calendarEvents.length > 0 && React.createElement("div", {
    className: "kanban-col"
  }, React.createElement("div", {
    className: "kanban-col-head",
    style: {
      borderBottom: '1px solid #ffa83030'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: '#ffa830'
    }
  }), React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, "Eventos"), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, calendarEvents.length))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 10,
      overflowY: 'auto'
    }
  }, calendarEvents.map(ev => {
    const evColor = ev.color || '#ffa830';
    const startTime = ev.allDay ? 'Dia inteiro' : new Date(ev.start).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const isPast = !ev.allDay && new Date(ev.end) < new Date();
    return React.createElement("div", {
      key: ev.id,
      className: "kanban-card",
      style: {
        cursor: ev.htmlLink ? 'pointer' : 'default',
        opacity: isPast ? 0.5 : 1,
        borderLeft: `3px solid ${evColor}`
      },
      onClick: () => ev.htmlLink && window.open(ev.htmlLink, '_blank')
    }, React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, ev.title), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 6,
        alignItems: 'center'
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: evColor
      }
    }, startTime), ev.location && React.createElement("span", {
      style: {
        fontSize: 9,
        color: 'var(--ink-3)'
      }
    }, "\uD83D\uDCCD"), ev.htmlLink && React.createElement("span", {
      style: {
        fontSize: 9,
        color: 'var(--ink-4)',
        marginLeft: 'auto'
      }
    }, "\u2197")));
  }))), cols.map(col => {
    const color = Orbita.resolveColor(col.cat.color);
    return React.createElement("div", {
      key: col.cat.id,
      className: "kanban-col"
    }, React.createElement("div", {
      className: "kanban-col-head",
      style: {
        borderBottom: `1px solid ${color}30`
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: color
      }
    }), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, col.cat.icon, " ", col.cat.name), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, col.items.length))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 10,
        overflowY: 'auto'
      }
    }, col.items.map(t => {
      const done = Orbita.isTaskDone(t, today);
      const prioClass = t.prio === 1 ? 'p1' : t.prio === 2 ? 'p2' : t.prio === 3 ? 'p3' : 'p4';
      const prioLabel = t.prio === 1 ? 'urgente' : t.prio === 2 ? 'alta' : t.prio === 3 ? 'média' : 'normal';
      return React.createElement("div", {
        key: t.id,
        className: "kanban-card",
        onClick: () => toggleTask(t.id, today),
        style: {
          cursor: 'pointer'
        }
      }, React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8
        }
      }, React.createElement("div", {
        className: `check ${done ? 'checked' : ''}`,
        style: {
          marginTop: 2
        }
      }, done && '✓'), React.createElement("div", {
        style: {
          flex: 1
        }
      }, React.createElement("div", {
        style: {
          fontSize: 12.5,
          fontWeight: 500,
          textDecoration: done ? 'line-through' : 'none',
          color: done ? 'var(--ink-3)' : 'var(--ink-1)'
        }
      }, t.icon && React.createElement("span", {
        style: {
          marginRight: 4
        }
      }, t.icon), t.text), React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          marginTop: 8,
          alignItems: 'center'
        }
      }, React.createElement("span", {
        className: `priority ${prioClass}`
      }, prioLabel), t.time && React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 10,
          color: 'var(--ink-3)'
        }
      }, "\u23F1 ", t.time)))));
    })));
  }));
}
function WeekViewInline({
  baseDate,
  tasks,
  catMap,
  fetchCalendarRange,
  calendarConnected
}) {
  const {
    toggleTask
  } = useData();
  const today = Orbita.todayStr();
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const [weekEvents, setWeekEvents] = React.useState([]);
  React.useEffect(() => {
    if (!calendarConnected || !fetchCalendarRange) return;
    const startStr = Orbita.dateToStr(days[0]);
    const endStr = Orbita.dateToStr(days[6]);
    fetchCalendarRange(startStr, endStr).then(evs => setWeekEvents(evs || []));
  }, [calendarConnected, baseDate.getTime()]);
  function eventsForDay(ds) {
    return weekEvents.filter(ev => {
      const evDate = (ev.start || '').substring(0, 10);
      return evDate === ds;
    });
  }
  return React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 8,
      padding: '0 28px 40px'
    }
  }, days.map((d, i) => {
    const ds = Orbita.dateToStr(d);
    const isToday = ds === today;
    const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
    const dayEvents = eventsForDay(ds);
    return React.createElement("div", {
      key: i,
      className: "panel",
      style: {
        padding: 14,
        minHeight: 200,
        border: isToday ? '1px solid rgba(255,46,136,0.3)' : undefined,
        background: isToday ? 'rgba(255,46,136,0.06)' : undefined
      }
    }, React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 10
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, dayLabels[i]), React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: isToday ? 700 : 400,
        color: isToday ? '#fff' : 'var(--ink-2)',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic'
      }
    }, d.getDate())), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, dayEvents.map(ev => {
      const evColor = ev.color || '#ffa830';
      const time = ev.allDay ? '' : new Date(ev.start).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return React.createElement("div", {
        key: ev.id,
        onClick: () => ev.htmlLink && window.open(ev.htmlLink, '_blank'),
        style: {
          padding: '6px 8px',
          borderRadius: 6,
          fontSize: 11,
          cursor: 'pointer',
          borderLeft: `2px solid ${evColor}`,
          background: `${evColor}11`,
          color: 'var(--ink-1)'
        }
      }, ev.title, time && React.createElement("div", {
        className: "mono",
        style: {
          fontSize: 9,
          color: evColor,
          marginTop: 2
        }
      }, time));
    }), dayTasks.map(t => {
      const done = Orbita.isTaskDone(t, ds);
      const cat = catMap[t.cat];
      const color = cat ? Orbita.resolveColor(cat.color) : 'var(--neon-c)';
      return React.createElement("div", {
        key: t.id,
        onClick: () => toggleTask(t.id, ds),
        style: {
          padding: '6px 8px',
          borderRadius: 6,
          fontSize: 11,
          cursor: 'pointer',
          borderLeft: `2px solid ${color}`,
          background: done ? 'rgba(255,255,255,0.02)' : `${color}11`,
          opacity: done ? 0.45 : 1,
          textDecoration: done ? 'line-through' : 'none',
          color: done ? 'var(--ink-3)' : 'var(--ink-1)'
        }
      }, t.icon && React.createElement("span", {
        style: {
          marginRight: 3
        }
      }, t.icon), t.text, t.time && React.createElement("div", {
        className: "mono",
        style: {
          fontSize: 9,
          color: 'var(--ink-4)',
          marginTop: 2
        }
      }, t.time));
    }), dayTasks.length === 0 && dayEvents.length === 0 && React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--ink-4)',
        textAlign: 'center',
        padding: 8
      }
    }, "\u2014")));
  }));
}
function MonthViewInline({
  baseDate,
  tasks,
  catMap,
  fetchCalendarRange,
  calendarConnected
}) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = Orbita.todayStr();
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const [monthEvents, setMonthEvents] = React.useState([]);
  React.useEffect(() => {
    if (!calendarConnected || !fetchCalendarRange) return;
    const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    fetchCalendarRange(startStr, endStr).then(evs => setMonthEvents(evs || []));
  }, [calendarConnected, year, month]);
  function eventsForDay(ds) {
    return monthEvents.filter(ev => (ev.start || '').substring(0, 10) === ds);
  }
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 20,
      margin: '0 28px 40px'
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      marginBottom: 8
    }
  }, dayLabels.map(d => React.createElement("div", {
    key: d,
    className: "mono",
    style: {
      textAlign: 'center',
      fontSize: 10,
      color: 'var(--ink-4)',
      padding: 6
    }
  }, d))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2
    }
  }, cells.map((d, i) => {
    if (!d) return React.createElement("div", {
      key: i
    });
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = ds === today;
    const dayTasks = tasks.filter(t => Orbita.isTaskForDate(t, ds));
    const dayEvents = eventsForDay(ds);
    const allItems = [...dayEvents.map(ev => ({
      type: 'ev',
      ev
    })), ...dayTasks.map(t => ({
      type: 'task',
      t
    }))];
    return React.createElement("div", {
      key: i,
      style: {
        padding: '8px 4px',
        borderRadius: 8,
        textAlign: 'center',
        minHeight: 60,
        background: isToday ? 'var(--gradient-neon-soft)' : 'rgba(255,255,255,0.02)',
        border: isToday ? '1px solid rgba(255,46,136,0.3)' : '1px solid transparent'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: isToday ? 600 : 400,
        color: isToday ? '#fff' : 'var(--ink-2)'
      }
    }, d), allItems.length > 0 && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        marginTop: 4,
        textAlign: 'left'
      }
    }, allItems.slice(0, 3).map((item, j) => {
      if (item.type === 'ev') {
        const evColor = item.ev.color || '#ffa830';
        return React.createElement("div", {
          key: 'ev' + j,
          style: {
            fontSize: 8,
            lineHeight: 1.3,
            padding: '1px 3px',
            borderRadius: 3,
            borderLeft: `2px solid ${evColor}`,
            background: `${evColor}11`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, item.ev.title);
      }
      const ct = catMap[item.t.cat];
      const clr = ct ? Orbita.resolveColor(ct.color) : 'var(--neon-c)';
      const dn = Orbita.isTaskDone(item.t, ds);
      return React.createElement("div", {
        key: 't' + j,
        style: {
          fontSize: 8,
          lineHeight: 1.3,
          padding: '1px 3px',
          borderRadius: 3,
          borderLeft: `2px solid ${clr}`,
          background: `${clr}11`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          opacity: dn ? 0.4 : 1,
          textDecoration: dn ? 'line-through' : 'none'
        }
      }, item.t.icon && React.createElement("span", {
        style: {
          marginRight: 1
        }
      }, item.t.icon), item.t.text);
    }), allItems.length > 3 && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 7,
        color: 'var(--ink-3)',
        textAlign: 'center'
      }
    }, "+", allItems.length - 3, " mais")));
  })));
}
function TaskItem({
  task,
  dateCtx,
  catMap
}) {
  const {
    toggleTask,
    toggleSlot,
    toggleSubtask,
    deleteTask,
    data
  } = useData();
  const t = task;
  const collapseKey = `orbita_collapse_${t.id}`;
  const saved = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(collapseKey) || '{}');
    } catch {
      return {};
    }
  }, [t.id]);
  const [subsOpen, setSubsOpen] = React.useState(saved.subs !== undefined ? saved.subs : false);
  const [slotsOpen, setSlotsOpen] = React.useState(saved.slots !== undefined ? saved.slots : true);
  function persistCollapse(slots, subs) {
    localStorage.setItem(collapseKey, JSON.stringify({
      slots,
      subs
    }));
  }
  function toggleSlots() {
    const v = !slotsOpen;
    setSlotsOpen(v);
    persistCollapse(v, subsOpen);
  }
  function toggleSubs() {
    const v = !subsOpen;
    setSubsOpen(v);
    persistCollapse(slotsOpen, v);
  }
  const done = Orbita.isTaskDone(t, dateCtx);
  const cat = catMap[t.cat];
  const depTask = t.dependsOn ? (data.tasks || []).find(x => x.id === t.dependsOn) : null;
  const depDone = depTask ? Orbita.isTaskDone(depTask, dateCtx) : false;
  const color = cat ? Orbita.resolveColor(cat.color) : null;
  const prioClass = t.prio === 1 ? 'p1' : t.prio === 2 ? 'p2' : t.prio === 3 ? 'p3' : 'p4';
  const prioLabel = t.prio === 1 ? 'urgente' : t.prio === 2 ? 'alta' : t.prio === 3 ? 'média' : 'baixa';
  const hasSlots = t.times && t.times.length > 0;
  function onMainClick(e) {
    window._editTask && window._editTask(t);
  }
  function onCheckClick(e) {
    e.stopPropagation();
    if (!hasSlots) toggleTask(t.id, dateCtx);
  }
  const [hovered, setHovered] = React.useState(false);
  return React.createElement("div", {
    className: `task-item ${done ? 'done' : ''}`,
    onClick: onMainClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      cursor: 'pointer'
    }
  }, React.createElement("div", {
    className: `check ${done ? 'checked' : ''}`,
    onClick: e => {
      e.stopPropagation();
      if (hasSlots) {
        const allDone = t.times.every(s => Orbita.isSlotDone(t, dateCtx, s.time));
        if (allDone) {
          toggleTask(t.id, dateCtx);
        } else {
          t.times.forEach(s => {
            if (!Orbita.isSlotDone(t, dateCtx, s.time)) toggleSlot(t.id, dateCtx, s.time);
          });
        }
      } else {
        toggleTask(t.id, dateCtx);
      }
    },
    style: {
      width: 22,
      height: 22,
      fontSize: 11,
      flexShrink: 0,
      cursor: 'pointer'
    }
  }, done && '✓'), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "task-text"
  }, t.icon && React.createElement("span", {
    style: {
      marginRight: 6
    }
  }, t.icon), t.text), React.createElement("div", {
    className: "task-meta"
  }, prioLabel && React.createElement("span", {
    className: `priority ${prioClass}`
  }, prioLabel), t.time && !hasSlots && React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "\u23F1 ", t.time), cat && React.createElement("span", {
    style: {
      fontSize: 9,
      padding: '2px 6px',
      borderRadius: 4,
      background: color + '22',
      color: color
    }
  }, cat.icon, " ", cat.name), depTask && React.createElement("span", {
    title: depDone ? `Depende de: ${depTask.text} (concluída)` : `Bloqueada por: ${depTask.text}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 9,
      padding: '2px 7px',
      borderRadius: 4,
      background: depDone ? 'rgba(60,207,145,0.12)' : 'rgba(255,168,48,0.14)',
      color: depDone ? '#3ccf91' : '#ffa830',
      border: depDone ? '1px solid rgba(60,207,145,0.25)' : '1px solid rgba(255,168,48,0.3)',
      fontWeight: 500
    }
  }, React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, depDone ? '✓' : '⛓'), React.createElement("span", null, "depende: ", depTask.text.length > 22 ? depTask.text.slice(0, 22) + '…' : depTask.text)), t.freq !== 'pontual' && React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: 'var(--ink-3)'
    }
  }, t.freq), t.dateEnd && React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9,
      color: 'var(--ink-3)'
    }
  }, "at\xE9 ", Orbita.fmtDate(t.dateEnd)), t.dateEnd && t.date && (() => {
    const start = new Date(t.date + 'T00:00:00').getTime();
    const end = new Date(t.dateEnd + 'T23:59:59').getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = Math.min(now - start, total);
    const pctTime = total > 0 ? Math.max(0, Math.min(100, Math.round(elapsed / total * 100))) : 100;
    const overdue = now > end;
    const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
    const barColor = overdue ? '#ff5555' : pctTime > 75 ? '#ffa830' : 'var(--neon-a)';
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flex: '0 0 120px'
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        width: `${pctTime}%`,
        height: '100%',
        borderRadius: 2,
        background: barColor,
        transition: 'width 300ms'
      }
    })), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: barColor,
        whiteSpace: 'nowrap'
      }
    }, overdue ? 'atrasada' : `${daysLeft}d`));
  })(), React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 4,
      opacity: hovered ? 1 : 0,
      transition: 'opacity 150ms'
    }
  }, React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      window._editTask && window._editTask(t);
    },
    style: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid var(--line)',
      borderRadius: 5,
      color: 'var(--ink-3)',
      cursor: 'pointer',
      fontSize: 10,
      padding: '2px 6px',
      transition: 'all 100ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
      e.currentTarget.style.color = 'var(--ink-1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.color = 'var(--ink-3)';
    }
  }, "\u270E"), React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      if (confirm('Deletar "' + t.text + '"?')) deleteTask(t.id);
    },
    style: {
      background: 'rgba(255,85,85,0.08)',
      border: '1px solid rgba(255,85,85,0.2)',
      borderRadius: 5,
      color: '#ff5555',
      cursor: 'pointer',
      fontSize: 10,
      padding: '2px 6px',
      transition: 'all 100ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(255,85,85,0.2)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'rgba(255,85,85,0.08)';
    }
  }, "\u2715"))), hasSlots && React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      toggleSlots();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      padding: '3px 0',
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 8,
      transition: 'transform 150ms',
      transform: slotsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
      display: 'inline-block'
    }
  }, "\u25B6"), React.createElement("span", null, t.times.filter(s => Orbita.isSlotDone(t, dateCtx, s.time)).length, "/", t.times.length, " hor\xE1rios")), slotsOpen && React.createElement("div", {
    className: "task-slots",
    style: {
      marginTop: 4
    }
  }, t.times.map(s => {
    const slotDone = Orbita.isSlotDone(t, dateCtx, s.time);
    return React.createElement("div", {
      key: s.time,
      className: `task-slot ${slotDone ? 'done' : ''}`,
      onClick: e => {
        e.stopPropagation();
        toggleSlot(t.id, dateCtx, s.time);
      },
      style: {
        cursor: 'pointer',
        padding: '6px 10px',
        borderRadius: 8,
        background: slotDone ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        transition: 'all 140ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)',
      onMouseLeave: e => e.currentTarget.style.background = slotDone ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)'
    }, React.createElement("div", {
      className: `check ${slotDone ? 'checked' : ''}`,
      style: {
        width: 16,
        height: 16,
        fontSize: 8
      }
    }, slotDone && '✓'), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: 'var(--ink-3)'
      }
    }, s.time), React.createElement("span", {
      style: {
        fontSize: 12.5,
        textDecoration: slotDone ? 'line-through' : 'none',
        color: slotDone ? 'var(--ink-3)' : 'var(--ink-1)'
      }
    }, s.label || t.text));
  }))), t.subtasks && t.subtasks.length > 0 && React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      toggleSubs();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      padding: '3px 0',
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 8,
      transition: 'transform 150ms',
      transform: subsOpen ? 'rotate(90deg)' : 'rotate(0deg)'
    }
  }, "\u25B6"), React.createElement("span", null, t.subtasks.filter(s => s.done).length, "/", t.subtasks.length, " subtarefas")), subsOpen && React.createElement("div", {
    className: "subtask-list",
    style: {
      marginTop: 4
    }
  }, t.subtasks.map((s, i) => React.createElement("div", {
    key: i,
    className: "subtask-item",
    onClick: e => {
      e.stopPropagation();
      toggleSubtask(t.id, i);
    },
    style: {
      cursor: 'pointer',
      padding: '4px 6px',
      borderRadius: 6,
      transition: 'background 100ms'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, React.createElement("div", {
    className: `check ${s.done ? 'checked' : ''}`,
    style: {
      width: 14,
      height: 14,
      fontSize: 7
    }
  }, s.done && '✓'), s.time && React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: 'var(--ink-3)',
      marginRight: 2
    }
  }, s.time), React.createElement("span", {
    style: {
      textDecoration: s.done ? 'line-through' : 'none',
      color: s.done ? 'var(--ink-3)' : 'var(--ink-2)'
    }
  }, s.text)))))));
}
function BirthdayBanner({
  profile
}) {
  if (!profile || !profile.birthday) return null;
  const today = new Date();
  const bday = profile.birthday;
  const todayMD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const bdayMD = bday.substring(5);
  if (todayMD !== bdayMD) return null;
  const name = profile.name || 'Aventureiro';
  return React.createElement("div", {
    style: {
      margin: '0 28px 12px',
      padding: '16px 24px',
      borderRadius: 16,
      background: 'var(--gradient-neon-soft)',
      border: '1px solid rgba(255,46,136,0.25)',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 6
    }
  }, "\uD83C\uDF82"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22
    }
  }, "Feliz anivers\xE1rio, ", name, "!"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-2)',
      marginTop: 4
    }
  }, "Que este novo ano seja \xE9pico. +50 XP de presente!"));
}
function getDailyQuote() {
  const quotes = QUOTES_LIST;
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return quotes[dayOfYear % quotes.length];
}
function MobileDateNavWithQuote({
  isToday,
  shiftDay,
  setSelectedDate
}) {
  const q = getDailyQuote();
  return React.createElement("div", {
    className: "mobile-only mobile-date-nav",
    style: {
      padding: '0 16px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement("button", {
    onClick: () => shiftDay(-1),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      color: 'var(--ink-2)',
      fontSize: 14,
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, "\u2190"), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 2
    }
  }, !isToday ? React.createElement("button", {
    onClick: () => setSelectedDate(new Date()),
    style: {
      padding: '6px 14px',
      borderRadius: 8,
      background: 'var(--gradient-neon-soft)',
      border: '1px solid rgba(255,46,136,0.22)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'var(--font-ui)',
      cursor: 'pointer'
    }
  }, "\u21BA Voltar para hoje") : React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 13,
      lineHeight: 1.3,
      color: 'var(--ink-2)',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      textOverflow: 'ellipsis'
    }
  }, "\"", q.text, "\""), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: 'var(--ink-4)',
      letterSpacing: '0.04em'
    }
  }, "\u2014 ", q.author))), React.createElement("button", {
    onClick: () => shiftDay(1),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      color: 'var(--ink-2)',
      fontSize: 14,
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, "\u2192"));
}
const QUOTES_LIST = [{
  text: 'Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.',
  author: 'Sêneca'
}, {
  text: 'A felicidade da sua vida depende da qualidade dos seus pensamentos.',
  author: 'Marco Aurélio'
}, {
  text: 'Temos duas orelhas e uma boca para que possamos ouvir o dobro do que falamos.',
  author: 'Epicteto'
}, {
  text: 'A alma toma a cor dos seus pensamentos.',
  author: 'Marco Aurélio'
}, {
  text: 'Não é o homem que tem pouco, mas o que deseja muito, que é pobre.',
  author: 'Sêneca'
}, {
  text: 'O impedimento à ação impulsiona a ação. O que está no caminho se torna o caminho.',
  author: 'Marco Aurélio'
}, {
  text: 'Somos o que repetidamente fazemos. A excelência, portanto, não é um ato, mas um hábito.',
  author: 'Aristóteles'
}, {
  text: 'A vida não examinada não vale a pena ser vivida.',
  author: 'Sócrates'
}, {
  text: 'Sorte é o que acontece quando a preparação encontra a oportunidade.',
  author: 'Sêneca'
}, {
  text: 'Você tem poder sobre sua mente — não sobre eventos externos. Perceba isso e encontrará força.',
  author: 'Marco Aurélio'
}, {
  text: 'A riqueza não consiste em ter grandes posses, mas em ter poucas necessidades.',
  author: 'Epicteto'
}, {
  text: 'O segredo da mudança é focar toda a sua energia não em lutar contra o velho, mas em construir o novo.',
  author: 'Sócrates'
}, {
  text: 'Quem conquista a si mesmo é mais poderoso do que quem conquista mil vezes mil homens em batalha.',
  author: 'Buda'
}, {
  text: 'A disciplina é a ponte entre metas e conquistas.',
  author: 'Jim Rohn'
}, {
  text: 'Perde-se frequentemente pela hesitação o que se poderia ganhar pelo risco.',
  author: 'Sêneca'
}, {
  text: 'Não busque que os eventos aconteçam como você deseja, mas deseje que aconteçam como acontecem, e tudo ficará bem.',
  author: 'Epicteto'
}, {
  text: 'Quando você se levantar de manhã, pense no privilégio que é estar vivo — respirar, pensar, aproveitar, amar.',
  author: 'Marco Aurélio'
}, {
  text: 'O homem que move montanhas começa carregando pequenas pedras.',
  author: 'Confúcio'
}, {
  text: 'A virtude é o único bem verdadeiro; o vício, o único mal verdadeiro.',
  author: 'Sêneca'
}, {
  text: 'Nada grandioso foi jamais realizado sem entusiasmo.',
  author: 'Emerson'
}, {
  text: 'Primeiro diga a si mesmo o que você quer ser; depois faça o que tem que fazer.',
  author: 'Epicteto'
}, {
  text: 'A melhor vingança é não ser como seu inimigo.',
  author: 'Marco Aurélio'
}, {
  text: 'Não é que tenhamos pouco tempo, é que desperdiçamos muito.',
  author: 'Sêneca'
}, {
  text: 'Conhece-te a ti mesmo.',
  author: 'Sócrates'
}, {
  text: 'Tudo o que ouvimos é uma opinião, não um fato. Tudo o que vemos é uma perspectiva, não a verdade.',
  author: 'Marco Aurélio'
}, {
  text: 'A mente que se abre a uma nova ideia jamais volta ao seu tamanho original.',
  author: 'Einstein'
}, {
  text: 'Sofrer antes do necessário é sofrer mais do que o necessário.',
  author: 'Sêneca'
}, {
  text: 'A educação é a arma mais poderosa que você pode usar para mudar o mundo.',
  author: 'Mandela'
}, {
  text: 'Cuide do seu corpo. É o único lugar que você tem para viver.',
  author: 'Jim Rohn'
}, {
  text: 'Se queres prever o futuro, estuda o passado.',
  author: 'Confúcio'
}, {
  text: 'A persistência é o caminho do êxito.',
  author: 'Charles Chaplin'
}];
function DailyQuote() {
  const q = getDailyQuote();
  return React.createElement("div", {
    className: "desktop-only",
    style: {
      padding: '0 28px 10px'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 18,
      color: 'var(--ink-2)',
      lineHeight: 1.5
    }
  }, "\"", q.text, "\""), React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "\u2014 ", q.author));
}
function UpcomingHolidays() {
  const year = new Date().getFullYear();
  function easter(y) {
    const a = y % 19,
      b = Math.floor(y / 100),
      c = y % 100,
      d = Math.floor(b / 4),
      e = b % 4,
      f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4),
      k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31),
      day = (h + l - 7 * m + 114) % 31 + 1;
    return new Date(y, month - 1, day);
  }
  const e = easter(year);
  const addDays = (d, n) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  };
  const fmtMD = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  const holidays = [{
    date: new Date(year, 0, 1),
    name: 'Confraternização Universal',
    icon: '🎆'
  }, {
    date: addDays(e, -47),
    name: 'Carnaval',
    icon: '🎭'
  }, {
    date: addDays(e, -46),
    name: 'Quarta de Cinzas',
    icon: '✝️'
  }, {
    date: addDays(e, -2),
    name: 'Sexta-Feira Santa',
    icon: '✝️'
  }, {
    date: e,
    name: 'Páscoa',
    icon: '🐣'
  }, {
    date: new Date(year, 3, 21),
    name: 'Tiradentes',
    icon: '🇧🇷'
  }, {
    date: new Date(year, 4, 1),
    name: 'Dia do Trabalho',
    icon: '👷'
  }, {
    date: addDays(e, 60),
    name: 'Corpus Christi',
    icon: '✝️'
  }, {
    date: new Date(year, 5, 12),
    name: 'Dia dos Namorados',
    icon: '💕'
  }, {
    date: new Date(year, 5, 24),
    name: 'São João',
    icon: '🎆'
  }, {
    date: new Date(year, 7, 11),
    name: 'Dia dos Pais',
    icon: '👨'
  }, {
    date: new Date(year, 8, 7),
    name: 'Independência',
    icon: '🇧🇷'
  }, {
    date: new Date(year, 9, 12),
    name: 'N. Sra. Aparecida',
    icon: '🙏'
  }, {
    date: new Date(year, 10, 2),
    name: 'Finados',
    icon: '🕯️'
  }, {
    date: new Date(year, 10, 15),
    name: 'Proclamação da República',
    icon: '🇧🇷'
  }, {
    date: new Date(year, 10, 20),
    name: 'Consciência Negra',
    icon: '✊'
  }, {
    date: new Date(year, 11, 25),
    name: 'Natal',
    icon: '🎄'
  }, {
    date: new Date(year, 11, 31),
    name: 'Réveillon',
    icon: '🎆'
  }, {
    date: new Date(year + 1, 0, 1),
    name: 'Confraternização Universal',
    icon: '🎆'
  }];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const limit = new Date(now);
  limit.setDate(limit.getDate() + 15);
  const upcoming = holidays.filter(h => h.date >= now && h.date <= limit);
  if (upcoming.length === 0) return null;
  return React.createElement("div", {
    style: {
      padding: '0 28px 8px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, React.createElement("span", {
    className: "eyebrow",
    style: {
      fontSize: 9
    }
  }, "Pr\xF3ximos feriados:"), upcoming.map((h, i) => React.createElement("span", {
    key: i,
    style: {
      fontSize: 11,
      color: 'var(--ink-2)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, React.createElement("span", null, h.icon), React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, fmtMD(h.date)), React.createElement("span", null, h.name))));
}
function GoalsOverview({
  goals
}) {
  const active = goals.filter(g => {
    const ms = g.milestones || [];
    return ms.length === 0 || ms.some(m => !m.done);
  });
  if (active.length === 0) return null;
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 20,
      borderLeft: '3px solid var(--neon-c, #b066ff)'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    role: "button",
    tabIndex: 0,
    title: "Abrir Objetivos",
    onClick: () => window._goScreen && window._goScreen('goals'),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window._goScreen && window._goScreen('goals');
      }
    },
    style: {
      color: 'var(--neon-c, #b066ff)',
      marginBottom: 12,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      opacity: 1,
      transition: 'opacity 120ms'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 0.7,
    onMouseLeave: e => e.currentTarget.style.opacity = 1
  }, "\u25CE Objetivos \xB7 ", active.length, React.createElement("span", {
    style: {
      fontSize: 9,
      opacity: 0.8
    }
  }, "\u2192")), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, active.map(g => {
    const ms = g.milestones || [];
    const done = ms.filter(m => m.done).length;
    const pct = ms.length ? Math.round(done / ms.length * 100) : 0;
    const next = ms.find(m => !m.done);
    const overdue = g.deadline && Orbita.isOverdue(g.deadline);
    return React.createElement("div", {
      key: g.id,
      role: "button",
      tabIndex: 0,
      title: `Abrir Objetivos — ${g.title || ''}`.trim(),
      onClick: () => window._goScreen && window._goScreen('goals'),
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window._goScreen && window._goScreen('goals');
        }
      },
      style: {
        display: 'flex',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--line)',
        cursor: 'pointer',
        transition: 'all 120ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
      onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
    }, React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--line)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 18,
        flexShrink: 0
      }
    }, g.icon || '◎'), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, g.title), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--neon-a)',
        fontWeight: 600,
        marginLeft: 'auto',
        flexShrink: 0
      }
    }, pct, "%")), next && React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--ink-4)'
      }
    }, "\u2192"), " ", next.text, next.suggestedDate && React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9,
        color: Orbita.isOverdue(next.suggestedDate) ? '#ff5555' : 'var(--ink-4)',
        marginLeft: 4
      }
    }, "\xB7 ", Orbita.fmtDate(next.suggestedDate))), g.deadline && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: overdue ? '#ff5555' : 'var(--ink-4)',
        marginTop: 3
      }
    }, overdue ? '⚠ atrasado' : `prazo ${Orbita.fmtDate(g.deadline)}`), React.createElement("div", {
      style: {
        height: 3,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.06)',
        marginTop: 6,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        width: `${pct}%`,
        height: '100%',
        background: 'var(--gradient-neon)',
        borderRadius: 2
      }
    }))));
  })));
}
function CalendarEventsPanel({
  events,
  connected
}) {
  if (!connected) {
    return React.createElement("div", {
      className: "panel",
      style: {
        padding: 20,
        textAlign: 'center'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 28,
        marginBottom: 10
      }
    }, "\uD83D\uDCC5"), React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 6
      }
    }, "Google Calendar"), React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-3)',
        marginBottom: 14,
        lineHeight: 1.5
      }
    }, "Conecte seu Google Calendar para ver seus eventos aqui."), React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '10px 20px',
        fontSize: 13
      },
      onClick: () => {
        if (window.OrbitaFirebase && window.OrbitaFirebase.getCurrentUser()) {
          window.OrbitaFirebase.connectGoogleCalendar();
        } else {
          window.OrbitaFirebase.signInWithGoogle(true);
        }
      }
    }, "Conectar Google Calendar"));
  }
  if (events.length === 0) {
    return React.createElement("div", {
      className: "panel",
      style: {
        padding: 20
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, "Eventos \xB7 Google Calendar"), React.createElement("button", {
      className: "btn-ghost small",
      onClick: () => window.OrbitaFirebase.disconnectGoogleCalendar(),
      style: {
        fontSize: 9,
        color: 'var(--ink-4)'
      }
    }, "desconectar")), React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--ink-3)',
        padding: '12px 0',
        textAlign: 'center'
      }
    }, "Nenhum evento para hoje"));
  }
  return React.createElement("div", {
    className: "panel",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }
  }, React.createElement("div", {
    className: "eyebrow"
  }, "Eventos \xB7 ", events.length), React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => window.OrbitaFirebase.disconnectGoogleCalendar(),
    style: {
      fontSize: 9,
      color: 'var(--ink-4)'
    }
  }, "desconectar")), React.createElement("div", {
    className: "task-list"
  }, events.map(ev => {
    const evColor = ev.color || '#ffa830';
    const startTime = ev.allDay ? 'Dia inteiro' : new Date(ev.start).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = !ev.allDay ? new Date(ev.end).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }) : null;
    const isPast = !ev.allDay && new Date(ev.end) < new Date();
    return React.createElement("div", {
      key: ev.id,
      className: "task-item",
      style: {
        cursor: ev.htmlLink ? 'pointer' : 'default',
        opacity: isPast ? 0.5 : 1,
        borderLeft: `3px solid ${evColor}`,
        paddingLeft: 12
      },
      onClick: () => ev.htmlLink && window.open(ev.htmlLink, '_blank')
    }, React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      className: "task-text",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "\uD83D\uDCC5"), ev.title), React.createElement("div", {
      className: "task-meta"
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: evColor
      }
    }, startTime, endTime ? ` — ${endTime}` : ''), ev.location && React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--ink-3)'
      }
    }, "\uD83D\uDCCD ", ev.location))), ev.htmlLink && React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--ink-4)'
      }
    }, "\u2197"));
  })));
}
const TASK_SOURCE_META = {
  obsidian: {
    icon: '🪨',
    label: 'Obsidian'
  },
  'notion-work': {
    icon: '💼',
    label: 'Notion trabalho'
  },
  'notion-personal': {
    icon: '📓',
    label: 'Notion pessoal'
  },
  claude: {
    icon: '✳',
    label: 'Claude'
  },
  orbita: {
    icon: '◈',
    label: 'Orbita'
  }
};
function TaskSourceBadge({
  source
}) {
  const m = TASK_SOURCE_META[source];
  if (!m || source === 'orbita') return null;
  return React.createElement("span", {
    title: `Origem: ${m.label}`,
    style: {
      fontSize: 10,
      padding: '1px 6px',
      borderRadius: 6,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid var(--line)',
      color: 'var(--ink-3)',
      whiteSpace: 'nowrap'
    }
  }, m.icon, " ", m.label);
}
// Campo de prazo do painel ★ Sem prazo.
//
// input[type=date] dispara change a cada dígito do ano: digitar 2026 emite
// "0002", "0020", "0202" e só então "2026". Como gravar o prazo tira a tarefa
// da lista, gravar no primeiro evento fazia a linha sumir no meio da digitação,
// com o ano errado. Só comitamos quando o ano é plausível.
function DeadlineInput({
  onSet
}) {
  const [v, setV] = React.useState('');
  return React.createElement("input", {
    className: "form-input mono",
    type: "date",
    value: v,
    title: "Definir prazo (tira da lista)",
    onChange: e => {
      const val = e.target.value;
      setV(val);
      const ano = Number((val.split('-')[0] || '0'));
      if (val && ano >= 2000 && ano <= 2999) onSet(val);
    },
    style: {
      width: 132,
      padding: '4px 8px',
      fontSize: 11
    }
  });
}
function StarredInbox() {
  const {
    data,
    saveTask,
    toggleTask,
    deleteTask
  } = useData();
  const [open, setOpen] = React.useState(() => localStorage.getItem('orbita_starred_open') !== '0');
  const catMap = React.useMemo(() => Object.fromEntries((data.categories || []).map(c => [c.id, c])), [data.categories]);
  const items = (data.tasks || []).filter(t => !t.done && (t.starred || !t.date));
  if (items.length === 0) return null;
  function toggleOpen() {
    const v = !open;
    setOpen(v);
    localStorage.setItem('orbita_starred_open', v ? '1' : '0');
  }
  function setDeadline(task, value) {
    if (!value) return;
    saveTask({
      date: value,
      starred: false
    }, task.id);
    window._showQuickToast && window._showQuickToast(`Prazo definido — "${task.text}"`);
  }
  return React.createElement("div", {
    className: "panel",
    style: {
      margin: '0 28px 12px',
      padding: 18,
      borderLeft: '3px solid #ffb020'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    role: "button",
    tabIndex: 0,
    onClick: toggleOpen,
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleOpen();
      }
    },
    title: "Tarefas ainda sem prazo definido",
    style: {
      color: '#ffb020',
      marginBottom: open ? 12 : 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("span", {
    style: {
      fontSize: 8,
      transition: 'transform 150ms',
      transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
    }
  }, "▶"), "★ Sem prazo \xB7 ", items.length), open && React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, items.map(t => {
    const cat = catMap[t.cat];
    const color = cat ? Orbita.resolveColor(cat.color) : null;
    return React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--line)',
        transition: 'background 120ms'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
      onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
    }, React.createElement("div", {
      className: "check",
      role: "button",
      tabIndex: 0,
      title: "Concluir",
      onClick: () => {
        toggleTask(t.id, Orbita.todayStr());
      },
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTask(t.id, Orbita.todayStr());
        }
      },
      style: {
        width: 16,
        height: 16,
        fontSize: 9,
        flexShrink: 0,
        cursor: 'pointer'
      }
    }), React.createElement("span", {
      style: {
        fontSize: 14,
        width: 18,
        textAlign: 'center'
      }
    }, t.icon || '★'), React.createElement("span", {
      role: "button",
      tabIndex: 0,
      onClick: () => window._editTask && window._editTask(t),
      onKeyDown: e => {
        if (e.key === 'Enter') window._editTask && window._editTask(t);
      },
      title: "Abrir tarefa",
      style: {
        flex: 1,
        fontSize: 13,
        cursor: 'pointer',
        color: 'var(--ink-1)'
      }
    }, t.text), cat && React.createElement("span", {
      style: {
        fontSize: 10,
        padding: '1px 6px',
        borderRadius: 6,
        background: color ? color + '22' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${color ? color + '55' : 'var(--line)'}`,
        color: 'var(--ink-2)',
        whiteSpace: 'nowrap'
      }
    }, cat.icon, " ", cat.name), React.createElement(TaskSourceBadge, {
      source: t.source
    }), React.createElement(DeadlineInput, {
      onSet: v => setDeadline(t, v)
    }), React.createElement("button", {
      title: "Excluir",
      onClick: () => {
        if (!confirm(`Excluir "${t.text}"?`)) return;
        deleteTask(t.id);
        window._showQuickToast && window._showQuickToast(`"${t.text}" excluída`);
      },
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--ink-4)',
        cursor: 'pointer',
        fontSize: 12,
        padding: '2px 4px',
        flexShrink: 0
      },
      onMouseEnter: e => e.currentTarget.style.color = 'var(--neon-a, #ff2e88)',
      onMouseLeave: e => e.currentTarget.style.color = 'var(--ink-4)'
    }, "✕"));
  })));
}
window.StarredInbox = StarredInbox;
window.TaskSourceBadge = TaskSourceBadge;
window.ScreenToday = ScreenToday;
window.TaskItem = TaskItem;
window.CalendarEventsPanel = CalendarEventsPanel;