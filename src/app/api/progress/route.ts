import { getAllUserProgress } from '@/lib/progress';
import { withContextAuth } from '@/lib/api-auth';

/**
 * GET /api/progress - Get user's progress across all courses
 */
export async function GET() {
  return withContextAuth(async (userContext) => {
    const progress = await getAllUserProgress();
    
    return {
      progress,
      user: {
        id: userContext.userId,
        plantId: userContext.plantId,
      },
    };
  });
}