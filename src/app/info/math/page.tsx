'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Calculator, Lightbulb, TrendingUp, Target, Award } from 'lucide-react';

export default function MathInfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Pentingnya Matematika untuk Anak</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white mb-12 text-center">
          <div className="text-7xl mb-6">🧮</div>
          <h2 className="text-4xl font-bold mb-4">Matematika: Fondasi Pemikiran Logis Anak</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Matematika bukan hanya tentang angka, tapi melatih anak berpikir sistematis, 
            logis, dan memecahkan masalah sejak dini.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Benefit 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Melatih Otak Berpikir Logis</h3>
            <p className="text-gray-600 leading-relaxed">
              Matematika mengajarkan anak untuk berpikir secara terstruktur dan logis. 
              Setiap soal melatih otak untuk menganalisis, menemukan pola, dan membuat kesimpulan. 
              Kemampuan ini sangat penting untuk semua aspek kehidupan.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Meningkatkan Kemampuan Problem Solving</h3>
            <p className="text-gray-600 leading-relaxed">
              Setiap soal matematika adalah tantangan yang harus dipecahkan. Ini melatih anak 
              untuk tidak mudah menyerah, mencari berbagai cara penyelesaian, dan menemukan 
              solusi kreatif.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Dasar untuk Semua Ilmu Pengetahuan</h3>
            <p className="text-gray-600 leading-relaxed">
              Matematika adalah bahasa universal sains dan teknologi. Fisika, kimia, ekonomi, 
              komputer, bahkan musik - semuanya menggunakan matematika. Menguasai matematika 
              sejak dini membuka pintu ke semua bidang ilmu.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Melatih Ketelitian dan Kesabaran</h3>
            <p className="text-gray-600 leading-relaxed">
              Mengerjakan soal matematika membutuhkan fokus dan ketelitian. Satu kesalahan kecil 
              bisa membuat jawaban salah total. Ini melatih anak untuk lebih detail, hati-hati, 
              dan sabar dalam mengerjakan sesuatu.
            </p>
          </div>
        </div>

        {/* Age-Specific Learning */}
        <div className="bg-white rounded-3xl p-10 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            📊 Matematika Sesuai Usia Anak
          </h2>
          
          <div className="space-y-6">
            {/* Ages 6-7 */}
            <div className="border-l-4 border-green-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Usia 6-7 Tahun (SD Kelas 1-2)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Fokus:</span> Mengenal angka, berhitung dasar, konsep lebih-kurang
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Manfaat:</strong> Di usia ini, anak belajar konsep dasar yang akan jadi fondasi. 
                  Mereka mulai memahami bahwa matematika ada di kehidupan sehari-hari: menghitung mainan, 
                  membagi kue, mengukur tinggi badan.
                </p>
              </div>
            </div>

            {/* Ages 8-9 */}
            <div className="border-l-4 border-blue-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Usia 8-9 Tahun (SD Kelas 3-4)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Fokus:</span> Perkalian, pembagian, pecahan sederhana, soal cerita
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Manfaat:</strong> Anak mulai berpikir abstrak dan memecahkan masalah nyata. 
                  Soal cerita mengajarkan mereka untuk membaca situasi, mengidentifikasi masalah, 
                  dan mencari solusi - skill penting untuk hidup!
                </p>
              </div>
            </div>

            {/* Ages 10-12 */}
            <div className="border-l-4 border-purple-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Usia 10-12 Tahun (SD Kelas 5-6)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Fokus:</span> Operasi campuran, geometri, pengukuran, data & statistik
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Manfaat:</strong> Anak siap untuk konsep yang lebih kompleks. Mereka belajar 
                  analisis data, pola, dan logika tingkat lanjut - persiapan sempurna untuk SMP 
                  dan masa depan di era digital.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Life Applications */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-10 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🌍 Matematika dalam Kehidupan Sehari-hari
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <h4 className="font-bold text-lg mb-2">Berbelanja</h4>
              <p className="text-sm text-gray-600">
                Menghitung uang, kembalian, diskon, dan total belanjaan
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🍰</div>
              <h4 className="font-bold text-lg mb-2">Memasak</h4>
              <p className="text-sm text-gray-600">
                Mengukur bahan, membagi porsi, menghitung waktu masak
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">⚽</div>
              <h4 className="font-bold text-lg mb-2">Olahraga</h4>
              <p className="text-sm text-gray-600">
                Menghitung skor, jarak, waktu, dan strategi permainan
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h4 className="font-bold text-lg mb-2">Game</h4>
              <p className="text-sm text-gray-600">
                Strategi, poin, level, resource management
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🏗️</div>
              <h4 className="font-bold text-lg mb-2">Membangun</h4>
              <p className="text-sm text-gray-600">
                Mengukur, menghitung bahan, desain ruangan
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="font-bold text-lg mb-2">Keuangan</h4>
              <p className="text-sm text-gray-600">
                Menabung, budgeting, menghitung untung-rugi
              </p>
            </div>
          </div>
        </div>

        {/* Future Careers */}
        <div className="bg-white rounded-3xl p-10 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            🚀 Karir Masa Depan yang Butuh Matematika
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Hampir semua profesi masa depan membutuhkan kemampuan matematika. 
            Berikut beberapa contohnya:
          </p>
          
          <div className="grid md:grid-cols-4 gap-4">
            {['👨‍💻 Programmer', '🧪 Scientist', '👨‍✈️ Pilot', '🏗️ Engineer', 
             '📊 Data Analyst', '💼 Entrepreneur', '🎨 Animator', '🎵 Musician',
             '🏦 Banker', '🎯 Marketing', '🏥 Dokter', '🌍 Researcher'].map((career, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center font-semibold text-gray-700 hover:shadow-lg transition">
                {career}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-4">Yuk, Mulai Belajar Matematika!</h2>
          <p className="text-xl mb-6 opacity-90">
            Dengan belajar matematika sejak dini, anak akan punya fondasi kuat untuk masa depan gemilang!
          </p>
          <button
            onClick={() => router.push('/learn/math/levels')}
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
          >
            Mulai Belajar Sekarang →
          </button>
        </div>
      </div>
    </div>
  );
}