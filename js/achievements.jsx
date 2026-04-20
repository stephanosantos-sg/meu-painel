/* Orbita v2 — Achievement system (55+ conquistas from v1) */

const ACHIEVEMENT_CATS = {
  '🚀 Primeiros Passos': [
    { id:'first_task', name:'Primeira Tarefa', desc:'Complete sua primeira tarefa', icon:'✅', xp:20 },
    { id:'first_habit', name:'Primeiro Hábito', desc:'Marque um hábito pela primeira vez', icon:'⭐', xp:20 },
    { id:'first_goal', name:'Primeiro Objetivo', desc:'Crie um objetivo', icon:'🎯', xp:15 },
    { id:'first_note', name:'Anotador', desc:'Crie uma nota', icon:'📝', xp:10 },
    { id:'first_idea', name:'Criativo', desc:'Registre uma ideia', icon:'💡', xp:15 },
    { id:'categories_3', name:'Organizado', desc:'Crie 3 categorias', icon:'🏷️', xp:20 },
  ],
  '🔥 Consistência': [
    { id:'streak_3', name:'Consistente', desc:'3 dias seguidos', icon:'🔥', xp:20 },
    { id:'streak_7', name:'Semana Perfeita', desc:'7 dias seguidos', icon:'🔥', xp:50 },
    { id:'streak_14', name:'Duas Semanas', desc:'14 dias seguidos', icon:'💪', xp:100 },
    { id:'streak_21', name:'Formador de Hábito', desc:'21 dias — virou rotina!', icon:'💎', xp:200 },
    { id:'streak_30', name:'Inabalável', desc:'30 dias seguidos', icon:'🏆', xp:300 },
    { id:'streak_60', name:'Disciplina de Ferro', desc:'60 dias seguidos', icon:'⚔️', xp:500 },
    { id:'streak_100', name:'Centenário', desc:'100 dias seguidos', icon:'👑', xp:800 },
    { id:'streak_365', name:'Um Ano Inteiro', desc:'365 dias seguidos', icon:'🌟', xp:2000 },
    { id:'all_habits_day', name:'Dia Perfeito', desc:'Todos os hábitos do dia', icon:'💯', xp:50 },
  ],
  '📋 Produtividade': [
    { id:'tasks_10', name:'Começando', desc:'10 tarefas concluídas', icon:'📋', xp:20 },
    { id:'tasks_50', name:'Produtivo', desc:'50 tarefas', icon:'📋', xp:50 },
    { id:'tasks_200', name:'Máquina', desc:'200 tarefas', icon:'⚡', xp:150 },
    { id:'tasks_500', name:'Imparável', desc:'500 tarefas', icon:'🚀', xp:300 },
    { id:'tasks_1000', name:'Lendário', desc:'1000 tarefas', icon:'💫', xp:600 },
    { id:'tasks_2500', name:'Sobrehumano', desc:'2500 tarefas', icon:'🦸', xp:1000 },
  ],
  '⭐ Hábitos': [
    { id:'habits_3', name:'Triplo Hábito', desc:'3 hábitos ativos', icon:'🧠', xp:20 },
    { id:'habits_5', name:'Multi-hábitos', desc:'5 hábitos ativos', icon:'🧠', xp:40 },
    { id:'habits_10', name:'Hábito Master', desc:'10 hábitos ativos', icon:'🌀', xp:80 },
    { id:'habit_year_100', name:'Dedicado', desc:'100 marcações no ano', icon:'📅', xp:60 },
    { id:'habit_year_300', name:'Disciplinado', desc:'300 marcações no ano', icon:'📅', xp:200 },
  ],
  '📖 Leitura': [
    { id:'book_done', name:'Leitor', desc:'Termine 1 livro', icon:'📖', xp:80 },
    { id:'books_5', name:'Colecionador', desc:'5 livros lidos', icon:'📚', xp:120 },
    { id:'books_10', name:'Rato de Biblioteca', desc:'10 livros', icon:'📚', xp:200 },
    { id:'books_25', name:'Devorador', desc:'25 livros', icon:'🏛️', xp:350 },
    { id:'books_50', name:'Bibliófilo', desc:'50 livros', icon:'🏛️', xp:600 },
    { id:'books_100', name:'Sábio', desc:'100 livros', icon:'🧙', xp:1000 },
    { id:'books_200', name:'Iluminado', desc:'200 livros', icon:'✨', xp:2000 },
    { id:'book_rated_5', name:'Avaliador', desc:'Avalie 5 livros com estrelas', icon:'⭐', xp:30 },
  ],
  '🎬 Mídia': [
    { id:'media_watch', name:'Cinéfilo', desc:'10 filmes ou séries assistidos', icon:'🎬', xp:60 },
    { id:'media_watch_50', name:'Maratonista', desc:'50 filmes ou séries', icon:'🎬', xp:200 },
    { id:'media_watch_100', name:'Crítico', desc:'100 filmes ou séries', icon:'🎥', xp:400 },
    { id:'series_binge', name:'Maratonista de Séries', desc:'Termine 5 séries', icon:'📺', xp:100 },
  ],
  '🎯 Objetivos': [
    { id:'goal_done', name:'Objetivo Alcançado', desc:'Conclua 1 objetivo', icon:'🎯', xp:100 },
    { id:'goals_3', name:'Realizador', desc:'3 objetivos concluídos', icon:'🏅', xp:250 },
    { id:'goals_5', name:'Conquistador', desc:'5 objetivos', icon:'🏆', xp:400 },
    { id:'goals_10', name:'Visionário', desc:'10 objetivos', icon:'🌠', xp:700 },
  ],
  '⬆️ Níveis': [
    { id:'level_3', name:'Nível 3', desc:'Alcance nível 3', icon:'⬆️', xp:30 },
    { id:'level_5', name:'Nível 5', desc:'Alcance nível 5', icon:'⬆️', xp:50 },
    { id:'level_10', name:'Veterano', desc:'Nível 10', icon:'🌟', xp:100 },
    { id:'level_15', name:'Elite', desc:'Nível 15', icon:'👑', xp:200 },
    { id:'level_20', name:'Lenda', desc:'Nível 20', icon:'🌠', xp:500 },
    { id:'level_30', name:'Classe Escolhida', desc:'Nível 30', icon:'⚔️', xp:300 },
    { id:'level_50', name:'Meio Caminho', desc:'Nível 50', icon:'🔮', xp:500 },
    { id:'level_100', name:'Transcendente', desc:'Nível 100!', icon:'💫', xp:2000 },
  ],
  '🛒 Especiais': [
    { id:'pomodoro_1', name:'Primeiro Pomodoro', desc:'Complete um pomodoro', icon:'🍅', xp:15 },
    { id:'shoplist_done', name:'Compras Feitas', desc:'Conclua uma lista de compras', icon:'🛒', xp:30 },
    { id:'xp_1000', name:'Mil XP', desc:'1000 XP total', icon:'💰', xp:50 },
    { id:'xp_5000', name:'Rico em XP', desc:'5000 XP', icon:'💎', xp:100 },
    { id:'xp_10000', name:'XP Magnata', desc:'10000 XP', icon:'🏦', xp:200 },
    { id:'xp_50000', name:'Milionário', desc:'50000 XP', icon:'👑', xp:500 },
  ],
};

const ACHIEVEMENT_DEFS = Object.values(ACHIEVEMENT_CATS).flat();

function checkAchievements(D) {
  if (!D._achievements) D._achievements = {};
  const yr = '' + new Date().getFullYear();
  const today = Orbita.todayStr();
  const dow = new Date().getDay();

  function countDone() {
    let c = 0;
    D.tasks.forEach(t => { if (t.done) c++; c += Object.keys(t.doneSlots || {}).length; });
    return c;
  }
  const totalDone = countDone();
  const booksRead = (D.media?.livros || []).filter(b => b.status === 'Lido').length;
  const mediaWatched = ((D.media?.filmes||[]).filter(x=>x.done).length + (D.media?.series||[]).filter(x=>x.done).length);
  const goalsComplete = D.goals.filter(g => g.milestones && g.milestones.length && g.milestones.every(m => m.done)).length;
  const todayHabits = D.habits.filter(h => (h.days || [0,1,2,3,4,5,6]).includes(dow));
  const allHabitsDone = todayHabits.length > 0 && todayHabits.every(h => h.log && h.log[today]);

  const checks = {
    first_task: () => D.tasks.some(t => t.done || Object.keys(t.doneSlots || {}).length > 0),
    first_habit: () => D.habits.some(h => Object.keys(h.log || {}).length > 0),
    first_goal: () => D.goals.length > 0,
    first_note: () => (D.notes || []).length > 0,
    first_idea: () => (D.ideias || []).length > 0,
    categories_3: () => (D.categories || []).length >= 3,
    streak_3: () => D.habits.some(h => Orbita.getStreak(h) >= 3),
    streak_7: () => D.habits.some(h => Orbita.getStreak(h) >= 7),
    streak_14: () => D.habits.some(h => Orbita.getStreak(h) >= 14),
    streak_21: () => D.habits.some(h => Orbita.getStreak(h) >= 21),
    streak_30: () => D.habits.some(h => Orbita.getStreak(h) >= 30),
    streak_60: () => D.habits.some(h => Orbita.getStreak(h) >= 60),
    streak_100: () => D.habits.some(h => Orbita.getStreak(h) >= 100),
    streak_365: () => D.habits.some(h => Orbita.getStreak(h) >= 365),
    all_habits_day: () => allHabitsDone,
    tasks_10: () => totalDone >= 10,
    tasks_50: () => totalDone >= 50,
    tasks_200: () => totalDone >= 200,
    tasks_500: () => totalDone >= 500,
    tasks_1000: () => totalDone >= 1000,
    tasks_2500: () => totalDone >= 2500,
    habits_3: () => D.habits.length >= 3,
    habits_5: () => D.habits.length >= 5,
    habits_10: () => D.habits.length >= 10,
    habit_year_100: () => D.habits.some(h => Object.keys(h.log || {}).filter(d => d.startsWith(yr)).length >= 100),
    habit_year_300: () => D.habits.some(h => Object.keys(h.log || {}).filter(d => d.startsWith(yr)).length >= 300),
    book_done: () => booksRead >= 1,
    books_5: () => booksRead >= 5,
    books_10: () => booksRead >= 10,
    books_25: () => booksRead >= 25,
    books_50: () => booksRead >= 50,
    books_100: () => booksRead >= 100,
    books_200: () => booksRead >= 200,
    book_rated_5: () => (D.media?.livros || []).filter(b => b.userRating > 0).length >= 5,
    media_watch: () => mediaWatched >= 10,
    media_watch_50: () => mediaWatched >= 50,
    media_watch_100: () => mediaWatched >= 100,
    series_binge: () => (D.media?.series || []).filter(x => x.done).length >= 5,
    goal_done: () => goalsComplete >= 1,
    goals_3: () => goalsComplete >= 3,
    goals_5: () => goalsComplete >= 5,
    goals_10: () => goalsComplete >= 10,
    level_3: () => D.xp.level >= 3,
    level_5: () => D.xp.level >= 5,
    level_10: () => D.xp.level >= 10,
    level_15: () => D.xp.level >= 15,
    level_20: () => D.xp.level >= 20,
    level_30: () => D.xp.level >= 30,
    level_50: () => D.xp.level >= 50,
    level_100: () => D.xp.level >= 100,
    pomodoro_1: () => D.xp.total >= 25,
    shoplist_done: () => (D.shopLists || []).some(sl => sl.items.length > 0 && sl.items.every(i => i.done)),
    xp_1000: () => D.xp.total >= 1000,
    xp_5000: () => D.xp.total >= 5000,
    xp_10000: () => D.xp.total >= 10000,
    xp_50000: () => D.xp.total >= 50000,
  };

  let newAchievements = [];
  ACHIEVEMENT_DEFS.forEach(a => {
    if (D._achievements[a.id]) return;
    try {
      if (checks[a.id] && checks[a.id]()) {
        D._achievements[a.id] = new Date().toISOString();
        D.xp.total += a.xp;
        D.xp.level = Orbita.calcLevel(D.xp.total);
        newAchievements.push(a);
      }
    } catch(e) {}
  });
  return newAchievements;
}

window.ACHIEVEMENT_CATS = ACHIEVEMENT_CATS;
window.ACHIEVEMENT_DEFS = ACHIEVEMENT_DEFS;
window.checkAchievements = checkAchievements;
