export const helperTextFieldExample = `
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

  input[type="text"], input[type="tel"], input[type="password"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="tel"]:focus, input[type="password"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .text-field__helper {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .text-field__helper--above {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 500;
  }

  .required {
    color: #dc2626;
  }
</style>

<div class="container">
  <!-- Helper text below -->
  <div class="text-field">
    <label for="email">Email Address</label>
    <input 
      type="text" 
      id="email" 
      name="email"
      placeholder="Enter your email"
      aria-describedby="email-help"
    />
    <p class="text-field__helper" id="email-help">
      We'll never share your email with anyone else.
    </p>
  </div>

  <!-- Helper text above for formatting requirements -->
  <div class="text-field">
    <label for="phone">Phone Number</label>
    <p class="text-field__helper text-field__helper--above" id="phone-format">
      Format: +1 (555) 123-4567
    </p>
    <input 
      type="tel" 
      id="phone" 
      name="phone"
      placeholder="+1 (555) 123-4567"
      aria-describedby="phone-format"
    />
  </div>

  <!-- Password with requirements above -->
  <div class="text-field">
    <label for="password">
      Password <span class="required">(Required)</span>
    </label>
    <p class="text-field__helper text-field__helper--above" id="password-requirements">
      Must be at least 8 characters with one number and special character.
    </p>
    <input 
      type="password" 
      id="password" 
      name="password"
      required
      aria-describedby="password-requirements"
    />
  </div>

  <!-- Multiple lines of helper text -->
  <div class="text-field">
    <label for="username">Username</label>
    <input 
      type="text" 
      id="username" 
      name="username"
      placeholder="Choose a username"
      aria-describedby="username-help"
    />
    <p class="text-field__helper" id="username-help">
      Your username will be visible to other users. It can contain letters, numbers, and underscores only. Must be between 3-20 characters.
    </p>
  </div>
</div>
`;
