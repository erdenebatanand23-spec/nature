import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartItem } from '../types/botany';
import {
  calculateCartTotals,
  formatMnt,
  FREE_DELIVERY_THRESHOLD_MNT,
} from '../utils/catalogLogic';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBrowseProducts: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseProducts,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items);

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Захиалга баталгаажуулахын тулд нэр, утас, хүргэлтийн хаягаа бөглөнө үү.');
      return;
    }
    setFormError('');
    const orderNumber = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderId(orderNumber);
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F241D]/45 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Захиалгын сагс"
    >
      <div
        className="bg-white w-full max-w-md h-full flex flex-col border-l border-[#DCE5DF] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#DCE5DF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1F7A4C]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#0F241D]">
              Сагс ({totals.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Сагс хаах"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE5DF] text-[#465D53] hover:text-[#0F241D] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {confirmedOrderId ? (
            <div className="bg-[#EDF2EE] border border-[#1F7A4C]/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#1F7A4C] font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Захиалга {confirmedOrderId} амжилттай бүртгэгдлээ</span>
              </div>
              <p className="text-xs text-[#465D53] leading-relaxed">
                Хүлээн авагч: <strong className="text-[#0F241D]">{customerName}</strong> ({phone})
                <br />
                Хүргэлтийн хаяг: {address}
              </p>
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrderId(null);
                  setCustomerName('');
                  setPhone('');
                  setAddress('');
                  onClose();
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-[#0F241D] hover:bg-[#164432] rounded-lg cursor-pointer"
              >
                Хаах
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="space-y-2">
                <p className="font-display text-base font-semibold text-[#0F241D]">
                  Таны сагс хоосон байна
                </p>
                <p className="text-xs text-[#465D53]">
                  Бүтээгдэхүүн хэсгээс ухаалаг мэдрэгч, усалгаа эсвэл хөрсний хольц нэмнэ үү.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseProducts();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg transition-colors cursor-pointer"
              >
                <span>Бүтээгдэхүүн үзэх</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs text-[#465D53] bg-[#F6F8F6] border border-[#DCE5DF] rounded-lg px-3.5 py-2.5 tabular-nums">
                {totals.freeDeliveryRemainingMnt > 0 ? (
                  <span>
                    {formatMnt(FREE_DELIVERY_THRESHOLD_MNT)}-аас дээш үнэгүй хүргэлттэй (дутуу:{' '}
                    <strong className="text-[#0F241D]">
                      {formatMnt(totals.freeDeliveryRemainingMnt)}
                    </strong>
                    )
                  </span>
                ) : (
                  <span className="text-[#1F7A4C] font-medium">
                    Үнэгүй хүргэлтийн нөхцөл хангагдлаа
                  </span>
                )}
              </div>

              <ul className="divide-y divide-[#EDF2EE]">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="py-4 flex gap-3.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#EDF2EE] shrink-0">
                      <SafeImage
                        src={product.image}
                        alt={product.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#0F241D] truncate">
                          {product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`${product.name} устгах`}
                          className="text-[#6B8278] hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="font-mono text-xs text-[#465D53] tabular-nums">
                        {formatMnt(product.priceMnt)}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label={`${product.name} тоо хасах`}
                          className="w-7 h-7 inline-flex items-center justify-center border border-[#DCE5DF] rounded-md text-[#0F241D] hover:bg-[#F6F8F6] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="font-mono text-xs font-semibold tabular-nums w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label={`${product.name} тоо нэмэх`}
                          className="w-7 h-7 inline-flex items-center justify-center border border-[#DCE5DF] rounded-md text-[#0F241D] hover:bg-[#F6F8F6] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#DCE5DF] pt-4 space-y-2 text-xs tabular-nums">
                <div className="flex justify-between text-[#465D53]">
                  <span>Барааны дүн</span>
                  <span className="font-mono">{formatMnt(totals.subtotalMnt)}</span>
                </div>
                <div className="flex justify-between text-[#465D53]">
                  <span>Хүргэлт</span>
                  <span className="font-mono">
                    {totals.deliveryFeeMnt === 0 ? 'Үнэгүй' : formatMnt(totals.deliveryFeeMnt)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0F241D] pt-2 border-t border-[#EDF2EE]">
                  <span>Нийт дүн</span>
                  <span className="font-mono">{formatMnt(totals.totalMnt)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2 border-t border-[#DCE5DF]">
                <h3 className="font-display text-sm font-semibold text-[#0F241D]">
                  Хүргэлтийн мэдээлэл
                </h3>
                {formError && (
                  <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                    {formError}
                  </p>
                )}
                <div>
                  <label htmlFor="order-name" className="block text-xs text-[#465D53] mb-1">
                    Захиалагчийн нэр
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Нэрээ оруулна уу"
                    className="w-full h-10 px-3 text-sm border border-[#DCE5DF] rounded-lg focus:outline-none focus:border-[#1F7A4C]"
                  />
                </div>
                <div>
                  <label htmlFor="order-phone" className="block text-xs text-[#465D53] mb-1">
                    Утасны дугаар
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9911-xxxx"
                    className="w-full h-10 px-3 text-sm border border-[#DCE5DF] rounded-lg focus:outline-none focus:border-[#1F7A4C]"
                  />
                </div>
                <div>
                  <label htmlFor="order-address" className="block text-xs text-[#465D53] mb-1">
                    Хүргэлтийн хаяг
                  </label>
                  <input
                    id="order-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Дүүрэг, хороо, байр/тоот"
                    className="w-full h-10 px-3 text-sm border border-[#DCE5DF] rounded-lg focus:outline-none focus:border-[#1F7A4C]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold text-white bg-[#1F7A4C] hover:bg-[#165B38] rounded-lg transition-colors cursor-pointer"
                >
                  Захиалга баталгаажуулах
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
