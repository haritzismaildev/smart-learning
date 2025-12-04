'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Star, Award, TrendingUp, Target, Zap } from 'lucide-react';

export default function PointSystemPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Sistem Poin & Rating</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white mb-12 text-center">
          <div className="text-7xl mb-6">🏆</div>
          <h2 className="text-4xl font-bold mb-4">Sistem Poin Smart Learning</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Kumpulkan poin, raih prestasi, dan lacak perkembangan belajar anak dengan sistem 
            gamifikasi yang menyenangkan!
          </p>
        </div>

        {/* How Points Work */}
        <div className="bg-white rounded-3xl p-10 shadow-xl mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            💎 Cara Kerja Sistem Poin
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Jawab Benar</h3>
              <p className="text-gray-600 mb-3">Dapat poin sesuai tingkat kesulitan</p>
              <div className="space-y-2 text-sm">
                <div className="bg-green-50 rounded-lg py-2 px-4">
                  <span className="font-semibold text-green-700">Mudah:</span>
                  <span className="text-gray-700"> +10 poin</span>
                </div>
                <div className="bg-yellow-50 rounded-lg py-2 px-4">
                  <span className="font-semibold text-yellow-700">Sedang:</span>
                  <span className="text-gray-700"> +20 poin</span>
                </div>
                <div className="bg-red-50 rounded-lg py-2 px-4">
                  <span className="font-semibold text-red-700">Sulit:</span>
                  <span className="text-gray-700"> +30 poin</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Bonus Kecepatan</h3>
              <p className="text-gray-600 mb-3">Jawab cepat dapat bonus!</p>
              <div className="bg-blue-50 rounded-lg py-3 px-4">
                <div className="font-semibold text-blue-700 mb-1">&lt; 10 detik</div>
                <div className="text-3xl font-bold text-blue-600">+5</div>
                <div className="text-xs text-gray-600">Bonus Poin</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Streak Bonus</h3>
              <p className="text-gray-600 mb-3">Benar berturut-turut!</p>
              <div className="space-y-2 text-sm">
                <div className="bg-orange-50 rounded-lg py-2 px-4">
                  <span className="font-semibold text-orange-700">3x Streak:</span>
                  <span className="text-gray-700"> +10 bonus</span>
                </div>
                <div className="bg-red-50 rounded-lg py-2 px-4">
                  <span className="font-semibold text-red-700">5x Streak:</span>
                  <span className="text-gray-700"> +25 bonus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Penalty */}
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
            <h4 className="font-bold text-center mb-4 text-gray-700">⚠️ Pengurangan Poin</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="font-semibold text-gray-800">Pakai Hint</div>
                  <div className="text-sm text-gray-600">-5 poin (tapi tetap bisa jawab!)</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <div className="font-semibold text-gray-800">Jawaban Salah</div>
                  <div className="text-sm text-gray-600">0 poin & reset streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Importance Rating */}
        <div className="bg-white rounded-3xl p-10 shadow-xl mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            ⭐ Rating Kepentingan Ilmu
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Berdasarkan penelitian global dan kebutuhan skill abad 21, berikut rating pentingnya 
            matematika dan bahasa Inggris untuk masa depan anak:
          </p>

          {/* Math Rating */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🧮</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Matematika</h3>
                  <p className="text-sm text-gray-600">Fondasi Ilmu Pasti & Teknologi</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">9.8/10</div>
                <div className="text-sm text-gray-500">Sangat Penting</div>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full" style={{ width: '98%' }}></div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">10/10</div>
                <div className="text-xs text-gray-600">STEM Careers</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">9.5/10</div>
                <div className="text-xs text-gray-600">Problem Solving</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">10/10</div>
                <div className="text-xs text-gray-600">Logical Thinking</div>
              </div>
              <div className="bg-cyan-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-600 mb-1">9.8/10</div>
                <div className="text-xs text-gray-600">Future Skills</div>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Kenapa 9.8/10?</strong> Matematika adalah bahasa universal science & technology. 
                Semua inovasi modern (AI, robotics, space exploration) butuh matematika kuat. 
                Anak yang menguasai matematika punya 90% peluang lebih besar masuk profesi masa depan.
              </p>
            </div>
          </div>

          {/* English Rating */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🌍</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Bahasa Inggris</h3>
                  <p className="text-sm text-gray-600">Komunikasi Global & Akses Informasi</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">9.9/10</div>
                <div className="text-sm text-gray-500">Sangat Penting</div>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 h-full" style={{ width: '99%' }}></div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">10/10</div>
                <div className="text-xs text-gray-600">Global Communication</div>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">10/10</div>
                <div className="text-xs text-gray-600">Career Opportunities</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">9.8/10</div>
                <div className="text-xs text-gray-600">Information Access</div>
              </div>
              <div className="bg-lime-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-lime-600 mb-1">9.9/10</div>
                <div className="text-xs text-gray-600">Cultural Exchange</div>
              </div>
            </div>

            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Kenapa 9.9/10?</strong> Bahasa Inggris adalah gerbang dunia! 80% konten internet, 
                hampir semua research paper, dan komunikasi bisnis global menggunakan bahasa Inggris. 
                Anak yang fasih bahasa Inggris bisa akses unlimited knowledge & opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Combined Impact */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-10 mb-12 border-2 border-orange-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Kombinasi Matematika + Bahasa Inggris
            </h2>
            <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full text-2xl font-bold">
              RATING: 10/10 ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">💼</div>
              <h4 className="font-bold text-lg mb-2">Karir Top Global</h4>
              <p className="text-sm text-gray-600">
                Anak yang kuasai keduanya bisa bekerja di Google, NASA, Microsoft, WHO - 
                dengan gaji $100k-$500k per tahun!
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🎓</div>
              <h4 className="font-bold text-lg mb-2">Beasiswa Internasional</h4>
              <p className="text-sm text-gray-600">
                95% beasiswa S2/S3 ke MIT, Stanford, Harvard butuh TOEFL tinggi + 
                kemampuan matematika/sains yang kuat.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🌏</div>
              <h4 className="font-bold text-lg mb-2">Warga Dunia</h4>
              <p className="text-sm text-gray-600">
                Bisa kerja remote dari Indonesia untuk perusahaan USA, traveling ke 
                mana saja, dan networking dengan orang hebat di seluruh dunia.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🧠</div>
              <h4 className="font-bold text-lg mb-2">Super Brain Power</h4>
              <p className="text-sm text-gray-600">
                Research membuktikan: bilingual + strong math skills = IQ lebih tinggi, 
                kreativitas 2x lebih baik, problem solving expert!
              </p>
            </div>
          </div>
        </div>

        {/* Achievement Levels */}
        <div className="bg-white rounded-3xl p-10 shadow-xl mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🏅 Level & Achievement
          </h2>

          <div className="space-y-6">
            {[
              { level: 'Bronze', points: '0-500', color: 'from-orange-300 to-orange-400', icon: '🥉', perks: 'Akses soal dasar, Badge perunggu' },
              { level: 'Silver', points: '501-1500', color: 'from-gray-300 to-gray-400', icon: '🥈', perks: 'Unlock soal menengah, Certificate Silver' },
              { level: 'Gold', points: '1501-3000', color: 'from-yellow-300 to-yellow-500', icon: '🥇', perks: 'Soal advanced, Leaderboard, Certificate Gold' },
              { level: 'Platinum', points: '3001-5000', color: 'from-cyan-300 to-cyan-500', icon: '💎', perks: 'Challenge mode, Special rewards, Platinum Certificate' },
              { level: 'Diamond', points: '5000+', color: 'from-purple-400 to-pink-500', icon: '👑', perks: 'Master level, Personal mentor access, Trophy fisik!' }
            ].map((tier, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${tier.color} rounded-2xl p-6 text-white shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{tier.icon}</div>
                    <div>
                      <div className="text-2xl font-bold">{tier.level}</div>
                      <div className="text-sm opacity-90">{tier.points} poin</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90 mb-1">Unlock:</div>
                    <div className="font-semibold">{tier.perks}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-white text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-4">Siap Kumpulkan Poin?</h2>
          <p className="text-xl mb-6 opacity-90">
            Mulai belajar sekarang dan raih level tertinggi!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/learn/math/levels')}
              className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              🧮 Belajar Matematika
            </button>
            <button
              onClick={() => router.push('/learn/english')}
              className="bg-yellow-400 text-gray-800 font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              🌍 Belajar Bahasa Inggris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}