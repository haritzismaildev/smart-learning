import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;

    if (decoded.role !== 'child') {
      return NextResponse.json({
        success: false,
        error: 'Only children can access'
      }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level') || 'beginner';
    const topicId = searchParams.get('topic_id');

    // Get questions for specific topic
    if (topicId) {
      const questionsResult = await client.query(`
        SELECT 
          id, topic_id, level, question_type, question_text, question_arabic,
          option_a, option_b, option_c, option_d, difficulty, points
        FROM arabic_questions
        WHERE topic_id = $1
        ORDER BY RANDOM()
        LIMIT 10
      `, [topicId]);

      const topicResult = await client.query(`
        SELECT id, level, category, topic_name, topic_name_arabic, description
        FROM arabic_topics
        WHERE id = $1
      `, [topicId]);

      return NextResponse.json({
        success: true,
        data: {
          topic: topicResult.rows[0] || null,
          questions: questionsResult.rows
        }
      });
    }

    // Get topics by level
    const topicsResult = await client.query(`
      SELECT id, level, category, topic_name, topic_name_arabic, description, order_index
      FROM arabic_topics
      WHERE level = $1
      ORDER BY order_index
    `, [level]);

    return NextResponse.json({
      success: true,
      data: {
        level,
        topics: topicsResult.rows,
        total_topics: topicsResult.rows.length
      }
    });

  } catch (error: any) {
    console.error('Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch',
      details: error.message
    }, { status: 500 });
  } finally {
    client.release();
  }
}