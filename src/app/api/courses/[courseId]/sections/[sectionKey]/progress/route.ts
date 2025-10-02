import {
    CreateSectionProgressSchema
} from '@/contracts/base';
import { handleApiError } from '@/lib/api-utils';
import { requireAuth } from '@/lib/auth';
import type { AuthResult } from '@/lib/auth/types/auth-types';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/courses/[courseId]/sections/[sectionKey]/progress
 * 
 * Creates or updates section progress for the authenticated user.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string; sectionKey: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { courseId, sectionKey } = params;
    
    // Authenticate user
    const authResult = await requireAuth() as unknown as AuthResult;
    const user = authResult.user;
    
    // Validate request body
    const body = await request.json();
    const validation = CreateSectionProgressSchema.safeParse({
      ...body,
      userId: user.id,
      plantId: body.plantId || 'default'
    });
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }
    
    // Get section ID from course and section key
    const { data: section, error: sectionError } = await supabase
      .from('course_sections')
      .select('id')
      .eq('course_id', courseId)
      .eq('section_key', sectionKey)
      .eq('is_published', true)
      .single();
    
    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Create or update section progress
    const progressData = {
      user_id: user.id,
      section_id: section.id,
      plant_id: body.plantId || 'default',
      is_completed: validation.data.isCompleted || false,
      time_spent_seconds: validation.data.timeSpentSeconds || 0,
      last_viewed_at: new Date().toISOString(),
      completed_at: validation.data.isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
    
    const { data: progress, error: progressError } = await supabase
      .from('section_progress')
      .upsert(progressData, {
        onConflict: 'user_id,section_id'
      })
      .select()
      .single();
    
    if (progressError) {
      throw progressError;
    }
    
    // Update overall course progress
    await updateCourseProgress(supabase, user.id, courseId, body.plantId || 'default');
    
    return NextResponse.json({
      success: true,
      data: progress
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/courses/[courseId]/sections/[sectionKey]/progress
 * 
 * Retrieves section progress for the authenticated user.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; sectionKey: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { courseId, sectionKey } = params;
    
    // Authenticate user
    const authResult = await requireAuth() as unknown as AuthResult;
    const user = authResult.user;
    
    // Get section ID from course and section key
    const { data: section, error: sectionError } = await supabase
      .from('course_sections')
      .select('id')
      .eq('course_id', courseId)
      .eq('section_key', sectionKey)
      .eq('is_published', true)
      .single();
    
    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Get section progress
    const { data: progress, error: progressError } = await supabase
      .from('section_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('section_id', section.id)
      .single();
    
    if (progressError && progressError.code !== 'PGRST116') {
      throw progressError;
    }
    
    return NextResponse.json({
      success: true,
      data: progress || null
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Helper function to update overall course progress
 */
async function updateCourseProgress(
  supabase: any,
  userId: string,
  courseId: string,
  plantId: string
) {
  // Get total sections count
  const { data: totalSections, error: totalError } = await supabase
    .from('course_sections')
    .select('id')
    .eq('course_id', courseId)
    .eq('is_published', true);
  
  if (totalError) {
    console.error('Error getting total sections:', totalError);
    return;
  }
  
  // Get completed sections count
  const { data: completedSections, error: completedError } = await supabase
    .from('section_progress')
    .select('section_id')
    .eq('user_id', userId)
    .eq('is_completed', true)
    .in('section_id', totalSections.map((s: any) => s.id));
  
  if (completedError) {
    console.error('Error getting completed sections:', completedError);
    return;
  }
  
  const totalCount = totalSections.length;
  const completedCount = completedSections?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Update overall progress
  const { error: updateError } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      plant_id: plantId,
      progress_percent: progressPercent,
      sections_completed: completedCount,
      total_sections: totalCount,
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,course_id'
    });
  
  if (updateError) {
    console.error('Error updating course progress:', updateError);
  }
}
