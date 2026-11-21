export type ActiveSection = 'home' | 'plants' | 'products';

export type BotanicalClass =
  | 'all'
  | 'bryophyte'
  | 'pteridophyte'
  | 'gymnosperm'
  | 'angiosperm_monocot'
  | 'angiosperm_dicot';

export type LifeForm =
  | 'all'
  | 'tree'
  | 'shrub'
  | 'herb'
  | 'climber'
  | 'epiphyte_succulent';

export type HabitatType =
  | 'all'
  | 'xerophyte'
  | 'mesophyte'
  | 'hydro_hygrophyte'
  | 'halophyte';

export type UsageType =
  | 'all'
  | 'ornamental'
  | 'medicinal'
  | 'food'
  | 'industrial'
  | 'ecological';

export interface PlantCharacteristics {
  sunlight: string;
  soil: string;
  climate: string;
  growthTraits: string;
  summary: string;
}

export interface WateringSchedule {
  bestTime: string;
  frequency: string;
  amount: string;
  tips: string;
}

export interface PlantItem {
  id: string;
  commonName: string;
  scientificName: string;
  familyName: string;
  origin: string;
  image: string;
  imageAlt: string;
  botanicalClass: Exclude<BotanicalClass, 'all'>;
  lifeForm: Exclude<LifeForm, 'all'>;
  lifeFormDetail: string;
  habitat: Exclude<HabitatType, 'all'>;
  usages: Exclude<UsageType, 'all'>[];
  characteristics: PlantCharacteristics;
  watering: WateringSchedule;
  primaryPurpose: string;
  featured: boolean;
  recommendedProductIds: string[];
}

export interface PlantFilterState {
  query: string;
  botanicalClass: BotanicalClass;
  lifeForm: LifeForm;
  habitat: HabitatType;
  usage: UsageType;
}

export type ProductCategory =
  | 'all'
  | 'sensor'
  | 'watering'
  | 'soil'
  | 'lighting';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategory, 'all'>;
  priceMnt: number;
  status: 'Бэлэн байгаа' | 'Цөөн үлдсэн' | 'Урьдчилсан захиалга';
  image: string;
  imageAlt: string;
  description: string;
  benefits: string[];
  specs: ProductSpec[];
  featured: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
