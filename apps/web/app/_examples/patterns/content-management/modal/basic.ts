export const basicModalExample = `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  /* Trigger Button */
  button[data-modal-target] {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  button[data-modal-target]:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  button[data-modal-target]:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Modal Styles */
  .modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .modal.active {
    opacity: 1;
    visibility: visible;
  }

  .modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal-content {
    position: relative;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    padding: 2rem;
    transform: translateY(-20px) scale(0.95);
    transition: all 0.3s ease;
  }

  .modal.active .modal-content {
    transform: translateY(0) scale(1);
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  .modal-close:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .modal h2 {
    margin-bottom: 1rem;
    color: #1e293b;
    font-size: 1.25rem;
  }

  .modal p {
    margin-bottom: 1.5rem;
    color: #475569;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .button-secondary {
    background: #e2e8f0;
    color: #475569;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .button-secondary:hover {
    background: #cbd5e1;
  }

  .button-primary {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .button-primary:hover {
    background: #2563eb;
  }

  .button-secondary:focus-visible,
  .button-primary:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Prevent body scroll when modal is open */
  body.modal-open {
    overflow: hidden;
  }
</style>

<!-- Trigger Button -->
<button type="button" data-modal-target="basicModal">Open Modal</button>

<!-- Modal -->
<div id="basicModal" class="modal" role="dialog" aria-modal="true">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <button type="button" class="modal-close" aria-label="Close modal">
      &times;
    </button>

    <h2>Modal Title</h2>
    <p>Modal content goes here... You can close this modal by clicking the × button, pressing Escape, or clicking outside the content area.</p>

    <div class="modal-actions">
      <button type="button" class="button-secondary modal-cancel">
        Cancel
      </button>
      <button type="button" class="button-primary modal-submit">Confirm</button>
    </div>
  </div>
</div>

<script>
  // Modal functionality
  let activeModal = null;
  let focusedElementBeforeModal = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Store currently focused element
    focusedElementBeforeModal = document.activeElement;

    // Prevent body scroll
    document.body.classList.add('modal-open');

    // Show modal with animation
    activeModal = modal;
    modal.classList.add('active');

    // Focus management
    setTimeout(() => {
      const firstFocusable = modal.querySelector('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);
  }

  function closeModal() {
    if (!activeModal) return;

    // Remove active state
    activeModal.classList.remove('active');

    // Restore body scroll
    document.body.classList.remove('modal-open');

    // Restore focus
    if (focusedElementBeforeModal) {
      focusedElementBeforeModal.focus();
      focusedElementBeforeModal = null;
    }

    activeModal = null;
  }

  // Event listeners
  document.addEventListener('click', (e) => {
    // Open modal
    if (e.target.hasAttribute('data-modal-target')) {
      const modalId = e.target.getAttribute('data-modal-target');
      openModal(modalId);
    }
    
    // Close modal
    if (e.target.matches('.modal-close, .modal-cancel')) {
      closeModal();
    }

    // Close on overlay click
    if (e.target.matches('.modal-overlay')) {
      closeModal();
    }
  });

  // Keyboard handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeModal();
    }
  });
</script>
`;
