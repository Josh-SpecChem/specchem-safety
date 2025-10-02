'use client';

import { 
  Award, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Download,
  AlertCircle,
  User,
  Building,
  Printer,
  Share2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserProgress, getRequiredModules } from '@/features/lms/data/mock';
import { trackLmsEvent } from '@/features/lms/analytics/client';

export default function CertificationPage() {
  const userProgress = getUserProgress();
  const requiredModules = getRequiredModules();
  
  // Calculate certification progress
  const completedRequired = requiredModules.filter(m => userProgress.completedModules.includes(m.slug));
  const certificationProgress = Math.round((completedRequired.length / requiredModules.length) * 100);
  const isCertified = certificationProgress === 100;
  
  // Mock certification data
  const certificationData = {
    certificateNumber: 'SC-HM-2024-001247',
    issueDate: '2024-01-15',
    expirationDate: '2024-12-31',
    issuedBy: 'SpecChem Safety Training Department',
    employeeName: 'John Smith',
    employeeId: 'EMP-001247',
    department: 'Logistics & Transportation'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certification Status</h1>
          <p className="text-gray-600 mt-1">
            Track your hazmat certification progress and manage certificates
          </p>
        </div>
        {isCertified && (
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => trackLmsEvent.ctaClicked('print_certificate', 'certification_header')}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              size="sm"
              onClick={() => trackLmsEvent.ctaClicked('download_certificate', 'certification_header')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certification Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isCertified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {isCertified ? (
                    <Award className="h-6 w-6" />
                  ) : (
                    <Clock className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isCertified ? 'Certified' : 'Certification In Progress'}
                  </h2>
                  <p className="text-gray-600">
                    {isCertified 
                      ? 'You have completed all required training modules'
                      : `${completedRequired.length} of ${requiredModules.length} required modules completed`
                    }
                  </p>
                </div>
              </div>
              <Badge 
                variant={isCertified ? 'default' : 'secondary'}
                className={isCertified ? 'bg-green-600' : 'bg-orange-600'}
              >
                {isCertified ? 'Current' : 'In Progress'}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Certification Progress</span>
                <span className="font-medium">{certificationProgress}%</span>
              </div>
              <Progress value={certificationProgress} className="h-3" />
            </div>

            {/* Certificate Details (if certified) */}
            {isCertified && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        HazMat Safety Certification
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {certificationData.employeeName} (ID: {certificationData.employeeId})
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {certificationData.department}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Valid until {new Date(certificationData.expirationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => trackLmsEvent.ctaClicked('share_certificate', 'certificate_card')}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-gray-500">
                    Certificate Number: {certificationData.certificateNumber} | 
                    Issued: {new Date(certificationData.issueDate).toLocaleDateString()} | 
                    Issued by: {certificationData.issuedBy}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Required Modules Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Training Modules</h3>
            <div className="space-y-4">
              {requiredModules.map((module) => {
                const isCompleted = userProgress.completedModules.includes(module.slug);
                const moduleProgress = userProgress.modules.find((m: any) => m.moduleSlug === module.slug);
                const completedSections = moduleProgress?.completedSections || [];
                const progressPercent = Math.round((completedSections.length / module.lessons.length) * 100);
                
                return (
                  <div key={module.slug} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{module.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        {!isCompleted && completedSections.length > 0 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-1 w-48" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {isCompleted ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : (
                        <Badge variant="outline">
                          {completedSections.length > 0 ? 'In Progress' : 'Not Started'}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Compliance History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance History</h3>
            <div className="space-y-3">
              {[
                {
                  date: '2024-01-15',
                  event: 'HazMat Certification Renewed',
                  status: 'completed',
                  details: 'All required modules completed successfully'
                },
                {
                  date: '2023-01-20',
                  event: 'HazMat Certification Earned',
                  status: 'completed',
                  details: 'Initial certification obtained'
                },
                {
                  date: '2023-12-15',
                  event: 'Refresher Training Due',
                  status: 'upcoming',
                  details: 'Annual refresher training required by December 31, 2024'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.status === 'completed' ? 'bg-green-500' : 
                    item.status === 'upcoming' ? 'bg-orange-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{item.event}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Certification Info */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Certification Requirements</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Required Modules</span>
                <span className="font-medium">{requiredModules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{completedRequired.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="font-medium text-orange-600">{requiredModules.length - completedRequired.length}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-gray-600">Valid Period</span>
                <span className="font-medium">1 Year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Renewal Required</span>
                <span className="font-medium">Annually</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900 mb-1">Upcoming Deadline</h3>
                <p className="text-sm text-orange-800 mb-3">
                  Your certification expires in 11 months. Complete any remaining modules to ensure compliance.
                </p>
                <p className="text-xs text-orange-700">
                  Renewal due: {new Date(certificationData.expirationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {isCertified ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => trackLmsEvent.ctaClicked('download_certificate', 'sidebar')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => trackLmsEvent.ctaClicked('print_certificate', 'sidebar')}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Certificate
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => trackLmsEvent.ctaClicked('view_remaining_modules', 'sidebar')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  View Remaining Modules
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => trackLmsEvent.ctaClicked('view_compliance_history', 'sidebar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Full History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
