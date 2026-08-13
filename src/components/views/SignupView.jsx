import React, { useState } from 'react';

export const SignupView = ({ navigate, onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('attendee'); // 'attendee' or 'organizer'
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Fetch existing users from local storage
    const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');
    
    // Default seeded users to check against duplicates
    const defaultEmails = ['john.doe@example.com', 'attendee@assemble.dev', 'organizer@assemble.dev'];
    const emailExists = defaultEmails.includes(email.toLowerCase()) || localUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      setError('An account with this email already exists. Please log in instead.');
      return;
    }

    // Save new user
    const newUser = {
      name: fullName,
      email: email,
      phone: phone,
      password: password,
      role: role
    };

    localUsers.push(newUser);
    localStorage.setItem('assemble_users', JSON.stringify(localUsers));

    // Simulate login success immediately
    onSignupSuccess({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    alert('Account created successfully. Welcome to assemble.dev!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-lg border border-[#e1e3e4] space-y-6">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold font-geist">A</span>
          <span className="font-geist text-xl font-bold text-[#00355f]">assemble.dev</span>
        </div>

        <div className="text-center">
          <h2 className="font-geist text-2xl font-bold text-[#00355f]">Create Your Account</h2>
          <p className="font-inter text-xs text-[#5f5e5e] mt-1.5">
            Join assemble.dev to discover or organize experiences
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
            />
          </div>

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
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Confirm
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              I want to use assemble.dev as an:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('attendee')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                  role === 'attendee'
                    ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-2xs'
                    : 'border-[#c2c7d1] bg-[#f8f9fa] text-[#42474f] hover:bg-gray-100'
                }`}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                  role === 'organizer'
                    ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-2xs'
                    : 'border-[#c2c7d1] bg-[#f8f9fa] text-[#42474f] hover:bg-gray-100'
                }`}
              >
                Organizer
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl font-geist font-bold text-xs shadow-xs transition-all active:scale-98"
          >
            Create Account
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#edeeef]">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-[#0f4c81] hover:underline"
          >
            Already have an account? Log In
          </button>
        </div>
      </div>
    </div>
  );
};
