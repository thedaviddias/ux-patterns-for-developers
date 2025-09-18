export const basicCheckboxExample = `
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

  .container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #111827;
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-section h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  /* Checkbox Styles */
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .checkbox-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .checkbox-input {
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
    accent-color: #3b82f6;
  }

  .checkbox-label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    line-height: 1.5;
    user-select: none;
  }

  .checkbox-label:hover {
    color: #1f2937;
  }

  .checkbox-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
    line-height: 1.4;
  }

  /* Disabled State */
  .checkbox-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox-item.disabled .checkbox-input {
    cursor: not-allowed;
  }

  .checkbox-item.disabled .checkbox-label {
    cursor: not-allowed;
  }

  /* Focus Styles */
  .checkbox-input:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Fieldset Styles */
  fieldset {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  legend {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    padding: 0 0.5rem;
  }

  /* Inline Checkboxes */
  .checkbox-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .checkbox-inline .checkbox-item {
    flex: 0 0 auto;
  }

  /* Indeterminate State */
  .checkbox-indeterminate {
    position: relative;
  }

  .checkbox-indeterminate::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 2px;
    background: #3b82f6;
    transform: translate(-50%, -50%);
    border-radius: 1px;
  }

  /* Demo Info */
  .info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 1rem;
    margin-top: 2rem;
  }

  .info-box h3 {
    color: #1e40af;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .info-box p {
    color: #3730a3;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .checkbox-inline {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
</style>

<div class="container">
  <h2>Checkbox Examples</h2>

  <!-- Basic Checkboxes -->
  <div class="form-section">
    <h3>Basic Checkboxes</h3>
    <div class="checkbox-group">
      <div class="checkbox-item">
        <input type="checkbox" id="newsletter" name="preferences" value="newsletter" class="checkbox-input">
        <label for="newsletter" class="checkbox-label">
          Subscribe to newsletter
          <div class="checkbox-description">Get weekly updates about new features and tips</div>
        </label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="notifications" name="preferences" value="notifications" class="checkbox-input">
        <label for="notifications" class="checkbox-label">
          Email notifications
          <div class="checkbox-description">Receive notifications about important updates</div>
        </label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="marketing" name="preferences" value="marketing" class="checkbox-input">
        <label for="marketing" class="checkbox-label">
          Marketing emails
          <div class="checkbox-description">Promotional offers and product announcements</div>
        </label>
      </div>
    </div>
  </div>

  <!-- Grouped Checkboxes -->
  <div class="form-section">
    <h3>Grouped Checkboxes</h3>
    <fieldset>
      <legend>Communication Preferences</legend>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <input type="checkbox" id="email" name="communication" value="email" class="checkbox-input">
          <label for="email" class="checkbox-label">Email notifications</label>
        </div>

        <div class="checkbox-item">
          <input type="checkbox" id="sms" name="communication" value="sms" class="checkbox-input">
          <label for="sms" class="checkbox-label">SMS notifications</label>
        </div>

        <div class="checkbox-item">
          <input type="checkbox" id="push" name="communication" value="push" class="checkbox-input">
          <label for="push" class="checkbox-label">Push notifications</label>
        </div>
      </div>
    </fieldset>
  </div>

  <!-- Inline Checkboxes -->
  <div class="form-section">
    <h3>Inline Checkboxes</h3>
    <div class="checkbox-inline">
      <div class="checkbox-item">
        <input type="checkbox" id="terms" name="agreements" value="terms" class="checkbox-input">
        <label for="terms" class="checkbox-label">Terms of Service</label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="privacy" name="agreements" value="privacy" class="checkbox-input">
        <label for="privacy" class="checkbox-label">Privacy Policy</label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="cookies" name="agreements" value="cookies" class="checkbox-input">
        <label for="cookies" class="checkbox-label">Cookie Policy</label>
      </div>
    </div>
  </div>

  <!-- Disabled State -->
  <div class="form-section">
    <h3>Disabled State</h3>
    <div class="checkbox-group">
      <div class="checkbox-item">
        <input type="checkbox" id="enabled" name="status" value="enabled" class="checkbox-input">
        <label for="enabled" class="checkbox-label">Enabled option</label>
      </div>

      <div class="checkbox-item disabled">
        <input type="checkbox" id="disabled" name="status" value="disabled" class="checkbox-input" disabled>
        <label for="disabled" class="checkbox-label">Disabled option</label>
      </div>
    </div>
  </div>

  <!-- Indeterminate State -->
  <div class="form-section">
    <h3>Indeterminate State</h3>
    <div class="checkbox-group">
      <div class="checkbox-item">
        <input type="checkbox" id="select-all" name="select-all" class="checkbox-input checkbox-indeterminate">
        <label for="select-all" class="checkbox-label">Select all items</label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="item1" name="items" value="item1" class="checkbox-input">
        <label for="item1" class="checkbox-label">Item 1</label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="item2" name="items" value="item2" class="checkbox-input">
        <label for="item2" class="checkbox-label">Item 2</label>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" id="item3" name="items" value="item3" class="checkbox-input">
        <label for="item3" class="checkbox-label">Item 3</label>
      </div>
    </div>
  </div>

  <div class="info-box">
    <h3>Features Demonstrated</h3>
    <p>
      • Multiple checkbox selections<br>
      • Proper labeling and accessibility<br>
      • Different states (checked, unchecked, disabled)<br>
      • Grouped and individual checkbox behaviors<br>
      • Keyboard navigation support<br>
      • Indeterminate state for parent checkboxes
    </p>
  </div>
</div>

<script>
  // Indeterminate state demo
  document.addEventListener('DOMContentLoaded', () => {
    const selectAllCheckbox = document.getElementById('select-all');
    const itemCheckboxes = document.querySelectorAll('input[name="items"]');

    // Set initial indeterminate state
    selectAllCheckbox.indeterminate = true;

    // Handle select all functionality
    selectAllCheckbox.addEventListener('change', () => {
      const isChecked = selectAllCheckbox.checked;
      itemCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
      });
      selectAllCheckbox.indeterminate = false;
    });

    // Handle individual item changes
    itemCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const checkedCount = Array.from(itemCheckboxes).filter(cb => cb.checked).length;

        if (checkedCount === 0) {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === itemCheckboxes.length) {
          selectAllCheckbox.checked = true;
          selectAllCheckbox.indeterminate = false;
        } else {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = true;
        }
      });
    });
  });
</script>
`;
