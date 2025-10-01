/**
 * Centralized business domain types for SpecChem Safety Training system
 * Consolidates LMS, training, and navigator-specific types
 */

// ========================================
// LMS MODULE TYPES
// ========================================

export interface LmsModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: LmsLesson[];
  required: boolean;
  icon: string;
  category: string;
  enrolledCount?: number;
  objectives?: string[];
}

export interface LmsLesson {
  id: string;
  slug: string;
  title: string;
  duration: number; // duration in minutes
  description: string;
  content?: string; // For future lesson content
  order: number;
  required: boolean;
}

// ========================================
// TRAINING MODULE TYPES
// ========================================

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'compliance' | 'technical' | 'policy' | 'product';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  content: TrainingModuleContent;
  assessmentRequired: boolean;
  certificationEligible: boolean;
  lastUpdated: string;
}

export interface TrainingModuleContent {
  sections: ModuleSection[];
  resources: ModuleResource[];
  assessment?: ModuleAssessment;
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string; // Rich HTML content
  estimatedReadTime: string;
  interactiveElements?: InteractiveElement[];
  checkpoints?: string[]; // Key learning checkpoints
  order: number;
}

export interface InteractiveElement {
  id: string;
  type: 'checklist' | 'note' | 'highlight' | 'video' | 'download' | 'external-link';
  title: string;
  content?: string;
  url?: string;
  required?: boolean;
}

export interface ModuleResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'handbook-section' | 'template';
  url: string;
  description: string;
  downloadable: boolean;
}

// ========================================
// ASSESSMENT TYPES
// ========================================

export interface ModuleAssessment {
  id: string;
  title: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
  showFeedback: boolean;
  certificateGeneration: boolean;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssessmentResult {
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
  questionResults: Record<string, boolean>;
}

export interface AssessmentAttempt {
  id: string;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  passed: boolean;
  timeSpent: number;
  feedback: string;
}

// ========================================
// USER PROGRESS TYPES (CONSOLIDATED)
// ========================================

export interface UserProgress {
  userId: string;
  totalModulesCompleted: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  completedModules: string[];
  inProgressModules: string[];
  lastActivityDate: string;
  modules: UserModuleProgress[];
}

export interface UserModuleProgress {
  moduleId: string;
  completedSections: string[];
  bookmarks: string[];
  notes: ModuleNote[];
  assessmentAttempts: AssessmentResult[];
  completionPercentage: number;
  certificateEarned?: ModuleCertificate;
  lastAccessed: string;
  timeSpent: number;
}

export interface ModuleNote {
  id: string;
  sectionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleCertificate {
  id: string;
  userId: string;
  moduleId: string;
  roleId: string;
  employeeName: string;
  completionDate: string;
  score: number;
  certificateUrl: string;
  expirationDate?: string;
  verificationCode: string;
}

// ========================================
// ROLE AND TRAINING PATH TYPES
// ========================================

export interface SpecChemRole {
  id: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
  estimatedDuration: string;
  requiredModules: string[];
  recommendedModules: string[];
  complianceRequirements: string[];
  keyResponsibilities: string[];
  trainingPriorities: 'high' | 'medium' | 'low';
  targetAudience: string[];
}

export interface TrainingPath {
  roleId: string;
  modules: TrainingPathModule[];
  estimatedDuration: string;
  completionCriteria: CompletionCriteria;
}

export interface TrainingPathModule {
  moduleId: string;
  order: number;
  required: boolean;
  prerequisiteOf: string[];
}

export interface CompletionCriteria {
  requiredModules: number;
  minimumScore?: number;
  certificationRequired?: boolean;
}

// ========================================
// RESOURCE TYPES
// ========================================

export interface ResourceLink {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'internal' | 'external';
  category: 'sds' | 'policy' | 'emergency' | 'regulation';
}

// ========================================
// LEGACY COMPATIBILITY TYPES
// ========================================

// For backward compatibility with existing LMS types
export interface LmsUserProgress {
  userId: string;
  totalModulesCompleted: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  completedModules: string[];
  inProgressModules: string[];
  lastActivityDate: string;
  modules: Array<{
    moduleSlug: string;
    completedLessons: string[];
  }>;
}

// For backward compatibility with existing navigator types
export interface NavigatorUserProgress {
  userId: string;
  roleId: string;
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'certified';
  startedAt?: string;
  completedAt?: string;
  timeSpent: number;
  lastAccessed: string;
  assessmentScore?: number;
}
