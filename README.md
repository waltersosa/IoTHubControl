# IoTHubControl

Plataforma de control y monitoreo IoT (Internet of Things) Full-Stack. Este sistema permite visualizar telemetría en tiempo real y controlar dispositivos (ESP32/ESP8266) a través de una interfaz web moderna, utilizando MQTT como protocolo de comunicación.

## 🚀 Inicio Rápido con Docker

La forma más sencilla de ejecutar todo el proyecto es utilizando **Docker Compose**. Esto levantará todos los servicios necesarios de forma orquestada.

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.

### Pasos
1. **Clonar el repositorio** (si no lo tienes descargado):
   ```bash
   git clone <tu-repositorio>
   cd IoTHubControl
   ```

2. **Ejecutar el proyecto**:
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   docker-compose up --build
   ```
   *El flag `--build` es recomendado la primera vez para asegurar que se construyen las imágenes correctamente.*

3. **Acceder a la Aplicación**:
   Una vez que los contenedores estén corriendo, abre tu navegador:
   
   - **Frontend (Dashboard)**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)
   - **MQTT Broker Dashboard (EMQX)**: [http://localhost:18083](http://localhost:18083) (Credenciales por defecto: `admin` / `public`)

Para detener los servicios, presiona `Ctrl+C` en la terminal o ejecuta:
```bash
docker-compose down
```

## 🏗️ Arquitectura de Servicios

El archivo `docker-compose.yml` orquesta los siguientes servicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **frontend** | `5173` | Dashboard React + Vite. Se conecta al broker MQTT directamente vía WebSockets. |
| **backend** | `3000` | Servidor Node.js + Express. Monitorea el estado y sirve de API. |
| **emqx** | `1883` (TCP)<br>`8083` (WS) | Broker MQTT de alto rendimiento. Gestiona la mensajería entre dispositivos y web. |
| **mysql** | `3306` | Base de datos relacional (configurada para futura persistencia). |

## 🛠️ Desarrollo Local

Si prefieres ejecutar los servicios manualmente sin Docker:

1. **Broker MQTT**: Necesitas un broker corriendo (ej. Mosquitto o EMQX) en el puerto 1883/8083.
2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📡 Dispositivos IoT

Los códigos fuente para microcontroladores (ESP32) se encuentran en la carpeta `frontend/codigos/`.
- **Configuración**: Asegúrate de editar los archivos `.ino` para poner tu SSID, Contraseña de WiFi y la IP de tu PC anfitriona donde corre el Docker.

---
*Generado por Antigravity*
