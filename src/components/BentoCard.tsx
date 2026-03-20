/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({ children, className = "", delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className={`glass p-5 flex flex-col ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
  >
    {children}
  </motion.div>
);
