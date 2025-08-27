export interface SpecChemRole {
  id: string
  name: string
  title: string
  description: string
  shortDescription: string
  icon: string
  color: string
  estimatedDuration: string
  requiredModules: string[]
  recommendedModules: string[]
  complianceRequirements: string[]
  keyResponsibilities: string[]
  trainingPriorities: 'high' | 'medium' | 'low'
  targetAudience: string[]
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  category: 'safety' | 'compliance' | 'technical' | 'policy' | 'product'
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  content: string
  assessmentRequired: boolean
  certificationEligible: boolean
  lastUpdated: string
}

export interface UserProgress {
  userId: string
  roleId: string
  moduleId: string
  status: 'not-started' | 'in-progress' | 'completed' | 'certified'
  startedAt?: string
  completedAt?: string
  timeSpent: number
  lastAccessed: string
  assessmentScore?: number
}

export interface TrainingPath {
  roleId: string
  modules: {
    moduleId: string
    order: number
    required: boolean
    prerequisiteOf: string[]
  }[]
  estimatedDuration: string
  completionCriteria: {
    requiredModules: number
    minimumScore?: number
    certificationRequired?: boolean
  }
}
