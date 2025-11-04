#!/bin/bash

# Check if all required environment variables are set

echo "🔍 Checking environment variables..."
echo ""

REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

MISSING_VARS=()

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "   Run: cp .env.example .env.local"
    exit 1
fi

# Source the .env.local file
set -a
source .env.local
set +a

# Check each required variable
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

# Report results
if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required environment variables are set!"
    echo ""
    echo "Configuration:"
    echo "  Supabase URL: ${NEXT_PUBLIC_SUPABASE_URL}"
    echo "  AI Humor: ${NEXT_PUBLIC_ENABLE_AI_HUMOR:-false}"
    echo "  Email Notifications: ${NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS:-false}"
    echo ""
    exit 0
else
    echo "❌ Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please edit .env.local and add these variables"
    exit 1
fi
