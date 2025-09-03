export const basicAutocompleteExample = `
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

  .autocomplete {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .input-wrapper {
    position: relative;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background: white;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .clear-button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.25rem;
    border: none;
    background: none;
    color: #6b7280;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s;
  }

  .clear-button.visible {
    opacity: 1;
    visibility: visible;
  }

  .clear-button:hover {
    color: #374151;
  }

  .suggestions-list {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: none;
  }

  .suggestions-list.open {
    display: block;
  }

  .suggestion-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.15s;
    border-bottom: 1px solid #f3f4f6;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover,
  .suggestion-item.highlighted {
    background-color: #f3f4f6;
  }

  .suggestion-item mark {
    background-color: #fef3c7;
    color: inherit;
    font-weight: 600;
  }

  .no-results {
    padding: 1rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .loading {
    padding: 1rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
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
    border-width: 0;
  }
</style>

<div class="autocomplete">
  <label for="country-input">Select Country</label>
  <div class="input-wrapper">
    <input 
      type="text"
      id="country-input"
      name="country"
      placeholder="Start typing a country name..."
      aria-autocomplete="list"
      aria-controls="suggestions"
      aria-expanded="false"
      autocomplete="off"
    />
    <button 
      type="button"
      class="clear-button"
      aria-label="Clear input"
    >
      ✕
    </button>
  </div>
  <div 
    id="suggestions"
    class="suggestions-list"
    role="listbox"
    aria-label="Country suggestions"
  >
    <!-- Suggestions will be populated here -->
  </div>
  <div class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
</div>

<script>
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia',
    'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria',
    'Canada', 'Chile', 'China', 'Colombia', 'Croatia',
    'Czech Republic', 'Denmark', 'Egypt', 'Finland', 'France',
    'Germany', 'Greece', 'Hungary', 'India', 'Indonesia',
    'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya',
    'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria',
    'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore',
    'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
    'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States'
  ];

  const input = document.getElementById('country-input');
  const suggestionsList = document.getElementById('suggestions');
  const clearButton = document.querySelector('.clear-button');
  const statusElement = document.querySelector('[role="status"]');
  
  let currentHighlightedIndex = -1;
  let filteredCountries = [];

  // Input event handler
  input.addEventListener('input', function(e) {
    const value = e.target.value.trim();
    
    // Toggle clear button visibility
    clearButton.classList.toggle('visible', value.length > 0);
    
    if (value.length === 0) {
      closeSuggestions();
      return;
    }
    
    // Filter countries
    filteredCountries = countries.filter(country =>
      country.toLowerCase().includes(value.toLowerCase())
    );
    
    displaySuggestions(filteredCountries, value);
  });

  // Clear button handler
  clearButton.addEventListener('click', function() {
    input.value = '';
    clearButton.classList.remove('visible');
    closeSuggestions();
    input.focus();
  });

  // Keyboard navigation
  input.addEventListener('keydown', function(e) {
    const isOpen = suggestionsList.classList.contains('open');
    
    if (!isOpen && e.key !== 'ArrowDown') return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen && filteredCountries.length > 0) {
          displaySuggestions(filteredCountries, input.value);
        }
        highlightNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        highlightPrevious();
        break;
      case 'Enter':
        e.preventDefault();
        if (currentHighlightedIndex >= 0) {
          selectCountry(filteredCountries[currentHighlightedIndex]);
        }
        break;
      case 'Escape':
        closeSuggestions();
        break;
    }
  });

  // Display suggestions
  function displaySuggestions(countries, searchTerm) {
    if (countries.length === 0) {
      suggestionsList.innerHTML = '<div class="no-results">No countries found</div>';
      suggestionsList.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
      statusElement.textContent = 'No suggestions available';
      return;
    }
    
    suggestionsList.innerHTML = countries
      .map((country, index) => {
        const highlighted = searchTerm
          ? country.replace(
              new RegExp('(' + searchTerm + ')', 'gi'),
              '<mark>$1</mark>'
            )
          : country;
        
        return \`
          <div
            class="suggestion-item"
            role="option"
            id="suggestion-\${index}"
            aria-selected="false"
            data-value="\${country}"
          >
            \${highlighted}
          </div>
        \`;
      })
      .join('');
    
    suggestionsList.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
    statusElement.textContent = \`\${countries.length} suggestions available\`;
    currentHighlightedIndex = -1;
    
    // Add click handlers to suggestions
    document.querySelectorAll('.suggestion-item').forEach((item, index) => {
      item.addEventListener('click', function() {
        selectCountry(this.dataset.value);
      });
    });
  }

  // Close suggestions
  function closeSuggestions() {
    suggestionsList.classList.remove('open');
    input.setAttribute('aria-expanded', 'false');
    currentHighlightedIndex = -1;
    removeHighlights();
  }

  // Highlight next suggestion
  function highlightNext() {
    const items = document.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;
    
    removeHighlights();
    currentHighlightedIndex = Math.min(currentHighlightedIndex + 1, items.length - 1);
    highlightItem(currentHighlightedIndex);
  }

  // Highlight previous suggestion
  function highlightPrevious() {
    const items = document.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;
    
    removeHighlights();
    currentHighlightedIndex = Math.max(currentHighlightedIndex - 1, -1);
    
    if (currentHighlightedIndex >= 0) {
      highlightItem(currentHighlightedIndex);
    }
  }

  // Highlight specific item
  function highlightItem(index) {
    const items = document.querySelectorAll('.suggestion-item');
    if (items[index]) {
      items[index].classList.add('highlighted');
      items[index].setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', \`suggestion-\${index}\`);
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  // Remove all highlights
  function removeHighlights() {
    document.querySelectorAll('.suggestion-item').forEach(item => {
      item.classList.remove('highlighted');
      item.setAttribute('aria-selected', 'false');
    });
    input.removeAttribute('aria-activedescendant');
  }

  // Select a country
  function selectCountry(country) {
    input.value = country;
    clearButton.classList.add('visible');
    closeSuggestions();
    statusElement.textContent = \`Selected: \${country}\`;
  }

  // Close suggestions when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.autocomplete')) {
      closeSuggestions();
    }
  });
</script>
`;