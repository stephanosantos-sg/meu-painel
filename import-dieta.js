// Orbita — Importar plano nutricional completo com todas as opções
// Execute no Console (⌘+⌥+J): fetch('import-dieta.js').then(r=>r.text()).then(eval)

(function() {
  const d = JSON.parse(localStorage.getItem('meuPainel_v4') || '{}');
  if (!d._diet) d._diet = {};

  // Helper: item com grupo (substituições)
  const item = (name, qty, cal, p, c, f, group) => ({ name, qty, calories: cal, protein: p, carbs: c, fat: f, group: group || null, doneDates: [] });

  // Plano alimentar completo — Dr. Igor Nimrichter (24/04/2026)
  const meals = [
    {
      id: 'diet-cafe', name: 'Café da manhã', icon: '☕', time: '08:00',
      items: [
        item('Café sem açúcar', 'livre', 5, 0, 1, 0, null),
        // Carboidrato (escolher 1)
        item('Pão francês', '1 un · 50g', 150, 5, 30, 1, 'Carboidrato'),
        item('Pão de forma integral', '2 fatias · 50g', 140, 6, 25, 2, 'Carboidrato'),
        item('Pão sírio/pita', '1 un · 50g', 150, 5, 30, 1, 'Carboidrato'),
        // Requeijão
        item('Requeijão light', '1 CS · 30g', 60, 3, 2, 4, null),
        // Proteína (escolher 1)
        item('Ovos mexidos/cozidos/fritos sem óleo', '2 unidades', 140, 12, 1, 10, 'Proteína'),
        item('Queijo minas frescal', '1 fatia grande · 40g', 100, 8, 1, 7, 'Proteína'),
        item('Queijo cottage', '2 CS · 65g', 70, 7, 3, 3, 'Proteína'),
        item('Queijo tipo ricota', '2 fatias médias · 60g', 90, 7, 2, 6, 'Proteína'),
      ],
    },
    {
      id: 'diet-colacao', name: 'Colação (opcional)', icon: '🍌', time: '10:00',
      items: [
        item('Banana prata', '1 un média · 60g', 60, 1, 15, 0, 'Fruta'),
        item('Uva itália', '1 cacho pequeno · 85g', 60, 0, 15, 0, 'Fruta'),
        item('Maçã argentina', '1 un pequena · 90g', 50, 0, 13, 0, 'Fruta'),
        item('Pera williams', '1 un pequena · 90g', 55, 0, 14, 0, 'Fruta'),
        item('Laranja', '1 un média · 123g', 60, 1, 15, 0, 'Fruta'),
        item('Melão', '2 fatias médias · 200g', 70, 1, 17, 0, 'Fruta'),
        item('Mamão papaia', '1/2 un média · 150g', 65, 1, 16, 0, 'Fruta'),
        item('Melancia', '2 fatias médias · 180g', 55, 1, 14, 0, 'Fruta'),
        item('Morango', '20 un · 195g', 60, 1, 15, 0, 'Fruta'),
      ],
    },
    {
      id: 'diet-almoco', name: 'Almoço', icon: '🍱', time: '12:00',
      items: [
        item('Marmita LivUp Dia-a-dia', '1 un · 300g', 450, 25, 50, 15, 'Marmita'),
        item('Marmita Chuchu Beleza Linha Fit', '1 un · 350g', 420, 28, 45, 12, 'Marmita'),
      ],
    },
    {
      id: 'diet-lanche', name: 'Lanche da tarde', icon: '🥛', time: '16:00',
      items: [
        // Lácteo
        item('Leite desnatado', '1 copo duplo · 240ml', 80, 8, 12, 0, 'Lácteo'),
        item('Leite desnatado em pó', '2 CS · 30g', 110, 10, 15, 0, 'Lácteo'),
        item('Iogurte natural', '1 pote · 170g', 90, 8, 11, 2, 'Lácteo'),
        // Whey
        item('Whey Protein Concentrado', '30g', 120, 25, 3, 1, null),
        // Fruta (escolher 1 — mesmas opções da colação)
        item('Banana prata', '1 un média · 60g', 60, 1, 15, 0, 'Fruta'),
        item('Uva itália', '1 cacho pequeno · 85g', 60, 0, 15, 0, 'Fruta'),
        item('Maçã argentina', '1 un pequena · 90g', 50, 0, 13, 0, 'Fruta'),
        item('Pera williams', '1 un pequena · 90g', 55, 0, 14, 0, 'Fruta'),
        item('Laranja', '1 un média · 123g', 60, 1, 15, 0, 'Fruta'),
        item('Melão', '2 fatias médias · 200g', 70, 1, 17, 0, 'Fruta'),
        item('Mamão papaia', '1/2 un média · 150g', 65, 1, 16, 0, 'Fruta'),
        item('Melancia', '2 fatias médias · 180g', 55, 1, 14, 0, 'Fruta'),
        item('Morango', '20 un · 195g', 60, 1, 15, 0, 'Fruta'),
      ],
    },
    {
      id: 'diet-jantar', name: 'Jantar', icon: '🍽', time: '20:00',
      items: [
        // Carboidrato (escolher 1)
        item('Arroz branco cozido', '4 CS · 100g', 130, 3, 28, 0, 'Carboidrato'),
        item('Batata inglesa cozida', '8 CS · 240g', 200, 5, 45, 0, 'Carboidrato'),
        item('Macarrão cozido', '4 CS · 120g', 160, 5, 32, 1, 'Carboidrato'),
        item('Mandioca cozida', '4 CS · 100g', 160, 1, 38, 0, 'Carboidrato'),
        item('Batata doce cozida', '4 fatias pequenas · 160g', 140, 2, 32, 0, 'Carboidrato'),
        // Proteína (escolher 1)
        item('Frango peito/filé grelhado', '2 bifes pequenos · 100g', 165, 31, 0, 4, 'Proteína'),
        item('Patinho moído sem gordura', '6 CS · 90g', 140, 22, 0, 5, 'Proteína'),
        item('Alcatra sem gordura cozida', '1 bife médio · 90g', 165, 26, 0, 6, 'Proteína'),
        item('Lombo suíno cozido/assado', '1 bife pequeno · 85g', 145, 24, 0, 5, 'Proteína'),
        item('Ovos cozidos/mexidos/fritos sem óleo', '2 unidades', 140, 12, 1, 10, 'Proteína'),
        item('Filé de merluza/pescada/tilápia', '2 filés pequenos · 190g', 180, 32, 0, 5, 'Proteína'),
        // Vegetais (à vontade)
        item('Verduras à vontade', 'alface, rúcula, agrião, etc', 20, 2, 4, 0, null),
        item('Legumes à vontade', 'abobrinha, berinjela, cebola, etc', 30, 2, 7, 0, null),
      ],
    },
    {
      id: 'diet-coringa', name: 'Coringa noturno', icon: '🍉', time: '22:00',
      items: [
        item('Melão', 'à vontade', 40, 1, 10, 0, 'Fruta livre'),
        item('Melancia', 'à vontade', 30, 1, 8, 0, 'Fruta livre'),
        item('Morango', 'à vontade', 30, 1, 8, 0, 'Fruta livre'),
        item('Gelatina Zero Açúcar', 'à vontade', 10, 1, 1, 0, null),
      ],
    },
  ];

  const targets = {
    dailyCalories: 1500,
    protein: 115,
    carbs: 175,
    fat: 35,
    weightGoal: 75,
  };

  const weightLog = [
    { date: '2026-02-10', weight: 83.4, timestamp: new Date('2026-02-10').getTime() },
  ];

  const measurements = [
    {
      date: '2026-02-10',
      timestamp: new Date('2026-02-10').getTime(),
      cintura: 86.5,
    },
  ];

  // Substitui refeições existentes pelo plano completo
  d._diet.meals = meals;
  d._diet.targets = Object.assign({}, targets, d._diet.targets || {});
  // Chave OpenAI: configure manualmente em Dieta → Config (não pode ser commitada no Git)

  if (!d._diet.weightLog) d._diet.weightLog = [];
  const existingWeights = new Set(d._diet.weightLog.map(w => w.date));
  weightLog.forEach(w => { if (!existingWeights.has(w.date)) d._diet.weightLog.push(w); });
  d._diet.weightLog.sort((a,b) => a.date.localeCompare(b.date));

  if (!d._diet.measurements) d._diet.measurements = [];
  const existingMeasures = new Set(d._diet.measurements.map(m => m.date));
  measurements.forEach(m => { if (!existingMeasures.has(m.date)) d._diet.measurements.push(m); });
  d._diet.measurements.sort((a,b) => a.date.localeCompare(b.date));

  d.lastModified = Date.now();
  localStorage.setItem('meuPainel_v4', JSON.stringify(d));

  alert(
    `✓ Plano nutricional importado!\n\n` +
    `• ${meals.length} refeições com todas as opções de substituição\n` +
    `• Peso inicial: 83.4 kg (10/02)\n` +
    `• Cintura: 86.5 cm\n` +
    `• Metas: ${targets.dailyCalories} kcal/dia, meta de peso ${targets.weightGoal} kg\n\n` +
    `⚠ Configure sua chave OpenAI em Dieta → Config para usar Extra e Chat.\n\n` +
    `Recarregue a página.`
  );
})();
