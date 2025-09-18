export const advancedCheckboxExample = `
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
    max-width: 800px;
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

  /* Custom Checkbox Styles */
  .custom-checkbox {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
  }

  .custom-checkbox input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: relative;
    height: 20px;
    width: 20px;
    background-color: #fff;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .custom-checkbox:hover .checkmark {
    border-color: #3b82f6;
    background-color: #f8fafc;
  }

  .custom-checkbox input:checked ~ .checkmark {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .custom-checkbox input:focus ~ .checkmark {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .custom-checkbox input:checked ~ .checkmark:after {
    display: block;
  }

  /* Indeterminate state */
  .custom-checkbox input:indeterminate ~ .checkmark {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .custom-checkbox input:indeterminate ~ .checkmark:after {
    display: block;
    left: 4px;
    top: 8px;
    width: 8px;
    height: 2px;
    border: solid white;
    border-width: 0 0 2px 0;
    transform: none;
  }

  .checkbox-label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    line-height: 1.5;
    user-select: none;
  }

  .checkbox-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
    line-height: 1.4;
  }

  /* Disabled state */
  .custom-checkbox.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .custom-checkbox.disabled .checkbox-label {
    cursor: not-allowed;
  }

  /* Animated checkbox */
  .animated-checkbox .checkmark {
    transform: scale(1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animated-checkbox input:checked ~ .checkmark {
    transform: scale(1.1);
    animation: checkmark-bounce 0.3s ease;
  }

  @keyframes checkmark-bounce {
    0% { transform: scale(1.1); }
    50% { transform: scale(0.9); }
    100% { transform: scale(1.1); }
  }

  /* Card-style checkboxes */
  .checkbox-card {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
    position: relative;
    display: block;
  }

  .checkbox-card:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
  }

  .checkbox-card.selected {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  .checkbox-card input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .card-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .card-icon {
    width: 24px;
    height: 24px;
    background: #f3f4f6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .card-text {
    flex: 1;
  }

  .card-title {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .card-description {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.4;
  }

  /* Form validation */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group.error .checkmark {
    border-color: #ef4444;
  }

  .form-group.error .checkbox-label {
    color: #ef4444;
  }

  .error-message {
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 0.25rem;
  }

  .form-group.success .checkmark {
    border-color: #10b981;
  }

  .success-message {
    font-size: 0.75rem;
    color: #10b981;
    margin-top: 0.25rem;
  }

  /* Dynamic checkbox groups */
  .dynamic-group {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .group-title {
    font-weight: 500;
    color: #374151;
  }

  .add-button {
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-button:hover {
    background: #2563eb;
  }

  .remove-button {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
    cursor: pointer;
    margin-left: auto;
    transition: background-color 0.2s;
  }

  .remove-button:hover {
    background: #dc2626;
  }

  /* Progress indicator */
  .progress-bar {
    width: 100%;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .progress-text {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    margin-bottom: 1rem;
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

    .checkbox-card {
      padding: 0.75rem;
    }
  }
</style>

<div class="container">
  <h2>Advanced Checkbox Examples</h2>

  <!-- Custom Styled Checkboxes -->
  <div class="form-section">
    <h3>Custom Styled Checkboxes</h3>
    <div class="form-group">
      <label class="custom-checkbox">
        <input type="checkbox" name="custom1" value="option1">
        <span class="checkmark"></span>
        <span class="checkbox-label">
          Custom styled checkbox
          <div class="checkbox-description">This checkbox uses custom CSS styling</div>
        </span>
      </label>
    </div>

    <div class="form-group">
      <label class="custom-checkbox animated-checkbox">
        <input type="checkbox" name="custom2" value="option2">
        <span class="checkmark"></span>
        <span class="checkbox-label">
          Animated checkbox
          <div class="checkbox-description">Includes bounce animation on selection</div>
        </span>
      </label>
    </div>

    <div class="form-group disabled">
      <label class="custom-checkbox disabled">
        <input type="checkbox" name="custom3" value="option3" disabled>
        <span class="checkmark"></span>
        <span class="checkbox-label">
          Disabled custom checkbox
          <div class="checkbox-description">This option is currently disabled</div>
        </span>
      </label>
    </div>
  </div>

  <!-- Card-style Checkboxes -->
  <div class="form-section">
    <h3>Card-style Checkboxes</h3>
    <div class="checkbox-group">
      <label class="checkbox-card" data-option="basic">
        <input type="checkbox" name="plan" value="basic">
        <div class="card-content">
          <div class="card-icon">📦</div>
          <div class="card-text">
            <div class="card-title">Basic Plan</div>
            <div class="card-description">Perfect for individuals and small projects</div>
          </div>
        </div>
      </label>

      <label class="checkbox-card" data-option="pro">
        <input type="checkbox" name="plan" value="pro">
        <div class="card-content">
          <div class="card-icon">🚀</div>
          <div class="card-text">
            <div class="card-title">Pro Plan</div>
            <div class="card-description">Advanced features for growing businesses</div>
          </div>
        </div>
      </label>

      <label class="checkbox-card" data-option="enterprise">
        <input type="checkbox" name="plan" value="enterprise">
        <div class="card-content">
          <div class="card-icon">🏢</div>
          <div class="card-text">
            <div class="card-title">Enterprise Plan</div>
            <div class="card-description">Full-featured solution for large organizations</div>
          </div>
        </div>
      </label>
    </div>
  </div>

  <!-- Form Validation -->
  <div class="form-section">
    <h3>Form Validation</h3>
    <div class="form-group" id="required-group">
      <label class="custom-checkbox">
        <input type="checkbox" name="required" value="agree" required>
        <span class="checkmark"></span>
        <span class="checkbox-label">
          I agree to the terms and conditions
          <div class="checkbox-description">This field is required</div>
        </span>
      </label>
      <div class="error-message" id="required-error" style="display: none;">
        You must agree to the terms and conditions
      </div>
    </div>

    <div class="form-group" id="success-group">
      <label class="custom-checkbox">
        <input type="checkbox" name="newsletter" value="subscribe">
        <span class="checkmark"></span>
        <span class="checkbox-label">
          Subscribe to newsletter
          <div class="checkbox-description">Get updates about new features</div>
        </span>
      </label>
      <div class="success-message" id="newsletter-success" style="display: none;">
        Thank you for subscribing!
      </div>
    </div>
  </div>

  <!-- Dynamic Checkbox Groups -->
  <div class="form-section">
    <h3>Dynamic Checkbox Groups</h3>
    <div class="dynamic-group" id="dynamic-group">
      <div class="group-header">
        <span class="group-title">Select Features</span>
        <button class="add-button" onclick="addFeature()">+ Add Feature</button>
      </div>
      <div id="features-list">
        <div class="checkbox-item">
          <label class="custom-checkbox">
            <input type="checkbox" name="features" value="analytics">
            <span class="checkmark"></span>
            <span class="checkbox-label">Analytics Dashboard</span>
          </label>
        </div>
        <div class="checkbox-item">
          <label class="custom-checkbox">
            <input type="checkbox" name="features" value="api">
            <span class="checkmark"></span>
            <span class="checkbox-label">API Access</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Progress Indicator -->
  <div class="form-section">
    <h3>Progress Indicator</h3>
    <div class="progress-bar">
      <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
    </div>
    <div class="progress-text" id="progress-text">Select at least 3 options to continue</div>

    <div class="checkbox-group">
      <div class="checkbox-item">
        <label class="custom-checkbox">
          <input type="checkbox" name="progress" value="option1" onchange="updateProgress()">
          <span class="checkmark"></span>
          <span class="checkbox-label">Option 1</span>
        </label>
      </div>
      <div class="checkbox-item">
        <label class="custom-checkbox">
          <input type="checkbox" name="progress" value="option2" onchange="updateProgress()">
          <span class="checkmark"></span>
          <span class="checkbox-label">Option 2</span>
        </label>
      </div>
      <div class="checkbox-item">
        <label class="custom-checkbox">
          <input type="checkbox" name="progress" value="option3" onchange="updateProgress()">
          <span class="checkmark"></span>
          <span class="checkbox-label">Option 3</span>
        </label>
      </div>
      <div class="checkbox-item">
        <label class="custom-checkbox">
          <input type="checkbox" name="progress" value="option4" onchange="updateProgress()">
          <span class="checkmark"></span>
          <span class="checkbox-label">Option 4</span>
        </label>
      </div>
      <div class="checkbox-item">
        <label class="custom-checkbox">
          <input type="checkbox" name="progress" value="option5" onchange="updateProgress()">
          <span class="checkmark"></span>
          <span class="checkbox-label">Option 5</span>
        </label>
      </div>
    </div>
  </div>

  <div class="info-box">
    <h3>Advanced Features Demonstrated</h3>
    <p>
      • Custom styled checkboxes with animations<br>
      • Card-style checkbox selection<br>
      • Form validation with error/success states<br>
      • Dynamic checkbox group management<br>
      • Progress indicators for multi-step forms<br>
      • Indeterminate state handling<br>
      • Responsive design considerations
    </p>
  </div>
</div>

<script>
  // Card-style checkbox selection
  document.addEventListener('DOMContentLoaded', () => {
    const cardCheckboxes = document.querySelectorAll('.checkbox-card');

    cardCheckboxes.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');

      // Initialize card state
      updateCardState(card, checkbox.checked);

      card.addEventListener('click', (e) => {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        updateCardState(card, checkbox.checked);

        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(changeEvent);
      });

      checkbox.addEventListener('change', () => {
        updateCardState(card, checkbox.checked);
      });
    });
  });

  function updateCardState(card, isChecked) {
    if (isChecked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  }

  // Form validation
  function validateForm() {
    const requiredCheckbox = document.querySelector('input[name="required"]');
    const requiredGroup = document.getElementById('required-group');
    const requiredError = document.getElementById('required-error');

    if (!requiredCheckbox.checked) {
      requiredGroup.classList.add('error');
      requiredError.style.display = 'block';
      return false;
    } else {
      requiredGroup.classList.remove('error');
      requiredError.style.display = 'none';
    }

    return true;
  }

  // Newsletter subscription success
  document.querySelector('input[name="newsletter"]').addEventListener('change', function() {
    const successGroup = document.getElementById('success-group');
    const successMessage = document.getElementById('newsletter-success');

    if (this.checked) {
      successGroup.classList.add('success');
      successMessage.style.display = 'block';
    } else {
      successGroup.classList.remove('success');
      successMessage.style.display = 'none';
    }
  });

  // Dynamic feature management
  let featureCounter = 3;

  window.addFeature = function() {
    const featuresList = document.getElementById('features-list');
    const newFeature = document.createElement('div');
    newFeature.className = 'checkbox-item';
    newFeature.innerHTML = \`
      <label class="custom-checkbox">
        <input type="checkbox" name="features" value="feature\${featureCounter}">
        <span class="checkmark"></span>
        <span class="checkbox-label">Custom Feature \${featureCounter}</span>
      </label>
      <button class="remove-button" onclick="removeFeature(this)">×</button>
    \`;
    featuresList.appendChild(newFeature);
    featureCounter++;
  };

  window.removeFeature = function(button) {
    button.parentElement.remove();
  };

  // Progress indicator
  window.updateProgress = function() {
    const checkboxes = document.querySelectorAll('input[name="progress"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const percentage = (checkedCount / totalCount) * 100;

    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    progressFill.style.width = percentage + '%';

    if (checkedCount >= 3) {
      progressText.textContent = \`Great! You've selected \${checkedCount} options\`;
      progressText.style.color = '#10b981';
    } else {
      progressText.textContent = \`Select at least 3 options to continue (\${checkedCount}/\${totalCount})\`;
      progressText.style.color = '#6b7280';
    }
  };

  // Form submission
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form submitted successfully!');
    }
  });
</script>
`;
