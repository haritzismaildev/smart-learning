import { NextRequest } from 'next/server';
import { getRandomMathQuestions, getUserById } from '@/lib/db';
import { 
  authenticateRequest, 
  createAuthError, 
  createSuccessResponse 
} from '@/lib/auth';
import type { 
  MathQuestion, 
  FormattedQuestion, 
  MathQuestionType, 
  DifficultyLevel 
} from '@/types';

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
    const questionType = searchParams.get('type') as MathQuestionType | null;
    
    const age = user.age || 8;
    
    console.log('📊 Getting math questions for user:', { userId: user.id, age, limit });
    
    let questions = await getRandomMathQuestions(age, limit);
    
    console.log('✅ Found questions:', questions.length);
    
    if (questionType) {
      questions = questions.filter(q => q.question_type === questionType);
    }
    
    const formattedQuestions: FormattedQuestion[] = questions.map(q => {
      const questionText = q.question_template
        .replace('{num1}', q.number1.toString())
        .replace('{num2}', q.number2.toString());
      
      return {
        id: q.id,
        type: q.question_type,
        difficulty: q.difficulty_level,
        question: questionText,
        answer: q.correct_answer,
        hint: q.hint_text,
        number1: q.number1,
        number2: q.number2
      };
    });
    
    return createSuccessResponse({
      questions: formattedQuestions,
      userAge: age
    });
    
  } catch (error) {
    console.error('❌ Get math questions error:', error);
    return createAuthError('Terjadi kesalahan saat mengambil soal', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    const body = await request.json();
    const { type, difficulty, age } = body;
    
    const validTypes: MathQuestionType[] = ['addition', 'subtraction', 'multiplication', 'division'];
    if (!validTypes.includes(type)) {
      return createAuthError('Tipe soal tidak valid', 400);
    }
    
    const userAge = age || 8;
    
    const question = generateDynamicMathQuestion(type, difficulty || 'easy', userAge);
    
    return createSuccessResponse({ question });
    
  } catch (error) {
    console.error('❌ Generate math question error:', error);
    return createAuthError('Terjadi kesalahan saat membuat soal', 500);
  }
}

function generateDynamicMathQuestion(
  type: MathQuestionType, 
  difficulty: DifficultyLevel, 
  age: number
): FormattedQuestion {
  let maxNum = 10;
  
  if (age >= 6 && age <= 7) {
    maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
  } else if (age >= 8 && age <= 9) {
    maxNum = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
  } else if (age >= 10) {
    maxNum = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200;
  }
  
  let num1: number, num2: number, answer: number, question: string, hint: string;
  
  switch(type) {
    case 'addition':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      answer = num1 + num2;
      question = `Berapa ${num1} + ${num2}?`;
      hint = 'Jumlahkan kedua angka';
      break;
      
    case 'subtraction':
      num1 = Math.floor(Math.random() * maxNum) + Math.floor(maxNum / 2);
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      question = `Berapa ${num1} - ${num2}?`;
      hint = 'Kurangi angka kedua dari angka pertama';
      break;
      
    case 'multiplication':
      const maxMultiplier = age >= 10 ? 12 : age >= 8 ? 10 : 5;
      num1 = Math.floor(Math.random() * maxMultiplier) + 1;
      num2 = Math.floor(Math.random() * maxMultiplier) + 1;
      answer = num1 * num2;
      question = `Berapa ${num1} × ${num2}?`;
      hint = `Perkalian adalah penjumlahan berulang`;
      break;
      
    case 'division':
      const maxDivisor = age >= 10 ? 12 : age >= 8 ? 10 : 5;
      num2 = Math.floor(Math.random() * maxDivisor) + 2;
      answer = Math.floor(Math.random() * maxDivisor) + 1;
      num1 = num2 * answer;
      question = `Berapa ${num1} ÷ ${num2}?`;
      hint = `Pembagian adalah kebalikan perkalian`;
      break;
      
    default:
      throw new Error('Invalid question type');
  }
  
  return {
    id: 0,
    type,
    difficulty,
    question,
    answer,
    hint,
    number1: num1,
    number2: num2,
  };
}