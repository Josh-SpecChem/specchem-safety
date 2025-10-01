import { describe, it, expect } from 'vitest';
import type {
  Profile,
  Course,
  Plant,
  Enrollment,
  Progress,
  LmsModule,
  TrainingModule,
  UserProgress,
  ApiResponse,
  PaginatedResult,
  SpecChemRole,
  AssessmentQuestion,
  AssessmentResult,
  ButtonProps,
  FormFieldProps,
  TableProps,
  ModalProps,
  ToastProps,
  Optional,
  Required,
  DeepPartial,
  QuestionResponseMeta,
  ActivityEventMeta,
  ProgressUpdateMeta,
} from '../index';

describe('Type Definitions', () => {
  describe('Database Types', () => {
    it('should have proper Profile type structure', () => {
      const profile: Profile = {
        id: 'test-id',
        plantId: 'plant-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        jobTitle: 'Engineer',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      
      expect(profile.id).toBe('test-id');
      expect(profile.firstName).toBe('John');
      expect(profile.status).toBe('active');
    });

    it('should have proper Course type structure', () => {
      const course: Course = {
        id: 'course-id',
        slug: 'test-course',
        title: 'Test Course',
        version: '1.0',
        isPublished: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      
      expect(course.slug).toBe('test-course');
      expect(course.isPublished).toBe(true);
    });

    it('should have proper Plant type structure', () => {
      const plant: Plant = {
        id: 'plant-id',
        name: 'Test Plant',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      
      expect(plant.name).toBe('Test Plant');
      expect(plant.isActive).toBe(true);
    });

    it('should have proper Enrollment type structure', () => {
      const enrollment: Enrollment = {
        id: 'enrollment-id',
        userId: 'user-id',
        courseId: 'course-id',
        plantId: 'plant-id',
        status: 'enrolled',
        enrolledAt: '2025-01-01T00:00:00Z',
        completedAt: null,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      
      expect(enrollment.status).toBe('enrolled');
      expect(enrollment.completedAt).toBeNull();
    });

    it('should have proper Progress type structure', () => {
      const progress: Progress = {
        id: 'progress-id',
        userId: 'user-id',
        courseId: 'course-id',
        plantId: 'plant-id',
        progressPercent: 50,
        currentSection: 'section-1',
        lastActiveAt: '2025-01-01T00:00:00Z',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      
      expect(progress.progressPercent).toBe(50);
      expect(progress.currentSection).toBe('section-1');
    });
  });

  describe('API Types', () => {
    it('should have proper ApiResponse type structure', () => {
      const response: ApiResponse<Profile> = {
        success: true,
        data: {
          id: 'test-id',
          plantId: 'plant-id',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          jobTitle: 'Engineer',
          status: 'active',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      };
      
      expect(response.success).toBe(true);
      expect(response.data?.firstName).toBe('John');
    });

    it('should have proper PaginatedResult type structure', () => {
      const paginated: PaginatedResult<Profile> = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
      
      expect(paginated.page).toBe(1);
      expect(paginated.limit).toBe(20);
    });
  });

  describe('Domain Types', () => {
    it('should have proper LmsModule type structure', () => {
      const module: LmsModule = {
        id: 'module-id',
        slug: 'test-module',
        title: 'Test Module',
        description: 'Test Description',
        estimatedHours: 2,
        difficulty: 'Beginner',
        lessons: [],
        required: true,
        icon: 'test-icon',
        category: 'safety',
      };
      
      expect(module.difficulty).toBe('Beginner');
      expect(module.required).toBe(true);
    });

    it('should have proper TrainingModule type structure', () => {
      const module: TrainingModule = {
        id: 'module-id',
        title: 'Test Module',
        description: 'Test Description',
        category: 'safety',
        duration: '2 hours',
        difficulty: 'beginner',
        prerequisites: [],
        content: {
          sections: [],
          resources: [],
        },
        assessmentRequired: true,
        certificationEligible: true,
        lastUpdated: '2025-01-01T00:00:00Z',
      };
      
      expect(module.category).toBe('safety');
      expect(module.difficulty).toBe('beginner');
    });

    it('should have proper UserProgress type structure', () => {
      const progress: UserProgress = {
        userId: 'user-id',
        totalModulesCompleted: 5,
        totalLessonsCompleted: 20,
        currentStreak: 3,
        completedModules: ['module-1', 'module-2'],
        inProgressModules: ['module-3'],
        lastActivityDate: '2025-01-01T00:00:00Z',
        modules: [],
      };
      
      expect(progress.totalModulesCompleted).toBe(5);
      expect(progress.currentStreak).toBe(3);
    });

    it('should have proper SpecChemRole type structure', () => {
      const role: SpecChemRole = {
        id: 'role-id',
        name: 'engineer',
        title: 'Engineer',
        description: 'Engineering role',
        shortDescription: 'Eng',
        icon: 'wrench',
        color: 'blue',
        estimatedDuration: '40 hours',
        requiredModules: ['module-1'],
        recommendedModules: ['module-2'],
        complianceRequirements: ['requirement-1'],
        keyResponsibilities: ['responsibility-1'],
        trainingPriorities: 'high',
        targetAudience: ['engineers'],
      };
      
      expect(role.trainingPriorities).toBe('high');
      expect(role.color).toBe('blue');
    });

    it('should have proper AssessmentQuestion type structure', () => {
      const question: AssessmentQuestion = {
        id: 'question-id',
        type: 'multiple-choice',
        question: 'What is the correct answer?',
        options: ['Option A', 'Option B', 'Option C'],
        correctAnswer: 'Option A',
        explanation: 'This is correct because...',
        points: 10,
        difficulty: 'medium',
      };
      
      expect(question.type).toBe('multiple-choice');
      expect(question.difficulty).toBe('medium');
    });

    it('should have proper AssessmentResult type structure', () => {
      const result: AssessmentResult = {
        attemptNumber: 1,
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        passed: true,
        timeSpent: 1200,
        completedAt: '2025-01-01T00:00:00Z',
        questionResults: { 'q1': true, 'q2': false },
      };
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(85);
    });
  });

  describe('UI Types', () => {
    it('should have proper ButtonProps type structure', () => {
      const buttonProps: ButtonProps = {
        variant: 'primary',
        size: 'md',
        disabled: false,
        loading: false,
        children: 'Click me',
        onClick: () => {},
      };
      
      expect(buttonProps.variant).toBe('primary');
      expect(buttonProps.size).toBe('md');
    });

    it('should have proper FormFieldProps type structure', () => {
      const fieldProps: FormFieldProps = {
        label: 'Email',
        name: 'email',
        type: 'email',
        placeholder: 'Enter email',
        required: true,
        error: undefined,
        value: '',
        onChange: () => {},
      };
      
      expect(fieldProps.label).toBe('Email');
      expect(fieldProps.type).toBe('email');
    });

    it('should have proper ModalProps type structure', () => {
      const modalProps: ModalProps = {
        isOpen: true,
        onClose: () => {},
        title: 'Test Modal',
        children: 'Modal content',
        size: 'md',
      };
      
      expect(modalProps.isOpen).toBe(true);
      expect(modalProps.size).toBe('md');
    });

    it('should have proper ToastProps type structure', () => {
      const toastProps: ToastProps = {
        id: 'toast-1',
        type: 'success',
        title: 'Success!',
        message: 'Operation completed',
        duration: 5000,
        onClose: () => {},
      };
      
      expect(toastProps.type).toBe('success');
      expect(toastProps.duration).toBe(5000);
    });
  });

  describe('Utility Types', () => {
    it('should have proper Optional type structure', () => {
      type TestType = {
        required: string;
        optional: string;
      };
      
      type OptionalTest = Optional<TestType, 'optional'>;
      
      const optionalTest: OptionalTest = {
        required: 'test',
        // optional can be omitted
      };
      
      expect(optionalTest.required).toBe('test');
    });

    it('should have proper Required type structure', () => {
      type TestType = {
        required: string;
        optional?: string;
      };
      
      type RequiredTest = Required<TestType, 'optional'>;
      
      const requiredTest: RequiredTest = {
        required: 'test',
        optional: 'now-required',
      };
      
      expect(requiredTest.optional).toBe('now-required');
    });

    it('should have proper DeepPartial type structure', () => {
      type TestType = {
        nested: {
          value: string;
        };
      };
      
      type PartialTest = DeepPartial<TestType>;
      
      const partialTest: PartialTest = {
        nested: {
          // value can be omitted
        },
      };
      
      expect(partialTest.nested).toBeDefined();
    });

    it('should have proper QuestionResponseMeta type structure', () => {
      const meta: QuestionResponseMeta = {
        timeSpent: 30,
        hintsUsed: 2,
        attempts: 1,
        difficulty: 'medium',
        deviceType: 'desktop',
        browserInfo: 'Chrome',
      };
      
      expect(meta.timeSpent).toBe(30);
      expect(meta.difficulty).toBe('medium');
    });

    it('should have proper ActivityEventMeta type structure', () => {
      const meta: ActivityEventMeta = {
        sectionId: 'section-1',
        timeSpent: 300,
        deviceType: 'mobile',
        browserInfo: 'Safari',
        previousSection: 'section-0',
        completionMethod: 'manual',
      };
      
      expect(meta.sectionId).toBe('section-1');
      expect(meta.completionMethod).toBe('manual');
    });

    it('should have proper ProgressUpdateMeta type structure', () => {
      const meta: ProgressUpdateMeta = {
        previousSection: 'section-1',
        timeSpent: 600,
        completionMethod: 'automatic',
        assessmentScore: 85,
        certificateEarned: true,
      };
      
      expect(meta.assessmentScore).toBe(85);
      expect(meta.certificateEarned).toBe(true);
    });
  });
});
