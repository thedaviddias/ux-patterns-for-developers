export const validationTextFieldExample = `
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

  input[type="text"], input[type="email"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="email"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Error state */
  .text-field--error input {
    border-color: #ef4444;
  }

  .text-field--error input:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* Success state */
  .text-field--success input {
    border-color: #10b981;
  }

  .text-field--success input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .text-field__message {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .text-field__error {
    color: #dc2626;
  }

  .text-field__success {
    color: #059669;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }
</style>

<div class="container">
  <!-- Error State -->
  <div class="text-field text-field--error">
    <label for="password">Password</label>
    <input 
      type="text" 
      id="password" 
      name="password"
      value="123"
      aria-invalid="true"
      aria-describedby="password-error"
    />
    <output class="text-field__message text-field__error" id="password-error">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      Password must be at least 8 characters
    </output>
  </div>

  <!-- Success State -->
  <div class="text-field text-field--success">
    <label for="username">Username</label>
    <input 
      type="text" 
      id="username" 
      name="username"
      value="john_doe_2024"
      aria-describedby="username-success"
    />
    <output class="text-field__message text-field__success" id="username-success">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Username is available
    </output>
  </div>

  <!-- Normal State -->
  <div class="text-field">
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      placeholder="Enter your email"
    />
  </div>
</div>
`;
