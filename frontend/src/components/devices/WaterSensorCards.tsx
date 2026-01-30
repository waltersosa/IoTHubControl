import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplets, Zap, ZapOff } from 'lucide-react';
import { Device } from '../../types/device';
import { PHGauge, TurbidityGauge } from '../widgets/WaterQualityWidgets';

// Estilos comunes para mantener "el diseño anterior" (Glassmorphism oscuro)
const CardContainer = ({ children, title, icon: Icon, online, ip }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-100">{title}</h3>
          <p className="text-xs text-gray-500 font-mono">{ip || 'Unknown'}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
    </div>
    {children}
  </motion.div>
);

export const PhSensorCard: React.FC<{ device: Device }> = ({ device }) => {
  return (
    <CardContainer 
      title="Sensor pH" 
      icon={Droplets} 
      online={device.isOnline} 
      ip={device.data.ipAddress}
    >
      <div className="flex flex-col items-center justify-center py-4">
        {/* Reusing the gauge but ensuring it fits the card style */}
        <PHGauge value={device.data.ph || 0} size={150} />
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
        <span>Última lectura: Hace instantes</span>
      </div>
    </CardContainer>
  );
};

export const TurbiditySensorCard: React.FC<{ device: Device }> = ({ device }) => {
  return (
    <CardContainer 
      title="Sensor Turbidez" 
      icon={Activity} 
      online={device.isOnline} 
      ip={device.data.ipAddress}
    >
       <div className="flex flex-col items-center justify-center py-4">
        <TurbidityGauge value={device.data.turbidity || 0} size={150} />
      </div>
       <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
        <span>Calidad: {device.data.turbidity < 20 ? 'Excelente' : 'Revisar'}</span>
      </div>
    </CardContainer>
  );
};

export const ConductivitySensorCard: React.FC<{ device: Device }> = ({ device }) => {
  const isConductive = device.data.conductivity || false;
  
  return (
    <CardContainer 
      title="Conductividad" 
      icon={Zap} 
      online={device.isOnline} 
      ip={device.data.ipAddress}
    >
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
         <div className={`p-6 rounded-full ${isConductive ? 'bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-gray-800'}`}>
            {isConductive ? (
              <Zap className="w-16 h-16 text-green-400" />
            ) : (
              <ZapOff className="w-16 h-16 text-gray-500" />
            )}
         </div>
         <h2 className={`text-2xl font-bold ${isConductive ? 'text-green-400' : 'text-gray-500'}`}>
           {isConductive ? 'DETECTADA' : 'NORMAL'}
         </h2>
      </div>
       <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
        <span>Estado: {isConductive ? 'Alerta' : 'Estable'}</span>
      </div>
    </CardContainer>
  );
};
