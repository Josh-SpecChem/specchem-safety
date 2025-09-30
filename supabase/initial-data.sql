-- Initial Data Setup for SpecChem Safety Training Database
-- Phase 3: Seed database with essential data for ebook/ and ebook-spanish/ courses

BEGIN;

-- Insert initial plants (SpecChem locations)
INSERT INTO plants (id, name, is_active) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Columbus, OH - Corporate', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Atlanta, GA', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Denver, CO', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Seattle, WA', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Phoenix, AZ', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'Dallas, TX', true),
  ('550e8400-e29b-41d4-a716-446655440007', 'Chicago, IL', true),
  ('550e8400-e29b-41d4-a716-446655440008', 'Miami, FL', true)
ON CONFLICT (name) DO NOTHING;

-- Insert the primary courses (ebook and ebook-spanish)
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

COMMIT;

-- Display seeded data
SELECT 'Plants seeded:' as info;
SELECT name, is_active FROM plants ORDER BY name;

SELECT 'Courses seeded:' as info;
SELECT slug, title, is_published FROM courses ORDER BY slug;