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
            <button
              onClick={() => router.push('/features/gamification')}
              className="text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition transform hover:scale-105 cursor-pointer"
            >
              <div className="text-4xl mb-2">🎮</div>
              <h4 className="font-bold text-gray-800 mb-1">Belajar Sambil Bermain</h4>
              <p className="text-sm text-gray-600">Metode gamifikasi yang fun!</p>
              <div className="text-purple-600 font-semibold mt-2 text-sm">Klik untuk detail →</div>
            </button>
            <button
              onClick={() => router.push('/features/monitoring')}
              className="text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition transform hover:scale-105 cursor-pointer"
            >
              <div className="text-4xl mb-2">👨‍👩‍👧</div>
              <h4 className="font-bold text-gray-800 mb-1">Monitoring Orang Tua</h4>
              <p className="text-sm text-gray-600">Pantau progress anak real-time</p>
              <div className="text-blue-600 font-semibold mt-2 text-sm">Klik untuk detail →</div>
            </button>
            <button
              onClick={() => router.push('/features/curriculum')}
              className="text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition transform hover:scale-105 cursor-pointer"
            >
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-800 mb-1">Sesuai Kurikulum</h4>
              <p className="text-sm text-gray-600">Materi SD kelas 1-6</p>
              <div className="text-green-600 font-semibold mt-2 text-sm">Klik untuk detail →</div>
            </button>
          </div>
        </div>

        {/* Footer - Creator Credit */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-6 py-2 mb-3">
                <span className="text-white font-bold text-sm">✨ SMART LEARNING 2025 ✨</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Proudly Developed By</p>
              <h3 className="text-2xl font-bold text-white mb-1">
                Haritz
              </h3>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <span>©</span>
                <span className="font-mono">2025</span>
                <span>•</span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                  CreativeJawiProduction.prod
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
                <span className="flex items-center gap-1">
                  <span className="text-green-400">●</span>
                  Next.js 16
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">●</span>
                  TypeScript
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="text-purple-400">●</span>
                  PostgreSQL
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="text-pink-400">●</span>
                  Tailwind CSS
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-3">
                Made with ❤️ for Indonesian Children Education
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}