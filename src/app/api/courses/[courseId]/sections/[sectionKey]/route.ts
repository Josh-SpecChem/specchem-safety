import {
    LanguageCodeSchema,
    SectionContentSchema
} from '@/contracts/base';
import { handleApiError } from '@/lib/api-utils';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/courses/[courseId]/sections/[sectionKey]
 * 
 * Retrieves specific section content including content blocks and quiz questions.
 * Supports multilingual content via language parameter.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; sectionKey: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { searchParams } = new URL(request.url);
    
    // Validate parameters
    const { courseId, sectionKey } = params;
    const language = searchParams.get('lang') || 'en';
    
    // Validate language parameter
    const languageValidation = LanguageCodeSchema.safeParse(language);
    if (!languageValidation.success) {
      return NextResponse.json(
        { error: 'Invalid language code', details: languageValidation.error.issues },
        { status: 400 }
      );
    }
    
    // Verify course exists and language is available
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
    
    // Get section with content blocks and quiz questions
    const { data: section, error: sectionError } = await supabase
      .from('course_sections')
      .select(`
        *,
        content_blocks(*),
        quiz_questions(*)
      `)
      .eq('course_id', courseId)
      .eq('section_key', sectionKey)
      .eq('is_published', true)
      .single();
    
    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Get translations if not primary language
    let translations: Record<string, any> = {};
    if (language !== course.default_language) {
      const contentIds = [
        section.id,
        ...section.content_blocks.map((cb: any) => cb.id),
        ...section.quiz_questions.map((qq: any) => qq.id)
      ];
      
      const { data: translationData, error: translationError } = await supabase
        .from('content_translations')
        .select('*')
        .eq('language_code', language)
        .in('content_id', contentIds);
      
      if (!translationError && translationData) {
        translations = translationData.reduce((acc: Record<string, any>, t: any) => {
          acc[`${t.content_type}_${t.content_id}`] = t.translated_content;
          return acc;
        }, {} as Record<string, any>);
      }
    }
    
    // Apply translations to content
    const sectionTranslation = translations[`section_${section.id}`];
    
    const translatedSection = {
      ...section,
      title: sectionTranslation?.title || section.title
    };
    
    const translatedContentBlocks = section.content_blocks
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((block: any) => {
        const blockTranslation = translations[`content_block_${block.id}`];
        return {
          ...block,
          content: blockTranslation || block.content
        };
      });
    
    const translatedQuizQuestions = section.quiz_questions
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((question: any) => {
        const questionTranslation = translations[`quiz_question_${question.id}`];
        return {
          ...question,
          questionText: questionTranslation?.questionText || question.question_text,
          options: questionTranslation?.options || question.options,
          explanation: questionTranslation?.explanation || question.explanation
        };
      });
    
    const sectionContent = {
      section: translatedSection,
      contentBlocks: translatedContentBlocks,
      quizQuestions: translatedQuizQuestions,
      translations: Object.keys(translations).length > 0 ? translations : undefined
    };
    
    // Validate response
    const validation = SectionContentSchema.safeParse(sectionContent);
    if (!validation.success) {
      console.error('Section content validation failed:', validation.error);
      return NextResponse.json(
        { error: 'Invalid section content structure' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: sectionContent
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
