import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/atoms/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onAdd, 
  addButtonLabel = "Add", 
  addButtonIcon = "Plus",
  showSearch = true,
  showAdd = true,
  actions = [] 
}) => {
  return (
    <motion.header
      className="bg-white border-b border-gray-200 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {showSearch && (
            <div className="w-80">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search..."
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size="medium"
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
          
          {showAdd && onAdd && (
            <Button
              variant="primary"
              size="medium"
              icon={addButtonIcon}
              onClick={onAdd}
            >
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;