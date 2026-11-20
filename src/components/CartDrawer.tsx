import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    language,
    t,
    siteSettings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const shippingCost = cartSubtotal >= siteSettings.free_shipping_threshold || appliedCoupon === 'FREESHIP'
    ? 0
    : siteSettings.inside_dhaka_delivery;

  const grandTotal = Math.max(0, cartSubtotal - discount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-[#1A1A1A]">
              {t('আপনার শপিং কার্ট', 'Your Shopping Cart')}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#2D5F3F]/10 text-[#2D5F3F] text-xs font-bold font-mono">
              [ {cartCount} ]
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition-colors cursor-pointer text-sm"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#2D5F3F]/10 border border-[#2D5F3F]/20 flex items-center justify-center text-xs font-mono font-bold text-[#2D5F3F]">
                [ CART ]
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">
                  {t('আপনার কার্ট খালি!', 'Your Cart is Empty')}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  {t('আমাদের খাঁটি ও প্রাকৃতিক কৃষিপণ্য ঘুরে দেখুন এবং কার্টে যোগ করুন।', 'Explore our pure organic agro products and add them to your cart.')}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#2D5F3F] text-white text-xs font-bold hover:bg-[#1e402a] transition-all cursor-pointer"
              >
                {t('পণ্য দেখা শুরু করুন →', 'Start Shopping →')}
              </button>
            </div>
          ) : (
            cart.map((item, index) => {
              const lineTotal = item.selected_variant.price * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.selected_variant.name}-${index}`}
                  className="flex gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title_en}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200 bg-white"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-800 truncate">
                          {language === 'bn' ? item.product.title_bn : item.product.title_en}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selected_variant.name)}
                          className="text-gray-400 hover:text-red-500 text-xs font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-[#2D5F3F] bg-[#2D5F3F]/10 px-1.5 py-0.2 rounded">
                          {item.selected_variant.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ৳{item.selected_variant.price}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & line total */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60">
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selected_variant.name, -1)}
                          className="px-2 py-0.5 hover:bg-gray-100 text-gray-600 font-bold text-xs transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selected_variant.name, 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 text-gray-600 font-bold text-xs transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-black text-sm text-[#2D5F3F]">
                        ৳{lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3.5 shadow-lg">
            
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900">PROMO</span>
                    <span>
                      {t('কুপন সক্রিয়:', 'Coupon active:')} <strong>{appliedCoupon}</strong> (-৳{discount})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t('কুপন কোড (যেমন GRAMER10)', 'Coupon code (e.g. GRAMER10)')}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2D5F3F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-gray-900 hover:bg-[#2D5F3F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {t('প্রয়োগ', 'Apply')}
                  </button>
                </form>
              )}
              {couponMessage && (
                <p className={`text-[11px] mt-1 ${couponMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>{t('পণ্যের সাবটোটাল', 'Subtotal')}</span>
                <span className="font-semibold text-gray-900">৳{cartSubtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t('কুপন ডিসকাউন্ট', 'Discount')}</span>
                  <span>-৳{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('ডেলিভারি চার্জ', 'Shipping')}</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">{t('ফ্রি', 'Free')}</span>
                  ) : (
                    `৳${shippingCost}`
                  )}
                </span>
              </div>

              {cartSubtotal < siteSettings.free_shipping_threshold && (
                <p className="text-[10px] text-gray-400">
                  {t(
                    `* আরো ৳${siteSettings.free_shipping_threshold - cartSubtotal} এর পণ্য কিনলে সারাদেশে ফ্রি ডেলিভারি!`,
                    `* Add ৳${siteSettings.free_shipping_threshold - cartSubtotal} more for Free Delivery!`
                  )}
                </p>
              )}

              <div className="flex justify-between text-base font-black text-[#1A1A1A] pt-2 border-t border-gray-200">
                <span>{t('সর্বমোট পরিশোধযোগ্য', 'Grand Total')}</span>
                <span className="text-xl text-[#2D5F3F]">৳{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-sm shadow-lg shadow-[#2D5F3F]/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <span>{t('চেকআউটে এগিয়ে যান →', 'Proceed to Checkout →')}</span>
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              {t('আরও পণ্য কিনুন', 'Continue Shopping')}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
