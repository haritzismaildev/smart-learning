'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, MessageCircle, BookOpen, Users, Briefcase, Award } from 'lucide-react';

export default function EnglishInfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Pentingnya Bahasa Inggris untuk Anak</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-12 text-white mb-12 text-center">
          <div className="text-7xl mb-6">🌍</div>
          <h2 className="text-4xl font-bold mb-4">Bahasa Inggris: Jendela Dunia untuk Anak</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Bahasa Inggris adalah bahasa global yang membuka akses ke pengetahuan, 
            peluang, dan komunikasi dengan seluruh dunia.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">1.5 M</div>
            <div className="text-sm text-gray-600">Penutur Bahasa Inggris di Dunia</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">67</div>
            <div className="text-sm text-gray-600">Negara Menggunakan Bahasa Inggris</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">80%</div>
            <div className="text-sm text-gray-600">Konten Internet dalam Bahasa Inggris</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-orange-600 mb-2">#1</div>
            <div className="text-sm text-gray-600">Bahasa Bisnis & Teknologi Internasional</div>
          </div>
        </div>

        {/* Main Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Bahasa Komunikasi Global</h3>
            <p className="text-gray-600 leading-relaxed">
              Bahasa Inggris digunakan di lebih dari 67 negara sebagai bahasa resmi atau kedua. 
              Dengan menguasai bahasa Inggris, anak bisa berkomunikasi dengan orang dari berbagai 
              negara, membuka wawasan dan peluang tanpa batas.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Akses ke Ilmu Pengetahuan Terkini</h3>
            <p className="text-gray-600 leading-relaxed">
              80% konten internet, jurnal ilmiah, buku teknologi, dan sumber belajar terbaik 
              di dunia tersedia dalam bahasa Inggris. Menguasai bahasa Inggris = membuka 
              perpustakaan terbesar di dunia!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Peluang Karir Lebih Luas</h3>
            <p className="text-gray-600 leading-relaxed">
              Hampir semua perusahaan multinasional dan startup global menggunakan bahasa Inggris. 
              Kemampuan berbahasa Inggris yang baik bisa meningkatkan peluang karir hingga 3x lipat 
              dan salary yang lebih tinggi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Meningkatkan Kemampuan Kognitif</h3>
            <p className="text-gray-600 leading-relaxed">
              Penelitian menunjukkan anak yang belajar bahasa kedua memiliki kemampuan multitasking 
              lebih baik, lebih kreatif, dan lebih cepat dalam memecahkan masalah. Belajar bahasa 
              Inggris sejak dini melatih otak anak!
            </p>
          </div>
        </div>

        {/* Age-Specific Learning */}
        <div className="bg-white rounded-3xl p-10 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            📚 Belajar Bahasa Inggris Sesuai Usia
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Usia 6-7 Tahun (SD Kelas 1-2)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Fokus:</span> Vocabulary dasar, greeting, numbers, colors, family
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Golden Age!</strong> Di usia ini, otak anak seperti spons yang mudah menyerap 
                  bahasa baru. Mereka bisa belajar pronunciation dengan sempurna dan membangun fondasi 
                  yang kuat tanpa beban grammar yang rumit.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Usia 8-9 Tahun (SD Kelas 3-4)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Fokus:</span> Simple sentences, present tense, reading short stories
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Building Confidence:</strong> Anak mulai bisa membuat kalimat sendiri dan 
                  berkomunikasi sederhana. Ini saat yang tepat untuk praktek conversation, bermain 
                  game bahasa Inggris, dan menonton film berbahasa Inggris dengan subtitle.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Usia 10-12 Tahun (SD Kelas 5-6)</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Fokus:</span> Grammar rules, tenses, writing paragraphs, discussion
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Advanced Skills:</strong> Anak siap untuk materi lebih kompleks. Mereka bisa 
                  memahami grammar, menulis essay pendek, dan berdiskusi tentang topik yang mereka sukai. 
                  Persiapan sempurna untuk SMP international atau study abroad!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Opportunities */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-10 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🌏 Peluang Global dengan Bahasa Inggris
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-bold text-lg mb-2">Study Abroad</h4>
              <p className="text-sm text-gray-600">
                Universitas terbaik di dunia (Harvard, MIT, Oxford, Cambridge) menggunakan bahasa Inggris. 
                Beasiswa internasional lebih mudah didapat dengan TOEFL/IELTS tinggi.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="font-bold text-lg mb-2">International Career</h4>
              <p className="text-sm text-gray-600">
                Google, Microsoft, Apple, Meta - semua menggunakan bahasa Inggris. Remote work untuk 
                perusahaan luar negeri bisa mendapat gaji 5-10x lebih besar!
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="text-4xl mb-3">✈️</div>
              <h4 className="font-bold text-lg mb-2">Travel Anywhere</h4>
              <p className="text-sm text-gray-600">
                Traveling ke 195 negara tanpa takut tersesat! Bahasa Inggris digunakan di bandara, 
                hotel, restoran di seluruh dunia. Explore dunia dengan percaya diri!
              </p>
            </div>
          </div>
        </div>

        {/* Fun Learning Tips */}
        <div className="bg-white rounded-3xl p-10 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🎮 Cara Seru Belajar Bahasa Inggris
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🎬', title: 'Nonton Film/Series', desc: 'Disney, Pixar, Marvel - dengan subtitle bahasa Inggris' },
              { icon: '🎵', title: 'Dengar Lagu Inggris', desc: 'Taylor Swift, BTS English songs - sambil lihat lirik' },
              { icon: '📱', title: 'Main Game', desc: 'Minecraft, Roblox, Pokemon - setting bahasa ke English' },
              { icon: '📚', title: 'Baca Komik/Novel', desc: 'Harry Potter, Percy Jackson level anak-anak' },
              { icon: '👥', title: 'Speaking Practice', desc: 'Ikut English Club atau chat dengan teman luar negeri' },
              { icon: '📝', title: 'Journaling', desc: 'Tulis diary harian pakai bahasa Inggris' }
            ].map((tip, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{tip.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-10 text-white text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-4">Start Your English Journey!</h2>
          <p className="text-xl mb-6 opacity-90">
            Mulai belajar bahasa Inggris hari ini, buka peluang global besok!
          </p>
          <button
            onClick={() => router.push('/learn/english')}
            className="bg-white text-green-600 font-bold px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
          >
            Mulai Belajar Bahasa Inggris →
          </button>
        </div>
      </div>
    </div>
  );
}