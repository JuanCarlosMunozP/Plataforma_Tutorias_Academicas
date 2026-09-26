# Tutorías Académicas — App (React Native / Expo)

Cliente móvil de la plataforma de tutorías académicas, construido con Expo + expo-router, TypeScript, NativeWind (Tailwind para React Native) y pnpm.

## Requisitos

- Node.js 20+ y pnpm
- La app [Expo Go](https://expo.dev/go) en tu teléfono, o un emulador Android / simulador iOS

## Configuración

1. Instala dependencias:

   ```sh
   pnpm install
   ```

2. Ajusta `.env` con la URL del backend (Django corriendo en `back/`):

   ```
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

   - `localhost` funciona para el simulador de iOS y para `pnpm web`.
   - Usa `10.0.2.2` en vez de `localhost` para el emulador de Android.
   - Usa la IP de tu máquina en la red local (ej. `192.168.1.50`) si vas a probar desde un dispositivo físico con Expo Go.

3. Levanta el servidor de desarrollo:

   ```sh
   pnpm start      # abre el menú de Expo (escanea el QR con Expo Go)
   pnpm android    # abre en un emulador/dispositivo Android
   pnpm ios        # abre en un simulador iOS (solo macOS)
   pnpm web        # abre en el navegador
   ```

## Autenticación

El backend soporta dos flujos de JWT. Esta app usa el flujo **Bearer token** (no cookies, ya que React Native no tiene un manejo de cookies httpOnly equivalente al del navegador):

- Login: `POST /api/v1/auth/token` → `{ access, refresh }`
- Refresh: `POST /api/v1/auth/token/refresh/`
- Logout: `POST /api/v1/auth/token/blacklist/`

Los tokens se guardan de forma segura con `expo-secure-store`; el usuario en caché se guarda con `@react-native-async-storage/async-storage`.

## Estructura

- `app/` — rutas de expo-router (`_layout.tsx`, `index.tsx`, `registro.tsx`).
- `src/pages/` — pantallas (algunas, como `HomePage`, no están enrutadas aún).
- `src/components/` — componentes de UI reutilizables.
- `src/context/` — `AuthContext` y `ThemeContext`.
- `src/services/` — llamadas a la API (`auth.service.ts`, `users.service.ts`).
- `src/lib/` — cliente axios, helpers y tokens de tema.
