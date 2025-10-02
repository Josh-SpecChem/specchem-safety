import { ContentExportSchema } from '@/contracts/base';
import { handleApiError } from '@/lib/api-utils';
import { requireAdminRole, requireAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/content/export
 * 
 * Exports complete course content for backup or migration.
 * Requires admin privileges.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { searchParams } = new URL(request.url);
    
    // Authenticate and authorize admin user
    const authResult = await requireAuth();
    await requireAdminRole('dev_admin');
    
    const courseId = searchParams.get('courseId');
    const language = searchParams.get('language') || 'en';
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Get course with all related data
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        course_languages(*)
      `)
      .eq('id', courseId)
      .single();
    
    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Get all sections with content blocks and quiz questions
    const { data: sections, error: sectionsError } = await supabase
      .from('course_sections')
      .select(`
        *,
        content_blocks(*),
        quiz_questions(*)
      `)
      .eq('course_id', courseId)
      .order('order_index');
    
    if (sectionsError) {
      throw sectionsError;
    }
    
    // Get translations for the specified language (if not primary)
    let translations: Record<string, any> = {};
    if (language !== course.default_language) {
      const allContentIds = [
        ...sections.map((s: any) => s.id),
        ...sections.flatMap((s: any) => s.content_blocks.map((cb: any) => cb.id)),
        ...sections.flatMap((s: any) => s.quiz_questions.map((qq: any) => qq.id))
      ];
      
      const { data: translationData, error: translationError } = await supabase
        .from('content_translations')
        .select('*')
        .eq('language_code', language)
        .in('content_id', allContentIds);
      
      if (!translationError && translationData) {
        translations = translationData.reduce((acc: Record<string, any>, t: any) => {
          acc[`${t.content_type}_${t.content_id}`] = t.translated_content;
          return acc;
        }, {} as Record<string, any>);
      }
    }
    
    // Structure the export data
    const exportData = {
      course: {
        ...course,
        defaultLanguage: course.default_language,
        availableLanguages: course.available_languages,
        contentVersion: course.content_version,
        sections: undefined,
        languages: course.course_languages
      },
      content: {
        course: course,
        sections: sections.map((section: any) => {
          const sectionTranslation = translations[`section_${section.id}`];
          
          return {
            ...section,
            title: sectionTranslation?.title || section.title,
            contentBlocks: section.content_blocks
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((block: any) => {
                const blockTranslation = translations[`content_block_${block.id}`];
                return {
                  ...block,
                  content: blockTranslation || block.content
                };
              }),
            quizQuestions: section.quiz_questions
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((question: any) => {
                const questionTranslation = translations[`quiz_question_${question.id}`];
                return {
                  ...question,
                  questionText: questionTranslation?.questionText || question.question_text,
                  options: questionTranslation?.options || question.options,
                  explanation: questionTranslation?.explanation || question.explanation
                };
              })
          };
        }),
        translations: Object.keys(translations).length > 0 ? translations : undefined
      },
      exportedAt: new Date().toISOString(),
      version: course.content_version || '1.0'
    };
    
    // Validate export data
    const validation = ContentExportSchema.safeParse(exportData);
    if (!validation.success) {
      console.error('Export validation failed:', validation.error);
      return NextResponse.json(
        { error: 'Invalid export data structure' },
        { status: 500 }
      );
    }
    
    // Set appropriate headers for file download
    const filename = `course-${course.slug}-${language}-${new Date().toISOString().split('T')[0]}.json`;
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
