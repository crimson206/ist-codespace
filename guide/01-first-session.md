# Guide 01: Your First IST Session

**Goal:** Start a Claude Code session with IST, make it edit a file, and see the result.
**Time:** 5 minutes
**Working directory:** `examples/solo-developer/`

## Step 1: Navigate to the Example Project

```bash
cd /workspaces/ist-codespace/examples/solo-developer
```

## Step 2: Start a Session

```bash
isesh start dev --workspace ./todo-app
```

This starts a Claude Code session named `dev` with its workspace set to the `todo-app` directory.

**What happened:**
- `isesh` registered a new session called `dev`
- Claude Code launched in the background, pointed at `todo-app/`
- The session is now waiting for instructions

## Step 3: Send a Message

```bash
imessenger send dev "Read the todo-app source code and add a 'delete todo' feature to the TodoList. Update both the types and the implementation."
```

This sends a task to the `dev` session. Claude will read the codebase and start making changes.

## Step 4: Monitor Progress

You have several ways to watch what's happening:

```bash
# Option A: Watch the session in real-time
smon

# Option B: Check session status
isesh status dev

# Option C: Read session logs
isesh log dev
```

`smon` is the most useful — it shows a live dashboard of all active sessions.

## Step 5: Review the Changes

Once the session reports completion, check what changed:

```bash
cd todo-app
git diff
```

You'll see Claude has modified the TypeScript files to add delete functionality.

## Step 6: Stop the Session

```bash
isesh stop dev
```

## What You Learned

- `isesh start <name>` — creates a named Claude Code session
- `imessenger send <name> "message"` — sends instructions to a session
- `smon` — monitors active sessions in real-time
- `isesh stop <name>` — cleanly shuts down a session

## Key Concepts

**Sessions are persistent.** Unlike a one-off `claude` command, IST sessions maintain state. You can send multiple messages to the same session, and it remembers the full conversation.

**Sessions are named.** Names let you organize and reference sessions. In the next guide, we'll use names like `manager`, `frontend-worker`, and `backend-worker`.

**Sessions have workspaces.** Each session operates in a specific directory. This keeps sessions focused and prevents conflicts.

## Next Step

Ready to coordinate multiple sessions? Continue to [02-manager-worker.md](./02-manager-worker.md).
