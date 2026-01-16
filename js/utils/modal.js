/**
 * Micromodal utility for accessible modals
 * Wraps Micromodal.js library for consistent modal handling
 */

/**
 * Default modal options
 */
const DEFAULT_OPTIONS = {
  awaitCloseAnimation: true,
  awaitOpenAnimation: true,
  disableScroll: true,
  debugMode: false,
  disableFocus: false,
  openTrigger: null,
  closeTrigger: null,
  closeOnEsc: true,
  closeOnClick: false,
  disableAutoFocus: false,
};

/**
 * Common Tailwind CSS classes for modals
 */
const MODAL_CLASSES = {
  overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
  modal: 'bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto',
  closeBtn: 'absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none',
  header: 'px-6 py-4 border-b border-gray-200',
  title: 'text-xl font-semibold text-gray-800',
  body: 'px-6 py-4',
  footer: 'px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3',
};

/**
 * Open a modal with given content and options
 * @param {string|HTMLElement} content - Modal content (HTML or element)
 * @param {Object} options - Modal options
 * @returns {MicroModal} MicroModal instance
 */
export function openModal(content, options = {}) {
  const modalOptions = { ...DEFAULT_OPTIONS, ...options };

  let modal;

  if (typeof content === 'string') {
    modal = MicroModal.show(content, modalOptions);
  } else if (content instanceof HTMLElement) {
    modal = MicroModal.show(content, modalOptions);
  } else {
    throw new Error('Content must be a string or HTMLElement');
  }

  return modal;
}

/**
 * Open a confirmation dialog
 * @param {Object} config - Dialog configuration
 * @returns {Promise<boolean>} Promise that resolves with user's choice
 */
export function showConfirmation(config) {
  return new Promise(resolve => {
    const {
      title = 'Confirm',
      message = 'Are you sure?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmClass = 'bg-red-500 hover:bg-red-600',
      onConfirm = () => {},
      onCancel = () => {},
    } = config;

    const modalId = 'confirmation-modal';

    const html = `
            <div class="${MODAL_CLASSES.modal}" id="${modalId}" aria-hidden="true">
                <div class="${MODAL_CLASSES.header}">
                    <h3 class="${MODAL_CLASSES.title}">${escapeHtml(title)}</h3>
                    <button class="${MODAL_CLASSES.closeBtn}" data-micromodal-close aria-label="Close modal">&times;</button>
                </div>
                <div class="${MODAL_CLASSES.body}">
                    <p class="text-gray-600 mb-6">${escapeHtml(message)}</p>
                    <div class="${MODAL_CLASSES.footer}">
                        <button class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors" data-micromodal-close>
                            ${escapeHtml(cancelText)}
                        </button>
                        <button class="px-4 py-2 ${confirmClass} text-white rounded-lg transition-colors" id="confirmConfirmationBtn">
                            ${escapeHtml(confirmText)}
                        </button>
                    </div>
                </div>
            </div>
        `;

    const modal = openModal(html, {
      onClose: () => {
        onCancel();
        resolve(false);
      },
    });

    setTimeout(() => {
      const confirmBtn = document.getElementById('confirmConfirmationBtn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          onConfirm();
          modal.close();
          resolve(true);
        });
      }
    }, 100);
  });
}

/**
 * Show an alert dialog
 * @param {Object} config - Alert configuration
 * @returns {Promise<void>} Promise that resolves when dismissed
 */
export function showAlert(config) {
  return new Promise(resolve => {
    const {
      title = 'Alert',
      message = 'Something happened!',
      buttonText = 'OK',
      onDismiss = () => {},
    } = config;

    const modalId = 'alert-modal';

    const html = `
            <div class="${MODAL_CLASSES.modal}" id="${modalId}" aria-hidden="true">
                <div class="${MODAL_CLASSES.header}">
                    <h3 class="${MODAL_CLASSES.title}">${escapeHtml(title)}</h3>
                    <button class="${MODAL_CLASSES.closeBtn}" data-micromodal-close aria-label="Close modal">&times;</button>
                </div>
                <div class="${MODAL_CLASSES.body}">
                    <p class="text-gray-600 mb-6">${escapeHtml(message)}</p>
                    <div class="${MODAL_CLASSES.footer}">
                        <button class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors" data-micromodal-close>
                            ${escapeHtml(buttonText)}
                        </button>
                    </div>
                </div>
            </div>
        `;

    const modal = openModal(html, {
      onClose: onDismiss,
    });

    setTimeout(() => resolve(), 100);
  });
}

/**
 * Open a form modal
 * @param {Object} config - Form modal configuration
 * @returns {Promise<Object>} Promise that resolves with form data
 */
export function showFormModal(config) {
  return new Promise(resolve => {
    const {
      title = 'Form',
      fields = [],
      submitText = 'Submit',
      cancelText = 'Cancel',
      onSubmit = data => {},
      onCancel = () => {},
    } = config;

    const modalId = 'form-modal';

    const fieldHtml = fields
      .map(
        field => `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2" for="${field.id}">
                    ${escapeHtml(field.label)}
                    ${field.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
                </label>
                ${
                  field.type === 'textarea'
                    ? `<textarea id="${field.id}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" rows="${field.rows || 3}" ${field.required ? 'required' : ''} placeholder="${escapeHtml(field.placeholder || '')}"></textarea>`
                    : `<input type="${field.type || 'text'}" id="${field.id}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" ${field.required ? 'required' : ''} placeholder="${escapeHtml(field.placeholder || '')}" ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}>`
                }
            </div>
        `
      )
      .join('');

    const html = `
            <div class="${MODAL_CLASSES.modal}" id="${modalId}" aria-hidden="true">
                <div class="${MODAL_CLASSES.header}">
                    <h3 class="${MODAL_CLASSES.title}">${escapeHtml(title)}</h3>
                    <button class="${MODAL_CLASSES.closeBtn}" data-micromodal-close aria-label="Close modal">&times;</button>
                </div>
                <div class="${MODAL_CLASSES.body}">
                    <form id="formModalForm">
                        ${fieldHtml}
                    </form>
                    <div class="${MODAL_CLASSES.footer}">
                        <button type="button" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors" data-micromodal-close>
                            ${escapeHtml(cancelText)}
                        </button>
                        <button type="submit" form="formModalForm" class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors" id="submitFormBtn">
                            ${escapeHtml(submitText)}
                        </button>
                    </div>
                </div>
            </div>
        `;

    const modal = openModal(html, {
      onClose: () => {
        onCancel();
        resolve(null);
      },
    });

    const form = document.getElementById('formModalForm');
    const submitBtn = document.getElementById('submitFormBtn');

    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const formData = {};
      fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
          formData[field.id] = element.value;
        }
      });

      onSubmit(formData);
      modal.close();
      resolve(formData);
    });
  });
}

/**
 * Open a custom content modal
 * @param {string} modalId - Unique ID for the modal
 * @param {Object} config - Modal configuration
 * @returns {MicroModal} MicroModal instance
 */
export function openCustomModal(modalId, config) {
  const { title, content, showClose = true, width = 'max-w-2xl', onClose = () => {} } = config;

  const modalWidth = width.includes('max-w-') ? width : `max-w-${width}`;

  const html = `
        <div class="${MODAL_CLASSES.modal} ${modalWidth}" id="${modalId}" aria-hidden="true">
            <div class="${MODAL_CLASSES.header}">
                <h3 class="${MODAL_CLASSES.title}">${escapeHtml(title)}</h3>
                ${showClose ? `<button class="${MODAL_CLASSES.closeBtn}" data-micromodal-close aria-label="Close modal">&times;</button>` : ''}
            </div>
            <div class="${MODAL_CLASSES.body}">
                ${content}
            </div>
        </div>
    `;

  return openModal(html, {
    onClose,
  });
}

/**
 * Close all open modals
 */
export function closeAllModals() {
  MicroModal.close();
}

/**
 * Check if Micromodal is available
 * @returns {boolean} True if MicroModal is loaded
 */
export function isMicroModalAvailable() {
  return typeof MicroModal !== 'undefined';
}

/**
 * Escape HTML to prevent XSS
 * @param {string} html - HTML string to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Create modal instance with custom options
 * @param {string} modalId - Modal element ID
 * @param {Object} options - Modal options
 * @returns {MicroModal} MicroModal instance
 */
export function createModal(modalId, options = {}) {
  return MicroModal.init(modalId, { ...DEFAULT_OPTIONS, ...options });
}

export default {
  openModal,
  showConfirmation,
  showAlert,
  showFormModal,
  openCustomModal,
  closeAllModals,
  isMicroModalAvailable,
  createModal,
  MODAL_CLASSES,
};
