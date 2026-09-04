import React from 'react';
import { motion } from 'framer-motion';

export default function Envelope({ onOpen, theme }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
    onOpen();
  };

  return (
    <div className="envelope-scene">
      <motion.div
        className={`envelope ${isOpen ? 'open' : ''}`}
        onClick={handleClick}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="envelope-body"></div>
        <div className="envelope-flap"></div>
        <div className="envelope-letter">
          <span className="envelope-text">Something for you... 💌</span>
        </div>
        <span className="envelope-hint">{isOpen ? 'Opening...' : 'Tap to open ✉️'}</span>
      </motion.div>
    </div>
  );
}
