export class ValidationService {
  static validateDimension(value, min, max, name) {
    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, message: `${name} must be a number` };
    }
    if (value < min) {
      return { valid: false, message: `${name} must be at least ${min}` };
    }
    if (value > max) {
      return { valid: false, message: `${name} must be at most ${max}` };
    }
    return { valid: true };
  }

  static validateVolume(value, min, max, name) {
    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, message: `${name} must be a number` };
    }
    if (value <= 0) {
      return { valid: false, message: `${name} must be positive` };
    }
    if (value > max) {
      return { valid: false, message: `${name} exceeds maximum allowed value` };
    }
    return { valid: true };
  }

  static validateName(value) {
    if (!value || typeof value !== 'string') {
      return { valid: false, message: 'Name is required' };
    }
    if (value.trim().length === 0) {
      return { valid: false, message: 'Name cannot be empty' };
    }
    if (value.length > 50) {
      return { valid: false, message: 'Name must be 50 characters or less' };
    }
    return { valid: true };
  }
}
