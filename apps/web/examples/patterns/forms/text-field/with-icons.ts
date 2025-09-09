export const withIconsTextFieldExample = `
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
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .text-field {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .text-field__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="password"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="email"]:focus, input[type="search"]:focus, input[type="url"]:focus, input[type="password"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .text-field--prefix input {
    padding-left: 2.5rem;
  }

  .text-field--suffix input {
    padding-right: 2.5rem;
  }

  .text-field--both input {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .text-field__icon {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
    pointer-events: none;
  }

  .text-field__prefix {
    left: 0.75rem;
  }

  .text-field__suffix {
    right: 0.75rem;
  }

  .text-field__suffix--button {
    right: 0.5rem;
    pointer-events: auto;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s, background-color 0.2s;
  }

  .text-field__suffix--button:hover {
    color: #374151;
    background: #f3f4f6;
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
</style>

<div class="container">
  <!-- Search with prefix icon -->
  <div class="text-field text-field--prefix">
    <label for="search">Search</label>
    <div class="text-field__wrapper">
      <svg class="text-field__icon text-field__prefix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input 
        type="search" 
        id="search" 
        name="search"
        placeholder="Search products..."
      />
    </div>
  </div>

  <!-- Email with suffix icon -->
  <div class="text-field text-field--suffix">
    <label for="email">Email Address</label>
    <div class="text-field__wrapper">
      <input 
        type="email" 
        id="email" 
        name="email"
        placeholder="Enter your email"
      />
      <svg class="text-field__icon text-field__suffix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
      </svg>
    </div>
  </div>

  <!-- URL with both prefix and suffix -->
  <div class="text-field text-field--both">
    <label for="website">Website URL</label>
    <div class="text-field__wrapper">
      <svg class="text-field__icon text-field__prefix" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
      </svg>
      <input 
        type="url" 
        id="website" 
        name="website"
        placeholder="https://example.com"
      />
      <button type="button" class="text-field__suffix--button" aria-label="Visit website">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </button>
    </div>
  </div>

  <!-- Password with toggle visibility button -->
  <div class="text-field text-field--suffix">
    <label for="password">Password</label>
    <div class="text-field__wrapper">
      <input 
        type="password" 
        id="password" 
        name="password"
        placeholder="Enter your password"
      />
      <button type="button" class="text-field__suffix--button" id="toggle-password" aria-label="Show password">
        <svg id="eye-closed" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828l4.242 4.242M12 7c.796 0 1.559.156 2.268.428m2.679 2.1A10.05 10.05 0 0121 12c-.77 2.722-2.347 5.149-4.5 6.825m-1.236.275A10.05 10.05 0 0112 19"></path>
        </svg>
        <svg id="eye-open" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<script>
  // Password toggle functionality
  const toggleButton = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const eyeClosed = document.getElementById('eye-closed');
  const eyeOpen = document.getElementById('eye-open');

  toggleButton.addEventListener('click', function() {
    const isPassword = passwordInput.type === 'password';
    
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleButton.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    
    eyeClosed.style.display = isPassword ? 'none' : 'block';
    eyeOpen.style.display = isPassword ? 'block' : 'none';
  });

  // Visit website functionality
  const websiteInput = document.querySelector('input[name="website"]');
  const visitButton = document.querySelector('.text-field__suffix--button[aria-label="Visit website"]');

  if (visitButton && websiteInput) {
    visitButton.addEventListener('click', function() {
      const url = websiteInput.value.trim();
      if (url) {
        // Add protocol if missing
        const fullUrl = url.startsWith('http') ? url : 'https://' + url;
        window.open(fullUrl, '_blank');
      }
    });
  }
</script>
`;
