'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SALES_REPRESENTATIVE_MODULES } from '@/data/modules/sales-representative'
import { Assessment } from '@/components/training/Assessment'
import { Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react'

export default function SalesTrainingPage() {
  const trainingModule = SALES_REPRESENTATIVE_MODULES[0] // First module: Product Knowledge
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [showAssessment, setShowAssessment] = useState(false)
  
  if (!trainingModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <p className="text-gray-600">The requested training module could not be found.</p>
        </div>
      </div>
    )
  }
  
  const currentSection = trainingModule.content.sections[currentSectionIndex]
  const progress = Math.round(((currentSectionIndex + 1) / trainingModule.content.sections.length) * 100)

  const handleNext = () => {
    if (currentSectionIndex < trainingModule.content.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1)
    }
  }

  const handleStartAssessment = () => {
    setShowAssessment(true)
  }

  const handleAssessmentComplete = (result: { passed: boolean; score: number }) => {
    console.log('Assessment completed:', result)
    setShowAssessment(false)
  }

  if (showAssessment && trainingModule.content.assessment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Assessment
          moduleId={trainingModule.id}
          assessment={trainingModule.content.assessment}
          onComplete={handleAssessmentComplete}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/navigator" className="hover:text-federal-blue">Navigator</Link>
            <span>/</span>
            <Link href="/navigator/sales-representative" className="hover:text-federal-blue">Sales Representative</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{trainingModule.title}</span>
          </nav>
        </div>

        {/* Module Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trainingModule.title}</h1>
              <p className="text-gray-600 mb-4">{trainingModule.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{trainingModule.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span className="capitalize">{trainingModule.difficulty}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="text-2xl font-bold text-federal-blue">{progress}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-federal-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentSection?.title || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-600">
                Section {currentSectionIndex + 1} of {trainingModule.content.sections.length} • {currentSection?.estimatedReadTime || 'Loading...'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSectionIndex === trainingModule.content.sections.length - 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          {currentSection ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: currentSection.content }}
            />
          ) : (
            <div className="text-center text-gray-500">Loading section content...</div>
          )}
        </div>

        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {currentSectionIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Section
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentSectionIndex === trainingModule.content.sections.length - 1 ? (
              <button
                onClick={handleStartAssessment}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
              >
                <Award className="w-4 h-4" />
                Take Assessment
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-federal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Next Section
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
