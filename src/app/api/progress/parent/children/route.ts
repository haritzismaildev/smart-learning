import { NextRequest } from 'next/server';
import {
  getAllProgressByUserId,
  getUserStatistics,
  getChildrenByParentId
} from '@/lib/db';
import {
  authenticateRequest,
  hasRole,
  createAuthError,
  createSuccessResponse
} from '@/lib/auth';
import type { User } from '@/types';

/**
 * POST /api/progress/parent/children
 * Get progress for all children (parent only)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return createAuthError(auth.error || 'Unauthorized', 401);
    }
    
    // Only parents can access this
    if (!hasRole(auth.user, 'parent')) {
      return createAuthError('Only parents can access this endpoint', 403);
    }
    
    const parentId = auth.user!.userId;
    
    // Get all children
    const children = await getChildrenByParentId(parentId);
    
    if (children.length === 0) {
      return createSuccessResponse({
        children: [],
        total: 0
      });
    }
    
    // Get progress for each child with proper typing
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