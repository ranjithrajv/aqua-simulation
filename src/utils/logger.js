class Logger {
    constructor() {
        this.enabled = this.isDebugEnabled();
    }

    isDebugEnabled() {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            try {
                return localStorage.getItem('debugMode') === 'true' ||
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
            } catch (error) {
                // localStorage might not be available due to security settings
                return window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
            }
        } else {
            // In Node.js environment, default to false
            return false;
        }
    }

    enableDebugMode(enabled) {
        // Only try to use localStorage in browser environment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('debugMode', enabled.toString());
            } catch (error) {
                console.warn('Failed to save debug mode to localStorage:', error);
            }
        }
        this.enabled = this.isDebugEnabled();
    }

    log(...args) {
        if (this.enabled) {
            console.log('[Aquarium App]', ...args);
        }
    }

    error(...args) {
        if (this.enabled) {
            console.error('[Aquarium App]', ...args);
        }
    }

    warn(...args) {
        if (this.enabled) {
            console.warn('[Aquarium App]', ...args);
        }
    }

    info(...args) {
        if (this.enabled) {
            console.info('[Aquarium App]', ...args);
        }
    }
}

export const logger = new Logger();
