class AppStore {
    constructor() {
        this.state = JSON.parse(localStorage.getItem('appState')) || {};
        this.listeners = [];
    }
    setState(key, value) {
        this.state[key] = value;
        localStorage.setItem('appState', JSON.stringify(this.state));
        this.notify();
    }
    getState(key) {
        return this.state[key];
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}
// Expose globally so all 100+ apps can access it
window.globalStore = new AppStore();