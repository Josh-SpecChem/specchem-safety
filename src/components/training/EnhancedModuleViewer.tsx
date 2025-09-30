'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Download,
  ExternalLink,
  Award,
  AlertCircle
} from 'lucide-react'
import { useCourseProgress, useQuestionEvents } from '@/hooks/useApi'

interface EnhancedModuleViewerProps {
  courseRoute: string; // e.g., '/ebook' or '/ebook-spanish'
  moduleData: {
    id: string
    title: string
    description: string
    duration: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    sections: Array<{
      id: string
      title: string
      content: string
      estimatedReadTime: string
      questions?: Array<{
        id: string
        question: string
        options: string[]
        correctAnswer: number
        explanation?: string
      }>
    }>
    learningObjectives: string[]
    resources: Array<{
      id: string
      title: string
      type: string
      url: string
      description: string
    }>
  }
  onModuleComplete?: () => void
}

export default function EnhancedModuleViewer({ 
  courseRoute, 
  moduleData, 
  onModuleComplete 
}: EnhancedModuleViewerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [sessionStartTime] = useState(Date.now())
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showQuestionResult, setShowQuestionResult] = useState(false)
  const [questionAttempts, setQuestionAttempts] = useState<Record<string, number>>({})

  // Use our new API hooks
  const { 
    progress, 
    updateProgress, 
    loading: progressLoading, 
    updating: progressUpdating,
    error: progressError 
  } = useCourseProgress(courseRoute)
  
  const { 
    recordQuestion, 
    submitting: questionSubmitting, 
    error: questionError 
  } = useQuestionEvents(courseRoute)

  const currentSection = moduleData.sections[currentSectionIndex]
  const isLastSection = currentSectionIndex === moduleData.sections.length - 1
  const isFirstSection = currentSectionIndex === 0
  const hasQuestions = currentSection?.questions && currentSection.questions.length > 0
  const currentQuestion = hasQuestions ? currentSection.questions![currentQuestionIndex] : null

  // Calculate progress percentage based on sections completed
  const progressPercent = Math.round(((currentSectionIndex) / moduleData.sections.length) * 100)

  useEffect(() => {
    // Update reading progress based on scroll position
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min((scrolled / maxHeight) * 100, 100)
      setReadingProgress(scrollProgress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize from API progress when available
  useEffect(() => {
    if (progress && progress.currentSection) {
      const sectionIndex = moduleData.sections.findIndex(
        section => section.id === progress.currentSection
      )
      if (sectionIndex >= 0) {
        setCurrentSectionIndex(sectionIndex)
      }
    }
  }, [progress, moduleData.sections])

  const handleSectionComplete = async () => {
    const newProgressPercent = Math.round(((currentSectionIndex + 1) / moduleData.sections.length) * 100)
    const nextSectionId = isLastSection ? currentSection.id : moduleData.sections[currentSectionIndex + 1].id
    const eventType = isLastSection ? 'complete_course' : 'view_section'

    const success = await updateProgress(
      newProgressPercent,
      nextSectionId,
      eventType
    )

    if (success) {
      if (isLastSection) {
        onModuleComplete?.()
      } else {
        setCurrentSectionIndex(prev => prev + 1)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setShowQuestionResult(false)
      }
    }
  }

  const handleQuestionSubmit = async () => {
    if (!currentQuestion || selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const questionKey = currentQuestion.id
    const sectionKey = currentSection.id
    const attemptCount = (questionAttempts[questionKey] || 0) + 1

    // Update attempt count
    setQuestionAttempts(prev => ({
      ...prev,
      [questionKey]: attemptCount
    }))

    // Record question response
    const success = await recordQuestion(
      sectionKey,
      questionKey,
      isCorrect,
      attemptCount,
      {
        selectedAnswer,
        questionText: currentQuestion.question,
        options: currentQuestion.options,
        timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000)
      }
    )

    if (success) {
      setShowQuestionResult(true)
    }
  }

  const handleNextQuestion = () => {
    if (hasQuestions && currentQuestionIndex < currentSection.questions!.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowQuestionResult(false)
    } else {
      // All questions completed, move to next section or complete module
      handleSectionComplete()
    }
  }

  const handlePreviousSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(prev => prev - 1)
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowQuestionResult(false)
    }
  }

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Implement bookmark API call when available
  }

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading course progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Error Display */}
      {(progressError || questionError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700">
            {progressError || questionError}
          </span>
        </div>
      )}

      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-blue-900">{moduleData.title}</CardTitle>
              <p className="text-gray-600 mt-2">{moduleData.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={moduleData.difficulty === 'beginner' ? 'secondary' : 
                              moduleData.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                {moduleData.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {moduleData.duration}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Section {currentSectionIndex + 1} of {moduleData.sections.length}
                </span>
                <span className="text-sm text-gray-500">{progressPercent}% Complete</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{currentSection.title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmarkToggle}
                  className={isBookmarked ? 'text-yellow-600' : 'text-gray-400'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-gray-600"
                >
                  <StickyNote className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: currentSection.content }}
          />

          {/* Reading Time Estimate */}
          <div className="mt-6 flex items-center text-sm text-gray-500">
            <BookOpen className="w-4 h-4 mr-1" />
            Estimated reading time: {currentSection.estimatedReadTime}
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      {hasQuestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Knowledge Check
              {currentSection.questions!.length > 1 && (
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {currentSection.questions!.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium">{currentQuestion.question}</h4>
                
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showQuestionResult && setSelectedAnswer(index)}
                      disabled={showQuestionResult || questionSubmitting}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedAnswer === index 
                          ? showQuestionResult
                            ? index === currentQuestion.correctAnswer
                              ? 'bg-green-50 border-green-500 text-green-800'
                              : 'bg-red-50 border-red-500 text-red-800'
                            : 'bg-blue-50 border-blue-500'
                          : showQuestionResult && index === currentQuestion.correctAnswer
                            ? 'bg-green-50 border-green-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedAnswer === index
                            ? showQuestionResult
                              ? index === currentQuestion.correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : 'border-red-500 bg-red-500'
                              : 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>

                {showQuestionResult && currentQuestion.explanation && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <div>
                    {questionAttempts[currentQuestion.id] && (
                      <span className="text-sm text-gray-500">
                        Attempt {questionAttempts[currentQuestion.id]}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!showQuestionResult ? (
                      <Button 
                        onClick={handleQuestionSubmit}
                        disabled={selectedAnswer === null || questionSubmitting}
                        className="min-w-24"
                      >
                        {questionSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Answer'
                        )}
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < currentSection.questions!.length - 1 ? 'Next Question' : 
                         isLastSection ? 'Complete Module' : 'Next Section'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      {showNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Section Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this section..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline">
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousSection}
          disabled={isFirstSection}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Section
        </Button>

        {!hasQuestions && (
          <Button
            onClick={handleSectionComplete}
            disabled={progressUpdating}
            className="flex items-center gap-2"
          >
            {progressUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Updating...
              </>
            ) : (
              <>
                {isLastSection ? (
                  <>
                    <Award className="w-4 h-4" />
                    Complete Module
                  </>
                ) : (
                  <>
                    Next Section
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {moduleData.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Resources */}
      {moduleData.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {moduleData.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{resource.title}</h4>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {resource.type}
                    </Badge>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}