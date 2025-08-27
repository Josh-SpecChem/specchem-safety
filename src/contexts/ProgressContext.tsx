'use client'

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { UserModuleProgress, AssessmentResult } from '@/types/training'

interface ProgressState {
  moduleProgress: { [moduleId: string]: UserModuleProgress }
  isLoading: boolean
  isSynced: boolean
}

type ProgressAction = 
  | { type: 'LOAD_PROGRESS'; payload: ProgressState }
  | { type: 'COMPLETE_SECTION'; payload: { moduleId: string; sectionId: string } }
  | { type: 'ADD_BOOKMARK'; payload: { moduleId: string; sectionId: string } }
  | { type: 'REMOVE_BOOKMARK'; payload: { moduleId: string; sectionId: string } }
  | { type: 'ADD_NOTE'; payload: { moduleId: string; sectionId: string; content: string } }
  | { type: 'COMPLETE_ASSESSMENT'; payload: { moduleId: string; assessmentId: string; result: AssessmentResult } }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: ProgressState = {
  moduleProgress: {},
  isLoading: true,
  isSynced: false
}

const getInitialModuleProgress = (moduleId: string): UserModuleProgress => ({
  moduleId,
  completedSections: [],
  bookmarks: [],
  notes: [],
  assessmentAttempts: [],
  completionPercentage: 0,
  lastAccessed: new Date().toISOString(),
  timeSpent: 0
})

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return {
        ...action.payload,
        isLoading: false
      }

    case 'COMPLETE_SECTION': {
      const { moduleId, sectionId } = action.payload
      const currentProgress = state.moduleProgress[moduleId] || getInitialModuleProgress(moduleId)
      
      const updatedSections = currentProgress.completedSections.includes(sectionId)
        ? currentProgress.completedSections
        : [...currentProgress.completedSections, sectionId]

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...currentProgress,
            completedSections: updatedSections,
            lastAccessed: new Date().toISOString()
          }
        },
        isSynced: false
      }
    }

    case 'ADD_BOOKMARK': {
      const { moduleId, sectionId } = action.payload
      const currentProgress = state.moduleProgress[moduleId] || getInitialModuleProgress(moduleId)
      
      const updatedBookmarks = currentProgress.bookmarks.includes(sectionId)
        ? currentProgress.bookmarks
        : [...currentProgress.bookmarks, sectionId]

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...currentProgress,
            bookmarks: updatedBookmarks,
            lastAccessed: new Date().toISOString()
          }
        },
        isSynced: false
      }
    }

    case 'REMOVE_BOOKMARK': {
      const { moduleId, sectionId } = action.payload
      const currentProgress = state.moduleProgress[moduleId] || getInitialModuleProgress(moduleId)

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...currentProgress,
            bookmarks: currentProgress.bookmarks.filter(id => id !== sectionId),
            lastAccessed: new Date().toISOString()
          }
        },
        isSynced: false
      }
    }

    case 'ADD_NOTE': {
      const { moduleId, sectionId, content } = action.payload
      const currentProgress = state.moduleProgress[moduleId] || getInitialModuleProgress(moduleId)
      
      const newNote = {
        sectionId,
        content,
        timestamp: new Date().toISOString()
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...currentProgress,
            notes: [...currentProgress.notes, newNote],
            lastAccessed: new Date().toISOString()
          }
        },
        isSynced: false
      }
    }

    case 'COMPLETE_ASSESSMENT': {
      const { moduleId, result } = action.payload
      const currentProgress = state.moduleProgress[moduleId] || getInitialModuleProgress(moduleId)

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...currentProgress,
            assessmentAttempts: [...currentProgress.assessmentAttempts, result],
            lastAccessed: new Date().toISOString()
          }
        },
        isSynced: false
      }
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

interface ProgressContextType {
  state: ProgressState
  dispatch: React.Dispatch<ProgressAction>
  completeSection: (moduleId: string, sectionId: string) => void
  addBookmark: (moduleId: string, sectionId: string) => void
  removeBookmark: (moduleId: string, sectionId: string) => void
  addNote: (moduleId: string, sectionId: string, content: string) => void
  completeAssessment: (moduleId: string, assessmentId: string, result: AssessmentResult) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

interface ProgressProviderProps {
  children: ReactNode
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState)

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const storedProgress = localStorage.getItem('specchem-training-progress')
        if (storedProgress) {
          const parsedProgress = JSON.parse(storedProgress)
          dispatch({
            type: 'LOAD_PROGRESS',
            payload: {
              moduleProgress: parsedProgress.moduleProgress || {},
              isLoading: false,
              isSynced: true
            }
          })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error loading progress:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadProgress()
  }, [])

  // Save progress to localStorage when state changes
  useEffect(() => {
    if (!state.isLoading && !state.isSynced) {
      try {
        localStorage.setItem('specchem-training-progress', JSON.stringify({
          moduleProgress: state.moduleProgress
        }))
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    }
  }, [state.moduleProgress, state.isLoading, state.isSynced])

  const completeSection = (moduleId: string, sectionId: string) => {
    dispatch({
      type: 'COMPLETE_SECTION',
      payload: { moduleId, sectionId }
    })
  }

  const addBookmark = (moduleId: string, sectionId: string) => {
    dispatch({
      type: 'ADD_BOOKMARK',
      payload: { moduleId, sectionId }
    })
  }

  const removeBookmark = (moduleId: string, sectionId: string) => {
    dispatch({
      type: 'REMOVE_BOOKMARK',
      payload: { moduleId, sectionId }
    })
  }

  const addNote = (moduleId: string, sectionId: string, content: string) => {
    dispatch({
      type: 'ADD_NOTE',
      payload: { moduleId, sectionId, content }
    })
  }

  const completeAssessment = (moduleId: string, assessmentId: string, result: AssessmentResult) => {
    dispatch({
      type: 'COMPLETE_ASSESSMENT',
      payload: { moduleId, assessmentId, result }
    })
  }

  return (
    <ProgressContext.Provider value={{
      state,
      dispatch,
      completeSection,
      addBookmark,
      removeBookmark,
      addNote,
      completeAssessment
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
