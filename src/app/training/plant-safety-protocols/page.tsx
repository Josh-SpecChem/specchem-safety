'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useProgress } from '@/contexts/ProgressContext'
import { PLANT_TECHNICIAN_MODULES } from '@/data/modules/plant-technician-complete'
import { ChevronLeft, ChevronRight, BookOpen, Clock, Award, CheckCircle, Play } from 'lucide-react'
import { Assessment } from '@/components/training/Assessment'

const PlantSafetyProtocolsPage: React.FC = () => {
  const { state: progressState, completeSection } = useProgress()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [showAssessment, setShowAssessment] = useState(false)
  
  // Get the specific module
  const moduleData = PLANT_TECHNICIAN_MODULES.find(m => m.id === 'plant-safety-protocols')
  
  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <p className="text-gray-600">The requested training module could not be found.</p>
        </div>
      </div>
    )
  }

  const moduleProgress = progressState.moduleProgress[module.id]
  const currentSection = moduleData.content.sections[currentSectionIndex]
  const totalSections = moduleData.content.sections.length
  
  const isCurrentSectionCompleted = moduleProgress?.completedSections.includes(currentSection.id) || false

  const handleSectionComplete = () => {
    if (!isCurrentSectionCompleted) {
      completeSection(module.id, currentSection.id)
    }
  }

  const handleNext = () => {
    handleSectionComplete()
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    } else {
      setShowAssessment(true)
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
    if (showAssessment) {
      setShowAssessment(false)
    }
  }

  if (showAssessment && moduleData.content.assessment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Assessment
          assessment={moduleData.content.assessment}
          moduleId={module.id}
          onComplete={() => {
            // Handle assessment completion - could redirect to completion page
            console.log('Assessment completed')
            setShowAssessment(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-federal-blue to-yale-blue text-white p-6">
          <nav className="flex items-center space-x-2 text-sm text-blue-100 mb-4">
            <Link href="/navigator" className="hover:text-white">Navigator</Link>
            <span>/</span>
            <Link href="/training" className="hover:text-white">Training</Link>
            <span>/</span>
            <span className="text-white font-medium">Plant Safety Protocols</span>
          </nav>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{moduleData.title}</h1>
              <p className="text-blue-100 text-lg mb-4">{moduleData.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{moduleData.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span className="capitalize">{moduleData.difficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalSections} Sections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">
              Section {currentSectionIndex + 1} of {totalSections}: {currentSection.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{currentSection.estimatedReadTime}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-federal-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Progress: {Math.round(((currentSectionIndex + 1) / totalSections) * 100)}%</span>
            <span>{totalSections - currentSectionIndex - 1} sections remaining</span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {moduleData.content.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSectionIndex(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  index === currentSectionIndex
                    ? 'bg-federal-blue text-white'
                    : moduleProgress?.completedSections.includes(section.id)
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {moduleProgress?.completedSections.includes(section.id) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-current opacity-20" />
                )}
                <span className="text-sm">{section.title}</span>
              </button>
            ))}
            
            {moduleData.content.assessment && (
              <button
                onClick={() => setShowAssessment(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors bg-gold text-white hover:bg-yellow-600"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">Assessment</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-white p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: currentSection.content }}
          />
          
          {/* Section Completion */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Section Progress</h3>
                <p className="text-gray-600 text-sm">
                  {isCurrentSectionCompleted 
                    ? 'You have completed this section' 
                    : 'Mark this section as complete when you\'ve finished reading'}
                </p>
              </div>
              
              <button
                onClick={handleSectionComplete}
                disabled={isCurrentSectionCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isCurrentSectionCompleted
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-federal-blue text-white hover:bg-blue-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isCurrentSectionCompleted ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="text-sm text-gray-600">
              Section {currentSectionIndex + 1} of {totalSections}
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-federal-blue text-white hover:bg-blue-700"
            >
              {currentSectionIndex === totalSections - 1 ? 'Take Assessment' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantSafetyProtocolsPage
