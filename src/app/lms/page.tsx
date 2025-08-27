'use client';

import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  Star,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getModules, getUserProgress, getRequiredModules } from '@/features/lms/data/mock';
import { trackLmsEvent } from '@/features/lms/analytics/client';

export default function LmsDashboard() {
  const modules = getModules();
  const userProgress = getUserProgress();
  const requiredModules = getRequiredModules();
  const inProgressModule = modules.find(m => userProgress.inProgressModules.includes(m.slug));
  const completedCount = userProgress.totalModulesCompleted;
  const totalModules = modules.length;
  const overallProgress = Math.round((completedCount / totalModules) * 100);
  
  // Get next recommended module
  const nextModule = requiredModules.find(m => !userProgress.completedModules.includes(m.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
            <p className="text-gray-600 mt-1">Continue your hazmat safety training journey</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              {userProgress.currentStreak} day streak
            </Badge>
            <Badge variant="outline">
              Level {Math.floor(userProgress.totalLessonsCompleted / 5) + 1}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Modules Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}/{totalModules}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <Progress value={overallProgress} />
            <p className="text-xs text-gray-500 mt-1">{overallProgress}% complete</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lessons Completed</p>
              <p className="text-2xl font-bold text-blue-600">{userProgress.totalLessonsCompleted}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +3 this week
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Last activity: {new Date(userProgress.lastActivityDate).toLocaleDateString()}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Status</p>
              <p className="text-2xl font-bold text-green-600">Current</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Expires: Dec 2024
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          {inProgressModule && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Continue Learning</h2>
                  <p className="text-gray-600">Pick up where you left off</p>
                </div>
                <Badge variant="secondary">In Progress</Badge>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{inProgressModule.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{inProgressModule.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{inProgressModule.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {inProgressModule.estimatedHours}h remaining
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {inProgressModule.lessons.length} lessons
                      </div>
                    </div>
                  </div>
                  <Button 
                    asChild
                    onClick={() => trackLmsEvent.ctaClicked('continue_learning', 'dashboard')}
                  >
                    <Link href={`/lms/modules/${inProgressModule.slug}`}>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Next Recommended */}
          {nextModule && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Up Next</h2>
                  <p className="text-gray-600">Recommended for your training path</p>
                </div>
                <Badge variant="outline" className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Required
                </Badge>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{nextModule.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{nextModule.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{nextModule.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {nextModule.estimatedHours}h
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {nextModule.lessons.length} lessons
                      </div>
                      <Badge 
                        variant={nextModule.difficulty === 'Beginner' ? 'default' : 
                                nextModule.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                      >
                        {nextModule.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    asChild
                    onClick={() => trackLmsEvent.ctaClicked('start_next_module', 'dashboard')}
                  >
                    <Link href={`/lms/modules/${nextModule.slug}`}>
                      Start Module
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { 
                  action: 'Completed lesson',
                  item: 'Emergency Response Procedures',
                  module: 'Safety & Emergency Response',
                  time: '2 hours ago',
                  icon: CheckCircle,
                  color: 'text-green-600'
                },
                {
                  action: 'Started module',
                  item: 'Safety & Emergency Response',
                  module: null,
                  time: '1 day ago',
                  icon: BookOpen,
                  color: 'text-blue-600'
                },
                {
                  action: 'Completed module',
                  item: 'Function-Specific Training',
                  module: null,
                  time: '3 days ago',
                  icon: Trophy,
                  color: 'text-orange-600'
                }
              ].map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className={`h-5 w-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}: <span className="text-blue-600">{activity.item}</span>
                      </p>
                      {activity.module && (
                        <p className="text-xs text-gray-500">in {activity.module}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compliance Alert */}
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900 mb-1">Compliance Reminder</h3>
                <p className="text-sm text-orange-800 mb-3">
                  Your certification expires in 11 months. Complete all required modules to maintain compliance.
                </p>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                  View Requirements
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lessons completed</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time spent learning</span>
                <span className="font-medium">2.5h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Resources accessed</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => trackLmsEvent.ctaClicked('view_all_modules', 'dashboard_sidebar')}
                asChild
              >
                <Link href="/lms/modules">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Modules
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => trackLmsEvent.resourceAccessed('resources_general', 'dashboard_sidebar')}
                asChild
              >
                <Link href="/lms/resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Resources
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => trackLmsEvent.ctaClicked('view_certification', 'dashboard_sidebar')}
                asChild
              >
                <Link href="/lms/certification">
                  <Trophy className="h-4 w-4 mr-2" />
                  Certification Status
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
