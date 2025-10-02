'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizQuestion } from '@/contracts/base';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizRendererProps {
  questions: QuizQuestion[];
  onSubmit: (questionKey: string, answer: string | string[]) => Promise<{
    isCorrect: boolean;
    explanation: string;
    correctAnswer: string | string[];
  }>;
  onComplete?: (allCorrect: boolean) => void;
}

interface QuizState {
  answers: Record<string, string | string[] | undefined>;
  results: Record<string, {
    isCorrect: boolean;
    explanation: string;
    correctAnswer: string | string[];
    submitted: boolean;
  } | undefined>;
  loading: Record<string, boolean>;
}

export function QuizRenderer({ questions, onSubmit, onComplete }: QuizRendererProps) {
  const [state, setState] = useState<QuizState>({
    answers: {},
    results: {},
    loading: {}
  });

  const handleAnswerChange = (questionKey: string, answer: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: answer
      }
    }));
  };

  const handleSubmit = async (question: QuizQuestion) => {
    const answer = state.answers[question.questionKey];
    if (!answer) return;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [question.questionKey]: true }
    }));

    try {
      const result = await onSubmit(question.questionKey, answer);
      
      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [question.questionKey]: {
            ...result,
            submitted: true
          }
        },
        loading: { ...prev.loading, [question.questionKey]: false }
      }));

      // Check if all questions are completed and correct
      const allResults = { ...state.results, [question.questionKey]: { ...result, submitted: true } };
      const completedQuestions = Object.keys(allResults).length;
      const correctAnswers = Object.values(allResults).filter(r => r?.isCorrect).length;
      
      if (completedQuestions === questions.length) {
        onComplete?.(correctAnswers === questions.length);
      }
      
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [question.questionKey]: false }
      }));
    }
  };

  const handleReset = (questionKey: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: undefined
      },
      results: {
        ...prev.results,
        [questionKey]: undefined
      }
    }));
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const userAnswer = state.answers[question.questionKey];
        const result = state.results[question.questionKey];
        const isLoading = state.loading[question.questionKey];
        const showResult = result?.submitted;

        return (
          <Card key={question.id} className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-blue-800 text-lg sm:text-xl">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                Knowledge Check
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4 sm:space-y-6">
                <p className="font-medium text-gray-900 text-base sm:text-lg leading-relaxed">
                  {question.questionText}
                </p>
                
                {question.questionType === 'true-false' ? (
                  <div className="space-y-3 sm:space-y-4">
                    {['True', 'False'].map((option) => (
                      <label 
                        key={option} 
                        className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 min-h-[44px]"
                      >
                        <input
                          type="radio"
                          name={question.questionKey}
                          value={option}
                          checked={userAnswer === option}
                          disabled={showResult}
                          onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
                          className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5"
                        />
                        <span className="text-base sm:text-lg font-medium text-gray-900">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {question.options?.map((option, index) => (
                      <label 
                        key={index} 
                        className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 min-h-[44px]"
                      >
                        <input
                          type={Array.isArray(question.correctAnswer) ? "checkbox" : "radio"}
                          name={question.questionKey}
                          value={String.fromCharCode(65 + index)} // A, B, C, D, etc.
                          checked={
                            Array.isArray(question.correctAnswer) 
                              ? Array.isArray(userAnswer) && userAnswer.includes(String.fromCharCode(65 + index))
                              : userAnswer === String.fromCharCode(65 + index)
                          }
                          disabled={showResult}
                          onChange={(e) => {
                            if (Array.isArray(question.correctAnswer)) {
                              const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                              if (e.target.checked) {
                                handleAnswerChange(question.questionKey, [...currentAnswers, e.target.value]);
                              } else {
                                handleAnswerChange(question.questionKey, currentAnswers.filter(ans => ans !== e.target.value));
                              }
                            } else {
                              handleAnswerChange(question.questionKey, e.target.value);
                            }
                          }}
                          className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5 mt-1"
                        />
                        <span className="text-base sm:text-lg text-gray-900">
                          <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {!showResult && userAnswer && (
                  <Button 
                    onClick={() => handleSubmit(question)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto min-h-[44px] text-base sm:text-lg font-medium px-6 py-3"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                )}

                {showResult && result && (
                  <div className={`p-4 sm:p-6 rounded-lg ${
                    result.isCorrect 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-red-100 border border-red-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <CheckCircle className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        result.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className={`font-medium text-base sm:text-lg ${
                        result.isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {result.explanation}
                    </p>
                    {!result.isCorrect && (
                      <>
                        <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4">
                          <strong>Correct answer:</strong> {
                            Array.isArray(result.correctAnswer) 
                              ? result.correctAnswer.join(', ') 
                              : result.correctAnswer
                          }
                        </p>
                        <Button 
                          onClick={() => handleReset(question.questionKey)}
                          variant="outline"
                          className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Try Again
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
