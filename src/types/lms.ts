export interface LmsModule {
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
  slug: string;
  title: string;
  duration: number; // duration in minutes
  description: string;
  content?: string; // For future lesson content
}

export interface UserProgress {
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

export interface ResourceLink {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'internal' | 'external';
  category: 'sds' | 'policy' | 'emergency' | 'regulation';
}
