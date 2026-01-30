export interface Device {
  id: string;
  name: string;
  type: 'esp32' | 'esp8266';
  category: string;
  isOnline: boolean;
  data: {
    temperature?: number;
    humidity?: number;
    relayState?: boolean;
    servoAngle?: number;
    cpuFreq?: number;
    wifiStrength?: number;
    ipAddress?: string;
    uptime?: number;
    // Water Quality
    ph?: number;
    turbidity?: number;
    conductivity?: boolean;
  };
}