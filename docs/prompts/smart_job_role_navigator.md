# Smart Job Role & Training Navigator - Full Implementation Prompt

## Project Vision
Create a comprehensive, role-based onboarding and training system for SpecChem that dynamically curates training paths based on job roles, tracks progress, and maintains compliance records. This system will transform HR's ability to efficiently onboard and upskill employees across technical, compliance-heavy industrial roles.

## Business Context
**Company**: SpecChem - Industrial construction materials and safety training
**Current State**: Static handbook and LMS with limited role-based customization
**HR Pain Points**: 
- Manual onboarding packet assembly
- Difficulty tracking compliance across roles
- No dynamic content curation
- Limited mobile accessibility for field workers

## Technical Foundation
**Current Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui components
**Current Features**: Employee handbook with search, basic LMS structure
**Brand System**: SpecChem colors (federal-blue: #020747, yale-blue: #013A81, gold: #DEB408)
**Repository**: https://github.com/Josh-SpecChem/specchem-safety

## Core Features to Implement

### 1. Role Selection & Onboarding Portal
**Purpose**: Dynamic role-based training path generation
**Features**:
- Interactive job role selector with SpecChem-specific roles:
  - Sales Representative
  - Plant Technician
  - Compliance Officer
  - Safety Coordinator
  - Quality Assurance
  - Administrative Staff
  - Field Service Technician
  - Laboratory Technician
- Auto-curated training modules based on role requirements
- Dynamic PDF assembly (SDS sheets, TDS documents, OSHA content)
- Role-specific handbook sections highlighting
- Estimated completion timelines per role

### 2. Progress Tracking Dashboard
**Purpose**: Comprehensive learning analytics and compliance monitoring
**Features**:
- Individual user progress tracking with visual indicators
- Module completion percentages and time tracking
- Certification status and expiration alerts
- Manager/HR oversight dashboard
- Downloadable progress reports
- Integration with existing handbook search functionality

### 3. Agent-Driven Content Assembly
**Purpose**: Intelligent content curation and delivery
**Features**:
- Pull from existing SpecChem resources (handbook, safety docs, policies)
- Dynamic training path creation based on role + experience level
- Content recommendation engine
- Automatic content updates when source materials change
- Personalized learning suggestions

### 4. Mobile-Ready PWA Features
**Purpose**: Field worker accessibility and offline capability
**Features**:
- Responsive design optimized for mobile/tablet
- Offline content caching for essential training materials
- Progress synchronization when back online
- Touch-friendly interface for industrial environments
- QR code scanning for quick module access

### 5. Compliance & Certification Management
**Purpose**: Automated compliance tracking and reporting
**Features**:
- Role-based compliance requirements matrix
- Automatic certification generation with SpecChem branding
- Compliance status overview for HR/managers
- Audit-ready reporting and documentation
- Integration with existing safety protocols

## Technical Implementation Strategy

### Phase 1: Foundation & Role Architecture
- Create role-based routing system (`/navigator/[role]`)
- Design role selection interface with SpecChem branding
- Implement role-based content filtering system
- Set up progress tracking data models

### Phase 2: Dynamic Content Assembly
- Build content aggregation system pulling from existing handbook
- Create training module component architecture
- Implement progress tracking backend
- Add role-specific content recommendations

### Phase 3: Dashboard & Analytics
- Build comprehensive progress dashboard
- Create manager/HR oversight interfaces
- Implement certification generation system
- Add compliance reporting features

### Phase 4: Mobile Optimization & PWA
- Optimize for mobile/tablet experiences
- Implement offline functionality
- Add PWA features (install prompts, caching)
- Create QR code integration system

### Phase 5: Advanced Features & Integration
- Add intelligent content recommendations
- Implement advanced analytics
- Create audit reporting system
- Build notification/reminder system

## Design Requirements

### Visual Design
- **Hero Section**: Role-based onboarding journey visualization
- **Color Scheme**: Primary SpecChem brand colors with role-specific accent colors
- **Typography**: Clear, industrial-friendly fonts optimized for mobile
- **Iconography**: Role-specific icons (hard hat, clipboard, laboratory, etc.)
- **Layout**: Card-based responsive design similar to existing handbook

### User Experience
- **Onboarding Flow**: 3-step role selection → content curation → progress tracking
- **Navigation**: Intuitive progress breadcrumbs and module navigation
- **Feedback**: Real-time progress indicators and completion celebrations
- **Accessibility**: WCAG compliant for industrial workforce diversity

### Component Architecture
- **RoleSelector**: Interactive role selection with job descriptions
- **TrainingPath**: Dynamic module assembly and sequencing
- **ProgressTracker**: Visual progress indicators and analytics
- **CertificationManager**: Certificate generation and compliance tracking
- **MobileOptimized**: Touch-friendly controls and offline capabilities

## Content Strategy

### Role-Specific Training Paths
**Sales Representative**:
- Product knowledge modules
- Customer safety protocols
- Compliance documentation requirements
- CRM and documentation training

**Plant Technician**:
- Equipment safety procedures
- OSHA compliance training
- Emergency response protocols
- Quality control processes

**Compliance Officer**:
- Regulatory requirement updates
- Audit preparation procedures
- Documentation standards
- Risk assessment protocols

### Content Sources
- Existing SpecChem handbook sections
- Safety documentation and SDS sheets
- OSHA training materials
- Company policies and procedures
- Industry best practices and certifications

## Success Metrics

### User Engagement
- Role selection completion rate
- Average time to complete training paths
- Module completion rates by role
- User satisfaction scores

### Business Impact
- Reduction in onboarding time
- Improved compliance scores
- Decreased manual HR administrative work
- Enhanced employee retention in first 90 days

### Technical Performance
- Mobile page load speeds (<3 seconds)
- Offline functionality reliability
- Cross-device synchronization accuracy
- System uptime and reliability

## Integration Requirements

### Current System Integration
- Seamless navigation from existing handbook
- Shared authentication and user management
- Consistent branding and design language
- Cross-platform data synchronization

### Future Integration Potential
- M365/SharePoint connectivity
- HRIS system data synchronization
- Advanced analytics and reporting platforms
- Third-party compliance tracking systems

## Implementation Approach
1. **Research Phase**: Analyze existing SpecChem roles and training requirements
2. **Design Phase**: Create comprehensive UI/UX designs and user flows
3. **Development Phase**: Build in iterative sprints with continuous testing
4. **Testing Phase**: Comprehensive testing across devices and roles
5. **Deployment Phase**: Staged rollout with user feedback integration
6. **Optimization Phase**: Continuous improvement based on usage analytics

This system will position SpecChem as a digital-first industrial company while solving critical HR challenges around efficient onboarding, compliance tracking, and employee development across technical roles.
