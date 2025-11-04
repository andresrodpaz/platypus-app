import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing Supabase credentials")
  console.error("Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Test users data
const testUsers = [
  {
    email: "qa.lead@platypuslab.test",
    password: "TestPass123!",
    full_name: "Sarah Martinez",
    role: "QA Lead",
    avatar_seed: "SarahMartinez",
  },
  {
    email: "senior.qa@platypuslab.test",
    password: "TestPass123!",
    full_name: "Michael Chen",
    role: "Senior QA Engineer",
    avatar_seed: "MichaelChen",
  },
  {
    email: "qa.engineer@platypuslab.test",
    password: "TestPass123!",
    full_name: "Emma Johnson",
    role: "QA Engineer",
    avatar_seed: "EmmaJohnson",
  },
  {
    email: "junior.qa@platypuslab.test",
    password: "TestPass123!",
    full_name: "Alex Rivera",
    role: "Junior QA Engineer",
    avatar_seed: "AlexRivera",
  },
  {
    email: "automation.qa@platypuslab.test",
    password: "TestPass123!",
    full_name: "Priya Patel",
    role: "QA Automation Engineer",
    avatar_seed: "PriyaPatel",
  },
]

async function createTestUser(userData) {
  try {
    console.log(`\n🦦 Creating user: ${userData.email}`)

    // Create auth user using Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email so they can log in immediately
      user_metadata: {
        full_name: userData.full_name,
      },
    })

    if (authError) {
      // Check if user already exists
      if (authError.message.includes("already registered")) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`)
        return { success: true, existed: true }
      }
      throw authError
    }

    console.log(`✅ Auth user created with ID: ${authData.user.id}`)

    // Update the user profile (created by trigger) with additional data
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        role: userData.role,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatar_seed}`,
      })
      .eq("id", authData.user.id)

    if (profileError) {
      console.log(`⚠️  Warning: Could not update profile: ${profileError.message}`)
    } else {
      console.log(`✅ Profile updated for ${userData.full_name}`)
    }

    return { success: true, existed: false, userId: authData.user.id }
  } catch (error) {
    console.error(`❌ Error creating user ${userData.email}:`, error.message)
    return { success: false, error: error.message }
  }
}

async function seedTestUsers() {
  console.log("🦦 Platypus QA Lab - Test User Seeder")
  console.log("=====================================\n")
  console.log(`Creating ${testUsers.length} test users...\n`)

  const results = {
    created: 0,
    existed: 0,
    failed: 0,
  }

  for (const userData of testUsers) {
    const result = await createTestUser(userData)
    if (result.success) {
      if (result.existed) {
        results.existed++
      } else {
        results.created++
      }
    } else {
      results.failed++
    }
  }

  console.log("\n=====================================")
  console.log("📊 Summary:")
  console.log(`✅ Created: ${results.created}`)
  console.log(`⚠️  Already existed: ${results.existed}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log("\n🎉 Test users are ready to use!")
  console.log("\n📝 Login credentials:")
  console.log("   Email: Any of the emails above")
  console.log("   Password: TestPass123!")
  console.log("\n🦦 The platypus approves! Happy testing!")
}

// Run the seeder
seedTestUsers().catch(console.error)
