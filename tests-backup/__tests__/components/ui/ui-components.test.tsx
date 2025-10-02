import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

describe('UI Components Tests', () => {
  describe('Button Component', () => {
    it('should render button with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should render button with different variants', () => {
      const { rerender } = render(<Button variant="destructive">Delete</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-destructive', 'text-destructive-foreground')

      rerender(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole('button')).toHaveClass('border', 'border-input', 'bg-background')

      rerender(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-secondary', 'text-secondary-foreground')

      rerender(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')

      rerender(<Button variant="link">Link</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4')
    })

    it('should render button with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-xs')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10', 'px-8')

      rerender(<Button size="icon">Icon</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9', 'w-9')
    })

    it('should handle click events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<Button ref={ref}>Ref Button</Button>)
      
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Card Components', () => {
    it('should render Card with default styling', () => {
      render(<Card>Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow')
    })

    it('should render CardHeader with correct styling', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      )
      
      const header = screen.getByText('Header content')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('should render CardTitle with correct styling', () => {
      render(
        <Card>
          <CardTitle>Card Title</CardTitle>
        </Card>
      )
      
      const title = screen.getByText('Card Title')
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
    })

    it('should render CardDescription with correct styling', () => {
      render(
        <Card>
          <CardDescription>Card description</CardDescription>
        </Card>
      )
      
      const description = screen.getByText('Card description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('should render CardContent with correct styling', () => {
      render(
        <Card>
          <CardContent>Card content</CardContent>
        </Card>
      )
      
      const content = screen.getByText('Card content')
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('should render CardFooter with correct styling', () => {
      render(
        <Card>
          <CardFooter>Card footer</CardFooter>
        </Card>
      )
      
      const footer = screen.getByText('Card footer')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    it('should compose Card components correctly', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content</p>
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('This is a test card')).toBeInTheDocument()
      expect(screen.getByText('This is the card content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('should accept custom className on all Card components', () => {
      render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-description">Description</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Title').closest('div')).toHaveClass('custom-card')
      expect(screen.getByText('Title').closest('div')).toHaveClass('custom-header')
      expect(screen.getByText('Title')).toHaveClass('custom-title')
      expect(screen.getByText('Description')).toHaveClass('custom-description')
      expect(screen.getByText('Content')).toHaveClass('custom-content')
      expect(screen.getByText('Footer')).toHaveClass('custom-footer')
    })

    it('should forward refs correctly on all Card components', () => {
      const cardRef = vi.fn()
      const headerRef = vi.fn()
      const titleRef = vi.fn()
      const descriptionRef = vi.fn()
      const contentRef = vi.fn()
      const footerRef = vi.fn()

      render(
        <Card ref={cardRef}>
          <CardHeader ref={headerRef}>
            <CardTitle ref={titleRef}>Title</CardTitle>
            <CardDescription ref={descriptionRef}>Description</CardDescription>
          </CardHeader>
          <CardContent ref={contentRef}>Content</CardContent>
          <CardFooter ref={footerRef}>Footer</CardFooter>
        </Card>
      )
      
      expect(cardRef).toHaveBeenCalled()
      expect(headerRef).toHaveBeenCalled()
      expect(titleRef).toHaveBeenCalled()
      expect(descriptionRef).toHaveBeenCalled()
      expect(contentRef).toHaveBeenCalled()
      expect(footerRef).toHaveBeenCalled()
    })
  })

  describe('Input Component', () => {
    it('should render input with default props', () => {
      render(<Input placeholder="Enter text" />)
      
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md', 'border', 'border-input')
    })

    it('should render input with different types', () => {
      const { rerender } = render(<Input type="email" placeholder="Email" />)
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

      rerender(<Input type="password" placeholder="Password" />)
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

      rerender(<Input type="number" placeholder="Number" />)
      expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')
    })

    it('should handle user input', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Enter text" />)
      
      const input = screen.getByPlaceholderText('Enter text')
      await user.type(input, 'Hello World')
      
      expect(input).toHaveValue('Hello World')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled placeholder="Disabled input" />)
      
      const input = screen.getByPlaceholderText('Disabled input')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('should accept custom className', () => {
      render(<Input className="custom-input" placeholder="Custom input" />)
      
      const input = screen.getByPlaceholderText('Custom input')
      expect(input).toHaveClass('custom-input')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<Input ref={ref} placeholder="Ref input" />)
      
      expect(ref).toHaveBeenCalled()
    })

    it('should handle focus and blur events', async () => {
      const handleFocus = vi.fn()
      const handleBlur = vi.fn()
      const user = userEvent.setup()
      
      render(
        <Input 
          onFocus={handleFocus} 
          onBlur={handleBlur} 
          placeholder="Focus test" 
        />
      )
      
      const input = screen.getByPlaceholderText('Focus test')
      
      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      
      await user.tab()
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should handle change events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={handleChange} placeholder="Change test" />)
      
      const input = screen.getByPlaceholderText('Change test')
      await user.type(input, 'test')
      
      expect(handleChange).toHaveBeenCalledTimes(4) // One for each character
    })

    it('should have proper accessibility attributes', () => {
      render(
        <Input 
          aria-label="Test input"
          aria-describedby="input-description"
          placeholder="Accessible input"
        />
      )
      
      const input = screen.getByLabelText('Test input')
      expect(input).toHaveAttribute('aria-describedby', 'input-description')
    })

    it('should handle controlled input with value prop', () => {
      const handleChange = vi.fn()
      render(
        <Input 
          value="Controlled value"
          onChange={handleChange}
          placeholder="Controlled input"
        />
      )
      
      const input = screen.getByPlaceholderText('Controlled input')
      expect(input).toHaveValue('Controlled value')
    })
  })

  describe('Component Integration', () => {
    it('should work together in a form', async () => {
      const handleSubmit = vi.fn()
      const user = userEvent.setup()
      
      render(
        <Card>
          <CardHeader>
            <CardTitle>Login Form</CardTitle>
            <CardDescription>Enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input 
                type="email" 
                placeholder="Email" 
                name="email"
                className="mb-4"
              />
              <Input 
                type="password" 
                placeholder="Password" 
                name="password"
                className="mb-4"
              />
              <Button type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      )
      
      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: 'Login' })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('should handle disabled state across components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Disabled Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Input disabled placeholder="Disabled input" />
            <Button disabled className="mt-4">Disabled Button</Button>
          </CardContent>
        </Card>
      )
      
      const input = screen.getByPlaceholderText('Disabled input')
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      
      expect(input).toBeDisabled()
      expect(button).toBeDisabled()
    })
  })
})
