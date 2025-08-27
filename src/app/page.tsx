import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-magnolia">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gold rounded-md flex items-center justify-center text-white font-bold text-lg">
                SC
              </div>
              <span className="ml-2 text-xl font-semibold text-fg-primary">
                SpecChem LMS
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-fg-primary hover:text-gold font-medium">Home</a>
              <Link href="/navigator" className="text-fg-secondary hover:text-gold font-medium">Training Navigator</Link>
              <Link href="/lms/modules" className="text-fg-secondary hover:text-gold font-medium">Courses</Link>
              <Link href="/lms" className="text-fg-secondary hover:text-gold font-medium">My Progress</Link>
              <Link href="/lms/resources" className="text-fg-secondary hover:text-gold font-medium">Resources</Link>
              <Link href="/handbook" className="text-fg-secondary hover:text-gold font-medium">Handbook</Link>
            </nav>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-magnolia via-slate-50 to-blue-50 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-fg-primary leading-tight mb-6">
              Empowering Your Work Through{' '}
              <span className="text-gold">Knowledge & Compliance</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-fg-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
              Your gateway to essential training on DOT-regulated materials, safety, and SpecChem operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/lms" className="inline-flex items-center px-6 py-3 bg-gold hover:bg-brand-primary-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Training
              </Link>
              
              <Link href="/lms/modules" className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-fg-primary font-semibold rounded-lg border-2 border-gray-200 hover:border-gold transition-all duration-200">
                Browse All Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Compliance Widget */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-lg font-semibold text-gray-900">Compliant</span>
                </div>
                <p className="text-gray-600 text-sm">Current compliance status</p>
              </div>
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-lg font-semibold text-gray-900">Sept 15, 2025</span>
                </div>
                <p className="text-gray-600 text-sm">HazMat Recertification due</p>
              </div>
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="w-6 h-6 bg-gold rounded-full mr-2"></div>
                  <span className="text-lg font-semibold text-gray-900">11/18 Lessons</span>
                </div>
                <p className="text-gray-600 text-sm">Training progress</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Training Available</span>
                <span className="text-sm font-semibold text-gray-900">Ready to Start</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Courses */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">Featured Courses</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Start with our most essential training programs designed for SpecChem professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course Card 1 - Introduction & General Awareness */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">�</div>
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">Required</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                  Introduction & General Awareness
                </h3>
                <p className="text-gray-600 mb-4">
                  Fundamental knowledge of hazardous materials regulations, classifications, and basic safety principles for all SpecChem personnel.
                </p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span>⏱️ 2 hours</span>
                  <span>👥 1,247 learners</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <Link href="/lms/modules/general-awareness" className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200">
                  ✓ Completed
                </Link>
              </div>

              {/* Course Card 2 - Function-Specific Training */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">🚛</div>
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">Required</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                  Function-Specific Training
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed procedures for shipping, handling, loading, and documenting hazardous materials in SpecChem operations.
                </p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span>⏱️ 2.5 hours</span>
                  <span>👥 892 learners</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <Link href="/lms/modules/function-specific" className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200">
                  ✓ Completed
                </Link>
              </div>

              {/* Course Card 3 - Safety & Emergency Response */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">🚨</div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-full">In Progress</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                  Safety & Emergency Response
                </h3>
                <p className="text-gray-600 mb-4">
                  Personal protective equipment, spill response, emergency procedures, and incident reporting protocols.
                </p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span>⏱️ 3 hours</span>
                  <span>👥 756 learners</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gold transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <Link href="/lms/modules/safety-emergency" className="w-full inline-flex items-center justify-center px-4 py-3 bg-gold hover:bg-brand-primary-600 text-white font-semibold rounded-lg transition-all duration-200">
                  ▶️ Continue
                </Link>
              </div>
            </div>

            {/* Additional Courses Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Course Card 4 - Security Awareness */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">🔐</div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">Optional</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                  Security Awareness
                </h3>
                <p className="text-gray-600 mb-4">
                  Security protocols for hazardous materials operations, including threat recognition and response procedures.
                </p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span>⏱️ 1.5 hours</span>
                  <span>👥 743 learners</span>
                </div>
                
                <Link href="/lms/modules/security-awareness" className="w-full inline-flex items-center justify-center px-4 py-3 bg-gold hover:bg-brand-primary-600 text-white font-semibold rounded-lg transition-all duration-200">
                  ▶️ Start Course
                </Link>
              </div>

              {/* Course Card 5 - Advanced Security Training */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">🛡️</div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">Advanced</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                  In-Depth Security Training
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced security training for personnel with access to high-hazard materials, including detailed threat assessment and response.
                </p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span>⏱️ 4 hours</span>
                  <span>👥 234 learners</span>
                </div>
                
                <Link href="/lms/modules/in-depth-security" className="w-full inline-flex items-center justify-center px-4 py-3 bg-gold hover:bg-brand-primary-600 text-white font-semibold rounded-lg transition-all duration-200">
                  ▶️ Start Course
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gold rounded-md flex items-center justify-center text-white font-bold text-lg">
                SC
              </div>
              <span className="ml-2 text-xl font-semibold">SpecChem LMS</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering SpecChem professionals through comprehensive training programs.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 SpecChem. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
