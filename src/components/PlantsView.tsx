import {
  Bookmark,
  CheckCircle2,
  Clock,
  Columns2,
  Droplets,
  RotateCcw,
  Search,
  Sun,
  Target,
} from 'lucide-react';
import {
  BOTANICAL_CLASS_OPTIONS,
  BOTANICAL_LABEL_MAP,
  HABITAT_LABEL_MAP,
  HABITAT_OPTIONS,
  LIFE_FORM_LABEL_MAP,
  LIFE_FORM_OPTIONS,
  USAGE_LABEL_MAP,
  USAGE_OPTIONS,
} from '../data/plants';
import type { PlantFilterState, PlantItem } from '../types/botany';
import {
  applyPlantDisplayOrder,
  countActivePlantFilters,
  type PlantSortOrder,
} from '../utils/catalogLogic';
import { BotanicalCornerAccent } from './BotanicalVisuals';
import { SafeImage } from './SafeImage';

interface PlantsViewProps {
  plants: PlantItem[];
  totalCount: number;
  filters: PlantFilterState;
  savedPlantIds: string[];
  wateredPlantIds: string[];
  comparePlants: PlantItem[];
  isAnyModalOpen: boolean;
  sortOrder: PlantSortOrder;
  showSavedOnly: boolean;
  onChangeFilters: (next: PlantFilterState) => void;
  onResetFilters: () => void;
  onChangeSortOrder: (order: PlantSortOrder) => void;
  onToggleShowSavedOnly: () => void;
  onSelectPlant: (plant: PlantItem) => void;
  onToggleSavedPlant: (plantId: string) => void;
  onToggleWateredToday: (plantId: string) => void;
  onToggleComparePlant: (plantId: string) => void;
  onOpenCompare: () => void;
  onClearCompare: () => void;
}

const SORT_OPTIONS: Array<{ value: PlantSortOrder; label: string }> = [
  { value: 'variety', label: 'Төрөл зүйл' },
  { value: 'alpha', label: 'А–Я' },
  { value: 'saved_first', label: 'Хадгалсан эхэнд' },
];

export function PlantsView({
  plants,
  totalCount,
  filters,
  savedPlantIds,
  wateredPlantIds,
  comparePlants,
  isAnyModalOpen,
  sortOrder,
  showSavedOnly,
  onChangeFilters,
  onResetFilters,
  onChangeSortOrder,
  onToggleShowSavedOnly,
  onSelectPlant,
  onToggleSavedPlant,
  onToggleWateredToday,
  onToggleComparePlant,
  onOpenCompare,
  onClearCompare,
}: PlantsViewProps) {
  const activeFilterCount = countActivePlantFilters(filters);
  const displayedPlants = applyPlantDisplayOrder(
    plants,
    sortOrder,
    savedPlantIds,
    showSavedOnly
  );
  const compareIds = comparePlants.map((p) => p.id);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-8 pb-20">
      {/* Section Header */}
      <div className="relative overflow-hidden bg-white border border-[#DCE5DF] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <BotanicalCornerAccent className="pointer-events-none absolute -top-6 right-0 w-56 h-40 opacity-30 hidden md:block" />
        <div className="space-y-2 max-w-2xl relative z-10">
          <p className="text-xs font-medium text-[#1F7A4C]">
            Системчилсэн ботаникийн сан
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F241D]">
            Ургамлын мэдээлэл ба 4 төрлийн ангилал
          </h1>
          <p className="text-sm text-[#465D53] leading-relaxed">
            Ургамал, модыг ботаникийн ангилал, амьдралын хэлбэр, экологийн амьдрах орчин болон
            хэрэглээний зориулалтаар шүүж, хадгалах, усалгаа тэмдэглэх болон харьцуулан судлах боломжтой.
          </p>
        </div>

        {/* Search Input + Active Counter */}
        <div className="w-full lg:w-96 space-y-2 relative z-10">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#465D53] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="plants-search-input" className="sr-only">
              Ургамлын нэр, шинжлэх ухааны нэрээр хайх
            </label>
            <input
              id="plants-search-input"
              type="search"
              value={filters.query}
              onChange={(e) => onChangeFilters({ ...filters, query: e.target.value })}
              placeholder="Нэр, латин нэр эсвэл зориулалтаар хайх..."
              className="w-full h-11 pl-10 pr-4 text-sm bg-[#F6F8F6] border border-[#DCE5DF] rounded-lg text-[#0F241D] placeholder:text-[#6B8278] focus:outline-none focus:border-[#1F7A4C] focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#465D53] tabular-nums">
            <span>
              Нийт <strong className="font-semibold text-[#0F241D]">{displayedPlants.length}</strong> /{' '}
              {totalCount} ургамал харагдаж байна
            </span>
            {(activeFilterCount > 0 || showSavedOnly) && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-[#0E6BA8] hover:text-[#0F241D] font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Цэвэрлэх ({activeFilterCount + (showSavedOnly ? 1 : 0)})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4-Axis Classification Filters */}
      <section
        aria-label="Ургамлын ангиллын шүүлтүүрүүд"
        className="bg-white border border-[#DCE5DF] rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Axis 1: Botanical / Taxonomic */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-semibold text-[#0F241D]">
            01. Ботаникийн ангилал
          </h2>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ботаникийн ангилал">
            {BOTANICAL_CLASS_OPTIONS.map((opt) => {
              const active = filters.botanicalClass === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeFilters({ ...filters, botanicalClass: opt.value })}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#0F241D] text-white border-[#0F241D]'
                      : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D] hover:border-[#1F7A4C]/50'
                  }`}
                >
                  {opt.shortLabel || opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Axis 2: Life Form & Growth Habit */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-semibold text-[#0F241D]">
            02. Амьдралын хэлбэр ба ургалтын төрөл
          </h2>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Амьдралын хэлбэр ба ургалтын төрөл"
          >
            {LIFE_FORM_OPTIONS.map((opt) => {
              const active = filters.lifeForm === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeFilters({ ...filters, lifeForm: opt.value })}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#0F241D] text-white border-[#0F241D]'
                      : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D] hover:border-[#1F7A4C]/50'
                  }`}
                >
                  {opt.shortLabel || opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Axis 3: Ecological & Habitat */}
        <div className="space-y-2.5 pt-2 border-t border-[#EDF2EE]">
          <h2 className="text-xs font-semibold text-[#0F241D]">
            03. Экологи ба амьдрах орчны ангилал
          </h2>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Экологи ба амьдрах орчны ангилал"
          >
            {HABITAT_OPTIONS.map((opt) => {
              const active = filters.habitat === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeFilters({ ...filters, habitat: opt.value })}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#0F241D] text-white border-[#0F241D]'
                      : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D] hover:border-[#1F7A4C]/50'
                  }`}
                >
                  {opt.shortLabel || opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Axis 4: Functional & Usage */}
        <div className="space-y-2.5 pt-2 border-t border-[#EDF2EE]">
          <h2 className="text-xs font-semibold text-[#0F241D]">
            04. Хэрэглээ ба зориулалтын ангилал
          </h2>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Хэрэглээ ба зориулалтын ангилал"
          >
            {USAGE_OPTIONS.map((opt) => {
              const active = filters.usage === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeFilters({ ...filters, usage: opt.value })}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#0F241D] text-white border-[#0F241D]'
                      : 'bg-[#F6F8F6] text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D] hover:border-[#1F7A4C]/50'
                  }`}
                >
                  {opt.shortLabel || opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Workspace Bar: Saved Toggle, Watered Log Counter, Sort & Compare */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#DCE5DF] rounded-xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleShowSavedOnly}
            aria-pressed={showSavedOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              showSavedOnly
                ? 'bg-[#1F7A4C] text-white border-[#1F7A4C]'
                : 'bg-[#F6F8F6] text-[#0F241D] border-[#DCE5DF] hover:border-[#1F7A4C]/60'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-white' : ''}`} aria-hidden="true" />
            <span>Хадгалсан ({savedPlantIds.length})</span>
          </button>

          <span className="text-xs text-[#465D53] tabular-nums inline-flex items-center gap-1.5 pl-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4C]" aria-hidden="true" />
            <span>Өнөөдөр усалсан: <strong className="text-[#0F241D]">{wateredPlantIds.length}</strong></span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {comparePlants.length > 0 && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0E6BA8] hover:bg-[#0A5382] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Харьцуулах ({comparePlants.length}/3)</span>
            </button>
          )}

          <div role="group" aria-label="Ургамал эрэмбэлэх" className="inline-flex items-center rounded-lg border border-[#DCE5DF] bg-[#F6F8F6] p-0.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={sortOrder === opt.value}
                onClick={() => onChangeSortOrder(opt.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  sortOrder === opt.value
                    ? 'bg-[#0F241D] text-white'
                    : 'text-[#465D53] hover:text-[#0F241D]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plant Cards Grid or Empty State */}
      {displayedPlants.length === 0 ? (
        <div className="bg-white border border-[#DCE5DF] rounded-2xl p-12 text-center space-y-4">
          <p className="font-display text-lg font-semibold text-[#0F241D]">
            {showSavedOnly && savedPlantIds.length === 0
              ? 'Одоогоор хадгалсан ургамал алга байна'
              : 'Сонгосон шүүлтүүрт тохирох ургамал олдсонгүй'}
          </p>
          <p className="text-sm text-[#465D53] max-w-md mx-auto">
            {showSavedOnly && savedPlantIds.length === 0
              ? 'Ургамлын карт дээрх хадгалах товчийг дарж өөрийн цуглуулгад нэмнэ үү.'
              : 'Хайлтын үг эсвэл ангиллын шүүлтүүрүүдийг өөрчлөн дахин оролдоно уу.'}
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Бүх шүүлтүүрийг цэвэрлэх</span>
          </button>
        </div>
      ) : (
        <div
          data-testid="plants-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedPlants.map((plant) => {
            const isSaved = savedPlantIds.includes(plant.id);
            const isWatered = wateredPlantIds.includes(plant.id);
            const isCompared = compareIds.includes(plant.id);
            const canCompareMore = compareIds.length < 3;

            return (
              <article
                key={plant.id}
                className="bg-white border border-[#DCE5DF] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#1F7A4C]/60 transition-colors"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectPlant(plant)}
                    aria-label={`${plant.commonName} дэлгэрэнгүй зураг үзэх`}
                    className="block w-full aspect-[4/3] bg-[#EDF2EE] overflow-hidden cursor-pointer group"
                  >
                    <SafeImage
                      src={plant.image}
                      alt={plant.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </button>

                  <div className="p-5 space-y-4">
                    {/* Clickable Unboxed Classification Metadata */}
                    <div className="text-xs text-[#465D53] leading-relaxed flex flex-wrap items-center gap-x-1">
                      <button
                        type="button"
                        onClick={() =>
                          onChangeFilters({ ...filters, botanicalClass: plant.botanicalClass })
                        }
                        className="hover:text-[#1F7A4C] hover:underline transition-colors cursor-pointer"
                      >
                        {BOTANICAL_LABEL_MAP[plant.botanicalClass]}
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => onChangeFilters({ ...filters, lifeForm: plant.lifeForm })}
                        className="hover:text-[#1F7A4C] hover:underline transition-colors cursor-pointer"
                      >
                        {LIFE_FORM_LABEL_MAP[plant.lifeForm]}
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => onChangeFilters({ ...filters, habitat: plant.habitat })}
                        className="hover:text-[#1F7A4C] hover:underline transition-colors cursor-pointer"
                      >
                        {HABITAT_LABEL_MAP[plant.habitat]}
                      </button>
                    </div>

                    {/* Common + Scientific Name */}
                    <div>
                      <button
                        type="button"
                        onClick={() => onSelectPlant(plant)}
                        className="text-left group cursor-pointer"
                      >
                        <h3 className="font-display text-xl font-bold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors">
                          {plant.commonName}
                        </h3>
                      </button>
                      <p className="text-xs italic text-[#465D53] mt-0.5">
                        {plant.scientificName} · {plant.familyName}
                      </p>
                    </div>

                    {/* Structured Characteristics, Watering, Purpose */}
                    <div className="space-y-3 pt-2 border-t border-[#EDF2EE] text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-[#0F241D]">
                          <Sun className="w-3.5 h-3.5 text-[#1F7A4C] shrink-0" aria-hidden="true" />
                          <span>Ямар шинж чанартай</span>
                        </div>
                        <p className="text-[#465D53] leading-relaxed">
                          {plant.characteristics.summary}
                        </p>
                        <p className="text-[11px] text-[#465D53] leading-snug">
                          <span className="font-medium text-[#0F241D]">Гэрэл:</span>{' '}
                          {plant.characteristics.sunlight} ·{' '}
                          <span className="font-medium text-[#0F241D]">Хөрс:</span>{' '}
                          {plant.characteristics.soil}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-[#0F241D]">
                          <Droplets
                            className="w-3.5 h-3.5 text-[#0E6BA8] shrink-0"
                            aria-hidden="true"
                          />
                          <span>Хэдэн цагт услах</span>
                        </div>
                        <p className="text-[#0E6BA8] font-medium tabular-nums flex items-center gap-1.5">
                          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span>{plant.watering.bestTime}</span>
                        </p>
                        <p className="text-[#465D53] leading-relaxed">
                          {plant.watering.frequency} · {plant.watering.amount}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-[#0F241D]">
                          <Target
                            className="w-3.5 h-3.5 text-[#164432] shrink-0"
                            aria-hidden="true"
                          />
                          <span>Гол үүрэг зориулалт</span>
                        </div>
                        <p className="text-[#465D53] leading-relaxed">{plant.primaryPurpose}</p>
                        <p className="text-[11px] text-[#6B8278] pt-0.5">
                          Зориулалт: {plant.usages.map((u) => USAGE_LABEL_MAP[u]).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Interactive Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-[#EDF2EE] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleSavedPlant(plant.id)}
                      aria-pressed={isSaved}
                      aria-label={`Хадгалах: ${plant.commonName}`}
                      title={isSaved ? 'Хадгалснаас хасах' : 'Хадгалах'}
                      className={`w-8 h-8 inline-flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#EDF2EE] border-[#1F7A4C] text-[#1F7A4C]'
                          : 'bg-[#F6F8F6] border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D]'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#1F7A4C]' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWateredToday(plant.id)}
                      aria-pressed={isWatered}
                      aria-label={`Усалсан тэмдэглэх: ${plant.commonName}`}
                      title={isWatered ? 'Өнөөдөр усалсан' : 'Өнөөдөр усалсан гэж тэмдэглэх'}
                      className={`h-8 px-2.5 inline-flex items-center gap-1 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        isWatered
                          ? 'bg-[#1F7A4C] border-[#1F7A4C] text-white'
                          : 'bg-[#F6F8F6] border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{isWatered ? 'Усалсан' : 'Услах'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleComparePlant(plant.id)}
                      disabled={!isCompared && !canCompareMore}
                      aria-pressed={isCompared}
                      aria-label={`Харьцуулах: ${plant.commonName}`}
                      title={isCompared ? 'Харьцуулалтаас хасах' : 'Харьцуулалтад нэмэх'}
                      className={`w-8 h-8 inline-flex items-center justify-center rounded-lg border transition-colors ${
                        isCompared
                          ? 'bg-[#0E6BA8] border-[#0E6BA8] text-white cursor-pointer'
                          : !canCompareMore
                            ? 'bg-[#F6F8F6] border-[#DCE5DF] text-[#9EB0A7] cursor-not-allowed'
                            : 'bg-[#F6F8F6] border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] cursor-pointer'
                      }`}
                    >
                      <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPlant(plant)}
                    aria-label={`Дэлгэрэнгүй: ${plant.commonName}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F241D] hover:bg-[#164432] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Дэлгэрэнгүй</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Compact Sticky Bottom Comparison Bar */}
      {comparePlants.length > 0 && !isAnyModalOpen && (
        <div
          data-testid="compare-sticky-bar"
          className="fixed bottom-4 inset-x-4 z-40 max-w-[960px] mx-auto bg-[#0F241D] text-white border border-white/15 rounded-xl px-4 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Columns2 className="w-4 h-4 text-[#7EE0AE] shrink-0" aria-hidden="true" />
            <span className="text-xs font-medium truncate">
              Харьцуулалт ({comparePlants.length}/3):{' '}
              <strong className="text-white">
                {comparePlants.map((p) => p.commonName).join(', ')}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClearCompare}
              className="px-2.5 py-1.5 text-xs font-medium text-[#C8DBD1] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Цэвэрлэх
            </button>
            <button
              type="button"
              onClick={onOpenCompare}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#0F241D] bg-[#7EE0AE] hover:bg-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Зэрэгцүүлж харах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
