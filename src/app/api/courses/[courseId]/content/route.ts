import {
    CourseContentSchema,
    LanguageCodeSchema
} from '@/contracts/base';
import { handleApiError } from '@/lib/api-utils';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/courses/[courseId]/content
 * 
 * Retrieves complete course content including sections, content blocks, and quiz questions.
 * Supports multilingual content via language parameter.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { searchParams } = new URL(request.url);
    
    // Validate parameters
    const courseId = params.courseId;
    const language = searchParams.get('lang') || 'en';
    
    // Validate language parameter
    const languageValidation = LanguageCodeSchema.safeParse(language);
    if (!languageValidation.success) {
      return NextResponse.json(
        { error: 'Invalid language code', details: languageValidation.error.issues },
        { status: 400 }
      );
    }
    
    // Get course with language support
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        course_languages!inner(*)
      `)
      .eq('id', courseId)
      .eq('course_languages.language_code', language)
      .eq('course_languages.is_published', true)
      .single();
    
    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found or not available in requested language' },
        { status: 404 }
      );
    }
    
    // Get course sections with content blocks and quiz questions
    const { data: sections, error: sectionsError } = await supabase
      .from('course_sections')
      .select(`
        *,
        content_blocks(*),
        quiz_questions(*)
      `)
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index');
    
    if (sectionsError) {
      throw sectionsError;
    }
    
    // Get translations if not primary language
    let translations: Record<string, any> = {};
    if (language !== course.default_language) {
      const { data: translationData, error: translationError } = await supabase
        .from('content_translations')
        .select('*')
        .eq('language_code', language)
        .in('content_id', [
          ...sections.map((s: any) => s.id),
          ...sections.flatMap((s: any) => s.content_blocks.map((cb: any) => cb.id)),
          ...sections.flatMap((s: any) => s.quiz_questions.map((qq: any) => qq.id))
        ]);
      
      if (!translationError && translationData) {
        translations = translationData.reduce((acc: Record<string, any>, t: any) => {
          acc[`${t.content_type}_${t.content_id}`] = t.translated_content;
          return acc;
        }, {} as Record<string, any>);
      }
    }
    
    // Apply translations to content
    const translatedSections = sections.map((section: any) => {
      const sectionTranslation = translations[`section_${section.id}`];
      
      return {
        ...section,
        title: sectionTranslation?.title || section.title,
        contentBlocks: section.content_blocks.map((block: any) => {
          const blockTranslation = translations[`content_block_${block.id}`];
          return {
            ...block,
            content: blockTranslation || block.content
          };
        }),
        quizQuestions: section.quiz_questions.map((question: any) => {
          const questionTranslation = translations[`quiz_question_${question.id}`];
          return {
            ...question,
            questionText: questionTranslation?.questionText || question.question_text,
            options: questionTranslation?.options || question.options,
            explanation: questionTranslation?.explanation || question.explanation
          };
        })
      };
    });
    
    const courseContent = {
      course: {
        ...course,
        sections: undefined // Remove nested sections from course object
      },
      sections: translatedSections,
      translations: Object.keys(translations).length > 0 ? translations : undefined
    };
    
    // Validate response
    const validation = CourseContentSchema.safeParse(courseContent);
    if (!validation.success) {
      console.error('Course content validation failed:', validation.error);
      return NextResponse.json(
        { error: 'Invalid course content structure' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: courseContent
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
