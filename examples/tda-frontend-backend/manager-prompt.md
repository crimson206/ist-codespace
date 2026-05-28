# Manager Prompt: User Directory Feature

## Goal

Add a **user search** feature to the User Directory app. Users should be able to type in a search box and filter the user list by name in real-time.

## Architecture

```
frontend/   → React app on port 3000, fetches from backend API
backend/    → Express API on port 4000, serves user data
```

The frontend calls `GET /api/users` to load users. We need to add server-side search filtering.

## Worker Plan

### Worker 1: backend-worker
**Workspace:** `./backend`
**Task:** Add search query parameter support to the `GET /api/users` endpoint.

Requirements:
- Accept an optional `?search=<query>` parameter
- Filter users by name (case-insensitive partial match)
- Return all users if no search parameter is provided
- Add a `GET /api/users/stats` endpoint that returns user count by role

### Worker 2: frontend-worker
**Workspace:** `./frontend`
**Task:** Add a search bar to the User Directory UI.

Requirements:
- Add a text input at the top of the user list
- Debounce input (300ms) before calling the API
- Pass the search term as `?search=<query>` to the API call
- Show a "No results" message when the search returns empty
- Display user stats from the new `/api/users/stats` endpoint

## Integration Contract

- **Endpoint:** `GET /api/users?search=<query>`
- **Response:** Same `User[]` format, filtered by name
- **Stats endpoint:** `GET /api/users/stats` returns `{ admin: number, user: number, viewer: number }`

## Execution Order

1. Start both workers in parallel (the API contract is defined above, so they can work independently)
2. Wait for both to report `[COMPLETE]`
3. Verify integration: check that types are consistent and endpoints match

## Commands to Execute

```bash
# Start workers
isesh start backend-worker --workspace ./backend
isesh start frontend-worker --workspace ./frontend

# Send tasks
imessenger send backend-worker "Read the server.ts code, then: 1) Add ?search= query param support to GET /api/users (case-insensitive name filter, return all if no param). 2) Add GET /api/users/stats endpoint returning user count by role {admin: number, user: number, viewer: number}. Report [COMPLETE] when done."

imessenger send frontend-worker "Read App.tsx, then: 1) Add a search input above the user list with 300ms debounce. 2) Pass search term as ?search= query param to the API. 3) Show 'No results' when empty. 4) Fetch and display role stats from GET /api/users/stats. Report [COMPLETE] when done."
```
