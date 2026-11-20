import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { TrustBadges } from './components/TrustBadges';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminCMS } from './components/AdminCMS';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

const MainApp: React.FC = () => {
  const { 
    viewMode, 
    setViewMode,
    products, 
    categories,
    activeCategory, 
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    toastMessage,
    showToast,
    language,
    siteSettings,
    t
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Secure Hidden CMS Access Listener: URL Hash (#admin, #cms) and Keyboard Shortcut (Ctrl+Shift+A)
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#cms') {
        setViewMode('admin');
      } else if (viewMode === 'admin' && hash === '') {
        setViewMode('store');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Ctrl + Alt + A opens secret admin gate
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.hash = '#admin';
        setViewMode('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewMode, setViewMode]);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  // Filter products by active category and search query
  let filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category_id === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      p.title_bn.toLowerCase().includes(q) || 
      p.title_en.toLowerCase().includes(q) ||
      p.short_description_bn.toLowerCase().includes(q) ||
      p.short_description_en.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price));
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price));
  }

  // Bestsellers from Figma (first 4 items)
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('ধন্যবাদ! নিউজলেটারে যুক্ত হওয়ার জন্য।');
    setNewsletterEmail('');
  };

  const content = (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1e4029] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-[#F4A261]/30">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'admin' ? (
        <AdminCMS />
      ) : (
        <>
          <AnnouncementBar />
          <Header />
          
          <main className="flex-1">
            <HeroSlider />
            <TrustBadges />
            <CategoryFilter />

            {/* Dynamic Product Catalog Section (Responsive to Category Menu & Search) */}
            <section id="products-catalog" className="relative bg-white py-8 sm:py-16 border-b border-[#e5e7eb] scroll-mt-24 overflow-hidden">
              {/* Subtle Animated Agriculture Ambient Glows */}
              <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-emerald-600/5 blur-3xl pointer-events-none animate-agro-drift"></div>
              <div className="absolute bottom-10 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none animate-agro-drift" style={{ animationDelay: '4s' }}></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                
                {/* Heading Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#2D5F3F]/10 border border-[#2D5F3F]/20 text-[#2D5F3F] text-[10px] font-sans font-bold tracking-[1.5px] uppercase mb-2 animate-earth-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5F3F]"></span>
                      <span>{t('মাঠ থেকে সরাসরি রসুইঘরে · Seasonal Pure Harvest', 'Pure Farm Direct · Seasonal Harvest')}</span>
                    </div>
                    <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block mb-1.5">
                      {activeCategory === 'all'
                        ? (searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : 'YOUR NEXT PANTRY FAVOURITES · খাঁটি খাদ্য সম্ভার')
                        : `HONEST ROOTS · ${currentCategory?.name_en.toUpperCase() || 'COLLECTION'}`}
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-[36px] text-[#1e4029] leading-tight">
                      {activeCategory === 'all'
                        ? (searchQuery ? `Search Results` : 'Good food. Great beginnings.')
                        : `${currentCategory?.name_en} (${currentCategory?.name_bn})`}
                    </h2>
                    <p className="font-sans font-normal text-sm sm:text-[15px] text-[#6b7280] mt-1">
                      {activeCategory === 'all'
                        ? t('প্রতিদিনের সেরা ও স্বাস্থ্যকর কৃষিপণ্য, সরাসরি কৃষকের মাঠ থেকে।', 'Everyday essentials, with the goodness you grew up with.')
                        : (language === 'bn' 
                            ? `${currentCategory?.name_bn} ক্যাটাগরিতে মোট ${filteredProducts.length}টি খাঁটি পণ্য পাওয়া গেছে।`
                            : `Showing ${filteredProducts.length} authentic products in this collection.`)}
                    </p>
                  </div>

                  {/* Actions: Sort selector and reset button */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-auto">
                    {/* Sort selector */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-[#fafafa] border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs">
                      <span className="font-bold text-gray-500">{t('সর্ট:', 'Sort:')}</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"
                      >
                        <option value="featured">{t('জনপ্রিয় পণ্য (Featured)', 'Featured')}</option>
                        <option value="price-low">{t('দাম: কম থেকে বেশি', 'Price: Low to High')}</option>
                        <option value="price-high">{t('দাম: বেশি থেকে কম', 'Price: High to Low')}</option>
                      </select>
                    </div>

                    {(activeCategory !== 'all' || searchQuery) && (
                      <button
                        onClick={() => {
                          setActiveCategory('all');
                          setSearchQuery('');
                        }}
                        className="font-sans font-semibold text-xs text-[#2D5F3F] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{t('সকল পণ্য দেখুন ✕', 'Show all products ✕')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Pills Bar inside the catalog (No Emojis) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === 'all'
                        ? 'bg-[#2D5F3F] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('সকল পণ্য', 'All Products')} ({products.length})
                  </button>

                  {categories.map((cat) => {
                    const isCurrent = activeCategory === cat.id;
                    const catCount = products.filter((p) => p.category_id === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#2D5F3F] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{language === 'bn' ? cat.name_bn : cat.name_en}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {catCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Product Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#f7f4ec]/50 rounded-2xl border border-dashed border-gray-300 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2D5F3F] font-bold text-sm flex items-center justify-center mx-auto">
                      GH
                    </div>
                    <h3 className="text-base font-bold text-gray-800">
                      {t('কোনো পণ্য পাওয়া যায়নি', 'No products found')}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      {t('আপনার ফিল্টার অথবা সার্চের সাথে কোনো পণ্যের মিল পাওয়া যায়নি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।', 'No agro products matched your current category or search criteria.')}
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 bg-[#2D5F3F] text-white text-xs font-bold rounded-lg hover:bg-[#1e4029] transition-colors cursor-pointer"
                    >
                      {t('সকল পণ্য দেখুন →', 'View All Products →')}
                    </button>
                  </div>
                )}

              </div>
            </section>

            {/* Seasonal Feature: Date Palm Jaggery (Node 2:11 in Figma - Customizer Ready) */}
            <section className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="bg-[#f7f4ec] rounded-2xl p-6 sm:p-12 border border-[#e5e7eb] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Story */}
                  <div className="lg:col-span-6 space-y-4">
                    <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block">
                      {siteSettings.seasonal_tag || 'A LITTLE TASTE OF TRADITION'}
                    </span>
                    <h3 className="font-display font-medium text-3xl sm:text-4xl text-[#1e4029] leading-tight">
                      {language === 'bn' ? (siteSettings.seasonal_title_bn || 'খেজুরের গুড়ে শীতের আমেজ') : (siteSettings.seasonal_title_en || 'Winter’s sweetest tradition.')}
                    </h3>
                    <p className="font-bengaliSerif font-semibold text-lg text-[#2D5F3F]">
                      {language === 'bn' ? (siteSettings.seasonal_title_en || 'Winter’s sweetest tradition.') : (siteSettings.seasonal_title_bn || 'খেজুরের গুড়ে শীতের আমেজ')}
                    </p>
                    <p className="font-sans font-normal text-sm text-[#6b7280] leading-relaxed max-w-md">
                      {siteSettings.seasonal_desc || 'Rich, caramel notes. Familiar winter memories, crafted the timeless way in the heart of Jessore.'}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setActiveCategory(siteSettings.seasonal_category_id || 'cat-5');
                          const el = document.getElementById('products-catalog');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#2D5F3F] hover:bg-[#1e4029] text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{t('গুড় ও সিজনাল কালেকশন', 'Explore seasonal')}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="lg:col-span-6 flex justify-center lg:justify-end">
                    <div className="w-full max-w-[500px] aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-black/5">
                      <img
                        src={siteSettings.seasonal_image || '/assets/figma/cat_jaggery.jpeg'}
                        alt="Seasonal agro feature"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Our Roots Section (Node 2:12 in Figma - Customizer Ready) */}
            <section id="our-roots" className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Harvest Photograph (Node 2:398 in Figma) */}
                  <div className="lg:col-span-6">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-black/5">
                      <img
                        src={siteSettings.roots_image || '/assets/figma/bangladesh_harvest.jpeg'}
                        alt="Harvest growers of Bangladesh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Roots Story (Node 2:402 in Figma) */}
                  <div className="lg:col-span-6 space-y-4">
                    <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block">
                      {siteSettings.roots_tag || 'A LITTLE CLOSER TO OUR ROOTS'}
                    </span>
                    <h3 className="font-display font-medium text-3xl sm:text-4xl text-[#1e4029] leading-tight">
                      {language === 'bn' ? (siteSettings.roots_title_bn || 'শিকড়ের টানে, খাঁটি খাবারের সন্ধানে।') : (siteSettings.roots_title_en || 'Good food begins with good roots.')}
                    </h3>
                    <p className="font-bengaliSerif font-semibold text-lg text-[#2D5F3F]">
                      {language === 'bn' ? (siteSettings.roots_title_en || 'Good food begins with good roots.') : (siteSettings.roots_title_bn || 'শিকড়ের টানে, খাঁটি খাবারের সন্ধানে।')}
                    </p>
                    <p className="font-sans font-normal text-sm text-[#6b7280] leading-relaxed">
                      {siteSettings.roots_desc || 'Gramer Hat brings the familiar flavours of rural Bangladesh back to modern life. We work directly with generational growers, beekeepers and oil-millers across the country to protect pure culinary heritage.'}
                    </p>

                    {/* 3 Steps: 01, 02, 03 (Node 2:407 in Figma) */}
                    <div className="pt-2 grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-4">
                      <div>
                        <span className="font-display font-bold text-xl text-[#2D5F3F] block">01</span>
                        <p className="font-sans font-semibold text-xs text-[#1A1A1A] mt-1">Source thoughtfully</p>
                      </div>
                      <div>
                        <span className="font-display font-bold text-xl text-[#2D5F3F] block">02</span>
                        <p className="font-sans font-semibold text-xs text-[#1A1A1A] mt-1">Pack with care</p>
                      </div>
                      <div>
                        <span className="font-display font-bold text-xl text-[#2D5F3F] block">03</span>
                        <p className="font-sans font-semibold text-xs text-[#1A1A1A] mt-1">Bring it home</p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <a
                        href="https://wa.me/8801647236359"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-semibold text-sm text-[#2D5F3F] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>Get to know Gramer Hat →</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Shopping Promise (Node 2:13 in Figma) */}
            <section className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#1e4029] mb-10 text-left">
                  A little peace of mind, with every order.
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Delivery, made simple */}
                  <div className="p-5 rounded-xl border border-[#e5e7eb] bg-[#fafafa]/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F] font-mono font-bold text-xs">
                      01
                    </div>
                    <h4 className="font-sans font-semibold text-[15px] text-[#1A1A1A]">
                      Delivery, made simple
                    </h4>
                    <p className="font-sans font-normal text-xs text-[#6b7280] leading-relaxed">
                      Check delivery availability and charges at checkout. Swift doorstep shipping across Bangladesh.
                    </p>
                  </div>

                  {/* Pay your way */}
                  <div className="p-5 rounded-xl border border-[#e5e7eb] bg-[#fafafa]/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F] font-mono font-bold text-xs">
                      02
                    </div>
                    <h4 className="font-sans font-semibold text-[15px] text-[#1A1A1A]">
                      Pay your way
                    </h4>
                    <p className="font-sans font-normal text-xs text-[#6b7280] leading-relaxed">
                      Choose bKash, Nagad, cards or pay cash on delivery (COD) when you receive your order.
                    </p>
                  </div>

                  {/* Care in every parcel */}
                  <div className="p-5 rounded-xl border border-[#e5e7eb] bg-[#fafafa]/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F] font-mono font-bold text-xs">
                      03
                    </div>
                    <h4 className="font-sans font-semibold text-[15px] text-[#1A1A1A]">
                      Care in every parcel
                    </h4>
                    <p className="font-sans font-normal text-xs text-[#6b7280] leading-relaxed">
                      Thoughtfully packed in airtight jars and sealed containers to keep your pantry favourites safe.
                    </p>
                  </div>

                  {/* A real person to help */}
                  <div className="p-5 rounded-xl border border-[#e5e7eb] bg-[#fafafa]/50 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F] font-mono font-bold text-xs">
                      04
                    </div>
                    <h4 className="font-sans font-semibold text-[15px] text-[#1A1A1A]">
                      A real person to help
                    </h4>
                    <p className="font-sans font-normal text-xs text-[#6b7280] leading-relaxed">
                      Questions about an ingredient or an order? Chat with our customer support on WhatsApp anytime.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* Newsletter (Node 2:14 in Figma) */}
            <section className="bg-[#f7f4ec] py-12 sm:py-14 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-6 space-y-1.5">
                    <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#1e4029]">
                      A little goodness in your inbox.
                    </h3>
                    <p className="font-sans font-normal text-xs sm:text-sm text-[#6b7280]">
                      Seasonal arrivals, kitchen stories and a taste of what’s fresh.
                    </p>
                  </div>

                  <div className="lg:col-span-6">
                    <form onSubmit={handleSubscribe} className="space-y-2">
                      <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-[#e5e7eb] shadow-xs">
                        <input
                          type="email"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Your email address"
                          className="flex-1 px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="bg-[#2D5F3F] hover:bg-[#1e4029] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0"
                        >
                          Subscribe
                        </button>
                      </div>
                      <p className="font-sans text-[11px] text-[#6b7280]">
                        Only the good stuff. Unsubscribe anytime.
                      </p>
                    </form>
                  </div>

                </div>
              </div>
            </section>

          </main>

          <Footer />
        </>
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />
      <WhatsAppButton />

    </div>
  );

  return content;
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
