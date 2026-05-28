import {
  User,
  ApiResponse,
  PaginatedResponse,
  formatDate,
  API_ENDPOINTS,
} from "@example/shared";

// --- API Client ---

const API_BASE = "http://localhost:4000";

export async function fetchUsers(
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  const res = await fetch(`${API_BASE}${API_ENDPOINTS.users}?${params}`);
  return res.json();
}

export async function createUser(
  name: string,
  email: string
): Promise<ApiResponse<User>> {
  const res = await fetch(`${API_BASE}${API_ENDPOINTS.users}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  return res.json();
}

// --- Render ---

export function renderUserRow(user: User): string {
  return `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${formatDate(user.createdAt)}</td>
    </tr>
  `;
}

export function renderUserTable(users: User[]): string {
  if (users.length === 0) {
    return "<p>No users found.</p>";
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(renderUserRow).join("")}
      </tbody>
    </table>
  `;
}

// --- Init ---

async function init() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = "<p>Loading users...</p>";

  try {
    const response = await fetchUsers();
    if (response.success) {
      app.innerHTML = `
        <h1>User Directory</h1>
        <p>${response.total} users registered</p>
        ${renderUserTable(response.data)}
      `;
    } else {
      app.innerHTML = `<p>Error: ${response.error}</p>`;
    }
  } catch (err) {
    app.innerHTML = `<p>Failed to load users. Is the API running?</p>`;
  }
}

document.addEventListener("DOMContentLoaded", init);
