export class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    const oldState = this.state;
    this.state = { ...this.state, ...updates };
    this.notify(oldState, this.state);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(oldState, newState) {
    this.listeners.forEach(listener => listener(oldState, newState));
  }
}
