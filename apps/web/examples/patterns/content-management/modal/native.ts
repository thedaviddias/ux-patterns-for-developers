export const nativeModalExample = `
<!-- Trigger Button -->
<button
  type="button"
  onclick="document.getElementById('nativeModal').showModal()"
>
  Open Modal
</button>

<!-- Native HTML Modal -->
<dialog id="nativeModal">
  <h2>Modal Title</h2>
  <p>Modal content goes here...</p>

  <div class="modal-actions">
    <button
      type="button"
      class="button-secondary"
      onclick="document.getElementById('nativeModal').close()"
    >
      Cancel
    </button>
    <button type="button" class="button-primary">Confirm</button>
  </div>
</dialog>
`;
