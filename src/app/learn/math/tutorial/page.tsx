'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TutorialContent {
  title: string;
  emoji: string;
  explanation: string;
  examples: Array<{
    question: string;
    answer: string;
    steps: string[];
  }>;
  tips: string[];
}

function TutorialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelId = searchParams.get('level') || '1';
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  useEffect(() => {
    const level = localStorage.getItem('selectedLevel');
    if (level) {
      setSelectedLevel(JSON.parse(level));
    }
  }, []);

  const tutorials: Record<string, TutorialContent[]> = {
    '1': [
      {
        title: 'Penjumlahan Sederhana',
        emoji: '➕',
        explanation: 'Penjumlahan adalah menggabungkan dua atau lebih angka menjadi satu. Bayangkan kamu punya 3 kelereng, lalu temanmu memberi 2 kelereng lagi. Sekarang kamu punya berapa kelereng?',
        examples: [
          {
            question: '3 + 2 = ?',
            answer: '5',
            steps: [
              'Mulai dari angka 3',
              'Tambahkan 1 → jadi 4',
              'Tambahkan 1 lagi → jadi 5',
              'Jadi 3 + 2 = 5'
            ]
          },
          {
            question: '5 + 4 = ?',
            answer: '9',
            steps: [
              'Mulai dari angka 5',
              'Hitung dengan jari: 6, 7, 8, 9',
              'Jadi 5 + 4 = 9'
            ]
          }
        ],
        tips: [
          'Gunakan jari tanganmu untuk menghitung',
          'Mulai dari angka yang lebih besar agar lebih mudah',
          'Latihan setiap hari agar lancar'
        ]
      },
      {
        title: 'Pengurangan Sederhana',
        emoji: '➖',
        explanation: 'Pengurangan adalah mengambil atau mengurangi jumlah. Bayangkan kamu punya 7 permen, lalu kamu makan 3. Berapa permen yang tersisa?',
        examples: [
          {
            question: '7 - 3 = ?',
            answer: '4',
            steps: [
              'Mulai dari angka 7',
              'Kurangi 1 → jadi 6',
              'Kurangi 1 lagi → jadi 5',
              'Kurangi 1 lagi → jadi 4',
              'Jadi 7 - 3 = 4'
            ]
          }
        ],
        tips: [
          'Hitung mundur dari angka yang lebih besar',
          'Bayangkan kamu punya barang yang diambil satu-satu',
          'Latihan dengan benda nyata di sekitarmu'
        ]
      }
    ],
    '2': [
      {
        title: 'Perkalian Dasar',
        emoji: '✖️',
        explanation: 'Perkalian adalah penjumlahan berulang. Contoh: 3 × 4 artinya "3 ditambah 4 kali" atau 3 + 3 + 3 + 3 = 12',
        examples: [
          {
            question: '3 × 4 = ?',
            answer: '12',
            steps: [
              '3 × 4 sama dengan 3 + 3 + 3 + 3',
              '3 + 3 = 6',
              '6 + 3 = 9',
              '9 + 3 = 12',
              'Jadi 3 × 4 = 12'
            ]
          },
          {
            question: '5 × 6 = ?',
            answer: '30',
            steps: [
              'Hafalkan tabel perkalian 5',
              '5, 10, 15, 20, 25, 30',
              'Jadi 5 × 6 = 30'
            ]
          }
        ],
        tips: [
          'Hafalkan tabel perkalian 1-10',
          'Latihan dengan lagu perkalian',
          'Perkalian bisa dibalik: 3×4 = 4×3'
        ]
      },
      {
        title: 'Pembagian Sederhana',
        emoji: '➗',
        explanation: 'Pembagian adalah membagi sama rata. Contoh: 12 ÷ 3 artinya "12 dibagi menjadi 3 bagian sama besar"',
        examples: [
          {
            question: '12 ÷ 3 = ?',
            answer: '4',
            steps: [
              '12 permen dibagi ke 3 anak',
              'Berikan 1 ke setiap anak → sisa 9',
              'Berikan 1 lagi → sisa 6',
              'Berikan 1 lagi → sisa 3',
              'Berikan 1 lagi → habis',
              'Setiap anak dapat 4 permen'
            ]
          }
        ],
        tips: [
          'Pembagian adalah kebalikan perkalian',
          'Jika 3 × 4 = 12, maka 12 ÷ 3 = 4',
          'Latihan dengan benda nyata'
        ]
      }
    ],
    '3': [
      {
        title: 'Operasi Campuran',
        emoji: '🔢',
        explanation: 'Operasi campuran menggabungkan penjumlahan, pengurangan, perkalian, dan pembagian. Ingat urutan: Kali/Bagi dulu, baru Tambah/Kurang',
        examples: [
          {
            question: '5 + 3 × 2 = ?',
            answer: '11',
            steps: [
              'Kerjakan perkalian dulu: 3 × 2 = 6',
              'Baru tambahkan: 5 + 6 = 11',
              'Jadi 5 + 3 × 2 = 11',
              'Bukan (5 + 3) × 2 = 16'
            ]
          },
          {
            question: '20 - 10 ÷ 2 = ?',
            answer: '15',
            steps: [
              'Kerjakan pembagian dulu: 10 ÷ 2 = 5',
              'Baru kurangkan: 20 - 5 = 15',
              'Jadi 20 - 10 ÷ 2 = 15'
            ]
          }
        ],
        tips: [
          'Ingat urutan: KaBaTaKu (Kali Bagi Tambah Kurang)',
          'Gunakan tanda kurung untuk mengubah urutan',
          'Kerjakan langkah demi langkah, jangan terburu-buru'
        ]
      }
    ]
  };

  const currentTutorials = tutorials[levelId] || tutorials['1'];
  const currentTutorial = currentTutorials[currentSlide];

  const handleNext = () => {
    if (currentSlide < currentTutorials.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Last slide, go to practice
      router.push(`/learn/math/practice?level=${levelId}`);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkipToPractice = () => {
    router.push(`/learn/math/practice?level=${levelId}`);
  };

  if (!currentTutorial) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/learn/math/levels')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition backdrop-blur-sm"
          >
            ← Kembali
          </button>
          
          <div className="text-white font-bold">
            Materi {currentSlide + 1} dari {currentTutorials.length}
          </div>
          
          <button
            onClick={handleSkipToPractice}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-xl transition shadow-lg"
          >
            Langsung Latihan →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${((currentSlide + 1) / currentTutorials.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">{currentTutorial.emoji}</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {currentTutorial.title}
            </h1>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
              <span>📖</span>
              <span>Penjelasan:</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentTutorial.explanation}
            </p>
          </div>

          {/* Examples */}
          <div className="mb-8">
            <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <span>✏️</span>
              <span>Contoh Soal:</span>
            </h2>
            
            {currentTutorial.examples.map((example, idx) => (
              <div key={idx} className="bg-purple-50 rounded-2xl p-6 mb-4">
                <div className="text-3xl font-bold text-purple-600 mb-4 text-center">
                  {example.question}
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Cara mengerjakannya:</h3>
                  <ol className="space-y-2">
                    {example.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start gap-3">
                        <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          {stepIdx + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
                  <span className="font-bold text-green-700">Jawaban: </span>
                  <span className="text-3xl font-bold text-green-600">{example.answer}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 rounded-2xl p-6">
            <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>Tips Penting:</span>
            </h2>
            <ul className="space-y-3">
              {currentTutorial.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-yellow-500 text-xl flex-shrink-0">★</span>
                  <span className="text-gray-700 text-lg">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-8 py-4 font-bold rounded-xl transition ${
              currentSlide === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
            }`}
          >
            ← Materi Sebelumnya
          </button>
          
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition transform hover:scale-105"
          >
            {currentSlide < currentTutorials.length - 1 ? 'Materi Selanjutnya →' : 'Mulai Latihan 🎯'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MathTutorialPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center">
        <div className="text-white text-2xl">Memuat tutorial...</div>
      </div>
    }>
      <TutorialContent />
    </Suspense>
  );
}