-- ============================================
-- SECURITY SETUP SCRIPT FOR THE SQUARE
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE IF EXISTS members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. DROP EXISTING POLICIES (to recreate)
-- ============================================

-- Members
DROP POLICY IF EXISTS "Admins can do everything on members" ON members;
DROP POLICY IF EXISTS "Teachers can view members" ON teachers;

-- Teachers
DROP POLICY IF EXISTS "Admins can do everything on teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can view own profile" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON teachers;

-- Classes
DROP POLICY IF EXISTS "Admins can do everything on classes" ON classes;
DROP POLICY IF EXISTS "Teachers can view own classes" ON classes;

-- Class Sessions
DROP POLICY IF EXISTS "Admins can do everything on class_sessions" ON class_sessions;
DROP POLICY IF EXISTS "Teachers can manage own sessions" ON class_sessions;

-- Attendance
DROP POLICY IF EXISTS "Admins can do everything on attendance" ON attendance;
DROP POLICY IF EXISTS "Teachers can manage attendance for own sessions" ON attendance;

-- ============================================
-- 3. CREATE ADMIN POLICIES
-- ============================================
-- Admins (users with role='admin' in teachers table) can do everything

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teachers
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get teacher_id for current user
CREATE OR REPLACE FUNCTION get_teacher_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM teachers
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. MEMBERS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to members"
  ON members FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: read-only access to members in their classes
CREATE POLICY "Teachers can view members in their classes"
  ON members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN classes c ON e.class_id = c.id
      WHERE e.member_id = members.id
      AND c.teacher_id = get_teacher_id()
    )
  );

-- ============================================
-- 5. TEACHERS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to teachers"
  ON teachers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: can view all teachers (for display purposes)
CREATE POLICY "Teachers can view all teachers"
  ON teachers FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Teachers: can update own profile
CREATE POLICY "Teachers can update own profile"
  ON teachers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- 6. CLASSES POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to classes"
  ON classes FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: can view own classes
CREATE POLICY "Teachers can view own classes"
  ON classes FOR SELECT
  USING (teacher_id = get_teacher_id());

-- ============================================
-- 7. CLASS SESSIONS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to class_sessions"
  ON class_sessions FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: full access to own sessions
CREATE POLICY "Teachers manage own sessions"
  ON class_sessions FOR ALL
  USING (teacher_id = get_teacher_id())
  WITH CHECK (teacher_id = get_teacher_id());

-- ============================================
-- 8. ATTENDANCE POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to attendance"
  ON attendance FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: manage attendance for their sessions
CREATE POLICY "Teachers manage own attendance"
  ON attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM class_sessions cs
      WHERE cs.id = attendance.session_id
      AND cs.teacher_id = get_teacher_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM class_sessions cs
      WHERE cs.id = attendance.session_id
      AND cs.teacher_id = get_teacher_id()
    )
  );

-- ============================================
-- 9. ENROLLMENTS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to enrollments"
  ON enrollments FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: view enrollments in their classes
CREATE POLICY "Teachers view own class enrollments"
  ON enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = enrollments.class_id
      AND c.teacher_id = get_teacher_id()
    )
  );

-- ============================================
-- 10. PAYMENTS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to payments"
  ON payments FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: view payments (for their students)
CREATE POLICY "Teachers view payments"
  ON payments FOR SELECT
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN classes c ON e.class_id = c.id
      WHERE e.member_id = payments.member_id
      AND c.teacher_id = get_teacher_id()
    )
  );

-- ============================================
-- 11. LESSONS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to lessons"
  ON lessons FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teachers: view all lessons, manage own
CREATE POLICY "Teachers view all lessons"
  ON lessons FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers manage own lessons"
  ON lessons FOR INSERT
  WITH CHECK (uploaded_by = get_teacher_id());

CREATE POLICY "Teachers update own lessons"
  ON lessons FOR UPDATE
  USING (uploaded_by = get_teacher_id());

CREATE POLICY "Teachers delete own lessons"
  ON lessons FOR DELETE
  USING (uploaded_by = get_teacher_id());

-- ============================================
-- 12. COMPETITIONS POLICIES
-- ============================================

-- Admins: full access
CREATE POLICY "Admins full access to competitions"
  ON competitions FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Everyone: can view competitions
CREATE POLICY "Anyone can view competitions"
  ON competitions FOR SELECT
  USING (true);

-- ============================================
-- 13. ACTIVITY LOG POLICIES
-- ============================================

-- Admins only
CREATE POLICY "Admins full access to activity_log"
  ON activity_log FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify RLS is enabled:

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'members', 'teachers', 'classes', 'enrollments',
  'payments', 'class_sessions', 'attendance', 'lessons',
  'competitions', 'activity_log'
)
ORDER BY tablename;

-- ============================================
-- END OF SCRIPT
-- ============================================
