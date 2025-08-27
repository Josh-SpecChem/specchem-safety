'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  ArrowRight,
  Users,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Truck,
  FlaskConical,
  Handshake,
  Clock,
  BookOpen,
  Award,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  Home,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getRoleById, getTrainingPathByRole, getModuleById } from '@/data/roles'
import { SpecChemRole, TrainingPath, TrainingModule } from '@/types/navigator'

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

export default function RolePage() {
  const params = useParams()
  const roleId = params.role as string
  
  const [role, setRole] = useState<SpecChemRole | null>(null)
  const [trainingPath, setTrainingPath] = useState<TrainingPath | null>(null)
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [userProgress] = useState<{[moduleId: string]: 'not-started' | 'in-progress' | 'completed'}>({
    welcome: 'completed',
    'product-knowledge': 'in-progress',
    'customer-safety': 'not-started',
    'sales-compliance': 'not-started'
  })

  useEffect(() => {
    if (roleId) {
      const roleData = getRoleById(roleId)
      const pathData = getTrainingPathByRole(roleId)
      
      if (roleData) {
        setRole(roleData)
      }
      
      if (pathData) {
        setTrainingPath(pathData)
        // Get module details for the training path
        const moduleDetails = pathData.modules
          .sort((a, b) => a.order - b.order)
          .map(pathModule => getModuleById(pathModule.moduleId))
          .filter(Boolean) as TrainingModule[]
        setModules(moduleDetails)
      }
    }
  }, [roleId])

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Role Not Found</h1>
          <p className="text-gray-600 mb-6">The requested training role could not be found.</p>
          <Link href="/navigator">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Navigator
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getRoleIcon = (iconName: string) => {
    const IconComponent = IconMap[iconName as keyof typeof IconMap]
    return IconComponent ? <IconComponent className="h-10 w-10" /> : <Users className="h-10 w-10" />
  }

  const getRoleColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 border-blue-200 text-blue-700 bg-blue-50',
      orange: 'from-orange-500 to-orange-600 border-orange-200 text-orange-700 bg-orange-50',
      green: 'from-green-500 to-green-600 border-green-200 text-green-700 bg-green-50',
      red: 'from-red-500 to-red-600 border-red-200 text-red-700 bg-red-50',
      purple: 'from-purple-500 to-purple-600 border-purple-200 text-purple-700 bg-purple-50',
      indigo: 'from-indigo-500 to-indigo-600 border-indigo-200 text-indigo-700 bg-indigo-50'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getModuleStatus = (moduleId: string) => {
    return userProgress[moduleId] || 'not-started'
  }

  const getModuleIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-600" />
      default:
        return <Lock className="h-5 w-5 text-gray-400" />
    }
  }

  const calculateProgress = () => {
    const completedModules = modules.filter(module => getModuleStatus(module.id) === 'completed').length
    return Math.round((completedModules / modules.length) * 100)
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
              <Link href="/navigator" className="text-gray-600 hover:text-federal-blue">
                Training Navigator
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-federal-blue font-medium">{role.title}</span>
            </div>
            <Link href="/navigator">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roles
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`bg-gradient-to-r ${getRoleColorClasses(role.color).split(' ')[0]} ${getRoleColorClasses(role.color).split(' ')[1]} rounded-xl p-8 text-white mb-8`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                {getRoleIcon(role.icon)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{role.title}</h1>
                <p className="text-lg opacity-90 mb-4 max-w-2xl">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {role.estimatedDuration}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {role.trainingPriorities} Priority
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {role.requiredModules.length} Modules
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">{calculateProgress()}%</div>
              <div className="text-sm opacity-90">Complete</div>
              <Progress value={calculateProgress()} className="w-24 mt-2 bg-white/20" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Path Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-federal-blue" />
                  Your Training Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module, index) => {
                    const status = getModuleStatus(module.id)
                    const isLocked = index > 0 && getModuleStatus(modules[index - 1].id) !== 'completed'
                    
                    return (
                      <div key={module.id} className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        status === 'completed' ? 'border-green-200 bg-green-50' :
                        status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                        isLocked ? 'border-gray-200 bg-gray-50 opacity-60' :
                        'border-gray-200 bg-white hover:border-federal-blue/30'
                      }`}>
                        <div className="flex-shrink-0">
                          {getModuleIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                              {index + 1}. {module.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {module.duration}
                            </Badge>
                            {module.assessmentRequired && (
                              <Badge variant="outline" className="text-xs">
                                Assessment Required
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
                            {module.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {status === 'completed' ? (
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          ) : isLocked ? (
                            <Button size="sm" variant="outline" disabled>
                              Locked
                            </Button>
                          ) : (
                            <Button size="sm" className="bg-federal-blue hover:bg-federal-blue/90">
                              {status === 'in-progress' ? 'Continue' : 'Start'}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-federal-blue" />
                  Key Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {role.keyResponsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-federal-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-federal-blue" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-federal-blue mb-1">{calculateProgress()}%</div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                    <Progress value={calculateProgress()} className="mt-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {modules.filter(m => getModuleStatus(m.id) === 'completed').length}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {modules.filter(m => getModuleStatus(m.id) === 'in-progress').length}
                      </div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-federal-blue" />
                  Compliance Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {role.complianceRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-federal-blue" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {role.targetAudience.map((audience, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Get Help */}
            <Card className="bg-federal-blue text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Contact your manager or HR if you have questions about your training path.
                </p>
                <Link href="/handbook#contact">
                  <Button variant="secondary" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
