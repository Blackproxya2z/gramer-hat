import React from 'react';
import { useStore } from '../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleShopClick = () => {
    const el = document.getElementById('products-catalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStoryClick = () => {
    const el = document.getElementById('our-roots');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#f7f4ec] border-b border-[#e5e7eb] overflow-hidden">
      
      {/* Background Animated Agriculture Ambient Glow & Drift */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-600/5 blur-3xl pointer-events-none animate-agro-drift"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none animate-agro-drift" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Message (Node 2:50 in Figma) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5F3F]/10 border border-[#2D5F3F]/20 text-[#2D5F3F] text-[10px] font-sans font-bold tracking-[1.5px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5F3F] animate-pulse"></span>
              <span>Rooted in Nature · 100% Pure Harvest</span>
            </div>

            <h1 className="font-bengaliSerif font-semibold text-4xl sm:text-5xl lg:text-[54px] text-[#1e4029] leading-[1.18] tracking-tight">
              গ্রামের খাঁটি স্বাদ,<br />
              এবার আপনার ঘরে।
            </h1>

            <p className="font-sans font-medium text-lg sm:text-[19px] text-[#2D5F3F] leading-snug">
              Honest food. From our roots to your table.
            </p>

            <p className="font-sans font-normal text-sm sm:text-[16px] text-[#6b7280] leading-relaxed max-w-lg">
              Discover the goodness of Bangladesh — thoughtfully sourced honey, ghee, spices and pantry essentials directly from generational beekeepers and farmers.
            </p>

            {/* Hero Actions (Node 2:55 in Figma) */}
            <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-6">
              <button
                onClick={handleShopClick}
                className="bg-[#2D5F3F] hover:bg-[#1e4029] text-white font-sans font-semibold text-[15px] px-6 py-3.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Shop pure goodness</span>
                <span className="text-emerald-300 font-bold">→</span>
              </button>

              <button
                onClick={handleStoryClick}
                className="font-sans font-semibold text-[14px] text-[#2D5F3F] hover:underline flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Our story →</span>
              </button>
            </div>

            {/* Origin Note (Node 2:63 in Figma) */}
            <div className="pt-2 flex items-center gap-2 text-[#2D5F3F] font-bengali text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5F3F]"></span>
              <span>বাংলার মাটি থেকে, পরম মায়ায় তৈরি।</span>
            </div>
          </div>

          {/* Right Harvest Table Photograph (Node 2:68 in Figma) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[620px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-black/5 group">
              <img
                src="/assets/figma/harvest_table.jpeg"
                alt="Harvest table in rural Bangladesh"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              
              {/* Harvest Note Overlay Card (Node 2:69 in Figma) */}
              <div className="absolute left-6 bottom-6 bg-white/95 backdrop-blur-xs px-5 py-3 rounded-lg shadow-lg border border-gray-100">
                <p className="font-display font-medium text-lg sm:text-[20px] text-[#2D5F3F]">
                  A taste of home.
                </p>
                <p className="font-bengali text-xs sm:text-[11px] text-[#6b7280]">
                  চেনা স্বাদ, নতুন আস্থায়
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Animated Agriculture Ticker Marquee */}
      <div className="bg-[#1e402a] text-white py-2.5 overflow-hidden border-t border-emerald-800 text-xs font-medium tracking-wide">
        <div className="animate-agro-ticker flex items-center gap-8 whitespace-nowrap">
          <span className="font-semibold text-emerald-200">সুন্দরবনের গভীর অরণ্যের চাকের খাঁটি মধু</span>
          <span className="text-emerald-500">●</span>
          <span>ঘানি ভাঙা কাঠের খাঁটি সরিষার তেল</span>
          <span className="text-emerald-500">●</span>
          <span className="font-semibold text-amber-200">সিরাজগঞ্জের দেশি গাভীর বিলোনা গাওয়া ঘি</span>
          <span className="text-emerald-500">●</span>
          <span>যশোরের ঐতিহ্যবাহী খেজুরের নলেন পাটালি গুড়</span>
          <span className="text-emerald-500">●</span>
          <span className="font-semibold text-emerald-200">দিনাজপুরের সুগন্ধি চিনিগুঁড়া পোলাও চাল</span>
          <span className="text-emerald-500">●</span>
          <span>১০০% রাসায়নিক ও ভেজালমুক্ত কৃষিপণ্য</span>
          <span className="text-emerald-500">●</span>
          {/* Repeated for continuous smooth loop */}
          <span className="font-semibold text-emerald-200">সুন্দরবনের গভীর অরণ্যের চাকের খাঁটি মধু</span>
          <span className="text-emerald-500">●</span>
          <span>ঘানি ভাঙা কাঠের খাঁটি সরিষার তেল</span>
          <span className="text-emerald-500">●</span>
          <span className="font-semibold text-amber-200">সিরাজগঞ্জের দেশি গাভীর বিলোনা গাওয়া ঘি</span>
          <span className="text-emerald-500">●</span>
          <span>যশোরের ঐতিহ্যবাহী খেজুরের নলেন পাটালি গুড়</span>
          <span className="text-emerald-500">●</span>
          <span className="font-semibold text-emerald-200">দিনাজপুরের সুগন্ধি চিনিগুঁড়া পোলাও চাল</span>
          <span className="text-emerald-500">●</span>
          <span>১০০% রাসায়নিক ও ভেজালমুক্ত কৃষিপণ্য</span>
          <span className="text-emerald-500">●</span>
        </div>
      </div>

    </section>
  );
};
