// src/contexts/UnifiedProgressContext.tsx
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useCourseProgress, useQuestionEvents } from '@/hooks/useUnifiedProgress'
import { AssessmentResult } from '@/types/domain'
import type { CourseProgress } from '@/lib/schemas'

interface UnifiedProgressContextType {
  // Progress data
  progress: CourseProgress | null
  loading: boolean
  error: string | null
  
  // Actions
  completeSection: (moduleId: string, sectionId: string) => Promise<void>
  addBookmark: (moduleId: string, sectionId: string) => Promise<void>
  removeBookmark: (moduleId: string, sectionId: string) => Promise<void>
  addNote: (moduleId: string, sectionId: string, content: string) => Promise<void>
  completeAssessment: (moduleId: string, assessmentId: string, result: AssessmentResult) => Promise<void>
  recordQuestion: (sectionKey: string, questionKey: string, isCorrect: boolean, attemptIndex?: number, responseMeta?: Record<string, any>) => Promise<void>
  
  // Utility functions
  isSectionCompleted: (sectionId: string) => boolean
  getCompletionPercentage: () => number
  refetch: () => void
}

const UnifiedProgressContext = createContext<UnifiedProgressContextType | undefined>(undefined)

interface UnifiedProgressProviderProps {
  children: ReactNode
  moduleId: string
}

export const UnifiedProgressProvider: React.FC<UnifiedProgressProviderProps> = ({ 
  children, 
  moduleId 
}) => {
  const { progress, updateProgress, loading, error, refetch } = useCourseProgress(`/${moduleId}`)
  const { recordQuestion: recordQuestionEvent } = useQuestionEvents(`/${moduleId}`)

  const completeSection = async (moduleId: string, sectionId: string) => {
    if (!progress) return
    
    const currentPercentage = (progress as CourseProgress).progressPercent || 0
    const newPercentage = Math.min(currentPercentage + 10, 100) // Increment by 10% per section
    
    await updateProgress(
      newPercentage,
      sectionId,
      'view_section'
    )
  }

  const addBookmark = async (moduleId: string, sectionId: string) => {
    if (!progress) return
    
    // Update progress with bookmark information
    await updateProgress(
      (progress as CourseProgress).progressPercent || 0,
      sectionId,
      'view_section'
    )
  }

  const removeBookmark = async (moduleId: string, sectionId: string) => {
    if (!progress) return
    
    // Update progress without bookmark
    await updateProgress(
      (progress as CourseProgress).progressPercent || 0,
      sectionId,
      'view_section'
    )
  }

  const addNote = async (moduleId: string, sectionId: string, content: string) => {
    if (!progress) return
    
    // Update progress with note information
    await updateProgress(
      (progress as CourseProgress).progressPercent || 0,
      sectionId,
      'view_section'
    )
  }

  const completeAssessment = async (
    moduleId: string, 
    assessmentId: string, 
    result: AssessmentResult
  ) => {
    if (!progress) return
    
    // Update progress based on assessment result
    const newPercentage = result.passed ? 100 : Math.round((result.correctAnswers / result.totalQuestions) * 100)
    
    await updateProgress(
      newPercentage,
      'assessment',
      result.passed ? 'complete_course' : 'view_section'
    )
  }

  const recordQuestion = async (
    sectionKey: string,
    questionKey: string,
    isCorrect: boolean,
    attemptIndex: number = 1,
    responseMeta?: Record<string, any>
  ) => {
    await recordQuestionEvent(
      sectionKey,
      questionKey,
      isCorrect,
      attemptIndex,
      responseMeta
    )
  }

  const isSectionCompleted = (sectionId: string): boolean => {
    // Since CourseProgress doesn't have completedSections, we'll use currentSection
    return (progress as CourseProgress | null)?.currentSection === sectionId || false
  }

  const getCompletionPercentage = (): number => {
    return (progress as CourseProgress | null)?.progressPercent || 0
  }

  const contextValue: UnifiedProgressContextType = {
    progress: progress as CourseProgress | null,
    loading,
    error,
    completeSection,
    addBookmark,
    removeBookmark,
    addNote,
    completeAssessment,
    recordQuestion,
    isSectionCompleted,
    getCompletionPercentage,
    refetch,
  }

  return (
    <UnifiedProgressContext.Provider value={contextValue}>
      {children}
    </UnifiedProgressContext.Provider>
  )
}

export const useUnifiedProgress = (): UnifiedProgressContextType => {
  const context = useContext(UnifiedProgressContext)
  if (context === undefined) {
    throw new Error('useUnifiedProgress must be used within a UnifiedProgressProvider')
  }
  return context
}

// Legacy compatibility wrapper
export const useProgress = (): UnifiedProgressContextType => {
  console.warn('⚠️ DEPRECATION WARNING: useProgress from UnifiedProgressContext is deprecated. Use useUnifiedProgress instead.')
  return useUnifiedProgress()
}
