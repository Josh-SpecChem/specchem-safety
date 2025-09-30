#!/bin/bash

# 🚀 SpecChem Safety Training - Deployment Readiness Checker
# This script verifies the application is ready for production deployment

echo "🔍 Starting deployment readiness check..."
echo "========================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Error counter
ERRORS=0
WARNINGS=0

# Function to print status
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "✅ ${GREEN}$1${NC}"
    else
        echo -e "❌ ${RED}$1${NC}"
        ((ERRORS++))
    fi
}

print_warning() {
    echo -e "⚠️  ${YELLOW}$1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "ℹ️  ${BLUE}$1${NC}"
}

echo ""
echo "1. 📦 Checking Dependencies..."
echo "------------------------------"

# Check if package.json exists
if [ -f "package.json" ]; then
    print_status "package.json exists" 0
else
    print_status "package.json missing" 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status "node_modules directory exists" 0
else
    print_warning "node_modules missing - run 'npm install'"
fi

echo ""
echo "2. 🔧 Build System Check..."
echo "-----------------------------"

# Check TypeScript compilation
echo "Checking TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    print_status "TypeScript compilation successful" 0
else
    print_warning "TypeScript compilation has issues"
fi

# Check Next.js build
echo "Running Next.js build..."
if npm run build > /dev/null 2>&1; then
    print_status "Next.js build successful" 0
else
    print_status "Next.js build failed" 1
fi

echo ""
echo "3. 📁 Critical Files Check..."
echo "------------------------------"

# Check for critical configuration files
files=(
    ".env.local"
    "next.config.ts"
    "tailwind.config.ts"
    "drizzle.config.ts"
    "middleware.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists" 0
    else
        print_warning "$file missing"
    fi
done

echo ""
echo "4. 🔐 Environment Variables Check..."
echo "------------------------------------"

if [ -f ".env.local" ]; then
    print_status ".env.local found" 0
    
    # Check for critical environment variables
    env_vars=(
        "DATABASE_URL"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
    )
    
    for var in "${env_vars[@]}"; do
        if grep -q "^$var=" .env.local; then
            print_status "$var is set" 0
        else
            print_warning "$var not found in .env.local"
        fi
    done
else
    print_status ".env.local missing - create from .env.example" 1
fi

echo ""
echo "5. 🗄️ Database Configuration..."
echo "--------------------------------"

# Check if Drizzle config exists
if [ -f "drizzle.config.ts" ]; then
    print_status "Drizzle configuration exists" 0
else
    print_warning "Drizzle configuration missing"
fi

# Check if migrations exist
if [ -d "drizzle" ] && [ "$(ls -A drizzle)" ]; then
    print_status "Database migrations exist" 0
else
    print_warning "Database migrations missing"
fi

echo ""
echo "6. 🧪 Application Structure..."
echo "-------------------------------"

# Check critical directories
dirs=(
    "src/app"
    "src/components"
    "src/lib"
    "src/hooks"
    "public"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_status "$dir directory exists" 0
    else
        print_warning "$dir directory missing"
    fi
done

echo ""
echo "7. 🔗 API Endpoints Check..."
echo "-----------------------------"

# Check for API directories
api_dirs=(
    "src/app/api/admin"
    "src/app/api/courses"
    "src/app/api/progress"
    "src/app/api/user"
)

for dir in "${api_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_status "$dir exists" 0
    else
        print_warning "$dir missing"
    fi
done

echo ""
echo "8. 🏗️ Admin Interface Check..."
echo "-------------------------------"

# Check for admin pages
admin_pages=(
    "src/app/admin/page.tsx"
    "src/app/admin/users/page.tsx"
    "src/app/admin/courses/page.tsx"
    "src/app/admin/analytics/page.tsx"
    "src/app/admin/reports/page.tsx"
)

for page in "${admin_pages[@]}"; do
    if [ -f "$page" ]; then
        print_status "$(basename $page) exists" 0
    else
        print_warning "$(basename $page) missing"
    fi
done

echo ""
echo "9. 🎨 UI Components Check..."
echo "-----------------------------"

# Check for critical UI components
components=(
    "src/components/ui/button.tsx"
    "src/components/ui/card.tsx"
    "src/components/ui/input.tsx"
    "src/components/ProtectedRoute.tsx"
)

for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        print_status "$(basename $component) exists" 0
    else
        print_warning "$(basename $component) missing"
    fi
done

echo ""
echo "10. 🔒 Authentication System..."
echo "--------------------------------"

# Check authentication files
auth_files=(
    "src/contexts/AuthContext.tsx"
    "src/lib/supabase/client.ts"
    "src/lib/supabase/server.ts"
    "src/app/login/page.tsx"
    "src/app/signup/page.tsx"
)

for file in "${auth_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$(basename $file) exists" 0
    else
        print_warning "$(basename $file) missing"
    fi
done

echo ""
echo "========================================"
echo "📊 DEPLOYMENT READINESS SUMMARY"
echo "========================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "🎉 ${GREEN}READY FOR DEPLOYMENT!${NC}"
    echo -e "✅ ${GREEN}No critical errors found${NC}"
    
    if [ $WARNINGS -eq 0 ]; then
        echo -e "✅ ${GREEN}No warnings${NC}"
        echo -e "🚀 ${GREEN}Your application is deployment-ready!${NC}"
    else
        echo -e "⚠️  ${YELLOW}$WARNINGS warnings found${NC}"
        echo -e "📝 ${YELLOW}Review warnings above but deployment can proceed${NC}"
    fi
else
    echo -e "🚫 ${RED}NOT READY FOR DEPLOYMENT${NC}"
    echo -e "❌ ${RED}$ERRORS critical errors found${NC}"
    echo -e "⚠️  ${YELLOW}$WARNINGS warnings found${NC}"
    echo -e "🔧 ${RED}Please fix the errors above before deploying${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "==============="

if [ $ERRORS -eq 0 ]; then
    echo "1. Create a feature branch: git checkout -b feature/production-ready"
    echo "2. Commit all changes: git add . && git commit -m 'feat: production-ready build'"
    echo "3. Push to GitHub: git push origin feature/production-ready"
    echo "4. Set up staging environment for testing"
    echo "5. Deploy to production after staging approval"
else
    echo "1. Fix all critical errors listed above"
    echo "2. Run this script again: ./deployment-check.sh"
    echo "3. Ensure all tests pass: npm test (if tests exist)"
    echo "4. Review the DEPLOYMENT_STRATEGY.md guide"
fi

echo ""
echo "📚 Documentation:"
echo "=================="
echo "• Deployment Strategy: ./DEPLOYMENT_STRATEGY.md"
echo "• Auth & Admin Checklist: ./docs/AUTH_ADMIN_CHECKLIST.md"
echo "• Database Verification: ./DRIZZLE_ZOD_VERIFICATION.md"

exit $ERRORS