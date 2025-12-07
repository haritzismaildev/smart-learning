import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to execute queries
async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('📊 Query executed:', { text: text.substring(0, 100), duration: `${duration}ms`, rows: res.rowCount });
  return res;
}

// Verify token and get user
async function verifyToken(token: string) {
  const result = await query(
    'SELECT id, email, full_name, role FROM users WHERE id = (SELECT user_id FROM users WHERE email = $1)',
    [token]
  );
  return result.rows[0];
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Get parent ID from token (simplified - you should decode JWT properly)
    const parentResult = await query(
      `SELECT id, email, full_name FROM users WHERE role = 'parent' LIMIT 1`
    );

    if (parentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    const parentId = parentResult.rows[0].id;

    // Get all children of this parent
    const childrenResult = await query(
      `SELECT id, full_name, email, age, grade_level, avatar, created_at 
       FROM users 
       WHERE parent_id = $1 AND role = 'child'
       ORDER BY full_name`,
      [parentId]
    );

    const children = [];

    for (const child of childrenResult.rows) {
      // 1. Overall Statistics
      const overallStats = await query(
        `SELECT 
          COUNT(DISTINCT id)::integer as total_sessions,
          COALESCE(SUM(total_questions), 0)::integer as total_questions,
          COALESCE(SUM(correct_answers), 0)::integer as correct_answers,
          COALESCE(SUM(total_points), 0)::integer as total_points,
          COALESCE(SUM(time_spent_seconds), 0)::integer as total_time_seconds,
          ROUND(
            CASE 
              WHEN SUM(total_questions) > 0 
              THEN (SUM(correct_answers)::DECIMAL / SUM(total_questions)::DECIMAL * 100)
              ELSE 0 
            END, 2
          ) as avg_accuracy
        FROM learning_sessions
        WHERE user_id = $1`,
        [child.id]
      );

      // 2. Subject Performance
      const subjectPerformance = await query(
        `SELECT 
          subject,
          level,
          total_sessions,
          total_questions,
          correct_answers,
          accuracy_rate,
          mastery_level,
          last_practice_date,
          streak_days,
          best_streak
        FROM subject_performance
        WHERE user_id = $1
        ORDER BY subject, level`,
        [child.id]
      );

      // 3. Weekly Progress (last 4 weeks)
      const weeklyProgress = await query(
        `SELECT 
          week_start_date,
          week_end_date,
          total_sessions,
          total_questions,
          total_correct,
          weekly_accuracy,
          math_sessions,
          english_sessions,
          math_accuracy,
          english_accuracy
        FROM weekly_summaries
        WHERE user_id = $1
        ORDER BY week_start_date DESC
        LIMIT 4`,
        [child.id]
      );

      // 4. Daily Activity (last 30 days)
      const dailyActivity = await query(
        `SELECT 
          activity_date,
          total_sessions,
          total_questions,
          correct_answers,
          daily_accuracy,
          daily_points,
          subjects_practiced
        FROM daily_activities
        WHERE user_id = $1 
          AND activity_date >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY activity_date DESC`,
        [child.id]
      );

      // 5. Topic Mastery
      const topicMastery = await query(
        `SELECT 
          subject,
          topic,
          total_attempts,
          correct_attempts,
          accuracy_rate,
          mastery_percentage,
          status,
          last_attempt_date
        FROM topic_mastery
        WHERE user_id = $1
        ORDER BY subject, mastery_percentage DESC`,
        [child.id]
      );

      // 6. Recent Sessions (last 10)
      const recentSessions = await query(
        `SELECT 
          id,
          subject,
          topic,
          total_questions,
          correct_answers,
          total_points,
          time_spent_seconds,
          difficulty_level,
          created_at,
          ROUND(
            CASE 
              WHEN total_questions > 0 
              THEN (correct_answers::DECIMAL / total_questions::DECIMAL * 100)
              ELSE 0 
            END, 2
          ) as session_accuracy
        FROM learning_sessions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10`,
        [child.id]
      );

      // 7. Study Recommendations
      const recommendations = await query(
        `SELECT 
          subject,
          recommendation_type,
          title,
          description,
          priority_score,
          estimated_time_minutes,
          status
        FROM study_recommendations
        WHERE user_id = $1 
          AND is_active = true
        ORDER BY priority_score DESC
        LIMIT 5`,
        [child.id]
      );

      // 8. Parent Insights
      const insights = await query(
        `SELECT 
          insight_type,
          subject,
          priority,
          title,
          description,
          recommendation,
          generated_at
        FROM parent_insights
        WHERE child_id = $1 
          AND is_active = true
        ORDER BY 
          CASE priority
            WHEN 'high' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 3
          END,
          generated_at DESC
        LIMIT 10`,
        [child.id]
      );

      // 9. Calculate KPIs
      const kpis = {
        overall_progress: calculateOverallProgress(overallStats.rows[0]),
        consistency_score: calculateConsistencyScore(dailyActivity.rows),
        improvement_rate: calculateImprovementRate(weeklyProgress.rows),
        mastery_distribution: calculateMasteryDistribution(topicMastery.rows),
        learning_velocity: calculateLearningVelocity(dailyActivity.rows),
        focus_score: calculateFocusScore(subjectPerformance.rows),
      };

      // 10. Generate Smart Recommendations if needed
      const smartRecommendations = generateSmartRecommendations(
        overallStats.rows[0],
        subjectPerformance.rows,
        topicMastery.rows,
        kpis
      );

      children.push({
        child: {
          id: child.id,
          full_name: child.full_name,
          email: child.email,
          age: child.age,
          grade_level: child.grade_level,
          avatar: child.avatar,
          member_since: child.created_at,
        },
        overall_statistics: overallStats.rows[0],
        subject_performance: subjectPerformance.rows,
        weekly_progress: weeklyProgress.rows,
        daily_activity: dailyActivity.rows,
        topic_mastery: topicMastery.rows,
        recent_sessions: recentSessions.rows,
        recommendations: recommendations.rows,
        insights: insights.rows,
        kpis: kpis,
        smart_recommendations: smartRecommendations,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        parent: {
          id: parentResult.rows[0].id,
          full_name: parentResult.rows[0].full_name,
          email: parentResult.rows[0].email,
        },
        children: children,
        summary: {
          total_children: children.length,
          total_active_sessions: children.reduce((sum, c) => sum + (c.overall_statistics?.total_sessions || 0), 0),
          total_questions_answered: children.reduce((sum, c) => sum + (c.overall_statistics?.total_questions || 0), 0),
          average_accuracy: children.length > 0 
            ? (children.reduce((sum, c) => sum + (parseFloat(c.overall_statistics?.avg_accuracy) || 0), 0) / children.length).toFixed(2)
            : 0,
        },
      },
    });

  } catch (error) {
    console.error('❌ Error in parent dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// KPI CALCULATION FUNCTIONS
// ============================================

function calculateOverallProgress(stats: any) {
  if (!stats || !stats.total_questions) return 0;
  
  const accuracy = parseFloat(stats.avg_accuracy) || 0;
  const questionsCompleted = stats.total_questions;
  const sessions = stats.total_sessions;
  
  // Progress score based on activity and accuracy
  const activityScore = Math.min((questionsCompleted / 100) * 50, 50); // Max 50%
  const accuracyScore = (accuracy / 100) * 50; // Max 50%
  
  return Math.round(activityScore + accuracyScore);
}

function calculateConsistencyScore(dailyActivities: any[]) {
  if (!dailyActivities || dailyActivities.length === 0) return 0;
  
  const last30Days = 30;
  const activeDays = dailyActivities.length;
  
  return Math.round((activeDays / last30Days) * 100);
}

function calculateImprovementRate(weeklyProgress: any[]) {
  if (!weeklyProgress || weeklyProgress.length < 2) return 0;
  
  const latest = weeklyProgress[0];
  const previous = weeklyProgress[1];
  
  if (!previous || !latest) return 0;
  
  const latestAccuracy = parseFloat(latest.weekly_accuracy) || 0;
  const previousAccuracy = parseFloat(previous.weekly_accuracy) || 0;
  
  if (previousAccuracy === 0) return 0;
  
  const improvement = ((latestAccuracy - previousAccuracy) / previousAccuracy) * 100;
  return Math.round(improvement);
}

function calculateMasteryDistribution(topicMastery: any[]) {
  if (!topicMastery || topicMastery.length === 0) {
    return { mastered: 0, practiced: 0, learning: 0, not_started: 0 };
  }
  
  const distribution = {
    mastered: 0,
    practiced: 0,
    learning: 0,
    not_started: 0,
  };
  
  topicMastery.forEach((topic) => {
    if (topic.status === 'mastered') distribution.mastered++;
    else if (topic.status === 'practiced') distribution.practiced++;
    else if (topic.status === 'learning') distribution.learning++;
    else distribution.not_started++;
  });
  
  return distribution;
}

function calculateLearningVelocity(dailyActivities: any[]) {
  if (!dailyActivities || dailyActivities.length < 7) return 0;
  
  const last7Days = dailyActivities.slice(0, 7);
  const totalQuestions = last7Days.reduce((sum, day) => sum + (day.total_questions || 0), 0);
  
  return Math.round(totalQuestions / 7); // Questions per day
}

function calculateFocusScore(subjectPerformance: any[]) {
  if (!subjectPerformance || subjectPerformance.length === 0) return 0;
  
  const totalSessions = subjectPerformance.reduce((sum, s) => sum + (s.total_sessions || 0), 0);
  
  if (totalSessions === 0) return 0;
  
  // Calculate standard deviation to see if practice is balanced
  const avgSessions = totalSessions / subjectPerformance.length;
  const variance = subjectPerformance.reduce((sum, s) => {
    const diff = (s.total_sessions || 0) - avgSessions;
    return sum + (diff * diff);
  }, 0) / subjectPerformance.length;
  
  const stdDev = Math.sqrt(variance);
  
  // Lower std dev = more balanced = higher focus score
  const focusScore = Math.max(0, 100 - (stdDev * 10));
  
  return Math.round(focusScore);
}

// ============================================
// SMART RECOMMENDATIONS ENGINE
// ============================================

function generateSmartRecommendations(
  overallStats: any,
  subjectPerformance: any[],
  topicMastery: any[],
  kpis: any
) {
  const recommendations = [];
  
  // 1. Accuracy-based recommendations
  const accuracy = parseFloat(overallStats?.avg_accuracy) || 0;
  
  if (accuracy < 60) {
    recommendations.push({
      type: 'urgent',
      category: 'accuracy',
      title: 'Perlu Review Materi Dasar',
      description: 'Akurasi di bawah 60%. Sebaiknya review materi dasar sebelum lanjut ke topik baru.',
      action: 'Fokus ke soal-soal mudah dulu untuk membangun kepercayaan diri',
      priority: 100,
    });
  } else if (accuracy < 75) {
    recommendations.push({
      type: 'warning',
      category: 'accuracy',
      title: 'Tingkatkan Pemahaman',
      description: 'Akurasi 60-75%. Sudah baik, tapi masih bisa ditingkatkan.',
      action: 'Latihan rutin 15-20 menit per hari',
      priority: 70,
    });
  }
  
  // 2. Consistency recommendations
  if (kpis.consistency_score < 40) {
    recommendations.push({
      type: 'urgent',
      category: 'consistency',
      title: 'Belajar Lebih Rutin',
      description: 'Hanya belajar ' + Math.round(kpis.consistency_score * 0.3) + ' hari dalam 30 hari terakhir.',
      action: 'Target minimal 3-4 kali seminggu, masing-masing 15 menit',
      priority: 90,
    });
  }
  
  // 3. Subject-specific recommendations
  subjectPerformance.forEach((subject) => {
    const subjectAccuracy = parseFloat(subject.accuracy_rate) || 0;
    
    if (subjectAccuracy < 70 && subject.total_sessions > 5) {
      recommendations.push({
        type: 'warning',
        category: 'subject_weakness',
        title: `Perlu Perhatian: ${subject.subject}`,
        description: `Akurasi ${subject.subject} hanya ${subjectAccuracy}%`,
        action: `Fokus latihan ${subject.subject} dengan soal-soal level ${subject.level}`,
        priority: 80,
      });
    }
  });
  
  // 4. Mastery recommendations
  const masteredTopics = topicMastery.filter(t => t.status === 'mastered').length;
  const totalTopics = topicMastery.length;
  
  if (totalTopics > 0 && (masteredTopics / totalTopics) < 0.3) {
    recommendations.push({
      type: 'info',
      category: 'mastery',
      title: 'Kuasai Lebih Banyak Topik',
      description: `Baru ${masteredTopics} dari ${totalTopics} topik yang dikuasai`,
      action: 'Fokus menguasai 1-2 topik per minggu sampai 80%+ akurasi',
      priority: 60,
    });
  }
  
  // 5. Improvement recommendations
  if (kpis.improvement_rate < -10) {
    recommendations.push({
      type: 'urgent',
      category: 'declining',
      title: 'Performa Menurun',
      description: 'Akurasi turun ' + Math.abs(kpis.improvement_rate) + '% minggu ini',
      action: 'Evaluasi metode belajar, mungkin perlu istirahat atau ganti strategi',
      priority: 95,
    });
  } else if (kpis.improvement_rate > 10) {
    recommendations.push({
      type: 'success',
      category: 'improving',
      title: 'Terus Pertahankan!',
      description: 'Performa meningkat ' + kpis.improvement_rate + '% minggu ini',
      action: 'Strategi belajar sudah tepat, pertahankan ritme ini',
      priority: 50,
    });
  }
  
  // Sort by priority
  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}