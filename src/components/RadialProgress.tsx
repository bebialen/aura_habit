/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface RadialProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  label = "kcal",
  color = "var(--color-cobalt)"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className="cobalt-glow"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tracking-tighter">{Math.round(progress)}%</span>
        <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">{label}</span>
      </div>
    </div>
  );
};
