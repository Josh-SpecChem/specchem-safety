# Component Documentation

**Generated:** 2025-10-01T21:54:22.341Z  
**Purpose:** Auto-generated component documentation from React components  
**Status:** Current

## Overview

This documentation is automatically generated from React component files.

## Components

### Announcements

**Path:** `src/components/Announcements.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client";

import { Bell, ExternalLink, Calendar } from 'lucide-react';

export function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "New OSHA Requirements Integrated",
      content: "Updated Workplace Safety course now includes new OSHA requirements effective September 2025. All associates should complete the updated modules.",
      date: "August 20, 2025",
      priority: "high",
      link: "/courses/workplace-safety"
    },
    {
// ... (truncated)
```

---

### ComplianceWidget

**Path:** `src/components/ComplianceWidget.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client";

import { CheckCircle, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

export function ComplianceWidget() {
  // Mock data - in real app this would come from API
  const complianceData = {
    isCompliant: false,
    nextTrainingDue: "Start Training",
    completionPercentage: 0,
    coursesCompleted: 0,
    totalCourses: 5
  };

  return (
// ... (truncated)
```

---

### EnrollButton

**Path:** `src/components/EnrollButton.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client';

import { Button } from '@/components/ui/button';
import { trackLmsEvent } from '@/features/lms/analytics/client';
import type { EnrollButtonProps } from '@/types';

export function EnrollButton({ moduleSlug }: EnrollButtonProps) {
  const handleEnroll = () => {
    trackLmsEvent.ctaClicked('start_training', moduleSlug);
  };

  return (
    <Button size="lg" onClick={handleEnroll}>
      Start Training
    </Button>
// ... (truncated)
```

---

### Unknown

**Path:** `src/components/FeaturedCourses.tsx`  
**Props:** No props found

```typescript
// Component implementation
```

---

### Footer

**Path:** `src/components/Footer.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client";

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[--color-fg-primary] text-[--color-fg-inverse] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[--color-brand-primary] rounded-md flex items-center justify-center text-white font-bold text-lg">
// ... (truncated)
```

---

### Header

**Path:** `src/components/Header.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
// ... (truncated)
```

---

### HeroSection

**Path:** `src/components/HeroSection.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client";

import { ArrowRight, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-bg-base via-slate-50 to-blue-50 py-16 sm:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-fg-primary leading-tight mb-6">
          Empowering Your Work Through{' '}
          <span className="text-brand-primary">Knowledge & Compliance</span>
// ... (truncated)
```

---

### IntegrationDashboard

**Path:** `src/components/IntegrationDashboard.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Database,
  Shield,
  Users,
  BookOpen,
  BarChart3,
  Zap,
  Settings,
// ... (truncated)
```

---

### ProtectedRoute

**Path:** `src/components/ProtectedRoute.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { ProtectedRouteProps } from '@/types'

export function ProtectedRoute({
  children,
  requireAdmin = false,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

// ... (truncated)
```

---

### ResourceLinks

**Path:** `src/components/ResourceLinks.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client";

import { FileText, Package, BookOpen, HelpCircle } from 'lucide-react';

export function ResourceLinks() {
  const resources = [
    {
      id: 1,
      title: "Job Aids & Quick Guides",
      description: "Downloadable reference materials and step-by-step guides for daily operations.",
      icon: <FileText className="w-6 h-6" />,
      link: "/resources/job-aids",
      color: "text-[--color-accent-cool] bg-blue-50"
    },
    {
// ... (truncated)
```

---

### AdminDashboardContent

**Path:** `src/components/admin/AdminDashboardContent.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboardStats } from '@/hooks/useAnalytics'
import { useUsers } from '@/hooks/useUsers'

// Mock recent activities - could be replaced with real API data
const mockRecentActivities = [
  {
    id: '1',
    user: 'John Smith',
    action: 'Completed Function-Specific HazMat Training',
    timestamp: '2024-09-30T10:30:00Z',
// ... (truncated)
```

---

### CreateUserForm

**Path:** `src/components/admin/CreateUserForm.tsx`  
**Props:** onSuccess, onCancel

```typescript
// Component implementation
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUnifiedForm } from "@/hooks/useUnifiedForm";
import { adminCreateUserFormSchema } from "@/lib/schemas/unified-form-schemas";
import {
  FormField,
  FormError,
  FormSuccess,
  FormSubmitButton,
  FormContainer,
} from "@/components/ui/unified-form";
import type { AdminCreateUserForm } from "@/lib/schemas/unified-form-schemas";

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// ... (truncated)
```

---

### EnrollmentManagementContent

**Path:** `src/components/admin/EnrollmentManagementContent.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEnrollments, useEnrollmentStats } from '@/hooks/useEnrollments'
import {
  useAdminFilters,
  useAdminPagination,
  AdminTable,
  AdminFilters,
  AdminPagination,
  BadgeUtils,
  FormatUtils,
// ... (truncated)
```

---

### UserManagementContent

**Path:** `src/components/admin/UserManagementContent.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUsers } from '@/hooks/useUsers'
import {
  useAdminFilters,
  useAdminPagination,
  AdminTable,
  AdminFilters,
  AdminPagination,
  BadgeUtils,
  FormatUtils,
// ... (truncated)
```

---

### ForgotPasswordForm

**Path:** `src/components/auth/ForgotPasswordForm.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { forgotPasswordFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { ForgotPasswordForm } from '@/lib/schemas/unified-form-schemas'

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false)

  const form = useUnifiedForm({
// ... (truncated)
```

---

### LoginForm

**Path:** `src/components/auth/LoginForm.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { loginFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { LoginForm } from '@/lib/schemas/unified-form-schemas'

export function LoginForm() {
  const { signIn } = useAuth()

  const form = useUnifiedForm({
    initialValues: {
// ... (truncated)
```

---

### ResetPasswordForm

**Path:** `src/components/auth/ResetPasswordForm.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { resetPasswordFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { ResetPasswordForm } from '@/lib/schemas/unified-form-schemas'

export function ResetPasswordForm() {
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
// ... (truncated)
```

---

### SignupForm

**Path:** `src/components/auth/SignupForm.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { signupFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { SignupForm } from '@/lib/schemas/unified-form-schemas'

export function SignupForm() {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
// ... (truncated)
```

---

### Assessment

**Path:** `src/components/training/Assessment.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import React, { useState, useEffect } from 'react'
import { AssessmentQuestion, AssessmentResult, AssessmentProps } from '@/types'
import { useCourseProgress, useQuestionEvents } from '@/hooks/useUnifiedProgress'
import { Clock, CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react'

export const Assessment: React.FC<AssessmentProps> = ({
  moduleId,
  assessment,
  onComplete
}) => {
  // Use unified hooks for progress tracking
  const { progress, updateProgress } = useCourseProgress(`/${moduleId}`)
  const { recordQuestion } = useQuestionEvents(`/${moduleId}`)
// ... (truncated)
```

---

### EnhancedModuleViewer

**Path:** `src/components/training/EnhancedModuleViewer.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Bookmark,
// ... (truncated)
```

---

### ModuleViewer

**Path:** `src/components/training/ModuleViewer.tsx`  
**Props:** No props found

```typescript
// Component implementation
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  Play,
  Pause,
  ArrowLeft,
// ... (truncated)
```

---

### Skeleton

**Path:** `src/components/ui/Skeleton.tsx`  
**Props:** className

```typescript
// Component implementation
"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-label="Loading..."
    />
  );
}

// ... (truncated)
```

---

### Unknown

**Path:** `src/components/ui/badge.tsx`  
**Props:** No props found

```typescript
// Component implementation
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
// ... (truncated)
```

---

### Unknown

**Path:** `src/components/ui/button.tsx`  
**Props:** No props found

```typescript
// Component implementation
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
// ... (truncated)
```

---

### Unknown

**Path:** `src/components/ui/card.tsx`  
**Props:** No props found

```typescript
// Component implementation
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
// ... (truncated)
```

---

### Unknown

**Path:** `src/components/ui/input.tsx`  
**Props:** No props found

```typescript
// Component implementation
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
// ... (truncated)
```

---

### Unknown

**Path:** `src/components/ui/progress.tsx`  
**Props:** No props found

```typescript
// Component implementation
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
// ... (truncated)
```

---

### FormField

**Path:** `src/components/ui/unified-form.tsx`  
**Props:** name, label, type, placeholder, required, options, value, label

```typescript
// Component implementation
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * Unified Form Field Component - Standardized form field across the application
 *
 * Provides consistent styling, validation, and accessibility for all form fields.
 */

export interface FormFieldProps {
  name: string;
// ... (truncated)
```

---

### AdminFilters

**Path:** `src/components/admin/shared/components/AdminFilters.tsx`  
**Props:** fields, filters, onFilterChange, key, value, onClearFilters, hasActiveFilters, filterCount, className

```typescript
// Component implementation
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export interface AdminFiltersProps {
  fields: FilterField[];
// ... (truncated)
```

---

### AdminPagination

**Path:** `src/components/admin/shared/components/AdminPagination.tsx`  
**Props:** pagination, page, limit, total, totalPages, offset

```typescript
// Component implementation
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormatUtils } from '../utils/format-utils';

export interface AdminPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    offset: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
// ... (truncated)
```

---

### AdminTable

**Path:** `src/components/admin/shared/components/AdminTable.tsx`  
**Props:** No props found

```typescript
// Component implementation
import React from 'react';
import { BadgeUtils } from '../utils/badge-utils';
import { FormatUtils } from '../utils/format-utils';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface AdminTableProps<T> {
  data: T[];
// ... (truncated)
```

---

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- Components are built using React and TypeScript
- All components are located in `src/components/`

---

_Generated by DocumentationGenerator_
