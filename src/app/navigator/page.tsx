'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Users,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Truck,
  FlaskConical,
  Handshake,
  ArrowRight,
  Clock,
  BookOpen,
  Target,
  ChevronRight,
  Home
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SPECCHEM_ROLES, getRoleById } from '@/data/roles'
import { SpecChemRole } from '@/types/navigator'

// Icon mapping for dynamic icon rendering
const IconMap = {
  Handshake,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  Truck,
  FlaskConical
}

export default function NavigatorPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredRoles = SPECCHEM_ROLES.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.keyResponsibilities.some(resp => resp.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || role.trainingPriorities === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getRoleIcon = (iconName: string) => {
    const IconComponent = IconMap[iconName as keyof typeof IconMap]
    return IconComponent ? <IconComponent className="h-8 w-8" /> : <Users className="h-8 w-8" />
  }

  const getRoleColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 border-blue-200 text-blue-700',
      orange: 'from-orange-500 to-orange-600 border-orange-200 text-orange-700',
      green: 'from-green-500 to-green-600 border-green-200 text-green-700',
      red: 'from-red-500 to-red-600 border-red-200 text-red-700',
      purple: 'from-purple-500 to-purple-600 border-purple-200 text-purple-700',
      indigo: 'from-indigo-500 to-indigo-600 border-indigo-200 text-indigo-700'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-federal-blue">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-federal-blue font-medium">Training Navigator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/sc_white.webp"
              alt="SpecChem Logo"
              width={120}
              height={40}
              className="h-10 w-auto filter brightness-0"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Job Role & Training Navigator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get started with role-specific training paths designed for your position at SpecChem. 
            Our intelligent system curates the perfect learning journey for your success.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-federal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Specific Content</h3>
              <p className="text-gray-600 text-sm">Training customized to your exact job responsibilities and requirements</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
              <p className="text-gray-600 text-sm">Engaging modules with assessments and certification opportunities</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-yale-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">Monitor your advancement with detailed analytics and completion certificates</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search roles or responsibilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-federal-blue focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
                className={selectedCategory === 'all' ? 'bg-federal-blue hover:bg-federal-blue/90' : ''}
              >
                All Roles
              </Button>
              <Button
                variant={selectedCategory === 'high' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('high')}
                size="sm"
                className={selectedCategory === 'high' ? 'bg-federal-blue hover:bg-federal-blue/90' : ''}
              >
                High Priority
              </Button>
              <Button
                variant={selectedCategory === 'medium' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('medium')}
                size="sm"
                className={selectedCategory === 'medium' ? 'bg-federal-blue hover:bg-federal-blue/90' : ''}
              >
                Medium Priority
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-federal-blue/20">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getRoleColorClasses(role.color).split(' ')[0]} ${getRoleColorClasses(role.color).split(' ')[1]}`}></div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColorClasses(role.color).split(' ')[0]} ${getRoleColorClasses(role.color).split(' ')[1]} flex items-center justify-center text-white mb-4`}>
                    {getRoleIcon(role.icon)}
                  </div>
                  <Badge variant="outline" className={`${getRoleColorClasses(role.color).split(' ')[2]} border-current`}>
                    {role.trainingPriorities}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">{role.title}</CardTitle>
                <p className="text-gray-600 text-sm line-clamp-2">{role.shortDescription}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Duration
                    </span>
                    <span className="font-medium text-gray-900">{role.estimatedDuration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      Modules
                    </span>
                    <span className="font-medium text-gray-900">{role.requiredModules.length} required</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500 mb-2 block">Key Responsibilities:</span>
                    <ul className="text-gray-700 space-y-1">
                      {role.keyResponsibilities.slice(0, 2).map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs">{responsibility}</span>
                        </li>
                      ))}
                      {role.keyResponsibilities.length > 2 && (
                        <li className="text-xs text-gray-500">+{role.keyResponsibilities.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <Link href={`/navigator/${role.id}`}>
                  <Button className="w-full mt-6 bg-federal-blue hover:bg-federal-blue/90 text-white group">
                    Start Training Path
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all available roles.</p>
            <Button 
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="bg-federal-blue rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Not sure which training path is right for you? Contact your HR representative or manager 
            for guidance on selecting the most appropriate role-based training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/handbook#contact">
              <Button variant="secondary" size="lg">
                Contact HR
              </Button>
            </Link>
            <Link href="/handbook">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-federal-blue">
                View Employee Handbook
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
