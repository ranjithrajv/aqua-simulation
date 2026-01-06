import { DOMHelper } from '../utils/DOMHelper.js';
import { DIMENSIONS } from '../../config/constants.js';

export class DimensionControls {
  constructor(stateManager, onDimensionChange) {
    this.stateManager = stateManager;
    this.onDimensionChange = onDimensionChange;
    this.init();
  }

  init() {
    const dimensions = ['width', 'length', 'height'];
    dimensions.forEach(dim => this.setupDimensionControl(dim));
  }

  setupDimensionControl(dim) {
    const input = document.getElementById(dim);
    if (!input) return;

    input.addEventListener('input', e => {
      const value = parseFloat(e.target.value);
      DOMHelper.setText(`${dim}Value`, value);
      this.onDimensionChange(dim, value);
    });

    input.addEventListener('change', e => {
      const value = parseFloat(e.target.value);
      const min = parseFloat(e.target.min);
      const max = parseFloat(e.target.max);

      if (value < min || value > max) {
        this.showInputError(dim, `Value must be between ${min} and ${max}`);
      } else {
        this.clearInputError(dim);
      }
    });
  }

  updateDimension(dim, value) {
    DOMHelper.updateDimensionDisplay(dim, value);
  }

  setEnabled(enabled) {
    const dimensions = ['width', 'length', 'height'];
    dimensions.forEach(dim => {
      const input = document.getElementById(dim);
      if (input) input.disabled = !enabled;
    });
  }

  showInputError(dimension, message) {
    const input = document.getElementById(dimension);
    const errorElement = document.getElementById(`${dimension}Error`);

    input.classList.add('input-error', 'error-animation');
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
      input.classList.remove('error-animation');
    }, 500);
  }

  clearInputError(dimension) {
    const input = document.getElementById(dimension);
    const errorElement = document.getElementById(`${dimension}Error`);

    input.classList.remove('input-error');
    errorElement.style.display = 'none';
  }
}
