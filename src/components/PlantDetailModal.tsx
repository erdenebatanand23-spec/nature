import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CloudSun,
  Columns2,
  Droplets,
  Layers,
  SlidersHorizontal,
  Sprout,
  Target,
  X,
} from 'lucide-react';
import {
  BOTANICAL_LABEL_MAP,
  HABITAT_LABEL_MAP,
  LIFE_FORM_LABEL_MAP,
  USAGE_LABEL_MAP,
} from '../data/plants';
import type { PlantFilterState, PlantItem, ProductItem } from '../types/botany';
import {
  calculateAdjustedCareAdvice,
  formatMnt,
  type GrowEnvironment,
  type SeasonType,
} from '../utils/catalogLogic';
import { SafeImage } from './SafeImage';

interface PlantDetailModalProps {
  plant: PlantItem | null;
  recommendedProducts: ProductItem[];
  isSaved: boolean;
  isWateredToday: boolean;
  isCompared: boolean;
  canCompareMore: boolean;
  prevPlant: PlantItem | null;
  nextPlant: PlantItem | null;
  onClose: () => void;
  onSelectPlant: (plant: PlantItem) => void;
  onToggleSaved: (plantId: string) => void;
  onToggleWateredToday: (plantId: string) => void;
  onToggleCompare: (plantId: string) => void;
  onApplyFilterAndClose: (partial: Partial<PlantFilterState>) => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

const SEASON_OPTIONS: Array<{ value: SeasonType; label: string }> = [
  { value: 'summer', label: 'Зун' },
  { value: 'spring_autumn', label: 'Хавар · Намар' },
  { value: 'winter', label: 'Өвөл' },
];

const ENV_OPTIONS: Array<{ value: GrowEnvironment; label: string }> = [
  { value: 'indoor', label: 'Тасалгаа' },
  { value: 'greenhouse', label: 'Хүлэмж' },
  { value: 'outdoor', label: 'Гадаа' },
];

export function PlantDetailModal({
  plant,
  recommendedProducts,
  isSaved,
  isWateredToday,
  isCompared,
  canCompareMore,
  prevPlant,
  nextPlant,
  onClose,
  onSelectPlant,
  onToggleSaved,
  onToggleWateredToday,
  onToggleCompare,
  onApplyFilterAndClose,
  onSelectProduct,
  onAddToCart,
}: PlantDetailModalProps) {
  const [season, setSeason] = useState<SeasonType>('summer');
  const [environment, setEnvironment] = useState<GrowEnvironment>('indoor');

  useEffect(() => {
    if (!plant) return;
    if (plant.lifeForm === 'tree' || plant.habitat === 'halophyte') {
      setEnvironment('outdoor');
    } else if (plant.botanicalClass === 'bryophyte') {
      setEnvironment('greenhouse');
    } else {
      setEnvironment('indoor');
    }
  }, [plant?.id]);

  useEffect(() => {
    if (!plant) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevPlant) onSelectPlant(prevPlant);
      if (e.key === 'ArrowRight' && nextPlant) onSelectPlant(nextPlant);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [plant, prevPlant, nextPlant, onClose, onSelectPlant]);

  const careAdvice = useMemo(() => {
    if (!plant) return null;
    return calculateAdjustedCareAdvice(plant, season, environment);
  }, [plant, season, environment]);

  if (!plant || !careAdvice) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F241D]/45 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plant-modal-title"
    >
      <div
        className="bg-white border border-[#DCE5DF] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Clickable Taxonomy & Interactive Actions */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#DCE5DF] px-6 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-[#465D53] flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onApplyFilterAndClose({ botanicalClass: plant.botanicalClass })}
                className="hover:text-[#1F7A4C] hover:underline transition-colors cursor-pointer"
              >
                {BOTANICAL_LABEL_MAP[plant.botanicalClass]}
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onApplyFilterAndClose({ lifeForm: plant.lifeForm })}
                className="hover:text-[#1F7A4C] hover:underline transition-colors cursor-pointer"
              >
                {LIFE_FORM_LABEL_MAP[plant.lifeForm]}
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onApplyFilterAndClose({ habitat: plant.habitat })}
                className="hover:text-[#1F7A4C] hover:underline transition-colors cursor-pointer"
              >
                {HABITAT_LABEL_MAP[plant.habitat]}
              </button>
            </div>
            <h2
              id="plant-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-[#0F241D] mt-0.5"
            >
              {plant.commonName}
            </h2>
            <p className="text-xs italic text-[#465D53]">
              {plant.scientificName} — {plant.familyName} · {plant.origin}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {prevPlant && (
              <button
                type="button"
                onClick={() => onSelectPlant(prevPlant)}
                aria-label={`Өмнөх ургамал: ${prevPlant.commonName}`}
                title={`Өмнөх: ${prevPlant.commonName}`}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {nextPlant && (
              <button
                type="button"
                onClick={() => onSelectPlant(nextPlant)}
                aria-label={`Дараагийн ургамал: ${nextPlant.commonName}`}
                title={`Дараагийн: ${nextPlant.commonName}`}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleSaved(plant.id)}
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Хадгалснаас хасах' : 'Ургамлыг хадгалах'}
              className={`h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                isSaved
                  ? 'bg-[#EDF2EE] border-[#1F7A4C] text-[#1F7A4C]'
                  : 'bg-white border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#1F7A4C]' : ''}`} aria-hidden="true" />
              <span>{isSaved ? 'Хадгалсан' : 'Хадгалах'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(plant.id)}
              disabled={!isCompared && !canCompareMore}
              aria-pressed={isCompared}
              aria-label={isCompared ? 'Харьцуулалтаас хасах' : 'Харьцуулалтад нэмэх'}
              className={`h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap ${
                isCompared
                  ? 'bg-[#0E6BA8] border-[#0E6BA8] text-white cursor-pointer'
                  : !canCompareMore
                    ? 'bg-[#F6F8F6] border-[#DCE5DF] text-[#9EB0A7] cursor-not-allowed'
                    : 'bg-white border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6] cursor-pointer'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isCompared ? 'Сонгосон' : 'Харьцуулах'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Цонх хаах"
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-[#EDF2EE]">
              <SafeImage
                src={plant.image}
                alt={plant.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#F6F8F6] border border-[#DCE5DF] rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0E6BA8]">
                    <Droplets className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Услах цаг ба усалгааны горим</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleWateredToday(plant.id)}
                    aria-pressed={isWateredToday}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      isWateredToday
                        ? 'bg-[#1F7A4C] border-[#1F7A4C] text-white'
                        : 'bg-white border-[#DCE5DF] text-[#0F241D] hover:border-[#1F7A4C]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isWateredToday ? 'Өнөөдөр усалсан' : 'Өнөөдөр усалсан тэмдэглэх'}</span>
                  </button>
                </div>

                <p className="text-sm font-semibold text-[#0F241D] tabular-nums flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0E6BA8] shrink-0" aria-hidden="true" />
                  <span>{plant.watering.bestTime}</span>
                </p>
                <dl className="text-xs space-y-1.5 pt-1 text-[#465D53]">
                  <div>
                    <dt className="inline font-semibold text-[#0F241D]">Давтамж: </dt>
                    <dd className="inline">{plant.watering.frequency}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-[#0F241D]">Хэмжээ: </dt>
                    <dd className="inline">{plant.watering.amount}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-[#0F241D]">Зөвлөмж: </dt>
                    <dd className="inline">{plant.watering.tips}</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F241D]">
                  <Target className="w-4 h-4 text-[#1F7A4C] shrink-0" aria-hidden="true" />
                  <span>Гол үүрэг зориулалт</span>
                </div>
                <p className="text-sm text-[#465D53] leading-relaxed">{plant.primaryPurpose}</p>
                <div className="text-xs text-[#6B8278] flex flex-wrap items-center gap-1.5">
                  <span>Хэрэглээ:</span>
                  {plant.usages.map((u, idx) => (
                    <span key={u} className="inline-flex items-center gap-1.5">
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <button
                        type="button"
                        onClick={() => onApplyFilterAndClose({ usage: u })}
                        className="hover:text-[#1F7A4C] hover:underline cursor-pointer"
                      >
                        {USAGE_LABEL_MAP[u]}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Season & Environment Care Calculator */}
          <div className="border-t border-[#DCE5DF] pt-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-semibold text-[#0F241D] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0E6BA8]" aria-hidden="true" />
                  <span>Улирал ба орчны арчилгааны тооцоолуур</span>
                </h3>
                <p className="text-xs text-[#465D53] mt-0.5">
                  Ургуулж буй орчин болон улирлаа сонгон усалгаа, гэрэлтүүлгийн тохиргоог шалгана уу.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div role="group" aria-label="Улирал сонгох" className="inline-flex rounded-lg border border-[#DCE5DF] bg-[#F6F8F6] p-0.5">
                  {SEASON_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={season === opt.value}
                      onClick={() => setSeason(opt.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        season === opt.value
                          ? 'bg-[#0F241D] text-white'
                          : 'text-[#465D53] hover:text-[#0F241D]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div role="group" aria-label="Ургуулах орчин сонгох" className="inline-flex rounded-lg border border-[#DCE5DF] bg-[#F6F8F6] p-0.5">
                  {ENV_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={environment === opt.value}
                      onClick={() => setEnvironment(opt.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        environment === opt.value
                          ? 'bg-[#0E6BA8] text-white'
                          : 'text-[#465D53] hover:text-[#0F241D]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              data-testid="care-calculator-output"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#F6F8F6] border border-[#DCE5DF] rounded-xl p-4"
            >
              <div className="space-y-1">
                <p className="font-semibold text-[#0E6BA8]">Усалгааны горим</p>
                <p className="text-[#0F241D] font-medium leading-relaxed">{careAdvice.wateringAdjustment}</p>
                <p className="text-[#465D53] leading-relaxed">{careAdvice.frequencyNote}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#1F7A4C]">Гэрэлтүүлгийн зөвлөмж</p>
                <p className="text-[#465D53] leading-relaxed">{careAdvice.lightNote}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#164432]">Уур амьсгал ба хамгаалалт</p>
                <p className="text-[#465D53] leading-relaxed">{careAdvice.climateNote}</p>
              </div>
            </div>
          </div>

          {/* Characteristics Grid */}
          <div className="border-t border-[#DCE5DF] pt-5 space-y-4">
            <h3 className="font-display text-base font-semibold text-[#0F241D]">
              Шинж чанар ба ургах орчны шаардлага
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F6F8F6] border border-[#DCE5DF] space-y-1">
                <p className="font-semibold text-[#0F241D] flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-[#1F7A4C]" aria-hidden="true" />
                  <span>Гэрэл ба уур амьсгал</span>
                </p>
                <p className="text-[#465D53] leading-relaxed">{plant.characteristics.sunlight}</p>
                <p className="text-[#465D53] leading-relaxed">{plant.characteristics.climate}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F8F6] border border-[#DCE5DF] space-y-1">
                <p className="font-semibold text-[#0F241D] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0E6BA8]" aria-hidden="true" />
                  <span>Хөрс ба биологийн онцлог</span>
                </p>
                <p className="text-[#465D53] leading-relaxed">{plant.characteristics.soil}</p>
                <p className="text-[#465D53] leading-relaxed">{plant.characteristics.growthTraits}</p>
              </div>
            </div>
          </div>

          {/* Recommended Care Products */}
          {recommendedProducts.length > 0 && (
            <div className="border-t border-[#DCE5DF] pt-5 space-y-3">
              <h3 className="font-display text-base font-semibold text-[#0F241D]">
                Тохирох арчилгааны бүтээгдэхүүн
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#DCE5DF] bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F241D] truncate">
                        {product.name}
                      </p>
                      <p className="font-mono text-xs text-[#465D53] tabular-nums">
                        {formatMnt(product.priceMnt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium text-[#0F241D] border border-[#DCE5DF] rounded-lg hover:bg-[#F6F8F6] cursor-pointer"
                      >
                        Үзэх
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg cursor-pointer"
                      >
                        <Sprout className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Авах</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
