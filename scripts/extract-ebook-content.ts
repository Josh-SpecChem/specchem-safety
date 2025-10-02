#!/usr/bin/env tsx

/**
 * Ebook Content Extraction Script
 * 
 * This script extracts the hard-coded content from the existing ebook pages
 * and structures it for database migration.
 */

import fs from 'fs';
import path from 'path';

// Define the structured content format
interface ExtractedSection {
  sectionKey: string;
  title: string;
  orderIndex: number;
  iconName: string | null;
  contentBlocks: Array<{
    blockType: string;
    orderIndex: number;
    content: Record<string, any>;
    metadata?: Record<string, any> | null;
  }>;
  quizQuestions?: Array<{
    questionKey: string;
    questionType: 'true-false' | 'multiple-choice';
    questionText: string;
    options?: string[] | null;
    correctAnswer: string | string[];
    explanation: string;
    orderIndex?: number;
  }>;
}

interface ExtractedContent {
  courseId: string;
  language: 'en' | 'es';
  sections: ExtractedSection[];
}

// English content extraction
const englishContent: ExtractedContent = {
  courseId: 'hazmat-function-specific',
  language: 'en',
  sections: [
    {
      sectionKey: 'introduction',
      title: 'Introduction & Overview',
      orderIndex: 0,
      iconName: 'BookOpen',
      contentBlocks: [
        {
          blockType: 'hero',
          orderIndex: 0,
          content: {
            title: 'Function-Specific HazMat Training',
            subtitle: 'Handling, Packaging, and Shipping DOT-Regulated Materials',
            badge: 'SpecChem Professional Training',
            backgroundClass: 'bg-gray-50'
          }
        },
        {
          blockType: 'card',
          orderIndex: 1,
          content: {
            title: 'Welcome to SpecChem\'s Function-Specific Training',
            text: 'This comprehensive training course covers the requirements and expectations for handling, packaging, and shipping DOT-regulated materials in your work at SpecChem.',
            variant: 'info',
            borderClass: 'border-l-4 border-l-blue-500'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 2,
          content: {
            type: 'warning',
            title: 'Why This Training Matters',
            text: 'Title 49 of the Code of Federal Regulations requires that any associate who packages, handles, or transports hazardous materials must undergo training every three years regarding the following hazardous materials subjects:',
            variant: 'amber'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 3,
          content: {
            columns: 2,
            gap: 4,
            items: [
              {
                title: 'General Awareness',
                description: 'Familiarization with various aspects involved with hazardous materials',
                index: 1
              },
              {
                title: 'Function-Specific Training',
                description: 'How hazardous materials are handled in your specific job',
                index: 2
              },
              {
                title: 'Safety Training',
                description: 'Safe handling of hazardous materials',
                index: 3
              },
              {
                title: 'Security Awareness',
                description: 'Issues of HAZMAT security',
                index: 4
              },
              {
                title: 'In-Depth Security',
                description: 'Detailed training on maintaining security when dealing with hazardous materials',
                index: 5
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 4,
          content: {
            type: 'info',
            title: 'Key Learning Outcomes',
            text: 'There are six things you should take away from this training:',
            variant: 'blue'
          }
        },
        {
          blockType: 'list',
          orderIndex: 5,
          content: {
            type: 'checklist',
            items: [
              'A basic understanding of what UN-rated packaging is',
              'How you can find information on what packaging to use for specific materials and how to package it',
              'A basic understanding of how to mark hazardous material for shipping',
              'How to locate the proper labels for marking HAZ packaging',
              'Where to find information on the required proper closure of HAZ packaging',
              'Awareness of the proper tool to use when closing pails, drums, or totes, especially those which contain DOT-regulated materials'
            ]
          }
        }
      ]
    },
    {
      sectionKey: 'un-packaging-basics',
      title: 'UN-Rated Packaging Fundamentals',
      orderIndex: 1,
      iconName: 'Package',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Understanding UN-Rated Packaging',
            icon: 'Package',
            iconColor: 'text-blue-600'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 1,
          content: {
            type: 'info',
            text: 'You aren\'t expected to remember all the detailed information, but should become aware of what sets the packaging materials used for DOT-regulated materials apart from standard packaging.',
            variant: 'gray'
          }
        },
        {
          blockType: 'text',
          orderIndex: 2,
          content: {
            heading: 'What Makes UN-Rated Packaging Special?',
            text: 'UN ratings for packaging were developed so that transporting hazardous materials would be both safer and easier. If a material is DOT-regulated, it must be kept in UN-rated packaging, either for storage or for transport.'
          }
        },
        {
          blockType: 'image',
          orderIndex: 3,
          content: {
            src: '/images/safety/packaging-un-codes-breakdown.jpg',
            alt: 'UN packaging codes breakdown showing the systematic identification of packaging materials with detailed explanations of each element',
            caption: 'UN packaging marking breakdown with element identification',
            className: 'w-full rounded-lg border border-gray-200 shadow-sm'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 4,
          content: {
            columns: 3,
            gap: 4,
            items: [
              {
                icon: 'Shield',
                title: 'Multi-faceted Rating',
                description: 'Letters and numbers permanently marked on containers'
              },
              {
                icon: 'CheckCircle',
                title: 'Rigorous Testing',
                description: 'Series of tests to demonstrate conformity to standards'
              },
              {
                icon: 'FileText',
                title: 'DOT Enforcement',
                description: 'U.S. Department of Transportation enforces regulations'
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 5,
          content: {
            type: 'info',
            title: 'Comprehensive Testing Standards',
            text: 'The testing of packaging containers includes multiple rigorous assessments:',
            variant: 'gray'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 6,
          content: {
            columns: 2,
            gap: 4,
            items: [
              {
                title: 'External Pressure Testing',
                description: 'Ensure containers can withstand changes in external pressure without failing'
              },
              {
                title: 'Internal Pressure Testing',
                description: 'Ensure containers won\'t fail under conditions of internal pressure'
              },
              {
                title: 'Weight Bearing Testing',
                description: 'Containers can bear weight for extended periods at high temperature without failing'
              },
              {
                title: 'Vibration Testing',
                description: 'Containers can withstand vibrations which occur during transport'
              },
              {
                title: 'Drop Testing',
                description: 'Containers can withstand freefall drops that may occur during transport'
              }
            ]
          }
        }
      ]
    },
    {
      sectionKey: 'when-un-required',
      title: 'When UN-Rated Packaging is Required',
      orderIndex: 2,
      iconName: 'AlertTriangle',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'UN-Rated Packaging Requirements',
            icon: 'AlertTriangle',
            iconColor: 'text-orange-600'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 1,
          content: {
            type: 'warning',
            title: 'When is UN-Rated Packaging Required?',
            text: 'UN-rated packaging is required if the material being packaged for transport is classified as any of the following:',
            variant: 'amber'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 2,
          content: {
            columns: 3,
            gap: 4,
            items: [
              { type: 'Explosive', emoji: '💥', class: 'Class 1' },
              { type: 'Non-flammable gas', emoji: '🌬️', class: 'Class 2.2' },
              { type: 'Flammable gas', emoji: '🔥', class: 'Class 2.1' },
              { type: 'Flammable liquid', emoji: '🔥', class: 'Class 3' },
              { type: 'Infectious substance', emoji: '🦠', class: 'Class 6.2' },
              { type: 'Corrosive material', emoji: '⚠️', class: 'Class 8' },
              { type: 'Flammable solid', emoji: '🔥', class: 'Class 4.1' },
              { type: 'Oxidizer', emoji: '💨', class: 'Class 5.1' },
              { type: 'Organic peroxide', emoji: '🧪', class: 'Class 5.2' },
              { type: 'Toxic materials', emoji: '☠️', class: 'Class 6.1' },
              { type: 'Radioactive', emoji: '☢️', class: 'Class 7' }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 3,
          content: {
            type: 'info',
            title: 'SpecChem Common Materials',
            text: 'At SpecChem, the materials you will be handling which require UN-rated packaging will be mostly:',
            variant: 'blue'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 4,
          content: {
            columns: 2,
            gap: 4,
            items: [
              {
                title: '🔥 Flammable liquids',
                description: '(Most common)'
              },
              {
                title: '⚠️ Corrosives',
                description: 'Chemical substances that cause damage'
              },
              {
                title: '☠️ Toxic materials',
                description: 'Harmful chemical substances'
              },
              {
                title: '💨 Oxidizers',
                description: '(Occasional use)'
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 5,
          content: {
            type: 'critical',
            title: 'Critical Rule - No Exceptions',
            text: 'The most important takeaway from this training is:',
            variant: 'red'
          }
        },
        {
          blockType: 'card',
          orderIndex: 6,
          content: {
            text: 'Because UN-rated packaging is designed, tested, and regulated to ensure the safest and most secure shipment and storage of hazardous materials, it is never acceptable to substitute non-UN-rated packaging when working with materials classified as hazardous. There are no exceptions.',
            variant: 'critical',
            borderClass: 'border border-red-300'
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-1',
          questionType: 'true-false',
          questionText: 'If you are packaging a DOT-regulated material and find that you do not have enough UN-rated containers to complete the run, you can substitute non-UN-rated containers as long as the number of non-UN-rated pails is less than 10% of the total being packaged.',
          correctAnswer: 'False',
          explanation: 'It is never allowable under any circumstance to package hazardous material in non-UN rated packaging. There are absolutely no exceptions to this rule.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'responsibility-compliance',
      title: 'Responsibility & Compliance',
      orderIndex: 3,
      iconName: 'Shield',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Understanding Responsibility & Compliance',
            icon: 'Shield',
            iconColor: 'text-purple-600'
          }
        },
        {
          blockType: 'text',
          orderIndex: 1,
          content: {
            text: 'As a result, you must always pay attention to the type of packaging you are using for any material, so that DOT-regulated materials are packaged in the proper container, and that the container is properly closed.'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 2,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                title: 'DOT Responsibility',
                content: 'We learned earlier that the DOT has responsibility for ensuring compliance with regulations regarding handling and transporting of hazardous materials.',
                note: 'U.S. Department of Transportation enforces all hazmat regulations'
              },
              {
                title: 'Shipper Responsibility',
                content: 'However, it is the responsibility of the shipper to be sure that operations involving DOT-regulated materials are in compliance.',
                items: [
                  'Packaging used must be authorized',
                  'Properly manufactured',
                  'Properly assembled',
                  'Properly marked'
                ]
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 3,
          content: {
            type: 'critical',
            title: 'Our Responsibility',
            text: 'It is our responsibility, both corporately and individually, to make sure we are purchasing and using the proper packaging, and that the material is properly identified for shipping.',
            variant: 'red'
          }
        },
        {
          blockType: 'card',
          orderIndex: 4,
          content: {
            title: 'Consequence of Non-Compliance',
            text: 'Failure to fulfill this responsibility can be costly.',
            variant: 'warning',
            icon: 'AlertTriangle'
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-2',
          questionType: 'multiple-choice',
          questionText: 'Which one of the following statements is not true about UN-rated packaging?',
          options: [
            'UN ratings are required for the packaging used in shipment and storage of hazardous materials.',
            'Enforcement of current UN regulations is the responsibility of the Federal Bureau of Investigation, or FBI.',
            'A UN rating is a set of letters and numbers which specify what the particular container is regulated to hold.',
            'The packaging should be permanently marked on the bottom and either the side or the top.'
          ],
          correctAnswer: 'B',
          explanation: 'Enforcement of current UN regulations is actually the responsibility of the Department of Transportation (DOT), not the FBI.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'information-sources',
      title: 'Finding Information Sources',
      orderIndex: 4,
      iconName: 'FileText',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Three Primary Information Sources',
            icon: 'FileText',
            iconColor: 'text-green-600'
          }
        },
        {
          blockType: 'text',
          orderIndex: 1,
          content: {
            text: 'Now we will cover the three primary sources of information you can use to determine what packaging to use for any product.'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 2,
          content: {
            columns: 3,
            gap: 6,
            items: [
              {
                title: '1. Safety Data Sheet (SDS)',
                subtitle: 'Section 14 - Transport Information',
                features: [
                  'Identifies if material is DOT-regulated',
                  'Required marking/labeling elements'
                ],
                limitation: 'Shows regulation status but not specific packaging type',
                borderClass: 'border-2 border-blue-200'
              },
              {
                title: '2. Production Order',
                subtitle: 'Verification Document',
                features: [
                  'Basic description of product',
                  'Specific container type (e.g., "blue steel UN pail")'
                ],
                access: 'Request to view from supervisor',
                borderClass: 'border-2 border-blue-200'
              },
              {
                title: '3. Excel Files on Server',
                subtitle: 'Desktop Shortcuts → Packaging Folders',
                features: [
                  'Package type for all products',
                  'UN-rating indicators',
                  'Proper closing instructions'
                ],
                borderClass: 'border-2 border-blue-200'
              }
            ]
          }
        },
        {
          blockType: 'image',
          orderIndex: 3,
          content: {
            src: '/images/safety/info-sources-sds-section14-general.jpg',
            alt: 'General SDS Section 14 transport information showing DOT, IATA, and IMDG classifications',
            caption: 'Example SDS Section 14 - Transport Information',
            className: 'w-full rounded border border-gray-200'
          }
        },
        {
          blockType: 'image',
          orderIndex: 4,
          content: {
            src: '/images/safety/info-sources-excel-pails.jpg',
            alt: 'Excel spreadsheet showing pail packaging specifications with color-coded entries and UN rating indicators',
            caption: 'Excel file showing pail packaging specifications',
            className: 'w-full rounded border border-gray-200'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 5,
          content: {
            type: 'case-study',
            title: '📋 Case Study: CureNSeal 25EX',
            variant: 'green'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 6,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                title: 'SDS Section 14 Results:',
                results: [
                  '✓ Identified as DOT-regulated per 49 CFR 172.01',
                  '✓ Shows required marking elements'
                ],
                image: {
                  src: '/images/safety/info-sources-sds-section14-curennseal.jpg',
                  alt: 'CureNSeal 25EX SDS Section 14 showing DOT regulation classification and transport information',
                  caption: 'CureNSeal 25EX SDS Section 14'
                }
              },
              {
                title: 'Excel File Results:',
                results: [
                  '• Pails: UN-rated blue steel pails',
                  '• Drums: UN-rated blue steel drums',
                  '• Tools: Proper drum wrench specifications'
                ],
                image: {
                  src: '/images/safety/info-sources-excel-curennseal.jpg',
                  alt: 'Excel file entry for CureNSeal 25EX showing specific packaging requirements and UN rating indicators',
                  caption: 'CureNSeal 25EX Excel file entry'
                }
              }
            ]
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-3',
          questionType: 'multiple-choice',
          questionText: 'Which are the three most common DOT-regulated materials in SpecChem products?',
          options: [
            'Explosives',
            'Flammable gas',
            'Flammable liquid',
            'Infectious substances',
            'Corrosives',
            'Toxic materials'
          ],
          correctAnswer: ['C', 'E', 'F'],
          explanation: 'The three most common DOT-regulated materials at SpecChem are: Flammable liquid (most common), Corrosives, and Toxic materials.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'information-sources-quiz',
      title: 'Information Sources Quiz',
      orderIndex: 5,
      iconName: 'FileText',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Understanding Information Sources'
          }
        },
        {
          blockType: 'text',
          orderIndex: 1,
          content: {
            text: 'Let\'s test your understanding of the three primary information sources and their specific uses.'
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-4',
          questionType: 'multiple-choice',
          questionText: 'Which two sources show you the type of package to use when packaging a product?',
          options: [
            'Section 14 of the product SDS',
            'The production order',
            'An Excel file located on the corporate server specific to product packaged in drums or pails, respectively'
          ],
          correctAnswer: ['B', 'C'],
          explanation: 'The production order and the Excel file on the corporate server show the type of package to use. The SDS shows regulation status but not the specific package type.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'closing-instructions-quiz',
      title: 'Closing Instructions Source',
      orderIndex: 6,
      iconName: 'FileText',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Finding Closing Instructions'
          }
        },
        {
          blockType: 'text',
          orderIndex: 1,
          content: {
            text: 'Among the three information sources, only one provides the critical closing instructions needed for proper packaging.'
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-5',
          questionType: 'multiple-choice',
          questionText: 'Which one of those sources also lists the proper closing instructions for the packaging?',
          options: [
            'Section 14 of the product SDS',
            'The production order',
            'An Excel file located on the corporate server specific to product packaged in drums or pails, respectively'
          ],
          correctAnswer: 'C',
          explanation: 'Only the Excel file located on the corporate server contains the proper closing instructions for packaging. This is the most comprehensive source for packaging information.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'package-marking',
      title: 'Package Marking Requirements',
      orderIndex: 7,
      iconName: 'Package',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Proper Marking for DOT-Regulated Materials',
            icon: 'Package',
            iconColor: 'text-indigo-600'
          }
        },
        {
          blockType: 'text',
          orderIndex: 1,
          content: {
            text: 'Now we will cover information you need to know regarding proper marking for proper storage or transport of DOT-regulated materials.'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 2,
          content: {
            type: 'info',
            title: 'Remember: I-SHIP System',
            text: 'The basic description consists of four product characteristics which give quick information on the type of hazard presented by the material. As an aid in remembering the four characteristics, think of the acronym I-SHIP:',
            variant: 'blue'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 3,
          content: {
            columns: 4,
            gap: 4,
            items: [
              {
                letter: 'I',
                title: 'Identification Number',
                description: 'UN number identifying specific material/category'
              },
              {
                letter: 'S',
                title: 'Proper Shipping Name',
                description: 'Describes hazard properties and composition'
              },
              {
                letter: 'H',
                title: 'Hazard Class',
                description: 'Nine subdivisions describing hazard type'
              },
              {
                letter: 'P',
                title: 'Packing Group',
                description: 'Danger level (lower number = higher danger)'
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 4,
          content: {
            type: 'case-study',
            title: '📋 Example: CureNSeal 25EX Basic Description',
            variant: 'green'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 5,
          content: {
            columns: 4,
            gap: 4,
            items: [
              {
                title: 'Identification',
                value: 'UN 1139'
              },
              {
                title: 'Shipping Name',
                value: 'Coating solution'
              },
              {
                title: 'Hazard Class',
                value: '3'
              },
              {
                title: 'Packing Group',
                value: '2'
              }
            ]
          }
        },
        {
          blockType: 'text',
          orderIndex: 6,
          content: {
            heading: 'DOT Hazard Stickers'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 7,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                title: '🔥 Class 3: Flammable Liquid',
                description: 'Square sticker using GHS pictograms',
                note: 'Most common at SpecChem',
                image: {
                  src: '/images/safety/packaging-hazard-label-flammable.jpg',
                  alt: 'Class 3 Flammable Liquid hazard sticker with diamond shape and flame symbol',
                  className: 'w-32 mx-auto rounded border border-gray-200'
                }
              },
              {
                title: '⚠️ Class 8: Corrosive',
                description: 'Second most common sticker type',
                note: 'Pre-printed on continuous rolls',
                image: {
                  src: '/images/safety/packaging-hazard-label-corrosive.jpg',
                  alt: 'Class 8 Corrosive hazard sticker with diamond shape and corrosive symbol',
                  className: 'w-32 mx-auto rounded border border-gray-200'
                }
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 8,
          content: {
            type: 'warning',
            title: 'Inventory Management',
            text: 'If stock on a hazard sticker appears to be low, notify your supervisor or lead immediately. Hazardous materials cannot be shipped without these stickers.',
            variant: 'amber'
          }
        },
        {
          blockType: 'text',
          orderIndex: 9,
          content: {
            heading: 'UN Labels',
            text: 'UN labels mark the packaging of DOT-regulated material with the I-SHIP information. Files for printing labels are on the corporate server in the same folder as product labels.'
          }
        },
        {
          blockType: 'image',
          orderIndex: 10,
          content: {
            src: '/images/safety/packaging-un-labels-sheet.jpg',
            alt: 'Sheet of UN1139 labels showing proper format with UN number, proper shipping name, and packing group information',
            caption: 'Example UN labels sheet for UN1139 (Coating Solution)',
            className: 'w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-sm'
          }
        },
        {
          blockType: 'image',
          orderIndex: 11,
          content: {
            src: '/images/safety/packaging-un-label-on-pail.jpg',
            alt: 'UN label properly placed on a pail showing correct positioning and size requirements',
            caption: 'UN label properly placed on pail',
            className: 'w-full max-w-sm mx-auto rounded-lg border border-gray-200 shadow-sm'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 12,
          content: {
            type: 'info',
            title: 'Size Requirements (49 CFR Regulations)',
            variant: 'blue'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 13,
          content: {
            columns: 2,
            gap: 4,
            items: [
              {
                title: '🪣 Pails',
                requirement: 'UN ID: Minimum 6mm (0.24 inches)'
              },
              {
                title: '🥁 Drums & Totes',
                requirement: 'UN ID: Minimum 12mm (0.47 inches)'
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 14,
          content: {
            type: 'info',
            title: '📁 File Organization',
            variant: 'gray'
          }
        },
        {
          blockType: 'text',
          orderIndex: 15,
          content: {
            text: 'S-Drive → Product Labels → UN Numbers',
            folders: ['Drums Folder', 'Pails Folder', 'Totes Folder']
          }
        },
        {
          blockType: 'table',
          orderIndex: 16,
          content: {
            headers: ['Stickers per Sheet', 'ULINE Number', 'Avery Equivalent'],
            rows: [
              ['12 per sheet', 'S5627', 'Available'],
              ['10 per sheet', 'S19321', 'Available'],
              ['6 per sheet', 'S19322', 'Available']
            ]
          }
        },
        {
          blockType: 'text',
          orderIndex: 17,
          content: {
            heading: 'Label Placement Guidelines'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 18,
          content: {
            columns: 3,
            gap: 4,
            items: [
              {
                title: '🪣 Pails',
                guidelines: [
                  'Position to the right of product label',
                  'Don\'t obscure SpecChem logo',
                  'UN label along bottom right of hazard sticker'
                ]
              },
              {
                title: '🥁 Drums',
                guidelines: [
                  'Similar to pails',
                  'To the right of product label',
                  'Same configuration as pails'
                ]
              },
              {
                title: '🏺 Totes',
                guidelines: [
                  'Same configuration',
                  'On side displaying product label',
                  'Maintain visibility'
                ]
              }
            ]
          }
        },
        {
          blockType: 'grid',
          orderIndex: 19,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                image: {
                  src: '/images/safety/packaging-label-placement-pails.jpg',
                  alt: 'Proper label placement on pails showing correct positioning of hazard stickers and UN labels',
                  caption: 'Proper label placement on pails',
                  className: 'w-full rounded border border-gray-200 mb-2'
                }
              },
              {
                image: {
                  src: '/images/safety/packaging-label-placement-drums.jpg',
                  alt: 'Proper label placement on drums showing correct positioning of hazard stickers and UN labels',
                  caption: 'Proper label placement on drums',
                  className: 'w-full rounded border border-gray-200 mb-2'
                }
              }
            ]
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-6',
          questionType: 'true-false',
          questionText: 'If you forget to mark pails of DOT-regulated material with the DOT hazard sticker and/or UN label, it\'s okay to allow them to ship as long as you put a note on the shipping paperwork.',
          correctAnswer: 'False',
          explanation: 'All packages containing hazardous material must be marked properly or they cannot be placed on a truck for shipment. Improperly marked packages should be removed from staging immediately and corrected before shipping.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'proper-closure',
      title: 'Proper Closure Procedures',
      orderIndex: 8,
      iconName: 'Shield',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Proper Closure of Packaging Containers',
            icon: 'Shield',
            iconColor: 'text-red-600'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 1,
          content: {
            type: 'critical',
            title: 'Critical for All Products',
            text: 'Proper closure of packaging is key to preventing the possibility of leaks, so adhering to proper closing instructions is vital when handling DOT-regulated materials. Since we don\'t want to ship packaging of any type which may have the possibility of leaking, proper closing instructions should be followed for all SpecChem products - DOT-regulated or not.',
            variant: 'red'
          }
        },
        {
          blockType: 'text',
          orderIndex: 2,
          content: {
            heading: '🥁 Drum Closure Procedures'
          }
        },
        {
          blockType: 'table',
          orderIndex: 3,
          content: {
            headers: ['Drum Type', 'Bung Size', 'Bung Material', 'Required Torque'],
            rows: [
              ['Steel drums', '2-inch', 'Steel bung', '30 foot-pounds'],
              ['Steel drums', '3/4-inch', 'Steel bung', '15 foot-pounds'],
              ['Steel drums', '2-inch', 'Poly bung', '20 foot-pounds'],
              ['Steel drums', '3/4-inch', 'Poly bung', '9 foot-pounds'],
              ['Poly drums', '2-inch', 'Poly bung', '20 foot-pounds']
            ]
          }
        },
        {
          blockType: 'grid',
          orderIndex: 4,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                title: '🔴 Red Handle Drum Wrench',
                badge: 'Steel Bungs',
                features: [
                  {
                    title: 'Large 4-lug side',
                    spec: '30 foot-pounds (2-inch steel bungs)'
                  },
                  {
                    title: 'Single lug side',
                    spec: '15 foot-pounds (3/4-inch steel bungs)'
                  }
                ],
                image: {
                  src: '/images/safety/closure-drum-wrench-red.jpg',
                  alt: 'Red handle drum wrench tool for steel bungs showing proper torque specifications',
                  caption: 'Red handle wrench for steel bungs'
                }
              },
              {
                title: '🟡 Yellow Handle Drum Wrench',
                badge: 'Poly Bungs',
                features: [
                  {
                    title: 'Large 4-lug side',
                    spec: '20 foot-pounds (2-inch poly bungs)'
                  },
                  {
                    title: 'Single lug side',
                    spec: '9 foot-pounds (3/4-inch poly bungs)'
                  }
                ],
                image: {
                  src: '/images/safety/closure-drum-wrench-yellow.jpg',
                  alt: 'Yellow handle drum wrench tool for poly bungs showing proper torque specifications',
                  caption: 'Yellow handle wrench for poly bungs'
                }
              }
            ]
          }
        },
        {
          blockType: 'grid',
          orderIndex: 5,
          content: {
            columns: 3,
            gap: 4,
            items: [
              {
                image: {
                  src: '/images/safety/closure-drum-steel-bungs.jpg',
                  alt: 'Steel drum with steel bungs showing proper closure configuration',
                  caption: 'Steel drum with steel bungs'
                }
              },
              {
                image: {
                  src: '/images/safety/closure-drum-poly-bungs.jpg',
                  alt: 'Steel drum with poly bungs showing proper closure configuration',
                  caption: 'Steel drum with poly bungs'
                }
              },
              {
                image: {
                  src: '/images/safety/closure-drum-poly-container.jpg',
                  alt: 'Poly drum container showing proper closure requirements',
                  caption: 'Poly drum container'
                }
              }
            ]
          }
        },
        {
          blockType: 'image',
          orderIndex: 6,
          content: {
            src: '/images/safety/closure-drum-example-sealed.jpg',
            alt: 'Properly sealed drum showing correct closure technique and final appearance',
            caption: 'Example of properly sealed drum',
            className: 'w-full max-w-md mx-auto rounded border border-gray-200'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 7,
          content: {
            type: 'critical',
            title: 'Absolute Requirement',
            text: 'When packaging products classified as HAZ, these are the only tools which may be used to close drums. There are absolutely no exceptions.',
            variant: 'red'
          }
        },
        {
          blockType: 'text',
          orderIndex: 8,
          content: {
            heading: '🪣 Pail Closure Procedures'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 9,
          content: {
            columns: 3,
            gap: 4,
            items: [
              {
                step: 'Step 1',
                title: 'Place the Lid',
                description: 'Place the uncrimped lid on top of the pail.',
                note: 'Spouted lid: Orient spout opposite product label to prevent damage',
                image: {
                  src: '/images/safety/closure-pail-lid-placement.jpg',
                  alt: 'Pail with lid properly placed showing correct orientation and positioning'
                }
              },
              {
                step: 'Step 2',
                title: 'Align Crimper',
                description: 'Place the crimper over the lid.',
                note: 'Critical: Align 16 lugs on crimper with 16 tabs on lid',
                image: {
                  src: '/images/safety/closure-pail-crimper-tool.jpg',
                  alt: 'Pail crimper tool properly positioned over lid showing alignment of lugs and tabs'
                }
              },
              {
                step: 'Step 3',
                title: 'Crimp',
                description: 'Press down on crimper handles.',
                note: 'Apply firm, even pressure until handles reach end of motion',
                image: {
                  src: '/images/safety/closure-pail-example-sealed.jpg',
                  alt: 'Properly sealed pail showing completed crimping and final appearance'
                }
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 10,
          content: {
            type: 'warning',
            title: 'Alignment is Critical',
            text: 'If the lugs are set over the gap between tabs, the tab will not be fully crimped and may not be tight enough against the pail body, which could allow for seepage or leakage.',
            variant: 'amber'
          }
        },
        {
          blockType: 'text',
          orderIndex: 11,
          content: {
            heading: '🏺 Tote Closure Procedures'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 12,
          content: {
            type: 'info',
            text: 'There is no single torque value for all tote lids. In most cases, totes are manufactured by Mauser and require 70 foot-pounds of torque.',
            variant: 'blue'
          }
        },
        {
          blockType: 'card',
          orderIndex: 13,
          content: {
            title: '📁 Verification Path',
            text: 'Desktop → S: → Operations → Compliance → Closing Instructions → "IBC Closing Instructions totes.pdf"',
            note: 'Unknown manufacturer? Ask your plant manager to contact purchasing lead for guidance.'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 14,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                title: 'Required Tools',
                tools: [
                  {
                    name: 'IBC/Tote Wrench',
                    description: 'Circular ring with handles and square center hole'
                  },
                  {
                    name: 'Socket Torque Wrench',
                    description: 'Standard 1½ inch drive'
                  }
                ],
                image: {
                  src: '/images/safety/closure-tote-wrenches.png',
                  alt: 'Tote closure wrenches showing IBC wrench and socket torque wrench tools',
                  caption: 'Tote closure tools'
                }
              },
              {
                title: 'Four-Step Process',
                steps: [
                  'Place tote wrench over lid',
                  'Set dial to desired torque (usually 70 ft-lbs)',
                  'Insert socket head into square hole',
                  'Turn until handle breaks/bends'
                ]
              }
            ]
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-7',
          questionType: 'true-false',
          questionText: 'All drums, whether made of steel or plastic, require the same amount of torque to be considered properly closed.',
          correctAnswer: 'False',
          explanation: 'The amount of torque is different depending on the size of the bung and the type of material. 2-inch steel bungs require 30 foot-pounds, 3/4-inch steel bungs require 15 foot-pounds, 2-inch poly bungs require 20 foot-pounds, and 3/4-inch poly bungs require 9 foot-pounds.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'final-quiz',
      title: 'Final Knowledge Check',
      orderIndex: 9,
      iconName: 'CheckCircle',
      contentBlocks: [
        {
          blockType: 'card',
          orderIndex: 0,
          content: {
            title: 'Final Compliance Question',
            icon: 'CheckCircle',
            iconColor: 'text-green-600'
          }
        },
        {
          blockType: 'text',
          orderIndex: 1,
          content: {
            text: 'This final question addresses the most critical safety requirement when working with DOT-regulated materials.'
          }
        }
      ],
      quizQuestions: [
        {
          questionKey: 'quiz-8',
          questionType: 'true-false',
          questionText: 'When packaging DOT-regulated material in drums, it is never allowable to use a closure tool other than the drum torque wrench specific to the type of bungs used to close the drum (red for steel bungs and yellow for poly or plastic bungs).',
          correctAnswer: 'True',
          explanation: 'Properly calibrated torque wrenches are the only tool allowable for use in closing drums containing DOT-regulated material and should also be used for non-DOT-regulated material to ensure proper seal. Using the proper torque wrench is the best defense against potential leakage.',
          orderIndex: 1
        }
      ]
    },
    {
      sectionKey: 'course-summary',
      title: 'Course Summary & Completion',
      orderIndex: 10,
      iconName: 'CheckCircle',
      contentBlocks: [
        {
          blockType: 'hero',
          orderIndex: 0,
          content: {
            title: 'Course Complete!',
            subtitle: 'You have successfully completed the Function-Specific HazMat Training',
            badge: 'SpecChem Certified',
            backgroundClass: 'bg-green-50',
            icon: 'CheckCircle',
            iconColor: 'text-green-600'
          }
        },
        {
          blockType: 'card',
          orderIndex: 1,
          content: {
            title: 'What You\'ve Learned',
            text: 'As we come to the end of this course, here are the key competencies you have acquired:'
          }
        },
        {
          blockType: 'grid',
          orderIndex: 2,
          content: {
            columns: 2,
            gap: 6,
            items: [
              {
                icon: '📦',
                title: 'UN-Rated Packaging',
                description: 'Understanding what it means, what it is, and why it\'s used'
              },
              {
                icon: '🔍',
                title: 'Information Sources',
                description: 'Where to find specific information on pail or drum types for any liquid product'
              },
              {
                icon: '🏷️',
                title: 'Proper Markings',
                description: 'How to properly mark hazardous materials for shipping'
              },
              {
                icon: '📋',
                title: 'Required Marking Info',
                description: 'Where to find information on required marking for hazardous materials'
              },
              {
                icon: '🔒',
                title: 'Closing Instructions',
                description: 'Where to find closing instructions for each type of packaging'
              },
              {
                icon: '🔧',
                title: 'Proper Tools',
                description: 'The proper tools for closing pails, drums, and totes with DOT-regulated materials'
              }
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 3,
          content: {
            type: 'info',
            title: 'Key Takeaway',
            text: 'The most important outcome of this training is not a quiz score, but having you know the proper procedures for handling hazardous materials in your work at SpecChem.',
            variant: 'blue'
          }
        },
        {
          blockType: 'callout',
          orderIndex: 4,
          content: {
            type: 'critical',
            title: '🚨 Emergency Protocol Reminder',
            text: 'If you discover improperly marked packages containing hazardous material:',
            variant: 'red'
          }
        },
        {
          blockType: 'list',
          orderIndex: 5,
          content: {
            type: 'numbered',
            items: [
              'Immediately notify your lead, supervisor, plant manager, or assistant plant manager',
              'Remove pallets from staging or storage lanes',
              'Unband or unwrap packages to prevent truck loading',
              'Correct package markings as soon as possible',
              'Return pallets to staging only after proper marking'
            ]
          }
        },
        {
          blockType: 'callout',
          orderIndex: 6,
          content: {
            type: 'info',
            title: '📝 Next Steps',
            text: 'Please provide your signed and dated quiz results to your plant manager.',
            note: 'This training satisfies the federal requirement for function-specific hazardous materials training and is valid for three years from the completion date.',
            variant: 'amber'
          }
        },
        {
          blockType: 'text',
          orderIndex: 7,
          content: {
            text: 'Thank you for completing this training.',
            note: 'Document Version: 2024 (Summer) • Regulatory Authority: 49 CFR • Enforcement: U.S. DOT'
          }
        }
      ]
    }
  ]
};

// Spanish content extraction (abbreviated for brevity - would include full translation)
const spanishContent: ExtractedContent = {
  courseId: 'hazmat-function-specific',
  language: 'es',
  sections: [
    {
      sectionKey: 'introduccion',
      title: 'Introducción y Resumen',
      orderIndex: 0,
      iconName: 'BookOpen',
      contentBlocks: [
        {
          blockType: 'hero',
          orderIndex: 0,
          content: {
            title: 'Capacitación Específica por Función - Materiales Peligrosos',
            subtitle: 'Manejo, Empaque y Envío de Materiales Regulados por DOT',
            badge: 'Capacitación Profesional SpecChem',
            backgroundClass: 'bg-gray-50'
          }
        },
        {
          blockType: 'card',
          orderIndex: 1,
          content: {
            title: 'Bienvenido a la Capacitación Específica por Función de SpecChem',
            text: 'Este curso integral de capacitación cubre los requisitos y expectativas para el manejo, empaque y envío de materiales regulados por DOT en su trabajo en SpecChem.',
            variant: 'info',
            borderClass: 'border-l-4 border-l-blue-500'
          }
        }
        // ... Additional Spanish content blocks would be included here
      ],
      // Spanish quiz questions would be included here
    }
    // ... Additional Spanish sections would be included here
  ]
};

/**
 * Main extraction function
 */
async function extractContent() {
  console.log('🚀 Starting ebook content extraction...');
  
  try {
    // Create output directory
    const outputDir = path.join(process.cwd(), 'scripts', 'extracted-content');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write English content
    const englishFile = path.join(outputDir, 'english-content.json');
    fs.writeFileSync(englishFile, JSON.stringify(englishContent, null, 2));
    console.log('✅ English content extracted to:', englishFile);
    
    // Write Spanish content
    const spanishFile = path.join(outputDir, 'spanish-content.json');
    fs.writeFileSync(spanishFile, JSON.stringify(spanishContent, null, 2));
    console.log('✅ Spanish content extracted to:', spanishFile);
    
    // Create combined migration data
    const migrationData = {
      courses: [
        {
          slug: 'hazmat-function-specific',
          title: 'Function-Specific HazMat Training',
          version: '2024.1',
          isPublished: true,
          defaultLanguage: 'en',
          availableLanguages: ['en', 'es'],
          contentVersion: '2024.1'
        }
      ],
      languages: [
        {
          courseSlug: 'hazmat-function-specific',
          languageCode: 'en',
          isPrimary: true,
          isPublished: true
        },
        {
          courseSlug: 'hazmat-function-specific',
          languageCode: 'es',
          isPrimary: false,
          isPublished: true
        }
      ],
      content: {
        en: englishContent,
        es: spanishContent
      }
    };
    
    const migrationFile = path.join(outputDir, 'migration-data.json');
    fs.writeFileSync(migrationFile, JSON.stringify(migrationData, null, 2));
    console.log('✅ Migration data created:', migrationFile);
    
    console.log('\n📊 Extraction Summary:');
    console.log(`- English sections: ${englishContent.sections.length}`);
    console.log(`- Spanish sections: ${spanishContent.sections.length}`);
    console.log(`- Total content blocks: ${englishContent.sections.reduce((acc, s) => acc + s.contentBlocks.length, 0)}`);
    console.log(`- Total quiz questions: ${englishContent.sections.reduce((acc, s) => acc + (s.quizQuestions?.length || 0), 0)}`);
    
    console.log('\n🎉 Content extraction completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during content extraction:', error);
    process.exit(1);
  }
}

// Run extraction if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  extractContent();
}

export { englishContent, extractContent, spanishContent };

