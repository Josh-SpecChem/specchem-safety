import { z } from 'zod';

/**
 * Form Migration Utilities
 * 
 * Tools to help migrate existing forms to the unified form system.
 */

// ========================================
// MIGRATION ANALYSIS TOOLS
// ========================================

export interface FormAnalysisResult {
  componentName: string;
  formFields: FormFieldAnalysis[];
  validationPattern: 'manual' | 'zod' | 'mixed' | 'none';
  stateManagement: 'useState' | 'useAdminForm' | 'custom' | 'none';
  errorHandling: 'manual' | 'unified' | 'mixed' | 'none';
  complexity: 'low' | 'medium' | 'high';
  migrationDifficulty: 'easy' | 'medium' | 'hard';
  recommendations: string[];
}

export interface FormFieldAnalysis {
  name: string;
  type: string;
  required: boolean;
  validation: string[];
  defaultValue: unknown;
}

export function analyzeFormComponent(componentCode: string, componentName: string): FormAnalysisResult {
  const fields: FormFieldAnalysis[] = [];
  let validationPattern: 'manual' | 'zod' | 'mixed' | 'none' = 'none';
  let stateManagement: 'useState' | 'useAdminForm' | 'custom' | 'none' = 'none';
  let errorHandling: 'manual' | 'unified' | 'mixed' | 'none' = 'none';
  const recommendations: string[] = [];

  // Analyze state management
  if (componentCode.includes('useAdminForm')) {
    stateManagement = 'useAdminForm';
  } else if (componentCode.includes('useState')) {
    stateManagement = 'useState';
  } else if (componentCode.includes('useForm') || componentCode.includes('useCustomForm')) {
    stateManagement = 'custom';
  }

  // Analyze validation
  if (componentCode.includes('z.object') || componentCode.includes('z.string')) {
    validationPattern = 'zod';
  } else if (componentCode.includes('validate') || componentCode.includes('if (!')) {
    validationPattern = 'manual';
  }

  // Analyze error handling
  if (componentCode.includes('setError') && componentCode.includes('error &&')) {
    errorHandling = 'manual';
  }

  // Extract form fields
  const fieldMatches = componentCode.matchAll(/name=["'](\w+)["']/g);
  for (const match of fieldMatches) {
    const fieldName = match[1];
    if (!fieldName) continue;
    
    const fieldType = extractFieldType(componentCode, fieldName);
    const isRequired = componentCode.includes(`name="${fieldName}"`) && componentCode.includes('required');
    
    fields.push({
      name: fieldName,
      type: fieldType,
      required: isRequired,
      validation: extractValidationRules(componentCode, fieldName),
      defaultValue: extractDefaultValue(componentCode, fieldName)
    });
  }

  // Calculate complexity
  const complexity = calculateComplexity(fields, validationPattern, stateManagement);
  
  // Generate recommendations
  if (stateManagement === 'useState') {
    recommendations.push('Migrate to useUnifiedForm hook');
  }
  if (validationPattern === 'manual') {
    recommendations.push('Replace manual validation with Zod schemas');
  }
  if (errorHandling === 'manual') {
    recommendations.push('Use unified error handling components');
  }
  if (fields.length > 5) {
    recommendations.push('Consider breaking into smaller forms');
  }

  return {
    componentName,
    formFields: fields,
    validationPattern,
    stateManagement,
    errorHandling,
    complexity,
    migrationDifficulty: calculateMigrationDifficulty(complexity, validationPattern, stateManagement),
    recommendations
  };
}

function extractFieldType(code: string, fieldName: string): string {
  const typeMatch = code.match(new RegExp(`name=["']${fieldName}["'][^>]*type=["'](\\w+)["']`));
  return typeMatch?.[1] ?? 'text';
}

function extractValidationRules(code: string, fieldName: string): string[] {
  const rules: string[] = [];
  
  if (code.includes(`${fieldName}.length`)) {
    rules.push('length validation');
  }
  if (code.includes(`${fieldName}@`)) {
    rules.push('email validation');
  }
  if (code.includes(`${fieldName} ===`)) {
    rules.push('equality validation');
  }
  
  return rules;
}

function extractDefaultValue(code: string, fieldName: string): unknown {
  const defaultValueMatch = code.match(new RegExp(`${fieldName}:\\s*['"]([^'"]*)['"]`));
  return defaultValueMatch ? defaultValueMatch[1] : '';
}

function calculateComplexity(
  fields: FormFieldAnalysis[],
  validationPattern: string,
  stateManagement: string
): 'low' | 'medium' | 'high' {
  let score = 0;
  
  score += fields.length;
  score += validationPattern === 'manual' ? 2 : 0;
  score += stateManagement === 'useState' ? 1 : 0;
  
  if (score <= 3) return 'low';
  if (score <= 6) return 'medium';
  return 'high';
}

function calculateMigrationDifficulty(
  complexity: 'low' | 'medium' | 'high',
  validationPattern: string,
  stateManagement: string
): 'easy' | 'medium' | 'hard' {
  if (complexity === 'low' && validationPattern === 'zod' && stateManagement === 'useAdminForm') {
    return 'easy';
  }
  if (complexity === 'high' || (validationPattern === 'manual' && stateManagement === 'useState')) {
    return 'hard';
  }
  return 'medium';
}

// ========================================
// CODE GENERATION TOOLS
// ========================================

export function generateUnifiedFormCode(analysis: FormAnalysisResult): string {
  const { componentName, formFields } = analysis;
  
  const schemaName = `${componentName}Schema`;
  const formTypeName = `${componentName}Form`;
  
  // Generate Zod schema
  const schemaCode = generateZodSchema(formFields, schemaName);
  
  // Generate form component
  const componentCode = generateFormComponent(componentName, formFields, schemaName, formTypeName);
  
  return `${schemaCode}\n\n${componentCode}`;
}

function generateZodSchema(fields: FormFieldAnalysis[], schemaName: string): string {
  const schemaFields = fields.map(field => {
    let zodField = `z.string()`;
    
    if (field.type === 'email') {
      zodField = `z.string().email('Please enter a valid email address')`;
    } else if (field.type === 'password') {
      zodField = `z.string().min(8, 'Password must be at least 8 characters')`;
    }
    
    if (field.required) {
      zodField += `.min(1, '${field.name} is required')`;
    } else {
      zodField += '.optional()';
    }
    
    return `  ${field.name}: ${zodField}`;
  }).join(',\n');
  
  return `export const ${schemaName} = z.object({\n${schemaFields}\n});`;
}

function generateFormComponent(
  componentName: string,
  fields: FormFieldAnalysis[],
  schemaName: string,
  formTypeName: string
): string {
  const fieldComponents = fields.map(field => {
    return `      <FormField
        name="${field.name}"
        label="${field.name.charAt(0).toUpperCase() + field.name.slice(1)}"
        type="${field.type}"
        value={form.values.${field.name}}
        error={form.errors.${field.name}}
        onChange={(value) => form.updateField('${field.name}', value)}
        onBlur={() => form.validateField('${field.name}')}
        ${field.required ? 'required' : ''}
      />`;
  }).join('\n');
  
  return `export function ${componentName}() {
  const form = useUnifiedForm({
    initialValues: {
${fields.map(field => `      ${field.name}: '${field.defaultValue}'`).join(',\n')}
    },
    validationSchema: ${schemaName},
    onSubmit: async (values) => {
      // TODO: Implement form submission
      console.log('Form submitted:', values);
    }
  });
  
  return (
    <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
${fieldComponents}
      
      {form.errors.submit && (
        <FormError error={form.errors.submit} />
      )}
      
      <FormSubmitButton
        isSubmitting={form.isSubmitting}
        disabled={!form.isDirty}
      >
        Submit
      </FormSubmitButton>
    </FormContainer>
  );
}`;
}

// ========================================
// MIGRATION VALIDATION TOOLS
// ========================================

export interface MigrationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function validateMigration(
  originalCode: string,
  migratedCode: string,
  analysis: FormAnalysisResult
): MigrationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check if all fields are preserved
  const originalFields = extractFieldNames(originalCode);
  const migratedFields = extractFieldNames(migratedCode);
  
  const missingFields = originalFields.filter(field => !migratedFields.includes(field));
  if (missingFields.length > 0) {
    errors.push(`Missing fields: ${missingFields.join(', ')}`);
  }
  
  // Check if validation is properly migrated
  if (analysis.validationPattern === 'manual' && !migratedCode.includes('validationSchema')) {
    warnings.push('Manual validation not migrated to Zod schema');
  }
  
  // Check if error handling is unified
  if (analysis.errorHandling === 'manual' && !migratedCode.includes('FormError')) {
    warnings.push('Manual error handling not migrated to unified components');
  }
  
  // Check if form submission is handled
  if (!migratedCode.includes('onSubmit')) {
    errors.push('Form submission not properly implemented');
  }
  
  // Generate suggestions
  if (analysis.complexity === 'high') {
    suggestions.push('Consider breaking this form into smaller components');
  }
  if (analysis.formFields.length > 8) {
    suggestions.push('Consider using a multi-step form for better UX');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

function extractFieldNames(code: string): string[] {
  const matches = code.matchAll(/name=["'](\w+)["']/g);
  return Array.from(matches).map(match => match[1]).filter((name): name is string => name !== undefined);
}

// ========================================
// TESTING UTILITIES
// ========================================

export function generateFormTests(componentName: string, fields: FormFieldAnalysis[]): string {
  const testCases = fields.map(field => {
    return `  it('should validate ${field.name} field', () => {
    const { result } = renderHook(() => useUnifiedForm({
      initialValues: { ${field.name}: '' },
      validationSchema: ${componentName}Schema,
      onSubmit: jest.fn()
    }));
    
    act(() => {
      result.current.validateField('${field.name}');
    });
    
    expect(result.current.errors.${field.name}).toBeDefined();
  });`;
  }).join('\n\n');
  
  return `import { renderHook, act } from '@testing-library/react';
import { useUnifiedForm } from '@/hooks/useUnifiedForm';
import { ${componentName}Schema } from './${componentName.toLowerCase()}.test';

describe('${componentName}', () => {
${testCases}
  
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useUnifiedForm({
      initialValues: {
${fields.map(field => `        ${field.name}: 'test${field.name}'`).join(',\n')}
      },
      validationSchema: ${componentName}Schema,
      onSubmit
    }));
    
    const success = await act(async () => {
      return await result.current.submitForm();
    });
    
    expect(success).toBe(true);
    expect(onSubmit).toHaveBeenCalled();
  });
});`;
}

// ========================================
// BATCH MIGRATION TOOLS
// ========================================

export interface BatchMigrationResult {
  totalComponents: number;
  successfulMigrations: number;
  failedMigrations: number;
  results: Array<{
    componentName: string;
    success: boolean;
    errors?: string[];
    warnings?: string[];
  }>;
}

export function batchMigrateComponents(components: Array<{ name: string; code: string }>): BatchMigrationResult {
  const results: Array<{
    componentName: string;
    success: boolean;
    errors?: string[];
    warnings?: string[];
  }> = [];
  
  let successfulMigrations = 0;
  let failedMigrations = 0;
  
  for (const component of components) {
    try {
      const analysis = analyzeFormComponent(component.code, component.name);
      const migratedCode = generateUnifiedFormCode(analysis);
      const validation = validateMigration(component.code, migratedCode, analysis);
      
      if (validation.isValid) {
        successfulMigrations++;
        results.push({
          componentName: component.name,
          success: true,
          warnings: validation.warnings
        });
      } else {
        failedMigrations++;
        results.push({
          componentName: component.name,
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        });
      }
    } catch (error) {
      failedMigrations++;
      results.push({
        componentName: component.name,
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }
  
  return {
    totalComponents: components.length,
    successfulMigrations,
    failedMigrations,
    results
  };
}
