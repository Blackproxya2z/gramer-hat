import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { siteSettings, language, setViewMode, t } = useStore();
  const [adminClickCount, setAdminClickCount] = React.useState(0);

  const handleSecretTrigger = () => {
    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        window.location.hash = '#admin';
        setViewMode('admin');
        return 0;
      }
      setTimeout(() => setAdminClickCount(0), 1200);
      return next;
    });
  };

  return (
    <footer className="bg-[#1e402a] text-white pt-12 pb-8 border-t border-[#2D5F3F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-emerald-900/60">
          
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSecretTrigger}
                className="w-10 h-10 rounded-xl bg-[#2D5F3F] flex items-center justify-center text-white font-serif font-black text-lg shadow-sm border border-emerald-700 cursor-default select-none focus:outline-none"
                title="Gramer Hat Heritage Seal"
              >
                GH
              </button>
              <div>
                <span className="text-xl font-bold text-white font-bengali">
                  {language === 'bn' ? siteSettings.site_name_bn : siteSettings.site_name_en}
                </span>
                <p className="text-[11px] text-emerald-200">
                  {language === 'bn' ? siteSettings.tagline_bn : siteSettings.tagline_en}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              {t(
                'গ্রামের হাট একটি নির্ভরযোগ্য ই-কমার্স উদ্যোগ। সুন্দরবনের প্রাকৃতিক চাকের মধু, ঐতিহ্যবাহী বিলোনা গাওয়া ঘি, ঘানি ভাঙা খাঁটি সরিষার তেল ও যশোরের খেজুরের পাটালি গুড় পৌঁছে দিচ্ছি সরাসরি আপনার দোরগোড়ায়।',
                'Gramer Hat is dedicated to delivering pure, unadulterated Bangladeshi agro essentials directly to your doorstep with guaranteed authenticity.'
              )}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs font-bold text-[#F4A261]">{t('নিরাপদ লেনদেন:', 'Payment Partners:')}</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#D12053] text-white font-bold">bKash</span>
                <span className="px-2 py-0.5 rounded bg-[#F7941D] text-white font-bold">Nagad</span>
                <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-bold">COD</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4A261]">
              {t('প্রয়োজনীয় লিংক', 'Quick Links')}
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#products-catalog" className="hover:text-white transition-colors">{t('সকল পণ্য', 'All Products')}</a></li>
              <li><a href="#products-catalog" className="hover:text-white transition-colors">{t('প্রাকৃতিক মধু', 'Pure Honey')}</a></li>
              <li><a href="#products-catalog" className="hover:text-white transition-colors">{t('গাওয়া বিলোনা ঘি', 'Bilona Ghee')}</a></li>
              <li><a href="#products-catalog" className="hover:text-white transition-colors">{t('ঘানি ভাঙা তেল', 'Cold-Pressed Oils')}</a></li>
              <li><a href="#products-catalog" className="hover:text-white transition-colors">{t('খেজুরের গুড়', 'Date Jaggery')}</a></li>
            </ul>
          </div>

          {/* Customer Care & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4A261]">
              {t('গ্রাহক সেবা ও ঠিকানা', 'Customer Care & Contact')}
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><span className="hover:text-white cursor-pointer">{t('অর্ডার ও রিটার্ন নীতিমালা', 'Order & Return Policy')}</span></li>
              <li><span className="hover:text-white cursor-pointer">{t('ডেলিভারি চার্জ ও নিয়মাবলী', 'Shipping Terms & Rates')}</span></li>
              <li><span className="hover:text-white cursor-pointer">{t('বিশুদ্ধতার সনদ ও অঙ্গীকার', 'Purity Guarantee')}</span></li>
            </ul>

            <div className="pt-2 text-xs text-gray-300 space-y-1">
              <p>
                <span className="text-emerald-300 font-semibold">{t('ফোন:', 'Phone:')}</span> {siteSettings.contact_phone}
              </p>
              <p>
                <span className="text-emerald-300 font-semibold">{t('ইমেইল:', 'Email:')}</span> {siteSettings.contact_email}
              </p>
              <p className="text-[11px] text-gray-400">
                <span className="text-emerald-300 font-semibold">{t('ঠিকানা:', 'Address:')}</span> {siteSettings.address}
              </p>
            </div>
          </div>

          {/* Developer Attribution Box (3 cols) - Prompt Highlight */}
          <div className="lg:col-span-3 space-y-3 bg-[#173221] p-5 rounded-2xl border border-emerald-800/80">
            <div className="text-xs font-bold text-[#F4A261] uppercase tracking-wider">
              Engineering & Support
            </div>

            <p className="text-xs text-gray-200 leading-normal">
              Need custom E-Commerce, PWA, or Headless CMS solutions for your business?
            </p>

            <div className="pt-1">
              <a
                href={siteSettings.developer_whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-[#1A1A1A] font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all group"
                title="Direct WhatsApp Chat with SINI IT"
              >
                <span>Development by: SINI IT →</span>
              </a>
            </div>

            <p className="text-[11px] text-emerald-300 text-center font-mono">
              WhatsApp Support: +8801647236359
            </p>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {siteSettings.site_name_bn} ({siteSettings.site_name_en}). All Rights Reserved.
          </p>

          <p className="flex items-center gap-1.5 text-gray-300">
            <span>Crafted for honest agro commerce by</span>
            <a
              href={siteSettings.developer_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F4A261] font-bold hover:underline"
            >
              SINI IT →
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};
