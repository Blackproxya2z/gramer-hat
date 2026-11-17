import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Search, 
  Truck, 
  PackageCheck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen, orders, language, t } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isTrackingOpen) return null;

  const trimmed = query.trim().toUpperCase();
  const matchedOrder = trimmed
    ? orders.find(
        (o) =>
          o.order_number.toUpperCase().includes(trimmed) ||
          o.customer_phone.includes(trimmed)
      )
    : orders[0]; // default show latest

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#2D5F3F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Truck className="w-5 h-5 text-[#F4A261]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-bengali">
                {t('লাইভ অর্ডার ট্র্যাকিং', 'Live Order Tracking')}
              </h2>
              <p className="text-xs text-emerald-100">
                {t('অর্ডার নম্বর অথবা মোবাইল নম্বর দিয়ে সার্চ করুন', 'Search by Order Number or Phone Number')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearched(true);
                }}
                placeholder={t('যেমন: GH-2026-004821 অথবা 01711223344', 'e.g. GH-2026-004821 or 01711223344')}
                className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Quick sample buttons */}
          <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-500">
            <span>{t('নমুনা অর্ডার:', 'Sample Orders:')}</span>
            {orders.slice(0, 2).map((o) => (
              <button
                key={o.id}
                onClick={() => setQuery(o.order_number)}
                className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-mono text-[11px] hover:border-[#2D5F3F]"
              >
                {o.order_number}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {matchedOrder ? (
            <div className="space-y-6">
              
              {/* Top Order Card */}
              <div className="p-4 rounded-2xl bg-[#f2f8f4] border border-[#2D5F3F]/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-gray-500 block uppercase font-bold tracking-wider">
                    {t('অর্ডার নম্বর', 'Order ID')}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#2D5F3F]">
                    {matchedOrder.order_number}
                  </span>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {matchedOrder.customer_name} • {matchedOrder.customer_phone}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    matchedOrder.order_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : matchedOrder.order_status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {matchedOrder.order_status}
                  </span>
                  {matchedOrder.courier_name && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {matchedOrder.courier_name} (TRX: {matchedOrder.tracking_number || 'STF-BD'})
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                  {t('ডেলিভারি টাইমলাইন ও অগ্রগতি', 'Delivery Timeline & Progress')}
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {matchedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        step.completed ? 'bg-[#2D5F3F]' : 'bg-gray-200'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`text-xs sm:text-sm font-bold ${
                          step.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {language === 'bn' ? step.title_bn : step.title_en}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {step.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5 text-xs text-gray-700">
                <MapPin className="w-4 h-4 text-[#E76F51] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 block">{t('গন্তব্য ঠিকানা:', 'Destination Address:')}</span>
                  <p className="text-gray-600 mt-0.5">
                    {matchedOrder.shipping_address.address_line}, {matchedOrder.shipping_address.thana}, {matchedOrder.shipping_address.district}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold">{t('কোনো অর্ডার খুঁজে পাওয়া যায়নি।', 'No order found with this query.')}</p>
              <p className="text-xs text-gray-400">{t('অনুগ্রহ করে সঠিক অর্ডার বা মোবাইল নম্বর দিন।', 'Please check your order ID or mobile number.')}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
