import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Activity, Droplets, Zap } from 'lucide-react';
import { Device } from '../../types/device';
import { PHGauge, TurbidityGauge, ConductivityIndicator } from '../widgets/WaterQualityWidgets';

interface WaterQualityCardProps {
  device: Device;
}

export const WaterQualityCard: React.FC<WaterQualityCardProps> = ({ device }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30 shadow-lg overflow-hidden group"
    >
      {/* Water Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {device.name}
            </h3>
          </div>
          <p className="text-xs text-cyan-300/60 font-mono mt-1">{device.data.ipAddress || 'IP Desconocida'}</p>
        </div>
        <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
          {device.isOnline ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Online</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-red-400 font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* pH Section */}
        {device.data.ph !== undefined && (
          <div className="col-span-1 bg-black/20 rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center">
             <PHGauge value={device.data.ph} size={80} />
          </div>
        )}

        {/* Turbidity Section */}
        {device.data.turbidity !== undefined && (
          <div className="col-span-1 bg-black/20 rounded-lg p-3 border border-white/5 flex flex-col items-center justify-center">
             <TurbidityGauge value={device.data.turbidity} size={80} />
          </div>
        )}

        {/* Conductivity Section */}
        {device.data.conductivity !== undefined && (
          <div className="col-span-2 bg-black/20 rounded-lg p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${device.data.conductivity ? 'bg-yellow-400/20' : 'bg-gray-700/50'}`}>
                <Zap className={`w-5 h-5 ${device.data.conductivity ? 'text-yellow-400' : 'text-gray-500'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Conductividad</span>
                <span className={`font-bold ${device.data.conductivity ? 'text-yellow-400' : 'text-gray-500'}`}>
                   {device.data.conductivity ? 'DETECTADA' : 'NORMAL'}
                </span>
              </div>
            </div>
            <Activity className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
        <span>Uptime: {Math.floor((device.data.uptime || 0) / 60)} min</span>
        <span>WiFi: {device.data.wifiStrength} dBm</span>
      </div>

    </motion.div>
  );
};
