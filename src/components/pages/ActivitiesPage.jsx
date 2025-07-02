import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ActivityItem from '@/components/molecules/ActivityItem';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import activityService from '@/services/api/activityService';
import contactService from '@/services/api/contactService';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'note', label: 'Notes' },
    { value: 'task', label: 'Tasks' },
    { value: 'follow_up', label: 'Follow-ups' },
  ];

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const filteredActivities = activities.filter(activity => {
    const contact = getContactById(activity.contactId);
    const matchesSearch = !searchTerm || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact && contact.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleEditActivity = (activity) => {
    // TODO: Implement activity editing
    toast.info('Activity editing coming soon');
  };

  const handleDeleteActivity = async (activity) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.delete(activity.Id);
        setActivities(prev => prev.filter(a => a.Id !== activity.Id));
        toast.success('Activity deleted successfully');
      } catch (err) {
        toast.error('Failed to delete activity');
      }
    }
  };

  const handleToggleComplete = async (activity) => {
    try {
      const updatedActivity = await activityService.update(activity.Id, {
        ...activity,
        completed: !activity.completed
      });
      setActivities(prev => prev.map(a => a.Id === activity.Id ? updatedActivity : a));
      toast.success(updatedActivity.completed ? 'Task completed' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update activity');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="h-12 bg-gray-200 rounded animate-shimmer w-64 mb-4" />
          <div className="h-10 bg-gray-200 rounded animate-shimmer w-80" />
        </div>
        <Loading type="list" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        title="Failed to load activities"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Activities"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        onAdd={() => toast.info('Add activity functionality coming soon')}
        addButtonLabel="Add Activity"
        addButtonIcon="Plus"
        actions={[
          {
            label: 'Filter',
            icon: 'Filter',
            variant: 'secondary',
            onClick: () => toast.info('Filter functionality coming soon')
          }
        ]}
      />

      <div className="flex-1 p-6">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {activityTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                    filterType === type.value
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          searchTerm || filterType !== 'all' ? (
            <Empty
              icon="Search"
              title="No activities found"
              message="No activities match your current search or filter. Try adjusting your criteria."
              showAction={false}
            />
          ) : (
            <Empty
              icon="Activity"
              title="No activities yet"
              message="Start tracking your customer interactions by adding your first activity."
              actionLabel="Add Activity"
              onAction={() => toast.info('Add activity functionality coming soon')}
            />
          )
        ) : (
          <div className="space-y-4">
            {filteredActivities
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((activity) => (
                <ActivityItem
                  key={activity.Id}
                  activity={activity}
                  contact={getContactById(activity.contactId)}
                  onEdit={handleEditActivity}
                  onDelete={handleDeleteActivity}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;