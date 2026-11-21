import { ArrowUp, Leaf } from 'lucide-react';
import type { ActiveSection } from '../types/botany';
import { BrandLogoMark } from './BotanicalVisuals';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenCart: () => void;
  natureFrameEnabled: boolean;
  onToggleNatureFrame: () => void;
}

export function Footer({
  onNavigate,
  onOpenCart,
  natureFrameEnabled,
  onToggleNatureFrame,
}: FooterProps) {
  return (
    <footer className="border-t border-[#DCE5DF] bg-white mt-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <BrandLogoMark className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-display text-sm font-semibold text-[#0F241D] group-hover:text-[#1F7A4C] transition-colors">
              ФлораТех
            </p>
            <p className="text-xs text-[#465D53]">
              Дэлхийн ургамлын мэдээлэл ба тогтвортой арчилгааны технологи
            </p>
          </div>
        </button>

        <nav aria-label="Доод цэс" className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#465D53]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#0F241D] transition-colors cursor-pointer whitespace-nowrap"
          >
            Нүүр хуудас
          </button>
          <button
            type="button"
            onClick={() => onNavigate('plants')}
            className="hover:text-[#0F241D] transition-colors cursor-pointer whitespace-nowrap"
          >
            Ургамлын мэдээлэл
          </button>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="hover:text-[#0F241D] transition-colors cursor-pointer whitespace-nowrap"
          >
            Бүтээгдэхүүн
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            className="hover:text-[#0F241D] transition-colors cursor-pointer whitespace-nowrap"
          >
            Захиалгын сагс
          </button>
          <button
            type="button"
            onClick={onToggleNatureFrame}
            aria-pressed={natureFrameEnabled}
            className="inline-flex items-center gap-1.5 hover:text-[#1F7A4C] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Leaf className="w-3.5 h-3.5 text-[#1F7A4C]" aria-hidden="true" />
            <span>Байгалийн хүрээ: {natureFrameEnabled ? 'Асаалттай' : 'Хаалттай'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1 hover:text-[#1F7A4C] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Дээш буцах</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </nav>

        <p className="text-xs text-[#465D53] tabular-nums">
          © 2026 ФлораТех · Ботаник ба Ухаалаг Экосистем
        </p>
      </div>
    </footer>
  );
}
