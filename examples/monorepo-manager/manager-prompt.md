# Manager Prompt: Add Notifications Feature

## Goal

Add a **notifications** system across all three packages in this monorepo. Users should be able to receive notifications, and the API should support creating and listing them.

## Architecture

```
packages/
  shared/  → Types and utilities (depended on by api and web)
  api/     → Express API server on port 4000
  web/     → Web frontend
```

**Dependency graph:** `shared` ← `api`, `shared` ← `web`

Changes to `shared` must happen first, since `api` and `web` import from it.

## Phased Execution Plan

### Phase 1: Shared Types (blocking)

Start a worker for the shared package. **Wait for completion before Phase 2.**

**Worker:** shared-worker
**Workspace:** `./packages/shared`
**Task:**
- Add a `Notification` interface with fields: `id`, `userId`, `message`, `type` (info | warning | error), `read` (boolean), `createdAt`
- Add `API_ENDPOINTS.notifications` constant as `/api/notifications`
- Add a `formatNotification(n: Notification): string` utility
- Export everything from index.ts

### Phase 2: API + Web (parallel)

Start both workers simultaneously after Phase 1 completes.

**Worker:** api-worker
**Workspace:** `./packages/api`
**Task:**
- Add an in-memory notifications store with 3 seed notifications
- Add `GET /api/notifications` — list notifications (optionally filter by `?userId=`)
- Add `POST /api/notifications` — create a notification (body: userId, message, type)
- Add `PATCH /api/notifications/:id/read` — mark notification as read
- Use shared types: `Notification`, `ApiResponse`, `API_ENDPOINTS`

**Worker:** web-worker
**Workspace:** `./packages/web`
**Task:**
- Add `fetchNotifications(userId?: string)` API client function
- Add `renderNotification(n: Notification)` using `formatNotification` from shared
- Add a notifications section to the page below the user table
- Show unread count and notification list

### Phase 3: Integration Verification

After all workers report `[COMPLETE]`:
1. Check that `shared/src/index.ts` exports the `Notification` type
2. Check that `api/src/index.ts` imports from `@example/shared`
3. Check that `web/src/index.ts` imports from `@example/shared`
4. Verify type names are consistent across all three packages

## Commands to Execute

```bash
# Phase 1: Shared types first
isesh start shared-worker --workspace ./packages/shared
imessenger send shared-worker "Read src/index.ts. Add: 1) Notification interface {id: string, userId: string, message: string, type: 'info'|'warning'|'error', read: boolean, createdAt: string}. 2) API_ENDPOINTS.notifications = '/api/notifications'. 3) formatNotification(n: Notification): string helper that returns a formatted string. Export everything. Report [COMPLETE] when done."

# Wait for [COMPLETE] from shared-worker, then Phase 2:
isesh start api-worker --workspace ./packages/api
isesh start web-worker --workspace ./packages/web

imessenger send api-worker "Read src/index.ts. Add notification routes using Notification type from @example/shared: 1) In-memory store with 3 seed notifications. 2) GET /api/notifications with optional ?userId= filter. 3) POST /api/notifications to create. 4) PATCH /api/notifications/:id/read to mark read. Use ApiResponse wrapper. Report [COMPLETE] when done."

imessenger send web-worker "Read src/index.ts. Add notifications support using types from @example/shared: 1) fetchNotifications(userId?) API client. 2) renderNotification() using formatNotification from shared. 3) Notifications section below user table showing unread count + list. Report [COMPLETE] when done."
```
