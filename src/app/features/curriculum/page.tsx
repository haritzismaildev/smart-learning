'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle, Target, Award, GraduationCap, FileText, Users } from 'lucide-react';
import { useState } from 'react';

export default function CurriculumPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState(1);

  const curriculumData = {
    1: {
      subjects: [
        { name: 'Matematika', topics: ['Penjumlahan 1-20', 'Pengurangan 1-20', 'Mengenal Angka', 'Bentuk Geometri'], coverage: 100 },
        { name: 'Bahasa Indonesia', topics: ['Membaca Permulaan', 'Menulis Huruf', 'Kosakata Dasar'], coverage: 85 },
        { name: 'Bahasa Inggris', topics: ['Alphabet', 'Numbers 1-20', 'Colors', 'Greetings'], coverage: 100 }
      ]
    },
    2: {
      subjects: [
        { name: 'Matematika', topics: ['Penjumlahan 1-100', 'Pengurangan 1-100', 'Perkalian Dasar', 'Geometri'], coverage: 95 },
        { name: 'Bahasa Indonesia', topics: ['Membaca Lancar', 'Menulis Kalimat', 'Tata Bahasa Dasar'], coverage: 90 },
        { name: 'Bahasa Inggris', topics: ['Vocabulary 200+', 'Simple Sentences', 'Daily Activities'], coverage: 95 }
      ]
    },
    3: {
      subjects: [
        { name: 'Matematika', topics: ['Operasi Campuran', 'Pecahan Sederhana', 'Pengukuran'], coverage: 90 },
        { name: 'Bahasa Indonesia', topics: ['Paragraf', 'Puisi', 'Cerita Pendek'], coverage: 85 },
        { name: 'Bahasa Inggris', topics: ['Present Tense', 'Vocabulary 400+', 'Reading'], coverage: 90 }
      ]
    },
    4: {
      subjects: [
        { name: 'Matematika', topics: ['Bilangan Bulat', 'KPK & FPB', 'Sudut & Segi'], coverage: 85 },
        { name: 'Bahasa Indonesia', topics: ['Karangan', 'Drama', 'Pidato'], coverage: 80 },
        { name: 'Bahasa Inggris', topics: ['Past Tense', 'Vocabulary 600+', 'Writing'], coverage: 85 }
      ]
    },
    5: {
      subjects: [
        { name: 'Matematika', topics: ['Pecahan Kompleks', 'Desimal', 'Volume & Luas'], coverage: 80 },
        { name: 'Bahasa Indonesia', topics: ['Teks Eksposisi', 'Debat', 'Analisis Teks'], coverage: 75 },
        { name: 'Bahasa Inggris', topics: ['All Tenses', 'Vocabulary 800+', 'Conversation'], coverage: 80 }
      ]
    },
    6: {
      subjects: [
        { name: 'Matematika', topics: ['Aljabar Dasar', 'Statistika', 'Koordinat'], coverage: 75 },
        { name: 'Bahasa Indonesia', topics: ['Teks Argumentasi', 'Kritik Sastra', 'Resensi'], coverage: 70 },
        { name: 'Bahasa Inggris', topics: ['Advanced Grammar', 'Vocabulary 1000+', 'Presentation'], coverage: 75 }
      ]
    }
  };

  const currentData = curriculumData[selectedGrade as keyof typeof curriculumData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-300 to-teal-300 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="text-6xl opacity-20">📚</div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="text-5xl opacity-20">🎓</div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}>
          <div className="text-5xl opacity-20">✏️</div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-pulse" style={{ animationDelay: '3s' }}>
          <div className="text-4xl opacity-20">📖</div>
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
            <div className="text-8xl animate-bounce">📚</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">🎓</div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Sesuai Kurikulum
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-lg max-w-3xl mx-auto">
            Materi pembelajaran mengikuti Kurikulum Merdeka & standar Kemendikbud!
          </p>
        </div>

        {/* Official Certification */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-12">
          <div className="text-center mb-8">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Terstandarisasi & Terpercaya</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart Learning mengikuti standar kompetensi yang ditetapkan oleh Kementerian Pendidikan dan Kebudayaan RI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Kurikulum Merdeka</h3>
              <p className="text-gray-600 text-sm">
                Mengadopsi prinsip-prinsip Kurikulum Merdeka yang fleksibel dan berpusat pada siswa
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">SK Kemendikbud</h3>
              <p className="text-gray-600 text-sm">
                Materi disusun sesuai Standar Kompetensi dan Kompetensi Dasar yang berlaku
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Review Pendidik</h3>
              <p className="text-gray-600 text-sm">
                Dikembangkan & direview oleh guru-guru berpengalaman dan ahli pendidikan
              </p>
            </div>
          </div>
        </div>

        {/* Grade Selector */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            📖 Cakupan Materi Per Kelas
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6].map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 ${
                  selectedGrade === grade
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Kelas {grade}
              </button>
            ))}
          </div>

          {/* Subject Cards */}
          <div className="space-y-6">
            {currentData.subjects.map((subject, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-gray-800">{subject.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-4 py-2 rounded-full font-bold ${
                      subject.coverage >= 90 ? 'bg-green-100 text-green-700' :
                      subject.coverage >= 80 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {subject.coverage}% Coverage
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {subject.topics.map((topic, topicIdx) => (
                    <div key={topicIdx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${subject.coverage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Approach */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-10 shadow-2xl mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
            <Target className="w-10 h-10 text-green-600" />
            Pendekatan Pembelajaran
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Pembelajaran Bertahap</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Materi disusun secara progresif dari mudah ke sulit, sesuai dengan perkembangan kognitif anak.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">Konsep dasar sebelum lanjut ke advanced</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">Pengulangan untuk memperkuat pemahaman</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">Adaptive learning sesuai kemampuan</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Kontekstual & Aplikatif</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Materi dikaitkan dengan kehidupan sehari-hari anak agar lebih mudah dipahami dan diingat.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">Contoh soal dari situasi nyata</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">Visual dan ilustrasi menarik</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">Praktik langsung, bukan hanya teori</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Gamifikasi Edukatif</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kurikulum tetap terjaga sambil membuat belajar menyenangkan dengan elemen game.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-gray-700">Point system untuk motivasi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-gray-700">Levels dan achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-gray-700">Kompetisi sehat dengan teman</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Assessment Berkelanjutan</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Evaluasi terus-menerus untuk memastikan anak benar-benar menguasai materi.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">✓</span>
                  <span className="text-gray-700">Quiz setelah setiap topik</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">✓</span>
                  <span className="text-gray-700">Progress tracking real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">✓</span>
                  <span className="text-gray-700">Laporan komprehensif untuk orang tua</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison with Traditional */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-10 shadow-2xl mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            🆚 Smart Learning vs Pembelajaran Tradisional
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <th className="p-4 text-left rounded-tl-xl">Aspek</th>
                  <th className="p-4 text-center">Smart Learning</th>
                  <th className="p-4 text-center rounded-tr-xl">Tradisional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { aspect: 'Kecepatan Belajar', smart: 'Sesuai pace anak', traditional: 'Sama untuk semua' },
                  { aspect: 'Feedback', smart: 'Instant real-time', traditional: 'Tunggu guru koreksi' },
                  { aspect: 'Motivasi', smart: 'Gamifikasi & rewards', traditional: 'Nilai rapor' },
                  { aspect: 'Monitoring', smart: 'Dashboard real-time', traditional: 'Rapor 6 bulan' },
                  { aspect: 'Aksesibilitas', smart: '24/7 kapan saja', traditional: 'Jam sekolah' },
                  { aspect: 'Personalisasi', smart: 'Adaptive per anak', traditional: 'One size fits all' }
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-semibold text-gray-800">{row.aspect}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        ✓ {row.smart}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                        {row.traditional}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expert Endorsement */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl mb-12">
          <div className="text-center mb-8">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Dipercaya oleh Pendidik</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
                  DR
                </div>
                <div>
                  <div className="font-bold text-xl">Dr. Ahmad Susanto, M.Pd</div>
                  <div className="text-white/80 text-sm">Pakar Pendidikan Anak</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "Smart Learning mengintegrasikan prinsip-prinsip pedagogis modern dengan teknologi. 
                Pendekatan gamifikasi tetap mempertahankan esensi kurikulum nasional."
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
                  SR
                </div>
                <div>
                  <div className="font-bold text-xl">Siti Rahayu, S.Pd</div>
                  <div className="text-white/80 text-sm">Guru SD Berprestasi Nasional</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "Saya rekomendasikan ke semua orang tua murid. Materi sangat sesuai dengan yang 
                kami ajarkan di sekolah, plus ada fitur monitoring yang membantu kolaborasi guru-ortu."
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-green-600 font-bold text-xl px-12 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-110 transition inline-flex items-center gap-3"
          >
            <Award className="w-6 h-6" />
            Mulai Belajar Sesuai Kurikulum
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 rounded-full px-6 py-2 mb-3">
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