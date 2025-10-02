import { test, expect } from '@playwright/test'
import { createE2ETest } from './templates/e2e-test-template'

// Simplified E2E tests using templates
createE2ETest('User Authentication Flow', [
  {
    name: 'should allow user to login successfully',
    steps: [
      { action: 'navigate', selector: '/login' },
      { action: 'fill', selector: 'input[name="email"]', text: 'test@example.com' },
      { action: 'fill', selector: 'input[name="password"]', text: 'password123' },
      { action: 'click', selector: 'button[type="submit"]' },
      { action: 'waitForUrl', selector: '/dashboard' },
      { action: 'expect', selector: '[data-testid="user-menu"]', expected: 'Test User' }
    ]
  },

  {
    name: 'should show error for invalid credentials',
    steps: [
      { action: 'navigate', selector: '/login' },
      { action: 'fill', selector: 'input[name="email"]', text: 'invalid@example.com' },
      { action: 'fill', selector: 'input[name="password"]', text: 'wrongpassword' },
      { action: 'click', selector: 'button[type="submit"]' },
      { action: 'expect', selector: '[data-testid="error-message"]', expected: 'Invalid credentials' },
      { action: 'waitForUrl', selector: '/login' }
    ]
  },

  {
    name: 'should allow user to signup',
    steps: [
      { action: 'navigate', selector: '/signup' },
      { action: 'fill', selector: 'input[name="firstName"]', text: 'John' },
      { action: 'fill', selector: 'input[name="lastName"]', text: 'Doe' },
      { action: 'fill', selector: 'input[name="email"]', text: 'john.doe@example.com' },
      { action: 'fill', selector: 'input[name="password"]', text: 'password123' },
      { action: 'fill', selector: 'input[name="confirmPassword"]', text: 'password123' },
      { action: 'click', selector: 'button[type="submit"]' },
      { action: 'waitForUrl', selector: '/dashboard' },
      { action: 'expect', selector: '[data-testid="welcome-message"]', expected: 'Welcome, John!' }
    ]
  }
])

createE2ETest('Course Enrollment Flow', [
  {
    name: 'should allow user to enroll in course',
    steps: [
      { action: 'navigate', selector: '/courses' },
      { action: 'click', selector: '[data-testid="course-card-1"]' },
      { action: 'click', selector: '[data-testid="enroll-button"]' },
      { action: 'wait', selector: '[data-testid="enrollment-success"]' },
      { action: 'expect', selector: '[data-testid="enrollment-status"]', expected: 'Enrolled' }
    ]
  },

  {
    name: 'should show course progress',
    steps: [
      { action: 'navigate', selector: '/my-courses' },
      { action: 'click', selector: '[data-testid="course-progress-1"]' },
      { action: 'expect', selector: '[data-testid="progress-bar"]', expected: '0%' },
      { action: 'click', selector: '[data-testid="start-course"]' },
      { action: 'wait', selector: '[data-testid="course-content"]' }
    ]
  }
])

createE2ETest('Admin User Management Flow', [
  {
    name: 'should allow admin to create new user',
    steps: [
      { action: 'navigate', selector: '/admin/users' },
      { action: 'click', selector: '[data-testid="create-user-button"]' },
      { action: 'fill', selector: '[data-testid="email-input"]', text: 'newuser@example.com' },
      { action: 'fill', selector: '[data-testid="firstName-input"]', text: 'New' },
      { action: 'fill', selector: '[data-testid="lastName-input"]', text: 'User' },
      { action: 'click', selector: '[data-testid="save-button"]' },
      { action: 'wait', selector: '[data-testid="user-created-success"]' },
      { action: 'expect', selector: '[data-testid="user-list"]', expected: 'New User' }
    ]
  },

  {
    name: 'should allow admin to edit user',
    steps: [
      { action: 'navigate', selector: '/admin/users' },
      { action: 'click', selector: '[data-testid="edit-user-1"]' },
      { action: 'fill', selector: '[data-testid="firstName-input"]', text: 'Updated' },
      { action: 'click', selector: '[data-testid="save-button"]' },
      { action: 'wait', selector: '[data-testid="user-updated-success"]' },
      { action: 'expect', selector: '[data-testid="user-name"]', expected: 'Updated User' }
    ]
  }
])

// Critical path tests
test.describe('Critical Application Flows', () => {
  test('Complete user journey from signup to course completion', async ({ page }) => {
    // Signup
    await page.goto('/signup')
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'User')
    await page.fill('input[name="email"]', 'testuser@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Enroll in course
    await page.goto('/courses')
    await page.click('[data-testid="course-card-1"]')
    await page.click('[data-testid="enroll-button"]')
    await page.waitForSelector('[data-testid="enrollment-success"]')

    // Complete course
    await page.goto('/my-courses')
    await page.click('[data-testid="course-progress-1"]')
    await page.click('[data-testid="start-course"]')
    
    // Simulate course completion
    await page.click('[data-testid="next-section"]')
    await page.click('[data-testid="next-section"]')
    await page.click('[data-testid="complete-course"]')
    
    // Verify completion
    await expect(page.locator('[data-testid="course-completed"]')).toBeVisible()
    await expect(page.locator('[data-testid="completion-certificate"]')).toBeVisible()
  })

  test('Admin can manage users and courses', async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Create user
    await page.goto('/admin/users')
    await page.click('[data-testid="create-user-button"]')
    await page.fill('[data-testid="email-input"]', 'newuser@example.com')
    await page.fill('[data-testid="firstName-input"]', 'New')
    await page.fill('[data-testid="lastName-input"]', 'User')
    await page.click('[data-testid="save-button"]')
    await page.waitForSelector('[data-testid="user-created-success"]')

    // Create course
    await page.goto('/admin/courses')
    await page.click('[data-testid="create-course-button"]')
    await page.fill('[data-testid="title-input"]', 'New Course')
    await page.fill('[data-testid="description-input"]', 'Course description')
    await page.click('[data-testid="save-button"]')
    await page.waitForSelector('[data-testid="course-created-success"]')

    // Verify both were created
    await page.goto('/admin/users')
    await expect(page.locator('[data-testid="user-list"]')).toContainText('New User')
    
    await page.goto('/admin/courses')
    await expect(page.locator('[data-testid="course-list"]')).toContainText('New Course')
  })
})
