import React, { useState } from 'react';
import { budgetAmountFromRange } from '../../utils/roles';

const BUDGET_RANGES = ['Under €500', '€500–€1,000', '€1,000–€5,000', '€5,000–€10,000', '€10,000+', 'Custom amount'];
const EVENT_TYPES = ['Technology', 'Business', 'Education', 'Community', 'Sports', 'Startup', 'Entertainment', 'Other'];
const INDUSTRIES = [
  'Technology & Software',
  'Fintech & Banking',
  'Marketing & Design',
  'Clean Energy & Infrastructure',
  'Healthcare & BioTech',
  'Education & EdTech',
];

export const BecomeSponsorView = ({ currentUser, onComplete, onCancel }) => {
  const [companyName, setCompanyName] = useState(currentUser?.sponsorProfile?.companyName || '');
  const [industry, setIndustry] = useState(currentUser?.sponsorProfile?.industry || 'Technology & Software');
  const [budgetRange, setBudgetRange] = useState(currentUser?.sponsorProfile?.budgetRange || '€1,000–€5,000');
  const [customAmount, setCustomAmount] = useState('');
  const [supportedEventTypes, setSupportedEventTypes] = useState(
    currentUser?.sponsorProfile?.supportedEventTypes || []
  );
  const [companyWebsite, setCompanyWebsite] = useState(currentUser?.sponsorProfile?.website || '');
  const [error, setError] = useState('');

  const toggleType = (item) => {
    setSupportedEventTypes((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    if (budgetRange === 'Custom amount' && !(Number(customAmount) > 0)) {
      setError('Enter the amount you want to sponsor.');
      return;
    }

    onComplete({
      companyName: companyName.trim(),
      industry,
      website: companyWebsite.trim(),
      budgetRange,
      budgetAmount: budgetAmountFromRange(budgetRange, customAmount),
      supportedEventTypes,
    });
  };

  return (
    <div className="px-4 md:px-10 max-w-[720px] mx-auto py-8 animate-fadeIn">
      <div className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4c81]">
              Activate Sponsor
            </span>
            <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-1">
              A few details to sponsor events
            </h1>
            <p className="font-inter text-sm text-gray-500 mt-2 leading-relaxed">
              We already have your account. Add only what we need for sponsorship.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <div className="rounded-2xl bg-blue-50/70 border border-blue-100 px-4 py-3 text-xs text-[#00355f] space-y-1">
          <p>
            <span className="font-bold">Name</span> · {currentUser?.name}
          </p>
          <p>
            <span className="font-bold">Email</span> · {currentUser?.email}
          </p>
          {(currentUser?.location || currentUser?.demographics) && (
            <p>
              <span className="font-bold">Profile</span> · {[currentUser?.location, currentUser?.demographics].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Company name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. TechNova Solutions"
              className="w-full px-3.5 py-2.5 bg-white/80 border border-white/80 rounded-xl text-sm focus:outline-none focus:border-[#0f4c81]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/80 border border-white/80 rounded-xl text-sm font-semibold"
              >
                {INDUSTRIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Company website <span className="text-gray-400 normal-case">(optional)</span>
              </label>
              <input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2.5 bg-white/80 border border-white/80 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Amount you want to sponsor
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUDGET_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setBudgetRange(range)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    budgetRange === range
                      ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                      : 'bg-white/70 text-gray-600 border-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            {budgetRange === 'Custom amount' && (
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount in €"
                className="w-full px-3.5 py-2.5 bg-white/80 border border-white/80 rounded-xl text-sm"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Event types you want to support <span className="text-gray-400 normal-case">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    supportedEventTypes.includes(t)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white/70 text-gray-600 border-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-2xl font-geist font-bold text-sm cursor-pointer"
          >
            Continue as Sponsor
          </button>
        </form>
      </div>
    </div>
  );
};
