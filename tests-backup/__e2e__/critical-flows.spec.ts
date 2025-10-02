import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should allow user to login successfully', async ({ page }) => {
    await page.goto('/login')
    
    // Check if login page loads
    await expect(page).toHaveTitle(/Login/)
    await expect(page.locator('h1')).toContainText('Login')
    
    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard or home page
    await expect(page).toHaveURL(/\/$|\/dashboard/)
    
    // Should show user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials')
    
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should allow user to signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Check if signup page loads
    await expect(page).toHaveTitle(/Sign Up/)
    
    // Fill in signup form
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to login page or show success message
    await expect(page).toHaveURL(/\/login|\/signup/)
  })

  test('should allow user to reset password', async ({ page }) => {
    await page.goto('/forgot-password')
    
    // Check if forgot password page loads
    await expect(page).toHaveTitle(/Forgot Password/)
    
    // Fill in email
    await page.fill('input[name="email"]', 'test@example.com')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Password reset email sent')
  })
})

test.describe('Course Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/$|\/dashboard/)
  })

  test('should display available courses', async ({ page }) => {
    await page.goto('/courses')
    
    // Check if courses page loads
    await expect(page).toHaveTitle(/Courses/)
    
    // Should show course list
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()
    
    // Should show at least one course
    await expect(page.locator('[data-testid="course-card"]')).toHaveCount.greaterThan(0)
  })

  test('should allow user to enroll in a course', async ({ page }) => {
    await page.goto('/courses')
    
    // Find first course and click enroll button
    const firstCourse = page.locator('[data-testid="course-card"]').first()
    await firstCourse.locator('[data-testid="enroll-button"]').click()
    
    // Should show enrollment confirmation
    await expect(page.locator('[data-testid="enrollment-confirmation"]')).toBeVisible()
    
    // Confirm enrollment
    await page.click('[data-testid="confirm-enrollment"]')
    
    // Should redirect to course or show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should track course progress', async ({ page }) => {
    await page.goto('/training')
    
    // Check if training page loads
    await expect(page).toHaveTitle(/Training/)
    
    // Should show enrolled courses
    await expect(page.locator('[data-testid="enrolled-courses"]')).toBeVisible()
    
    // Click on a course to start/resume
    const firstCourse = page.locator('[data-testid="enrolled-course"]').first()
    await firstCourse.click()
    
    // Should navigate to course content
    await expect(page).toHaveURL(/\/training\/course\/.*/)
    
    // Should show progress indicator
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
  })

  test('should allow user to complete a course', async ({ page }) => {
    await page.goto('/training')
    
    // Find a course that can be completed
    const courseCard = page.locator('[data-testid="enrolled-course"]').first()
    await courseCard.click()
    
    // Navigate through course sections
    const sections = page.locator('[data-testid="course-section"]')
    const sectionCount = await sections.count()
    
    for (let i = 0; i < sectionCount; i++) {
      await sections.nth(i).click()
      
      // Mark section as completed
      await page.click('[data-testid="mark-complete"]')
      
      // Wait for progress update
      await page.waitForTimeout(500)
    }
    
    // Should show completion message
    await expect(page.locator('[data-testid="course-completed"]')).toBeVisible()
  })
})

test.describe('Admin Functions Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'adminpassword')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/$|\/dashboard/)
  })

  test('should allow admin to manage users', async ({ page }) => {
    await page.goto('/admin/users')
    
    // Check if admin users page loads
    await expect(page).toHaveTitle(/User Management/)
    
    // Should show user list
    await expect(page.locator('[data-testid="user-list"]')).toBeVisible()
    
    // Should show create user button
    await expect(page.locator('[data-testid="create-user-button"]')).toBeVisible()
  })

  test('should allow admin to create new user', async ({ page }) => {
    await page.goto('/admin/users')
    
    // Click create user button
    await page.click('[data-testid="create-user-button"]')
    
    // Fill in user form
    await page.fill('input[name="firstName"]', 'Jane')
    await page.fill('input[name="lastName"]', 'Smith')
    await page.fill('input[name="email"]', 'jane.smith@example.com')
    await page.selectOption('select[name="role"]', 'employee')
    await page.selectOption('select[name="plantId"]', 'plant-1')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    
    // Should add user to list
    await expect(page.locator('[data-testid="user-list"]')).toContainText('Jane Smith')
  })

  test('should allow admin to manage courses', async ({ page }) => {
    await page.goto('/admin/courses')
    
    // Check if admin courses page loads
    await expect(page).toHaveTitle(/Course Management/)
    
    // Should show course list
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()
    
    // Should show create course button
    await expect(page.locator('[data-testid="create-course-button"]')).toBeVisible()
  })

  test('should allow admin to view analytics', async ({ page }) => {
    await page.goto('/admin/analytics')
    
    // Check if analytics page loads
    await expect(page).toHaveTitle(/Analytics/)
    
    // Should show analytics dashboard
    await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible()
    
    // Should show key metrics
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible()
    await expect(page.locator('[data-testid="completion-rate"]')).toBeVisible()
    await expect(page.locator('[data-testid="active-enrollments"]')).toBeVisible()
  })
})

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/$|\/dashboard/)
  })

  test('should navigate between main sections', async ({ page }) => {
    // Test navigation to different sections
    const navItems = [
      { selector: '[data-testid="nav-dashboard"]', expectedUrl: /\/$|\/dashboard/ },
      { selector: '[data-testid="nav-courses"]', expectedUrl: /\/courses/ },
      { selector: '[data-testid="nav-training"]', expectedUrl: /\/training/ },
      { selector: '[data-testid="nav-profile"]', expectedUrl: /\/profile/ },
    ]

    for (const item of navItems) {
      await page.click(item.selector)
      await expect(page).toHaveURL(item.expectedUrl)
    }
  })

  test('should handle role-based navigation', async ({ page }) => {
    // Test employee navigation
    await expect(page.locator('[data-testid="nav-admin"]')).not.toBeVisible()
    
    // Login as admin to test admin navigation
    await page.click('[data-testid="logout-button"]')
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'adminpassword')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/$|\/dashboard/)
    
    // Admin should see admin navigation
    await expect(page.locator('[data-testid="nav-admin"]')).toBeVisible()
  })

  test('should handle plant switching', async ({ page }) => {
    // Should show plant selector
    await expect(page.locator('[data-testid="plant-selector"]')).toBeVisible()
    
    // Click plant selector
    await page.click('[data-testid="plant-selector"]')
    
    // Should show available plants
    await expect(page.locator('[data-testid="plant-options"]')).toBeVisible()
    
    // Select different plant
    await page.click('[data-testid="plant-option-2"]')
    
    // Should update context and show plant-specific data
    await expect(page.locator('[data-testid="current-plant"]')).toContainText('Plant 2')
  })

  test('should handle responsive navigation', async ({ page }) => {
    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should show mobile menu button
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    
    // Click mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    
    // Should show mobile navigation
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
    
    // Test desktop navigation
    await page.setViewportSize({ width: 1024, height: 768 })
    
    // Should show desktop navigation
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible()
    
    // Should hide mobile menu
    await expect(page.locator('[data-testid="mobile-nav"]')).not.toBeVisible()
  })
})

test.describe('Accessibility Tests', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/login')
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="email"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="password"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('button[type="submit"]')).toBeFocused()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/courses')
    
    // Check for proper ARIA labels
    await expect(page.locator('[data-testid="course-list"]')).toHaveAttribute('aria-label', 'Course list')
    await expect(page.locator('[data-testid="enroll-button"]').first()).toHaveAttribute('aria-label')
  })

  test('should work with screen reader', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible()
    
    // Check for proper form labels
    const forms = page.locator('form')
    const formCount = await forms.count()
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i)
      const inputs = form.locator('input')
      const inputCount = await inputs.count()
      
      for (let j = 0; j < inputCount; j++) {
        const input = inputs.nth(j)
        const hasLabel = await input.getAttribute('aria-label') || 
                        await input.getAttribute('aria-labelledby') ||
                        await page.locator(`label[for="${await input.getAttribute('id')}"]`).count() > 0
        
        expect(hasLabel).toBeTruthy()
      }
    }
  })
})

test.describe('Cross-Browser Compatibility', () => {
  test('should work in Chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome specific test')
    
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should work in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox specific test')
    
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should work in Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari specific test')
    
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })
})
