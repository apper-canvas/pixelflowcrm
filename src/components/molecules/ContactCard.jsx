import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Tag from '@/components/atoms/Tag';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContactCard = ({ contact, onEdit, onDelete, onSelect, isSelected = false }) => {
  const tagColors = ['blue', 'green', 'yellow', 'purple', 'indigo'];
  
  const getTagColor = (index) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <motion.div
      className={`bg-white rounded-lg p-4 shadow-micro hover:shadow-subtle transition-all duration-150 cursor-pointer border-2 ${
        isSelected ? 'border-primary-500' : 'border-transparent'
      }`}
      onClick={() => onSelect(contact)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Avatar name={contact.name} size="medium" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
            <p className="text-sm text-gray-600 truncate">{contact.email}</p>
            {contact.company && (
              <p className="text-sm text-gray-500 truncate">{contact.company}</p>
            )}
            {contact.lastContact && (
              <p className="text-xs text-gray-400 mt-1">
                Last contact: {format(new Date(contact.lastContact), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="small"
            icon="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          />
          <Button
            variant="ghost"
            size="small"
            icon="Trash2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-error hover:text-red-700"
          />
        </div>
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} color={getTagColor(index)} variant="default">
              {tag}
            </Tag>
          ))}
          {contact.tags.length > 3 && (
            <Tag color="gray" variant="default">
              +{contact.tags.length - 3}
            </Tag>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {contact.phone && (
            <div className="flex items-center text-gray-500">
              <ApperIcon name="Phone" size={14} className="mr-1" />
              <span className="text-xs">{contact.phone}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400">
          Added {format(new Date(contact.createdAt), 'MMM d')}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;