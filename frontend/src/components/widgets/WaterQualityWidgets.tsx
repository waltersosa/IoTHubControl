import React from "react";
import { motion } from "framer-motion";
import { Zap, ZapOff } from "lucide-react";

// ==========================================
// Widget: Medidor de pH
// ==========================================
interface PHGaugeProps {
  value: number;
  size?: number;
}

export const PHGauge: React.FC<PHGaugeProps> = ({ value, size = 100 }) => {
  // pH va de 0 a 14
  const clampedValue = Math.min(Math.max(value, 0), 14);
  const percentage = (clampedValue / 14) * 100;

  // Colores típicos de pH
  const getColor = (ph: number) => {
    if (ph < 4) return "#EF4444"; // Acido fuerte -> Rojo
    if (ph < 6.5) return "#F97316"; // Acido débil -> Naranja
    if (ph > 8.5) return "#8B5CF6"; // Base débil -> Violeta/Azul
    if (ph > 11) return "#6366F1"; // Base fuerte -> Indigo
    return "#22C55E"; // Neutro (6.5 - 8.5) -> Verde
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1F2937" // gray-800
            strokeWidth="8"
            className="dark:stroke-gray-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor(clampedValue)}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
            strokeDasharray="283"
            strokeDashoffset={0} // Vamos a usar pathLength para animar
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xl font-bold text-white">{clampedValue.toFixed(1)}</span>
        </div>
      </div>
      <p className="mt-1 text-sm font-medium text-gray-400">pH Level</p>
    </div>
  );
};

// ==========================================
// Widget: Medidor de Turbidez
// ==========================================
interface TurbidityGaugeProps {
  value: number; // 0 - 100%
  size?: number;
}

export const TurbidityGauge: React.FC<TurbidityGaugeProps> = ({ value, size = 100 }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  // Color: Café claro para turbio (0%), Azul claro para limpio (100%)
  // O en nuestro código: 0V = 100% turbio (bad), 100% = clear?
  // Asumamos que "value" es % de LIMPIEZA o CLARIDAD para simplificar la UI, 
  // o si es "Turbidez", entonces 0% es bueno y 100% es malo.
  // Vamos a asumir: 0 (Limpio) -> 100 (Muy turbio)
  
  const getColor = (val: number) => {
    if (val < 20) return "#3B82F6"; // Limpio (Blue)
    if (val < 60) return "#EAB308"; // Medio (Yellow)
    return "#78350F"; // Sucio (Brown)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1F2937"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor(clampedValue)}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: clampedValue / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xl font-bold text-white">{clampedValue.toFixed(0)}%</span>
        </div>
      </div>
      <p className="mt-1 text-sm font-medium text-gray-400">Turbidez</p>
    </div>
  );
};

// ==========================================
// Widget: Indicador de Conductividad
// ==========================================
interface ConductivityIndicatorProps {
  isConductive: boolean;
}

export const ConductivityIndicator: React.FC<ConductivityIndicatorProps> = ({ isConductive }) => {
  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg border ${
      isConductive 
        ? "bg-green-500/10 border-green-500/50 text-green-400" 
        : "bg-gray-800 border-gray-700 text-gray-500"
    }`}>
      {isConductive ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
      <span className="font-bold">
        {isConductive ? "CONDUCTIVO" : "NO CONDUCTIVO"}
      </span>
    </div>
  );
};
