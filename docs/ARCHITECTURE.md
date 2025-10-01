# System Architecture Overview

**Date:** 2025-01-10  
**Purpose:** System architecture documentation  
**Status:** Complete  
**Audience:** Technical Leads  

## Architecture Overview

The SpecChem Safety Training Platform is built as a modern, scalable web application using Next.js 15 with React 19, deployed on Vercel with Supabase as the backend.

## Technology Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **State Management:** React Context + Custom Hooks
- **Validation:** Zod schemas

### Backend
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Drizzle ORM
- **Authentication:** Supabase Auth
- **API:** Next.js API Routes

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Vercel        │    │   Supabase      │
│   (Browser)     │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Multi-Tenant Architecture

### Tenant Isolation
- **Plant-based Tenants:** Each plant is a separate tenant
- **Row-Level Security:** Database-level tenant isolation
- **Role-based Access:** Multi-level authorization system

### User Roles
1. **HR Admin:** Full system access
2. **Dev Admin:** Development and testing access
3. **Plant Manager:** Plant-specific management
4. **Employee:** Basic user access

## Database Schema

### Core Entities
- **Users:** User accounts and profiles
- **Plants:** Tenant organizations
- **Courses:** Training content
- **Modules:** Course components
- **Enrollments:** User-course relationships
- **Progress:** Learning progress tracking

### Relationships
- Users belong to Plants (tenant isolation)
- Courses contain Modules
- Users enroll in Courses
- Progress tracks Enrollment completion

## Security Architecture

### Authentication Flow
1. User logs in via Supabase Auth
2. JWT token issued with user claims
3. Token validated on each API request
4. User context established for RLS

### Authorization Layers
1. **API Level:** Route protection and validation
2. **Database Level:** Row-Level Security policies
3. **UI Level:** Component-level access control

## Performance Considerations

### Caching Strategy
- **Static Generation:** Next.js SSG for public pages
- **API Caching:** Response caching for frequently accessed data
- **Database Optimization:** Indexed queries and connection pooling

### Scalability
- **Horizontal Scaling:** Vercel auto-scaling
- **Database Scaling:** Supabase managed scaling
- **CDN Distribution:** Global edge network

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies
3. Configure environment variables
4. Run database migrations
5. Start development server

### Deployment Pipeline
1. Code pushed to main branch
2. Vercel automatically builds and deploys
3. Database migrations run automatically
4. Health checks verify deployment

## Monitoring and Observability

### Application Monitoring
- **Performance:** Vercel Analytics
- **Errors:** Built-in error tracking
- **Logs:** Centralized logging system

### Database Monitoring
- **Query Performance:** Supabase dashboard
- **Connection Pooling:** Automatic management
- **Backup:** Automated daily backups

## Security Best Practices

### Data Protection
- **Encryption:** All data encrypted in transit and at rest
- **RLS Policies:** Database-level access control
- **Input Validation:** Zod schema validation
- **SQL Injection:** ORM protection

### Access Control
- **JWT Tokens:** Secure authentication
- **Role-based Access:** Granular permissions
- **Session Management:** Secure session handling
- **CORS Configuration:** Proper cross-origin policies

## Future Considerations

### Scalability Improvements
- **Microservices:** Potential service decomposition
- **Caching Layer:** Redis for session management
- **CDN Optimization:** Advanced caching strategies

### Feature Enhancements
- **Real-time Updates:** WebSocket integration
- **Mobile App:** React Native implementation
- **Analytics:** Advanced reporting and insights
