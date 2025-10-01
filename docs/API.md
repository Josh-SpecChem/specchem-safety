# API Documentation

**Date:** 2025-01-10  
**Purpose:** API endpoints and usage documentation  
**Status:** Complete  
**Audience:** Developers  

## API Overview

The SpecChem Safety Training Platform provides RESTful APIs for managing users, courses, enrollments, and progress tracking.

## Authentication

All API endpoints require authentication using Supabase JWT tokens.

### Headers
```bash
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## User Management

### Get User Profile
```bash
GET /api/user/profile
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "employee",
  "plant_id": "uuid",
  "created_at": "2025-01-10T00:00:00Z"
}
```

## Course Management

### List Courses
```bash
GET /api/courses
```

**Response:**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Safety Training Course",
      "description": "Basic safety training",
      "duration": 60,
      "is_active": true
    }
  ]
}
```

### Get Course Details
```bash
GET /api/courses/{id}
```

## Enrollment Management

### Enroll in Course
```bash
POST /api/enrollments
```

**Request Body:**
```json
{
  "course_id": "uuid",
  "user_id": "uuid"
}
```

### Get User Enrollments
```bash
GET /api/enrollments?user_id={uuid}
```

## Progress Tracking

### Update Progress
```bash
POST /api/progress
```

**Request Body:**
```json
{
  "enrollment_id": "uuid",
  "progress_percentage": 75,
  "completed_modules": ["module1", "module2"]
}
```

### Get Progress
```bash
GET /api/progress?enrollment_id={uuid}
```

## Admin APIs

### User Management
```bash
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

### Course Management
```bash
GET /api/admin/courses
POST /api/admin/courses
PUT /api/admin/courses/{id}
DELETE /api/admin/courses/{id}
```

### Analytics
```bash
GET /api/admin/analytics
GET /api/admin/reports
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details"
}
```

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP

## Testing

Use the test endpoints for development:
```bash
GET /api/test/comprehensive
GET /api/test/drizzle-zod
```
