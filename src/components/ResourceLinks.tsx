"use client";

import { FileText, Package, BookOpen, HelpCircle } from 'lucide-react';

export function ResourceLinks() {
  const resources = [
    {
      id: 1,
      title: "Job Aids & Quick Guides",
      description: "Downloadable reference materials and step-by-step guides for daily operations.",
      icon: <FileText className="w-6 h-6" />,
      link: "/resources/job-aids",
      color: "text-[--color-accent-cool] bg-blue-50"
    },
    {
      id: 2,
      title: "UN Packaging Codes Reference",
      description: "Complete database of UN packaging codes and specifications for hazardous materials.",
      icon: <Package className="w-6 h-6" />,
      link: "/resources/un-codes",
      color: "text-[--color-brand-primary] bg-orange-50"
    },
    {
      id: 3,
      title: "Closing Instructions Repository",
      description: "Detailed closing procedures and technical specifications for all container types.",
      icon: <BookOpen className="w-6 h-6" />,
      link: "/resources/closing-instructions",
      color: "text-[--color-state-success] bg-green-50"
    },
    {
      id: 4,
      title: "Support",
      description: "Get help with technical issues, training questions, or system navigation.",
      icon: <HelpCircle className="w-6 h-6" />,
      link: "/support",
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <section className="py-16 bg-[--color-bg-elev2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[--color-fg-primary] mb-4">
            Quick Access Resources
          </h2>
          <p className="text-xl text-[--color-fg-secondary] max-w-2xl mx-auto">
            Essential tools and references to support your work and training objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <button
              key={resource.id}
              className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02] text-left w-full"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-lg mb-4 ${resource.color} group-hover:scale-110 transition-transform duration-200`}>
                {resource.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-[--color-fg-primary] mb-2 group-hover:text-[--color-brand-primary] transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-[--color-fg-secondary] text-sm leading-relaxed">
                {resource.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-4 flex items-center text-[--color-accent-cool] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Access Resource</span>
                <svg className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Help Text */}
        <div className="text-center mt-12">
          <p className="text-[--color-fg-muted] text-sm">
            Can&apos;t find what you&apos;re looking for? 
            <button className="text-[--color-accent-cool] hover:text-[--color-accent-cool-600] ml-1 font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
