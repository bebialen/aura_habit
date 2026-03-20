/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md glass p-6 rounded-t-[32px] sm:rounded-[32px] border-t border-white/10 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-obsidian/50 backdrop-blur-xl py-2 z-10">
            <h3 className="text-xl font-light tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} className="text-white/50" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
