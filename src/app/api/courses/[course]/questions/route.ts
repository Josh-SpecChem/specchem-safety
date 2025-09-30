import { NextRequest, NextResponse } from 'next/server';
import { recordQuestionEvent } from '@/lib/progress';
import { isValidCourseRoute } from '@/lib/courses';

interface RouteParams {
  params: Promise<{
    course: string;
  }>;
}

/**
 * POST /api/courses/[course]/questions - Record question response for analytics
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { course } = await params;
    const courseRoute = `/${course}`;
    
    if (!isValidCourseRoute(courseRoute)) {
      return NextResponse.json(
        { error: 'Invalid course route' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      sectionKey, 
      questionKey, 
      isCorrect, 
      attemptIndex = 1, 
      responseMeta 
    } = body;

    // Validate required fields
    if (!sectionKey || !questionKey || typeof isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: sectionKey, questionKey, isCorrect' },
        { status: 400 }
      );
    }

    // Record the question event
    const success = await recordQuestionEvent(
      courseRoute,
      sectionKey,
      questionKey,
      isCorrect,
      attemptIndex,
      responseMeta
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to record question event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Question response recorded',
    });
  } catch (error) {
    console.error('Error recording question event:', error);
    return NextResponse.json(
      { error: 'Failed to record question event' },
      { status: 500 }
    );
  }
}