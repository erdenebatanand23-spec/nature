import test from 'node:test';
import assert from 'node:assert/strict';
import { PLANTS_DATA } from '../data/plants';
import { PRODUCTS_DATA } from '../data/products';
import {
  applyPlantDisplayOrder,
  calculateAdjustedCareAdvice,
  calculateCartTotals,
  countActivePlantFilters,
  DEFAULT_PLANT_FILTERS,
  filterPlants,
  filterProducts,
  formatMnt,
  getAdjacentPlantIds,
  getCompatiblePlantsForProduct,
  interleavePlantsByImage,
  matchPlantsByQuiz,
  selectWateringScheduleGroups,
  sortProducts,
  summarizeBotanyCounts,
} from './catalogLogic';

test('filterPlants returns all plants with default filters', () => {
  const result = filterPlants(PLANTS_DATA, DEFAULT_PLANT_FILTERS);
  assert.equal(result.length, PLANTS_DATA.length);
  assert.ok(PLANTS_DATA.length >= 60, `Expected >=60 plants, got ${PLANTS_DATA.length}`);
});

test('summarizeBotanyCounts and selectWateringScheduleGroups accurately reflect catalog data', () => {
  const counts = summarizeBotanyCounts(PLANTS_DATA);
  assert.equal(counts.total, PLANTS_DATA.length);
  const sumBotanical = Object.values(counts.byBotanical).reduce((a, b) => a + b, 0);
  const sumHabitat = Object.values(counts.byHabitat).reduce((a, b) => a + b, 0);
  assert.equal(sumBotanical, PLANTS_DATA.length);
  assert.equal(sumHabitat, PLANTS_DATA.length);

  const groups = selectWateringScheduleGroups(PLANTS_DATA);
  assert.equal(groups.length, 3);
  assert.ok(groups.every((g) => g.plants.length === 3));
});

test('every classification axis option has at least one matching plant', () => {
  const botanicalClasses = ['bryophyte', 'pteridophyte', 'gymnosperm', 'angiosperm_monocot', 'angiosperm_dicot'] as const;
  for (const bc of botanicalClasses) {
    const matches = filterPlants(PLANTS_DATA, { ...DEFAULT_PLANT_FILTERS, botanicalClass: bc });
    assert.ok(matches.length >= 4, `Expected >=4 plants for botanicalClass=${bc}, got ${matches.length}`);
  }

  const lifeForms = ['tree', 'shrub', 'herb', 'climber', 'epiphyte_succulent'] as const;
  for (const lf of lifeForms) {
    const matches = filterPlants(PLANTS_DATA, { ...DEFAULT_PLANT_FILTERS, lifeForm: lf });
    assert.ok(matches.length >= 3, `Expected >=3 plants for lifeForm=${lf}, got ${matches.length}`);
  }

  const habitats = ['xerophyte', 'mesophyte', 'hydro_hygrophyte', 'halophyte'] as const;
  for (const h of habitats) {
    const matches = filterPlants(PLANTS_DATA, { ...DEFAULT_PLANT_FILTERS, habitat: h });
    assert.ok(matches.length >= 4, `Expected >=4 plants for habitat=${h}, got ${matches.length}`);
  }

  const usages = ['ornamental', 'medicinal', 'food', 'industrial', 'ecological'] as const;
  for (const u of usages) {
    const matches = filterPlants(PLANTS_DATA, { ...DEFAULT_PLANT_FILTERS, usage: u });
    assert.ok(matches.length >= 5, `Expected >=5 plants for usage=${u}, got ${matches.length}`);
  }
});

test('filterPlants filters accurately across combined 4 classification axes', () => {
  const gymnospermTrees = filterPlants(PLANTS_DATA, {
    ...DEFAULT_PLANT_FILTERS,
    botanicalClass: 'gymnosperm',
    lifeForm: 'tree',
  });
  assert.ok(gymnospermTrees.length >= 6);
  assert.ok(gymnospermTrees.every((p) => p.botanicalClass === 'gymnosperm' && p.lifeForm === 'tree'));

  const halophytes = filterPlants(PLANTS_DATA, {
    ...DEFAULT_PLANT_FILTERS,
    habitat: 'halophyte',
  });
  assert.ok(halophytes.length >= 4);
  assert.ok(halophytes.some((p) => p.id === 'saxaul-tree'));
  assert.ok(halophytes.some((p) => p.id === 'red-mangrove'));
});

test('filterPlants matches Mongolian common name, scientific name, and characteristics', () => {
  const byScientific = filterPlants(PLANTS_DATA, {
    ...DEFAULT_PLANT_FILTERS,
    query: 'Pinus sibirica',
  });
  assert.equal(byScientific.length, 1);
  assert.equal(byScientific[0].id, 'siberian-cedar-pine');

  const byMongolian = filterPlants(PLANTS_DATA, {
    ...DEFAULT_PLANT_FILTERS,
    query: 'хөвд',
  });
  assert.ok(byMongolian.some((p) => p.id === 'cushion-moss'));
  assert.ok(byMongolian.some((p) => p.id === 'sphagnum-moss'));
});

test('countActivePlantFilters counts active criteria properly', () => {
  assert.equal(countActivePlantFilters(DEFAULT_PLANT_FILTERS), 0);
  assert.equal(
    countActivePlantFilters({
      query: 'хуш',
      botanicalClass: 'gymnosperm',
      lifeForm: 'all',
      habitat: 'mesophyte',
      usage: 'all',
    }),
    3
  );
});

test('interleavePlantsByImage preserves all items and prevents adjacent duplicate thumbnails in top rows', () => {
  const interleaved = interleavePlantsByImage(PLANTS_DATA);
  assert.equal(interleaved.length, PLANTS_DATA.length);
  const firstSixImages = new Set(interleaved.slice(0, 6).map((p) => p.image));
  assert.equal(firstSixImages.size, 6);
});

test('applyPlantDisplayOrder sorts alphabetically, prioritizes saved plants, and filters saved-only', () => {
  const savedIds = ['sacred-lotus', 'siberian-cedar-pine'];
  const savedOnly = applyPlantDisplayOrder(PLANTS_DATA, 'variety', savedIds, true);
  assert.equal(savedOnly.length, 2);

  const savedFirst = applyPlantDisplayOrder(PLANTS_DATA, 'saved_first', savedIds, false);
  assert.ok(savedIds.includes(savedFirst[0].id));
  assert.ok(savedIds.includes(savedFirst[1].id));

  const alpha = applyPlantDisplayOrder(PLANTS_DATA, 'alpha', savedIds, false);
  assert.equal(alpha.length, PLANTS_DATA.length);
  assert.ok(alpha[0].commonName.localeCompare(alpha[1].commonName, 'mn') <= 0);
});

test('matchPlantsByQuiz filters across environment, sunlight, and usage', () => {
  const indoorShade = matchPlantsByQuiz(PLANTS_DATA, {
    environment: 'indoor',
    sunlight: 'shade',
    usage: 'ornamental',
  });
  assert.ok(indoorShade.length >= 2);
  assert.ok(indoorShade.every((p) => p.usages.includes('ornamental')));

  const arid = matchPlantsByQuiz(PLANTS_DATA, {
    environment: 'arid',
    sunlight: 'all',
    usage: 'all',
  });
  assert.ok(arid.length >= 6);
  assert.ok(arid.every((p) => p.habitat === 'xerophyte' || p.habitat === 'halophyte'));
});

test('calculateAdjustedCareAdvice tailors advice by season and growing environment', () => {
  const monstera = PLANTS_DATA.find((p) => p.id === 'monstera-deliciosa')!;
  const summerOutdoor = calculateAdjustedCareAdvice(monstera, 'summer', 'outdoor');
  const winterIndoor = calculateAdjustedCareAdvice(monstera, 'winter', 'indoor');

  assert.notEqual(summerOutdoor.wateringAdjustment, winterIndoor.wateringAdjustment);
  assert.ok(winterIndoor.lightNote.includes('HelioArc'));

  const lotus = PLANTS_DATA.find((p) => p.id === 'sacred-lotus')!;
  const lotusAdvice = calculateAdjustedCareAdvice(lotus, 'summer', 'outdoor');
  assert.ok(lotusAdvice.wateringAdjustment.includes('Усны түвшин'));
});

test('getCompatiblePlantsForProduct and getAdjacentPlantIds resolve catalog relationships', () => {
  const soilSensorPlants = getCompatiblePlantsForProduct(PLANTS_DATA, 'floratech-soil-probe');
  assert.ok(soilSensorPlants.length >= 3);

  const adj = getAdjacentPlantIds(PLANTS_DATA, PLANTS_DATA[0].id);
  assert.equal(adj.currentIndex, 0);
  assert.equal(adj.nextPlant?.id, PLANTS_DATA[1].id);
  assert.equal(adj.prevPlant?.id, PLANTS_DATA[PLANTS_DATA.length - 1].id);
});

test('filterProducts and sortProducts filter and sort accurately', () => {
  const sensors = filterProducts(PRODUCTS_DATA, 'sensor', '');
  assert.equal(sensors.length, 2);
  assert.ok(sensors.every((p) => p.category === 'sensor'));

  const queried = filterProducts(PRODUCTS_DATA, 'all', 'микориз');
  assert.equal(queried.length, 1);
  assert.equal(queried[0].id, 'organic-mycorrhiza-mix');

  const asc = sortProducts(PRODUCTS_DATA, 'price_asc', false);
  for (let i = 1; i < asc.length; i += 1) {
    assert.ok(asc[i - 1].priceMnt <= asc[i].priceMnt);
  }

  const desc = sortProducts(PRODUCTS_DATA, 'price_desc', false);
  for (let i = 1; i < desc.length; i += 1) {
    assert.ok(desc[i - 1].priceMnt >= desc[i].priceMnt);
  }

  const availableOnly = sortProducts(PRODUCTS_DATA, 'featured', true);
  assert.ok(availableOnly.every((p) => p.status === 'Бэлэн байгаа'));
});

test('calculateCartTotals computes subtotal, delivery fee, and free delivery threshold', () => {
  const emptyTotals = calculateCartTotals([]);
  assert.equal(emptyTotals.itemCount, 0);
  assert.equal(emptyTotals.totalMnt, 0);

  const soilProduct = PRODUCTS_DATA.find((p) => p.id === 'organic-mycorrhiza-mix')!;
  const belowThreshold = calculateCartTotals([{ product: soilProduct, quantity: 2 }]);
  assert.equal(belowThreshold.itemCount, 2);
  assert.equal(belowThreshold.subtotalMnt, 96000);
  assert.equal(belowThreshold.deliveryFeeMnt, 12000);
  assert.equal(belowThreshold.totalMnt, 108000);
  assert.equal(belowThreshold.freeDeliveryRemainingMnt, 204000);

  const sensorProduct = PRODUCTS_DATA.find((p) => p.id === 'floratech-soil-probe')!;
  const aboveThreshold = calculateCartTotals([{ product: sensorProduct, quantity: 2 }]);
  assert.equal(aboveThreshold.subtotalMnt, 336000);
  assert.equal(aboveThreshold.deliveryFeeMnt, 0);
  assert.equal(aboveThreshold.totalMnt, 336000);
  assert.equal(aboveThreshold.freeDeliveryRemainingMnt, 0);
});

test('formatMnt formats currency cleanly', () => {
  assert.equal(formatMnt(168000), '168,000 ₮');
});
