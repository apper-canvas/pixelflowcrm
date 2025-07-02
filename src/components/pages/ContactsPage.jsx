import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ContactCard from '@/components/molecules/ContactCard';
import ContactDetailPanel from '@/components/molecules/ContactDetailPanel';
import ContactForm from '@/components/organisms/ContactForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import contactService from '@/services/api/contactService';
import activityService from '@/services/api/activityService';
import dealService from '@/services/api/dealService';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [contactsData, activitiesData, dealsData] = await Promise.all([
        contactService.getAll(),
        activityService.getAll(),
        dealService.getAll()
      ]);
      setContacts(contactsData);
      setActivities(activitiesData);
      setDeals(dealsData);
    } catch (err) {
      setError('Failed to load contacts');
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

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.tags && contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      let savedContact;
      if (editingContact) {
        savedContact = await contactService.update(editingContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === editingContact.Id ? savedContact : c));
        if (selectedContact && selectedContact.Id === editingContact.Id) {
          setSelectedContact(savedContact);
        }
      } else {
        savedContact = await contactService.create(contactData);
        setContacts(prev => [...prev, savedContact]);
      }
    } catch (err) {
      throw new Error('Failed to save contact');
    }
  };

  const handleDeleteContact = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await contactService.delete(contact.Id);
        setContacts(prev => prev.filter(c => c.Id !== contact.Id));
        if (selectedContact && selectedContact.Id === contact.Id) {
          setSelectedContact(null);
        }
        toast.success('Contact deleted successfully');
      } catch (err) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="h-12 bg-gray-200 rounded animate-shimmer w-64 mb-4" />
            <div className="h-10 bg-gray-200 rounded animate-shimmer w-80" />
          </div>
          <Loading type="cards" count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="flex-1">
          <Error 
            title="Failed to load contacts"
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Contacts"
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          onAdd={handleAddContact}
          addButtonLabel="Add Contact"
          addButtonIcon="UserPlus"
        />

        <div className="flex-1 overflow-y-auto p-6">
          {filteredContacts.length === 0 ? (
            searchTerm ? (
              <Empty
                icon="Search"
                title="No contacts found"
                message={`No contacts match "${searchTerm}". Try adjusting your search.`}
                showAction={false}
              />
            ) : (
              <Empty
                icon="Users"
                title="No contacts yet"
                message="Start building your network by adding your first contact."
                actionLabel="Add Contact"
                onAction={handleAddContact}
              />
            )
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.Id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onSelect={handleSelectContact}
                  isSelected={selectedContact?.Id === contact.Id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ContactDetailPanel
        contact={selectedContact}
        activities={activities}
        deals={deals}
        onEdit={handleEditContact}
        onClose={() => setSelectedContact(null)}
      />

      <ContactForm
        contact={editingContact}
        onSave={handleSaveContact}
        onCancel={() => setShowForm(false)}
        isOpen={showForm}
      />
    </div>
  );
};

export default ContactsPage;