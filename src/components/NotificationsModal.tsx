import React from 'react';

interface NotificationsModalProps {
  notifications: {
    id: string;
    title: string;
    desc: string;
    time: string;
    icon: string;
    type: 'alert' | 'info' | 'success';
  }[];
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onClear,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 border-t-4 border-[#0037b0]">
        <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[20px]">
              notifications_active
            </span>
            <h3 className="text-[15px] font-bold text-[#0b1c30]">Statutory Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#434655] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-[#747686] text-[12px]">
              No unread regulatory notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-[#eff4ff]/60 border border-[#c4c5d7]/40 flex items-start gap-2.5"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 ${
                    n.type === 'alert'
                      ? 'bg-[#ba1a1a]'
                      : n.type === 'success'
                      ? 'bg-emerald-600'
                      : 'bg-[#0037b0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#0b1c30]">{n.title}</span>
                    <span className="text-[10px] font-mono text-[#747686]">{n.time}</span>
                  </div>
                  <span className="text-[11px] text-[#434655] mt-0.5 leading-snug">{n.desc}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#c4c5d7]/30">
          <button
            onClick={onClear}
            className="text-[12px] text-[#747686] hover:text-[#0b1c30] font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0037b0] text-white text-[12px] font-semibold hover:bg-[#1d4ed8]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
