export type UserRole = 'parent' | 'child';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  parent_id?: number | null;
  age?: number | null;
  grade_level?: number | null;
  avatar?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  parentId?: number;
  age?: number;
  gradeLevel?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  fullName: string;
  iat?: number;
  exp?: number;
}

// ==================== QUESTION TYPES ====================
export type MathQuestionType = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type EnglishQuestionType = 'vocabulary' | 'grammar' | 'reading';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type Subject = 'math' | 'english';

export interface MathQuestion {
  id: number;
  question_type: MathQuestionType;
  difficulty_level: DifficultyLevel;
  min_age: number;
  max_age: number;
  number1: number;
  number2: number;
  correct_answer: number;
  question_template: string;
  hint_text: string;
  created_at: Date;
}

export interface EnglishQuestion {
  id: number;
  question_type: EnglishQuestionType;
  difficulty_level: DifficultyLevel;
  min_age: number;
  max_age: number;
  word: string;
  translation: string;
  category: string;
  example_sentence: string;
  question_text: string;
  correct_answer: string;
  hint_text: string;
  created_at: Date;
}

export interface FormattedQuestion {
  id: number;
  type: string;
  difficulty: DifficultyLevel;
  question: string;
  answer: string | number;
  hint: string;
  number1?: number;
  number2?: number;
  word?: string;
  translation?: string;
  example?: string;
}

export interface GenerateQuestionInput {
  type: MathQuestionType | EnglishQuestionType;
  difficulty: DifficultyLevel;
  age: number;
}

// ==================== SESSION TYPES ====================
export interface LearningSession {
  id: number;
  user_id: number;
  subject: Subject;
  topic: string;
  started_at: Date;
  ended_at?: Date | null;
  total_questions: number;
  correct_answers: number;
  total_points: number;
  duration_seconds: number;
}

export interface CreateSessionInput {
  userId: number;
  subject: Subject;
  topic: string;
}

export interface UpdateSessionInput {
  sessionId: number;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  durationSeconds: number;
}

// ==================== QUESTION ATTEMPT TYPES ====================
export interface QuestionAttempt {
  id: number;
  session_id: number;
  user_id: number;
  subject: Subject;
  question_type: string;
  question_text: string;
  correct_answer: string;
  user_answer: string | null;
  is_correct: boolean;
  difficulty_level: DifficultyLevel;
  points_earned: number;
  time_taken_seconds: number;
  hint_used: boolean;
  attempted_at: Date;
}

export interface CreateAttemptInput {
  sessionId: number;
  userId: number;
  subject: Subject;
  questionType: string;
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  difficultyLevel: DifficultyLevel;
  pointsEarned: number;
  timeTakenSeconds: number;
  hintUsed: boolean;
}

// ==================== PROGRESS TYPES ====================
export interface UserProgress {
  id: number;
  user_id: number;
  subject: Subject;
  current_level: number;
  total_points: number;
  total_correct: number;
  total_attempted: number;
  last_activity: Date;
}

export interface UpsertProgressInput {
  userId: number;
  subject: Subject;
  level: number;
  points: number;
  correct: number;
  attempted: number;
}

// ==================== ACHIEVEMENT TYPES ====================
export interface Achievement {
  id: number;
  user_id: number;
  achievement_type: string;
  achievement_name: string;
  description: string | null;
  icon: string;
  earned_at: Date;
}

export interface CreateAchievementInput {
  userId: number;
  type: string;
  name: string;
  description?: string;
  icon: string;
}

// ==================== STATISTICS TYPES ====================
export interface UserStatistics {
  total_sessions: number;
  total_questions_answered: number;
  total_correct: number;
  total_points: number;
  total_time_seconds: number;
  avg_accuracy: number;
}

export interface SubjectStatistics {
  total_sessions: number;
  total_questions: number;
  total_correct: number;
  total_points: number;
  accuracy: number;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== DATABASE CONFIG TYPES ====================
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// ==================== APP CONFIG TYPES ====================
export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  port: number;
  host: string;
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export interface Config {
  app: AppConfig;
  db: DatabaseConfig;
  jwt: JWTConfig;
}

// ==================== VALIDATION TYPES ====================
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface PasswordValidation extends ValidationResult {
  strength?: 'weak' | 'medium' | 'strong';
}

// ==================== REQUEST/RESPONSE HELPERS ====================
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  statusCode?: number;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// ==================== QUERY PARAMETERS ====================
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QuestionQueryParams extends PaginationParams {
  type?: MathQuestionType | EnglishQuestionType;
  difficulty?: DifficultyLevel;
  age?: number;
  limit?: number;
}

export interface SessionQueryParams extends PaginationParams {
  userId?: number;
  subject?: Subject;
  startDate?: string;
  endDate?: string;
}