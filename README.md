# 🐾 PetFinder React (Frontend)

Aplicación web desarrollada en **React + TypeScript** para reportar y encontrar mascotas perdidas cerca de tu ubicación, estructurada siguiendo la arquitectura en capas (`pages`, `components`, `ui`, `hooks`, `lib`, `router`).

## 🌐 Demo / Webapp desplegada

- **Frontend (Firebase Hosting):** `https://tu-project-id-de-firebase.web.app` *(Reemplazar con la URL final una vez desplegado)*
- **Backend API:** Configurado mediante la variable `API_BASE_URL` en [`src/lib/api.ts`](./src/lib/api.ts) (por defecto `http://localhost:3000`).

---

## 🏗️ Arquitectura por Capas

```text
src/
├── index.tsx                      # Inicializa la app y monta BrowserRouter
├── router/
│   └── index.tsx                  # Configuración central de rutas (React Router v6)
├── pages/                         # Componentes limpios que representan a cada ruta
│   ├── home/                      # /
│   ├── login/                     # /ingresar
│   ├── register/                  # /registro
│   ├── dashboard/                 # /dashboard
│   ├── mis-datos/                 # /mis-datos
│   ├── mis-mascotas/              # /mis-mascotas
│   ├── report-pet/                # /reportar y /editar-mascota/:id
│   └── report-sighting/           # /mascota/:id
├── components/                    # Grandes bloques funcionales que unen /ui y /hooks
│   ├── layout/                    # Estructura común con Header, Outlet y Footer
│   ├── header/                    # Barra de navegación con menú móvil y estado de sesión
│   ├── footer/                    # Pie de página
│   ├── pet-card/                  # Tarjeta de mascota (modo "nearby" y modo "owner")
│   ├── login-form/                # Formulario de inicio de sesión
│   ├── register-form/             # Formulario de registro
│   ├── my-data-form/              # Formulario de edición de datos personales
│   ├── report-pet-form/           # Formulario para publicar o editar mascota perdida
│   └── report-sighting-form/      # Formulario para reportar el avistamiento de una mascota
├── ui/                            # Componentes atómicos de interfaz (CSS Modules)
│   ├── buttons/                   # MainButton, SecondaryButton, DarkButton, SuccessButton, OutlineButton
│   ├── text-field/                # TextField reutilizable
│   ├── texts/                     # Title, Subtitle, Body, Caption
│   ├── map/                       # MapSelector interactivo (Leaflet + OpenStreetMap + Nominatim + GPS)
│   └── photo-uploader/            # Subida y previsualización de fotos con compresión en Base64
├── hooks/
│   └── index.ts                   # Custom hooks (useAuth, useUserData, useNearbyPets, useMyPets, usePetForm, useReportSighting)
└── lib/
    └── api.ts                     # Cliente HTTP y llamadas a los endpoints del backend
```

---

## 🛠️ Scripts disponibles

- `npm install`: Instala las dependencias del proyecto.
- `npm run dev`: Levanta el servidor de desarrollo con Webpack Dev Server en `http://localhost:8080`.
- `npm start`: Igual que `dev`, abriendo el navegador automáticamente.
- `npm run build`: Compila el bundle de producción optimizado dentro de la carpeta `/dist`.

---

## 🚀 Deploy en Firebase Hosting con GitHub Actions

1. Creá un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. En la raíz de este proyecto, ejecutá:
   ```bash
   npx firebase-tools login
   npx firebase-tools init hosting:github
   ```
   - Seleccioná tu proyecto de Firebase.
   - Directorio público: `dist`
   - Configurar como Single-Page App (rewrite todas las URLs a `/index.html`): **Yes**
   - Script de compilación antes del deploy: `npm ci && npm run build`
3. En tu repositorio de GitHub (`Settings -> Secrets and variables -> Actions`), agregá el secret `API_BASE_URL` con la URL pública de tu backend desplegado (por ejemplo en Render o Railway).
