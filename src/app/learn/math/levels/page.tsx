'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LevelInfo {
  id: number;
  title: string;
  ageRange: string;
  description: string;
  topics: string[];
  color: string;
  icon: string;
  recommended: boolean;
}

export default function MathLevelSelectionPage() {
  const router = useRouter();
  const [userAge, setUserAge] = useState<number>(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (user) {
      const userData = JSON.parse(user);
      setUserAge(userData.age || 8);
    }
    
    setLoading(false);
  }, [router]);

  const levels: LevelInfo[] = [
    {
      id: 1,
      title: 'Level 1: Pemula',
      ageRange: '6-7 tahun',
      description: 'Belajar angka dan operasi dasar dengan menyenangkan!',
      topics: [
        'Mengenal angka 1-20',
        'Penjumlahan sederhana (1-10)',
        'Pengurangan sederhana (1-10)',
        'Mengenal bentuk geometri'
      ],
      color: 'from-green-400 to-emerald-500',
      icon: '🌱',
      recommended: userAge >= 6 && userAge <= 7
    },
    {
      id: 2,
      title: 'Level 2: Menengah',
      ageRange: '8-9 tahun',
      description: 'Tingkatkan kemampuan dengan perkalian dan pembagian!',
      topics: [
        'Penjumlahan & Pengurangan (1-50)',
        'Perkalian dasar (1-10)',
        'Pembagian sederhana',
        'Soal cerita simple'
      ],
      color: 'from-blue-400 to-cyan-500',
      icon: '🌟',
      recommended: userAge >= 8 && userAge <= 9
    },
    {
      id: 3,
      title: 'Level 3: Mahir',
      ageRange: '10-12 tahun',
      description: 'Master semua operasi matematika dengan soal menantang!',
      topics: [
        'Operasi campuran (1-100)',
        'Perkalian & Pembagian lanjut',
        'Pecahan sederhana',
        'Soal cerita kompleks'
      ],
      color: 'from-purple-400 to-pink-500',
      icon: '🏆',
      recommended: userAge >= 10 && userAge <= 12
    }
  ];

  const handleLevelSelect = (level: LevelInfo) => {
    // Store selected level in localStorage
    localStorage.setItem('selectedLevel', JSON.stringify(level));
    
    // Navigate to tutorial/material page
    router.push(`/learn/math/tutorial?level=${level.id}`);
  };

  const handleDirectPractice = (level: LevelInfo) => {
    // Store selected level and skip tutorial
    localStorage.setItem('selectedLevel', JSON.stringify(level));
    
    // Navigate directly to practice
    router.push(`/learn/math/practice?level=${level.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center">
        <div className="text-white text-2xl">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.push('/dashboard/child')}
            className="mb-6 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition backdrop-blur-sm"
          >
            ← Kembali ke Dashboard
          </button>
          
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            🧮 Pilih Level Belajar
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            Pilih level yang sesuai dengan kemampuanmu!
          </p>
          <p className="text-white/80 text-lg mt-2">
            Usia kamu: <span className="font-bold">{userAge} tahun</span>
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                level.recommended ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {level.recommended && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 font-bold text-sm">
                  ⭐ DIREKOMENDASIKAN UNTUK KAMU
                </div>
              )}
              
              <div className={`bg-gradient-to-r ${level.color} p-6 text-white text-center`}>
                <div className="text-6xl mb-3">{level.icon}</div>
                <h2 className="text-2xl font-bold mb-1">{level.title}</h2>
                <p className="text-white/90 text-sm">{level.ageRange}</p>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-center font-medium">
                  {level.description}
                </p>
                
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Yang akan kamu pelajari:</h3>
                  <ul className="space-y-2">
                    {level.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleLevelSelect(level)}
                    className={`w-full bg-gradient-to-r ${level.color} text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105`}
                  >
                    📚 Belajar Materi Dulu
                  </button>
                  <button
                    onClick={() => handleDirectPractice(level)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                  >
                    🎯 Langsung Latihan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
            <span>💡</span>
            <span>Tips Memilih Level:</span>
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Pilih level yang sesuai dengan usiamu untuk hasil terbaik</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Belajar materi dulu agar lebih paham sebelum latihan soal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Jika sudah mahir, kamu bisa langsung ke latihan soal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Tidak ada salahnya mencoba level yang lebih tinggi untuk tantangan!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}