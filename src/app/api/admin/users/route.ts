import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin API for user management
 * GET: List all users with filtering
 * POST: Create new user (invite)
 * PATCH: Update user role/status
 */

interface UserWithDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  role: string;
  isActive: boolean;
  plantId: string;
  plant: {
    name: string;
    location: string;
  };
  enrollments: Array<{
    courseId: string;
    courseName: string;
    status: string;
    enrolledAt: string;
    completedAt: string | null;
  }>;
  lastLoginAt: string | null;
  createdAt: string;
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
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search'); // for name/email search
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        job_title,
        role,
        is_active,
        plant_id,
        last_login_at,
        created_at,
        plants!user_profiles_plant_id_fkey (
          name,
          location
        ),
        course_enrollments!course_enrollments_user_id_fkey (
          course_id,
          status,
          enrolled_at,
          completed_at,
          courses!course_enrollments_course_id_fkey (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (plantId) {
      query = query.eq('plant_id', plantId);
    }
    if (role) {
      query = query.eq('role', role);
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Transform data
    const users: UserWithDetails[] = data?.map((userProfile: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.first_name || '',
      lastName: userProfile.last_name || '',
      jobTitle: userProfile.job_title || '',
      role: userProfile.role,
      isActive: userProfile.is_active,
      plantId: userProfile.plant_id,
      plant: {
        name: userProfile.plants?.name || '',
        location: userProfile.plants?.location || '',
      },
      enrollments: userProfile.course_enrollments?.map((enrollment: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        courseId: enrollment.course_id,
        courseName: enrollment.courses?.name || '',
        status: enrollment.status,
        enrolledAt: enrollment.enrolled_at,
        completedAt: enrollment.completed_at,
      })) || [],
      lastLoginAt: userProfile.last_login_at,
      createdAt: userProfile.created_at,
    })) || [];

    return NextResponse.json({
      success: true,
      data: users,
    });

  } catch (error) {
    console.error('Admin users API error:', error);
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

    if (!profile || !['hr_admin', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { 
      email, 
      firstName, 
      lastName, 
      jobTitle, 
      role = 'employee', 
      plantId 
    } = body;

    if (!email || !firstName || !lastName || !plantId) {
      return NextResponse.json(
        { success: false, error: 'email, firstName, lastName, and plantId are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // For now, we'll create a user profile entry
    // In a full implementation, you'd use Supabase Auth Admin API to create the auth user
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle,
        role,
        plant_id: plantId,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'User profile created. User must complete registration via invitation link.',
    });

  } catch (error) {
    console.error('Admin user creation API error:', error);
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

    const { 
      userId, 
      firstName, 
      lastName, 
      jobTitle, 
      role, 
      isActive, 
      plantId 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const updates: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      updated_at: new Date().toISOString(),
    };

    if (firstName !== undefined) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (jobTitle !== undefined) updates.job_title = jobTitle;
    if (role !== undefined) updates.role = role;
    if (isActive !== undefined) updates.is_active = isActive;
    if (plantId !== undefined) updates.plant_id = plantId;

    // Update user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('Admin user update API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}