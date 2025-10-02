'use client'

import React from 'react'
import Link from 'next/link'
import { UPDATED_SALES_REPRESENTATIVE_MODULES } from '@/data/modules/sales-representative-complete'
import { Clock, Award, Users, CheckCircle, Lock } from 'lucide-react'

export default function TrainingOverviewPage() {
  const modules = UPDATED_SALES_REPRESENTATIVE_MODULES

  const getModuleStatus = (moduleId: string, index: number): 'available' | 'locked' | 'completed' => {
    // For demo purposes, make first module available, others require prerequisites
    if (index === 0) return 'available'
    if (index === 1) return 'available' // Customer Safety also available
    if (index === 2) return 'locked' // Compliance requires the other two
    return 'locked'
  }

  const getModuleUrl = (moduleId: string) => {
    const urlMap: { [key: string]: string } = {
      'sales-product-knowledge': '/training/sales-product-knowledge',
      'sales-customer-safety': '/training/customer-safety-protocols',
      'sales-compliance-documentation': '/training/sales-compliance-documentation'
    }
    return urlMap[moduleId] || '#'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/navigator" className="hover:text-federal-blue">Navigator</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Sales Representative Training</span>
          </nav>
          
          <div className="bg-gradient-to-r from-federal-blue to-yale-blue rounded-xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">Sales Representative Training Program</h1>
            <p className="text-xl text-blue-100 mb-6">
              Comprehensive training modules designed to enhance your expertise in product knowledge, 
              safety protocols, and compliance requirements.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-1">{modules.length}</div>
                <div className="text-blue-200">Training Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-1">4.5</div>
                <div className="text-blue-200">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-1">9</div>
                <div className="text-blue-200">Assessments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Path */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Training Path</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid gap-6">
              {modules.map((module, index) => {
                const status = getModuleStatus(module.id, index)
                const isAvailable = status === 'available'
                const isCompleted = status === 'completed'
                const isLocked = status === 'locked'

                return (
                  <div
                    key={module.id}
                    className={`relative p-6 rounded-lg border transition-all ${
                      isAvailable 
                        ? 'border-federal-blue bg-blue-50 hover:shadow-lg' 
                        : isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {/* Module Number */}
                    <div className={`absolute -left-3 top-6 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      isCompleted ? 'bg-green-500' : isAvailable ? 'bg-federal-blue' : 'bg-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>

                    <div className="ml-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
                          <p className="text-gray-600 mb-4">{module.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{module.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              <span className="capitalize">{module.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{module.content.sections.length} Sections</span>
                            </div>
                          </div>

                          {/* Prerequisites */}
                          {module.prerequisites && module.prerequisites.length > 0 && (
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-700">Prerequisites: </span>
                              <span className="text-sm text-gray-600">
                                {module.prerequisites.map((prereq: any, i: number) => {
                                  const prereqModule = modules.find(m => m.id === prereq)
                                  return prereqModule ? prereqModule.title : prereq
                                }).join(', ')}
                              </span>
                            </div>
                          )}

                          {/* Learning Objectives */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                            <p className="text-sm text-gray-600">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {/* Status & Action */}
                        <div className="ml-6 text-center">
                          {isLocked && (
                            <div className="mb-4">
                              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-sm text-gray-500">Complete prerequisites</span>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <div className="mb-4">
                              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                              <span className="text-sm text-green-600 font-medium">Completed</span>
                            </div>
                          )}

                          {isAvailable ? (
                            <Link
                              href={getModuleUrl(module.id)}
                              className="inline-block bg-federal-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                              Start Module
                            </Link>
                          ) : isCompleted ? (
                            <Link
                              href={getModuleUrl(module.id)}
                              className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                              Review
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="inline-block bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-semibold cursor-not-allowed"
                            >
                              Locked
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Resources</h3>
            <div className="space-y-3">
              <Link href="/handbook" className="block p-3 rounded-lg border border-gray-200 hover:border-federal-blue transition-colors">
                <div className="font-medium text-gray-900">Employee Handbook</div>
                <div className="text-sm text-gray-600">Complete reference guide and policies</div>
              </Link>
              <Link href="/resources" className="block p-3 rounded-lg border border-gray-200 hover:border-federal-blue transition-colors">
                <div className="font-medium text-gray-900">Technical Resources</div>
                <div className="text-sm text-gray-600">Product specifications and data sheets</div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Help</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="font-medium text-blue-900">Training Support</div>
                <div className="text-sm text-blue-700">Email: training@specchem.com</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="font-medium text-green-900">Technical Questions</div>
                <div className="text-sm text-green-700">Phone: 1-800-SPECCHEM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
