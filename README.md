# SpecChem Safety Training Platform

A comprehensive Learning Management System (LMS) for industrial chemical manufacturing safety training.

## 🚀 Quick Start

```bash
# Clone repository
git clone [repository-url]
cd specchem-safety

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your values

# Set up database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Setup Guide](./docs/SETUP.md)** - Complete development setup
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[API Documentation](./docs/API.md)** - API endpoints and usage
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - System architecture

### Implementation Plans
Active technical implementation plans:
- [Documentation Management Standardization](./docs/plans/documentation-management-standardization.md)
- [Environment Deployment Standardization](./docs/plans/environment-deployment-standardization.md)
- [Testing Infrastructure Standardization](./docs/plans/testing-infrastructure-standardization.md)

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run docs:audit   # Audit documentation
npm run docs:maintain # Check documentation health
```

### Database Operations
```bash
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:verify    # Verify database setup
```

## 🏗️ Architecture

- **Frontend:** Next.js 15 with React 19
- **Backend:** Supabase (PostgreSQL + Auth)
- **ORM:** Drizzle ORM
- **Validation:** Zod schemas
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 📋 Features

- **Multi-tenant Architecture:** Plant-based tenant isolation
- **Role-based Access Control:** HR Admin, Dev Admin, Plant Manager, Employee
- **Learning Management:** Course enrollment, progress tracking, certifications
- **Analytics:** Comprehensive reporting and analytics
- **Multi-language Support:** English and Spanish

## 🔒 Security

- **Row-Level Security:** Database-level tenant isolation
- **Authentication:** Supabase Auth with JWT tokens
- **Authorization:** Multi-level role-based access control
- **Data Validation:** Runtime validation with Zod schemas

## 📞 Support

For technical support or questions:
- **Documentation:** See [`docs/`](./docs/) directory
- **Issues:** Create GitHub issues for bugs or feature requests
- **Development:** Follow implementation plans in [`docs/plans/`](./docs/plans/)

---

*Built for SpecChem - Industrial Chemical Manufacturing Safety Training*

