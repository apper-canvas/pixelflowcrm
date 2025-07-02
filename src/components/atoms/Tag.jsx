import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Tag = ({ 
  children, 
  color = 'blue', 
  variant = 'default', 
  removable = false, 
  onRemove,
  className = '' 
}) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
    indigo: 'bg-primary-100 text-primary-800',
  };

  const variants = {
    default: 'px-2 py-1 text-xs font-medium rounded-full',
    large: 'px-3 py-1.5 text-sm font-medium rounded-full',
  };

  return (
    <motion.span
      className={`inline-flex items-center ${variants[variant]} ${colors[color]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors duration-150"
        >
          <ApperIcon name="X" size={12} />
        </button>
      )}
    </motion.span>
  );
};

export default Tag;