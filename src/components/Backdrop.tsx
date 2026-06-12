/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface BackdropProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Backdrop({ children, onClose }: BackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/37 backdrop-blur-[1.5px] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 8, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 8, scale: 0.98, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-xl rounded-xl w-full max-w-md overflow-hidden flex flex-col font-sans select-none transition-colors"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
