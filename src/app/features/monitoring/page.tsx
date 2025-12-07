'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, BarChart3, Clock, TrendingUp, Bell, Shield, Heart, Award, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ParentMonitoringPage() {
  const router = useRouter();
  const [liveProgress, setLiveProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [studyTime, setStudyTime] = useState(0);

  useEffect(() => {
    // Simulate live progress updates
    const progressInterval = setInterval(() => {
      setLiveProgress(prev => (prev < 100 ? prev + 2 : 0));
    }, 100);

    const questionsInterval = setInterval(() => {
      setQuestionsAnswered(prev => (prev < 25 ? prev + 1 : 0));
    }, 200);

    const timeInterval = setInterval(() => {
      setStudyTime(prev => (prev < 45 ? prev + 1 : 0));
    }, 100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(questionsInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-300 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="text-6xl opacity-20">👨‍👩‍👧</div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="text-5xl opacity-20">📊</div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}>
          <div className="text-5xl opacity-20">👁️</div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-pulse" style={{ animationDelay: '3s' }}>
          <div className="text-4xl opacity-20">❤️</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 px-6 py-3 bg-white/90 backdrop-blur hover:bg-white text-gray-800 font-semibold rounded-xl transition shadow-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="text-8xl animate-bounce">👨‍👩‍👧</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-ping">❤️</div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Monitoring Orang Tua
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-lg max-w-3xl mx-auto">
            Pantau perkembangan anak secara real-time dengan dashboard lengkap!
          </p>
        </div>

        {/* Live Dashboard Preview */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-600" />
              Live Dashboard Preview
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-semibold">Live</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Real-time Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 transform hover:scale-105 transition">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div className="font-bold text-gray-800">Progress Hari Ini</div>
              </div>
              <div className="text-5xl font-bold text-blue-600 mb-2">{liveProgress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${liveProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 transform hover:scale-105 transition">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-green-600" />
                <div className="font-bold text-gray-800">Soal Dijawab</div>
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2">{questionsAnswered}</div>
              <div className="text-gray-600">dari 30 soal target</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 transform hover:scale-105 transition">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
                <div className="font-bold text-gray-800">Waktu Belajar</div>
              </div>
              <div className="text-5xl font-bold text-purple-600 mb-2">{studyTime}</div>
              <div className="text-gray-600">menit hari ini</div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-xl text-gray-800 mb-4">📋 Aktivitas Terakhir</h3>
            <div className="space-y-3">
              {[
                { time: '2 menit lalu', activity: 'Menyelesaikan Matematika Level 2', icon: '✅', color: 'green' },
                { time: '15 menit lalu', activity: 'Belajar Bahasa Inggris - Vocabulary', icon: '📚', color: 'blue' },
                { time: '1 jam lalu', activity: 'Mendapat Badge "Silver Learner"', icon: '🏆', color: 'yellow' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-xl hover:shadow-md transition">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.activity}</div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-4 rounded-2xl">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Grafik Perkembangan</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Lihat grafik lengkap perkembangan anak dari hari ke hari. Statistik detail tentang 
              mata pelajaran mana yang sudah dikuasai dan mana yang perlu ditingkatkan.
            </p>
            
            {/* Sample Chart */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="flex justify-between items-end h-40 gap-2">
                {[65, 70, 75, 85, 78, 90, 95].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-1000 hover:from-blue-600 hover:to-cyan-500"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 font-semibold">
                      {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][idx]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-gray-600 font-semibold">
                Peningkatan 30% minggu ini! 📈
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl">
                <Bell className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Notifikasi Real-time</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Dapatkan notifikasi langsung saat anak menyelesaikan sesi belajar, mendapat achievement, 
              atau ada hal penting yang perlu perhatian orang tua.
            </p>
            
            <div className="space-y-3">
              {[
                { type: 'success', msg: 'Andi menyelesaikan 10 soal matematika!', time: 'Baru saja', color: 'green' },
                { type: 'achievement', msg: 'Andi mendapat badge "Gold Learner"!', time: '5 menit lalu', color: 'yellow' },
                { type: 'info', msg: 'Andi sudah belajar 45 menit hari ini', time: '10 menit lalu', color: 'blue' }
              ].map((notif, idx) => (
                <div key={idx} className={`p-4 bg-${notif.color}-50 border-l-4 border-${notif.color}-500 rounded-lg hover:shadow-md transition`}>
                  <div className="font-semibold text-gray-800">{notif.msg}</div>
                  <div className="text-sm text-gray-600 mt-1">{notif.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-2xl">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Jadwal & Target</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Atur jadwal belajar dan target harian untuk anak. Sistem akan mengingatkan anak 
              untuk belajar sesuai jadwal yang sudah ditentukan.
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked className="w-5 h-5" readOnly />
                    <div>
                      <div className="font-semibold">Matematika</div>
                      <div className="text-sm text-gray-600">Target: 10 soal/hari</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-bold">10/10 ✓</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Bahasa Inggris</div>
                      <div className="text-sm text-gray-600">Target: 15 vocab/hari</div>
                    </div>
                  </div>
                  <div className="text-orange-600 font-bold">8/15</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-2xl">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Kontrol Screen Time</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Pantau berapa lama anak menggunakan aplikasi. Set batas waktu maksimal per hari 
              untuk menjaga keseimbangan belajar dan istirahat.
            </p>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-orange-600 mb-2">45 menit</div>
                <div className="text-gray-600">dari 60 menit maksimal</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all" style={{ width: '75%' }}></div>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                ⏰ 15 menit tersisa untuk hari ini
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-10 shadow-2xl mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-red-500" />
            Manfaat untuk Orang Tua
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Pahami Kemampuan Anak</h3>
              <p className="text-gray-600">
                Data lengkap membantu Anda memahami kekuatan dan kelemahan anak di setiap mata pelajaran.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Komunikasi Lebih Baik</h3>
              <p className="text-gray-600">
                Dengan data konkret, diskusi dengan anak tentang belajar jadi lebih produktif dan spesifik.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Hemat Waktu</h3>
              <p className="text-gray-600">
                Tidak perlu tanya-tanya terus. Semua info sudah tersedia di dashboard yang mudah diakses.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Intervensi Tepat Waktu</h3>
              <p className="text-gray-600">
                Deteksi dini jika anak mengalami kesulitan, sehingga bisa segera membantu sebelum terlambat.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">😌</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Peace of Mind</h3>
              <p className="text-gray-600">
                Tenang karena tahu perkembangan anak terpantau dengan baik, bahkan saat orang tua sibuk bekerja.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Rayakan Bersama</h3>
              <p className="text-gray-600">
                Notifikasi achievement membantu Anda merayakan setiap pencapaian kecil anak dengan tepat waktu.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-10 text-white shadow-2xl mb-12">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Privasi & Keamanan Data</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Data anak Anda aman dan ter-enkripsi. Hanya Anda yang bisa mengakses dashboard monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-xl mb-2">Enkripsi End-to-End</h3>
              <p className="text-white/90 text-sm">
                Semua data dienkripsi dengan standar bank-level security.
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-xl mb-2">No Third Party</h3>
              <p className="text-white/90 text-sm">
                Data tidak dibagikan ke pihak ketiga untuk tujuan apapun.
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-xl mb-2">GDPR Compliant</h3>
              <p className="text-white/90 text-sm">
                Mengikuti standar internasional perlindungan data pribadi.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-10 shadow-2xl mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            💬 Apa Kata Orang Tua?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  I
                </div>
                <div>
                  <div className="font-bold text-gray-800">Ibu Sarah</div>
                  <div className="text-sm text-gray-600">Orang tua dari Andi (9 tahun)</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Sangat membantu! Saya jadi tahu kapan Andi belajar dan seberapa baik pemahamannya. 
                Notifikasi real-time nya juga memudahkan saya untuk kasih pujian langsung."
              </p>
              <div className="text-yellow-500 mt-3">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  B
                </div>
                <div>
                  <div className="font-bold text-gray-800">Bapak Rudi</div>
                  <div className="text-sm text-gray-600">Ayah dari Citra (11 tahun)</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Dashboard-nya detail tapi mudah dipahami. Saya yang sibuk kerja jadi tetap bisa 
                monitor perkembangan anak. Grafik mingguan sangat membantu!"
              </p>
              <div className="text-yellow-500 mt-3">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-blue-600 font-bold text-xl px-12 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-110 transition inline-flex items-center gap-3"
          >
            <Eye className="w-6 h-6" />
            Coba Dashboard Monitoring
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-6 py-2 mb-3">
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
    </div>
  );
}