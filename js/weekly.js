function weeklyRange(offsetWeeks) {
  const out = [];
  const base = new Date();
  base.setDate(base.getDate() - offsetWeeks * 7);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push(Orbita.dateToStr(d));
  }
  return out;
}
function taskCompletionsInRange(tasks, days) {
  const set = new Set(days);
  let count = 0;
  const perDay = {};
  days.forEach(d => perDay[d] = 0);
  (tasks || []).forEach(t => {
    if (t.freq === 'pontual') {
      if (t.done && t.doneAt && set.has(t.doneAt)) {
        count++;
        perDay[t.doneAt]++;
      }
    } else if (t.doneSlots) {
      Object.keys(t.doneSlots).forEach(k => {
        if (!set.has(k)) return;
        const v = t.doneSlots[k];
        const n = Array.isArray(v) ? v.length : 1;
        count += n;
        perDay[k] += n;
      });
    }
  });
  return {
    count,
    perDay
  };
}
function habitCompletionsInRange(habits, days) {
  const set = new Set(days);
  let done = 0,
    scheduled = 0;
  const perDay = {};
  days.forEach(d => perDay[d] = 0);
  (habits || []).forEach(h => {
    const hd = h.days || [0, 1, 2, 3, 4, 5, 6];
    days.forEach(ds => {
      const dow = new Date(ds + 'T12:00:00').getDay();
      if (!hd.includes(dow)) return;
      scheduled++;
      if (h.log && h.log[ds]) {
        done++;
        perDay[ds]++;
      }
    });
  });
  return {
    done,
    scheduled,
    perDay
  };
}
function dietAvgCalories(diet, days) {
  if (!diet) return null;
  const set = new Set(days);
  const meals = diet.meals || [];
  const extras = diet.extraCalories || [];
  let total = 0,
    daysWithData = 0;
  const perDay = {};
  days.forEach(d => perDay[d] = 0);
  days.forEach(ds => {
    let cal = 0;
    meals.forEach(m => {
      (m.items || []).forEach(i => {
        if ((i.doneDates || []).includes(ds)) cal += parseFloat(i.calories) || 0;
      });
      (m.mealExtras || []).forEach(e => {
        if (e.date === ds) cal += parseFloat(e.calories) || 0;
      });
    });
    extras.forEach(e => {
      if (e.date === ds) cal += parseFloat(e.calories) || 0;
    });
    perDay[ds] = Math.round(cal);
    if (cal > 0) {
      total += cal;
      daysWithData++;
    }
  });
  return {
    avg: daysWithData ? Math.round(total / daysWithData) : 0,
    daysWithData,
    perDay
  };
}
function financeSpendInRange(fin, days) {
  if (!fin) return null;
  const set = new Set(days);
  const txs = (fin.transactions || []).filter(t => set.has(t.date));
  const cats = fin.categories || [];
  let total = 0;
  const byCat = {};
  txs.forEach(t => {
    const v = parseFloat(t.value) || 0;
    total += v;
    const c = cats.find(x => x.id === t.categoryId);
    const k = c ? c.name : 'Sem categoria';
    byCat[k] = (byCat[k] || 0) + v;
  });
  const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    total,
    count: txs.length,
    topCats
  };
}
function DeltaChip({
  cur,
  prev,
  invert
}) {
  if (prev === 0 && cur === 0) return React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "\u2014");
  const diff = cur - prev;
  const pct = prev === 0 ? 100 : Math.round(diff / prev * 100);
  const good = invert ? diff < 0 : diff > 0;
  const flat = diff === 0;
  const color = flat ? 'var(--ink-3)' : good ? '#3ccf91' : '#ff5a3c';
  const arrow = flat ? '→' : diff > 0 ? '▲' : '▼';
  return React.createElement("span", {
    style: {
      fontSize: 11,
      color,
      fontWeight: 600
    }
  }, arrow, " ", Math.abs(pct), "%");
}
function Sparkline({
  perDay,
  days,
  color
}) {
  const vals = days.map(d => perDay[d] || 0);
  const max = Math.max(1, ...vals);
  return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 3,
      height: 34,
      marginTop: 8
    }
  }, vals.map((v, i) => React.createElement("div", {
    key: i,
    title: `${days[i]}: ${v}`,
    style: {
      flex: 1,
      height: `${Math.max(6, v / max * 100)}%`,
      background: v > 0 ? color || 'linear-gradient(180deg, #b066ff, #5b8dff)' : 'rgba(255,255,255,0.06)',
      borderRadius: 3,
      minHeight: 4
    }
  })));
}
function ScreenWeekly() {
  const {
    data
  } = useData();
  const thisWeek = React.useMemo(() => weeklyRange(0), []);
  const lastWeek = React.useMemo(() => weeklyRange(1), []);
  const tasksCur = taskCompletionsInRange(data.tasks, thisWeek);
  const tasksPrev = taskCompletionsInRange(data.tasks, lastWeek);
  const habitsCur = habitCompletionsInRange(data.habits, thisWeek);
  const habitsPrev = habitCompletionsInRange(data.habits, lastWeek);
  const dietCur = dietAvgCalories(data._diet, thisWeek);
  const dietPrev = dietAvgCalories(data._diet, lastWeek);
  const finCur = financeSpendInRange(data._finance, thisWeek);
  const finPrev = financeSpendInRange(data._finance, lastWeek);
  const habitRate = habitsCur.scheduled ? Math.round(habitsCur.done / habitsCur.scheduled * 100) : 0;
  const habitRatePrev = habitsPrev.scheduled ? Math.round(habitsPrev.done / habitsPrev.scheduled * 100) : 0;
  const dietTarget = data._diet && data._diet.targets && data._diet.targets.dailyCalories || null;
  const today = Orbita.todayStr();
  const dowToday = new Date().getDay();
  const atRisk = (data.habits || []).filter(h => {
    const hd = h.days || [0, 1, 2, 3, 4, 5, 6];
    if (!hd.includes(dowToday)) return false;
    if (h.log && h.log[today]) return false;
    return Orbita.getStreak(h) > 0;
  }).map(h => ({
    name: h.name,
    icon: h.icon,
    streak: Orbita.getStreak(h)
  }));
  const finFmt = v => 'R$ ' + (v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  const card = {
    padding: '18px 20px',
    borderRadius: 16,
    border: '1px solid var(--line)',
    background: 'rgba(255,255,255,0.02)'
  };
  const bigNum = {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 34,
    lineHeight: 1
  };
  const label = {
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    marginBottom: 8
  };
  return React.createElement("div", {
    style: {
      padding: '28px 32px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "\xDAltimos 7 dias vs. 7 anteriores"), React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 40,
      marginBottom: 6
    }
  }, "Sua semana"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginBottom: 24
    }
  }, thisWeek[0].slice(5), " \u2192 ", thisWeek[6].slice(5), " \xB7 comparado com a semana anterior"), atRisk.length > 0 && React.createElement("div", {
    style: {
      ...card,
      borderColor: 'rgba(255,90,60,0.4)',
      background: 'rgba(255,90,60,0.06)',
      marginBottom: 20
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#ff5a3c',
      marginBottom: 8
    }
  }, "\uD83D\uDD25 Streaks em risco hoje"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, atRisk.map(h => React.createElement("span", {
    key: h.name,
    className: "chip",
    style: {
      background: 'rgba(255,90,60,0.12)',
      borderColor: 'rgba(255,90,60,0.3)'
    }
  }, h.icon, " ", h.name, " \xB7 ", h.streak, " dias")))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16
    }
  }, React.createElement("div", {
    style: card
  }, React.createElement("div", {
    style: label
  }, "Tarefas conclu\xEDdas"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, React.createElement("span", {
    style: bigNum
  }, tasksCur.count), React.createElement(DeltaChip, {
    cur: tasksCur.count,
    prev: tasksPrev.count
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, "semana anterior: ", tasksPrev.count), React.createElement(Sparkline, {
    perDay: tasksCur.perDay,
    days: thisWeek
  })), React.createElement("div", {
    style: card
  }, React.createElement("div", {
    style: label
  }, "Taxa de h\xE1bitos"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, React.createElement("span", {
    style: bigNum
  }, habitRate, "%"), React.createElement(DeltaChip, {
    cur: habitRate,
    prev: habitRatePrev
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, habitsCur.done, "/", habitsCur.scheduled, " feitos \xB7 antes ", habitRatePrev, "%"), React.createElement(Sparkline, {
    perDay: habitsCur.perDay,
    days: thisWeek,
    color: "linear-gradient(180deg, #ffa830, #ff5a3c)"
  })), dietCur && (dietCur.daysWithData > 0 || dietPrev && dietPrev.daysWithData > 0) && React.createElement("div", {
    style: card
  }, React.createElement("div", {
    style: label
  }, "M\xE9dia de calorias/dia"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, React.createElement("span", {
    style: bigNum
  }, dietCur.avg), React.createElement(DeltaChip, {
    cur: dietCur.avg,
    prev: dietPrev ? dietPrev.avg : 0,
    invert: !!dietTarget
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, dietTarget ? `meta ${dietTarget} kcal · ` : '', dietCur.daysWithData, " dias com registro"), React.createElement(Sparkline, {
    perDay: dietCur.perDay,
    days: thisWeek,
    color: "linear-gradient(180deg, #3ccf91, #64d2ff)"
  })), finCur && (finCur.count > 0 || finPrev && finPrev.count > 0) && React.createElement("div", {
    style: card
  }, React.createElement("div", {
    style: label
  }, "Gasto na semana"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, React.createElement("span", {
    style: {
      ...bigNum,
      fontSize: 28
    }
  }, finFmt(finCur.total)), React.createElement(DeltaChip, {
    cur: finCur.total,
    prev: finPrev ? finPrev.total : 0,
    invert: true
  })), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, finCur.count, " lan\xE7amentos \xB7 antes ", finFmt(finPrev ? finPrev.total : 0)), finCur.topCats.length > 0 && React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, finCur.topCats.map(([n, v]) => React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11
    }
  }, React.createElement("span", {
    style: {
      color: 'var(--ink-2)'
    }
  }, n), React.createElement("span", {
    className: "mono"
  }, finFmt(v))))))), React.createElement("div", {
    style: {
      marginTop: 24,
      fontSize: 12,
      color: 'var(--ink-3)',
      textAlign: 'center'
    }
  }, weeklyVerdict(tasksCur.count, tasksPrev.count, habitRate, habitRatePrev)));
}
function weeklyVerdict(tCur, tPrev, hCur, hPrev) {
  const taskUp = tCur > tPrev,
    habitUp = hCur >= hPrev;
  if (taskUp && habitUp) return '🚀 Semana forte — tarefas e hábitos em alta. Mantém o ritmo.';
  if (!taskUp && !habitUp && tCur === 0 && hCur === 0) return 'Semana leve nos registros. Que tal marcar o que já fez?';
  if (habitUp && !taskUp) return '✨ Consistência nos hábitos segue firme. Foco nas tarefas essa semana.';
  if (taskUp && !habitUp) return '💪 Produtividade em alta. Não deixa os hábitos escaparem.';
  return 'Semana de recuperação — pequenos passos contam. Bora recomeçar.';
}
function WeeklyBanner({
  onOpen
}) {
  const [dismissed, setDismissed] = React.useState(() => {
    const key = 'orbita_weeklyBannerSeen';
    const seen = localStorage.getItem(key);
    const wk = Orbita.dateToStr(new Date());
    return seen === wk;
  });
  const isSunday = new Date().getDay() === 0;
  if (!isSunday || dismissed) return null;
  function dismiss() {
    localStorage.setItem('orbita_weeklyBannerSeen', Orbita.dateToStr(new Date()));
    setDismissed(true);
  }
  return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      marginBottom: 16,
      borderRadius: 12,
      border: '1px solid rgba(176,102,255,0.3)',
      background: 'linear-gradient(135deg, rgba(176,102,255,0.12), rgba(91,141,255,0.08))'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, "\uD83D\uDCCA"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "Sua semana est\xE1 pronta"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "Veja como foram tarefas, h\xE1bitos, dieta e gastos nos \xFAltimos 7 dias.")), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '7px 14px',
      fontSize: 12
    },
    onClick: onOpen
  }, "Ver resumo"), React.createElement("button", {
    onClick: dismiss,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-3)',
      cursor: 'pointer',
      fontSize: 14
    }
  }, "\u2715"));
}
window.ScreenWeekly = ScreenWeekly;
window.WeeklyBanner = WeeklyBanner;