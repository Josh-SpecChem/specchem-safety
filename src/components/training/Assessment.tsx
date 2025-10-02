'use client'

import React, { useState, useEffect } from 'react'
import { AssessmentQuestion, AssessmentResult, AssessmentProps } from '@/types'
import { useCourseProgress, useQuestionEvents } from '@/hooks/useUnifiedProgress'
import { Clock, CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react'

export const Assessment: React.FC<AssessmentProps> = ({
  moduleId,
  assessment,
  onComplete
}) => {
  // Use unified hooks for progress tracking
  const { progress, updateProgress } = useCourseProgress(`/${moduleId}`)
  const { recordQuestion } = useQuestionEvents(`/${moduleId}`)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState((assessment.timeLimit || 45) * 60) // Convert to seconds, default 45 mins
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState(1)

  // Assessment attempts are not tracked in the current progress schema
  // Starting with attempt 1 for now
  useEffect(() => {
    setCurrentAttempt(1)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && !isCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitAssessment()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isStarted, isCompleted, timeRemaining])

  const handleStartAssessment = () => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setTimeRemaining((assessment.timeLimit || 45) * 60)
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const calculateScore = (): AssessmentResult => {
    let totalPoints = 0
    let earnedPoints = 0
    const questionResults: Record<string, boolean> = {}

    assessment.questions.forEach(question => {
      totalPoints += question.points
      const userAnswer = selectedAnswers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      questionResults[question.id] = isCorrect
      if (isCorrect) {
        earnedPoints += question.points
      }
    })

    const percentage = Math.round((earnedPoints / totalPoints) * 100)
    const passed = percentage >= assessment.passingScore

    return {
      attemptNumber: currentAttempt,
      score: percentage,
      totalQuestions: assessment.questions.length,
      correctAnswers: Object.values(questionResults).filter(Boolean).length,
      passed,
      timeSpent: ((assessment.timeLimit || 45) * 60) - timeRemaining,
      completedAt: new Date().toISOString(),
      questionResults
    }
  }

  const handleSubmitAssessment = async () => {
    const assessmentResult = calculateScore()
    setResult(assessmentResult)
    setIsCompleted(true)

    // Record question responses using unified hooks
    for (const [questionId, answer] of Object.entries(selectedAnswers)) {
      const question = assessment.questions.find(q => q.id === questionId)
      if (question) {
        await recordQuestion(
          'assessment',
          questionId,
          answer === question.correctAnswer,
          currentAttempt,
          { timeSpent: ((assessment.timeLimit || 45) * 60) - timeRemaining }
        )
      }
    }

    // Update progress using unified hooks
    await updateProgress(
      assessmentResult.passed ? 100 : Math.round((assessmentResult.correctAnswers / assessmentResult.totalQuestions) * 100),
      'assessment',
      assessmentResult.passed ? 'complete_course' : 'view_section'
    )

    onComplete(assessmentResult)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = (): string => {
    if (timeRemaining > 300) return 'text-green-600' // > 5 minutes
    if (timeRemaining > 120) return 'text-yellow-600' // > 2 minutes
    return 'text-red-600' // < 2 minutes
  }

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-federal-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h2>
          <p className="text-gray-600 mb-6">
            Ready to test your knowledge? This assessment will evaluate your understanding 
            of the training material.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Assessment Details</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {assessment.questions.length} questions</li>
                <li>• {assessment.timeLimit || 45} minute time limit</li>
                <li>• {assessment.passingScore}% required to pass</li>
                <li>• {assessment.maxAttempts} attempts allowed</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Progress</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Attempt: {currentAttempt} of {assessment.maxAttempts}</li>
                <li>• Time limit: {assessment.timeLimit || 45} minutes</li>
                <li>• Passing score: {assessment.passingScore || 80}%</li>
              </ul>
            </div>
          </div>

          {currentAttempt <= assessment.maxAttempts ? (
            <button
              onClick={handleStartAssessment}
              className="bg-federal-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Assessment
            </button>
          ) : (
            <div className="text-red-600">
              <p>Maximum attempts reached. Please contact your supervisor for additional attempts.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isCompleted && result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.passed ? (
              <Trophy className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Assessment Not Passed'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {result.passed 
              ? 'You have successfully completed the assessment.'
              : `You scored ${result.score}%. A score of ${assessment.passingScore}% is required to pass.`
            }
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Results</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Score: {result.score}%</li>
                <li>• Correct: {result.correctAnswers} of {result.totalQuestions}</li>
                <li>• Time: {formatTime(result.timeSpent)}</li>
                <li>• Attempt: {result.attemptNumber}</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
              {result.passed ? (
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Certificate generated</li>
                  <li>• Progress saved</li>
                  <li>• Continue to next module</li>
                </ul>
              ) : (
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Review training material</li>
                  <li>• {assessment.maxAttempts - currentAttempt} attempts remaining</li>
                  <li>• Retake when ready</li>
                </ul>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {!result.passed && currentAttempt < assessment.maxAttempts && (
              <button
                onClick={() => {
                  setIsStarted(false)
                  setIsCompleted(false)
                  setResult(null)
                  setCurrentAttempt(prev => prev + 1)
                }}
                className="bg-federal-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Retake Assessment
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Return to Module
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = assessment.questions[currentQuestionIndex]
  
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center text-red-600">
          <p>Error: Question not found</p>
        </div>
      </div>
    )
  }
  
  const isAnswered = selectedAnswers[currentQuestion.id]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{assessment.title}</h2>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className={`font-mono text-lg ${getTimeColor()}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-federal-blue h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-4">
          <span className="bg-federal-blue text-white px-2 py-1 rounded text-sm font-medium">
            {currentQuestion.points} pts
          </span>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
            {currentQuestion.difficulty}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestion.id] === option
                  ? 'border-federal-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={selectedAnswers[currentQuestion.id] === option}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswers[currentQuestion.id] === option
                  ? 'border-federal-blue'
                  : 'border-gray-300'
              }`}>
                {selectedAnswers[currentQuestion.id] === option && (
                  <div className="w-2 h-2 bg-federal-blue rounded-full" />
                )}
              </div>
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {assessment.questions.map((question, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestionIndex
                  ? 'bg-federal-blue text-white'
                  : selectedAnswers[question.id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === assessment.questions.length - 1 ? (
          <button
            onClick={handleSubmitAssessment}
            disabled={Object.keys(selectedAnswers).length !== assessment.questions.length}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Assessment
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className="bg-federal-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
