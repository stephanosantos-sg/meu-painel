function buildFullContext(data, screen) {
  const today = Orbita.todayStr();
  const profile = data._profile || {};
  const xp = data.xp || {};
  const tasks = data.tasks || [];
  const habits = data.habits || [];
  const goals = data.goals || [];
  const todayTasks = tasks.filter(t => Orbita.isTaskForDate(t, today));
  const pendingToday = todayTasks.filter(t => !Orbita.isTaskDone(t, today));
  const overdue = tasks.filter(t => t.freq === 'pontual' && !t.done && t.date && t.date < today);
  const dow = new Date().getDay();
  const habitsToday = habits.filter(h => (h.days || [0, 1, 2, 3, 4, 5, 6]).includes(dow));
  const habitsDone = habitsToday.filter(h => h.log && h.log[today]);
  let c = `Hoje é ${today}. Tela atual: ${screen || 'home'}.\n`;
  c += `Usuário: ${profile.name || 'Stephano'} · Nível ${xp.level || 1} (${xp.total || 0} XP).\n`;
  c += `\n[TAREFAS] hoje ${todayTasks.length} (${todayTasks.length - pendingToday.length} feitas), atrasadas ${overdue.length}.\n`;
  if (pendingToday.length) c += `Pendentes hoje: ${pendingToday.slice(0, 10).map(t => t.text).join(', ')}.\n`;
  if (overdue.length) c += `Atrasadas: ${overdue.slice(0, 6).map(t => `${t.text} (${t.date})`).join(', ')}.\n`;
  c += `\n[HÁBITOS] hoje ${habitsDone.length}/${habitsToday.length}.\n`;
  if (habits.length) c += `Hábitos: ${habits.slice(0, 8).map(h => `${h.name} (${Orbita.getStreak(h)}d)`).join(', ')}.\n`;
  if (goals.length) {
    const active = goals.filter(g => (g.milestones || []).some(m => !m.done));
    c += `\n[METAS] ${active.length} ativas: ${goals.slice(0, 5).map(g => g.title).join(', ')}.\n`;
  }
  const diet = data._diet;
  if (diet && (diet.meals || diet.targets)) {
    const targets = diet.targets || {};
    const meals = diet.meals || [];
    const extras = diet.extraCalories || [];
    const weightLog = diet.weightLog || [];
    const curWeight = weightLog.length ? weightLog[weightLog.length - 1].weight : null;
    const mealCal = meals.reduce((s, m) => s + (m.items || []).filter(i => (i.doneDates || []).includes(today)).reduce((ss, i) => ss + (parseFloat(i.calories) || 0), 0) + (m.mealExtras || []).filter(e => e.date === today).reduce((ss, e) => ss + (parseFloat(e.calories) || 0), 0), 0);
    const extraCal = extras.filter(e => e.date === today).reduce((s, e) => s + (parseFloat(e.calories) || 0), 0);
    c += `\n[DIETA] meta ${targets.dailyCalories || 2000} kcal (${targets.protein || 150}P/${targets.carbs || 200}C/${targets.fat || 65}G).`;
    c += ` Consumido hoje: ${Math.round(mealCal + extraCal)} kcal.`;
    if (curWeight) c += ` Peso ${curWeight}kg${targets.weightGoal ? ` (meta ${targets.weightGoal}kg)` : ''}.`;
    c += `\nRefeições: ${meals.map(m => m.name).join(', ') || '(nenhuma)'}.\n`;
  }
  const fin = data._finance;
  if (fin && fin.transactions) {
    const ym = today.slice(0, 7);
    const cats = fin.categories || [];
    const accs = fin.accounts || [];
    const monthTx = fin.transactions.filter(t => (t.date || '').slice(0, 7) === ym);
    const spent = monthTx.reduce((s, t) => s + (parseFloat(t.value) || 0), 0);
    const income = window.finGetIncome ? window.finGetIncome(fin, ym) : fin.monthlyIncome || 0;
    const byCat = {};
    monthTx.forEach(t => {
      const cc = cats.find(x => x.id === t.categoryId);
      const k = cc ? cc.name : 'Sem cat';
      byCat[k] = (byCat[k] || 0) + (parseFloat(t.value) || 0);
    });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const fmt = v => 'R$' + Math.round(v).toLocaleString('pt-BR');
    c += `\n[FINANÇAS] mês: renda ${fmt(income)}, gasto ${fmt(spent)}, saldo ${fmt(income - spent)} (${monthTx.length} lançamentos).`;
    if (top.length) c += ` Top: ${top.map(([n, v]) => `${n} ${fmt(v)}`).join(', ')}.`;
    c += `\nCategorias (id:nome): ${cats.map(x => `${x.id}:${x.name}`).join(', ')}.`;
    c += `\nMeios (id:nome): ${accs.map(x => `${x.id}:${x.name}`).join(', ')}.\n`;
  }
  return c;
}
function aiTools(data) {
  const diet = data._diet || {};
  const mealNames = (diet.meals || []).map(m => m.name).join(', ');
  const cats = data._finance && data._finance.categories || [];
  const accs = data._finance && data._finance.accounts || [];
  return [{
    type: 'function',
    function: {
      name: 'create_task',
      description: 'Criar uma nova tarefa quando o usuário pedir para adicionar/lembrar/anotar algo a fazer.',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'o que fazer'
          },
          date: {
            type: 'string',
            description: 'data YYYY-MM-DD (default hoje)'
          },
          freq: {
            type: 'string',
            enum: ['pontual', 'diaria', 'semanal', 'mensal'],
            description: 'default pontual'
          },
          priority: {
            type: 'string',
            enum: ['baixa', 'media', 'alta']
          }
        },
        required: ['text']
      }
    }
  }, {
    type: 'function',
    function: {
      name: 'register_food_intake',
      description: 'Registrar comida que o usuário disse que COMEU (passado ou agora). Não usar para planejamento futuro nem hipóteses.',
      parameters: {
        type: 'object',
        properties: {
          meal_name: {
            type: 'string',
            description: `Refeição mais próxima entre: ${mealNames || 'Café, Almoço, Lanche, Jantar, Ceia'}`
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                qty: {
                  type: 'string'
                },
                calories: {
                  type: 'number'
                },
                protein: {
                  type: 'number'
                },
                carbs: {
                  type: 'number'
                },
                fat: {
                  type: 'number'
                }
              },
              required: ['name', 'calories']
            }
          },
          summary: {
            type: 'string',
            description: 'resumo curto'
          }
        },
        required: ['items']
      }
    }
  }, {
    type: 'function',
    function: {
      name: 'add_transaction',
      description: 'Lançar uma despesa/gasto quando o usuário informar que gastou/pagou algo.',
      parameters: {
        type: 'object',
        properties: {
          description: {
            type: 'string'
          },
          value: {
            type: 'number'
          },
          categoryId: {
            type: 'string',
            description: `um dos ids: ${cats.map(c => c.id).join(', ')}`
          },
          accountId: {
            type: 'string',
            description: `um dos ids: ${accs.map(a => a.id).join(', ')}`
          },
          date: {
            type: 'string',
            description: 'YYYY-MM-DD (default hoje)'
          }
        },
        required: ['description', 'value']
      }
    }
  }];
}
function OrbitaAIBar({
  screen
}) {
  const {
    data,
    commit,
    saveTask,
    toast
  } = useData();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [messages, setMessages] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orbita_ai_chat') || '[]');
    } catch {
      return [];
    }
  });
  const scrollRef = React.useRef();
  React.useEffect(() => {
    localStorage.setItem('orbita_ai_chat', JSON.stringify(messages.slice(-30)));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  const openaiKey = data._settings?.aiKeys?.openai || data._diet?.openaiKey;
  const today = Orbita.todayStr();
  async function send(preset) {
    const text = (preset != null ? preset : input).trim();
    if (!text) return;
    if (!openaiKey) {
      setError('Configure sua chave OpenAI em ⚙ Configurações → IAs');
      return;
    }
    setLoading(true);
    setError('');
    const userMsg = {
      role: 'user',
      content: text
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'system',
            content: `Você é a Orbita IA, assistente pessoal do Stephano. Você enxerga o app inteiro: tarefas, hábitos, metas, dieta e finanças. Responda em português, conciso e direto. Use os dados reais do contexto — nunca invente números. Quando o usuário pedir uma ação (criar tarefa, registrar comida que comeu, lançar um gasto), CHAME a função apropriada além de responder. Para calorias/macros use a tabela TACO (UNICAMP) como referência.\n\n${buildFullContext(data, screen)}`
          }, ...newMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))],
          tools: aiTools(data),
          tool_choice: 'auto',
          temperature: 0.6
        })
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`);
      const json = await res.json();
      const msg = json.choices[0].message;
      const actions = [];
      if (msg.tool_calls) {
        msg.tool_calls.forEach(tc => {
          try {
            actions.push({
              name: tc.function.name,
              args: JSON.parse(tc.function.arguments)
            });
          } catch {}
        });
      }
      const content = msg.content || (actions.length ? 'Preparei isto — confirme abaixo:' : '');
      setMessages(m => [...m, {
        role: 'assistant',
        content,
        actions
      }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  function applyCreateTask(a, msgIdx, aIdx) {
    saveTask({
      text: a.text,
      freq: a.freq || 'pontual',
      date: a.date || today,
      priority: a.priority || 'media',
      doneSlots: {},
      done: false
    });
    markApplied(msgIdx, aIdx, `Tarefa criada: ${a.text}`);
    toast && toast('✓ Tarefa criada');
  }
  function applyFood(a, msgIdx, aIdx) {
    const meals = data._diet && data._diet.meals || [];
    const target = (a.meal_name || '').toLowerCase();
    const matched = target ? meals.find(m => {
      const n = (m.name || '').toLowerCase();
      return n === target || n.includes(target) || target.includes(n);
    }) : null;
    commit(D => {
      if (!D._diet) D._diet = {};
      const items = a.items || [];
      const sum = k => items.reduce((s, i) => s + (parseFloat(i[k]) || 0), 0);
      const entry = {
        id: Orbita.uid(),
        date: today,
        timestamp: Date.now(),
        description: a.summary || items.map(i => i.name).slice(0, 3).join(', '),
        items,
        calories: sum('calories'),
        protein: sum('protein'),
        carbs: sum('carbs'),
        fat: sum('fat'),
        summary: a.summary || ''
      };
      if (matched) {
        const m = D._diet.meals.find(x => x.id === matched.id);
        if (m) {
          if (!m.mealExtras) m.mealExtras = [];
          m.mealExtras.push(entry);
        }
      } else {
        if (!D._diet.extraCalories) D._diet.extraCalories = [];
        D._diet.extraCalories.push(entry);
      }
    });
    markApplied(msgIdx, aIdx, `Registrado em ${matched ? matched.name : 'Extras do dia'}`);
    toast && toast('✓ Comida registrada');
  }
  function applyTransaction(a, msgIdx, aIdx) {
    const accs = data._finance && data._finance.accounts || [];
    const cats = data._finance && data._finance.categories || [];
    commit(D => {
      if (window.finEnsure) window.finEnsure(D);else if (!D._finance) D._finance = {
        transactions: []
      };
      D._finance.transactions.push({
        id: Orbita.uid(),
        description: a.description,
        value: parseFloat(a.value) || 0,
        date: a.date || today,
        accountId: a.accountId || accs[0] && accs[0].id,
        categoryId: a.categoryId || cats[0] && cats[0].id,
        status: 'paid',
        installment: a.installment || null
      });
    });
    markApplied(msgIdx, aIdx, `Lançado: ${a.description} · R$${a.value}`);
    toast && toast('✓ Despesa lançada');
  }
  function markApplied(msgIdx, aIdx, label) {
    setMessages(m => m.map((mm, i) => {
      if (i !== msgIdx) return mm;
      const actions = mm.actions.map((ac, j) => j === aIdx ? {
        ...ac,
        applied: true,
        appliedLabel: label
      } : ac);
      return {
        ...mm,
        actions
      };
    }));
  }
  function dismissAction(msgIdx, aIdx) {
    setMessages(m => m.map((mm, i) => {
      if (i !== msgIdx) return mm;
      const actions = mm.actions.map((ac, j) => j === aIdx ? {
        ...ac,
        dismissed: true
      } : ac);
      return {
        ...mm,
        actions
      };
    }));
  }
  function clearChat() {
    if (!confirm('Limpar conversa?')) return;
    setMessages([]);
    localStorage.removeItem('orbita_ai_chat');
  }
  function renderAction(ac, msgIdx, aIdx) {
    if (ac.dismissed) return null;
    let title = '',
      detail = '',
      apply = null;
    if (ac.name === 'create_task') {
      title = '➕ Nova tarefa';
      detail = `${ac.args.text}${ac.args.date && ac.args.date !== today ? ` · ${ac.args.date}` : ''}`;
      apply = () => applyCreateTask(ac.args, msgIdx, aIdx);
    } else if (ac.name === 'register_food_intake') {
      const kcal = (ac.args.items || []).reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
      title = '🍽 Registrar comida';
      detail = `${ac.args.summary || (ac.args.items || []).map(i => i.name).join(', ')} · ${Math.round(kcal)} kcal`;
      apply = () => applyFood(ac.args, msgIdx, aIdx);
    } else if (ac.name === 'add_transaction') {
      title = '💸 Lançar despesa';
      detail = `${ac.args.description} · R$${ac.args.value}`;
      apply = () => applyTransaction(ac.args, msgIdx, aIdx);
    } else return null;
    return React.createElement("div", {
      key: aIdx,
      style: {
        marginTop: 6,
        padding: '8px 10px',
        borderRadius: 10,
        border: '1px solid var(--line)',
        background: 'rgba(176,102,255,0.06)'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600
      }
    }, title), React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-2)',
        margin: '2px 0 6px'
      }
    }, detail), ac.applied ? React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: '#3ccf91'
      }
    }, "\u2713 ", ac.appliedLabel) : React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, React.createElement("button", {
      className: "btn btn-primary",
      style: {
        padding: '4px 12px',
        fontSize: 11
      },
      onClick: apply
    }, "Confirmar"), React.createElement("button", {
      className: "btn-ghost small",
      style: {
        fontSize: 11
      },
      onClick: () => dismissAction(msgIdx, aIdx)
    }, "Descartar")));
  }
  if (!open) {
    const tasks = data.tasks || [];
    const todayPending = tasks.filter(t => Orbita.isTaskForDate(t, today) && !Orbita.isTaskDone(t, today)).length;
    return React.createElement("button", {
      onClick: () => setOpen(true),
      style: {
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 18px',
        borderRadius: 28,
        background: 'linear-gradient(135deg, #b066ff, #5b8dff)',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        boxShadow: '0 4px 20px rgba(176,102,255,0.4)',
        fontFamily: 'var(--font-ui)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\uD83C\uDF0C"), React.createElement("span", null, "Orbita IA", todayPending ? ` · ${todayPending} pendente${todayPending > 1 ? 's' : ''}` : ''));
  }
  const suggestions = ['Como está minha semana?', 'O que devo priorizar agora?', 'Quanto já gastei esse mês?', 'Quantas calorias ainda posso comer hoje?'];
  return React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 500,
      width: 'min(420px, calc(100vw - 32px))',
      borderRadius: 18,
      overflow: 'hidden',
      background: 'rgba(14,14,20,0.96)',
      backdropFilter: 'blur(30px)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-float)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '72vh'
    }
  }, React.createElement("div", {
    style: {
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: '1px solid var(--line)'
    }
  }, React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD83C\uDF0C"), React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13,
      fontWeight: 500
    }
  }, "Orbita IA ", React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "\xB7 v\xEA tudo")), messages.length > 0 && React.createElement("button", {
    className: "btn-ghost small",
    onClick: clearChat,
    style: {
      fontSize: 10
    }
  }, "Limpar"), React.createElement("button", {
    onClick: () => setOpen(false),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-3)',
      cursor: 'pointer',
      fontSize: 14
    }
  }, "\u2715")), React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 12,
      minHeight: 200
    }
  }, messages.length === 0 && React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 16
    }
  }, React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83C\uDF0C"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      marginBottom: 12
    }
  }, "Pergunte qualquer coisa \u2014 tarefas, h\xE1bitos, dieta, finan\xE7as. Tamb\xE9m crio tarefas, registro comida e lan\xE7o gastos."), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, suggestions.map(s => React.createElement("button", {
    key: s,
    className: "btn-ghost small",
    onClick: () => send(s),
    style: {
      justifyContent: 'flex-start',
      textAlign: 'left',
      fontSize: 11
    }
  }, s)))), messages.map((m, i) => React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: 8
    }
  }, m.content && React.createElement("div", {
    style: {
      maxWidth: '85%',
      padding: '8px 12px',
      borderRadius: 12,
      background: m.role === 'user' ? 'linear-gradient(135deg, rgba(176,102,255,0.2), rgba(91,141,255,0.15))' : 'rgba(255,255,255,0.04)',
      border: m.role === 'user' ? '1px solid rgba(176,102,255,0.3)' : '1px solid var(--line)',
      fontSize: 12.5,
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap'
    }
  }, m.content), m.actions && m.actions.length > 0 && React.createElement("div", {
    style: {
      width: '85%'
    }
  }, m.actions.map((ac, j) => renderAction(ac, i, j))))), loading && React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      padding: 8
    }
  }, "\u27F3 pensando...")), error && React.createElement("div", {
    style: {
      margin: 10,
      padding: 8,
      background: 'rgba(255,85,85,0.1)',
      border: '1px solid rgba(255,85,85,0.3)',
      borderRadius: 6,
      fontSize: 11,
      color: '#ff5555'
    }
  }, error), React.createElement("div", {
    style: {
      padding: 10,
      borderTop: '1px solid var(--line)',
      display: 'flex',
      gap: 6
    }
  }, React.createElement("input", {
    className: "form-input",
    placeholder: "Pergunte ou pe\xE7a algo...",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && !loading) {
        e.preventDefault();
        send();
      }
    },
    style: {
      flex: 1,
      fontSize: 12,
      padding: '8px 10px'
    },
    disabled: loading
  }), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      padding: '8px 14px',
      fontSize: 12,
      background: 'linear-gradient(135deg, #b066ff, #5b8dff)'
    },
    onClick: () => send(),
    disabled: loading || !input.trim()
  }, "Enviar")));
}
window.OrbitaAIBar = OrbitaAIBar;
window.buildFullContext = buildFullContext;