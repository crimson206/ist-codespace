import React, { useEffect, useState } from "react";

// --- Types ---

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
}

// --- API ---

const API_BASE = "http://localhost:4000/api";

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
  return res.json();
}

// --- Components ---

function UserCard({ user }: { user: User }) {
  const roleColors: Record<User["role"], string> = {
    admin: "#e74c3c",
    user: "#3498db",
    viewer: "#95a5a6",
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 4px 0" }}>{user.name}</h3>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          {user.email}
        </p>
      </div>
      <span
        style={{
          background: roleColors[user.role],
          color: "white",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {user.role}
      </span>
    </div>
  );
}

function UserList({ users }: { users: User[] }) {
  if (users.length === 0) {
    return <p style={{ color: "#999" }}>No users found.</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// --- App ---

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <h1>User Directory</h1>
      <p style={{ color: "#666" }}>
        {users.length} user{users.length !== 1 ? "s" : ""} registered
      </p>

      {loading && <p>Loading users...</p>}
      {error && (
        <p style={{ color: "red" }}>
          Error: {error}. Is the backend running on port 4000?
        </p>
      )}
      {!loading && !error && <UserList users={users} />}
    </div>
  );
}
