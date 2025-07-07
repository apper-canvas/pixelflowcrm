import mockData from '@/services/mockData/projects.json';

class ProjectService {
  constructor() {
    this.data = [...mockData];
    this.nextId = Math.max(...this.data.map(item => item.Id)) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
      throw new Error('Invalid ID format');
    }
    
    await this.delay();
    const project = this.data.find(item => item.Id === numberId);
    return project ? { ...project } : null;
  }

  async create(projectData) {
    await this.delay();
    
    const newProject = {
      ...projectData,
      Id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.data.push(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
      throw new Error('Invalid ID format');
    }

    await this.delay();
    
    const index = this.data.findIndex(item => item.Id === numberId);
    if (index === -1) {
      throw new Error('Project not found');
    }

    const updatedProject = {
      ...this.data[index],
      ...projectData,
      Id: numberId,
      updatedAt: new Date().toISOString()
    };

    this.data[index] = updatedProject;
    return { ...updatedProject };
  }

  async delete(id) {
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
      throw new Error('Invalid ID format');
    }

    await this.delay();
    
    const index = this.data.findIndex(item => item.Id === numberId);
    if (index === -1) {
      throw new Error('Project not found');
    }

    this.data.splice(index, 1);
    return true;
  }
}

export default new ProjectService();