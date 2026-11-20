import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoryFilter: React.FC = () => {
  const { categories, activeCategory, setActiveCategory } = useStore();

  return (
    <section className="bg-white py-8 sm:py-16 border-b border-[#e5e7eb]" id="catalog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Heading (Node 2:157 in Figma) */}
        <div className="mb-6 sm:mb-10 text-left">
          <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block mb-1">
            THE GOODNESS OF OUR LAND
          </span>
          <h2 className="font-display font-medium text-2xl sm:text-[36px] text-[#1e4029] leading-tight">
            A pantry full of pure.
          </h2>
        </div>

        {/* Category Grid with Responsive Circles */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 md:gap-8 justify-items-center">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(isSelected ? 'all' : cat.id);
                  const el = document.getElementById('products-catalog');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center gap-2 sm:gap-3 group focus:outline-none cursor-pointer"
              >
                <div className={`relative w-20 h-20 sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border-2 ${
                  isSelected ? 'border-[#2D5F3F] ring-4 ring-[#2D5F3F]/20 scale-105' : 'border-white'
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.name_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 text-center">
                  <span className={`font-sans font-semibold text-xs sm:text-[15px] transition-colors leading-tight ${
                    isSelected ? 'text-[#2D5F3F] font-bold' : 'text-[#2D5F3F] group-hover:text-[#1e4029]'
                  }`}>
                    {cat.name_en}
                  </span>
                  <span className="font-bengali font-normal text-[10px] sm:text-[12px] text-[#6b7280]">
                    {cat.name_bn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
