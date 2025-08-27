'use client';

import { 
  FileText, 
  ExternalLink, 
  Download, 
  Search,
  Filter,
  BookOpen,
  Shield,
  AlertTriangle,
  FileCheck,
  Globe,
  Building
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getResourceLinks } from '@/features/lms/data/mock';
import { trackLmsEvent } from '@/features/lms/analytics/client';

export default function ResourcesPage() {
  const resources = getResourceLinks();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sds': return FileCheck;
      case 'policy': return Building;
      case 'emergency': return AlertTriangle;
      case 'regulation': return Shield;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sds': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'policy': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'regulation': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">
            Access important documents, policies, and regulatory information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">All ({resources.length})</Badge>
            <Badge variant="secondary">Internal (3)</Badge>
            <Badge variant="outline">External (2)</Badge>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { category: 'sds', label: 'Safety Data Sheets', count: 1, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { category: 'policy', label: 'Company Policies', count: 1, color: 'text-purple-600 bg-purple-50 border-purple-200' },
          { category: 'emergency', label: 'Emergency Procedures', count: 1, color: 'text-red-600 bg-red-50 border-red-200' },
          { category: 'regulation', label: 'Regulations', count: 2, color: 'text-green-600 bg-green-50 border-green-200' }
        ].map((cat) => {
          const IconComponent = getCategoryIcon(cat.category);
          return (
            <Card key={cat.category} className={`p-4 cursor-pointer hover:shadow-md transition-shadow border ${cat.color}`}>
              <div className="flex items-center space-x-3">
                <IconComponent className={`h-6 w-6 ${cat.color.split(' ')[0]}`} />
                <div>
                  <h3 className="font-medium text-gray-900">{cat.label}</h3>
                  <p className="text-sm text-gray-600">{cat.count} resource{cat.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {resources.map((resource) => {
          const IconComponent = getCategoryIcon(resource.category);
          const isExternal = resource.type === 'external';
          
          return (
            <Card key={resource.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg border ${getCategoryColor(resource.category)}`}>
                    <IconComponent className={`h-6 w-6 ${getCategoryColor(resource.category).split(' ')[0]}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs capitalize"
                        >
                          {resource.category}
                        </Badge>
                        {isExternal && (
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            External
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{resource.description}</p>
                    
                    {/* Resource metadata */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {isExternal ? 'Web Resource' : 'PDF Document'}
                      </div>
                      <div>Last updated: Jan 2024</div>
                      {!isExternal && (
                        <div>Size: 2.4 MB</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isExternal ? (
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                      onClick={() => trackLmsEvent.resourceAccessed(resource.id, resource.type)}
                    >
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Site
                      </a>
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => trackLmsEvent.resourceAccessed(resource.id, 'view')}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => trackLmsEvent.resourceAccessed(resource.id, 'download')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Featured Resources */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Quick Reference Guide',
              description: 'Essential hazmat handling procedures at a glance',
              type: 'PDF Guide',
              icon: FileCheck,
              color: 'text-blue-600 bg-blue-50 border-blue-200'
            },
            {
              title: 'Emergency Response Checklist',
              description: 'Step-by-step emergency response procedures',
              type: 'Checklist',
              icon: AlertTriangle,
              color: 'text-red-600 bg-red-50 border-red-200'
            },
            {
              title: 'Training Videos',
              description: 'Interactive training content and demonstrations',
              type: 'Video Library',
              icon: BookOpen,
              color: 'text-purple-600 bg-purple-50 border-purple-200'
            }
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className={`p-6 cursor-pointer hover:shadow-md transition-shadow border ${item.color}`}>
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg border ${item.color} flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${item.color.split(' ')[0]}`} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Additional Resources?</h3>
          <p className="text-gray-600 mb-4">
            Can&apos;t find what you&apos;re looking for? Our team can help you locate specific documents or create custom resources.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button variant="outline">Request Resource</Button>
            <Button>Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
