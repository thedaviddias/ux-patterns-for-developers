export const filterableTableExample = `
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

  /* Filter Controls */
  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .filter-group {
    flex: 1;
    min-width: 200px;
  }

  .filter-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .filter-group input,
  .filter-group select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: white;
    transition: border-color 0.2s;
  }

  .filter-group input:focus,
  .filter-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Results Count */
  .results-count {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  /* Table Styles */
  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: #f9fafb;
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

  .status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    text-transform: capitalize;
  }

  .status-available {
    background: #d1fae5;
    color: #065f46;
  }

  .status-low-stock {
    background: #fef3c7;
    color: #92400e;
  }

  .status-out-of-stock {
    background: #fee2e2;
    color: #991b1b;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }
</style>

<div class="container">
  <!-- Filter Controls -->
  <div class="filter-controls">
    <div class="filter-group" style="flex: 2;">
      <label for="search">Search</label>
      <input type="text" id="search" placeholder="Search products...">
    </div>
    
    <div class="filter-group">
      <label for="category">Category</label>
      <select id="category">
        <option value="all">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label for="status">Status</label>
      <select id="status">
        <option value="all">All Statuses</option>
        <option value="available">Available</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
    </div>
  </div>

  <!-- Results Count -->
  <div class="results-count" id="resultsCount">
    Showing 8 of 8 products
  </div>

  <!-- Table -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <!-- Table rows will be rendered here -->
      </tbody>
    </table>
  </div>
</div>

<script>
  // Data
  const products = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, stock: 15, status: 'available' },
    { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 29, stock: 3, status: 'low-stock' },
    { id: 3, name: 'Office Chair', category: 'Furniture', price: 299, stock: 0, status: 'out-of-stock' },
    { id: 4, name: 'Standing Desk', category: 'Furniture', price: 599, stock: 8, status: 'available' },
    { id: 5, name: 'USB-C Cable', category: 'Electronics', price: 19, stock: 50, status: 'available' },
    { id: 6, name: 'Monitor 4K', category: 'Electronics', price: 449, stock: 2, status: 'low-stock' },
    { id: 7, name: 'Desk Lamp', category: 'Furniture', price: 45, stock: 20, status: 'available' },
    { id: 8, name: 'Keyboard Mechanical', category: 'Electronics', price: 149, stock: 0, status: 'out-of-stock' },
  ];

  let filteredData = [...products];

  // Render table
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (filteredData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-results">No products found matching your filters</td></tr>';
      return;
    }
    
    tbody.innerHTML = filteredData.map(product => \`
      <tr>
        <td><strong>\${product.name}</strong></td>
        <td>\${product.category}</td>
        <td class="numeric">$\${product.price}</td>
        <td class="numeric">\${product.stock}</td>
        <td>
          <span class="status-badge status-\${product.status}">
            \${product.status.replace('-', ' ')}
          </span>
        </td>
      </tr>
    \`).join('');
  }

  // Update results count
  function updateResultsCount() {
    const count = document.getElementById('resultsCount');
    count.textContent = \`Showing \${filteredData.length} of \${products.length} products\`;
  }

  // Filter function
  function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('category').value;
    const statusFilter = document.getElementById('status').value;
    
    filteredData = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    updateResultsCount();
    renderTable();
  }

  // Debounce function for search input
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Event listeners
  const debouncedFilter = debounce(applyFilters, 300);
  
  document.getElementById('search').addEventListener('input', debouncedFilter);
  document.getElementById('category').addEventListener('change', applyFilters);
  document.getElementById('status').addEventListener('change', applyFilters);

  // Initial render
  renderTable();
</script>
`;
