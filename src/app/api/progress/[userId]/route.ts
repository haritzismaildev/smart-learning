import { NextRequest } from 'next/server';
import {
  getAllProgressByUserId,
  getUserStatistics,
  getSubjectStatistics,
  getUserById,
  getChildrenByParentId
} from '@/lib/db';
import {
  authenticateRequest,
  hasRole,
  createAuthError,
  createSuccessResponse
} from '@/lib/auth';
import type { Subject, User } from '@/types';

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

/**
 * GET /api/progress/[userId]
 * Get user progress and statistics
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    // Await params in Next.js 15+
    const params = await context.params;
    const requestedUserId = parseInt(params.userId);
    const currentUserId = auth.user!.userId;
    
    // Check authorization
    if (requestedUserId !== currentUserId) {
      if (hasRole(auth.user, 'parent')) {
        const children = await getChildrenByParentId(currentUserId);
        const isTheirChild = children.some((child: User) => child.id === requestedUserId);
        
        if (!isTheirChild) {
          return createAuthError('Unauthorized to view this user\'s progress', 403);
        }
      } else {
        return createAuthError('Unauthorized to view this user\'s progress', 403);
      }
    }
    
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') as Subject | null;
    
    const user = await getUserById(requestedUserId);
    
    if (!user) {
      return createAuthError('User tidak ditemukan', 404);
    }
    
    const allProgress = await getAllProgressByUserId(requestedUserId);
    const overallStats = await getUserStatistics(requestedUserId);
    
    let subjectStats = null;
    if (subject) {
      subjectStats = await getSubjectStatistics(requestedUserId, subject);
    }
    
    return createSuccessResponse({
      user: {
        id: user.id,
        full_name: user.full_name,
        age: user.age,
        grade_level: user.grade_level
      },
      progress: allProgress,
      statistics: {
        overall: overallStats,
        subject: subjectStats
      }
    });
    
  } catch (error) {
    console.error('Get progress error:', error);
    return createAuthError('Terjadi kesalahan saat mengambil progress', 500);
  }
}

/**
 * POST /api/progress/parent/children
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    if (!hasRole(auth.user, 'parent')) {
      return createAuthError('Only parents can access this endpoint', 403);
    }
    
    const parentId = auth.user!.userId;
    const children = await getChildrenByParentId(parentId);
    
    const childrenProgress = await Promise.all(
      children.map(async (child: User) => {
        const progress = await getAllProgressByUserId(child.id);
        const stats = await getUserStatistics(child.id);
        
        return {
          child: {
            id: child.id,
            full_name: child.full_name,
            age: child.age,
            grade_level: child.grade_level
          },
          progress,
          statistics: stats
        };
      })
    );
    
    return createSuccessResponse({
      children: childrenProgress,
      total: children.length
    });
    
  } catch (error) {
    console.error('Get children progress error:', error);
    return createAuthError('Terjadi kesalahan saat mengambil data anak', 500);
  }
}