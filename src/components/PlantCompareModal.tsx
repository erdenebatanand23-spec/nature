import { useEffect } from 'react';
import { ArrowRight, Columns2, Trash2, X } from 'lucide-react';
import {
  BOTANICAL_LABEL_MAP,
  HABITAT_LABEL_MAP,
  LIFE_FORM_LABEL_MAP,
  USAGE_LABEL_MAP,
} from '../data/plants';
import type { PlantItem } from '../types/botany';
import { SafeImage } from './SafeImage';

interface PlantCompareModalProps {
  isOpen: boolean;
  plants: PlantItem[];
  onClose: () => void;
  onRemovePlant: (plantId: string) => void;
  onClearAll: () => void;
  onSelectPlant: (plant: PlantItem) => void;
}

export function PlantCompareModal({
  isOpen,
  plants,
  onClose,
  onRemovePlant,
  onClearAll,
  onSelectPlant,
}: PlantCompareModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rows: Array<{ label: string; render: (plant: PlantItem) => string }> = [
    { label: 'Латин нэр', render: (p) => `${p.scientificName} (${p.familyName})` },
    { label: 'Гарал үүсэл', render: (p) => p.origin },
    { label: 'Ботаникийн ангилал', render: (p) => BOTANICAL_LABEL_MAP[p.botanicalClass] },
    { label: 'Амьдралын хэлбэр', render: (p) => LIFE_FORM_LABEL_MAP[p.lifeForm] },
    { label: 'Амьдрах орчин', render: (p) => HABITAT_LABEL_MAP[p.habitat] },
    { label: 'Гэрлийн шаардлага', render: (p) => p.characteristics.sunlight },
    { label: 'Хөрсний төрөл', render: (p) => p.characteristics.soil },
    { label: 'Уур амьсгал', render: (p) => p.characteristics.climate },
    { label: 'Услах цаг', render: (p) => p.watering.bestTime },
    { label: 'Усалгааны давтамж', render: (p) => p.watering.frequency },
    { label: 'Усны хэмжээ', render: (p) => p.watering.amount },
    { label: 'Хэрэглээ', render: (p) => p.usages.map((u) => USAGE_LABEL_MAP[u]).join(', ') },
    { label: 'Гол үүрэг зориулалт', render: (p) => p.primaryPurpose },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F241D]/45 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        className="bg-white border border-[#DCE5DF] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#DCE5DF] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Columns2 className="w-5 h-5 text-[#1F7A4C]" aria-hidden="true" />
            <div>
              <h2
                id="compare-modal-title"
                className="font-display text-lg sm:text-xl font-bold text-[#0F241D]"
              >
                Ургамал харьцуулах хүснэгт ({plants.length}/3)
              </h2>
              <p className="text-xs text-[#465D53]">
                Амьдрах орчин, гэрэл, услах цаг болон шинж чанарыг зэрэгцүүлэн харна уу.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {plants.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-medium text-[#465D53] hover:text-rose-700 border border-[#DCE5DF] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Бүгдийг цэвэрлэх
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Харьцуулалтын цонх хаах"
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {plants.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-display text-base font-semibold text-[#0F241D]">
                Харьцуулах ургамал сонгогдоогүй байна
              </p>
              <p className="text-xs text-[#465D53]">
                Ургамлын карт дээрх "Харьцуулах" товчийг дарж 3 хүртэлх төрөл зүйлийг сонгоно уу.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCE5DF]">
                    <th className="py-3 pr-4 w-44 align-bottom font-semibold text-[#6B8278]">
                      Үзүүлэлт
                    </th>
                    {plants.map((plant) => (
                      <th key={plant.id} className="pb-4 px-3 min-w-[210px] align-top">
                        <div className="space-y-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectPlant(plant);
                            }}
                            className="block w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#EDF2EE] cursor-pointer group"
                          >
                            <SafeImage
                              src={plant.image}
                              alt={plant.imageAlt}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                            />
                          </button>
                          <div className="flex items-start justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectPlant(plant);
                              }}
                              className="text-left font-display text-sm font-bold text-[#0F241D] hover:text-[#1F7A4C] transition-colors cursor-pointer"
                            >
                              {plant.commonName}
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemovePlant(plant.id)}
                              aria-label={`${plant.commonName} харьцуулалтаас хасах`}
                              className="text-[#6B8278] hover:text-rose-600 p-1 rounded cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF2EE]">
                  {rows.map((row) => (
                    <tr key={row.label} className="hover:bg-[#F6F8F6]/70">
                      <th scope="row" className="py-3 pr-4 font-semibold text-[#0F241D] align-top">
                        {row.label}
                      </th>
                      {plants.map((plant) => (
                        <td key={plant.id} className="py-3 px-3 text-[#465D53] leading-relaxed align-top">
                          {row.render(plant)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 pr-4" />
                    {plants.map((plant) => (
                      <td key={plant.id} className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectPlant(plant);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F7A4C] hover:text-[#165B38] cursor-pointer"
                        >
                          <span>Дэлгэрэнгүй нээх</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
