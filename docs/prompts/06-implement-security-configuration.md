# Prompt 06: Implement Security Configuration

**Priority**: P2 - MEDIUM  
**Order**: 6 (Execute Sixth)  
**Purpose**: Add comprehensive security configuration for production security posture  
**Why Sixth**: Enhances security after core functionality is stable and deployed

## Context

The SpecChem Safety Training Platform has basic security measures but lacks comprehensive security configuration for production deployment. Security headers, CSP policies, and rate limiting are missing.

## Task

Implement comprehensive security configuration including headers, policies, rate limiting, and security monitoring.

## Focus Areas

1. **Security headers configuration**
2. **Content Security Policy (CSP)**
3. **Rate limiting implementation**
4. **Security monitoring and logging**

## Success Criteria

- Security headers properly configured
- CSP policies implemented and tested
- Rate limiting active on API endpoints
- Security monitoring and alerting configured

## Required Files to Create/Modify

### Security Configuration

- `src/lib/security/headers.ts` - Security headers configuration
- `src/lib/security/csp.ts` - Content Security Policy
- `src/lib/security/rate-limiting.ts` - Rate limiting implementation
- `src/lib/security/monitoring.ts` - Security monitoring

### Middleware Configuration

- `middleware.ts` - Add security middleware
- `next.config.ts` - Add security headers
- `src/lib/middleware/security.ts` - Security middleware utilities

### Security Monitoring

- `src/app/api/security/audit/route.ts` - Security audit endpoint
- `src/components/admin/SecurityDashboard.tsx` - Security monitoring UI
- `src/lib/security/audit.ts` - Security audit utilities

### Configuration Files

- `src/lib/configuration.ts` - Add security configuration
- `vercel.json` - Add security headers
- `.env.example` - Add security environment variables

## Specific Features to Implement

1. **Security Headers**
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Strict-Transport-Security (HSTS)
   - Referrer-Policy
   - Permissions-Policy

2. **Rate Limiting**
   - API endpoint rate limiting
   - Authentication rate limiting
   - IP-based rate limiting
   - User-based rate limiting
   - Distributed rate limiting

3. **Security Monitoring**
   - Failed authentication attempts
   - Suspicious activity detection
   - Security event logging
   - Threat detection alerts

4. **Input Validation**
   - SQL injection prevention
   - XSS prevention
   - CSRF protection
   - Input sanitization

## Expected Outcome

Comprehensive security configuration protecting against common web vulnerabilities. Production-ready security posture with monitoring and alerting.

## Instructions

1. **Configure Security Headers**

   ```typescript
   // Implement security headers middleware
   - CSP policy configuration
   - Security header implementation
   - Header validation
   ```

2. **Implement Rate Limiting**

   ```typescript
   // Add rate limiting to API routes
   - API endpoint protection
   - Authentication rate limiting
   - IP-based restrictions
   ```

3. **Add Security Monitoring**

   ```typescript
   // Implement security monitoring
   - Failed login tracking
   - Suspicious activity detection
   - Security event logging
   ```

4. **Create Security Dashboard**
   ```typescript
   // Build security monitoring UI
   - Security metrics display
   - Threat detection alerts
   - Security audit logs
   ```

## Validation

```bash
# Test security headers
curl -I http://localhost:3000

# Should return security headers:
# Content-Security-Policy
# X-Frame-Options
# X-Content-Type-Options
# Strict-Transport-Security

# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/api/auth/login; done

# Should rate limit after threshold
```

## Security Headers Configuration

### Content Security Policy

```typescript
const cspPolicy = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "https://supabase.co"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'", "https://supabase.co"],
  "font-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};
```

### Security Headers

```typescript
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
```

## Rate Limiting Configuration

### API Rate Limits

- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute
- Admin endpoints: 50 requests per minute

### IP-based Limits

- Per IP: 1000 requests per hour
- Suspicious IPs: Blocked automatically
- Geographic restrictions: Configurable

## Security Monitoring

### Events to Monitor

- Failed authentication attempts
- Suspicious API usage patterns
- Unusual user behavior
- Security header violations
- Rate limit violations

### Alerting Thresholds

- 5+ failed logins per minute
- 100+ requests per minute from single IP
- Unusual geographic access patterns
- Security policy violations
