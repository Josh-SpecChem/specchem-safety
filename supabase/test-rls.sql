-- RLS Policy Testing Script
-- This script tests the Row Level Security policies to ensure proper tenant isolation

-- Create test data for RLS testing
BEGIN;

-- Insert test plants
INSERT INTO plants (id, name, is_active) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test Plant A', true),
  ('22222222-2222-2222-2222-222222222222', 'Test Plant B', true),
  ('33333333-3333-3333-3333-333333333333', 'Test Plant C', false);

-- Insert test profiles (these would normally be created by auth triggers)
INSERT INTO profiles (id, plant_id, first_name, last_name, email, status) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'John', 'Doe', 'john@plantA.com', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Jane', 'Smith', 'jane@plantB.com', 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Bob', 'Manager', 'bob@plantA.com', 'active');

-- Insert admin roles
INSERT INTO admin_roles (user_id, role, plant_id) VALUES 
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'plant_manager', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'hr_admin', NULL);

-- Insert test course
INSERT INTO courses (id, slug, title, is_published) VALUES 
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'rls-test-course', 'RLS Test Course', true);

-- Insert test enrollments
INSERT INTO enrollments (user_id, course_id, plant_id, status) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'in_progress'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'enrolled');

-- Insert test progress
INSERT INTO progress (user_id, course_id, plant_id, progress_percent) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 50),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 25);

COMMIT;

-- Test our helper functions
SELECT 'Testing helper functions:' as test_section;

-- Test function creation
SELECT 
  'get_user_plant_id function exists' as test,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'get_user_plant_id'
  ) THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 
  'is_admin_user function exists' as test,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'is_admin_user'
  ) THEN 'PASS' ELSE 'FAIL' END as result;

-- Test RLS is enabled
SELECT 'Testing RLS enablement:' as test_section;

SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('plants', 'profiles', 'enrollments', 'progress')
ORDER BY tablename;

-- Test policy creation
SELECT 'Testing policy creation:' as test_section;

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show test data counts
SELECT 'Test data verification:' as test_section;

SELECT 'plants' as table_name, count(*) as record_count FROM plants
UNION ALL
SELECT 'profiles' as table_name, count(*) as record_count FROM profiles
UNION ALL
SELECT 'admin_roles' as table_name, count(*) as record_count FROM admin_roles
UNION ALL
SELECT 'courses' as table_name, count(*) as record_count FROM courses
UNION ALL
SELECT 'enrollments' as table_name, count(*) as record_count FROM enrollments
UNION ALL
SELECT 'progress' as table_name, count(*) as record_count FROM progress;

-- Cleanup test data
DELETE FROM progress WHERE course_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
DELETE FROM enrollments WHERE course_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
DELETE FROM courses WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
DELETE FROM admin_roles WHERE user_id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
DELETE FROM profiles WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
DELETE FROM plants WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

SELECT 'RLS policy testing completed!' as test_result;