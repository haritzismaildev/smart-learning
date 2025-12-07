'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LevelInfo {
  id: number;
  title: string;
  ageRange: string;
  description: string;
  topics: string[];
  color: string;
  icon: string;
  recommended: boolean;
  vocabulary: number;
  grammar: string;
}

export default function EnglishLevelSelectionPage() {
  const router = useRouter();
  const [userAge, setUserAge] = useState<number>(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (user) {
      const userData = JSON.parse(user);
      setUserAge(userData.age || 8);
    }
    
    setLoading(false);
  }, [router]);

  const levels: LevelInfo[] = [
    {
      id: 1,
      title: 'Level 1: Beginner',
      ageRange: '6-7 tahun',
      description: 'Mulai petualangan bahasa Inggris dengan vocabulary dasar!',
      topics: [
        'Alphabet & Phonics (A-Z)',
        'Numbers 1-20',
        'Colors & Shapes',
        'Family Members (Mom, Dad, Sister)',
        'Animals (Cat, Dog, Bird)',
        'Greetings (Hello, Good Morning)'
      ],
      vocabulary: 150,
      grammar: 'Simple present (I am, You are)',
      color: 'from-green-400 to-emerald-500',
      icon: '🌱',
      recommended: userAge >= 6 && userAge <= 7
    },
    {
      id: 2,
      title: 'Level 2: Elementary',
      ageRange: '8-9 tahun',
      description: 'Tingkatkan vocabulary dan mulai membuat kalimat sendiri!',
      topics: [
        'Daily Activities (eat, sleep, play)',
        'School Objects (book, pen, bag)',
        'Days & Months',
        'Weather & Seasons',
        'Food & Drinks',
        'Simple Sentences (I like...)'
      ],
      vocabulary: 300,
      grammar: 'Present tense, Simple past',
      color: 'from-blue-400 to-cyan-500',
      icon: '🌟',
      recommended: userAge >= 8 && userAge <= 9
    },
    {
      id: 3,
      title: 'Level 3: Intermediate',
      ageRange: '10-12 tahun',
      description: 'Master conversation dan grammar untuk komunikasi lancar!',
      topics: [
        'Complex Sentences',
        'Tenses (Present, Past, Future)',
        'Conversation & Dialog',
        'Reading Comprehension',
        'Writing Paragraphs',
        'Common Idioms'
      ],
      vocabulary: 600,
      grammar: 'All tenses, Questions, Prepositions',
      color: 'from-purple-400 to-pink-500',
      icon: '🏆',
      recommended: userAge >= 10 && userAge <= 12
    }
  ];

  const handleLevelSelect = (level: LevelInfo) => {
    localStorage.setItem('selectedEnglishLevel', JSON.stringify(level));
    router.push(`/learn/english/tutorial?level=${level.id}`);
  };

  const handleDirectPractice = (level: LevelInfo) => {
    localStorage.setItem('selectedEnglishLevel', JSON.stringify(level));
    router.push(`/learn/english/practice?level=${level.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 flex items-center justify-center">
        <div className="text-white text-2xl">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.push('/dashboard/child')}
            className="mb-6 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition backdrop-blur-sm"
          >
            ← Kembali ke Dashboard
          </button>
          
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            🌍 Choose Your English Level
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            Pilih level yang sesuai untuk memulai belajar bahasa Inggris!
          </p>
          <p className="text-white/80 text-lg mt-2">
            Your age: <span className="font-bold">{userAge} years old</span>
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                level.recommended ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {level.recommended && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 font-bold text-sm">
                  ⭐ RECOMMENDED FOR YOU
                </div>
              )}
              
              <div className={`bg-gradient-to-r ${level.color} p-6 text-white text-center`}>
                <div className="text-6xl mb-3">{level.icon}</div>
                <h2 className="text-2xl font-bold mb-1">{level.title}</h2>
                <p className="text-white/90 text-sm">{level.ageRange}</p>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-center font-medium">
                  {level.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{level.vocabulary}+</div>
                    <div className="text-xs text-gray-600">Vocabulary</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-blue-600">{level.topics.length}</div>
                    <div className="text-xs text-gray-600">Topics</div>
                  </div>
                </div>

                <div className="mb-4 bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Grammar Focus:</div>
                  <div className="text-sm font-semibold text-purple-600">{level.grammar}</div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">What you'll learn:</h3>
                  <ul className="space-y-2">
                    {level.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleLevelSelect(level)}
                    className={`w-full bg-gradient-to-r ${level.color} text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105`}
                  >
                    📚 Learn Materials First
                  </button>
                  <button
                    onClick={() => handleDirectPractice(level)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                  >
                    🎯 Direct Practice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Path Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
          <h3 className="font-bold text-gray-800 mb-4 text-xl text-center flex items-center justify-center gap-2">
            <span>🎓</span>
            <span>English Learning Path</span>
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="text-sm font-semibold">Beginner</div>
              <div className="text-xs text-gray-600">6-7 years</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="text-sm font-semibold">Elementary</div>
              <div className="text-xs text-gray-600">8-9 years</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-sm font-semibold">Intermediate</div>
              <div className="text-xs text-gray-600">10-12 years</div>
            </div>
          </div>
        </div>

        {/* Tips Box */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
            <span>💡</span>
            <span>Tips for Success:</span>
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">→</span>
              <span>Mulai dari level yang sesuai usiamu untuk hasil optimal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">→</span>
              <span>Pelajari materi tutorial dulu sebelum latihan soal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">→</span>
              <span>Praktik setiap hari minimal 15 menit untuk hasil maksimal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">→</span>
              <span>Dengarkan lagu & nonton film bahasa Inggris untuk latihan listening</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}