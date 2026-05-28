import express from "express";
import cors from "cors";
import {
  User,
  ApiResponse,
  PaginatedResponse,
  createId,
  validateEmail,
  API_ENDPOINTS,
  DEFAULT_PAGE_SIZE,
} from "@example/shared";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// --- In-memory store ---

const users: User[] = [
  {
    id: createId(),
    name: "Alice Chen",
    email: "alice@example.com",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: createId(),
    name: "Bob Martinez",
    email: "bob@example.com",
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: createId(),
    name: "Carol Williams",
    email: "carol@example.com",
    createdAt: "2025-03-10T09:15:00Z",
  },
];

// --- Routes ---

// List users with pagination
app.get(API_ENDPOINTS.users, (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE;
  const start = (page - 1) * pageSize;
  const paged = users.slice(start, start + pageSize);

  const response: PaginatedResponse<User> = {
    data: paged,
    success: true,
    total: users.length,
    page,
    pageSize,
  };

  res.json(response);
});

// Create user
app.post(API_ENDPOINTS.users, (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: "Name and email are required",
    };
    res.status(400).json(response);
    return;
  }

  if (!validateEmail(email)) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: "Invalid email format",
    };
    res.status(400).json(response);
    return;
  }

  const user: User = {
    id: createId(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const response: ApiResponse<User> = {
    data: user,
    success: true,
  };

  res.status(201).json(response);
});

// Health check
app.get(API_ENDPOINTS.health, (_req, res) => {
  res.json({ status: "ok", userCount: users.length });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`  GET  ${API_ENDPOINTS.users}   - List users`);
  console.log(`  POST ${API_ENDPOINTS.users}   - Create user`);
  console.log(`  GET  ${API_ENDPOINTS.health}  - Health check`);
});
