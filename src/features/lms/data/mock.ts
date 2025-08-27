import type { LmsModule, UserProgress, ResourceLink } from '@/types/lms';

export const mockModules: LmsModule[] = [
  {
    slug: 'general-awareness',
    title: 'Introduction & General Awareness',
    description: 'Fundamental knowledge of hazardous materials regulations, classifications, and basic safety principles required for all SpecChem personnel and distributors.',
    estimatedHours: 2,
    difficulty: 'Beginner',
    required: true,
    icon: '📚',
    category: 'General Training',
    objectives: [
      'Understand why HazMat compliance matters for SpecChem operations',
      'Learn OSHA and DOT regulatory framework basics',
      'Recognize roles and responsibilities across the supply chain',
      'Master hazard recognition through labels and Safety Data Sheets'
    ],
    lessons: [
      {
        slug: 'welcome-purpose',
        title: 'Welcome & Purpose of HazMat Training',
        duration: 15,
        description: 'Understanding why compliance matters and SpecChem\'s commitment to safety.',
        content: `
# Welcome to SpecChem HazMat Training

## Why This Training Matters

As a SpecChem team member or distributor partner, you play a critical role in handling concrete chemicals safely and compliantly. This training ensures we protect our people, communities, and business while meeting all regulatory requirements.

## SpecChem's Safety Commitment

At SpecChem, safety isn't just about compliance—it's about protecting what matters most: our employees, customers, and the communities where we operate. Our concrete chemical products improve construction projects worldwide, but they require proper handling, shipping, and storage.

### Our Responsibility Chain
- **Manufacturing**: Safe production with proper labeling and documentation
- **Distribution**: Compliant transportation and storage practices
- **End Users**: Proper handling and application procedures
- **Emergency Response**: Coordinated response to any incidents

## Business Impact of Compliance

Poor hazmat compliance can result in:
- **Regulatory fines** ranging from $5,000 to $200,000+ per violation
- **Business disruption** from shipping delays or facility shutdowns
- **Reputation damage** affecting customer relationships
- **Insurance claims** and potential liability issues
- **Worker injuries** and associated costs

## Your Role in Success

Every person handling SpecChem products contributes to our safety culture. This training provides the knowledge and tools you need to:
- Recognize hazardous materials in your work environment
- Follow proper procedures for handling and transportation
- Respond appropriately to incidents or emergencies
- Maintain accurate documentation and records

**Remember**: When in doubt, ask. Safety questions are always welcome and encouraged.

// TODO: Add interactive welcome assessment
// TODO: Integrate with user's specific role/location data
`
      },
      {
        slug: 'regulations-overview',
        title: 'Overview of Hazardous Materials Regulations',
        duration: 20,
        description: 'OSHA and DOT basics: understanding the regulatory framework governing SpecChem operations.',
        content: `
# Understanding HazMat Regulations

## The Regulatory Framework

Multiple agencies govern hazardous materials to protect workers, the public, and the environment. For SpecChem operations, two primary agencies set the rules:

### OSHA (Occupational Safety and Health Administration)
**Focus**: Worker safety in the workplace
- **Hazard Communication Standard (HazCom 2012)**: Requires chemical hazard identification and communication
- **Personal Protective Equipment (PPE)**: Standards for protecting workers
- **Emergency Response**: Requirements for incident response planning
- **Record Keeping**: Documentation of safety training and incidents

### DOT (Department of Transportation)
**Focus**: Safe transportation of hazardous materials
- **Hazardous Materials Regulations (HMR)**: Classification, packaging, marking, labeling, and shipping
- **Shipping Papers**: Required documentation for transport
- **Training Requirements**: Certification for personnel involved in hazmat transport
- **Emergency Response Information**: Must accompany shipments

## How Regulations Apply to SpecChem

### Manufacturing Operations
- Proper classification of concrete chemical products
- Safety Data Sheet (SDS) creation and maintenance
- Worker protection programs
- Facility emergency response plans

### Distribution and Transportation
- Correct packaging and labeling of shipments
- Proper shipping documentation
- Driver training and certification requirements
- Vehicle placarding and marking

### Customer Interface
- Providing accurate hazard information
- Training support for distributors and end users
- Emergency response coordination

## Compliance Hierarchy

1. **Federal Regulations**: OSHA, DOT, EPA requirements (minimum standards)
2. **State Regulations**: May be more stringent than federal
3. **Local Regulations**: Municipal and county requirements
4. **Company Policies**: SpecChem's additional safety measures

**Key Point**: When regulations conflict, follow the most restrictive requirement.

## Consequences of Non-Compliance

### Regulatory Penalties
- OSHA fines: $15,625 per serious violation, $156,259 for willful/repeated violations
- DOT fines: Up to $200,000+ for hazmat violations
- Criminal prosecution possible for willful violations

### Business Impact
- Shipping delays and supply chain disruption
- Customer contract cancellations
- Insurance policy violations
- Facility shutdown orders

// TODO: Add regulation matching interactive exercise
// TODO: Link to current penalty amounts (updated annually)
`
      },
      {
        slug: 'roles-responsibilities',
        title: 'Roles & Responsibilities',
        duration: 18,
        description: 'Understanding specific responsibilities for SpecChem employees, distributors, and carriers.',
        content: `
# Roles & Responsibilities in HazMat Operations

## The SpecChem Supply Chain

Hazmat compliance is a team effort involving multiple parties, each with specific responsibilities under federal regulations.

### SpecChem Employees

#### Production & Quality Control
**Primary Responsibilities:**
- Ensure proper product classification according to DOT/OSHA standards
- Maintain accurate Safety Data Sheets (SDS) for all products
- Implement proper packaging procedures
- Verify container integrity and labeling accuracy
- Document quality control testing and results

**Regulatory Basis**: OSHA Hazard Communication Standard, DOT Classification Requirements

#### Shipping & Logistics
**Primary Responsibilities:**
- Prepare accurate shipping papers and hazmat documentation
- Apply proper labels, markings, and placards
- Verify driver training and certification status
- Coordinate with carriers for compliant transportation
- Maintain shipping records as required

**Key Requirement**: All shipping personnel must complete general awareness, function-specific, safety, and security awareness training.

#### Management & Supervision
**Primary Responsibilities:**
- Ensure adequate training for all personnel
- Maintain compliance documentation systems
- Coordinate emergency response procedures
- Interface with regulatory agencies during inspections
- Implement corrective actions for violations or incidents

### Distributor Partners

#### Receiving & Storage
**Primary Responsibilities:**
- Verify shipment accuracy against shipping papers
- Report damage or discrepancies immediately
- Maintain proper storage conditions and segregation
- Keep SDS readily accessible to workers
- Follow SpecChem's handling procedures

#### Sales & Customer Service
**Primary Responsibilities:**
- Provide accurate hazard information to customers
- Ensure customers receive current SDS
- Coordinate training support as needed
- Report customer concerns or incidents to SpecChem
- Maintain customer hazmat training records

### Carrier Responsibilities

#### Drivers
**Primary Responsibilities:**
- Maintain valid Commercial Driver's License with HazMat endorsement
- Complete required hazmat training (renewed every 3 years)
- Conduct pre-trip vehicle inspections
- Carry required shipping papers and emergency response information
- Follow route restrictions and parking regulations

#### Carrier Companies
**Primary Responsibilities:**
- Verify driver qualifications and training currency
- Maintain vehicles in proper condition with required equipment
- Provide 24-hour emergency response contact information
- Coordinate with shippers for proper loading and documentation
- Report incidents to appropriate agencies

## Shared Responsibilities

### Communication
- **Immediate**: Report hazmat incidents, spills, or safety concerns
- **Routine**: Share best practices and lessons learned
- **Training**: Support ongoing education and certification requirements

### Documentation
- **Maintain**: Required records per regulatory timelines
- **Access**: Ensure information is available during business hours
- **Update**: Keep contact information and procedures current

### Emergency Response
- **Preparation**: Understand your role in emergency situations
- **Coordination**: Work with local first responders and company personnel
- **Follow-up**: Participate in incident investigation and corrective actions

## Accountability Framework

**Individual Level**: Each person is responsible for following procedures and reporting concerns

**Company Level**: SpecChem ensures adequate resources, training, and support systems

**Industry Level**: Collective commitment to safety and continuous improvement

**Remember**: Compliance is everyone's job. When you see something unsafe, speak up.

// TODO: Add role-specific scenario exercises
// TODO: Create responsibility matrix by job function
`
      },
      {
        slug: 'recognizing-hazards',
        title: 'Recognizing Hazards',
        duration: 12,
        description: 'Understanding labels, SDS overview, and hazard recognition for SpecChem products.',
        content: `
# Recognizing Hazards in SpecChem Products

## The Hazard Communication System

Every SpecChem product that poses a chemical hazard must be properly labeled and accompanied by a Safety Data Sheet (SDS). This system ensures everyone in the supply chain has the information needed for safe handling.

### Global Harmonization System (GHS)

The United States adopted the GHS in 2012, standardizing how chemical hazards are communicated worldwide.

#### GHS Hazard Classes Relevant to SpecChem
1. **Physical Hazards**
   - Flammable liquids (solvents, adhesives)
   - Corrosive to metals (acid-based products)
   - Oxidizing liquids (certain curing agents)

2. **Health Hazards**
   - Skin/eye irritation (alkaline products, surfactants)
   - Respiratory sensitization (isocyanates in sealers)
   - Carcinogenicity (silica-containing products)

3. **Environmental Hazards**
   - Acute aquatic toxicity (biocides in products)
   - Chronic aquatic toxicity (persistent chemicals)

## Reading SpecChem Product Labels

### Required Label Elements

#### Product Identifier
- **Product Name**: Exact name as shown on SDS
- **Product Code**: SpecChem internal identification number
- **Batch/Lot Information**: For traceability

#### Signal Words
- **DANGER**: More severe hazards
- **WARNING**: Less severe hazards
- **Note**: Only one signal word per product (the most severe)

#### Hazard Statements
Standardized phrases describing the hazard:
- H315: Causes skin irritation
- H318: Causes serious eye damage
- H373: May cause damage to organs through prolonged exposure

#### Pictograms
Visual symbols in red diamond borders:
- 🔥 **Flame**: Flammable materials
- ⚠️ **Exclamation Mark**: Irritants, sensitizers
- ☠️ **Skull and Crossbones**: Acute toxicity
- 🧪 **Corrosion**: Skin/eye damage, metal corrosion

### SpecChem-Specific Label Information

#### Product Category Indicators
- **Concrete Repair**: CR series products
- **Protective Coatings**: PC series products  
- **Adhesives & Sealers**: AS series products
- **Specialty Chemicals**: SC series products

#### Application Warnings
Common warnings on SpecChem products:
- "Use only in well-ventilated areas"
- "Avoid contact with skin and eyes"
- "Do not mix with other chemicals"
- "Wear appropriate PPE during application"

## Understanding Safety Data Sheets (SDS)

### The 16-Section Format

Every SDS follows the same structure:

**Sections 1-8**: Identification and hazard information
**Sections 9-11**: Physical, chemical, and toxicological properties
**Sections 12-16**: Ecological, disposal, transport, and regulatory information

### Key Sections for Daily Operations

#### Section 2: Hazards Identification
- GHS classification and label elements
- Other hazards not covered by GHS
- **Use This For**: Understanding what protective measures are needed

#### Section 4: First Aid Measures
- Specific first aid instructions by exposure route
- Most important symptoms and health effects
- **Use This For**: Emergency response procedures

#### Section 8: Exposure Controls/Personal Protection
- Exposure limits (OSHA PEL, ACGIH TLV)
- Engineering controls needed
- PPE recommendations
- **Use This For**: Daily work planning and PPE selection

#### Section 13: Disposal Considerations
- Waste treatment methods
- Contaminated packaging disposal
- **Use This For**: Proper waste management

### Accessing SpecChem SDS

#### Digital Access
- **SpecChem Website**: Product-specific SDS downloads
- **QR Codes**: On product labels linking to current SDS
- **Mobile App**: SpecChem Safety for field access

#### Physical Copies
- **Workplace Requirement**: Must be readily accessible during work hours
- **Language**: Available in English and Spanish
- **Updates**: Replace when new versions are issued

## Red Flags: When to Stop and Ask

### Label Issues
- Missing or illegible labels
- Damage to pictograms or text
- Unfamiliar product codes or names

### SDS Concerns
- SDS older than 3 years without revision
- Conflicting information between label and SDS
- Missing SDS for a hazardous product

### Physical Product Issues
- Unusual odor, color, or consistency
- Container damage or leaks
- Separation or crystallization in liquids

**Critical Rule**: When in doubt, don't proceed. Contact your supervisor or SpecChem technical support.

// TODO: Add hazard recognition quiz with SpecChem product images
// TODO: Create SDS navigation exercise
`
      }
    ]
  },
  {
    slug: 'function-specific',
    title: 'SpecChem Function-Specific Training',
    description: 'Role-based training covering specific responsibilities for packaging, shipping, handling, and documentation at SpecChem.',
    estimatedHours: 3,
    difficulty: 'Intermediate',
    required: true,
    icon: '🔧',
    category: 'Role-Based Training',
    objectives: [
      'Execute proper shipping and handling procedures for SpecChem products',
      'Master loading and unloading best practices with common mistake awareness',
      'Complete accurate documentation and recordkeeping requirements',
      'Implement internal reporting procedures for issues and incidents'
    ],
    lessons: [
      {
        slug: 'shipping-handling',
        title: 'Shipping & Handling Procedures',
        duration: 25,
        description: 'SpecChem processes, packaging standards, and handling protocols.',
        content: `
# SpecChem Shipping & Handling Procedures

## Overview of SpecChem Shipping Operations

As a concrete chemical manufacturer, SpecChem ships diverse products requiring specific handling procedures. Our products range from water-based admixtures to solvent-based sealers, each with unique shipping requirements.

### Product Categories & Handling Requirements

#### Class 1: Non-Hazardous Products
**Examples**: Water-based admixtures, some repair mortars
- **Packaging**: Standard industrial containers
- **Shipping**: No special DOT requirements
- **Handling**: Standard material handling practices
- **Documentation**: Commercial shipping papers

#### Class 2: Hazardous Products - Limited Quantities
**Examples**: Small containers of solvents, adhesives
- **Packaging**: Limited quantity packaging (UN specification boxes)
- **Labeling**: Limited quantity marking (diamond symbol)
- **Shipping**: Eligible for limited quantity exceptions
- **Training**: Basic awareness sufficient

#### Class 3: Fully Regulated Hazardous Materials
**Examples**: Bulk solvents, large volume sealers, acid-based products
- **Packaging**: UN specification containers only
- **Documentation**: Full hazmat shipping papers required
- **Placarding**: Vehicle placarding required
- **Training**: Complete hazmat training for all personnel

## SpecChem Packaging Standards

### Container Selection Criteria

#### Primary Packaging
1. **Chemical Compatibility**: Container material must be compatible with product
2. **UN Specification**: For hazmat, use only UN marked containers
3. **Fill Limits**: Never exceed 95% capacity for liquids
4. **Closure Instructions**: Follow exact closure procedures per UN specification

#### Secondary Packaging
- **Overpacking**: Required when primary container shows wear or minor damage
- **Combination Packaging**: Use proper cushioning and orientation
- **Marking**: Overpack markings required when inner packages not visible

### SpecChem-Specific Procedures

#### Quality Control Checkpoints
1. **Pre-Packaging Inspection**
   - Verify container condition and UN markings
   - Check expiration dates on containers
   - Ensure proper tools and materials are available

2. **During Packaging**
   - Maintain clean work area
   - Use calibrated measuring equipment
   - Follow exact filling procedures
   - Apply closures per manufacturer instructions

3. **Post-Packaging Verification**
   - Verify weight against target specifications
   - Check closure tightness with torque specifications
   - Confirm labeling accuracy and placement
   - Document lot/batch numbers

### Handling Protocols

#### Manual Handling
- **Weight Limits**: Maximum 50 lbs per person without mechanical assistance
- **Team Lifts**: Required for containers over 50 lbs
- **PPE Requirements**: Safety glasses, steel-toed shoes, chemical-resistant gloves when specified

#### Mechanical Handling
- **Forklift Operations**: Only certified operators
- **Pallet Standards**: Use only OSHA-approved pallets in good condition
- **Securing Loads**: Follow tie-down requirements for transportation

## Shipping Documentation

### Required Shipping Papers

#### Hazmat Shipments
1. **Basic Description**: Proper shipping name, hazard class, identification number, packing group
2. **Total Quantity**: By hazard class and packing group
3. **Unit of Measure**: Per DOT requirements
4. **Emergency Response Information**: Phone number for 24-hour response

#### Example Documentation
~~~~
UN1263, Paint, 3, PG II, 55 GAL DRUM
UN1993, Flammable liquid, n.o.s. (contains ethanol), 3, PG III, 5 GAL CANS, 4 CANS
~~~~

### SpecChem Internal Controls

#### Shipping Authorization
- All hazmat shipments require supervisor approval
- Verify customer is authorized to receive hazmat
- Confirm delivery address restrictions (residential, etc.)

#### Record Retention
- Shipping papers: 3 years minimum
- Training records: Duration of employment plus 90 days
- Incident reports: 5 years minimum

## Common Shipping Errors and Prevention

### Documentation Errors
**Error**: Incorrect proper shipping name
**Prevention**: Use SpecChem master product list, verify against SDS

**Error**: Missing emergency contact information
**Prevention**: Use standard SpecChem emergency response template

### Packaging Errors
**Error**: Overfilled containers
**Prevention**: Use measuring equipment, check fill levels

**Error**: Incompatible materials shipped together
**Prevention**: Consult segregation table, separate incompatible classes

### Labeling Errors
**Error**: Outdated or incorrect hazard labels
**Prevention**: Maintain current label inventory, cross-check with SDS

## Emergency Procedures During Shipping

### Spill or Leak Discovery
1. **Immediate Actions**
   - Stop operations in affected area
   - Evacuate non-essential personnel
   - Assess extent of release

2. **Containment**
   - Use appropriate spill control materials
   - Prevent entry into drains or waterways
   - Isolate contaminated materials

3. **Reporting**
   - Notify SpecChem emergency hotline immediately
   - Contact local emergency services if required
   - Document incident details

### Product Damage
- Photograph damage before handling
- Preserve packaging materials for investigation
- Report to quality control and shipping supervisor

**Remember**: When shipping hazmat, accuracy and attention to detail can prevent serious consequences.

// TODO: Add interactive packaging exercise
// TODO: Create shipping document template generator
`
      },
      {
        slug: 'loading-unloading',
        title: 'Loading & Unloading',
        duration: 30,
        description: 'Best practices, common mistakes, and safety procedures for loading operations.',
        content: `
# Loading & Unloading Best Practices

## Pre-Loading Operations

### Vehicle and Equipment Inspection

#### Transportation Vehicle Checklist
Before any loading begins, verify:
- **Placard Requirements**: Correct placards installed and visible
- **Fire Extinguisher**: Proper type and current inspection
- **Spill Kit**: Complete and accessible emergency response materials
- **Tie-Down Equipment**: Adequate and in good condition
- **Vehicle Condition**: No damage that could affect safe transport

#### Loading Equipment Inspection
- **Forklifts**: Daily inspection complete, operator certified
- **Hand Trucks**: Wheels and handles in good condition
- **Lifting Equipment**: Load ratings clearly marked and adequate
- **PPE Availability**: Appropriate protective equipment available

### Documentation Verification
1. **Shipping Papers**: Complete and accurate before loading begins
2. **Driver Qualifications**: Verify HazMat endorsement and training currency
3. **Route Planning**: Confirm route restrictions and customer requirements
4. **Emergency Contacts**: Ensure 24-hour contact information is current

## Loading Procedures

### Segregation Requirements

#### SpecChem Product Segregation Matrix
**Class 3 Flammable Liquids** (solvents, some sealers):
- **Separate from**: Oxidizers, corrosives by 4 feet minimum
- **Load Position**: Away from heat sources, secure against shifting
- **Quantity Limits**: Maximum per vehicle varies by product

**Class 8 Corrosives** (acid-based products):
- **Separate from**: Flammables, food products by 10 feet minimum
- **Load Position**: Lower level of vehicle, against forward wall
- **Special Handling**: Extra securing due to weight and corrosive nature

#### Loading Sequence
1. **Heaviest Items First**: Load heavy containers at bottom and forward
2. **Compatibility Groups**: Load compatible materials together
3. **Access Considerations**: Ensure first-off items are accessible
4. **Weight Distribution**: Maintain proper vehicle balance

### Securing the Load

#### Tie-Down Requirements
- **Working Load Limit**: Tie-downs must have adequate capacity
- **Number of Tie-Downs**: Minimum based on cargo weight and length
- **Inspection**: Check all securing devices before transport
- **Documentation**: Record tie-down inspection on bill of lading

#### SpecChem-Specific Securing Methods
**Drum Handling**:
- Use drum cradles or specialized clamps
- Secure both top and bottom tiers
- Prevent rolling with wedges or brackets

**Box/Case Handling**:
- Stack according to manufacturer recommendations
- Use slip-sheets between layers when specified
- Secure with appropriate strapping or banding

## Unloading Operations

### Receiving Inspection Procedures

#### Upon Arrival Inspection
1. **Quantity Verification**: Count matches shipping documentation
2. **Condition Assessment**: Check for damage, leaks, or contamination
3. **Documentation Review**: Verify all required papers are present
4. **Emergency Information**: Confirm emergency contact accessibility

#### Damage Assessment Protocol
**Minor Damage** (scratches, small dents):
- Document with photographs
- Note on delivery receipt
- Proceed with unloading using extra caution

**Major Damage** (leaks, severe impact damage):
- Stop unloading immediately
- Isolate damaged items
- Contact SpecChem emergency hotline
- Follow spill response procedures if needed

### Safe Unloading Techniques

#### Manual Handling Guidelines
- **Team Communication**: Use standardized lifting commands
- **Proper Body Mechanics**: Lift with legs, keep back straight
- **Clear Pathways**: Remove obstacles before moving materials
- **PPE Compliance**: Wear required protective equipment throughout

#### Mechanical Unloading
- **Stable Surfaces**: Ensure vehicle is on level ground with wheels chocked
- **Load Limits**: Never exceed equipment capacity ratings
- **Operator Competency**: Only trained, authorized personnel operate equipment
- **Spotting**: Use spotters for backing operations and tight spaces

## Common Mistakes and Prevention

### Loading Mistakes

#### Mistake: Improper Weight Distribution
**Consequences**: Vehicle handling problems, tire damage, regulatory violations
**Prevention**: 
- Use load distribution calculations
- Check axle weight limits
- Reposition cargo if necessary

#### Mistake: Inadequate Securing
**Consequences**: Load shift, container damage, potential spills
**Prevention**:
- Follow tie-down requirements exactly
- Inspect securing devices regularly during transport
- Use blocking and bracing as appropriate

#### Mistake: Mixed Incompatible Products
**Consequences**: Chemical reactions, fire risk, regulatory violations
**Prevention**:
- Consult compatibility charts before loading
- Use physical separation barriers
- Train all personnel on segregation requirements

### Unloading Mistakes

#### Mistake: Accepting Damaged Shipments
**Consequences**: Safety hazards, insurance disputes, product contamination
**Prevention**:
- Inspect thoroughly before accepting delivery
- Document all damage immediately
- Reject severely damaged shipments

#### Mistake: Inadequate Storage Preparation
**Consequences**: Secondary damage, workplace hazards, regulatory issues
**Prevention**:
- Prepare storage area before delivery arrives
- Verify compatibility with existing inventory
- Ensure adequate ventilation and spill containment

## Emergency Procedures

### Loading/Unloading Incidents

#### Spill During Loading
1. **Immediate Response**: Stop operations, evacuate area
2. **Containment**: Use available spill control materials
3. **Assessment**: Determine extent and hazard level
4. **Reporting**: Notify appropriate emergency contacts

#### Equipment Failure
- **Personnel Safety**: Ensure all workers are clear of danger
- **Secure Area**: Isolate affected equipment and materials
- **Alternative Methods**: Use backup equipment or manual methods
- **Maintenance**: Do not attempt repairs without proper authorization

#### Weather-Related Issues
- **High Winds**: Suspend loading operations above 25 mph sustained winds
- **Precipitation**: Protect materials from water exposure
- **Temperature**: Follow cold weather precautions for temperature-sensitive products

### Post-Incident Procedures
1. **Medical Attention**: Provide first aid as needed, call emergency services
2. **Incident Documentation**: Complete incident report forms immediately
3. **Evidence Preservation**: Secure area and materials for investigation
4. **Communication**: Notify management and regulatory agencies as required

**Key Principle**: Never rush loading or unloading operations. Taking time to do it right prevents incidents and ensures everyone goes home safely.

// TODO: Add loading sequence simulation
// TODO: Create damage assessment photo guide
`
      },
      {
        slug: 'documentation-recordkeeping',
        title: 'Documentation & Recordkeeping',
        duration: 20,
        description: 'Bills of lading, manifests, electronic logs, and regulatory documentation requirements.',
        content: `
# Documentation & Recordkeeping Requirements

## Overview of Documentation Systems

Proper documentation is critical for hazmat compliance and serves multiple purposes: regulatory compliance, incident investigation, quality control, and business continuity. SpecChem maintains both paper and electronic systems to ensure accuracy and accessibility.

### Legal Requirements vs. Best Practices

#### Regulatory Minimums
- **DOT**: Shipping papers during transport, retained 3 years
- **OSHA**: Training records during employment plus 90 days
- **EPA**: Waste manifests and disposal records

#### SpecChem Enhanced Standards
- **Customer Service**: Maintain detailed delivery confirmations
- **Quality Control**: Track product performance and customer feedback
- **Legal Protection**: Document compliance efforts beyond minimum requirements

## Shipping Documentation

### Bills of Lading (BOL)

#### Required Elements for Hazmat BOL
1. **Shipper Information**: SpecChem name, address, emergency contact
2. **Consignee Information**: Complete delivery address and contact
3. **Proper Shipping Name**: Exact name from 49 CFR 172.101
4. **Hazard Class**: Primary and subsidiary hazards
5. **Identification Number**: UN/NA number
6. **Packing Group**: When applicable (PG I, II, or III)
7. **Total Quantity**: By hazard class and packing group
8. **Unit of Measure**: Gallons, pounds, etc.

#### SpecChem BOL Procedures
**Electronic Generation**: Use SpecChem shipping system for consistency
- Auto-populates product data from master database
- Calculates quantities and applies proper descriptions
- Generates sequential BOL numbers for tracking

**Quality Control Review**: 
- Supervisor approval required for all hazmat shipments
- Cross-check against customer purchase order
- Verify special handling instructions

**Distribution**:
- Original travels with shipment
- Copy retained in shipping department
- Electronic copy stored in customer database

### Hazmat Shipping Papers

#### Basic Description Format
The hazmat basic description must appear in exact sequence:
~~~~
[UN ID Number], [Proper Shipping Name], [Hazard Class], [Packing Group]
~~~~

**SpecChem Examples**:
~~~~
UN1263, Paint, 3, PG II (Solvent-based sealer)
UN3082, Environmentally hazardous substance, liquid, n.o.s., 9, PG III (Concrete admixture with biocide)
UN1760, Corrosive liquid, n.o.s. (contains phosphoric acid), 8, PG II (Concrete etching solution)
~~~~

#### Emergency Response Information
Must include:
- **24-Hour Emergency Response Number**: SpecChem emergency hotline
- **Basic Guidance**: Initial response actions for incidents
- **Technical Contact**: Product-specific expertise available

### Electronic Logging and Tracking

#### SpecChem Digital Systems

**Shipping Management System (SMS)**:
- Integrates with inventory and customer databases
- Generates compliant shipping documentation automatically
- Tracks shipment status and delivery confirmation
- Archives all documents per retention schedule

**Mobile Documentation**:
- Driver applications for delivery confirmation
- Photo capture for damage documentation
- Real-time status updates to customers
- GPS tracking for route compliance

#### Data Integrity Controls
- **User Access**: Role-based permissions for data entry and modification
- **Audit Trails**: Complete history of document changes
- **Backup Systems**: Redundant storage with off-site backup
- **Data Validation**: Automatic checks for completeness and accuracy

## Recordkeeping Requirements

### Training Documentation

#### Individual Training Records
Must include for each employee:
- **Training Dates**: Initial and recurrent training completion
- **Training Content**: Specific modules completed
- **Competency Verification**: Test scores and practical demonstrations
- **Instructor Information**: Qualified trainer identification
- **Updates**: Record of regulation changes and additional training

#### SpecChem Training Matrix
**General Awareness**: All personnel handling hazmat
**Function-Specific**: Role-based training by job duties  
**Safety Training**: Emergency response and PPE procedures
**Security Awareness**: Threat recognition and reporting
**Modal Training**: Transportation mode-specific requirements

### Incident and Compliance Records

#### Incident Documentation
**Required Elements**:
- Date, time, and location of incident
- Personnel involved and witnesses
- Description of what occurred
- Environmental and safety impact assessment
- Immediate corrective actions taken
- Root cause analysis and preventive measures

**SpecChem Incident Tracking**:
- Electronic incident management system
- Automatic notifications to management and safety personnel
- Integration with worker compensation and insurance systems
- Regulatory reporting triggers and templates

#### Compliance Monitoring
**Internal Audits**:
- Monthly shipping documentation reviews
- Quarterly training compliance assessments
- Annual comprehensive compliance audits
- Corrective action tracking and verification

**External Inspections**:
- DOT compliance reviews and facility inspections
- OSHA workplace safety inspections
- Customer audits and certification requirements
- Insurance carrier safety evaluations

### Retention Schedules

#### Federal Requirements
**DOT Records**: 3 years minimum
- Shipping papers and hazmat documentation
- Driver qualification and training records
- Vehicle inspection and maintenance records

**OSHA Records**: Duration of employment plus 90 days
- Employee hazmat training documentation
- Medical surveillance records when required
- Workplace injury and illness records

**EPA Records**: Varies by regulation
- Waste generation and disposal manifests (3 years)
- Air emissions monitoring (5 years)
- Spill response and cleanup documentation (3 years)

#### SpecChem Enhanced Retention
**Business Records**: 7 years
- Customer contracts and correspondence
- Quality control testing and certification
- Product development and formulation records

**Legal Protection**: 10 years
- Incident reports and investigation files
- Regulatory correspondence and violation notices
- Insurance claims and settlement documentation

## Electronic vs. Paper Systems

### Advantages of Electronic Documentation

#### Efficiency Benefits
- **Automated Data Entry**: Reduces errors and speeds processing
- **Real-Time Access**: Information available immediately to authorized users
- **Integration**: Links with accounting, inventory, and customer systems
- **Environmental**: Reduces paper consumption and storage requirements

#### Compliance Benefits
- **Standardization**: Ensures consistent format and required elements
- **Audit Trails**: Complete history of changes and access
- **Backup and Recovery**: Protects against data loss
- **Search Capabilities**: Quick retrieval for inspections and investigations

### Paper System Requirements

#### When Paper is Required
- **Transport Documents**: Must accompany hazmat shipments
- **Emergency Response**: Accessible without power or electronic systems
- **Legal Proceedings**: Original signatures may be required
- **Backup Systems**: When electronic systems are unavailable

#### Paper Document Controls
- **Sequential numbering** for tracking and accountability
- **Controlled distribution** to prevent unauthorized access
- **Secure storage** in fire-resistant filing systems
- **Systematic destruction** per retention schedules

## Common Documentation Errors

### Shipping Paper Mistakes
**Error**: Incorrect proper shipping name
**Impact**: DOT violations, enforcement action, shipment delays
**Prevention**: Use automated systems, verify against regulations

**Error**: Missing or incorrect emergency contact information
**Impact**: Emergency response delays, potential injuries or property damage
**Prevention**: Maintain current contact database, include backup numbers

### Training Record Deficiencies
**Error**: Missing or incomplete training documentation
**Impact**: Employee cannot perform hazmat functions, potential violations
**Prevention**: Systematic tracking, automatic renewal notifications

**Error**: Training not documented per regulatory requirements
**Impact**: Cannot demonstrate compliance during inspections
**Prevention**: Standardized record formats, regular audits

## Best Practices for Documentation Excellence

### Quality Control Measures
1. **Double-Check Critical Information**: Verify hazmat descriptions against SDS
2. **Use Standardized Forms**: Reduces errors and ensures completeness
3. **Regular Training**: Keep documentation personnel current on requirements
4. **Systematic Reviews**: Periodic audits to identify improvement opportunities

### Technology Integration
- **Barcode Systems**: Link physical products to electronic records
- **Mobile Devices**: Enable real-time data capture and updates
- **Cloud Storage**: Provides secure, accessible document management
- **Integration APIs**: Connect with customer and carrier systems

**Remember**: Good documentation protects your company, your colleagues, and the public. Take the time to get it right every time.

// TODO: Add document completion exercise
// TODO: Create retention schedule calculator
`
      },
      {
        slug: 'internal-reporting',
        title: 'Internal Reporting Requirements',
        duration: 15,
        description: 'How SpecChem tracks and escalates issues, incident reporting procedures.',
        content: `
# SpecChem Internal Reporting Requirements

## Reporting Culture and Philosophy

At SpecChem, we believe that early identification and reporting of issues prevents small problems from becoming major incidents. Our reporting system is designed to encourage communication, support continuous improvement, and ensure compliance with all regulatory requirements.

### Non-Punitive Reporting Environment
- **Good Faith Reports**: Never penalized for honest mistakes or safety concerns
- **Anonymous Options**: Multiple ways to report without fear of retaliation
- **Focus on Solutions**: Emphasis on preventing future occurrences, not blame
- **Recognition Programs**: Acknowledgment for proactive safety reporting

## Types of Reports Required

### Immediate Notification Requirements

#### Emergency Incidents (Report Immediately)
**Contact**: SpecChem Emergency Hotline: 1-800-SPEC911
**Situations Requiring Immediate Reporting**:
- Any injury requiring medical attention beyond first aid
- Chemical spills exceeding containment capacity (>5 gallons typically)
- Transportation incidents involving hazmat products
- Fire or explosion involving SpecChem materials
- Environmental releases requiring government notification
- Security threats or suspicious activities

**Initial Report Information**:
1. Your name, location, and contact information
2. Date, time, and specific location of incident
3. Brief description of what occurred
4. Personnel involved and current status
5. Immediate actions taken
6. Ongoing hazards or concerns

#### Near-Miss Events (Report Within 24 Hours)
**Examples**:
- Equipment failure that could have caused injury or environmental release
- Procedural deviations discovered before consequences occurred
- Customer complaints about product handling or safety concerns
- Transportation route violations or documentation errors
- Unauthorized access to hazmat storage areas

### Routine Reporting Requirements

#### Weekly Reports
**Shipping Anomalies**:
- Damaged containers discovered during routine operations
- Customer delivery issues or complaints
- Carrier performance problems affecting safety or compliance
- Documentation discrepancies requiring investigation

**Training and Compliance**:
- Training completion rates by department
- Certification renewals coming due
- Internal audit findings requiring follow-up
- Regulatory update implementations

#### Monthly Reports
**Trend Analysis**:
- Incident patterns and root cause summaries
- Customer feedback themes related to safety or handling
- Supplier quality issues affecting hazmat products
- Cost impacts of compliance-related activities

## Reporting Channels and Procedures

### Primary Reporting Methods

#### Direct Supervisor Chain
**When to Use**: Routine operational issues, training needs, resource requests
**Process**:
1. Immediate supervisor notification
2. Supervisor evaluates and escalates if needed
3. Department manager review for systemic issues
4. Executive involvement for significant matters

#### Safety and Compliance Hotline
**When to Use**: Safety concerns, regulatory violations, ethical issues
**Features**:
- 24/7 availability with live operator backup
- Anonymous reporting option available
- Multi-language support (English/Spanish)
- Automatic escalation based on issue severity

#### Electronic Reporting Systems
**SpecChem Incident Management System**:
- Web-based reporting with mobile access
- Guided workflows ensure complete information capture
- Automatic routing to appropriate personnel
- Real-time status updates for reporters

#### Anonymous Reporting
**Methods Available**:
- Anonymous hotline option
- Secure web portal with identity protection
- Physical suggestion boxes in break areas
- Third-party ethics hotline service

### Escalation Procedures

#### Level 1: Immediate Supervisor
**Handles**: Routine operational issues, minor safety concerns, training needs
**Timeline**: Response within same shift or next business day
**Escalation Trigger**: Issues affecting multiple personnel, regulatory compliance, or customer safety

#### Level 2: Department Manager
**Handles**: Cross-departmental issues, recurring problems, resource allocation
**Timeline**: Response within 24 hours
**Escalation Trigger**: Potential regulatory violations, significant cost impact, or media attention risk

#### Level 3: Executive Management
**Handles**: Major incidents, regulatory enforcement, strategic safety decisions
**Timeline**: Immediate for emergencies, within 48 hours for non-emergency escalations
**Authority**: Can authorize emergency expenditures, interface with regulatory agencies, make policy changes

#### Level 4: Corporate and Legal
**Handles**: Regulatory investigations, significant legal exposure, crisis management
**Timeline**: Immediate activation for major incidents
**Resources**: Legal counsel, crisis communication, regulatory specialists

## Incident Investigation and Follow-Up

### Investigation Requirements

#### Minor Incidents
**Scope**: Determine immediate cause and implement quick fixes
**Personnel**: Supervisor and safety representative
**Timeline**: Complete within 3 business days
**Documentation**: Basic incident report with corrective actions

#### Significant Incidents
**Scope**: Comprehensive root cause analysis with systemic review
**Personnel**: Investigation team including management, safety, and technical experts
**Timeline**: Preliminary report within 5 days, final report within 30 days
**Documentation**: Detailed analysis with implementation plan and success metrics

#### Regulatory Reportable Events
**Scope**: Full investigation meeting regulatory agency requirements
**Personnel**: May include external consultants and legal counsel
**Timeline**: Varies by regulation (DOT: immediate to 30 days, OSHA: 8 hours to 30 days)
**Documentation**: Formal reports suitable for regulatory submission

### Corrective Action Implementation

#### Immediate Corrective Actions
**Purpose**: Prevent recurrence and protect personnel
**Examples**:
- Isolate damaged equipment or materials
- Implement additional safety procedures
- Provide additional training to affected personnel
- Modify work procedures to prevent similar incidents

#### Systemic Improvements
**Purpose**: Address root causes and improve overall safety performance
**Examples**:
- Equipment design changes or upgrades
- Policy and procedure revisions
- Enhanced training programs
- Improved supervision or oversight systems

## Tracking and Metrics

### Performance Indicators

#### Leading Indicators (Prevention-Focused)
- Number of near-miss reports per month
- Training completion rates
- Internal audit scores
- Employee safety suggestion implementation rate

#### Lagging Indicators (Outcome-Focused)
- Recordable injury rates
- Regulatory violations or citations
- Customer safety complaints
- Environmental releases or spills

### Reporting Dashboard
**Real-Time Metrics**:
- Open incidents by severity and age
- Corrective action completion status
- Training compliance by department
- Customer safety feedback trends

**Monthly Trend Analysis**:
- Incident patterns by product type, location, or process
- Root cause categories and frequency
- Cost impact of safety and compliance activities
- Benchmark comparisons with industry standards

## Communication and Feedback

### Report Status Communication
**To Reporters**:
- Acknowledgment of report within 24 hours
- Investigation status updates at key milestones
- Final outcome and implemented corrective actions
- Recognition for valuable contributions to safety

**To Management**:
- Daily incident summary reports
- Weekly trend analysis and metrics
- Monthly comprehensive safety performance review
- Quarterly compliance assessment and planning

### Continuous Improvement Process
**Quarterly Review Meetings**:
- Analyze reporting trends and system effectiveness
- Identify opportunities for process improvements
- Update training based on incident lessons learned
- Benchmark against industry best practices

**Annual System Assessment**:
- Comprehensive review of reporting procedures
- Employee feedback on reporting system effectiveness
- Technology updates and capability enhancements
- Integration with overall safety management system

## Confidentiality and Data Protection

### Information Security
- **Access Controls**: Role-based access to incident information
- **Data Encryption**: Secure transmission and storage of sensitive information
- **Retention Policies**: Systematic destruction of records per legal requirements
- **Audit Trails**: Complete record of who accessed information and when

### Privacy Protection
- **Need-to-Know Basis**: Information shared only with personnel requiring it for their duties
- **Identity Protection**: Anonymous reporting options maintained
- **Legal Privilege**: Appropriate legal protections for investigation materials
- **Employee Rights**: Clear communication about how information will be used

**Remember**: Reporting issues early and honestly helps protect everyone. When you see something concerning, speak up. Your voice matters in keeping SpecChem safe and compliant.

// TODO: Add reporting scenario decision tree
// TODO: Create incident severity assessment tool
`
      }
    ]
  },
  {
    slug: 'safety-emergency',
    title: 'Safety & Emergency Response',
    description: 'Comprehensive safety training covering emergency procedures, spill response, and personal protective equipment for SpecChem operations.',
    estimatedHours: 2.5,
    difficulty: 'Intermediate',
    required: true,
    icon: '🚨',
    category: 'Safety Training',
    objectives: [
      'Select and use appropriate PPE for SpecChem products',
      'Execute proper spill and leak response procedures',
      'Follow incident response and notification protocols',
      'Coordinate with emergency responders and internal teams'
    ],
    lessons: [
      {
        slug: 'ppe-safe-practices',
        title: 'PPE & Safe Work Practices',
        duration: 35,
        description: 'PPE types for SpecChem products and safe work practices for concrete chemical handling.',
        content: `
# Personal Protective Equipment & Safe Work Practices

## Understanding PPE Requirements for SpecChem Products

Personal Protective Equipment is your last line of defense against chemical hazards. At SpecChem, we manufacture diverse concrete chemicals requiring different levels of protection based on hazard characteristics and exposure potential.

### PPE Selection Matrix for SpecChem Products

#### Category 1: Water-Based Products (Low Hazard)
**Examples**: Most concrete admixtures, water-based curing compounds
**Minimum PPE Requirements**:
- Safety glasses with side shields
- Chemical-resistant gloves (nitrile recommended)
- Long pants and closed-toe shoes
- Apron when handling large quantities

**Enhanced Protection (Recommended)**:
- Face shield for mixing operations
- Chemical-resistant boots for floor work
- Disposable coveralls for extended exposure

#### Category 2: Solvent-Based Products (Moderate Hazard)
**Examples**: Solvent-based sealers, paint strippers, adhesives
**Minimum PPE Requirements**:
- Chemical splash goggles
- Chemical-resistant gloves (consult SDS for specific material)
- Organic vapor respirator (half-face minimum)
- Chemical-resistant clothing or coveralls
- Chemical-resistant boots

**Enhanced Protection**:
- Full-face respirator for enclosed spaces
- Supplied-air respirator for extended operations
- Chemical-resistant suit for large spill response

#### Category 3: Corrosive Products (High Hazard)
**Examples**: Acid etchers, alkaline cleaners, concrete bonding agents
**Minimum PPE Requirements**:
- Chemical splash goggles and face shield
- Acid-resistant gloves (consult SDS for breakthrough time)
- Acid-resistant apron or full body protection
- Chemical-resistant boots with metatarsal protection
- Eyewash station within 10 seconds travel time

**Emergency Response PPE**:
- Level B or C protection for spill response
- Emergency shower/eyewash accessible
- Self-contained breathing apparatus for major releases

### PPE Inspection and Maintenance

#### Daily Inspection Checklist
**Before Each Use**:
- Check for cracks, tears, or degradation
- Verify proper fit and adjustment
- Confirm expiration dates (respirator cartridges)
- Test emergency eyewash and shower stations

**Glove Inspection**:
- Fill with air and check for leaks
- Examine fingertips and palm areas for wear
- Check cuff area for chemical degradation
- Replace immediately if damage detected

**Respirator Inspection**:
- Check straps and buckles for wear
- Inspect valves and seals
- Verify cartridge/filter expiration dates
- Perform positive and negative pressure checks

#### Maintenance and Storage
**Cleaning Procedures**:
- Clean after each use with appropriate solvent
- Allow complete drying before storage
- Store in clean, dry location away from sunlight
- Separate contaminated PPE from clean equipment

**Replacement Schedule**:
- **Disposable Items**: Single use only (gloves, coveralls, filters)
- **Reusable Items**: Replace per manufacturer schedule or when damaged
- **Respiratory Protection**: Annual fit testing and medical evaluations

## Safe Work Practices

### Engineering Controls

#### Ventilation Systems
**Local Exhaust Ventilation**:
- Fume hoods for small-scale operations
- Downdraft tables for mixing and packaging
- Portable exhaust fans for temporary operations
- Regular maintenance and airflow verification

**General Ventilation**:
- Minimum 6 air changes per hour in work areas
- Fresh air intake away from contamination sources
- Exhaust points to prevent recirculation
- Emergency ventilation for confined spaces

#### Containment Systems
**Secondary Containment**:
- Spill pallets under chemical storage
- Bermed areas for bulk chemical handling
- Drain isolation valves in work areas
- Impermeable flooring in chemical areas

### Administrative Controls

#### Work Procedures
**Standard Operating Procedures**:
- Written procedures for each product category
- Step-by-step safety precautions
- Emergency response actions
- Quality control checkpoints

**Training Requirements**:
- Initial training before handling any SpecChem products
- Annual refresher training for all personnel
- Specialized training for high-hazard products
- Emergency response training and drills

#### Exposure Monitoring
**Air Monitoring**:
- Personal monitoring for high-risk operations
- Area monitoring in work zones
- Continuous monitoring for confined space entry
- Documentation and trending of results

**Biological Monitoring**:
- Medical surveillance for exposed workers
- Baseline and periodic health assessments
- Specialized testing for specific chemicals
- Confidential medical records management

### Safe Handling Techniques

#### Lifting and Moving
**Manual Handling**:
- Use proper lifting techniques (legs, not back)
- Team lifts for containers over 50 pounds
- Mechanical aids when available (dollies, carts)
- Clear pathways before moving chemicals

**Mechanical Handling**:
- Forklift operations by certified operators only
- Proper attachment points and load securing
- Speed limits in chemical handling areas
- Spotter requirements for backing operations

#### Chemical Transfers
**Container-to-Container Transfer**:
- Use pumps or siphons to minimize splashing
- Ground and bond containers to prevent static
- Use appropriate funnels and transfer equipment
- Have spill response materials readily available

**Bulk Loading Operations**:
- Verify compatibility before connecting systems
- Use dry-disconnect couplings when required
- Monitor operations continuously during transfer
- Emergency shutdown procedures readily accessible

### Emergency Procedures

#### Exposure Response
**Skin Contact**:
1. Remove contaminated clothing immediately
2. Flush affected area with water for 15 minutes minimum
3. Seek medical attention if irritation develops
4. Do not apply creams or ointments unless directed

**Eye Contact**:
1. Flush eyes with water for 15 minutes minimum
2. Hold eyelids open to ensure complete irrigation
3. Seek immediate medical attention
4. Do not allow victim to rub eyes

**Inhalation Exposure**:
1. Move victim to fresh air immediately
2. Monitor for breathing difficulties
3. Administer oxygen if trained and available
4. Seek immediate medical attention for serious exposures

#### First Aid Considerations
**Training Requirements**:
- At least one trained first aid responder per shift
- CPR certification for emergency response team
- Regular training updates and practice sessions
- Coordination with local emergency medical services

**First Aid Supplies**:
- Well-stocked first aid kits in all work areas
- Emergency eyewash and shower stations
- Oxygen delivery equipment where appropriate
- Direct communication with medical professionals

## Workplace Safety Culture

### Personal Responsibility
**Individual Actions**:
- Always wear required PPE
- Report unsafe conditions immediately
- Follow established procedures
- Ask questions when uncertain

**Team Responsibility**:
- Look out for coworkers' safety
- Share lessons learned from near misses
- Participate in safety meetings and training
- Support new employees' safety learning

### Continuous Improvement
**Safety Feedback**:
- Regular safety suggestion programs
- Recognition for proactive safety actions
- Investigation of near misses and incidents
- Implementation of lessons learned

**Technology Updates**:
- Evaluation of new PPE technologies
- Assessment of improved work methods
- Investment in engineering controls
- Regular safety equipment upgrades

**Remember**: PPE protects you only when used correctly and consistently. When in doubt about PPE requirements, consult the Safety Data Sheet or ask your supervisor.

// TODO: Add PPE selection interactive tool
// TODO: Create virtual reality training for emergency response
`
      },
      {
        slug: 'spill-leak-response',
        title: 'Spill & Leak Response',
        duration: 25,
        description: 'Immediate actions, internal/external reporting, and containment procedures for SpecChem products.',
        content: `
# Spill & Leak Response Procedures

## Immediate Response Framework

When a spill or leak occurs, the first few minutes are critical. SpecChem's response framework prioritizes life safety, environmental protection, and property preservation in that order.

### Initial Assessment (First 60 Seconds)

#### Life Safety Evaluation
**Immediate Questions**:
- Are people in immediate danger?
- Is evacuation necessary?
- Are emergency services needed?
- Is the area secure from ignition sources?

**Immediate Actions**:
1. **Alert Personnel**: Warn others in the immediate area
2. **Assess Hazards**: Identify the spilled material using labels/SDS
3. **Establish Perimeter**: Keep unnecessary personnel away
4. **Control Sources**: Stop the release if safe to do so

#### Hazard Identification
**Use Multiple Sources**:
- Product labels and container markings
- Safety Data Sheets (Section 6: Accidental Release Measures)
- Emergency response guides
- SpecChem emergency hotline technical support

**Key Information Needed**:
- Chemical identity and concentration
- Quantity released or potentially releasable
- Physical state (liquid, solid, gas)
- Primary hazards (flammable, corrosive, toxic)
- Environmental sensitivity

### Spill Classification System

#### Class A: Minor Spills (Less than 5 gallons or 50 pounds)
**Characteristics**:
- Small quantity of low-to-moderate hazard material
- No immediate threat to personnel or environment
- Contained within work area or immediate vicinity
- Response capability available on-site

**Response Level**: Department personnel with supervisor oversight

#### Class B: Moderate Spills (5-50 gallons or 50-500 pounds)
**Characteristics**:
- Larger quantity or higher hazard material
- Potential for off-site impact if not controlled
- May require specialized equipment or expertise
- Could affect normal business operations

**Response Level**: Emergency response team activation, management notification

#### Class C: Major Spills (Greater than 50 gallons or 500 pounds)
**Characteristics**:
- Large quantity or extremely hazardous material
- Immediate threat to personnel, environment, or property
- Likely to require outside assistance
- Significant business and regulatory impact

**Response Level**: Full emergency response, regulatory notification, possible evacuation

## Product-Specific Response Procedures

### Water-Based Products
**Examples**: Concrete admixtures, water-based curing compounds, most repair materials

#### Containment Methods
- **Absorbent Materials**: Use cellulose-based absorbents, avoid clay-based for alkaline products
- **Diking**: Use sand, soil, or commercial dikes to direct flow away from drains
- **Neutralization**: Generally not recommended without technical guidance

#### Environmental Considerations
- **pH Concerns**: Some products are highly alkaline (pH > 12)
- **Aquatic Toxicity**: Check SDS Section 12 for environmental data
- **Biodegradability**: Most are readily biodegradable but monitor oxygen depletion

### Solvent-Based Products
**Examples**: Solvent-based sealers, paint strippers, adhesive primers

#### Fire Prevention
- **Eliminate Ignition Sources**: Turn off electrical equipment, no smoking, remove hot work
- **Vapor Control**: Use foam or vapor-suppressing agents
- **Ventilation**: Increase air movement to prevent vapor accumulation
- **Static Control**: Ground and bond all equipment and containers

#### Containment Methods
- **Dike and Drain**: Prevent spread to sewers or waterways
- **Compatible Absorbents**: Use synthetic absorbents designed for hydrocarbons
- **Recovery Methods**: Pump or vacuum when possible to minimize waste

### Corrosive Products
**Examples**: Acid etchers, alkaline cleaners, concrete surface preparations

#### Personal Protection
- **Approach from Uphill/Upwind**: Avoid exposure to vapors
- **Enhanced PPE**: Acid-resistant suits, supplied-air respirators
- **Decontamination**: Have neutralizing agents and wash water available
- **Medical Support**: Ensure emergency medical services are aware of chemical involved

#### Neutralization Procedures
**Acid Spills**:
- Use sodium bicarbonate or lime for small spills
- Add neutralizing agent slowly to prevent violent reaction
- Monitor pH during neutralization process
- Flush area with water after neutralization

**Base/Alkali Spills**:
- Use weak acids (citric acid solution) for small spills
- Never use strong acids for neutralization
- Monitor temperature during neutralization
- Consider professional hazmat response for large spills

## Containment Techniques

### Physical Barriers
**Temporary Dikes**:
- Sand-filled tubes or bags
- Commercial spill dikes and barriers
- Plastic sheeting weighted with sand
- Inflatable containment systems

**Drain Protection**:
- Drain covers and seals
- Absorbent socks around drain openings
- Temporary plugs for floor drains
- Diversion to secondary containment

### Absorption Methods
**Organic Absorbents** (for oil-based products):
- Peat moss, sawdust, or commercial organic absorbents
- High absorption capacity but may be flammable
- Good for outdoor spills on soil or pavement

**Inorganic Absorbents** (for water-based products):
- Clay-based absorbents (bentonite, attapulgite)
- Perlite or vermiculite for acid spills
- Sand for temporary containment and traction

**Synthetic Absorbents** (universal application):
- Polypropylene-based materials
- High capacity and selectivity
- Reusable in some applications
- Compatible with most chemicals

## Reporting Requirements

### Internal Reporting

#### Immediate Notification (Within 15 Minutes)
**SpecChem Emergency Hotline: 1-800-SPEC911**
**Information Required**:
- Caller identification and location
- Product identity and approximate quantity
- Current status and containment actions
- Personnel injuries or exposures
- Environmental impact assessment

#### Supervisor Notification
- Direct supervisor and department manager
- Safety and environmental coordinator
- Facility manager and security
- Customer service (if customer product involved)

### External Reporting Requirements

#### Regulatory Notifications
**National Response Center (NRC)**: 1-800-424-8802
- Required for releases that could affect navigable waters
- Releases above Reportable Quantities (RQ) per CERCLA
- Transportation-related releases above threshold quantities

**State Environmental Agency**:
- Spill reporting requirements vary by state
- Generally required for releases to soil, water, or air
- May require written follow-up within 24-48 hours

**Local Emergency Planning Committee (LEPC)**:
- Community notification for potential off-site impacts
- Required under SARA Title III for certain chemicals
- Coordinate with local emergency responders

#### Documentation Requirements
**Initial Report (Within 24 Hours)**:
- Detailed spill description and timeline
- Response actions taken
- Environmental and health impacts
- Preliminary cause analysis

**Final Report (Within 30 Days)**:
- Complete investigation results
- Root cause analysis
- Corrective actions implemented
- Cost summary and lessons learned

## Cleanup and Recovery

### Waste Management
**Classification**:
- Determine if cleanup materials are hazardous waste
- Segregate different waste types appropriately
- Use proper containers and labeling
- Arrange for licensed disposal if required

**Documentation**:
- Maintain chain of custody for waste materials
- Keep disposal manifests and certificates
- Document waste generation quantities
- Report as required under RCRA

### Site Restoration
**Assessment**:
- Evaluate extent of contamination
- Determine if soil or groundwater affected
- Assess need for environmental sampling
- Consider long-term monitoring requirements

**Remediation**:
- Excavate contaminated soil if necessary
- Implement groundwater monitoring if appropriate
- Restore site to original condition or better
- Document restoration activities

### Equipment Decontamination
**Personnel Decontamination**:
- Establish decontamination stations
- Use appropriate decontamination solutions
- Dispose of contaminated clothing properly
- Provide medical evaluation if needed

**Equipment Cleaning**:
- Clean all response equipment thoroughly
- Test equipment for residual contamination
- Replace disposable components
- Return equipment to ready status

## Post-Incident Activities

### Investigation
**Immediate Investigation**:
- Preserve evidence and document scene
- Interview witnesses and involved personnel
- Review procedures and training records
- Identify immediate corrective actions

**Root Cause Analysis**:
- Systematic analysis of contributing factors
- Identification of systemic issues
- Development of preventive measures
- Implementation of corrective actions

### Communication
**Internal Communication**:
- Share lessons learned with all personnel
- Update procedures based on experience
- Recognize effective response actions
- Address training gaps identified

**External Communication**:
- Coordinate with regulatory agencies
- Communicate with affected communities
- Update emergency response plans
- Share information with industry partners

### Continuous Improvement
**Procedure Updates**:
- Revise response procedures based on experience
- Update emergency contact information
- Enhance training programs
- Improve response equipment and materials

**Training Enhancement**:
- Conduct post-incident training sessions
- Practice scenarios based on actual events
- Update emergency response drills
- Cross-train personnel for better coverage

**Remember**: The best spill response is spill prevention. Regular maintenance, proper handling procedures, and hazard awareness prevent most incidents from occurring.

// TODO: Add spill response decision flowchart
// TODO: Create virtual spill response training scenarios
`
      },
      {
        slug: 'incident-response-notification',
        title: 'Incident Response & Notification',
        duration: 20,
        description: 'Who to contact, timelines, forms, and coordination procedures for emergency incidents.',
        content: `
# Incident Response & Notification Procedures

## Incident Classification and Response Levels

Understanding the scope and severity of an incident determines the appropriate response level and notification requirements. SpecChem uses a tiered approach to ensure proportional response while meeting all regulatory obligations.

### Incident Severity Levels

#### Level 1: Minor Incidents
**Characteristics**:
- No injuries requiring medical treatment
- Environmental impact contained on-site
- Minimal property damage (under $1,000)
- Normal operations can continue
- No regulatory notification required

**Examples**:
- Small chemical spill contained immediately
- Minor equipment malfunction with no safety impact
- Customer complaint about product performance
- First aid injury (cut, bruise, minor burn)

#### Level 2: Moderate Incidents
**Characteristics**:
- Medical treatment injuries but no lost time
- Environmental impact contained but reportable
- Property damage $1,000-$25,000
- Temporary disruption to operations
- May require regulatory notification

**Examples**:
- Chemical spill requiring outside cleanup services
- Equipment failure causing production delays
- Worker injury requiring medical treatment
- Product quality issue affecting multiple customers

#### Level 3: Major Incidents
**Characteristics**:
- Serious injuries or fatalities
- Significant environmental impact or off-site effects
- Property damage exceeding $25,000
- Extended operational disruption
- Regulatory notifications required
- Potential media attention

**Examples**:
- Serious worker injury or fatality
- Large chemical release affecting neighboring properties
- Fire or explosion involving SpecChem materials
- Transportation accident with hazmat involvement

## Emergency Contact Hierarchy

### Primary Emergency Contacts

#### Immediate Response Team
**SpecChem Emergency Hotline: 1-800-SPEC911**
- 24/7 staffed emergency response center
- Direct connection to on-call technical specialists
- Automatic escalation to management
- Links to external emergency services

**Facility Emergency Coordinator**: [Site-specific contact]
- First point of contact for facility incidents
- Authority to initiate emergency response procedures
- Coordinates with internal and external responders
- Maintains emergency response supplies and equipment

#### Management Notification Chain
1. **Immediate Supervisor**: First notification for any incident
2. **Department Manager**: Notified within 30 minutes for Level 2+ incidents
3. **Plant Manager**: Notified within 1 hour for Level 2+ incidents
4. **Regional Manager**: Notified within 2 hours for Level 3 incidents
5. **Corporate Management**: Notified within 4 hours for Level 3 incidents

### External Emergency Contacts

#### Emergency Services
**911 (Life-Threatening Emergencies)**
- Fire department for chemical fires or large spills
- EMS for serious injuries
- Police for security incidents or traffic control
- Hazmat teams for major chemical releases

**Poison Control Center: 1-800-222-1222**
- Medical guidance for chemical exposures
- Treatment recommendations for healthcare providers
- Follow-up care coordination
- Exposure outcome tracking

#### Regulatory Agencies
**National Response Center: 1-800-424-8802**
- Required for transportation incidents
- Releases to navigable waters
- Releases above Reportable Quantities (RQ)
- 24/7 federal government coordination center

**State Environmental Agency**: [State-specific numbers]
- Environmental releases requiring state notification
- Air emissions incidents
- Groundwater or soil contamination
- Waste management violations

**OSHA Area Office**: [Region-specific numbers]
- Serious workplace injuries or fatalities
- Imminent danger situations
- Major safety violations
- Employee safety complaints

## Notification Timelines and Requirements

### Immediate Notifications (Within 15 Minutes)

#### Always Required
- Life-threatening injuries or fatalities
- Major chemical releases with off-site impact
- Fires or explosions involving hazmat
- Security incidents or threats
- Evacuation of facility or surrounding area

#### Notification Process
1. **Call 911** if immediate emergency services needed
2. **Call SpecChem Emergency Hotline** for all Level 2+ incidents
3. **Notify Facility Emergency Coordinator** at site
4. **Alert immediate supervisor** if available
5. **Begin incident documentation** immediately

### Short-Term Notifications (Within 1-4 Hours)

#### Internal Notifications
**Within 1 Hour**:
- Plant Manager for Level 2+ incidents
- Safety and Environmental Manager
- Human Resources for worker injuries
- Customer Service for product-related incidents

**Within 4 Hours**:
- Corporate management for Level 3 incidents
- Legal department for potential liability issues
- Insurance carrier for property damage
- Public relations for potential media attention

#### External Notifications
**Within 8 Hours**:
- OSHA for serious workplace injuries or fatalities
- State environmental agencies per local requirements
- Local Emergency Planning Committee (LEPC) when required
- Customer notifications for product-related incidents

### Long-Term Notifications (24 Hours to 30 Days)

#### Written Reports
**24-Hour Written Reports**:
- OSHA Form 300A for recordable injuries
- State environmental incident reports
- DOT hazmat incident reports (when applicable)
- Insurance claim documentation

**30-Day Follow-up Reports**:
- Detailed incident investigation results
- Root cause analysis and corrective actions
- Regulatory agency final reports
- Lessons learned documentation

## Incident Documentation Requirements

### Initial Documentation (During Response)

#### Critical Information to Capture
**Basic Incident Details**:
- Date, time, and exact location
- Personnel involved and witnesses
- Sequence of events leading to incident
- Immediate actions taken
- Current status and ongoing concerns

**Medical Information**:
- Nature and extent of injuries
- First aid or medical treatment provided
- Medical facility where treated
- Attending physician contact information
- Prognosis and expected recovery time

**Environmental Information**:
- Chemical(s) involved and quantities
- Environmental compartments affected (air, water, soil)
- Weather conditions at time of incident
- Containment and cleanup actions taken
- Potential for continued impact

### Formal Documentation

#### Incident Report Form
**SpecChem Form IR-001** must be completed within 24 hours:
- Complete narrative description of incident
- Contributing factors and root causes
- Witness statements and contact information
- Photographs and supporting documentation
- Immediate corrective actions implemented

#### Supporting Documentation
**Required Attachments**:
- Safety Data Sheets for chemicals involved
- Training records for personnel involved
- Maintenance records for equipment involved
- Previous incident reports for similar events
- Regulatory correspondence related to incident

### Investigation Requirements

#### Investigation Team Composition
**Level 1 Incidents**: Supervisor and affected worker
**Level 2 Incidents**: Manager, safety representative, and technical specialist
**Level 3 Incidents**: Formal investigation team including:
- Senior management representative
- Safety and environmental specialists
- Technical expert familiar with process/product
- Human resources representative
- External consultant if needed

#### Investigation Timeline
**Preliminary Report**: Within 5 business days
- Basic facts and immediate corrective actions
- Preliminary cause assessment
- Resource requirements for full investigation

**Final Report**: Within 30 days
- Complete root cause analysis
- Detailed corrective action plan with timelines
- Recommendations for preventing similar incidents
- Updates to procedures and training programs

## Communication Protocols

### Internal Communication

#### Management Briefings
**Daily Updates** during active incident response:
- Status of response and cleanup activities
- Personnel and environmental safety status
- Regulatory agency interactions
- Media inquiries and public relations considerations

**Weekly Updates** during extended incidents:
- Investigation progress and findings
- Implementation status of corrective actions
- Cost estimates and insurance claim status
- Schedule for returning to normal operations

#### Employee Communication
**All-Hands Meetings**:
- Facts about what occurred (without speculation)
- Actions being taken to prevent recurrence
- Changes to procedures or safety measures
- Recognition for effective emergency response

**Safety Bulletins**:
- Lessons learned from incident
- Updated safety procedures
- Reminders about reporting requirements
- Recognition of safety suggestions or improvements

### External Communication

#### Regulatory Agencies
**Professional Communication**:
- Prompt, accurate information sharing
- Cooperation with investigations
- Timely implementation of required corrective actions
- Proactive communication about prevention measures

#### Community Relations
**When Required**:
- Incidents with potential off-site impacts
- Community concerns about facility operations
- Media inquiries about incident
- Integration with emergency response agencies

#### Customer Communication
**Product-Related Incidents**:
- Immediate notification if product safety involved
- Technical support for proper handling/application
- Coordination with customer emergency response
- Follow-up to ensure customer safety measures

## Post-Incident Recovery

### Operational Recovery
**Return to Operations Checklist**:
- All safety hazards eliminated or controlled
- Equipment inspected and certified safe
- Personnel medical clearances obtained
- Environmental impacts assessed and controlled
- Regulatory approvals obtained if required

### System Improvements
**Procedure Updates**:
- Incorporate lessons learned into procedures
- Update emergency response plans
- Revise training programs based on experience
- Implement additional safeguards identified

**Training Enhancements**:
- Additional training for personnel involved
- Sharing lessons learned with all personnel
- Practice drills based on actual incident experience
- Cross-training to improve response capability

### Continuous Monitoring
**Follow-up Activities**:
- Monitor effectiveness of corrective actions
- Track similar incidents industry-wide
- Participate in industry safety initiatives
- Regular review of emergency response capabilities

**Performance Metrics**:
- Response time improvements
- Reduction in incident severity
- Employee safety suggestion participation
- Customer safety satisfaction metrics

**Remember**: Effective incident response protects people, the environment, and the business. Clear communication and systematic documentation are essential for learning and continuous improvement.

// TODO: Add incident notification decision tree
// TODO: Create mobile app for incident reporting
`
      }
    ]
  },
  {
    slug: 'security-awareness',
    title: 'Security Awareness',
    description: 'Security protocols for hazardous materials operations, including threat recognition and response procedures for SpecChem facilities and transportation.',
    estimatedHours: 1.5,
    difficulty: 'Beginner',
    required: false,
    icon: '🔐',
    category: 'Security Training',
    objectives: [
      'Recognize potential security threats in hazmat operations',
      'Implement access control and site security measures',
      'Report suspicious activities through proper channels',
      'Coordinate with law enforcement and security agencies'
    ],
    lessons: [
      {
        slug: 'threat-awareness',
        title: 'Threat Awareness',
        duration: 25,
        description: 'Understanding why hazardous materials can be targeted and recognizing potential threats.',
        content: `
# Security Threat Awareness for Hazardous Materials

## Why Hazardous Materials Are Security Targets

Hazardous materials, particularly those used in concrete and construction chemicals, can pose security risks if diverted from legitimate uses. Understanding these risks helps SpecChem personnel recognize and respond appropriately to potential threats.

### Dual-Use Concerns

#### Legitimate vs. Illegitimate Uses
Many SpecChem products have legitimate construction applications but could potentially be misused:

**Oxidizing Agents** (concrete accelerators, curing compounds):
- **Legitimate Use**: Speed concrete curing, improve strength development
- **Security Concern**: Can enhance explosives or serve as components in improvised devices
- **Risk Level**: Moderate - requires combination with other materials

**Acids and Corrosives** (concrete etchers, surface preparation):
- **Legitimate Use**: Surface preparation, concrete repair, cleaning
- **Security Concern**: Can be used to damage infrastructure or create toxic gases
- **Risk Level**: High - readily available and easily weaponized

**Solvents and Flammable Liquids** (sealers, adhesives, cleaners):
- **Legitimate Use**: Concrete protection, bonding applications, equipment cleaning
- **Security Concern**: Fire accelerants, solvent-based improvised devices
- **Risk Level**: Moderate to High - depends on quantity and accessibility

### Threat Categories

#### Internal Threats
**Disgruntled Employees**:
- Knowledge of facility layout and security procedures
- Access to restricted areas and materials
- Understanding of high-value or dangerous products
- Potential for sabotage or theft

**Indicators to Watch**:
- Unusual interest in security procedures
- Attempting to access areas outside job responsibilities
- Taking photographs or detailed notes about facility operations
- Asking questions about product formulations or quantities

#### External Threats
**Criminal Organizations**:
- Theft for resale on black market
- Diversion to illegal drug manufacturing
- Use in criminal activities (arson, vandalism)
- Extortion through threat of misuse

**Terrorist Organizations**:
- Use in improvised explosive devices
- Infrastructure attacks using corrosive materials
- Mass casualty events using toxic materials
- Psychological impact through chemical fears

### Vulnerability Assessment

#### High-Risk Products
SpecChem maintains an internal classification of products based on security risk:

**Category A - Highest Risk**:
- Products listed on DEA precursor chemical lists
- Strong acids and bases in bulk quantities
- High-concentration oxidizers
- Products specifically regulated under CFR Title 6 (DHS)

**Category B - Moderate Risk**:
- Flammable solvents in large quantities
- Toxic materials above threshold quantities
- Products requiring special transportation security
- Dual-use chemicals with wide applications

**Category C - Lower Risk**:
- Water-based products with low toxicity
- Dilute solutions below regulatory thresholds
- Products with built-in deterrents or tracers
- Materials requiring specialized knowledge for misuse

#### Facility Vulnerabilities
**Physical Security**:
- Perimeter fencing and lighting adequacy
- Access control systems effectiveness
- Storage area security measures
- Loading dock and transportation security

**Information Security**:
- Product formulation and inventory data protection
- Customer information and shipping details
- Employee personal information security
- Facility layout and security procedure confidentiality

## Recognizing Security Threats

### Suspicious Behavior Indicators

#### Personnel Behavior
**Employees**:
- Working unusual hours without authorization
- Accessing computers or files outside job scope
- Taking photos or making drawings of facility areas
- Asking colleagues about security procedures or weaknesses

**Visitors and Contractors**:
- Showing excessive interest in restricted areas
- Attempting to gain unauthorized access
- Asking detailed questions about product storage or handling
- Photographing or recording facility operations

#### Operational Anomalies
**Inventory Discrepancies**:
- Missing products not accounted for by normal shrinkage
- Inventory counts not matching shipping/receiving records
- Products missing from high-security storage areas
- Unexplained damage to storage containers

**Documentation Issues**:
- Shipping papers for unknown or suspicious customers
- Orders for unusual product combinations
- Rush orders with cash payment requirements
- Requests for products outside normal customer applications

### Cyber Security Threats

#### Information Systems Vulnerabilities
**Email and Communications**:
- Phishing attempts requesting sensitive information
- Emails with suspicious attachments or links
- Requests for passwords or system access information
- Social engineering attempts to gain information

**Network Security**:
- Unauthorized devices connected to company networks
- Unusual network activity during off-hours
- Attempts to access restricted databases or systems
- Malware or virus infections affecting operations

#### Data Protection
**Sensitive Information Categories**:
- Product formulations and manufacturing processes
- Customer lists and shipping information
- Employee personal and contact information
- Facility security procedures and layouts

**Information Handling Requirements**:
- Classification of information by sensitivity level
- Need-to-know access controls
- Secure storage and transmission procedures
- Regular security awareness training updates

## Response to Security Threats

### Immediate Actions

#### Direct Threats
**If You Observe Immediate Danger**:
1. **Personal Safety First**: Do not confront armed or dangerous individuals
2. **Call 911**: Contact law enforcement immediately
3. **Alert Others**: Warn nearby personnel if safe to do so
4. **Evacuate**: Follow emergency evacuation procedures
5. **Shelter**: If evacuation not possible, shelter in secure location

#### Suspicious Activities
**Non-Emergency Suspicious Behavior**:
1. **Document**: Note date, time, location, and description of activity
2. **Report**: Contact SpecChem Security Office immediately
3. **Preserve**: Maintain any evidence (photos, documents, recordings)
4. **Cooperate**: Assist security personnel and law enforcement as requested
5. **Confidentiality**: Do not discuss incident with unauthorized personnel

### Reporting Procedures

#### Internal Reporting Chain
**SpecChem Security Hotline: 1-800-SPEC-SEC**
- 24/7 security reporting and response
- Direct connection to corporate security office
- Automatic notification to local management
- Coordination with law enforcement when required

**Management Notification**:
- Immediate supervisor for routine security concerns
- Plant manager for significant security incidents
- Corporate security for potential criminal activity
- Legal department for regulatory or law enforcement issues

#### External Reporting Requirements
**Federal Agencies**:
- **FBI**: Terrorist threats or suspected terrorist activity
- **DEA**: Theft or diversion of precursor chemicals
- **ATF**: Theft of explosive materials or components
- **DHS**: Infrastructure threats or vulnerabilities

**Local Agencies**:
- **Police**: Criminal activity or immediate threats
- **Sheriff**: Rural facility security incidents
- **Emergency Management**: Large-scale security events
- **Fire Department**: Hazmat security incidents with fire risk

## Coordination with Law Enforcement

### Working with Agencies

#### Federal Bureau of Investigation (FBI)
**When to Contact**:
- Suspected terrorist activity or threats
- Cyber attacks on critical infrastructure
- International connections to suspicious activities
- Multi-state criminal enterprises

**Information to Provide**:
- Detailed description of suspicious activity
- Persons involved and their identifying information
- Timeline of events and ongoing concerns
- Potential impact on public safety or national security

#### Drug Enforcement Administration (DEA)
**When to Contact**:
- Theft or attempted theft of precursor chemicals
- Suspicious orders for dual-use chemicals
- Discovery of illegal drug manufacturing materials
- Employee involvement in drug-related activities

**Regulatory Requirements**:
- Immediate reporting of significant losses
- Cooperation with investigations
- Implementation of enhanced security measures
- Regular security self-assessments

#### Department of Homeland Security (DHS)
**When to Contact**:
- Threats to critical infrastructure
- Suspected foreign intelligence gathering
- Cyber attacks affecting operations
- Mass casualty threat scenarios

**Coordination Activities**:
- Participation in regional security initiatives
- Information sharing with fusion centers
- Implementation of federal security guidelines
- Emergency response planning coordination

### Maintaining Relationships

#### Regular Communication
**Security Briefings**:
- Quarterly meetings with local law enforcement
- Annual facility security assessments
- Participation in regional security working groups
- Information sharing about emerging threats

**Training and Exercises**:
- Joint emergency response exercises
- Security awareness training for law enforcement
- Cross-training for SpecChem security personnel
- Lessons learned sharing and best practice development

## Security Culture Development

### Employee Awareness

#### Training Components
**Initial Security Orientation**:
- Overview of security threats and risks
- Facility-specific security procedures
- Reporting requirements and contact information
- Personal security practices

**Ongoing Awareness**:
- Monthly security bulletins and updates
- Annual refresher training sessions
- Incident-based training after security events
- Recognition programs for security vigilance

#### Building Security Mindset
**Personal Responsibility**:
- Everyone has a role in facility security
- Security is part of daily job responsibilities
- Proactive reporting prevents larger problems
- Balance security with operational efficiency

**Team Approach**:
- Look out for coworkers and visitors
- Share security concerns openly
- Support security procedures even when inconvenient
- Participate in security improvements

### Continuous Improvement

#### Regular Assessments
**Internal Reviews**:
- Monthly security metrics and trends
- Quarterly vulnerability assessments
- Annual comprehensive security audits
- Post-incident security reviews

**External Evaluations**:
- Independent security consultations
- Law enforcement security assessments
- Industry peer reviews and benchmarking
- Regulatory compliance audits

#### Technology and Procedure Updates
**System Enhancements**:
- Access control system upgrades
- Video surveillance improvements
- Intrusion detection enhancements
- Communication system modernization

**Procedure Refinements**:
- Updated threat response procedures
- Enhanced visitor screening processes
- Improved information handling protocols
- Streamlined reporting and escalation procedures

**Remember**: Security is everyone's responsibility. Stay alert, report suspicious activities promptly, and maintain the balance between security and productivity that keeps SpecChem safe and successful.

// TODO: Add threat recognition training scenarios
// TODO: Create security incident reporting mobile app
`
      },
      {
        slug: 'access-control-site-security',
        title: 'Access Control & Site Security',
        duration: 20,
        description: 'SpecChem policies for facility access, visitor management, and physical security measures.',
        content: `
# Access Control & Site Security

## SpecChem Access Control Framework

Physical security begins with controlling who can enter SpecChem facilities and which areas they can access. Our layered approach provides multiple security checkpoints while maintaining operational efficiency.

### Security Zones and Access Levels

#### Public Areas (Level 0)
**Areas Included**:
- Main reception and lobby areas
- Conference rooms designated for external meetings
- Visitor parking areas
- Public restroom facilities

**Access Requirements**:
- No special authorization required
- Visitor sign-in and escort requirements
- Supervision by SpecChem personnel
- Time limitations on access

#### General Work Areas (Level 1)
**Areas Included**:
- Administrative offices
- Non-hazmat manufacturing areas
- Shipping and receiving (non-hazmat)
- Break rooms and common areas
- Maintenance shops (general)

**Access Requirements**:
- SpecChem employee ID badge
- Contractor escorts required
- Basic safety training completion
- Clean background check

#### Restricted Areas (Level 2)
**Areas Included**:
- Hazmat storage and handling areas
- Chemical mixing and packaging areas
- Quality control laboratories
- Maintenance areas with hazmat systems
- Loading docks for hazmat products

**Access Requirements**:
- Role-based access authorization
- HazMat training certification current
- Medical surveillance when required
- Enhanced background investigation

#### High-Security Areas (Level 3)
**Areas Included**:
- Precursor chemical storage
- Explosive materials storage
- Critical infrastructure (electrical, IT, security systems)
- Executive offices and safes
- Confidential research and development areas

**Access Requirements**:
- Individual access authorization by management
- Security clearance when applicable
- Specialized training completion
- Two-person integrity when required
- Access logging and monitoring

### Employee Access Management

#### Badge and Identification Systems

**Employee ID Badges**:
- Photo identification with current employee data
- Embedded access control technology (RFID/magnetic stripe)
- Color-coded by access level and department
- Expiration dates clearly visible
- Lost badge replacement procedures

**Access Control Readers**:
- Electronic card readers at all security zone boundaries
- Biometric verification for highest security areas
- Time-based access restrictions (work hours, overtime approval)
- Integration with visitor management systems
- Real-time monitoring and alerting capabilities

#### Access Authorization Process

**New Employee Setup**:
1. **Background Check Completion**: Verify employment eligibility and criminal history
2. **Training Requirements**: Complete required safety and security training
3. **Medical Clearance**: Obtain necessary medical surveillance clearances
4. **Role Assessment**: Determine minimum access required for job functions
5. **Management Approval**: Supervisor and security office authorization
6. **System Programming**: Configure access control system with approved areas
7. **Badge Issuance**: Provide employee with programmed access badge

**Access Modifications**:
- **Promotions/Job Changes**: Update access based on new responsibilities
- **Temporary Access**: Short-term access for special projects or coverage
- **Access Removal**: Immediate termination of access upon employment end
- **Quarterly Reviews**: Systematic review of access rights vs. current job needs

### Visitor Management

#### Visitor Categories and Requirements

**Business Visitors** (customers, suppliers, regulatory agencies):
- **Pre-Registration**: Advance notice and approval by SpecChem contact
- **Check-In Process**: Photo ID verification and visitor badge issuance
- **Escort Requirements**: Accompanied by authorized SpecChem employee
- **Area Restrictions**: Limited to areas necessary for business purpose
- **Safety Briefing**: Basic facility safety and emergency information

**Contractors and Service Personnel**:
- **Pre-Qualification**: Background checks and insurance verification
- **Training Requirements**: Site-specific safety and security training
- **Badge System**: Temporary badges with appropriate access levels
- **Tool and Equipment Control**: Inspection and logging procedures
- **Work Permits**: Authorization for specific tasks and areas

**VIP and Executive Visitors**:
- **Enhanced Screening**: Advanced background verification when required
- **Dedicated Escorts**: Senior personnel assigned as escorts
- **Secure Areas**: Access to restricted areas with proper authorization
- **Communication Protocols**: Coordination with corporate security
- **Special Accommodations**: Additional security measures as needed

#### Visitor Processing Procedures

**Check-In Process**:
1. **Identity Verification**: Government-issued photo ID required
2. **Purpose Documentation**: Record business purpose and SpecChem contact
3. **Safety Briefing**: Emergency procedures and facility safety rules
4. **Badge Issuance**: Temporary visitor badge with photo and expiration
5. **Escort Assignment**: Connect with authorized SpecChem escort
6. **Area Authorization**: Verify approved areas for visit
7. **Check-Out**: Return badge and record departure time

**Special Considerations**:
- **Foreign Nationals**: Additional screening and documentation requirements
- **Media Personnel**: Special authorization and public relations coordination
- **Government Officials**: Coordination with legal and executive management
- **After-Hours Visits**: Enhanced security procedures and management approval

### Perimeter Security

#### Physical Barriers

**Fencing and Gates**:
- **Perimeter Fencing**: Minimum 8-foot chain link with security enhancements
- **Access Gates**: Controlled entry points with guard stations or card readers
- **Emergency Gates**: Clearly marked for emergency vehicle access
- **Gate Procedures**: Opening/closing protocols and access logging

**Vehicle Control**:
- **Truck Inspection Areas**: Dedicated areas for incoming/outgoing vehicle inspection
- **Parking Controls**: Designated areas for employees, visitors, and contractors
- **Vehicle Registration**: System for tracking authorized vehicles on-site
- **Barrier Systems**: Bollards or other barriers protecting critical infrastructure

#### Surveillance Systems

**Video Surveillance**:
- **Camera Coverage**: Comprehensive coverage of perimeter, entrances, and critical areas
- **Recording Systems**: Digital recording with minimum 30-day retention
- **Monitoring**: Live monitoring during business hours, motion detection after hours
- **Access Control**: Restricted access to surveillance systems and recordings

**Intrusion Detection**:
- **Motion Sensors**: Interior sensors for after-hours detection
- **Door/Window Contacts**: Monitoring of all potential entry points
- **Vibration Detectors**: Perimeter fence monitoring systems
- **Central Station**: Professional monitoring service with law enforcement response

### Key and Lock Management

#### Mechanical Keys

**Key Control System**:
- **Master Key Hierarchy**: Organized system with appropriate access levels
- **Key Issuance Tracking**: Record of all keys issued and to whom
- **Key Return Requirements**: Procedures for key return upon access termination
- **Lock Rekeying**: Regular rekeying schedule and after key loss incidents

**High-Security Keys**:
- **Restricted Key Blanks**: Keys that cannot be duplicated without authorization
- **Two-Person Control**: Critical areas requiring two-person access
- **Safe and Vault Keys**: Special handling procedures for high-value areas
- **Emergency Access**: Procedures for emergency access when keyholders unavailable

#### Electronic Access Systems

**System Advantages**:
- **Audit Trails**: Complete record of who accessed what areas when
- **Immediate Deactivation**: Lost credentials can be deactivated instantly
- **Time-Based Access**: Access can be limited to specific hours or days
- **Integration**: Links with other security systems for comprehensive monitoring

**System Maintenance**:
- **Regular Testing**: Periodic testing of all access points and readers
- **Battery Replacement**: Scheduled maintenance of electronic locks
- **Software Updates**: Regular updates to access control software
- **Backup Systems**: Manual override procedures when systems fail

### Transportation Security

#### Vehicle and Driver Controls

**Driver Authorization**:
- **Background Checks**: Enhanced background investigations for hazmat drivers
- **Training Certification**: Current hazmat endorsement and company training
- **Medical Certification**: Current DOT medical certification
- **Performance Monitoring**: Regular evaluation of safety and security performance

**Vehicle Security Features**:
- **GPS Tracking**: Real-time location monitoring for all hazmat vehicles
- **Communication Systems**: Two-way radio or cellular communication capability
- **Security Equipment**: Locks, seals, and tamper-evident devices
- **Emergency Equipment**: Spill response materials and emergency communication

#### Loading and Shipping Security

**Secure Loading Procedures**:
- **Area Control**: Restricted access to loading areas during operations
- **Product Verification**: Confirmation of product identity before loading
- **Seal Application**: Security seals applied to loaded compartments
- **Documentation Security**: Secure handling of shipping papers and manifests

**Chain of Custody**:
- **Transfer Documentation**: Clear record of product custody transfers
- **Signature Requirements**: Authorized signatures for each custody transfer
- **Inspection Records**: Documentation of vehicle and product inspections
- **Delivery Confirmation**: Verification of delivery to authorized recipients

## Emergency Security Procedures

### Lockdown Procedures

#### Threat-Based Lockdown
**When to Implement**:
- Armed intruder on or near facility
- Terrorist threat directed at facility
- Civil unrest affecting facility area
- Law enforcement request for facility lockdown

**Lockdown Actions**:
1. **Immediate Notification**: Security alarm and PA announcement
2. **Access Control**: All exterior doors automatically lock
3. **Personnel Safety**: Employees move to designated safe areas
4. **Communication**: Management contacts law enforcement
5. **Monitoring**: Continuous surveillance and threat assessment
6. **All-Clear**: Coordinated with law enforcement before lifting lockdown

#### Medical Emergency Lockdown
**Procedures for Hazmat Incidents**:
- Containment of affected areas
- Prevention of cross-contamination
- Control of emergency responder access
- Protection of unaffected personnel
- Coordination with medical and environmental response teams

### Evacuation Security

#### Controlled Evacuation
**Security Considerations During Evacuation**:
- **Asset Protection**: Secure critical areas and materials before evacuation
- **Personnel Accountability**: Ensure all personnel are accounted for
- **Access Control**: Prevent unauthorized access during evacuation
- **Evidence Preservation**: Protect potential evidence if incident is criminal

#### Post-Evacuation Security
**Facility Protection**:
- Enhanced security measures during facility vacancy
- Coordination with local law enforcement for periodic checks
- Remote monitoring systems activation
- Controlled re-entry procedures when safe to return

## Security Performance Metrics

### Key Performance Indicators

#### Access Control Effectiveness
- **Unauthorized Access Attempts**: Number and resolution of access violations
- **Badge/Key Losses**: Frequency and response time for replacements
- **System Uptime**: Reliability of electronic access control systems
- **Training Compliance**: Percentage of personnel with current security training

#### Incident Response Metrics
- **Response Time**: Time from security alert to response team arrival
- **Incident Resolution**: Time to resolve security incidents
- **False Alarm Rate**: Frequency of false alarms and system improvements
- **Cooperation Level**: Effectiveness of coordination with law enforcement

### Continuous Improvement

#### Regular Assessments
**Monthly Reviews**:
- Access control system performance
- Security incident trends and patterns
- Personnel compliance with security procedures
- Visitor management effectiveness

**Annual Audits**:
- Comprehensive security system evaluation
- Third-party security assessments
- Comparison with industry best practices
- Cost-benefit analysis of security investments

#### Technology Upgrades
**System Enhancements**:
- Regular evaluation of new security technologies
- Integration improvements between security systems
- User interface improvements for better compliance
- Mobile applications for security reporting and monitoring

**Training Updates**:
- Regular updates to security awareness training
- Technology-specific training for new systems
- Cross-training for security system redundancy
- Recognition programs for security vigilance

**Remember**: Physical security is the foundation of overall security. Every person entering SpecChem facilities must be properly authorized, and every access should be monitored and controlled to protect our people, products, and operations.

// TODO: Add access control system simulator
// TODO: Create visitor management workflow training
`
      },
      {
        slug: 'suspicious-activity-reporting',
        title: 'Suspicious Activity Reporting',
        duration: 15,
        description: 'Internal chain-of-command and external agency reporting procedures for security concerns.',
        content: `
# Suspicious Activity Reporting Procedures

## Understanding Suspicious Activity

Recognizing and reporting suspicious activity is a critical component of SpecChem's security program. Every employee plays a vital role in maintaining security by being aware of their surroundings and reporting activities that seem out of place or potentially threatening.

### Definition of Suspicious Activity

#### What Makes Activity Suspicious
Suspicious activity is any behavior, circumstance, or incident that seems unusual, out of place, or potentially threatening given the normal patterns of activity at SpecChem facilities. Context is crucial - what might be normal in one area or situation could be highly suspicious in another.

**Key Characteristics**:
- **Out of Place**: Activity that doesn't fit the normal pattern for that location or time
- **Unusual Interest**: Excessive attention to security measures, restricted areas, or sensitive operations
- **Preparatory Behavior**: Activities that could be preparation for criminal or terrorist acts
- **Evasive Behavior**: Attempts to avoid detection or questioning
- **Inconsistent Information**: Stories or explanations that don't match observations

#### Categories of Suspicious Activity

**Surveillance and Reconnaissance**:
- Taking photos or videos of facility security features
- Sketching or mapping facility layouts
- Testing security responses by probing boundaries
- Asking detailed questions about security procedures
- Observing facility operations from nearby locations

**Access Attempts**:
- Trying to enter restricted areas without authorization
- Attempting to tailgate through secure doors
- Trying to obtain access badges or keys improperly
- Impersonating employees, contractors, or officials
- Requesting access for suspicious or unusual purposes

**Information Gathering**:
- Asking employees about security procedures or vulnerabilities
- Seeking detailed information about hazmat storage or handling
- Requesting facility tours or access to sensitive areas
- Social engineering attempts to gain passwords or system access
- Unusual interest in employee schedules or facility operations

**Procurement Attempts**:
- Placing orders for unusual quantities of products
- Requesting products outside normal customer applications
- Asking detailed questions about product formulations
- Attempting to purchase with cash or untraceable payment methods
- Rush orders with little lead time or planning

### Context and Assessment

#### Legitimate vs. Suspicious Behavior
Many activities that might seem suspicious have legitimate explanations. The key is to consider context, patterns, and overall circumstances rather than jumping to conclusions.

**Consider These Factors**:
- **Time and Location**: Is the person where they should be at this time?
- **Authorization**: Does the person have legitimate business being there?
- **Behavior Pattern**: Is this a one-time occurrence or part of a pattern?
- **Explanation**: Does the person's explanation match their behavior?
- **Demeanor**: Are they nervous, evasive, or overly interested in security?

**Examples of Context Importance**:
- Taking photos of a facility could be legitimate (insurance documentation) or suspicious (surveillance)
- Asking about security could be normal (new employee orientation) or concerning (unauthorized person)
- Being in a restricted area could be accidental (wrong turn) or intentional (unauthorized access attempt)

## Internal Reporting Chain

### Immediate Reporting Requirements

#### When to Report Immediately
**Call SpecChem Security Hotline: 1-800-SPEC-SEC**

**Immediate Threats** (Call within minutes):
- Armed persons on or near facility
- Threats of violence against personnel or facility
- Suspected explosive devices or threats
- Active intrusion attempts
- Individuals acting erratically and potentially dangerous

**Urgent Concerns** (Report within 1 hour):
- Unauthorized persons in restricted areas
- Suspicious surveillance or photography
- Attempts to gather sensitive information
- Unusual procurement requests or inquiries
- Cyber security incidents or attempts

**Routine Concerns** (Report within 24 hours):
- General security procedure violations
- Unusual but non-threatening behavior
- Equipment or system malfunctions affecting security
- Information security policy violations
- Maintenance issues affecting physical security

### Reporting Hierarchy

#### Primary Reporting Chain
1. **SpecChem Security Hotline**: First contact for all security concerns
2. **Immediate Supervisor**: Notify for workplace-related security issues
3. **Facility Security Coordinator**: Site-level security management
4. **Plant Manager**: Facility-level incidents requiring management attention
5. **Corporate Security**: Company-wide security issues and external coordination

#### Specialized Reporting
**IT Security Issues**:
- IT Security Officer for cyber-related incidents
- Network administrators for system intrusions
- Help desk for suspicious email or communications

**HR-Related Security**:
- Human Resources for employee-related security concerns
- Employee Assistance Program for workplace violence indicators
- Legal department for potential litigation issues

**Environmental/Safety Security**:
- Environmental Health & Safety for hazmat security issues
- Emergency coordinator for potential terrorism involving hazmat
- Regulatory compliance for security-related violations

### Documentation Requirements

#### Initial Report Information
**Essential Details to Capture**:
- **Date and Time**: Exact when the activity occurred
- **Location**: Specific area or address where observed
- **Persons Involved**: Physical descriptions, names if known, vehicle information
- **Activity Description**: Exactly what was observed, not interpretations
- **Witnesses**: Names and contact information of other observers
- **Actions Taken**: Any immediate actions taken by the reporter or others

#### Written Follow-up
**SpecChem Security Report Form SEC-001**:
- Complete within 24 hours of verbal report
- Detailed narrative of observed activity
- Supporting documentation (photos, documents, recordings)
- Assessment of potential threat level
- Recommendations for follow-up actions

**Information Handling**:
- Mark reports as "Security Sensitive" or "Confidential"
- Distribute only to personnel with legitimate need to know
- Store securely with access controls
- Retain per company security records retention policy

## External Reporting Procedures

### Federal Agencies

#### Federal Bureau of Investigation (FBI)
**When to Contact**: 1-800-CALL-FBI or local field office
- **Terrorist Threats**: Suspected terrorist activity or planning
- **Espionage Concerns**: Suspected foreign intelligence gathering
- **Cyber Attacks**: Major cyber security incidents affecting critical infrastructure
- **Multi-Jurisdictional Crimes**: Criminal activity crossing state lines

**Information to Provide**:
- Detailed description of suspicious activity
- Timeline of events and ongoing concerns
- Potential national security implications
- Company contact information for follow-up
- Coordination with local law enforcement

#### Department of Homeland Security (DHS)
**When to Contact**: Local DHS office or fusion center
- **Critical Infrastructure Threats**: Threats to facilities supporting national security
- **Chemical Security Incidents**: Suspicious activity involving high-risk chemicals
- **Transportation Security**: Threats to transportation systems or cargo
- **Border Security Issues**: Suspicious activity near international borders

**Reporting Mechanisms**:
- **"See Something, Say Something"**: National reporting campaign
- **Regional Fusion Centers**: Information sharing with state and local partners
- **DHS Tip Line**: 1-855-DHS-2-ICE for immigration-related concerns
- **Chemical Facility Anti-Terrorism Standards (CFATS)**: Industry-specific reporting

#### Drug Enforcement Administration (DEA)
**When to Contact**: 1-877-DEA-TIPS
- **Precursor Chemical Theft**: Theft or attempted theft of regulated chemicals
- **Suspicious Orders**: Orders that don't fit legitimate business patterns
- **Diversion Attempts**: Attempts to obtain chemicals for illegal drug manufacturing
- **Employee Involvement**: Employee involvement in drug-related criminal activity

### State and Local Agencies

#### State Fusion Centers
**Purpose**: Information sharing between federal, state, and local agencies
- **Threat Assessment**: Analysis of local and regional security threats
- **Intelligence Sharing**: Coordination between different law enforcement levels
- **Private Sector Coordination**: Interface between business and government security
- **Training and Awareness**: Security training and threat briefings

#### Local Law Enforcement
**When to Contact**: 911 for emergencies, non-emergency line for routine concerns
- **Immediate Threats**: Armed persons, violence, or imminent danger
- **Criminal Activity**: Theft, vandalism, or other crimes in progress
- **Traffic Control**: Security incidents requiring traffic management
- **Community Coordination**: Regular information sharing and relationship building

**Building Relationships**:
- **Regular Meetings**: Quarterly briefings with local police and sheriff
- **Facility Tours**: Annual tours for law enforcement familiarization
- **Joint Training**: Participation in emergency response exercises
- **Information Sharing**: Sharing threat information relevant to community

### Anonymous Reporting Options

#### Internal Anonymous Reporting
**SpecChem Ethics and Security Hotline**: 1-800-SPEC-ETH
- **Third-Party Service**: Operated by independent company
- **Multiple Languages**: Available in English and Spanish
- **Various Methods**: Phone, web, email, or written submissions
- **Follow-up Capability**: Ability to receive updates while maintaining anonymity

#### External Anonymous Reporting
**FBI Tips**: tips.fbi.gov or 1-800-CALL-FBI
- **Online Submission**: Secure web-based tip submission
- **Follow-up Contact**: FBI can request additional information
- **Investigation Coordination**: FBI coordinates with appropriate agencies
- **Source Protection**: Strong protections for information sources

## Response and Follow-up Procedures

### Internal Investigation

#### Initial Assessment
**Security Team Response**:
- **Threat Evaluation**: Assess immediacy and severity of potential threat
- **Resource Allocation**: Determine investigation resources required
- **Coordination**: Interface with management and external agencies as needed
- **Protection Measures**: Implement additional security measures if warranted

**Investigation Activities**:
- **Interview Personnel**: Speak with reporters and witnesses
- **Review Evidence**: Examine physical evidence, video recordings, documents
- **Background Checks**: Research individuals or organizations involved
- **Pattern Analysis**: Look for connections to previous incidents or intelligence

#### Coordination with External Agencies
**Information Sharing**:
- **Timely Communication**: Share relevant information promptly with appropriate agencies
- **Professional Cooperation**: Support law enforcement investigations fully
- **Legal Compliance**: Ensure all actions comply with legal requirements
- **Business Continuity**: Balance security needs with operational requirements

### Protection Measures

#### Enhanced Security Procedures
**Temporary Measures**:
- **Increased Surveillance**: Additional monitoring of critical areas
- **Access Restrictions**: Tighter control of facility access
- **Personnel Security**: Additional background checks or monitoring
- **Communication Security**: Enhanced protection of sensitive communications

#### Long-term Improvements
**System Enhancements**:
- **Technology Upgrades**: Improved surveillance or access control systems
- **Procedure Updates**: Revised security procedures based on lessons learned
- **Training Improvements**: Enhanced training based on identified threats
- **Physical Modifications**: Facility modifications to address vulnerabilities

### Communication and Feedback

#### Internal Communication
**Management Briefings**:
- **Incident Summary**: Overview of reported activity and response actions
- **Threat Assessment**: Evaluation of ongoing risk and protective measures
- **Resource Requirements**: Needs for additional security measures or resources
- **Coordination Status**: Updates on external agency involvement

**Employee Communication**:
- **General Awareness**: Information about increased security measures (without operational details)
- **Reporting Encouragement**: Reinforcement of importance of reporting suspicious activity
- **Recognition**: Acknowledgment of employees who report legitimate concerns
- **Training Updates**: Additional training based on current threat environment

#### External Coordination
**Agency Updates**:
- **Investigation Progress**: Regular updates to law enforcement partners
- **Threat Changes**: Communication of evolving threat assessments
- **Lesson Sharing**: Sharing lessons learned with industry partners
- **Community Relations**: Communication with community leaders as appropriate

**Industry Coordination**:
- **Peer Networks**: Sharing threat information with industry security networks
- **Association Participation**: Active participation in industry security associations
- **Best Practice Sharing**: Contributing to industry security best practices
- **Threat Bulletins**: Receiving and sharing security threat bulletins

## Training and Awareness

### Recognition Training

#### What to Look For
**Behavioral Indicators**:
- **Nervousness or Evasion**: Unusual nervousness when questioned or observed
- **Inappropriate Interest**: Excessive interest in security measures or restricted areas
- **Information Seeking**: Asking detailed questions about operations or security
- **Testing Boundaries**: Probing security responses or attempting unauthorized access
- **Pattern Changes**: Changes from normal behavior patterns or routines

**Environmental Indicators**:
- **Out of Place Items**: Equipment, vehicles, or materials that don't belong
- **Unusual Modifications**: Changes to facility or equipment that weren't authorized
- **Communication Equipment**: Unusual communication devices or surveillance equipment
- **Documentation**: Suspicious photographs, maps, or notes about facility operations

#### Scenario-Based Training
**Regular Training Exercises**:
- **Tabletop Exercises**: Discussion-based scenarios for decision-making practice
- **Functional Exercises**: Practice with actual reporting procedures and systems
- **Field Exercises**: Realistic scenarios in actual facility environment
- **Multi-Agency Exercises**: Training with law enforcement and emergency responders

### Reporting Skills Development

#### Effective Observation
**Training Components**:
- **Attention to Detail**: Developing skills in accurate observation and description
- **Memory Techniques**: Methods for retaining important details until they can be recorded
- **Objective Reporting**: Distinguishing between observations and interpretations
- **Communication Skills**: Clear and concise reporting techniques

#### Legal and Ethical Considerations
**Training Topics**:
- **Privacy Rights**: Balancing security needs with individual privacy
- **Discrimination Avoidance**: Reporting based on behavior, not demographics
- **Legal Protections**: Understanding legal protections for good-faith reporting
- **Company Support**: Assurance of company support for legitimate security reporting

**Remember**: Your eyes and ears are critical components of SpecChem's security system. When you observe something suspicious, trust your instincts and report it promptly through appropriate channels. It's better to report something that turns out to be innocent than to miss something that could threaten our people, facilities, or operations.

// TODO: Add suspicious activity recognition quiz
// TODO: Create mobile reporting app with photo capability
`
      }
    ]
  },
  {
    slug: 'in-depth-security',
    title: 'In-Depth Security Training',
    description: 'Advanced security training for personnel with access to high-hazard materials, including detailed threat assessment and response.',
    estimatedHours: 4,
    difficulty: 'Advanced',
    required: false,
    icon: '🛡️',
    category: 'Advanced Security',
    objectives: [
      'Conduct comprehensive threat assessments',
      'Implement advanced security countermeasures',
      'Coordinate with federal security agencies',
      'Develop facility-specific security protocols'
    ],
    lessons: [
      {
        slug: 'advanced-threat-assessment',
        title: 'Advanced Threat Assessment',
        duration: 60,
        description: 'Comprehensive evaluation of security threats and vulnerability analysis for SpecChem operations.',
        content: `
# Advanced Threat Assessment for Hazmat Operations

## Strategic Threat Analysis Framework

Advanced threat assessment goes beyond recognizing individual suspicious activities to understanding the broader threat landscape affecting SpecChem operations. This systematic approach helps identify vulnerabilities, assess risk levels, and prioritize security investments.

### Threat Landscape Overview

#### Current Threat Environment
The threat environment for hazardous materials operations has evolved significantly in recent years. Understanding these changes is essential for developing effective security strategies.

**Evolving Threat Categories**:

**Traditional Criminal Threats**:
- **Theft for Profit**: Organized criminal groups targeting high-value chemicals
- **Vandalism and Sabotage**: Disgruntled individuals or groups seeking to damage operations
- **Industrial Espionage**: Competitors seeking trade secrets or competitive intelligence
- **Cyber Crime**: Financial fraud and ransomware targeting business operations

**Terrorism-Related Threats**:
- **Domestic Terrorism**: Ideologically motivated groups targeting industrial facilities
- **International Terrorism**: Foreign terrorist organizations seeking chemical materials
- **Lone Wolf Attacks**: Individual actors inspired by terrorist ideologies
- **State-Sponsored Activity**: Foreign intelligence services conducting industrial espionage

**Emerging Threat Vectors**:
- **Cyber-Physical Attacks**: Coordinated cyber attacks affecting physical operations
- **Supply Chain Infiltration**: Compromise of suppliers or distributors
- **Insider Threats**: Employees or contractors with authorized access
- **Environmental Activism**: Extreme environmental groups targeting chemical industry

#### Hazmat-Specific Vulnerabilities
Chemical facilities face unique vulnerabilities due to the nature of materials handled and regulatory requirements.

**Physical Vulnerabilities**:
- **Perimeter Security**: Large facilities with extensive perimeters difficult to secure completely
- **Transportation Networks**: Vulnerabilities during transport and at interim storage locations
- **Utility Dependencies**: Reliance on electrical power, communications, and water systems
- **Emergency Response Coordination**: Challenges in coordinating multiple agencies during incidents

**Information Vulnerabilities**:
- **Process Control Systems**: Industrial control systems with network connectivity
- **Customer Information**: Sensitive information about customers and applications
- **Regulatory Data**: Compliance information that could reveal vulnerabilities
- **Employee Information**: Personal information about employees with access to hazmat

### Comprehensive Threat Assessment Process

#### Intelligence Collection and Analysis

**Open Source Intelligence (OSINT)**:
- **Industry Reporting**: Chemical industry security bulletins and threat reports
- **Government Sources**: DHS, FBI, and state fusion center threat assessments
- **Academic Research**: University and think tank research on chemical security
- **International Sources**: Foreign government and international organization reports

**Internal Intelligence**:
- **Incident History**: Analysis of previous security incidents at SpecChem facilities
- **Employee Reporting**: Pattern analysis of suspicious activity reports
- **System Logs**: Analysis of access control, surveillance, and network activity logs
- **Vendor Intelligence**: Information sharing with contractors and service providers

**Industry Intelligence Sharing**:
- **Chemical Industry Associations**: Participation in industry security working groups
- **Regional Networks**: Coordination with local chemical facilities and security groups
- **Law Enforcement Partnerships**: Information sharing with federal, state, and local agencies
- **Private Security Networks**: Commercial intelligence services and security consultants

#### Vulnerability Assessment Methodology

**Asset Identification and Valuation**:
- **Critical Assets**: Identify facilities, processes, and information requiring highest protection
- **Asset Dependencies**: Map relationships between different assets and operations
- **Value Assessment**: Economic, operational, and strategic value of different assets
- **Recovery Requirements**: Time and resources needed to recover from asset loss

**Threat-Asset Pairing**:
- **Threat Capability**: Assess ability of different threat actors to attack specific assets
- **Threat Intent**: Evaluate likelihood that threat actors would target specific assets
- **Attack Scenarios**: Develop detailed scenarios for how attacks might occur
- **Success Probability**: Estimate likelihood of successful attacks against current defenses

**Risk Calculation and Prioritization**:
- **Risk Formula**: Risk = Threat × Vulnerability × Consequence
- **Quantitative Analysis**: Assign numerical values for risk comparison
- **Qualitative Assessment**: Consider factors difficult to quantify
- **Risk Ranking**: Prioritize risks for resource allocation and mitigation planning

### Facility-Specific Threat Assessment

#### Site Characterization

**Physical Site Analysis**:
- **Location Factors**: Urban vs. rural, proximity to other facilities, transportation access
- **Facility Layout**: Buildings, processes, storage areas, and critical infrastructure
- **Perimeter Characteristics**: Fencing, barriers, surveillance coverage, access points
- **Environmental Factors**: Weather patterns, natural hazards, nearby populations

**Operational Characteristics**:
- **Production Processes**: Types of chemicals handled, quantities, and hazard levels
- **Storage Configurations**: Tank farms, warehouses, temporary storage arrangements
- **Transportation Patterns**: Shipping and receiving schedules, carrier types, route patterns
- **Personnel Patterns**: Shift schedules, contractor presence, visitor frequency

#### Threat-Specific Vulnerabilities

**Physical Security Gaps**:
- **Perimeter Weaknesses**: Areas where unauthorized access might be possible
- **Surveillance Blind Spots**: Areas not covered by surveillance systems
- **Access Control Limitations**: Weaknesses in card reader systems or key management
- **Lighting Deficiencies**: Areas with inadequate lighting for security monitoring

**Procedural Vulnerabilities**:
- **Background Screening**: Gaps in employee or contractor background checks
- **Training Deficiencies**: Insufficient security awareness training
- **Communication Failures**: Poor coordination between shifts or departments
- **Emergency Response**: Weaknesses in incident response procedures

**Technology Vulnerabilities**:
- **System Integration**: Poor integration between different security systems
- **Network Security**: Cyber vulnerabilities in process control or security systems
- **Backup Systems**: Inadequate redundancy for critical security systems
- **Maintenance Issues**: Deferred maintenance affecting security system reliability

### Advanced Risk Analysis Techniques

#### Scenario Development and Analysis

**Attack Tree Analysis**:
A systematic method for analyzing how an attacker might achieve a specific goal.

~~~~
Example: Theft of High-Value Chemicals
├─ Insider Theft
│   ├─ Employee with Authorized Access
│   │   ├─ Direct Theft During Work Hours
│   │   └─ After-Hours Access Abuse
│   └─ Contractor with Temporary Access
│       ├─ Theft During Authorized Work
│       └─ Extended Access Exploitation
├─ External Intrusion
│   ├─ Perimeter Breach
│   │   ├─ Fence Cutting/Climbing
│   │   └─ Gate/Door Forced Entry
│   └─ Access Control Defeat
│       ├─ Badge Cloning/Theft
│       └─ System Hacking
└─ Social Engineering
    ├─ Impersonation of Authorized Personnel
    └─ Manipulation of Employees
~~~~

**Red Team Exercises**:
- **Adversarial Testing**: Authorized "attackers" attempt to compromise security
- **Physical Penetration Testing**: Testing of physical security measures
- **Social Engineering Testing**: Testing employee susceptibility to manipulation
- **Cyber Penetration Testing**: Testing of information system security

#### Quantitative Risk Assessment

**Probability Assessment**:
Using statistical methods and historical data to estimate attack probabilities.

**Annual Attack Probability Factors**:
- **Historical Incident Rates**: Industry-wide and company-specific incident history
- **Threat Intelligence**: Current threat levels and actor capabilities
- **Facility Attractiveness**: Factors that might make facility a preferred target
- **Security Effectiveness**: Current security measures' deterrent effect

**Consequence Modeling**:
- **Direct Costs**: Immediate costs of successful attacks (stolen materials, damage, response)
- **Business Interruption**: Lost revenue from operational disruptions
- **Regulatory Consequences**: Fines, increased oversight, license restrictions
- **Reputation Damage**: Long-term impact on customer relationships and market position

**Risk Prioritization Matrix**:

| Risk Level | Probability | Consequence | Priority Action |
|------------|-------------|-------------|-----------------|
| Critical | High | High | Immediate mitigation required |
| High | High | Medium | Mitigation within 30 days |
| High | Medium | High | Mitigation within 60 days |
| Medium | Medium | Medium | Mitigation within 90 days |
| Low | Low | Low | Monitor and review annually |

### Threat Assessment Documentation

#### Executive Risk Summary

**Key Components**:
- **Executive Summary**: High-level overview for senior management
- **Top Risk Factors**: Most significant threats requiring immediate attention
- **Resource Requirements**: Budget and personnel needed for risk mitigation
- **Timeline**: Priorities and deadlines for implementing security improvements
- **Performance Metrics**: How security improvements will be measured

#### Technical Risk Assessment

**Detailed Analysis**:
- **Methodology**: Explanation of assessment methods and assumptions
- **Asset Inventory**: Complete listing of assets assessed and their valuations
- **Threat Analysis**: Detailed analysis of each threat category and actor
- **Vulnerability Assessment**: Specific vulnerabilities identified and their exploitability
- **Risk Calculations**: Detailed risk scores and supporting analysis

#### Implementation Planning

**Security Enhancement Roadmap**:
- **Phase 1 (0-90 days)**: Critical vulnerabilities requiring immediate attention
- **Phase 2 (3-12 months)**: Major security improvements and system upgrades
- **Phase 3 (1-3 years)**: Long-term strategic security investments
- **Ongoing**: Continuous improvement and periodic reassessment

### Intelligence Integration and Updating

#### Continuous Monitoring

**Threat Environment Changes**:
- **Monthly Intelligence Reviews**: Regular updates on threat environment changes
- **Incident Analysis**: Learning from security incidents at SpecChem and industry facilities
- **Technology Evolution**: Keeping current with new security technologies and their applications
- **Regulatory Changes**: Adapting to new security regulations and requirements

#### Assessment Updates

**Trigger Events for Reassessment**:
- **Significant Security Incidents**: Major incidents affecting SpecChem or industry
- **Facility Changes**: Major modifications to facilities, processes, or operations
- **Threat Environment Changes**: Significant changes in threat actors or methods
- **Technology Implementations**: Major new security system deployments

**Annual Comprehensive Review**:
- **Full Threat Landscape Analysis**: Complete reassessment of threat environment
- **Vulnerability Testing**: Physical and cyber penetration testing
- **Risk Model Updates**: Refinement of risk assessment models and assumptions
- **Performance Evaluation**: Assessment of security improvement effectiveness

## Specialized Assessment Areas

### Cyber-Physical Security Assessment

#### Industrial Control System Security

**SCADA and DCS Vulnerabilities**:
- **Network Architecture**: Air gaps, network segmentation, remote access points
- **Authentication Systems**: Password policies, multi-factor authentication, account management
- **Patch Management**: Software update procedures and testing protocols
- **Backup and Recovery**: System backup procedures and recovery time objectives

**Integration Risks**:
- **Business System Connections**: ERP, accounting, and customer management system connections
- **Internet Connectivity**: Remote monitoring and vendor support connections
- **Mobile Device Integration**: Tablets, smartphones, and portable diagnostic equipment
- **Third-Party Access**: Vendor remote access and maintenance procedures

#### Information Security Threat Assessment

**Data Classification and Protection**:
- **Intellectual Property**: Product formulations, process designs, and trade secrets
- **Customer Information**: Customer lists, contracts, and application data
- **Employee Information**: Personnel records, background check results, security clearances
- **Operational Data**: Production schedules, inventory levels, and transportation plans

**Cyber Attack Scenarios**:
- **Ransomware**: Encryption of critical systems and data for financial extortion
- **Data Exfiltration**: Theft of sensitive information for competitive or criminal purposes
- **System Disruption**: Attacks designed to disrupt operations or cause safety incidents
- **Supply Chain Attacks**: Compromise of supplier systems to gain access to SpecChem networks

### Transportation Security Assessment

#### In-Transit Vulnerabilities

**Route Analysis**:
- **High-Risk Areas**: Areas with higher crime rates or terrorist activity
- **Choke Points**: Bridges, tunnels, and urban areas where vehicles are vulnerable
- **Rest Areas**: Truck stops and layover locations with security risks
- **Border Crossings**: International transportation security considerations

**Vehicle and Driver Security**:
- **Driver Background**: Enhanced background checks and ongoing monitoring
- **Vehicle Security Features**: GPS tracking, communication systems, cargo monitoring
- **Routing Security**: Secure route planning and real-time route adjustments
- **Emergency Procedures**: Driver training for security incidents and communication procedures

#### Intermodal Security

**Transfer Point Security**:
- **Rail Terminals**: Security at rail loading and unloading facilities
- **Port Security**: Maritime transportation security requirements
- **Airport Cargo**: Air transportation security procedures
- **Warehouse Security**: Security at intermediate storage and transfer facilities

### Regulatory Compliance Assessment

#### Chemical Facility Anti-Terrorism Standards (CFATS)

**High-Risk Chemical Assessment**:
- **Chemicals of Interest (COI)**: Chemicals subject to CFATS regulations
- **Screening Threshold Quantities (STQ)**: Quantities triggering regulatory requirements
- **Security Issues**: Specific security concerns for different chemical categories
- **Risk-Based Performance Standards (RBPS)**: Required security measures based on risk tier

**Site Security Plan Development**:
- **Risk Assessment**: CFATS-required risk assessment methodology
- **Security Measures**: Specific security requirements for each RBPS
- **Implementation Timeline**: Schedule for implementing required security measures
- **Compliance Monitoring**: Ongoing compliance verification and reporting

#### DOT Hazmat Security Requirements

**Security Plan Requirements**:
- **Threat Assessment**: DOT-required threat assessment elements
- **Security Objectives**: Specific security goals for transportation operations
- **Security Measures**: Required and recommended security measures
- **Training Requirements**: Security training for hazmat employees

**Transportation Security Coordination**:
- **Route Security**: Coordination with law enforcement along transportation routes
- **Communication Procedures**: Emergency communication and reporting requirements
- **Incident Response**: Coordination with emergency responders for security incidents
- **Information Sharing**: Sharing threat information with transportation partners

## Assessment Integration and Action Planning

### Cross-Functional Risk Integration

#### Enterprise Risk Management Integration

**Strategic Risk Alignment**:
- **Business Continuity**: Integration with business continuity planning
- **Financial Risk**: Coordination with financial risk management
- **Operational Risk**: Integration with operational risk assessment
- **Regulatory Risk**: Alignment with regulatory compliance risk management

**Resource Optimization**:
- **Cost-Benefit Analysis**: Comparing security investments to risk reduction
- **Resource Prioritization**: Allocating limited resources to highest-priority risks
- **Implementation Scheduling**: Coordinating security improvements with business operations
- **Performance Measurement**: Developing metrics to measure security improvement effectiveness

#### Multi-Site Risk Assessment

**Corporate Risk Profile**:
- **Facility Comparison**: Comparing risk profiles across different SpecChem facilities
- **Regional Risk Variations**: Understanding how regional factors affect facility risks
- **Corporate Asset Protection**: Protecting company-wide assets and information
- **Coordinated Response**: Developing coordinated responses to company-wide threats

### Action Plan Development

#### Risk Mitigation Strategies

**Risk Treatment Options**:
- **Risk Avoidance**: Eliminating activities that create unacceptable risks
- **Risk Reduction**: Implementing security measures to reduce risk levels
- **Risk Transfer**: Insurance and contractual risk transfer mechanisms
- **Risk Acceptance**: Accepting risks that cannot be cost-effectively reduced

**Security Investment Prioritization**:
- **Critical Risk Mitigation**: Addressing risks that could cause catastrophic consequences
- **Cost-Effective Improvements**: Implementing low-cost, high-impact security measures
- **Technology Integration**: Leveraging technology to improve security efficiency
- **Long-term Strategic Investments**: Planning major security infrastructure improvements

#### Implementation Planning

**Project Management**:
- **Security Improvement Projects**: Managing multiple security enhancement projects
- **Stakeholder Coordination**: Coordinating with operations, IT, HR, and external partners
- **Timeline Management**: Balancing security needs with operational requirements
- **Budget Management**: Controlling costs while achieving security objectives

**Change Management**:
- **Employee Communication**: Explaining security changes and their importance
- **Training Programs**: Ensuring employees understand new security procedures
- **Performance Monitoring**: Measuring effectiveness of security improvements
- **Continuous Improvement**: Regularly updating security measures based on experience

**Remember**: Advanced threat assessment is an ongoing process, not a one-time activity. The threat environment is constantly evolving, and SpecChem's security measures must evolve accordingly. Regular assessment and continuous improvement are essential for maintaining effective security.

// TODO: Add threat modeling software training
// TODO: Create risk assessment calculator tool
`
      },
      {
        slug: 'cybersecurity-hazmat-operations',
        title: 'Cybersecurity for Hazmat Operations',
        duration: 45,
        description: 'Information security and cyber threat protection for industrial control systems and business operations.',
        content: `
# Cybersecurity for Hazardous Materials Operations

## Understanding Cyber Threats to Hazmat Operations

The convergence of operational technology (OT) and information technology (IT) has created new vulnerabilities in hazmat operations. Understanding these cyber threats and implementing appropriate protections is critical for maintaining safe and secure operations.

### Industrial Control System Vulnerabilities

#### SCADA and DCS Systems

**System Architecture Risks**:
Traditional industrial control systems were designed for reliability and functionality, not security. Many systems have inherent vulnerabilities that can be exploited by cyber attackers.

**Common Vulnerabilities**:
- **Legacy Systems**: Older systems with known security flaws and no security updates
- **Default Passwords**: Systems deployed with default or weak passwords
- **Unencrypted Communications**: Data transmitted in clear text between system components
- **Network Connectivity**: Connections to business networks or the internet
- **Remote Access**: Vendor maintenance access without proper security controls

**SpecChem Control System Inventory**:
- **Process Control Systems**: Chemical mixing, batching, and quality control systems
- **Safety Systems**: Emergency shutdown systems and safety interlocks
- **Environmental Systems**: Emissions monitoring and waste treatment controls
- **Facility Systems**: HVAC, lighting, and building management systems
- **Security Systems**: Access control, video surveillance, and intrusion detection

#### Network Architecture Security

**Network Segmentation**:
Proper network design is crucial for protecting industrial control systems from cyber attacks.

**Recommended Architecture**:
~~~~
Internet
    ↓
Corporate Firewall
    ↓
Corporate Network (Business Systems)
    ↓
DMZ Firewall
    ↓
Manufacturing DMZ (Data Historians, HMI)
    ↓
Process Control Firewall
    ↓
Process Control Network (PLCs, DCS, SCADA)
    ↓
Safety System Network (SIS, Emergency Systems)
~~~~

**Security Zones**:
- **Corporate Zone**: Business systems, email, and internet access
- **Manufacturing Zone**: Manufacturing execution systems and data collection
- **Control Zone**: Process control systems and operator interfaces
- **Safety Zone**: Safety-critical systems with highest protection requirements

### Business System Security

#### Enterprise System Protection

**Critical Business Systems**:
- **Enterprise Resource Planning (ERP)**: SAP system containing financial and operational data
- **Customer Relationship Management (CRM)**: Customer information and sales data
- **Document Management**: Technical documents, procedures, and regulatory records
- **Email and Communications**: Business communications and file sharing

**Data Classification and Protection**:

**Confidential Information**:
- Product formulations and manufacturing processes
- Customer contracts and pricing information
- Employee personal and payroll information
- Strategic business plans and financial data

**Restricted Information**:
- Facility security procedures and assessments
- Process control system configurations
- Emergency response plans and contact information
- Regulatory compliance documentation

**Internal Information**:
- General operational procedures and work instructions
- Training materials and employee handbooks
- Non-sensitive customer communication
- Public regulatory filings and reports

#### Email and Communication Security

**Email Threats**:
- **Phishing**: Emails designed to steal credentials or install malware
- **Spear Phishing**: Targeted emails using specific company or employee information
- **Business Email Compromise (BEC)**: Fraudulent emails requesting money transfers
- **Malware Distribution**: Emails containing malicious attachments or links

**Email Security Measures**:
- **Spam Filtering**: Automated filtering of unwanted and malicious emails
- **Anti-Malware Scanning**: Real-time scanning of email attachments
- **Sender Authentication**: SPF, DKIM, and DMARC to verify email senders
- **User Training**: Regular training on recognizing and reporting suspicious emails

### Cyber Attack Scenarios

#### Common Attack Methods

**Malware Attacks**:
- **Ransomware**: Encrypts data and systems, demanding payment for decryption
- **Trojans**: Malicious software disguised as legitimate applications
- **Worms**: Self-replicating malware that spreads across networks
- **Rootkits**: Stealthy malware that hides its presence and maintains persistent access

**Social Engineering**:
- **Pretexting**: Creating false scenarios to gain access to information or systems
- **Baiting**: Offering something enticing to trigger malware installation
- **Quid Pro Quo**: Offering services in exchange for information or access
- **Tailgating**: Following authorized personnel through secured doors

**Technical Attacks**:
- **Password Attacks**: Brute force, dictionary, and credential stuffing attacks
- **Man-in-the-Middle**: Intercepting communications between legitimate parties
- **SQL Injection**: Exploiting database vulnerabilities to access information
- **Zero-Day Exploits**: Attacks using previously unknown software vulnerabilities

#### Attack Scenario: Industrial Control System Compromise

**Attack Timeline**:
1. **Initial Access**: Spear phishing email targets control system engineer
2. **Credential Theft**: Malware steals Active Directory credentials
3. **Network Reconnaissance**: Attacker maps network architecture and systems
4. **Lateral Movement**: Moving from business network to control systems network
5. **Persistence**: Installing backdoors for continued access
6. **Mission Execution**: Modifying process parameters or shutting down systems

**Potential Consequences**:
- **Production Disruption**: Unplanned shutdowns costing thousands per hour
- **Safety Incidents**: Modified safety systems leading to releases or injuries  
- **Product Quality Issues**: Altered formulations causing customer complaints
- **Regulatory Violations**: Non-compliance with safety or environmental requirements
- **Data Theft**: Theft of proprietary formulations or customer information

### Cybersecurity Best Practices

#### Access Control and Authentication

**User Account Management**:
- **Least Privilege Principle**: Users have minimum access needed for job functions
- **Role-Based Access Control (RBAC)**: Access based on job roles and responsibilities
- **Regular Access Reviews**: Quarterly reviews of user access rights
- **Prompt Access Removal**: Immediate removal of access when employees leave

**Strong Authentication**:
- **Multi-Factor Authentication (MFA)**: Required for all critical system access
- **Password Policies**: Complex passwords changed regularly
- **Account Lockout**: Automatic lockout after failed login attempts
- **Privileged Access Management**: Special controls for administrator accounts

#### System Hardening and Maintenance

**Operating System Security**:
- **Security Updates**: Regular installation of security patches and updates
- **Unnecessary Services**: Removal or disabling of unnecessary system services
- **Antivirus Protection**: Real-time malware detection and removal
- **System Monitoring**: Continuous monitoring for suspicious activity

**Network Security**:
- **Firewall Configuration**: Properly configured firewalls between network segments
- **Intrusion Detection**: Systems to detect unauthorized network activity
- **Network Monitoring**: Continuous monitoring of network traffic patterns
- **Wireless Security**: Secure configuration of wireless networks and devices

#### Data Protection and Backup

**Data Backup Strategies**:
- **3-2-1 Rule**: 3 copies of data, 2 different media types, 1 offsite copy
- **Regular Testing**: Periodic testing of backup restoration procedures
- **Air-Gapped Backups**: Offline backups protected from ransomware
- **Recovery Time Objectives**: Defined goals for system restoration times

**Data Encryption**:
- **Data at Rest**: Encryption of stored data on servers and devices
- **Data in Transit**: Encryption of data transmitted over networks
- **Key Management**: Secure generation, storage, and rotation of encryption keys
- **Mobile Device Encryption**: Full disk encryption on laptops and mobile devices

### Incident Response and Recovery

#### Cyber Incident Response Team

**Team Composition**:
- **Incident Commander**: Senior IT manager with authority to make decisions
- **Technical Lead**: IT security specialist with incident response expertise
- **Operations Representative**: Operations manager familiar with affected systems
- **Communications Lead**: HR or communications manager for internal/external communications
- **Legal Representative**: Legal counsel for regulatory and law enforcement coordination

**External Resources**:
- **Cyber Security Consultant**: External expertise for complex incidents
- **Forensics Specialist**: Digital forensics for evidence collection and analysis
- **Law Enforcement**: FBI cyber crime unit for criminal investigations
- **Insurance Provider**: Cyber insurance claims and coverage coordination

#### Response Procedures

**Incident Classification**:
- **Level 1 (Low)**: Minor incidents with no operational impact
- **Level 2 (Medium)**: Incidents with limited operational impact
- **Level 3 (High)**: Major incidents affecting critical systems
- **Level 4 (Critical)**: Incidents threatening safety or causing major disruption

**Response Steps**:
1. **Detection and Analysis**: Identify and assess the scope of the incident
2. **Containment**: Prevent spread of attack and preserve evidence
3. **Eradication**: Remove malware and close attack vectors
4. **Recovery**: Restore systems and resume normal operations
5. **Lessons Learned**: Post-incident review and improvement planning

#### Business Continuity Planning

**Critical System Identification**:
- **Safety-Critical Systems**: Systems required for safe operation
- **Production-Critical Systems**: Systems required for continued production
- **Business-Critical Systems**: Systems required for business operations
- **Recovery Priorities**: Order in which systems should be restored

**Backup Operations**:
- **Manual Procedures**: Manual operating procedures when systems are unavailable
- **Backup Control Room**: Alternative control center for critical operations
- **Communication Systems**: Backup communication methods during outages
- **Supply Chain Coordination**: Communication with customers and suppliers during incidents

### Regulatory Compliance and Reporting

#### NERC CIP Compliance (if applicable)

For facilities supporting the electrical grid, NERC Critical Infrastructure Protection standards may apply:

**NERC CIP Requirements**:
- **Asset Identification**: Identifying and categorizing critical cyber assets
- **Security Controls**: Physical and electronic access controls
- **Personnel Training**: Cyber security awareness and role-based training
- **Incident Reporting**: Reporting cyber security incidents to appropriate authorities

#### Other Regulatory Requirements

**SEC Cybersecurity Rules**:
- **Incident Disclosure**: Public disclosure of material cybersecurity incidents
- **Risk Management**: Cybersecurity risk management and governance
- **Board Oversight**: Board of directors' oversight of cybersecurity risks

**State and Federal Reporting**:
- **State Fusion Centers**: Reporting cyber incidents affecting critical infrastructure
- **CISA**: Cybersecurity and Infrastructure Security Agency incident reporting
- **Industry Information Sharing**: Participating in industry cybersecurity information sharing

### Employee Training and Awareness

#### Cybersecurity Awareness Training

**Training Topics**:
- **Phishing Recognition**: Identifying and reporting suspicious emails
- **Password Security**: Creating and managing secure passwords
- **Social Engineering**: Recognizing manipulation attempts
- **Incident Reporting**: When and how to report potential security incidents
- **Remote Work Security**: Securing home offices and remote access

**Training Methods**:
- **Interactive Online Training**: Engaging online modules with scenarios and quizzes
- **Phishing Simulations**: Simulated phishing emails to test employee responses
- **Security Newsletters**: Regular communications about current threats
- **Lunch and Learn Sessions**: Brief presentations on specific security topics

#### Role-Specific Training

**IT Personnel**:
- **Incident Response**: Detailed incident response procedures and tools
- **System Hardening**: Security configuration of systems and networks
- **Threat Intelligence**: Understanding and using cyber threat intelligence
- **Forensics**: Basic digital forensics for incident investigation

**Operations Personnel**:
- **Control System Security**: Security risks and procedures for industrial control systems
- **Physical-Cyber Integration**: Understanding connections between physical and cyber security
- **Incident Escalation**: When and how to escalate potential cyber incidents
- **Business Continuity**: Roles in business continuity during cyber incidents

**Management**:
- **Risk Management**: Understanding and managing cybersecurity risks
- **Decision Making**: Making decisions during cyber security incidents
- **Communication**: Internal and external communication during incidents
- **Regulatory Requirements**: Understanding compliance obligations

### Vendor and Third-Party Security

#### Supply Chain Cybersecurity

**Vendor Assessment**:
- **Security Questionnaires**: Evaluating vendors' cybersecurity practices
- **Penetration Testing**: Testing vendor systems that connect to SpecChem networks
- **Compliance Verification**: Ensuring vendors meet required security standards
- **Ongoing Monitoring**: Continuous monitoring of vendor security posture

**Contract Requirements**:
- **Security Standards**: Contractual requirements for cybersecurity controls
- **Incident Notification**: Requirements to notify SpecChem of security incidents
- **Access Controls**: Limiting and monitoring vendor access to SpecChem systems
- **Data Protection**: Requirements for protecting SpecChem data

#### Remote Access Security

**VPN Security**:
- **Multi-Factor Authentication**: Required for all remote access
- **Network Segmentation**: Limiting remote access to necessary systems only
- **Session Monitoring**: Monitoring remote access sessions for suspicious activity
- **Regular Access Review**: Periodic review of remote access rights

**Vendor Remote Access**:
- **Scheduled Access**: Pre-approved timeframes for vendor remote access
- **Escorted Sessions**: SpecChem employee monitoring of vendor remote sessions
- **Activity Logging**: Complete logging of all vendor remote access activities
- **Immediate Termination**: Ability to immediately terminate vendor access

### Emerging Cybersecurity Challenges

#### Internet of Things (IoT) Security

**IoT Devices in Hazmat Operations**:
- **Environmental Sensors**: Air quality monitoring and leak detection systems
- **Asset Tracking**: RFID and GPS tracking of containers and vehicles
- **Predictive Maintenance**: Sensors monitoring equipment condition
- **Smart Building Systems**: Connected HVAC, lighting, and security systems

**IoT Security Challenges**:
- **Default Credentials**: Many IoT devices have weak default passwords
- **Limited Security Features**: IoT devices often lack advanced security features
- **Update Management**: Difficulty in maintaining security updates for numerous devices
- **Network Visibility**: Challenges in monitoring and controlling IoT device network activity

#### Cloud Security

**Cloud Service Adoption**:
- **Software as a Service (SaaS)**: Cloud-based applications for business functions
- **Infrastructure as a Service (IaaS)**: Cloud-based servers and storage
- **Platform as a Service (PaaS)**: Cloud-based development and deployment platforms
- **Hybrid Cloud**: Mix of on-premises and cloud-based systems

**Cloud Security Considerations**:
- **Data Location**: Understanding where data is stored and processed
- **Access Controls**: Managing access to cloud services and data
- **Encryption**: Ensuring data is encrypted in transit and at rest
- **Compliance**: Meeting regulatory requirements in cloud environments

#### Artificial Intelligence and Machine Learning

**AI/ML Applications**:
- **Threat Detection**: Using AI to identify cyber threats and anomalies
- **Process Optimization**: ML algorithms optimizing chemical processes
- **Predictive Maintenance**: AI predicting equipment failures and maintenance needs
- **Quality Control**: Machine learning for product quality analysis

**AI/ML Security Risks**:
- **Data Poisoning**: Attacks that corrupt training data for AI systems
- **Model Manipulation**: Attacks that modify AI model behavior
- **Privacy Concerns**: AI systems potentially exposing sensitive information
- **Decision Transparency**: Difficulty in understanding AI decision-making processes

**Remember**: Cybersecurity is not just an IT responsibility - it's everyone's responsibility. As our operations become increasingly connected and automated, every employee must understand their role in protecting SpecChem from cyber threats. Stay vigilant, follow security procedures, and report any suspicious activity promptly.

// TODO: Add cyber incident simulation exercise
// TODO: Create industrial control system security checklist
`
      },
      {
        slug: 'supply-chain-security',
        title: 'Supply Chain Security',
        duration: 30,
        description: 'Securing the chemical supply chain from suppliers through transportation to customers.',
        content: `
# Supply Chain Security for Chemical Operations

## Understanding Supply Chain Vulnerabilities

The chemical supply chain extends from raw material suppliers through manufacturing, transportation, distribution, and finally to end customers. Each link in this chain presents potential security vulnerabilities that could be exploited by criminal or terrorist organizations.

### Supply Chain Components

#### Upstream Supply Chain (Suppliers)

**Raw Material Suppliers**:
- **Chemical Manufacturers**: Primary producers of base chemicals and intermediates
- **Specialty Chemical Companies**: Producers of specialized additives and formulations
- **Commodity Traders**: Distributors and brokers handling bulk chemicals
- **International Suppliers**: Foreign manufacturers and trading companies

**Supply Chain Risks**:
- **Product Authenticity**: Risk of counterfeit or adulterated materials
- **Quality Consistency**: Variations in quality affecting final products
- **Supply Disruption**: Interruptions from natural disasters, political instability, or economic factors
- **Security Compromise**: Infiltration by criminal or terrorist organizations

**Critical Supplier Categories for SpecChem**:
- **Base Chemical Suppliers**: Providers of acids, bases, solvents, and other foundation chemicals
- **Additive Suppliers**: Specialized chemicals that enhance concrete performance
- **Packaging Suppliers**: Containers, drums, and bulk packaging materials
- **Transportation Providers**: Trucking companies, rail carriers, and logistics providers

#### Internal Operations

**Manufacturing Security**:
- **Process Control**: Protecting manufacturing processes from sabotage or disruption
- **Quality Assurance**: Ensuring products meet specifications and are not compromised
- **Inventory Security**: Protecting raw materials and finished products in storage
- **Information Security**: Protecting proprietary formulations and customer information

**Facility Security Integration**:
- **Physical Security**: Access control, surveillance, and perimeter protection
- **Personnel Security**: Background checks, training, and ongoing monitoring
- **Cyber Security**: Protection of control systems and business networks
- **Emergency Response**: Coordination with law enforcement and emergency services

#### Downstream Supply Chain (Distribution)

**Transportation Security**:
- **Carrier Selection**: Choosing transportation providers with appropriate security measures
- **Route Security**: Planning routes to minimize security risks
- **In-Transit Monitoring**: Tracking shipments and monitoring for security incidents
- **Driver Security**: Background checks and security training for drivers

**Distribution Partners**:
- **Regional Distributors**: Partners who handle products in specific geographic areas
- **Retail Partners**: Building supply stores and contractor suppliers
- **Direct Customers**: Large construction companies and concrete producers
- **Export Partners**: International distributors and customers

### Supplier Security Assessment

#### Supplier Evaluation Framework

**Security Risk Assessment**:
A comprehensive evaluation of supplier security practices and risk factors.

**Assessment Categories**:

**Physical Security**:
- **Facility Security**: Perimeter protection, access controls, and surveillance systems
- **Storage Security**: Secure storage of materials and finished products
- **Transportation Security**: Secure loading, transportation, and delivery procedures
- **Personnel Security**: Background checks and security training for employees

**Information Security**:
- **Cyber Security**: Protection of computer systems and networks
- **Data Protection**: Safeguarding of confidential business and customer information
- **Communication Security**: Secure methods for business communications
- **Intellectual Property Protection**: Protecting proprietary information and trade secrets

**Operational Security**:
- **Quality Control**: Systems ensuring product quality and authenticity
- **Supply Chain Transparency**: Understanding of their own supply chain security
- **Incident Response**: Procedures for responding to security incidents
- **Regulatory Compliance**: Adherence to applicable security regulations

#### Supplier Due Diligence Process

**Initial Assessment**:
1. **Security Questionnaire**: Comprehensive questionnaire covering all security aspects
2. **Documentation Review**: Review of security policies, procedures, and certifications
3. **Reference Checks**: Verification with other customers and industry contacts
4. **Financial Assessment**: Evaluation of financial stability and business viability

**On-Site Assessment**:
- **Facility Inspection**: Physical inspection of supplier facilities and security measures
- **Personnel Interviews**: Discussions with key personnel about security practices
- **Documentation Verification**: Verification of security documentation and records
- **Gap Analysis**: Identification of security gaps and improvement opportunities

**Ongoing Monitoring**:
- **Periodic Reassessment**: Regular updates to security assessments
- **Performance Monitoring**: Tracking of security-related performance metrics
- **Incident Reporting**: Requiring notification of security incidents
- **Improvement Planning**: Working with suppliers to address security gaps

### Transportation Security

#### Carrier Security Requirements

**Driver Qualification**:
- **Background Checks**: Enhanced background investigations for hazmat drivers
- **Training Certification**: Current hazmat endorsement and security training
- **Medical Certification**: Current DOT medical certification and drug testing
- **Performance Monitoring**: Ongoing monitoring of safety and security performance

**Vehicle Security Features**:
- **GPS Tracking**: Real-time location monitoring and route verification
- **Communication Systems**: Two-way radio or cellular communication with dispatch
- **Security Equipment**: Locks, seals, and tamper-evident devices
- **Emergency Equipment**: Spill response materials and emergency communication devices

**Transportation Security Procedures**:
- **Route Planning**: Secure route selection avoiding high-risk areas
- **Schedule Management**: Minimizing time in transit and at intermediate stops
- **Communication Protocols**: Regular check-ins and status updates
- **Emergency Procedures**: Response procedures for security incidents

#### Cargo Security Measures

**Load Security**:
- **Seal Application**: Security seals on all cargo compartments
- **Load Verification**: Verification of product identity and quantity before loading
- **Documentation Security**: Secure handling of shipping papers and manifests
- **Chain of Custody**: Clear documentation of custody transfers

**In-Transit Monitoring**:
- **GPS Tracking**: Continuous monitoring of vehicle location and status
- **Route Adherence**: Monitoring compliance with planned routes
- **Stop Monitoring**: Tracking of all stops and delays during transport
- **Communication Monitoring**: Regular communication with drivers

**Delivery Security**:
- **Delivery Verification**: Confirmation of delivery to authorized recipients
- **Unloading Supervision**: Monitoring of product unloading and transfer
- **Documentation Completion**: Proper completion of delivery documentation
- **Incident Reporting**: Immediate reporting of any security concerns

### International Supply Chain Security

#### Import Security Requirements

**Customs-Trade Partnership Against Terrorism (C-TPAT)**:
A voluntary program providing benefits to importers with strong security practices.

**C-TPAT Requirements**:
- **Business Partner Requirements**: Security requirements for foreign suppliers
- **Procedural Security**: Security procedures for international shipments
- **Physical Security**: Security standards for facilities handling imports
- **Access Controls**: Personnel security and access control requirements
- **Education and Training**: Security awareness training for employees

**Import Documentation Security**:
- **Advance Cargo Information**: Electronic submission of cargo information before arrival
- **Commercial Invoice Verification**: Verification of invoice accuracy and completeness
- **Packing List Verification**: Confirmation of actual cargo against documentation
- **Certificate Requirements**: Required certificates for certain chemical products

#### Export Security Requirements

**Export Administration Regulations (EAR)**:
Regulations controlling the export of dual-use items and technology.

**Export License Requirements**:
- **Commerce Control List**: Chemicals and equipment requiring export licenses
- **Destination Restrictions**: Countries subject to export restrictions
- **End-User Verification**: Verification of legitimate end-users for exports
- **Record Keeping**: Maintaining records of export transactions

**Foreign Supplier Security**:
- **Due Diligence**: Enhanced due diligence for foreign suppliers and customers
- **Site Visits**: Periodic visits to foreign supplier and customer facilities
- **Documentation Verification**: Verification of foreign supplier certifications and licenses
- **Communication Security**: Secure communication methods for international business

### Customer and End-User Security

#### Customer Verification

**Know Your Customer (KYC) Procedures**:
- **Business Verification**: Verification of legitimate business operations
- **Application Verification**: Confirmation of intended use for chemical products
- **Quantity Verification**: Ensuring ordered quantities match legitimate business needs
- **Payment Verification**: Verification of payment methods and sources

**Red Flag Indicators**:
- **Unusual Orders**: Orders that don't match customer's normal business patterns
- **Cash Payments**: Requests to pay with cash or untraceable payment methods
- **Unusual Delivery**: Requests for delivery to unusual locations or third parties
- **Evasive Behavior**: Reluctance to provide business information or references

#### End-Use Monitoring

**Application Monitoring**:
- **Intended Use Verification**: Confirming products are used for stated applications
- **Quantity Tracking**: Monitoring usage patterns for unusual consumption
- **Customer Feedback**: Regular communication with customers about product applications
- **Market Intelligence**: Understanding market conditions and typical usage patterns

**Suspicious Activity Indicators**:
- **Rapid Consumption**: Usage rates significantly higher than normal for application
- **Unusual Combinations**: Ordering combinations of products not typical for stated use
- **Third-Party Involvement**: Involvement of unknown third parties in transactions
- **Geographic Anomalies**: Shipping to locations not consistent with customer's business

### Supply Chain Incident Response

#### Incident Types and Responses

**Product Diversion**:
- **Immediate Actions**: Stop further shipments, notify law enforcement
- **Investigation**: Work with authorities to trace diverted products
- **Customer Notification**: Alert other customers about potential risks
- **Process Improvement**: Strengthen procedures to prevent future diversions

**Product Contamination**:
- **Product Recall**: Immediate recall of potentially contaminated products
- **Investigation**: Determine source and extent of contamination
- **Customer Protection**: Protect customers from potentially harmful products
- **Supply Chain Review**: Review supplier security and quality procedures

**Transportation Security Incidents**:
- **Emergency Response**: Coordinate with emergency responders and law enforcement
- **Containment**: Contain any spills or releases from security incidents
- **Investigation Support**: Support law enforcement investigation
- **Business Continuity**: Restore transportation operations while maintaining security

#### Communication and Coordination

**Internal Communication**:
- **Management Notification**: Immediate notification of senior management
- **Legal Consultation**: Early involvement of legal counsel
- **Insurance Notification**: Prompt notification of relevant insurance carriers
- **Regulatory Notification**: Compliance with regulatory reporting requirements

**External Communication**:
- **Law Enforcement**: Coordination with appropriate law enforcement agencies
- **Customer Communication**: Timely and accurate communication with affected customers
- **Regulatory Agencies**: Communication with relevant regulatory authorities
- **Industry Partners**: Sharing threat information with industry security networks

### Technology and Innovation in Supply Chain Security

#### Tracking and Monitoring Technologies

**RFID and GPS Tracking**:
- **Container Tracking**: RFID tags on containers and packaging
- **Vehicle Tracking**: GPS tracking of transportation vehicles
- **Real-Time Monitoring**: Continuous monitoring of location and status
- **Automated Alerts**: Automatic alerts for deviations from planned routes or schedules

**Blockchain Technology**:
- **Supply Chain Transparency**: Immutable record of supply chain transactions
- **Product Authentication**: Verification of product authenticity and origin
- **Smart Contracts**: Automated execution of supply chain agreements
- **Traceability**: Complete traceability from raw materials to end customers

#### Advanced Security Measures

**Biometric Authentication**:
- **Driver Identity Verification**: Biometric verification of driver identity
- **Access Control**: Biometric access control for secure areas
- **Chain of Custody**: Biometric verification for custody transfers
- **Audit Trail**: Complete biometric audit trail for security events

**AI and Machine Learning**:
- **Anomaly Detection**: AI systems detecting unusual patterns in supply chain data
- **Risk Assessment**: Machine learning models assessing supplier and customer risk
- **Predictive Analytics**: Predicting potential security incidents based on historical data
- **Process Optimization**: Optimizing supply chain processes for security and efficiency

### Regulatory Compliance and Standards

#### Industry Standards

**ISO 28000 Series**:
International standards for supply chain security management.

**Key Standards**:
- **ISO 28000**: Security management systems for the supply chain
- **ISO 28001**: Best practices for implementing supply chain security
- **ISO 28004**: Guidelines for the implementation of ISO 28000
- **ISO 28007**: Guidelines for private maritime security companies

**American Chemistry Council (ACC) Guidelines**:
- **Responsible Care**: Industry initiative for health, safety, and security
- **Security Verification**: Third-party verification of security practices
- **Information Sharing**: Industry-wide sharing of security best practices
- **Training Standards**: Standardized security training for chemical industry

#### Regulatory Requirements

**Department of Homeland Security (DHS)**:
- **Chemical Facility Anti-Terrorism Standards (CFATS)**: Security requirements for high-risk chemical facilities
- **Transportation Worker Identification Credential (TWIC)**: Background checks for workers accessing secure transportation areas
- **Customs-Trade Partnership Against Terrorism (C-TPAT)**: Voluntary program for import security

**Department of Transportation (DOT)**:
- **Hazmat Security Plans**: Required security plans for hazmat transportation
- **Driver Background Checks**: Enhanced background checks for hazmat drivers
- **Routing Requirements**: Security-based routing requirements for certain materials
- **Training Requirements**: Security training for hazmat employees

### Continuous Improvement and Best Practices

#### Performance Metrics and Monitoring

**Key Performance Indicators (KPIs)**:
- **Supplier Compliance**: Percentage of suppliers meeting security requirements
- **Incident Response Time**: Time to respond to and resolve security incidents
- **Transportation Security**: Number of transportation security incidents
- **Customer Verification**: Percentage of customers with completed verification

**Monitoring and Reporting**:
- **Monthly Security Reports**: Regular reports on supply chain security performance
- **Quarterly Reviews**: Comprehensive reviews with supply chain partners
- **Annual Assessments**: Complete reassessment of supply chain security program
- **Trend Analysis**: Analysis of security trends and emerging threats

#### Industry Collaboration

**Information Sharing**:
- **Industry Associations**: Participation in chemical industry security associations
- **Government Programs**: Participation in government-industry information sharing programs
- **Peer Networks**: Informal networks with other chemical companies
- **Research Collaboration**: Collaboration on supply chain security research and development

**Best Practice Development**:
- **Lessons Learned**: Sharing lessons learned from security incidents
- **Technology Evaluation**: Joint evaluation of new security technologies
- **Training Development**: Collaborative development of security training programs
- **Standard Development**: Participation in development of industry security standards

**Remember**: Supply chain security is a shared responsibility among all partners in the chemical supply chain. SpecChem's security is only as strong as the weakest link in our supply chain, so we must work collaboratively with all partners to maintain strong security throughout the entire chain from suppliers to customers.

// TODO: Add supplier security assessment tool
// TODO: Create supply chain mapping exercise
`
      }
    ]
  }
];

export const getUserProgress = (): UserProgress => ({
  userId: 'user-123',
  totalModulesCompleted: 0,
  totalLessonsCompleted: 0,
  currentStreak: 0,
  completedModules: [],
  inProgressModules: [],
  lastActivityDate: new Date().toISOString().split('T')[0],
  modules: []
});

export const getModules = (): LmsModule[] => mockModules;

export const getModule = (slug: string): LmsModule | undefined => {
  return mockModules.find(module => module.slug === slug);
};

// Alias for consistency with component usage
export const getLmsModule = getModule;

export const getRequiredModules = (): LmsModule[] => {
  return mockModules.filter(module => module.required);
};

export const mockResourceLinks: ResourceLink[] = [
  {
    id: 'sds-library',
    title: 'SDS Library',
    description: 'Access safety data sheets for all SpecChem products',
    url: '/resources/sds',
    type: 'internal',
    category: 'sds'
  },
  {
    id: 'safety-policy',
    title: 'SpecChem Safety Policy',
    description: 'Company safety policies and procedures manual',
    url: '/resources/safety-policy.pdf',
    type: 'internal',
    category: 'policy'
  },
  {
    id: 'emergency-contacts',
    title: 'Emergency Contact Card',
    description: 'Quick reference for emergency contacts and procedures',
    url: '/resources/emergency-contacts.pdf',
    type: 'internal',
    category: 'emergency'
  },
  {
    id: 'dot-regulations',
    title: 'DOT HazMat Regulations',
    description: '49 CFR Parts 100-185 - Pipeline and Hazardous Materials Safety Administration',
    url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-I/subchapter-C',
    type: 'external',
    category: 'regulation'
  },
  {
    id: 'osha-standards',
    title: 'OSHA Hazard Communication',
    description: 'Occupational Safety and Health Administration hazard communication standards',
    url: 'https://www.osha.gov/hazard-communication',
    type: 'external',
    category: 'regulation'
  }
];

export const getResourceLinks = (): ResourceLink[] => mockResourceLinks;

export const getLessonResources = (): ResourceLink[] => {
  // In a real app, this would filter resources by lesson
  // For now, return a subset of resources relevant to the lesson
  return mockResourceLinks.slice(0, 3);
};

// Resource categories for the resources page
export const getResourceCategories = () => {
  return [
    { id: 'regulation', name: 'Regulations', count: 2 },
    { id: 'policy', name: 'Policies', count: 1 },
    { id: 'emergency', name: 'Emergency', count: 1 },
  ];
};

// Certification paths for the certification page
export const getCertificationPaths = () => {
  return [
    {
      id: 'basic-hazmat',
      title: 'Basic HazMat Certification',
      description: 'Entry-level certification covering fundamental hazmat principles',
      requiredModules: ['general-awareness'],
      estimatedHours: 8,
      validityPeriod: '2 years'
    },
    {
      id: 'advanced-hazmat',
      title: 'Advanced HazMat Specialist',
      description: 'Comprehensive certification for hazmat specialists and supervisors',
      requiredModules: ['general-awareness', 'function-specific', 'safety-security'],
      estimatedHours: 24,
      validityPeriod: '3 years'
    }
  ];
};
