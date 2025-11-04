#!/bin/bash

# Script para ejecutar manualmente la inicialización de la base de datos
# Uso: ./scripts/run-init.sh

set -e

echo "🐘 Platypus QA Lab - Database Initialization"
echo "=============================================="
echo ""

# Verificar que Docker Compose esté corriendo
if ! docker-compose ps | grep -q "platypus-qa-postgres.*Up"; then
    echo "❌ Error: PostgreSQL container is not running"
    echo "   Run: docker-compose up -d postgres"
    exit 1
fi

echo "✓ PostgreSQL container is running"
echo ""

# Esperar a que PostgreSQL esté listo
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done
echo "✓ PostgreSQL is ready"
echo ""

# Ejecutar el script de inicialización
echo "🚀 Running init.sql..."
docker-compose exec -T postgres psql -U postgres -d platypus_qa < ./scripts/init.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database initialized successfully!"
    echo ""
    echo "📊 Verification:"
    docker-compose exec -T postgres psql -U postgres -d platypus_qa -c "SELECT 
        (SELECT COUNT(*) FROM user_profiles) as users,
        (SELECT COUNT(*) FROM test_suites) as suites,
        (SELECT COUNT(*) FROM test_requests) as requests,
        (SELECT COUNT(*) FROM bugs) as bugs,
        (SELECT COUNT(*) FROM api_mocks) as mocks;"
    echo ""
    echo "🎉 Ready to go! Visit http://localhost:3000"
else
    echo ""
    echo "❌ Error: Database initialization failed"
    echo "   Check the logs above for details"
    exit 1
fi
