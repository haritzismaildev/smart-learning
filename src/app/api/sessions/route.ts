import { NextRequest } from 'next/server';
import {
  createLearningSession,
  updateLearningSession,
  getSessionsByUserId,
  getSessionById,
  createQuestionAttempt,
  getAttemptsBySessionId,
  upsertUserProgress
} from '@/lib/db';
import {
  authenticateRequest,
  createAuthError,
  createSuccessResponse
} from '@/lib/auth';
import type {
  CreateSessionInput,
  UpdateSessionInput,
  CreateAttemptInput,
  Subject
} from '@/types';

/**
 * GET /api/sessions
 * Get user's learning sessions
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || auth.user!.userId.toString());
    const limit = parseInt(searchParams.get('limit') || '10');
    const sessionId = searchParams.get('sessionId');
    
    // If requesting specific session
    if (sessionId) {
      const session = await getSessionById(parseInt(sessionId));
      
      if (!session) {
        return createAuthError('Session tidak ditemukan', 404);
      }
      
      // Get attempts for this session
      const attempts = await getAttemptsBySessionId(parseInt(sessionId));
      
      return createSuccessResponse({
        session,
        attempts
      });
    }
    
    // Get all sessions for user
    const sessions = await getSessionsByUserId(userId, limit);
    
    return createSuccessResponse({
      sessions,
      total: sessions.length
    });
    
  } catch (error) {
    console.error('Get sessions error:', error);
    return createAuthError('Terjadi kesalahan saat mengambil data session', 500);
  }
}

/**
 * POST /api/sessions
 * Create new learning session
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    const body = await request.json();
    const { subject, topic } = body;
    
    // Validation
    if (!subject || !topic) {
      return createAuthError('Subject dan topic harus diisi', 400);
    }
    
    if (!['math', 'english'].includes(subject)) {
      return createAuthError('Subject harus math atau english', 400);
    }
    
    const input: CreateSessionInput = {
      userId: auth.user!.userId,
      subject: subject as Subject,
      topic
    };
    
    const session = await createLearningSession(input);
    
    console.log('✅ Session created:', session.id);
    
    return createSuccessResponse(session, 201);
    
  } catch (error) {
    console.error('Create session error:', error);
    return createAuthError('Terjadi kesalahan saat membuat session', 500);
  }
}

/**
 * PUT /api/sessions
 * Update learning session (end session)
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    const body = await request.json();
    const { sessionId, totalQuestions, correctAnswers, totalPoints, durationSeconds } = body;
    
    // Validation
    if (!sessionId) {
      return createAuthError('Session ID harus diisi', 400);
    }
    
    const input: UpdateSessionInput = {
      sessionId,
      totalQuestions: totalQuestions || 0,
      correctAnswers: correctAnswers || 0,
      totalPoints: totalPoints || 0,
      durationSeconds: durationSeconds || 0
    };
    
    const session = await updateLearningSession(input);
    
    // Update user progress
    if (session) {
      const levelUp = Math.floor(totalPoints / 100);
      await upsertUserProgress({
        userId: auth.user!.userId,
        subject: session.subject,
        level: levelUp,
        points: totalPoints,
        correct: correctAnswers,
        attempted: totalQuestions
      });
    }
    
    console.log('✅ Session updated:', sessionId);
    
    return createSuccessResponse(session);
    
  } catch (error) {
    console.error('Update session error:', error);
    return createAuthError('Terjadi kesalahan saat update session', 500);
  }
}

/**
 * PATCH /api/sessions
 * Record a question attempt
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    const body = await request.json();
    const {
      sessionId,
      subject,
      questionType,
      questionText,
      correctAnswer,
      userAnswer,
      isCorrect,
      difficultyLevel,
      pointsEarned,
      timeTakenSeconds,
      hintUsed
    } = body;
    
    const input: CreateAttemptInput = {
      sessionId,
      userId: auth.user!.userId,
      subject,
      questionType,
      questionText,
      correctAnswer,
      userAnswer,
      isCorrect,
      difficultyLevel,
      pointsEarned: pointsEarned || 0,
      timeTakenSeconds: timeTakenSeconds || 0,
      hintUsed: hintUsed || false
    };
    
    const attempt = await createQuestionAttempt(input);
    
    return createSuccessResponse(attempt, 201);
    
  } catch (error) {
    console.error('Record attempt error:', error);
    return createAuthError('Terjadi kesalahan saat menyimpan jawaban', 500);
  }
}