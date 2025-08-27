"use client";

import { CheckCircle, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

export function ComplianceWidget() {
  // Mock data - in real app this would come from API
  const complianceData = {
    isCompliant: false,
    nextTrainingDue: "Start Training",
    completionPercentage: 0,
    coursesCompleted: 0,
    totalCourses: 5
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Compliance Status */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              {complianceData.isCompliant ? (
                <CheckCircle className="w-6 h-6 text-[--color-state-success] mr-2" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-[--color-state-warning] mr-2" />
              )}
              <span className="text-lg font-semibold text-[--color-fg-primary]">
                {complianceData.isCompliant ? "Compliant" : "Action Required"}
              </span>
            </div>
            <p className="text-[--color-fg-secondary] text-sm">
              Training required for compliance
            </p>
          </div>

          {/* Next Training Due */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <Calendar className="w-6 h-6 text-[--color-accent-cool] mr-2" />
              <span className="text-lg font-semibold text-[--color-fg-primary]">
                {complianceData.nextTrainingDue}
              </span>
            </div>
            <p className="text-[--color-fg-secondary] text-sm">
              HazMat Recertification due
            </p>
          </div>

          {/* Progress Overview */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <TrendingUp className="w-6 h-6 text-[--color-brand-primary] mr-2" />
              <span className="text-lg font-semibold text-[--color-fg-primary]">
                {complianceData.coursesCompleted}/{complianceData.totalCourses} Courses
              </span>
            </div>
            <p className="text-[--color-fg-secondary] text-sm">
              Training progress
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[--color-fg-secondary]">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-[--color-fg-primary]">
              {complianceData.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-[--color-brand-primary] to-[--color-brand-primary-600] transition-all duration-500 ease-out"
              style={{ width: `${complianceData.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
