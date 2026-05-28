# Guide 03: Multi-Project Coordination

**Goal:** Coordinate changes across a shared library, API server, and web app simultaneously.
**Time:** 20 minutes
**Working directory:** `examples/monorepo-manager/`

## The Challenge

In real projects, a single feature often requires changes across multiple packages:
- Add a type to the **shared** library
- Use that type in the **API** server
- Display data using that type in the **web** app

Doing this manually means switching contexts, keeping things in sync, and hoping nothing breaks. With IST, a manager can coordinate all three simultaneously.

## Step 1: Understand the Project

```bash
cd /workspaces/ist-codespace/examples/monorepo-manager
```

The structure:
```
packages/
  shared/    → Common types and utilities (used by api and web)
  api/       → Express API server
  web/       → React web application
```

Each package has its own `package.json` and imports from `shared`.

## Step 2: Start the Manager

```bash
isesh start manager --workspace .
imessenger send manager "$(cat manager-prompt.md)"
```

The manager prompt asks it to add a "notifications" feature across all three packages.

## Step 3: Watch the Coordination

```bash
smon
```

You'll see the manager:
1. **Start a shared-worker first** — because shared types need to exist before other packages can use them
2. **Wait for shared-worker to complete** — this is a dependency
3. **Start api-worker and web-worker in parallel** — they can work simultaneously once shared types exist
4. **Verify integration** — ensure all packages compile and types align

This demonstrates **dependency-aware task scheduling** — the manager understands which tasks depend on others.

## Step 4: Observe the Dependency Chain

```
manager
 │
 ├─ Phase 1: Foundation
 │   └── shared-worker: "Add Notification type and notificationService to shared"
 │        └── [COMPLETE] ─────────────────────┐
 │                                             │
 ├─ Phase 2: Parallel Implementation           │ (triggers phase 2)
 │   ├── api-worker: "Add notification API     │
 │   │    endpoints using shared types" ◄──────┘
 │   └── web-worker: "Add notification UI
 │        using shared types" ◄────────────────┘
 │
 └─ Phase 3: Integration
     └── manager verifies all packages build together
```

## Step 5: Review the Changes

```bash
# Shared types (added first)
cat packages/shared/src/index.ts

# API endpoints (uses shared types)
cat packages/api/src/index.ts

# Web UI (uses shared types)
cat packages/web/src/index.ts
```

All three packages should reference the same `Notification` type from shared.

## Step 6: Clean Up

```bash
isesh stop --all
```

## What You Learned

- Managers can schedule tasks with **dependency ordering** (shared before consumers)
- **Parallel execution** is possible when tasks are independent
- IST handles **multi-package coordination** that would be tedious manually
- The manager prompt defines the **phasing strategy**

## Writing Dependency-Aware Manager Prompts

Key patterns for multi-package coordination:

```markdown
## Phases

### Phase 1: Shared Foundation
Start a worker for the shared package. Wait for completion before Phase 2.

### Phase 2: Parallel Implementation
Start workers for api and web simultaneously. Both depend on Phase 1.

### Phase 3: Integration Verification
After all workers complete, verify everything builds together.
```

## Tips for Real Projects

1. **Keep shared changes backward-compatible** — workers might be building against an older version while shared is being updated
2. **Define clear API contracts upfront** — tell workers the exact types/endpoints they'll work with
3. **Use the manager for integration testing** — have it run builds across all packages after workers finish
4. **Start small** — even 2 sessions (manager + 1 worker) is useful before scaling to more

## What's Next?

You've completed all three guides. You now know how to:
- Run single Claude sessions with IST
- Coordinate manager-worker patterns
- Handle multi-package dependency chains

To use IST in your own projects:
1. Install IST: `ist-setup install`
2. Write a manager prompt describing your project
3. Start a manager session and let it orchestrate

For more, check out the [IST documentation](https://github.com/anthropic/ist-setup).
