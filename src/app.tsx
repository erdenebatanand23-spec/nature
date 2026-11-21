import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CursorBotanicalTrail } from './components/CursorBotanicalTrail';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { IntroOverlay } from './components/IntroOverlay';
import { NatureFrameOverlay } from './components/NatureFrameOverlay';
import { PlantCompareModal } from './components/PlantCompareModal';
import { PlantDetailModal } from './components/PlantDetailModal';
import { PlantsView } from './components/PlantsView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductsView } from './components/ProductsView';
import { PLANTS_DATA } from './data/plants';
import { PRODUCTS_DATA } from './data/products';
import type {
  ActiveSection,
  CartItem,
  PlantFilterState,
  PlantItem,
  ProductCategory,
  ProductItem,
} from './types/botany';
import {
  DEFAULT_PLANT_FILTERS,
  filterPlants,
  filterProducts,
  getAdjacentPlantIds,
  getCompatiblePlantsForProduct,
  interleavePlantsByImage,
  sortProducts,
  type PlantSortOrder,
  type ProductSortOrder,
} from './utils/catalogLogic';
import { shouldSkipIntroFromUrl } from './utils/introTransition';

const SAVED_PLANTS_STORAGE_KEY = 'floratech_saved_plants_v1';
const WATERED_PLANTS_STORAGE_KEY = 'floratech_watered_log_v1';

function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadStoredStringArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function loadTodayWateredIds(): string[] {
  try {
    const raw = window.localStorage.getItem(WATERED_PLANTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { date?: string; ids?: unknown };
    if (parsed.date === getTodayIsoDate() && Array.isArray(parsed.ids)) {
      return parsed.ids.filter((v): v is string => typeof v === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export default function App() {
  const [introPhase, setIntroPhase] = useState<'intro' | 'transitioning' | 'entered'>(() =>
    typeof window !== 'undefined' && shouldSkipIntroFromUrl(window.location.search)
      ? 'entered'
      : 'intro'
  );
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [plantFilters, setPlantFilters] = useState<PlantFilterState>(DEFAULT_PLANT_FILTERS);
  const [plantSortOrder, setPlantSortOrder] = useState<PlantSortOrder>('variety');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [productCategory, setProductCategory] = useState<ProductCategory>('all');
  const [productQuery, setProductQuery] = useState('');
  const [productSortOrder, setProductSortOrder] = useState<ProductSortOrder>('featured');
  const [availableOnly, setAvailableOnly] = useState(false);

  const [savedPlantIds, setSavedPlantIds] = useState<string[]>(() =>
    loadStoredStringArray(SAVED_PLANTS_STORAGE_KEY)
  );
  const [wateredPlantIds, setWateredPlantIds] = useState<string[]>(() => loadTodayWateredIds());
  const [comparePlantIds, setComparePlantIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [natureFrameEnabled, setNatureFrameEnabled] = useState(true);

  const [selectedPlant, setSelectedPlant] = useState<PlantItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_PLANTS_STORAGE_KEY, JSON.stringify(savedPlantIds));
    } catch {
      /* Ignore storage quota errors in sandboxed iframes */
    }
  }, [savedPlantIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WATERED_PLANTS_STORAGE_KEY,
        JSON.stringify({ date: getTodayIsoDate(), ids: wateredPlantIds })
      );
    } catch {
      /* Ignore storage quota errors in sandboxed iframes */
    }
  }, [wateredPlantIds]);

  const featuredPlants = useMemo(() => {
    const curatedIds = [
      'siberian-cedar-pine',
      'sakura-cherry',
      'sacred-lotus',
      'monstera-deliciosa',
    ];
    const curated = curatedIds
      .map((id) => PLANTS_DATA.find((p) => p.id === id))
      .filter((p): p is PlantItem => Boolean(p));
    if (curated.length === 4) {
      return curated;
    }
    return interleavePlantsByImage(PLANTS_DATA.filter((plant) => plant.featured)).slice(0, 4);
  }, []);

  const featuredProducts = useMemo(
    () => PRODUCTS_DATA.filter((product) => product.featured).slice(0, 3),
    []
  );

  const filteredPlants = useMemo(
    () => filterPlants(PLANTS_DATA, plantFilters),
    [plantFilters]
  );

  const filteredAndSortedProducts = useMemo(() => {
    const matching = filterProducts(PRODUCTS_DATA, productCategory, productQuery);
    return sortProducts(matching, productSortOrder, availableOnly);
  }, [productCategory, productQuery, productSortOrder, availableOnly]);

  const comparePlants = useMemo(
    () =>
      comparePlantIds
        .map((id) => PLANTS_DATA.find((p) => p.id === id))
        .filter((p): p is PlantItem => Boolean(p)),
    [comparePlantIds]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const recommendedProductsForSelectedPlant = useMemo(() => {
    if (!selectedPlant) return [];
    return PRODUCTS_DATA.filter((p) => selectedPlant.recommendedProductIds.includes(p.id));
  }, [selectedPlant]);

  const adjacentPlants = useMemo(() => {
    if (!selectedPlant) return { prevPlant: null, nextPlant: null };
    const sourcePool = filteredPlants.some((p) => p.id === selectedPlant.id)
      ? filteredPlants
      : PLANTS_DATA;
    return getAdjacentPlantIds(sourcePool, selectedPlant.id);
  }, [selectedPlant, filteredPlants]);

  const compatiblePlantsForSelectedProduct = useMemo(() => {
    if (!selectedProduct) return [];
    return getCompatiblePlantsForProduct(PLANTS_DATA, selectedProduct.id);
  }, [selectedProduct]);

  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearchPlants = (query: string) => {
    setShowSavedOnly(false);
    setPlantFilters({
      ...DEFAULT_PLANT_FILTERS,
      query,
    });
    setActiveSection('plants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPlantFilters = (partial: Partial<PlantFilterState>) => {
    setShowSavedOnly(false);
    setPlantFilters({
      ...DEFAULT_PLANT_FILTERS,
      ...partial,
    });
    setActiveSection('plants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetPlantFilters = () => {
    setPlantFilters(DEFAULT_PLANT_FILTERS);
    setShowSavedOnly(false);
  };

  const handleToggleSavedPlant = (plantId: string) => {
    setSavedPlantIds((prev) =>
      prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId]
    );
  };

  const handleToggleWateredToday = (plantId: string) => {
    setWateredPlantIds((prev) =>
      prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId]
    );
  };

  const handleToggleComparePlant = (plantId: string) => {
    setComparePlantIds((prev) => {
      if (prev.includes(plantId)) {
        return prev.filter((id) => id !== plantId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, plantId];
    });
  };

  const handleAddToCart = (product: ProductItem, quantity: number = 1) => {
    const safeQty = Math.max(1, quantity);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + safeQty }
            : item
        );
      }
      return [...prev, { product, quantity: safeQty }];
    });
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#0F241D]"
      data-intro-phase={introPhase}
    >
      {introPhase !== 'entered' && (
        <IntroOverlay
          onStartReveal={() => setIntroPhase('transitioning')}
          onCompleteReveal={() => setIntroPhase('entered')}
        />
      )}
      <NatureFrameOverlay enabled={natureFrameEnabled} />
      <CursorBotanicalTrail />
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        hideBrandLogo={introPhase !== 'entered'}
      />

      <main className="flex-1">
        {activeSection === 'home' && (
          <HomeView
            allPlants={PLANTS_DATA}
            featuredPlants={featuredPlants}
            featuredProducts={featuredProducts}
            totalPlantsCount={PLANTS_DATA.length}
            savedPlantIds={savedPlantIds}
            heroActive={introPhase !== 'intro'}
            onNavigate={handleNavigate}
            onQuickSearchPlants={handleQuickSearchPlants}
            onApplyPlantFilters={handleApplyPlantFilters}
            onSelectPlant={setSelectedPlant}
            onToggleSavedPlant={handleToggleSavedPlant}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeSection === 'plants' && (
          <PlantsView
            plants={filteredPlants}
            totalCount={PLANTS_DATA.length}
            filters={plantFilters}
            savedPlantIds={savedPlantIds}
            wateredPlantIds={wateredPlantIds}
            comparePlants={comparePlants}
            isAnyModalOpen={Boolean(selectedPlant) || isCompareOpen || Boolean(selectedProduct) || isCartOpen}
            sortOrder={plantSortOrder}
            showSavedOnly={showSavedOnly}
            onChangeFilters={setPlantFilters}
            onResetFilters={handleResetPlantFilters}
            onChangeSortOrder={setPlantSortOrder}
            onToggleShowSavedOnly={() => setShowSavedOnly((prev) => !prev)}
            onSelectPlant={setSelectedPlant}
            onToggleSavedPlant={handleToggleSavedPlant}
            onToggleWateredToday={handleToggleWateredToday}
            onToggleComparePlant={handleToggleComparePlant}
            onOpenCompare={() => setIsCompareOpen(true)}
            onClearCompare={() => setComparePlantIds([])}
          />
        )}

        {activeSection === 'products' && (
          <ProductsView
            products={filteredAndSortedProducts}
            totalCount={PRODUCTS_DATA.length}
            category={productCategory}
            query={productQuery}
            sortOrder={productSortOrder}
            availableOnly={availableOnly}
            recentlyAddedId={recentlyAddedId}
            onChangeCategory={setProductCategory}
            onChangeQuery={setProductQuery}
            onChangeSortOrder={setProductSortOrder}
            onToggleAvailableOnly={() => setAvailableOnly((prev) => !prev)}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        natureFrameEnabled={natureFrameEnabled}
        onToggleNatureFrame={() => setNatureFrameEnabled((prev) => !prev)}
      />

      <PlantDetailModal
        plant={selectedPlant}
        recommendedProducts={recommendedProductsForSelectedPlant}
        isSaved={selectedPlant ? savedPlantIds.includes(selectedPlant.id) : false}
        isWateredToday={selectedPlant ? wateredPlantIds.includes(selectedPlant.id) : false}
        isCompared={selectedPlant ? comparePlantIds.includes(selectedPlant.id) : false}
        canCompareMore={comparePlantIds.length < 3}
        prevPlant={adjacentPlants.prevPlant}
        nextPlant={adjacentPlants.nextPlant}
        onClose={() => setSelectedPlant(null)}
        onSelectPlant={setSelectedPlant}
        onToggleSaved={handleToggleSavedPlant}
        onToggleWateredToday={handleToggleWateredToday}
        onToggleCompare={handleToggleComparePlant}
        onApplyFilterAndClose={(partial) => {
          setSelectedPlant(null);
          handleApplyPlantFilters(partial);
        }}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      <PlantCompareModal
        isOpen={isCompareOpen}
        plants={comparePlants}
        onClose={() => setIsCompareOpen(false)}
        onRemovePlant={handleToggleComparePlant}
        onClearAll={() => setComparePlantIds([])}
        onSelectPlant={setSelectedPlant}
      />

      <ProductDetailModal
        product={selectedProduct}
        compatiblePlants={compatiblePlantsForSelectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectPlant={setSelectedPlant}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onBrowseProducts={() => handleNavigate('products')}
      />
    </div>
  );
}
