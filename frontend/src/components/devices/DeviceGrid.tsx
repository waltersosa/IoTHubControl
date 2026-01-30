import React from 'react';
import { useMQTT } from '../../hooks/useMQTT';
import { AlertCircle } from 'lucide-react';
import { DeviceCard } from '../DeviceCard';
import { PhSensorCard, TurbiditySensorCard, ConductivitySensorCard } from './WaterSensorCards';

export const DeviceGrid: React.FC = () => {
  const { devices, isConnected, toggleRelay, setServoAngle } = useMQTT();

  // Fallback: If we have devices, we assume we are (or were) connected enough to show them.
  // This prevents the whole UI from vanishing during a micro-disconnect.
  const effectiveIsConnected = isConnected || devices.length > 0;

  if (!effectiveIsConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-500 mb-2">Conectando...</h3>
        <p className="text-gray-400 text-center">
          Estableciendo conexión con el broker MQTT...
        </p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-gray-400 mb-2">No hay dispositivos</h3>
        <p className="text-gray-500 text-center">
          Esperando a que los dispositivos se conecten...
        </p>
      </div>
    );
  }

  // Filtrar dispositivos duplicados por ID
  const uniqueDevices = Array.from(new Map(devices.map(device => [device.id, device])).values());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueDevices.flatMap(device => {
        // Si es el dispositivo de calidad del agua, devolvemos 3 tarjetas separadas
        if (device.data.ph !== undefined || device.category === 'Water Quality') {
           return [
             <PhSensorCard key={`${device.id}-ph`} device={device} />,
             <TurbiditySensorCard key={`${device.id}-turb`} device={device} />,
             <ConductivitySensorCard key={`${device.id}-cond`} device={device} />
           ];
        }

        // Para cualquier otro dispositivo, devolvemos 1 tarjeta normal en un array
        return [
          <DeviceCard 
            key={device.id} 
            device={device} 
            onToggleRelay={(id) => {
               const current = devices.find(d => d.id === id)?.data.relayState;
               toggleRelay(id, !current);
            }}
            onServoChange={setServoAngle}
          />
        ];
      })}
    </div>
  );
};