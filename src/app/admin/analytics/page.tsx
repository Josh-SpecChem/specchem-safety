import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Analytics Dashboard | SpecChem Safety Training',
  description: 'Training analytics and performance metrics',
}

// Mock analytics data - will be replaced with real API calls
const mockAnalytics = {
  overview: {
    totalCompletions: 1247,
    avgCompletionTime: '4.2 hours',
    topPerformingPlant: 'Denver, CO',
    lowPerformingPlant: 'Seattle, WA'
  },
  completionRates: [
    { plant: 'Columbus, OH - Corporate', rate: 92, users: 45, completed: 41 },
    { plant: 'Atlanta, GA', rate: 87, users: 32, completed: 28 },
    { plant: 'Denver, CO', rate: 94, users: 28, completed: 26 },
    { plant: 'Seattle, WA', rate: 79, users: 41, completed: 32 },
    { plant: 'Phoenix, AZ', rate: 85, users: 35, completed: 30 },
    { plant: 'Dallas, TX', rate: 91, users: 38, completed: 35 },
    { plant: 'Chicago, IL', rate: 88, users: 29, completed: 26 },
    { plant: 'Miami, FL', rate: 83, users: 27, completed: 22 }
  ],
  coursePerformance: [
    {
      course: 'Function-Specific HazMat Training',
      enrollments: 247,
      completions: 189,
      avgScore: 87,
      avgTime: '4.2 hours'
    },
    {
      course: 'Capacitación Específica de HazMat por Función',
      enrollments: 156,
      completions: 134,
      avgScore: 89,
      avgTime: '4.5 hours'
    }
  ],
  monthlyTrends: [
    { month: 'Jan', enrollments: 45, completions: 32 },
    { month: 'Feb', enrollments: 52, completions: 41 },
    { month: 'Mar', enrollments: 61, completions: 48 },
    { month: 'Apr', enrollments: 58, completions: 52 },
    { month: 'May', enrollments: 67, completions: 59 },
    { month: 'Jun', enrollments: 73, completions: 64 },
    { month: 'Jul', enrollments: 68, completions: 61 },
    { month: 'Aug', enrollments: 71, completions: 67 },
    { month: 'Sep', enrollments: 69, completions: 63 }
  ],
  questionAnalytics: [
    { 
      section: 'Drum Closure Systems', 
      totalQuestions: 12, 
      avgAccuracy: 78, 
      commonMistakes: 'Torque specifications, seal types' 
    },
    { 
      section: 'Chemical Compatibility', 
      totalQuestions: 15, 
      avgAccuracy: 85, 
      commonMistakes: 'pH levels, material interactions' 
    },
    { 
      section: 'Safety Procedures', 
      totalQuestions: 18, 
      avgAccuracy: 92, 
      commonMistakes: 'PPE requirements, emergency protocols' 
    },
    { 
      section: 'Regulatory Compliance', 
      totalQuestions: 10, 
      avgAccuracy: 73, 
      commonMistakes: 'DOT regulations, labeling requirements' 
    }
  ]
}

function getPerformanceBadge(rate: number) {
  if (rate >= 90) return 'bg-green-100 text-green-800'
  if (rate >= 80) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

export default function AnalyticsDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Training performance metrics and insights
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="m9 12 2 2 4-4" />
                  <path d="M21 12c.552 0 1.448-.043 2-1a9.804 9.804 0 0 0 0-2c-.552-.957-1.448-1-2-1H3c-.552 0-1.448.043-2 1a9.804 9.804 0 0 0 0 2c.552.957 1.448 1 2 1h18Z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.overview.totalCompletions}</div>
                <p className="text-xs text-muted-foreground">
                  All-time course completions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.overview.avgCompletionTime}</div>
                <p className="text-xs text-muted-foreground">
                  Average time to complete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockAnalytics.overview.topPerformingPlant}
                </div>
                <p className="text-xs text-muted-foreground">
                  Highest completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="m12 17 .01 0" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {mockAnalytics.overview.lowPerformingPlant}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowest completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Plant Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Plant Performance</CardTitle>
                <CardDescription>
                  Completion rates by plant location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.completionRates.map((plant, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{plant.plant}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">
                            {plant.completed}/{plant.users}
                          </span>
                          <Badge className={getPerformanceBadge(plant.rate)}>
                            {plant.rate}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${plant.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>
                  Metrics by individual courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockAnalytics.coursePerformance.map((course, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{course.course}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Enrollments:</span>
                          <span className="ml-2 font-medium">{course.enrollments}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Completions:</span>
                          <span className="ml-2 font-medium">{course.completions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Score:</span>
                          <span className="ml-2 font-medium">{course.avgScore}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Time:</span>
                          <span className="ml-2 font-medium">{course.avgTime}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(course.completions / course.enrollments) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((course.completions / course.enrollments) * 100)}% completion rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Question Analytics</CardTitle>
              <CardDescription>
                Performance analysis by training section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Section</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Questions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Accuracy</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Common Mistakes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAnalytics.questionAnalytics.map((section, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {section.section}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {section.totalQuestions}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Badge className={getPerformanceBadge(section.avgAccuracy)}>
                              {section.avgAccuracy}%
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {section.commonMistakes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}