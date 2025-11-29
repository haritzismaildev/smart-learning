import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { config } from './config';
import type {
  User,
  CreateUserInput,
  LearningSession,
  CreateSessionInput,
  UpdateSessionInput,
  QuestionAttempt,
  CreateAttemptInput,
  UserProgress,
  UpsertProgressInput,
  Achievement,
  CreateAchievementInput,
  UserStatistics,
  SubjectStatistics,
  MathQuestion,
  EnglishQuestion,
  Subject,
} from '@/types';

/**
 * Create PostgreSQL connection pool
 */
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listeners for connection monitoring
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Query helper function with logging
 */
export async function query<T extends QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    if (config.app.isDevelopment) {
      console.log('📊 Query executed:', { 
        text: text.substring(0, 100), 
        duration: `${duration}ms`, 
        rows: res.rowCount 
      });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool (for transactions)
 * Simplified version without monkey patching
 */
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

/**
 * Transaction helper
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// ==================== USER QUERIES ====================

export async function createUser(input: CreateUserInput & { hashedPassword: string }): Promise<User> {
  const text = `
    INSERT INTO users (email, password, full_name, role, parent_id, age, grade_level)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, email, full_name, role, parent_id, age, grade_level, avatar, created_at, updated_at
  `;
  const values = [
    input.email,
    input.hashedPassword,
    input.fullName,
    input.role,
    input.parentId || null,
    input.age || null,
    input.gradeLevel || null,
  ];
  const result = await query<User>(text, values);
  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const text = 'SELECT * FROM users WHERE email = $1';
  const result = await query<User>(text, [email]);
  return result.rows[0] || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const text = `
    SELECT id, email, full_name, role, parent_id, age, grade_level, avatar, created_at, updated_at 
    FROM users 
    WHERE id = $1
  `;
  const result = await query<User>(text, [id]);
  return result.rows[0] || null;
}

export async function getChildrenByParentId(parentId: number): Promise<User[]> {
  const text = `
    SELECT id, email, full_name, age, grade_level, avatar, created_at, updated_at 
    FROM users 
    WHERE parent_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await query<User>(text, [parentId]);
  return result.rows;
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User> {
  const fields = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');
  
  const text = `
    UPDATE users 
    SET ${fields}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1 
    RETURNING *
  `;
  const values = [id, ...Object.values(updates)];
  const result = await query<User>(text, values);
  return result.rows[0];
}

// ==================== SESSION QUERIES ====================

export async function createLearningSession(input: CreateSessionInput): Promise<LearningSession> {
  const text = `
    INSERT INTO learning_sessions (user_id, subject, topic)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [input.userId, input.subject, input.topic];
  const result = await query<LearningSession>(text, values);
  return result.rows[0];
}

export async function updateLearningSession(input: UpdateSessionInput): Promise<LearningSession> {
  const text = `
    UPDATE learning_sessions 
    SET total_questions = $2, 
        correct_answers = $3, 
        total_points = $4, 
        duration_seconds = $5,
        ended_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const values = [
    input.sessionId,
    input.totalQuestions,
    input.correctAnswers,
    input.totalPoints,
    input.durationSeconds,
  ];
  const result = await query<LearningSession>(text, values);
  return result.rows[0];
}

export async function getSessionsByUserId(userId: number, limit: number = 10): Promise<LearningSession[]> {
  const text = `
    SELECT * FROM learning_sessions 
    WHERE user_id = $1 
    ORDER BY started_at DESC 
    LIMIT $2
  `;
  const result = await query<LearningSession>(text, [userId, limit]);
  return result.rows;
}

export async function getSessionById(sessionId: number): Promise<LearningSession | null> {
  const text = 'SELECT * FROM learning_sessions WHERE id = $1';
  const result = await query<LearningSession>(text, [sessionId]);
  return result.rows[0] || null;
}

// ==================== QUESTION ATTEMPT QUERIES ====================

export async function createQuestionAttempt(input: CreateAttemptInput): Promise<QuestionAttempt> {
  const text = `
    INSERT INTO question_attempts 
    (session_id, user_id, subject, question_type, question_text, correct_answer, 
     user_answer, is_correct, difficulty_level, points_earned, time_taken_seconds, hint_used)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  const values = [
    input.sessionId,
    input.userId,
    input.subject,
    input.questionType,
    input.questionText,
    input.correctAnswer,
    input.userAnswer,
    input.isCorrect,
    input.difficultyLevel,
    input.pointsEarned,
    input.timeTakenSeconds,
    input.hintUsed,
  ];
  const result = await query<QuestionAttempt>(text, values);
  return result.rows[0];
}

export async function getAttemptsBySessionId(sessionId: number): Promise<QuestionAttempt[]> {
  const text = `
    SELECT * FROM question_attempts 
    WHERE session_id = $1 
    ORDER BY attempted_at ASC
  `;
  const result = await query<QuestionAttempt>(text, [sessionId]);
  return result.rows;
}

export async function getAttemptsByUserId(userId: number, limit: number = 50): Promise<QuestionAttempt[]> {
  const text = `
    SELECT * FROM question_attempts 
    WHERE user_id = $1 
    ORDER BY attempted_at DESC 
    LIMIT $2
  `;
  const result = await query<QuestionAttempt>(text, [userId, limit]);
  return result.rows;
}

// ==================== PROGRESS QUERIES ====================

export async function getUserProgress(userId: number, subject: Subject): Promise<UserProgress | null> {
  const text = 'SELECT * FROM user_progress WHERE user_id = $1 AND subject = $2';
  const result = await query<UserProgress>(text, [userId, subject]);
  return result.rows[0] || null;
}

export async function upsertUserProgress(input: UpsertProgressInput): Promise<UserProgress> {
  const text = `
    INSERT INTO user_progress (user_id, subject, current_level, total_points, total_correct, total_attempted, last_activity)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id, subject) 
    DO UPDATE SET 
      current_level = user_progress.current_level + $3,
      total_points = user_progress.total_points + $4,
      total_correct = user_progress.total_correct + $5,
      total_attempted = user_progress.total_attempted + $6,
      last_activity = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const values = [
    input.userId,
    input.subject,
    input.level,
    input.points,
    input.correct,
    input.attempted,
  ];
  const result = await query<UserProgress>(text, values);
  return result.rows[0];
}

export async function getAllProgressByUserId(userId: number): Promise<UserProgress[]> {
  const text = 'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY last_activity DESC';
  const result = await query<UserProgress>(text, [userId]);
  return result.rows;
}

// ==================== QUESTION QUERIES ====================

export async function getRandomMathQuestions(age: number, limit: number = 1): Promise<MathQuestion[]> {
  const text = `
    SELECT * FROM math_questions 
    WHERE min_age <= $1 AND max_age >= $1 
    ORDER BY RANDOM() 
    LIMIT $2
  `;
  const result = await query<MathQuestion>(text, [age, limit]);
  return result.rows;
}

export async function getRandomEnglishQuestions(age: number, limit: number = 1): Promise<EnglishQuestion[]> {
  const text = `
    SELECT * FROM english_questions 
    WHERE min_age <= $1 AND max_age >= $1 
    ORDER BY RANDOM() 
    LIMIT $2
  `;
  const result = await query<EnglishQuestion>(text, [age, limit]);
  return result.rows;
}

// ==================== ACHIEVEMENT QUERIES ====================

export async function createAchievement(input: CreateAchievementInput): Promise<Achievement> {
  const text = `
    INSERT INTO achievements (user_id, achievement_type, achievement_name, description, icon)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [input.userId, input.type, input.name, input.description || null, input.icon];
  const result = await query<Achievement>(text, values);
  return result.rows[0];
}

export async function getAchievementsByUserId(userId: number): Promise<Achievement[]> {
  const text = `
    SELECT * FROM achievements 
    WHERE user_id = $1 
    ORDER BY earned_at DESC
  `;
  const result = await query<Achievement>(text, [userId]);
  return result.rows;
}

// ==================== STATISTICS QUERIES ====================

export async function getUserStatistics(userId: number): Promise<UserStatistics> {
  const text = `
    SELECT 
      COUNT(DISTINCT ls.id)::integer as total_sessions,
      COALESCE(SUM(ls.total_questions), 0)::integer as total_questions_answered,
      COALESCE(SUM(ls.correct_answers), 0)::integer as total_correct,
      COALESCE(SUM(ls.total_points), 0)::integer as total_points,
      COALESCE(SUM(ls.duration_seconds), 0)::integer as total_time_seconds,
      COALESCE(AVG(CASE WHEN ls.total_questions > 0 
        THEN (ls.correct_answers::float / ls.total_questions) * 100 
        ELSE 0 END), 0)::numeric as avg_accuracy
    FROM learning_sessions ls
    WHERE ls.user_id = $1
  `;
  const result = await query<UserStatistics>(text, [userId]);
  return result.rows[0];
}

export async function getSubjectStatistics(userId: number, subject: Subject): Promise<SubjectStatistics> {
  const text = `
    SELECT 
      COUNT(DISTINCT ls.id)::integer as total_sessions,
      COALESCE(SUM(ls.total_questions), 0)::integer as total_questions,
      COALESCE(SUM(ls.correct_answers), 0)::integer as total_correct,
      COALESCE(SUM(ls.total_points), 0)::integer as total_points,
      COALESCE(AVG(CASE WHEN ls.total_questions > 0 
        THEN (ls.correct_answers::float / ls.total_questions) * 100 
        ELSE 0 END), 0)::numeric as accuracy
    FROM learning_sessions ls
    WHERE ls.user_id = $1 AND ls.subject = $2
  `;
  const result = await query<SubjectStatistics>(text, [userId, subject]);
  return result.rows[0];
}

/**
 * Close pool connection (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('🔌 Database connection pool closed');
}

export default pool;