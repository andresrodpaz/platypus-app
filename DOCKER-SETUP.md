# 🐳 Docker Setup - Platypus QA Lab

## 🚀 Inicio Rápido (2 minutos)

### 1. Clonar y Preparar

\`\`\`bash
# Clonar el repositorio
git clone <tu-repo>
cd platypus-qa-lab

# El archivo .env.local ya está configurado y listo para usar
# No necesitas modificar nada
\`\`\`

### 2. Iniciar con Docker

\`\`\`bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs (opcional)
docker-compose logs -f
\`\`\`

### 3. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:3000**

¡Eso es todo! La base de datos se inicializa automáticamente con datos de prueba.

---

## 📋 Comandos Útiles

### Gestión de Contenedores

\`\`\`bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f app
docker-compose logs -f postgres

# Reiniciar un servicio
docker-compose restart app
docker-compose restart postgres

# Ver estado de servicios
docker-compose ps
\`\`\`

### Base de Datos

\`\`\`bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d platypus_qa

# Ver tablas
docker-compose exec postgres psql -U postgres -d platypus_qa -c "\dt"

# Ejecutar consulta
docker-compose exec postgres psql -U postgres -d platypus_qa -c "SELECT COUNT(*) FROM test_suites;"

# Re-inicializar base de datos
./scripts/run-init.sh

# Backup de base de datos
docker-compose exec postgres pg_dump -U postgres platypus_qa > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres platypus_qa < backup.sql
\`\`\`

### Limpieza

\`\`\`bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también los volúmenes (CUIDADO: borra todos los datos)
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Reset completo (empezar desde cero)
docker-compose down -v
docker volume rm platypus-qa-postgres-data
docker-compose up -d
\`\`\`

---

## 🔧 Configuración Avanzada

### Variables de Entorno

El archivo `.env.local` ya está configurado con valores por defecto que funcionan con Docker.

**Valores importantes:**

\`\`\`env
# Base de datos (no cambiar para Docker local)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/platypus_qa

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features habilitados
NEXT_PUBLIC_ENABLE_AI_HUMOR=true
NEXT_PUBLIC_ENABLE_SCHEDULED_TESTS=true
\`\`\`

### Cambiar Puerto de PostgreSQL

Si el puerto 5432 está ocupado:

\`\`\`bash
# Editar docker-compose.yml
ports:
  - "5433:5432"  # Cambiar 5432 a 5433

# O usar variable de entorno
POSTGRES_PORT=5433 docker-compose up -d
\`\`\`

### Cambiar Puerto de la Aplicación

\`\`\`bash
# Editar docker-compose.yml
ports:
  - "3001:3000"  # Cambiar 3000 a 3001
\`\`\`

---

## 🐛 Solución de Problemas

### La aplicación no inicia

\`\`\`bash
# Ver logs detallados
docker-compose logs app

# Verificar que PostgreSQL esté listo
docker-compose exec postgres pg_isready -U postgres

# Reiniciar servicios
docker-compose restart
\`\`\`

### Error de conexión a la base de datos

\`\`\`bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Verificar logs de PostgreSQL
docker-compose logs postgres

# Verificar la red
docker network ls | grep platypus
\`\`\`

### La base de datos está vacía

\`\`\`bash
# Re-ejecutar script de inicialización
./scripts/run-init.sh

# O manualmente
docker-compose exec -T postgres psql -U postgres -d platypus_qa < ./scripts/init.sql
\`\`\`

### Puerto ya en uso

\`\`\`bash
# Ver qué está usando el puerto 3000
lsof -i :3000

# O en Windows
netstat -ano | findstr :3000

# Cambiar el puerto en docker-compose.yml
\`\`\`

### Permisos en Linux

\`\`\`bash
# Dar permisos al script
chmod +x scripts/run-init.sh

# Si hay problemas con volúmenes
sudo chown -R $USER:$USER .
\`\`\`

### Limpiar todo y empezar de nuevo

\`\`\`bash
# Reset completo
docker-compose down -v
docker system prune -a --volumes
docker-compose up -d --build
\`\`\`

---

## 📊 Verificación de la Instalación

### 1. Verificar Servicios

\`\`\`bash
docker-compose ps
\`\`\`

Deberías ver:
- ✅ `platypus-qa-app` - Estado: Up
- ✅ `platypus-qa-postgres` - Estado: Up (healthy)

### 2. Verificar Base de Datos

\`\`\`bash
docker-compose exec postgres psql -U postgres -d platypus_qa -c "
SELECT 
  (SELECT COUNT(*) FROM user_profiles) as users,
  (SELECT COUNT(*) FROM test_suites) as suites,
  (SELECT COUNT(*) FROM test_requests) as requests,
  (SELECT COUNT(*) FROM bugs) as bugs,
  (SELECT COUNT(*) FROM api_mocks) as mocks;
"
\`\`\`

Deberías ver datos de prueba:
- 4 usuarios
- 4 test suites
- 6+ test requests
- 3 bugs
- 3 mocks

### 3. Verificar Aplicación

\`\`\`bash
# Health check
curl http://localhost:3000/api/health

# O abrir en navegador
open http://localhost:3000
\`\`\`

---

## 🔄 Desarrollo con Hot Reload

Para desarrollo con recarga automática, usa `docker-compose.dev.yml`:

\`\`\`bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.dev.yml up

# Los cambios en el código se reflejarán automáticamente
\`\`\`

---

## 📦 Construcción de Imágenes

### Construcción Local

\`\`\`bash
# Construir imagen de producción
docker build -t platypus-qa-lab:latest .

# Construir imagen de desarrollo
docker build -f Dockerfile.dev -t platypus-qa-lab:dev .

# Construir sin caché
docker-compose build --no-cache
\`\`\`

### Optimización de Imágenes

\`\`\`bash
# Ver tamaño de imágenes
docker images | grep platypus

# Limpiar imágenes antiguas
docker image prune -a
\`\`\`

---

## 🚢 Despliegue

### Exportar Imagen

\`\`\`bash
# Guardar imagen
docker save platypus-qa-lab:latest | gzip > platypus-qa-lab.tar.gz

# Cargar imagen en otro servidor
gunzip -c platypus-qa-lab.tar.gz | docker load
\`\`\`

### Docker Hub

\`\`\`bash
# Tag imagen
docker tag platypus-qa-lab:latest username/platypus-qa-lab:latest

# Push a Docker Hub
docker push username/platypus-qa-lab:latest
\`\`\`

---

## 📝 Notas Importantes

1. **Primer Inicio**: La base de datos se inicializa automáticamente en el primer arranque
2. **Datos Persistentes**: Los datos se guardan en el volumen `platypus-qa-postgres-data`
3. **Sin Costos**: Todo funciona localmente sin servicios externos
4. **Producción**: Para producción, configura Supabase en `.env.local`

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica el estado: `docker-compose ps`
3. Consulta la documentación: `/docs`
4. Abre un issue en GitHub

---

## ✅ Checklist de Instalación

- [ ] Docker y Docker Compose instalados
- [ ] Repositorio clonado
- [ ] `.env.local` existe (ya está incluido)
- [ ] `docker-compose up -d` ejecutado
- [ ] Servicios corriendo: `docker-compose ps`
- [ ] Base de datos inicializada: `./scripts/run-init.sh`
- [ ] Aplicación accesible: http://localhost:3000
- [ ] Datos de prueba visibles en la UI

¡Listo para empezar a testear APIs! 🎉
