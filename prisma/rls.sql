-- Row Level Security policies for the Redacao app.
--
-- The policies read per-request context from PostgreSQL settings:
--   app.user_id, app.role, app.student_id, app.teacher_id
--
-- Current Prisma runtime connections usually use the table owner in local
-- development, so PostgreSQL will let that owner bypass RLS unless FORCE ROW
-- LEVEL SECURITY is enabled later. Keep migrations/seed using an owner role
-- and run the application with a separate non-owner role before forcing RLS.

BEGIN;

CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_app_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.user_id', true), '')
$$;

CREATE OR REPLACE FUNCTION app.current_app_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.role', true), '')
$$;

CREATE OR REPLACE FUNCTION app.current_student_profile_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.student_id', true), '')
$$;

CREATE OR REPLACE FUNCTION app.current_teacher_profile_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.teacher_id', true), '')
$$;

CREATE OR REPLACE FUNCTION app.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT app.current_app_role() = 'ADMIN'
$$;

CREATE OR REPLACE FUNCTION app.is_teacher()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT app.current_app_role() IN ('TEACHER', 'ADMIN')
$$;

CREATE OR REPLACE FUNCTION app.is_student()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT app.current_app_role() = 'STUDENT'
$$;

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudentProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeacherProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActivityAttachment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Submission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Correction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VideoCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VideoClassroom" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VideoModule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VideoLesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LiveClass" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlatformSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RegistrationSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PasswordSetupToken" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_select ON "User";
CREATE POLICY user_select ON "User"
  FOR SELECT
  USING (app.is_admin() OR id = app.current_app_user_id());

DROP POLICY IF EXISTS user_insert ON "User";
CREATE POLICY user_insert ON "User"
  FOR INSERT
  WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS user_update ON "User";
CREATE POLICY user_update ON "User"
  FOR UPDATE
  USING (app.is_admin() OR id = app.current_app_user_id())
  WITH CHECK (app.is_admin() OR id = app.current_app_user_id());

DROP POLICY IF EXISTS user_delete ON "User";
CREATE POLICY user_delete ON "User"
  FOR DELETE
  USING (app.is_admin());

DROP POLICY IF EXISTS student_profile_select ON "StudentProfile";
CREATE POLICY student_profile_select ON "StudentProfile"
  FOR SELECT
  USING (app.is_admin() OR id = app.current_student_profile_id() OR app.is_teacher());

DROP POLICY IF EXISTS student_profile_insert ON "StudentProfile";
CREATE POLICY student_profile_insert ON "StudentProfile"
  FOR INSERT
  WITH CHECK (app.is_admin() OR "userId" = app.current_app_user_id());

DROP POLICY IF EXISTS student_profile_update ON "StudentProfile";
CREATE POLICY student_profile_update ON "StudentProfile"
  FOR UPDATE
  USING (app.is_admin() OR id = app.current_student_profile_id())
  WITH CHECK (app.is_admin() OR id = app.current_student_profile_id());

DROP POLICY IF EXISTS student_profile_delete ON "StudentProfile";
CREATE POLICY student_profile_delete ON "StudentProfile"
  FOR DELETE
  USING (app.is_admin());

DROP POLICY IF EXISTS teacher_profile_select ON "TeacherProfile";
CREATE POLICY teacher_profile_select ON "TeacherProfile"
  FOR SELECT
  USING (app.is_admin() OR id = app.current_teacher_profile_id() OR app.is_student());

DROP POLICY IF EXISTS teacher_profile_insert ON "TeacherProfile";
CREATE POLICY teacher_profile_insert ON "TeacherProfile"
  FOR INSERT
  WITH CHECK (app.is_admin() OR "userId" = app.current_app_user_id());

DROP POLICY IF EXISTS teacher_profile_update ON "TeacherProfile";
CREATE POLICY teacher_profile_update ON "TeacherProfile"
  FOR UPDATE
  USING (app.is_admin() OR id = app.current_teacher_profile_id())
  WITH CHECK (app.is_admin() OR id = app.current_teacher_profile_id());

DROP POLICY IF EXISTS teacher_profile_delete ON "TeacherProfile";
CREATE POLICY teacher_profile_delete ON "TeacherProfile"
  FOR DELETE
  USING (app.is_admin());

DROP POLICY IF EXISTS activity_select ON "Activity";
CREATE POLICY activity_select ON "Activity"
  FOR SELECT
  USING (
    app.is_admin()
    OR status = 'PUBLISHED'
    OR "createdById" = app.current_teacher_profile_id()
  );

DROP POLICY IF EXISTS activity_insert ON "Activity";
CREATE POLICY activity_insert ON "Activity"
  FOR INSERT
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "createdById" = app.current_teacher_profile_id()));

DROP POLICY IF EXISTS activity_update ON "Activity";
CREATE POLICY activity_update ON "Activity"
  FOR UPDATE
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id())
  WITH CHECK (app.is_admin() OR "createdById" = app.current_teacher_profile_id());

DROP POLICY IF EXISTS activity_delete ON "Activity";
CREATE POLICY activity_delete ON "Activity"
  FOR DELETE
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id());

DROP POLICY IF EXISTS activity_attachment_select ON "ActivityAttachment";
CREATE POLICY activity_attachment_select ON "ActivityAttachment"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND (app.is_admin() OR a.status = 'PUBLISHED' OR a."createdById" = app.current_teacher_profile_id())
    )
  );

DROP POLICY IF EXISTS activity_attachment_insert ON "ActivityAttachment";
CREATE POLICY activity_attachment_insert ON "ActivityAttachment"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND (app.is_admin() OR a."createdById" = app.current_teacher_profile_id())
    )
  );

DROP POLICY IF EXISTS activity_attachment_update ON "ActivityAttachment";
CREATE POLICY activity_attachment_update ON "ActivityAttachment"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND (app.is_admin() OR a."createdById" = app.current_teacher_profile_id())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND (app.is_admin() OR a."createdById" = app.current_teacher_profile_id())
    )
  );

DROP POLICY IF EXISTS activity_attachment_delete ON "ActivityAttachment";
CREATE POLICY activity_attachment_delete ON "ActivityAttachment"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND (app.is_admin() OR a."createdById" = app.current_teacher_profile_id())
    )
  );

DROP POLICY IF EXISTS submission_select ON "Submission";
CREATE POLICY submission_select ON "Submission"
  FOR SELECT
  USING (
    app.is_admin()
    OR "studentId" = app.current_student_profile_id()
    OR EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND a."createdById" = app.current_teacher_profile_id()
    )
  );

DROP POLICY IF EXISTS submission_insert ON "Submission";
CREATE POLICY submission_insert ON "Submission"
  FOR INSERT
  WITH CHECK (
    app.is_student()
    AND "studentId" = app.current_student_profile_id()
    AND EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND a.status = 'PUBLISHED'
    )
  );

DROP POLICY IF EXISTS submission_update ON "Submission";
CREATE POLICY submission_update ON "Submission"
  FOR UPDATE
  USING (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND a."createdById" = app.current_teacher_profile_id()
    )
  )
  WITH CHECK (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM "Activity" a
      WHERE a.id = "activityId"
        AND a."createdById" = app.current_teacher_profile_id()
    )
  );

DROP POLICY IF EXISTS submission_delete ON "Submission";
CREATE POLICY submission_delete ON "Submission"
  FOR DELETE
  USING (app.is_admin());

DROP POLICY IF EXISTS correction_select ON "Correction";
CREATE POLICY correction_select ON "Correction"
  FOR SELECT
  USING (
    app.is_admin()
    OR "teacherId" = app.current_teacher_profile_id()
    OR EXISTS (
      SELECT 1
      FROM "Submission" s
      WHERE s.id = "submissionId"
        AND s."studentId" = app.current_student_profile_id()
    )
  );

DROP POLICY IF EXISTS correction_insert ON "Correction";
CREATE POLICY correction_insert ON "Correction"
  FOR INSERT
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "teacherId" = app.current_teacher_profile_id()));

DROP POLICY IF EXISTS correction_update ON "Correction";
CREATE POLICY correction_update ON "Correction"
  FOR UPDATE
  USING (app.is_admin() OR "teacherId" = app.current_teacher_profile_id())
  WITH CHECK (app.is_admin() OR "teacherId" = app.current_teacher_profile_id());

DROP POLICY IF EXISTS correction_delete ON "Correction";
CREATE POLICY correction_delete ON "Correction"
  FOR DELETE
  USING (app.is_admin() OR "teacherId" = app.current_teacher_profile_id());

DROP POLICY IF EXISTS video_category_select ON "VideoCategory";
CREATE POLICY video_category_select ON "VideoCategory"
  FOR SELECT
  USING (app.current_app_user_id() IS NOT NULL);

DROP POLICY IF EXISTS video_category_write ON "VideoCategory";
CREATE POLICY video_category_write ON "VideoCategory"
  FOR ALL
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id())
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "createdById" = app.current_teacher_profile_id() OR "createdById" IS NULL));

DROP POLICY IF EXISTS video_classroom_select ON "VideoClassroom";
CREATE POLICY video_classroom_select ON "VideoClassroom"
  FOR SELECT
  USING ((app.current_app_user_id() IS NOT NULL AND "isActive" = true) OR app.is_teacher());

DROP POLICY IF EXISTS video_classroom_write ON "VideoClassroom";
CREATE POLICY video_classroom_write ON "VideoClassroom"
  FOR ALL
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id())
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "createdById" = app.current_teacher_profile_id() OR "createdById" IS NULL));

DROP POLICY IF EXISTS video_module_select ON "VideoModule";
CREATE POLICY video_module_select ON "VideoModule"
  FOR SELECT
  USING (
    app.is_teacher()
    OR EXISTS (
      SELECT 1
      FROM "VideoClassroom" c
      WHERE c.id = "classroomId"
        AND c."isActive" = true
    )
  );

DROP POLICY IF EXISTS video_module_write ON "VideoModule";
CREATE POLICY video_module_write ON "VideoModule"
  FOR ALL
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id())
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "createdById" = app.current_teacher_profile_id() OR "createdById" IS NULL));

DROP POLICY IF EXISTS video_lesson_select ON "VideoLesson";
CREATE POLICY video_lesson_select ON "VideoLesson"
  FOR SELECT
  USING (
    app.is_teacher()
    OR "classroomId" IS NULL
    OR EXISTS (
      SELECT 1
      FROM "VideoClassroom" c
      WHERE c.id = "classroomId"
        AND c."isActive" = true
    )
  );

DROP POLICY IF EXISTS video_lesson_write ON "VideoLesson";
CREATE POLICY video_lesson_write ON "VideoLesson"
  FOR ALL
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id())
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "createdById" = app.current_teacher_profile_id() OR "createdById" IS NULL));

DROP POLICY IF EXISTS live_class_select ON "LiveClass";
CREATE POLICY live_class_select ON "LiveClass"
  FOR SELECT
  USING (app.current_app_user_id() IS NOT NULL);

DROP POLICY IF EXISTS live_class_write ON "LiveClass";
CREATE POLICY live_class_write ON "LiveClass"
  FOR ALL
  USING (app.is_admin() OR "createdById" = app.current_teacher_profile_id())
  WITH CHECK (app.is_teacher() AND (app.is_admin() OR "createdById" = app.current_teacher_profile_id()));

DROP POLICY IF EXISTS account_owner_access ON "Account";
CREATE POLICY account_owner_access ON "Account"
  FOR ALL
  USING (app.is_admin() OR "userId" = app.current_app_user_id())
  WITH CHECK (app.is_admin() OR "userId" = app.current_app_user_id());

DROP POLICY IF EXISTS session_owner_access ON "Session";
CREATE POLICY session_owner_access ON "Session"
  FOR ALL
  USING (app.is_admin() OR "userId" = app.current_app_user_id())
  WITH CHECK (app.is_admin() OR "userId" = app.current_app_user_id());

DROP POLICY IF EXISTS verification_token_admin_only ON "VerificationToken";
CREATE POLICY verification_token_admin_only ON "VerificationToken"
  FOR ALL
  USING (app.is_admin())
  WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS platform_settings_select ON "PlatformSettings";
CREATE POLICY platform_settings_select ON "PlatformSettings"
  FOR SELECT
  USING (app.current_app_user_id() IS NOT NULL);

DROP POLICY IF EXISTS platform_settings_write ON "PlatformSettings";
CREATE POLICY platform_settings_write ON "PlatformSettings"
  FOR ALL
  USING (app.is_admin())
  WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS registration_session_admin_access ON "RegistrationSession";
CREATE POLICY registration_session_admin_access ON "RegistrationSession"
  FOR ALL
  USING (app.is_admin() OR "createdUserId" = app.current_app_user_id())
  WITH CHECK (app.is_admin() OR "createdUserId" = app.current_app_user_id());

DROP POLICY IF EXISTS password_setup_token_owner_access ON "PasswordSetupToken";
CREATE POLICY password_setup_token_owner_access ON "PasswordSetupToken"
  FOR ALL
  USING (app.is_admin() OR "userId" = app.current_app_user_id())
  WITH CHECK (app.is_admin() OR "userId" = app.current_app_user_id());

COMMIT;
