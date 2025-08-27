'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Users, 
  Shield, 
  Clock,
  Heart, 
  Award,
  BookOpen,
  Building,
  Phone,
  MapPin,
  Filter,
  ChevronRight,
  Home
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Types
interface HandbookSection {
  id: string
  number: string
  title: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  content: string
  searchableText: string
  tags: string[]
}

export default function HandbookPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  // Handbook sections data
  const sections: HandbookSection[] = [
    {
      id: 'welcome',
      number: '01',
      title: 'Welcome to SpecChem',
      category: 'getting-started',
      icon: Users,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-navy-50 to-yellow-50 p-8 rounded-xl border-l-4 border-yellow-500">
            <h2 class="text-2xl font-bold text-navy-900 mb-4">Welcome to SpecChem and Related Companies!</h2>
            <p class="text-lg text-gray-700 leading-relaxed mb-6">
              We are pleased to greet you as a new associate of the Company and to express our good wishes for your personal career success.
            </p>
            <p class="text-gray-700 leading-relaxed">
              People are our most important asset, and it takes many capable people to operate a successful business. 
              We need your knowledge, abilities, enthusiasm, and determination so that SpecChem remains a leader in the Industry.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-navy-900 mb-3">Our Leadership</h3>
              <div class="space-y-3">
                <div>
                  <h4 class="font-medium text-gray-900">Greg Maday</h4>
                  <p class="text-gray-600">Chairman & CEO</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Mike Shull</h4>
                  <p class="text-gray-600">President</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-navy-900 mb-3">Why You'll Love It Here</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Industry leadership position
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Professional growth opportunities
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Collaborative team environment
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Meaningful contribution to construction industry
                </li>
              </ul>
            </div>
          </div>
        </div>
      `,
      searchableText: 'welcome greet new associate career success people asset knowledge abilities enthusiasm determination leader industry contribution team pride construction',
      tags: ['welcome', 'introduction', 'leadership', 'team']
    },
    {
      id: 'mission',
      number: '02',
      title: 'Mission & Service Strategy',
      category: 'company-culture',
      icon: Award,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 rounded-xl text-white">
            <h2 class="text-3xl font-bold mb-4">Our Mission</h2>
            <p class="text-xl leading-relaxed">
              SpecChem's mission is to be Number One in the industry by exceeding customer expectations.
            </p>
          </div>
          
          <div class="bg-navy-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Service Basics - Our Core Values</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">1</div>
                  <p class="text-gray-700">The Mission Statement will be known, owned, and energized by all associates.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">2</div>
                  <p class="text-gray-700">Anticipate and comply with customer needs.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">3</div>
                  <p class="text-gray-700">Associates, customers and suppliers are to be treated with dignity and respect.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">4</div>
                  <p class="text-gray-700">Every SpecChem Associate is responsible for creating a positive work environment.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">5</div>
                  <p class="text-gray-700">Be an ambassador of SpecChem. Always talk positively.</p>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">6</div>
                  <p class="text-gray-700">Any SpecChem Associate who receives a customer complaint "owns" the complaint.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">7</div>
                  <p class="text-gray-700">Expedient customer satisfaction will be ensured by all.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">8</div>
                  <p class="text-gray-700">Be knowledgeable and educated on company information.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">9</div>
                  <p class="text-gray-700">Work areas should be clean and neat. Practice good housekeeping.</p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="bg-yellow-500 text-white rounded-full p-1 text-sm font-bold flex items-center justify-center w-6 h-6 flex-shrink-0 mt-1">10</div>
                  <p class="text-gray-700">Protecting SpecChem's assets is everyone's responsibility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      searchableText: 'mission number one industry exceeding customer expectations service basics values dignity respect teamwork ambassador positive environment',
      tags: ['mission', 'values', 'service', 'customer satisfaction', 'teamwork']
    },
    {
      id: 'employment',
      number: '03',
      title: 'Employment Process',
      category: 'getting-started',
      icon: Building,
      content: `
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Employment at Will</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Nothing in this Team Handbook, or in any other personnel document, creates, or is intended to create a contract, 
              promise or representation of continued employment for any associate.
            </p>
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p class="text-gray-700">
                <strong>Important:</strong> SpecChem associates are subject to employment at will, which means that either 
                the Company or associate can terminate employment at any time, with or without notice and with or without cause.
              </p>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Non-Discrimination & Anti-Harassment</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              SpecChem strives to create and maintain a work environment in which people are treated with dignity, 
              decency, and respect. The environment should be characterized by mutual trust and the absence of 
              intimidation, oppression, and exploitation.
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-navy-50 p-4 rounded-lg">
                <h4 class="font-semibold text-navy-900 mb-2">Protected Characteristics</h4>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li>• Race, color, national origin</li>
                  <li>• Age, religion, disability status</li>
                  <li>• Sex, sexual orientation</li>
                  <li>• Gender identity or expression</li>
                  <li>• Genetic information</li>
                  <li>• Marital status</li>
                </ul>
              </div>
              <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Our Commitment</h4>
                <p class="text-sm text-gray-700">
                  SpecChem will not tolerate unlawful discrimination or harassment of any kind. 
                  Through enforcement of this policy and by education of associates, we will seek 
                  to prevent, correct, and discipline behavior that violates this policy.
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Employment Application</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              We rely on the accuracy of your application and other information presented throughout the hiring process and employment.
            </p>
            <div class="bg-red-50 border border-red-200 rounded p-4">
              <p class="text-red-800 text-sm">
                <strong>Important:</strong> You may be excused from the hiring process for any misrepresentations, 
                falsifications, or material omissions. If hired, these misleading acts can result in corrective action, 
                up to and including termination.
              </p>
            </div>
          </div>
        </div>
      `,
      searchableText: 'employment at will contract termination notice cause non-discrimination anti-harassment dignity respect mutual trust intimidation oppression application accuracy misrepresentation falsification',
      tags: ['employment', 'at-will', 'discrimination', 'harassment', 'application', 'hiring']
    },
    {
      id: 'benefits',
      number: '04',
      title: 'Benefits & Time Off',
      category: 'benefits',
      icon: Heart,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-navy-600 to-navy-700 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Your Benefits Package</h2>
            <p class="text-lg opacity-90">
              We believe in taking care of our people with comprehensive benefits that support your work-life balance.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Paid Time Off (PTO)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-gray-700 mb-4">
                  SpecChem provides paid time off for vacation, personal days, and sick leave in a flexible PTO system.
                </p>
                <div class="space-y-2">
                  <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span class="text-sm font-medium">Accrual Rate</span>
                    <span class="text-sm text-gray-600">Based on tenure</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span class="text-sm font-medium">Maximum Carryover</span>
                    <span class="text-sm text-gray-600">Per policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <Heart className="h-5 w-5 text-yellow-600" />
                  Family Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-gray-700 mb-4">
                  We support our associates during important family milestones with comprehensive leave options.
                </p>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Parental Leave</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Bereavement Leave</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Medical Leave</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Additional Benefits</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h4 class="font-semibold text-gray-900 mb-1">Holidays</h4>
                <p class="text-sm text-gray-600">Recognized company holidays with pay</p>
              </div>
              <div class="text-center p-4 bg-navy-50 rounded-lg">
                <Users className="h-8 w-8 text-navy-600 mx-auto mb-2" />
                <h4 class="font-semibold text-gray-900 mb-1">Jury Duty</h4>
                <p class="text-sm text-gray-600">Time off for civic responsibilities</p>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h4 class="font-semibold text-gray-900 mb-1">Military Leave</h4>
                <p class="text-sm text-gray-600">Support for military service members</p>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Associate Referral Program</h3>
            <p class="text-gray-700">
              Help us find great people and earn rewards! We value your recommendations for quality candidates 
              who would be a good fit for our team culture and values.
            </p>
          </div>
        </div>
      `,
      searchableText: 'benefits time off PTO paid vacation personal sick leave parental bereavement medical holidays jury duty military leave referral program',
      tags: ['benefits', 'PTO', 'leave', 'vacation', 'family', 'holidays', 'referral']
    },
    {
      id: 'safety',
      number: '05',
      title: 'Safety & Security',
      category: 'workplace',
      icon: Shield,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Safety is Our Priority</h2>
            <p class="text-lg opacity-90">
              It is SpecChem's intention to provide a safe and healthy work environment for associates. 
              A working environment is only as safe as people make it.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <Shield className="h-5 w-5 text-red-600" />
                  Workplace Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div class="bg-red-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-2">Our Commitment</h4>
                  <p class="text-sm text-gray-700">
                    SpecChem provides modern equipment and work facilities that meet the standards 
                    prescribed in applicable Workers' Compensation and Occupational Safety and Health laws.
                  </p>
                </div>
                <div class="space-y-2">
                  <h4 class="font-semibold text-gray-900">Your Responsibilities:</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Use good safety habits at work and home
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Report unsafe working conditions immediately
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Report faulty equipment that may cause injury
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Participate in accident prevention
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <Phone className="h-5 w-5 text-red-600" />
                  Reporting Injuries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-2">Immediate Action Required</h4>
                  <p class="text-sm text-gray-700">
                    If you receive any type of injury or are aware of any property damage on the job, 
                    inform your supervisor immediately, but no later than the end of your shift.
                  </p>
                </div>
                <div class="space-y-2">
                  <h4 class="font-semibold text-gray-900">Medical Treatment:</h4>
                  <p class="text-sm text-gray-700">
                    If medical treatment is required, your supervisor must be notified before such 
                    treatment unless emergency conditions prevent such notification.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-navy-900 mb-4">Workplace Violence Prevention</h3>
            <div class="grid md:grid-cols-3 gap-4 mb-4">
              <div class="text-center p-4 bg-red-50 rounded-lg">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span class="text-red-600 font-bold text-sm">0</span>
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">Zero Tolerance</h4>
                <p class="text-xs text-gray-600">For threats or acts of violence</p>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h4 class="font-semibold text-gray-900 mb-1">Safe Environment</h4>
                <p class="text-xs text-gray-600">For all associates and visitors</p>
              </div>
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 class="font-semibold text-gray-900 mb-1">Report Concerns</h4>
                <p class="text-xs text-gray-600">Immediately to management</p>
              </div>
            </div>
            <p class="text-gray-700">
              SpecChem works hard to ensure we recognize and react to situations that could threaten 
              the safety of our associates, visitors, customers, and/or property. Acts or threats of 
              physical violence, including intimidation, harassment and/or coercion, will not be tolerated.
            </p>
          </div>
        </div>
      `,
      searchableText: 'safety security workplace violence prevention injury reporting equipment safety habits unsafe conditions accident prevention zero tolerance threats intimidation harassment',
      tags: ['safety', 'security', 'workplace violence', 'injury reporting', 'prevention', 'zero tolerance']
    },
    {
      id: 'contact',
      number: '06',
      title: 'Contact Information',
      category: 'company-info',
      icon: MapPin,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-navy-600 to-navy-700 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Get In Touch</h2>
            <p class="text-lg opacity-90">
              We're here to help and support you throughout your journey at SpecChem.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <MapPin className="h-5 w-5 text-yellow-600" />
                  Corporate Headquarters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div class="space-y-1">
                  <p class="font-medium text-gray-900">SpecChem LLC</p>
                  <p class="text-gray-700">1511 Baltimore Ave, Suite 600</p>
                  <p class="text-gray-700">Kansas City, MO 64108</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <Phone className="h-5 w-5 text-yellow-600" />
                  Contact Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div class="space-y-2">
                  <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span class="text-sm font-medium">Main Phone</span>
                    <span class="text-sm text-gray-700">816.968.5600</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span class="text-sm font-medium">Toll Free</span>
                    <span class="text-sm text-gray-700">866.791.8700</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span class="text-sm font-medium">Fax</span>
                    <span class="text-sm text-gray-700">816.561.4029</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div class="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Professional Affiliations</h3>
            <p class="text-gray-700 mb-4">
              SpecChem is proud to be associated with leading industry organizations:
            </p>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h4 class="font-semibold text-gray-900 text-sm">American Concrete Institute</h4>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h4 class="font-semibold text-gray-900 text-sm">Construction Specifications Institute</h4>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h4 class="font-semibold text-gray-900 text-sm">Tilt-Up Concrete Association</h4>
              </div>
            </div>
          </div>
          
          <div class="bg-navy-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-navy-900 mb-3">Open Door Policy</h3>
            <p class="text-gray-700 mb-4">
              SpecChem encourages all associates to take an "Open Door" approach to sharing ideas, 
              constructive feedback, and concerns. We realize that problems often stem from lack of 
              communication, miscommunication, and misunderstandings.
            </p>
            <div class="bg-white p-4 rounded border border-navy-200">
              <p class="text-sm text-gray-700">
                <strong>Remember:</strong> You are encouraged to bring your concerns to the attention of your 
                manager and attempt to resolve any issues informally. If you are hesitant to discuss concerns 
                with your manager, you may take your concern to human resources or Company management.
              </p>
            </div>
          </div>
        </div>
      `,
      searchableText: 'contact information headquarters Kansas City Baltimore phone toll free fax professional affiliations American Concrete Institute Construction Specifications Tilt-Up Association open door policy communication concerns',
      tags: ['contact', 'headquarters', 'phone', 'address', 'affiliations', 'open door', 'communication']
    },
    
    {
      id: 'performance',
      number: '07',
      title: 'Performance Management',
      category: 'workplace',
      icon: Award,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Performance Excellence</h2>
            <p class="text-lg opacity-90">
              Performance Management is a process that provides a means by which both the Company and 
              its associates may attempt to remedy conflicts or concerns regarding job or behavioral performance.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Performance Process</h3>
              <p class="text-gray-700 mb-4">
                Corrective action is intended to be treated as an opportunity for improvement. When performance, 
                attendance, or conduct is less than satisfactory, corrective measures may be taken.
              </p>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-green-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Informal Discussion</h4>
                    <p class="text-sm text-gray-600">Initial conversation about concerns and solutions</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-green-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Formal Action</h4>
                    <p class="text-sm text-gray-600">Documented corrective measures with timelines</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-green-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Follow-Up</h4>
                    <p class="text-sm text-gray-600">Progress monitoring and additional support if needed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Performance Appraisals</h3>
              <p class="text-gray-700 mb-4">
                Performance appraisals provide full and accurate information concerning your performance 
                and establish plans for continued growth.
              </p>
              <div class="bg-green-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Appraisal Objectives:</h4>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Provide full performance information
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Identify strengths and improvement areas
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Establish improvement plans
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Link performance to merit considerations
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Design training and development plans
                  </li>
                </ul>
              </div>
              <div class="bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p class="text-sm text-gray-700">
                  <strong>Important:</strong> A positive performance review does not guarantee a raise or 
                  continued employment. Nothing in this policy changes the employment at-will relationship.
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
      searchableText: 'performance management corrective action improvement opportunity attendance conduct satisfactory corrective measures appraisals review evaluation merit training development',
      tags: ['performance', 'management', 'appraisals', 'corrective action', 'improvement', 'evaluation']
    },
    
    {
      id: 'ethics',
      number: '08',
      title: 'Code of Ethics & Conduct',
      category: 'company-culture',
      icon: Shield,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Integrity in Everything We Do</h2>
            <p class="text-lg opacity-90">
              All officers, directors, and associates of SpecChem are expected to conduct themselves in 
              accordance with all applicable laws, regulations, and basic tenets of business integrity and honesty.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-federal-blue mb-4">Our Ethical Standards</h3>
            <p class="text-gray-700 mb-4">
              SpecChem will take appropriate disciplinary action against any director, officer, or associate 
              whose conduct violates any applicable laws, regulations, or basic tenets of business integrity and honesty.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="font-semibold text-gray-900">Core Principles</h4>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h5 class="font-medium text-gray-900">Legal Compliance</h5>
                      <p class="text-sm text-gray-600">Follow all applicable laws and regulations</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h5 class="font-medium text-gray-900">Business Integrity</h5>
                      <p class="text-sm text-gray-600">Honest and ethical business dealings</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h5 class="font-medium text-gray-900">Professional Conduct</h5>
                      <p class="text-sm text-gray-600">Maintain high standards in all interactions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <h4 class="font-semibold text-gray-900">Reporting Violations</h4>
                <div class="bg-purple-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-700 mb-3">
                    Any director, officer or associate who has knowledge of any violation of law, regulations, 
                    or Government procurement guidelines committed by an associate must report such violation.
                  </p>
                  <div class="bg-white border border-purple-200 p-3 rounded">
                    <p class="text-sm font-medium text-gray-900">Quality Assurance Auditor</p>
                    <p class="text-sm text-gray-600">Contact information will be posted under QAA title</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-federal-blue p-6 rounded-lg text-white">
            <h3 class="text-lg font-semibold mb-3">Leadership Commitment</h3>
            <p class="mb-4 opacity-90">
              SpecChem management is committed to implementing and following these provisions in all respects. 
              Our ethical standards guide every decision we make and every action we take.
            </p>
            <div class="bg-white/10 p-3 rounded">
              <p class="text-sm">
                <strong>Mike Shull, President SpecChem</strong><br/>
                "Integrity is not negotiable - it's the foundation of who we are as a company."
              </p>
            </div>
          </div>
        </div>
      `,
      searchableText: 'code ethics conduct integrity honesty laws regulations business standards disciplinary action violations reporting quality assurance auditor QAA legal compliance professional conduct',
      tags: ['ethics', 'conduct', 'integrity', 'compliance', 'laws', 'regulations', 'reporting', 'violations']
    },
    
    {
      id: 'technology',
      number: '09',
      title: 'Technology & IT Policies',
      category: 'workplace',
      icon: Building,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Responsible Technology Use</h2>
            <p class="text-lg opacity-90">
              Our technology systems are vital business assets that must be used responsibly and securely. 
              These policies protect both SpecChem and our associates.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Acceptable Use Policy</h3>
              <p class="text-gray-700 mb-4">
                Internet, Intranet, and computer systems are SpecChem property and must be used for business purposes 
                in serving the interests of the company and our clients.
              </p>
              <div class="space-y-3">
                <div class="bg-blue-50 p-3 rounded">
                  <h4 class="font-semibold text-gray-900 mb-2">Appropriate Use</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Business communications and operations
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Professional development and training
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Authorized personal use (limited)
                    </li>
                  </ul>
                </div>
                <div class="bg-red-50 border border-red-200 p-3 rounded">
                  <h4 class="font-semibold text-gray-900 mb-2">Prohibited Activities</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Unauthorized software installation
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Accessing inappropriate content
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Sharing confidential information
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Violating copyright or licensing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Security & Confidentiality</h3>
              <p class="text-gray-700 mb-4">
                Effective security is a team effort involving every SpecChem associate. All data created on 
                corporate systems remains the property of SpecChem.
              </p>
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-2">Information Classification</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="font-medium">SpecChem Public</span>
                      <span class="text-gray-600">Freely shareable</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="font-medium">SpecChem Confidential</span>
                      <span class="text-gray-600">Internal use only</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="font-medium">Third Party Confidential</span>
                      <span class="text-gray-600">Highest protection</span>
                    </div>
                  </div>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p class="text-sm text-gray-700">
                    <strong>Privacy Notice:</strong> SpecChem reserves the right to monitor equipment, 
                    systems, and network traffic for security and network maintenance purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-federal-blue mb-4">Social Media Policy</h3>
            <p class="text-gray-700 mb-4">
              This policy provides guidance for associate use of social media, including blogs, wikis, microblogs, 
              message boards, social networking sites, and other platforms.
            </p>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Professional Use</h4>
                <p class="text-sm text-gray-700">
                  When representing SpecChem on social media, maintain professionalism and follow company guidelines.
                </p>
              </div>
              <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Personal Use</h4>
                <p class="text-sm text-gray-700">
                  Be aware that tagging yourself as a SpecChem associate connects your personal posts to the company.
                </p>
              </div>
              <div class="bg-red-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Prohibited Content</h4>
                <p class="text-sm text-gray-700">
                  Never share confidential information, trade secrets, or inappropriate content that could harm SpecChem's reputation.
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
      searchableText: 'technology IT policies acceptable use computer systems internet intranet security confidentiality social media monitoring privacy information classification prohibited activities',
      tags: ['technology', 'IT', 'computer', 'internet', 'security', 'confidentiality', 'social media', 'monitoring']
    },
    
    {
      id: 'compensation',
      number: '10',
      title: 'Compensation & Classification',
      category: 'benefits',
      icon: Award,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-gold to-brand-primary-600 p-8 rounded-xl text-white">
            <h2 class="text-2xl font-bold mb-4">Fair & Competitive Compensation</h2>
            <p class="text-lg opacity-90">
              SpecChem is committed to providing fair and competitive compensation that recognizes 
              your contributions and supports your financial well-being.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Employment Classifications</h3>
              <p class="text-gray-700 mb-4">
                Understanding your employment classification helps determine your benefits eligibility and pay structure.
              </p>
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-2">Non-Exempt (Hourly)</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Paid hourly with overtime eligibility
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Time reporting required
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Overtime pay for hours over 40/week
                    </li>
                  </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-2">Exempt (Salary)</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Fixed salary regardless of hours worked
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Professional/administrative/executive roles
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-gold rounded-full"></div>
                      Not eligible for overtime pay
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold text-federal-blue mb-4">Salary Reviews & Administration</h3>
              <p class="text-gray-700 mb-4">
                SpecChem conducts regular reviews of compensation to ensure competitiveness and fairness 
                across all positions and departments.
              </p>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Annual Reviews</h4>
                    <p class="text-sm text-gray-600">Comprehensive salary analysis and market comparison</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Merit Increases</h4>
                    <p class="text-sm text-gray-600">Performance-based compensation adjustments</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Promotion Adjustments</h4>
                    <p class="text-sm text-gray-600">Salary increases with role advancement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-federal-blue mb-4">Hidden Benefits for All Associates</h3>
            <p class="text-gray-700 mb-4">
              Beyond your base compensation, SpecChem provides numerous valuable benefits that add to your total compensation package.
            </p>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-gold/10 rounded-lg">
                <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users class="h-6 w-6 text-white" />
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">Team Environment</h4>
                <p class="text-xs text-gray-600">Collaborative and supportive workplace</p>
              </div>
              <div class="text-center p-4 bg-federal-blue/10 rounded-lg">
                <div class="w-12 h-12 bg-federal-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen class="h-6 w-6 text-white" />
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">Learning Opportunities</h4>
                <p class="text-xs text-gray-600">Professional development and training</p>
              </div>
              <div class="text-center p-4 bg-gold/10 rounded-lg">
                <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award class="h-6 w-6 text-white" />
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">Industry Leadership</h4>
                <p class="text-xs text-gray-600">Work for a market leader</p>
              </div>
              <div class="text-center p-4 bg-federal-blue/10 rounded-lg">
                <div class="w-12 h-12 bg-federal-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building class="h-6 w-6 text-white" />
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">Modern Facilities</h4>
                <p class="text-xs text-gray-600">State-of-the-art work environment</p>
              </div>
            </div>
          </div>
        </div>
      `,
      searchableText: 'compensation classification employment non-exempt hourly exempt salary overtime pay time reporting salary reviews merit increases promotion adjustments hidden benefits team environment learning opportunities',
      tags: ['compensation', 'salary', 'hourly', 'overtime', 'benefits', 'classification', 'merit', 'reviews']
    }
  ]

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Sections', count: sections.length },
    { id: 'getting-started', name: 'Getting Started', count: sections.filter(s => s.category === 'getting-started').length },
    { id: 'company-culture', name: 'Company Culture', count: sections.filter(s => s.category === 'company-culture').length },
    { id: 'benefits', name: 'Benefits', count: sections.filter(s => s.category === 'benefits').length },
    { id: 'workplace', name: 'Workplace', count: sections.filter(s => s.category === 'workplace').length },
    { id: 'company-info', name: 'Company Info', count: sections.filter(s => s.category === 'company-info').length }
  ]

  // Filter sections based on search and category
  const filteredSections = useMemo(() => {
    return sections.filter(section => {
      const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory
      const matchesSearch = searchQuery === '' || 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.searchableText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory, sections])

  if (currentSection) {
    const section = sections.find(s => s.id === currentSection)
    if (!section) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSection(null)}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Handbook
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div className="bg-navy-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {section.number}
                  </div>
                  <h1 className="text-lg font-semibold text-gray-900">{section.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-navy-600 hover:text-navy-700">
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-federal-blue to-yale-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* SpecChem Logo */}
            <div className="mb-8">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Image
                  src="/images/sc_white.webp"
                  alt="SpecChem Logo"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
                <div className="text-sm text-white/80 mt-2">Solution to Service</div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Team <span className="text-gold">Handbook</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive guide to working at SpecChem. Everything you need to know about our 
              policies, benefits, and culture in one searchable, beautiful resource.
            </p>
            <div className="mt-8">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                Updated September 2020
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search handbook sections, policies, benefits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sections found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredSections.map((section, index) => {
                const IconComponent = section.icon
                return (
                  <Card 
                    key={section.id}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 hover:border-l-yellow-500"
                    style={{ borderLeftColor: index % 2 === 0 ? '#1e40af' : '#eab308' }}
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        {/* Section Number */}
                        <div className="flex-shrink-0">
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                            style={{ backgroundColor: index % 2 === 0 ? '#1e40af' : '#eab308' }}
                          >
                            {section.number}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-navy-700 mb-2">
                                {section.title}
                              </h3>
                              <div className="flex items-center gap-4 mb-4">
                                <Badge 
                                  variant="outline" 
                                  className="capitalize"
                                  style={{ 
                                    borderColor: index % 2 === 0 ? '#1e40af' : '#eab308',
                                    color: index % 2 === 0 ? '#1e40af' : '#eab308'
                                  }}
                                >
                                  <IconComponent className="h-3 w-3 mr-1" />
                                  {categories.find(c => c.id === section.category)?.name || section.category}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {section.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
