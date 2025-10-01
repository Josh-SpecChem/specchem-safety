# Understanding Supabase Authentication: A Comprehensive Guide

**Date:** 2025-01-10  
**Purpose:** Technical reference  
**Status:** Complete  
**Audience:** Technical  

# Understanding Supabase Authentication: A Comprehensive Guide

## Table of Contents
1. [What is Supabase Auth?](#what-is-supabase-auth)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema & Tables](#database-schema--tables)
4. [JWT Tokens: The Heart of Authentication](#jwt-tokens-the-heart-of-authentication)
5. [Row Level Security (RLS)](#row-level-security-rls)
6. [Authentication Methods](#authentication-methods)
7. [Sessions & State Management](#sessions--state-management)
8. [Next.js Integration](#nextjs-integration)
9. [Security Considerations](#security-considerations)
10. [Best Practices](#best-practices)

---

## What is Supabase Auth?

Supabase Auth is a complete authentication system built on top of PostgreSQL that handles both **authentication** (verifying who users are) and **authorization** (controlling what they can access). Think of it as a modern, developer-friendly alternative to services like Firebase Auth or Auth0, but with the power of a full PostgreSQL database behind it.

### Key Concepts:
- **Authentication**: "Are you who you say you are?" (login/signup)
- **Authorization**: "What are you allowed to do?" (permissions)
- **Session Management**: Keeping users logged in across requests
- **Database Integration**: Auth data lives in your actual database, not a separate service

---

## Architecture Overview

Supabase Auth follows a 4-layer architecture:

### 1. Client Layer (Your App)
This is where your frontend or backend code lives. Could be:
- Browser JavaScript (React, Vue, etc.)
- Server-side code (Next.js API routes, Node.js)
- Mobile apps (React Native, Flutter)
- Desktop applications

### 2. Kong API Gateway
A reverse proxy that handles routing and some security features. You don't interact with this directly.

### 3. Auth Service (GoTrue)
The actual authentication server - a Go application that:
- Issues and validates JWT tokens
- Handles password verification
- Manages OAuth flows with external providers
- Communicates with your database

### 4. PostgreSQL Database
Your actual database with a special `auth` schema that stores:
- User accounts
- Sessions
- Identity information
- Audit logs

**Key Insight**: Unlike many auth services, your user data lives in YOUR database, not a separate service. This means you can:
- Query user data directly with SQL
- Create complex relationships between users and your app data
- Use database triggers and functions
- Have full control over your data

---

## Database Schema & Tables

When you create a Supabase project, it automatically creates an `auth` schema with several tables:

### Core Tables:

#### `auth.users`
The main user table containing:
```sql
-- Simplified structure
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  encrypted_password VARCHAR,
  email_confirmed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  raw_app_meta_data JSONB,  -- Data you control (roles, permissions)
  raw_user_meta_data JSONB, -- Data users can modify (profile info)
  -- ... many other fields
);
```

#### `auth.identities`
Stores different ways a user can authenticate:
```sql
-- A user might have multiple identities (email + Google + GitHub)
CREATE TABLE auth.identities (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  provider TEXT, -- 'email', 'google', 'github', etc.
  identity_data JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### `auth.sessions`
Active user sessions:
```sql
CREATE TABLE auth.sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  factor_id UUID,
  aal TEXT -- Authentication Assurance Level (aal1, aal2 for MFA)
);
```

### Connecting to Your App Data

The magic happens when you connect auth data to your application tables:

```sql
-- Example: User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Why This Matters**: Your user data isn't trapped in a separate auth service. It's real PostgreSQL data you can query, join, and manipulate like any other data.

---

## JWT Tokens: The Heart of Authentication

JWT (JSON Web Token) is how Supabase manages authentication state. Understanding JWTs is crucial to understanding how Supabase auth works.

### JWT Structure
```
header.payload.signature
```

### Real Example:
```javascript
// Header (Base64 encoded)
{
  "typ": "JWT",
  "alg": "ES256",  // Encryption algorithm
  "kid": "key-id"  // Which key was used to sign this
}

// Payload (Base64 encoded) - This is what matters most
{
  "iss": "https://yourproject.supabase.co/auth/v1", // Who issued this token
  "sub": "123e4567-e89b-12d3-a456-426614174000",    // User ID
  "aud": "authenticated",                            // Audience
  "exp": 1640995200,                                // Expiration timestamp
  "iat": 1640991600,                                // Issued at timestamp
  "role": "authenticated",                          // PostgreSQL role
  "email": "user@example.com",
  "app_metadata": {
    "provider": "email",
    "role": "admin"  // Custom role you define
  },
  "user_metadata": {
    "full_name": "John Doe"  // User-editable data
  }
}
```

### How JWTs Flow Through Your App:

1. **User logs in** → Auth service validates credentials
2. **Auth service creates JWT** → Signs it with a secret key
3. **JWT sent to client** → Usually stored in localStorage or httpOnly cookie
4. **Client sends JWT with requests** → In Authorization header
5. **Supabase validates JWT** → Checks signature and expiration
6. **PostgreSQL uses JWT claims** → For Row Level Security policies

### Key JWT Claims:

- **`sub` (subject)**: The user's UUID - this is how you identify users
- **`role`**: PostgreSQL role (`authenticated`, `anon`, or custom roles)
- **`exp` (expiration)**: When this token expires (typically 1 hour)
- **`app_metadata`**: Data you control (user roles, permissions, team IDs)
- **`user_metadata`**: Data users can modify (profile information)

### JWT Lifecycle:
```javascript
// When user logs in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
// data.session.access_token is the JWT

// JWT automatically included in subsequent requests
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .single(); // JWT sent automatically
```

**Important**: JWTs are short-lived (1 hour by default) and automatically refreshed by Supabase client libraries.

---

## Row Level Security (RLS)

RLS is what makes Supabase auth truly powerful. It's a PostgreSQL feature that lets you write SQL policies that automatically filter data based on who's making the request.

### How RLS Works

Think of RLS policies as automatic `WHERE` clauses added to every query:

```sql
-- Without RLS: Anyone can see any todo
SELECT * FROM todos;

-- With RLS: Automatic filtering based on user
SELECT * FROM todos WHERE user_id = auth.uid();
```

### Setting Up RLS

```sql
-- 1. Enable RLS on your table
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 2. Create policies
CREATE POLICY "Users can see their own todos" ON todos
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### RLS Helper Functions

Supabase provides helpful functions you can use in policies:

#### `auth.uid()`
Returns the current user's ID from the JWT:
```sql
-- Only show records owned by current user
CREATE POLICY "Own records only" ON my_table
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

#### `auth.jwt()`
Returns the full JWT payload for complex logic:
```sql
-- Check if user has admin role
CREATE POLICY "Admins see everything" ON sensitive_table
  FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
  );

-- Check team membership stored in app_metadata
CREATE POLICY "Team members only" ON team_data
  FOR ALL TO authenticated
  USING (
    team_id = ANY(
      SELECT jsonb_array_elements_text(
        auth.jwt() -> 'app_metadata' -> 'teams'
      )::uuid
    )
  );
```

### PostgreSQL Roles

Supabase maps every request to one of two PostgreSQL roles:

- **`anon`**: Unauthenticated requests (no JWT or invalid JWT)
- **`authenticated`**: Valid JWT present

```sql
-- Allow anonymous users to read public posts
CREATE POLICY "Public posts readable by all" ON posts
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- Only authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);
```

### Real-World Example

```sql
-- Multi-tenant app with organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organization_members (
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'member')),
  PRIMARY KEY (org_id, user_id)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only see projects from organizations they belong to
CREATE POLICY "Organization members can see projects" ON projects
  FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Only org admins can create projects
CREATE POLICY "Org admins can create projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

**Why RLS is Amazing**: 
- Security is enforced at the database level
- No way to accidentally bypass security in application code
- Works with any client (web, mobile, direct SQL access)
- Automatically scales with your data

---

## Authentication Methods

Supabase supports multiple authentication methods:

### 1. Email/Password
```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    data: {
      full_name: 'John Doe'  // Goes into user_metadata
    }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
});
```

### 2. Magic Links (Passwordless)
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    shouldCreateUser: true
  }
});
// User gets email with magic link
```

### 3. Social Providers (OAuth)
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/dashboard'
  }
});
```

### 4. Phone/SMS
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
});
```

### 5. Anonymous Users
```javascript
const { data, error } = await supabase.auth.signInAnonymously();
// Creates temporary user, can be converted to permanent later
```

---

## Sessions & State Management

### Session Lifecycle

1. **User authenticates** → Supabase creates session with access_token (JWT) and refresh_token
2. **Access token expires** (1 hour) → Client automatically uses refresh_token to get new access_token
3. **Refresh token expires** (30 days) → User must re-authenticate

### Listening to Auth State Changes

```javascript
// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
  
  switch (event) {
    case 'SIGNED_IN':
      // User just signed in
      console.log('User signed in:', session.user);
      break;
    case 'SIGNED_OUT':
      // User signed out
      console.log('User signed out');
      break;
    case 'TOKEN_REFRESHED':
      // Access token was refreshed
      console.log('Token refreshed');
      break;
    case 'USER_UPDATED':
      // User metadata was updated
      console.log('User updated');
      break;
  }
});
```

### Getting Current User

```javascript
// Get current session (might be stale)
const { data: { session } } = await supabase.auth.getSession();

// Get current user (always fresh, validates with server)
const { data: { user } } = await supabase.auth.getUser();
```

**Important Distinction**:
- `getSession()` returns cached session data (fast, might be stale)
- `getUser()` validates with server (slower, always accurate)

---

## Next.js Integration

### The Challenge: Server vs Client

Next.js apps run code in two places:
- **Client-side**: Browser JavaScript
- **Server-side**: Server Components, API routes, middleware

Traditional auth libraries only work client-side, but with Next.js you need auth to work everywhere.

### Supabase's Solution: `@supabase/ssr`

This package provides different Supabase clients for different contexts:

#### 1. Client Components (Browser)
```javascript
// utils/supabase/client.js
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

#### 2. Server Components & API Routes
```javascript
// utils/supabase/server.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component, can't set cookies
          }
        },
      },
    }
  );
}
```

### How Cookies Work

The key insight is that **JWTs are stored in httpOnly cookies** for server-side access:

1. **User logs in** → JWT stored in browser localStorage AND httpOnly cookie
2. **Server request** → Cookie automatically sent to server
3. **Server Component** → Reads JWT from cookie to identify user
4. **Client hydration** → Client reads JWT from localStorage

### Middleware for Token Refresh

```javascript
// middleware.js
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request) {
  return await updateSession(request);
}
```

Middleware runs on every request and:
1. Checks if JWT in cookie is expired
2. If expired, uses refresh token to get new JWT
3. Updates both cookie and passes refreshed token to route

### Server Component Example

```javascript
// app/dashboard/page.js (Server Component)
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createClient();
  
  // This validates the JWT with Supabase servers
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  // Fetch user's data with RLS automatically applied
  const { data: todos } = await supabase
    .from('todos')
    .select('*');
    
  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <TodoList todos={todos} />
    </div>
  );
}
```

### Client Component Example

```javascript
// components/AddTodo.js (Client Component)
'use client';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function AddTodo() {
  const [text, setText] = useState('');
  const supabase = createClient();
  
  async function addTodo() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    const { error } = await supabase
      .from('todos')
      .insert({
        text,
        user_id: user.id,  // RLS will verify this matches auth.uid()
        completed: false
      });
      
    if (!error) {
      setText('');
    }
  }
  
  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
}
```

---

## Security Considerations

### 1. Never Trust Client Data

```javascript
// ❌ WRONG: Trusting user_id from client
const { error } = await supabase
  .from('todos')
  .insert({
    text: 'New todo',
    user_id: userIdFromClient  // Can be spoofed!
  });

// ✅ CORRECT: Use RLS to enforce ownership
const { error } = await supabase
  .from('todos')
  .insert({
    text: 'New todo',
    user_id: auth.uid()  // Enforced by RLS policy
  });
```

### 2. Always Use getUser() on Server

```javascript
// ❌ WRONG: getSession() can be spoofed
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  // Attacker can fake this
}

// ✅ CORRECT: getUser() validates with server
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  // This is verified authentic
}
```

### 3. Protect Sensitive Operations

```javascript
// Server Action for sensitive operations
async function deleteAccount() {
  'use server';
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  // Additional checks for sensitive operations
  const { data: profile } = await supabase
    .from('profiles')
    .select('can_delete_account')
    .eq('id', user.id)
    .single();
    
  if (!profile?.can_delete_account) {
    throw new Error('Account deletion not allowed');
  }
  
  // Proceed with deletion...
}
```

### 4. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # Safe to expose
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...      # Keep secret!
```

- **ANON_KEY**: Safe to expose publicly, has limited permissions
- **SERVICE_ROLE_KEY**: Never expose, bypasses RLS

---

## Best Practices

### 1. Database Design

```sql
-- Always reference auth.users for user relationships
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Use triggers for automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. RLS Policies

```sql
-- Be specific with roles
CREATE POLICY "policy_name" ON table_name
  FOR SELECT TO authenticated  -- Not just 'public'
  USING (auth.uid() = user_id);

-- Use functions for complex logic
CREATE OR REPLACE FUNCTION user_can_access_project(project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = $1 AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "project_access" ON projects
  FOR ALL TO authenticated
  USING (user_can_access_project(id));
```

### 3. Error Handling

```javascript
async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      // Handle specific error types
      switch (error.message) {
        case 'Invalid login credentials':
          throw new Error('Email or password is incorrect');
        case 'Email not confirmed':
          throw new Error('Please check your email and click the confirmation link');
        default:
          throw new Error('An error occurred during sign in');
      }
    }
    
    return data;
  } catch (error) {
    // Log for debugging but don't expose internal errors
    console.error('Sign in error:', error);
    throw error;
  }
}
```

### 4. Type Safety

```typescript
// Define your database types
interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
        };
        Update: {
          username?: string | null;
          full_name?: string | null;
        };
      };
    };
  };
}

// Use typed client
const supabase = createClient<Database>();

// Now you get full type safety
const { data } = await supabase
  .from('profiles')
  .select('username, full_name')  // TypeScript knows these exist
  .single();
```

### 5. Performance

```javascript
// Batch operations when possible
const { error } = await supabase
  .from('todos')
  .insert([
    { text: 'Todo 1', user_id: user.id },
    { text: 'Todo 2', user_id: user.id },
    { text: 'Todo 3', user_id: user.id }
  ]);

// Use select to limit data transfer
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')  // Don't select content if not needed
  .order('created_at', { ascending: false })
  .limit(10);
```

---

## Conclusion

Supabase Auth is powerful because it's not just an authentication service—it's a complete system that integrates deeply with PostgreSQL. The key insights to remember:

1. **Your auth data lives in your database**, not a separate service
2. **JWTs carry user context** that PostgreSQL can use for authorization
3. **Row Level Security** provides automatic, bulletproof data filtering
4. **Multiple client types** handle the complexity of modern web apps
5. **Security is enforced at the database level**, making it nearly impossible to bypass

By understanding these concepts, you'll be able to build secure, scalable applications with confidence, knowing that your authentication system is both powerful and PostgreSQL-native.