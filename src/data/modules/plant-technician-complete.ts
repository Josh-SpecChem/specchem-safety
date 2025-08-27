import { TrainingModuleContent } from '@/types/training'

export const PLANT_TECHNICIAN_MODULES: TrainingModuleContent[] = [
  {
    id: 'plant-safety-protocols',
    title: 'Safety Protocols & Emergency Procedures',
    description: 'Master essential safety protocols, emergency response procedures, and hazard recognition in chemical manufacturing environments.',
    category: 'safety',
    duration: '2 hours',
    difficulty: 'intermediate',
    prerequisites: [],
    certificationEligible: true,
    lastUpdated: '2024-12-19',
    learningObjectives: [
      'Identify and assess common hazards in chemical manufacturing environments',
      'Execute proper lockout/tagout procedures for equipment maintenance',
      'Respond appropriately to chemical spills and emergency situations',
      'Use personal protective equipment correctly and safely',
      'Follow confined space entry procedures and safety protocols',
      'Implement fire safety and evacuation procedures'
    ],
    content: {
      sections: [
        {
          id: 'hazard-recognition',
          title: 'Hazard Recognition & Risk Assessment',
          estimatedReadTime: '25 min',
          content: `
            <div class="training-content">
              <h2 class="text-2xl font-bold text-federal-blue mb-6">Hazard Recognition & Risk Assessment</h2>
              
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div class="flex">
                  <div class="ml-3">
                    <p class="text-yellow-800">
                      <strong>Critical Safety Foundation:</strong> Proper hazard recognition is the first line of defense in preventing workplace accidents and ensuring safe operations in our chemical manufacturing facility.
                    </p>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Types of Workplace Hazards</h3>
              
              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 class="font-semibold text-red-900 mb-3">Chemical Hazards</h4>
                  <ul class="text-red-800 space-y-2">
                    <li>• Toxic substances and vapors</li>
                    <li>• Corrosive materials</li>
                    <li>• Flammable and combustible liquids</li>
                    <li>• Reactive chemicals</li>
                    <li>• Carcinogens and mutagens</li>
                  </ul>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 class="font-semibold text-orange-900 mb-3">Physical Hazards</h4>
                  <ul class="text-orange-800 space-y-2">
                    <li>• Moving machinery and equipment</li>
                    <li>• High pressure systems</li>
                    <li>• Extreme temperatures</li>
                    <li>• Electrical hazards</li>
                    <li>• Noise and vibration</li>
                  </ul>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="font-semibold text-blue-900 mb-3">Environmental Hazards</h4>
                  <ul class="text-blue-800 space-y-2">
                    <li>• Confined spaces</li>
                    <li>• Poor ventilation</li>
                    <li>• Slippery or uneven surfaces</li>
                    <li>• Inadequate lighting</li>
                    <li>• Weather conditions</li>
                  </ul>
                </div>

                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 class="font-semibold text-purple-900 mb-3">Ergonomic Hazards</h4>
                  <ul class="text-purple-800 space-y-2">
                    <li>• Repetitive motions</li>
                    <li>• Heavy lifting and carrying</li>
                    <li>• Awkward postures</li>
                    <li>• Prolonged standing or sitting</li>
                    <li>• Force and vibration exposure</li>
                  </ul>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Risk Assessment Process</h3>
              
              <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div class="grid md:grid-cols-4 gap-4 text-center">
                  <div class="bg-federal-blue text-white p-4 rounded-lg">
                    <div class="text-2xl font-bold mb-2">1</div>
                    <div class="text-sm">IDENTIFY</div>
                  </div>
                  <div class="bg-yale-blue text-white p-4 rounded-lg">
                    <div class="text-2xl font-bold mb-2">2</div>
                    <div class="text-sm">ASSESS</div>
                  </div>
                  <div class="bg-gold text-white p-4 rounded-lg">
                    <div class="text-2xl font-bold mb-2">3</div>
                    <div class="text-sm">CONTROL</div>
                  </div>
                  <div class="bg-green-600 text-white p-4 rounded-lg">
                    <div class="text-2xl font-bold mb-2">4</div>
                    <div class="text-sm">MONITOR</div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="border-l-4 border-federal-blue pl-6">
                  <h4 class="font-semibold text-gray-900 mb-2">Step 1: Identify Hazards</h4>
                  <p class="text-gray-700 mb-2">Systematically examine all aspects of the work environment:</p>
                  <ul class="text-gray-600 space-y-1 ml-4">
                    <li>• Walk through work areas and observe activities</li>
                    <li>• Review incident reports and near-miss events</li>
                    <li>• Consult Safety Data Sheets (SDS) for chemicals</li>
                    <li>• Interview workers about potential hazards</li>
                    <li>• Check maintenance records and equipment logs</li>
                  </ul>
                </div>

                <div class="border-l-4 border-yale-blue pl-6">
                  <h4 class="font-semibold text-gray-900 mb-2">Step 2: Assess Risk Level</h4>
                  <p class="text-gray-700 mb-2">Evaluate the likelihood and severity of potential harm:</p>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-sm font-medium text-gray-900 mb-2">Risk = Likelihood × Severity</div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Likelihood Scale:</strong>
                        <ul class="mt-1 space-y-1">
                          <li>1 - Very Unlikely</li>
                          <li>2 - Unlikely</li>
                          <li>3 - Possible</li>
                          <li>4 - Likely</li>
                          <li>5 - Very Likely</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Severity Scale:</strong>
                        <ul class="mt-1 space-y-1">
                          <li>1 - Minor injury</li>
                          <li>2 - Moderate injury</li>
                          <li>3 - Major injury</li>
                          <li>4 - Severe injury</li>
                          <li>5 - Fatality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-l-4 border-gold pl-6">
                  <h4 class="font-semibold text-gray-900 mb-2">Step 3: Implement Controls</h4>
                  <p class="text-gray-700 mb-2">Apply hierarchy of controls (most to least effective):</p>
                  <div class="space-y-3">
                    <div class="bg-red-50 p-3 rounded border border-red-200">
                      <strong class="text-red-900">Elimination:</strong> 
                      <span class="text-red-800"> Remove the hazard completely</span>
                    </div>
                    <div class="bg-orange-50 p-3 rounded border border-orange-200">
                      <strong class="text-orange-900">Substitution:</strong> 
                      <span class="text-orange-800"> Replace with less hazardous alternative</span>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <strong class="text-yellow-900">Engineering Controls:</strong> 
                      <span class="text-yellow-800"> Ventilation, guards, barriers</span>
                    </div>
                    <div class="bg-blue-50 p-3 rounded border border-blue-200">
                      <strong class="text-blue-900">Administrative Controls:</strong> 
                      <span class="text-blue-800"> Training, procedures, signage</span>
                    </div>
                    <div class="bg-purple-50 p-3 rounded border border-purple-200">
                      <strong class="text-purple-900">PPE:</strong> 
                      <span class="text-purple-800"> Personal protective equipment</span>
                    </div>
                  </div>
                </div>

                <div class="border-l-4 border-green-600 pl-6">
                  <h4 class="font-semibold text-gray-900 mb-2">Step 4: Monitor & Review</h4>
                  <p class="text-gray-700 mb-2">Continuously evaluate effectiveness of controls:</p>
                  <ul class="text-gray-600 space-y-1 ml-4">
                    <li>• Regular safety inspections and audits</li>
                    <li>• Employee feedback and observations</li>
                    <li>• Incident and near-miss tracking</li>
                    <li>• Environmental monitoring results</li>
                    <li>• Review and update risk assessments</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'lockout-tagout',
          title: 'Lockout/Tagout Procedures',
          estimatedReadTime: '20 min',
          content: `
            <div class="training-content">
              <h2 class="text-2xl font-bold text-federal-blue mb-6">Lockout/Tagout (LOTO) Procedures</h2>
              
              <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                  <div class="ml-3">
                    <p class="text-red-800">
                      <strong>CRITICAL SAFETY REQUIREMENT:</strong> Lockout/Tagout procedures are mandatory before any maintenance, repair, or service work on equipment. Failure to follow LOTO can result in serious injury or death.
                    </p>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">LOTO Fundamentals</h3>
              
              <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-semibold text-federal-blue mb-3">What is LOTO?</h4>
                    <p class="text-gray-700 mb-4">
                      Lockout/Tagout is a safety procedure that ensures dangerous machines are properly shut off 
                      and not able to be started up again prior to the completion of maintenance or repair work.
                    </p>
                    <div class="bg-blue-50 p-4 rounded">
                      <strong class="text-blue-900">LOCKOUT:</strong>
                      <p class="text-blue-800 text-sm">Physical restraint of all hazardous energy sources using locks</p>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-federal-blue mb-3">When to Use LOTO?</h4>
                    <ul class="text-gray-700 space-y-2">
                      <li>• Equipment maintenance or repair</li>
                      <li>• Cleaning inside machinery</li>
                      <li>• Removing jams or blockages</li>
                      <li>• Installing or adjusting guards</li>
                      <li>• Any work requiring access to danger zones</li>
                    </ul>
                    <div class="bg-yellow-50 p-4 rounded mt-4">
                      <strong class="text-yellow-900">TAGOUT:</strong>
                      <p class="text-yellow-800 text-sm">Warning labels placed on energy sources to indicate hazard</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Energy Sources to Control</h3>
              
              <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div class="text-3xl mb-2">⚡</div>
                  <h4 class="font-semibold text-yellow-900">Electrical</h4>
                  <p class="text-yellow-800 text-sm">Motors, circuits, capacitors</p>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div class="text-3xl mb-2">🌊</div>
                  <h4 class="font-semibold text-blue-900">Hydraulic</h4>
                  <p class="text-blue-800 text-sm">Pressurized fluids, cylinders</p>
                </div>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div class="text-3xl mb-2">💨</div>
                  <h4 class="font-semibold text-green-900">Pneumatic</h4>
                  <p class="text-green-800 text-sm">Compressed air, gas pressure</p>
                </div>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div class="text-3xl mb-2">🔥</div>
                  <h4 class="font-semibold text-red-900">Thermal</h4>
                  <p class="text-red-800 text-sm">Steam, hot surfaces</p>
                </div>
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div class="text-3xl mb-2">⚙️</div>
                  <h4 class="font-semibold text-purple-900">Mechanical</h4>
                  <p class="text-purple-800 text-sm">Springs, rotating parts</p>
                </div>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div class="text-3xl mb-2">🧪</div>
                  <h4 class="font-semibold text-gray-900">Chemical</h4>
                  <p class="text-gray-800 text-sm">Process chemicals, reactions</p>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">6-Step LOTO Procedure</h3>
              
              <div class="space-y-4">
                <div class="bg-white border-l-4 border-federal-blue rounded-r-lg p-6">
                  <div class="flex items-start">
                    <div class="bg-federal-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Prepare for Shutdown</h4>
                      <ul class="text-gray-700 space-y-1">
                        <li>• Notify affected employees of pending shutdown</li>
                        <li>• Identify all energy sources and controls</li>
                        <li>• Review equipment-specific LOTO procedures</li>
                        <li>• Gather necessary locks, tags, and tools</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="bg-white border-l-4 border-yale-blue rounded-r-lg p-6">
                  <div class="flex items-start">
                    <div class="bg-yale-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Shutdown Equipment</h4>
                      <ul class="text-gray-700 space-y-1">
                        <li>• Follow normal shutdown procedures</li>
                        <li>• Turn off equipment using normal controls</li>
                        <li>• Allow moving parts to come to complete stop</li>
                        <li>• Verify shutdown is complete</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="bg-white border-l-4 border-red-500 rounded-r-lg p-6">
                  <div class="flex items-start">
                    <div class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Isolate Energy Sources</h4>
                      <ul class="text-gray-700 space-y-1">
                        <li>• Locate and operate all energy isolating devices</li>
                        <li>• Disconnect electrical circuits at source</li>
                        <li>• Close valves for pneumatic/hydraulic systems</li>
                        <li>• Block or secure mechanical components</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="bg-white border-l-4 border-yellow-500 rounded-r-lg p-6">
                  <div class="flex items-start">
                    <div class="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Apply Locks and Tags</h4>
                      <ul class="text-gray-700 space-y-1">
                        <li>• Attach personal locks to all isolation devices</li>
                        <li>• Apply warning tags with employee information</li>
                        <li>• Use only your own locks and tags</li>
                        <li>• Ensure locks cannot be removed without key</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="bg-white border-l-4 border-green-500 rounded-r-lg p-6">
                  <div class="flex items-start">
                    <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">5</div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Verify Energy Control</h4>
                      <ul class="text-gray-700 space-y-1">
                        <li>• Test equipment controls to verify isolation</li>
                        <li>• Use appropriate testing equipment</li>
                        <li>• Check for stored energy (springs, capacitors)</li>
                        <li>• Return controls to "off" position after test</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="bg-white border-l-4 border-purple-500 rounded-r-lg p-6">
                  <div class="flex items-start">
                    <div class="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">6</div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Restore Energy</h4>
                      <ul class="text-gray-700 space-y-1">
                        <li>• Ensure work area is clear of personnel</li>
                        <li>• Remove tools and equipment from work area</li>
                        <li>• Remove your locks and tags only</li>
                        <li>• Restore energy sources and test operation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                <h4 class="font-semibold text-red-900 mb-3">Critical LOTO Safety Rules</h4>
                <div class="grid md:grid-cols-2 gap-4">
                  <ul class="text-red-800 space-y-2">
                    <li>• Never remove another person's lock or tag</li>
                    <li>• Use only your assigned locks and tags</li>
                    <li>• Test equipment operation before starting work</li>
                    <li>• Follow equipment-specific procedures</li>
                  </ul>
                  <ul class="text-red-800 space-y-2">
                    <li>• Verify zero energy state before work begins</li>
                    <li>• Keep keys in your possession at all times</li>
                    <li>• Clear work area before restoring energy</li>
                    <li>• Report any LOTO violations immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'emergency-response',
          title: 'Emergency Response Procedures',
          estimatedReadTime: '20 min',
          content: `
            <div class="training-content">
              <h2 class="text-2xl font-bold text-federal-blue mb-6">Emergency Response Procedures</h2>
              
              <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                  <div class="ml-3">
                    <p class="text-red-800">
                      <strong>EMERGENCY CONTACT:</strong> In case of immediate danger to life or property, call 911 first, then notify plant emergency response at ext. 2911.
                    </p>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Types of Emergencies</h3>
              
              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 class="font-semibold text-red-900 mb-3 flex items-center">
                    <span class="mr-2">🔥</span> Fire/Explosion
                  </h4>
                  <ul class="text-red-800 text-sm space-y-1">
                    <li>• Chemical fires</li>
                    <li>• Electrical fires</li>
                    <li>• Equipment overheating</li>
                    <li>• Explosive atmosphere</li>
                  </ul>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 class="font-semibold text-yellow-900 mb-3 flex items-center">
                    <span class="mr-2">🧪</span> Chemical Spill
                  </h4>
                  <ul class="text-yellow-800 text-sm space-y-1">
                    <li>• Acid/base spills</li>
                    <li>• Toxic chemical release</li>
                    <li>• Flammable liquid spill</li>
                    <li>• Gas leak/vapor cloud</li>
                  </ul>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
                    <span class="mr-2">⚕️</span> Medical Emergency
                  </h4>
                  <ul class="text-blue-800 text-sm space-y-1">
                    <li>• Chemical exposure</li>
                    <li>• Traumatic injury</li>
                    <li>• Heat stress/exhaustion</li>
                    <li>• Cardiac/respiratory emergency</li>
                  </ul>
                </div>

                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 class="font-semibold text-purple-900 mb-3 flex items-center">
                    <span class="mr-2">⚡</span> Utility Emergency
                  </h4>
                  <ul class="text-purple-800 text-sm space-y-1">
                    <li>• Power outage</li>
                    <li>• Equipment failure</li>
                    <li>• Pressure system failure</li>
                    <li>• Structural damage</li>
                  </ul>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">General Emergency Response Protocol</h3>
              
              <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div class="text-center mb-4">
                  <div class="text-4xl font-bold text-red-600">RACE</div>
                  <div class="text-gray-600">Remember this emergency acronym</div>
                </div>
                
                <div class="grid md:grid-cols-4 gap-4">
                  <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600 mb-2">R</div>
                    <div class="font-semibold text-red-900">RESCUE</div>
                    <div class="text-sm text-red-800">Remove people from danger</div>
                  </div>
                  <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600 mb-2">A</div>
                    <div class="font-semibold text-orange-900">ALARM</div>
                    <div class="text-sm text-orange-800">Alert others and authorities</div>
                  </div>
                  <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600 mb-2">C</div>
                    <div class="font-semibold text-blue-900">CONTAIN</div>
                    <div class="text-sm text-blue-800">Limit spread if safe to do so</div>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600 mb-2">E</div>
                    <div class="font-semibold text-green-900">EVACUATE</div>
                    <div class="text-sm text-green-800">Leave area if necessary</div>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Chemical Spill Response</h3>
              
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <h4 class="font-semibold text-yellow-900 mb-4">Immediate Response Steps</h4>
                
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
                    <div>
                      <strong class="text-yellow-900">Ensure Personal Safety</strong>
                      <p class="text-yellow-800 text-sm">Move upwind/uphill from spill, avoid vapors, ensure proper PPE</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
                    <div>
                      <strong class="text-yellow-900">Alert Others</strong>
                      <p class="text-yellow-800 text-sm">Warn people in area, activate emergency alarm, call for help</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
                    <div>
                      <strong class="text-yellow-900">Control Source</strong>
                      <p class="text-yellow-800 text-sm">Stop leak if safe to do so - turn valves, right containers</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</div>
                    <div>
                      <strong class="text-yellow-900">Contain Spread</strong>
                      <p class="text-yellow-800 text-sm">Use berms, dikes, or absorbent materials to limit contamination</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">5</div>
                    <div>
                      <strong class="text-yellow-900">Begin Cleanup</strong>
                      <p class="text-yellow-800 text-sm">Only if trained and equipped - follow SDS procedures</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Fire Emergency Response</h3>
              
              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 class="font-semibold text-red-900 mb-3">Fire Classification</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center">
                      <span class="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">A</span>
                      <span class="text-red-800">Ordinary combustibles (wood, paper, fabric)</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">B</span>
                      <span class="text-red-800">Flammable liquids (gasoline, oil, solvents)</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">C</span>
                      <span class="text-red-800">Electrical equipment (motors, panels)</span>
                    </div>
                    <div class="flex items-center">
                      <span class="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">D</span>
                      <span class="text-red-800">Combustible metals (magnesium, sodium)</span>
                    </div>
                  </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="font-semibold text-blue-900 mb-3">PASS Technique</h4>
                  <div class="space-y-3 text-sm">
                    <div class="flex items-start">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1">P</span>
                      <div>
                        <strong class="text-blue-900">PULL</strong>
                        <span class="text-blue-800 block">Pull the safety pin</span>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1">A</span>
                      <div>
                        <strong class="text-blue-900">AIM</strong>
                        <span class="text-blue-800 block">Aim at base of fire</span>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1">S</span>
                      <div>
                        <strong class="text-blue-900">SQUEEZE</strong>
                        <span class="text-blue-800 block">Squeeze the handle</span>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1">S</span>
                      <div>
                        <strong class="text-blue-900">SWEEP</strong>
                        <span class="text-blue-800 block">Sweep side to side</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 mb-4">Evacuation Procedures</h3>
              
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-3">When to Evacuate</h4>
                    <ul class="text-gray-700 space-y-1 text-sm">
                      <li>• Fire/explosion alarm sounds</li>
                      <li>• Large chemical spill or gas leak</li>
                      <li>• Structural damage to building</li>
                      <li>• Bomb threat or security incident</li>
                      <li>• Severe weather warning</li>
                      <li>• Power failure affecting safety systems</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Evacuation Steps</h4>
                    <ol class="text-gray-700 space-y-1 text-sm">
                      <li>1. Stop work immediately</li>
                      <li>2. Shut down equipment if safe to do so</li>
                      <li>3. Assist others who need help</li>
                      <li>4. Use nearest safe exit route</li>
                      <li>5. Go directly to assembly point</li>
                      <li>6. Report to area supervisor</li>
                      <li>7. Remain until all-clear given</li>
                    </ol>
                  </div>
                </div>
                
                <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <strong class="text-blue-900">Primary Assembly Point:</strong> 
                  <span class="text-blue-800">North parking lot by flagpole</span><br>
                  <strong class="text-blue-900">Secondary Assembly Point:</strong> 
                  <span class="text-blue-800">South entrance loading dock area</span>
                </div>
              </div>

              <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                <h4 class="font-semibold text-red-900 mb-3">Critical Emergency Contacts</h4>
                <div class="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong class="text-red-900">Life-threatening Emergency:</strong><br>
                    <span class="text-red-800 text-lg font-bold">911</span>
                  </div>
                  <div>
                    <strong class="text-red-900">Plant Emergency:</strong><br>
                    <span class="text-red-800 text-lg font-bold">ext. 2911</span>
                  </div>
                  <div>
                    <strong class="text-red-900">Security Office:</strong><br>
                    <span class="text-red-800 text-lg font-bold">ext. 2900</span>
                  </div>
                </div>
              </div>
            </div>
          `
        }
      ],
      assessment: {
        id: 'plant-safety-assessment',
        title: 'Safety Protocols & Emergency Procedures Assessment',
        timeLimit: 45,
        passingScore: 80,
        maxAttempts: 3,
        showFeedback: true,
        certificateGeneration: true,
        questions: [
          {
            id: 'hazard-types',
            type: 'multiple-choice',
            question: 'Which of the following is classified as a physical hazard in a chemical plant?',
            options: [
              'Toxic chemical vapors',
              'High pressure pneumatic systems',
              'Carcinogenic substances',
              'Corrosive materials'
            ],
            correctAnswer: '1',
            explanation: 'High pressure pneumatic systems are classified as physical hazards. Toxic vapors, carcinogens, and corrosive materials are all chemical hazards.',
            points: 10,
            difficulty: 'medium'
          },
          {
            id: 'risk-calculation',
            type: 'multiple-choice',
            question: 'In risk assessment, if a hazard has a likelihood rating of 4 and severity rating of 3, what is the risk score?',
            options: [
              '7',
              '12',
              '1.33',
              '0.75'
            ],
            correctAnswer: '1',
            explanation: 'Risk = Likelihood × Severity. In this case: 4 × 3 = 12. This would be considered a high risk requiring immediate attention.',
            points: 10,
            difficulty: 'medium'
          },
          {
            id: 'hierarchy-controls',
            type: 'multiple-choice',
            question: 'According to the hierarchy of controls, which is the MOST effective method for controlling workplace hazards?',
            options: [
              'Personal protective equipment (PPE)',
              'Administrative controls and training',
              'Engineering controls like ventilation',
              'Elimination of the hazard'
            ],
            correctAnswer: '3',
            explanation: 'Elimination is the most effective control method as it completely removes the hazard. PPE is the least effective as it only protects individual workers.',
            points: 10,
            difficulty: 'medium'
          },
          {
            id: 'loto-energy-sources',
            type: 'multiple-choice',
            question: 'Which energy source is NOT typically controlled during LOTO procedures?',
            options: [
              'Electrical energy in motors',
              'Potential energy in compressed springs',
              'Kinetic energy in moving conveyors',
              'Sound energy from equipment noise'
            ],
            correctAnswer: '3',
            explanation: 'Sound energy, while potentially hazardous, is not controlled through LOTO. LOTO focuses on energy sources that can cause equipment to start unexpectedly or release stored energy.',
            points: 10,
            difficulty: 'medium'
          },
          {
            id: 'loto-steps',
            type: 'multiple-choice',
            question: 'What is the correct order of LOTO steps?',
            options: [
              'Shutdown → Isolate → Lock/Tag → Prepare → Verify → Restore',
              'Prepare → Shutdown → Isolate → Lock/Tag → Verify → Restore',
              'Isolate → Shutdown → Prepare → Lock/Tag → Verify → Restore',
              'Prepare → Isolate → Shutdown → Lock/Tag → Verify → Restore'
            ],
            correctAnswer: '1',
            explanation: 'The correct LOTO sequence is: 1) Prepare, 2) Shutdown, 3) Isolate, 4) Lock/Tag, 5) Verify, 6) Restore. This ensures systematic control of hazardous energy.',
            points: 10,
            difficulty: 'medium'
          },
          {
            id: 'loto-rules',
            type: 'scenario',
            question: 'You arrive at work to find a piece of equipment locked out with your coworker\'s lock, but your coworker called in sick. The maintenance work appears complete. What should you do?',
            options: [
              'Cut off the lock since the work is done and production is waiting',
              'Contact your supervisor and wait for proper authorization',
              'Find your coworker\'s spare key and remove the lock',
              'Call your coworker at home and ask for permission'
            ],
            correctAnswer: '1',
            explanation: 'Never remove another person\'s lock or tag under any circumstances. Contact supervision immediately. Only the person who applied the lock can remove it, or follow established procedures for lock removal in their absence.',
            points: 10,
            difficulty: 'hard'
          },
          {
            id: 'emergency-race',
            type: 'multiple-choice',
            question: 'In the RACE emergency protocol, what does the letter "C" stand for?',
            options: [
              'Call for help',
              'Clear the area',
              'Contain the emergency',
              'Check for injuries'
            ],
            correctAnswer: '2',
            explanation: 'In RACE, "C" stands for CONTAIN - limit the spread of the emergency if it\'s safe to do so. This helps prevent the situation from becoming worse.',
            points: 10,
            difficulty: 'easy'
          },
          {
            id: 'spill-response',
            type: 'scenario',
            question: 'You witness a small acid spill in your work area. The spill is about 1 gallon and is not spreading rapidly. What is your FIRST action?',
            options: [
              'Begin cleanup with the nearest absorbent materials',
              'Ensure your personal safety and move to a safe location',
              'Call the fire department immediately',
              'Alert your supervisor by phone'
            ],
            correctAnswer: '1',
            explanation: 'Personal safety is always the first priority. Move to safety, assess the situation, then alert others and begin response if trained and equipped to do so safely.',
            points: 10,
            difficulty: 'hard'
          },
          {
            id: 'fire-extinguisher',
            type: 'multiple-choice',
            question: 'For an electrical fire involving a motor control panel, which type of fire extinguisher should you use?',
            options: [
              'Class A (water-based)',
              'Class B (foam-based)',
              'Class C (CO2 or dry chemical)',
              'Class D (special powder)'
            ],
            correctAnswer: '2',
            explanation: 'Class C extinguishers are designed for electrical fires. Never use water-based (Class A) extinguishers on electrical fires as this can cause electrocution.',
            points: 10,
            difficulty: 'medium'
          },
          {
            id: 'evacuation-procedure',
            type: 'scenario',
            question: 'During an evacuation alarm, you notice a coworker is not responding and appears to be unconscious at their workstation. What should you do?',
            options: [
              'Continue to the assembly point and report the situation there',
              'Stay with the coworker and wait for emergency responders',
              'Attempt to carry the coworker to safety by yourself',
              'Get help from other coworkers to safely move the person'
            ],
            correctAnswer: '3',
            explanation: 'Get immediate help from others to safely move an unconscious person if possible. Don\'t attempt to carry someone alone as this could cause injury to both of you. If unable to move them safely, alert emergency responders immediately.',
            points: 10,
            difficulty: 'hard'
          }
        ]
      },
      resources: [
        {
          id: 'osha-guidelines',
          title: 'OSHA Chemical Plant Safety Guidelines',
          type: 'pdf',
          url: '/resources/osha-chemical-safety.pdf',
          description: 'Comprehensive OSHA guidelines for chemical manufacturing safety',
          downloadable: true
        },
        {
          id: 'loto-checklist',
          title: 'Lockout/Tagout Procedure Checklist',
          type: 'template',
          url: '/resources/loto-checklist.pdf',
          description: 'Step-by-step LOTO procedure checklist for field use',
          downloadable: true
        },
        {
          id: 'emergency-contacts',
          title: 'Emergency Contact Directory',
          type: 'handbook-section',
          url: '/resources/emergency-contacts.pdf',
          description: 'Complete list of emergency contacts and procedures',
          downloadable: false
        }
      ]
    }
  }
]
