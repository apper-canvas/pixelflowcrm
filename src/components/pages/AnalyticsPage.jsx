import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import analyticsService from '@/services/api/analyticsService';
import ApperIcon from '@/components/ApperIcon';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await analyticsService.getAnalytics(timeRange);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load analytics');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatPercentage(value) {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Analytics"
        subtitle="Track your sales performance and business metrics"
        action={
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        }
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-micro border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.revenue?.total || 0)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <ApperIcon name="DollarSign" size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${analytics?.revenue?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics?.revenue?.change || 0)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-micro border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deals Closed</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.deals?.closed || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ApperIcon name="TrendingUp" size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${analytics?.deals?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics?.deals?.change || 0)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-micro border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.contacts?.new || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ApperIcon name="Users" size={24} className="text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${analytics?.contacts?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics?.contacts?.change || 0)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-micro border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.conversion?.rate || 0}%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ApperIcon name="Target" size={24} className="text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${analytics?.conversion?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics?.conversion?.change || 0)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-micro border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <ApperIcon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Revenue chart visualization</p>
                  <p className="text-sm text-gray-400">Chart integration coming soon</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-micro border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <ApperIcon name="PieChart" size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Pipeline visualization</p>
                  <p className="text-sm text-gray-400">Chart integration coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-lg shadow-micro border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Activity Summary</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                    <ApperIcon name="Phone" size={24} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.activities?.calls || 0}</p>
                  <p className="text-sm text-gray-600">Calls Made</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                    <ApperIcon name="Mail" size={24} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.activities?.emails || 0}</p>
                  <p className="text-sm text-gray-600">Emails Sent</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                    <ApperIcon name="Calendar" size={24} className="text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.activities?.meetings || 0}</p>
                  <p className="text-sm text-gray-600">Meetings Held</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="mt-8 bg-white rounded-lg shadow-micro border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Contacts</h3>
            </div>
            <div className="p-6">
              {analytics?.topContacts?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topContacts.map((contact, index) => (
                    <div key={contact.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(contact.revenue)}</p>
                        <p className="text-sm text-gray-500">{contact.deals} deals</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No performance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;