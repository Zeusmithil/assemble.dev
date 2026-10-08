import React from 'react';
import { ROLE_LABELS } from '../../utils/roles';

export const RoleSetupPendingView = ({ role, onBack, onBecomeSponsor }) => {
  const label = ROLE_LABELS[role] || 'this role';

  return (
    <div className="px-4 md:px-10 max-w-[640px] mx-auto py-16 animate-fadeIn">
      <div className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-900/10 space-y-5 text-center">
        <h1 className="font-geist text-2xl font-bold text-[#00355f]">
          {label} setup is next
        </h1>
        <p className="font-inter text-sm text-gray-500 leading-relaxed">
          You are signed in, so we can keep your existing details. We are only collecting extra {label.toLowerCase()} information in a later step — starting with Sponsor first.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold border border-gray-200 bg-white/80 cursor-pointer"
          >
            Stay as Attendee
          </button>
          <button
            type="button"
            onClick={onBecomeSponsor}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#0f4c81] text-white cursor-pointer"
          >
            Set up Sponsor instead
          </button>
        </div>
      </div>
    </div>
  );
};
