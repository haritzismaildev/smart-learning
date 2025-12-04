'use client'

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: '🧮',
      title: 'Matematika',
      description: 'Belajar hitung-hitungan dengan cara yang menyenangkan',
      color: 'from-blue-100 to-blue-50',
      textColor: 'text-blue-700',
      link: '/info/math'
    },
    {
      icon: '📚',
      title: 'Bahasa Inggris',
      description: 'Pelajari kosakata baru setiap hari',
      color: 'from-green-100 to-green-50',
      textColor: 'text-green-700',
      link: '/info/english'
    },
    {
      icon: '🏆',
      title: 'Sistem Poin',
      description: 'Kumpulkan poin dan raih prestasi',
      color: 'from-purple-100 to-purple-50',
      textColor: 'text-purple-700',
      link: '/info/points'
    },
    {
      icon: '📊',
      title: 'Laporan Progress',
      description: 'Orang tua dapat memantau perkembangan anak',
      color: 'from-orange-100 to-orange-50',
      textColor: 'text-orange-700',
      link: '/info/progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 bg-white/90 backdrop-blur rounded-3xl p-12 shadow-2xl">
          <div className="text-7xl mb-6">🎓</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Smart Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Aplikasi Pembelajaran Interaktif untuk Anak SD
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-gray-700 font-bold px-8 py-4 rounded-xl hover:shadow-lg border-2 border-gray-200 transform hover:scale-105 transition"
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Feature Cards - Now Clickable! */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => router.push(feature.link)}
              className={`bg-gradient-to-br ${feature.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left w-full cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${feature.textColor} mb-2`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <span>Klik untuk info lengkap</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            ⭐ Kenapa Pilih Smart Learning?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎮</div>
              <h4 className="font-bold text-gray-800 mb-1">Belajar Sambil Bermain</h4>
              <p className="text-sm text-gray-600">Metode gamifikasi yang fun!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👨‍👩‍👧</div>
              <h4 className="font-bold text-gray-800 mb-1">Monitoring Orang Tua</h4>
              <p className="text-sm text-gray-600">Pantau progress anak real-time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-800 mb-1">Sesuai Kurikulum</h4>
              <p className="text-sm text-gray-600">Materi SD kelas 1-6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}