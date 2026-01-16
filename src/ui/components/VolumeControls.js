import { formatNumber } from '../../utils/formatters.js';

export class VolumeControls {
  constructor(stateManager, onVolumeChange) {
    this.stateManager = stateManager;
    this.onVolumeChange = onVolumeChange;
    this.init();
  }

  init() {
    this.setupVolumeInput('volumeInput', 'volumeValue', 'total');
    this.setupVolumeInput('waterVolumeInput', 'waterVolumeValue', 'water');
  }

  setupVolumeInput(inputId, valueDisplayId, volumeType) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', e => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        document.getElementById(valueDisplayId).textContent = formatNumber(value, 1);
        this.onVolumeChange(volumeType, value);
      }
    });
  }

  updateVolume(inputId, valueDisplayId, value) {
    DOMHelper.updateVolumeDisplay(inputId, valueDisplayId, value, 1);
  }

  setEnabled(enabled) {
    const volumeInputs = ['volumeInput', 'waterVolumeInput'].map(id => document.getElementById(id));
    volumeInputs.forEach(input => {
      if (input) input.disabled = !enabled;
    });
  }
}
