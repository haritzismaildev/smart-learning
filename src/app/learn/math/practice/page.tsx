'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';
import QuestionCard from '@/components/QuestionCard';

interface Question {
  id: number;
  type: string;
  difficulty: string;
  question: string;
  answer: number;
  hint: string;
  number1?: number;
  number2?: number;
}

const MOTIVATIONAL_MESSAGES = {
  perfect: ['🎉 Sempurna!', '⭐ Luar biasa!', '🏆 Hebat sekali!', '💯 Perfect!'],
  good: ['👍 Bagus!', '😊 Keren!', '✨ Pintar!', '🌟 Mantap!'],
  tryAgain: ['💪 Coba lagi!', '🤔 Hampir benar!', '📚 Belajar lagi ya!', '🎯 Jangan menyerah!']
};

export default function MathLearningPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  
  // Enhanced tracking
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const MAX_QUESTIONS = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    startSession(token);
  }, [router]);

  const startSession = async (token: string) => {
    try {
      setLoading(true);
      
      // Create learning session
      const sessionResponse = await fetch(getApiEndpoint('sessions'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'math',
          topic: 'general'
        }),
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setSessionId(sessionData.data.id);
        setSessionStartTime(Date.now());
        
        // Load first question
        await loadNextQuestion(token);
      } else {
        throw new Error('Failed to start session');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Gagal memulai sesi belajar. Coba lagi.');
      setLoading(false);
    }
  };

  const loadNextQuestion = async (token: string) => {
    try {
      setLoading(true);
      setIsProcessing(false);
      
      const response = await fetch(getApiEndpoint('questions/math?limit=1'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.questions && data.data.questions.length > 0) {
          setCurrentQuestion(data.data.questions[0]);
          setLoading(false);
        } else {
          throw new Error('No questions available');
        }
      } else {
        throw new Error('Failed to load question');
      }
    } catch (error) {
      console.error('Error loading question:', error);
      alert('Gagal memuat soal. Coba lagi.');
      setLoading(false);
    }
  };

  const handleAnswer = async (userAnswer: string, isCorrect: boolean, timeTaken: number, hintUsed: boolean) => {
    if (isProcessing) return; // Prevent multiple submissions
    
    const token = localStorage.getItem('token');
    if (!token || !sessionId || !currentQuestion) return;

    setIsProcessing(true);

    // Calculate points with bonuses
    const basePoints = currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 20 : 30;
    const timeBonus = timeTaken < 10 ? 5 : 0;
    const hintPenalty = hintUsed ? -5 : 0;
    const points = isCorrect ? Math.max(basePoints + timeBonus + hintPenalty, 5) : 0;

    // Update streak
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    setCurrentStreak(newStreak);
    setBestStreak(Math.max(bestStreak, newStreak));

    // Show motivational message
    if (isCorrect) {
      if (newStreak >= 3) {
        setMotivationalMessage(MOTIVATIONAL_MESSAGES.perfect[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.perfect.length)] + ` Streak ${newStreak}x! 🔥`);
      } else {
        setMotivationalMessage(MOTIVATIONAL_MESSAGES.good[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.good.length)]);
      }
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    } else {
      setMotivationalMessage(MOTIVATIONAL_MESSAGES.tryAgain[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.tryAgain.length)]);
    }

    // Record attempt
    try {
      await fetch(getApiEndpoint('sessions'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          subject: 'math',
          questionType: currentQuestion.type,
          questionText: currentQuestion.question,
          correctAnswer: currentQuestion.answer.toString(),
          userAnswer,
          isCorrect,
          difficultyLevel: currentQuestion.difficulty,
          pointsEarned: points,
          timeTakenSeconds: timeTaken,
          hintUsed,
        }),
      });

      // Update local stats
      const newTotalQuestions = totalQuestions + 1;
      setTotalQuestions(newTotalQuestions);
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        setScore(prev => prev + points);
      }

      // Check if should end session
      if (newTotalQuestions >= MAX_QUESTIONS) {
        setTimeout(() => {
          endSession();
          setShowSummary(true);
        }, 2000);
      } else {
        // Load next question after delay
        setTimeout(() => {
          loadNextQuestion(token);
          setMotivationalMessage(''); // Clear message
        }, 2000);
      }

    } catch (error) {
      console.error('Error recording attempt:', error);
      // Continue anyway
      setTimeout(() => {
        loadNextQuestion(token);
      }, 2000);
    }
  };

  const endSession = async () => {
    const token = localStorage.getItem('token');
    if (!token || !sessionId) return;

    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

    try {
      await fetch(getApiEndpoint('sessions'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          totalQuestions,
          correctAnswers,
          totalPoints: score,
          durationSeconds,
        }),
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleEarlyExit = async () => {
    if (totalQuestions > 0) {
      await endSession();
    }
    router.push('/dashboard/child');
  };

  // Summary screen
  if (showSummary) {
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📚'}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {accuracy >= 80 ? 'Luar Biasa!' : accuracy >= 60 ? 'Bagus Sekali!' : 'Terus Belajar!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {accuracy >= 80 ? 'Kamu sangat pintar! 🌟' : accuracy >= 60 ? 'Terus tingkatkan ya! 💪' : 'Jangan menyerah, belajar lagi! 📖'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600 mt-1">Total Soal</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600 mt-1">Jawaban Benar</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600 mt-1">Total Poin</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-yellow-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-gray-600 mt-1">Akurasi</div>
            </div>
          </div>
          
          {bestStreak >= 3 && (
            <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-xl p-6 mb-6 text-center transform hover:scale-105 transition">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-bold text-orange-600 text-xl">Streak Terbaik: {bestStreak}x</div>
              <div className="text-sm text-gray-600 mt-1">Jawaban benar berturut-turut! Hebat!</div>
            </div>
          )}
          
          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">💡 Saran untuk Kamu:</h3>
            <ul className="space-y-2 text-gray-700">
              {accuracy >= 80 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Kamu sudah sangat menguasai! Coba tingkat kesulitan lebih tinggi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Pertahankan streak-mu dengan latihan rutin setiap hari.</span>
                  </li>
                </>
              )}
              {accuracy >= 60 && accuracy < 80 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <span>Bagus! Latih lagi agar lebih lancar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <span>Fokus pada soal yang salah dan pelajari cara mengerjakannya.</span>
                  </li>
                </>
              )}
              {accuracy < 60 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">!</span>
                    <span>Jangan berkecil hati! Belajar itu butuh proses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">!</span>
                    <span>Coba pelajari materinya dulu sebelum latihan soal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">!</span>
                    <span>Minta bantuan guru atau orang tua jika ada yang sulit.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
            >
              🎯 Belajar Lagi
            </button>
            <button
              onClick={() => router.push('/dashboard/child')}
              className="w-full bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all"
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">🧮</div>
          <div className="text-3xl font-bold text-white drop-shadow-lg mb-2">Memuat soal...</div>
          <div className="text-white/80">Tunggu sebentar ya!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Enhanced Stats */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-xl border border-white/30">
          <div className="flex justify-between items-center">
            <button
              onClick={handleEarlyExit}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
            >
              ← Kembali
            </button>
            
            <div className="flex gap-3">
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-xs opacity-90">Poin</div>
              </div>
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg">
                <div className="text-2xl font-bold">{correctAnswers}/{totalQuestions}</div>
                <div className="text-xs opacity-90">Benar</div>
              </div>
              {currentStreak >= 2 && (
                <div className="bg-gradient-to-r from-orange-400 to-red-400 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg animate-pulse">
                  <div className="text-2xl font-bold">🔥 {currentStreak}x</div>
                  <div className="text-xs opacity-90">Streak</div>
                </div>
              )}
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg">
                <div className="text-lg font-bold">{totalQuestions}/{MAX_QUESTIONS}</div>
                <div className="text-xs opacity-90">Soal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-5 overflow-hidden shadow-inner border border-white/30">
            <div 
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ width: `${Math.max((totalQuestions / MAX_QUESTIONS) * 100, 5)}%` }}
            >
              {totalQuestions > 0 && `${Math.round((totalQuestions / MAX_QUESTIONS) * 100)}%`}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl">
            🧮 Belajar Matematika
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            Jawab soal dengan benar untuk dapat poin!
          </p>
        </div>

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-7xl animate-bounce drop-shadow-2xl bg-white/80 rounded-full p-8">
              {motivationalMessage}
            </div>
          </div>
        )}

        {/* Question Card */}
        {currentQuestion && !isProcessing && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}
        
        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <div className="text-2xl font-bold text-gray-700">Menyimpan jawaban...</div>
          </div>
        )}

        {/* Motivational Message Below */}
        {motivationalMessage && !showCelebration && !isProcessing && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 text-center border-2 border-purple-200">
              <div className="text-3xl font-bold text-gray-700 mb-2">{motivationalMessage}</div>
              <div className="text-gray-500">Soal berikutnya akan dimuat...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}