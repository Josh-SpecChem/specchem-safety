'use client';

import { ContentBlockRenderer } from '@/components/ebook/ContentBlockRenderer';
import { QuizRenderer } from '@/components/ebook/QuizRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCourseContent } from '@/hooks/useCourseContent';
import { useContentInteraction, useQuizSubmission, useSectionProgress } from '@/hooks/useSectionProgress';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Globe,
    Menu,
    X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

const COURSE_ID = 'hazmat-function-specific'; // This would come from props or params in a real implementation

function DynamicEbookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionCompleted, setSectionCompleted] = useState<Record<number, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  
  // Get language from URL params
  const language = searchParams.get('lang') || 'en';
  
  // Hooks for data fetching
  const { data: courseContent, loading, error } = useCourseContent({
    courseId: COURSE_ID,
    language
  });
  
  const currentSectionKey = courseContent?.sections[currentSection]?.sectionKey;
  const { progress: sectionProgress, updateProgress } = useSectionProgress({
    courseId: COURSE_ID,
    sectionKey: currentSectionKey || '',
    enabled: !!currentSectionKey
  });
  
  const { submitAnswer } = useQuizSubmission({
    courseId: COURSE_ID,
    sectionKey: currentSectionKey || ''
  });
  
  const { recordInteraction } = useContentInteraction();

  // Utility functions
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const handleSectionChange = (index: number) => {
    if (isSectionAccessible(index)) {
      setCurrentSection(index);
      scrollToTop();
      setSidebarOpen(false);
    }
  };

  // Check if a section is accessible (all previous sections completed)
  const isSectionAccessible = (index: number) => {
    if (index === 0) return true; // First section is always accessible
    
    // Check if all previous sections are completed
    for (let i = 0; i < index; i++) {
      if (!sectionCompleted[i]) {
        return false;
      }
    }
    return true;
  };

  // Mark sections without quizzes as completed automatically
  useEffect(() => {
    if (!courseContent?.sections[currentSection]) return;
    
    const currentSectionData = courseContent.sections[currentSection];
    if (!currentSectionData.quizQuestions || currentSectionData.quizQuestions.length === 0) {
      setSectionCompleted(prev => ({ ...prev, [currentSection]: true }));
      updateProgress({ isCompleted: true });
    }
  }, [currentSection, courseContent, updateProgress]);

  // Handle quiz completion
  const handleQuizComplete = async (allCorrect: boolean) => {
    if (allCorrect) {
      setSectionCompleted(prev => ({ ...prev, [currentSection]: true }));
      await updateProgress({ isCompleted: true });
    }
  };

  // Handle content interactions
  const handleContentInteraction = (blockId: string, interactionType: string, data?: any) => {
    recordInteraction(blockId, interactionType, data);
  };

  // Handle image lightbox
  const openLightbox = (src: string, alt: string) => {
    setLightboxImage({ src, alt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLanguage);
    router.push(url.pathname + url.search);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !courseContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Content</h2>
          <p className="text-gray-600 mb-4">
            {error || 'Course content could not be loaded. Please try again.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const sections = courseContent.sections;
  const currentSectionData = sections[currentSection];
  const progress = (Object.keys(sectionCompleted).filter(key => sectionCompleted[parseInt(key)]).length / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                    {courseContent.course.title}
                  </h1>
                  <div className="hidden sm:block">
                    <p className="text-xs sm:text-sm text-gray-500">Interactive Learning Module</p>
                  </div>
                  {/* Mobile Progress Bar */}
                  <div className="sm:hidden flex items-center gap-2 mt-1">
                    <Progress value={progress} className="h-1.5 flex-1 max-w-[120px]" />
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Desktop Progress Bar */}
              <div className="hidden sm:flex items-center gap-2">
                <Progress value={progress} className="h-2 w-32 lg:w-48" />
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                <select 
                  className="text-xs sm:text-sm border border-gray-300 rounded px-1 sm:px-2 py-1 bg-white min-w-[60px]"
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div className="hidden lg:block text-sm text-gray-600">
                Section {currentSection + 1} of {sections.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto relative">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-12 sm:top-16 left-0 z-30 w-full max-w-sm sm:w-80 h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg lg:shadow-none`}>
          
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Table of Contents</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 sm:p-6">
            <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-6">Table of Contents</h2>
            <nav className="space-y-1 sm:space-y-2">
              {sections.map((section, index) => {
                const isAccessible = isSectionAccessible(index);
                const isCompleted = sectionCompleted[index];
                const IconComponent = section.iconName ? 
                  require('lucide-react')[section.iconName] || BookOpen : BookOpen;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(index)}
                    disabled={!isAccessible}
                    className={`w-full text-left p-3 sm:p-3 rounded-lg transition-colors min-h-[44px] ${
                      currentSection === index
                        ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                        : isAccessible
                        ? 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                        : 'text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    title={!isAccessible ? "Complete previous sections to unlock" : ""}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <IconComponent className={`h-5 w-5 ${
                          currentSection === index 
                            ? 'text-blue-600' 
                            : isAccessible 
                            ? 'text-gray-400' 
                            : 'text-gray-300'
                        }`} />
                        {isCompleted && (
                          <CheckCircle className="h-3 w-3 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                        {!isAccessible && index > 0 && (
                          <div className="h-3 w-3 bg-gray-300 rounded-full absolute -top-1 -right-1 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base leading-tight">{section.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          Section {index + 1}
                          {isCompleted && <span className="text-green-600 ml-1">✓</span>}
                          {!isAccessible && index > 0 && <span className="text-gray-400 ml-1">🔒</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Study Progress</h3>
              <Progress value={progress} className="mb-2 h-2" />
              <p className="text-xs sm:text-sm text-blue-600">{Math.round(progress)}% Complete</p>
              <p className="text-xs text-gray-600 mt-1">
                Section {currentSection + 1} of {sections.length}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 top-12 sm:top-16"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation overlay"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 min-w-0">
          <div 
            ref={contentRef}
            className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-12"
          >
            <div className="max-w-4xl mx-auto">
              {/* Render Section Content */}
              {currentSectionData && (
                <div className="space-y-6 sm:space-y-8">
                  {currentSectionData.contentBlocks
                    ?.sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((block) => (
                      <ContentBlockRenderer
                        key={block.id}
                        block={block}
                        onImageClick={openLightbox}
                        onInteraction={handleContentInteraction}
                      />
                    ))}
                  
                  {/* Render Quiz Questions */}
                  {currentSectionData.quizQuestions && currentSectionData.quizQuestions.length > 0 && (
                    <QuizRenderer
                      questions={currentSectionData.quizQuestions.sort((a, b) => a.orderIndex - b.orderIndex)}
                      onSubmit={submitAnswer}
                      onComplete={handleQuizComplete}
                    />
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 gap-4 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="flex items-center gap-2 min-h-[44px] min-w-[100px] w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-center order-first sm:order-none">
                  <p className="text-sm text-gray-500">
                    Section {currentSection + 1} of {sections.length}
                  </p>
                  {currentSectionData?.quizQuestions && 
                   currentSectionData.quizQuestions.length > 0 && 
                   !sectionCompleted[currentSection] && (
                    <p className="text-xs text-amber-600 mt-1">
                      Complete the quiz to continue
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleSectionChange(Math.min(sections.length - 1, currentSection + 1))}
                  disabled={currentSection === sections.length - 1 || !sectionCompleted[currentSection]}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px] min-w-[100px] w-full sm:w-auto"
                  title={!sectionCompleted[currentSection] ? "Complete the current section to continue" : ""}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl max-h-[95vh] sm:max-h-[90vh] w-full h-full flex items-center justify-center">
            <img 
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 sm:p-3 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-lg">
              <p className="text-xs sm:text-sm">{lightboxImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DynamicEbookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    }>
      <DynamicEbookContent />
    </Suspense>
  );
}
