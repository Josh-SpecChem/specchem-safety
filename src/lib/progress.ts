import { activityEvents, enrollments, progress, questionEvents } from '@/contracts';
import type { ActivityEventMeta, QuestionResponseMeta } from '@/types';
import { and, desc, eq } from 'drizzle-orm';
import { getCourseByRoute } from './courses';
import { getDb } from './db/connection';
import { getCurrentUserContext } from './rls';

/**
 * Progress tracking utilities for SpecChem Safety Training
 * Integrates database progress with existing route-based system
 */

export interface CourseProgress {
  courseId: string;
  courseSlug: string;
  progressPercent: number;
  currentSection: string | null;
  lastActiveAt: Date;
  enrollmentStatus: 'enrolled' | 'in_progress' | 'completed';
}

/**
 * Get user's progress for a specific course route
 */
export async function getProgressByRoute(route: string): Promise<CourseProgress | null> {
  const userContext = await getCurrentUserContext();
  const courseInfo = getCourseByRoute(route);
  
  if (!userContext || !courseInfo) {
    return null;
  }

  try {
    // Get enrollment status
    const enrollment = await getDb().query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userContext.userId),
        eq(enrollments.courseId, courseInfo.id)
      ),
    });

    // Get progress data
    const progressData = await getDb().query.progress.findFirst({
      where: and(
        eq(progress.userId, userContext.userId),
        eq(progress.courseId, courseInfo.id)
      ),
    });

    if (!enrollment || !progressData) {
      return null;
    }

    return {
      courseId: courseInfo.id,
      courseSlug: courseInfo.slug,
      progressPercent: progressData.progressPercent,
      currentSection: progressData.currentSection,
      lastActiveAt: new Date(progressData.lastActiveAt),
      enrollmentStatus: enrollment.status,
    };
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
}

/**
 * Update user's progress for a specific course route
 */
export async function updateProgressByRoute(
  route: string,
  progressPercent: number,
  currentSection?: string
): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  const courseInfo = getCourseByRoute(route);
  
  if (!userContext || !courseInfo) {
    return false;
  }

  try {
    // Update progress
    await getDb()
      .update(progress)
      .set({
        progressPercent: Math.max(progressPercent, 0), // Ensure non-negative
        currentSection: currentSection || null,
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(and(
        eq(progress.userId, userContext.userId),
        eq(progress.courseId, courseInfo.id)
      ));

    // Update enrollment status based on progress
    const newStatus = progressPercent >= 100 ? 'completed' : 
                     progressPercent > 0 ? 'in_progress' : 'enrolled';
    
    await getDb()
      .update(enrollments)
      .set({
        status: newStatus,
        completedAt: progressPercent >= 100 ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(
        eq(enrollments.userId, userContext.userId),
        eq(enrollments.courseId, courseInfo.id)
      ));

    return true;
  } catch (error) {
    console.error('Error updating progress:', error);
    return false;
  }
}

/**
 * Record a question event (for analytics)
 */
export async function recordQuestionEvent(
  route: string,
  sectionKey: string,
  questionKey: string,
  isCorrect: boolean,
  attemptIndex: number = 1,
  responseMeta?: QuestionResponseMeta
): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  const courseInfo = getCourseByRoute(route);
  
  if (!userContext || !courseInfo) {
    return false;
  }

  try {
    await getDb().insert(questionEvents).values({
      userId: userContext.userId,
      courseId: courseInfo.id,
      plantId: userContext.plantId,
      sectionKey,
      questionKey,
      isCorrect,
      attemptIndex,
      responseMeta,
      answeredAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error recording question event:', error);
    return false;
  }
}

/**
 * Record an activity event (for analytics)
 */
export async function recordActivityEvent(
  route: string,
  eventType: 'view_section' | 'start_course' | 'complete_course',
  meta?: ActivityEventMeta
): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  const courseInfo = getCourseByRoute(route);
  
  if (!userContext || !courseInfo) {
    return false;
  }

  try {
    await getDb().insert(activityEvents).values({
      userId: userContext.userId,
      courseId: courseInfo.id,
      plantId: userContext.plantId,
      eventType,
      meta,
      occurredAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error recording activity event:', error);
    return false;
  }
}

/**
 * Get user's progress across all courses
 */
export async function getAllUserProgress(): Promise<CourseProgress[]> {
  const userContext = await getCurrentUserContext();
  
  if (!userContext) {
    return [];
  }

  try {
    const userEnrollments = await getDb().query.enrollments.findMany({
      where: eq(enrollments.userId, userContext.userId),
      with: {
        course: true,
      },
      orderBy: [desc(enrollments.enrolledAt)],
    });

    const progressPromises = userEnrollments.map(async (enrollment: any) => {
      const progressData = await getDb().query.progress.findFirst({
        where: and(
          eq(progress.userId, userContext.userId),
          eq(progress.courseId, enrollment.courseId)
        ),
      });

      return {
        courseId: enrollment.courseId,
        courseSlug: enrollment.course.slug,
        progressPercent: progressData?.progressPercent || 0,
        currentSection: progressData?.currentSection || null,
        lastActiveAt: new Date(progressData?.lastActiveAt || enrollment.enrolledAt),
        enrollmentStatus: enrollment.status,
      };
    });

    return await Promise.all(progressPromises);
  } catch (error) {
    console.error('Error fetching all user progress:', error);
    return [];
  }
}

/**
 * Initialize progress for a new user (called by trigger or manual enrollment)
 */
export async function initializeUserProgress(
  userId: string,
  plantId: string,
  courseId: string
): Promise<boolean> {
  try {
    // Create initial progress record
    await getDb().insert(progress).values({
      userId,
      courseId,
      plantId,
      progressPercent: 0,
      currentSection: 'introduction',
      lastActiveAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    return false;
  }
}