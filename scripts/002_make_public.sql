-- Make the app public by updating RLS policies
-- This allows anyone to use the app without authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own suites" ON test_suites;
DROP POLICY IF EXISTS "Users can create suites" ON test_suites;
DROP POLICY IF EXISTS "Users can update their own suites" ON test_suites;
DROP POLICY IF EXISTS "Users can delete their own suites" ON test_suites;

DROP POLICY IF EXISTS "Anyone can view bugs" ON bugs;
DROP POLICY IF EXISTS "Users can create bugs" ON bugs;
DROP POLICY IF EXISTS "Users can update bugs they created or are assigned to" ON bugs;
DROP POLICY IF EXISTS "Users can delete their own bugs" ON bugs;

DROP POLICY IF EXISTS "Users can view their own history" ON request_history;
DROP POLICY IF EXISTS "Users can insert their own history" ON request_history;

-- Create new public policies that allow anyone to do anything
-- Test Suites
CREATE POLICY "Public can view all suites" ON test_suites FOR SELECT USING (true);
CREATE POLICY "Public can create suites" ON test_suites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update suites" ON test_suites FOR UPDATE USING (true);
CREATE POLICY "Public can delete suites" ON test_suites FOR DELETE USING (true);

-- Bugs
CREATE POLICY "Public can view all bugs" ON bugs FOR SELECT USING (true);
CREATE POLICY "Public can create bugs" ON bugs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update bugs" ON bugs FOR UPDATE USING (true);
CREATE POLICY "Public can delete bugs" ON bugs FOR DELETE USING (true);

-- Request History
CREATE POLICY "Public can view all history" ON request_history FOR SELECT USING (true);
CREATE POLICY "Public can insert history" ON request_history FOR INSERT WITH CHECK (true);

-- API Mocks
CREATE POLICY "Public can view all mocks" ON api_mocks FOR SELECT USING (true);
CREATE POLICY "Public can create mocks" ON api_mocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update mocks" ON api_mocks FOR UPDATE USING (true);
CREATE POLICY "Public can delete mocks" ON api_mocks FOR DELETE USING (true);

-- Scheduled Tests
CREATE POLICY "Public can view all schedules" ON scheduled_tests FOR SELECT USING (true);
CREATE POLICY "Public can create schedules" ON scheduled_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update schedules" ON scheduled_tests FOR UPDATE USING (true);
CREATE POLICY "Public can delete schedules" ON scheduled_tests FOR DELETE USING (true);

-- Test Requests
CREATE POLICY "Public can view all requests" ON test_requests FOR SELECT USING (true);
CREATE POLICY "Public can create requests" ON test_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update requests" ON test_requests FOR UPDATE USING (true);
CREATE POLICY "Public can delete requests" ON test_requests FOR DELETE USING (true);

-- Test Results
CREATE POLICY "Public can view all results" ON test_results FOR SELECT USING (true);
CREATE POLICY "Public can create results" ON test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update results" ON test_results FOR UPDATE USING (true);
CREATE POLICY "Public can delete results" ON test_results FOR DELETE USING (true);

-- Bug Comments
CREATE POLICY "Public can view all comments" ON bug_comments FOR SELECT USING (true);
CREATE POLICY "Public can create comments" ON bug_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update comments" ON bug_comments FOR UPDATE USING (true);
CREATE POLICY "Public can delete comments" ON bug_comments FOR DELETE USING (true);

-- Activity Feed
CREATE POLICY "Public can view all activity" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Public can create activity" ON activity_feed FOR INSERT WITH CHECK (true);

-- Create a default public user profile if it doesn't exist
INSERT INTO user_profiles (id, email, full_name, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'public@platypuslab.demo',
  'Public User',
  'tester',
  'https://api.dicebear.com/7.x/bottts/svg?seed=platypus'
)
ON CONFLICT (id) DO NOTHING;
