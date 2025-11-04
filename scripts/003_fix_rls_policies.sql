-- Fix RLS Policies for Public Access
-- This script ensures all tables have public access policies
-- Run this if you're getting "violates row-level security policy" errors

-- Test Suites - Drop and recreate policies
DROP POLICY IF EXISTS "Users can view their own suites" ON test_suites;
DROP POLICY IF EXISTS "Users can create suites" ON test_suites;
DROP POLICY IF EXISTS "Users can update their own suites" ON test_suites;
DROP POLICY IF EXISTS "Users can delete their own suites" ON test_suites;
DROP POLICY IF EXISTS "Public can view all suites" ON test_suites;
DROP POLICY IF EXISTS "Public can create suites" ON test_suites;
DROP POLICY IF EXISTS "Public can update suites" ON test_suites;
DROP POLICY IF EXISTS "Public can delete suites" ON test_suites;

CREATE POLICY "Public can view all suites" ON test_suites FOR SELECT USING (true);
CREATE POLICY "Public can create suites" ON test_suites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update suites" ON test_suites FOR UPDATE USING (true);
CREATE POLICY "Public can delete suites" ON test_suites FOR DELETE USING (true);

-- Test Requests
DROP POLICY IF EXISTS "Public can view all requests" ON test_requests;
DROP POLICY IF EXISTS "Public can create requests" ON test_requests;
DROP POLICY IF EXISTS "Public can update requests" ON test_requests;
DROP POLICY IF EXISTS "Public can delete requests" ON test_requests;

CREATE POLICY "Public can view all requests" ON test_requests FOR SELECT USING (true);
CREATE POLICY "Public can create requests" ON test_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update requests" ON test_requests FOR UPDATE USING (true);
CREATE POLICY "Public can delete requests" ON test_requests FOR DELETE USING (true);

-- Test Executions
DROP POLICY IF EXISTS "Public can view all executions" ON test_executions;
DROP POLICY IF EXISTS "Public can create executions" ON test_executions;
DROP POLICY IF EXISTS "Public can update executions" ON test_executions;
DROP POLICY IF EXISTS "Public can delete executions" ON test_executions;

CREATE POLICY "Public can view all executions" ON test_executions FOR SELECT USING (true);
CREATE POLICY "Public can create executions" ON test_executions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update executions" ON test_executions FOR UPDATE USING (true);
CREATE POLICY "Public can delete executions" ON test_executions FOR DELETE USING (true);

-- Test Results
DROP POLICY IF EXISTS "Public can view all results" ON test_results;
DROP POLICY IF EXISTS "Public can create results" ON test_results;
DROP POLICY IF EXISTS "Public can update results" ON test_results;
DROP POLICY IF EXISTS "Public can delete results" ON test_results;

CREATE POLICY "Public can view all results" ON test_results FOR SELECT USING (true);
CREATE POLICY "Public can create results" ON test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update results" ON test_results FOR UPDATE USING (true);
CREATE POLICY "Public can delete results" ON test_results FOR DELETE USING (true);

-- API Mocks
DROP POLICY IF EXISTS "Public can view all mocks" ON api_mocks;
DROP POLICY IF EXISTS "Public can create mocks" ON api_mocks;
DROP POLICY IF EXISTS "Public can update mocks" ON api_mocks;
DROP POLICY IF EXISTS "Public can delete mocks" ON api_mocks;

CREATE POLICY "Public can view all mocks" ON api_mocks FOR SELECT USING (true);
CREATE POLICY "Public can create mocks" ON api_mocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update mocks" ON api_mocks FOR UPDATE USING (true);
CREATE POLICY "Public can delete mocks" ON api_mocks FOR DELETE USING (true);

-- Assertions
DROP POLICY IF EXISTS "Public can view all assertions" ON assertions;
DROP POLICY IF EXISTS "Public can create assertions" ON assertions;
DROP POLICY IF EXISTS "Public can update assertions" ON assertions;
DROP POLICY IF EXISTS "Public can delete assertions" ON assertions;

CREATE POLICY "Public can view all assertions" ON assertions FOR SELECT USING (true);
CREATE POLICY "Public can create assertions" ON assertions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update assertions" ON assertions FOR UPDATE USING (true);
CREATE POLICY "Public can delete assertions" ON assertions FOR DELETE USING (true);

-- Scheduled Tests
DROP POLICY IF EXISTS "Public can view all schedules" ON scheduled_tests;
DROP POLICY IF EXISTS "Public can create schedules" ON scheduled_tests;
DROP POLICY IF EXISTS "Public can update schedules" ON scheduled_tests;
DROP POLICY IF EXISTS "Public can delete schedules" ON scheduled_tests;

CREATE POLICY "Public can view all schedules" ON scheduled_tests FOR SELECT USING (true);
CREATE POLICY "Public can create schedules" ON scheduled_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update schedules" ON scheduled_tests FOR UPDATE USING (true);
CREATE POLICY "Public can delete schedules" ON scheduled_tests FOR DELETE USING (true);

-- Bugs
DROP POLICY IF EXISTS "Users can view all bugs" ON bugs;
DROP POLICY IF EXISTS "Users can create bugs" ON bugs;
DROP POLICY IF EXISTS "Users can update bugs they created or are assigned to" ON bugs;
DROP POLICY IF EXISTS "Users can delete their own bugs" ON bugs;
DROP POLICY IF EXISTS "Public can view all bugs" ON bugs;
DROP POLICY IF EXISTS "Public can create bugs" ON bugs;
DROP POLICY IF EXISTS "Public can update bugs" ON bugs;
DROP POLICY IF EXISTS "Public can delete bugs" ON bugs;

CREATE POLICY "Public can view all bugs" ON bugs FOR SELECT USING (true);
CREATE POLICY "Public can create bugs" ON bugs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update bugs" ON bugs FOR UPDATE USING (true);
CREATE POLICY "Public can delete bugs" ON bugs FOR DELETE USING (true);

-- Bug Comments
DROP POLICY IF EXISTS "Public can view all comments" ON bug_comments;
DROP POLICY IF EXISTS "Public can create comments" ON bug_comments;
DROP POLICY IF EXISTS "Public can update comments" ON bug_comments;
DROP POLICY IF EXISTS "Public can delete comments" ON bug_comments;

CREATE POLICY "Public can view all comments" ON bug_comments FOR SELECT USING (true);
CREATE POLICY "Public can create comments" ON bug_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update comments" ON bug_comments FOR UPDATE USING (true);
CREATE POLICY "Public can delete comments" ON bug_comments FOR DELETE USING (true);

-- Activity Feed
DROP POLICY IF EXISTS "Public can view all activity" ON activity_feed;
DROP POLICY IF EXISTS "Public can create activity" ON activity_feed;

CREATE POLICY "Public can view all activity" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Public can create activity" ON activity_feed FOR INSERT WITH CHECK (true);

-- Request History
DROP POLICY IF EXISTS "Users can view their own history" ON request_history;
DROP POLICY IF EXISTS "Users can insert their own history" ON request_history;
DROP POLICY IF EXISTS "Public can view all history" ON request_history;
DROP POLICY IF EXISTS "Public can insert history" ON request_history;

CREATE POLICY "Public can view all history" ON request_history FOR SELECT USING (true);
CREATE POLICY "Public can insert history" ON request_history FOR INSERT WITH CHECK (true);

-- User Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public can update profiles" ON user_profiles;

CREATE POLICY "Public can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Public can insert profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update profiles" ON user_profiles FOR UPDATE USING (true);

-- Ensure the default public user profile exists
INSERT INTO user_profiles (id, email, full_name, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'public@platypuslab.demo',
  'Public User',
  'tester',
  'https://api.dicebear.com/7.x/bottts/svg?seed=platypus'
)
ON CONFLICT (id) DO NOTHING;
