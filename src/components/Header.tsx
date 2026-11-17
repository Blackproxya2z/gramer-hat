import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  LayoutDashboard, 
  Smartphone, 
  X,
  PhoneCall,
  User
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    cartCount, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    viewMode, 
    setViewMode,
    isMobileFrame,
    setIsMobileFrame,
    searchQuery,
    setSearchQuery,
    siteSettings,
    setActiveCategory
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb] shadow-xs">
      
      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Exact Figma Brand Wordmark */}
          <button 
            onClick={() => setViewMode('store')}
            className="flex flex-col items-start text-left shrink-0 group"
          >
            <span className="font-bengaliSerif font-semibold text-2xl sm:text-[28px] text-[#2D5F3F] leading-tight">
              {siteSettings.site_name_bn}
            </span>
            <span className="font-sans font-bold text-[10px] tracking-[3px] text-[#2D5F3F] uppercase -mt-0.5">
              {siteSettings.site_name_en}
            </span>
          </button>

          {/* Exact Figma Product Search (839px max in Figma) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search honey, ghee, spices and more…"
                className="w-full pl-11 pr-14 py-2.5 bg-[#fafafa] border border-[#e5e7eb] rounded-lg text-sm text-[#1A1A1A] placeholder-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#2D5F3F] focus:border-[#2D5F3F] transition-all"
              />
              <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-3.5" />
              <span className="absolute right-3.5 top-3 text-[11px] font-mono text-[#6b7280] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                ⌘ K
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Tools: Language, SINI IT, Cart, CMS */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Language Toggle in Figma: EN / বাংলা */}
            <button
              onClick={toggleLanguage}
              className="text-[13px] font-sans flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <span className={`font-bold ${language === 'en' ? 'text-[#2D5F3F]' : 'text-[#6b7280]'}`}>EN</span>
              <span className="text-[#6b7280]">/</span>
              <span className={`font-bengali ${language === 'bn' ? 'text-[#2D5F3F] font-bold' : 'text-[#6b7280]'}`}>বাংলা</span>
            </button>

            {/* Developer SINI IT WhatsApp */}
            <a
              href={siteSettings.developer_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-xs font-bold"
              title="Dev by SINI IT - Click to open WhatsApp chat"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SINI IT</span>
            </a>

            {/* Admin CMS Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'admin' ? 'store' : 'admin')}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'admin'
                  ? 'bg-[#F4A261] text-[#1A1A1A]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{viewMode === 'admin' ? 'Store' : 'CMS'}</span>
            </button>

            {/* Mobile PWA Sim */}
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="Toggle Mobile PWA View"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Figma Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#2D5F3F] transition-colors relative py-1"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#2D5F3F]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#E76F51] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-sans font-medium text-sm text-[#1A1A1A]">
                Cart ({cartCount})
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-2.5">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search honey, ghee, spices..."
              className="w-full pl-9 pr-4 py-2 bg-[#fafafa] border border-[#e5e7eb] rounded-lg text-xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar matching Figma (Node 2:6) */}
      <nav className="border-t border-[#e5e7eb] bg-white hidden sm:block">
        <div className="max-w-7xl mx-auto px-8 py-2.5 flex items-center gap-7 text-[14px]">
          <button
            onClick={() => setActiveCategory('all')}
            className="font-sans font-bold text-[#2D5F3F] hover:opacity-80 transition-opacity"
          >
            All products
          </button>
          <button
            onClick={() => setActiveCategory('cat-1')}
            className="font-sans font-medium text-[#1a1a1a] hover:text-[#2D5F3F] transition-colors"
          >
            Honey
          </button>
          <button
            onClick={() => setActiveCategory('cat-2')}
            className="font-sans font-medium text-[#1a1a1a] hover:text-[#2D5F3F] transition-colors"
          >
            Ghee
          </button>
          <button
            onClick={() => setActiveCategory('cat-3')}
            className="font-sans font-medium text-[#1a1a1a] hover:text-[#2D5F3F] transition-colors"
          >
            Spices
          </button>
          <button
            onClick={() => setActiveCategory('cat-4')}
            className="font-sans font-medium text-[#1a1a1a] hover:text-[#2D5F3F] transition-colors"
          >
            Rice & grains
          </button>
          <button
            onClick={() => setActiveCategory('cat-5')}
            className="font-sans font-medium text-[#1a1a1a] hover:text-[#2D5F3F] transition-colors"
          >
            Jaggery
          </button>

          <div className="ml-auto flex items-center gap-6 text-[13px] text-[#6b7280]">
            <a href="#our-roots" className="hover:text-[#2D5F3F] transition-colors">
              Our roots
            </a>
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-[#2D5F3F] transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#2D5F3F]" />
              <span>Track order</span>
            </button>
          </div>
        </div>
      </nav>

    </header>
  );
};
