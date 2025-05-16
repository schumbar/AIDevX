import React from "react";
import { motion } from "framer-motion";

interface LambdaLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LambdaLogo({ 
  size = 120, 
  color = "#FFD700", 
  className = "" 
}: LambdaLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
      />
      <div 
        className="relative z-10 flex items-center justify-center w-full h-full"
        style={{ fontSize: size * 0.8, fontWeight: 'bold', color }}
      >
        λ
      </div>
    </div>
  );
}

export default LambdaLogo;
