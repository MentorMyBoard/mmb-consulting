'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Brief brand loading screen. Hides once the window 'load' event fires
 * (or after a 1.4s safety timeout to avoid blocking on slow third-party assets).
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const done = () => setVisible(false);

    if (document.readyState === 'complete') {
      // Already loaded — short delay for a clean fade.
      const t = setTimeout(done, 400);
      return () => clearTimeout(t);
    }

    window.addEventListener('load', done);
    const safety = setTimeout(done, 1400);

    return () => {
      window.removeEventListener('load', done);
      clearTimeout(safety);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed inset-0 z-[200] bg-primary flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl md:text-5xl text-on-primary tracking-tighter mb-3"
            >
              MentorMyBoard
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="h-px w-32 mx-auto bg-secondary origin-left"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-secondary mt-4"
            >
              Strategic Governance
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
