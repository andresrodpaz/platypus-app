# ⚡ Quick Start - Docker (30 segundos)

## Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado

## Pasos

### 1. Clonar

\`\`\`bash
git clone <tu-repo>
cd platypus-qa-lab
\`\`\`

### 2. Iniciar

\`\`\`bash
docker-compose up -d
\`\`\`

### 3. Acceder

Abre: **http://localhost:3000**

## ¡Eso es todo!

La base de datos se inicializa automáticamente con:
- ✅ 4 usuarios de prueba
- ✅ 4 test suites configurados
- ✅ 6+ requests de ejemplo
- ✅ 3 bugs de muestra
- ✅ 3 API mocks

## Comandos Útiles

\`\`\`bash
# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reiniciar base de datos
docker-compose down -v && docker-compose up -d

# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d platypus_qa
\`\`\`

## Verificar Instalación

\`\`\`bash
# Ver servicios
docker-compose ps

# Verificar datos
docker-compose exec postgres psql -U postgres -d platypus_qa -c "SELECT COUNT(*) FROM test_suites;"
\`\`\`

## Problemas?

\`\`\`bash
# Reset completo
docker-compose down -v
docker-compose up -d
\`\`\`

## Documentación Completa

Ver: [DOCKER-SETUP.md](./DOCKER-SETUP.md)
