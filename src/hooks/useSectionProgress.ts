'use client';

import { SectionProgress } from '@/contracts/base';
import { useCallback, useEffect, useState } from 'react';

interface UseSectionProgressOptions {
  courseId: string;
  sectionKey: string;
  enabled?: boolean;
}

interface UseSectionProgressReturn {
  progress: SectionProgress | null;
  loading: boolean;
  error: string | null;
  updateProgress: (data: {
    isCompleted?: boolean;
    timeSpentSeconds?: number;
  }) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useSectionProgress({ 
  courseId, 
  sectionKey, 
  enabled = true 
}: UseSectionProgressOptions): UseSectionProgressReturn {
  const [progress, setProgress] = useState<SectionProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!enabled || !courseId || !sectionKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionKey}/progress`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch progress');
      }

      setProgress(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching section progress:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, sectionKey, enabled]);

  const updateProgress = useCallback(async (data: {
    isCompleted?: boolean;
    timeSpentSeconds?: number;
  }) => {
    if (!courseId || !sectionKey) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionKey}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update progress');
      }

      setProgress(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error updating section progress:', err);
      throw err; // Re-throw to allow caller to handle
    }
  }, [courseId, sectionKey]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    loading,
    error,
    updateProgress,
    refetch: fetchProgress
  };
}

interface UseQuizSubmissionOptions {
  courseId: string;
  sectionKey: string;
}

interface UseQuizSubmissionReturn {
  submitAnswer: (questionKey: string, answer: string | string[]) => Promise<{
    isCorrect: boolean;
    explanation: string;
    correctAnswer: string | string[];
  }>;
  loading: boolean;
  error: string | null;
}

export function useQuizSubmission({ 
  courseId, 
  sectionKey 
}: UseQuizSubmissionOptions): UseQuizSubmissionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = useCallback(async (questionKey: string, answer: string | string[]) => {
    if (!courseId || !sectionKey || !questionKey) {
      throw new Error('Missing required parameters');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionKey}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionKey,
          answer,
          attemptIndex: 1 // Could be enhanced to track multiple attempts
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit answer');
      }

      return {
        isCorrect: result.data.isCorrect,
        explanation: result.data.explanation,
        correctAnswer: result.data.correctAnswer
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error submitting quiz answer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId, sectionKey]);

  return {
    submitAnswer,
    loading,
    error
  };
}

interface UseContentInteractionOptions {
  enabled?: boolean;
}

interface UseContentInteractionReturn {
  recordInteraction: (
    contentBlockId: string, 
    interactionType: string, 
    data?: any
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useContentInteraction({ 
  enabled = true 
}: UseContentInteractionOptions = {}): UseContentInteractionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordInteraction = useCallback(async (
    contentBlockId: string, 
    interactionType: string, 
    data?: any
  ) => {
    if (!enabled || !contentBlockId || !interactionType) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/content/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentBlockId,
          interactionType,
          interactionData: data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to record interaction');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error recording content interaction:', err);
      // Don't throw here - interactions are non-critical
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  return {
    recordInteraction,
    loading,
    error
  };
}
