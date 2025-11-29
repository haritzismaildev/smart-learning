'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiEndpoint('auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      // Save token to localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect based on role
      if (data.data.user.role === 'parent') {
        router.push('/dashboard/parent');
      } else {
        router.push('/dashboard/child');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Smart Learning
          </h1>
          <p className="text-gray-600">
            Belajar Jadi Menyenangkan!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nama@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              Daftar di sini
            </a>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">Demo Accounts:</p>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="bg-gray-50 p-2 rounded">
              <strong>Parent:</strong> parent@example.com / password123
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>Child:</strong> anak1@example.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}