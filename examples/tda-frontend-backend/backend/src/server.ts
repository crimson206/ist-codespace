import express from "express";
import cors from "cors";

// --- Types ---

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
}

// --- Data ---

const users: User[] = [
  { id: 1, name: "Alice Chen", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "user" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", role: "user" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "viewer" },
  { id: 5, name: "Eve Johnson", email: "eve@example.com", role: "admin" },
];

// --- Server ---

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// GET /api/users - List all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// GET /api/users/:id - Get user by ID
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

// GET /api/health - Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
  console.log(`  GET /api/users     - List all users`);
  console.log(`  GET /api/users/:id - Get user by ID`);
  console.log(`  GET /api/health    - Health check`);
});
