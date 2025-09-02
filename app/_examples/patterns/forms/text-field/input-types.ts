export const inputTypesTextFieldExample = `
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .text-field {
    width: 100%;
  }

  .text-field--full {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input:invalid {
    border-color: #ef4444;
  }

  input:invalid:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .text-field__helper {
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  @media (max-width: 640px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="container">
  <!-- Email -->
  <div class="text-field">
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      placeholder="user@example.com"
      required
    />
    <div class="text-field__helper">Shows email keyboard on mobile</div>
  </div>

  <!-- Phone -->
  <div class="text-field">
    <label for="phone">Phone</label>
    <input 
      type="tel" 
      id="phone" 
      name="phone"
      placeholder="+1 (555) 123-4567"
    />
    <div class="text-field__helper">Shows numeric keypad on mobile</div>
  </div>

  <!-- URL -->
  <div class="text-field">
    <label for="website">Website</label>
    <input 
      type="url" 
      id="website" 
      name="website"
      placeholder="https://example.com"
    />
    <div class="text-field__helper">Validates URL format</div>
  </div>

  <!-- Number -->
  <div class="text-field">
    <label for="age">Age</label>
    <input 
      type="number" 
      id="age" 
      name="age"
      min="18"
      max="120"
      placeholder="25"
    />
    <div class="text-field__helper">Number input with min/max</div>
  </div>

  <!-- Date -->
  <div class="text-field">
    <label for="birthdate">Birth Date</label>
    <input 
      type="date" 
      id="birthdate" 
      name="birthdate"
      max="2006-01-01"
    />
    <div class="text-field__helper">Native date picker</div>
  </div>

  <!-- Time -->
  <div class="text-field">
    <label for="appointment">Time</label>
    <input 
      type="time" 
      id="appointment" 
      name="appointment"
      min="09:00"
      max="18:00"
    />
    <div class="text-field__helper">Business hours only</div>
  </div>

  <!-- Color -->
  <div class="text-field">
    <label for="color">Favorite Color</label>
    <input 
      type="color" 
      id="color" 
      name="color"
      value="#3b82f6"
    />
    <div class="text-field__helper">Native color picker</div>
  </div>

  <!-- Range -->
  <div class="text-field">
    <label for="volume">Volume</label>
    <input 
      type="range" 
      id="volume" 
      name="volume"
      min="0"
      max="100"
      value="50"
    />
    <div class="text-field__helper">Slider input: <span id="volume-value">50</span>%</div>
  </div>

  <!-- Search -->
  <div class="text-field text-field--full">
    <label for="search">Search</label>
    <input 
      type="search" 
      id="search" 
      name="search"
      placeholder="Search products, articles, or help..."
    />
    <div class="text-field__helper">Search input with clear button (browser dependent)</div>
  </div>

  <!-- Password -->
  <div class="text-field text-field--full">
    <label for="password">Password</label>
    <input 
      type="password" 
      id="password" 
      name="password"
      placeholder="Enter secure password"
      minlength="8"
      required
    />
    <div class="text-field__helper">Masked input with minimum length validation</div>
  </div>
</div>

<script>
  // Update range value display
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volume-value');

  volumeSlider.addEventListener('input', function() {
    volumeValue.textContent = this.value;
  });

  // Form validation feedback
  const form = document.querySelector('form') || document.body;
  const inputs = document.querySelectorAll('input[required]');

  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.validity.valid) {
        this.style.borderColor = '#10b981';
      } else if (this.value.length > 0) {
        this.style.borderColor = '#ef4444';
      }
    });

    input.addEventListener('input', function() {
      if (this.validity.valid && this.value.length > 0) {
        this.style.borderColor = '#10b981';
      } else {
        this.style.borderColor = '#d1d5db';
      }
    });
  });
</script>
`;
