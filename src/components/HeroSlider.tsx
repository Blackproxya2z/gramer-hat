import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Leaf } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleShopClick = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStoryClick = () => {
    const el = document.getElementById('our-roots');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#f7f4ec] border-b border-[#e5e7eb] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Message (Node 2:50 in Figma) */}
          <div className="lg:col-span-6 space-y-5">
            <span className="font-sans font-bold text-[11px] tracking-[1.7px] text-[#2D5F3F] uppercase block">
              ROOTED IN NATURE. MADE FOR YOU.
            </span>

            <h1 className="font-bengaliSerif font-semibold text-4xl sm:text-5xl lg:text-[54px] text-[#1e4029] leading-[1.18] tracking-tight">
              গ্রামের খাঁটি স্বাদ,<br />
              এবার আপনার ঘরে।
            </h1>

            <p className="font-sans font-medium text-lg sm:text-[19px] text-[#2D5F3F] leading-snug">
              Honest food. From our roots to your table.
            </p>

            <p className="font-sans font-normal text-sm sm:text-[16px] text-[#6b7280] leading-relaxed max-w-lg">
              Discover the goodness of Bangladesh — thoughtfully sourced honey, ghee, spices and pantry essentials.
            </p>

            {/* Hero Actions (Node 2:55 in Figma) */}
            <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-6">
              <button
                onClick={handleShopClick}
                className="bg-[#2D5F3F] hover:bg-[#1e4029] text-white font-sans font-semibold text-[15px] px-6 py-3.5 rounded-lg flex items-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <span>Shop pure goodness</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleStoryClick}
                className="font-sans font-semibold text-[14px] text-[#2D5F3F] hover:underline flex items-center gap-1.5 transition-all"
              >
                <span>Our story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Origin Note (Node 2:63 in Figma) */}
            <div className="pt-2 flex items-center gap-2 text-[#2D5F3F] font-bengali text-[13px]">
              <Leaf className="w-4 h-4 fill-current text-[#2D5F3F]" />
              <span>বাংলার মাটি থেকে, ভালোবাসা নিয়ে।</span>
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
    </section>
  );
};
