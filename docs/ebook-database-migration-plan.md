# Ebook Content Database Migration Plan

## Executive Summary

This document outlines the comprehensive plan to migrate the hard-coded ebook content from `src/app/ebook/page.tsx` and `src/app/ebook-spanish/page.tsx` into a database-driven system using Supabase. The migration will transform static content into a dynamic, manageable, and multilingual learning management system.

## Current State Analysis

### Hard-coded Content Structure

- **English Version**: 11 sections with embedded JSX content, 8 quiz questions
- **Spanish Version**: 9 sections with embedded JSX content, 5 quiz questions
- **Content Types**: Text blocks, images, cards, tables, lists, callouts
- **Interactive Elements**: Quiz components with true/false and multiple-choice questions
- **State Management**: Section completion tracking, quiz answers, progress calculation

### Limitations of Current Approach

- Content updates require code changes and deployments
- No content versioning or audit trail
- Limited analytics and user interaction tracking
- Difficult to maintain consistency across languages
- No ability for non-technical users to update content

## Database Schema Changes

### New Tables Required

#### 1. Course Content Tables

```sql
-- Course Sections
CREATE TABLE course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL, -- 'introduction', 'un-packaging-basics', etc.
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  icon_name TEXT, -- 'BookOpen', 'Package', 'Shield', etc.
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, section_key),
  UNIQUE(course_id, order_index)
);

-- Content Blocks (for structured content within sections)
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN (
    'hero', 'text', 'card', 'image', 'table', 'list', 'grid',
    'callout', 'quote', 'divider', 'video', 'audio'
  )),
  order_index INTEGER NOT NULL,
  content JSONB NOT NULL, -- Block-specific content data
  metadata JSONB, -- Styling, classes, additional config
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section_id, order_index)
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL, -- 'quiz-1', 'quiz-2', etc.
  question_type TEXT NOT NULL CHECK (question_type IN ('true-false', 'multiple-choice')),
  question_text TEXT NOT NULL,
  options JSONB, -- Array of options for multiple choice
  correct_answer JSONB NOT NULL, -- String or array of strings
  explanation TEXT NOT NULL,
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section_id, question_key)
);

-- Multilingual Content Support
CREATE TABLE content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('section', 'content_block', 'quiz_question')),
  content_id UUID NOT NULL, -- References section, content_block, or quiz_question
  language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de')), -- Extensible
  translated_content JSONB NOT NULL, -- Language-specific content
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(content_type, content_id, language_code)
);

-- Course Languages (to track which languages are available for each course)
CREATE TABLE course_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false, -- One primary language per course
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, language_code)
);
```

#### 2. Enhanced Progress Tracking

```sql
-- Section Progress (granular tracking)
CREATE TABLE section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id),
  is_completed BOOLEAN DEFAULT false,
  time_spent_seconds INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- Content Block Interactions (detailed analytics)
CREATE TABLE content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN (
    'view', 'click', 'expand', 'collapse', 'download', 'share'
  )),
  interaction_data JSONB, -- Additional interaction metadata
  occurred_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_course_sections_course_order ON course_sections(course_id, order_index);
CREATE INDEX idx_content_blocks_section_order ON content_blocks(section_id, order_index);
CREATE INDEX idx_quiz_questions_section ON quiz_questions(section_id);
CREATE INDEX idx_content_translations_lookup ON content_translations(content_type, content_id, language_code);
CREATE INDEX idx_section_progress_user_course ON section_progress(user_id, section_id);
CREATE INDEX idx_content_interactions_user_time ON content_interactions(user_id, occurred_at);
```

### Modifications to Existing Tables

#### Update Courses Table

```sql
-- Add language support to courses
ALTER TABLE courses ADD COLUMN default_language TEXT DEFAULT 'en';
ALTER TABLE courses ADD COLUMN available_languages TEXT[] DEFAULT ARRAY['en'];
ALTER TABLE courses ADD COLUMN content_version TEXT DEFAULT '1.0';
```

#### Enhance Progress Table

```sql
-- Add language tracking to progress
ALTER TABLE progress ADD COLUMN language_code TEXT DEFAULT 'en';
ALTER TABLE progress ADD COLUMN sections_completed INTEGER DEFAULT 0;
ALTER TABLE progress ADD COLUMN total_sections INTEGER DEFAULT 0;
```

## Zod Contract Extensions

### New Schema Definitions

```typescript
// Course Section Schema
export const CourseSectionSchema = z.object({
  id: UuidSchema,
  courseId: UuidSchema,
  sectionKey: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  orderIndex: z.number().int().min(0),
  iconName: z.string().max(50).nullable(),
  isPublished: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Content Block Schema
export const ContentBlockSchema = z.object({
  id: UuidSchema,
  sectionId: UuidSchema,
  blockType: z.enum([
    "hero",
    "text",
    "card",
    "image",
    "table",
    "list",
    "grid",
    "callout",
    "quote",
    "divider",
    "video",
    "audio",
  ]),
  orderIndex: z.number().int().min(0),
  content: z.record(z.any()),
  metadata: z.record(z.any()).nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Quiz Question Schema
export const QuizQuestionSchema = z.object({
  id: UuidSchema,
  sectionId: UuidSchema,
  questionKey: z.string().min(1).max(100),
  questionType: z.enum(["true-false", "multiple-choice"]),
  questionText: z.string().min(1),
  options: z.array(z.string()).nullable(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(1),
  orderIndex: z.number().int().min(1).default(1),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Content Translation Schema
export const ContentTranslationSchema = z.object({
  id: UuidSchema,
  contentType: z.enum(["section", "content_block", "quiz_question"]),
  contentId: UuidSchema,
  languageCode: z.enum(["en", "es", "fr", "de"]),
  translatedContent: z.record(z.any()),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Section Progress Schema
export const SectionProgressSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  sectionId: UuidSchema,
  plantId: UuidSchema,
  isCompleted: z.boolean(),
  timeSpentSeconds: z.number().int().min(0),
  lastViewedAt: TimestampSchema,
  completedAt: OptionalTimestampSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
```

## Content Migration Strategy

### Phase 1: Database Setup (Week 1)

1. **Create Migration Scripts**

   ```bash
   # Generate Drizzle migration
   pnpm drizzle:gen

   # Apply migration to development
   pnpm drizzle:push
   ```

2. **Update Contracts**
   - Add new schemas to `base.ts`
   - Update mappers in `mappers.ts`
   - Add validation functions to `validation.ts`

3. **Create Seed Data Structure**
   - Design JSON structure for content migration
   - Create content extraction utilities

### Phase 2: Content Extraction and Structuring (Week 2)

#### English Content Migration

**Section Mapping:**

```json
{
  "course_id": "hazmat-training-v1",
  "sections": [
    {
      "section_key": "introduction",
      "title": "Introduction & Overview",
      "order_index": 0,
      "icon_name": "BookOpen",
      "content_blocks": [
        {
          "block_type": "hero",
          "order_index": 0,
          "content": {
            "title": "Function-Specific HazMat Training",
            "subtitle": "Handling, Packaging, and Shipping DOT-Regulated Materials",
            "badge": "SpecChem Professional Training",
            "background_class": "bg-gray-50"
          }
        },
        {
          "block_type": "card",
          "order_index": 1,
          "content": {
            "title": "Welcome to SpecChem's Function-Specific Training",
            "text": "This comprehensive training course covers the requirements and expectations for handling, packaging, and shipping DOT-regulated materials in your work at SpecChem.",
            "variant": "info",
            "border_class": "border-l-4 border-l-blue-500"
          }
        }
      ]
    }
  ]
}
```

#### Spanish Content Migration

**Translation Structure:**

```json
{
  "content_translations": [
    {
      "content_type": "section",
      "content_id": "section-uuid",
      "language_code": "es",
      "translated_content": {
        "title": "Introducción y Resumen"
      }
    },
    {
      "content_type": "content_block",
      "content_id": "block-uuid",
      "language_code": "es",
      "translated_content": {
        "title": "Capacitación Específica por Función - Materiales Peligrosos",
        "subtitle": "Manejo, Empaque y Envío de Materiales Regulados por DOT",
        "badge": "Capacitación Profesional SpecChem"
      }
    }
  ]
}
```

### Phase 3: API Development (Week 3)

#### New API Endpoints

```typescript
// Course Content APIs
GET /api/courses/[courseId]/content?lang=en
GET /api/courses/[courseId]/sections/[sectionKey]?lang=en
POST /api/courses/[courseId]/sections/[sectionKey]/progress
GET /api/courses/[courseId]/sections/[sectionKey]/quiz
POST /api/courses/[courseId]/sections/[sectionKey]/quiz/submit

// Admin Content Management APIs
POST /api/admin/courses/[courseId]/sections
PUT /api/admin/courses/[courseId]/sections/[sectionId]
DELETE /api/admin/courses/[courseId]/sections/[sectionId]
POST /api/admin/content-blocks
PUT /api/admin/content-blocks/[blockId]
DELETE /api/admin/content-blocks/[blockId]

// Translation Management APIs
GET /api/admin/translations/[contentType]/[contentId]
POST /api/admin/translations
PUT /api/admin/translations/[translationId]
```

### Phase 4: Frontend Refactoring (Week 4)

#### Component Architecture

```typescript
// New component structure
const EbookPage = ({ params }: { params: { lang?: string } }) => {
  const language = params.lang || 'en';
  const { data: courseContent } = useCourseContent(courseId, language);
  const { progress, updateProgress } = useProgress(courseId);

  return (
    <div>
      <CourseSidebar
        sections={courseContent.sections}
        progress={progress}
        language={language}
      />
      <CourseContent
        section={courseContent.sections[currentSection]}
        language={language}
        onComplete={updateProgress}
      />
    </div>
  );
};

// Dynamic content renderer
const ContentBlockRenderer = ({
  block,
  language
}: {
  block: ContentBlock;
  language: string;
}) => {
  const content = useTranslatedContent(block, language);

  switch (block.blockType) {
    case 'hero':
      return <HeroBlock content={content} />;
    case 'text':
      return <TextBlock content={content} />;
    case 'card':
      return <CardBlock content={content} />;
    case 'image':
      return <ImageBlock content={content} />;
    case 'table':
      return <TableBlock content={content} />;
    case 'list':
      return <ListBlock content={content} />;
    case 'grid':
      return <GridBlock content={content} />;
    case 'callout':
      return <CalloutBlock content={content} />;
    default:
      return null;
  }
};
```

### Phase 5: Content Migration Execution (Week 5)

#### Migration Scripts

```typescript
// Content extraction script
const extractEbookContent = async () => {
  const englishSections = extractSectionsFromComponent("ebook/page.tsx");
  const spanishSections = extractSectionsFromComponent(
    "ebook-spanish/page.tsx",
  );

  // Create course record
  const course = await createCourse({
    slug: "hazmat-function-specific",
    title: "Function-Specific HazMat Training",
    version: "2024.1",
    isPublished: true,
  });

  // Create course languages
  await createCourseLanguages(course.id, ["en", "es"]);

  // Migrate English content
  for (const section of englishSections) {
    const sectionRecord = await createSection(course.id, section);
    await createContentBlocks(sectionRecord.id, section.contentBlocks);
    if (section.quiz) {
      await createQuizQuestion(sectionRecord.id, section.quiz);
    }
  }

  // Create Spanish translations
  await createTranslations(spanishSections, "es");
};
```

#### Content Block Type Mapping

| Current JSX Pattern                              | New Block Type | Content Structure                              |
| ------------------------------------------------ | -------------- | ---------------------------------------------- |
| `<div className="text-center py-12 bg-gray-50">` | `hero`         | `{ title, subtitle, badge, background_class }` |
| `<Card className="border-l-4">`                  | `card`         | `{ title, text, variant, border_class }`       |
| `<img src="..." alt="...">`                      | `image`        | `{ src, alt, caption, className }`             |
| `<table>`                                        | `table`        | `{ headers, rows, className }`                 |
| `<ul>` / `<ol>`                                  | `list`         | `{ type, items, className }`                   |
| `<div className="grid">`                         | `grid`         | `{ columns, items, gap }`                      |
| `<div className="bg-amber-50">`                  | `callout`      | `{ type, title, content, variant }`            |

### Phase 6: Testing and Validation (Week 6)

#### Testing Strategy

1. **Unit Tests**
   - API endpoint functionality
   - Content rendering components
   - Translation utilities

2. **Integration Tests**
   - End-to-end content flow
   - Multi-language switching
   - Progress tracking accuracy

3. **Content Validation**
   - Compare rendered output with original
   - Verify all images and assets load
   - Test quiz functionality

4. **Performance Testing**
   - Content loading times
   - Database query optimization
   - Caching effectiveness

## Multilingual Support Implementation

### Language Detection and Routing

```typescript
// URL structure
/ebook -> English (default)
/ebook?lang=es -> Spanish
/ebook-spanish -> Redirect to /ebook?lang=es (for backward compatibility)

// Language context
const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### Translation Management

```typescript
// Translation hook
const useTranslation = (
  contentType: string,
  contentId: string,
  language: string,
) => {
  return useQuery({
    queryKey: ["translation", contentType, contentId, language],
    queryFn: () => fetchTranslation(contentType, contentId, language),
    fallback: (content: any) => content, // Fallback to original content
  });
};
```

## Analytics and Tracking Enhancements

### Enhanced Progress Tracking

```sql
-- Detailed analytics queries
SELECT
  s.section_key,
  s.title,
  COUNT(sp.user_id) as users_started,
  COUNT(CASE WHEN sp.is_completed THEN 1 END) as users_completed,
  AVG(sp.time_spent_seconds) as avg_time_spent
FROM course_sections s
LEFT JOIN section_progress sp ON s.id = sp.section_id
GROUP BY s.id, s.section_key, s.title
ORDER BY s.order_index;
```

### Content Interaction Analytics

```sql
-- Content block engagement
SELECT
  cb.block_type,
  COUNT(ci.id) as total_interactions,
  COUNT(DISTINCT ci.user_id) as unique_users,
  ci.interaction_type
FROM content_blocks cb
LEFT JOIN content_interactions ci ON cb.id = ci.content_block_id
GROUP BY cb.block_type, ci.interaction_type;
```

## Migration Timeline

| Phase                             | Duration | Key Deliverables                            |
| --------------------------------- | -------- | ------------------------------------------- |
| **Phase 1: Database Setup**       | Week 1   | Migration scripts, updated contracts        |
| **Phase 2: Content Extraction**   | Week 2   | Structured content JSON, extraction scripts |
| **Phase 3: API Development**      | Week 3   | Content APIs, admin endpoints               |
| **Phase 4: Frontend Refactoring** | Week 4   | New components, dynamic rendering           |
| **Phase 5: Content Migration**    | Week 5   | Migrated content, translations              |
| **Phase 6: Testing & Validation** | Week 6   | Tested system, performance optimization     |

## Risk Mitigation

### Content Fidelity Risks

- **Risk**: Loss of formatting or styling during migration
- **Mitigation**: Comprehensive content comparison testing, staged rollout

### Performance Risks

- **Risk**: Slower loading times due to database queries
- **Mitigation**: Implement caching, optimize queries, use CDN for images

### Translation Consistency Risks

- **Risk**: Inconsistent translations between languages
- **Mitigation**: Translation validation tools, native speaker review

### User Experience Risks

- **Risk**: Disruption to existing user workflows
- **Mitigation**: Maintain backward compatibility, gradual feature rollout

## Success Metrics

### Technical Metrics

- Page load time < 2 seconds
- Database query response time < 100ms
- 99.9% uptime during migration
- Zero data loss during migration

### Content Metrics

- 100% content parity with original
- All images and assets properly migrated
- All quiz functionality preserved
- Multi-language switching works seamlessly

### User Experience Metrics

- User completion rates maintained or improved
- User feedback scores remain positive
- No increase in support tickets related to content issues

## Post-Migration Benefits

### Immediate Benefits

- Content can be updated without code deployments
- Better analytics and user interaction tracking
- Improved multilingual support
- Enhanced accessibility features

### Long-term Benefits

- Scalable content management system
- A/B testing capabilities for content optimization
- Personalized learning paths
- Integration with external learning management systems
- Automated content translation workflows

## Conclusion

This migration plan transforms the static ebook content into a dynamic, database-driven system that provides better maintainability, enhanced analytics, and improved multilingual support. The phased approach ensures minimal disruption to users while delivering significant long-term benefits for content management and user experience.

The investment in this migration will pay dividends through reduced maintenance overhead, improved user engagement tracking, and the ability to rapidly iterate on content without requiring developer resources for every change.
