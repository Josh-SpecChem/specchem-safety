"use client";

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[--color-fg-primary] text-[--color-fg-inverse] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[--color-brand-primary] rounded-md flex items-center justify-center text-white font-bold text-lg">
                SC
              </div>
              <span className="ml-2 text-xl font-semibold">
                SpecChem LMS
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md leading-relaxed">
              Empowering SpecChem professionals through comprehensive training programs 
              focused on safety, compliance, and operational excellence.
            </p>
            <p className="text-sm text-gray-400">
              © {currentYear} SpecChem. All Rights Reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                href="/courses" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Courses
              </Link>
              <Link 
                href="/progress" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                My Progress
              </Link>
              <Link 
                href="/resources" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Resources
              </Link>
              <Link 
                href="/support" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Legal</h3>
            <div className="space-y-2">
              <Link 
                href="/about" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                About SpecChem
              </Link>
              <Link 
                href="/privacy" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/accessibility" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 sm:mb-0">
              Professional training platform for industrial safety and compliance.
            </p>
            <div className="flex space-x-6">
              <Link 
                href="/help" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Help Center
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
