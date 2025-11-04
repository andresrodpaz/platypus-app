-- Enable Realtime for tables that need live updates
-- This allows Supabase to broadcast changes to subscribed clients

-- Enable realtime for user_profiles (team members)
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

-- Enable realtime for activity_feed (team activity)
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;

-- Enable realtime for test_executions (reports)
ALTER PUBLICATION supabase_realtime ADD TABLE test_executions;

-- Enable realtime for bugs (bug tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE bugs;

-- Enable realtime for bug_comments (bug discussions)
ALTER PUBLICATION supabase_realtime ADD TABLE bug_comments;

-- Verify realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
