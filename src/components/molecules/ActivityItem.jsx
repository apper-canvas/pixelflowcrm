import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ActivityItem = ({ activity, contact, onEdit, onDelete, onToggleComplete }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Calendar',
      note: 'FileText',
      task: 'CheckSquare',
      follow_up: 'Clock',
    };
    return icons[type] || 'Circle';
  };

  const getActivityColor = (type) => {
    const colors = {
      call: 'text-blue-600',
      email: 'text-green-600', 
      meeting: 'text-purple-600',
      note: 'text-gray-600',
      task: 'text-orange-600',
      follow_up: 'text-yellow-600',
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <motion.div
      className={`bg-white rounded-lg p-4 shadow-micro hover:shadow-subtle transition-all duration-150 ${
        activity.completed ? 'opacity-75' : ''
      }`}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${getActivityColor(activity.type)}`}>
          <ApperIcon name={getActivityIcon(activity.type)} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 capitalize">
                {activity.type.replace('_', ' ')}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{contact?.name || 'Unknown Contact'}</span>
                <span>•</span>
                <span>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-4">
              {activity.type === 'task' && (
                <Button
                  variant="ghost"
                  size="small"
                  icon={activity.completed ? "CheckSquare" : "Square"}
                  onClick={() => onToggleComplete(activity)}
                  className={activity.completed ? 'text-green-600' : 'text-gray-400'}
                />
              )}
              <Button
                variant="ghost"
                size="small"
                icon="Edit"
                onClick={() => onEdit(activity)}
              />
              <Button
                variant="ghost"
                size="small"
                icon="Trash2"
                onClick={() => onDelete(activity)}
                className="text-error hover:text-red-700"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityItem;