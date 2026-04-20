/* Orbita v2 — Utility functions (pure JS, no React) */

const SK = 'meuPainel_v4';

function loadData() {
  try { const d = localStorage.getItem(SK); return d ? JSON.parse(d) : null; } catch(e) { return null; }
}

function persistData(D) {
  D.lastModified = Date.now();
  localStorage.setItem(SK, JSON.stringify(D));
  scheduleSyncSave(D);
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function dateToStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function todayStr() { return dateToStr(new Date()); }

function isTaskForDate(t, ds) {
  if (t.done && (!t.times || !t.times.length)) return false;
  if (!t.date) return false;
  if (t.freq === 'pontual') return t.date === ds;
  if (t.freq === 'diaria') return t.date <= ds;
  if (t.freq === 'semanal') {
    if (t.date > ds) return false;
    if (t.days && t.days.length) { const dow = new Date(ds+'T12:00:00').getDay(); return t.days.includes(dow); }
    return false;
  }
  if (t.freq === 'mensal') { const sd = t.date.split('-')[2]; return ds.endsWith('-'+sd) && t.date <= ds; }
  if (t.freq === 'anual') {
    const md = t.date.slice(5);
    return ds.slice(5) === md && t.date <= ds;
  }
  if (t.freq === 'periodica') {
    if (!t.date || t.date > ds) return false;
    const diff = Math.round((new Date(ds+'T12:00:00') - new Date(t.date+'T12:00:00')) / 86400000);
    return diff >= 0 && diff % (t.interval || 10) === 0;
  }
  return t.date === ds;
}

function isTaskDone(t, ds) {
  if (t.times && t.times.length) {
    const s = t.doneSlots && t.doneSlots[ds];
    return s && s.length >= t.times.length;
  }
  if (t.freq === 'pontual') return t.done;
  if (t.doneSlots && t.doneSlots[ds]) return true;
  return false;
}

function isSlotDone(t, ds, time) {
  return t.doneSlots && t.doneSlots[ds] && Array.isArray(t.doneSlots[ds]) && t.doneSlots[ds].includes(time);
}

function getStreak(h) {
  let s = 0, d = new Date();
  const days = h.days || [0,1,2,3,4,5,6];
  for (let i = 0; i < 1000; i++) {
    const ds = dateToStr(d);
    const dow = d.getDay();
    if (!days.includes(dow)) { d.setDate(d.getDate()-1); continue; }
    if (h.log && h.log[ds]) { s++; d.setDate(d.getDate()-1); }
    else break;
  }
  return s;
}

function getXPForLevel(lvl) {
  if (lvl <= 1) return 0;
  if (lvl <= 10) return 100 + (lvl - 2) * 50;
  if (lvl <= 30) return 500 + (lvl - 10) * 80;
  if (lvl <= 60) return 2000 + (lvl - 30) * 150;
  return 6500 + (lvl - 60) * 250;
}
function getTotalXPForLevel(lvl) { let t=0; for(let i=2;i<=lvl;i++) t+=getXPForLevel(i); return t; }
function calcLevel(totalXP) { let lvl=1; while(getTotalXPForLevel(lvl+1) <= totalXP) lvl++; return lvl; }

const TITLES_MAP = lvl => {
  if(lvl>=100) return 'Transcendente'; if(lvl>=90) return 'Imortal'; if(lvl>=80) return 'Lenda';
  if(lvl>=70) return 'Mítico'; if(lvl>=60) return 'Épico'; if(lvl>=50) return 'Mestre';
  if(lvl>=40) return 'Campeão'; if(lvl>=30) return 'Especialista'; if(lvl>=20) return 'Veterano';
  if(lvl>=15) return 'Aventureiro'; if(lvl>=10) return 'Desbravador'; if(lvl>=7) return 'Batalhador';
  if(lvl>=4) return 'Explorador'; if(lvl>=2) return 'Aprendiz'; return 'Novato';
};

const CLASSES_MAP = {
  guerreiro: { name: 'Guerreiro', icon: '⚔️', en: 'warrior' },
  mago: { name: 'Mago', icon: '🔮', en: 'mage' },
  monge: { name: 'Monge', icon: '🧘', en: 'monk' },
  arqueiro: { name: 'Arqueiro', icon: '🏹', en: 'archer' },
  paladino: { name: 'Paladino', icon: '🛡️', en: 'paladin' },
};

const COLOR_MAP = {
  blue:'#5b8dff', orange:'#ffa830', green:'#3ccf91', pink:'#ff2e88',
  accent:'#b066ff', cyan:'#64d2ff', red:'#ff5a3c', yellow:'#ffd60a',
  purple:'#b066ff', teal:'#64d2ff',
};

function resolveColor(c) { return COLOR_MAP[c] || c || '#b066ff'; }

function fmtDate(ds) {
  const t = todayStr();
  if (ds === t) return 'Hoje';
  const d = new Date(ds + 'T12:00:00');
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  if (ds === dateToStr(tomorrow)) return 'Amanhã';
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

function isOverdue(ds) { return ds < todayStr(); }

function getSpriteIndex(level, cls) {
  if (level >= 30 && cls) {
    if (level >= 90) return 9;
    if (level >= 70) return 8;
    if (level >= 50) return 7;
    return 6;
  }
  if (level >= 15) return 4;
  if (level >= 10) return 3;
  if (level >= 7) return 2;
  if (level >= 4) return 1;
  return 0;
}

function scheduleSyncSave(D) {
  const url = localStorage.getItem('meuPainel_syncUrl');
  if (!url) return;
  clearTimeout(window._syncTimer);
  window._syncTimer = setTimeout(() => {
    const payload = JSON.parse(JSON.stringify(D));
    if (payload._mediaPartial && payload.media && payload.media.livros) {
      payload.media.livros = payload.media.livros.filter(b => b.status === 'Lendo' || b.status === 'Lido' || b.queued);
    }
    const form = document.createElement('form');
    form.method = 'POST'; form.action = url; form.target = '_blank'; form.style.display = 'none';
    const input = document.createElement('input');
    input.name = 'data'; input.value = JSON.stringify(payload);
    form.appendChild(input); document.body.appendChild(form);
    const iframe = document.createElement('iframe');
    iframe.name = '_blank'; iframe.style.display = 'none';
    document.body.appendChild(iframe);
    form.target = iframe.name;
    form.submit();
    setTimeout(() => { form.remove(); iframe.remove(); }, 5000);
  }, 2000);
}

function defaultData() {
  return {
    tasks: [], habits: [], goals: [], categories: [],
    shopLists: [], notes: [], ideias: [],
    media: { livros: [], filmes: [], series: [], docs: [] },
    xp: { total: 0, level: 1, class: null },
    _achievements: {}, _habitArchive: {}, _shopArchive: [],
    lastModified: Date.now(),
  };
}

window.Orbita = {
  SK, loadData, persistData, uid, dateToStr, todayStr,
  isTaskForDate, isTaskDone, isSlotDone, getStreak,
  getXPForLevel, getTotalXPForLevel, calcLevel,
  TITLES_MAP, CLASSES_MAP, COLOR_MAP, resolveColor,
  fmtDate, isOverdue, getSpriteIndex, defaultData,
};
