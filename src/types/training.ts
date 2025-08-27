export interface TrainingModuleContent {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'safety' | 'compliance' | 'technical' | 'policy' | 'product'
  content: {
    sections: ModuleSection[]
    resources: ModuleResource[]
    assessment?: ModuleAssessment
  }
  prerequisites: string[]
  learningObjectives: string[]
  certificationEligible: boolean
  lastUpdated: string
}

export interface ModuleSection {
  id: string
  title: string
  content: string // Rich HTML content
  estimatedReadTime: string
  interactiveElements?: InteractiveElement[]
  checkpoints?: string[] // Key learning checkpoints
}

export interface InteractiveElement {
  id: string
  type: 'checklist' | 'note' | 'highlight' | 'video' | 'download' | 'external-link'
  title: string
  content?: string
  url?: string
  required?: boolean
}

export interface ModuleResource {
  id: string
  title: string
  type: 'pdf' | 'link' | 'video' | 'handbook-section' | 'template'
  url: string
  description: string
  downloadable: boolean
}

export interface ModuleAssessment {
  id: string
  title: string
  questions: AssessmentQuestion[]
  passingScore: number
  maxAttempts: number
  timeLimit?: number // in minutes
  showFeedback: boolean
  certificateGeneration: boolean
}

export interface AssessmentQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'scenario'
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AssessmentResult {
  attemptNumber: number
  score: number
  totalQuestions: number
  correctAnswers: number
  passed: boolean
  timeSpent: number
  completedAt: string
  questionResults: Record<string, boolean>
}

export interface UserModuleProgress {
  moduleId: string
  completedSections: string[]
  bookmarks: string[]
  notes: { sectionId: string; content: string; timestamp: string }[]
  assessmentAttempts: AssessmentResult[]
  completionPercentage: number
  certificateEarned?: ModuleCertificate
  lastAccessed: string
  timeSpent: number
}

export interface ModuleNote {
  id: string
  sectionId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface AssessmentAttempt {
  id: string
  attemptNumber: number
  startedAt: string
  completedAt?: string
  answers: { [questionId: string]: string | string[] }
  score: number
  passed: boolean
  timeSpent: number
  feedback: string
}

export interface ModuleCertificate {
  id: string
  userId: string
  moduleId: string
  roleId: string
  employeeName: string
  completionDate: string
  score: number
  certificateUrl: string
  expirationDate?: string
  verificationCode: string
}
