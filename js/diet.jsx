/* Orbita v2 — Dieta: nutritional tracking with AI-powered calorie calculator */

function ScreenDiet() {
  const { data, commit } = useData();
  const [tab, setTab] = React.useState('hoje');
  const diet = data._diet || {};
  const meals = diet.meals || [];
  const weightLog = diet.weightLog || [];
  const measurements = diet.measurements || [];
  const photos = diet.photos || [];
  const extras = diet.extraCalories || [];
  const targets = diet.targets || { dailyCalories: 2000, protein: 150, carbs: 200, fat: 65, weightGoal: null };
  const today = Orbita.todayStr();

  // Today's totals
  const todayMealCalories = meals.reduce((sum, m) => {
    return sum + (m.items || []).filter(i => (i.doneDates || []).includes(today)).reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
  }, 0);
  const todayExtraCalories = extras.filter(e => e.date === today).reduce((s, e) => s + (parseFloat(e.calories) || 0), 0);
  const todayTotalCalories = todayMealCalories + todayExtraCalories;

  const currentWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : null;
  const firstWeight = weightLog.length > 0 ? weightLog[0].weight : null;

  return (
    <>
      <TopBar title="Dieta." subtitle={`${Math.round(todayTotalCalories)} / ${targets.dailyCalories} kcal hoje`}
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { v: 'hoje', l: 'Hoje' },
              { v: 'peso', l: 'Peso' },
              { v: 'medidas', l: 'Medidas' },
              { v: 'fotos', l: 'Fotos' },
              { v: 'extra', l: 'Extra' },
              { v: 'config', l: 'Config' },
            ].map(t => (
              <button key={t.v} className={`tab-btn ${tab === t.v ? 'active' : ''}`} onClick={() => setTab(t.v)}>{t.l}</button>
            ))}
          </div>
        }
      />
      <div style={{ padding: '0 28px 40px' }}>
        {tab === 'hoje' && <DietToday meals={meals} targets={targets} today={today} todayMealCalories={todayMealCalories} todayExtraCalories={todayExtraCalories} commit={commit} extras={extras} />}
        {tab === 'peso' && <DietWeight log={weightLog} current={currentWeight} first={firstWeight} target={targets.weightGoal} commit={commit} />}
        {tab === 'medidas' && <DietMeasurements log={measurements} commit={commit} />}
        {tab === 'fotos' && <DietPhotos photos={photos} commit={commit} />}
        {tab === 'extra' && <DietExtra extras={extras} today={today} openaiKey={diet.openaiKey} commit={commit} />}
        {tab === 'config' && <DietConfig targets={targets} openaiKey={diet.openaiKey} commit={commit} />}
      </div>
    </>
  );
}

/* ── Today: Meals as tasks with items as subtasks ── */
function DietToday({ meals, targets, today, todayMealCalories, todayExtraCalories, commit, extras }) {
  const [showNewMeal, setShowNewMeal] = React.useState(false);
  const [editMealId, setEditMealId] = React.useState(null);
  const total = todayMealCalories + todayExtraCalories;
  const pctCal = targets.dailyCalories ? Math.min(100, Math.round(total / targets.dailyCalories * 100)) : 0;
  const remaining = Math.max(0, (targets.dailyCalories || 0) - total);

  function toggleItem(mealId, itemIdx) {
    commit(D => {
      if (!D._diet) D._diet = {};
      const meal = D._diet.meals.find(m => m.id === mealId);
      if (!meal || !meal.items[itemIdx]) return;
      if (!meal.items[itemIdx].doneDates) meal.items[itemIdx].doneDates = [];
      const idx = meal.items[itemIdx].doneDates.indexOf(today);
      if (idx >= 0) meal.items[itemIdx].doneDates.splice(idx, 1);
      else meal.items[itemIdx].doneDates.push(today);
    });
  }

  function toggleMeal(mealId) {
    commit(D => {
      const meal = D._diet.meals.find(m => m.id === mealId);
      if (!meal) return;
      const allDone = (meal.items || []).every(i => (i.doneDates || []).includes(today));
      (meal.items || []).forEach(i => {
        if (!i.doneDates) i.doneDates = [];
        if (allDone) {
          const idx = i.doneDates.indexOf(today);
          if (idx >= 0) i.doneDates.splice(idx, 1);
        } else {
          if (!i.doneDates.includes(today)) i.doneDates.push(today);
        }
      });
    });
  }

  function deleteMeal(mealId) {
    if (!confirm('Deletar esta refeição?')) return;
    commit(D => { D._diet.meals = D._diet.meals.filter(m => m.id !== mealId); });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }} className="screen-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Meals list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="eyebrow">Refeições do dia</div>
            <h3 className="panel-title" style={{ marginTop: 4 }}>Hoje.</h3>
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowNewMeal(true)}>＋ Refeição</button>
        </div>

        {meals.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🥗</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhuma refeição cadastrada</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4, marginBottom: 16 }}>Configure seu plano nutricional adicionando refeições</div>
            <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowNewMeal(true)}>＋ Criar refeição</button>
          </div>
        )}

        {meals.sort((a,b) => (a.time||'').localeCompare(b.time||'')).map(meal => {
          const items = meal.items || [];
          const doneItems = items.filter(i => (i.doneDates || []).includes(today)).length;
          const allDone = items.length > 0 && doneItems === items.length;
          const mealCal = items.reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
          const doneCal = items.filter(i => (i.doneDates || []).includes(today)).reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
          const mealProtein = items.reduce((s, i) => s + (parseFloat(i.protein) || 0), 0);
          const mealCarbs = items.reduce((s, i) => s + (parseFloat(i.carbs) || 0), 0);
          const mealFat = items.reduce((s, i) => s + (parseFloat(i.fat) || 0), 0);
          return (
            <div key={meal.id} className="panel" style={{ padding: 18, borderLeft: `3px solid ${allDone ? '#3ccf91' : '#64d2ff'}`, opacity: allDone ? 0.75 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div className={`check ${allDone ? 'checked' : ''}`} onClick={() => toggleMeal(meal.id)} style={{ width: 22, height: 22, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>{allDone && '✓'}</div>
                <span style={{ fontSize: 18 }}>{meal.icon || '🍽'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, textDecoration: allDone ? 'line-through' : 'none' }}>{meal.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                    {meal.time && <span className="mono">⏱ {meal.time}</span>}
                    <span style={{ marginLeft: meal.time ? 10 : 0 }}>{doneCal}/{Math.round(mealCal)} kcal</span>
                    {mealProtein > 0 && <span style={{ marginLeft: 10 }}>P {mealProtein}g</span>}
                    {mealCarbs > 0 && <span style={{ marginLeft: 6 }}>C {mealCarbs}g</span>}
                    {mealFat > 0 && <span style={{ marginLeft: 6 }}>G {mealFat}g</span>}
                  </div>
                </div>
                <button className="btn-ghost small" onClick={() => setEditMealId(meal.id)} style={{ fontSize: 10 }}>✎</button>
                <button className="btn-ghost small" onClick={() => deleteMeal(meal.id)} style={{ fontSize: 10, color: 'var(--ink-4)' }}>✕</button>
              </div>
              {items.length > 0 && (
                <div style={{ paddingLeft: 36, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {items.map((item, idx) => {
                    const done = (item.doneDates || []).includes(today);
                    return (
                      <div key={idx} onClick={() => toggleItem(meal.id, idx)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '5px 8px', borderRadius: 6,
                        cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 120ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                        <div className={`check ${done ? 'checked' : ''}`} style={{ width: 14, height: 14, fontSize: 7 }}>{done && '✓'}</div>
                        <span style={{ fontSize: 12.5, flex: 1, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--ink-3)' : 'var(--ink-1)' }}>{item.name}</span>
                        {item.qty && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{item.qty}</span>}
                        {item.calories && <span className="mono" style={{ fontSize: 10, color: '#ffa830' }}>{item.calories} kcal</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="panel" style={{ padding: 20 }}>
          <div className="eyebrow">Calorias hoje</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, lineHeight: 1 }}>{Math.round(total)}</h3>
            <span className="mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>/ {targets.dailyCalories}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              width: `${pctCal}%`, height: '100%',
              background: total > targets.dailyCalories ? '#ff5555' : 'var(--gradient-neon)',
              transition: 'width 300ms',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)' }}>
            <span>{Math.round(todayMealCalories)} dieta</span>
            {todayExtraCalories > 0 && <span>+ {Math.round(todayExtraCalories)} extras</span>}
            <span>{remaining} restam</span>
          </div>
        </div>

        {/* Macros */}
        <MacrosBreakdown meals={meals} targets={targets} today={today} />

        {/* Quick add water or quick meal? */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Resumo</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--ink-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Refeições</span>
              <span className="mono">{meals.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Extras hoje</span>
              <span className="mono">{extras.filter(e => e.date === today).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Meta diária</span>
              <span className="mono">{targets.dailyCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {showNewMeal && <MealEditModal meal={null} commit={commit} onClose={() => setShowNewMeal(false)} />}
      {editMealId && <MealEditModal meal={meals.find(m => m.id === editMealId)} commit={commit} onClose={() => setEditMealId(null)} />}
    </div>
  );
}

function MacrosBreakdown({ meals, targets, today }) {
  const totals = { protein: 0, carbs: 0, fat: 0 };
  meals.forEach(m => {
    (m.items || []).filter(i => (i.doneDates || []).includes(today)).forEach(i => {
      totals.protein += parseFloat(i.protein) || 0;
      totals.carbs += parseFloat(i.carbs) || 0;
      totals.fat += parseFloat(i.fat) || 0;
    });
  });
  const macros = [
    { label: 'Proteína', value: totals.protein, target: targets.protein, color: '#ff2e88', unit: 'g' },
    { label: 'Carboidrato', value: totals.carbs, target: targets.carbs, color: '#ffa830', unit: 'g' },
    { label: 'Gordura', value: totals.fat, target: targets.fat, color: '#b066ff', unit: 'g' },
  ];
  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Macros hoje</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {macros.map(m => {
          const pct = m.target ? Math.min(100, Math.round(m.value / m.target * 100)) : 0;
          return (
            <div key={m.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>{m.label}</span>
                <span className="mono" style={{ fontSize: 11, color: m.color }}>{Math.round(m.value)}{m.unit} / {m.target}{m.unit}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: m.color, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Meal Edit Modal ── */
function MealEditModal({ meal, commit, onClose }) {
  const editing = !!meal;
  const [name, setName] = React.useState(meal?.name || '');
  const [icon, setIcon] = React.useState(meal?.icon || '🍽');
  const [time, setTime] = React.useState(meal?.time || '');
  const [items, setItems] = React.useState(meal?.items ? JSON.parse(JSON.stringify(meal.items)) : []);
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemQty, setNewItemQty] = React.useState('');
  const [newItemCal, setNewItemCal] = React.useState('');
  const [newItemP, setNewItemP] = React.useState('');
  const [newItemC, setNewItemC] = React.useState('');
  const [newItemF, setNewItemF] = React.useState('');

  function addItem() {
    if (!newItemName.trim()) return;
    setItems([...items, {
      name: newItemName.trim(),
      qty: newItemQty.trim(),
      calories: newItemCal || 0,
      protein: newItemP || 0,
      carbs: newItemC || 0,
      fat: newItemF || 0,
      doneDates: [],
    }]);
    setNewItemName(''); setNewItemQty(''); setNewItemCal(''); setNewItemP(''); setNewItemC(''); setNewItemF('');
  }

  function removeItem(idx) { setItems(items.filter((_, i) => i !== idx)); }

  function handleSave() {
    if (!name.trim()) return;
    commit(D => {
      if (!D._diet) D._diet = {};
      if (!D._diet.meals) D._diet.meals = [];
      if (editing) {
        const m = D._diet.meals.find(x => x.id === meal.id);
        if (m) { m.name = name.trim(); m.icon = icon; m.time = time; m.items = items; }
      } else {
        D._diet.meals.push({ id: Orbita.uid(), name: name.trim(), icon, time, items });
      }
    });
    onClose();
  }

  const totalCal = items.reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(600px, 92vw)' }}>
        <div className="modal-header">
          <h2>{editing ? 'Editar refeição' : 'Nova refeição'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nome</label>
              <input className="form-input" autoFocus placeholder="Ex: Café da manhã" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group" style={{ width: 80 }}>
              <label className="form-label">Ícone</label>
              <input className="form-input" value={icon} onChange={e => setIcon(e.target.value)} style={{ textAlign: 'center' }} />
            </div>
            <div className="form-group" style={{ width: 120 }}>
              <label className="form-label">Horário</label>
              <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="form-label">Itens ({items.length}) · {Math.round(totalCal)} kcal total</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--line)' }}>
                  <span style={{ flex: 1, fontSize: 13 }}>{item.name}</span>
                  {item.qty && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{item.qty}</span>}
                  <span className="mono" style={{ fontSize: 11, color: '#ffa830' }}>{item.calories}kcal</span>
                  <button className="btn-ghost small" onClick={() => removeItem(idx)} style={{ fontSize: 10 }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8 }}>Adicionar item</div>
              <div className="form-row" style={{ marginBottom: 6 }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <input className="form-input" placeholder="Nome (ex: 2 ovos mexidos)" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input className="form-input" placeholder="Quantidade (100g)" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} />
                </div>
              </div>
              <div className="form-row" style={{ marginBottom: 8 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <input className="form-input" type="number" placeholder="Kcal" value={newItemCal} onChange={e => setNewItemCal(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input className="form-input" type="number" placeholder="P (g)" value={newItemP} onChange={e => setNewItemP(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input className="form-input" type="number" placeholder="C (g)" value={newItemC} onChange={e => setNewItemC(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input className="form-input" type="number" placeholder="G (g)" value={newItemF} onChange={e => setNewItemF(e.target.value)} />
                </div>
              </div>
              <button className="btn-ghost small" onClick={addItem} style={{ width: '100%', justifyContent: 'center' }}>＋ Adicionar item</button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── Weight Tracking ── */
function DietWeight({ log, current, first, target, commit }) {
  const [newWeight, setNewWeight] = React.useState('');
  const [showAdd, setShowAdd] = React.useState(false);

  function addWeight() {
    const w = parseFloat(newWeight);
    if (!w || w < 20 || w > 400) return alert('Peso inválido (use kg)');
    commit(D => {
      if (!D._diet) D._diet = {};
      if (!D._diet.weightLog) D._diet.weightLog = [];
      D._diet.weightLog.push({ date: Orbita.todayStr(), weight: w, timestamp: Date.now() });
      D._diet.weightLog.sort((a,b) => a.date.localeCompare(b.date));
    });
    setNewWeight(''); setShowAdd(false);
  }

  function deleteEntry(ts) {
    if (!confirm('Deletar este registro?')) return;
    commit(D => { D._diet.weightLog = D._diet.weightLog.filter(w => w.timestamp !== ts); });
  }

  const diff = current && first ? (current - first).toFixed(1) : 0;
  const goalDiff = current && target ? (current - target).toFixed(1) : null;

  // Chart data: last 90 days
  const chartData = log.slice(-90);
  const minW = chartData.length ? Math.min(...chartData.map(w => w.weight)) : 0;
  const maxW = chartData.length ? Math.max(...chartData.map(w => w.weight)) : 0;
  const rangeW = maxW - minW || 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }} className="screen-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
          <div className="eyebrow">Peso atual</div>
          {current ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 52, lineHeight: 1, marginTop: 8 }}>{current.toFixed(1)}<span style={{ fontSize: 20, color: 'var(--ink-3)', marginLeft: 6 }}>kg</span></div>
              <div style={{ fontSize: 12, color: diff < 0 ? '#3ccf91' : diff > 0 ? '#ff5555' : 'var(--ink-3)', marginTop: 8 }}>
                {diff > 0 ? `+${diff}` : diff} kg desde o início
              </div>
              {target && (
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                  {goalDiff > 0 ? `${goalDiff} kg para a meta (${target} kg)` : goalDiff < 0 ? `${Math.abs(goalDiff)} kg abaixo da meta` : 'Meta atingida!'}
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 12 }}>Nenhum registro</div>
          )}
          <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 13, marginTop: 16 }} onClick={() => setShowAdd(true)}>＋ Registrar peso</button>
        </div>

        {log.length > 0 && (
          <div className="panel" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Histórico</div>
            <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[...log].reverse().map((w, i) => {
                const prev = log[log.length - i - 2];
                const change = prev ? (w.weight - prev.weight).toFixed(1) : 0;
                return (
                  <div key={w.timestamp || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 70 }}>{Orbita.fmtDate(w.date)}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{w.weight.toFixed(1)} kg</span>
                    {prev && <span className="mono" style={{ fontSize: 10, color: change > 0 ? '#ff5555' : change < 0 ? '#3ccf91' : 'var(--ink-3)' }}>
                      {change > 0 ? `+${change}` : change}
                    </span>}
                    <button className="btn-ghost small" onClick={() => deleteEntry(w.timestamp)} style={{ fontSize: 9, color: 'var(--ink-4)' }}>✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="panel" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Evolução · últimos {chartData.length} registros</div>
        {chartData.length < 2 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', padding: 40 }}>
            Registre pelo menos 2 pesos para ver o gráfico
          </div>
        ) : (
          <div>
            <svg viewBox="0 0 400 220" style={{ width: '100%', height: 220, display: 'block' }}>
              <defs>
                <linearGradient id="weightArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff2e88" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#5b8dff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Target line */}
              {target && target >= minW && target <= maxW && (
                <line x1="0" x2="400" y1={200 - ((target - minW) / rangeW) * 180} y2={200 - ((target - minW) / rangeW) * 180} stroke="#3ccf91" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
              )}
              {/* Area under line */}
              <path d={`M 0 200 ${chartData.map((w, i) => `L ${(i / (chartData.length - 1)) * 400} ${200 - ((w.weight - minW) / rangeW) * 180}`).join(' ')} L 400 200 Z`} fill="url(#weightArea)" />
              {/* Line */}
              <path d={chartData.map((w, i) => `${i === 0 ? 'M' : 'L'} ${(i / (chartData.length - 1)) * 400} ${200 - ((w.weight - minW) / rangeW) * 180}`).join(' ')} stroke="url(#pomoGrad)" strokeWidth="2" fill="none" />
              <defs>
                <linearGradient id="pomoGrad" x1="0" x2="1">
                  <stop offset="0" stopColor="#ff2e88" />
                  <stop offset="1" stopColor="#5b8dff" />
                </linearGradient>
              </defs>
              {/* Points */}
              {chartData.map((w, i) => (
                <circle key={i} cx={(i / (chartData.length - 1)) * 400} cy={200 - ((w.weight - minW) / rangeW) * 180} r="3" fill="#ff2e88" />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: 'var(--ink-3)' }} className="mono">
              <span>{Orbita.fmtDate(chartData[0].date)}</span>
              <span>min {minW.toFixed(1)} · max {maxW.toFixed(1)}</span>
              <span>{Orbita.fmtDate(chartData[chartData.length-1].date)}</span>
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(360px, 90vw)' }}>
            <div className="modal-header"><h2>Registrar peso</h2><button className="modal-close" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Peso atual (kg)</label>
                <input className="form-input" type="number" step="0.1" autoFocus placeholder="Ex: 78.5" value={newWeight} onChange={e => setNewWeight(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addWeight(); }} style={{ fontSize: 18, textAlign: 'center' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={addWeight}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Body Measurements ── */
function DietMeasurements({ log, commit }) {
  const [showAdd, setShowAdd] = React.useState(false);
  const FIELDS = [
    { k: 'peito', l: 'Peito' },
    { k: 'cintura', l: 'Cintura' },
    { k: 'quadril', l: 'Quadril' },
    { k: 'braco', l: 'Braço' },
    { k: 'coxa', l: 'Coxa' },
    { k: 'panturrilha', l: 'Panturrilha' },
    { k: 'pescoco', l: 'Pescoço' },
  ];
  const last = log.length ? log[log.length - 1] : {};
  const prev = log.length > 1 ? log[log.length - 2] : {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="eyebrow">Medidas corporais</div>
          <h3 className="panel-title" style={{ marginTop: 4 }}>Evolução.</h3>
        </div>
        <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowAdd(true)}>＋ Registrar</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {FIELDS.map(f => {
          const val = last[f.k];
          const prevVal = prev[f.k];
          const diff = val && prevVal ? (val - prevVal).toFixed(1) : null;
          if (!val) return (
            <div key={f.k} className="panel" style={{ padding: 16, opacity: 0.5, textAlign: 'center' }}>
              <div className="eyebrow">{f.l}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>—</div>
            </div>
          );
          return (
            <div key={f.k} className="panel" style={{ padding: 16 }}>
              <div className="eyebrow">{f.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1 }}>{val}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>cm</span>
              </div>
              {diff !== null && (
                <div style={{ fontSize: 10, marginTop: 6, color: diff > 0 ? '#ff5555' : diff < 0 ? '#3ccf91' : 'var(--ink-3)' }} className="mono">
                  {diff > 0 ? `+${diff}` : diff} cm
                </div>
              )}
            </div>
          );
        })}
      </div>

      {log.length > 0 && (
        <div className="panel" style={{ padding: 16, marginTop: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Histórico</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--ink-3)', fontWeight: 400 }}>Data</th>
                  {FIELDS.map(f => <th key={f.k} style={{ textAlign: 'right', padding: '6px 8px', color: 'var(--ink-3)', fontWeight: 400 }}>{f.l}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...log].reverse().map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '6px 8px' }} className="mono">{Orbita.fmtDate(m.date)}</td>
                    {FIELDS.map(f => <td key={f.k} style={{ padding: '6px 8px', textAlign: 'right' }} className="mono">{m[f.k] || '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && <MeasurementModal fields={FIELDS} commit={commit} last={last} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function MeasurementModal({ fields, commit, last, onClose }) {
  const [values, setValues] = React.useState(() => {
    const v = {};
    fields.forEach(f => { v[f.k] = last[f.k] || ''; });
    return v;
  });

  function handleSave() {
    const entry = { date: Orbita.todayStr(), timestamp: Date.now() };
    fields.forEach(f => {
      const val = parseFloat(values[f.k]);
      if (val) entry[f.k] = val;
    });
    if (Object.keys(entry).length === 2) return alert('Preencha pelo menos uma medida');
    commit(D => {
      if (!D._diet) D._diet = {};
      if (!D._diet.measurements) D._diet.measurements = [];
      D._diet.measurements.push(entry);
      D._diet.measurements.sort((a,b) => a.date.localeCompare(b.date));
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 92vw)' }}>
        <div className="modal-header"><h2>Registrar medidas</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {fields.map(f => (
              <div key={f.k} className="form-group">
                <label className="form-label">{f.l} (cm)</label>
                <input className="form-input" type="number" step="0.1" value={values[f.k]} onChange={e => setValues({...values, [f.k]: e.target.value})} />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── Photos ── */
function DietPhotos({ photos, commit }) {
  const [note, setNote] = React.useState('');

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      commit(D => {
        if (!D._diet) D._diet = {};
        if (!D._diet.photos) D._diet.photos = [];
        D._diet.photos.push({
          date: Orbita.todayStr(),
          timestamp: Date.now(),
          url: ev.target.result,
          note: note.trim(),
        });
        D._diet.photos.sort((a,b) => b.timestamp - a.timestamp);
      });
      setNote('');
    };
    reader.readAsDataURL(file);
  }

  function deletePhoto(ts) {
    if (!confirm('Deletar esta foto?')) return;
    commit(D => { D._diet.photos = D._diet.photos.filter(p => p.timestamp !== ts); });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div className="eyebrow">Fotos de evolução</div>
          <h3 className="panel-title" style={{ marginTop: 4 }}>Progresso.</h3>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="form-input" placeholder="Nota (opcional)" value={note} onChange={e => setNote(e.target.value)} style={{ width: 200 }} />
          <label className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13, cursor: 'pointer' }}>
            📷 Adicionar
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Sem fotos ainda</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Tire fotos periódicas para acompanhar sua evolução</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {photos.map(p => (
            <div key={p.timestamp} className="panel" style={{ padding: 8, position: 'relative' }}>
              <img src={p.url} alt="" style={{ width: '100%', borderRadius: 8, aspectRatio: '3/4', objectFit: 'cover' }} />
              <div style={{ padding: '8px 4px 2px' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{Orbita.fmtDate(p.date)}</div>
                {p.note && <div style={{ fontSize: 11, marginTop: 2 }}>{p.note}</div>}
              </div>
              <button onClick={() => deletePhoto(p.timestamp)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', padding: '4px 8px', fontSize: 10 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Extra Calories with AI ── */
function DietExtra({ extras, today, openaiKey, commit }) {
  const [foodText, setFoodText] = React.useState('');
  const [analyzing, setAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');

  async function analyze() {
    if (!foodText.trim()) return;
    if (!openaiKey) { setError('Configure sua chave OpenAI em Config'); return; }
    setAnalyzing(true); setError(''); setResult(null);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Você é um nutricionista. Analise o alimento descrito e retorne APENAS um JSON no formato: {"items":[{"name":"nome","qty":"quantidade","calories":número,"protein":número,"carbs":número,"fat":número}],"total_calories":número,"summary":"resumo breve"}. Use valores em gramas para macros e quilocalorias para energia.' },
            { role: 'user', content: foodText }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }
      const json = await res.json();
      const content = json.choices[0].message.content;
      const parsed = JSON.parse(content);
      setResult(parsed);
    } catch (e) {
      setError(e.message);
    } finally {
      setAnalyzing(false);
    }
  }

  function saveResult() {
    if (!result) return;
    commit(D => {
      if (!D._diet) D._diet = {};
      if (!D._diet.extraCalories) D._diet.extraCalories = [];
      D._diet.extraCalories.push({
        date: today,
        timestamp: Date.now(),
        description: foodText,
        items: result.items,
        calories: result.total_calories,
        summary: result.summary,
      });
    });
    setFoodText(''); setResult(null);
  }

  function deleteExtra(ts) {
    if (!confirm('Deletar este registro?')) return;
    commit(D => { D._diet.extraCalories = D._diet.extraCalories.filter(e => e.timestamp !== ts); });
  }

  const todayExtras = extras.filter(e => e.date === today);
  const pastExtras = extras.filter(e => e.date !== today).slice(-20).reverse();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }} className="screen-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="panel" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Calorias extras · IA nutricional</div>
          <h3 className="panel-title" style={{ marginBottom: 14 }}>Calcule o que comeu fora.</h3>

          <div className="form-group">
            <label className="form-label">Descreva o alimento</label>
            <textarea className="form-input" placeholder="Ex: 2 pedaços de pizza margherita grande e 1 lata de Coca-Cola"
              value={foodText} onChange={e => setFoodText(e.target.value)}
              style={{ minHeight: 80, fontSize: 13 }} />
          </div>

          {!openaiKey && (
            <div style={{ padding: 10, background: 'rgba(255,168,48,0.1)', border: '1px solid rgba(255,168,48,0.3)', borderRadius: 8, fontSize: 12, color: '#ffa830', marginBottom: 10 }}>
              ⚠ Configure sua chave OpenAI na aba <strong>Config</strong> para usar a IA
            </div>
          )}
          {error && (
            <div style={{ padding: 10, background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 8, fontSize: 12, color: '#ff5555', marginBottom: 10 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 14, justifyContent: 'center' }}
            onClick={analyze} disabled={analyzing || !foodText.trim()}>
            {analyzing ? '⟳ Analisando...' : '⚡ Analisar com IA'}
          </button>

          {result && (
            <div style={{ marginTop: 16, padding: 14, background: 'var(--gradient-neon-soft)', border: '1px solid rgba(255,46,136,0.22)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28 }}>{Math.round(result.total_calories)} kcal</span>
                <button className="btn-ghost small" onClick={saveResult}>✓ Adicionar ao dia</button>
              </div>
              {result.summary && <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 10 }}>{result.summary}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {result.items && result.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', fontSize: 11 }}>
                    <span style={{ color: 'var(--ink-2)' }}>{item.name} {item.qty && `(${item.qty})`}</span>
                    <span className="mono" style={{ color: '#ffa830' }}>{Math.round(item.calories)} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {todayExtras.length > 0 && (
          <div className="panel" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Extras de hoje · {todayExtras.reduce((s,e) => s + (e.calories||0), 0)} kcal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {todayExtras.map(e => (
                <div key={e.timestamp} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</div>
                    {e.summary && <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{e.summary}</div>}
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: '#ffa830', flexShrink: 0 }}>{Math.round(e.calories)} kcal</span>
                  <button className="btn-ghost small" onClick={() => deleteExtra(e.timestamp)} style={{ fontSize: 10, color: 'var(--ink-4)' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="panel" style={{ padding: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Histórico de extras</div>
        {pastExtras.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--ink-3)', padding: 20, textAlign: 'center' }}>Sem extras registrados ainda</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 500, overflowY: 'auto' }}>
            {pastExtras.map(e => (
              <div key={e.timestamp} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
                <span className="mono" style={{ fontSize: 9, color: 'var(--ink-4)', width: 50, flexShrink: 0 }}>{Orbita.fmtDate(e.date)}</span>
                <span style={{ flex: 1, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</span>
                <span className="mono" style={{ fontSize: 10, color: '#ffa830', flexShrink: 0 }}>{Math.round(e.calories)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Config: Targets and OpenAI key ── */
function DietConfig({ targets, openaiKey, commit }) {
  const [dailyCalories, setDailyCalories] = React.useState(targets.dailyCalories || 2000);
  const [protein, setProtein] = React.useState(targets.protein || 150);
  const [carbs, setCarbs] = React.useState(targets.carbs || 200);
  const [fat, setFat] = React.useState(targets.fat || 65);
  const [weightGoal, setWeightGoal] = React.useState(targets.weightGoal || '');
  const [key, setKey] = React.useState(openaiKey || '');
  const [showKey, setShowKey] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function save() {
    commit(D => {
      if (!D._diet) D._diet = {};
      D._diet.targets = {
        dailyCalories: parseInt(dailyCalories) || 2000,
        protein: parseInt(protein) || 150,
        carbs: parseInt(carbs) || 200,
        fat: parseInt(fat) || 65,
        weightGoal: weightGoal ? parseFloat(weightGoal) : null,
      };
      D._diet.openaiKey = key.trim() || null;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
        <div className="eyebrow">Metas nutricionais</div>
        <h3 className="panel-title" style={{ marginBottom: 16, marginTop: 4 }}>Objetivos diários.</h3>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Calorias (kcal)</label>
            <input className="form-input" type="number" value={dailyCalories} onChange={e => setDailyCalories(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Peso meta (kg)</label>
            <input className="form-input" type="number" step="0.1" placeholder="Opcional" value={weightGoal} onChange={e => setWeightGoal(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Proteína (g)</label>
            <input className="form-input" type="number" value={protein} onChange={e => setProtein(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Carboidrato (g)</label>
            <input className="form-input" type="number" value={carbs} onChange={e => setCarbs(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Gordura (g)</label>
            <input className="form-input" type="number" value={fat} onChange={e => setFat(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
        <div className="eyebrow">IA nutricional</div>
        <h3 className="panel-title" style={{ marginBottom: 12, marginTop: 4 }}>Chave OpenAI.</h3>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14, lineHeight: 1.6 }}>
          Necessária para calcular calorias de alimentos na aba <strong>Extra</strong>. Obtenha em <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: 'var(--neon-a)' }}>platform.openai.com/api-keys</a>.
          A chave fica salva apenas no seu dispositivo.
        </div>
        <div className="form-group">
          <label className="form-label">API Key</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="form-input" type={showKey ? 'text' : 'password'} placeholder="sk-..." value={key} onChange={e => setKey(e.target.value)} style={{ flex: 1 }} />
            <button className="btn-ghost small" onClick={() => setShowKey(s => !s)}>{showKey ? '🙈' : '👁'}</button>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 14 }} onClick={save}>
        {saved ? '✓ Salvo' : 'Salvar configurações'}
      </button>
    </div>
  );
}

/* ── Home widget: Diet meals ── */
function DietWidget({ diet, today }) {
  if (!diet || !diet.meals || diet.meals.length === 0) return null;
  const meals = diet.meals;
  const totalItems = meals.reduce((s, m) => s + (m.items || []).length, 0);
  const doneItems = meals.reduce((s, m) => s + (m.items || []).filter(i => (i.doneDates || []).includes(today)).length, 0);
  const todayCal = meals.reduce((s, m) => {
    return s + (m.items || []).filter(i => (i.doneDates || []).includes(today)).reduce((ss, i) => ss + (parseFloat(i.calories) || 0), 0);
  }, 0);
  const targetCal = diet.targets?.dailyCalories || 2000;
  const pct = Math.min(100, Math.round(todayCal / targetCal * 100));

  return (
    <div className="panel" style={{ padding: 20, borderLeft: '3px solid #ffa830' }}>
      <div className="eyebrow" style={{ color: '#ffa830', marginBottom: 10 }}>🥗 Dieta · {Math.round(todayCal)}/{targetCal} kcal</div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: todayCal > targetCal ? '#ff5555' : '#ffa830', borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {meals.sort((a,b) => (a.time||'').localeCompare(b.time||'')).map(m => {
          const items = m.items || [];
          const doneMeal = items.filter(i => (i.doneDates || []).includes(today)).length;
          const allDone = items.length > 0 && doneMeal === items.length;
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: allDone ? 0.5 : 1 }}>
              <span>{m.icon || '🍽'}</span>
              {m.time && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{m.time}</span>}
              <span style={{ flex: 1, textDecoration: allDone ? 'line-through' : 'none' }}>{m.name}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{doneMeal}/{items.length}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.ScreenDiet = ScreenDiet;
window.DietWidget = DietWidget;
