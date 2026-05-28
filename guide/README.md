# Start Here: IST in 5 Minutes

## What is IST?

**Integrated Session Tools** (IST) is a session management layer for Claude Code that enables multi-agent development workflows. Instead of one AI assistant, you can run multiple Claude Code sessions that communicate with each other — a manager that delegates tasks to specialized workers.

IST gives you:
- **Session management** (`isesh`) — start, stop, and monitor Claude Code sessions
- **Inter-session messaging** (`imessenger`) — sessions can send messages to each other
- **Skill kits** (`skit`) — shared prompts and tools across sessions
- **Session monitoring** (`smon`) — watch session activity in real-time

## Prerequisites

- A **GitHub account** (you're already in a Codespace, so you have this)
- An **Anthropic API key** — set it as a Codespace secret named `ANTHROPIC_API_KEY`

## Choose Your Path

This playground has three example projects, each progressively more complex:

### Path 1: Solo Developer (Start here)
**Time:** 5 minutes | **Sessions:** 1

A single Claude Code session working on a todo app. Learn the basics of IST session management.

[Go to guide: First Session](./01-first-session.md)

### Path 2: TDA Frontend + Backend
**Time:** 15 minutes | **Sessions:** 3 (1 manager + 2 workers)

A manager session coordinates a frontend worker and a backend worker. Learn the Task-Driven Architecture (TDA) pattern.

[Go to guide: Manager-Worker Pattern](./02-manager-worker.md)

### Path 3: Monorepo Manager
**Time:** 20 minutes | **Sessions:** 4 (1 manager + 3 workers)

Coordinate changes across shared library, API, and web packages. Learn multi-project coordination.

[Go to guide: Multi-Project](./03-multi-project.md)

## Quick Verification

Before diving in, verify IST is working:

```bash
# Check IST tools are installed
isesh --version
imessenger --version
skit prompt list

# Check Claude Code is available
claude --version

# Check your API key is set
echo $ANTHROPIC_API_KEY | head -c 10
# Should print "sk-ant-..." (first 10 chars)
```

If any command fails, run:
```bash
ist-setup install
```

## How It All Fits Together

```
You (developer)
 |
 ├── isesh start manager    # Start a manager session
 |    |
 |    ├── isesh start worker-1   # Manager starts workers
 |    ├── isesh start worker-2
 |    |
 |    ├── imessenger send worker-1 "Build the login page"
 |    └── imessenger send worker-2 "Build the API endpoint"
 |
 └── smon                   # You monitor everything
```

The manager reads a prompt file that tells it what to build, then it creates worker sessions and delegates tasks. Workers report back to the manager when done.

## Next Step

Start with [01-first-session.md](./01-first-session.md) — you'll have a Claude session running in under 2 minutes.
