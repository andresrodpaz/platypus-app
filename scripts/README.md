# Scripts de Base de Datos

## 📋 Resumen

Este directorio contiene **UN SOLO SCRIPT** necesario para configurar la base de datos completa de Platypus QA Lab.

## 🚀 Script Principal

### `init.sql` - Script Único de Configuración

Este es el **ÚNICO** script que necesitas ejecutar. Es completamente **IDEMPOTENTE** (puedes ejecutarlo múltiples veces sin errores).

**Incluye:**
- ✅ Limpieza completa de tablas existentes
- ✅ Creación de extensiones (uuid-ossp)
- ✅ Creación de todas las tablas con relaciones
- ✅ Índices para optimización de consultas
- ✅ Row Level Security (RLS) con políticas públicas
- ✅ Funciones y triggers para timestamps automáticos
- ✅ Datos de prueba completos (usuarios, suites, bugs, mocks)

## 🐳 Ejecución con Docker

### Opción 1: Automática (Recomendada)

El script se ejecuta **automáticamente** cuando inicias Docker Compose por primera vez:

\`\`\`bash
docker-compose up -d
\`\`\`

El contenedor de PostgreSQL ejecutará `init.sql` automáticamente en el primer arranque.

### Opción 2: Manual

Si necesitas re-ejecutar el script:

\`\`\`bash
# Dentro del contenedor
docker-compose exec postgres psql -U postgres -d platypus_qa -f /docker-entrypoint-initdb.d/01-init.sql

# Desde tu máquina local
docker-compose exec -T postgres psql -U postgres -d platypus_qa < ./scripts/init.sql
\`\`\`

### Opción 3: Reset Completo

Para empezar desde cero:

\`\`\`bash
# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar (ejecutará init.sql automáticamente)
docker-compose up -d
\`\`\`

## 📊 Verificar la Instalación

\`\`\`bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d platypus_qa

# Verificar tablas
\dt

# Verificar datos de prueba
SELECT COUNT(*) FROM user_profiles;
SELECT COUNT(*) FROM test_suites;
SELECT COUNT(*) FROM bugs;

# Salir
\q
\`\`\`

## 🗂️ Scripts Antiguos (Deprecados)

Los siguientes scripts están **deprecados** y ya NO son necesarios:

- ❌ `000_cleanup.sql` - Incluido en init.sql
- ❌ `001_create_tables.sql` - Incluido en init.sql
- ❌ `002_make_public.sql` - Incluido en init.sql
- ❌ `002_setup_public_policies.sql` - Incluido en init.sql
- ❌ `003_fix_rls_policies.sql` - Incluido en init.sql
- ❌ `004_seed_test_data.sql` - Incluido en init.sql
- ❌ `005_enable_realtime.sql` - No necesario
- ❌ `006_make_suite_id_nullable.sql` - No necesario
- ❌ `MASTER_SETUP.sql` - Reemplazado por init.sql

**Estos scripts se mantienen solo por referencia histórica.**

## 🔧 Solución de Problemas

### El script no se ejecuta automáticamente

\`\`\`bash
# Verificar que el volumen esté limpio
docker-compose down -v
docker volume rm platypus-qa-postgres-data
docker-compose up -d
\`\`\`

### Error de permisos

\`\`\`bash
# Asegurar que el script tenga permisos de lectura
chmod +r scripts/init.sql
\`\`\`

### Verificar logs de PostgreSQL

\`\`\`bash
docker-compose logs postgres
\`\`\`

## 📝 Notas Importantes

1. **Idempotencia**: Puedes ejecutar `init.sql` múltiples veces sin problemas
2. **Datos de Prueba**: El script incluye datos de ejemplo listos para usar
3. **RLS Público**: Las políticas permiten acceso completo para demo (ajustar en producción)
4. **Sin Dependencias**: No requiere Supabase Auth ni servicios externos

## 🎯 Próximos Pasos

Después de ejecutar el script:

1. Verifica que la app esté corriendo: http://localhost:3000
2. Los datos de prueba estarán disponibles inmediatamente
3. Puedes empezar a crear tus propios test suites

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs postgres`
2. Verifica la conexión: `docker-compose exec postgres pg_isready`
3. Consulta la documentación en `/docs`
