// --- Core Types ---

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// --- Utilities ---

export function createId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Constants ---

export const API_ENDPOINTS = {
  users: "/api/users",
  health: "/api/health",
} as const;

export const DEFAULT_PAGE_SIZE = 20;
