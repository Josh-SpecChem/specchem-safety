/**
 * Centralized utility types for SpecChem Safety Training system
 * Replaces generic types with specific, type-safe alternatives
 */

import type { ErrorResponse } from './api';

// ========================================
// TYPE UTILITIES
// ========================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;
export type NonEmptyArray<T> = [T, ...T[]];

// ========================================
// SPECIFIC META TYPES (replacing Record<string, any>)
// ========================================

export interface QuestionResponseMeta {
  timeSpent?: number;
  hintsUsed?: number;
  attempts?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browserInfo?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ActivityEventMeta {
  sectionId?: string;
  timeSpent?: number;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browserInfo?: string;
  previousSection?: string;
  completionMethod?: 'manual' | 'automatic';
  [key: string]: string | number | boolean | undefined;
}

export interface ProgressUpdateMeta {
  previousSection?: string;
  timeSpent?: number;
  completionMethod?: 'manual' | 'automatic';
  assessmentScore?: number;
  certificateEarned?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface UserSessionMeta {
  loginTime?: string;
  lastActivity?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browserInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CourseAnalyticsMeta {
  totalTimeSpent?: number;
  averageScore?: number;
  completionRate?: number;
  dropoutRate?: number;
  retakeRate?: number;
  [key: string]: string | number | boolean | undefined;
}

// ========================================
// API META TYPES
// ========================================

export interface ApiRequestMeta {
  requestId?: string;
  timestamp?: string;
  userId?: string;
  plantId?: string;
  userAgent?: string;
  ipAddress?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponseMeta {
  responseTime?: number;
  cacheHit?: boolean;
  version?: string;
  requestId?: string;
  [key: string]: string | number | boolean | undefined;
}

// ========================================
// FORM META TYPES
// ========================================

export interface FormSubmissionMeta {
  submissionTime?: string;
  formVersion?: string;
  userAgent?: string;
  validationErrors?: number;
  [key: string]: string | number | boolean | undefined;
}

// ========================================
// ERROR META TYPES
// ========================================

export interface ErrorMeta {
  errorCode?: string;
  stackTrace?: string;
  userId?: string;
  plantId?: string;
  timestamp?: string;
  userAgent?: string;
  [key: string]: string | number | boolean | undefined;
}

// ========================================
// TYPE GUARDS
// ========================================

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// ========================================
// VALIDATION HELPERS
// ========================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isValidProgressPercent(percent: number): boolean {
  return Number.isInteger(percent) && percent >= 0 && percent <= 100;
}

// ========================================
// COMMON TYPE PATTERNS
// ========================================

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ========================================
// GENERIC RESPONSE TYPES
// ========================================

export interface BaseResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

export interface SuccessResponse<T = unknown> extends BaseResponse {
  success: true;
  data: T;
}

export type ApiResult<T = unknown> = SuccessResponse<T> | ErrorResponse;

// ========================================
// PAGINATION UTILITIES
// ========================================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function calculatePagination(page: number, limit: number, total: number): PaginationInfo {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// ========================================
// DATE UTILITIES
// ========================================

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0] || '';
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

export function isDateInRange(date: string | Date, start: string | Date, end: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return d >= s && d <= e;
}
