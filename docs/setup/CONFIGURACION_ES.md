# Guía de Configuración - Platypus QA Lab

Esta guía te explica cómo obtener todas las variables de entorno necesarias y cómo usar los usuarios de prueba.

## 📋 Variables de Entorno

### Variables de Supabase (Ya Configuradas ✅)

**¡Buenas noticias!** Si estás trabajando en -, todas estas variables ya están configuradas automáticamente:

- `SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - URL pública para el cliente
- `SUPABASE_ANON_KEY` - Clave anónima para acceso público
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima pública
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio para operaciones admin
- `SUPABASE_JWT_SECRET` - Secreto JWT para autenticación
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` - URL de redirección para desarrollo

**No necesitas hacer nada con estas variables en -.**

### Variable de Email (Necesitas Configurar) 📧

Para enviar notificaciones por email cuando los tests fallen, necesitas configurar Resend:

#### Paso 1: Crear Cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en "Sign Up" (Registrarse)
3. Crea tu cuenta con tu email
4. Verifica tu email

#### Paso 2: Obtener tu API Key

1. Inicia sesión en [resend.com](https://resend.com)
2. En el menú lateral, haz clic en **"API Keys"**
3. Haz clic en **"Create API Key"**
4. Dale un nombre (por ejemplo: "Platypus QA Lab")
5. Copia la clave que empieza con `re_`

#### Paso 3: Agregar la Variable en -

1. En -, abre el menú lateral izquierdo
2. Haz clic en **"Vars"** (Variables)
3. Haz clic en **"Add Variable"**
4. Nombre: `RESEND_API_KEY`
5. Valor: Pega tu clave de Resend (ejemplo: `re_abc123xyz...`)
6. Haz clic en **"Save"**

**Plan Gratuito de Resend:**
- 3,000 emails por mes
- 100 emails por día
- Todas las funciones incluidas
- No requiere tarjeta de crédito

## 👥 Usuarios de Prueba

He creado 5 usuarios de prueba que puedes usar para probar la aplicación. Todos tienen la misma contraseña para facilitar las pruebas.

### Credenciales de Acceso

**Contraseña para todos:** `TestPass123!`

| Email | Nombre | Rol |
|-------|--------|-----|
| `qa.lead@platypuslab.test` | Sarah Martinez | QA Lead |
| `senior.qa@platypuslab.test` | Michael Chen | Senior QA Engineer |
| `qa.engineer@platypuslab.test` | Emma Johnson | QA Engineer |
| `junior.qa@platypuslab.test` | Alex Rivera | Junior QA Engineer |
| `automation.qa@platypuslab.test` | Priya Patel | QA Automation Engineer |

### Cómo Usar los Usuarios de Prueba

1. **Ejecutar el Script de Creación:**
   - En -, busca el archivo `scripts/seed-test-users.js`
   - Haz clic en el botón de **ejecutar** (▶️) en la parte superior del archivo
   - El script creará automáticamente los 5 usuarios de prueba en Supabase
   - Verás mensajes de confirmación en la consola

2. **Iniciar Sesión:**
   - Ve a la página de login: `/auth/login`
   - Usa cualquiera de los emails de arriba
   - Contraseña: `TestPass123!`
   - Haz clic en "Login"

3. **Probar Diferentes Roles:**
   - Cada usuario tiene un rol diferente
   - Puedes probar cómo se ve la aplicación desde diferentes perspectivas
   - Los avatares son únicos para cada usuario

### Características de los Usuarios de Prueba

- ✅ **Email confirmado:** No necesitan verificar su email
- ✅ **Perfiles completos:** Tienen nombre, rol y avatar
- ✅ **Listos para usar:** Pueden crear tests, suites y reportar bugs inmediatamente
- ✅ **Contraseña simple:** Fácil de recordar para pruebas

## 🚀 Configuración Completa

### Resumen de Pasos

1. **Variables de Supabase:** ✅ Ya configuradas en -
2. **API Key de Resend:** 📧 Necesitas agregarla (ver arriba)
3. **Usuarios de Prueba:** 👥 Ejecutar el script `scripts/seed-test-users.js` en -

### Verificar que Todo Funciona

#### 1. Verificar Supabase
\`\`\`bash
# Las variables ya están configuradas, pero puedes verificar en:
# - → Sidebar → Vars
\`\`\`

#### 2. Verificar Email
\`\`\`bash
# Después de agregar RESEND_API_KEY:
# 1. Crea un test suite en Playground
# 2. Ve a Monitoring
# 3. Crea un scheduled test
# 4. Agrega tu email en "Notification Email"
# 5. Espera a que falle un test
# 6. Revisa tu bandeja de entrada
\`\`\`

#### 3. Verificar Usuarios de Prueba
\`\`\`bash
# 1. Ve a /auth/login
# 2. Usa: qa.lead@platypuslab.test
# 3. Contraseña: TestPass123!
# 4. Deberías poder iniciar sesión
\`\`\`

## 🔧 Solución de Problemas

### "No puedo iniciar sesión con los usuarios de prueba"

**Solución:** Asegúrate de haber ejecutado el script `scripts/seed-test-users.js` haciendo clic en el botón de ejecutar (▶️) en -.

### "Los emails no se envían"

**Posibles causas:**
1. No agregaste `RESEND_API_KEY` en las variables
2. La API key es incorrecta
3. Alcanzaste el límite diario (100 emails)

**Solución:**
- Verifica la variable en - → Vars
- Revisa los logs en la consola del navegador
- Busca mensajes que empiecen con `[-]`

### "Error al conectar con Supabase"

**Solución:** Las variables de Supabase ya están configuradas en -. Si ves este error:
1. Verifica que estás en el proyecto correcto
2. Revisa la sección "Connect" en el sidebar
3. Asegúrate de que Supabase está conectado

## 📚 Recursos Adicionales

- **Documentación de Resend:** [resend.com/docs](https://resend.com/docs)
- **Documentación de Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Guía de Email (Inglés):** Ver `docs/EMAIL_SETUP.md`

## 💡 Consejos

1. **Usa el usuario QA Lead** para probar funciones de administración
2. **Prueba con diferentes usuarios** para ver cómo se ve la colaboración
3. **Configura emails** para recibir notificaciones reales de tests fallidos
4. **Revisa los logs** con `console.log("[-] ...")` para debugging

## 🦦 ¡Listo para Probar!

Ahora tienes todo configurado para empezar a usar Platypus QA Lab:

- ✅ Variables de entorno configuradas
- ✅ Sistema de emails listo (solo agrega la API key)
- ✅ 5 usuarios de prueba disponibles
- ✅ Base de datos configurada

**¡Empieza a probar APIs como un profesional!** 🚀
