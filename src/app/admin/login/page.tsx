'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md border-4 border-black bg-white rounded-2xl shadow-[8px_8px_0px_0px_#111111] overflow-hidden"
      >
        {/* Header banner */}
        <div className="bg-[#2B1D14] text-white px-6 py-6 border-b-4 border-black text-center">
          <span className="inline-block border-2 border-white bg-[#FF5000] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 mb-2">
            Control Panel
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Nutri Dates Admin
          </h2>
        </div>

        {/* Form body */}
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          {error && (
            <div className="border-2 border-red-500 bg-red-50 rounded-lg p-3.5 text-xs font-bold text-red-600 uppercase">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-black mb-2">
              Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-black rounded-lg px-4 py-2.5 text-sm bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-2">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black rounded-lg px-4 py-2.5 text-sm bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
              placeholder="Password"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5000] text-white border-2 border-black rounded-lg py-3.5 text-sm font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_#111111] transition-transform hover:translate-y-[-1px] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
