// Determinar el host actual (para cuando se accede desde otra IP en la red)
const currentHost = window.location.hostname;

export const config = {
  backendUrl: `http://${currentHost}:3000`,
  wsUrl: `ws://${currentHost}:3000`,
  // Usar variable de entorno si existe, sino construir url basada en el host actual
  mqttBroker: import.meta.env.VITE_MQTT_BROKER || `ws://${currentHost}:8083/mqtt`,
  serverHost: currentHost,
  serverPort: 3000
}; 