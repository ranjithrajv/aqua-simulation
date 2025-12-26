// DOM manipulation utilities to reduce repetitive code
export class DOMHelper {
    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} DOM element or null
     */
    static getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Set text content of element
     * @param {string} id - Element ID
     * @param {string} text - Text content
     */
    static setText(id, text) {
        const element = this.getElement(id);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Element with ID '${id}' not found`);
        }
    }

    /**
     * Set value of input element
     * @param {string} id - Element ID
     * @param {string|number} value - Input value
     */
    static setValue(id, value) {
        const element = this.getElement(id);
        if (element) {
            element.value = value;
        } else {
            console.warn(`Element with ID '${id}' not found`);
        }
    }

    /**
     * Get value of input element
     * @param {string} id - Element ID
     * @returns {string} Input value or empty string
     */
    static getValue(id) {
        const element = this.getElement(id);
        return element ? element.value : '';
    }

    /**
     * Update both input value and display text for dimension controls
     * @param {string} id - Base ID (without 'Value' suffix)
     * @param {number} value - Numeric value
     */
    static updateDimensionDisplay(id, value) {
        this.setValue(id, value);
        this.setText(`${id}Value`, value);
    }

    /**
     * Update volume display with formatted value
     * @param {string} inputId - Input element ID
     * @param {string} valueId - Value display element ID
     * @param {number} value - Numeric value
     * @param {number} decimals - Decimal places (default: 1)
     */
    static updateVolumeDisplay(inputId, valueId, value, decimals = 1) {
        this.setValue(inputId, value);
        this.setText(valueId, Number.isFinite(value) ? value.toFixed(decimals) : '--');
    }

    /**
     * Set disabled state of element
     * @param {string} id - Element ID
     * @param {boolean} disabled - Disabled state
     */
    static setDisabled(id, disabled) {
        const element = this.getElement(id);
        if (element) {
            element.disabled = disabled;
            element.style.opacity = disabled ? '0.5' : '1';
            element.style.pointerEvents = disabled ? 'none' : 'auto';
        }
    }

    /**
     * Add event listener to element
     * @param {string} id - Element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    static addEventListener(id, event, handler) {
        const element = this.getElement(id);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Cannot add event listener: element '${id}' not found`);
        }
    }

    /**
     * Batch update multiple elements
     * @param {Object} updates - Object with id: value pairs
     */
    static batchUpdate(updates) {
        Object.entries(updates).forEach(([id, value]) => {
            if (typeof value === 'string') {
                this.setText(id, value);
            } else {
                this.setValue(id, value);
            }
        });
    }
}