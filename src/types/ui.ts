/**
 * Centralized UI component types for SpecChem Safety Training system
 * Provides type-safe interfaces for all UI components and forms
 */

import type React from 'react';
import type { AssessmentQuestion, AssessmentResult } from './domain';

// ========================================
// COMPONENT PROP TYPES
// ========================================

// Note: ButtonProps is defined in src/components/ui/button.tsx
// as it extends HTML button attributes

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// ========================================
// FORM TYPES
// ========================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
}

export interface ProfileUpdateFormData {
  firstName: string;
  lastName: string;
  jobTitle?: string;
}

export interface AdminCreateUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  role: 'employee' | 'plant_manager' | 'hr_admin';
  plantId: string;
}

// ========================================
// NAVIGATION TYPES
// ========================================

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ========================================
// MODAL TYPES
// ========================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ========================================
// TOAST/NOTIFICATION TYPES
// ========================================

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

// ========================================
// CARD TYPES
// ========================================

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  enrolledCount?: number;
  isEnrolled?: boolean;
  progress?: number;
  onEnroll?: () => void;
  onView?: () => void;
}

export interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  category: 'safety' | 'compliance' | 'technical' | 'policy' | 'product';
  isCompleted?: boolean;
  progress?: number;
  onStart?: () => void;
  onContinue?: () => void;
}

// ========================================
// DASHBOARD TYPES
// ========================================

export interface DashboardWidgetProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

// ========================================
// FILTER TYPES
// ========================================

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterProps {
  label: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
}

export interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

// ========================================
// LOADING TYPES
// ========================================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

// ========================================
// ERROR TYPES
// ========================================

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

// ========================================
// LAYOUT TYPES
// ========================================

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
  userRole?: string;
}

export interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
}

// ========================================
// FORM VALIDATION TYPES
// ========================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// ========================================
// COMPONENT-SPECIFIC TYPES (consolidated from scattered interfaces)
// ========================================

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
}

export interface ModuleViewerProps {
  moduleData: {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    sections: Array<{
      id: string;
      title: string;
      content: string;
      estimatedReadTime: string;
    }>;
    learningObjectives: string[];
    resources: Array<{
      id: string;
      title: string;
      type: string;
      url: string;
      description: string;
    }>;
  };
  userProgress: {
    currentSection: string;
    sectionsCompleted: string[];
    bookmarks: string[];
    timeSpent: number;
    status: 'not-started' | 'in-progress' | 'completed';
  };
  onProgressUpdate: (progress: Record<string, unknown>) => void;
}

export interface EnhancedModuleViewerProps {
  courseRoute: string; // e.g., '/ebook' or '/ebook-spanish'
  moduleData: {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    sections: Array<{
      id: string;
      title: string;
      content: string;
      estimatedReadTime: string;
      questions?: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
      }>;
    }>;
    learningObjectives: string[];
    resources: Array<{
      id: string;
      title: string;
      type: string;
      url: string;
      description: string;
    }>;
  };
  onModuleComplete?: () => void;
}

export interface AssessmentProps {
  moduleId: string;
  assessment: {
    id: string;
    title: string;
    questions: AssessmentQuestion[];
    passingScore: number;
    maxAttempts: number;
    timeLimit?: number;
    showFeedback?: boolean;
    certificateGeneration?: boolean;
  };
  onComplete: (result: AssessmentResult) => void;
}

export interface EnrollButtonProps {
  moduleSlug: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

// ========================================
// ADMIN UI TYPES
// ========================================

export interface AdminTableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface AdminFormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'date' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: Record<string, unknown>;
}

export interface AdminFormData {
  [key: string]: unknown;
}

export interface AdminBulkAction {
  id: string;
  label: string;
  action: (selectedItems: string[]) => Promise<void>;
  variant?: 'default' | 'destructive' | 'outline';
  icon?: React.ReactNode;
}

// ========================================
// INTEGRATION TYPES
// ========================================

export interface IntegrationStatus {
  id?: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'loading' | 'success' | 'warning';
  description?: string;
  details?: string[];
  lastSync?: string;
  error?: string;
}
