export const advancedRadioExample = {
	html: `<!-- Advanced radio button form with validation -->
<form id="advancedRadioForm" novalidate>
  <fieldset>
    <legend>Payment Method <span class="required">*</span></legend>
    <div class="radio-group">
      <label class="radio-card">
        <input type="radio" name="payment" value="credit-card" required>
        <div class="radio-content">
          <div class="radio-icon">💳</div>
          <div class="radio-info">
            <span class="radio-title">Credit Card</span>
            <span class="radio-description">Visa, Mastercard, American Express</span>
          </div>
        </div>
        <span class="radio-indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="payment" value="paypal" required>
        <div class="radio-content">
          <div class="radio-icon">🅿️</div>
          <div class="radio-info">
            <span class="radio-title">PayPal</span>
            <span class="radio-description">Pay with your PayPal account</span>
          </div>
        </div>
        <span class="radio-indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="payment" value="bank-transfer" required>
        <div class="radio-content">
          <div class="radio-icon">🏦</div>
          <div class="radio-info">
            <span class="radio-title">Bank Transfer</span>
            <span class="radio-description">Direct bank transfer</span>
          </div>
        </div>
        <span class="radio-indicator"></span>
      </label>
    </div>
    <div class="error-message" id="payment-error"></div>
  </fieldset>

  <fieldset>
    <legend>Delivery Speed <span class="required">*</span></legend>
    <div class="radio-group">
      <label class="radio-item">
        <input type="radio" name="delivery" value="standard" required>
        <span class="radio-indicator"></span>
        <div class="radio-label-content">
          <span class="radio-label">Standard Delivery</span>
          <span class="radio-price">Free - 5-7 business days</span>
        </div>
      </label>

      <label class="radio-item">
        <input type="radio" name="delivery" value="express" required>
        <span class="radio-indicator"></span>
        <div class="radio-label-content">
          <span class="radio-label">Express Delivery</span>
          <span class="radio-price">$9.99 - 2-3 business days</span>
        </div>
      </label>

      <label class="radio-item">
        <input type="radio" name="delivery" value="overnight" required>
        <span class="radio-indicator"></span>
        <div class="radio-label-content">
          <span class="radio-label">Overnight Delivery</span>
          <span class="radio-price">$19.99 - Next business day</span>
        </div>
      </label>
    </div>
    <div class="error-message" id="delivery-error"></div>
  </fieldset>

  <div class="form-actions">
    <button type="submit" class="submit-btn">Continue to Checkout</button>
    <div class="form-summary" id="form-summary"></div>
  </div>
</form>`,
	css: `/* Advanced radio button styles */
* {
  box-sizing: border-box;
}

form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

fieldset {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  background: white;
  transition: border-color 0.3s ease;
}

fieldset:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

legend {
  font-weight: 600;
  font-size: 1.125rem;
  color: #374151;
  padding: 0 0.75rem;
  margin-bottom: 1rem;
}

.required {
  color: #ef4444;
  font-weight: 500;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Card-style radio buttons */
.radio-card {
  display: block;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.radio-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.radio-card input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-card input[type="radio"]:checked + .radio-content + .radio-indicator {
  background: #3b82f6;
  border-color: #3b82f6;
}

.radio-card input[type="radio"]:checked + .radio-content + .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radio-card input[type="radio"]:checked ~ * {
  color: #1f2937;
}

.radio-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.radio-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
}

.radio-info {
  flex: 1;
}

.radio-title {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

.radio-description {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
}

.radio-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  transition: all 0.3s ease;
}

/* Standard radio buttons with pricing */
.radio-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: white;
}

.radio-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.radio-item input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-item input[type="radio"]:checked + .radio-indicator {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio-item input[type="radio"]:checked + .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radio-item input[type="radio"]:checked ~ .radio-label-content {
  color: #1f2937;
}

.radio-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background: white;
}

.radio-label-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.radio-label {
  font-weight: 500;
  font-size: 1rem;
  color: #374151;
}

.radio-price {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Error states */
.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: none;
}

.error-message.show {
  display: block;
}

fieldset.error {
  border-color: #ef4444;
}

/* Form actions */
.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.form-summary {
  margin-top: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  display: none;
}

.form-summary.show {
  display: block;
}

/* Responsive design */
@media (max-width: 640px) {
  form {
    padding: 1rem;
  }

  .radio-card {
    padding: 1rem;
  }

  .radio-content {
    gap: 0.75rem;
  }

  .radio-icon {
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }

  .radio-item {
    padding: 0.75rem;
  }
}`,
	js: `// Advanced radio button functionality with validation
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('advancedRadioForm');
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
  const submitBtn = document.querySelector('.submit-btn');
  const formSummary = document.getElementById('form-summary');

  // Initialize form state
  let formData = {
    payment: null,
    delivery: null
  };

  // Add event listeners to payment radio buttons
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      formData.payment = e.target.value;
      updateCardState(e.target);
      clearError('payment-error');
      updateFormSummary();
      validateForm();
    });
  });

  // Add event listeners to delivery radio buttons
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      formData.delivery = e.target.value;
      updateItemState(e.target);
      clearError('delivery-error');
      updateFormSummary();
      validateForm();
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate form submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      setTimeout(() => {
        alert('Form submitted successfully!');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Continue to Checkout';
        formData = { payment: null, delivery: null };
        updateFormSummary();
        resetForm();
      }, 2000);
    }
  });

  // Update card visual state
  function updateCardState(selectedRadio) {
    const card = selectedRadio.closest('.radio-card');
    const group = selectedRadio.closest('.radio-group');

    // Remove selected class from all cards in group
    group.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));

    // Add selected class to current card
    card.classList.add('selected');
  }

  // Update item visual state
  function updateItemState(selectedRadio) {
    const item = selectedRadio.closest('.radio-item');
    const group = selectedRadio.closest('.radio-group');

    // Remove selected class from all items in group
    group.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));

    // Add selected class to current item
    item.classList.add('selected');
  }

  // Clear error message
  function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.classList.remove('show');
    errorElement.textContent = '';

    // Remove error class from fieldset
    const fieldset = errorElement.closest('fieldset');
    fieldset.classList.remove('error');
  }

  // Show error message
  function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');

    // Add error class to fieldset
    const fieldset = errorElement.closest('fieldset');
    fieldset.classList.add('error');
  }

  // Validate form
  function validateForm() {
    let isValid = true;

    // Validate payment method
    if (!formData.payment) {
      showError('payment-error', 'Please select a payment method.');
      isValid = false;
    }

    // Validate delivery method
    if (!formData.delivery) {
      showError('delivery-error', 'Please select a delivery method.');
      isValid = false;
    }

    return isValid;
  }

  // Update form summary
  function updateFormSummary() {
    if (formData.payment && formData.delivery) {
      const paymentText = getPaymentText(formData.payment);
      const deliveryText = getDeliveryText(formData.delivery);

      formSummary.innerHTML = \`
        <strong>Order Summary:</strong><br>
        Payment: \${paymentText}<br>
        Delivery: \${deliveryText}
      \`;
      formSummary.classList.add('show');
    } else {
      formSummary.classList.remove('show');
    }
  }

  // Get payment method text
  function getPaymentText(value) {
    const methods = {
      'credit-card': 'Credit Card',
      'paypal': 'PayPal',
      'bank-transfer': 'Bank Transfer'
    };
    return methods[value] || value;
  }

  // Get delivery method text
  function getDeliveryText(value) {
    const methods = {
      'standard': 'Standard Delivery (Free)',
      'express': 'Express Delivery ($9.99)',
      'overnight': 'Overnight Delivery ($19.99)'
    };
    return methods[value] || value;
  }

  // Reset form
  function resetForm() {
    form.reset();
    document.querySelectorAll('.radio-card, .radio-item').forEach(el => {
      el.classList.remove('selected');
    });
    document.querySelectorAll('.error-message').forEach(el => {
      el.classList.remove('show');
    });
    document.querySelectorAll('fieldset').forEach(el => {
      el.classList.remove('error');
    });
  }

  // Add keyboard navigation
  function addKeyboardNavigation(radios) {
    radios.forEach((radio, index) => {
      radio.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % radios.length;
          radios[nextIndex].focus();
          radios[nextIndex].checked = true;
          radios[nextIndex].dispatchEvent(new Event('change'));
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = index === 0 ? radios.length - 1 : index - 1;
          radios[prevIndex].focus();
          radios[prevIndex].checked = true;
          radios[prevIndex].dispatchEvent(new Event('change'));
        }
      });
    });
  }

  // Initialize keyboard navigation
  addKeyboardNavigation(paymentRadios);
  addKeyboardNavigation(deliveryRadios);

  // Add click handlers for card-style radio buttons
  document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    });
  });

  // Add click handlers for item-style radio buttons
  document.querySelectorAll('.radio-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const radio = item.querySelector('input[type="radio"]');
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    });
  });
});`,
};
