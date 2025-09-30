-- User Profile Creation Trigger
-- Automatically creates a profile when a user signs up through Supabase Auth

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  default_plant_id uuid;
  user_email text;
  first_name text;
  last_name text;
BEGIN
  -- Get default plant (Columbus, OH - Corporate)
  SELECT id INTO default_plant_id 
  FROM plants 
  WHERE name = 'Columbus, OH - Corporate' 
  LIMIT 1;
  
  -- If no default plant found, use the first active plant
  IF default_plant_id IS NULL THEN
    SELECT id INTO default_plant_id 
    FROM plants 
    WHERE is_active = true 
    ORDER BY created_at 
    LIMIT 1;
  END IF;
  
  -- Extract user information
  user_email := NEW.email;
  first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- If names are empty, try to extract from email
  IF first_name = '' AND last_name = '' THEN
    first_name := SPLIT_PART(SPLIT_PART(user_email, '@', 1), '.', 1);
    last_name := COALESCE(SPLIT_PART(SPLIT_PART(user_email, '@', 1), '.', 2), '');
  END IF;
  
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    plant_id, 
    first_name, 
    last_name, 
    email,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    default_plant_id,
    first_name,
    last_name,
    user_email,
    'active',
    NOW(),
    NOW()
  );
  
  -- Auto-enroll new users in both courses
  INSERT INTO public.enrollments (
    user_id,
    course_id,
    plant_id,
    status,
    enrolled_at,
    created_at,
    updated_at
  )
  SELECT 
    NEW.id,
    c.id,
    default_plant_id,
    'enrolled',
    NOW(),
    NOW(),
    NOW()
  FROM courses c
  WHERE c.slug IN ('function-specific-hazmat-training', 'function-specific-hazmat-training-spanish')
    AND c.is_published = true;
  
  -- Create initial progress records
  INSERT INTO public.progress (
    user_id,
    course_id,
    plant_id,
    progress_percent,
    current_section,
    last_active_at,
    created_at,
    updated_at
  )
  SELECT 
    NEW.id,
    c.id,
    default_plant_id,
    0,
    'introduction',
    NOW(),
    NOW(),
    NOW()
  FROM courses c
  WHERE c.slug IN ('function-specific-hazmat-training', 'function-specific-hazmat-training-spanish')
    AND c.is_published = true;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Test the function works (will be used when users actually sign up)
SELECT 'User profile creation trigger installed successfully' as status;