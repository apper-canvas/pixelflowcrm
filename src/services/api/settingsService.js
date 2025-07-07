class SettingsService {
  constructor() {
    this.storageKey = 'flowcrm_settings';
    this.defaultSettings = {
      account: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Acme Corporation',
        phone: '+1 (555) 123-4567'
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        dealUpdates: true,
        activityReminders: true,
        weeklyReports: false
      },
      appearance: {
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/DD/YYYY'
      }
    };
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }

  async getSettings() {
    await this.delay();
    
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...this.defaultSettings, ...parsed };
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
    
    return { ...this.defaultSettings };
  }

  async updateSettings(settings) {
    await this.delay();
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      return { ...settings };
    } catch (error) {
      throw new Error('Failed to save settings');
    }
  }

  async resetSettings() {
    await this.delay();
    
    try {
      localStorage.removeItem(this.storageKey);
      return { ...this.defaultSettings };
    } catch (error) {
      throw new Error('Failed to reset settings');
    }
  }
}

export default new SettingsService();