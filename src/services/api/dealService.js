import mockDeals from '@/services/mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.deals = [...mockDeals];
  }

  async getAll() {
    await delay(300);
    return [...this.deals];
  }

  async getById(id) {
    await delay(200);
    const deal = this.deals.find(d => d.Id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  }

  async create(dealData) {
    await delay(400);
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id)) + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await delay(350);
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      Id: id // Ensure ID doesn't change
    };
    
    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async delete(id) {
    await delay(250);
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    this.deals.splice(index, 1);
    return true;
  }
}

export default new DealService();