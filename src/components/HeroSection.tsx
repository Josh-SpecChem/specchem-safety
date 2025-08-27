"use client";

import { ArrowRight, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-bg-base via-slate-50 to-blue-50 py-16 sm:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-fg-primary leading-tight mb-6">
          Empowering Your Work Through{' '}
          <span className="text-brand-primary">Knowledge & Compliance</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-fg-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
          Your gateway to essential training on DOT-regulated materials, safety, and SpecChem operations.
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="inline-flex items-center px-6 py-3 bg-brand-primary hover:bg-brand-primary-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <BookOpen className="w-5 h-5 mr-2" />
            Start Training
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button className="inline-flex items-center px-6 py-3 bg-white hover:bg-bg-elev2 text-fg-primary font-semibold rounded-lg border-2 border-gray-200 hover:border-brand-primary transition-all duration-200">
            Browse All Courses
          </button>
        </div>
        
        {/* Animated Elements */}
        <div className="mt-16 relative">
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Connection nodes representing learning network */}
            <div className="w-3 h-3 bg-brand-primary rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-accent-cool rounded-full animate-pulse delay-300"></div>
            <div className="w-2 h-2 bg-state-success rounded-full animate-pulse delay-700"></div>
            <div className="w-1 h-1 bg-brand-primary rounded-full animate-pulse delay-1000"></div>
            <div className="w-3 h-3 bg-accent-cool rounded-full animate-pulse delay-500"></div>
          </div>
          
          {/* Connection lines */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="border-t border-dashed border-gray-300 opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
