'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';

interface User {
  id: number;
  full_name: string;
  email: string;
  age?: number;
  grade_level?: number;
}

interface ChildProgress {
  child: {
    id: number;
    full_name: string;
    age: number;
    grade_level: number;
  };
  statistics: {
    total_sessions: number;
    total_questions_answered: number;
    total_correct: number;
    total_points: number;
    avg_accuracy: number;
  };
}

export default function ParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<ChildProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role !== 'parent') {
      router.push('/dashboard/child');
      return;
    }

    setUser(parsedUser);
    fetchChildrenProgress(token);
  }, [router]);

  const fetchChildrenProgress = async (token: string) => {
  try {
    const response = await fetch(getApiEndpoint('progress/parent/children'), {
      method: 'POST',  // Ini menggunakan POST
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch children progress');
    }

    const data = await response.json();
    setChildren(data.data.children || []);
  } catch (error) {
    console.error('Error fetching children progress:', error);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                👨‍👩‍👧‍👦 Dashboard Orang Tua
              </h1>
              <p className="text-gray-600 mt-1">
                Selamat datang, {user?.full_name}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Children Progress Cards */}
        {children.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Belum Ada Data Anak
            </h2>
            <p className="text-gray-600 mb-6">
              Silakan daftarkan akun anak Anda terlebih dahulu
            </p>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Daftarkan Anak
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((childData) => (
              <div
                key={childData.child.id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition cursor-pointer"
                onClick={() => router.push(`/progress/${childData.child.id}`)}
              >
                {/* Child Info */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                    👦
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {childData.child.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Umur: {childData.child.age} tahun • Kelas {childData.child.grade_level}
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sesi</span>
                    <span className="font-bold text-blue-600">
                      {childData.statistics.total_sessions}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Soal Dijawab</span>
                    <span className="font-bold text-green-600">
                      {childData.statistics.total_questions_answered}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Jawaban Benar</span>
                    <span className="font-bold text-purple-600">
                      {childData.statistics.total_correct}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Poin</span>
                    <span className="font-bold text-orange-600">
                      {childData.statistics.total_points}
                    </span>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Akurasi</span>
                      <span className="text-sm font-bold text-gray-800">
                        {childData.statistics.avg_accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${childData.statistics.avg_accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition">
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/register')}
              className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <div className="font-semibold text-gray-800">Tambah Anak</div>
              <div className="text-sm text-gray-600">Daftarkan akun baru</div>
            </button>
            
            <button className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition text-left">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold text-gray-800">Laporan</div>
              <div className="text-sm text-gray-600">Lihat laporan lengkap</div>
            </button>
            
            <button className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition text-left">
              <div className="text-3xl mb-2">⚙️</div>
              <div className="font-semibold text-gray-800">Pengaturan</div>
              <div className="text-sm text-gray-600">Kelola akun</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}