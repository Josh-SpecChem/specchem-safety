#!/usr/bin/env node

import { writeFileSync, readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';

/**
 * Automated Documentation Generator
 * Generates documentation from code annotations and structure
 */
export class DocumentationGenerator {
  private static readonly DOCS_DIR = 'docs';
  private static readonly API_DOCS_DIR = join(this.DOCS_DIR, 'api');
  private static readonly SCHEMA_DOCS_DIR = join(this.DOCS_DIR, 'schemas');
  private static readonly TYPE_DOCS_DIR = join(this.DOCS_DIR, 'types');
  private static readonly COMPONENT_DOCS_DIR = join(this.DOCS_DIR, 'components');

  /**
   * Generate all documentation
   */
  static generateAll(): void {
    console.log('🚀 Starting documentation generation...');
    
    this.ensureDirectories();
    this.generateApiDocs();
    this.generateSchemaDocs();
    this.generateTypeDocs();
    this.generateComponentDocs();
    this.generateMainIndex();
    
    console.log('✅ Documentation generation complete');
  }

  /**
   * Generate API documentation from route files
   */
  static generateApiDocs(): void {
    console.log('📡 Generating API documentation...');
    
    const apiRoutes = this.scanApiRoutes();
    const apiDocs = this.generateApiDocumentation(apiRoutes);
    
    writeFileSync(join(this.API_DOCS_DIR, 'README.md'), apiDocs);
    console.log(`✅ Generated API documentation for ${apiRoutes.length} routes`);
  }

  /**
   * Generate schema documentation from Zod schemas
   */
  static generateSchemaDocs(): void {
    console.log('📋 Generating schema documentation...');
    
    const schemas = this.scanSchemas();
    const schemaDocs = this.generateSchemaDocumentation(schemas);
    
    writeFileSync(join(this.SCHEMA_DOCS_DIR, 'README.md'), schemaDocs);
    console.log(`✅ Generated schema documentation for ${schemas.length} schemas`);
  }

  /**
   * Generate type documentation from TypeScript types
   */
  static generateTypeDocs(): void {
    console.log('🔧 Generating type documentation...');
    
    const types = this.scanTypes();
    const typeDocs = this.generateTypeDocumentation(types);
    
    writeFileSync(join(this.TYPE_DOCS_DIR, 'README.md'), typeDocs);
    console.log(`✅ Generated type documentation for ${types.length} types`);
  }

  /**
   * Generate component documentation from React components
   */
  static generateComponentDocs(): void {
    console.log('⚛️ Generating component documentation...');
    
    const components = this.scanComponents();
    const componentDocs = this.generateComponentDocumentation(components);
    
    writeFileSync(join(this.COMPONENT_DOCS_DIR, 'README.md'), componentDocs);
    console.log(`✅ Generated component documentation for ${components.length} components`);
  }

  /**
   * Generate main documentation index
   */
  static generateMainIndex(): void {
    console.log('📚 Generating main documentation index...');
    
    const indexContent = this.generateMainIndexContent();
    writeFileSync(join(this.DOCS_DIR, 'GENERATED-INDEX.md'), indexContent);
    console.log('✅ Generated main documentation index');
  }

  /**
   * Ensure documentation directories exist
   */
  private static ensureDirectories(): void {
    const dirs = [
      this.API_DOCS_DIR,
      this.SCHEMA_DOCS_DIR,
      this.TYPE_DOCS_DIR,
      this.COMPONENT_DOCS_DIR
    ];

    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Scan API routes directory
   */
  private static scanApiRoutes(): string[] {
    const apiDir = 'src/app/api';
    if (!existsSync(apiDir)) {
      return [];
    }

    return this.scanDirectoryRecursive(apiDir, '.ts');
  }

  /**
   * Scan schema files
   */
  private static scanSchemas(): string[] {
    const schemaFiles = [
      'src/lib/schemas.ts',
      'src/lib/validations.ts'
    ];

    return schemaFiles.filter(file => existsSync(file));
  }

  /**
   * Scan type files
   */
  private static scanTypes(): string[] {
    const typesDir = 'src/types';
    if (!existsSync(typesDir)) {
      return [];
    }

    return this.scanDirectoryRecursive(typesDir, '.ts');
  }

  /**
   * Scan component files
   */
  private static scanComponents(): string[] {
    const componentsDir = 'src/components';
    if (!existsSync(componentsDir)) {
      return [];
    }

    return this.scanDirectoryRecursive(componentsDir, '.tsx');
  }

  /**
   * Scan directory recursively for files with specific extension
   */
  private static scanDirectoryRecursive(dir: string, extension: string): string[] {
    const files: string[] = [];
    
    try {
      const items = readdirSync(dir, { recursive: true });
      
      for (const item of items) {
        if (typeof item === 'string' && item.endsWith(extension)) {
          files.push(join(dir, item));
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dir}:`, error);
    }

    return files;
  }

  /**
   * Generate API documentation content
   */
  private static generateApiDocumentation(routes: string[]): string {
    const header = `# API Documentation

**Generated:** ${new Date().toISOString()}  
**Purpose:** Auto-generated API documentation from route files  
**Status:** Current  

## Overview

This documentation is automatically generated from the API route files in \`src/app/api/\`.

## API Routes

`;

    const routeDocs = routes.map(route => {
      const routeInfo = this.extractRouteInfo(route);
      return this.formatRouteDocumentation(routeInfo);
    }).join('\n');

    const footer = `

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- API routes follow Next.js App Router conventions
- All routes are located in \`src/app/api/\`

---

*Generated by DocumentationGenerator*
`;

    return header + routeDocs + footer;
  }

  /**
   * Generate schema documentation content
   */
  private static generateSchemaDocumentation(schemas: string[]): string {
    const header = `# Schema Documentation

**Generated:** ${new Date().toISOString()}  
**Purpose:** Auto-generated schema documentation from Zod schemas  
**Status:** Current  

## Overview

This documentation is automatically generated from Zod schema files.

## Schemas

`;

    const schemaDocs = schemas.map(schema => {
      const schemaInfo = this.extractSchemaInfo(schema);
      return this.formatSchemaDocumentation(schemaInfo);
    }).join('\n');

    const footer = `

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- Schemas are defined using Zod validation library
- All schemas are located in \`src/lib/schemas.ts\`

---

*Generated by DocumentationGenerator*
`;

    return header + schemaDocs + footer;
  }

  /**
   * Generate type documentation content
   */
  private static generateTypeDocumentation(types: string[]): string {
    const header = `# Type Documentation

**Generated:** ${new Date().toISOString()}  
**Purpose:** Auto-generated type documentation from TypeScript types  
**Status:** Current  

## Overview

This documentation is automatically generated from TypeScript type files.

## Types

`;

    const typeDocs = types.map(type => {
      const typeInfo = this.extractTypeInfo(type);
      return this.formatTypeDocumentation(typeInfo);
    }).join('\n');

    const footer = `

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- Types are defined using TypeScript
- All types are located in \`src/types/\`

---

*Generated by DocumentationGenerator*
`;

    return header + typeDocs + footer;
  }

  /**
   * Generate component documentation content
   */
  private static generateComponentDocumentation(components: string[]): string {
    const header = `# Component Documentation

**Generated:** ${new Date().toISOString()}  
**Purpose:** Auto-generated component documentation from React components  
**Status:** Current  

## Overview

This documentation is automatically generated from React component files.

## Components

`;

    const componentDocs = components.map(component => {
      const componentInfo = this.extractComponentInfo(component);
      return this.formatComponentDocumentation(componentInfo);
    }).join('\n');

    const footer = `

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- Components are built using React and TypeScript
- All components are located in \`src/components/\`

---

*Generated by DocumentationGenerator*
`;

    return header + componentDocs + footer;
  }

  /**
   * Generate main index content
   */
  private static generateMainIndexContent(): string {
    return `# Generated Documentation Index

**Generated:** ${new Date().toISOString()}  
**Purpose:** Index of all auto-generated documentation  
**Status:** Current  

## Auto-Generated Documentation

### API Documentation
- **[API Routes](./api/README.md)** - Auto-generated API documentation

### Schema Documentation
- **[Schemas](./schemas/README.md)** - Auto-generated schema documentation

### Type Documentation
- **[Types](./types/README.md)** - Auto-generated type documentation

### Component Documentation
- **[Components](./components/README.md)** - Auto-generated component documentation

## Manual Documentation

### Core Documentation
- **[README.md](./README.md)** - Project overview and navigation
- **[SETUP.md](./SETUP.md)** - Development environment setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API.md](./API.md)** - Manual API reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview

### Business Documentation
- **[Business Documentation](./business/)** - Business requirements and guidelines

### Technical Documentation
- **[Technical Documentation](./technical/)** - Technical specifications and guides

## Maintenance

- **Last Generated:** ${new Date().toISOString()}
- **Generation Command:** \`npm run generate-docs\`
- **Validation Command:** \`npm run validate-docs\`

---

*This index is automatically generated and updated with each documentation generation run.*
`;
  }

  /**
   * Extract route information from file
   */
  private static extractRouteInfo(routePath: string): any {
    try {
      const content = readFileSync(routePath, 'utf8');
      const routeName = routePath.replace('src/app/api/', '').replace('.ts', '');
      
      return {
        path: routePath,
        name: routeName,
        content: content,
        methods: this.extractHttpMethods(content),
        description: this.extractDescription(content)
      };
    } catch (error) {
      return {
        path: routePath,
        name: routePath.replace('src/app/api/', '').replace('.ts', ''),
        content: '',
        methods: [],
        description: 'No description available'
      };
    }
  }

  /**
   * Extract schema information from file
   */
  private static extractSchemaInfo(schemaPath: string): any {
    try {
      const content = readFileSync(schemaPath, 'utf8');
      const schemas = this.extractSchemaNames(content);
      
      return {
        path: schemaPath,
        schemas: schemas,
        content: content
      };
    } catch (error) {
      return {
        path: schemaPath,
        schemas: [],
        content: ''
      };
    }
  }

  /**
   * Extract type information from file
   */
  private static extractTypeInfo(typePath: string): any {
    try {
      const content = readFileSync(typePath, 'utf8');
      const types = this.extractTypeNames(content);
      
      return {
        path: typePath,
        types: types,
        content: content
      };
    } catch (error) {
      return {
        path: typePath,
        types: [],
        content: ''
      };
    }
  }

  /**
   * Extract component information from file
   */
  private static extractComponentInfo(componentPath: string): any {
    try {
      const content = readFileSync(componentPath, 'utf8');
      const componentName = this.extractComponentName(content);
      const props = this.extractComponentProps(content);
      
      return {
        path: componentPath,
        name: componentName,
        props: props,
        content: content
      };
    } catch (error) {
      return {
        path: componentPath,
        name: 'Unknown',
        props: [],
        content: ''
      };
    }
  }

  /**
   * Format route documentation
   */
  private static formatRouteDocumentation(routeInfo: any): string {
    return `### ${routeInfo.name}

**Path:** \`${routeInfo.path}\`  
**Methods:** ${routeInfo.methods.join(', ') || 'Not specified'}  
**Description:** ${routeInfo.description}

\`\`\`typescript
// Route implementation
${routeInfo.content.split('\n').slice(0, 10).join('\n')}
${routeInfo.content.split('\n').length > 10 ? '// ... (truncated)' : ''}
\`\`\`

---
`;
  }

  /**
   * Format schema documentation
   */
  private static formatSchemaDocumentation(schemaInfo: any): string {
    return `### ${schemaInfo.path}

**Schemas:** ${schemaInfo.schemas.join(', ') || 'No schemas found'}

\`\`\`typescript
// Schema definitions
${schemaInfo.content.split('\n').slice(0, 15).join('\n')}
${schemaInfo.content.split('\n').length > 15 ? '// ... (truncated)' : ''}
\`\`\`

---
`;
  }

  /**
   * Format type documentation
   */
  private static formatTypeDocumentation(typeInfo: any): string {
    return `### ${typeInfo.path}

**Types:** ${typeInfo.types.join(', ') || 'No types found'}

\`\`\`typescript
// Type definitions
${typeInfo.content.split('\n').slice(0, 15).join('\n')}
${typeInfo.content.split('\n').length > 15 ? '// ... (truncated)' : ''}
\`\`\`

---
`;
  }

  /**
   * Format component documentation
   */
  private static formatComponentDocumentation(componentInfo: any): string {
    return `### ${componentInfo.name}

**Path:** \`${componentInfo.path}\`  
**Props:** ${componentInfo.props.join(', ') || 'No props found'}

\`\`\`typescript
// Component implementation
${componentInfo.content.split('\n').slice(0, 15).join('\n')}
${componentInfo.content.split('\n').length > 15 ? '// ... (truncated)' : ''}
\`\`\`

---
`;
  }

  /**
   * Extract HTTP methods from route content
   */
  private static extractHttpMethods(content: string): string[] {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const foundMethods: string[] = [];
    
    methods.forEach(method => {
      if (content.includes(`export async function ${method.toLowerCase()}`) || 
          content.includes(`export const ${method.toLowerCase()}`)) {
        foundMethods.push(method);
      }
    });
    
    return foundMethods;
  }

  /**
   * Extract description from content
   */
  private static extractDescription(content: string): string {
    const commentMatch = content.match(/\/\*\*(.*?)\*\//s);
    if (commentMatch) {
      return commentMatch[1].trim().replace(/\*/g, '');
    }
    
    const singleLineMatch = content.match(/\/\/\s*(.+)/);
    if (singleLineMatch) {
      return singleLineMatch[1];
    }
    
    return 'No description available';
  }

  /**
   * Extract schema names from content
   */
  private static extractSchemaNames(content: string): string[] {
    const schemaMatches = content.match(/export\s+const\s+(\w+)\s*=/g);
    if (schemaMatches) {
      return schemaMatches.map(match => {
        const nameMatch = match.match(/export\s+const\s+(\w+)\s*=/);
        return nameMatch ? nameMatch[1] : '';
      }).filter(name => name);
    }
    return [];
  }

  /**
   * Extract type names from content
   */
  private static extractTypeNames(content: string): string[] {
    const typeMatches = content.match(/export\s+(?:interface|type|enum)\s+(\w+)/g);
    if (typeMatches) {
      return typeMatches.map(match => {
        const nameMatch = match.match(/export\s+(?:interface|type|enum)\s+(\w+)/);
        return nameMatch ? nameMatch[1] : '';
      }).filter(name => name);
    }
    return [];
  }

  /**
   * Extract component name from content
   */
  private static extractComponentName(content: string): string {
    const componentMatch = content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    if (componentMatch) {
      return componentMatch[1];
    }
    return 'Unknown';
  }

  /**
   * Extract component props from content
   */
  private static extractComponentProps(content: string): string[] {
    const propsMatch = content.match(/interface\s+(\w+Props)\s*\{([^}]+)\}/);
    if (propsMatch) {
      const propsContent = propsMatch[2];
      const propMatches = propsContent.match(/(\w+)(?:\?)?\s*:/g);
      if (propMatches) {
        return propMatches.map(match => match.replace(/[:\s?]/g, ''));
      }
    }
    return [];
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  DocumentationGenerator.generateAll();
}
