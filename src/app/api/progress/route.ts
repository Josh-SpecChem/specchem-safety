import { NextResponse } from 'next/server';
import { getCurrentUserContext } from '@/lib/rls';
import { getAllUserProgress } from '@/lib/progress';

/**
 * GET /api/progress - Get user's progress across all courses
 */
export async function GET() {
  try {
    const userContext = await getCurrentUserContext();
    
    if (!userContext) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const progress = await getAllUserProgress();
    
    return NextResponse.json({
      success: true,
      data: progress,
      user: {
        id: userContext.userId,
        plantId: userContext.plantId,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}