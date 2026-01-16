export class StorageService {
  constructor(key = 'aquariumConfigs') {
    this.key = key;
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return [];
    }
  }

  save(configs) {
    try {
      localStorage.setItem(this.key, JSON.stringify(configs));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  add(config) {
    const configs = this.getAll();
    configs.push(config);
    return this.save(configs);
  }

  delete(id) {
    const configs = this.getAll().filter(c => c.id !== id);
    return this.save(configs);
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}
