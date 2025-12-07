'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, Gamepad2, Star, Trophy, Zap, Target, Award, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GamificationPage() {
  const router = useRouter();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Animated score counter
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev < 1000) return prev + 50;
        return prev;
      });
    }, 100);

    // Confetti animation
    const confettiInterval = setInterval(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(confettiInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showConfetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: '2rem'
                }}
              >
                {['🎉', '⭐', '🏆', '✨', '🎮'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </>
        )}
        
        {/* Floating game elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="text-6xl">🎮</div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="text-5xl">⭐</div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float">
          <div className="text-5xl">🏆</div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float-delayed">
          <div className="text-4xl">💎</div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-6 py-3 bg-white/90 backdrop-blur hover:bg-white text-gray-800 font-semibold rounded-xl transition shadow-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="text-8xl animate-bounce">🎮</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">✨</div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Belajar Sambil Bermain
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-lg max-w-3xl mx-auto">
            Metode gamifikasi yang membuat belajar jadi menyenangkan seperti bermain game!
          </p>
        </div>

        {/* Animated Score Display */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-12 text-center transform hover:scale-105 transition">
          <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-pulse">
            {animatedScore}
          </div>
          <div className="text-gray-600 text-xl">Poin yang Sudah Dikumpulkan Hari Ini! 🎉</div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Card 1 - Point System */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl">
                <Star className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Sistem Poin</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Setiap jawaban benar menghasilkan poin! Semakin sulit soalnya, semakin banyak poin yang didapat. 
              Anak-anak akan termotivasi untuk terus belajar dan mengumpulkan poin sebanyak-banyaknya.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-bold text-green-700">Soal Mudah</div>
                  <div className="text-sm text-gray-600">+10 poin per jawaban benar</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-bold text-yellow-700">Soal Sedang</div>
                  <div className="text-sm text-gray-600">+20 poin per jawaban benar</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-bold text-red-700">Soal Sulit</div>
                  <div className="text-sm text-gray-600">+30 poin per jawaban benar</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Streak System */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-2xl animate-pulse">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Streak Bonus</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Jawab benar berturut-turut untuk mendapat bonus streak! Semakin panjang streak-nya, 
              semakin besar bonus yang didapat. Bikin anak ketagihan belajar!
            </p>
            <div className="relative">
              <div className="flex justify-center items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all ${
                      num <= 3 ? 'bg-gradient-to-br from-orange-400 to-red-500 scale-110' : 'bg-gray-300'
                    }`}
                  >
                    {num <= 3 ? '🔥' : num}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-1">3x Streak! 🔥</div>
                <div className="text-gray-600">+10 Bonus Poin</div>
              </div>
            </div>
          </div>

          {/* Card 3 - Levels & Achievements */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-4 rounded-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Level & Badge</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Kumpulkan poin untuk naik level! Setiap level baru membuka badge keren dan fitur baru. 
              Anak bisa koleksi badge seperti bermain game RPG!
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '🥉', name: 'Bronze', points: '0-500' },
                { emoji: '🥈', name: 'Silver', points: '501-1500' },
                { emoji: '🥇', name: 'Gold', points: '1501+' }
              ].map((badge) => (
                <div key={badge.name} className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl text-center hover:scale-110 transition">
                  <div className="text-4xl mb-2">{badge.emoji}</div>
                  <div className="font-bold text-gray-800 text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-600">{badge.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 - Leaderboard */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 p-4 rounded-2xl">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Papan Peringkat</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Kompetisi sehat dengan teman-teman! Lihat siapa yang paling rajin belajar dan kumpulkan 
              poin terbanyak. Motivasi extra untuk jadi yang terbaik!
            </p>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Andi', score: 2500, emoji: '🥇', color: 'from-yellow-400 to-orange-500' },
                { rank: 2, name: 'Budi', score: 2200, emoji: '🥈', color: 'from-gray-300 to-gray-400' },
                { rank: 3, name: 'Citra', score: 1800, emoji: '🥉', color: 'from-orange-300 to-orange-400' }
              ].map((player) => (
                <div key={player.rank} className={`flex items-center gap-3 p-3 bg-gradient-to-r ${player.color} rounded-xl text-white`}>
                  <div className="text-3xl">{player.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold">{player.name}</div>
                    <div className="text-sm opacity-90">{player.score} poin</div>
                  </div>
                  <div className="text-2xl font-bold">#{player.rank}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-10 shadow-2xl mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-600" />
            Kenapa Gamifikasi Efektif?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-4xl">🧠</div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Meningkatkan Motivasi</h3>
                <p className="text-gray-600">
                  Sistem reward membuat anak lebih termotivasi untuk terus belajar dan mencapai target. 
                  Dopamine rush seperti saat main game!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-4xl">😊</div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Belajar Jadi Menyenangkan</h3>
                <p className="text-gray-600">
                  Tidak terasa seperti belajar! Anak akan enjoy karena merasa sedang bermain game 
                  edukatif yang seru.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Goal-Oriented Learning</h3>
                <p className="text-gray-600">
                  Anak punya target jelas: kumpulkan poin, naik level, dapat badge. 
                  Ini mengajarkan goal-setting sejak dini.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Anak bisa lihat perkembangan mereka sendiri. Level dan badge adalah bukti 
                  nyata bahwa mereka semakin pintar!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-4xl">👥</div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Social Learning</h3>
                <p className="text-gray-600">
                  Leaderboard menciptakan kompetisi sehat. Anak belajar sportivitas dan 
                  termotivasi melihat teman-temannya.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-4xl">⏰</div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Konsistensi Belajar</h3>
                <p className="text-gray-600">
                  Streak system mendorong anak untuk belajar rutin setiap hari. 
                  Konsistensi adalah kunci sukses!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Research Evidence */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-10 text-white shadow-2xl mb-12">
          <h2 className="text-4xl font-bold text-center mb-6">📚 Didukung oleh Penelitian</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">89%</div>
              <div className="text-lg">Anak lebih engaged dengan gamifikasi</div>
              <div className="text-sm opacity-80 mt-1">(University of Colorado, 2019)</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">68%</div>
              <div className="text-lg">Peningkatan retensi materi pelajaran</div>
              <div className="text-sm opacity-80 mt-1">(Stanford University, 2020)</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">3x</div>
              <div className="text-lg">Lebih lama waktu belajar sukarela</div>
              <div className="text-sm opacity-80 mt-1">(MIT Education Lab, 2021)</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-purple-600 font-bold text-xl px-12 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-110 transition inline-flex items-center gap-3"
          >
            <Gamepad2 className="w-6 h-6" />
            Mulai Belajar Sekarang!
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-6 py-2 mb-3">
                <span className="text-white font-bold text-sm">✨ SMART LEARNING 2025 ✨</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Proudly Developed By</p>
              <h3 className="text-2xl font-bold text-white mb-1">Haritz</h3>
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
              <p className="text-gray-500 text-xs">
                Made with ❤️ for Indonesian Children Education
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti 3s linear forwards;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}