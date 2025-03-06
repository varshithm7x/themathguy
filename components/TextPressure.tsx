import { motion } from 'framer-motion';
import React from 'react';

interface TextPressureProps {
  text: string;
  className?: string;
}

const TextPressure: React.FC<TextPressureProps> = ({ text, className = '' }) => {
  return (
    <motion.span
      className={className}
      whileTap={{
        scale: 0.9,
        transition: {
          duration: 0.1,
        },
      }}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: 0.1,
        },
      }}
    >
      {text}
    </motion.span>
  );
};

export default TextPressure; 