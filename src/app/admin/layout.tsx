'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const isLoginPage = pathname === '/admin/login';

  // Check authentication
  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true); // Don't block login page
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        
        if (res.ok && data.authenticated) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push('/admin/login');
        }
      } catch (err) {
        console.error(err);
        setAuthorized(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // While checking authorization, render a clean loading spinner
  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-4" />
          <p className="text-xs font-black uppercase tracking-wider text-black">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  // If on login page, just render the child
  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'Orders Feed', path: '/admin/orders', icon: '📦' },
    { label: 'Manage Products', path: '/admin/products', icon: '🏷️' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9F7F5] font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-[#2B1D14] text-white border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between">
        <div>
          {/* Logo Brand area */}
          <div className="p-6 border-b-2 border-black flex items-center justify-between">
            <div>
              <span className="inline-block border-2 border-white bg-[#FF5000] text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 mb-1">
                Admin Portal
              </span>
              <h1 className="font-sans text-xl font-black uppercase tracking-tighter">
                Nutri Dates
              </h1>
            </div>
            <Link 
              href="/"
              target="_blank"
              className="text-xs font-bold border border-stone-600 rounded px-2 py-1 bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              Live Site ↗
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider border-2 transition-all ${
                    isActive
                      ? 'border-black bg-[#FF5000] text-white shadow-[2px_2px_0px_0px_#111111]'
                      : 'border-transparent text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-6 border-t border-stone-800 space-y-4">
          <div className="text-[10px] text-stone-400 font-semibold uppercase leading-tight">
            Logged in as:<br />
            <span className="text-white font-bold">Administrator</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border-2 border-black bg-stone-800 hover:bg-red-950 text-white rounded-lg py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
          >
            🚪 Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Admin Content area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  );
}
