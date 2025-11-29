'use client'

import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  type: string;
  difficulty: string;
  question: string;
  answer: number | string;
  hint: string;
  number1?: number;
  number2?: number;
  word?: string;
  translation?: string;
  example?: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (userAnswer: string, isCorrect: boolean, timeTaken: number, hintUsed: boolean) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [startTime] = useState(Date.now());
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setUserAnswer('');
    setShowHint(false);
    setFeedback(null);
    setHintUsed(false);
  }, [question.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswer = question.answer.toString().toLowerCase().trim();
    const userAnswerNormalized = userAnswer.toLowerCase().trim();
    const isCorrect = userAnswerNormalized === correctAnswer;

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: '🎉 Benar! Jawaban kamu tepat!'
      });
    } else {
      setFeedback({
        type: 'error',
        message: `🤔 Belum tepat. Jawaban yang benar adalah ${question.answer}`
      });
    }

    // Call parent handler after showing feedback
    setTimeout(() => {
      onAnswer(userAnswer, isCorrect, timeTaken, hintUsed);
    }, 1500);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      setHintUsed(true);
    }
  };

  const difficultyColor = 
    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className={`px-4 py-1 rounded-full text-sm font-semibold ${difficultyColor}`}>
          {question.difficulty === 'easy' ? 'Mudah' : question.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
        </div>
        <div className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
          {question.type === 'addition' ? 'Penjumlahan' : 
           question.type === 'subtraction' ? 'Pengurangan' :
           question.type === 'multiplication' ? 'Perkalian' :
           question.type === 'division' ? 'Pembagian' : 'Vocabulary'}
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {question.question}
        </h2>
        {question.example && (
          <p className="text-gray-600 italic">
            Contoh: {question.example}
          </p>
        )}
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-2xl text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            placeholder="Tulis jawabanmu..."
            disabled={!!feedback}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!!feedback || !userAnswer.trim()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {feedback ? 'Memuat...' : 'Jawab'}
          </button>
          
          <button
            type="button"
            onClick={toggleHint}
            className="px-6 py-4 bg-yellow-400 text-yellow-900 rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
            title="Lihat petunjuk"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
      </form>

      {/* Hint */}
      {showHint && (
        <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="font-semibold text-yellow-800 mb-1">Petunjuk:</div>
              <div className="text-yellow-700">{question.hint}</div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`mt-4 p-4 rounded-xl animate-fadeIn ${
          feedback.type === 'success' 
            ? 'bg-green-50 border-2 border-green-300' 
            : 'bg-orange-50 border-2 border-orange-300'
        }`}>
          <div className={`font-semibold ${
            feedback.type === 'success' ? 'text-green-800' : 'text-orange-800'
          }`}>
            {feedback.message}
          </div>
        </div>
      )}

      {/* Progress Note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        💪 Terus semangat! Setiap jawaban benar akan menambah poin kamu
      </div>
    </div>
  );
}