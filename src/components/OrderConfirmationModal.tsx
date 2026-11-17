import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  Printer, 
  MapPin, 
  Phone, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { 
    lastPlacedOrder, 
    setLastPlacedOrder, 
    setIsTrackingOpen, 
    language, 
    t, 
    siteSettings 
  } = useStore();

  if (!lastPlacedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    setLastPlacedOrder(null);
    setIsTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 print:shadow-none print:m-0 print:w-full">
        
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-[#2D5F3F] to-[#1e402a] text-white p-6 sm:p-8 text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
            🎉
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-bengali">
            {t('ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে।', 'Thank you! Your order has been placed.')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            {t(
              'আমরা শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করব এবং ডেলিভারির প্রস্তুতি নেব।',
              'We have received your order and will contact you via phone for swift verification.'
            )}
          </p>
          <div className="pt-2 inline-block">
            <span className="px-4 py-1.5 rounded-full bg-[#F4A261] text-[#1A1A1A] font-black text-sm tracking-wide shadow-sm">
              {t('অর্ডার নম্বর:', 'Order ID:')} {lastPlacedOrder.order_number}
            </span>
          </div>
        </div>

        {/* Content & Invoice summary */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">{t('অর্ডারের তারিখ:', 'Order Date:')}</span>
              <span className="font-bold text-gray-800">{lastPlacedOrder.created_at}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">{t('পেমেন্ট পদ্ধতি:', 'Payment Method:')}</span>
              <span className="font-bold text-[#2D5F3F] uppercase">{lastPlacedOrder.payment_method.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">{t('ডেলিভারি সময়:', 'Est. Delivery:')}</span>
              <span className="font-bold text-gray-800">{t('৩-৫ কর্মদিবস', '3-5 Business Days')}</span>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <strong className="text-gray-900">{lastPlacedOrder.customer_name}</strong>
              <span>({lastPlacedOrder.customer_phone})</span>
            </div>
            <p className="flex items-start gap-1.5 text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-[#E76F51] shrink-0 mt-0.5" />
              <span>
                {lastPlacedOrder.shipping_address.address_line}, {lastPlacedOrder.shipping_address.thana}, {lastPlacedOrder.shipping_address.district}
              </span>
            </p>
            {lastPlacedOrder.payment_transaction_id && (
              <p className="text-[11px] text-[#2D5F3F] font-mono font-semibold">
                TrxID: {lastPlacedOrder.payment_transaction_id}
              </p>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">{t('সাবটোটাল', 'Subtotal')}</span>
              <span className="font-semibold text-gray-800">৳{lastPlacedOrder.subtotal}</span>
            </div>
            {lastPlacedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>{t('ডিসকাউন্ট', 'Discount')}</span>
                <span>-৳{lastPlacedOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">{t('ডেলিভারি চার্জ', 'Shipping')}</span>
              <span className="font-semibold text-gray-800">৳{lastPlacedOrder.shipping_cost}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-black text-sm text-[#1A1A1A]">
              <span>{t('সর্বমোট পরিশোধিত / প্রদেয়', 'Total Amount')}</span>
              <span className="text-lg text-[#2D5F3F]">৳{lastPlacedOrder.total}</span>
            </div>
          </div>

          {/* SMS / Confirmation Alert Note */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <span className="text-lg">📱</span>
            <div>
              <p className="font-bold">
                {t('এসএমএস নোটিফিকেশন পাঠানো হয়েছে', 'SMS Notification Dispatched')}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {t(
                  `আপনার অর্ডার নম্বর #${lastPlacedOrder.order_number} সংরক্ষণে রাখুন। কুরিয়ারে পাঠানোর পর ট্র্যাকিং কোড এসএমএস করা হবে।`,
                  `Save your Order ID #${lastPlacedOrder.order_number}. Courier tracking updates will follow via SMS.`
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              onClick={handleTrack}
              className="flex-1 py-3 px-4 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#2D5F3F]/20 transition-all"
            >
              <Truck className="w-4 h-4 text-[#F4A261]" />
              <span>{t('অর্ডার ট্র্যাক করুন', 'Track This Order')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-gray-200"
            >
              <Printer className="w-4 h-4" />
              <span>{t('ইনভয়েস প্রিন্ট', 'Print Invoice')}</span>
            </button>

            <button
              onClick={() => setLastPlacedOrder(null)}
              className="py-3 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-gray-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('আরও কেনাকাটা করুন', 'Continue Shopping')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
