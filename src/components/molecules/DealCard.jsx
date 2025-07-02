import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const DealCard = ({ deal, contact, onEdit, onDelete, isDragging = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className={`bg-white rounded-lg p-4 shadow-micro hover:shadow-subtle transition-all duration-150 ${
        isDragging ? 'opacity-50 transform rotate-2' : ''
      }`}
      whileHover={!isDragging ? { scale: 1.02 } : {}}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1">{deal.title}</h4>
          <p className="text-sm text-gray-600">{contact?.name || 'Unknown Contact'}</p>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="small"
            icon="Edit"
            onClick={() => onEdit(deal)}
          />
          <Button
            variant="ghost"
            size="small"
            icon="Trash2"
            onClick={() => onDelete(deal)}
            className="text-error hover:text-red-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(deal.value)}
          </span>
          <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
            {deal.probability}%
          </div>
        </div>

        {deal.closedDate && (
          <div className="flex items-center text-xs text-gray-500">
            <ApperIcon name="Calendar" size={12} className="mr-1" />
            Expected: {format(new Date(deal.closedDate), 'MMM d, yyyy')}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${deal.probability}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;