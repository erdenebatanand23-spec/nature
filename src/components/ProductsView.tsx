import { ArrowUpDown, Check, RotateCcw, Search, ShoppingBag } from 'lucide-react';
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_OPTIONS } from '../data/products';
import type { ProductCategory, ProductItem } from '../types/botany';
import { formatMnt, type ProductSortOrder } from '../utils/catalogLogic';
import { BotanicalCornerAccent } from './BotanicalVisuals';
import { SafeImage } from './SafeImage';

interface ProductsViewProps {
  products: ProductItem[];
  totalCount: number;
  category: ProductCategory;
  query: string;
  sortOrder: ProductSortOrder;
  availableOnly: boolean;
  recentlyAddedId: string | null;
  onChangeCategory: (category: ProductCategory) => void;
  onChangeQuery: (query: string) => void;
  onChangeSortOrder: (order: ProductSortOrder) => void;
  onToggleAvailableOnly: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

const PRODUCT_SORT_OPTIONS: Array<{ value: ProductSortOrder; label: string }> = [
  { value: 'featured', label: 'Онцлох' },
  { value: 'price_asc', label: 'Үнэ ↑' },
  { value: 'price_desc', label: 'Үнэ ↓' },
];

export function ProductsView({
  products,
  totalCount,
  category,
  query,
  sortOrder,
  availableOnly,
  recentlyAddedId,
  onChangeCategory,
  onChangeQuery,
  onChangeSortOrder,
  onToggleAvailableOnly,
  onSelectProduct,
  onAddToCart,
}: ProductsViewProps) {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-white border border-[#DCE5DF] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <BotanicalCornerAccent className="pointer-events-none absolute -top-6 right-0 w-56 h-40 opacity-30 hidden md:block" />
        <div className="space-y-2 max-w-2xl relative z-10">
          <p className="text-xs font-medium text-[#0E6BA8]">
            Ботаник ба Ухаалаг Технологи
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F241D]">
            Ургамал арчилгааны бүтээгдэхүүн
          </h1>
          <p className="text-sm text-[#465D53] leading-relaxed">
            Хөрсний чийг болон pH хэмжих ухаалаг мэдрэгч, автомат дуслын усалгаа, бүрэн спектрийн
            гэрэлтүүлэг ба органик хөрсний хольц.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-80 space-y-2 relative z-10">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#465D53] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="products-search-input" className="sr-only">
              Бүтээгдэхүүн хайх
            </label>
            <input
              id="products-search-input"
              type="search"
              value={query}
              onChange={(e) => onChangeQuery(e.target.value)}
              placeholder="Бүтээгдэхүүн, үзүүлэлтээр хайх..."
              className="w-full h-11 pl-10 pr-4 text-sm bg-[#F6F8F6] border border-[#DCE5DF] rounded-lg text-[#0F241D] placeholder:text-[#6B8278] focus:outline-none focus:border-[#0E6BA8] focus:bg-white transition-colors"
            />
          </div>
          <p className="text-xs text-[#465D53] tabular-nums">
            <strong className="font-semibold text-[#0F241D]">{products.length}</strong> /{' '}
            {totalCount} бүтээгдэхүүн
          </p>
        </div>
      </div>

      {/* Category Filter Strip + Sort & Availability Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Бүтээгдэхүүний ангилал"
          className="flex flex-wrap items-center gap-2"
        >
          {PRODUCT_CATEGORY_OPTIONS.map((opt) => {
            const isActive = category === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChangeCategory(opt.value)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0F241D] text-white border-[#0F241D]'
                    : 'bg-white text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D] hover:border-[#1F7A4C]/50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleAvailableOnly}
            aria-pressed={availableOnly}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              availableOnly
                ? 'bg-[#1F7A4C] text-white border-[#1F7A4C]'
                : 'bg-white text-[#465D53] border-[#DCE5DF] hover:text-[#0F241D]'
            }`}
          >
            Зөвхөн бэлэн байгаа
          </button>

          <div className="inline-flex items-center gap-1 rounded-lg border border-[#DCE5DF] bg-white p-0.5" role="group" aria-label="Бүтээгдэхүүн эрэмбэлэх">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B8278] ml-2 mr-1" aria-hidden="true" />
            {PRODUCT_SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={sortOrder === opt.value}
                onClick={() => onChangeSortOrder(opt.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  sortOrder === opt.value
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

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="bg-white border border-[#DCE5DF] rounded-2xl p-12 text-center space-y-4">
          <p className="font-display text-lg font-semibold text-[#0F241D]">
            Тохирох бүтээгдэхүүн олдсонгүй
          </p>
          <button
            type="button"
            onClick={() => {
              onChangeCategory('all');
              onChangeQuery('');
              if (availableOnly) onToggleAvailableOnly();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Шүүлтүүр цэвэрлэх</span>
          </button>
        </div>
      ) : (
        <div
          data-testid="products-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => {
            const isJustAdded = recentlyAddedId === product.id;
            return (
              <article
                key={product.id}
                className="bg-white border border-[#DCE5DF] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#0E6BA8]/60 transition-colors"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    aria-label={`${product.name} дэлгэрэнгүй үзэх`}
                    className="block w-full aspect-[4/3] bg-[#EDF2EE] overflow-hidden cursor-pointer group"
                  >
                    <SafeImage
                      src={product.image}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </button>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#465D53]">
                        {PRODUCT_CATEGORY_LABELS[product.category]}
                      </span>
                      <span
                        className={`font-medium ${
                          product.status === 'Бэлэн байгаа'
                            ? 'text-[#1F7A4C]'
                            : 'text-[#0E6BA8]'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-left group cursor-pointer"
                      >
                        <h3 className="font-display text-lg font-semibold text-[#0F241D] group-hover:text-[#0E6BA8] transition-colors">
                          {product.name}
                        </h3>
                      </button>
                      <p className="text-xs text-[#465D53] mt-0.5">{product.subtitle}</p>
                    </div>

                    <dl className="pt-2 border-t border-[#EDF2EE] space-y-1.5 text-xs">
                      {product.specs.slice(0, 2).map((spec) => (
                        <div key={spec.label} className="flex items-baseline justify-between gap-3">
                          <dt className="text-[#6B8278] shrink-0">{spec.label}:</dt>
                          <dd className="text-[#0F241D] font-medium text-right truncate">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#EDF2EE] flex items-center justify-between gap-3">
                  <span className="font-mono text-base font-semibold text-[#0F241D] tabular-nums">
                    {formatMnt(product.priceMnt)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      aria-label={`Дэлгэрэнгүй: ${product.name}`}
                      className="px-3 py-2 text-xs font-medium text-[#0F241D] bg-[#F6F8F6] hover:bg-[#EDF2EE] border border-[#DCE5DF] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Дэлгэрэнгүй
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      aria-label={`Сагсанд нэмэх: ${product.name}`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#0E6BA8]'
                          : 'bg-[#1F7A4C] hover:bg-[#165B38]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Нэмэгдлээ</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Сагсанд нэмэх</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
