import mockContacts from '@/services/mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.contacts = [...mockContacts];
  }

  async getAll() {
    await delay(300);
    return [...this.contacts];
  }

  async getById(id) {
    await delay(200);
    const contact = this.contacts.find(c => c.Id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  }

  async create(contactData) {
    await delay(400);
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await delay(350);
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...this.contacts[index],
      ...contactData,
      Id: id // Ensure ID doesn't change
    };
    
    this.contacts[index] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await delay(250);
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    this.contacts.splice(index, 1);
    return true;
  }
}

export default new ContactService();