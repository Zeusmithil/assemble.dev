import React, { useState } from 'react';

export const LoginView = ({ navigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Fetch local storage users
    const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');
    
    // Seed default users
    const defaultUsers = [
      { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'attendee' },
      { name: 'Alice Smith', email: 'attendee@assemble.dev', password: 'password123', role: 'attendee' },
      { name: 'Bob Johnson', email: 'organizer@assemble.dev', password: 'password123', role: 'organizer' }
    ];

    const allUsers = [...defaultUsers, ...localUsers];

    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (matchedUser) {
      onLoginSuccess({
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role
      });
      
      // Redirect to intended dashboard or standard dashboard
      const redirectPath = localStorage.getItem('assemble_redirect') || '/dashboard';
      localStorage.removeItem('assemble_redirect');
      navigate(redirectPath);
    } else {
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-lg border border-[#e1e3e4] space-y-6">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold font-geist">A</span>
          <span className="font-geist text-xl font-bold text-[#00355f]">assemble.dev</span>
        </div>

        <div className="text-center">
          <h2 className="font-geist text-2xl font-bold text-[#00355f]">Welcome Back</h2>
          <p className="font-inter text-xs text-[#5f5e5e] mt-1.5">
            Sign in to access your registered tickets & events
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
            className="w-full py-4 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl font-geist font-bold text-xs shadow-xs transition-all active:scale-98"
          >
            Login
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#edeeef]">
          <button
            onClick={() => navigate('/signup')}
            className="text-xs font-bold text-[#0f4c81] hover:underline"
          >
            Don’t have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
