import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (email.length > 320 || password.length > 128) {
      setError('Invalid input length.');
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Invalid email or password. Please try again.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center px-4 py-16 md:py-24">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl font-bold text-center mb-8">Welcome back</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={320}
              required
              className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              required
              className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your password"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm border border-red-300 bg-red-50 px-3 py-2 rounded-lg" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-mono font-medium min-h-[44px] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm text-ink/60 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-dark underline focus:outline-none focus:ring-2 focus:ring-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}