import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Leaf,
  Search,
  SlidersHorizontal,
  Sprout,
  Sun,
  Waves,
} from 'lucide-react';
import {
  BOTANICAL_LABEL_MAP,
  HABITAT_LABEL_MAP,
  LIFE_FORM_LABEL_MAP,
} from '../data/plants';
import { PRODUCT_CATEGORY_LABELS } from '../data/products';
import type {
  ActiveSection,
  BotanicalClass,
  HabitatType,
  PlantFilterState,
  PlantItem,
  ProductItem,
  UsageType,
} from '../types/botany';
import {
  formatMnt,
  matchPlantsByQuiz,
  selectWateringScheduleGroups,
  summarizeBotanyCounts,
  type InteractiveMatchCriteria,
} from '../utils/catalogLogic';
import { HeroEcoCircuitBackdrop } from './BotanicalVisuals';
import { SafeImage } from './SafeImage';

interface HomeViewProps {
  allPlants: PlantItem[];
  featuredPlants: PlantItem[];
  featuredProducts: ProductItem[];
  totalPlantsCount: number;
  savedPlantIds: string[];
  heroActive?: boolean;
  onNavigate: (section: ActiveSection) => void;
  onQuickSearchPlants: (query: string) => void;
  onApplyPlantFilters: (partial: Partial<PlantFilterState>) => void;
  onSelectPlant: (plant: PlantItem) => void;
  onToggleSavedPlant: (plantId: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

const BOTANICAL_NAV_ITEMS: Array<{
  key: Exclude<BotanicalClass, 'all'>;
  index: string;
  title: string;
  subtitle: string;
}> = [
  {
    key: 'bryophyte',
    index: '01',
    title: 'Хөвд хэлбэртэн',
    subtitle: 'Дээд ба доод хөвд, чийг хадгалагч бүрхүүл',
  },
  {
    key: 'pteridophyte',
    index: '02',
    title: 'Ойм ба плаун хэлбэртэн',
    subtitle: 'Спороор үрждэг гуурст ургамал, шивлээ',
  },
  {
    key: 'gymnosperm',
    index: '03',
    title: 'Нүцгэн үртэн',
    subtitle: 'Шилмүүст мод, гинкго, арц ба зээргэнэ',
  },
  {
    key: 'angiosperm_monocot',
    index: '04',
    title: 'Далд үртэн · Нэг талт үртэн',
    subtitle: 'Үетэн, цахирмаа, агава, хулс ба дал мод',
  },
  {
    key: 'angiosperm_dicot',
    index: '05',
    title: 'Далд үртэн · Хос талт үртэн',
    subtitle: 'Навчит мод, жимсний сөөг, цэцэгт ба эмийн ургамал',
  },
];

const HABITAT_NAV_ITEMS: Array<{
  key: Exclude<HabitatType, 'all'>;
  title: string;
  condition: string;
  description: string;
  icon: typeof Sun;
  accentColor: string;
}> = [
  {
    key: 'xerophyte',
    title: 'Ксерофит',
    condition: 'Хуурай · Цөл хээр',
    description: 'Ган болон нарны хурц туяанд дасан зохицсон шүүслэг, говийн бут ба сөөг.',
    icon: Sun,
    accentColor: 'text-[#B45309]',
  },
  {
    key: 'mesophyte',
    title: 'Мезофит',
    condition: 'Дунд зэргийн чийгшил',
    description: 'Ой, цэцэрлэг, тариалангийн талбай ба тасалгааны дийлэнх ургамал, мод.',
    icon: Leaf,
    accentColor: 'text-[#1F7A4C]',
  },
  {
    key: 'hydro_hygrophyte',
    title: 'Гидрофит ба Гигрофит',
    condition: 'Усны ба өндөр чийг',
    description: 'Нуур цөөрөм, намгархаг хөрс ба усыг шүүх чадвартай бадамлянхуа, хөвд, ойм.',
    icon: Waves,
    accentColor: 'text-[#0E6BA8]',
  },
  {
    key: 'halophyte',
    title: 'Галофит',
    condition: 'Давсархаг хөрс',
    description: 'Хужир шүү, далайн эрэг болон давстай хөрсийг сэргээдэг заг, сухай, мангро.',
    icon: Droplets,
    accentColor: 'text-[#164432]',
  },
];

const HERO_QUICK_TOPICS: Array<{
  label: string;
  filters: Partial<PlantFilterState>;
}> = [
  { label: 'Шилмүүст', filters: { botanicalClass: 'gymnosperm', lifeForm: 'tree' } },
  { label: 'Цэцэгт & гоёл', filters: { usage: 'ornamental' } },
  { label: 'Говийн', filters: { habitat: 'xerophyte' } },
  { label: 'Эмийн', filters: { usage: 'medicinal' } },
];

const QUIZ_ENV_OPTIONS: Array<{ value: InteractiveMatchCriteria['environment']; label: string }> = [
  { value: 'all', label: 'Бүх орчин' },
  { value: 'indoor', label: 'Гэр ба Оффис' },
  { value: 'garden', label: 'Цэцэрлэг ба Гадаа' },
  { value: 'arid', label: 'Хуурай, Говийн нөхцөл' },
];

const QUIZ_SUN_OPTIONS: Array<{ value: InteractiveMatchCriteria['sunlight']; label: string }> = [
  { value: 'all', label: 'Бүх гэрэл' },
  { value: 'bright', label: 'Нарлаг цонх / Ил талбай' },
  { value: 'shade', label: 'Хагас сүүдэр / Сарнисан' },
];

const QUIZ_USAGE_OPTIONS: Array<{ value: UsageType; label: string }> = [
  { value: 'all', label: 'Бүх зориулалт' },
  { value: 'ornamental', label: 'Чимэглэл' },
  { value: 'medicinal', label: 'Эмийн' },
  { value: 'food', label: 'Хүнс / Жимс' },
  { value: 'ecological', label: 'Экологи / Агаар' },
];

export function HomeView({
  allPlants,
  featuredPlants,
  featuredProducts,
  totalPlantsCount,
  savedPlantIds,
  heroActive = true,
  onNavigate,
  onQuickSearchPlants,
  onApplyPlantFilters,
  onSelectPlant,
  onToggleSavedPlant,
  onSelectProduct,
  onAddToCart,
}: HomeViewProps) {
  const [quickQuery, setQuickQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [explorerMode, setExplorerMode] = useState<'map' | 'finder'>('map');
  const [quizCriteria, setQuizCriteria] = useState<InteractiveMatchCriteria>({
    environment: 'indoor',
    sunlight: 'all',
    usage: 'ornamental',
  });

  const botanyCounts = useMemo(() => summarizeBotanyCounts(allPlants), [allPlants]);
  const wateringGroups = useMemo(() => selectWateringScheduleGroups(allPlants), [allPlants]);
  const quizMatches = useMemo(
    () => matchPlantsByQuiz(allPlants, quizCriteria),
    [allPlants, quizCriteria]
  );

  const spotlightList = featuredPlants.length > 0 ? featuredPlants : allPlants.slice(0, 4);
  const currentSpotlight = spotlightList[spotlightIndex % spotlightList.length] ?? allPlants[0];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onQuickSearchPlants(quickQuery);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Modern Eco-Technology Widescreen Hero Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        <div
          className="relative overflow-hidden rounded-2xl border border-[#215b63]/15 bg-gradient-to-br from-[#FFFFFF] via-[#F8FAF9] to-[#EBF7F0] shadow-[0_24px_60px_-30px_rgba(33,91,99,0.2)] flex flex-col justify-between min-h-[540px] lg:min-h-[620px]"
          data-testid="eco-tech-hero"
          data-hero-active={heroActive ? 'true' : 'false'}
        >
          <HeroEcoCircuitBackdrop animateIn={heroActive} />

          {/* Quiet Top Hero Context Strip */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-5 pt-5 sm:px-9 sm:pt-7">
            <p className="text-xs font-medium tracking-wide text-[#215b63]/75">
              Ботаникийн оюун ухаан · Тогтвортой эко-технологи
            </p>

            <button
              type="button"
              onClick={() => onNavigate('plants')}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-[#215b63]/80 hover:text-[#215b63] transition-colors tabular-nums cursor-pointer"
            >
              <span>{totalPlantsCount} төрөл зүйл</span>
              <span aria-hidden="true">·</span>
              <span>4 ангиллын систем</span>
            </button>
          </div>

          {/* Center Focal Composition */}
          <div className="relative z-10 px-5 sm:px-10 lg:px-16 py-8 sm:py-12 flex flex-col items-center text-center">
            <div className="max-w-3xl mx-auto space-y-5">
              <div className={heroActive ? 'animate-hero-rise' : 'opacity-0'}>
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#236B5E] mb-3">
                  Байгаль ба Технологийн Уялдаа
                </p>

                <h1
                  className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#215b63] leading-[1.12]"
                  style={{ textWrap: 'balance' }}
                >
                  Байгаль ба тогтвортой технологийг холбох ухаалаг гүүр
                </h1>
              </div>

              <p
                className={`text-sm sm:text-lg text-[#215b63]/80 leading-relaxed max-w-2xl mx-auto ${
                  heroActive ? 'animate-hero-rise-delay' : 'opacity-0'
                }`}
              >
                Дэлхийн ургамал, модны системчилсэн ангилал, услах цагийн нарийн горимыг
                ухаалаг мэдрэгч ба байгальд ээлтэй арчилгааны шийдлүүдтэй нэгтгэнэ.
              </p>

              {/* Primary Rounded CTA + Secondary Action */}
              <div
                className={`pt-2 flex flex-wrap items-center justify-center gap-3.5 ${
                  heroActive ? 'animate-hero-rise-delay-2' : 'opacity-0'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  data-testid="explore-solutions-cta"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#215b63] hover:bg-[#1a4b52] rounded-full shadow-[0_10px_24px_-6px_rgba(33,91,99,0.45)] hover:shadow-[0_0_28px_rgba(103,192,144,0.75)] hover:ring-2 hover:ring-[#67c090]/80 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4 text-[#67c090]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('plants')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#215b63] bg-white/95 hover:bg-white border border-[#215b63]/25 hover:border-[#67c090] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Ургамлын мэдээлэл</span>
                </button>
              </div>
            </div>

            {/* Centered Quick Search Bar & Topic Shortcuts */}
            <div
              className={`mt-8 w-full max-w-xl mx-auto space-y-2.5 ${
                heroActive ? 'animate-hero-rise-delay-2' : 'opacity-0'
              }`}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-[#215b63]/20 focus-within:border-[#67c090] shadow-sm transition-colors"
                role="search"
                aria-label="Ургамал хурдан хайх"
              >
                <div className="relative flex-1">
                  <Search
                    className="w-4 h-4 text-[#215b63]/65 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <label htmlFor="home-quick-search" className="sr-only">
                    Ургамал, мод эсвэл шинж чанараар хайх
                  </label>
                  <input
                    id="home-quick-search"
                    type="search"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Сакүра, Лотос, Хуш, Гинкго, хөвд..."
                    className="w-full h-10 pl-9 pr-3 text-sm bg-transparent text-[#215b63] placeholder:text-[#215b63]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-5 text-sm font-semibold text-white bg-[#215b63] hover:bg-[#19474d] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Хайх
                </button>
              </form>

              <div
                className="flex flex-wrap items-center justify-center gap-2"
                aria-label="Шуурхай ангиллын товчнууд"
              >
                <span className="text-xs text-[#215b63]/70">Шуурхай:</span>
                {HERO_QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => onApplyPlantFilters(topic.filters)}
                    className="px-2.5 py-1 text-xs font-medium text-[#215b63] bg-white/85 hover:bg-white border border-[#215b63]/15 hover:border-[#67c090] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Spotlight Strip */}
          <div className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-[#215b63]/12 px-5 py-3.5 sm:px-9 flex flex-wrap items-center justify-between gap-4">
            {currentSpotlight && (
              <div className="flex flex-wrap items-center gap-3 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#215b63] shrink-0">
                  <span>Онцлох ({(spotlightIndex % spotlightList.length) + 1}/{spotlightList.length})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSpotlightIndex(
                        (prev) => (prev - 1 + spotlightList.length) % spotlightList.length
                      )
                    }
                    aria-label="Өмнөх онцлох ургамал"
                    className="w-6 h-6 inline-flex items-center justify-center rounded border border-[#215b63]/25 text-[#215b63] hover:bg-[#67c090]/15 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSpotlightIndex((prev) => (prev + 1) % spotlightList.length)
                    }
                    aria-label="Дараагийн онцлох ургамал"
                    className="w-6 h-6 inline-flex items-center justify-center rounded border border-[#215b63]/25 text-[#215b63] hover:bg-[#67c090]/15 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlant(currentSpotlight)}
                  className="group text-left flex items-center gap-2 min-w-0 cursor-pointer"
                >
                  <span className="font-display text-sm font-semibold text-[#215b63] group-hover:text-[#19474d] transition-colors truncate">
                    {currentSpotlight.commonName}
                  </span>
                  <span className="text-xs text-[#215b63]/70 hidden md:inline truncate">
                    {currentSpotlight.scientificName} · {currentSpotlight.watering.bestTime}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#67c090] shrink-0" aria-hidden="true" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('plants')}
              className="text-xs font-medium text-[#215b63]/85 hover:text-[#215b63] tabular-nums transition-colors cursor-pointer ml-auto"
            >
              Нийт {totalPlantsCount} төрөл зүйл үзэх →
            </button>
          </div>
        </div>
      </section>

      {/* 2. Asymmetric Interactive Taxonomy & Interactive Plant Finder */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DCE5DF] pb-4">
          <div>
            <p className="text-xs font-medium text-[#1F7A4C] mb-1">
              Системчилсэн ангилал ба ухаалаг сонголт
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F241D]">
              Ботаникийн бүлэг ба амьдрах орчноор судлах
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Судлах горим"
              className="inline-flex rounded-lg border border-[#DCE5DF] bg-white p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={explorerMode === 'map'}
                onClick={() => setExplorerMode('map')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  explorerMode === 'map'
                    ? 'bg-[#0F241D] text-white'
                    : 'text-[#465D53] hover:text-[#0F241D]'
                }`}
              >
                Ангиллын зураглал
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={explorerMode === 'finder'}
                onClick={() => setExplorerMode('finder')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  explorerMode === 'finder'
                    ? 'bg-[#1F7A4C] text-white'
                    : 'text-[#465D53] hover:text-[#0F241D]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Тохирох ургамал олох</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('plants')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F7A4C] hover:text-[#165B38] transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Бүх {totalPlantsCount} ургамал руу</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {explorerMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5-col: Botanical Taxonomic Directory */}
            <div className="lg:col-span-5 bg-white border border-[#DCE5DF] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EDF2EE]">
                  <h3 className="font-display text-base font-bold text-[#0F241D]">
                    Ботаникийн ангилал
                  </h3>
                  <span className="font-mono text-xs text-[#6B8278] tabular-nums">
                    5 бүлэг
                  </span>
                </div>

                <div className="divide-y divide-[#EDF2EE] mt-1">
                  {BOTANICAL_NAV_ITEMS.map((item) => {
                    const count = botanyCounts.byBotanical[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => onApplyPlantFilters({ botanicalClass: item.key })}
                        className="w-full py-3.5 px-2 -mx-2 rounded-lg flex items-center justify-between gap-3 text-left hover:bg-[#F6F8F6] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="font-mono text-xs font-semibold text-[#1F7A4C] tabular-nums shrink-0">
                            {item.index}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-[#465D53] truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs font-semibold text-[#0F241D] tabular-nums">
                            {count}
                          </span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-[#6B8278] group-hover:text-[#1F7A4C] transition-colors"
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 7-col: 2x2 Ecological & Habitat Matrix */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {HABITAT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const count = botanyCounts.byHabitat[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onApplyPlantFilters({ habitat: item.key })}
                    className="bg-white border border-[#DCE5DF] hover:border-[#1F7A4C]/60 rounded-2xl p-6 text-left flex flex-col justify-between gap-4 transition-colors group cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Icon
                          className={`w-5 h-5 ${item.accentColor} shrink-0`}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-xs font-semibold text-[#465D53] tabular-nums">
                          {count} төрөл зүйл
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium text-[#0E6BA8] mt-0.5">
                          {item.condition}
                        </p>
                      </div>
                      <p className="text-xs text-[#465D53] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EDF2EE] flex items-center justify-between text-xs font-semibold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors">
                      <span>Энэ орчны ургамлууд</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            data-testid="home-plant-finder"
            className="bg-white border border-[#DCE5DF] rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-[#EDF2EE]">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#0F241D]">1. Ургуулах орчин</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ургуулах орчин">
                  {QUIZ_ENV_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={quizCriteria.environment === opt.value}
                      onClick={() =>
                        setQuizCriteria((prev) => ({ ...prev, environment: opt.value }))
                      }
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        quizCriteria.environment === opt.value
                          ? 'bg-[#0F241D] text-white border-[#0F241D]'
                          : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#0F241D]">2. Гэрэлтүүлгийн нөхцөл</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Гэрэлтүүлгийн нөхцөл">
                  {QUIZ_SUN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={quizCriteria.sunlight === opt.value}
                      onClick={() =>
                        setQuizCriteria((prev) => ({ ...prev, sunlight: opt.value }))
                      }
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        quizCriteria.sunlight === opt.value
                          ? 'bg-[#0E6BA8] text-white border-[#0E6BA8]'
                          : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#0F241D]">3. Гол зориулалт</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Гол зориулалт">
                  {QUIZ_USAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={quizCriteria.usage === opt.value}
                      onClick={() =>
                        setQuizCriteria((prev) => ({ ...prev, usage: opt.value }))
                      }
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        quizCriteria.usage === opt.value
                          ? 'bg-[#1F7A4C] text-white border-[#1F7A4C]'
                          : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#465D53] tabular-nums">
                Таны сонголтод <strong className="font-semibold text-[#0F241D]">{quizMatches.length}</strong> төрөл зүйл тохирч байна
              </p>
              {quizCriteria.usage !== 'all' && (
                <button
                  type="button"
                  onClick={() => onApplyPlantFilters({ usage: quizCriteria.usage })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F7A4C] hover:text-[#165B38] cursor-pointer"
                >
                  <span>Бүх илэрцийг сан дээр шүүж үзэх</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {quizMatches.length === 0 ? (
              <div className="py-6 text-center space-y-2 bg-[#F6F8F6] rounded-xl">
                <p className="text-sm font-semibold text-[#0F241D]">
                  Яг энэ хослолд тохирох ургамал олдсонгүй
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setQuizCriteria({ environment: 'all', sunlight: 'all', usage: 'all' })
                  }
                  className="text-xs font-semibold text-[#1F7A4C] hover:underline cursor-pointer"
                >
                  Сонголтыг анхны төлөвт оруулах
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {quizMatches.slice(0, 3).map((plant) => {
                  const isSaved = savedPlantIds.includes(plant.id);
                  return (
                    <article
                      key={plant.id}
                      className="border border-[#DCE5DF] rounded-xl overflow-hidden flex flex-col justify-between bg-[#F6F8F6]/50 hover:border-[#1F7A4C]/60 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectPlant(plant)}
                        className="text-left block w-full cursor-pointer group"
                      >
                        <div className="aspect-[16/10] bg-[#EDF2EE] overflow-hidden">
                          <SafeImage
                            src={plant.image}
                            alt={plant.imageAlt}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <p className="text-[11px] text-[#465D53]">
                            {LIFE_FORM_LABEL_MAP[plant.lifeForm]} · {HABITAT_LABEL_MAP[plant.habitat]}
                          </p>
                          <h3 className="font-display text-base font-bold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors">
                            {plant.commonName}
                          </h3>
                          <p className="text-xs text-[#465D53] line-clamp-2 leading-relaxed">
                            {plant.characteristics.summary}
                          </p>
                        </div>
                      </button>

                      <div className="px-4 pb-4 pt-2 border-t border-[#EDF2EE] flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#0E6BA8] tabular-nums truncate">
                          {plant.watering.bestTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleSavedPlant(plant.id)}
                          aria-pressed={isSaved}
                          aria-label={`Хадгалах: ${plant.commonName}`}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                            isSaved
                              ? 'bg-[#EDF2EE] border-[#1F7A4C] text-[#1F7A4C]'
                              : 'bg-white border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D]'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#1F7A4C]' : ''}`} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Featured Plants & Trees Highlights */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE5DF] pb-4">
          <div>
            <p className="text-xs font-medium text-[#1F7A4C] mb-1">
              Онцлох төрөл зүйлүүд
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F241D]">
              Дэлхийн ба Монголын ургамал, мод
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('plants')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F7A4C] hover:text-[#165B38] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Бүх ургамлын ангилал руу</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlants.map((plant) => {
            const isSaved = savedPlantIds.includes(plant.id);
            return (
              <article
                key={plant.id}
                className="bg-white border border-[#DCE5DF] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#1F7A4C]/60 transition-colors"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectPlant(plant)}
                    aria-label={`${plant.commonName} дэлгэрэнгүй зураг нээх`}
                    className="block w-full aspect-[4/3] bg-[#EDF2EE] overflow-hidden cursor-pointer group"
                  >
                    <SafeImage
                      src={plant.image}
                      alt={plant.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </button>
                  <div className="p-5 space-y-3">
                    <div className="text-xs text-[#465D53] flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApplyPlantFilters({ lifeForm: plant.lifeForm })}
                        className="hover:text-[#1F7A4C] hover:underline cursor-pointer"
                      >
                        {LIFE_FORM_LABEL_MAP[plant.lifeForm]}
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => onApplyPlantFilters({ botanicalClass: plant.botanicalClass })}
                        className="hover:text-[#1F7A4C] hover:underline cursor-pointer"
                      >
                        {BOTANICAL_LABEL_MAP[plant.botanicalClass]}
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => onApplyPlantFilters({ habitat: plant.habitat })}
                        className="hover:text-[#1F7A4C] hover:underline cursor-pointer"
                      >
                        {HABITAT_LABEL_MAP[plant.habitat]}
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => onSelectPlant(plant)}
                        className="text-left group cursor-pointer"
                      >
                        <h3 className="font-display text-lg font-semibold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors">
                          {plant.commonName}
                        </h3>
                      </button>
                      <p className="text-xs italic text-[#465D53]">{plant.scientificName}</p>
                    </div>

                    <p className="text-xs text-[#465D53] leading-relaxed line-clamp-2">
                      {plant.characteristics.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#EDF2EE] space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#0E6BA8] font-medium tabular-nums">
                    <span className="flex items-center gap-2 min-w-0 truncate">
                      <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{plant.watering.bestTime}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSavedPlant(plant.id)}
                      aria-pressed={isSaved}
                      aria-label={`Хадгалах: ${plant.commonName}`}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                        isSaved
                          ? 'bg-[#EDF2EE] border-[#1F7A4C] text-[#1F7A4C]'
                          : 'bg-[#F6F8F6] border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D]'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#1F7A4C]' : ''}`} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectPlant(plant)}
                    className="w-full py-2 px-3 text-xs font-semibold text-[#0F241D] bg-[#F6F8F6] hover:bg-[#EDF2EE] border border-[#DCE5DF] rounded-lg transition-colors cursor-pointer"
                  >
                    Арчилгаа ба шинж чанар үзэх
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Deep Forest Daily Watering Rhythm Band */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="bg-[#0F241D] text-white rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <p className="text-xs font-medium text-[#7EE0AE] mb-1">
                Өдрийн усалгааны хэмнэл
              </p>
              <h2
                className="font-display text-2xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Хэдэн цагт, ямар ургамлыг услах нь хамгийн тохиромжтой вэ?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('plants')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7EE0AE] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Бүх цагийн хуваарь</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:divide-x lg:divide-white/15">
            {wateringGroups.map((group, idx) => (
              <div
                key={group.id}
                className={`space-y-4 ${idx > 0 ? 'lg:pl-8' : ''}`}
              >
                <div className="space-y-1.5">
                  <p className="font-mono text-xs font-semibold text-[#7EE0AE] tabular-nums">
                    {group.timeRange}
                  </p>
                  <h3 className="font-display text-lg font-bold text-white">
                    {group.title}
                  </h3>
                  <p className="text-xs text-[#C8DBD1] leading-relaxed">
                    {group.guidance}
                  </p>
                </div>

                <div className="divide-y divide-white/10 pt-2 border-t border-white/15">
                  {group.plants.map((plant) => (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => onSelectPlant(plant)}
                      className="w-full py-2.5 px-2 -mx-2 rounded-lg flex items-center justify-between gap-3 text-left hover:bg-white/10 transition-colors group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {plant.commonName}
                        </p>
                        <p className="text-xs text-[#A3C4B5] tabular-nums truncate">
                          {plant.watering.bestTime}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#7EE0AE] shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Plant-Tech Solutions */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE5DF] pb-4">
          <div>
            <p className="text-xs font-medium text-[#0E6BA8] mb-1">
              Ухаалаг арчилгаа ба тоног төхөөрөмж
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F241D]">
              Ургамал хамгааллын технологийн бүтээгдэхүүн
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E6BA8] hover:text-[#0F241D] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Бүтээгдэхүүний каталог</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="bg-white border border-[#DCE5DF] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#0E6BA8]/50 transition-colors"
            >
              <div>
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  aria-label={`${product.name} дэлгэрэнгүй нээх`}
                  className="block w-full aspect-[4/3] bg-[#EDF2EE] overflow-hidden cursor-pointer group"
                >
                  <SafeImage
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                </button>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#465D53]">
                    <span>{PRODUCT_CATEGORY_LABELS[product.category]}</span>
                    <span className="text-[#1F7A4C] font-medium">{product.status}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="text-left group cursor-pointer"
                  >
                    <h3 className="font-display text-base font-semibold text-[#0F241D] group-hover:text-[#0E6BA8] transition-colors">
                      {product.name}
                    </h3>
                  </button>
                  <p className="text-xs text-[#465D53] leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[#EDF2EE] flex items-center justify-between gap-3">
                <span className="font-mono text-sm font-semibold text-[#0F241D] tabular-nums">
                  {formatMnt(product.priceMnt)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="px-3 py-1.5 text-xs font-medium text-[#465D53] hover:text-[#0F241D] border border-[#DCE5DF] rounded-lg transition-colors cursor-pointer"
                  >
                    Үзэх
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    aria-label={`Сагсанд нэмэх: ${product.name}`}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Sprout className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Сагсанд</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
