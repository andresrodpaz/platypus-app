# Configuración de Grok API para Platypus QA Lab

## Problema Actual

La aplicación está intentando usar Grok AI pero falta la variable de entorno correcta.

**Error:** `xAI API key is missing`

## Solución

El SDK de xAI requiere específicamente la variable de entorno `XAI_API_KEY`, no `GROK_XAI_API_KEY`.

### Opción 1: Añadir XAI_API_KEY (Recomendado)

1. **Obtén tu API Key de xAI:**
   - Ve a https://console.x.ai/
   - Inicia sesión con tu cuenta
   - Ve a "API Keys"
   - Crea una nueva API key o copia una existente

2. **Añade la variable de entorno en v0:**
   - Abre el sidebar izquierdo en v0
   - Ve a la sección "Vars" (Variables)
   - Haz clic en "Add Variable"
   - Nombre: `XAI_API_KEY`
   - Valor: Tu API key de xAI (empieza con `xai-`)
   - Haz clic en "Save"

3. **Recarga la aplicación:**
   - Refresca el preview
   - Prueba hacer un request en el Playground
   - Deberías ver análisis AI personalizados

### Opción 2: Usar Respuestas de Fallback (Sin API Key)

Si no quieres configurar la API key de Grok, la aplicación funcionará perfectamente con respuestas predefinidas inteligentes:

- ✅ Todos los features funcionan
- ✅ Comentarios divertidos y útiles
- ✅ Sin costos de API
- ❌ Sin análisis AI personalizados

**No necesitas hacer nada**, la app ya está configurada para usar fallbacks automáticamente.

## Verificación

Después de añadir la API key, verás en los logs del servidor:

\`\`\`
[v0] Checking API keys...
[v0] XAI_API_KEY exists: true
[v0] API key found, attempting AI analysis...
[v0] AI analysis successful!
\`\`\`

## Costos

- **Grok Beta**: ~$5 por 1M tokens de entrada, ~$15 por 1M tokens de salida
- **Uso típico**: Cada análisis usa ~200-300 tokens
- **Estimado**: Miles de análisis por $1

## Troubleshooting

### "API key is missing"
- Verifica que añadiste `XAI_API_KEY` (no `GROK_XAI_API_KEY`)
- Asegúrate de que la key empieza con `xai-`
- Recarga el preview después de añadir la variable

### "AI generation failed"
- La app usará respuestas de fallback automáticamente
- Verifica que tu API key es válida
- Revisa que tienes créditos en tu cuenta de xAI

### Los análisis no son personalizados
- Si ves "usingFallback: true" en la respuesta, significa que está usando fallbacks
- Verifica que la API key está configurada correctamente
- Mira los logs del servidor para más detalles

## Soporte

Si tienes problemas:
1. Revisa los logs del servidor en la consola
2. Verifica que la variable de entorno está en "Vars"
3. Asegúrate de que tu API key de xAI es válida
