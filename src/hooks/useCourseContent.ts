'use client';

import { CourseContent, SectionContent } from '@/contracts/base';
import { useEffect, useState } from 'react';

interface UseCourseContentOptions {
  courseId: string;
  language?: string;
  enabled?: boolean;
}

interface UseCourseContentReturn {
  data: CourseContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCourseContent({ 
  courseId, 
  language = 'en', 
  enabled = true 
}: UseCourseContentOptions): UseCourseContentReturn {
  const [data, setData] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseContent = async () => {
    if (!enabled || !courseId) return;

    setLoading(true);
    setError(null);

    try {
      const url = new URL(`/api/courses/${courseId}/content`, window.location.origin);
      url.searchParams.set('lang', language);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch course content');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching course content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseContent();
  }, [courseId, language, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchCourseContent
  };
}

interface UseSectionContentOptions {
  courseId: string;
  sectionKey: string;
  language?: string;
  enabled?: boolean;
}

interface UseSectionContentReturn {
  data: SectionContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSectionContent({ 
  courseId, 
  sectionKey, 
  language = 'en', 
  enabled = true 
}: UseSectionContentOptions): UseSectionContentReturn {
  const [data, setData] = useState<SectionContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSectionContent = async () => {
    if (!enabled || !courseId || !sectionKey) return;

    setLoading(true);
    setError(null);

    try {
      const url = new URL(`/api/courses/${courseId}/sections/${sectionKey}`, window.location.origin);
      url.searchParams.set('lang', language);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch section content');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching section content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionContent();
  }, [courseId, sectionKey, language, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchSectionContent
  };
}
