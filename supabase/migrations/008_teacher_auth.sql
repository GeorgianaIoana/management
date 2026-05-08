-- Teacher Authentication Migration
-- Links teachers to Supabase Auth and implements RLS policies for teacher access control

-- Add auth_id column to teachers table
ALTER TABLE teachers
ADD COLUMN auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_teachers_auth_id ON teachers(auth_id);

-- Helper function: Get current teacher's ID based on auth.uid()
CREATE OR REPLACE FUNCTION get_current_teacher_id()
RETURNS UUID AS $$
  SELECT id FROM teachers WHERE auth_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: Check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data->>'role' = 'admin' FROM auth.users WHERE id = auth.uid()),
    false
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: Check if current user is a teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data->>'role' = 'teacher' FROM auth.users WHERE id = auth.uid()),
    false
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: Check if teacher owns a specific class
CREATE OR REPLACE FUNCTION teacher_owns_class(class_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_id
    AND c.teacher_id = get_current_teacher_id()
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: Check if teacher owns a specific session
CREATE OR REPLACE FUNCTION teacher_owns_session(session_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM class_sessions cs
    JOIN classes c ON cs.class_id = c.id
    WHERE cs.id = session_id
    AND c.teacher_id = get_current_teacher_id()
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow authenticated users full access to teachers" ON teachers;
DROP POLICY IF EXISTS "Allow authenticated users full access to classes" ON classes;
DROP POLICY IF EXISTS "Allow authenticated users full access to enrollments" ON enrollments;
DROP POLICY IF EXISTS "Allow authenticated users full access to members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users full access to class_sessions" ON class_sessions;
DROP POLICY IF EXISTS "Allow authenticated users full access to attendance" ON attendance;
DROP POLICY IF EXISTS "Allow authenticated users full access to payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated users full access to payment_reminders" ON payment_reminders;
DROP POLICY IF EXISTS "Allow authenticated users full access to lessons" ON lessons;
DROP POLICY IF EXISTS "Allow authenticated users full access to activity_log" ON activity_log;

-- Teachers table policies
-- Admins: full access
-- Teachers: read own profile only, update own profile
CREATE POLICY "teachers_admin_all" ON teachers
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "teachers_teacher_select_own" ON teachers
  FOR SELECT TO authenticated
  USING (is_teacher() AND id = get_current_teacher_id());

CREATE POLICY "teachers_teacher_update_own" ON teachers
  FOR UPDATE TO authenticated
  USING (is_teacher() AND id = get_current_teacher_id())
  WITH CHECK (is_teacher() AND id = get_current_teacher_id());

-- Classes table policies
-- Admins: full access
-- Teachers: read own classes only
CREATE POLICY "classes_admin_all" ON classes
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "classes_teacher_select_own" ON classes
  FOR SELECT TO authenticated
  USING (is_teacher() AND teacher_id = get_current_teacher_id());

-- Enrollments table policies
-- Admins: full access
-- Teachers: read enrollments for own classes only
CREATE POLICY "enrollments_admin_all" ON enrollments
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "enrollments_teacher_select_own" ON enrollments
  FOR SELECT TO authenticated
  USING (is_teacher() AND teacher_owns_class(class_id));

-- Members table policies
-- Admins: full access
-- Teachers: read members enrolled in own classes only
CREATE POLICY "members_admin_all" ON members
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "members_teacher_select_enrolled" ON members
  FOR SELECT TO authenticated
  USING (
    is_teacher() AND EXISTS (
      SELECT 1 FROM enrollments e
      JOIN classes c ON e.class_id = c.id
      WHERE e.member_id = members.id
      AND c.teacher_id = get_current_teacher_id()
      AND e.is_active = true
    )
  );

-- Class sessions table policies
-- Admins: full access
-- Teachers: full access to own sessions (can create/update)
CREATE POLICY "class_sessions_admin_all" ON class_sessions
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "class_sessions_teacher_select_own" ON class_sessions
  FOR SELECT TO authenticated
  USING (is_teacher() AND teacher_owns_class(class_id));

CREATE POLICY "class_sessions_teacher_insert_own" ON class_sessions
  FOR INSERT TO authenticated
  WITH CHECK (is_teacher() AND teacher_owns_class(class_id));

CREATE POLICY "class_sessions_teacher_update_own" ON class_sessions
  FOR UPDATE TO authenticated
  USING (is_teacher() AND teacher_owns_class(class_id))
  WITH CHECK (is_teacher() AND teacher_owns_class(class_id));

-- Attendance table policies
-- Admins: full access
-- Teachers: full access to attendance for own sessions
CREATE POLICY "attendance_admin_all" ON attendance
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "attendance_teacher_select_own" ON attendance
  FOR SELECT TO authenticated
  USING (is_teacher() AND teacher_owns_session(session_id));

CREATE POLICY "attendance_teacher_insert_own" ON attendance
  FOR INSERT TO authenticated
  WITH CHECK (is_teacher() AND teacher_owns_session(session_id));

CREATE POLICY "attendance_teacher_update_own" ON attendance
  FOR UPDATE TO authenticated
  USING (is_teacher() AND teacher_owns_session(session_id))
  WITH CHECK (is_teacher() AND teacher_owns_session(session_id));

-- Payments table policies
-- Admins only: full access
-- Teachers: no access
CREATE POLICY "payments_admin_all" ON payments
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Payment reminders table policies
-- Admins only: full access
-- Teachers: no access
CREATE POLICY "payment_reminders_admin_all" ON payment_reminders
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Lessons table policies
-- Admins: full access
-- Teachers: read lessons for own classes
CREATE POLICY "lessons_admin_all" ON lessons
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "lessons_teacher_select_own" ON lessons
  FOR SELECT TO authenticated
  USING (is_teacher() AND (class_id IS NULL OR teacher_owns_class(class_id)));

-- Activity log table policies
-- Admins only: full access
CREATE POLICY "activity_log_admin_all" ON activity_log
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
