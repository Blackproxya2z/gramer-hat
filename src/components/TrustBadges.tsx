import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white border-b border-[#e5e7eb] py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* 1. Thoughtfully Sourced (Node 2:72 in Figma) */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2D5F3F] font-mono font-bold text-xs">
              01
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[14px] text-[#2D5F3F]">
                Thoughtfully sourced
              </h3>
              <p className="font-sans font-normal text-[12px] text-[#6b7280] mt-0.5">
                From the heart of rural Bangladesh
              </p>
            </div>
          </div>

          {/* 2. Quality Comes First (Node 2:79 in Figma) */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2D5F3F] font-mono font-bold text-xs">
              02
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[14px] text-[#2D5F3F]">
                Quality comes first
              </h3>
              <p className="font-sans font-normal text-[12px] text-[#6b7280] mt-0.5">
                Care in every small harvest detail
              </p>
            </div>
          </div>

          {/* 3. Delivered With Care (Node 2:86 in Figma) */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2D5F3F] font-mono font-bold text-xs">
              03
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[14px] text-[#2D5F3F]">
                Delivered with care
              </h3>
              <p className="font-sans font-normal text-[12px] text-[#6b7280] mt-0.5">
                From rural soil directly to your door
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
