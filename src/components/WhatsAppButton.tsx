import React from 'react';
import { useStore } from '../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { siteSettings } = useStore();

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-5 right-5 z-40 flex items-center print:hidden">
      <a
        href={siteSettings.store_whatsapp_url || 'https://wa.me/8801995180029'}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2.5 rounded-full bg-[#1e4029] hover:bg-[#25D366] text-white font-sans font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-600/40 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        title={`Chat on WhatsApp (${siteSettings.store_whatsapp || '+880 1995-180029'})`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] group-hover:bg-white animate-pulse"></span>
        <span className="tracking-wide">WhatsApp Order · 01995-180029</span>
      </a>
    </aside>
  );
};
