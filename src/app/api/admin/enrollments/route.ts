import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin API for enrollment management
 * GET: List all enrollments with filtering
 * POST: Create new enrollment
 * PATCH: Update enrollment status
 */

interface EnrollmentWithDetails {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  enrolledAt: string;
  completedAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    plantId: string;
    plant: {
      name: string;
    };
  };
  course: {
    name: string;
    isActive: boolean;
  };
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['hr_admin', 'plant_manager', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const plantId = searchParams.get('plantId');
    const courseId = searchParams.get('courseId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('course_enrollments')
      .select(`
        id,
        user_id,
        course_id,
        status,
        enrolled_at,
        completed_at,
        user_profiles!course_enrollments_user_id_fkey (
          first_name,
          last_name,
          email,
          plant_id,
          plants!user_profiles_plant_id_fkey (
            name
          )
        ),
        courses!course_enrollments_course_id_fkey (
          name,
          is_active
        )
      `)
      .order('enrolled_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (plantId) {
      query = query.eq('user_profiles.plant_id', plantId);
    }
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching enrollments:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch enrollments' },
        { status: 500 }
      );
    }

    // Transform data
    const enrollments: EnrollmentWithDetails[] = data?.map((enrollment: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: enrollment.id,
      userId: enrollment.user_id,
      courseId: enrollment.course_id,
      status: enrollment.status,
      enrolledAt: enrollment.enrolled_at,
      completedAt: enrollment.completed_at,
      user: {
        firstName: enrollment.user_profiles?.first_name || '',
        lastName: enrollment.user_profiles?.last_name || '',
        email: enrollment.user_profiles?.email || '',
        plantId: enrollment.user_profiles?.plant_id || '',
        plant: {
          name: enrollment.user_profiles?.plants?.name || '',
        },
      },
      course: {
        name: enrollment.courses?.name || '',
        isActive: enrollment.courses?.is_active || false,
      },
    })) || [];

    return NextResponse.json({
      success: true,
      data: enrollments,
    });

  } catch (error) {
    console.error('Admin enrollments API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['hr_admin', 'plant_manager', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'userId and courseId are required' },
        { status: 400 }
      );
    }

    // Check if enrollment already exists
    const { data: existing } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User is already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create enrollment
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating enrollment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create enrollment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('Admin enrollment creation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['hr_admin', 'plant_manager', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { enrollmentId, status, completedAt } = body;

    if (!enrollmentId || !status) {
      return NextResponse.json(
        { success: false, error: 'enrollmentId and status are required' },
        { status: 400 }
      );
    }

    const updates: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'completed' && completedAt) {
      updates.completed_at = completedAt;
    }

    // Update enrollment
    const { data, error } = await supabase
      .from('course_enrollments')
      .update(updates)
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating enrollment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update enrollment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('Admin enrollment update API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}