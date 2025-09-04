export const paginatedTableExample = `
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
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Selection Summary */
  .selection-summary {
    background: #dbeafe;
    border: 1px solid #93c5fd;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selection-summary.hidden {
    display: none;
  }

  .selection-text {
    font-size: 0.875rem;
    color: #1e40af;
  }

  .clear-selection {
    font-size: 0.875rem;
    color: #2563eb;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
  }

  .clear-selection:hover {
    color: #1d4ed8;
  }

  /* Table Styles */
  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  th.checkbox-col,
  td.checkbox-col {
    width: 3rem;
    padding: 0.75rem;
  }

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  tbody tr.selected {
    background: #eff6ff;
  }

  td {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #111827;
  }

  td.numeric {
    text-align: right;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .amount-credit {
    color: #059669;
    font-weight: 500;
  }

  .status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
  }

  .status-completed {
    background: #d1fae5;
    color: #065f46;
  }

  .status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  .status-failed {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Checkbox Styles */
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  /* Pagination Controls */
  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
  }

  .items-per-page select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: white;
  }

  .pagination-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pagination-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #f9fafb;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-btn {
    min-width: 2.5rem;
    text-align: center;
  }

  .page-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
</style>

<div class="container">
  <!-- Selection Summary -->
  <div class="selection-summary hidden" id="selectionSummary">
    <span class="selection-text" id="selectionText">0 rows selected</span>
    <button class="clear-selection" onclick="clearSelection()">Clear selection</button>
  </div>

  <!-- Table -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="checkbox-col">
            <input type="checkbox" id="selectAll" onchange="handleSelectAll()">
          </th>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th style="text-align: right;">Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <!-- Table rows will be rendered here -->
      </tbody>
    </table>
  </div>

  <!-- Pagination Controls -->
  <div class="pagination-controls">
    <div class="items-per-page">
      <span>Show</span>
      <select id="itemsPerPage" onchange="changeItemsPerPage()">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
      <span id="resultsText">of 50 results</span>
    </div>

    <div class="pagination-nav">
      <button class="pagination-btn" onclick="previousPage()" id="prevBtn">Previous</button>
      <div id="pageButtons"></div>
      <button class="pagination-btn" onclick="nextPage()" id="nextBtn">Next</button>
    </div>
  </div>
</div>

<script>
  // Generate sample data
  const generateTransactions = () => {
    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare'];
    const descriptions = [
      'Grocery Store', 'Gas Station', 'Online Purchase', 'Electric Bill',
      'Movie Tickets', 'Pharmacy', 'Restaurant', 'Taxi Ride', 'Subscription'
    ];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: \`TXN-\${String(i + 1).padStart(4, '0')}\`,
      date: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount: Math.floor(Math.random() * 500) + 10,
      type: Math.random() > 0.3 ? 'debit' : 'credit',
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.1 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'failed'
    }));
  };

  const data = generateTransactions();
  let currentPage = 1;
  let itemsPerPage = 10;
  let selectedRows = new Set();

  // Calculate total pages
  function getTotalPages() {
    return Math.ceil(data.length / itemsPerPage);
  }

  // Get paginated data
  function getPaginatedData() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }

  // Render table
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    const paginatedData = getPaginatedData();
    
    tbody.innerHTML = paginatedData.map(transaction => \`
      <tr class="\${selectedRows.has(transaction.id) ? 'selected' : ''}">
        <td class="checkbox-col">
          <input type="checkbox" 
                 \${selectedRows.has(transaction.id) ? 'checked' : ''}
                 onchange="handleRowSelect('\${transaction.id}', this.checked)">
        </td>
        <td><strong>\${transaction.id}</strong></td>
        <td>\${transaction.date}</td>
        <td>\${transaction.description}</td>
        <td>\${transaction.category}</td>
        <td class="numeric \${transaction.type === 'credit' ? 'amount-credit' : ''}">
          \${transaction.type === 'credit' ? '+' : '-'}$\${transaction.amount.toFixed(2)}
        </td>
        <td>
          <span class="status-badge status-\${transaction.status}">
            \${transaction.status}
          </span>
        </td>
      </tr>
    \`).join('');
    
    updateSelectAll();
    updateSelectionSummary();
  }

  // Render pagination buttons
  function renderPagination() {
    const totalPages = getTotalPages();
    const pageButtons = document.getElementById('pageButtons');
    let html = '';
    
    // Calculate which page numbers to show
    let pages = [];
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      pages = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      pages = Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
    }
    
    pageButtons.innerHTML = pages.map(page => \`
      <button class="pagination-btn page-btn \${page === currentPage ? 'active' : ''}"
              onclick="goToPage(\${page})">
        \${page}
      </button>
    \`).join('');
    
    // Update prev/next buttons
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    
    // Update results text
    document.getElementById('resultsText').textContent = \`of \${data.length} results\`;
  }

  // Selection handlers
  function handleSelectAll() {
    const checkbox = document.getElementById('selectAll');
    const paginatedData = getPaginatedData();
    
    if (checkbox.checked) {
      paginatedData.forEach(item => selectedRows.add(item.id));
    } else {
      paginatedData.forEach(item => selectedRows.delete(item.id));
    }
    
    renderTable();
  }

  function handleRowSelect(id, checked) {
    if (checked) {
      selectedRows.add(id);
    } else {
      selectedRows.delete(id);
    }
    
    updateSelectAll();
    updateSelectionSummary();
    updateRowStyles();
  }

  function updateSelectAll() {
    const paginatedData = getPaginatedData();
    const selectAll = document.getElementById('selectAll');
    const pageSelected = paginatedData.every(item => selectedRows.has(item.id));
    const someSelected = paginatedData.some(item => selectedRows.has(item.id));
    
    selectAll.checked = pageSelected;
    selectAll.indeterminate = !pageSelected && someSelected;
  }

  function updateSelectionSummary() {
    const summary = document.getElementById('selectionSummary');
    const text = document.getElementById('selectionText');
    
    if (selectedRows.size > 0) {
      summary.classList.remove('hidden');
      text.textContent = \`\${selectedRows.size} row\${selectedRows.size !== 1 ? 's' : ''} selected\`;
    } else {
      summary.classList.add('hidden');
    }
  }

  function updateRowStyles() {
    document.querySelectorAll('tbody tr').forEach((row, index) => {
      const paginatedData = getPaginatedData();
      if (selectedRows.has(paginatedData[index].id)) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });
  }

  function clearSelection() {
    selectedRows.clear();
    renderTable();
  }

  // Pagination handlers
  function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    renderTable();
    renderPagination();
  }

  function goToPage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
    }
  }

  function nextPage() {
    if (currentPage < getTotalPages()) {
      currentPage++;
      renderTable();
      renderPagination();
    }
  }

  // Initial render
  renderTable();
  renderPagination();
</script>
`;
