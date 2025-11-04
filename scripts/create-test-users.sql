-- Create test users in the user_profiles table
-- These users can be used for testing the Platypus QA Lab application

-- Test User 1: QA Lead
INSERT INTO user_profiles (id, email, full_name, role, avatar_url, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'qa.lead@platypuslab.test',
  'Sarah Martinez',
  'QA Lead',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  NOW(),
  NOW()
);

-- Test User 2: Senior QA Engineer
INSERT INTO user_profiles (id, email, full_name, role, avatar_url, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'senior.qa@platypuslab.test',
  'Michael Chen',
  'Senior QA Engineer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  NOW(),
  NOW()
);

-- Test User 3: QA Engineer
INSERT INTO user_profiles (id, email, full_name, role, avatar_url, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'qa.engineer@platypuslab.test',
  'Emma Johnson',
  'QA Engineer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  NOW(),
  NOW()
);

-- Test User 4: Junior QA Engineer
INSERT INTO user_profiles (id, email, full_name, role, avatar_url, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'junior.qa@platypuslab.test',
  'Alex Rivera',
  'Junior QA Engineer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  NOW(),
  NOW()
);

-- Test User 5: QA Automation Engineer
INSERT INTO user_profiles (id, email, full_name, role, avatar_url, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'automation.qa@platypuslab.test',
  'Priya Patel',
  'QA Automation Engineer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  NOW(),
  NOW()
);

-- Display the created test users
SELECT id, email, full_name, role, created_at 
FROM user_profiles 
WHERE email LIKE '%@platypuslab.test'
ORDER BY created_at DESC;
