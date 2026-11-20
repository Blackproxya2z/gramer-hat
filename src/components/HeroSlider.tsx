import React from 'react';
import { useStore } from '../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { siteSettings, language } = useStore();

  const handleShopClick = () => {
    const el = document.getElementById('products-catalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStoryClick = () => {
    const el = document.getElementById('our-roots');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroImage = siteSettings.hero_image || '/assets/figma/harvest_table.jpeg';
  const badgeText = language === 'bn' 
    ? (siteSettings.hero_badge_bn || 'শতভাগ খাঁটি প্রাকৃতিক কৃষিপণ্য') 
    : (siteSettings.hero_badge_en || 'Rooted in Nature · 100% Pure Harvest');

  const headlineBn = siteSettings.hero_title_bn || 'গ্রামের খাঁটি স্বাদ,\nএবার আপনার ঘরে।';
  const headlineEn = siteSettings.hero_title_en || 'Honest food. From our roots to your table.';
  const subtitle = language === 'bn'
    ? (siteSettings.hero_subtitle_bn || 'সুন্দরবনের প্রাকৃতিক চাকের কাঁচা মধু, সিরাজগঞ্জের গাওয়া ঘি, ঘানি ভাঙা সরিষার তেল সরাসরি কৃষকের মাঠ থেকে।')
    : (siteSettings.hero_subtitle_en || 'Discover the goodness of Bangladesh — thoughtfully sourced honey, ghee, spices and pantry essentials directly from generational beekeepers and farmers.');

  const tickerItems = (siteSettings.ticker_text || 'সুন্দরবনের গভীর অরণ্যের চাকের খাঁটি মধু ● ঘানি ভাঙা কাঠের খাঁটি সরিষার তেল ● সিরাজগঞ্জের দেশি গাভীর বিলোনা গাওয়া ঘি ● যশোরের ঐতিহ্যবাহী খেজুরের নলেন পাটালি গুড় ● দিনাজপুরের সুগন্ধি চিনিগুঁড়া পোলাও চাল ● ১০০% রাসায়নিক ও ভেজালমুক্ত কৃষিপণ্য')
    .split('●')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <section className="relative bg-[#f7f4ec] border-b border-[#e5e7eb] overflow-hidden">
      
      {/* Background Animated Agriculture Ambient Glow & Drift */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-600/5 blur-3xl pointer-events-none animate-agro-drift"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none animate-agro-drift" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Message (Node 2:50 in Figma) */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 rounded-full bg-[#2D5F3F]/10 border border-[#2D5F3F]/20 text-[#2D5F3F] text-[9px] sm:text-[10px] font-sans font-bold tracking-[1.5px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5F3F] animate-pulse"></span>
              <span>{badgeText}</span>
            </div>

            <h1 className="font-bengaliSerif font-semibold text-3xl sm:text-5xl lg:text-[54px] text-[#1e4029] leading-[1.18] tracking-tight whitespace-pre-line">
              {language === 'bn' ? headlineBn : headlineEn}
            </h1>

            <p className="font-sans font-medium text-base sm:text-[19px] text-[#2D5F3F] leading-snug">
              {language === 'bn' ? headlineEn : headlineBn.replace(/\n/g, ' ')}
            </p>

            <p className="font-sans font-normal text-xs sm:text-[16px] text-[#6b7280] leading-relaxed max-w-lg">
              {subtitle}
            </p>

            {/* Hero Actions (Node 2:55 in Figma) */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-6">
              <button
                onClick={handleShopClick}
                className="bg-[#2D5F3F] hover:bg-[#1e4029] text-white font-sans font-semibold text-xs sm:text-[15px] px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Shop pure goodness</span>
                <span className="text-emerald-300 font-bold">→</span>
              </button>

              <button
                onClick={handleStoryClick}
                className="font-sans font-semibold text-xs sm:text-[14px] text-[#2D5F3F] hover:underline flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Our story →</span>
              </button>
            </div>

            {/* Origin Note (Node 2:63 in Figma) */}
            <div className="pt-1 flex items-center gap-2 text-[#2D5F3F] font-bengali text-xs sm:text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5F3F]"></span>
              <span>বাংলার মাটি থেকে, পরম মায়ায় তৈরি।</span>
            </div>
          </div>

          {/* Right Harvest Table Photograph (Node 2:68 in Figma) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[620px] aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-black/5 group">
              <img
                src={heroImage}
                alt="Harvest table in rural Bangladesh"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                loading="eager"
              />
              
              {/* Harvest Note Overlay Card (Node 2:69 in Figma) */}
              <div className="absolute left-3 bottom-3 sm:left-6 sm:bottom-6 bg-white/95 backdrop-blur-xs px-3.5 py-2 sm:px-5 sm:py-3 rounded-lg shadow-lg border border-gray-100">
                <p className="font-display font-medium text-base sm:text-[20px] text-[#2D5F3F]">
                  {siteSettings.hero_note_title || 'A taste of home.'}
                </p>
                <p className="font-bengali text-[10px] sm:text-[11px] text-[#6b7280]">
                  {siteSettings.hero_note_subtitle || 'চেনা স্বাদ, নতুন আস্থায়'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Animated Agriculture Ticker Marquee */}
      <div className="bg-[#1e402a] text-white py-2.5 overflow-hidden border-t border-emerald-800 text-xs font-medium tracking-wide">
        <div className="animate-agro-ticker flex items-center gap-8 whitespace-nowrap">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="font-semibold text-emerald-200">{item}</span>
              <span className="text-emerald-500">●</span>
            </React.Fragment>
          ))}
          {/* Repeated for continuous smooth loop */}
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`rep-${idx}`}>
              <span className="font-semibold text-emerald-200">{item}</span>
              <span className="text-emerald-500">●</span>
            </React.Fragment>
          ))}
        </div>
      </div>

    </section>
  );
};
