export const basicRadioExample = {
	html: `<!-- Basic radio button group -->
<fieldset>
  <legend>Choose your preferred contact method</legend>
  <div class="radio-group">
    <label class="radio-item">
      <input type="radio" name="contact" value="email" checked>
      <span class="radio-indicator"></span>
      <span class="radio-label">Email</span>
    </label>

    <label class="radio-item">
      <input type="radio" name="contact" value="phone">
      <span class="radio-indicator"></span>
      <span class="radio-label">Phone</span>
    </label>

    <label class="radio-item">
      <input type="radio" name="contact" value="sms">
      <span class="radio-indicator"></span>
      <span class="radio-label">SMS</span>
    </label>
  </div>
</fieldset>

<!-- Additional radio group example -->
<fieldset>
  <legend>Select your preferred size</legend>
  <div class="radio-group">
    <label class="radio-item">
      <input type="radio" name="size" value="small">
      <span class="radio-indicator"></span>
      <span class="radio-label">Small</span>
    </label>

    <label class="radio-item">
      <input type="radio" name="size" value="medium" checked>
      <span class="radio-indicator"></span>
      <span class="radio-label">Medium</span>
    </label>

    <label class="radio-item">
      <input type="radio" name="size" value="large">
      <span class="radio-indicator"></span>
      <span class="radio-label">Large</span>
    </label>

    <label class="radio-item">
      <input type="radio" name="size" value="xlarge">
      <span class="radio-indicator"></span>
      <span class="radio-label">Extra Large</span>
    </label>
  </div>
</fieldset>`,
	css: `/* Reset and base styles */
* {
  box-sizing: border-box;
}

fieldset {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: white;
}

legend {
  font-weight: 600;
  font-size: 1rem;
  color: #374151;
  padding: 0 0.5rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.radio-item:hover {
  background-color: #f9fafb;
}

.radio-item input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
  background: white;
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

.radio-item input[type="radio"]:focus + .radio-indicator {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.radio-item input[type="radio"]:disabled + .radio-indicator {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio-item input[type="radio"]:disabled ~ .radio-label {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio-label {
  font-size: 1rem;
  color: #374151;
  user-select: none;
}

/* Responsive design */
@media (max-width: 640px) {
  .radio-group {
    gap: 1rem;
  }

  .radio-item {
    padding: 0.75rem;
  }

  .radio-indicator {
    width: 24px;
    height: 24px;
  }

  .radio-item input[type="radio"]:checked + .radio-indicator::after {
    width: 10px;
    height: 10px;
  }
}`,
	js: `// Basic radio button functionality
document.addEventListener('DOMContentLoaded', () => {
  const radioGroups = document.querySelectorAll('fieldset');

  radioGroups.forEach(group => {
    const radioButtons = group.querySelectorAll('input[type="radio"]');

    // Add change event listeners
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        const groupName = e.target.name;

        // Log selection for demo purposes
        console.log(\`Selected \${groupName}: \${selectedValue}\`);

        // Dispatch custom event for tracking
        const customEvent = new CustomEvent('radioChange', {
          detail: {
            group: groupName,
            value: selectedValue,
            element: e.target
          }
        });
        document.dispatchEvent(customEvent);
      });
    });

    // Add keyboard navigation
    radioButtons.forEach((radio, index) => {
      radio.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % radioButtons.length;
          radioButtons[nextIndex].focus();
          radioButtons[nextIndex].checked = true;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = index === 0 ? radioButtons.length - 1 : index - 1;
          radioButtons[prevIndex].focus();
          radioButtons[prevIndex].checked = true;
        }
      });
    });
  });

  // Listen for custom radio change events
  document.addEventListener('radioChange', (e) => {
    console.log('Radio button changed:', e.detail);
  });
});`,
};
