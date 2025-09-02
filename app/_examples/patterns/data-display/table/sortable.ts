export const sortableTableExample = `
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
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  th:hover {
    background: #f3f4f6;
  }

  th.sortable {
    position: relative;
    padding-right: 2rem;
  }

  .sort-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  .sort-icon.asc,
  .sort-icon.desc {
    color: #3b82f6;
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
  }

  .status-active {
    background: #d1fae5;
    color: #065f46;
  }

  .status-inactive {
    background: #f3f4f6;
    color: #374151;
  }
</style>

<div class="table-container">
  <table id="sortableTable">
    <thead>
      <tr>
        <th class="sortable" data-column="name">
          Name
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="email">
          Email
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="role">
          Role
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="salary">
          Salary
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="status">
          Status
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="lastLogin">
          Last Login
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
      </tr>
    </thead>
    <tbody id="tableBody">
      <!-- Table rows will be rendered here -->
    </tbody>
  </table>
</div>

<script>
  // Data
  const tableData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', salary: 95000, status: 'active', lastLogin: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', salary: 65000, status: 'active', lastLogin: '2024-01-14' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', salary: 45000, status: 'inactive', lastLogin: '2024-01-10' },
    { name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', salary: 68000, status: 'active', lastLogin: '2024-01-15' },
    { name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin', salary: 92000, status: 'active', lastLogin: '2024-01-13' },
    { name: 'Eve Wilson', email: 'eve@example.com', role: 'Editor', salary: 70000, status: 'active', lastLogin: '2024-01-16' },
    { name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', salary: 48000, status: 'inactive', lastLogin: '2024-01-08' },
  ];

  let currentSort = { column: null, direction: 'asc' };
  let data = [...tableData];

  // Render table
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = data.map(row => \`
      <tr>
        <td><strong>\${row.name}</strong></td>
        <td>\${row.email}</td>
        <td>\${row.role}</td>
        <td class="numeric">$\${row.salary.toLocaleString()}</td>
        <td><span class="status-badge status-\${row.status}">\${row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span></td>
        <td>\${row.lastLogin}</td>
      </tr>
    \`).join('');
  }

  // Sort function
  function sortTable(column) {
    const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    data.sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];
      
      // Handle numeric values
      if (typeof aVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Handle strings
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    currentSort = { column, direction };
    updateSortIcons();
    renderTable();
  }

  // Update sort icons
  function updateSortIcons() {
    document.querySelectorAll('.sort-icon').forEach(icon => {
      icon.classList.remove('asc', 'desc');
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />';
    });
    
    if (currentSort.column) {
      const th = document.querySelector(\`[data-column="\${currentSort.column}"]\`);
      const icon = th.querySelector('.sort-icon');
      icon.classList.add(currentSort.direction);
      
      if (currentSort.direction === 'asc') {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />';
      }
    }
  }

  // Event listeners
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.dataset.column;
      sortTable(column);
    });
  });

  // Initial render
  renderTable();
</script>
`;
