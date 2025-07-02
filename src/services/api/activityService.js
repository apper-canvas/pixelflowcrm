import mockActivities from '@/services/mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...mockActivities];
  }

  async getAll() {
    await delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.Id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  }

  async create(activityData) {
    await delay(400);
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      ...activityData,
      timestamp: new Date().toISOString(),
      completed: false
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(350);
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: id // Ensure ID doesn't change
    };
    
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await delay(250);
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    this.activities.splice(index, 1);
    return true;
  }
}

export default new ActivityService();