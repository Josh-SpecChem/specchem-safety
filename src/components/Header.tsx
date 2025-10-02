"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}` 
    : user?.email?.split('@')[0] || 'User';
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-brand-primary rounded-md flex items-center justify-center text-white font-bold text-lg">
                SC
              </div>
              <span className="ml-2 text-xl font-semibold text-fg-primary">
                SpecChem LMS
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-fg-primary hover:text-brand-primary font-medium transition-colors"
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  href="/courses" 
                  className="text-fg-secondary hover:text-brand-primary font-medium transition-colors"
                >
                  Courses
                </Link>
                <Link 
                  href="/progress" 
                  className="text-fg-secondary hover:text-brand-primary font-medium transition-colors"
                >
                  My Progress
                </Link>
                <Link 
                  href="/resources" 
                  className="text-fg-secondary hover:text-brand-primary font-medium transition-colors"
                >
                  Resources
                </Link>
                {profile && (profile as any)?.adminRoles?.some((role: any) => ['hr_admin', 'dev_admin'].includes(role.role)) && (
                  <Link 
                    href="/admin" 
                    className="text-fg-secondary hover:text-brand-primary font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Menu or Login */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-fg-secondary hover:text-fg-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-bg-elev2 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="hidden md:block font-medium">{displayName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-fg-secondary hover:bg-bg-elev2 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center px-4 py-2 text-fg-secondary hover:bg-bg-elev2 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-fg-secondary hover:bg-bg-elev2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link 
                href="/login"
                className="bg-brand-primary text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
