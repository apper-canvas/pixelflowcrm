import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Tag from '@/components/atoms/Tag';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import contactService from '@/services/api/contactService';
import ApperIcon from '@/components/ApperIcon';

const TagsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load tags');
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

  // Extract all unique tags from contacts
  const getAllTags = () => {
    const tagMap = new Map();
    
    contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags.forEach(tag => {
          if (tagMap.has(tag)) {
            tagMap.set(tag, tagMap.get(tag) + 1);
          } else {
            tagMap.set(tag, 1);
          }
        });
      }
    });

    return Array.from(tagMap, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const allTags = getAllTags();

  const filteredTags = allTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContactsWithTag = (tagName) => {
    return contacts.filter(contact => 
      contact.tags && contact.tags.includes(tagName)
    );
  };

  const tagColors = ['blue', 'green', 'yellow', 'purple', 'indigo', 'red'];
  const getTagColor = (index) => tagColors[index % tagColors.length];

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="h-12 bg-gray-200 rounded animate-shimmer w-64 mb-4" />
          <div className="h-10 bg-gray-200 rounded animate-shimmer w-80" />
        </div>
        <Loading type="cards" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        title="Failed to load tags"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Tags"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        showAdd={false}
      />

      <div className="flex-1 p-6">
        {allTags.length === 0 ? (
          <Empty
            icon="Tag"
            title="No tags found"
            message="Tags will appear here once you add them to your contacts."
            showAction={false}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tags List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">All Tags</h2>
              
              {filteredTags.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No tags match your search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTags.map((tag, index) => (
                    <div
                      key={tag.name}
                      className={`bg-white rounded-lg p-4 shadow-micro hover:shadow-subtle transition-all duration-150 cursor-pointer border-2 ${
                        selectedTag === tag.name ? 'border-primary-500' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Tag color={getTagColor(index)} variant="large">
                            {tag.name}
                          </Tag>
                          <span className="text-sm text-gray-600">
                            {tag.count} contact{tag.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <ApperIcon 
                          name={selectedTag === tag.name ? "ChevronUp" : "ChevronDown"} 
                          size={20} 
                          className="text-gray-400" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tag Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedTag ? `Contacts with "${selectedTag}"` : 'Select a tag'}
              </h2>
              
              {selectedTag ? (
                <div className="space-y-3">
                  {getContactsWithTag(selectedTag).map((contact) => (
                    <div key={contact.Id} className="bg-white rounded-lg p-4 shadow-micro">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.company && (
                              <p className="text-sm text-gray-500">{contact.company}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {contact.tags?.slice(0, 2).map((tag, tagIndex) => (
                            <Tag key={tagIndex} color={getTagColor(tagIndex)} variant="default">
                              {tag}
                            </Tag>
                          ))}
                          {contact.tags && contact.tags.length > 2 && (
                            <Tag color="gray" variant="default">
                              +{contact.tags.length - 2}
                            </Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Tag" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Click on a tag to see all contacts that have it
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsPage;