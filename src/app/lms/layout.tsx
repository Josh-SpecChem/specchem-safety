import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Home, 
  FileText, 
  Award, 
  Settings,
  User,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { getUserProgress } from '@/features/lms/data/mock';

interface LmsLayoutProps {
  children: ReactNode;
}

export default function LmsLayout({ children }: LmsLayoutProps) {
  const userProgress = getUserProgress();
  const overallProgress = Math.round((userProgress.totalLessonsCompleted / 20) * 100); // Assuming 20 total lessons

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">SpecChem</div>
                  <div className="text-xs text-gray-500">Safety Training</div>
                </div>
              </Link>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search courses, resources..." 
                  className="pl-10"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Profile</span>
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r min-h-screen sticky top-16 hidden lg:block">
          <div className="p-6">
            {/* Progress Widget */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-medium text-gray-900 mb-2">Your Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Overall Completion</span>
                      <span className="font-medium text-blue-600">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{userProgress.totalModulesCompleted}</div>
                      <div className="text-xs text-gray-500">Modules Done</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{userProgress.currentStreak}</div>
                      <div className="text-xs text-gray-500">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              <Link 
                href="/lms" 
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/lms/modules" 
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Training Modules</span>
              </Link>
              <Link 
                href="/lms/resources" 
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Resources</span>
              </Link>
              <Link 
                href="/lms/certification" 
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Award className="h-4 w-4" />
                <span>Certification</span>
              </Link>
            </nav>

            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Quick Access
              </h4>
              <div className="space-y-2">
                <Link 
                  href="/lms/modules/general-awareness"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  • General Awareness
                </Link>
                <Link 
                  href="/lms/modules/function-specific"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  • Function-Specific
                </Link>
                <Link 
                  href="/lms/modules/safety-emergency"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  • Safety & Emergency
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Get support with your training
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-3 w-3 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
