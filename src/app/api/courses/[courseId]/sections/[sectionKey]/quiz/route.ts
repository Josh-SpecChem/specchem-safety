import {
    CreateQuestionEventSchema,
    LanguageCodeSchema
} from '@/contracts/base';
import { handleApiError } from '@/lib/api-utils';
import { requireAuth } from '@/lib/auth';
import type { AuthResult } from '@/lib/auth/types/auth-types';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/courses/[courseId]/sections/[sectionKey]/quiz
 * 
 * Retrieves quiz questions for a specific section.
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
    const { courseId, sectionKey } = params;
    const { searchParams } = new URL(request.url);
    
    const language = searchParams.get('lang') || 'en';
    
    // Validate language parameter
    const languageValidation = LanguageCodeSchema.safeParse(language);
    if (!languageValidation.success) {
      return NextResponse.json(
        { error: 'Invalid language code' },
        { status: 400 }
      );
    }
    
    // Get course to check language availability
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('default_language')
      .eq('id', courseId)
      .single();
    
    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Get section with quiz questions
    const { data: section, error: sectionError } = await supabase
      .from('course_sections')
      .select(`
        id,
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
    
    if (!section.quiz_questions || section.quiz_questions.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }
    
    // Get translations if not primary language
    let translations: Record<string, any> = {};
    if (language !== course.default_language) {
      const questionIds = section.quiz_questions.map((q: any) => q.id);
      
      const { data: translationData, error: translationError } = await supabase
        .from('content_translations')
        .select('*')
        .eq('content_type', 'quiz_question')
        .eq('language_code', language)
        .in('content_id', questionIds);
      
      if (!translationError && translationData) {
        translations = translationData.reduce((acc: Record<string, any>, t: any) => {
          acc[t.content_id] = t.translated_content;
          return acc;
        }, {} as Record<string, any>);
      }
    }
    
    // Apply translations to quiz questions
    const translatedQuestions = section.quiz_questions
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((question: any) => {
        const translation = translations[question.id];
        return {
          id: question.id,
          questionKey: question.question_key,
          questionType: question.question_type,
          questionText: translation?.questionText || question.question_text,
          options: translation?.options || question.options,
          explanation: translation?.explanation || question.explanation,
          orderIndex: question.order_index
        };
      });
    
    return NextResponse.json({
      success: true,
      data: translatedQuestions
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/courses/[courseId]/sections/[sectionKey]/quiz
 * 
 * Submits quiz answers and records the attempt.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string; sectionKey: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { courseId, sectionKey } = params;
    
    // Authenticate user
    const authResult = await requireAuth() as unknown as AuthResult;
    const user = authResult.user;
    
    // Parse request body
    const body = await request.json();
    const { questionKey, answer, attemptIndex = 1 } = body;
    
    if (!questionKey || answer === undefined) {
      return NextResponse.json(
        { error: 'Question key and answer are required' },
        { status: 400 }
      );
    }
    
    // Get section and quiz question
    const { data: section, error: sectionError } = await supabase
      .from('course_sections')
      .select(`
        id,
        quiz_questions!inner(*)
      `)
      .eq('course_id', courseId)
      .eq('section_key', sectionKey)
      .eq('quiz_questions.question_key', questionKey)
      .single();
    
    if (sectionError || !section || !section.quiz_questions?.[0]) {
      return NextResponse.json(
        { error: 'Quiz question not found' },
        { status: 404 }
      );
    }
    
    const question = section.quiz_questions[0];
    
    // Check if answer is correct
    let isCorrect = false;
    if (Array.isArray(question.correct_answer)) {
      // Multiple choice with multiple correct answers
      const userAnswers = Array.isArray(answer) ? answer : [answer];
      isCorrect = question.correct_answer.length === userAnswers.length &&
                  question.correct_answer.every((correctAns: any) => userAnswers.includes(correctAns));
    } else {
      // Single correct answer
      isCorrect = answer === question.correct_answer;
    }
    
    // Create question event record
    const eventData = {
      user_id: user.id,
      course_id: courseId,
      plant_id: body.plantId || 'default',
      section_key: sectionKey,
      question_key: questionKey,
      is_correct: isCorrect,
      attempt_index: attemptIndex,
      response_meta: {
        user_answer: answer,
        correct_answer: question.correct_answer,
        question_type: question.question_type
      }
    };
    
    const validation = CreateQuestionEventSchema.safeParse(eventData);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid event data', details: validation.error.issues },
        { status: 400 }
      );
    }
    
    const { data: questionEvent, error: eventError } = await supabase
      .from('question_events')
      .insert(eventData)
      .select()
      .single();
    
    if (eventError) {
      throw eventError;
    }
    
    // Return result with feedback
    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        explanation: question.explanation,
        correctAnswer: question.correct_answer,
        userAnswer: answer,
        eventId: questionEvent.id
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
