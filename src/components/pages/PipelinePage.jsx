import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import DealCard from '@/components/molecules/DealCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import dealService from '@/services/api/dealService';
import contactService from '@/services/api/contactService';

const PipelinePage = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stages = [
    { id: 'prospect', name: 'Prospect', color: 'bg-gray-100' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-100' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-100' },
  ];

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditDeal = (deal) => {
    // TODO: Implement deal editing
    toast.info('Deal editing coming soon');
  };

  const handleDeleteDeal = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      try {
        await dealService.delete(deal.Id);
        setDeals(prev => prev.filter(d => d.Id !== deal.Id));
        toast.success('Deal deleted successfully');
      } catch (err) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getStageTotal = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="h-12 bg-gray-200 rounded animate-shimmer w-64 mb-4" />
        </div>
        <Loading type="pipeline" />
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        title="Failed to load pipeline"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Sales Pipeline"
        showSearch={false}
        onAdd={() => toast.info('Add deal functionality coming soon')}
        addButtonLabel="Add Deal"
        addButtonIcon="Plus"
      />

      <div className="flex-1 p-6 overflow-x-auto">
        {deals.length === 0 ? (
          <Empty
            icon="TrendingUp"
            title="No deals in pipeline"
            message="Start tracking your sales opportunities by adding your first deal."
            actionLabel="Add Deal"
            onAction={() => toast.info('Add deal functionality coming soon')}
          />
        ) : (
          <div className="flex space-x-6 min-w-max">
            {stages.map((stage) => {
              const stageDeals = getDealsByStage(stage.id);
              const stageTotal = getStageTotal(stage.id);
              
              return (
                <div key={stage.id} className="flex-shrink-0 w-80">
                  <div className={`${stage.color} rounded-lg p-4 mb-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                      <div className="text-sm text-gray-600">
                        {stageDeals.length} deals
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      {formatCurrency(stageTotal)}
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {stageDeals.map((deal) => (
                      <DealCard
                        key={deal.Id}
                        deal={deal}
                        contact={getContactById(deal.contactId)}
                        onEdit={handleEditDeal}
                        onDelete={handleDeleteDeal}
                      />
                    ))}
                    
                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        </div>
                        <p className="text-sm">No deals in this stage</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelinePage;