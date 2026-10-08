import React, { useState } from 'react';



export const LoginView = ({ navigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');

    const defaultUsers = [
      { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'attendee', capabilities: ['attendee'] },
      { name: 'Alice Smith', email: 'attendee@eventhorizon.dev', password: 'password123', role: 'attendee', capabilities: ['attendee'] },
      { name: 'Alice Smith', email: 'attendee@assemble.dev', password: 'password123', role: 'attendee', capabilities: ['attendee'] },
      { name: 'Bob Johnson', email: 'organizer@eventhorizon.dev', password: 'password123', role: 'organizer', capabilities: ['organizer', 'attendee'] },
      { name: 'Bob Johnson', email: 'organizer@assemble.dev', password: 'password123', role: 'organizer', capabilities: ['organizer', 'attendee'] },
      { name: 'Dr. Elena Rostova', email: 'speaker@eventhorizon.dev', password: 'password123', role: 'speaker', capabilities: ['speaker', 'attendee'], speakerProfile: { title: 'Principal AI Researcher', organization: 'Stanford AI Lab', topics: ['AI Ethics', 'Large Language Models'], feeType: 'fee', feeAmount: '3500', currency: '€', availability: 'Available for Bookings' } },
      { name: 'Dr. Elena Rostova', email: 'speaker@assemble.dev', password: 'password123', role: 'speaker', capabilities: ['speaker', 'attendee'], speakerProfile: { title: 'Principal AI Researcher', organization: 'Stanford AI Lab', topics: ['AI Ethics', 'Large Language Models'], feeType: 'fee', feeAmount: '3500', currency: '€', availability: 'Available for Bookings' } },
      { name: 'Marcus Vance', email: 'sponsor@eventhorizon.dev', password: 'password123', role: 'sponsor', capabilities: ['sponsor', 'attendee', 'organizer'], sponsorProfile: { companyName: 'TechNova Solutions', industry: 'Enterprise AI & Cloud', budgetRange: '€10,000+', budgetAmount: 25000 } },
      { name: 'Marcus Vance', email: 'sponsor@assemble.dev', password: 'password123', role: 'sponsor', capabilities: ['sponsor', 'attendee', 'organizer'], sponsorProfile: { companyName: 'TechNova Solutions', industry: 'Enterprise AI & Cloud', budgetRange: '€10,000+', budgetAmount: 25000 } },
      { name: 'David Chen', email: 'venue@eventhorizon.dev', password: 'password123', role: 'venue', capabilities: ['venue', 'attendee'], venueProfile: { venueName: 'Sir Mutha Concert Hall', capacity: 500, type: 'Auditorium' } },
      { name: 'David Chen', email: 'venue@assemble.dev', password: 'password123', role: 'venue', capabilities: ['venue', 'attendee'], venueProfile: { venueName: 'Sir Mutha Concert Hall', capacity: 500, type: 'Auditorium' } },
    ];

    const allUsers = [...defaultUsers, ...localUsers];

    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setError('Incorrect email or password. Please try again.');
    }
  };



  const handleBack = () => {
    const redirectPath = localStorage.getItem('assemble_redirect');
    if (redirectPath) {
      localStorage.removeItem('assemble_redirect');
      navigate(redirectPath);
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-12 text-left animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl shadow-blue-900/10 space-y-6">
        <div className="flex items-center justify-between border-b border-[#edeeef] pb-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0f4c81] hover:text-[#00355f] hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-blue-100"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold font-geist">E</span>
            <span className="font-geist text-lg font-bold text-[#00355f]">Event Horizon</span>
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-geist text-2xl font-bold text-[#00355f]">Welcome Back</h2>
          <p className="font-inter text-xs text-[#5f5e5e] mt-1.5">
            Sign in to access your multi-role dashboard & live experiences
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your email (simulated).')}
                className="text-[10px] font-bold text-[#0f4c81] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-2xl font-geist font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
          >
            Log In to Account
          </button>
        </form>



        <div className="text-center pt-2 border-t border-[#edeeef]">
          <button
            onClick={() => navigate('/signup')}
            className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
          >
            Don’t have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginView;
