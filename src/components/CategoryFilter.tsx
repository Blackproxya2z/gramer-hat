import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoryFilter: React.FC = () => {
  const { categories, activeCategory, setActiveCategory } = useStore();

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-[#e5e7eb]" id="catalog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Heading (Node 2:157 in Figma) */}
        <div className="mb-10 text-left">
          <span className="font-sans font-bold text-[10px] tracking-[1.7px] text-[#2D5F3F] uppercase block mb-1.5">
            THE GOODNESS OF OUR LAND
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-[36px] text-[#1e4029] leading-tight">
            A pantry full of pure.
          </h2>
        </div>

        {/* Category Grid with 110px Circles (Node 2:161 in Figma) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isSelected ? 'all' : cat.id)}
                className="flex flex-col items-center gap-3 group focus:outline-none"
              >
                <div className={`relative w-[110px] h-[110px] rounded-[55px] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border-2 ${
                  isSelected ? 'border-[#2D5F3F] ring-4 ring-[#2D5F3F]/20 scale-105' : 'border-white'
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.name_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`font-sans font-semibold text-[15px] transition-colors ${
                    isSelected ? 'text-[#2D5F3F] font-bold' : 'text-[#2D5F3F] group-hover:text-[#1e4029]'
                  }`}>
                    {cat.name_en}
                  </span>
                  <span className="font-bengali font-normal text-[12px] text-[#6b7280]">
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
