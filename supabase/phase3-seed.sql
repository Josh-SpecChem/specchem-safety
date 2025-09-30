-- Quick manual seeding for Phase 3
-- Run this to seed the primary data for ebook/ and ebook-spanish/

-- Insert plants if they don't exist
INSERT INTO plants (id, name, is_active, created_at, updated_at) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Columbus, OH - Corporate', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Atlanta, GA', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Denver, CO', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'Seattle, WA', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert primary courses
INSERT INTO courses (id, slug, title, version, is_published, created_at, updated_at) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'function-specific-hazmat-training',
    'Function-Specific HazMat Training',
    '1.0',
    true,
    NOW(),
    NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002', 
    'function-specific-hazmat-training-spanish',
    'Capacitación Específica de HazMat por Función',
    '1.0',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Verify seeding
SELECT 'Seeded Plants:' as section;
SELECT name, is_active FROM plants ORDER BY name;

SELECT 'Seeded Courses:' as section;
SELECT slug, title, is_published FROM courses ORDER BY slug;

SELECT 'Phase 3 seeding completed!' as status;