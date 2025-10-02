// Simplified test data fixtures
export const testData = {
  users: [
    {
      id: 'user-1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      department: 'management',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'user-2',
      email: 'instructor@example.com',
      firstName: 'Instructor',
      lastName: 'User',
      role: 'instructor',
      department: 'safety',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'user-3',
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      department: 'operations',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  
  courses: [
    {
      id: 'course-1',
      title: 'Safety Fundamentals',
      description: 'Basic safety training course',
      modules: [
        { id: 'module-1', title: 'Introduction', duration: 30 },
        { id: 'module-2', title: 'Safety Rules', duration: 45 }
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'course-2',
      title: 'Advanced Safety',
      description: 'Advanced safety training course',
      modules: [
        { id: 'module-3', title: 'Advanced Topics', duration: 60 }
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  
  enrollments: [
    {
      id: 'enrollment-1',
      userId: 'user-3',
      courseId: 'course-1',
      status: 'enrolled',
      progress: 0,
      startedAt: new Date('2024-01-01'),
      completedAt: null
    },
    {
      id: 'enrollment-2',
      userId: 'user-3',
      courseId: 'course-2',
      status: 'in_progress',
      progress: 50,
      startedAt: new Date('2024-01-01'),
      completedAt: null
    }
  ],

  plants: [
    {
      id: 'plant-1',
      name: 'Test Plant 1',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'plant-2',
      name: 'Test Plant 2',
      isActive: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],

  progress: [
    {
      id: 'progress-1',
      userId: 'user-3',
      courseId: 'course-1',
      progressPercent: 75,
      currentSection: 'section-3',
      lastActiveAt: new Date('2024-01-10'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'progress-2',
      userId: 'user-3',
      courseId: 'course-2',
      progressPercent: 100,
      currentSection: 'section-5',
      lastActiveAt: new Date('2024-01-15'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    }
  ]
}

// Helper functions for test data
export const testDataHelpers = {
  getUserById: (id: string) => testData.users.find(user => user.id === id),
  getCourseById: (id: string) => testData.courses.find(course => course.id === id),
  getEnrollmentById: (id: string) => testData.enrollments.find(enrollment => enrollment.id === id),
  getPlantById: (id: string) => testData.plants.find(plant => plant.id === id),
  getProgressById: (id: string) => testData.progress.find(progress => progress.id === id),
  
  getEnrollmentsByUser: (userId: string) => testData.enrollments.filter(enrollment => enrollment.userId === userId),
  getEnrollmentsByCourse: (courseId: string) => testData.enrollments.filter(enrollment => enrollment.courseId === courseId),
  getProgressByUser: (userId: string) => testData.progress.filter(progress => progress.userId === userId),
  getProgressByCourse: (courseId: string) => testData.progress.filter(progress => progress.courseId === courseId)
}

// Form data for testing
export const formData = {
  login: {
    email: 'test@example.com',
    password: 'password123'
  },
  signup: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  },
  profileUpdate: {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Senior Safety Coordinator'
  }
}

// Error scenarios
export const errorScenarios = {
  validationError: {
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    details: [
      { field: 'email', message: 'Invalid email format' },
      { field: 'password', message: 'Password must be at least 6 characters' }
    ]
  },
  notFoundError: {
    message: 'Resource not found',
    code: 'NOT_FOUND'
  },
  unauthorizedError: {
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED'
  },
  forbiddenError: {
    message: 'Access forbidden',
    code: 'FORBIDDEN'
  }
}

// Test environment configuration
export const testConfig = {
  database: {
    url: 'postgresql://test:test@localhost:5432/test_db',
    ssl: false
  },
  supabase: {
    url: 'http://localhost:54321',
    anonKey: 'test-anon-key'
  },
  app: {
    baseUrl: 'http://localhost:3000',
    environment: 'test'
  }
}