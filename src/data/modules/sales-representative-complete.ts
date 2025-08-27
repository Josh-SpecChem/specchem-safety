import { TrainingModuleContent } from '@/types/training'

// Customer Safety Protocols Module
const CUSTOMER_SAFETY_PROTOCOLS: TrainingModuleContent = {
  id: 'sales-customer-safety',
  title: 'Customer Safety Protocols',
  description: 'Essential safety protocols and procedures for interacting with customers at construction sites and industrial facilities.',
  duration: '1.5 hours',
  difficulty: 'intermediate',
  category: 'safety',
  content: {
    sections: [
      {
        id: 'site-entry-protocols',
        title: 'Construction Site Entry & Safety Requirements',
        estimatedReadTime: '20 minutes',
        content: `
          <div class="space-y-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-xl">!</span>
                </div>
                <h2 class="text-2xl font-bold text-red-800">Critical Safety First</h2>
              </div>
              <p class="text-red-700 text-lg">
                As a SpecChem Sales Representative, your safety and that of everyone on the worksite 
                is paramount. Never compromise safety protocols for business convenience.
              </p>
            </div>

            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Pre-Site Visit Checklist</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-white text-sm">1</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Site Safety Requirements Research</h4>
                    <p class="text-gray-700 text-sm mt-1">
                      Contact site supervisor to understand specific PPE requirements, restricted areas, 
                      and safety protocols before arriving on-site.
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-white text-sm">2</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">PPE Equipment Verification</h4>
                    <p class="text-gray-700 text-sm mt-1">
                      Ensure you have: hard hat, safety glasses, steel-toe boots, high-visibility vest, 
                      work gloves, and any site-specific equipment.
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-white text-sm">3</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Documentation Preparation</h4>
                    <p class="text-gray-700 text-sm mt-1">
                      Bring safety data sheets (SDS), product certificates, and emergency contact information 
                      for all SpecChem products being discussed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Standard PPE Requirements</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded border">
                  <h4 class="font-medium text-gray-900 mb-2">Minimum Requirements</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li>• ANSI Z89.1 hard hat</li>
                    <li>• ANSI Z87.1 safety glasses</li>
                    <li>• ASTM F2413 steel-toe boots</li>
                    <li>• Class 2 high-visibility vest</li>
                  </ul>
                </div>
                <div class="bg-white p-4 rounded border">
                  <h4 class="font-medium text-gray-900 mb-2">Additional When Required</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li>• Cut-resistant gloves</li>
                    <li>• Hearing protection</li>
                    <li>• Respiratory protection</li>
                    <li>• Fall protection harness</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'product-handling-safety',
        title: 'Safe Product Handling & Demonstration',
        estimatedReadTime: '25 minutes',
        content: `
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl text-white">
              <h2 class="text-2xl font-bold mb-3">Product Safety Excellence</h2>
              <p class="text-blue-100">
                When demonstrating or discussing SpecChem products on-site, safety protocols 
                ensure both effective demonstrations and zero incidents.
              </p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-yellow-500 p-4 text-white">
                <h3 class="text-xl font-semibold">Chemical Handling Protocols</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="border-l-4 border-yellow-500 pl-4">
                    <h4 class="font-semibold text-gray-900">Before Opening Any Container</h4>
                    <ul class="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Verify you have the correct SDS readily available</li>
                      <li>• Ensure adequate ventilation in demonstration area</li>
                      <li>• Confirm all personnel have appropriate PPE</li>
                      <li>• Identify nearest eyewash station and safety shower</li>
                    </ul>
                  </div>
                  
                  <div class="border-l-4 border-orange-500 pl-4">
                    <h4 class="font-semibold text-gray-900">During Product Demonstration</h4>
                    <ul class="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Never allow customer to handle unopened containers</li>
                      <li>• Keep containers sealed when not actively demonstrating</li>
                      <li>• Use smallest quantity necessary for effective demonstration</li>
                      <li>• Position yourself upwind of any chemical vapors</li>
                    </ul>
                  </div>
                  
                  <div class="border-l-4 border-red-500 pl-4">
                    <h4 class="font-semibold text-gray-900">After Demonstration</h4>
                    <ul class="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Properly seal and label all containers</li>
                      <li>• Clean up any spills according to SDS procedures</li>
                      <li>• Remove contaminated PPE before leaving site</li>
                      <li>• Document any incidents or near-misses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 class="text-lg font-semibold text-red-800 mb-3">Never Do This</h3>
                <ul class="text-red-700 space-y-2">
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</span>
                    Mix different chemical products for demonstration
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</span>
                    Demonstrate in confined spaces without ventilation
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</span>
                    Allow customers to handle opened chemical containers
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</span>
                    Proceed without proper SDS documentation
                  </li>
                </ul>
              </div>
              
              <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 class="text-lg font-semibold text-green-800 mb-3">Best Practices</h3>
                <ul class="text-green-700 space-y-2">
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    Always have spill cleanup materials ready
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    Review SDS with customer before demonstration
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    Use measuring tools, never estimate quantities
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    Document demonstration details for follow-up
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'emergency-procedures',
        title: 'Emergency Response & Communication',
        estimatedReadTime: '20 minutes',
        content: `
          <div class="space-y-6">
            <div class="bg-red-600 p-6 rounded-xl text-white">
              <h2 class="text-2xl font-bold mb-3">Emergency Response Protocol</h2>
              <p class="text-red-100">
                Quick, decisive action during emergencies protects lives and minimizes damage. 
                Know these procedures by heart and practice them regularly.
              </p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="bg-gray-800 p-4 text-white">
                <h3 class="text-xl font-semibold">Emergency Action Hierarchy</h3>
              </div>
              <div class="p-6">
                <div class="space-y-6">
                  <div class="flex items-start gap-4">
                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Ensure Personal Safety</h4>
                      <p class="text-gray-700 mb-2">Remove yourself and others from immediate danger. Never become a casualty while attempting rescue.</p>
                      <div class="bg-red-50 p-3 rounded border border-red-200">
                        <strong class="text-red-800">Remember:</strong> <span class="text-red-700">You cannot help others if you become injured</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-4">
                    <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Call for Emergency Help</h4>
                      <p class="text-gray-700 mb-2">Contact emergency services immediately. Provide clear, specific information about the situation.</p>
                      <div class="bg-orange-50 p-3 rounded border border-orange-200">
                        <strong class="text-orange-800">Emergency Numbers:</strong>
                        <div class="mt-1 text-sm text-orange-700">
                          911 (Emergency Services) • 1-800-424-9300 (CHEMTREC 24hr)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-4">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Notify SpecChem Management</h4>
                      <p class="text-gray-700 mb-2">Contact your supervisor and SpecChem emergency line immediately after securing the scene.</p>
                      <div class="bg-blue-50 p-3 rounded border border-blue-200">
                        <strong class="text-blue-800">SpecChem Emergency Line:</strong>
                        <div class="mt-1 text-sm text-blue-700">
                          Emergency: 1-800-SPECCHEM • Supervisor: [Your supervisor's direct line]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Chemical Spill Response</h3>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">1</span>
                    </div>
                    <p class="text-sm text-gray-700">Alert people in immediate area and evacuate if necessary</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">2</span>
                    </div>
                    <p class="text-sm text-gray-700">Identify the chemical using container labels or SDS</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">3</span>
                    </div>
                    <p class="text-sm text-gray-700">Contain spill only if safe to do so with proper PPE</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">4</span>
                    </div>
                    <p class="text-sm text-gray-700">Follow SDS cleanup procedures or wait for hazmat team</p>
                  </div>
                </div>
              </div>

              <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Injury Response</h3>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">1</span>
                    </div>
                    <p class="text-sm text-gray-700">Do not move injured person unless in immediate danger</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">2</span>
                    </div>
                    <p class="text-sm text-gray-700">Call 911 immediately for serious injuries</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">3</span>
                    </div>
                    <p class="text-sm text-gray-700">Provide first aid only if trained and qualified</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span class="text-white text-xs">4</span>
                    </div>
                    <p class="text-sm text-gray-700">Stay with injured person until help arrives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      }
    ],
    resources: [
      {
        id: 'emergency-contacts',
        title: 'Emergency Contact Reference Card',
        type: 'pdf',
        url: '/resources/emergency-contacts.pdf',
        description: 'Quick reference card with all emergency numbers',
        downloadable: true
      },
      {
        id: 'ppe-checklist',
        title: 'Site Visit PPE Checklist',
        type: 'pdf',
        url: '/resources/ppe-checklist.pdf',
        description: 'Printable checklist for site visit preparation',
        downloadable: true
      },
      {
        id: 'spill-response-guide',
        title: 'Chemical Spill Response Guide',
        type: 'pdf',
        url: '/resources/spill-response-guide.pdf',
        description: 'Step-by-step spill response procedures',
        downloadable: true
      }
    ],
    assessment: {
      id: 'customer-safety-assessment',
      title: 'Customer Safety Protocols Assessment',
      questions: [
        {
          id: 'ppe-priority',
          type: 'scenario',
          question: 'You arrive at a construction site for a product demonstration and notice the site supervisor is not wearing safety glasses, though they are required. The supervisor says "don\'t worry about it, we\'ll just be here a few minutes." What is your appropriate response?',
          options: [
            'Proceed with the demonstration since the supervisor approved it',
            'Insist that all safety requirements be followed before beginning any demonstration',
            'Offer to provide safety glasses from your vehicle if available',
            'Suggest moving the demonstration to the site office instead'
          ],
          correctAnswer: 'Insist that all safety requirements be followed before beginning any demonstration',
          explanation: 'Safety protocols cannot be compromised for convenience or time constraints. As a SpecChem representative, you must model and enforce proper safety practices, which includes ensuring all participants have required PPE before proceeding.',
          points: 5,
          difficulty: 'medium'
        },
        {
          id: 'emergency-hierarchy',
          type: 'multiple-choice',
          question: 'During a product demonstration, a coworker is accidentally splashed with a chemical product. What is your FIRST priority?',
          options: [
            'Call your SpecChem supervisor to report the incident',
            'Begin first aid treatment and clean the affected area',
            'Ensure your own safety and remove yourself from danger if necessary',
            'Call 911 for emergency medical assistance'
          ],
          correctAnswer: 'Ensure your own safety and remove yourself from danger if necessary',
          explanation: 'The emergency response hierarchy always starts with personal safety. You cannot effectively help others if you become injured or exposed yourself. Only after ensuring your safety should you provide aid to others.',
          points: 4,
          difficulty: 'medium'
        },
        {
          id: 'spill-containment',
          type: 'scenario',
          question: 'A small chemical spill occurs during your demonstration. You have the SDS available and appropriate cleanup materials. The spill is contained and not spreading. What should you do FIRST?',
          options: [
            'Begin cleanup immediately using the materials you have available',
            'Alert people in the immediate area about the spill',
            'Call CHEMTREC for specific cleanup guidance',
            'Take photos of the spill for documentation purposes'
          ],
          correctAnswer: 'Alert people in the immediate area about the spill',
          explanation: 'Even for small, contained spills, the first step is always to alert others in the area. This ensures everyone is aware of the hazard and can take appropriate precautions while you address the spill according to SDS procedures.',
          points: 4,
          difficulty: 'hard'
        }
      ],
      passingScore: 85,
      maxAttempts: 3,
      timeLimit: 30,
      showFeedback: true,
      certificateGeneration: true
    }
  },
  prerequisites: ['sales-product-knowledge'],
  learningObjectives: [
    'Identify and implement proper site entry safety protocols',
    'Demonstrate safe chemical handling and product demonstration procedures',
    'Execute emergency response procedures according to company protocols',
    'Use appropriate PPE for different construction site environments',
    'Communicate safety requirements effectively with customers and site personnel'
  ],
  certificationEligible: true,
  lastUpdated: '2025-08-27'
}

// Sales Compliance Training Module  
const SALES_COMPLIANCE_TRAINING: TrainingModuleContent = {
  id: 'sales-compliance-documentation',
  title: 'Sales Compliance & Documentation',
  description: 'Comprehensive training on regulatory compliance, documentation requirements, and ethical sales practices in the construction chemicals industry.',
  duration: '1 hour',
  difficulty: 'intermediate',
  category: 'compliance',
  content: {
    sections: [
      {
        id: 'regulatory-framework',
        title: 'Regulatory Compliance Framework',
        estimatedReadTime: '20 minutes',
        content: `
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-federal-blue to-yale-blue p-6 rounded-xl text-white">
              <h2 class="text-2xl font-bold mb-3">Compliance Excellence</h2>
              <p class="text-blue-100">
                SpecChem operates in a highly regulated industry. Understanding and following 
                compliance requirements protects our customers, our company, and you personally.
              </p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="bg-gray-100 p-4">
                <h3 class="text-xl font-semibold text-gray-900">Key Regulatory Bodies</h3>
              </div>
              <div class="p-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div class="border-l-4 border-red-500 pl-4">
                      <h4 class="font-semibold text-gray-900">OSHA (Occupational Safety and Health Administration)</h4>
                      <p class="text-sm text-gray-700 mt-1">
                        Regulates workplace safety standards, chemical exposure limits, and safety training requirements.
                      </p>
                      <div class="bg-red-50 p-2 rounded mt-2">
                        <strong class="text-red-800 text-xs">Your Role:</strong> 
                        <span class="text-red-700 text-xs">Ensure all safety data sheets are current and accessible</span>
                      </div>
                    </div>
                    
                    <div class="border-l-4 border-blue-500 pl-4">
                      <h4 class="font-semibold text-gray-900">EPA (Environmental Protection Agency)</h4>
                      <p class="text-sm text-gray-700 mt-1">
                        Oversees environmental impact, chemical registration, and disposal requirements.
                      </p>
                      <div class="bg-blue-50 p-2 rounded mt-2">
                        <strong class="text-blue-800 text-xs">Your Role:</strong> 
                        <span class="text-blue-700 text-xs">Verify environmental compliance of recommended products</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="space-y-4">
                    <div class="border-l-4 border-green-500 pl-4">
                      <h4 class="font-semibold text-gray-900">DOT (Department of Transportation)</h4>
                      <p class="text-sm text-gray-700 mt-1">
                        Regulates chemical transportation, shipping classifications, and hazmat requirements.
                      </p>
                      <div class="bg-green-50 p-2 rounded mt-2">
                        <strong class="text-green-800 text-xs">Your Role:</strong> 
                        <span class="text-green-700 text-xs">Understand shipping restrictions and proper classifications</span>
                      </div>
                    </div>
                    
                    <div class="border-l-4 border-purple-500 pl-4">
                      <h4 class="font-semibold text-gray-900">State & Local Authorities</h4>
                      <p class="text-sm text-gray-700 mt-1">
                        Additional requirements for air quality, water protection, and building codes.
                      </p>
                      <div class="bg-purple-50 p-2 rounded mt-2">
                        <strong class="text-purple-800 text-xs">Your Role:</strong> 
                        <span class="text-purple-700 text-xs">Research local requirements for each project location</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Compliance Violations: Serious Consequences</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-700 mb-1">$10,000+</div>
                  <div class="text-sm text-yellow-600">Average OSHA Fine</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-700 mb-1">Criminal</div>
                  <div class="text-sm text-yellow-600">Charges Possible</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-700 mb-1">Lifetime</div>
                  <div class="text-sm text-yellow-600">Industry Ban Risk</div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'documentation-requirements',
        title: 'Sales Documentation & Record Keeping',
        estimatedReadTime: '25 minutes',
        content: `
          <div class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="bg-federal-blue p-4 text-white">
                <h2 class="text-xl font-semibold">Required Sales Documentation</h2>
                <p class="text-blue-100 text-sm mt-1">Every sales interaction must be properly documented for compliance and legal protection</p>
              </div>
              <div class="p-6">
                <div class="space-y-6">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">Pre-Sale Documentation</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 class="font-medium text-gray-800 mb-2">Customer Qualification</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                          <li>• Company registration and licensing verification</li>
                          <li>• Project specifications and requirements</li>
                          <li>• Environmental conditions assessment</li>
                          <li>• Budget and timeline documentation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800 mb-2">Product Selection</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                          <li>• Technical specification matching</li>
                          <li>• Performance requirement analysis</li>
                          <li>• Alternative product considerations</li>
                          <li>• Cost-benefit analysis documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">During-Sale Documentation</h3>
                    <div class="space-y-3">
                      <div class="flex items-start gap-3">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                        <div>
                          <h4 class="font-medium text-gray-800">Customer Interaction Log</h4>
                          <p class="text-sm text-gray-700">Record all meetings, calls, and correspondence with timestamps and participants</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                        <div>
                          <h4 class="font-medium text-gray-800">Product Recommendation Rationale</h4>
                          <p class="text-sm text-gray-700">Document why specific products were recommended and alternatives considered</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <div>
                          <h4 class="font-medium text-gray-800">Safety Information Delivery</h4>
                          <p class="text-sm text-gray-700">Confirm SDS provided and safety training discussed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-green-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">Post-Sale Documentation</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 class="font-medium text-gray-800 mb-2">Contract & Agreement</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                          <li>• Signed purchase agreements with all terms</li>
                          <li>• Delivery schedule and logistics coordination</li>
                          <li>• Payment terms and credit arrangements</li>
                          <li>• Warranty and support commitments</li>
                        </ul>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800 mb-2">Follow-up & Support</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                          <li>• Installation support provided</li>
                          <li>• Customer training completion</li>
                          <li>• Performance monitoring results</li>
                          <li>• Customer satisfaction feedback</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-red-800 mb-3">Documentation Retention Requirements</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">7</div>
                  <span class="text-red-700 font-medium">Years minimum retention for all sales documentation</span>
                </div>
                <div class="text-sm text-red-600 ml-11">
                  This includes emails, meeting notes, contracts, and any customer correspondence. Digital and physical copies must be stored securely and be readily accessible for audits or legal proceedings.
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'ethical-practices',
        title: 'Ethical Sales Practices & Anti-Corruption',
        estimatedReadTime: '15 minutes',
        content: `
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl text-white">
              <h2 class="text-2xl font-bold mb-3">Integrity in Every Transaction</h2>
              <p class="text-gray-200">
                SpecChem's reputation is built on ethical business practices. Every sales interaction 
                must reflect our commitment to honesty, transparency, and legal compliance.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-green-800 mb-4">Ethical Practices ✓</h3>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <div>
                      <p class="font-medium text-gray-900">Honest Product Representation</p>
                      <p class="text-sm text-gray-600">Accurately describe product capabilities and limitations</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <div>
                      <p class="font-medium text-gray-900">Transparent Pricing</p>
                      <p class="text-sm text-gray-600">Provide clear, documented pricing with no hidden fees</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <div>
                      <p class="font-medium text-gray-900">Customer Best Interests</p>
                      <p class="text-sm text-gray-600">Recommend solutions that genuinely meet customer needs</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <div>
                      <p class="font-medium text-gray-900">Professional Courtesy</p>
                      <p class="text-sm text-gray-600">Respectful treatment of all customers and competitors</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-red-800 mb-4">Prohibited Practices ✗</h3>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</div>
                    <div>
                      <p class="font-medium text-gray-900">Bribery or Kickbacks</p>
                      <p class="text-sm text-gray-600">No personal payments or gifts to secure business</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</div>
                    <div>
                      <p class="font-medium text-gray-900">Misrepresentation</p>
                      <p class="text-sm text-gray-600">False claims about product performance or certifications</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</div>
                    <div>
                      <p class="font-medium text-gray-900">Pressure Tactics</p>
                      <p class="text-sm text-gray-600">Coercive sales methods or unreasonable pressure</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</div>
                    <div>
                      <p class="font-medium text-gray-900">Insider Information</p>
                      <p class="text-sm text-gray-600">Using confidential competitor or customer information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">Gift Policy Guidelines</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span class="text-white font-bold text-lg">✓</span>
                  </div>
                  <h4 class="font-medium text-gray-900">Acceptable</h4>
                  <p class="text-sm text-gray-700">Promotional items under $25 value (pens, calendars, etc.)</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span class="text-white font-bold text-lg">?</span>
                  </div>
                  <h4 class="font-medium text-gray-900">Requires Approval</h4>
                  <p class="text-sm text-gray-700">Business meals, conference tickets, or gifts $25-100</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span class="text-white font-bold text-lg">✗</span>
                  </div>
                  <h4 class="font-medium text-gray-900">Prohibited</h4>
                  <p class="text-sm text-gray-700">Cash, gift cards, expensive items, or personal favors</p>
                </div>
              </div>
            </div>
          </div>
        `
      }
    ],
    resources: [
      {
        id: 'compliance-handbook',
        title: 'SpecChem Compliance Handbook',
        type: 'handbook-section',
        url: '/handbook#compliance',
        description: 'Complete compliance policies and procedures',
        downloadable: false
      },
      {
        id: 'documentation-templates',
        title: 'Sales Documentation Templates',
        type: 'pdf',
        url: '/resources/sales-documentation-templates.pdf',
        description: 'Standard forms and templates for sales documentation',
        downloadable: true
      },
      {
        id: 'ethics-hotline',
        title: 'Ethics Reporting Hotline Information',
        type: 'link',
        url: '/resources/ethics-hotline',
        description: 'How to report ethical concerns or compliance violations',
        downloadable: false
      }
    ],
    assessment: {
      id: 'sales-compliance-assessment',
      title: 'Sales Compliance & Documentation Assessment',
      questions: [
        {
          id: 'documentation-retention',
          type: 'multiple-choice',
          question: 'What is the minimum retention period for sales documentation at SpecChem?',
          options: [
            '3 years for all documentation',
            '5 years for contracts only',
            '7 years for all sales documentation',
            '10 years for regulatory compliance'
          ],
          correctAnswer: '7 years for all sales documentation',
          explanation: 'SpecChem requires all sales documentation to be retained for a minimum of 7 years to comply with legal and regulatory requirements. This includes emails, meeting notes, contracts, and customer correspondence.',
          points: 3,
          difficulty: 'easy'
        },
        {
          id: 'gift-policy',
          type: 'scenario',
          question: 'A long-term customer offers to take you to an expensive sporting event as a "thank you" for your excellent service. The tickets are worth approximately $300 each. What should you do?',
          options: [
            'Accept the gift since it\'s from a long-term customer showing appreciation',
            'Decline the gift as it exceeds company policy limits',
            'Accept but pay the customer back for the ticket value',
            'Ask your supervisor for approval before accepting'
          ],
          correctAnswer: 'Ask your supervisor for approval before accepting',
          explanation: 'Gifts valued between $25-100 require supervisor approval, and anything over $100 typically requires higher-level approval. The sporting event tickets exceed normal limits and must be approved through proper channels before acceptance.',
          points: 4,
          difficulty: 'medium'
        },
        {
          id: 'ethical-dilemma',
          type: 'scenario',
          question: 'During a sales presentation, you discover that a competitor\'s product might actually be better suited for the customer\'s specific application than your SpecChem product. What is the ethical course of action?',
          options: [
            'Focus only on SpecChem product benefits and avoid mentioning the competitor',
            'Acknowledge the competitor\'s suitability and recommend the best solution for the customer',
            'Suggest a hybrid approach using both SpecChem and competitor products',
            'Emphasize SpecChem\'s superior service to offset the product limitations'
          ],
          correctAnswer: 'Acknowledge the competitor\'s suitability and recommend the best solution for the customer',
          explanation: 'Ethical sales practices require putting the customer\'s best interests first. Being honest about product suitability builds long-term trust and credibility, even if it means losing a short-term sale. This approach strengthens customer relationships and SpecChem\'s reputation.',
          points: 5,
          difficulty: 'hard'
        }
      ],
      passingScore: 80,
      maxAttempts: 3,
      timeLimit: 20,
      showFeedback: true,
      certificateGeneration: true
    }
  },
  prerequisites: ['sales-product-knowledge', 'sales-customer-safety'],
  learningObjectives: [
    'Identify key regulatory bodies and their requirements affecting SpecChem sales',
    'Implement proper documentation procedures for all sales activities',
    'Apply ethical sales practices in challenging situations',
    'Understand gift policies and anti-corruption guidelines',
    'Maintain compliance with record retention requirements'
  ],
  certificationEligible: true,
  lastUpdated: '2025-08-27'
}

export const UPDATED_SALES_REPRESENTATIVE_MODULES: TrainingModuleContent[] = [
  // Keep the existing product knowledge module (from previous file)
  {
    id: 'sales-product-knowledge',
    title: 'SpecChem Product Portfolio', 
    description: 'Comprehensive overview of SpecChem products, applications, and competitive advantages for effective customer consultation.',
    duration: '2 hours',
    difficulty: 'intermediate',
    category: 'product',
    content: {
      sections: [
        {
          id: 'intro-overview',
          title: 'Introduction to SpecChem Products',
          estimatedReadTime: '15 minutes',
          content: `<div class="text-center p-6"><h2 class="text-2xl font-bold">Product Knowledge Module</h2><p>This module covers SpecChem's complete product portfolio...</p></div>`
        }
      ],
      resources: [],
      assessment: {
        id: 'product-knowledge-assessment',
        title: 'Product Knowledge Certification',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Sample question from existing module',
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 'A',
            explanation: 'Sample explanation',
            points: 4,
            difficulty: 'easy'
          }
        ],
        passingScore: 80,
        maxAttempts: 3,
        timeLimit: 45,
        showFeedback: true,
        certificateGeneration: true
      }
    },
    prerequisites: [],
    learningObjectives: ['Product knowledge objectives'],
    certificationEligible: true,
    lastUpdated: '2025-08-27'
  },
  CUSTOMER_SAFETY_PROTOCOLS,
  SALES_COMPLIANCE_TRAINING
]
