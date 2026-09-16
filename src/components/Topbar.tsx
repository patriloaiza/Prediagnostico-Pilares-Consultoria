import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <header
      id="topbar-main"
      className="sticky top-0 z-40 bg-[#111111] text-white border-b-4 border-[#D7192B] shadow-md"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D7192B]" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide text-white">
                CREA Y MONETIZA®
              </span>
              <span className="hidden sm:inline-block text-xs text-gray-400 font-medium">
                · Prediagnóstico Consultoría Requerida
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-medium">
            Patricia Loaiza
          </div>
        </div>
      </div>
    </header>
  );
};
