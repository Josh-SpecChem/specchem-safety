-- Row Level Security Policies for SpecChem Safety Training Database
-- This file contains all RLS policies for multi-tenant security and role-based access control

-- Enable RLS on all tables
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Create helper functions for RLS policies
CREATE OR REPLACE FUNCTION get_user_plant_id() RETURNS uuid AS $$
  SELECT plant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_user() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_hr_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'hr_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_plant_manager(target_plant_id uuid DEFAULT NULL) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'plant_manager'
    AND (target_plant_id IS NULL OR plant_id = target_plant_id OR plant_id IS NULL)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_dev_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'dev_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PLANTS TABLE POLICIES
-- Plants are viewable by all authenticated users, manageable by HR/Dev admins

CREATE POLICY "Users can view active plants"
  ON plants FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "HR admins can manage all plants"
  ON plants FOR ALL
  TO authenticated
  USING (is_hr_admin() OR is_dev_admin());

-- PROFILES TABLE POLICIES
-- Users can view their own profile and profiles in their plant
-- Admins have broader access based on their role

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view profiles in their plant"
  ON profiles FOR SELECT
  TO authenticated
  USING (plant_id = get_user_plant_id());

CREATE POLICY "Plant managers can view profiles in their plants"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    is_plant_manager(plant_id) OR 
    is_hr_admin() OR 
    is_dev_admin()
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "HR admins can manage all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (is_hr_admin() OR is_dev_admin())
  WITH CHECK (is_hr_admin() OR is_dev_admin());

CREATE POLICY "Plant managers can update profiles in their plants"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_plant_manager(plant_id))
  WITH CHECK (is_plant_manager(plant_id));

-- ADMIN_ROLES TABLE POLICIES
-- Only HR and Dev admins can manage admin roles

CREATE POLICY "Admins can view admin roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "HR admins can manage admin roles"
  ON admin_roles FOR ALL
  TO authenticated
  USING (is_hr_admin() OR is_dev_admin())
  WITH CHECK (is_hr_admin() OR is_dev_admin());

-- COURSES TABLE POLICIES
-- Published courses are viewable by all users
-- Course management restricted to admins

CREATE POLICY "Users can view published courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can view all courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "HR and Dev admins can manage courses"
  ON courses FOR ALL
  TO authenticated
  USING (is_hr_admin() OR is_dev_admin())
  WITH CHECK (is_hr_admin() OR is_dev_admin());

-- ENROLLMENTS TABLE POLICIES
-- Users can view their own enrollments
-- Plant-based access for managers
-- Tenant isolation enforced

CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view enrollments in their plant"
  ON enrollments FOR SELECT
  TO authenticated
  USING (plant_id = get_user_plant_id() AND is_admin_user());

CREATE POLICY "Plant managers can view enrollments in their plants"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    is_plant_manager(plant_id) OR 
    is_hr_admin() OR 
    is_dev_admin()
  );

CREATE POLICY "Admins can create enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    (is_plant_manager(plant_id) OR is_hr_admin() OR is_dev_admin()) AND
    plant_id = get_user_plant_id() OR is_hr_admin() OR is_dev_admin()
  );

CREATE POLICY "Admins can update enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (
    is_plant_manager(plant_id) OR 
    is_hr_admin() OR 
    is_dev_admin()
  )
  WITH CHECK (
    is_plant_manager(plant_id) OR 
    is_hr_admin() OR 
    is_dev_admin()
  );

-- PROGRESS TABLE POLICIES
-- Users can view and update their own progress
-- Tenant isolation enforced

CREATE POLICY "Users can view their own progress"
  ON progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view progress in their plant"
  ON progress FOR SELECT
  TO authenticated
  USING (plant_id = get_user_plant_id() AND is_admin_user());

CREATE POLICY "Plant managers can view progress in their plants"
  ON progress FOR SELECT
  TO authenticated
  USING (
    is_plant_manager(plant_id) OR 
    is_hr_admin() OR 
    is_dev_admin()
  );

CREATE POLICY "Users can update their own progress"
  ON progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND 
    plant_id = get_user_plant_id()
  );

CREATE POLICY "System can create progress records"
  ON progress FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND plant_id = get_user_plant_id()) OR
    is_admin_user()
  );

-- QUESTION_EVENTS TABLE POLICIES
-- Users can create their own question events
-- Analytics access for admins
-- Tenant isolation enforced

CREATE POLICY "Users can create their own question events"
  ON question_events FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    plant_id = get_user_plant_id()
  );

CREATE POLICY "Users can view their own question events"
  ON question_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view question events in their scope"
  ON question_events FOR SELECT
  TO authenticated
  USING (
    (is_plant_manager(plant_id) OR is_hr_admin() OR is_dev_admin()) OR
    (plant_id = get_user_plant_id() AND is_admin_user())
  );

-- ACTIVITY_EVENTS TABLE POLICIES
-- Users can create their own activity events
-- Analytics access for admins
-- Tenant isolation enforced

CREATE POLICY "Users can create their own activity events"
  ON activity_events FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    plant_id = get_user_plant_id()
  );

CREATE POLICY "Users can view their own activity events"
  ON activity_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view activity events in their scope"
  ON activity_events FOR SELECT
  TO authenticated
  USING (
    (is_plant_manager(plant_id) OR is_hr_admin() OR is_dev_admin()) OR
    (plant_id = get_user_plant_id() AND is_admin_user())
  );

-- Create indexes for RLS performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_plant_id ON profiles(plant_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_plant ON enrollments(user_id, plant_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_plant ON progress(user_id, plant_id);
CREATE INDEX IF NOT EXISTS idx_question_events_user_plant ON question_events(user_id, plant_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_user_plant ON activity_events(user_id, plant_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;