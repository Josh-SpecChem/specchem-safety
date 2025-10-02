#!/usr/bin/env tsx

/**
 * Ebook Content Database Migration Script
 * 
 * This script migrates the extracted ebook content into the database,
 * creating courses, sections, content blocks, and quiz questions.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { extractContent } from './extract-ebook-content';

// Database client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface MigrationData {
  courses: Array<{
    slug: string;
    title: string;
    version: string;
    isPublished: boolean;
    defaultLanguage: string;
    availableLanguages: string[];
    contentVersion: string;
  }>;
  languages: Array<{
    courseSlug: string;
    languageCode: string;
    isPrimary: boolean;
    isPublished: boolean;
  }>;
  content: {
    en: any;
    es: any;
  };
}

/**
 * Create or update course record
 */
async function createCourse(courseData: MigrationData['courses'][0]) {
  console.log(`📚 Creating course: ${courseData.title}`);
  
  const { data, error } = await supabase
    .from('courses')
    .upsert({
      slug: courseData.slug,
      title: courseData.title,
      version: courseData.version,
      is_published: courseData.isPublished,
      default_language: courseData.defaultLanguage,
      available_languages: courseData.availableLanguages,
      content_version: courseData.contentVersion,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'slug'
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error creating course:', error);
    throw error;
  }
  
  console.log('✅ Course created:', data.id);
  return data;
}

/**
 * Create course language records
 */
async function createCourseLanguages(courseId: string, languages: MigrationData['languages']) {
  console.log('🌐 Creating course languages...');
  
  const languageRecords = languages.map(lang => ({
    course_id: courseId,
    language_code: lang.languageCode,
    is_primary: lang.isPrimary,
    is_published: lang.isPublished
  }));
  
  const { data, error } = await supabase
    .from('course_languages')
    .upsert(languageRecords, {
      onConflict: 'course_id,language_code'
    })
    .select();
  
  if (error) {
    console.error('❌ Error creating course languages:', error);
    throw error;
  }
  
  console.log(`✅ Created ${data.length} course language records`);
  return data;
}

/**
 * Create course section
 */
async function createSection(courseId: string, sectionData: any) {
  console.log(`📖 Creating section: ${sectionData.title}`);
  
  const { data, error } = await supabase
    .from('course_sections')
    .upsert({
      course_id: courseId,
      section_key: sectionData.sectionKey,
      title: sectionData.title,
      order_index: sectionData.orderIndex,
      icon_name: sectionData.iconName,
      is_published: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'course_id,section_key'
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error creating section:', error);
    throw error;
  }
  
  console.log('✅ Section created:', data.id);
  return data;
}

/**
 * Create content blocks for a section
 */
async function createContentBlocks(sectionId: string, contentBlocks: any[]) {
  console.log(`🧱 Creating ${contentBlocks.length} content blocks...`);
  
  const blockRecords = contentBlocks.map(block => ({
    section_id: sectionId,
    block_type: block.blockType,
    order_index: block.orderIndex,
    content: block.content,
    metadata: block.metadata || null,
    updated_at: new Date().toISOString()
  }));
  
  // Delete existing blocks for this section first
  await supabase
    .from('content_blocks')
    .delete()
    .eq('section_id', sectionId);
  
  const { data, error } = await supabase
    .from('content_blocks')
    .insert(blockRecords)
    .select();
  
  if (error) {
    console.error('❌ Error creating content blocks:', error);
    throw error;
  }
  
  console.log(`✅ Created ${data.length} content blocks`);
  return data;
}

/**
 * Create quiz questions for a section
 */
async function createQuizQuestions(sectionId: string, quizQuestions: any[]) {
  if (!quizQuestions || quizQuestions.length === 0) {
    return [];
  }
  
  console.log(`❓ Creating ${quizQuestions.length} quiz questions...`);
  
  const questionRecords = quizQuestions.map(question => ({
    section_id: sectionId,
    question_key: question.questionKey,
    question_type: question.questionType,
    question_text: question.questionText,
    options: question.options || null,
    correct_answer: question.correctAnswer,
    explanation: question.explanation,
    order_index: question.orderIndex || 1,
    updated_at: new Date().toISOString()
  }));
  
  // Delete existing questions for this section first
  await supabase
    .from('quiz_questions')
    .delete()
    .eq('section_id', sectionId);
  
  const { data, error } = await supabase
    .from('quiz_questions')
    .insert(questionRecords)
    .select();
  
  if (error) {
    console.error('❌ Error creating quiz questions:', error);
    throw error;
  }
  
  console.log(`✅ Created ${data.length} quiz questions`);
  return data;
}

/**
 * Create translations for content
 */
async function createTranslations(
  contentType: 'section' | 'content_block' | 'quiz_question',
  contentId: string,
  languageCode: string,
  translatedContent: any
) {
  const { data, error } = await supabase
    .from('content_translations')
    .upsert({
      content_type: contentType,
      content_id: contentId,
      language_code: languageCode,
      translated_content: translatedContent,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'content_type,content_id,language_code'
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error creating translation:', error);
    throw error;
  }
  
  return data;
}

/**
 * Migrate content for a specific language
 */
async function migrateLanguageContent(courseId: string, languageCode: string, contentData: any) {
  console.log(`\n🌍 Migrating ${languageCode.toUpperCase()} content...`);
  
  const sectionMappings: { [key: string]: { sectionId: string; contentBlocks: any[]; quizQuestions: any[] } } = {};
  
  // Create sections and their content
  for (const sectionData of contentData.sections) {
    const section = await createSection(courseId, sectionData);
    const contentBlocks = await createContentBlocks(section.id, sectionData.contentBlocks);
    const quizQuestions = await createQuizQuestions(section.id, sectionData.quizQuestions || []);
    
    sectionMappings[sectionData.sectionKey] = {
      sectionId: section.id,
      contentBlocks,
      quizQuestions
    };
    
    // If this is not the primary language, create translations
    if (languageCode !== 'en') {
      // Create section translation
      await createTranslations('section', section.id, languageCode, {
        title: sectionData.title
      });
      
      // Create content block translations
      for (let i = 0; i < contentBlocks.length; i++) {
        const block = contentBlocks[i];
        const originalBlock = sectionData.contentBlocks[i];
        
        await createTranslations('content_block', block.id, languageCode, originalBlock.content);
      }
      
      // Create quiz question translations
      for (let i = 0; i < quizQuestions.length; i++) {
        const question = quizQuestions[i];
        const originalQuestion = sectionData.quizQuestions[i];
        
        await createTranslations('quiz_question', question.id, languageCode, {
          questionText: originalQuestion.questionText,
          options: originalQuestion.options,
          explanation: originalQuestion.explanation
        });
      }
    }
  }
  
  console.log(`✅ ${languageCode.toUpperCase()} content migration completed`);
  return sectionMappings;
}

/**
 * Main migration function
 */
async function migrateEbookContent() {
  console.log('🚀 Starting ebook content migration...');
  
  try {
    // Load migration data
    const extractedDir = path.join(process.cwd(), 'scripts', 'extracted-content');
    const migrationFile = path.join(extractedDir, 'migration-data.json');
    
    let migrationData: MigrationData;
    
    if (fs.existsSync(migrationFile)) {
      console.log('📁 Loading existing migration data...');
      migrationData = JSON.parse(fs.readFileSync(migrationFile, 'utf8'));
    } else {
      console.log('🔄 Extracting content first...');
      await extractContent();
      migrationData = JSON.parse(fs.readFileSync(migrationFile, 'utf8'));
    }
    
    // Create course
    const course = await createCourse(migrationData.courses[0]);
    
    // Create course languages
    const courseLanguages = migrationData.languages.map(lang => ({
      ...lang,
      courseSlug: course.slug
    }));
    await createCourseLanguages(course.id, courseLanguages);
    
    // Migrate English content (primary)
    const englishMappings = await migrateLanguageContent(course.id, 'en', migrationData.content.en);
    
    // Migrate Spanish content (translations)
    const spanishMappings = await migrateLanguageContent(course.id, 'es', migrationData.content.es);
    
    // Create summary report
    const report = {
      courseId: course.id,
      courseSlug: course.slug,
      migratedAt: new Date().toISOString(),
      summary: {
        totalSections: Object.keys(englishMappings).length,
        totalContentBlocks: Object.values(englishMappings).reduce((acc, s) => acc + s.contentBlocks.length, 0),
        totalQuizQuestions: Object.values(englishMappings).reduce((acc, s) => acc + s.quizQuestions.length, 0),
        languages: ['en', 'es']
      },
      sectionMappings: {
        en: englishMappings,
        es: spanishMappings
      }
    };
    
    // Save migration report
    const reportFile = path.join(extractedDir, 'migration-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log('📊 Migration report saved:', reportFile);
    
    console.log('\n🎉 Ebook content migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log(`- Course ID: ${course.id}`);
    console.log(`- Total sections: ${report.summary.totalSections}`);
    console.log(`- Total content blocks: ${report.summary.totalContentBlocks}`);
    console.log(`- Total quiz questions: ${report.summary.totalQuizQuestions}`);
    console.log(`- Languages: ${report.summary.languages.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateEbookContent();
}

export { migrateEbookContent };
