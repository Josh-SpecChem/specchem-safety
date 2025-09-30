import { useState, useEffect } from 'react';

export interface Course {
  id: string;
  title: string;
  slug: string;
  version: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalEnrollments: number;
  completedEnrollments: number;
  avgProgress: number;
  completionRate: number;
}

export interface CourseStatistics {
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  avgCompletionRate: number;
}

export interface CoursesResponse {
  courses: Course[];
  statistics: CourseStatistics;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [statistics, setStatistics] = useState<CourseStatistics>({
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    avgCompletionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/courses');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch courses');
      }

      setCourses(data.data.courses);
      setStatistics(data.data.statistics);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: {
    title: string;
    slug: string;
    version?: string;
    isPublished?: boolean;
  }) => {
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create course');
      }

      // Refresh courses list
      await fetchCourses();
      return data.data;
    } catch (err) {
      console.error('Error creating course:', err);
      throw err;
    }
  };

  const toggleCourseStatus = async (courseId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update course');
      }

      // Update local state
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, isPublished }
          : course
      ));

      return data.data;
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    statistics,
    loading,
    error,
    refetch: fetchCourses,
    createCourse,
    toggleCourseStatus,
  };
}