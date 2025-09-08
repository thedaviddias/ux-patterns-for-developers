export const basicLoadMoreExample = `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f9fafb;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 2rem;
    color: #111827;
  }

  .items-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .item-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .item-card h3 {
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .item-card p {
    color: #6b7280;
    line-height: 1.5;
  }

  .load-more-container {
    text-align: center;
    margin: 2rem 0;
  }

  .load-more-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    min-width: 140px;
  }

  .load-more-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .load-more-btn:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .load-more-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .load-more-btn.loading {
    color: transparent;
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .status-message {
    text-align: center;
    color: #6b7280;
    margin-top: 1rem;
    font-size: 0.875rem;
  }

  .end-message {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
    font-style: italic;
  }
</style>

<div class="container">
  <h1>Articles</h1>

  <div class="items-grid" id="itemsContainer">
    <!-- Initial items will be loaded here -->
  </div>

  <div class="load-more-container">
    <button
      type="button"
      class="load-more-btn"
      id="loadMoreBtn"
      aria-label="Load more articles"
      aria-controls="itemsContainer"
    >
      Load More
    </button>
    <div class="status-message" role="status" aria-live="polite" id="statusMessage"></div>
  </div>
</div>

<script>
  // Simulated data
  const allItems = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: \`Article \${i + 1}\`,
    description: \`This is the description for article \${i + 1}. It contains interesting content that users might want to read.\`
  }));

  let currentPage = 0;
  const itemsPerPage = 5;
  let isLoading = false;

  // Initialize with first batch
  function init() {
    // Add initial items immediately without loading state
    const container = document.getElementById('itemsContainer');
    const statusMessage = document.getElementById('statusMessage');
    const initialItems = allItems.slice(0, itemsPerPage);

    initialItems.forEach(item => {
      const card = document.createElement('article');
      card.className = 'item-card';
      card.innerHTML = \`
        <h3>\${item.title}</h3>
        <p>\${item.description}</p>
      \`;
      container.appendChild(card);
    });

    currentPage = 1;

    // Update status
    statusMessage.textContent = \`Showing \${itemsPerPage} of \${allItems.length} articles\`;
  }

  function loadMore() {
    if (isLoading) return;

    const button = document.getElementById('loadMoreBtn');
    const container = document.getElementById('itemsContainer');
    const statusMessage = document.getElementById('statusMessage');

    // Show loading state
    isLoading = true;
    button.disabled = true;
    button.classList.add('loading');
    button.innerHTML = '<span class="spinner"></span>Loading...';
    statusMessage.textContent = 'Loading more articles...';

    // Simulate network delay
    setTimeout(() => {
      const startIdx = currentPage * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const newItems = allItems.slice(startIdx, endIdx);

      // Add new items to the DOM
      newItems.forEach(item => {
        const card = document.createElement('article');
        card.className = 'item-card';
        card.innerHTML = \`
          <h3>\${item.title}</h3>
          <p>\${item.description}</p>
        \`;
        container.appendChild(card);
      });

      currentPage++;

      // Reset button state
      isLoading = false;
      button.disabled = false;
      button.classList.remove('loading');

      // Update button and status
      const itemsLoaded = currentPage * itemsPerPage;
      const hasMore = itemsLoaded < allItems.length;

      if (hasMore) {
        button.innerHTML = 'Load More';
        statusMessage.textContent = \`Showing \${itemsLoaded} of \${allItems.length} articles\`;
      } else {
        button.style.display = 'none';
        statusMessage.innerHTML = '<div class="end-message">You\\'ve reached the end! All 25 articles loaded.</div>';
      }

      // Announce to screen readers
      const announcement = \`Loaded \${newItems.length} more articles. \${statusMessage.textContent}\`;
      statusMessage.setAttribute('aria-label', announcement);

    }, 800); // Simulate network delay
  }

  // Wait for a brief moment to ensure DOM is ready
  setTimeout(() => {
    // Event listeners
    document.getElementById('loadMoreBtn').addEventListener('click', loadMore);

    // Keyboard support
    document.getElementById('loadMoreBtn').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadMore();
      }
    });

    // Initialize
    init();
  }, 100);
</script>
`;
