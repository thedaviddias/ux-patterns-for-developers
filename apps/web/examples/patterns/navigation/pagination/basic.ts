export const basicPaginationExample = `
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
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .content {
      width: 100%;
      max-width: 600px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }

    .item {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
      color: #111827;
    }

    .item p {
      color: #6b7280;
      line-height: 1.5;
    }

    .pagination {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .pagination button {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      background: white;
      color: #374151;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
      min-width: 40px;
    }

    .pagination button:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination button[aria-current="page"] {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .pagination .ellipsis {
      color: #6b7280;
      padding: 0 0.25rem;
    }

    .info {
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 640px) {
      body {
        padding: 1rem;
      }

      .pagination button {
        padding: 0.5rem;
        font-size: 0.75rem;
        min-width: 36px;
      }
    }
  </style>
  <div class="content" id="content">
    <!-- Content will be inserted here -->
  </div>

  <div class="info" id="info">
    <!-- Info will be inserted here -->
  </div>

  <nav aria-label="Pagination Navigation" role="navigation">
    <div class="pagination" id="pagination">
      <!-- Pagination controls will be inserted here -->
    </div>
  </nav>

  <script>
    // Sample data
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: \`Item \${i + 1}\`,
      description: \`This is the description for item \${i + 1}. It contains some sample text to demonstrate pagination.\`
    }));

    const itemsPerPage = 5;
    let currentPage = 1;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    function renderContent() {
      const contentEl = document.getElementById('content');
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageItems = items.slice(startIndex, endIndex);

      contentEl.innerHTML = pageItems.map(item => \`
        <div class="item">
          <h3>\${item.title}</h3>
          <p>\${item.description}</p>
        </div>
      \`).join('');

      // Update info
      const infoEl = document.getElementById('info');
      infoEl.textContent = \`Showing \${startIndex + 1}-\${Math.min(endIndex, items.length)} of \${items.length} items\`;
    }

    function renderPagination() {
      const paginationEl = document.getElementById('pagination');
      let html = '';

      // Previous button
      html += \`<button 
        onclick="goToPage(\${currentPage - 1})" 
        \${currentPage === 1 ? 'disabled' : ''}
        aria-label="Go to previous page"
      >Previous</button>\`;

      // Page numbers with ellipsis
      const maxVisible = 7;
      let startPage = 1;
      let endPage = totalPages;

      if (totalPages > maxVisible) {
        const halfVisible = Math.floor(maxVisible / 2);
        if (currentPage <= halfVisible) {
          endPage = maxVisible - 1;
        } else if (currentPage >= totalPages - halfVisible) {
          startPage = totalPages - maxVisible + 2;
        } else {
          startPage = currentPage - halfVisible + 1;
          endPage = currentPage + halfVisible - 1;
        }
      }

      // First page
      if (startPage > 1) {
        html += \`<button 
          onclick="goToPage(1)" 
          aria-label="Go to page 1"
        >1</button>\`;
        if (startPage > 2) {
          html += '<span class="ellipsis">...</span>';
        }
      }

      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        if (i > 0 && i <= totalPages) {
          html += \`<button 
            onclick="goToPage(\${i})" 
            \${i === currentPage ? 'aria-current="page"' : ''}
            aria-label="Go to page \${i}"
          >\${i}</button>\`;
        }
      }

      // Last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          html += '<span class="ellipsis">...</span>';
        }
        html += \`<button 
          onclick="goToPage(\${totalPages})" 
          aria-label="Go to page \${totalPages}"
        >\${totalPages}</button>\`;
      }

      // Next button
      html += \`<button 
        onclick="goToPage(\${currentPage + 1})" 
        \${currentPage === totalPages ? 'disabled' : ''}
        aria-label="Go to next page"
      >Next</button>\`;

      paginationEl.innerHTML = html;
    }

    function goToPage(page) {
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      renderContent();
      renderPagination();
      
      // Announce page change to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = \`Page \${currentPage} of \${totalPages}\`;
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }

    // Initial render
    renderContent();
    renderPagination();
  </script>
`;
