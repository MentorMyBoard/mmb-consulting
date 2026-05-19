'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  maxDeg?: number;
};

export function TiltCard({ children, className = '', maxDeg = 10 }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const rotateX = useTransform(y, [-0.5, 0.5], [maxDeg, -maxDeg]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxDeg, maxDeg]);

  const rx = useSpring(rotateX, { stiffness: 350, damping: 25 });
  const ry = useSpring(rotateY, { stiffness: 350, damping: 25 });
  const sc = useSpring(scale,   { stiffness: 350, damping: 25 });

  return (
    <div style={{ perspective: '900px' }} className="h-full">
      <motion.div
        style={{ rotateX: rx, rotateY: ry, scale: sc, transformStyle: 'preserve-3d' }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top)  / r.height - 0.5);
          scale.set(1.03);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); scale.set(1); }}
        className={`h-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
