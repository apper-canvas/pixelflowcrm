import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Tag from '@/components/atoms/Tag';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContactDetailPanel = ({ contact, activities = [], deals = [], onEdit, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!contact) {
    return (
      <div className="w-88 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ApperIcon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Select a contact to view details</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: 'Info', icon: 'User' },
    { id: 'activities', label: 'Activities', icon: 'Activity' },
    { id: 'deals', label: 'Deals', icon: 'DollarSign' },
  ];

  const contactActivities = activities.filter(activity => activity.contactId === contact.Id);
  const contactDeals = deals.filter(deal => deal.contactId === contact.Id);

  const tagColors = ['blue', 'green', 'yellow', 'purple', 'indigo'];
  const getTagColor = (index) => tagColors[index % tagColors.length];

  return (
    <motion.div
      className="w-88 bg-white border-l border-gray-200 flex flex-col h-full"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar name={contact.name} size="large" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-gray-600">{contact.email}</p>
              {contact.company && (
                <p className="text-sm text-gray-500">{contact.company}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="small"
              icon="Edit"
              onClick={() => onEdit(contact)}
            />
            <Button
              variant="ghost"
              size="small"
              icon="X"
              onClick={onClose}
            />
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {contact.tags.map((tag, index) => (
              <Tag key={index} color={getTagColor(index)}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.id === 'activities' && contactActivities.length > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                  {contactActivities.length}
                </span>
              )}
              {tab.id === 'deals' && contactDeals.length > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                  {contactDeals.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="p-6"
          >
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Mail" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Phone" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.phone}</span>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Building" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Activity Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Activities</span>
                      <span className="text-sm font-medium text-gray-900">{contactActivities.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Deals</span>
                      <span className="text-sm font-medium text-gray-900">{contactDeals.length}</span>
                    </div>
                    {contact.lastContact && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Contact</span>
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(contact.lastContact), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Added</span>
                      <span className="text-sm font-medium text-gray-900">
                        {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Recent Activities</h3>
                  <Button size="small" icon="Plus">
                    Add Activity
                  </Button>
                </div>
                
                {contactActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Activity" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No activities yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactActivities
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 10)
                      .map((activity) => (
                        <div key={activity.Id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 text-primary-600">
                              <ApperIcon name="Activity" size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {activity.type.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Active Deals</h3>
                  <Button size="small" icon="Plus">
                    Add Deal
                  </Button>
                </div>
                
                {contactDeals.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="DollarSign" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No deals yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactDeals.map((deal) => (
                      <div key={deal.Id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{deal.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">Stage: {deal.stage}</p>
                            <p className="text-lg font-semibold text-primary-600 mt-2">
                              ${deal.value.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {deal.probability}%
                          </div>
                        </div>
                        {deal.closedDate && (
                          <p className="text-xs text-gray-500 mt-3">
                            Expected close: {format(new Date(deal.closedDate), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContactDetailPanel;