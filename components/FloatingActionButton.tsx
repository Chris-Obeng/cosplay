import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg z-50 flex items-center justify-center"
      aria-label="Create new cosplay transformation"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.1, boxShadow: '0 8px 30px rgba(0, 122, 255, 0.4)' }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
};

export default FloatingActionButton;