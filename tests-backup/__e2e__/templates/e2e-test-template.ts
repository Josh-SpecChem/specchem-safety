import { test, expect, type Page } from '@playwright/test'

// Template for E2E tests
export const createE2ETest = (
  testName: string,
  testCases: Array<{
    name: string
    steps: Array<{
      action: string
      selector?: string
      value?: string
      expected?: string
    }>
  }>
) => {
  test.describe(testName, () => {
    testCases.forEach(({ name, steps }) => {
      test(name, async ({ page }) => {
        for (const step of steps) {
          switch (step.action) {
            case 'navigate':
              await page.goto(step.selector || '/')
              break
            case 'click':
              await page.click(step.selector!)
              break
            case 'fill':
              await page.fill(step.selector!, step.value!)
              break
            case 'expect':
              await expect(page.locator(step.selector!)).toContainText(step.expected!)
              break
            case 'wait':
              await page.waitForSelector(step.selector!)
              break
            case 'waitForUrl':
              await page.waitForURL(step.selector!)
              break
            case 'waitForResponse':
              await page.waitForResponse(step.selector!)
              break
            case 'screenshot':
              await page.screenshot({ path: step.selector! })
              break
          }
        }
      })
    })
  })
}

// Template for user flow tests
export const createUserFlowTest = (
  flowName: string,
  testCases: Array<{
    name: string
    userType: 'admin' | 'instructor' | 'user'
    steps: Array<{
      action: string
      selector?: string
      value?: string
      expected?: string
    }>
  }>
) => {
  test.describe(`${flowName} User Flow`, () => {
    testCases.forEach(({ name, userType, steps }) => {
      test(`${name} (${userType})`, async ({ page }) => {
        // Login as specific user type
        await loginAsUserType(page, userType)
        
        // Execute flow steps
        for (const step of steps) {
          await executeStep(page, step)
        }
      })
    })
  })
}

// Template for critical path tests
export const createCriticalPathTest = (
  pathName: string,
  testCases: Array<{
    name: string
    steps: Array<{
      action: string
      selector?: string
      value?: string
      expected?: string
    }>
  }>
) => {
  test.describe(`${pathName} Critical Path`, () => {
    testCases.forEach(({ name, steps }) => {
      test(name, async ({ page }) => {
        for (const step of steps) {
          await executeStep(page, step)
        }
      })
    })
  })
}

// Helper functions for E2E tests
const loginAsUserType = async (page: Page, userType: string) => {
  const credentials = {
    admin: { email: 'admin@example.com', password: 'admin123' },
    instructor: { email: 'instructor@example.com', password: 'instructor123' },
    user: { email: 'user@example.com', password: 'user123' }
  }
  
  const { email, password } = credentials[userType as keyof typeof credentials]
  
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/$|\/dashboard/)
}

const executeStep = async (page: Page, step: { action: string; selector?: string; value?: string; expected?: string }) => {
  switch (step.action) {
    case 'navigate':
      await page.goto(step.selector || '/')
      break
    case 'click':
      await page.click(step.selector!)
      break
    case 'fill':
      await page.fill(step.selector!, step.value || '')
      break
    case 'expect':
      await expect(page.locator(step.selector!)).toContainText(step.expected!)
      break
    case 'wait':
      await page.waitForSelector(step.selector!)
      break
    case 'waitForUrl':
      await page.waitForURL(step.selector!)
      break
    case 'waitForResponse':
      await page.waitForResponse(step.selector!)
      break
    case 'screenshot':
      await page.screenshot({ path: step.selector! })
      break
  }
}

// Example usage templates
export const exampleTemplates = {
  authenticationFlow: () => {
    createE2ETest('User Authentication', [
      {
        name: 'should login successfully',
        steps: [
          { action: 'navigate', selector: '/login' },
          { action: 'fill', selector: '[data-testid="email"]', value: 'test@example.com' },
          { action: 'fill', selector: '[data-testid="password"]', value: 'password' },
          { action: 'click', selector: '[data-testid="login-button"]' },
          { action: 'wait', selector: '[data-testid="dashboard"]' },
          { action: 'expect', selector: '[data-testid="user-name"]', expected: 'Test User' }
        ]
      },
      {
        name: 'should show error for invalid credentials',
        steps: [
          { action: 'navigate', selector: '/login' },
          { action: 'fill', selector: '[data-testid="email"]', value: 'invalid@example.com' },
          { action: 'fill', selector: '[data-testid="password"]', value: 'wrongpassword' },
          { action: 'click', selector: '[data-testid="login-button"]' },
          { action: 'expect', selector: '[data-testid="error-message"]', expected: 'Invalid credentials' }
        ]
      }
    ])
  },

  courseEnrollmentFlow: () => {
    createUserFlowTest('Course Enrollment', [
      {
        name: 'should enroll in course',
        userType: 'user',
        steps: [
          { action: 'navigate', selector: '/courses' },
          { action: 'click', selector: '[data-testid="course-card-1"]' },
          { action: 'click', selector: '[data-testid="enroll-button"]' },
          { action: 'wait', selector: '[data-testid="enrollment-success"]' },
          { action: 'expect', selector: '[data-testid="enrollment-status"]', expected: 'Enrolled' }
        ]
      }
    ])
  },

  adminUserManagementFlow: () => {
    createCriticalPathTest('Admin User Management', [
      {
        name: 'should create new user',
        steps: [
          { action: 'navigate', selector: '/admin/users' },
          { action: 'click', selector: '[data-testid="create-user-button"]' },
          { action: 'fill', selector: '[data-testid="email-input"]', value: 'newuser@example.com' },
          { action: 'fill', selector: '[data-testid="firstName-input"]', value: 'New' },
          { action: 'fill', selector: '[data-testid="lastName-input"]', value: 'User' },
          { action: 'click', selector: '[data-testid="save-button"]' },
          { action: 'wait', selector: '[data-testid="user-created-success"]' },
          { action: 'expect', selector: '[data-testid="user-list"]', expected: 'New User' }
        ]
      }
    ])
  }
}
