// Orbita — Importar plano nutricional e avaliação física
// Execute no Console (⌘+⌥+J): fetch('import-dieta.js').then(r=>r.text()).then(eval)

(function() {
  const d = JSON.parse(localStorage.getItem('meuPainel_v4') || '{}');
  if (!d._diet) d._diet = {};

  // Plano alimentar do Dr. Igor Nimrichter (24/04/2026)
  const meals = [
    {
      id: 'diet-cafe', name: 'Café da manhã', icon: '☕', time: '08:00',
      items: [
        { name: 'Café sem açúcar', qty: 'livre', calories: 5, protein: 0, carbs: 1, fat: 0, doneDates: [] },
        { name: 'Pão francês', qty: '1 un · 50g', calories: 150, protein: 5, carbs: 30, fat: 1, doneDates: [] },
        { name: 'Requeijão light', qty: '1 CS · 30g', calories: 60, protein: 3, carbs: 2, fat: 4, doneDates: [] },
        { name: 'Ovos mexidos', qty: '2 unidades', calories: 140, protein: 12, carbs: 1, fat: 10, doneDates: [] },
      ],
    },
    {
      id: 'diet-colacao', name: 'Colação (opcional)', icon: '🍌', time: '10:00',
      items: [
        { name: 'Banana prata', qty: '1 un · 60g', calories: 60, protein: 1, carbs: 15, fat: 0, doneDates: [] },
      ],
    },
    {
      id: 'diet-almoco', name: 'Almoço', icon: '🍱', time: '12:00',
      items: [
        { name: 'Marmita LivUp Dia-a-dia', qty: '1 un · 300g', calories: 450, protein: 25, carbs: 50, fat: 15, doneDates: [] },
      ],
    },
    {
      id: 'diet-lanche', name: 'Lanche da tarde', icon: '🥛', time: '16:00',
      items: [
        { name: 'Leite desnatado', qty: '1 copo · 240ml', calories: 80, protein: 8, carbs: 12, fat: 0, doneDates: [] },
        { name: 'Whey Protein Concentrado', qty: '30g', calories: 120, protein: 25, carbs: 3, fat: 1, doneDates: [] },
        { name: 'Fruta (banana/uva/maçã)', qty: '1 un', calories: 60, protein: 1, carbs: 15, fat: 0, doneDates: [] },
      ],
    },
    {
      id: 'diet-jantar', name: 'Jantar', icon: '🍽', time: '20:00',
      items: [
        { name: 'Arroz branco cozido', qty: '4 CS · 100g', calories: 130, protein: 3, carbs: 28, fat: 0, doneDates: [] },
        { name: 'Frango grelhado (ou peixe)', qty: '2 bifes · 100g', calories: 165, protein: 31, carbs: 0, fat: 4, doneDates: [] },
        { name: 'Vegetais à vontade', qty: 'livre', calories: 30, protein: 2, carbs: 6, fat: 0, doneDates: [] },
      ],
    },
    {
      id: 'diet-coringa', name: 'Coringa noturno', icon: '🍉', time: '22:00',
      items: [
        { name: 'Melão / Melancia / Morango', qty: 'à vontade', calories: 40, protein: 0, carbs: 10, fat: 0, doneDates: [] },
        { name: 'Gelatina Zero Açúcar', qty: 'à vontade', calories: 10, protein: 1, carbs: 1, fat: 0, doneDates: [] },
      ],
    },
  ];

  // Totais aproximados: ~1500 kcal
  const targets = {
    dailyCalories: 1500,
    protein: 115,
    carbs: 175,
    fat: 35,
    weightGoal: 75,
  };

  // Avaliação física inicial (10/02/2026)
  const weightLog = [
    { date: '2026-02-10', weight: 83.4, timestamp: new Date('2026-02-10').getTime() },
  ];

  const measurements = [
    {
      date: '2026-02-10',
      timestamp: new Date('2026-02-10').getTime(),
      cintura: 86.5,
      // Note: "abdômen" 93cm gravado como separado em 'abdomen' se o app suportar,
      // senão registramos também em cintura como medida adicional
    },
  ];

  // Merge: não duplica
  if (!d._diet.meals) d._diet.meals = [];
  const existingIds = new Set(d._diet.meals.map(m => m.id));
  let mealsAdded = 0;
  meals.forEach(m => {
    if (!existingIds.has(m.id)) { d._diet.meals.push(m); mealsAdded++; }
  });

  d._diet.targets = Object.assign({}, targets, d._diet.targets || {});

  if (!d._diet.weightLog) d._diet.weightLog = [];
  const existingWeights = new Set(d._diet.weightLog.map(w => w.date));
  let weightsAdded = 0;
  weightLog.forEach(w => {
    if (!existingWeights.has(w.date)) { d._diet.weightLog.push(w); weightsAdded++; }
  });
  d._diet.weightLog.sort((a,b) => a.date.localeCompare(b.date));

  if (!d._diet.measurements) d._diet.measurements = [];
  const existingMeasures = new Set(d._diet.measurements.map(m => m.date));
  let measuresAdded = 0;
  measurements.forEach(m => {
    if (!existingMeasures.has(m.date)) { d._diet.measurements.push(m); measuresAdded++; }
  });
  d._diet.measurements.sort((a,b) => a.date.localeCompare(b.date));

  d.lastModified = Date.now();
  localStorage.setItem('meuPainel_v4', JSON.stringify(d));

  alert(
    `Importado:\n` +
    `• ${mealsAdded} refeições do plano Dr. Igor (${meals.length} total)\n` +
    `• ${weightsAdded} peso (83.4 kg · 10/02)\n` +
    `• ${measuresAdded} medidas (cintura 86.5 cm)\n` +
    `• Metas: ${targets.dailyCalories} kcal, ${targets.protein}g P, ${targets.carbs}g C, ${targets.fat}g G\n` +
    `• Meta de peso: ${targets.weightGoal} kg\n\n` +
    `Recarregue a página.`
  );
})();
