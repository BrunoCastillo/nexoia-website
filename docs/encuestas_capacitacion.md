# Evaluaciones de capacitación

Módulo de encuestas de NexoIA. El sitio sigue siendo el proyecto Next.js existente. No hay credenciales en el repositorio y las respuestas no se simulan en el navegador.

## Rutas

- Pública de la primera capacitación: `/encuestas/ia-finanzas-2026`
- Pública genérica, sin nuevo despliegue: `/encuestas?curso=identificador`
- Directorio de evaluaciones activas: `/encuestas`
- Baja de suscripción: `/encuestas/baja?token=...`
- Privacidad: `/privacidad`
- Acceso: `/admin/acceso`
- Resultados: `/admin/encuestas`
- Administración: `/admin/capacitaciones`

## Variables

En `.env.local` y en Vercel solo van las variables públicas de `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (opcional hasta activar Turnstile)
- `NEXT_PUBLIC_SITE_URL`

No crees `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`. La clave `service_role` solo existe como secreto de Supabase. El navegador usa la clave anónima y las políticas RLS.

## Supabase

1. Crea un proyecto en Supabase. Elige una región cercana a Ecuador.
2. En el editor SQL, ejecuta una sola vez `supabase/migrations/20261020120000_encuestas_capacitacion.sql`.
3. En Authentication > Users, crea el administrador y marca el correo como confirmado.
4. Copia el UUID del usuario y ejecuta:

```sql
insert into public.admin_users (user_id, email, is_active)
values ('UUID-DEL-USUARIO', 'nexoiaec@gmail.com', true);
```

5. En Authentication > URL Configuration, agrega `https://nexoia-website.vercel.app/admin/acceso` y `http://localhost:3000/admin/acceso` si usarás la recuperación de contraseña.
6. Instala la CLI de Supabase, entra al proyecto y publica las funciones sin exigir JWT, porque las llama el formulario público:

```bash
supabase link --project-ref TU_PROJECT_REF
supabase secrets set TURNSTILE_SECRET_KEY=tu-secreto RATE_LIMIT_SALT=un-valor-largo-aleatorio ALLOWED_ORIGIN=https://nexoia-website.vercel.app
supabase functions deploy submit-survey --no-verify-jwt
supabase functions deploy subscribe-newsletter --no-verify-jwt
supabase functions deploy unsubscribe-newsletter --no-verify-jwt
```

`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` los inyecta la plataforma en las funciones. No los copies a Vercel.

Turnstile es opcional al inicio: si no defines el secreto, quedan el campo oculto y el límite de 8 evaluaciones, 5 suscripciones y 10 bajas por hora y por cliente. Cuando actives Turnstile, la clave pública va en `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y la secreta solo en Supabase.

Para previsualizaciones de Vercel puedes añadir `ALLOW_VERCEL_PREVIEWS=true` en los secretos de las funciones.

## Vercel

Agrega las cuatro variables públicas y vuelve a desplegar la rama cuando se autorice. No hagas merge a la rama principal ni publiques a producción sin aprobación.

El archivo `next.config.js` no usa `output: 'export'`. Las páginas actuales usan `next/image`, y activar la exportación estática exigiría imágenes sin optimizar. Las rutas nuevas son componentes de cliente: no usan API Routes, Server Actions ni middleware. La ruta `?curso=` permite crear encuestas sin reconstruir el sitio. Si más adelante se activa `output: 'export'`, hay que poner `images.unoptimized: true`.

## Uso

- La evaluación se responde sin correo. Después aparece la suscripción, desmarcada, y se puede omitir.
- El enlace de baja se muestra una vez. Quien lo pierda escribe a nexoiaec@gmail.com. Un administrador también puede dar de baja o eliminar el registro.
- Con menos de 5 evaluaciones el panel no muestra gráficos por opción. Los comentarios siguen en la sección privada.
- La exportación de evaluaciones y la de suscripciones son archivos CSV separados, con punto y coma y UTF-8, para Excel.
- Si una encuesta ya tiene respuestas, no se cambia el tipo ni las opciones. Se duplica para crear otra versión.
- El código QR se genera en el navegador y se descarga como PNG.

## Pendiente sin credenciales

No se pudo guardar una evaluación real, iniciar sesión de administrador ni comprobar las políticas RLS contra un proyecto de Supabase. Esas pruebas quedan para cuando existan el proyecto, la migración, las funciones y el primer usuario administrador.
