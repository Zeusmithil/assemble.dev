import React from 'react';

export const TicketModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-6 animate-scaleUp relative overflow-hidden">
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-[#edeeef] pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f4c81] text-2xl filled">auto_awesome</span>
            <span className="font-geist text-lg font-bold text-[#00355f]">Digital Pass</span>
          </div>
          <button onClick={onClose} className="p-1 text-[#727780] hover:text-[#191c1d]">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Styled Ticket Body */}
        <div className="bg-[#f8f9fa] border border-[#c2c7d1] rounded-2xl p-5 space-y-4 relative">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-[#0f4c81] bg-[#d2e4ff] px-2.5 py-0.5 rounded uppercase">
                {ticket.ticketId}
              </span>
              <h3 className="font-geist text-lg font-bold text-[#00355f] mt-2 leading-snug">
                {ticket.eventTitle}
              </h3>
            </div>
            <span className="text-[10px] bg-[#e2f7e2] text-[#1a853e] font-bold px-2 py-0.5 rounded uppercase">
              {ticket.status}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#5f5e5e] font-inter">
            <p><span className="font-bold text-[#00355f]">Attendee:</span> {ticket.userName}</p>
            <p><span className="font-bold text-[#00355f]">Date & Time:</span> {ticket.date} • {ticket.time}</p>
            <p><span className="font-bold text-[#00355f]">Venue:</span> {ticket.venue}</p>
          </div>

          {/* Dynamic QR Code Canvas Simulation */}
          <div className="pt-4 border-t border-dashed border-[#c2c7d1] flex flex-col items-center gap-2">
            <div className="w-40 h-40 bg-white p-3 border border-[#e1e3e4] rounded-xl flex items-center justify-center shadow-xs">
              <svg className="w-full h-full text-[#00355f]" viewBox="0 0 100 100" fill="currentColor">
                {/* QR Code pattern graphic */}
                <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                <rect x="38" y="10" width="8" height="20" fill="currentColor" />
                <rect x="50" y="5" width="12" height="12" fill="currentColor" />
                <rect x="38" y="38" width="24" height="24" rx="2" fill="currentColor" />
                <rect x="70" y="38" width="15" height="10" fill="currentColor" />
                <rect x="70" y="70" width="10" height="20" fill="currentColor" />
                <rect x="85" y="80" width="10" height="10" fill="currentColor" />
                <rect x="40" y="70" width="20" height="10" fill="currentColor" />
                <rect x="55" y="85" width="10" height="10" fill="currentColor" />
              </svg>
            </div>
            <span className="font-mono text-[11px] text-[#727780] font-bold tracking-widest uppercase">
              {ticket.qrCodeData}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 border border-[#727780] rounded-xl font-geist font-bold text-xs text-[#00355f] hover:bg-[#f3f4f5] flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#0f4c81] text-white rounded-xl font-geist font-bold text-xs hover:bg-[#00355f]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
