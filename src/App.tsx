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
import { 
  ArrowRight, 
  Truck, 
  CreditCard, 
  Package, 
  MessageCircle, 
  CheckCircle2, 
  Smartphone, 
  X 
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    viewMode, 
    isMobileFrame, 
    setIsMobileFrame, 
    products, 
    activeCategory, 
    searchQuery,
    setActiveCategory,
    toastMessage,
    showToast
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [newsletterEmail, setNewsletterEmail] = useState('');

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
        <div className="fixed top-5 right-5 z-50 bg-[#1e4029] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-[#F4A261]/30">
          <CheckCircle2 className="w-4 h-4 text-[#F4A261] shrink-0" />
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

            {/* Bestsellers Section (Node 2:10 in Figma) */}
            <section className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                
                {/* Heading (Node 2:187 in Figma) */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block mb-1.5">
                      YOUR NEXT PANTRY FAVOURITES
                    </span>
                    <h2 className="font-display font-medium text-3xl sm:text-[36px] text-[#1e4029] leading-tight">
                      Good food. Great beginnings.
                    </h2>
                    <p className="font-sans font-normal text-sm sm:text-[15px] text-[#6b7280] mt-1">
                      Everyday essentials, with the goodness you grew up with.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveCategory('all')}
                    className="font-sans font-semibold text-[14px] text-[#2D5F3F] hover:underline flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <span>Shop all products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Grid (Node 2:195 in Figma) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestSellers.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

              </div>
            </section>

            {/* Seasonal Feature: Date Palm Jaggery (Node 2:11 in Figma) */}
            <section className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="bg-[#f7f4ec] rounded-2xl p-6 sm:p-12 border border-[#e5e7eb] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Story */}
                  <div className="lg:col-span-6 space-y-4">
                    <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block">
                      A LITTLE TASTE OF TRADITION
                    </span>
                    <h3 className="font-display font-medium text-3xl sm:text-4xl text-[#1e4029] leading-tight">
                      Winter’s sweetest tradition.
                    </h3>
                    <p className="font-bengaliSerif font-semibold text-lg text-[#2D5F3F]">
                      খেজুরের গুড়ে শীতের আমেজ
                    </p>
                    <p className="font-sans font-normal text-sm text-[#6b7280] leading-relaxed max-w-md">
                      Rich, caramel notes. Familiar winter memories, crafted the timeless way in the heart of Jessore.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveCategory('cat-5')}
                        className="bg-[#2D5F3F] hover:bg-[#1e4029] text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <span>Explore jaggery</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="lg:col-span-6 flex justify-center lg:justify-end">
                    <div className="w-full max-w-[500px] aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-black/5">
                      <img
                        src="/assets/figma/cat_jaggery.jpeg"
                        alt="Date Palm Jaggery Patali"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Our Roots Section (Node 2:12 in Figma) */}
            <section id="our-roots" className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Harvest Photograph (Node 2:398 in Figma) */}
                  <div className="lg:col-span-6">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-black/5">
                      <img
                        src="/assets/figma/bangladesh_harvest.jpeg"
                        alt="Harvest growers of Bangladesh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Roots Story (Node 2:402 in Figma) */}
                  <div className="lg:col-span-6 space-y-4">
                    <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block">
                      A LITTLE CLOSER TO OUR ROOTS
                    </span>
                    <h3 className="font-display font-medium text-3xl sm:text-4xl text-[#1e4029] leading-tight">
                      Good food begins with good roots.
                    </h3>
                    <p className="font-bengaliSerif font-semibold text-lg text-[#2D5F3F]">
                      শিকড়ের টানে, খাঁটি খাবারের সন্ধানে।
                    </p>
                    <p className="font-sans font-normal text-sm text-[#6b7280] leading-relaxed">
                      Gramer Hat brings the familiar flavours of rural Bangladesh back to modern life. We work directly with generational growers, beekeepers and oil-millers across the country to protect pure culinary heritage.
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
                        <span>Get to know Gramer Hat</span>
                        <ArrowRight className="w-4 h-4" />
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
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F]">
                      <Truck className="w-4 h-4" />
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
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F]">
                      <CreditCard className="w-4 h-4" />
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
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F]">
                      <Package className="w-4 h-4" />
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
                    <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center text-[#2D5F3F]">
                      <MessageCircle className="w-4 h-4" />
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

  // If Mobile Frame mode is enabled, wrap in realistic smartphone frame matching Figma mobile specs (390px)
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center justify-center">
        <div className="mb-4 flex items-center justify-between w-full max-w-[420px] text-white text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#25D366]" />
            <span className="font-bold">Gramer Hat · Mobile Storefront (390px)</span>
          </div>
          <button
            onClick={() => setIsMobileFrame(false)}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-white font-semibold transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Frame</span>
          </button>
        </div>

        {/* Smartphone Shell matching 390px Figma width */}
        <div className="w-[390px] h-[820px] bg-white rounded-[44px] shadow-2xl border-[10px] border-gray-800 overflow-hidden relative flex flex-col">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] mr-2"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a]"></div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {content}
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full z-50 pointer-events-none"></div>
        </div>
      </div>
    );
  }

  return content;
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
