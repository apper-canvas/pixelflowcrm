import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigation = [
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Pipeline', href: '/pipeline', icon: 'TrendingUp' },
    { name: 'Activities', href: '/activities', icon: 'Activity' },
    { name: 'Tags', href: '/tags', icon: 'Tag' },
    { name: 'Projects', href: '/projects', icon: 'FolderOpen' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href || (item.href === '/contacts' && location.pathname === '/');
    
    return (
      <NavLink
        to={item.href}
        className={({ isActive: linkActive }) => {
          const active = linkActive || isActive;
          return `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
            active
              ? 'bg-primary-600 text-white shadow-micro'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`;
        }}
        onClick={() => onClose && onClose()}
      >
        <ApperIcon name={item.icon} size={20} className="mr-3" />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FlowCRM</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      </div>

      {/* Sidebar */}
      <motion.div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowCRM</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;