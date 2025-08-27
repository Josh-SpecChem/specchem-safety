import { SpecChemRole, TrainingModule, TrainingPath } from '@/types/navigator'

export const SPECCHEM_ROLES: SpecChemRole[] = [
  {
    id: 'sales-rep',
    name: 'sales-representative',
    title: 'Sales Representative',
    description: 'Customer-facing professionals responsible for promoting SpecChem products, building relationships, and ensuring customer safety compliance.',
    shortDescription: 'Drive sales while ensuring customer safety and product compliance',
    icon: 'Handshake',
    color: 'blue',
    estimatedDuration: '2-3 weeks',
    requiredModules: ['welcome', 'product-knowledge', 'customer-safety', 'sales-compliance'],
    recommendedModules: ['advanced-products', 'industry-trends', 'customer-service'],
    complianceRequirements: ['Product Safety Training', 'Customer Documentation', 'Sales Ethics'],
    keyResponsibilities: [
      'Product consultation and recommendations',
      'Customer safety protocol communication',
      'Technical documentation management',
      'Compliance verification and reporting'
    ],
    trainingPriorities: 'high',
    targetAudience: ['New sales hires', 'Account managers', 'Technical sales specialists']
  },
  {
    id: 'plant-tech',
    name: 'plant-technician',
    title: 'Plant Technician',
    description: 'Hands-on technical professionals responsible for manufacturing operations, equipment maintenance, and ensuring production safety.',
    shortDescription: 'Operate equipment safely while maintaining production quality standards',
    icon: 'Settings',
    color: 'orange',
    estimatedDuration: '3-4 weeks',
    requiredModules: ['welcome', 'equipment-safety', 'osha-compliance', 'emergency-procedures'],
    recommendedModules: ['advanced-maintenance', 'quality-control', 'lean-manufacturing'],
    complianceRequirements: ['OSHA Safety Training', 'Equipment Certification', 'Emergency Response'],
    keyResponsibilities: [
      'Equipment operation and maintenance',
      'Safety protocol enforcement',
      'Quality control procedures',
      'Incident reporting and response'
    ],
    trainingPriorities: 'high',
    targetAudience: ['Production technicians', 'Maintenance staff', 'Equipment operators']
  },
  {
    id: 'compliance-officer',
    name: 'compliance-officer',
    title: 'Compliance Officer',
    description: 'Regulatory specialists ensuring SpecChem operations meet all legal, safety, and industry standards.',
    shortDescription: 'Ensure regulatory compliance across all company operations',
    icon: 'Shield',
    color: 'green',
    estimatedDuration: '4-5 weeks',
    requiredModules: ['welcome', 'regulatory-framework', 'audit-procedures', 'documentation'],
    recommendedModules: ['advanced-compliance', 'risk-assessment', 'legal-updates'],
    complianceRequirements: ['Regulatory Training', 'Audit Certification', 'Documentation Standards'],
    keyResponsibilities: [
      'Regulatory requirement monitoring',
      'Audit preparation and execution',
      'Compliance documentation management',
      'Risk assessment and mitigation'
    ],
    trainingPriorities: 'high',
    targetAudience: ['Compliance specialists', 'Quality assurance managers', 'Audit coordinators']
  },
  {
    id: 'safety-coordinator',
    name: 'safety-coordinator',
    title: 'Safety Coordinator',
    description: 'Safety professionals dedicated to maintaining workplace safety, conducting training, and ensuring emergency preparedness.',
    shortDescription: 'Lead safety initiatives and emergency response coordination',
    icon: 'AlertTriangle',
    color: 'red',
    estimatedDuration: '3-4 weeks',
    requiredModules: ['welcome', 'safety-leadership', 'emergency-management', 'incident-investigation'],
    recommendedModules: ['advanced-safety', 'training-delivery', 'safety-analytics'],
    complianceRequirements: ['Safety Leadership Certification', 'Emergency Response', 'Training Certification'],
    keyResponsibilities: [
      'Safety program development and implementation',
      'Emergency response coordination',
      'Safety training delivery',
      'Incident investigation and reporting'
    ],
    trainingPriorities: 'high',
    targetAudience: ['Safety managers', 'Emergency coordinators', 'Training specialists']
  },
  {
    id: 'quality-assurance',
    name: 'quality-assurance',
    title: 'Quality Assurance Specialist',
    description: 'Quality professionals ensuring product standards, testing procedures, and continuous improvement processes.',
    shortDescription: 'Maintain product quality standards through testing and process improvement',
    icon: 'CheckCircle',
    color: 'purple',
    estimatedDuration: '2-3 weeks',
    requiredModules: ['welcome', 'quality-standards', 'testing-procedures', 'process-improvement'],
    recommendedModules: ['statistical-analysis', 'advanced-testing', 'supplier-quality'],
    complianceRequirements: ['Quality Standards Certification', 'Testing Protocols', 'ISO Compliance'],
    keyResponsibilities: [
      'Product quality testing and verification',
      'Process improvement initiatives',
      'Supplier quality management',
      'Quality documentation and reporting'
    ],
    trainingPriorities: 'medium',
    targetAudience: ['QA technicians', 'Quality engineers', 'Process improvement specialists']
  },
  {
    id: 'admin-staff',
    name: 'administrative-staff',
    title: 'Administrative Staff',
    description: 'Administrative professionals supporting business operations, HR functions, and office management.',
    shortDescription: 'Support business operations with administrative expertise and policy knowledge',
    icon: 'Users',
    color: 'blue',
    estimatedDuration: '1-2 weeks',
    requiredModules: ['welcome', 'company-policies', 'office-procedures', 'communication-standards'],
    recommendedModules: ['advanced-admin', 'project-support', 'customer-interaction'],
    complianceRequirements: ['Administrative Policies', 'Communication Standards', 'Data Privacy'],
    keyResponsibilities: [
      'Administrative task coordination',
      'Policy and procedure support',
      'Communication facilitation',
      'Document management and organization'
    ],
    trainingPriorities: 'medium',
    targetAudience: ['Office administrators', 'HR coordinators', 'Executive assistants']
  },
  {
    id: 'field-service',
    name: 'field-service-technician',
    title: 'Field Service Technician',
    description: 'Mobile technicians providing on-site customer support, installation services, and technical troubleshooting.',
    shortDescription: 'Deliver on-site technical support and customer service excellence',
    icon: 'Truck',
    color: 'green',
    estimatedDuration: '3-4 weeks',
    requiredModules: ['welcome', 'field-safety', 'customer-service', 'technical-troubleshooting'],
    recommendedModules: ['advanced-installation', 'customer-relations', 'mobile-documentation'],
    complianceRequirements: ['Field Safety Certification', 'Customer Service Standards', 'Mobile Safety'],
    keyResponsibilities: [
      'On-site customer support and service',
      'Product installation and configuration',
      'Technical troubleshooting and problem solving',
      'Customer relationship management'
    ],
    trainingPriorities: 'high',
    targetAudience: ['Field technicians', 'Installation specialists', 'Customer service technicians']
  },
  {
    id: 'lab-tech',
    name: 'laboratory-technician',
    title: 'Laboratory Technician',
    description: 'Scientific professionals conducting product testing, research, and development in controlled laboratory environments.',
    shortDescription: 'Conduct scientific testing and research to ensure product excellence',
    icon: 'FlaskConical',
    color: 'indigo',
    estimatedDuration: '3-4 weeks',
    requiredModules: ['welcome', 'lab-safety', 'testing-protocols', 'data-analysis'],
    recommendedModules: ['advanced-testing', 'research-methods', 'quality-validation'],
    complianceRequirements: ['Laboratory Safety', 'Testing Certification', 'Data Management'],
    keyResponsibilities: [
      'Product testing and analysis',
      'Laboratory safety protocol enforcement',
      'Data collection and analysis',
      'Research and development support'
    ],
    trainingPriorities: 'high',
    targetAudience: ['Lab technicians', 'Research assistants', 'Quality testing specialists']
  }
]

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'welcome',
    title: 'Welcome to SpecChem',
    description: 'Introduction to SpecChem culture, values, and organizational structure',
    category: 'policy',
    duration: '30 minutes',
    difficulty: 'beginner',
    prerequisites: [],
    content: 'Company overview, mission, values, and organizational introduction',
    assessmentRequired: false,
    certificationEligible: false,
    lastUpdated: '2025-08-01'
  },
  {
    id: 'product-knowledge',
    title: 'SpecChem Product Portfolio',
    description: 'Comprehensive overview of SpecChem products, applications, and specifications',
    category: 'product',
    duration: '2 hours',
    difficulty: 'intermediate',
    prerequisites: ['welcome'],
    content: 'Product lines, applications, technical specifications, and customer use cases',
    assessmentRequired: true,
    certificationEligible: true,
    lastUpdated: '2025-07-15'
  },
  {
    id: 'equipment-safety',
    title: 'Equipment Safety & Operation',
    description: 'Safe operation procedures for plant equipment and machinery',
    category: 'safety',
    duration: '3 hours',
    difficulty: 'intermediate',
    prerequisites: ['welcome'],
    content: 'Equipment safety protocols, operation procedures, and emergency shutdown',
    assessmentRequired: true,
    certificationEligible: true,
    lastUpdated: '2025-08-01'
  },
  {
    id: 'osha-compliance',
    title: 'OSHA Compliance Training',
    description: 'Comprehensive OSHA safety requirements and compliance procedures',
    category: 'compliance',
    duration: '4 hours',
    difficulty: 'intermediate',
    prerequisites: ['welcome'],
    content: 'OSHA regulations, workplace safety, incident reporting, and compliance requirements',
    assessmentRequired: true,
    certificationEligible: true,
    lastUpdated: '2025-07-20'
  }
  // Additional modules would be defined here...
]

export const TRAINING_PATHS: TrainingPath[] = [
  {
    roleId: 'sales-rep',
    modules: [
      { moduleId: 'welcome', order: 1, required: true, prerequisiteOf: ['product-knowledge'] },
      { moduleId: 'product-knowledge', order: 2, required: true, prerequisiteOf: ['customer-safety'] },
      { moduleId: 'customer-safety', order: 3, required: true, prerequisiteOf: [] },
      { moduleId: 'sales-compliance', order: 4, required: true, prerequisiteOf: [] }
    ],
    estimatedDuration: '2-3 weeks',
    completionCriteria: {
      requiredModules: 4,
      minimumScore: 80,
      certificationRequired: true
    }
  },
  {
    roleId: 'plant-tech',
    modules: [
      { moduleId: 'welcome', order: 1, required: true, prerequisiteOf: ['equipment-safety'] },
      { moduleId: 'equipment-safety', order: 2, required: true, prerequisiteOf: ['osha-compliance'] },
      { moduleId: 'osha-compliance', order: 3, required: true, prerequisiteOf: ['emergency-procedures'] },
      { moduleId: 'emergency-procedures', order: 4, required: true, prerequisiteOf: [] }
    ],
    estimatedDuration: '3-4 weeks',
    completionCriteria: {
      requiredModules: 4,
      minimumScore: 85,
      certificationRequired: true
    }
  }
  // Additional training paths would be defined here...
]

export const getRoleById = (roleId: string): SpecChemRole | undefined => {
  return SPECCHEM_ROLES.find(role => role.id === roleId)
}

export const getTrainingPathByRole = (roleId: string): TrainingPath | undefined => {
  return TRAINING_PATHS.find(path => path.roleId === roleId)
}

export const getModuleById = (moduleId: string): TrainingModule | undefined => {
  return TRAINING_MODULES.find(module => module.id === moduleId)
}
