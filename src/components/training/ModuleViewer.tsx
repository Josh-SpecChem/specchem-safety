'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Download,
  ExternalLink,
  Award
} from 'lucide-react'

interface ModuleViewerProps {
  moduleData: {
    id: string
    title: string
    description: string
    duration: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    sections: Array<{
      id: string
      title: string
      content: string
      estimatedReadTime: string
    }>
    learningObjectives: string[]
    resources: Array<{
      id: string
      title: string
      type: string
      url: string
      description: string
    }>
  }
  userProgress: {
    currentSection: string
    sectionsCompleted: string[]
    bookmarks: string[]
    timeSpent: number
    status: 'not-started' | 'in-progress' | 'completed'
  }
  onProgressUpdate: (progress: Record<string, unknown>) => void
}

export default function ModuleViewer({ moduleData, userProgress, onProgressUpdate }: ModuleViewerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [sessionStartTime] = useState(Date.now())

  const currentSection = moduleData.sections[currentSectionIndex]
  const isLastSection = currentSectionIndex === moduleData.sections.length - 1
  const isFirstSection = currentSectionIndex === 0

  useEffect(() => {
    // Find current section index based on user progress
    const currentIndex = moduleData.sections.findIndex(
      section => section.id === userProgress.currentSection
    )
    if (currentIndex >= 0) {
      setCurrentSectionIndex(currentIndex)
    }

    // Check if current section is bookmarked
    setIsBookmarked(userProgress.bookmarks.includes(currentSection?.id || ''))
  }, [userProgress, currentSection?.id, moduleData.sections])

  useEffect(() => {
    // Track reading progress based on scroll position
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrolled / maxHeight) * 100, 100)
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSectionComplete = () => {
    const newProgress = {
      ...userProgress,
      sectionsCompleted: [...userProgress.sectionsCompleted, currentSection.id],
      currentSection: isLastSection ? currentSection.id : moduleData.sections[currentSectionIndex + 1].id,
      timeSpent: userProgress.timeSpent + Math.floor((Date.now() - sessionStartTime) / 1000)
    }

    onProgressUpdate(newProgress)

    if (!isLastSection) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    } else {
      // Module completed
      onProgressUpdate({
        ...newProgress,
        status: 'completed'
      })
    }
  }

  const handleBookmarkToggle = () => {
    const newBookmarks = isBookmarked 
      ? userProgress.bookmarks.filter(id => id !== currentSection.id)
      : [...userProgress.bookmarks, currentSection.id]
    
    setIsBookmarked(!isBookmarked)
    onProgressUpdate({
      ...userProgress,
      bookmarks: newBookmarks
    })
  }

  const navigateToSection = (index: number) => {
    setCurrentSectionIndex(index)
    onProgressUpdate({
      ...userProgress,
      currentSection: moduleData.sections[index].id
    })
  }

  const calculateOverallProgress = () => {
    return Math.round((userProgress.sectionsCompleted.length / moduleData.sections.length) * 100)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (!currentSection) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Module Header */}
      <div className="bg-federal-blue text-white rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{moduleData.title}</h1>
            <p className="text-blue-100 mb-4">{moduleData.description}</p>
            <div className="flex gap-3">
              <Badge variant="secondary" className={`${getDifficultyColor(moduleData.difficulty)} border`}>
                {moduleData.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="h-3 w-3 mr-1" />
                {moduleData.duration}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <BookOpen className="h-3 w-3 mr-1" />
                {moduleData.sections.length} sections
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold mb-1">{calculateOverallProgress()}%</div>
            <div className="text-sm opacity-90">Complete</div>
            <Progress value={calculateOverallProgress()} className="w-24 mt-2 bg-white/20" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Reading Progress */}
          <div className="sticky top-0 bg-white z-10 pb-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Reading Progress</span>
              <span className="text-sm text-gray-500">{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>

          {/* Section Content */}
          <Card className="mb-6">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">{currentSection.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentSection.estimatedReadTime}
                    </span>
                    <span>Section {currentSectionIndex + 1} of {moduleData.sections.length}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBookmarkToggle}
                    className={isBookmarked ? 'text-gold border-gold' : ''}
                  >
                    {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    <StickyNote className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div 
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentSection.content }}
              />

              {/* Notes Section */}
              {showNotes && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Your Notes</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes about this section..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-federal-blue focus:border-transparent"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigateToSection(currentSectionIndex - 1)}
              disabled={isFirstSection}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Section
            </Button>

            {userProgress.sectionsCompleted.includes(currentSection.id) ? (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            ) : (
              <Button
                onClick={handleSectionComplete}
                className="bg-federal-blue hover:bg-federal-blue/90 flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </Button>
            )}

            {isLastSection ? (
              <Button
                className="bg-gold hover:bg-gold/90 flex items-center gap-2"
                disabled={userProgress.status !== 'completed'}
              >
                <Award className="h-4 w-4" />
                Take Assessment
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigateToSection(currentSectionIndex + 1)}
                className="flex items-center gap-2"
              >
                Next Section
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Section Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {moduleData.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => navigateToSection(index)}
                    className={`w-full text-left p-3 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      currentSectionIndex === index ? 'bg-federal-blue text-white hover:bg-federal-blue' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{section.title}</span>
                      {userProgress.sectionsCompleted.includes(section.id) && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {moduleData.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-federal-blue rounded-full mt-2 flex-shrink-0"></div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moduleData.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target={resource.type === 'link' ? '_blank' : undefined}
                    rel={resource.type === 'link' ? 'noopener noreferrer' : undefined}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-federal-blue hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {resource.type === 'link' ? (
                          <ExternalLink className="h-4 w-4 text-federal-blue" />
                        ) : (
                          <Download className="h-4 w-4 text-federal-blue" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {resource.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {resource.description}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
