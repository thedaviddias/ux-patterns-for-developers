export const basicModalExample = `
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
    <p>Modal content goes here...</p>

    <div class="modal-actions">
      <button type="button" class="button-secondary modal-cancel">
        Cancel
      </button>
      <button type="button" class="button-primary modal-submit">Confirm</button>
    </div>
  </div>
</div>
`;
