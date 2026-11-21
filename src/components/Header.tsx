import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import type { ActiveSection } from '../types/botany';
import { BrandLogoMark } from './BotanicalVisuals';

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  cartCount: number;
  onOpenCart: () => void;
  hideBrandLogo?: boolean;
}

const NAV_ITEMS: { id: ActiveSection; label: string }[] = [
  { id: 'home', label: 'Нүүр хуудас' },
  { id: 'plants', label: 'Ургамлын мэдээлэл' },
  { id: 'products', label: 'Бүтээгдэхүүн' },
];

export function Header({
  activeSection,
  onNavigate,
  cartCount,
  onOpenCart,
  hideBrandLogo = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectSection = (section: ActiveSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAF9]/95 backdrop-blur-sm border-b border-[#215b63]/15">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelectSection('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#215b63] rounded-md cursor-pointer"
        >
          <span
            id="navbar-brand-logo-slot"
            className={`inline-flex items-center justify-center w-8 h-8 shrink-0 transition-opacity duration-150 ${
              hideBrandLogo ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <BrandLogoMark className="w-8 h-8 shrink-0" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[#215b63]">
            ФлораТех
          </span>
        </button>

        {/* Zone 2: Three Main Menu Links */}
        <nav
          aria-label="Үндсэн цэс"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#215b63] rounded-sm ${
                  isActive
                    ? 'text-[#215b63]'
                    : 'text-[#465D53] hover:text-[#215b63]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#67c090]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Сагс нээх (${cartCount} бараа)`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#215b63] hover:bg-[#19474d] rounded-lg transition-all duration-150 hover:shadow-[0_4px_16px_-2px_rgba(103,192,144,0.45)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67c090]"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Сагс</span>
            <span className="font-mono tabular-nums text-[#D5ECE0]">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Цэс хаах' : 'Цэс нээх'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#0F241D] border border-[#DCE5DF] bg-white rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Гар утасны цэс"
          className="md:hidden border-t border-[#DCE5DF] bg-white px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EDF2EE] text-[#0F241D]'
                    : 'text-[#465D53] hover:bg-[#F6F8F6] hover:text-[#0F241D]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
