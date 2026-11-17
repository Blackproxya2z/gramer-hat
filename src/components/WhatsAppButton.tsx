import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { siteSettings, language, t } = useStore();

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group print:hidden">
      <div className="hidden sm:block bg-white text-gray-800 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {t('SINI IT হোয়াটসঅ্যাপ সাপোর্ট', 'SINI IT WhatsApp Support')}
      </div>

      <a
        href={siteSettings.developer_whatsapp_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all p-3"
        title="Chat with SINI IT on WhatsApp (+8801647236359)"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
};
