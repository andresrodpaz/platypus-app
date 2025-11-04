#!/bin/bash

# Platypus QA Lab - Automated Setup Script
# This script helps you set up the application quickly

set -e

echo "🦦 Welcome to Platypus QA Lab Setup!"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
    else
        cp .env.example .env.local
        echo "✅ Created new .env.local from .env.example"
    fi
else
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
fi

echo ""
echo "📝 Now you need to configure your Supabase credentials:"
echo ""
echo "1. Go to https://app.supabase.com"
echo "2. Create a new project (or select existing)"
echo "3. Go to Settings → API"
echo "4. Copy the following values:"
echo "   - Project URL"
echo "   - anon public key"
echo "   - service_role key"
echo ""

read -p "Press Enter when you have your Supabase credentials ready..."

echo ""
echo "Opening .env.local for editing..."
echo ""

# Open .env.local in default editor
if command -v code &> /dev/null; then
    code .env.local
elif command -v nano &> /dev/null; then
    nano .env.local
elif command -v vim &> /dev/null; then
    vim .env.local
else
    echo "Please edit .env.local manually with your favorite editor"
fi

echo ""
read -p "Have you saved your Supabase credentials in .env.local? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please edit .env.local and run this script again"
    exit 1
fi

echo ""
echo "🚀 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ Setup complete!"
echo ""
echo "🦦 Platypus QA Lab is now running at:"
echo "   http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f     # View logs"
echo "  docker-compose down        # Stop services"
echo "  docker-compose restart     # Restart services"
echo ""
echo "Happy testing! 🚀"
