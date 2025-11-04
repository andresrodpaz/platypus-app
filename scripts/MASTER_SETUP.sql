-- ============================================
-- PLATYPUS QA LAB - MASTER SETUP SCRIPT
-- ============================================
-- Este script es IDEMPOTENTE - puedes ejecutarlo múltiples veces sin errores
-- Ejecuta SOLO este script para configurar toda la base de datos

-- Paso 1: LIMPIEZA COMPLETA
-- ============================================
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_test_suites_updated_at ON test_suites;
DROP TRIGGER IF EXISTS update_bugs_updated_at ON bugs;

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

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Paso 2: CREAR EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Paso 3: CREAR TABLAS (SIN FOREIGN KEYS A AUTH.USERS)
-- ============================================

-- User Profiles (standalone para demo público)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'tester' CHECK (role IN ('tester', 'lead_qa', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Suites
CREATE TABLE test_suites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Requests
CREATE TABLE test_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  headers JSONB DEFAULT '{}',
  body TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Executions
CREATE TABLE test_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  total_requests INTEGER DEFAULT 0,
  passed_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time NUMERIC,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Test Results
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID REFERENCES test_executions(id) ON DELETE CASCADE,
  request_id UUID REFERENCES test_requests(id) ON DELETE CASCADE,
  status_code INTEGER,
  response_time NUMERIC,
  response_body TEXT,
  error_message TEXT,
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Mocks
CREATE TABLE api_mocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  status_code INTEGER DEFAULT 200,
  response_body TEXT,
  response_headers JSONB DEFAULT '{}',
  latency_ms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assertions
CREATE TABLE assertions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES test_requests(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('status_code', 'response_time', 'json_schema', 'regex', 'contains')),
  expected_value TEXT NOT NULL,
  operator TEXT DEFAULT 'equals' CHECK (operator IN ('equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'matches')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled Tests
CREATE TABLE scheduled_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  cron_expression TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  notification_email TEXT,
  notification_slack_webhook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bugs
CREATE TABLE bugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  endpoint TEXT,
  request_id UUID REFERENCES test_requests(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bug Comments
CREATE TABLE bug_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bug_id UUID REFERENCES bugs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Feed
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('test_run', 'bug_created', 'bug_updated', 'suite_created', 'comment_added')),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Request History
CREATE TABLE request_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 4: CREAR ÍNDICES
-- ============================================
CREATE INDEX idx_test_suites_user_id ON test_suites(user_id);
CREATE INDEX idx_test_requests_suite_id ON test_requests(suite_id);
CREATE INDEX idx_test_executions_suite_id ON test_executions(suite_id);
CREATE INDEX idx_test_results_execution_id ON test_results(execution_id);
CREATE INDEX idx_bugs_user_id ON bugs(user_id);
CREATE INDEX idx_bugs_assigned_to ON bugs(assigned_to);
CREATE INDEX idx_bug_comments_bug_id ON bug_comments(bug_id);
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_request_history_user_id ON request_history(user_id);

-- Paso 5: CONFIGURAR RLS (POLÍTICAS PÚBLICAS)
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_suites ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_mocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assertions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Public read access" ON user_profiles;
DROP POLICY IF EXISTS "Public insert access" ON user_profiles;
DROP POLICY IF EXISTS "Public update access" ON user_profiles;
DROP POLICY IF EXISTS "Public delete access" ON user_profiles;

DROP POLICY IF EXISTS "Public read access" ON test_suites;
DROP POLICY IF EXISTS "Public insert access" ON test_suites;
DROP POLICY IF EXISTS "Public update access" ON test_suites;
DROP POLICY IF EXISTS "Public delete access" ON test_suites;

DROP POLICY IF EXISTS "Public read access" ON test_requests;
DROP POLICY IF EXISTS "Public insert access" ON test_requests;
DROP POLICY IF EXISTS "Public update access" ON test_requests;
DROP POLICY IF EXISTS "Public delete access" ON test_requests;

DROP POLICY IF EXISTS "Public read access" ON test_executions;
DROP POLICY IF EXISTS "Public insert access" ON test_executions;
DROP POLICY IF EXISTS "Public update access" ON test_executions;
DROP POLICY IF EXISTS "Public delete access" ON test_executions;

DROP POLICY IF EXISTS "Public read access" ON test_results;
DROP POLICY IF EXISTS "Public insert access" ON test_results;
DROP POLICY IF EXISTS "Public update access" ON test_results;
DROP POLICY IF EXISTS "Public delete access" ON test_results;

DROP POLICY IF EXISTS "Public read access" ON api_mocks;
DROP POLICY IF EXISTS "Public insert access" ON api_mocks;
DROP POLICY IF EXISTS "Public update access" ON api_mocks;
DROP POLICY IF EXISTS "Public delete access" ON api_mocks;

DROP POLICY IF EXISTS "Public read access" ON assertions;
DROP POLICY IF EXISTS "Public insert access" ON assertions;
DROP POLICY IF EXISTS "Public update access" ON assertions;
DROP POLICY IF EXISTS "Public delete access" ON assertions;

DROP POLICY IF EXISTS "Public read access" ON scheduled_tests;
DROP POLICY IF EXISTS "Public insert access" ON scheduled_tests;
DROP POLICY IF EXISTS "Public update access" ON scheduled_tests;
DROP POLICY IF EXISTS "Public delete access" ON scheduled_tests;

DROP POLICY IF EXISTS "Public read access" ON bugs;
DROP POLICY IF EXISTS "Public insert access" ON bugs;
DROP POLICY IF EXISTS "Public update access" ON bugs;
DROP POLICY IF EXISTS "Public delete access" ON bugs;

DROP POLICY IF EXISTS "Public read access" ON bug_comments;
DROP POLICY IF EXISTS "Public insert access" ON bug_comments;
DROP POLICY IF EXISTS "Public update access" ON bug_comments;
DROP POLICY IF EXISTS "Public delete access" ON bug_comments;

DROP POLICY IF EXISTS "Public read access" ON activity_feed;
DROP POLICY IF EXISTS "Public insert access" ON activity_feed;
DROP POLICY IF EXISTS "Public update access" ON activity_feed;
DROP POLICY IF EXISTS "Public delete access" ON activity_feed;

DROP POLICY IF EXISTS "Public read access" ON request_history;
DROP POLICY IF EXISTS "Public insert access" ON request_history;
DROP POLICY IF EXISTS "Public update access" ON request_history;
DROP POLICY IF EXISTS "Public delete access" ON request_history;

-- Crear políticas públicas (permitir todo)
CREATE POLICY "Public read access" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON user_profiles FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON user_profiles FOR DELETE USING (true);

CREATE POLICY "Public read access" ON test_suites FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON test_suites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON test_suites FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON test_suites FOR DELETE USING (true);

CREATE POLICY "Public read access" ON test_requests FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON test_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON test_requests FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON test_requests FOR DELETE USING (true);

CREATE POLICY "Public read access" ON test_executions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON test_executions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON test_executions FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON test_executions FOR DELETE USING (true);

CREATE POLICY "Public read access" ON test_results FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON test_results FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON test_results FOR DELETE USING (true);

CREATE POLICY "Public read access" ON api_mocks FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON api_mocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON api_mocks FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON api_mocks FOR DELETE USING (true);

CREATE POLICY "Public read access" ON assertions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON assertions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON assertions FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON assertions FOR DELETE USING (true);

CREATE POLICY "Public read access" ON scheduled_tests FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON scheduled_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON scheduled_tests FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON scheduled_tests FOR DELETE USING (true);

CREATE POLICY "Public read access" ON bugs FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON bugs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON bugs FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON bugs FOR DELETE USING (true);

CREATE POLICY "Public read access" ON bug_comments FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON bug_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON bug_comments FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON bug_comments FOR DELETE USING (true);

CREATE POLICY "Public read access" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON activity_feed FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON activity_feed FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON activity_feed FOR DELETE USING (true);

CREATE POLICY "Public read access" ON request_history FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON request_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON request_history FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON request_history FOR DELETE USING (true);

-- Paso 6: CREAR FUNCIONES Y TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_suites_updated_at 
  BEFORE UPDATE ON test_suites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bugs_updated_at 
  BEFORE UPDATE ON bugs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Paso 7: INSERTAR DATOS DE PRUEBA
-- ============================================

-- Usuario público por defecto
INSERT INTO user_profiles (id, email, full_name, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo@platypus.qa',
  'Demo User',
  'admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
);

-- Usuarios adicionales
INSERT INTO user_profiles (email, full_name, role, avatar_url) VALUES
  ('alice@platypus.qa', 'Alice Johnson', 'lead_qa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'),
  ('bob@platypus.qa', 'Bob Smith', 'tester', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'),
  ('charlie@platypus.qa', 'Charlie Brown', 'tester', 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie');

-- Test Suites
INSERT INTO test_suites (user_id, name, description, is_shared) VALUES
  ('00000000-0000-0000-0000-000000000000', 'JSONPlaceholder API Tests', 'Complete test suite for JSONPlaceholder REST API', true),
  ('00000000-0000-0000-0000-000000000000', 'GitHub API Integration', 'Tests for GitHub public API endpoints', true),
  ('00000000-0000-0000-0000-000000000000', 'Pokemon API Tests', 'Gotta test em all!', true),
  ('00000000-0000-0000-0000-000000000000', 'HTTPBin Echo Tests', 'Testing various HTTP methods and responses', true),
  ('00000000-0000-0000-0000-000000000000', 'E-commerce API Suite', 'Product catalog and cart operations', false);

-- Test Requests (usando los IDs de las suites creadas)
INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Get All Posts',
  'https://jsonplaceholder.typicode.com/posts',
  'GET',
  '{"Content-Type": "application/json"}',
  NULL,
  1
FROM test_suites ts WHERE ts.name = 'JSONPlaceholder API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Get Single Post',
  'https://jsonplaceholder.typicode.com/posts/1',
  'GET',
  '{"Content-Type": "application/json"}',
  NULL,
  2
FROM test_suites ts WHERE ts.name = 'JSONPlaceholder API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Create New Post',
  'https://jsonplaceholder.typicode.com/posts',
  'POST',
  '{"Content-Type": "application/json"}',
  '{"title": "Test Post", "body": "This is a test", "userId": 1}',
  3
FROM test_suites ts WHERE ts.name = 'JSONPlaceholder API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Update Post',
  'https://jsonplaceholder.typicode.com/posts/1',
  'PUT',
  '{"Content-Type": "application/json"}',
  '{"id": 1, "title": "Updated Title", "body": "Updated body", "userId": 1}',
  4
FROM test_suites ts WHERE ts.name = 'JSONPlaceholder API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Delete Post',
  'https://jsonplaceholder.typicode.com/posts/1',
  'DELETE',
  '{"Content-Type": "application/json"}',
  NULL,
  5
FROM test_suites ts WHERE ts.name = 'JSONPlaceholder API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Get Pikachu',
  'https://pokeapi.co/api/v2/pokemon/pikachu',
  'GET',
  '{"Content-Type": "application/json"}',
  NULL,
  1
FROM test_suites ts WHERE ts.name = 'Pokemon API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'Get Charizard',
  'https://pokeapi.co/api/v2/pokemon/charizard',
  'GET',
  '{"Content-Type": "application/json"}',
  NULL,
  2
FROM test_suites ts WHERE ts.name = 'Pokemon API Tests';

INSERT INTO test_requests (suite_id, name, url, method, headers, body, order_index)
SELECT 
  ts.id,
  'HTTPBin POST Echo',
  'https://httpbin.org/post',
  'POST',
  '{"Content-Type": "application/json"}',
  '{"test": "data", "timestamp": "2024-01-01"}',
  1
FROM test_suites ts WHERE ts.name = 'HTTPBin Echo Tests';

-- API Mocks
INSERT INTO api_mocks (user_id, name, path, method, status_code, response_body, latency_ms, is_active) VALUES
  ('00000000-0000-0000-0000-000000000000', 'User Login Success', '/api/auth/login', 'POST', 200, '{"token": "mock-jwt-token", "user": {"id": 1, "email": "test@example.com"}}', 100, true),
  ('00000000-0000-0000-0000-000000000000', 'User Login Failed', '/api/auth/login', 'POST', 401, '{"error": "Invalid credentials"}', 50, false),
  ('00000000-0000-0000-0000-000000000000', 'Get Products', '/api/products', 'GET', 200, '[{"id": 1, "name": "Product 1", "price": 29.99}, {"id": 2, "name": "Product 2", "price": 49.99}]', 150, true),
  ('00000000-0000-0000-0000-000000000000', 'Server Error', '/api/error', 'GET', 500, '{"error": "Internal server error"}', 1000, true),
  ('00000000-0000-0000-0000-000000000000', 'Slow Response', '/api/slow', 'GET', 200, '{"message": "This took a while"}', 5000, false);

-- Bugs
INSERT INTO bugs (user_id, title, description, severity, status, endpoint)
SELECT 
  id,
  'API returns 500 on invalid JSON',
  'When sending malformed JSON to /api/users, the server returns 500 instead of 400 Bad Request',
  'high',
  'open',
  'POST /api/users'
FROM user_profiles WHERE email = 'demo@platypus.qa';

INSERT INTO bugs (user_id, title, description, severity, status, endpoint)
SELECT 
  id,
  'Slow response time on /products',
  'The /api/products endpoint takes over 3 seconds to respond during peak hours',
  'medium',
  'in_progress',
  'GET /api/products'
FROM user_profiles WHERE email = 'alice@platypus.qa';

INSERT INTO bugs (user_id, title, description, severity, status, endpoint)
SELECT 
  id,
  'Missing CORS headers',
  'API does not include proper CORS headers, blocking browser requests',
  'critical',
  'open',
  'OPTIONS /api/*'
FROM user_profiles WHERE email = 'bob@platypus.qa';

INSERT INTO bugs (user_id, title, description, severity, status, endpoint)
SELECT 
  id,
  'Pagination not working',
  'The page parameter is ignored in /api/posts?page=2',
  'low',
  'resolved',
  'GET /api/posts'
FROM user_profiles WHERE email = 'charlie@platypus.qa';

INSERT INTO bugs (user_id, title, description, severity, status, endpoint)
SELECT 
  id,
  'Authentication token expires too quickly',
  'JWT tokens expire after 5 minutes instead of the documented 1 hour',
  'high',
  'in_progress',
  'POST /api/auth/login'
FROM user_profiles WHERE email = 'demo@platypus.qa';

-- Bug Comments
INSERT INTO bug_comments (bug_id, user_id, comment)
SELECT 
  b.id,
  u.id,
  'I can reproduce this consistently. Attaching logs.'
FROM bugs b, user_profiles u 
WHERE b.title = 'API returns 500 on invalid JSON' 
  AND u.email = 'alice@platypus.qa'
LIMIT 1;

INSERT INTO bug_comments (bug_id, user_id, comment)
SELECT 
  b.id,
  u.id,
  'Working on a fix. Should be ready by end of week.'
FROM bugs b, user_profiles u 
WHERE b.title = 'Slow response time on /products' 
  AND u.email = 'demo@platypus.qa'
LIMIT 1;

-- Activity Feed
INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, description)
SELECT 
  id,
  'suite_created',
  'test_suite',
  (SELECT id FROM test_suites WHERE name = 'JSONPlaceholder API Tests'),
  'Created test suite "JSONPlaceholder API Tests"'
FROM user_profiles WHERE email = 'demo@platypus.qa';

INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, description)
SELECT 
  id,
  'bug_created',
  'bug',
  (SELECT id FROM bugs WHERE title = 'API returns 500 on invalid JSON'),
  'Reported bug: API returns 500 on invalid JSON'
FROM user_profiles WHERE email = 'demo@platypus.qa';

INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, description)
SELECT 
  id,
  'bug_updated',
  'bug',
  (SELECT id FROM bugs WHERE title = 'Slow response time on /products'),
  'Updated bug status to In Progress'
FROM user_profiles WHERE email = 'alice@platypus.qa';

-- ============================================
-- SETUP COMPLETADO
-- ============================================
-- La base de datos está lista para usar
-- Puedes ejecutar este script múltiples veces sin errores
