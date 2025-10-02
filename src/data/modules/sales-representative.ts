import { TrainingModule } from '@/types/domain'

export const SALES_REPRESENTATIVE_MODULES: TrainingModule[] = [
  {
    id: 'sales-product-knowledge',
    title: 'SpecChem Product Portfolio',
    description: 'Comprehensive overview of SpecChem products, applications, and competitive advantages for effective customer consultation.',
    duration: '2 hours',
    difficulty: 'intermediate',
    category: 'product',
    prerequisites: [],
    assessmentRequired: true,
    certificationEligible: true,
    lastUpdated: '2024-12-19',
    content: {
      sections: [
        {
          id: 'intro-overview',
          title: 'Introduction to SpecChem Products',
          estimatedReadTime: '15 minutes',
        order: 1,
          content: `
            <div class="space-y-6">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <h2 class="text-2xl font-bold mb-4">Welcome to SpecChem Product Excellence</h2>
                <p class="text-lg opacity-90">
                  As a SpecChem Sales Representative, you are the face of our company and the gateway to our 
                  innovative construction solutions. This module will equip you with comprehensive knowledge 
                  of our product portfolio to confidently serve customers and drive business growth.
                </p>
              </div>
              
              <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-xl font-semibold text-federal-blue mb-4">Our Product Philosophy</h3>
                <p class="text-gray-700 mb-4">
                  SpecChem has built its reputation on delivering high-performance construction materials that 
                  solve real-world challenges. Every product in our portfolio is designed with three core principles:
                </p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span class="text-white font-bold">Q</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">Quality</h4>
                    <p class="text-sm text-gray-600">Exceeding industry standards in every formulation</p>
                  </div>
                  <div class="text-center p-4 bg-gold/10 rounded-lg">
                    <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-3">
                      <span class="text-white font-bold">P</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">Performance</h4>
                    <p class="text-sm text-gray-600">Reliable results in demanding conditions</p>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span class="text-white font-bold">S</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">Support</h4>
                    <p class="text-sm text-gray-600">Comprehensive technical expertise and service</p>
                  </div>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'core-product-lines',
          title: 'Core Product Lines & Applications',
          estimatedReadTime: '30 minutes',
        order: 2,
          content: `
            <div class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">SpecChem Product Categories</h2>
              
              <div class="grid gap-6">
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                    <h3 class="text-xl font-semibold">Concrete Repair & Restoration</h3>
                    <p class="text-blue-100 mt-1">Structural repair solutions for concrete infrastructure</p>
                  </div>
                  <div class="p-6">
                    <div class="mb-4">
                      <h4 class="font-semibold text-gray-900 mb-2">Key Products:</h4>
                      <ul class="grid md:grid-cols-2 gap-2">
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-blue-500 rounded-full"></span>SpecRepair Fast-Set</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-blue-500 rounded-full"></span>SpecRepair Structural</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-blue-500 rounded-full"></span>SpecPatch Highway</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-blue-500 rounded-full"></span>SpecBond Epoxy Systems</li>
                      </ul>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2">Primary Applications:</h5>
                      <p class="text-sm text-gray-700">
                        Bridge deck repairs, parking structure restoration, industrial floor rehabilitation, 
                        highway concrete patching, precast concrete connections, and structural strengthening projects.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div class="bg-gradient-to-r from-gold to-yellow-600 p-4 text-white">
                    <h3 class="text-xl font-semibold">Protective Coatings & Sealers</h3>
                    <p class="text-yellow-100 mt-1">Surface protection for long-term durability</p>
                  </div>
                  <div class="p-6">
                    <div class="mb-4">
                      <h4 class="font-semibold text-gray-900 mb-2">Key Products:</h4>
                      <ul class="grid md:grid-cols-2 gap-2">
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-gold rounded-full"></span>SpecSeal Penetrating Sealer</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-gold rounded-full"></span>SpecCoat Anti-Carbonation</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-gold rounded-full"></span>SpecGuard Waterproof Membrane</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-gold rounded-full"></span>SpecShield Chemical Resistant</li>
                      </ul>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2">Primary Applications:</h5>
                      <p class="text-sm text-gray-700">
                        Concrete surface protection, waterproofing systems, chemical containment areas, 
                        parking deck membranes, industrial floor coatings, and architectural concrete preservation.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div class="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                    <h3 class="text-xl font-semibold">Specialty Construction Products</h3>
                    <p class="text-green-100 mt-1">Innovative solutions for unique construction challenges</p>
                  </div>
                  <div class="p-6">
                    <div class="mb-4">
                      <h4 class="font-semibold text-gray-900 mb-2">Key Products:</h4>
                      <ul class="grid md:grid-cols-2 gap-2">
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full"></span>SpecAnchor Post-Install</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full"></span>SpecGrout Non-Shrink</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full"></span>SpecLevel Self-Leveling</li>
                        <li class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full"></span>SpecJoint Sealants</li>
                      </ul>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2">Primary Applications:</h5>
                      <p class="text-sm text-gray-700">
                        Post-installed anchoring systems, equipment grouting, floor leveling compounds, 
                        expansion joint sealing, tilt-up construction, and specialized structural connections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'competitive-advantages',
          title: 'Competitive Advantages & Value Propositions',
          estimatedReadTime: '25 minutes',
        order: 3,
          content: `
            <div class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Why Customers Choose SpecChem</h2>
              
              <div class="bg-federal-blue p-6 rounded-xl text-white">
                <h3 class="text-xl font-semibold mb-3">Our Competitive Edge</h3>
                <p class="text-blue-100">
                  Understanding what sets SpecChem apart from competitors is crucial for effective 
                  customer consultation and value-based selling. Here are the key differentiators 
                  that drive customer loyalty and project success.
                </p>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-bold">1</span>
                    </div>
                    Technical Excellence
                  </h4>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>In-House Laboratory:</strong> Every product batch tested for consistency and performance
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Field-Proven Formulations:</strong> Products tested in real-world conditions for reliability
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Technical Support:</strong> On-site engineering support and application guidance
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div class="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-bold">2</span>
                    </div>
                    Service Excellence
                  </h4>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-gold rounded-full mt-2"></div>
                      <div>
                        <strong>Responsive Delivery:</strong> Strategic locations ensure timely product availability
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-gold rounded-full mt-2"></div>
                      <div>
                        <strong>Project Consultation:</strong> Pre-project planning and specification development
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-gold rounded-full mt-2"></div>
                      <div>
                        <strong>Training Programs:</strong> Contractor education and certification programs
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-bold">3</span>
                    </div>
                    Innovation Leadership
                  </h4>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Continuous R&D:</strong> Ongoing product development for emerging market needs
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Sustainable Solutions:</strong> Environmentally responsible formulations and practices
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Industry Partnerships:</strong> Collaboration with leading construction professionals
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-bold">4</span>
                    </div>
                    Value Delivery
                  </h4>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Total Cost of Ownership:</strong> Long-term value through durability and performance
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Risk Mitigation:</strong> Proven track record reduces project risks and delays
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Warranty Support:</strong> Comprehensive product warranties and technical backing
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl text-white">
                <h3 class="text-lg font-semibold mb-3">Key Sales Messages</h3>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gold mb-1">25+</div>
                    <div class="text-sm text-gray-300">Years of Innovation</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gold mb-1">1000+</div>
                    <div class="text-sm text-gray-300">Successful Projects</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gold mb-1">99%</div>
                    <div class="text-sm text-gray-300">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          `
        }
      ],
      resources: [
        {
          id: 'product-catalog',
          title: 'SpecChem Product Catalog 2025',
          type: 'pdf',
          url: '/resources/product-catalog-2025.pdf',
          description: 'Comprehensive catalog with specifications and applications',
          downloadable: true
        },
        {
          id: 'competitor-analysis',
          title: 'Competitive Analysis Guide',
          type: 'pdf',
          url: '/resources/competitive-analysis.pdf',
          description: 'Detailed comparison with major competitors',
          downloadable: true
        },
        {
          id: 'technical-data-sheets',
          title: 'Technical Data Sheets Collection',
          type: 'link',
          url: '/resources/tds-collection',
          description: 'Access all product technical data sheets',
          downloadable: false
        },
        {
          id: 'handbook-products',
          title: 'Employee Handbook - Products Section',
          type: 'handbook-section',
          url: '/handbook#products',
          description: 'Related handbook information on products',
          downloadable: false
        }
      ],
      assessment: {
        id: 'product-knowledge-assessment',
        title: 'Product Knowledge Certification',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'What are the three core principles that guide SpecChem product development?',
            options: [
              'Quality, Performance, Support',
              'Speed, Cost, Quality',
              'Innovation, Service, Price',
              'Safety, Durability, Efficiency'
            ],
            correctAnswer: 'Quality, Performance, Support',
            explanation: 'SpecChem builds every product around Quality (exceeding industry standards), Performance (reliable results in demanding conditions), and Support (comprehensive technical expertise).',
            points: 4,
            difficulty: 'easy'
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Which product line would be most appropriate for a bridge deck repair project requiring structural restoration?',
            options: [
              'SpecSeal Penetrating Sealer',
              'SpecRepair Structural',
              'SpecAnchor Post-Install',
              'SpecCoat Anti-Carbonation'
            ],
            correctAnswer: 'SpecRepair Structural',
            explanation: 'SpecRepair Structural is specifically designed for structural concrete repairs, making it the ideal choice for bridge deck restoration projects.',
            points: 4,
            difficulty: 'medium'
          },
          {
            id: 'q3',
            type: 'scenario',
            question: 'A customer asks about waterproofing options for a parking garage deck that experiences heavy traffic and chemical exposure. What would be your recommended approach?',
            options: [
              'Recommend SpecSeal Penetrating Sealer for basic protection',
              'Suggest SpecGuard Waterproof Membrane with SpecShield Chemical Resistant topcoat',
              'Propose SpecRepair Fast-Set for structural issues first',
              'Recommend SpecLevel Self-Leveling for surface preparation'
            ],
            correctAnswer: 'Suggest SpecGuard Waterproof Membrane with SpecShield Chemical Resistant topcoat',
            explanation: 'Parking garage decks need comprehensive waterproofing (SpecGuard) plus chemical resistance (SpecShield) to handle both water intrusion and chemical exposure from vehicles.',
            points: 5,
            difficulty: 'hard'
          }
        ],
        passingScore: 80,
        maxAttempts: 3,
        timeLimit: 45,
        showFeedback: true,
        certificateGeneration: true
      }
    }
  }
]
