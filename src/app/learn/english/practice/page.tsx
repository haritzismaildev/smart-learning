'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';

interface Question {
  id: number;
  type: string;
  difficulty: string;
  question: string;
  answer: string;
  hint: string;
  word?: string;
  translation?: string;
  example?: string;
  options?: string[];
}

const MOTIVATIONAL_MESSAGES = {
  perfect: ['🎉 Perfect!', '⭐ Excellent!', '🏆 Outstanding!', '💯 Amazing!'],
  good: ['👍 Good job!', '😊 Well done!', '✨ Great!', '🌟 Nice!'],
  tryAgain: ['💪 Try again!', '🤔 Almost!', '📚 Keep learning!', '🎯 Don\'t give up!']
};

function EnglishPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelId = searchParams.get('level') || '1';

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
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
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
      
      const sessionResponse = await fetch(getApiEndpoint('sessions'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'english',
          topic: 'general'
        }),
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setSessionId(sessionData.data.id);
        setSessionStartTime(Date.now());
        
        await loadNextQuestion(token);
      } else {
        throw new Error('Failed to start session');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start learning session. Please try again.');
      setLoading(false);
    }
  };

  const loadNextQuestion = async (token: string) => {
    try {
      setLoading(true);
      setIsProcessing(false);
      setUserAnswer('');
      setShowHint(false);
      setHintUsed(false);
      setQuestionStartTime(Date.now());
      
      const response = await fetch(getApiEndpoint('questions/english?limit=1'), {
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
      alert('Failed to load question. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isProcessing || !userAnswer.trim()) return;
    
    const token = localStorage.getItem('token');
    if (!token || !sessionId || !currentQuestion) return;

    setIsProcessing(true);

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();

    // Calculate points
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
      setMotivationalMessage(MOTIVATIONAL_MESSAGES.tryAgain[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.tryAgain.length)] + ` Correct answer: ${currentQuestion.answer}`);
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
          subject: 'english',
          questionType: currentQuestion.type,
          questionText: currentQuestion.question,
          correctAnswer: currentQuestion.answer,
          userAnswer: userAnswer.trim(),
          isCorrect,
          difficultyLevel: currentQuestion.difficulty,
          pointsEarned: points,
          timeTakenSeconds: timeTaken,
          hintUsed,
        }),
      });

      const newTotalQuestions = totalQuestions + 1;
      setTotalQuestions(newTotalQuestions);
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        setScore(prev => prev + points);
      }

      if (newTotalQuestions >= MAX_QUESTIONS) {
        setTimeout(() => {
          endSession();
          setShowSummary(true);
        }, 2000);
      } else {
        setTimeout(() => {
          loadNextQuestion(token);
          setMotivationalMessage('');
        }, 2000);
      }

    } catch (error) {
      console.error('Error recording attempt:', error);
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

  const handleShowHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  // Summary screen
  if (showSummary) {
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📚'}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good Job!' : 'Keep Learning!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {accuracy >= 80 ? 'You\'re doing great! 🌟' : accuracy >= 60 ? 'Keep practicing! 💪' : 'Don\'t give up! 📖'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600 mt-1">Total Questions</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600 mt-1">Total Points</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-yellow-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-gray-600 mt-1">Accuracy</div>
            </div>
          </div>
          
          {bestStreak >= 3 && (
            <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-xl p-6 mb-6 text-center transform hover:scale-105 transition">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-bold text-orange-600 text-xl">Best Streak: {bestStreak}x</div>
              <div className="text-sm text-gray-600 mt-1">Correct answers in a row!</div>
            </div>
          )}
          
          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">💡 Recommendations:</h3>
            <ul className="space-y-2 text-gray-700">
              {accuracy >= 80 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Excellent! Try a higher difficulty level next time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Practice speaking English with friends or family.</span>
                  </li>
                </>
              )}
              {accuracy >= 60 && accuracy < 80 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <span>Good progress! Review the grammar rules again.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <span>Try reading English books for children.</span>
                  </li>
                </>
              )}
              {accuracy < 60 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">!</span>
                    <span>Don't worry! Learning takes time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">!</span>
                    <span>Review the tutorial materials before practicing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">!</span>
                    <span>Ask your teacher or parents if you need help.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
            >
              🎯 Practice Again
            </button>
            <button
              onClick={() => router.push('/dashboard/child')}
              className="w-full bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">🌍</div>
          <div className="text-3xl font-bold text-white drop-shadow-lg mb-2">Loading question...</div>
          <div className="text-white/80">Please wait!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Stats */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-xl border border-white/30">
          <div className="flex justify-between items-center">
            <button
              onClick={handleEarlyExit}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
            >
              ← Back
            </button>
            
            <div className="flex gap-3">
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-xs opacity-90">Points</div>
              </div>
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg">
                <div className="text-2xl font-bold">{correctAnswers}/{totalQuestions}</div>
                <div className="text-xs opacity-90">Correct</div>
              </div>
              {currentStreak >= 2 && (
                <div className="bg-gradient-to-r from-orange-400 to-red-400 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg animate-pulse">
                  <div className="text-2xl font-bold">🔥 {currentStreak}x</div>
                  <div className="text-xs opacity-90">Streak</div>
                </div>
              )}
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-center shadow-lg">
                <div className="text-lg font-bold">{totalQuestions}/{MAX_QUESTIONS}</div>
                <div className="text-xs opacity-90">Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-5 overflow-hidden shadow-inner border border-white/30">
            <div 
              className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 h-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ width: `${Math.max((totalQuestions / MAX_QUESTIONS) * 100, 5)}%` }}
            >
              {totalQuestions > 0 && `${Math.round((totalQuestions / MAX_QUESTIONS) * 100)}%`}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl">
            🌍 English Practice
          </h1>
          <p className="text-white/90 text-xl drop-shadow-lg">
            Answer correctly to earn points!
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
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            {/* Question Type Badge */}
            <div className="flex justify-between items-center mb-6">
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </div>
              
              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                {currentQuestion.type === 'vocabulary' ? '📚 Vocabulary' : '📝 Grammar'}
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.word && (
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 mb-4">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {currentQuestion.word}
                  </div>
                  {currentQuestion.example && (
                    <div className="text-gray-600 italic">
                      "{currentQuestion.example}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                placeholder="Type your answer here..."
                className="w-full p-6 text-2xl text-center border-4 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition"
                disabled={isProcessing}
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleShowHint}
                disabled={showHint || isProcessing}
                className={`flex-1 py-4 rounded-xl font-bold transition ${
                  showHint || isProcessing
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
                }`}
              >
                💡 Show Hint (-5 points)
              </button>
              
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isProcessing}
                className={`flex-1 py-4 rounded-xl font-bold text-white transition ${
                  !userAnswer.trim() || isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                ✓ Submit Answer
              </button>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💡</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Hint:</h4>
                    <p className="text-gray-700">{currentQuestion.hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <div className="text-2xl font-bold text-gray-700">Checking answer...</div>
          </div>
        )}

        {/* Motivational Message */}
        {motivationalMessage && !showCelebration && !isProcessing && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 text-center border-2 border-purple-200">
              <div className="text-2xl font-bold text-gray-700 mb-2">{motivationalMessage}</div>
              <div className="text-gray-500">Loading next question...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnglishPracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-300 flex items-center justify-center">
        <div className="text-white text-2xl">Loading practice...</div>
      </div>
    }>
      <EnglishPracticeContent />
    </Suspense>
  );
}