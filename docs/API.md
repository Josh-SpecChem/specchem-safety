# API Documentation

**Date:** 2025-01-10  
**Purpose:** API endpoints and usage documentation  
**Status:** Complete  
**Audience:** Developers

## API Overview

The SpecChem Safety Training Platform provides RESTful APIs for managing users, courses, enrollments, and progress tracking. All APIs are implemented using Next.js App Router with standardized response formats and comprehensive type safety.

## Implementation Details

- **Framework:** Next.js 14 App Router
- **Type Safety:** Full TypeScript integration with Zod validation
- **Authentication:** Supabase JWT with unified auth middleware
- **Database:** Drizzle ORM with PostgreSQL
- **Response Format:** Standardized JSON responses with consistent error handling

## Authentication

All API endpoints require authentication using Supabase JWT tokens.

### Headers

```bash
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format

All API endpoints return responses in the following standardized format:

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": {
    "message": string,
    "code": string,
    "details": object
  },
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  },
  "timestamp": string
}
```

## User Management

### Get User Profile

```bash
GET /api/user/profile
```

**Description:** Get the current authenticated user's profile information.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "jobTitle": "Safety Coordinator",
    "status": "active",
    "plantId": "uuid"
  },
  "timestamp": "2025-01-10T00:00:00Z"
}
```

### Update User Profile

```bash
PATCH /api/user/profile
```

**Description:** Update the current authenticated user's profile information.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Senior Safety Coordinator"
}
```

## Course Management

### Get Course Progress

```bash
GET /api/courses/{course}/progress
```

**Description:** Get progress for a specific course for the authenticated user.

**Response:**

```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "userId": "uuid",
    "progressPercent": 75,
    "currentSection": "section-3",
    "lastActiveAt": "2025-01-10T00:00:00Z"
  }
}
```

### Submit Course Questions

```bash
POST /api/courses/{course}/questions
```

**Description:** Submit answers to course questions.

**Request Body:**

```json
{
  "sectionKey": "section-1",
  "questionKey": "question-1",
  "isCorrect": true,
  "responseMeta": {
    "selectedAnswer": "A",
    "timeSpent": 30
  }
}
```

## Progress Tracking

### Get User Progress

```bash
GET /api/progress
```

**Description:** Get comprehensive progress information for the authenticated user across all courses.

**Response:**

```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "id": "uuid",
        "courseId": "uuid",
        "progressPercent": 75,
        "currentSection": "section-3",
        "lastActiveAt": "2025-01-10T00:00:00Z"
      }
    ],
    "user": {
      "id": "uuid",
      "plantId": "uuid"
    }
  }
}
```

## Admin APIs

**Authentication Required:** All admin APIs require `hr_admin`, `dev_admin`, or `plant_manager` role.

### User Management

#### List Users

```bash
GET /api/admin/users
```

**Description:** List all users with filtering and pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50, max: 100)
- `search` (string): Search by name or email
- `plantId` (uuid): Filter by plant
- `status` (enum): Filter by user status (`active`, `suspended`)
- `role` (enum): Filter by admin role

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "jobTitle": "Safety Coordinator",
        "status": "active",
        "plantId": "uuid",
        "plant": {
          "id": "uuid",
          "name": "Columbus, OH"
        },
        "adminRoles": [],
        "enrollments": []
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  }
}
```

#### Create User

```bash
POST /api/admin/users
```

**Description:** Create a new user profile.

**Request Body:**

```json
{
  "id": "uuid",
  "plantId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "jobTitle": "Safety Coordinator"
}
```

#### Update User

```bash
PATCH /api/admin/users
```

**Description:** Update user profile information.

**Request Body:**

```json
{
  "userId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Senior Safety Coordinator"
}
```

### Course Management

#### List Courses

```bash
GET /api/admin/courses
```

**Description:** List all courses with enrollment statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Function-Specific HazMat Training",
        "slug": "hazmat-training",
        "version": "1.0",
        "isPublished": true,
        "totalEnrollments": 150,
        "completedEnrollments": 120,
        "avgProgress": 85,
        "completionRate": 80
      }
    ],
    "statistics": {
      "totalCourses": 2,
      "activeCourses": 2,
      "totalEnrollments": 300,
      "avgCompletionRate": 75
    }
  }
}
```

#### Create Course

```bash
POST /api/admin/courses
```

**Description:** Create a new course.

**Request Body:**

```json
{
  "slug": "new-course",
  "title": "New Safety Course",
  "version": "1.0",
  "isPublished": false
}
```

### Enrollment Management

```bash
GET /api/admin/enrollments
```

**Description:** List enrollments with filtering options.

### Analytics and Reports

```bash
GET /api/admin/analytics
GET /api/admin/reports
```

**Description:** Get comprehensive analytics and generate reports.

## Error Handling

All API endpoints return consistent error responses in the standardized format:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "timestamp": "2025-01-10T00:00:00Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_ERROR`: Authentication required or invalid
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DATABASE_ERROR`: Database operation failed
- `INTERNAL_ERROR`: Unexpected server error

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP

## Testing and Development

### Health Check

```bash
GET /api/health
```

**Description:** Basic health check endpoint.

### Test Endpoints

```bash
GET /api/test/comprehensive
GET /api/test/drizzle-zod
```

**Description:** Development endpoints for testing database and validation integration.

## Implementation Notes

### Type Safety

- All request/response types are defined in `src/types/api.ts`
- Runtime validation using Zod schemas from `src/lib/schemas.ts`
- Database operations use Drizzle ORM with full type safety

### Authentication Middleware

- Unified auth middleware handles JWT validation
- Role-based access control for admin endpoints
- Plant-based data isolation for multi-tenant security

### Database Integration

- All operations use Drizzle ORM for type safety
- Automatic timestamp management
- Row Level Security (RLS) policies enforced

### Response Standardization

- All responses use `RouteUtils.createSuccessResponse()` or similar
- Consistent error handling with `RouteUtils.handleRequest()`
- Automatic request validation and sanitization
