"use client";

import { Bell, ExternalLink, Calendar } from 'lucide-react';

export function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "New OSHA Requirements Integrated",
      content: "Updated Workplace Safety course now includes new OSHA requirements effective September 2025. All associates should complete the updated modules.",
      date: "August 20, 2025",
      priority: "high",
      link: "/courses/workplace-safety"
    },
    {
      id: 2,
      title: "HazMat Certification Reminder",
      content: "Annual HazMat recertification is due for all shipping and warehouse personnel. Please complete by the deadline to maintain compliance.",
      date: "August 15, 2025",
      priority: "medium",
      link: "/courses/hazmat-certification"
    },
    {
      id: 3,
      title: "System Maintenance Scheduled",
      content: "The LMS will undergo scheduled maintenance on August 30, 2025 from 2:00 AM - 4:00 AM EST. Plan your training sessions accordingly.",
      date: "August 12, 2025",
      priority: "low",
      link: null
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-[--color-state-error] bg-red-50';
      case 'medium':
        return 'border-[--color-state-warning] bg-yellow-50';
      default:
        return 'border-[--color-state-info] bg-blue-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const baseClasses = "w-5 h-5";
    switch (priority) {
      case 'high':
        return <Bell className={`${baseClasses} text-[--color-state-error]`} />;
      case 'medium':
        return <Bell className={`${baseClasses} text-[--color-state-warning]`} />;
      default:
        return <Bell className={`${baseClasses} text-[--color-state-info]`} />;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[--color-fg-primary] mb-4">
            Latest Updates
          </h2>
          <p className="text-xl text-[--color-fg-secondary]">
            Stay informed about important training updates and system announcements.
          </p>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className={`border-l-4 rounded-lg p-6 transition-all duration-200 hover:shadow-md ${getPriorityColor(announcement.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getPriorityIcon(announcement.priority)}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[--color-fg-primary] mb-2">
                      {announcement.title}
                    </h3>
                    
                    <p className="text-[--color-fg-secondary] mb-3 leading-relaxed">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[--color-fg-muted] text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {announcement.date}
                      </div>
                      
                      {announcement.link && (
                        <button className="inline-flex items-center text-[--color-accent-cool] hover:text-[--color-accent-cool-600] font-medium text-sm transition-colors">
                          Learn More
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Announcements */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-3 text-[--color-accent-cool] hover:text-[--color-accent-cool-600] font-semibold transition-colors">
            View All Announcements
          </button>
        </div>
      </div>
    </section>
  );
}
