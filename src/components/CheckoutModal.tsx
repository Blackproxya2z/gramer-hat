import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  AlertCircle 
} from 'lucide-react';

const bangladeshDistricts = [
  'ঢাকা (Dhaka)',
  'চট্টগ্রাম (Chittagong)',
  'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)',
  'সিলেট (Sylhet)',
  'বরিশাল (Barisal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
  'যশোর (Jessore)',
  'দিনাজপুর (Dinajpur)',
  'কুমিল্লা (Comilla)',
  'বগুড়া (Bogura)',
  'গাজীপুর (Gazipur)',
  'নারায়ণগঞ্জ (Narayanganj)',
];

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    discount, 
    appliedCoupon,
    placeOrder, 
    siteSettings,
    language,
    t,
    showToast
  } = useStore();

  if (!isCheckoutOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState(bangladeshDistricts[0]);
  const [thana, setThana] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping calculation
  const isFreeDelivery = cartSubtotal >= siteSettings.free_shipping_threshold || appliedCoupon === 'FREESHIP';
  const isInsideDhaka = district.includes('Dhaka') || district.includes('ঢাকা');
  
  let shippingFee = 0;
  if (!isFreeDelivery) {
    if (deliveryMethod === 'express') {
      shippingFee = 120;
    } else {
      shippingFee = isInsideDhaka ? siteSettings.inside_dhaka_delivery : siteSettings.outside_dhaka_delivery;
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discount + shippingFee);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
    showToast(t('নম্বর কপি হয়েছে!', 'Number copied to clipboard!'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(t('অনুগ্রহ করে আপনার নাম লিখুন।', 'Please enter your name.'));
      return;
    }

    const cleanPhone = phone.trim().replace(/[- ]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMsg(t('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)', 'Valid 11-digit mobile number required (e.g. 01712345678)'));
      return;
    }

    if (!addressLine.trim()) {
      setErrorMsg(t('অনুগ্রহ করে আপনার পূর্ণ ঠিকানা লিখুন।', 'Please enter your delivery address.'));
      return;
    }

    if ((paymentMethod === 'bkash_send_money' || paymentMethod === 'nagad_send_money') && !transactionId.trim()) {
      setErrorMsg(t('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) লিখুন।', 'Please provide the Payment Transaction ID (TrxID).'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      placeOrder({
        customer_name: name,
        customer_phone: phone,
        customer_email: email || undefined,
        shipping_address: {
          district,
          thana: thana || 'Not Specified',
          address_line: addressLine,
        },
        delivery_method: isFreeDelivery ? 'free' : deliveryMethod,
        subtotal: cartSubtotal,
        shipping_cost: shippingFee,
        discount,
        total: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'verified',
        payment_transaction_id: transactionId || undefined,
        order_status: 'pending',
      });

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#2D5F3F] to-[#1e402a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-bengali">
                {t('চেকআউট ও দ্রুত অর্ডার ফর্ম', 'Single-Page Express Checkout')}
              </h2>
              <p className="text-xs text-emerald-100">
                {t('অর্ডার সম্পন্ন করতে নিচের তথ্যগুলো পূরণ করুন', 'Fill in your shipping details to place the order')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column (Inputs) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* 1. Contact Information */}
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#2D5F3F]" />
                <span>{t('১. ক্রেতার তথ্য', '1. Contact Information')}</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t('পূর্ণ নাম *', 'Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('যেমন: মোঃ তানভীর হাসান', 'e.g. Tanvir Hasan')}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {t('মোবাইল নম্বর (১১ ডিজিট) *', 'Phone Number (11 digits) *')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {t('ইমেইল (ঐচ্ছিক)', 'Email (Optional)')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#2D5F3F]" />
                <span>{t('২. ডেলিভারি ঠিকানা', '2. Delivery Address')}</span>
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {t('জেলা নির্বাচন করুন *', 'Select District *')}
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                    >
                      {bangladeshDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {t('থানা / উপজেলা', 'Area / Thana')}
                    </label>
                    <input
                      type="text"
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      placeholder={t('যেমন: উত্তরা, ধানমন্ডি বা সদর', 'e.g. Uttara / Sadar')}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t('পূর্ণ বিস্তারিত ঠিকানা *', 'Full Street Address *')}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder={t('বাড়ি নম্বর, রোড নম্বর, এলাকার নাম...', 'House no, Road no, Village/Area...')}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#2D5F3F]" />
                <span>{t('৩. পেমেন্ট মেথড নির্বাচন করুন', '3. Select Payment Method')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cash On Delivery */}
                <label 
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-[#2D5F3F] bg-[#2D5F3F]/5 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#2D5F3F]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#1A1A1A] block">
                      {t('ক্যাশ অন ডেলিভারি (COD)', 'Cash on Delivery')}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {t('পণ্য হাতে পেয়ে টাকা দিন', 'Pay when products arrive')}
                    </span>
                  </div>
                </label>

                {/* bKash Send Money */}
                <label 
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'bkash_send_money' 
                      ? 'border-[#D12053] bg-[#D12053]/5 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bkash_send_money'}
                    onChange={() => setPaymentMethod('bkash_send_money')}
                    className="mt-1 accent-[#D12053]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#D12053] block flex items-center gap-1">
                      <span>bKash (Send Money)</span>
                      <span className="text-[10px] bg-[#D12053] text-white px-1.5 py-0.2 rounded">ম্যানুয়াল</span>
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {t('বিকাশ অ্যাপ থেকে সেন্ড মানি', 'Send money via bKash App')}
                    </span>
                  </div>
                </label>

                {/* Nagad Send Money */}
                <label 
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'nagad_send_money' 
                      ? 'border-[#F7941D] bg-[#F7941D]/5 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'nagad_send_money'}
                    onChange={() => setPaymentMethod('nagad_send_money')}
                    className="mt-1 accent-[#F7941D]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#F7941D] block flex items-center gap-1">
                      <span>Nagad (Send Money)</span>
                      <span className="text-[10px] bg-[#F7941D] text-white px-1.5 py-0.2 rounded">ম্যানুয়াল</span>
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {t('নগদ অ্যাপ থেকে সেন্ড মানি', 'Send money via Nagad App')}
                    </span>
                  </div>
                </label>

                {/* bKash Gateway */}
                <label 
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'bkash_gateway' 
                      ? 'border-[#D12053] bg-[#D12053]/5 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bkash_gateway'}
                    onChange={() => setPaymentMethod('bkash_gateway')}
                    className="mt-1 accent-[#D12053]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#D12053] block">
                      bKash Gateway (Auto)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {t('সরাসরি অটোমেটিক পেমেন্ট', 'Automatic Instant Gateway')}
                    </span>
                  </div>
                </label>

              </div>

              {/* bKash Send Money Instruction Box */}
              {paymentMethod === 'bkash_send_money' && (
                <div className="mt-3 p-4 rounded-2xl bg-[#D12053]/10 border border-[#D12053]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#D12053]">
                      {t('বিকাশ মার্চেন্ট / পার্সোনাল নম্বর:', 'Merchant bKash Number:')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(siteSettings.bkash_number)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#D12053] text-white rounded-lg text-[11px] font-bold hover:bg-[#b01742]"
                    >
                      {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{siteSettings.bkash_number}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-700 leading-normal">
                    {t(
                      `১. আপনার bKash App থেকে ${siteSettings.bkash_number} নম্বরে ৳${grandTotal} Send Money করুন। ২. নিচের ঘরে আপনার বিকাশ নম্বর ও ট্রানজেকশন আইডি (TrxID) লিখুন।`,
                      `1. Send ৳${grandTotal} to ${siteSettings.bkash_number} via bKash App. 2. Enter your bKash phone and Transaction ID (TrxID) below.`
                    )}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder={t('যে বিকাশ নম্বর থেকে পাঠিয়েছেন', 'Your bKash Number')}
                      className="w-full px-3 py-2 bg-white border border-[#D12053]/40 rounded-xl text-xs"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        placeholder={t('TrxID (যেমন: 9K2M7P4Q1W)', 'TrxID (e.g. 9K2M7P4Q1W)')}
                        className="w-full px-3 py-2 bg-white border border-[#D12053]/40 rounded-xl text-xs uppercase font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setTransactionId('9K2M7P4Q1W')}
                        className="absolute right-2 top-2 text-[10px] text-[#D12053] font-bold hover:underline"
                      >
                        Sample
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nagad Send Money Instruction Box */}
              {paymentMethod === 'nagad_send_money' && (
                <div className="mt-3 p-4 rounded-2xl bg-[#F7941D]/10 border border-[#F7941D]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F7941D]">
                      {t('নগদ মার্চেন্ট / পার্সোনাল নম্বর:', 'Merchant Nagad Number:')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(siteSettings.nagad_number)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#F7941D] text-white rounded-lg text-[11px] font-bold hover:bg-[#db7e10]"
                    >
                      {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{siteSettings.nagad_number}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-700 leading-normal">
                    {t(
                      `১. নগদ অ্যাপ থেকে ${siteSettings.nagad_number} নম্বরে ৳${grandTotal} সেন্ড মানি করুন। ২. নিচের ঘরে নগদ নম্বর ও TrxID দিন।`,
                      `1. Send ৳${grandTotal} to ${siteSettings.nagad_number} via Nagad. 2. Enter your Nagad phone & TrxID below.`
                    )}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder={t('আপনার নগদ নম্বর', 'Your Nagad Number')}
                      className="w-full px-3 py-2 bg-white border border-[#F7941D]/40 rounded-xl text-xs"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        placeholder={t('TrxID (যেমন: 7N9K3P2Q8W)', 'TrxID (e.g. 7N9K3P2Q8W)')}
                        className="w-full px-3 py-2 bg-white border border-[#F7941D]/40 rounded-xl text-xs uppercase font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setTransactionId('7N9K3P2Q8W')}
                        className="absolute right-2 top-2 text-[10px] text-[#F7941D] font-bold hover:underline"
                      >
                        Sample
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column (Order Summary Sticky) */}
          <div className="md:col-span-5 bg-gray-50/80 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#1A1A1A] pb-3 border-b border-gray-200">
                {t('অর্ডার বিবরণী', 'Order Summary')} ({cart.length} {t('টি আইটেম', 'items')})
              </h3>

              {/* Items scroll */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 py-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title_en}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">
                          {language === 'bn' ? item.product.title_bn : item.product.title_en}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {item.selected_variant.name} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 shrink-0">
                      ৳{item.selected_variant.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t('পণ্যের সাবটোটাল', 'Subtotal')}</span>
                  <span className="font-bold text-gray-900">৳{cartSubtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>{t('কুপন ডিসকাউন্ট', 'Coupon Discount')}</span>
                    <span>-৳{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t('হোম ডেলিভারি চার্জ', 'Shipping Cost')}</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">{t('ফ্রি', 'Free')}</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-base font-black text-[#1A1A1A]">
                  <span>{t('সর্বমোট পরিশোধযোগ্য', 'Total Payable')}</span>
                  <span className="text-2xl text-[#2D5F3F]">৳{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-[#2D5F3F] hover:bg-[#1e402a] text-white font-black text-sm shadow-xl shadow-[#2D5F3F]/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">{t('অর্ডার প্রসেসিং হচ্ছে...', 'Processing Order...')}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#F4A261]" />
                    <span>{t('অর্ডার নিশ্চিত করুন (Place Order)', 'Confirm & Place Order')}</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('১০০% নিরাপদ ও সুরক্ষিত চেকআউট', '100% Encrypted & Secure Checkout')}</span>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
