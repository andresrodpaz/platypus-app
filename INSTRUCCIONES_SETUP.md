# 🚀 Instrucciones de Setup - Platypus QA Lab

## ⚠️ IMPORTANTE: Ejecuta SOLO este script

Para configurar la base de datos correctamente, sigue estos pasos:

### Paso 1: Abre el SQL Editor de Supabase
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Haz clic en "SQL Editor" en el menú lateral

### Paso 2: Ejecuta el Script Maestro
1. Abre el archivo `scripts/MASTER_SETUP.sql`
2. Copia TODO el contenido del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en "Run" (o presiona Ctrl/Cmd + Enter)

### Paso 3: Verifica que todo funcionó
Deberías ver un mensaje de éxito. El script:
- ✅ Limpia cualquier configuración anterior
- ✅ Crea todas las tablas necesarias
- ✅ Configura políticas RLS públicas
- ✅ Inserta datos de prueba (suites, bugs, mocks, usuarios)

### ¿Qué hace este script?

El script `MASTER_SETUP.sql` es **idempotente**, lo que significa que:
- Puedes ejecutarlo múltiples veces sin errores
- Siempre deja la base de datos en el mismo estado limpio
- No necesitas ejecutar otros scripts

### Contenido incluido:

**Usuarios de prueba:**
- Demo User (admin)
- Alice Johnson (lead_qa)
- Bob Smith (tester)
- Charlie Brown (tester)

**Test Suites:**
- JSONPlaceholder API Tests (5 requests: GET, POST, PUT, DELETE)
- GitHub API Integration
- Pokemon API Tests (Pikachu, Charizard)
- HTTPBin Echo Tests
- E-commerce API Suite

**Bugs de ejemplo:**
- 5 bugs con diferentes severidades (critical, high, medium, low)
- Comentarios en los bugs
- Estados variados (open, in_progress, resolved)

**API Mocks:**
- Login success/failed
- Get products
- Server errors
- Slow responses

**Activity Feed:**
- Actividad reciente de usuarios
- Creación de suites y bugs

### ¿Problemas?

Si encuentras algún error:
1. Ejecuta el script de nuevo (es seguro)
2. Verifica que tienes permisos de administrador en Supabase
3. Revisa que la extensión `uuid-ossp` esté habilitada

### Siguiente paso

Una vez ejecutado el script, tu aplicación estará lista para usar con datos de prueba completos. ¡Disfruta probando Platypus QA Lab! 🦆
