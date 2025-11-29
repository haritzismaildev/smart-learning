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

export default function MathLearningPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

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
        loadNextQuestion(token);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      setLoading(false);
    }
  };

  const loadNextQuestion = async (token: string) => {
    try {
      const response = await fetch(getApiEndpoint('questions/math?limit=1'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.questions && data.data.questions.length > 0) {
          setCurrentQuestion(data.data.questions[0]);
        }
      }
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (userAnswer: string, isCorrect: boolean, timeTaken: number, hintUsed: boolean) => {
    const token = localStorage.getItem('token');
    if (!token || !sessionId || !currentQuestion) return;

    const points = isCorrect ? (currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 20 : 30) : 0;

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
      setTotalQuestions(prev => prev + 1);
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        setScore(prev => prev + points);
      }

      // Load next question after delay
      setTimeout(() => {
        loadNextQuestion(token);
      }, 2000);

    } catch (error) {
      console.error('Error recording attempt:', error);
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

      router.push('/dashboard/child');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 flex items-center justify-center">
        <div className="text-white text-2xl">Memuat soal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={endSession}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition backdrop-blur-sm"
          >
            ← Kembali
          </button>
          
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
              <span className="font-semibold">Skor:</span> {score}
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
              <span className="font-semibold">Benar:</span> {correctAnswers}/{totalQuestions}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧮 Belajar Matematika
          </h1>
          <p className="text-white/80">
            Jawab soal dengan benar untuk dapat poin!
          </p>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}