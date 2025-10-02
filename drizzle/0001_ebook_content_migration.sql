-- Ebook Content Database Migration
-- This migration adds comprehensive support for dynamic ebook content management

-- ========================================
-- ENUM TYPES
-- ========================================

CREATE TYPE "public"."content_block_type" AS ENUM(
  'hero', 'text', 'card', 'image', 'table', 'list', 'grid', 
  'callout', 'quote', 'divider', 'video', 'audio'
);

CREATE TYPE "public"."question_type" AS ENUM('true-false', 'multiple-choice');

CREATE TYPE "public"."content_type" AS ENUM('section', 'content_block', 'quiz_question');

CREATE TYPE "public"."language_code" AS ENUM('en', 'es', 'fr', 'de');

CREATE TYPE "public"."interaction_type" AS ENUM(
  'view', 'click', 'expand', 'collapse', 'download', 'share'
);

-- ========================================
-- COURSE CONTENT TABLES
-- ========================================

-- Course Sections
CREATE TABLE "course_sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "course_id" uuid NOT NULL,
  "section_key" text NOT NULL,
  "title" text NOT NULL,
  "order_index" integer NOT NULL,
  "icon_name" text,
  "is_published" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "course_sections_course_section_unique" UNIQUE("course_id", "section_key"),
  CONSTRAINT "course_sections_course_order_unique" UNIQUE("course_id", "order_index")
);

-- Content Blocks (for structured content within sections)
CREATE TABLE "content_blocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "section_id" uuid NOT NULL,
  "block_type" "content_block_type" NOT NULL,
  "order_index" integer NOT NULL,
  "content" jsonb NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "content_blocks_section_order_unique" UNIQUE("section_id", "order_index")
);

-- Quiz Questions
CREATE TABLE "quiz_questions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "section_id" uuid NOT NULL,
  "question_key" text NOT NULL,
  "question_type" "question_type" NOT NULL,
  "question_text" text NOT NULL,
  "options" jsonb,
  "correct_answer" jsonb NOT NULL,
  "explanation" text NOT NULL,
  "order_index" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "quiz_questions_section_question_unique" UNIQUE("section_id", "question_key")
);

-- ========================================
-- MULTILINGUAL SUPPORT
-- ========================================

-- Content Translations
CREATE TABLE "content_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content_type" "content_type" NOT NULL,
  "content_id" uuid NOT NULL,
  "language_code" "language_code" NOT NULL,
  "translated_content" jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "content_translations_content_language_unique" UNIQUE("content_type", "content_id", "language_code")
);

-- Course Languages (to track which languages are available for each course)
CREATE TABLE "course_languages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "course_id" uuid NOT NULL,
  "language_code" "language_code" NOT NULL,
  "is_primary" boolean DEFAULT false NOT NULL,
  "is_published" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "course_languages_course_language_unique" UNIQUE("course_id", "language_code")
);

-- ========================================
-- ENHANCED PROGRESS TRACKING
-- ========================================

-- Section Progress (granular tracking)
CREATE TABLE "section_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "section_id" uuid NOT NULL,
  "plant_id" uuid NOT NULL,
  "is_completed" boolean DEFAULT false NOT NULL,
  "time_spent_seconds" integer DEFAULT 0 NOT NULL,
  "last_viewed_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "section_progress_user_section_unique" UNIQUE("user_id", "section_id")
);

-- Content Block Interactions (detailed analytics)
CREATE TABLE "content_interactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "content_block_id" uuid NOT NULL,
  "plant_id" uuid NOT NULL,
  "interaction_type" "interaction_type" NOT NULL,
  "interaction_data" jsonb,
  "occurred_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- ========================================
-- FOREIGN KEY CONSTRAINTS
-- ========================================

-- Course Sections
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_course_id_fk" 
  FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Content Blocks
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_section_id_fk" 
  FOREIGN KEY ("section_id") REFERENCES "public"."course_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Quiz Questions
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_section_id_fk" 
  FOREIGN KEY ("section_id") REFERENCES "public"."course_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Course Languages
ALTER TABLE "course_languages" ADD CONSTRAINT "course_languages_course_id_fk" 
  FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Section Progress
ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_user_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_section_id_fk" 
  FOREIGN KEY ("section_id") REFERENCES "public"."course_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_plant_id_fk" 
  FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Content Interactions
ALTER TABLE "content_interactions" ADD CONSTRAINT "content_interactions_user_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "content_interactions" ADD CONSTRAINT "content_interactions_content_block_id_fk" 
  FOREIGN KEY ("content_block_id") REFERENCES "public"."content_blocks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "content_interactions" ADD CONSTRAINT "content_interactions_plant_id_fk" 
  FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ========================================
-- PERFORMANCE INDEXES
-- ========================================

-- Course Sections
CREATE INDEX "course_sections_course_order_idx" ON "course_sections" USING btree ("course_id", "order_index");
CREATE INDEX "course_sections_published_idx" ON "course_sections" USING btree ("is_published");

-- Content Blocks
CREATE INDEX "content_blocks_section_order_idx" ON "content_blocks" USING btree ("section_id", "order_index");
CREATE INDEX "content_blocks_type_idx" ON "content_blocks" USING btree ("block_type");

-- Quiz Questions
CREATE INDEX "quiz_questions_section_idx" ON "quiz_questions" USING btree ("section_id");
CREATE INDEX "quiz_questions_type_idx" ON "quiz_questions" USING btree ("question_type");

-- Content Translations
CREATE INDEX "content_translations_lookup_idx" ON "content_translations" USING btree ("content_type", "content_id", "language_code");
CREATE INDEX "content_translations_language_idx" ON "content_translations" USING btree ("language_code");

-- Course Languages
CREATE INDEX "course_languages_course_idx" ON "course_languages" USING btree ("course_id");
CREATE INDEX "course_languages_published_idx" ON "course_languages" USING btree ("is_published");

-- Section Progress
CREATE INDEX "section_progress_user_section_idx" ON "section_progress" USING btree ("user_id", "section_id");
CREATE INDEX "section_progress_plant_course_idx" ON "section_progress" USING btree ("plant_id", "section_id");
CREATE INDEX "section_progress_completed_idx" ON "section_progress" USING btree ("is_completed");

-- Content Interactions
CREATE INDEX "content_interactions_user_time_idx" ON "content_interactions" USING btree ("user_id", "occurred_at");
CREATE INDEX "content_interactions_content_type_idx" ON "content_interactions" USING btree ("content_block_id", "interaction_type");
CREATE INDEX "content_interactions_plant_time_idx" ON "content_interactions" USING btree ("plant_id", "occurred_at");

-- ========================================
-- MODIFY EXISTING TABLES
-- ========================================

-- Add language support to courses table
ALTER TABLE "courses" ADD COLUMN "default_language" "language_code" DEFAULT 'en' NOT NULL;
ALTER TABLE "courses" ADD COLUMN "available_languages" "language_code"[] DEFAULT ARRAY['en'] NOT NULL;
ALTER TABLE "courses" ADD COLUMN "content_version" text DEFAULT '1.0' NOT NULL;

-- Enhance progress table
ALTER TABLE "progress" ADD COLUMN "language_code" "language_code" DEFAULT 'en' NOT NULL;
ALTER TABLE "progress" ADD COLUMN "sections_completed" integer DEFAULT 0 NOT NULL;
ALTER TABLE "progress" ADD COLUMN "total_sections" integer DEFAULT 0 NOT NULL;

-- Add indexes for new columns
CREATE INDEX "courses_default_language_idx" ON "courses" USING btree ("default_language");
CREATE INDEX "courses_published_language_idx" ON "courses" USING btree ("is_published", "default_language");
CREATE INDEX "progress_language_idx" ON "progress" USING btree ("language_code");
