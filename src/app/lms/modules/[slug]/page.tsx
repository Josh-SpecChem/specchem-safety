'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  ExternalLink,
  Users,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getLmsModule, getUserProgress, getLessonResources } from '@/features/lms/data/mock';
import type { LmsModule, UserProgress } from '@/types/lms';
import { trackLmsEvent } from '@/features/lms/analytics/client';

interface ModulePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ModulePage({ params }: ModulePageProps) {
  const [slug, setSlug] = useState<string>('');
  const [moduleData, setModuleData] = useState<LmsModule | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const moduleSlug = resolvedParams.slug;
      setSlug(moduleSlug);
      
      const moduleInfo = getLmsModule(moduleSlug);
      if (!moduleInfo) {
        notFound();
      }
      setModuleData(moduleInfo);
      setUserProgress(getUserProgress());
    };
    
    getParams();
  }, [params]);
  
  if (!moduleData || !userProgress) {
    return <div>Loading...</div>;
  }
  const moduleProgress = userProgress.modules.find(m => m.moduleSlug === slug);
  const completedLessons = moduleProgress?.completedLessons || [];
  const progressPercent = Math.round((completedLessons.length / moduleData.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  onClick={() => trackLmsEvent.ctaClicked('back_to_modules', 'module_header')}
                >
                  <Link href="/lms" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Modules
                  </Link>
                </Button>
                <div className="h-6 border-l border-gray-300" />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <Badge variant="secondary">{moduleData.category}</Badge>
                    <Badge 
                      variant={moduleData.difficulty === 'Beginner' ? 'default' : 
                              moduleData.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                    >
                      {moduleData.difficulty}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{moduleData.title}</h1>
                  <p className="text-gray-600 mt-1">{moduleData.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={progressPercent} className="w-24" />
                  <span className="text-sm font-medium">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Module Overview */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Module Overview</h2>
                  <p className="text-gray-600">{moduleData.description}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {moduleData.estimatedHours}h
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {moduleData.lessons.length} lessons
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Available
                  </div>
                </div>
              </div>
              
              {moduleData.objectives && (
                <div>
                  <h3 className="font-medium mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {moduleData.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Lessons */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Lessons</h2>
              <div className="space-y-3">
                {moduleData.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.slug);
                  const resources = getLessonResources();
                  
                  return (
                    <div 
                      key={lesson.slug}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              {index + 1}. {lesson.title}
                            </h3>
                            {isCompleted && (
                              <Badge variant="outline" className="text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration} min
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {resources.length} resources
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={isCompleted ? "outline" : "default"} 
                        size="sm"
                        onClick={() => trackLmsEvent.ctaClicked('start_lesson', `lesson_${lesson.slug}`)}
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Your Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {completedLessons.length}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {moduleData.lessons.length - completedLessons.length}
                    </div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Module Resources */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Module Resources</h3>
              <div className="space-y-2">
                {/* Sample resources - in real app would be dynamic */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => trackLmsEvent.resourceAccessed(`${moduleData.slug}_handbook`, 'pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Safety Handbook (PDF)
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => trackLmsEvent.resourceAccessed(`${moduleData.slug}_checklist`, 'pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Quick Reference Guide
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => trackLmsEvent.resourceAccessed(`${moduleData.slug}_video`, 'video')}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Demo Video
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => trackLmsEvent.resourceAccessed(`${moduleData.slug}_external`, 'external')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  OSHA Guidelines
                </Button>
              </div>
            </Card>

            {/* Help */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Questions about this module? Reach out to our training team.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => trackLmsEvent.ctaClicked('contact_support', 'module_sidebar')}
                >
                  Contact Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
