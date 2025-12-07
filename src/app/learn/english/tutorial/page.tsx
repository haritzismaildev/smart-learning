'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TutorialContent {
  title: string;
  emoji: string;
  type: 'vocabulary' | 'grammar' | 'phonics' | 'conversation';
  explanation: string;
  examples: Array<{
    english: string;
    indonesian: string;
    pronunciation?: string;
    example_sentence?: string;
  }>;
  exercises: Array<{
    question: string;
    answer: string;
    options?: string[];
  }>;
  tips: string[];
}

function TutorialContentComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelId = searchParams.get('level') || '1';
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  useEffect(() => {
    const level = localStorage.getItem('selectedEnglishLevel');
    if (level) {
      setSelectedLevel(JSON.parse(level));
    }
  }, []);

  const tutorials: Record<string, TutorialContent[]> = {
    '1': [
      {
        title: 'Alphabet & Phonics',
        emoji: '🔤',
        type: 'phonics',
        explanation: 'Alphabet adalah A sampai Z. Setiap huruf punya suara berbeda. Mari belajar cara membaca huruf-huruf ini!',
        examples: [
          { english: 'A', indonesian: 'A', pronunciation: '/ei/', example_sentence: 'A is for Apple' },
          { english: 'B', indonesian: 'Bi', pronunciation: '/bi:/', example_sentence: 'B is for Ball' },
          { english: 'C', indonesian: 'Si', pronunciation: '/si:/', example_sentence: 'C is for Cat' },
          { english: 'D', indonesian: 'Di', pronunciation: '/di:/', example_sentence: 'D is for Dog' },
          { english: 'E', indonesian: 'I', pronunciation: '/i:/', example_sentence: 'E is for Egg' }
        ],
        exercises: [
          { question: 'What letter comes after A?', answer: 'B', options: ['B', 'C', 'D'] },
          { question: 'Apple starts with letter...?', answer: 'A', options: ['A', 'B', 'C'] }
        ],
        tips: [
          'Nyanyikan lagu ABC agar mudah diingat',
          'Tunjuk benda di sekitar dan sebutkan huruf awalnya',
          'Latihan menulis huruf setiap hari'
        ]
      },
      {
        title: 'Numbers 1-20',
        emoji: '🔢',
        type: 'vocabulary',
        explanation: 'Angka dalam bahasa Inggris sangat penting! Mari belajar menghitung dari 1 sampai 20.',
        examples: [
          { english: 'One', indonesian: 'Satu', pronunciation: '/wʌn/' },
          { english: 'Two', indonesian: 'Dua', pronunciation: '/tuː/' },
          { english: 'Three', indonesian: 'Tiga', pronunciation: '/θriː/' },
          { english: 'Four', indonesian: 'Empat', pronunciation: '/fɔːr/' },
          { english: 'Five', indonesian: 'Lima', pronunciation: '/faɪv/' },
          { english: 'Ten', indonesian: 'Sepuluh', pronunciation: '/ten/' },
          { english: 'Twenty', indonesian: 'Dua puluh', pronunciation: '/ˈtwenti/' }
        ],
        exercises: [
          { question: 'How do you say "3" in English?', answer: 'Three', options: ['Two', 'Three', 'Four'] },
          { question: 'What number comes after Five?', answer: 'Six', options: ['Four', 'Six', 'Seven'] }
        ],
        tips: [
          'Hitung mainan atau benda di rumah pakai bahasa Inggris',
          'Latihan sambil bermain: "How many toys do you have?"',
          'Hafalkan angka 1-10 dulu baru lanjut 11-20'
        ]
      },
      {
        title: 'Colors & Shapes',
        emoji: '🎨',
        type: 'vocabulary',
        explanation: 'Warna dan bentuk ada di mana-mana! Yuk belajar menyebutkan warna dan bentuk dalam bahasa Inggris.',
        examples: [
          { english: 'Red', indonesian: 'Merah', example_sentence: 'The apple is red' },
          { english: 'Blue', indonesian: 'Biru', example_sentence: 'The sky is blue' },
          { english: 'Yellow', indonesian: 'Kuning', example_sentence: 'The banana is yellow' },
          { english: 'Circle', indonesian: 'Lingkaran', example_sentence: 'The ball is a circle' },
          { english: 'Square', indonesian: 'Kotak', example_sentence: 'The book is a square' }
        ],
        exercises: [
          { question: 'What color is the sky?', answer: 'Blue', options: ['Red', 'Blue', 'Green'] },
          { question: 'A ball is shaped like a...?', answer: 'Circle', options: ['Square', 'Circle', 'Triangle'] }
        ],
        tips: [
          'Tunjuk benda dan sebutkan warnanya: "This is red"',
          'Gambar bentuk-bentuk dan warnai sambil menyebutkan namanya',
          'Main game: "I spy something blue!"'
        ]
      }
    ],
    '2': [
      {
        title: 'Daily Activities',
        emoji: '⏰',
        type: 'vocabulary',
        explanation: 'Kegiatan sehari-hari yang kita lakukan bisa diceritakan dalam bahasa Inggris!',
        examples: [
          { english: 'Wake up', indonesian: 'Bangun tidur', example_sentence: 'I wake up at 6 AM' },
          { english: 'Brush teeth', indonesian: 'Sikat gigi', example_sentence: 'I brush my teeth every morning' },
          { english: 'Go to school', indonesian: 'Pergi ke sekolah', example_sentence: 'I go to school by bus' },
          { english: 'Do homework', indonesian: 'Mengerjakan PR', example_sentence: 'I do my homework after school' },
          { english: 'Play games', indonesian: 'Bermain game', example_sentence: 'I play games with my friends' }
        ],
        exercises: [
          { question: 'What do you do in the morning with toothbrush?', answer: 'Brush teeth' },
          { question: 'Translate: "Saya pergi ke sekolah"', answer: 'I go to school' }
        ],
        tips: [
          'Ceritakan kegiatanmu hari ini pakai bahasa Inggris',
          'Buat diary dalam bahasa Inggris',
          'Latihan dengan orang tua: "What did you do today?"'
        ]
      },
      {
        title: 'Simple Present Tense',
        emoji: '📝',
        type: 'grammar',
        explanation: 'Simple Present Tense digunakan untuk kebiasaan dan fakta. Rumusnya: Subject + Verb (+ s/es untuk he/she/it)',
        examples: [
          { english: 'I eat rice', indonesian: 'Saya makan nasi', example_sentence: 'I eat rice every day' },
          { english: 'She likes cats', indonesian: 'Dia suka kucing', example_sentence: 'She likes cats very much' },
          { english: 'They play football', indonesian: 'Mereka bermain sepak bola', example_sentence: 'They play football on Sunday' },
          { english: 'He goes to school', indonesian: 'Dia pergi ke sekolah', example_sentence: 'He goes to school by bike' }
        ],
        exercises: [
          { question: 'Complete: I _____ (like) ice cream', answer: 'like' },
          { question: 'Complete: She _____ (play) piano', answer: 'plays' }
        ],
        tips: [
          'Ingat: I/You/We/They → verb biasa (play, eat, like)',
          'He/She/It → verb + s/es (plays, eats, likes)',
          'Latihan buat kalimat tentang kegiatanmu sehari-hari'
        ]
      },
      {
        title: 'Food & Drinks',
        emoji: '🍕',
        type: 'vocabulary',
        explanation: 'Vocabulary tentang makanan dan minuman yang sering kita jumpai!',
        examples: [
          { english: 'Rice', indonesian: 'Nasi', example_sentence: 'I eat rice for lunch' },
          { english: 'Water', indonesian: 'Air', example_sentence: 'Please give me water' },
          { english: 'Chicken', indonesian: 'Ayam', example_sentence: 'Fried chicken is delicious' },
          { english: 'Milk', indonesian: 'Susu', example_sentence: 'I drink milk every morning' },
          { english: 'Fruit', indonesian: 'Buah', example_sentence: 'Apple is a fruit' }
        ],
        exercises: [
          { question: 'What do you drink in the morning?', answer: 'Milk', options: ['Rice', 'Milk', 'Chicken'] },
          { question: 'Translate: "Nasi goreng"', answer: 'Fried rice' }
        ],
        tips: [
          'Saat makan, sebutkan nama makanannya dalam bahasa Inggris',
          'Main ke supermarket, sebutkan nama-nama makanan',
          'Buat menu restaurant sendiri dalam bahasa Inggris'
        ]
      }
    ],
    '3': [
      {
        title: 'Tenses Overview',
        emoji: '⏳',
        type: 'grammar',
        explanation: 'Tenses menunjukkan waktu kejadian. Ada Present (sekarang), Past (dulu), Future (akan datang).',
        examples: [
          { english: 'I eat (Present)', indonesian: 'Saya makan (sekarang/kebiasaan)', example_sentence: 'I eat breakfast every day' },
          { english: 'I ate (Past)', indonesian: 'Saya makan (sudah)', example_sentence: 'I ate pizza yesterday' },
          { english: 'I will eat (Future)', indonesian: 'Saya akan makan (nanti)', example_sentence: 'I will eat dinner at 7 PM' },
          { english: 'I am eating (Present Continuous)', indonesian: 'Saya sedang makan', example_sentence: 'I am eating lunch now' }
        ],
        exercises: [
          { question: 'Change to past: I play football', answer: 'I played football' },
          { question: 'Change to future: She goes to school', answer: 'She will go to school' }
        ],
        tips: [
          'Present → kebiasaan & fakta (every day, always)',
          'Past → sudah terjadi (yesterday, last week)',
          'Future → belum terjadi (tomorrow, will, next week)',
          'Latihan dengan membuat cerita tentang kemarin dan besok'
        ]
      },
      {
        title: 'Making Questions',
        emoji: '❓',
        type: 'grammar',
        explanation: 'Cara membuat pertanyaan dalam bahasa Inggris menggunakan Do/Does, Is/Are, atau WH-questions.',
        examples: [
          { english: 'Do you like pizza?', indonesian: 'Apakah kamu suka pizza?', example_sentence: 'Do you like pizza? - Yes, I do!' },
          { english: 'Does she play piano?', indonesian: 'Apakah dia main piano?', example_sentence: 'Does she play piano? - No, she doesn\'t' },
          { english: 'What is your name?', indonesian: 'Siapa namamu?', example_sentence: 'What is your name? - My name is John' },
          { english: 'Where do you live?', indonesian: 'Di mana kamu tinggal?', example_sentence: 'Where do you live? - I live in Jakarta' }
        ],
        exercises: [
          { question: 'Make question: You like ice cream', answer: 'Do you like ice cream?' },
          { question: 'Make question: She goes to school', answer: 'Does she go to school?' }
        ],
        tips: [
          'Yes/No question → gunakan Do/Does/Is/Are di awal',
          'WH-questions → What/Where/When/Why/Who/How',
          'Latihan dengan bertanya ke teman dan keluarga'
        ]
      },
      {
        title: 'Reading Comprehension',
        emoji: '📖',
        type: 'conversation',
        explanation: 'Membaca dan memahami teks bahasa Inggris adalah skill penting!',
        examples: [
          {
            english: 'My Daily Routine',
            indonesian: 'Rutinitas Harianku',
            example_sentence: 'I wake up at 6 AM every day. I brush my teeth and take a shower. Then I eat breakfast with my family. I go to school at 7 AM. After school, I do my homework and play with my friends. I go to bed at 9 PM.'
          }
        ],
        exercises: [
          { question: 'What time does he wake up?', answer: '6 AM' },
          { question: 'What does he do after school?', answer: 'Homework and play' }
        ],
        tips: [
          'Baca cerita pendek bahasa Inggris setiap hari',
          'Cari kata sulit dan cari artinya di kamus',
          'Ceritakan kembali dengan kata-katamu sendiri',
          'Mulai dari buku level anak-anak'
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
      router.push(`/learn/english/practice?level=${levelId}`);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkipToPractice = () => {
    router.push(`/learn/english/practice?level=${levelId}`);
  };

  if (!currentTutorial) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/learn/english/levels')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition backdrop-blur-sm"
          >
            ← Back
          </button>
          
          <div className="text-white font-bold">
            Material {currentSlide + 1} of {currentTutorials.length}
          </div>
          
          <button
            onClick={handleSkipToPractice}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-xl transition shadow-lg"
          >
            Skip to Practice →
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
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
              {currentTutorial.type === 'vocabulary' && '📚 Vocabulary'}
              {currentTutorial.type === 'grammar' && '📝 Grammar'}
              {currentTutorial.type === 'phonics' && '🔤 Phonics'}
              {currentTutorial.type === 'conversation' && '💬 Conversation'}
            </div>
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
              <span>✨</span>
              <span>Contoh & Vocabulary:</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {currentTutorial.examples.map((example, idx) => (
                <div key={idx} className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5 border-2 border-green-200">
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {example.english}
                    </div>
                    {example.pronunciation && (
                      <div className="text-sm text-gray-500 mb-1">{example.pronunciation}</div>
                    )}
                    <div className="text-lg text-gray-700">
                      = {example.indonesian}
                    </div>
                  </div>
                  
                  {example.example_sentence && (
                    <div className="bg-white rounded-lg p-3 mt-3">
                      <div className="text-sm text-gray-600 mb-1">Example:</div>
                      <div className="text-sm font-semibold text-gray-800 italic">
                        "{example.example_sentence}"
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Exercises */}
          {currentTutorial.exercises && currentTutorial.exercises.length > 0 && (
            <div className="mb-8">
              <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                <span>✏️</span>
                <span>Quick Exercise:</span>
              </h2>
              
              {currentTutorial.exercises.map((exercise, idx) => (
                <div key={idx} className="bg-purple-50 rounded-xl p-5 mb-4">
                  <div className="font-semibold text-gray-800 mb-3">
                    {idx + 1}. {exercise.question}
                  </div>
                  
                  {exercise.options && (
                    <div className="space-y-2 mb-3">
                      {exercise.options.map((option, optIdx) => (
                        <div key={optIdx} className="bg-white rounded-lg p-3 hover:bg-green-50 cursor-pointer transition">
                          {String.fromCharCode(65 + optIdx)}. {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                    <span className="font-bold text-green-700">Answer: </span>
                    <span className="text-gray-800">{exercise.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 rounded-2xl p-6">
            <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>Tips Belajar:</span>
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
            ← Previous Material
          </button>
          
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition transform hover:scale-105"
          >
            {currentSlide < currentTutorials.length - 1 ? 'Next Material →' : 'Start Practice 🎯'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnglishTutorialPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 flex items-center justify-center">
        <div className="text-white text-2xl">Loading tutorial...</div>
      </div>
    }>
      <TutorialContentComponent />
    </Suspense>
  );
}