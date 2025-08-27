'use client';

import Link from 'next/link';
import { 
  Briefcase, 
  Shield, 
  AlertTriangle, 
  Lock,
  Book,
  Search,
  Filter,
  Grid
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getModules } from '@/features/lms/data/mock';
import { trackLmsEvent } from '@/features/lms/analytics/client';

// Professional icon mapping for each module
const moduleIcons = {
  'general-awareness': Briefcase,
  'function-specific': Book,
  'safety-emergency': AlertTriangle,
  'security-awareness': Shield,
  'in-depth-security': Lock,
};

// Independent color scheme for modules
const moduleColors = {
  'general-awareness': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  'function-specific': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700'
  },
  'safety-emergency': {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    button: 'bg-orange-600 hover:bg-orange-700'
  },
  'security-awareness': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  'in-depth-security': {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
};

export default function ModulesPage() {
  const modules = getModules();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Training Modules</h1>
          <p className="text-fg-secondary mt-1">
            Comprehensive hazmat training for SpecChem professionals
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-muted" />
          <Input 
            placeholder="Search modules..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = moduleIcons[module.slug as keyof typeof moduleIcons] || Book;
          const colors = moduleColors[module.slug as keyof typeof moduleColors] || moduleColors['general-awareness'];
          
          return (
            <Card key={module.slug} className={`p-6 h-80 flex flex-col ${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}>
              {/* Module Icon and Title */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`p-4 rounded-full bg-white mb-4 shadow-sm`}>
                  <IconComponent className={`h-8 w-8 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-semibold text-fg-primary leading-tight">
                  {module.title}
                </h3>
              </div>

              {/* Description */}
              <div className="flex-1 mb-6">
                <p className="text-fg-secondary text-sm leading-relaxed line-clamp-3">
                  {module.description}
                </p>
              </div>

              {/* Key Learning Points */}
              {module.objectives && module.objectives.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-fg-secondary mb-2">Key Topics:</h4>
                  <ul className="text-xs text-fg-muted space-y-1">
                    {module.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`${colors.icon} mr-2 text-xs`}>•</span>
                        <span className="line-clamp-1">{objective}</span>
                      </li>
                    ))}
                    {module.objectives.length > 2 && (
                      <li className={`${colors.icon} text-xs font-medium`}>
                        +{module.objectives.length - 2} more topics
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-auto">
                <Button 
                  asChild
                  className={`w-full text-white ${colors.button}`}
                  size="sm"
                  onClick={() => trackLmsEvent.ctaClicked('start_module', `modules_page_${module.slug}`)}
                >
                  <Link href={`/lms/modules/${module.slug}`}>
                    Start Module
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-fg-primary mb-2">Need Support?</h3>
          <p className="text-fg-secondary mb-4">
            Our training specialists are here to guide your learning journey.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button variant="outline">Contact Support</Button>
            <Button className="bg-federal-blue hover:bg-yale-blue text-white">Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
