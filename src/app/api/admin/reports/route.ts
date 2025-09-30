import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin API for detailed analytics and reports
 * GET: Comprehensive analytics including completion rates, question performance, etc.
 */

interface DetailedAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalEnrollments: number;
    completedCourses: number;
    overallCompletionRate: number;
  };
  coursePerformance: Array<{
    courseId: string;
    courseName: string;
    totalEnrollments: number;
    completedEnrollments: number;
    completionRate: number;
    averageScore: number;
    averageTimeToComplete: number; // in days
  }>;
  plantPerformance: Array<{
    plantId: string;
    plantName: string;
    totalUsers: number;
    activeEnrollments: number;
    completedCourses: number;
    completionRate: number;
  }>;
  questionAnalytics: Array<{
    courseId: string;
    courseName: string;
    sectionKey: string;
    questionKey: string;
    totalAttempts: number;
    correctAttempts: number;
    accuracyRate: number;
    averageAttempts: number;
  }>;
  userActivity: Array<{
    date: string; // YYYY-MM-DD
    newUsers: number;
    activeUsers: number;
    coursesStarted: number;
    coursesCompleted: number;
  }>;
  complianceTracking: Array<{
    plantId: string;
    plantName: string;
    courseId: string;
    courseName: string;
    requiredUsers: number;
    enrolledUsers: number;
    completedUsers: number;
    complianceRate: number;
    overdueUsers: number;
  }>;
}

export async function GET() {
  try {
    const supabase = await createClient();
    // const { searchParams } = new URL(request.url);
    
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
      .select('role, plant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !['hr_admin', 'plant_manager', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters for future filtering capabilities
    // const plantId = searchParams.get('plantId');
    // const startDate = searchParams.get('startDate');
    // const endDate = searchParams.get('endDate');
    // const includeInactive = searchParams.get('includeInactive') === 'true';

    // 1. Overview Statistics
    const [usersResult, enrollmentsResult, completedResult] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('id, is_active', { count: 'exact' })
        .eq('is_active', true),
      
      supabase
        .from('course_enrollments')
        .select('id', { count: 'exact' }),
      
      supabase
        .from('course_enrollments')
        .select('id', { count: 'exact' })
        .eq('status', 'completed')
    ]);

    const totalUsers = usersResult.count || 0;
    const activeUsers = usersResult.data?.length || 0;
    const totalEnrollments = enrollmentsResult.count || 0;
    const completedCourses = completedResult.count || 0;
    const overallCompletionRate = totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0;

    // 2. Course Performance
    const { data: coursePerformanceData, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        name,
        course_enrollments!course_enrollments_course_id_fkey (
          id,
          status,
          enrolled_at,
          completed_at,
          user_progress!user_progress_enrollment_id_fkey (
            progress_percent
          ),
          question_events!question_events_enrollment_id_fkey (
            is_correct
          )
        )
      `);

    if (courseError) {
      console.error('Error fetching course performance:', courseError);
    }

    const coursePerformance = coursePerformanceData?.map(course => {
      const enrollments = course.course_enrollments || [];
      const completed = enrollments.filter(e => e.status === 'completed');
      const totalQuestions = enrollments.reduce((sum, e) => sum + (e.question_events?.length || 0), 0);
      const correctAnswers = enrollments.reduce((sum, e) => 
        sum + (e.question_events?.filter((q: any) => q.is_correct).length || 0), 0 // eslint-disable-line @typescript-eslint/no-explicit-any
      );

      // Calculate average time to complete
      const completionTimes = completed
        .filter(e => e.enrolled_at && e.completed_at)
        .map(e => {
          const start = new Date(e.enrolled_at);
          const end = new Date(e.completed_at!);
          return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
        });
      
      const averageTimeToComplete = completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
        : 0;

      return {
        courseId: course.id,
        courseName: course.name,
        totalEnrollments: enrollments.length,
        completedEnrollments: completed.length,
        completionRate: enrollments.length > 0 ? (completed.length / enrollments.length) * 100 : 0,
        averageScore: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
        averageTimeToComplete: Math.round(averageTimeToComplete * 10) / 10,
      };
    }) || [];

    // 3. Plant Performance
    const { data: plantPerformanceData, error: plantError } = await supabase
      .from('plants')
      .select(`
        id,
        name,
        user_profiles!user_profiles_plant_id_fkey (
          id,
          is_active,
          course_enrollments!course_enrollments_user_id_fkey (
            id,
            status
          )
        )
      `);

    if (plantError) {
      console.error('Error fetching plant performance:', plantError);
    }

    const plantPerformance = plantPerformanceData?.map(plant => {
      const users = plant.user_profiles || [];
      const allEnrollments = users.reduce((acc: any[], u) => acc.concat(u.course_enrollments || []), []); // eslint-disable-line @typescript-eslint/no-explicit-any
      const activeEnrollments = allEnrollments.filter(e => e.status === 'active');
      const completedEnrollments = allEnrollments.filter(e => e.status === 'completed');

      return {
        plantId: plant.id,
        plantName: plant.name,
        totalUsers: users.length,
        activeEnrollments: activeEnrollments.length,
        completedCourses: completedEnrollments.length,
        completionRate: allEnrollments.length > 0 ? (completedEnrollments.length / allEnrollments.length) * 100 : 0,
      };
    }) || [];

    // 4. Question Analytics
    const { data: questionData, error: questionError } = await supabase
      .from('question_events')
      .select(`
        course_id,
        section_key,
        question_key,
        is_correct,
        attempt_index,
        courses!question_events_course_id_fkey (
          name
        )
      `);

    if (questionError) {
      console.error('Error fetching question analytics:', questionError);
    }

    const questionAnalytics = Object.values(
      (questionData || []).reduce((acc: any, event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const key = `${event.course_id}-${event.section_key}-${event.question_key}`;
        
        if (!acc[key]) {
          acc[key] = {
            courseId: event.course_id,
            courseName: event.courses?.name || '',
            sectionKey: event.section_key,
            questionKey: event.question_key,
            totalAttempts: 0,
            correctAttempts: 0,
            attemptCounts: [],
          };
        }
        
        acc[key].totalAttempts++;
        if (event.is_correct) {
          acc[key].correctAttempts++;
        }
        acc[key].attemptCounts.push(event.attempt_index);
        
        return acc;
      }, {})
    ).map((qa: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      courseId: qa.courseId,
      courseName: qa.courseName,
      sectionKey: qa.sectionKey,
      questionKey: qa.questionKey,
      totalAttempts: qa.totalAttempts,
      correctAttempts: qa.correctAttempts,
      accuracyRate: qa.totalAttempts > 0 ? (qa.correctAttempts / qa.totalAttempts) * 100 : 0,
      averageAttempts: qa.attemptCounts.length > 0 
        ? qa.attemptCounts.reduce((sum: number, count: number) => sum + count, 0) / qa.attemptCounts.length 
        : 0,
    }));

    // 5. User Activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: activityData, error: activityError } = await supabase
      .from('activity_events')
      .select('event_date, event_type, user_id')
      .gte('event_date', thirtyDaysAgo.toISOString().split('T')[0]);

    if (activityError) {
      console.error('Error fetching activity data:', activityError);
    }

    const userActivity = Object.values(
      (activityData || []).reduce((acc: any, event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const date = event.event_date;
        
        if (!acc[date]) {
          acc[date] = {
            date,
            newUsers: 0,
            activeUsers: new Set(),
            coursesStarted: 0,
            coursesCompleted: 0,
          };
        }
        
        acc[date].activeUsers.add(event.user_id);
        
        if (event.event_type === 'user_created') acc[date].newUsers++;
        if (event.event_type === 'start_course') acc[date].coursesStarted++;
        if (event.event_type === 'complete_course') acc[date].coursesCompleted++;
        
        return acc;
      }, {})
    ).map((activity: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      date: activity.date,
      newUsers: activity.newUsers,
      activeUsers: activity.activeUsers.size,
      coursesStarted: activity.coursesStarted,
      coursesCompleted: activity.coursesCompleted,
    }));

    // 6. Compliance Tracking (simplified for now)
    const complianceTracking = plantPerformance.map(plant => ({
      plantId: plant.plantId,
      plantName: plant.plantName,
      courseId: '', // Would need course-specific compliance tracking
      courseName: 'All Courses',
      requiredUsers: plant.totalUsers,
      enrolledUsers: plant.activeEnrollments,
      completedUsers: plant.completedCourses,
      complianceRate: plant.completionRate,
      overdueUsers: Math.max(0, plant.totalUsers - plant.completedCourses),
    }));

    const analytics: DetailedAnalytics = {
      overview: {
        totalUsers,
        activeUsers,
        totalEnrollments,
        completedCourses,
        overallCompletionRate: Math.round(overallCompletionRate * 10) / 10,
      },
      coursePerformance,
      plantPerformance,
      questionAnalytics,
      userActivity,
      complianceTracking,
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });

  } catch (error) {
    console.error('Admin detailed analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}