export const characterCounterTextFieldExample = `
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

  input[type="text"], textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-family: inherit;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: vertical;
  }

  textarea {
    min-height: 100px;
  }

  input[type="text"]:focus, textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .text-field__counter {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    text-align: right;
    color: #6b7280;
    transition: color 0.2s;
  }

  .text-field__counter--warning {
    color: #d97706;
  }

  .text-field__counter--danger {
    color: #dc2626;
  }

  .text-field--warning input, .text-field--warning textarea {
    border-color: #f59e0b;
  }

  .text-field--danger input, .text-field--danger textarea {
    border-color: #ef4444;
  }
</style>

<div class="container">
  <!-- Short text field with counter -->
  <div class="text-field">
    <label for="title">Article Title</label>
    <input 
      type="text" 
      id="title" 
      name="title"
      placeholder="Enter article title"
      maxlength="60"
      aria-describedby="title-counter"
    />
    <div class="text-field__counter" id="title-counter">0/60</div>
  </div>

  <!-- Textarea with counter -->
  <div class="text-field">
    <label for="bio">Bio</label>
    <textarea 
      id="bio" 
      name="bio"
      placeholder="Tell us about yourself..."
      maxlength="160"
      aria-describedby="bio-counter"
    ></textarea>
    <div class="text-field__counter" id="bio-counter">0/160</div>
  </div>

  <!-- Pre-filled example showing warning state -->
  <div class="text-field text-field--warning">
    <label for="tweet">Tweet</label>
    <textarea 
      id="tweet" 
      name="tweet"
      placeholder="What's happening?"
      maxlength="280"
      aria-describedby="tweet-counter"
    >This is a longer tweet that demonstrates the warning state when approaching the character limit. The counter should change color as we get close to the maximum allowed characters for this field.</textarea>
    <div class="text-field__counter text-field__counter--warning" id="tweet-counter">225/280</div>
  </div>
</div>

<script>
  // Character counter functionality
  function updateCounter(input, counter) {
    const current = input.value.length;
    const max = parseInt(input.getAttribute('maxlength'));
    const remaining = max - current;
    
    counter.textContent = current + '/' + max;
    
    const field = input.closest('.text-field');
    field.classList.remove('text-field--warning', 'text-field--danger');
    counter.classList.remove('text-field__counter--warning', 'text-field__counter--danger');
    
    if (remaining <= max * 0.05) { // 95% full
      field.classList.add('text-field--danger');
      counter.classList.add('text-field__counter--danger');
    } else if (remaining <= max * 0.2) { // 80% full
      field.classList.add('text-field--warning');
      counter.classList.add('text-field__counter--warning');
    }
  }

  // Initialize all character counters
  document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
    const counterId = input.getAttribute('aria-describedby');
    const counter = document.getElementById(counterId);
    
    if (counter) {
      // Initial count
      updateCounter(input, counter);
      
      // Update on input
      input.addEventListener('input', () => updateCounter(input, counter));
    }
  });
</script>
`;
