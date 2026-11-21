import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { PRODUCT_CATEGORY_LABELS } from '../data/products';
import type { PlantItem, ProductItem } from '../types/botany';
import { formatMnt } from '../utils/catalogLogic';
import { SafeImage } from './SafeImage';

interface ProductDetailModalProps {
  product: ProductItem | null;
  compatiblePlants: PlantItem[];
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity?: number) => void;
  onSelectPlant: (plant: PlantItem) => void;
}

export function ProductDetailModal({
  product,
  compatiblePlants,
  onClose,
  onAddToCart,
  onSelectPlant,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const lineTotal = product.priceMnt * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F241D]/45 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="bg-white border border-[#DCE5DF] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#DCE5DF] px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[#465D53]">
              {PRODUCT_CATEGORY_LABELS[product.category]} · {product.status}
            </p>
            <h2
              id="product-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-[#0F241D] mt-0.5"
            >
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Бүтээгдэхүүний цонх хаах"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] hover:bg-[#F6F8F6] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-6 aspect-[4/3] rounded-xl overflow-hidden bg-[#EDF2EE]">
              <SafeImage
                src={product.image}
                alt={product.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-6 space-y-4">
              <p className="text-sm font-medium text-[#0E6BA8]">{product.subtitle}</p>
              <p className="text-sm text-[#465D53] leading-relaxed">{product.description}</p>

              <div className="pt-3 border-t border-[#EDF2EE] space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#6B8278] block">Нийт дүн</span>
                    <span
                      data-testid="product-modal-total"
                      className="font-mono text-xl font-bold text-[#0F241D] tabular-nums"
                    >
                      {formatMnt(lineTotal)}
                    </span>
                  </div>

                  {/* Interactive Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Тоо ширхэг хасах"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#0F241D] hover:bg-[#F6F8F6] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span
                      data-testid="product-modal-qty"
                      className="font-mono text-sm font-semibold w-8 text-center tabular-nums"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      aria-label="Тоо ширхэг нэмэх"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#0F241D] hover:bg-[#F6F8F6] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span>Сагсанд нэмэх ({quantity} ш)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#DCE5DF]">
            <div className="space-y-2.5">
              <h3 className="font-display text-sm font-semibold text-[#0F241D]">
                Гол давуу тал
              </h3>
              <ul className="space-y-2 text-xs text-[#465D53]">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-4 h-4 text-[#1F7A4C] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-display text-sm font-semibold text-[#0F241D]">
                Техникийн үзүүлэлт
              </h3>
              <dl className="divide-y divide-[#EDF2EE] border border-[#DCE5DF] rounded-xl bg-[#F6F8F6] px-4 text-xs">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="py-2.5 flex items-baseline justify-between gap-3">
                    <dt className="text-[#465D53] shrink-0">{spec.label}</dt>
                    <dd className="text-[#0F241D] font-medium text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Compatible Plants Cross-Navigation */}
          {compatiblePlants.length > 0 && (
            <div className="pt-4 border-t border-[#DCE5DF] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-[#0F241D]">
                  Энэ бүтээгдэхүүнд тохирох ургамлууд ({compatiblePlants.length})
                </h3>
                <span className="text-xs text-[#6B8278]">Дарж арчилгааг үзэх</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compatiblePlants.slice(0, 4).map((plant) => (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectPlant(plant);
                    }}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[#DCE5DF] hover:border-[#1F7A4C]/60 bg-[#F6F8F6] hover:bg-white transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#EDF2EE] shrink-0">
                        <SafeImage
                          src={plant.image}
                          alt={plant.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0F241D] group-hover:text-[#1F7A4C] truncate">
                          {plant.commonName}
                        </p>
                        <p className="text-[11px] text-[#465D53] truncate">
                          {plant.watering.bestTime}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-[#6B8278] group-hover:text-[#1F7A4C] shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
