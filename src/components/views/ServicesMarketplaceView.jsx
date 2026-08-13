import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../../data/initialData';

export const ServicesMarketplaceView = ({ onBack }) => {
  const [bookedService, setBookedService] = useState(null);

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-6 animate-fadeIn">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <span>← Back to Dashboard</span>
        </button>
      )}

      {/* Header */}
      <div className="border-b border-[#e1e3e4] pb-6">
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          Event Logistics & Suppliers
        </span>
        <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
          Catering, AV & Vendor Services
        </h1>
        <p className="font-inter text-sm text-[#5f5e5e] mt-1">
          Hire coffee bars, 4K videography teams, sound engineers, and security personnel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_SERVICES.map((srv) => (
          <div key={srv.id} className="bg-white border border-[#e1e3e4] rounded-2xl p-5 shadow-2xs flex gap-5 items-center">
            <img src={srv.image} alt={srv.name} className="w-24 h-24 rounded-xl object-cover" />
            <div className="space-y-1.5 flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-geist font-bold text-[#00355f] text-base">{srv.name}</h3>
                <span className="text-xs font-bold text-[#0f4c81]">${srv.estPrice} Est.</span>
              </div>
              <p className="font-inter text-xs font-semibold text-[#727780]">{srv.category}</p>
              <p className="font-inter text-xs text-[#5f5e5e] line-clamp-2">{srv.description}</p>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs font-bold text-[#1a853e]">⭐ {srv.rating} ({srv.reviewsCount} reviews)</span>
                <button
                  onClick={() => setBookedService(srv)}
                  className="px-4 py-1.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-lg text-xs font-bold"
                >
                  Book Vendor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-scaleUp">
            <div className="w-12 h-12 bg-[#e2f7e2] text-[#1a853e] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <h3 className="font-geist text-xl font-bold text-[#00355f] text-center">Service Reserved!</h3>
            <p className="font-inter text-xs text-[#5f5e5e] text-center">
              Reserved <span className="font-bold text-[#00355f]">{bookedService.name}</span> for your event pipeline.
            </p>
            <button onClick={() => setBookedService(null)} className="w-full py-3 bg-[#0f4c81] text-white rounded-xl font-bold text-xs">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
