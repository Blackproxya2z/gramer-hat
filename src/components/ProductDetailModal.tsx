import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductVariant } from '../types';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Share2, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Minus 
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    language, 
    t, 
    addToCart, 
    setIsCheckoutOpen,
    products,
    showToast
  } = useStore();

  if (!selectedProduct) return null;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    selectedProduct.variants[0] || { 
      name: 'Standard', 
      price: selectedProduct.sale_price || selectedProduct.regular_price, 
      stock: selectedProduct.stock_quantity, 
      sku: selectedProduct.sku 
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'origin'>('desc');

  const discountPercent = selectedProduct.sale_price
    ? Math.round(((selectedProduct.regular_price - selectedProduct.sale_price) / selectedProduct.regular_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedVariant, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.title_en,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(t('লিঙ্ক কপি হয়েছে!', 'Product link copied to clipboard!'));
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.category_id === selectedProduct.category_id && p.id !== selectedProduct.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column (Images) */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={selectedProduct.images[activeImage] || selectedProduct.images[0]}
                alt={selectedProduct.title_en}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-zoom-in"
              />
              {selectedProduct.is_bestseller && (
                <div className="absolute top-3 left-3 bg-[#F4A261] text-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {t('বেস্টসেলার', 'Best Seller')}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {selectedProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-[#2D5F3F] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="p-3.5 bg-[#f2f8f4] rounded-xl border border-[#2D5F3F]/15 flex items-center justify-around text-xs text-[#2D5F3F] font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D5F3F]" />
                <span>{t('১০০% খাঁটি পণ্য', '100% Pure Guarantee')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5F3F]" />
                <span>{t('ক্যাশ অন ডেলিভারি', 'COD Available')}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Info & Actions) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Origin */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="uppercase font-bold tracking-wider text-[#2D5F3F]">
                  SKU: {selectedVariant.sku || selectedProduct.sku}
                </span>
                {selectedProduct.origin_bn && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3 text-[#E76F51]" />
                    {language === 'bn' ? selectedProduct.origin_bn : selectedProduct.origin_en}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] leading-tight font-bengali">
                {language === 'bn' ? selectedProduct.title_bn : selectedProduct.title_en}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{selectedProduct.rating}</span>
                <span className="text-xs text-gray-400">({selectedProduct.reviews_count} {t('রিভিউ', 'reviews')})</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#2D5F3F]">
                      ৳{selectedVariant.price}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{Math.round(selectedVariant.price * 1.25)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    {t('সারাদেশে হোম ডেলিভারি সুবিধা', 'Doorstep delivery available')}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                    {t(`${discountPercent}% ছাড়`, `${discountPercent}% OFF`)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed font-normal">
                {language === 'bn' ? selectedProduct.short_description_bn : selectedProduct.short_description_en}
              </p>

              {/* Variants Selector */}
              {selectedProduct.variants.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-700 block mb-2">
                    {t('ওজন / ভ্যারিয়েন্ট বেছে নিন:', 'Select Variant / Size:')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((v) => {
                      const isSelected = selectedVariant.name === v.name;
                      return (
                        <button
                          key={v.name}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-[#2D5F3F] text-white border-[#2D5F3F] shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {v.name} - ৳{v.price}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700">
                  {t('পরিমাণ:', 'Quantity:')}
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-gray-800 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('স্টকে আছে', 'In Stock')}
                </span>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-white border-2 border-[#2D5F3F] text-[#2D5F3F] hover:bg-[#2D5F3F] hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('কার্টে যোগ করুন', 'Add to Cart')}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2D5F3F]/20"
                >
                  <Zap className="w-4 h-4 text-[#F4A261]" />
                  <span>{t('এখনই অর্ডার করুন', 'Buy Now')}</span>
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('বন্ধুদের সাথে শেয়ার করুন', 'Share with friends')}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Details Tabs */}
        <div className="border-t border-gray-200 bg-gray-50/60 p-6 sm:p-8">
          <div className="flex border-b border-gray-200 gap-6 mb-4">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2.5 text-sm font-bold transition-all relative ${
                activeTab === 'desc' ? 'text-[#2D5F3F] border-b-2 border-[#2D5F3F]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('বিস্তারিত বিবরণ', 'Full Description')}
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2.5 text-sm font-bold transition-all relative ${
                activeTab === 'ingredients' ? 'text-[#2D5F3F] border-b-2 border-[#2D5F3F]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('উপাদান ও বিশুদ্ধতা', 'Ingredients & Purity')}
            </button>
            <button
              onClick={() => setActiveTab('origin')}
              className={`pb-2.5 text-sm font-bold transition-all relative ${
                activeTab === 'origin' ? 'text-[#2D5F3F] border-b-2 border-[#2D5F3F]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('উৎস ও সংগ্রহ', 'Origin & Harvest')}
            </button>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed max-w-3xl">
            {activeTab === 'desc' && (
              <p>{language === 'bn' ? selectedProduct.description_bn : selectedProduct.description_en}</p>
            )}
            {activeTab === 'ingredients' && (
              <div>
                <p className="font-semibold text-gray-800 mb-1">{t('উপাদান:', 'Ingredients:')}</p>
                <p>{language === 'bn' ? selectedProduct.ingredients_bn : selectedProduct.ingredients_en}</p>
                <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-600">
                  ✓ {t('কোনো প্রকার কৃত্রিম চিনি, রং, ঘ্রাণ বা ফরমালিন মুক্ত।', 'Free from artificial colors, flavors, chemical preservatives or adulterants.')}
                </div>
              </div>
            )}
            {activeTab === 'origin' && (
              <div>
                <p className="font-semibold text-gray-800 mb-1">{t('উৎপত্তিস্থল:', 'Harvest Origin:')}</p>
                <p>{language === 'bn' ? selectedProduct.origin_bn : selectedProduct.origin_en}</p>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-3">
                {t('সম্পর্কিত পণ্য', 'Related Agro Products')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setSelectedVariant(p.variants[0]);
                    }}
                    className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-200 hover:border-[#2D5F3F] transition-all cursor-pointer"
                  >
                    <img src={p.images[0]} alt={p.title_en} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {language === 'bn' ? p.title_bn : p.title_en}
                      </p>
                      <span className="text-xs font-bold text-[#2D5F3F]">৳{p.sale_price || p.regular_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
