// import React from 'react';
// import { Link } from 'react-router-dom';

// const RegistrationForm = () => {
//   return (
//     <div className="lg:col-span-3">
//       <div className="relative bg-surface-container-lowest border-[0.5px] border-outline-variant/30 lg:rounded-r-lg lg:rounded-l-none rounded-b-lg p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(28,28,24,0.08)] h-full">
//         {/* Card Header */}
//         <div className="mb-10">
//           <h1 className="font-headline text-4xl md:text-5xl text-primary leading-tight mb-4">Create Your Account</h1>
//           <p className="text-on-surface-variant font-body text-lg max-w-sm">Join our community of urban historians and cultural explorers.</p>
//         </div>

//         {/* Registration Form */}
//         <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
//           <div className="space-y-1">
//             <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="username">Username</label>
//             <input className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none" id="username" name="username" placeholder="explorer123" type="text"/>
//           </div>

//           <div className="space-y-1">
//             <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="email">Email Address</label>
//             <input className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none" id="email" name="email" placeholder="explorer@heritage.in" type="email" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1">
//               <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="password">Password</label>
//               <input className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none" id="password" name="password" placeholder="••••••••" type="password" />
//             </div>
//             <div className="space-y-1">
//               <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="confirm_password">Confirm Password</label>
//               <input className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none" id="confirm_password" name="confirm_password" placeholder="••••••••" type="password" />
//             </div>
//           </div>

//           <div className="pt-4 space-y-4">
//             <button className="w-full bg-primary-container text-on-primary font-label text-sm uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary-container/20 hover:bg-primary transition-all active:scale-[0.98]" type="submit">
//               Begin Exploration
//             </button>
//           </div>
//         </form>

//         <div className="mt-10 text-center">
//           <p className="font-body text-sm text-on-surface-variant">
//             Already have an account?
//             <Link to="/signin" className="text-primary-container font-bold hover:text-secondary transition-colors underline underline-offset-8 decoration-secondary/30 ml-1">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirm_password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const axios = await import('axios').then(m => m.default || m);
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup/`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = res.data;

      if (res.status !== 201) { // 201 is created

        // Surface the first Django validation error
        const firstError =
          data.error ??
          Object.values(data).flat().find(Boolean) ??
          'Registration failed. Please try again.';
        setError(firstError);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      if (data.email) localStorage.setItem('email', data.email);
      navigate('/sites');
    } catch (err) {
      const data = err.response?.data;
      const firstError =
        data?.error ??
        Object.values(data ?? {}).flat().find(Boolean);

      setError(
        firstError ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot reach the server. Make sure the backend is running and CORS allows this frontend origin.'
          : 'Registration failed. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="relative bg-surface-container-lowest border-[0.5px] border-outline-variant/30 lg:rounded-r-lg lg:rounded-l-none rounded-b-lg p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(28,28,24,0.08)] h-full">
        {/* Card Header */}
        <div className="mb-10">
          <h1 className="font-headline text-4xl md:text-5xl text-primary leading-tight mb-4">Create Your Account</h1>
          <p className="text-on-surface-variant font-body text-lg max-w-sm">Join our community of urban historians and cultural explorers.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="username">Username</label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none"
              id="username" name="username" placeholder="explorer123" type="text"
              value={formData.username} onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="email">Email Address</label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none"
              id="email" name="email" placeholder="explorer@heritage.in" type="email"
              value={formData.email} onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="password">Password</label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none"
                id="password" name="password" placeholder="••••••••" type="password"
                value={formData.password} onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant font-medium" htmlFor="confirm_password">Confirm Password</label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-2.5 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-on-surface/30 px-1 outline-none"
                id="confirm_password" name="confirm_password" placeholder="••••••••" type="password"
                value={formData.confirm_password} onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button
              className="w-full bg-primary-container text-on-primary font-label text-sm uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary-container/20 hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account…' : 'Begin Exploration'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="font-body text-sm text-on-surface-variant">
            Already have an account?
            <Link to="/signin" className="text-primary-container font-bold hover:text-secondary transition-colors underline underline-offset-8 decoration-secondary/30 ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
