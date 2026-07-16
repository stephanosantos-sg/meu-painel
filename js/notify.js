/* Orbita v2 — Notificações locais (pure JS).
 *
 * Sem servidor de push: dispara enquanto o app está aberto (aba ou instalado como PWA).
 * Ao abrir o app, os lembretes do dia que já "passaram" e ainda estão pendentes disparam
 * (dedupe por dia), então você vê o que perdeu. Cobre: slots de tarefa por horário,
 * check noturno de hábitos não feitos, e estouro de orçamento por meta-categoria.
 */
(function () {
  let _reg = null;
  let _getData = null;
  let _timer = null;

  function supported() { return typeof Notification !== 'undefined'; }
  function granted() { return supported() && Notification.permission === 'granted'; }

  async function getReg() {
    if (_reg) return _reg;
    if ('serviceWorker' in navigator) {
      try { _reg = await navigator.serviceWorker.getRegistration(); } catch (e) { _reg = null; }
    }
    return _reg;
  }

  async function notify(title, opts) {
    if (!granted()) return;
    const o = Object.assign({ icon: 'icon-180.png', badge: 'icon-180.png' }, opts || {});
    const reg = await getReg();
    try {
      if (reg && reg.showNotification) await reg.showNotification(title, o);
      else new Notification(title, o);
    } catch (e) { /* alguns browsers exigem SW pra notificar — falha silenciosa */ }
  }

  // ── dedupe por dia ──
  function firedKey() { return 'orbita_notif_fired'; }
  function loadFired() {
    try {
      const raw = JSON.parse(localStorage.getItem(firedKey()) || '{}');
      const today = Orbita.todayStr();
      if (raw._day !== today) return { _day: today }; // vira o dia → zera
      return raw;
    } catch (e) { return { _day: Orbita.todayStr() }; }
  }
  function hasFired(k) { return !!loadFired()[k]; }
  function markFired(k) {
    const f = loadFired(); f[k] = true;
    try { localStorage.setItem(firedKey(), JSON.stringify(f)); } catch (e) {}
  }

  function nowHM() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function settings(data) {
    return (data._settings && data._settings.notif) || {};
  }

  // ── checagens ──
  function checkTasks(data, s) {
    if (s.tasks === false) return;
    const today = Orbita.todayStr();
    const hm = nowHM();
    (data.tasks || []).forEach(t => {
      if (!Orbita.isTaskForDate(t, today)) return;
      if (Array.isArray(t.times) && t.times.length) {
        t.times.forEach(slot => {
          if (!slot || !slot.time) return;
          if (Orbita.isSlotDone(t, today, slot.time)) return;
          if (slot.time > hm) return; // ainda não chegou a hora
          const key = `task:${t.id}:${slot.time}`;
          if (hasFired(key)) return;
          markFired(key);
          notify('⏰ ' + (t.text || 'Tarefa'), { body: `${slot.time} — ainda pendente`, tag: key });
        });
      } else if (t.freq === 'pontual' && t.time && !t.done) {
        if (t.time > hm) return;
        const key = `task:${t.id}`;
        if (hasFired(key)) return;
        markFired(key);
        notify('⏰ ' + (t.text || 'Tarefa'), { body: `${t.time} — vence hoje`, tag: key });
      }
    });
  }

  function checkHabits(data, s) {
    if (s.habits === false) return;
    const hour = typeof s.habitHour === 'number' ? s.habitHour : 20;
    if (new Date().getHours() < hour) return;
    const key = 'habits:evening';
    if (hasFired(key)) return;
    const today = Orbita.todayStr();
    const dow = new Date().getDay();
    const pending = (data.habits || []).filter(h => {
      const hd = h.days || [0, 1, 2, 3, 4, 5, 6];
      if (!hd.includes(dow)) return false;
      return !(h.log && h.log[today]);
    });
    if (pending.length === 0) return;
    markFired(key);
    const names = pending.slice(0, 3).map(h => `${h.icon || '•'} ${h.name}`).join(', ');
    const extra = pending.length > 3 ? ` +${pending.length - 3}` : '';
    notify('✦ Hábitos pendentes hoje', { body: names + extra, tag: key });
  }

  function checkBudget(data, s) {
    if (s.budget === false) return;
    const fin = data._finance;
    if (!fin || !fin.transactions) return;
    const ym = Orbita.todayStr().slice(0, 7);
    const income = window.finGetIncome ? window.finGetIncome(fin, ym) : (fin.monthlyIncome || 0);
    if (!income) return;
    const alloc = fin.budgetAllocation || {};
    const cats = fin.categories || [];
    const spendByMeta = {};
    fin.transactions.forEach(t => {
      if ((t.date || '').slice(0, 7) !== ym) return;
      const c = cats.find(x => x.id === t.categoryId);
      const meta = c && c.meta;
      if (!meta) return;
      spendByMeta[meta] = (spendByMeta[meta] || 0) + (parseFloat(t.value) || 0);
    });
    const metaNames = {
      necessidades: 'Necessidades', lazer: 'Lazer', dividas: 'Dívidas',
      liberdade: 'Liberdade Financeira', 'longo-prazo': 'Longo Prazo', colchao: 'Colchão',
    };
    Object.keys(spendByMeta).forEach(meta => {
      const pct = alloc[meta];
      if (!pct) return;
      const budget = income * pct;
      if (budget <= 0) return;
      if (spendByMeta[meta] <= budget) return;
      const key = `budget:${meta}:${ym}`;
      if (hasFired(key)) return;
      markFired(key);
      const over = Math.round(spendByMeta[meta] - budget);
      notify('💸 Orçamento estourado', {
        body: `${metaNames[meta] || meta}: R$ ${over.toLocaleString('pt-BR')} acima do previsto no mês`,
        tag: key,
      });
    });
  }

  function checkNow() {
    if (!granted() || !_getData) return;
    const data = _getData();
    if (!data) return;
    const s = settings(data);
    if (s.enabled === false) return;
    try { checkTasks(data, s); } catch (e) {}
    try { checkHabits(data, s); } catch (e) {}
    try { checkBudget(data, s); } catch (e) {}
  }

  function init(getData) {
    _getData = getData;
    if (_timer) clearInterval(_timer);
    // roda logo ao abrir (pega lembretes "perdidos" do dia) e a cada 60s
    setTimeout(checkNow, 2500);
    _timer = setInterval(checkNow, 60000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkNow();
    });
  }

  window.OrbitaNotify = { init, notify, checkNow, supported, granted };
})();
