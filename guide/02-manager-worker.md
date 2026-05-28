# Guide 02: Manager-Worker Pattern (TDA)

**Goal:** Use a manager session to coordinate frontend and backend workers building a feature together.
**Time:** 15 minutes
**Working directory:** `examples/tda-frontend-backend/`

## What is TDA?

**Task-Driven Architecture** (TDA) is a pattern where:
1. A **manager** session receives a high-level goal
2. The manager breaks it into tasks and **delegates** to worker sessions
3. Workers execute independently and **report back**
4. The manager coordinates, reviews, and ensures everything integrates

Think of it like a tech lead who assigns tickets to developers, then reviews their PRs.

## Step 1: Understand the Project

```bash
cd /workspaces/ist-codespace/examples/tda-frontend-backend
```

This project has:
- `frontend/` — A React app that displays a user list
- `backend/` — An Express API that serves user data
- `manager-prompt.md` — Instructions for the manager session

## Step 2: Start the Manager

```bash
isesh start manager --workspace .
```

Then send it the manager prompt:

```bash
imessenger send manager "$(cat manager-prompt.md)"
```

The manager will read the prompt and begin orchestrating. It will:
1. Start worker sessions for frontend and backend
2. Send each worker specific instructions
3. Monitor their progress
4. Coordinate integration

## Step 3: Watch It Work

```bash
smon
```

You'll see three sessions appear:
- `manager` — coordinating the work
- A frontend worker — modifying `frontend/`
- A backend worker — modifying `backend/`

The manager sends messages like:
```
imessenger send frontend-worker "Add a search bar component that filters users by name. The API endpoint will be GET /api/users?search=<query>"
imessenger send backend-worker "Add a search query parameter to GET /api/users that filters users by name (case-insensitive)"
```

## Step 4: Understand the Communication Flow

```
manager
 ├── imessenger send frontend-worker "Build search UI..."
 │    └── frontend-worker does the work
 │         └── imessenger send manager "[COMPLETE] Search bar added"
 │
 ├── imessenger send backend-worker "Add search endpoint..."
 │    └── backend-worker does the work
 │         └── imessenger send manager "[COMPLETE] Search filter added"
 │
 └── Manager verifies integration
      └── "Both features done, testing together..."
```

Workers use **prefixes** when reporting back:
- `[COMPLETE]` — task finished successfully
- `[PROGRESS]` — status update (still working)
- `[QUESTION]` — needs clarification
- `[ERROR]` — something went wrong

## Step 5: Review Results

After the manager reports completion:

```bash
# Check frontend changes
cd frontend && git diff

# Check backend changes
cd ../backend && git diff

# Test it
cd ../backend && npm start &
cd ../frontend && npm start
```

## Step 6: Clean Up

```bash
isesh stop --all
```

## What You Learned

- A **manager session** can start and coordinate worker sessions
- Workers operate **independently** in their own workspaces
- Communication happens through `imessenger` with **structured prefixes**
- The manager handles **integration** and ensures pieces fit together

## How to Write Your Own Manager Prompt

A good manager prompt includes:
1. **Goal** — what you want to build
2. **Architecture** — how the codebase is organized
3. **Worker roles** — who does what
4. **Integration points** — how pieces connect (APIs, shared types, etc.)
5. **Completion criteria** — how to know when it's done

See `manager-prompt.md` in the example for a template.

## Next Step

Ready for multi-package coordination? Continue to [03-multi-project.md](./03-multi-project.md).
