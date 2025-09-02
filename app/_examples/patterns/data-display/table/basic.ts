export const basicTableExample = `
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
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Status</th>
        <th>Last Login</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>John Doe</strong></td>
        <td>john@example.com</td>
        <td>Admin</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-15</td>
      </tr>
      <tr>
        <td><strong>Jane Smith</strong></td>
        <td>jane@example.com</td>
        <td>Editor</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-14</td>
      </tr>
      <tr>
        <td><strong>Bob Johnson</strong></td>
        <td>bob@example.com</td>
        <td>Viewer</td>
        <td><span class="status-badge status-inactive">Inactive</span></td>
        <td>2024-01-10</td>
      </tr>
      <tr>
        <td><strong>Alice Brown</strong></td>
        <td>alice@example.com</td>
        <td>Editor</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-15</td>
      </tr>
      <tr>
        <td><strong>Charlie Davis</strong></td>
        <td>charlie@example.com</td>
        <td>Admin</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-13</td>
      </tr>
    </tbody>
  </table>
</div>
`;
