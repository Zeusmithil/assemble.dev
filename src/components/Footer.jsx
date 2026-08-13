import React from 'react';

export const Footer = ({ setActiveView }) => {
  return (
    <footer className="w-full py-10 px-4 md:px-10 max-w-[1280px] mx-auto mt-auto">
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-xs flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-3">
          <div className="font-geist text-xl font-black uppercase text-black flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">A</span>
            <span>assemble.dev</span>
          </div>
          <p className="font-inter text-xs text-gray-500 max-w-sm leading-relaxed">
            © 2026 assemble.dev. Discover events or bring your own to life — from planning to execution.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs font-inter">
          <div className="flex flex-col gap-2.5">
            <span className="font-geist text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ecosystem</span>
            <button onClick={() => setActiveView('discover')} className="text-gray-600 hover:text-black text-left transition-colors">
              Discover Events
            </button>
            <button onClick={() => setActiveView('create-event')} className="text-gray-600 hover:text-black text-left transition-colors">
              Organize an Event
            </button>
            <button onClick={() => setActiveView('venues-marketplace')} className="text-gray-600 hover:text-black text-left transition-colors">
              Venue Marketplace
            </button>
            <button onClick={() => setActiveView('speakers-marketplace')} className="text-gray-600 hover:text-black text-left transition-colors">
              Speakers Network
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-geist text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Company</span>
            <button onClick={() => setActiveView('about')} className="text-gray-600 hover:text-black text-left transition-colors">
              About Us
            </button>
            <button onClick={() => setActiveView('how-it-works')} className="text-gray-600 hover:text-black text-left transition-colors">
              How It Works
            </button>
          </div>

          <div className="flex flex-col gap-2.5 col-span-2 md:col-span-1">
            <span className="font-geist text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Support</span>
            <a href="#help" onClick={(e) => { e.preventDefault(); alert("Help Center active 24/7."); }} className="text-gray-600 hover:text-black transition-colors">
              Help Center
            </a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service"); }} className="text-gray-600 hover:text-black transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
