import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <motion.button
      onClick={handleClick}
      className="flex items-center justify-center p-2 rounded-lg text-accent hover:bg-gray-100/10"
      aria-label="Back to main page"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ChevronLeft size={24} />
      <span className="hidden sm:inline ml-1 font-medium">Back</span>
    </motion.button>
  );
};

export default BackButton;