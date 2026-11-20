import React, { useState } from 'react';
import type { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [isSaved, setIsSaved] = useState(false);

  const selectedVariant: ProductVariant = product.variants[0] || {
    name: 'Standard',
    price: product.sale_price || product.regular_price,
    stock: product.stock_quantity,
    sku: product.sku
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // Badge mapping based on product or Figma design
  const getBadgeText = () => {
    if (product.slug.includes('honey')) return 'Pantry favourite';
    if (product.slug.includes('ghee')) return 'Small-batch';
    if (product.slug.includes('turmeric') || product.slug.includes('spice')) return 'Kitchen essential';
    if (product.slug.includes('rice')) return 'Everyday goodness';
    if (product.is_preorder) return 'Pre-Order';
    return 'Artisan pure';
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-xl border border-[#e5e7eb] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Media (Node 2:197 in Figma) */}
      <div className="relative aspect-[4/3] sm:h-[258px] w-full overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.title_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Selection Badge (Top Left) */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#2D5F3F] text-[11px] font-sans font-semibold px-2.5 py-1 rounded-md shadow-xs border border-gray-100">
          {getBadgeText()}
        </div>

        {/* Save Product Heart Icon (Top Right) */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-xs shadow-xs transition-colors cursor-pointer ${
            isSaved ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white/90 text-gray-500 hover:text-[#2D5F3F] border border-gray-100'
          }`}
          title="Save product"
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Product Details (Node 2:204 in Figma) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Origin / Region Tag */}
          <span className="font-sans font-bold text-[11px] tracking-[1.2px] text-[#6b7280] uppercase block mb-1">
            {product.origin_en || 'BANGLADESH'}
          </span>

          {/* Bengali Title */}
          <h3 className="font-bengaliSerif font-semibold text-lg sm:text-[22px] text-[#1e4029] leading-snug line-clamp-1">
            {product.title_bn}
          </h3>

          {/* English Title */}
          <p className="font-sans font-normal text-xs sm:text-[14px] text-[#6b7280] line-clamp-1 mt-0.5">
            {product.title_en}
          </p>

          {/* Price and Size Row */}
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="font-sans font-bold text-xl sm:text-[24px] text-[#1e4029]">
              ৳ {selectedVariant.price}
            </span>
            <span className="font-sans font-normal text-xs sm:text-[14px] text-[#6b7280]">
              / {selectedVariant.name}
            </span>
          </div>
        </div>

        {/* Add to Bag Button (Node 2:211 in Figma) */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleAdd}
            className="w-full h-11 rounded-lg bg-white border border-[#2D5F3F] text-[#2D5F3F] hover:bg-[#2D5F3F] hover:text-white font-sans font-semibold text-[14px] flex items-center justify-center transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <span>Add to bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
