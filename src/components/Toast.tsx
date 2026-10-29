import React from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'info', visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-none animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#213145]/95 backdrop-blur-xl text-white p-3.5 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0037b0] flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined text-[18px] text-[#ffdcc3]">{icon}</span>
        </div>
        <p className="text-[12px] font-medium leading-snug flex-1 font-['Public_Sans']">{message}</p>
      </div>
    </div>
  );
};
