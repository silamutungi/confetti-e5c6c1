import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-ink text-paper">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary rounded">
          🎊 Confetti
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
        <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-ink md:bg-transparent p-4 md:p-0 gap-3 md:gap-4 items-start md:items-center`}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-paper/80 hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">Dashboard</Link>
              <span className="text-sm text-paper/50 hidden md:inline">{user.email}</span>
              <button onClick={handleLogout} className="text-sm text-paper/80 hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-paper/80 hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-primary text-white font-mono text-sm min-h-[44px] px-5 py-2 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary flex items-center">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}