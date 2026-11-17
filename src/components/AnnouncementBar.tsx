import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Phone, ExternalLink } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { siteSettings, language, toggleLanguage, t } = useStore();

  return (
    <div className="bg-[#2D5F3F] text-white text-xs sm:text-sm font-medium py-1.5 px-3 border-b border-[#3d7c54]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <Sparkles className="w-4 h-4 text-[#F4A261] shrink-0 animate-pulse" />
          <span>
            {language === 'bn' ? siteSettings.announcement_bn : siteSettings.announcement_en}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
          <a
            href={siteSettings.developer_whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 bg-[#1e402a] hover:bg-[#F4A261] hover:text-[#1A1A1A] transition-colors px-2 py-0.5 rounded text-white font-medium"
            title="Chat directly on WhatsApp with SINI IT"
          >
            <Phone className="w-3 h-3 text-[#25D366]" />
            <span>Dev by: SINI IT</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-0.5 rounded font-semibold text-white border border-white/20"
          >
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
