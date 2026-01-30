#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DFRobot_ESP_PH.h"
#include "EEPROM.h"

// ==========================================
// CONFIGURACIÓN DE RED Y MQTT
// ==========================================
const char* ssid = "HOLA";            // ¡CAMBIAR POR TU SSID!
const char* password = "12345678";    // ¡CAMBIAR POR TU PASSWORD!
const char* mqtt_server = "192.168.10.122"; // IP del broker MQTT
const int mqtt_port = 1883;

// ==========================================
// IDENTIFICACIÓN DEL DISPOSITIVO
// ==========================================
// ID único para este dispositivo en la red MQTT
const char* deviceId = "water_quality_001";
const char* stateTopic = "iot/device/water_quality_001/state";
const char* commandTopic = "iot/device/water_quality_001/command";
const char* discoveryTopic = "iot/discovery";

// ==========================================
// CONFIGURACIÓN DE SENSORES
// ==========================================

// --------- pH ----------
#define PH_PIN 35
#define ESPADC 4096.0
#define ESPVOLTAGE 3300
DFRobot_ESP_PH ph;
float voltagePH, phValue;
float temperature = 25.0; // Temperatura por defecto si no hay sensor

// --------- Turbidez ----------
#define TURB_PIN 34
#define VREF 3.3
float turbVoltage;
int turbADC;
float turbidityValue; // Valor calculado de turbidez (0-100% o NTU, aproximado)

// --------- Conductividad ----------
#define COND_PIN 27

// ==========================================
// OBJETOS GLOBALES
// ==========================================
WiFiClient espClient;
PubSubClient client(espClient);

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Aquí puedes manejar comandos entrantes si es necesario
  // Por ejemplo, para calibrar el pH remotamente
  Serial.print("Mensaje recibido [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    String clientId = "ESP32_Water_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), "santiago", "sosamejia")) {
      Serial.println("conectado");
      
      // Anunciar dispositivo (Discovery)
      StaticJsonDocument<300> discovery;
      discovery["deviceId"] = deviceId;
      discovery["type"] = "esp32"; // Usamos 'esp32' genérico o uno nuevo 'water_monitor' si el frontend lo soporta
      discovery["category"] = "Water Quality";
      discovery["stateTopic"] = stateTopic;
      discovery["commandTopic"] = commandTopic;
      
      String discoveryMessage;
      serializeJson(discovery, discoveryMessage);
      client.publish(discoveryTopic, discoveryMessage.c_str(), true);
      
      client.subscribe(commandTopic);
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentando de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  // Inicialización de sensores
  EEPROM.begin(32);
  ph.begin();
  pinMode(COND_PIN, INPUT_PULLUP); // Conductividad

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void sendSensorData() {
  // 1. Leer Sensores
  
  // -- pH --
  voltagePH = analogRead(PH_PIN) / ESPADC * ESPVOLTAGE;
  phValue = ph.readPH(voltagePH, temperature);
  
  // -- Turbidez --
  turbADC = analogRead(TURB_PIN);
  turbVoltage = turbADC * VREF / 4095.0;
  // Mapeo simple de voltaje a porcentaje (Ajustar según sensor real)
  // Ejemplo: Alto voltaje = agua limpia, Bajo voltaje = agua sucia (o viceversa según módulo)
  // Asumiremos 0V = 100% turbio, VREF = 0% turbio para este ejemplo, ajustar con calibración real
  turbidityValue = map(turbADC, 0, 4095, 100, 0); 

  // -- Conductividad --
  bool conductiva = (digitalRead(COND_PIN) == LOW);

  // 2. Debug Serial
  Serial.print("pH: "); Serial.print(phValue);
  Serial.print(" | Turb: "); Serial.print(turbidityValue);
  Serial.print(" | Cond: "); Serial.println(conductiva ? "SI" : "NO");

  // 3. Empaquetar JSON
  StaticJsonDocument<512> doc;
  
  doc["name"] = "Monitor Calidad Agua";
  doc["type"] = "esp32";
  doc["category"] = "Water Quality";
  
  JsonObject data = doc.createNestedObject("data");
  
  // Datos estándar
  data["ipAddress"] = WiFi.localIP().toString();
  data["wifiStrength"] = WiFi.RSSI();
  data["uptime"] = millis() / 1000;
  data["cpuFreq"] = ESP.getCpuFreqMHz();
  
  // Datos específicos de Calidad de Agua
  data["ph"] = phValue;
  data["turbidity"] = turbidityValue;     // Enviamos valor numérico (0-100 o raw)
  data["conductivity"] = conductiva;      // Booleano

  String message;
  serializeJson(doc, message);

  // 4. Publicar MQTT
  client.publish(stateTopic, message.c_str(), false);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Mantenemos la calibración de pH activa por serial si es necesario
  // Nota: ph.calibration usa Serial.read(), lo cual puede bloquear o interferir. 
  // Para producción IoT, mejor calibrar via MQTT comandos.
  // ph.calibration(voltagePH, temperature);

  static unsigned long lastTime = 0;
  // Enviar datos cada 2 segundos
  if (millis() - lastTime > 2000) {
    sendSensorData();
    lastTime = millis();
  }
}
