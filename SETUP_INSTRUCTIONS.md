# Platypus QA Lab - Database Setup Instructions

## Order of Execution

Execute the SQL scripts in this **EXACT ORDER**:

### 1. Clean Database (Optional - only if resetting)
\`\`\`
scripts/000_cleanup.sql
\`\`\`
This will delete all existing data and tables. **Only run this if you want to start fresh.**

### 2. Create Tables
\`\`\`
scripts/001_create_tables.sql
\`\`\`
Creates all database tables, indexes, and triggers.

### 3. Setup Public Policies
\`\`\`
scripts/002_setup_public_policies.sql
\`\`\`
Configures Row Level Security policies for public access and creates the default public user.

### 4. Seed Test Data
\`\`\`
scripts/004_seed_test_data.sql
\`\`\`
Adds sample test suites, bugs, mocks, and monitoring data for demo purposes.

## How to Execute

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each script in order
4. Click "Run" for each script
5. Verify no errors appear

## Verification

After running all scripts, verify the setup:

\`\`\`sql
-- Check that tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check that the public user exists
SELECT * FROM user_profiles 
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Check that test suites were created
SELECT COUNT(*) FROM test_suites;

-- Check that bugs were created
SELECT COUNT(*) FROM bugs;
\`\`\`

You should see:
- 12 tables created
- 1 public user profile
- 5 test suites
- 5 bugs

## Troubleshooting

If you get errors:

1. **Foreign key constraint errors**: Make sure you ran scripts in order
2. **RLS policy errors**: Run script 002 again
3. **Duplicate key errors**: Run script 000 to clean up, then start over

## What Each Script Does

- **000_cleanup.sql**: Drops all tables and resets the database
- **001_create_tables.sql**: Creates the schema without auth dependencies
- **002_setup_public_policies.sql**: Sets up RLS policies for public access
- **004_seed_test_data.sql**: Adds realistic demo data
