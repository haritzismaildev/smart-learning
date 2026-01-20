'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';

interface User {
  id: number;
  full_name: string;
  age?: number;
  grade_level?: number;
}

interface Progress {
  subject: string;
  current_level: number;
  total_points: number;
  total_correct: number;
  total_attempted: number;
}

export default function ChildDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role !== 'child') {
      router.push('/dashboard/parent');
      return;
    }

    setUser(parsedUser);
    fetchProgress(token, parsedUser.id);
  }, [router]);

  const fetchProgress = async (token: string, userId: number) => {
    try {
      const response = await fetch(getApiEndpoint(`progress/${userId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.data.progress || []);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const mathProgress = progress.find(p => p.subject === 'math');
  const englishProgress = progress.find(p => p.subject === 'english');
  const arabicProgress = progress.find(p => p.subject === 'arabic'); // ⬅️ NEW!

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Halo, {user?.full_name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Siap belajar hari ini?
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Progress Summary - UPDATED WITH ARABIC! */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Math Progress */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6">
            <div className="text-5xl mb-3">🧮</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">Matematika</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Level</span>
                <span className="font-bold text-blue-900">{mathProgress?.current_level || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Poin</span>
                <span className="font-bold text-blue-900">{mathProgress?.total_points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Benar</span>
                <span className="font-bold text-blue-900">{mathProgress?.total_correct || 0}/{mathProgress?.total_attempted || 0}</span>
              </div>
            </div>
          </div>

          {/* English Progress */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6">
            <div className="text-5xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Bahasa Inggris</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Level</span>
                <span className="font-bold text-green-900">{englishProgress?.current_level || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Poin</span>
                <span className="font-bold text-green-900">{englishProgress?.total_points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Benar</span>
                <span className="font-bold text-green-900">{englishProgress?.total_correct || 0}/{englishProgress?.total_attempted || 0}</span>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* ARABIC PROGRESS - NEW!                    */}
          {/* ========================================= */}
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl p-6">
            <div className="text-5xl mb-3">🕌</div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">Bahasa Arab</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-emerald-700">Level</span>
                <span className="font-bold text-emerald-900">{arabicProgress?.current_level || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Poin</span>
                <span className="font-bold text-emerald-900">{arabicProgress?.total_points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Benar</span>
                <span className="font-bold text-emerald-900">{arabicProgress?.total_correct || 0}/{arabicProgress?.total_attempted || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Menu - UPDATED WITH ARABIC! */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <button
            onClick={() => router.push('/learn/math')}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition transform"
          >
            <div className="text-6xl mb-4">🧮</div>
            <h2 className="text-2xl font-bold mb-2">Belajar Matematika</h2>
            <p className="text-blue-100">Latihan hitung-hitungan seru!</p>
          </button>

          <button
            onClick={() => router.push('/learn/english')}
            className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition transform"
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">Belajar Bahasa Inggris</h2>
            <p className="text-green-100">Belajar kata-kata baru!</p>
          </button>

          {/* ========================================= */}
          {/* ARABIC LEARN BUTTON - NEW!                */}
          {/* ========================================= */}
          <button
            onClick={() => router.push('/learn/arabic')}
            className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition transform"
          >
            <div className="text-6xl mb-4">🕌</div>
            <h2 className="text-2xl font-bold mb-2">Belajar Bahasa Arab</h2>
            <p className="text-emerald-100">Mulai dari huruf hijaiyah!</p>
          </button>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-2">🏆</div>
            <div className="font-semibold text-gray-800">Prestasi</div>
          </button>

          <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-2">👨‍🏫</div>
            <div className="font-semibold text-gray-800">Guru</div>
          </button>

          <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-2">📊</div>
            <div className="font-semibold text-gray-800">Statistik</div>
          </button>

          <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-800">Setting</div>
          </button>
        </div>
      </div>
    </div>
  );
}