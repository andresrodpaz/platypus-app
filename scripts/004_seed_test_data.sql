-- Seed comprehensive test data for demo purposes
-- This script adds sample suites, bugs, mocks, and monitoring data

-- Insert sample test suites
INSERT INTO test_suites (id, user_id, name, description, is_shared, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'GitHub API Test Suite', 'Comprehensive tests for GitHub public API endpoints', true, NOW() - INTERVAL '7 days'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Pokemon API Tests', 'Testing PokeAPI endpoints for reliability', true, NOW() - INTERVAL '5 days'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Weather & Location APIs', 'IP geolocation and weather data tests', true, NOW() - INTERVAL '3 days'),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Fun APIs Collection', 'Testing entertainment and random data APIs', true, NOW() - INTERVAL '2 days'),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Performance Test Suite', 'Load testing and response time monitoring', true, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert test requests for GitHub suite
INSERT INTO test_requests (id, suite_id, name, url, method, order_index, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Get Octocat Profile', 'https://api.github.com/users/octocat', 'GET', 1, NOW()),
  ('a1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Get Vercel Repos', 'https://api.github.com/users/vercel/repos', 'GET', 2, NOW()),
  ('a1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Check Rate Limit', 'https://api.github.com/rate_limit', 'GET', 3, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test requests for Pokemon suite
INSERT INTO test_requests (id, suite_id, name, url, method, order_index, created_at) VALUES
  ('a2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Get Pikachu Data', 'https://pokeapi.co/api/v2/pokemon/pikachu', 'GET', 1, NOW()),
  ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Get Charizard Data', 'https://pokeapi.co/api/v2/pokemon/charizard', 'GET', 2, NOW()),
  ('a2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Get Abilities List', 'https://pokeapi.co/api/v2/ability?limit=20', 'GET', 3, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test requests for Weather suite
INSERT INTO test_requests (id, suite_id, name, url, method, order_index, created_at) VALUES
  ('a3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Get IP Geolocation', 'https://ipapi.co/json/', 'GET', 1, NOW()),
  ('a3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Get IP Info', 'https://ipinfo.io/json', 'GET', 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test requests for Fun APIs suite
INSERT INTO test_requests (id, suite_id, name, url, method, order_index, created_at) VALUES
  ('a4444444-4444-4444-4444-444444444441', '44444444-4444-4444-4444-444444444444', 'Random Dog Image', 'https://dog.ceo/api/breeds/image/random', 'GET', 1, NOW()),
  ('a4444444-4444-4444-4444-444444444442', '44444444-4444-4444-4444-444444444444', 'Random Cat Fact', 'https://catfact.ninja/fact', 'GET', 2, NOW()),
  ('a4444444-4444-4444-4444-444444444443', '44444444-4444-4444-4444-444444444444', 'Random Quote', 'https://api.quotable.io/random', 'GET', 3, NOW()),
  ('a4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Dad Joke', 'https://icanhazdadjoke.com/', 'GET', 4, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test requests for Performance suite
INSERT INTO test_requests (id, suite_id, name, url, method, order_index, created_at) VALUES
  ('a5555555-5555-5555-5555-555555555551', '55555555-5555-5555-5555-555555555555', 'Fast Response Test', 'https://httpbin.org/get', 'GET', 1, NOW()),
  ('a5555555-5555-5555-5555-555555555552', '55555555-5555-5555-5555-555555555555', 'Delayed Response (2s)', 'https://httpbin.org/delay/2', 'GET', 2, NOW()),
  ('a5555555-5555-5555-5555-555555555553', '55555555-5555-5555-5555-555555555555', 'Status Code 200', 'https://httpbin.org/status/200', 'GET', 3, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample bugs
INSERT INTO bugs (id, user_id, title, description, severity, status, endpoint, created_at) VALUES
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'GitHub API rate limit too restrictive', 'The rate limit for unauthenticated requests is only 60 per hour, which is insufficient for comprehensive testing', 'medium', 'open', 'https://api.github.com/rate_limit', NOW() - INTERVAL '6 days'),
  ('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Pokemon API returns 404 for invalid IDs', 'When requesting a Pokemon with an ID > 1000, the API returns 404 instead of a proper error message', 'low', 'open', 'https://pokeapi.co/api/v2/pokemon/9999', NOW() - INTERVAL '4 days'),
  ('b3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'HTTPBin delay endpoint times out', 'Requesting delays > 10 seconds causes timeout errors instead of graceful handling', 'high', 'in_progress', 'https://httpbin.org/delay/15', NOW() - INTERVAL '2 days'),
  ('b4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Dog API occasionally returns broken images', 'Some image URLs from the random dog endpoint return 404 or broken images', 'medium', 'open', 'https://dog.ceo/api/breeds/image/random', NOW() - INTERVAL '1 day'),
  ('b5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'NASA API DEMO_KEY has low rate limit', 'The demo API key only allows 30 requests per hour, making it difficult to test thoroughly', 'low', 'resolved', 'https://api.nasa.gov/planetary/apod', NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- Insert bug comments
INSERT INTO bug_comments (bug_id, user_id, comment, created_at) VALUES
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Confirmed. We need to implement authentication to get 5000 requests/hour', NOW() - INTERVAL '5 days'),
  ('b3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Working on implementing proper timeout handling in our test suite', NOW() - INTERVAL '1 day'),
  ('b5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Resolved by getting a proper NASA API key. Rate limit now 1000/hour', NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Insert API mocks
INSERT INTO api_mocks (id, user_id, name, path, method, status_code, response_body, latency_ms, is_active, created_at) VALUES
  ('m1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Mock User API', '/api/users/123', 'GET', 200, '{"id": 123, "name": "John Doe", "email": "john@example.com", "role": "admin"}', 100, true, NOW()),
  ('m2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Mock Error Response', '/api/error', 'GET', 500, '{"error": "Internal Server Error", "message": "Something went wrong"}', 50, true, NOW()),
  ('m3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Mock Slow API', '/api/slow', 'GET', 200, '{"status": "success", "data": "This response was intentionally delayed"}', 3000, true, NOW()),
  ('m4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Mock Auth Failure', '/api/protected', 'GET', 401, '{"error": "Unauthorized", "message": "Invalid or missing authentication token"}', 10, true, NOW()),
  ('m5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Mock Product List', '/api/products', 'GET', 200, '{"products": [{"id": 1, "name": "Widget", "price": 29.99}, {"id": 2, "name": "Gadget", "price": 49.99}]}', 150, true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert scheduled tests
INSERT INTO scheduled_tests (id, suite_id, user_id, cron_expression, is_active, next_run_at, created_at) VALUES
  ('s1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '0 */6 * * *', true, NOW() + INTERVAL '6 hours', NOW()),
  ('s2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', '0 0 * * *', true, NOW() + INTERVAL '1 day', NOW()),
  ('s3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', '*/15 * * * *', true, NOW() + INTERVAL '15 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample test executions
INSERT INTO test_executions (id, suite_id, user_id, status, total_requests, passed_requests, failed_requests, avg_response_time, started_at, completed_at) VALUES
  ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'completed', 3, 3, 0, 245.5, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours' + INTERVAL '2 seconds'),
  ('e2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'completed', 3, 3, 0, 512.3, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours' + INTERVAL '3 seconds'),
  ('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'completed', 3, 2, 1, 1234.7, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour' + INTERVAL '5 seconds')
ON CONFLICT (id) DO NOTHING;

-- Insert activity feed entries
INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, description, created_at) VALUES
  ('00000000-0000-0000-0000-000000000000', 'suite_created', 'test_suite', '11111111-1111-1111-1111-111111111111', 'Created test suite: GitHub API Test Suite', NOW() - INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000000000000', 'bug_created', 'bug', 'b1111111-1111-1111-1111-111111111111', 'Reported bug: GitHub API rate limit too restrictive', NOW() - INTERVAL '6 days'),
  ('00000000-0000-0000-0000-000000000000', 'test_run', 'test_execution', 'e1111111-1111-1111-1111-111111111111', 'Ran test suite: GitHub API Test Suite (3/3 passed)', NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0000-000000000000', 'bug_updated', 'bug', 'b5555555-5555-5555-5555-555555555555', 'Resolved bug: NASA API DEMO_KEY has low rate limit', NOW() - INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000000000000', 'suite_created', 'test_suite', '44444444-4444-4444-4444-444444444444', 'Created test suite: Fun APIs Collection', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Insert request history for analytics
INSERT INTO request_history (user_id, url, method, status_code, response_time, created_at) VALUES
  ('00000000-0000-0000-0000-000000000000', 'https://api.github.com/users/octocat', 'GET', 200, 234, NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000000', 'https://pokeapi.co/api/v2/pokemon/pikachu', 'GET', 200, 456, NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000000', 'https://dog.ceo/api/breeds/image/random', 'GET', 200, 123, NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000000', 'https://httpbin.org/delay/2', 'GET', 200, 2045, NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0000-000000000000', 'https://api.github.com/rate_limit', 'GET', 200, 189, NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000000', 'https://catfact.ninja/fact', 'GET', 200, 267, NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0000-000000000000', 'https://api.quotable.io/random', 'GET', 200, 345, NOW() - INTERVAL '7 hours'),
  ('00000000-0000-0000-0000-000000000000', 'https://ipapi.co/json/', 'GET', 200, 512, NOW() - INTERVAL '8 hours')
ON CONFLICT DO NOTHING;
