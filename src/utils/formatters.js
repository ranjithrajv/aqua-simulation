import { logger } from './logger.js';
import { debounceFunction, clamp as lodashClamp } from './utils/lodash-utils.js';

export function escapeHtml(text) {
  if (typeof text !== 'string') {
    return '';
  }
  const div = document.createElement('div');
  div.textContent = text;
  return div.textContent || div.innerText || '';
}

/**
 * Sanitize HTML content by parsing and re-creating safe elements
 * @param {string} htmlString - HTML string to sanitize
 * @returns {DocumentFragment} Sanitized DOM fragment
 */
export function sanitizeHTML(htmlString) {
  if (typeof htmlString !== 'string') {
    return document.createDocumentFragment();
  }

  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();

  // Remove potentially dangerous elements and attributes
  const walk = node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;

      // Remove dangerous attributes
      const dangerousAttrs = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attrName = element.attributes[i].name.toLowerCase();
        if (attrName.startsWith('on')) {
          // Remove event handlers
          dangerousAttrs.push(attrName);
        }
      }

      dangerousAttrs.forEach(attrName => element.removeAttribute(attrName));

      // Recursively sanitize child nodes
      for (let i = 0; i < element.childNodes.length; i++) {
        walk(element.childNodes[i]);
      }
    }
  };

  walk(template.content);
  return template.content;
}

export function clamp(value, min, max) {
  return lodashClamp(value, min, max);
}

export function formatNumber(value, decimals = 1) {
  return value.toFixed(decimals);
}

export function formatWeight(lbs, kg = null) {
  const kgValue = kg !== null ? kg : lbs * 0.453592;
  return `${lbs.toFixed(1)} lbs (${kgValue.toFixed(1)} kg)`;
}

export function debounce(func, wait) {
  return debounceFunction(func, wait);
}

export function showError(message) {
  logger.error(message);
}

export function showWarning(message) {
  logger.warn(message);
}

export function createButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);

  if (options.className) button.className = options.className;
  if (options.id) button.id = options.id;
  if (options.disabled !== undefined) button.disabled = options.disabled;

  return button;
}

export function createSelect(options, onChange) {
  const select = document.createElement('select');
  select.addEventListener('change', onChange);

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.selected) option.selected = true;
    select.appendChild(option);
  });

  return select;
}
