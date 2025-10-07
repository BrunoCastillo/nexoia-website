# NEXOIA - Sitio Web

Un sitio web profesional para **NEXOIA** que ofrece servicios de inteligencia artificial enfocados en automatización, creación de contenido, chatbots y asesoría tecnológica.

**Lema:** "Impulsando la innovación con tecnología"

## 🚀 Características

- **Next.js 14** con App Router
- **React 18** con TypeScript
- **TailwindCSS** para estilos
- **Framer Motion** para animaciones
- **Lucide React** para íconos
- **Diseño responsive** (desktop y móvil)
- **SEO optimizado**
- **Optimizado para Vercel**

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── servicios/         # Página de servicios
│   ├── casos-exito/       # Página de casos de éxito
│   ├── sobre-nosotros/    # Página sobre nosotros
│   └── contacto/          # Página de contacto
├── components/            # Componentes reutilizables
│   └── layout.tsx         # Navbar y Footer
├── public/               # Archivos estáticos
│   ├── favicon.ico       # Favicon principal
│   ├── favicon-16x16.png # Favicon 16x16
│   ├── favicon-32x32.png # Favicon 32x32
│   ├── apple-touch-icon.png # Ícono para iOS
│   ├── android-chrome-192x192.png # Ícono Android 192x192
│   ├── android-chrome-512x512.png # Ícono Android 512x512
│   └── site.webmanifest  # Manifest para PWA
├── package.json          # Dependencias del proyecto
├── tailwind.config.js    # Configuración de TailwindCSS
├── postcss.config.js     # Configuración de PostCSS
├── next.config.js        # Configuración de Next.js
└── README.md            # Este archivo
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18.0 o superior
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ia-para-todos
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
   NEXT_PUBLIC_WHATSAPP_NUMBER=593XXXXXXXXX
   NEXT_PUBLIC_CALENDLY_USER=tuusuario
   NEXT_PUBLIC_INSTAGRAM_USER=tuusuario
   NEXT_PUBLIC_LINKEDIN_USER=tuusuario
   NEXT_PUBLIC_YOUTUBE_USER=tuusuario
   ```

4. **Ejecuta el proyecto en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Abre tu navegador**
   
   Visita [http://localhost:3000](http://localhost:3000) para ver el sitio web.

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue desde GitHub

1. **Sube tu código a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "New Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configura las variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega las variables del archivo `.env.local`

4. **Despliega**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará tu sitio automáticamente

### Opción 2: Despliegue con Vercel CLI

1. **Instala Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión en Vercel**
   ```bash
   vercel login
   ```

3. **Despliega el proyecto**
   ```bash
   vercel
   ```

4. **Sigue las instrucciones**
   - Vercel te preguntará sobre la configuración
   - Acepta los valores por defecto
   - Tu sitio estará disponible en una URL temporal

5. **Configura el dominio personalizado** (opcional)
   - En el dashboard de Vercel, ve a Settings > Domains
   - Agrega tu dominio personalizado

## ⚙️ Configuración Personalizada

### Cambiar información de contacto

Edita los siguientes archivos para personalizar la información:

1. **Número de WhatsApp**: Busca `593XXXXXXXXX` en todos los archivos y reemplázalo
2. **Usuario de Calendly**: Busca `tuusuario` y reemplázalo con tu usuario de Calendly
3. **Redes sociales**: Actualiza los enlaces en `components/layout.tsx`

### Cambiar colores

Modifica `tailwind.config.js` para cambiar la paleta de colores:

```javascript
colors: {
  primary: {
    // Tus colores personalizados
  },
  dark: {
    // Tus colores oscuros personalizados
  }
}
```

### Agregar nuevas páginas

1. Crea una nueva carpeta en `app/`
2. Agrega un archivo `page.tsx`
3. Actualiza la navegación en `components/layout.tsx`

## 📱 Características Responsive

El sitio está optimizado para:
- **Desktop**: 1024px y superior
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🎨 Animaciones

El sitio utiliza Framer Motion para:
- Animaciones de entrada en scroll
- Transiciones suaves entre páginas
- Efectos hover en botones y tarjetas
- Animaciones de carga

## 🔍 SEO

El sitio incluye:
- Meta tags optimizados
- Open Graph tags
- Twitter Card tags
- Sitemap automático
- Favicons para todos los dispositivos
- Manifest para PWA

## 📊 Analytics (Opcional)

Para agregar Google Analytics:

1. Instala la dependencia:
   ```bash
   npm install @vercel/analytics
   ```

2. Agrega el componente en `app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en producción
- `npm run lint` - Ejecuta el linter de ESLint

## 📞 Soporte

Si tienes problemas con el despliegue o configuración:

1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Vercel](https://vercel.com/docs)
3. Revisa los logs en el dashboard de Vercel

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¡Tu sitio web de IA para Todos está listo para conquistar el mundo digital!** 🚀
