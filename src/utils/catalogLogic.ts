import type {
  CartItem,
  PlantFilterState,
  PlantItem,
  ProductCategory,
  ProductItem,
  UsageType,
} from '../types/botany';

export const DEFAULT_PLANT_FILTERS: PlantFilterState = {
  query: '',
  botanicalClass: 'all',
  lifeForm: 'all',
  habitat: 'all',
  usage: 'all',
};

export const FREE_DELIVERY_THRESHOLD_MNT = 300000;
export const STANDARD_DELIVERY_FEE_MNT = 12000;

export type ProductSortOrder = 'featured' | 'price_asc' | 'price_desc';
export type PlantSortOrder = 'variety' | 'alpha' | 'saved_first';
export type SeasonType = 'summer' | 'spring_autumn' | 'winter';
export type GrowEnvironment = 'indoor' | 'greenhouse' | 'outdoor';

export interface InteractiveMatchCriteria {
  environment: 'all' | 'indoor' | 'garden' | 'arid';
  sunlight: 'all' | 'bright' | 'shade';
  usage: UsageType;
}

export interface AdjustedCareAdvice {
  seasonLabel: string;
  environmentLabel: string;
  wateringAdjustment: string;
  frequencyNote: string;
  lightNote: string;
  climateNote: string;
}

export function filterPlants(plants: PlantItem[], filters: PlantFilterState): PlantItem[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return plants.filter((plant) => {
    if (filters.botanicalClass !== 'all' && plant.botanicalClass !== filters.botanicalClass) {
      return false;
    }
    if (filters.lifeForm !== 'all' && plant.lifeForm !== filters.lifeForm) {
      return false;
    }
    if (filters.habitat !== 'all' && plant.habitat !== filters.habitat) {
      return false;
    }
    if (filters.usage !== 'all' && !plant.usages.includes(filters.usage)) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const searchable = [
        plant.commonName,
        plant.scientificName,
        plant.familyName,
        plant.origin,
        plant.primaryPurpose,
        plant.characteristics.summary,
        plant.characteristics.growthTraits,
        plant.characteristics.climate,
        plant.characteristics.soil,
        plant.lifeFormDetail,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    }

    return true;
  });
}

export function countActivePlantFilters(filters: PlantFilterState): number {
  let count = 0;
  if (filters.query.trim().length > 0) count += 1;
  if (filters.botanicalClass !== 'all') count += 1;
  if (filters.lifeForm !== 'all') count += 1;
  if (filters.habitat !== 'all') count += 1;
  if (filters.usage !== 'all') count += 1;
  return count;
}

export function interleavePlantsByImage(plants: PlantItem[]): PlantItem[] {
  if (plants.length <= 2) {
    return plants;
  }

  const prioritized = [
    ...plants.filter((p) => p.featured),
    ...plants.filter((p) => !p.featured),
  ];

  const buckets = new Map<string, PlantItem[]>();
  for (const plant of prioritized) {
    const group = buckets.get(plant.image);
    if (group) {
      group.push(plant);
    } else {
      buckets.set(plant.image, [plant]);
    }
  }

  const queue = Array.from(buckets.values());
  const result: PlantItem[] = [];
  let index = 0;
  let hasMore = true;

  while (hasMore) {
    hasMore = false;
    for (const group of queue) {
      if (index < group.length) {
        result.push(group[index]);
        hasMore = true;
      }
    }
    index += 1;
  }

  return result;
}

export function applyPlantDisplayOrder(
  plants: PlantItem[],
  sortOrder: PlantSortOrder,
  savedIds: string[],
  savedOnly: boolean = false
): PlantItem[] {
  const savedSet = new Set(savedIds);
  const base = savedOnly ? plants.filter((p) => savedSet.has(p.id)) : plants;

  if (sortOrder === 'alpha') {
    return [...base].sort((a, b) => a.commonName.localeCompare(b.commonName, 'mn'));
  }

  if (sortOrder === 'saved_first') {
    const saved = interleavePlantsByImage(base.filter((p) => savedSet.has(p.id)));
    const rest = interleavePlantsByImage(base.filter((p) => !savedSet.has(p.id)));
    return [...saved, ...rest];
  }

  return interleavePlantsByImage(base);
}

export interface BotanySummaryCounts {
  total: number;
  byBotanical: Record<Exclude<PlantItem['botanicalClass'], 'all'>, number>;
  byHabitat: Record<Exclude<PlantItem['habitat'], 'all'>, number>;
}

export function summarizeBotanyCounts(plants: PlantItem[]): BotanySummaryCounts {
  const byBotanical: BotanySummaryCounts['byBotanical'] = {
    bryophyte: 0,
    pteridophyte: 0,
    gymnosperm: 0,
    angiosperm_monocot: 0,
    angiosperm_dicot: 0,
  };
  const byHabitat: BotanySummaryCounts['byHabitat'] = {
    xerophyte: 0,
    mesophyte: 0,
    hydro_hygrophyte: 0,
    halophyte: 0,
  };

  for (const plant of plants) {
    byBotanical[plant.botanicalClass] += 1;
    byHabitat[plant.habitat] += 1;
  }

  return {
    total: plants.length,
    byBotanical,
    byHabitat,
  };
}

export interface WateringRhythmGroup {
  id: 'early' | 'midMorning' | 'eveningAndAquatic';
  timeRange: string;
  title: string;
  guidance: string;
  plants: PlantItem[];
}

export function selectWateringScheduleGroups(plants: PlantItem[]): WateringRhythmGroup[] {
  const pool = interleavePlantsByImage(plants);

  const early = pool
    .filter((p) => /05:30|06:00|06:30/.test(p.watering.bestTime))
    .slice(0, 3);

  const midMorning = pool
    .filter(
      (p) =>
        /07:30|08:00|08:30/.test(p.watering.bestTime) &&
        !early.some((e) => e.id === p.id)
    )
    .slice(0, 3);

  const eveningOrContinuous = pool
    .filter(
      (p) =>
        /18:30|19:00|19:30|Байнгын/.test(p.watering.bestTime) &&
        !early.some((e) => e.id === p.id) &&
        !midMorning.some((m) => m.id === p.id)
    )
    .slice(0, 3);

  return [
    {
      id: 'early',
      timeRange: '05:30–08:00',
      title: 'Үүрийн сэрүүн усалгаа',
      guidance: 'Нар гарахын өмнө ууршилт хамгийн бага үед гадна мод, говийн сөөг ба тариалангийн гүн усалгаа.',
      plants: early,
    },
    {
      id: 'midMorning',
      timeRange: '07:30–10:00',
      title: 'Өглөөний гэрлийн арчилгаа',
      guidance: 'Тасалгааны ургамал, цэцэгт мод ба шүүслэг төрлийн навч шөнө хатсан байх нөхцөлтэй усалгаа.',
      plants: midMorning,
    },
    {
      id: 'eveningAndAquatic',
      timeRange: '18:30–21:00 · Усан орчин',
      title: 'Оройн чийгшил ба усны ургамал',
      guidance: 'Хөвд, чийгсэг ойм, жимсний бутны манан шүршилт болон усны ургамлын түвшин тэнцвэржүүлэлт.',
      plants: eveningOrContinuous,
    },
  ];
}

export function matchPlantsByQuiz(
  plants: PlantItem[],
  criteria: InteractiveMatchCriteria
): PlantItem[] {
  const matched = plants.filter((plant) => {
    if (criteria.usage !== 'all' && !plant.usages.includes(criteria.usage)) {
      return false;
    }

    if (criteria.environment === 'indoor') {
      const isCompactIndoor =
        plant.lifeForm === 'epiphyte_succulent' ||
        plant.lifeForm === 'herb' ||
        plant.lifeForm === 'climber' ||
        plant.botanicalClass === 'bryophyte' ||
        plant.botanicalClass === 'pteridophyte';
      if (!isCompactIndoor) return false;
    } else if (criteria.environment === 'garden') {
      const isOutdoorGarden =
        plant.lifeForm === 'tree' ||
        plant.lifeForm === 'shrub' ||
        plant.habitat === 'mesophyte' ||
        plant.habitat === 'hydro_hygrophyte';
      if (!isOutdoorGarden) return false;
    } else if (criteria.environment === 'arid') {
      if (plant.habitat !== 'xerophyte' && plant.habitat !== 'halophyte') {
        return false;
      }
    }

    if (criteria.sunlight === 'bright') {
      const sunText = plant.characteristics.sunlight.toLowerCase();
      if (/сүүдэрт ургадаг|хүчтэй сүүдэр|зөвхөн сүүдэр/.test(sunText) && !/нар/.test(sunText)) {
        return false;
      }
    } else if (criteria.sunlight === 'shade') {
      const sunText = plant.characteristics.sunlight.toLowerCase();
      if (!/сүүдэр|сарнисан|чийглэг/.test(sunText)) {
        return false;
      }
    }

    return true;
  });

  return interleavePlantsByImage(matched);
}

export function calculateAdjustedCareAdvice(
  plant: PlantItem,
  season: SeasonType,
  environment: GrowEnvironment
): AdjustedCareAdvice {
  const seasonLabels: Record<SeasonType, string> = {
    summer: 'Зун (Идэвхтэй ургалт)',
    spring_autumn: 'Хавар ба Намар (Шилжилтийн үе)',
    winter: 'Өвөл (Амралтын горим)',
  };

  const envLabels: Record<GrowEnvironment, string> = {
    indoor: 'Тасалгаа / Оффис',
    greenhouse: 'Хүлэмж',
    outdoor: 'Гадна орчин',
  };

  const isAquatic = /Байнгын усан орчин|усан дотор/i.test(plant.watering.bestTime);
  const isDesert = plant.habitat === 'xerophyte' || plant.habitat === 'halophyte';
  const isMossOrFern =
    plant.botanicalClass === 'bryophyte' || plant.botanicalClass === 'pteridophyte';

  let wateringAdjustment = `Үндсэн цаг: ${plant.watering.bestTime}. `;
  let frequencyNote = plant.watering.frequency;

  if (isAquatic) {
    wateringAdjustment = 'Усны түвшин ба хүчилтөрөгчийг тогтмол хянана.';
    frequencyNote =
      season === 'summer'
        ? 'Дулаан үед ууршилтыг нөхөж 2–3 хоног тутам цэвэр ус нэмнэ.'
        : 'Хүйтэн үед ус солих давтамжийг цөөрүүлж 10–14 хоногт сэлгэнэ.';
  } else if (season === 'summer') {
    wateringAdjustment +=
      environment === 'outdoor'
        ? 'Халуун өдөр ууршилтыг багасгахын тулд үндсэн цагаас 30–45 минутын өмнө гүн усална.'
        : 'Зуны идэвхтэй ургалтын үед хөрсний өнгөн үе хатмагц бүрэн шингээж усална.';
    frequencyNote = isDesert
      ? `${plant.watering.frequency} (Хуурай үед хөрс бүрэн хатсаны дараа).`
      : `${plant.watering.frequency} — ууршилтаас хамаарч ~20% илүү чийг шаардана.`;
  } else if (season === 'winter') {
    wateringAdjustment =
      environment === 'indoor'
        ? 'Өвлийн улиралд өрөөний бүлээн (20–22°C) усаар зөвхөн өглөөний цагаар усална.'
        : 'Гадаа болон сэрүүн хүлэмжид хөрс хөлдөхөөс өмнөх үндсэн чийгийг л хадгална.';
    frequencyNote = isMossOrFern
      ? 'Халаалттай өрөөнд навчны шүршилтийг үргэлжлүүлж, үндэсний усалгааг 30% багасгана.'
      : 'Амралтын горимд ордог тул усалгааны интервалыг 1.5–2 дахин уртасгана.';
  } else {
    wateringAdjustment += 'Хавар сэргэлтийн үед усалгааг аажмаар нэмэгдүүлж, намар багасгана.';
    frequencyNote = `${plant.watering.frequency} (Хөрсний чийг хэмжигчээр 35–55% хооронд барина).`;
  }

  let lightNote = plant.characteristics.sunlight;
  if (environment === 'indoor' && !isMossOrFern) {
    lightNote =
      season === 'winter'
        ? 'Өвлийн богино өдөр тул урд цонх руу ойртуулах эсвэл HelioArc LED гэрлээр өдөрт 10–12 цаг дэмжинэ.'
        : 'Тасалгааны цонхны сарнисан гэрэлд долоо хоногт нэг удаа ваарыг 90° эргүүлж жигд ургуулна.';
  } else if (environment === 'greenhouse') {
    lightNote =
      season === 'summer'
        ? 'Хүлэмжид үд дундын хэт халалтаас сэргийлж 30% сүүдэрлэх тор болон агаар сэлгэлт ашиглана.'
        : 'Шилэн хүлэмжийн байгалийн гэрлийг бүрэн ашиглаж, конденсацыг өглөө агааржуулна.';
  }

  let climateNote = plant.characteristics.climate;
  if (environment === 'outdoor' && season === 'winter' && !plant.origin.includes('Монгол')) {
    climateNote =
      'Монголын өвлийн хүйтэнд (-25°C ба түүнээс доош) гадна талд өвөлжүүлэхгүйгээр дулаан хүлэмж эсвэл тасалгаанд оруулна.';
  } else if (environment === 'indoor' && isMossOrFern) {
    climateNote =
      'Паар, халаагуурын хуурай агаараас хол байрлуулж, AeroMist мананжуулагчаар чийгшлийг 65%+ түвшинд барина.';
  }

  return {
    seasonLabel: seasonLabels[season],
    environmentLabel: envLabels[environment],
    wateringAdjustment,
    frequencyNote,
    lightNote,
    climateNote,
  };
}

export function getCompatiblePlantsForProduct(
  plants: PlantItem[],
  productId: string
): PlantItem[] {
  const matches = plants.filter((plant) => plant.recommendedProductIds.includes(productId));
  return interleavePlantsByImage(matches);
}

export function getAdjacentPlantIds(
  plants: PlantItem[],
  currentId: string
): { prevPlant: PlantItem | null; nextPlant: PlantItem | null; currentIndex: number } {
  const idx = plants.findIndex((p) => p.id === currentId);
  if (idx === -1 || plants.length === 0) {
    return { prevPlant: null, nextPlant: null, currentIndex: -1 };
  }
  const prevIndex = (idx - 1 + plants.length) % plants.length;
  const nextIndex = (idx + 1) % plants.length;
  return {
    prevPlant: plants.length > 1 ? plants[prevIndex] : null,
    nextPlant: plants.length > 1 ? plants[nextIndex] : null,
    currentIndex: idx,
  };
}

export function filterProducts(
  products: ProductItem[],
  category: ProductCategory,
  query: string
): ProductItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    if (category !== 'all' && product.category !== category) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const searchable = [
        product.name,
        product.subtitle,
        product.description,
        ...product.benefits,
        ...product.specs.map((s) => `${s.label} ${s.value}`),
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    }
    return true;
  });
}

export function sortProducts(
  products: ProductItem[],
  sortOrder: ProductSortOrder,
  availableOnly: boolean = false
): ProductItem[] {
  const filtered = availableOnly
    ? products.filter((p) => p.status === 'Бэлэн байгаа')
    : products;

  if (sortOrder === 'price_asc') {
    return [...filtered].sort((a, b) => a.priceMnt - b.priceMnt);
  }
  if (sortOrder === 'price_desc') {
    return [...filtered].sort((a, b) => b.priceMnt - a.priceMnt);
  }
  return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export interface CartTotals {
  itemCount: number;
  subtotalMnt: number;
  deliveryFeeMnt: number;
  totalMnt: number;
  freeDeliveryRemainingMnt: number;
}

export function calculateCartTotals(
  items: CartItem[],
  freeThresholdMnt: number = FREE_DELIVERY_THRESHOLD_MNT,
  deliveryFeeMnt: number = STANDARD_DELIVERY_FEE_MNT
): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
  const subtotalMnt = items.reduce(
    (sum, item) => sum + item.product.priceMnt * Math.max(0, item.quantity),
    0
  );

  if (itemCount === 0 || subtotalMnt === 0) {
    return {
      itemCount: 0,
      subtotalMnt: 0,
      deliveryFeeMnt: 0,
      totalMnt: 0,
      freeDeliveryRemainingMnt: freeThresholdMnt,
    };
  }

  const qualifiesForFreeDelivery = subtotalMnt >= freeThresholdMnt;
  const appliedDelivery = qualifiesForFreeDelivery ? 0 : deliveryFeeMnt;

  return {
    itemCount,
    subtotalMnt,
    deliveryFeeMnt: appliedDelivery,
    totalMnt: subtotalMnt + appliedDelivery,
    freeDeliveryRemainingMnt: Math.max(0, freeThresholdMnt - subtotalMnt),
  };
}

export function formatMnt(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} ₮`;
}
