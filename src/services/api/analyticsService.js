import contactService from './contactService';
import dealService from './dealService';
import activityService from './activityService';

class AnalyticsService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 400));
  }

  getCacheKey(timeRange) {
    return `analytics_${timeRange}`;
  }

  isCacheValid(cacheEntry) {
    return Date.now() - cacheEntry.timestamp < this.cacheExpiry;
  }

  async getAnalytics(timeRange = '30d') {
    await this.delay();

    const cacheKey = this.getCacheKey(timeRange);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached)) {
      return { ...cached.data };
    }

    try {
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      const analytics = this.calculateAnalytics(contacts, deals, activities, timeRange);
      
      this.cache.set(cacheKey, {
        data: analytics,
        timestamp: Date.now()
      });

      return analytics;
    } catch (error) {
      throw new Error('Failed to calculate analytics');
    }
  }

  calculateAnalytics(contacts, deals, activities, timeRange) {
    const now = new Date();
    const daysBack = this.getDaysFromTimeRange(timeRange);
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Filter data by time range
    const recentDeals = deals.filter(deal => new Date(deal.createdAt) >= startDate);
    const recentContacts = contacts.filter(contact => new Date(contact.createdAt) >= startDate);
    const recentActivities = activities.filter(activity => new Date(activity.date) >= startDate);

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const prevDeals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      return dealDate >= prevStartDate && dealDate < startDate;
    });
    const prevContacts = contacts.filter(contact => {
      const contactDate = new Date(contact.createdAt);
      return contactDate >= prevStartDate && contactDate < startDate;
    });

    // Revenue calculations
    const totalRevenue = recentDeals
      .filter(deal => deal.status === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const prevRevenue = prevDeals
      .filter(deal => deal.status === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Deal calculations
    const closedDeals = recentDeals.filter(deal => 
      deal.status === 'closed-won' || deal.status === 'closed-lost'
    ).length;
    
    const prevClosedDeals = prevDeals.filter(deal => 
      deal.status === 'closed-won' || deal.status === 'closed-lost'
    ).length;
    
    const dealsChange = prevClosedDeals > 0 ? ((closedDeals - prevClosedDeals) / prevClosedDeals) * 100 : 0;

    // Contact calculations
    const newContacts = recentContacts.length;
    const prevNewContacts = prevContacts.length;
    const contactsChange = prevNewContacts > 0 ? ((newContacts - prevNewContacts) / prevNewContacts) * 100 : 0;

    // Conversion rate
    const wonDeals = recentDeals.filter(deal => deal.status === 'closed-won').length;
    const conversionRate = closedDeals > 0 ? (wonDeals / closedDeals) * 100 : 0;
    
    const prevWonDeals = prevDeals.filter(deal => deal.status === 'closed-won').length;
    const prevConversionRate = prevClosedDeals > 0 ? (prevWonDeals / prevClosedDeals) * 100 : 0;
    const conversionChange = prevConversionRate > 0 ? ((conversionRate - prevConversionRate) / prevConversionRate) * 100 : 0;

    // Activity calculations
    const callActivities = recentActivities.filter(activity => activity.type === 'call').length;
    const emailActivities = recentActivities.filter(activity => activity.type === 'email').length;
    const meetingActivities = recentActivities.filter(activity => activity.type === 'meeting').length;

    // Top performing contacts
    const contactRevenue = new Map();
    const contactDeals = new Map();
    
    recentDeals.forEach(deal => {
      if (deal.status === 'closed-won') {
        const current = contactRevenue.get(deal.contactId) || 0;
        contactRevenue.set(deal.contactId, current + deal.value);
        
        const dealCount = contactDeals.get(deal.contactId) || 0;
        contactDeals.set(deal.contactId, dealCount + 1);
      }
    });

    const topContacts = Array.from(contactRevenue.entries())
      .map(([contactId, revenue]) => {
        const contact = contacts.find(c => c.Id === contactId);
        return contact ? {
          Id: contact.Id,
          name: contact.name,
          company: contact.company,
          revenue,
          deals: contactDeals.get(contactId) || 0
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      revenue: {
        total: totalRevenue,
        change: revenueChange
      },
      deals: {
        closed: closedDeals,
        change: dealsChange
      },
      contacts: {
        new: newContacts,
        change: contactsChange
      },
      conversion: {
        rate: conversionRate,
        change: conversionChange
      },
      activities: {
        calls: callActivities,
        emails: emailActivities,
        meetings: meetingActivities
      },
      topContacts
    };
  }

  getDaysFromTimeRange(timeRange) {
    switch (timeRange) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }
}

export default new AnalyticsService();