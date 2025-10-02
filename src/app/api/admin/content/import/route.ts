import { ContentImportSchema } from '@/contracts/base';
import { handleApiError } from '@/lib/api-utils';
import { requireAdminRole, requireAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/content/import
 * 
 * Imports structured content data into the database.
 * Requires admin privileges.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Authenticate and authorize admin user
    const authResult = await requireAuth();
    await requireAdminRole('dev_admin');
    
    // Validate request body
    const body = await request.json();
    const validation = ContentImportSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid import data', details: validation.error.issues },
        { status: 400 }
      );
    }
    
    const importData = validation.data;
    
    // Verify course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, slug')
      .eq('id', importData.courseId)
      .single();
    
    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const importResults = {
      courseId: course.id,
      sectionsCreated: 0,
      contentBlocksCreated: 0,
      quizQuestionsCreated: 0,
      errors: [] as string[]
    };
    
    // Process each section
    for (const sectionData of importData.sections) {
      try {
        // Create or update section
        const { data: section, error: sectionError } = await supabase
          .from('course_sections')
          .upsert({
            course_id: importData.courseId,
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
        
        if (sectionError) {
          importResults.errors.push(`Section ${sectionData.sectionKey}: ${sectionError.message}`);
          continue;
        }
        
        importResults.sectionsCreated++;
        
        // Delete existing content blocks for this section
        await supabase
          .from('content_blocks')
          .delete()
          .eq('section_id', section.id);
        
        // Create content blocks
        if (sectionData.contentBlocks && sectionData.contentBlocks.length > 0) {
          const contentBlockRecords = sectionData.contentBlocks.map(block => ({
            section_id: section.id,
            block_type: block.blockType,
            order_index: block.orderIndex,
            content: block.content,
            metadata: block.metadata || null
          }));
          
          const { data: contentBlocks, error: blocksError } = await supabase
            .from('content_blocks')
            .insert(contentBlockRecords)
            .select();
          
          if (blocksError) {
            importResults.errors.push(`Content blocks for ${sectionData.sectionKey}: ${blocksError.message}`);
          } else {
            importResults.contentBlocksCreated += contentBlocks.length;
          }
        }
        
        // Delete existing quiz questions for this section
        await supabase
          .from('quiz_questions')
          .delete()
          .eq('section_id', section.id);
        
        // Create quiz questions
        if (sectionData.quizQuestions && sectionData.quizQuestions.length > 0) {
          const quizQuestionRecords = sectionData.quizQuestions.map(question => ({
            section_id: section.id,
            question_key: question.questionKey,
            question_type: question.questionType,
            question_text: question.questionText,
            options: question.options || null,
            correct_answer: question.correctAnswer,
            explanation: question.explanation,
            order_index: question.orderIndex || 1
          }));
          
          const { data: quizQuestions, error: questionsError } = await supabase
            .from('quiz_questions')
            .insert(quizQuestionRecords)
            .select();
          
          if (questionsError) {
            importResults.errors.push(`Quiz questions for ${sectionData.sectionKey}: ${questionsError.message}`);
          } else {
            importResults.quizQuestionsCreated += quizQuestions.length;
          }
        }
        
      } catch (sectionError) {
        importResults.errors.push(`Section ${sectionData.sectionKey}: ${sectionError}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: importResults
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
