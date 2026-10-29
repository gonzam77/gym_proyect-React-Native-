# Rutina360 en iPhone

Guía para compilar y publicar la app en iOS sin tener una Mac: la compilación
corre en una Mac de GitHub Actions (`.github/workflows/ios.yml`).

## Qué se corrigió en el proyecto `ios/` (octubre 2026)

El proyecto de iOS había quedado como lo generó la plantilla y nunca se compiló.

| Problema | Efecto | Corrección |
|---|---|---|
| `AppDelegate.swift` arrancaba el módulo `"MiApp"` y JS registra `"Rutina360"` | Pantalla roja al abrir la app | Ahora arranca `"Rutina360"` (el `name` de `app.json`) |
| `Ionicons.ttf` no estaba en `UIAppFonts` | Todos los íconos se veían como `?` | Agregada (la fuente la copia el pod de vector-icons) |
| Bundle ID `org.reactjs.native.example.MiApp` | No se puede publicar | `com.rutina360`, igual que en Android |
| Sin ícono de app | App Store rechaza el envío | `AppIcon-1024.png` (mismo diseño que el de Android) |
| `NSLocationWhenInUseUsageDescription` vacío (la app no usa ubicación) | Motivo de rechazo | Eliminado |
| Aceptaba orientación horizontal | La interfaz está pensada en vertical | Solo vertical, solo iPhone (`TARGETED_DEVICE_FAMILY = 1`) |
| `PrivacyInfo.xcprivacy` no se copiaba al bundle | Apple lo exige desde 2024 | Agregado a *Copy Bundle Resources* |
| Módulo "pantalla encendida" solo existía en Android | El iPhone se bloqueaba en pleno descanso | `ios/MiApp/PantallaEncendida.m` (`idleTimerDisabled`) |
| Alarma de descanso con sonido `.mp3` | iOS ignora mp3 en notificaciones | `alarm2.caf` (29 s, IMA4) en el bundle |
| `interruptionLevel: timeSensitive` sin permiso | La alarma no atravesaba "No molestar" | Entitlement `MiApp.entitlements` |
| Menú de acciones abría un modal mientras otro se cerraba | En iOS el segundo modal no aparece | `HojaAcciones` espera `onDismiss` en iOS |
| Dependencias sin uso (`react-native-push-notification`, pickers, uuid, nanoid) | Pods de más; push-notification pide otra librería en iOS | Quitadas de `package.json` |
| Versión 1.0 / build 1 | — | 1.0.9 / 45, igual que Android |

Después de bajar estos cambios hay que correr `npm install` (se quitaron dependencias).

## Compilar sin firmar (verificar que compila)

Con cada push a `main` que toque `ios/` o las dependencias, el job **build**
compila para el simulador. También se puede correr a mano desde
**Actions → iOS → Run workflow**. No necesita cuenta de Apple.

> En repos privados, cada minuto de Mac cuenta x10 en el cupo gratuito de
> GitHub Actions (2.000 min/mes en el plan Free). Una compilación tarda unos
> 15–25 minutos.

## Publicar en TestFlight / App Store

### 1. Una sola vez, en Apple

1. Cuenta de **Apple Developer Program** (USD 99/año).
2. En **App Store Connect → Apps → +**, crear la app con el bundle ID
   `com.rutina360` (si no aparece en la lista, registrarlo antes en
   developer.apple.com → Identifiers, con la capacidad *Time Sensitive
   Notifications*).
3. En **App Store Connect → Usuarios y acceso → Integraciones → Claves de API**,
   crear una clave con rol **Admin** (hace falta para que Xcode cree los
   certificados de distribución en la nube). Descargar el `.p8` (se baja una sola
   vez) y anotar el *Key ID* y el *Issuer ID*.
4. Anotar el **Team ID** (developer.apple.com → Membership).

### 2. Secretos en GitHub

En el repo `gym_proyect` → **Settings → Secrets and variables → Actions**:

| Secreto | Valor |
|---|---|
| `ASC_KEY_ID` | Key ID de la clave de API |
| `ASC_ISSUER_ID` | Issuer ID |
| `APPLE_TEAM_ID` | Team ID |
| `ASC_KEY_P8_BASE64` | El `.p8` en base64. En PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("AuthKey_XXXX.p8"))` |

### 3. Subir un build

**Actions → iOS → Run workflow**, tildar **Subir a TestFlight**. El número de
build se calcula solo (100 + número de ejecución). A los pocos minutos el build
aparece en TestFlight; se instala en el iPhone con la app TestFlight.

### 4. Antes de mandar a revisión

- **Cuenta de prueba**: la app no se puede usar sin login y las cuentas las crea
  el gimnasio, así que en *App Review Information* hay que dejar un usuario y
  contraseña de atleta con alguna rutina asignada.
- **Política de privacidad**: Apple pide una URL pública.
- **Privacidad de datos**: declarar en App Store Connect lo que la app guarda
  en el servidor (email, nombre, teléfono, fecha de nacimiento, peso/altura,
  objetivo, rutinas).
- **Borrado de cuenta**: Apple exige poder borrar la cuenta desde la app cuando
  la app permite crearla. Acá las crea el gimnasio, pero conviene tener un camino
  (aunque sea "pedir la baja") por si revisión lo pide.

## Pendiente de probar en un iPhone real

- Alarma de descanso con la app en segundo plano y con el teléfono bloqueado.
- Que la pantalla no se apague durante el descanso.
- Íconos, teclado sobre los formularios (perfil, notas, importar rutina).
- Compartir rutina (menú nativo de compartir) e importar con código.
