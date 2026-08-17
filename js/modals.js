function TaskModal({
  onClose,
  editTask
}) {
  const {
    saveTask,
    data
  } = useData();
  const [text, setText] = React.useState(editTask?.text || '');
  const [desc, setDesc] = React.useState(editTask?.desc || '');
  const [date, setDate] = React.useState(editTask?.date || Orbita.todayStr());
  const [noDate, setNoDate] = React.useState(editTask ? !editTask.date : false);
  const [time, setTime] = React.useState(editTask?.time || '');
  const [freq, setFreq] = React.useState(editTask?.freq || 'pontual');
  const [prio, setPrio] = React.useState(editTask?.prio || 3);
  const [cat, setCat] = React.useState(editTask?.cat || (data.categories && data.categories[0] ? data.categories[0].id : ''));
  const [icon, setIcon] = React.useState(editTask?.icon || '');
  const [days, setDays] = React.useState(editTask?.days || [1, 2, 3, 4, 5]);
  const [interval_, setInterval_] = React.useState(editTask?.interval || 7);
  const [subtasks, setSubtasks] = React.useState(editTask?.subtasks ? editTask.subtasks.map(s => ({
    ...s
  })) : []);
  const [newSubtask, setNewSubtask] = React.useState('');
  const [newSubtaskTime, setNewSubtaskTime] = React.useState('');
  const [times, setTimes] = React.useState(editTask?.times ? editTask.times.map(t => ({
    ...t
  })) : []);
  const [newTimeVal, setNewTimeVal] = React.useState('');
  const [newTimeLabel, setNewTimeLabel] = React.useState('');
  const [dateEnd, setDateEnd] = React.useState(editTask?.dateEnd || '');
  const [dependsOn, setDependsOn] = React.useState(editTask?.dependsOn || '');
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const freqs = [{
    v: 'pontual',
    l: 'Pontual'
  }, {
    v: 'diaria',
    l: 'Diária'
  }, {
    v: 'semanal',
    l: 'Semanal'
  }, {
    v: 'mensal',
    l: 'Mensal'
  }, {
    v: 'anual',
    l: 'Anual'
  }, {
    v: 'periodica',
    l: 'Periódica'
  }];
  const prios = [{
    v: 1,
    l: 'P1 Urgente',
    c: 'p1'
  }, {
    v: 2,
    l: 'P2 Alta',
    c: 'p2'
  }, {
    v: 3,
    l: 'P3 Normal',
    c: 'p3'
  }, {
    v: 4,
    l: 'P4 Baixa',
    c: 'p4'
  }];
  const otherTasks = (data.tasks || []).filter(t => t.id !== editTask?.id && !t.done);
  function toggleDay(d) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  }
  function addSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, {
      text: newSubtask.trim(),
      done: false,
      time: newSubtaskTime || null
    }]);
    setNewSubtask('');
    setNewSubtaskTime('');
  }
  function removeSubtask(idx) {
    setSubtasks(prev => prev.filter((_, i) => i !== idx));
  }
  function updateSubtask(idx, patch) {
    setSubtasks(prev => prev.map((x, j) => j === idx ? {
      ...x,
      ...patch
    } : x));
  }
  function addTimeSlot() {
    if (!newTimeVal) return;
    setTimes(prev => [...prev, {
      time: newTimeVal,
      label: newTimeLabel.trim() || ''
    }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTimeVal('');
    setNewTimeLabel('');
  }
  function removeTimeSlot(idx) {
    setTimes(prev => prev.filter((_, i) => i !== idx));
  }
  function updateTimeSlot(idx, patch) {
    setTimes(prev => prev.map((x, j) => j === idx ? {
      ...x,
      ...patch
    } : x));
  }
  function sortTimeSlots() {
    setTimes(prev => [...prev].sort((a, b) => (a.time || '').localeCompare(b.time || '')));
  }
  function handleSave() {
    if (!text.trim()) return;
    const taskData = {
      text: text.trim(),
      desc: desc.trim() || null,
      date: noDate ? null : date || null,
      dateEnd: noDate ? null : dateEnd || null,
      time: freq === 'pontual' && times.length === 0 ? time || null : null,
      freq,
      prio,
      cat: cat || null,
      icon: icon || null,
      days: freq === 'semanal' ? days : undefined,
      interval: freq === 'periodica' ? interval_ : undefined,
      subtasks,
      times: times.length > 0 ? times : editTask?.times || [],
      dependsOn: dependsOn || null,
      starred: noDate || !date,
      source: editTask?.source || 'orbita',
      srcRef: editTask?.srcRef || null
    };
    saveTask(taskData, editTask?.id);
    onClose();
  }
  function handleDuplicate() {
    if (!text.trim()) return;
    const copia = {
      text: `${text.trim()} (cópia)`,
      desc: desc.trim() || null,
      date: noDate ? null : date || null,
      dateEnd: noDate ? null : dateEnd || null,
      time: freq === 'pontual' && times.length === 0 ? time || null : null,
      freq,
      prio,
      cat: cat || null,
      icon: icon || null,
      days: freq === 'semanal' ? days : undefined,
      interval: freq === 'periodica' ? interval_ : undefined,
      subtasks: subtasks.map(s => ({
        ...s,
        done: false
      })),
      times: times.map(t => ({
        ...t
      })),
      dependsOn: dependsOn || null
    };
    saveTask(copia);
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editTask ? 'Editar tarefa' : 'Nova Tarefa'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, !editTask && React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Templates"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, [{
    text: 'Reunião',
    icon: '🏢',
    freq: 'pontual',
    prio: 2
  }, {
    text: 'Exercício',
    icon: '🏋️',
    freq: 'semanal',
    prio: 2,
    days: [1, 3, 5]
  }, {
    text: 'Ler 30 min',
    icon: '📖',
    freq: 'diaria',
    prio: 3
  }, {
    text: 'Revisar emails',
    icon: '📧',
    freq: 'diaria',
    prio: 3
  }, {
    text: 'Compras',
    icon: '🛒',
    freq: 'semanal',
    prio: 3,
    days: [6]
  }, {
    text: 'Limpeza',
    icon: '🧹',
    freq: 'semanal',
    prio: 3,
    days: [0]
  }, {
    text: 'Médico',
    icon: '🩺',
    freq: 'pontual',
    prio: 1
  }, {
    text: 'Estudar',
    icon: '📚',
    freq: 'diaria',
    prio: 2
  }].map((t, i) => React.createElement("button", {
    key: i,
    onClick: () => {
      setText(t.text);
      setIcon(t.icon);
      setFreq(t.freq);
      setPrio(t.prio);
      if (t.days) setDays(t.days);
    },
    style: {
      padding: '5px 10px',
      borderRadius: 6,
      fontSize: 11,
      cursor: 'pointer',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--line)',
      color: 'var(--ink-2)',
      fontFamily: 'var(--font-ui)',
      transition: 'all 100ms'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--line-2)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--line)'
  }, t.icon, " ", t.text)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Tarefa"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "O que voce precisa fazer?",
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey && text.trim()) handleSave();
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Descri\xE7\xE3o (opcional)"), React.createElement("textarea", {
    className: "form-input",
    placeholder: "Detalhes...",
    value: desc,
    onChange: e => setDesc(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Frequ\xEAncia"), React.createElement("div", {
    className: "form-chips"
  }, freqs.map(f => React.createElement("div", {
    key: f.v,
    className: `form-chip ${freq === f.v ? 'active' : ''}`,
    onClick: () => setFreq(f.v)
  }, f.l)))), freq === 'semanal' && React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Dias da semana"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, dayLabels.map((d, i) => React.createElement("div", {
    key: i,
    className: `form-chip-day ${days.includes(i) ? 'active' : ''}`,
    onClick: () => toggleDay(i)
  }, d)))), freq === 'periodica' && React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "A cada quantos dias?"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: interval_,
    onChange: e => setInterval_(parseInt(e.target.value) || 7),
    style: {
      width: 100
    }
  })), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      alignItems: 'end'
    }
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Data in\xEDcio"), React.createElement("input", {
    className: "form-input",
    type: "date",
    value: noDate ? '' : date,
    onChange: e => setDate(e.target.value),
    disabled: noDate,
    style: {
      opacity: noDate ? 0.4 : 1
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Data fim (opcional)"), React.createElement("input", {
    className: "form-input",
    type: "date",
    value: noDate ? '' : dateEnd,
    onChange: e => setDateEnd(e.target.value),
    disabled: noDate,
    min: date,
    style: {
      opacity: noDate ? 0.4 : 1
    }
  }))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 12,
      alignItems: 'end'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      paddingBottom: 10,
      cursor: 'pointer'
    },
    onClick: () => setNoDate(n => !n)
  }, React.createElement("div", {
    className: `check ${noDate ? 'checked' : ''}`,
    style: {
      width: 16,
      height: 16,
      fontSize: 8
    }
  }, noDate && '✓'), React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-2)',
      whiteSpace: 'nowrap'
    }
  }, "Sem data")), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Hora (tarefa \xFAnica)"), React.createElement("input", {
    className: "form-input",
    type: "time",
    value: time,
    onChange: e => setTime(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Multi-hor\xE1rios (opcional)"), times.length > 0 && React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginBottom: 8
    }
  }, times.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 8px',
      borderRadius: 6,
      background: 'rgba(255,255,255,0.03)'
    }
  }, React.createElement("input", {
    className: "form-input mono",
    type: "time",
    value: s.time || '',
    aria: "Hor\xE1rio",
    title: "Hor\xE1rio deste slot",
    onChange: e => updateTimeSlot(i, {
      time: e.target.value
    }),
    onBlur: sortTimeSlots,
    style: {
      width: 96,
      padding: '4px 8px',
      fontSize: 12
    }
  }), React.createElement("input", {
    className: "form-input",
    placeholder: "Label (opcional)",
    value: s.label || '',
    onChange: e => updateTimeSlot(i, {
      label: e.target.value
    }),
    style: {
      flex: 1,
      padding: '4px 8px',
      fontSize: 12
    }
  }), React.createElement("button", {
    onClick: () => removeTimeSlot(i),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-4)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2715")))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    type: "time",
    value: newTimeVal,
    onChange: e => setNewTimeVal(e.target.value),
    style: {
      width: 110,
      padding: '6px 10px',
      fontSize: 12
    }
  }), React.createElement("input", {
    className: "form-input",
    placeholder: "Label (opcional)",
    value: newTimeLabel,
    onChange: e => setNewTimeLabel(e.target.value),
    style: {
      flex: 1,
      padding: '6px 10px',
      fontSize: 12
    },
    onKeyDown: e => {
      if (e.key === 'Enter') addTimeSlot();
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: addTimeSlot,
    disabled: !newTimeVal
  }, "\uFF0B"))), (data.categories || []).length > 0 && React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Categoria"), React.createElement("div", {
    className: "form-chips"
  }, (data.categories || []).map(c => {
    const color = Orbita.resolveColor(c.color);
    return React.createElement("div", {
      key: c.id,
      className: `form-chip ${cat === c.id ? 'active' : ''}`,
      onClick: () => setCat(c.id),
      style: cat === c.id ? {
        background: color + '22',
        borderColor: color + '55',
        color: '#fff'
      } : {}
    }, c.icon, " ", c.name);
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "\xCDcone da tarefa (opcional)"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 20,
      width: 30,
      textAlign: 'center'
    }
  }, icon || '—'), React.createElement(EmojiPicker, {
    value: icon,
    onChange: setIcon
  }), icon && React.createElement("button", {
    className: "btn-ghost small",
    onClick: () => setIcon('')
  }, "Limpar"))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Prioridade"), React.createElement("div", {
    className: "form-chips"
  }, prios.map(p => React.createElement("div", {
    key: p.v,
    className: `form-chip ${prio === p.v ? 'active' : ''}`,
    onClick: () => setPrio(p.v),
    style: prio === p.v ? {} : {}
  }, React.createElement("span", {
    className: `priority ${p.c}`,
    style: {
      marginRight: 2
    }
  }, "\u25CF"), " ", p.l)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Subtarefas"), subtasks.length > 0 && React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginBottom: 8
    }
  }, subtasks.map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 8px',
      borderRadius: 6,
      background: 'rgba(255,255,255,0.03)'
    }
  }, React.createElement("div", {
    className: `check ${s.done ? 'checked' : ''}`,
    style: {
      width: 14,
      height: 14,
      fontSize: 8
    },
    onClick: () => setSubtasks(prev => prev.map((x, j) => j === i ? {
      ...x,
      done: !x.done
    } : x))
  }, s.done && '✓'), React.createElement("input", {
    className: "form-input",
    value: s.text || '',
    onChange: e => updateSubtask(i, {
      text: e.target.value
    }),
    style: {
      flex: 1,
      padding: '4px 8px',
      fontSize: 12,
      textDecoration: s.done ? 'line-through' : 'none',
      color: s.done ? 'var(--ink-3)' : 'var(--ink-1)'
    }
  }), React.createElement("input", {
    className: "form-input mono",
    type: "time",
    value: s.time || '',
    title: "Hor\xE1rio desta subtarefa (opcional)",
    onChange: e => updateSubtask(i, {
      time: e.target.value || null
    }),
    style: {
      width: 96,
      padding: '4px 8px',
      fontSize: 12
    }
  }), React.createElement("button", {
    onClick: () => removeSubtask(i),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-4)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "\u2715")))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Nova subtarefa...",
    value: newSubtask,
    onChange: e => setNewSubtask(e.target.value),
    style: {
      flex: 1,
      padding: '6px 10px',
      fontSize: 12
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSubtask();
      }
    }
  }), React.createElement("input", {
    className: "form-input mono",
    type: "time",
    value: newSubtaskTime,
    title: "Hor\xE1rio (opcional)",
    onChange: e => setNewSubtaskTime(e.target.value),
    style: {
      width: 96,
      padding: '6px 8px',
      fontSize: 12
    }
  }), React.createElement("button", {
    className: "btn-ghost small",
    onClick: addSubtask
  }, "\uFF0B Subtarefa"))), otherTasks.length > 0 && React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Depende de (tarefa que precisa ser feita antes)"), React.createElement("select", {
    className: "form-input",
    value: dependsOn,
    onChange: e => setDependsOn(e.target.value)
  }, React.createElement("option", {
    value: ""
  }, "Nenhuma depend\xEAncia"), otherTasks.map(t => React.createElement("option", {
    key: t.id,
    value: t.id
  }, t.icon ? t.icon + ' ' : '', t.text))))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), editTask && React.createElement("button", {
    className: "btn-ghost",
    title: "cria uma c\xF3pia desta tarefa (subtarefas zeradas)",
    onClick: handleDuplicate
  }, "\u29C9 Duplicar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: handleSave
  }, editTask ? 'Salvar' : 'Salvar'))));
}
function HabitModal({
  onClose,
  editHabit
}) {
  const {
    saveHabit
  } = useData();
  const [name, setName] = React.useState(editHabit?.name || '');
  const [icon, setIcon] = React.useState(editHabit?.icon || '🏋️');
  const [color, setColor] = React.useState(editHabit?.color || 'green');
  const [days, setDays] = React.useState(editHabit?.days || [0, 1, 2, 3, 4, 5, 6]);
  const [yearGoal, setYearGoal] = React.useState(editHabit?.yearGoal || 200);
  const [type, setType] = React.useState(editHabit?.type || 'binary');
  const [unit, setUnit] = React.useState(editHabit?.unit || 'min');
  const [target, setTarget] = React.useState(editHabit?.target || 90);
  const [targetPeriod, setTargetPeriod] = React.useState(editHabit?.targetPeriod || 'week');
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const colors = [{
    v: 'green',
    c: '#3ccf91'
  }, {
    v: 'blue',
    c: '#5b8dff'
  }, {
    v: 'purple',
    c: '#b066ff'
  }, {
    v: 'orange',
    c: '#ffa830'
  }, {
    v: 'red',
    c: '#ff5a3c'
  }, {
    v: 'pink',
    c: '#ff2e88'
  }, {
    v: 'cyan',
    c: '#64d2ff'
  }, {
    v: 'yellow',
    c: '#ffd60a'
  }];
  const unitOptions = [{
    v: 'min',
    l: 'minutos'
  }, {
    v: 'h',
    l: 'horas'
  }, {
    v: 'reps',
    l: 'repetições'
  }, {
    v: 'km',
    l: 'km'
  }, {
    v: 'pages',
    l: 'páginas'
  }, {
    v: 'ml',
    l: 'ml'
  }, {
    v: 'sessoes',
    l: 'sessões'
  }, {
    v: 'custom',
    l: 'outra'
  }];
  function toggleDay(d) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  }
  function handleSave() {
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      icon,
      color,
      days,
      goal: days.length,
      yearGoal: parseInt(yearGoal) || 200,
      type
    };
    if (type === 'quantity') {
      payload.unit = unit;
      payload.target = parseFloat(target) || 1;
      payload.targetPeriod = targetPeriod;
    } else {
      payload.unit = null;
      payload.target = null;
      payload.targetPeriod = null;
    }
    saveHabit(payload, editHabit?.id);
    onClose();
  }
  return React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose
  }, React.createElement("div", {
    className: "modal-panel",
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h2", null, editHabit ? 'Editar hábito' : 'Novo hábito'), React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\u2715")), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Nome"), React.createElement("input", {
    className: "form-input",
    autoFocus: true,
    placeholder: "Ex: Meditar, Ler, Treinar...",
    value: name,
    onChange: e => setName(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && name.trim()) handleSave();
    }
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Tipo de h\xE1bito"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, React.createElement("div", {
    onClick: () => setType('binary'),
    style: {
      padding: '10px 12px',
      borderRadius: 10,
      cursor: 'pointer',
      background: type === 'binary' ? 'var(--gradient-neon-soft)' : 'rgba(255,255,255,0.04)',
      border: type === 'binary' ? '1px solid rgba(255,46,136,0.3)' : '1px solid var(--line)',
      color: type === 'binary' ? '#fff' : 'var(--ink-2)',
      transition: 'all 120ms'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 2
    }
  }, "\u2713 Sim/N\xE3o"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "marcar feito por dia")), React.createElement("div", {
    onClick: () => setType('quantity'),
    style: {
      padding: '10px 12px',
      borderRadius: 10,
      cursor: 'pointer',
      background: type === 'quantity' ? 'var(--gradient-neon-soft)' : 'rgba(255,255,255,0.04)',
      border: type === 'quantity' ? '1px solid rgba(255,46,136,0.3)' : '1px solid var(--line)',
      color: type === 'quantity' ? '#fff' : 'var(--ink-2)',
      transition: 'all 120ms'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 2
    }
  }, "\uD83D\uDCCA Quantidade"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "min/reps/km com meta")))), type === 'quantity' && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-row",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10
    }
  }, React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Meta"), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: target,
    onChange: e => setTarget(e.target.value)
  })), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Unidade"), React.createElement("select", {
    className: "form-input",
    value: unit,
    onChange: e => setUnit(e.target.value)
  }, unitOptions.map(o => React.createElement("option", {
    key: o.v,
    value: o.v
  }, o.l)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Por"), React.createElement("select", {
    className: "form-input",
    value: targetPeriod,
    onChange: e => setTargetPeriod(e.target.value)
  }, React.createElement("option", {
    value: "day"
  }, "dia"), React.createElement("option", {
    value: "week"
  }, "semana"), React.createElement("option", {
    value: "month"
  }, "m\xEAs")))), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: -8,
      padding: '8px 10px',
      background: 'rgba(176,102,255,0.06)',
      border: '1px solid rgba(176,102,255,0.18)',
      borderRadius: 8
    }
  }, "Ex: ", React.createElement("strong", null, target || '?', " ", unitOptions.find(o => o.v === unit)?.l || unit, " por ", targetPeriod === 'day' ? 'dia' : targetPeriod === 'week' ? 'semana' : 'mês'), ". Voc\xEA registra quanto fez em cada sess\xE3o e o app soma no per\xEDodo.")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, React.createElement(EmojiPicker, {
    label: "\xCDcone",
    value: icon,
    onChange: setIcon
  }), React.createElement("div", {
    className: "form-group",
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    className: "form-label"
  }, "Meta anual ", type === 'quantity' ? '(dias com qualquer registro)' : ''), React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    value: yearGoal,
    onChange: e => setYearGoal(e.target.value)
  }))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, type === 'quantity' ? 'Dias da semana (sugeridos)' : 'Dias da semana'), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, dayLabels.map((d, i) => React.createElement("div", {
    key: i,
    className: `form-chip-day ${days.includes(i) ? 'active' : ''}`,
    onClick: () => toggleDay(i)
  }, d)))), React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, "Cor"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, colors.map(c => React.createElement("div", {
    key: c.v,
    onClick: () => setColor(c.v),
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: c.c,
      cursor: 'pointer',
      border: color === c.v ? '2px solid #fff' : '2px solid transparent',
      boxShadow: color === c.v ? `0 0 12px ${c.c}` : 'none',
      transition: 'all 120ms'
    }
  }))))), React.createElement("div", {
    className: "modal-footer"
  }, React.createElement("button", {
    className: "btn-ghost",
    onClick: onClose
  }, "Cancelar"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '10px 24px',
      fontSize: 13
    },
    onClick: handleSave
  }, editHabit ? 'Salvar' : 'Criar hábito'))));
}
window.TaskModal = TaskModal;
window.HabitModal = HabitModal;