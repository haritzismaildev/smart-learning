import { NextRequest } from 'next/server';
import { getRandomEnglishQuestions, getUserById } from '@/lib/db';
import { 
  authenticateRequest, 
  createAuthError, 
  createSuccessResponse 
} from '@/lib/auth';
import type { FormattedQuestion, EnglishQuestionType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    const user = await getUserById(auth.user!.userId);
    
    if (!user) {
      return createAuthError('User tidak ditemukan', 404);
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1');
    
    const age = user.age || 8;
    
    let questions = await getRandomEnglishQuestions(age, limit);
    
    const formattedQuestions: FormattedQuestion[] = questions.map(q => ({
      id: q.id,
      type: q.question_type,
      difficulty: q.difficulty_level,
      question: q.question_text,
      answer: q.correct_answer,
      hint: q.hint_text,
      word: q.word,
      translation: q.translation,
      example: q.example_sentence
    }));
    
    return createSuccessResponse({
      questions: formattedQuestions,
      userAge: age
    });
    
  } catch (error) {
    console.error('❌ Get English questions error:', error);
    return createAuthError('Terjadi kesalahan saat mengambil soal', 500);
  }
}