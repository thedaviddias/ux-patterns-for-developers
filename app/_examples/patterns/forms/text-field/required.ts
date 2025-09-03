export const requiredTextFieldExample = `
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
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .form-section h3 {
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .text-field {
    width: 100%;
    margin-bottom: 1rem;
  }

  .text-field:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"], input[type="email"], input[type="password"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input[type="text"]:invalid, input[type="email"]:invalid, input[type="password"]:invalid {
    border-color: #ef4444;
  }

  .required {
    color: #dc2626;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .form-note {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.375rem;
    border-left: 4px solid #3b82f6;
  }

  .required-icon {
    color: #dc2626;
    font-weight: bold;
  }

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: white;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 1;
  }

  .form-legend {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>

<div class="container">
  <!-- Best Practice: Explicit Required Label -->
  <div class="form-section">
    <h3>✅ Best Practice: Explicit "Required"</h3>
    <div class="form-note">Most accessible - clear for all users</div>
    
    <div class="text-field">
      <label for="username1">Username <span class="required">(Required)</span></label>
      <input 
        type="text" 
        id="username1" 
        name="username1"
        required
        placeholder="Enter your username"
      />
    </div>
    
    <div class="text-field">
      <label for="email1">Email Address <span class="required">(Required)</span></label>
      <input 
        type="email" 
        id="email1" 
        name="email1"
        required
        placeholder="Enter your email"
      />
    </div>
  </div>

  <!-- Asterisk with ARIA Explanation -->
  <div class="form-section">
    <h3>✅ Asterisk with ARIA Support</h3>
    <div class="form-note">Common practice with proper accessibility</div>
    <p id="required-legend" class="form-legend">Fields marked with an asterisk (*) are required.</p>
    
    <div class="text-field">
      <label for="username2">Username <span class="required-icon" aria-hidden="true">*</span></label>
      <input 
        type="text" 
        id="username2" 
        name="username2"
        required
        aria-describedby="required-legend"
        placeholder="Enter your username"
      />
    </div>
    
    <div class="text-field">
      <label for="password2">Password <span class="required-icon" aria-hidden="true">*</span></label>
      <input 
        type="password" 
        id="password2" 
        name="password2"
        required
        aria-describedby="required-legend"
        placeholder="Enter your password"
      />
    </div>
  </div>

  <!-- Visually Hidden Text -->
  <div class="form-section">
    <h3>⚠️ Visually Hidden (Screen Reader Only)</h3>
    <div class="form-note">Clean UI but no visual indicator for sighted users</div>
    
    <div class="text-field">
      <label for="email3">Email <span class="sr-only">(Required)</span></label>
      <input 
        type="email" 
        id="email3" 
        name="email3"
        required
        placeholder="Enter your email"
      />
    </div>
    
    <div class="text-field">
      <label for="username3">Username <span class="sr-only">(Required)</span></label>
      <input 
        type="text" 
        id="username3" 
        name="username3"
        required
        placeholder="Enter your username"
      />
    </div>
  </div>

  <!-- Tooltip Approach -->
  <div class="form-section">
    <h3>💡 Interactive Tooltip</h3>
    <div class="form-note">Provides guidance on hover/focus</div>
    
    <div class="text-field">
      <label for="username4">
        Username 
        <span class="tooltip required-icon" data-tooltip="This field is required" tabindex="0">*</span>
      </label>
      <input 
        type="text" 
        id="username4" 
        name="username4"
        required
        aria-describedby="username4-help"
        placeholder="Enter your username"
      />
      <span id="username4-help" class="sr-only">Username is required</span>
    </div>
  </div>

  <!-- Anti-Pattern: Required Attribute Only -->
  <div class="form-section">
    <h3>❌ Anti-Pattern: HTML5 Only</h3>
    <div class="form-note">No visible indicator until form submission</div>
    
    <div class="text-field">
      <label for="email4">Email</label>
      <input 
        type="email" 
        id="email4" 
        name="email4"
        required
        placeholder="Enter your email"
      />
    </div>
    
    <div class="text-field">
      <label for="password4">Password</label>
      <input 
        type="password" 
        id="password4" 
        name="password4"
        required
        placeholder="Enter your password"
      />
    </div>
    
    <button type="submit" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
      Submit (Try without filling fields)
    </button>
  </div>
</div>

<script>
  // Add form validation feedback
  document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      input.addEventListener('invalid', function() {
        this.style.borderColor = '#ef4444';
      });
      
      input.addEventListener('input', function() {
        if (this.validity.valid) {
          this.style.borderColor = '#10b981';
        } else {
          this.style.borderColor = '#d1d5db';
        }
      });
    });

    // Prevent actual form submission for demo
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Form submission prevented for demo purposes. Check the required field validation!');
      });
    }
  });
</script>
`;
