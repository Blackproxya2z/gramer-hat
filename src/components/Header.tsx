import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const categorySubData: Record<string, {
  subtitle_bn: string;
  subtitle_en: string;
  tags_bn: string[];
  tags_en: string[];
}> = {
  'cat-1': {
    subtitle_bn: 'সুন্দরবনের গভীর অরণ্যের চাকের খলিসা ও সরিষা ফুলের প্রাকৃতিক কাঁচা মধু',
    subtitle_en: 'Raw & unfiltered wildflower honey harvested directly from the Sundarbans',
    tags_bn: ['খলিসা মধু', 'সরিষা ফুল মধু', 'কালোজিরা মধু', 'প্রাকৃতিক চাকের মধু', '২৫০ গ্রাম / ৫০০ গ্রাম'],
    tags_en: ['Khalisa Honey', 'Mustard Flower', 'Black Seed Honey', 'Comb Honey', '250g / 500g'],
  },
  'cat-2': {
    subtitle_bn: 'পাবনা ও সিরাজগঞ্জের দেশি গাভীর দুধ থেকে সনাতন পদ্ধতিতে প্রস্তুত সুবাসিত গাওয়া ঘি',
    subtitle_en: 'Cultured Bilona and traditional churned golden cow ghee with rich aroma',
    tags_bn: ['খাঁটি গাওয়া ঘি', 'দেশি গাভীর ঘি', 'দানাদার সুবাসিত ঘি', '৫০০ গ্রাম / ১ কেজি'],
    tags_en: ['Desi Cow Ghee', 'Cultured Bilona Ghee', 'Golden Grainy Ghee', '500g / 1kg'],
  },
  'cat-3': {
    subtitle_bn: 'কাঠের ঘানি ভাঙা খাঁটি সরিষার তেল ও বাছাইকৃত খাঁটি আস্ত ও গুঁড়া মসলা',
    subtitle_en: 'Wood cold-pressed mustard oil, turmeric, cumin and whole farm spices',
    tags_bn: ['কাঠের ঘানি ভাঙা তেল', 'হালদি গুঁড়া', 'মরিচ গুঁড়া', 'দারুচিনি ও এলাচ'],
    tags_en: ['Cold Pressed Mustard Oil', 'Turmeric Powder', 'Chilli Powder', 'Whole Spices'],
  },
  'cat-4': {
    subtitle_bn: 'দিনাজপুরের সুগন্ধি চিনিগুঁড়া পোলাও চাল ও পুষ্টিকর অর্গানিক ডাল',
    subtitle_en: 'Aromatic Chinigura polao rice, organic lentils and heritage grains',
    tags_bn: ['চিনিগুঁড়া পোলাও চাল', 'কাটারিভোগ চাল', 'বালাইভোগ চাল', 'অর্গানিক ডাল'],
    tags_en: ['Chinigura Rice', 'Kataribhog Rice', 'Aromatic Kalijira', 'Organic Lentils'],
  },
  'cat-5': {
    subtitle_bn: 'যশোরের বিখ্যাত খেজুরের নলেন পাটালি গুড় ও তরল ঝোলা গুড়',
    subtitle_en: 'Authentic winter date palm jaggery patali and caramel liquid jhola from Jessore',
    tags_bn: ['নলেন পাটালি গুড়', 'খেজুরের ঝোলা গুড়', 'দানাদার গুড়', 'ঐতিহ্যবাহী শীতের গুড়'],
    tags_en: ['Nolen Patali', 'Liquid Jaggery (Jhola)', 'Jessore Signature', 'Winter Harvest'],
  },
};

export const Header: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    cartCount, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    viewMode, 
    setViewMode,
    searchQuery, 
    setSearchQuery, 
    siteSettings,
    categories,
    products,
    activeCategory,
    setActiveCategory,
    addToCart,
    setSelectedProduct,
    t
  } = useStore();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setActiveDropdown(null);
    // Smoothly scroll to the products catalog section
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb] shadow-xs" ref={navRef}>
      
      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Exact Figma Brand Wordmark */}
          <button 
            onClick={() => {
              setViewMode('store');
              setActiveCategory('all');
            }}
            className="flex flex-col items-start text-left shrink-0 group cursor-pointer"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && ['admin', '/admin', 'cms'].includes(searchQuery.trim().toLowerCase())) {
                    window.location.hash = '#admin';
                    setViewMode('admin');
                    setSearchQuery('');
                  }
                }}
                placeholder="Search honey, ghee, spices, rice..."
                className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#e5e7eb] rounded-lg text-sm text-[#1A1A1A] placeholder-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#2D5F3F] focus:border-[#2D5F3F] transition-all"
              />
              <span className="absolute right-3.5 top-3 text-[11px] font-mono text-[#6b7280] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                ⌘ K
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-2.5 text-gray-400 hover:text-gray-600 font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Tools: Language, SINI IT, Cart, CMS */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            
            {/* Language Toggle in Figma: EN / বাংলা */}
            <button
              onClick={toggleLanguage}
              className="text-[13px] font-sans flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
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
              className="hidden lg:flex items-center px-2.5 py-1.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-xs font-bold"
              title="Dev by SINI IT - Click to open WhatsApp chat"
            >
              <span>SINI IT →</span>
            </a>

            {/* Figma Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#2D5F3F] hover:bg-[#1e4029] text-white font-sans font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <span>Cart</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-[#2D5F3F] text-[11px] font-black">
                {cartCount}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && ['admin', '/admin', 'cms'].includes(searchQuery.trim().toLowerCase())) {
                  window.location.hash = '#admin';
                  setViewMode('admin');
                  setSearchQuery('');
                }
              }}
              placeholder="Search honey, ghee, spices, rice..."
              className="w-full px-3.5 py-2 bg-[#fafafa] border border-[#e5e7eb] rounded-lg text-xs"
            />
          </div>

          {/* Mobile Category Navigation Strip (Pure Text - No Emojis) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 no-scrollbar">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#2D5F3F] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t('সকল পণ্য', 'All Products')}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  activeCategory === c.id
                    ? 'bg-[#2D5F3F] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <span>{language === 'bn' ? c.name_bn : c.name_en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar matching Figma (Node 2:6) with Dropdowns */}
      <nav className="border-t border-[#e5e7eb] bg-white hidden sm:block relative">
        <div className="max-w-7xl mx-auto px-8 py-2 flex items-center gap-8 text-[14px]">
          
          {/* Item 0: All Products with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('all')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleCategorySelect('all')}
              className={`font-sans font-semibold py-1.5 flex items-center gap-1 transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'text-[#2D5F3F] font-bold border-b-2 border-[#2D5F3F]'
                  : 'text-[#1a1a1a] hover:text-[#2D5F3F]'
              }`}
            >
              <span>{t('সকল পণ্য', 'All products')}</span>
              <span className={`text-[10px] text-gray-400 transition-transform duration-200 inline-block ${
                activeDropdown === 'all' ? 'rotate-180 text-[#2D5F3F]' : ''
              }`}>▾</span>
            </button>

            {/* Mega Dropdown for All Products */}
            {activeDropdown === 'all' && (
              <div className="absolute top-full left-0 w-[580px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1A1A]">
                      {t('গ্রামের হাটের সকল খাদ্য সম্ভার', 'Gramer Hat Agro Collections')}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {t('সরাসরি চাষী ও মৌয়ালদের থেকে সংগৃহীত খাঁটি পণ্য', 'Pure farm-direct harvests and pantry essentials')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="text-xs font-bold text-[#2D5F3F] hover:underline cursor-pointer"
                  >
                    <span>{t('সব পণ্য দেখুন →', 'View All 12 Items →')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const count = products.filter(p => p.category_id === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F7F4EC] transition-all text-left group border border-transparent hover:border-[#2D5F3F]/20 cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-xs">
                          <img src={cat.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 group-hover:text-[#2D5F3F]">
                            <span>{cat.name_en}</span>{' '}
                            <span className="text-gray-400 font-normal">({cat.name_bn})</span>
                          </p>
                          <span className="text-[10px] text-gray-500">
                            {count} {language === 'bn' ? 'টি পণ্য' : 'products'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Curated Highlights Banner */}
                <div className="mt-4 pt-3 border-t border-gray-100 bg-[#fafafa] -mx-5 -mb-5 p-4 rounded-b-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{t('১০০০ টাকার অর্ডারে ফ্রি ডেলিভারি', 'Free doorstep delivery on orders over ৳1000')}</span>
                  </div>
                  <button
                    onClick={() => handleCategorySelect('cat-5')}
                    className="text-[#2D5F3F] font-bold hover:underline cursor-pointer"
                  >
                    <span>{t('শীতের নলেন গুড় →', 'Winter Jaggery →')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Categories (Honey, Ghee, Spices, Rice, Jaggery) with Dropdowns */}
          {categories.map((cat) => {
            const isCurrent = activeCategory === cat.id;
            const isOpen = activeDropdown === cat.id;
            const catInfo = categorySubData[cat.id] || {
              subtitle_bn: 'শতভাগ খাঁটি প্রাকৃতিক কৃষিপণ্য',
              subtitle_en: '100% natural, farm-fresh produce',
              tags_bn: ['খাঁটি পণ্য', 'প্রাকৃতিক'],
              tags_en: ['Natural', 'Authentic'],
            };
            const catProds = products.filter(p => p.category_id === cat.id).slice(0, 2);

            return (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`font-sans font-medium py-1.5 flex items-center gap-1 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'text-[#2D5F3F] font-bold border-b-2 border-[#2D5F3F]'
                      : 'text-[#1a1a1a] hover:text-[#2D5F3F]'
                  }`}
                >
                  <span>{cat.name_en}</span>
                  <span className={`text-[10px] text-gray-400 transition-transform duration-200 inline-block ${
                    isOpen ? 'rotate-180 text-[#2D5F3F]' : ''
                  }`}>▾</span>
                </button>

                {/* Dropdown Card for each category */}
                {isOpen && (
                  <div className="absolute top-full left-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Category Title & Tagline */}
                    <div className="pb-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#1A1A1A]">
                          <span className="text-[#2D5F3F]">{cat.name_en}</span>{' '}
                          <span className="text-gray-500 font-normal">({cat.name_bn})</span>
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2D5F3F]">
                          {products.filter(p => p.category_id === cat.id).length} {language === 'bn' ? 'পণ্য' : 'Items'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                        {language === 'bn' ? catInfo.subtitle_bn : catInfo.subtitle_en}
                      </p>
                    </div>

                    {/* Popular Varieties / Sub-filter tags */}
                    <div className="py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                        {t('জনপ্রিয় ভ্যারাইটি ও সাইজ:', 'Popular Varieties & Sizes:')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(language === 'bn' ? catInfo.tags_bn : catInfo.tags_en).map((tag: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleCategorySelect(cat.id)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#2D5F3F] border border-gray-200 transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Top Products Mini Grid */}
                    {catProds.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                          {t('সেরা পছন্দসমূহ:', 'Featured Picks:')}
                        </span>
                        <div className="space-y-2">
                          {catProds.map((prod) => (
                            <div
                              key={prod.id}
                              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                            >
                              <div 
                                onClick={() => setSelectedProduct(prod)}
                                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                              >
                                <img
                                  src={prod.images[0]}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-900 truncate">
                                    {language === 'bn' ? prod.title_bn : prod.title_en}
                                  </p>
                                  <span className="text-xs font-black text-[#2D5F3F]">
                                    ৳{prod.sale_price || prod.regular_price}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => addToCart(prod, prod.variants[0])}
                                className="px-2.5 py-1 rounded-lg bg-[#2D5F3F] hover:bg-[#1e402a] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                                title="Add to Cart"
                              >
                                <span>{t('কার্টে যোগ', 'Add')}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer View All Link */}
                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                      <button
                        onClick={() => handleCategorySelect(cat.id)}
                        className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2D5F3F] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{t(`সব ${cat.name_bn} পণ্য দেখুন →`, `Explore all ${cat.name_en} products →`)}</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}

          {/* Right Tools: Roots & Tracking */}
          <div className="ml-auto flex items-center gap-6 text-[13px] text-[#6b7280]">
            <a href="#our-roots" className="hover:text-[#2D5F3F] transition-colors">
              Our roots
            </a>
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-[#2D5F3F] transition-colors cursor-pointer"
            >
              <span>Track order →</span>
            </button>
          </div>
        </div>
      </nav>

    </header>
  );
};
