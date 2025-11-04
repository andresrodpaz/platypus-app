-- CLEANUP SCRIPT - Run this FIRST to reset the database
-- This will delete all data and drop all tables

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS request_history CASCADE;
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS bug_comments CASCADE;
DROP TABLE IF EXISTS bugs CASCADE;
DROP TABLE IF EXISTS scheduled_tests CASCADE;
DROP TABLE IF EXISTS assertions CASCADE;
DROP TABLE IF EXISTS api_mocks CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS test_executions CASCADE;
DROP TABLE IF EXISTS test_requests CASCADE;
DROP TABLE IF EXISTS test_suites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_test_suites_updated_at ON test_suites;
DROP TRIGGER IF EXISTS update_bugs_updated_at ON bugs;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Note: We don't drop the uuid-ossp extension as it might be used by other apps
