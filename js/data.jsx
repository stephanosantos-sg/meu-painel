/* Orbita v2 — DataProvider (React Context + all mutations) */
const { createContext, useContext, useState, useCallback, useRef } = React;

const DataContext = createContext();
function useData() { return useContext(DataContext); }

function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    const d = Orbita.loadData();
    return d || Orbita.defaultData();
  });
  const [toasts, setToasts] = useState([]);
  const dataRef = useRef(data);
  dataRef.current = data;

  React.useEffect(() => {
    function onPull(e) {
      if (e.detail) setData(e.detail);
    }
    window.addEventListener('orbita:dataPulled', onPull);
    return () => window.removeEventListener('orbita:dataPulled', onPull);
  }, []);

  const historyRef = useRef({ past: [], future: [] });
  const MAX_HISTORY = 50;

  function undo() {
    const h = historyRef.current;
    if (h.past.length === 0) return;
    const prev = h.past.pop();
    h.future.push(JSON.stringify(dataRef.current));
    if (h.future.length > MAX_HISTORY) h.future.shift();
    const restored = JSON.parse(prev);
    Orbita.persistData(restored);
    setData(restored);
    toast('↩ Desfeito');
  }

  function redo() {
    const h = historyRef.current;
    if (h.future.length === 0) return;
    const next = h.future.pop();
    h.past.push(JSON.stringify(dataRef.current));
    const restored = JSON.parse(next);
    Orbita.persistData(restored);
    setData(restored);
    toast('↪ Refeito');
  }

  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function commit(mutator) {
    setData(prev => {
      historyRef.current.past.push(JSON.stringify(prev));
      if (historyRef.current.past.length > MAX_HISTORY) historyRef.current.past.shift();
      historyRef.current.future = [];
      const next = JSON.parse(JSON.stringify(prev));
      mutator(next);
      if (window.checkAchievements) {
        const newAchs = checkAchievements(next);
        if (newAchs.length > 0) {
          newAchs.forEach(a => {
            const id = Date.now() + Math.random();
            setToasts(t => [...t, { id, msg: `🏆 ${a.name}! +${a.xp} xp`, type: 'levelup' }]);
            setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
          });
        }
      }
      Orbita.persistData(next);
      return next;
    });
  }

  function toast(msg, type = 'xp') {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
  }

  function addXP(amount, D) {
    if (!D.xp) D.xp = { total: 0, level: 1, class: null };
    const prevLevel = D.xp.level;
    D.xp.total += amount;
    D.xp.level = Orbita.calcLevel(D.xp.total);
    return D.xp.level > prevLevel;
  }

  const toggleTask = useCallback((id, dateCtx) => {
    let xpMsg = '';
    commit(D => {
      const t = D.tasks.find(x => x.id === id);
      if (!t) return;
      if (t.freq === 'pontual') {
        t.done = !t.done;
        t.doneAt = t.done ? Orbita.todayStr() : null;
        if (t.done) { addXP(10, D); xpMsg = '+10 xp'; }
      } else if (t.times && t.times.length) {
        if (!t.doneSlots) t.doneSlots = {};
        const allDone = t.doneSlots[dateCtx] && t.doneSlots[dateCtx].length >= t.times.length;
        if (allDone) {
          delete t.doneSlots[dateCtx];
        } else {
          t.doneSlots[dateCtx] = t.times.map(s => s.time);
          const amt = 5 * t.times.length;
          addXP(amt, D); xpMsg = `+${amt} xp`;
        }
      } else {
        if (!t.doneSlots) t.doneSlots = {};
        if (t.doneSlots[dateCtx]) {
          delete t.doneSlots[dateCtx];
        } else {
          t.doneSlots[dateCtx] = true;
          addXP(5, D); xpMsg = '+5 xp';
        }
      }
    });
    if (xpMsg) toast(xpMsg);
  }, []);

  const toggleSlot = useCallback((taskId, dateCtx, time) => {
    let xpMsg = '';
    commit(D => {
      const t = D.tasks.find(x => x.id === taskId);
      if (!t) return;
      if (!t.doneSlots) t.doneSlots = {};
      if (!Array.isArray(t.doneSlots[dateCtx])) t.doneSlots[dateCtx] = [];
      const idx = t.doneSlots[dateCtx].indexOf(time);
      if (idx >= 0) {
        t.doneSlots[dateCtx].splice(idx, 1);
        if (t.doneSlots[dateCtx].length === 0) delete t.doneSlots[dateCtx];
      } else {
        t.doneSlots[dateCtx].push(time);
        addXP(5, D); xpMsg = '+5 xp';
      }
    });
    if (xpMsg) toast(xpMsg);
  }, []);

  const toggleHabitDay = useCallback((habitId, dateStr) => {
    let xpMsg = '';
    commit(D => {
      const h = D.habits.find(x => x.id === habitId);
      if (!h) return;
      if (!h.log) h.log = {};
      if (h.log[dateStr]) {
        delete h.log[dateStr];
      } else {
        h.log[dateStr] = true;
        addXP(10, D); xpMsg = '+10 xp';
      }
    });
    if (xpMsg) toast(xpMsg);
  }, []);

  const saveTask = useCallback((taskData, editId) => {
    commit(D => {
      if (editId) {
        const idx = D.tasks.findIndex(x => x.id === editId);
        if (idx >= 0) {
          const existing = D.tasks[idx];
          Object.assign(existing, taskData);
        }
      } else {
        D.tasks.push({
          id: Orbita.uid(),
          done: false,
          doneSlots: {},
          ...taskData,
        });
      }
    });
  }, []);

  const deleteTask = useCallback((id) => {
    commit(D => { D.tasks = D.tasks.filter(x => x.id !== id); });
  }, []);

  const saveHabit = useCallback((habitData, editId) => {
    commit(D => {
      if (editId) {
        const idx = D.habits.findIndex(x => x.id === editId);
        if (idx >= 0) Object.assign(D.habits[idx], habitData);
      } else {
        D.habits.push({
          id: Orbita.uid(),
          log: {},
          ...habitData,
        });
      }
    });
  }, []);

  const deleteHabit = useCallback((id) => {
    commit(D => { D.habits = D.habits.filter(x => x.id !== id); });
  }, []);

  const saveGoal = useCallback((goalData, editId) => {
    commit(D => {
      if (editId) {
        const idx = D.goals.findIndex(x => x.id === editId);
        if (idx >= 0) Object.assign(D.goals[idx], goalData);
      } else {
        D.goals.push({ id: Orbita.uid(), ...goalData });
      }
    });
  }, []);

  const toggleMilestone = useCallback((goalId, msIdx) => {
    commit(D => {
      const g = D.goals.find(x => x.id === goalId);
      if (!g || !g.milestones || !g.milestones[msIdx]) return;
      g.milestones[msIdx].done = !g.milestones[msIdx].done;
      if (g.milestones[msIdx].done) addXP(15, D);
    });
  }, []);

  const deleteGoal = useCallback((id) => {
    commit(D => { D.goals = D.goals.filter(x => x.id !== id); });
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskIdx) => {
    commit(D => {
      const t = D.tasks.find(x => x.id === taskId);
      if (t && t.subtasks && t.subtasks[subtaskIdx]) {
        t.subtasks[subtaskIdx].done = !t.subtasks[subtaskIdx].done;
      }
    });
  }, []);

  const saveCategory = useCallback((catData, editId) => {
    commit(D => {
      if (!D.categories) D.categories = [];
      if (editId) {
        const idx = D.categories.findIndex(x => x.id === editId);
        if (idx >= 0) Object.assign(D.categories[idx], catData);
      } else {
        D.categories.push({ id: Orbita.uid(), ...catData });
      }
    });
  }, []);

  const deleteCategory = useCallback((id) => {
    commit(D => { D.categories = D.categories.filter(x => x.id !== id); });
  }, []);

  const value = {
    data, toasts,
    toggleTask, toggleSlot, toggleHabitDay, toggleSubtask,
    saveTask, deleteTask,
    saveHabit, deleteHabit,
    saveGoal, deleteGoal, toggleMilestone,
    saveCategory, deleteCategory,
    commit, toast, addXP: (amt) => { commit(D => { const up = addXP(amt, D); if (up) toast('Level up! 🎉', 'levelup'); }); toast(`+${amt} xp`); },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

window.DataProvider = DataProvider;
window.useData = useData;
