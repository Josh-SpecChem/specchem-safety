import { renderHook, act } from '@testing-library/react';
import { useAdminFilters } from '../hooks/useAdminFilters';
import { useAdminPagination } from '../hooks/useAdminPagination';
import { useAdminForm } from '../hooks/useAdminForm';
import { BadgeUtils } from '../utils/badge-utils';
import { FormatUtils } from '../utils/format-utils';
import { ValidationUtils } from '../utils/validation-utils';
import { z } from 'zod';

describe('useAdminFilters', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAdminFilters());
    
    expect(result.current.filters).toEqual({
      search: '',
      limit: 50,
      offset: 0
    });
  });

  it('should initialize with custom values', () => {
    const initialFilters = { search: 'test', role: 'admin' };
    const { result } = renderHook(() => useAdminFilters(initialFilters));
    
    expect(result.current.filters).toEqual({
      search: 'test',
      role: 'admin',
      limit: 50,
      offset: 0
    });
  });

  it('should update filters correctly', () => {
    const { result } = renderHook(() => useAdminFilters());
    
    act(() => {
      result.current.updateFilter('search', 'new search');
    });
    
    expect(result.current.filters.search).toBe('new search');
    expect(result.current.filters.offset).toBe(0); // Should reset pagination
  });

  it('should clear filters correctly', () => {
    const initialFilters = { search: 'test', role: 'admin' };
    const { result } = renderHook(() => useAdminFilters(initialFilters));
    
    act(() => {
      result.current.updateFilter('search', 'updated');
    });
    
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.filters).toEqual({
      search: '',
      role: 'admin',
      limit: 50,
      offset: 0
    });
  });

  it('should detect active filters', () => {
    const { result } = renderHook(() => useAdminFilters());
    
    expect(result.current.hasActiveFilters).toBe(false);
    
    act(() => {
      result.current.updateFilter('search', 'test');
    });
    
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filterCount).toBe(1);
  });

  it('should build query params correctly', () => {
    const { result } = renderHook(() => useAdminFilters());
    
    act(() => {
      result.current.updateFilter('search', 'test');
      result.current.updateFilter('role', 'admin');
    });
    
    const params = result.current.buildQueryParams();
    expect(params).toEqual({
      search: 'test',
      role: 'admin',
      limit: '50',
      offset: '0'
    });
  });
});

describe('useAdminPagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAdminPagination());
    
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0,
      offset: 0
    });
  });

  it('should initialize with custom values', () => {
    const options = { initialPage: 2, initialLimit: 25 };
    const { result } = renderHook(() => useAdminPagination(options));
    
    expect(result.current.pagination).toEqual({
      page: 2,
      limit: 25,
      total: 0,
      totalPages: 0,
      offset: 25
    });
  });

  it('should update page correctly', () => {
    const { result } = renderHook(() => useAdminPagination());
    
    act(() => {
      result.current.updateTotal(100);
    });
    
    act(() => {
      result.current.setPage(3);
    });
    
    expect(result.current.pagination.page).toBe(3);
    expect(result.current.pagination.offset).toBe(100);
  });

  it('should update limit correctly', () => {
    const { result } = renderHook(() => useAdminPagination());
    
    act(() => {
      result.current.setLimit(25);
    });
    
    expect(result.current.pagination.limit).toBe(25);
    expect(result.current.pagination.page).toBe(1); // Should reset to first page
    expect(result.current.pagination.offset).toBe(0);
  });

  it('should navigate pages correctly', () => {
    const { result } = renderHook(() => useAdminPagination());
    
    act(() => {
      result.current.updateTotal(100);
    });
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.pagination.page).toBe(2);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('should generate page numbers correctly', () => {
    const { result } = renderHook(() => useAdminPagination());
    
    act(() => {
      result.current.updateTotal(100);
      result.current.setPage(5);
    });
    
    expect(result.current.pageNumbers).toEqual([3, 4, 5, 6, 7]);
  });
});

describe('useAdminForm', () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email')
  });

  const initialData = { name: '', email: '' };
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAdminForm({
      initialData,
      validationSchema: schema,
      onSubmit
    }));
    
    expect(result.current.formState.data).toEqual(initialData);
    expect(result.current.formState.isDirty).toBe(false);
    expect(result.current.formState.isValid).toBe(false);
    expect(result.current.formState.isSubmitting).toBe(false);
  });

  it('should update field values', () => {
    const { result } = renderHook(() => useAdminForm({
      initialData,
      validationSchema: schema,
      onSubmit
    }));
    
    act(() => {
      result.current.updateField('name', 'John Doe');
    });
    
    expect(result.current.formState.data.name).toBe('John Doe');
    expect(result.current.formState.isDirty).toBe(true);
  });

  it('should validate fields correctly', () => {
    const { result } = renderHook(() => useAdminForm({
      initialData,
      validationSchema: schema,
      onSubmit
    }));
    
    act(() => {
      result.current.updateField('email', 'invalid-email');
    });
    
    act(() => {
      result.current.validateField('email');
    });
    
    expect(result.current.formState.errors.email).toBe('Invalid email');
  });

  it('should validate form correctly', () => {
    const { result } = renderHook(() => useAdminForm({
      initialData,
      validationSchema: schema,
      onSubmit
    }));
    
    act(() => {
      result.current.updateField('name', 'John Doe');
      result.current.updateField('email', 'john@example.com');
    });
    
    const isValid = result.current.validateForm();
    
    expect(isValid).toBe(true);
    expect(result.current.formState.isValid).toBe(true);
    expect(result.current.formState.errors).toEqual({});
  });

  it('should submit form correctly', async () => {
    onSubmit.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAdminForm({
      initialData,
      validationSchema: schema,
      onSubmit
    }));
    
    act(() => {
      result.current.updateField('name', 'John Doe');
      result.current.updateField('email', 'john@example.com');
    });
    
    let submitResult: boolean;
    await act(async () => {
      submitResult = await result.current.submitForm();
    });
    
    expect(submitResult).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
    expect(result.current.formState.isSubmitting).toBe(false);
    expect(result.current.formState.isDirty).toBe(false);
  });
});

describe('BadgeUtils', () => {
  describe('getRoleBadgeConfig', () => {
    it('should return correct config for known roles', () => {
      const adminConfig = BadgeUtils.getRoleBadgeConfig('admin');
      expect(adminConfig.text).toBe('Admin');
      expect(adminConfig.color).toBe('red');
      expect(adminConfig.className).toBe('bg-red-100 text-red-800');

      const employeeConfig = BadgeUtils.getRoleBadgeConfig('employee');
      expect(employeeConfig.text).toBe('Employee');
      expect(employeeConfig.color).toBe('gray');
    });

    it('should return default config for unknown roles', () => {
      const config = BadgeUtils.getRoleBadgeConfig('unknown_role');
      expect(config.text).toBe('UNKNOWN ROLE');
      expect(config.variant).toBe('outline');
      expect(config.color).toBe('gray');
    });
  });

  describe('getStatusBadgeConfig', () => {
    it('should return correct config for known statuses', () => {
      const activeConfig = BadgeUtils.getStatusBadgeConfig('active');
      expect(activeConfig.text).toBe('Active');
      expect(activeConfig.color).toBe('green');

      const completedConfig = BadgeUtils.getStatusBadgeConfig('completed');
      expect(completedConfig.text).toBe('Completed');
      expect(completedConfig.color).toBe('green');
    });

    it('should return default config for unknown statuses', () => {
      const config = BadgeUtils.getStatusBadgeConfig('unknown_status');
      expect(config.text).toBe('UNKNOWN STATUS');
      expect(config.variant).toBe('outline');
    });
  });

  describe('getDifficultyBadgeConfig', () => {
    it('should return correct config for known difficulties', () => {
      const beginnerConfig = BadgeUtils.getDifficultyBadgeConfig('beginner');
      expect(beginnerConfig.text).toBe('Beginner');
      expect(beginnerConfig.color).toBe('green');

      const advancedConfig = BadgeUtils.getDifficultyBadgeConfig('advanced');
      expect(advancedConfig.text).toBe('Advanced');
      expect(advancedConfig.color).toBe('red');
    });
  });
});

describe('FormatUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25');
      const formatted = FormatUtils.formatDate(date);
      expect(formatted).toBe('Dec 25, 2023');
    });

    it('should format date string correctly', () => {
      const formatted = FormatUtils.formatDate('2023-12-25');
      expect(formatted).toBe('Dec 25, 2023');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-12-25T14:30:00');
      const formatted = FormatUtils.formatDateTime(date);
      expect(formatted).toContain('Dec 25, 2023');
      expect(formatted).toContain('2:30');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent times correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const formatted = FormatUtils.formatRelativeTime(oneMinuteAgo);
      expect(formatted).toBe('1 minute ago');
    });

    it('should format hours correctly', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const formatted = FormatUtils.formatRelativeTime(twoHoursAgo);
      expect(formatted).toBe('2 hours ago');
    });
  });

  describe('formatProgress', () => {
    it('should format progress as percentage', () => {
      expect(FormatUtils.formatProgress(75.6)).toBe('76%');
      expect(FormatUtils.formatProgress(0)).toBe('0%');
      expect(FormatUtils.formatProgress(100)).toBe('100%');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(FormatUtils.formatDuration(30)).toBe('30m');
      expect(FormatUtils.formatDuration(90)).toBe('1h 30m');
      expect(FormatUtils.formatDuration(120)).toBe('2h');
    });
  });

  describe('formatName', () => {
    it('should format full name correctly', () => {
      expect(FormatUtils.formatName('John', 'Doe')).toBe('John Doe');
    });
  });

  describe('formatInitials', () => {
    it('should format initials correctly', () => {
      expect(FormatUtils.formatInitials('John', 'Doe')).toBe('JD');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const truncated = FormatUtils.truncateText(longText, 20);
      expect(truncated).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const truncated = FormatUtils.truncateText(shortText, 20);
      expect(truncated).toBe('Short text');
    });
  });
});

describe('ValidationUtils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const result = ValidationUtils.validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid email addresses', () => {
      const result = ValidationUtils.validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = ValidationUtils.validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
    });

    it('should reject weak passwords', () => {
      const result = ValidationUtils.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 8 characters');
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty values', () => {
      const result = ValidationUtils.validateRequired('test');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty values', () => {
      const result = ValidationUtils.validateRequired('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('This field is required');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize input correctly', () => {
      const input = '  <script>alert("xss")</script>  ';
      const sanitized = ValidationUtils.sanitizeInput(input);
      expect(sanitized).toBe('alert("xss")');
    });
  });
});
