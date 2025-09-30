import { NextRequest, NextResponse } from 'next/server';
import { getProgressByRoute, updateProgressByRoute, recordActivityEvent } from '@/lib/progress';
import { isValidCourseRoute } from '@/lib/courses';

interface RouteParams {
  params: Promise<{
    course: string;
  }>;
}

/**
 * GET /api/courses/[course]/progress - Get progress for a specific course route
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { course } = await params;
    const courseRoute = `/${course}`;
    
    if (!isValidCourseRoute(courseRoute)) {
      return NextResponse.json(
        { error: 'Invalid course route' },
        { status: 400 }
      );
    }

    const progress = await getProgressByRoute(courseRoute);
    
    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found or user not enrolled' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course progress' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[course]/progress - Update progress for a specific course
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
    const { progressPercent, currentSection, eventType } = body;

    // Validate progress data
    if (typeof progressPercent !== 'number' || progressPercent < 0 || progressPercent > 100) {
      return NextResponse.json(
        { error: 'Invalid progress percentage' },
        { status: 400 }
      );
    }

    // Update progress
    const success = await updateProgressByRoute(courseRoute, progressPercent, currentSection);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Record activity event if provided
    if (eventType) {
      await recordActivityEvent(courseRoute, eventType, {
        progressPercent,
        currentSection,
        timestamp: new Date().toISOString(),
      });
    }

    // Get updated progress
    const updatedProgress = await getProgressByRoute(courseRoute);

    return NextResponse.json({
      success: true,
      data: updatedProgress,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}