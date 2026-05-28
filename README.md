# IST Codespace

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/anthropic/ist-codespace?quickstart=1)

**A one-click playground for Integrated Session Tools (IST)** — multi-agent AI development with Claude Code.

Start a Codespace, pick an example, and have multiple Claude sessions collaborating on code in minutes.

## What's Inside

### Examples (progressive complexity)

| Example | Sessions | What You'll Learn |
|---------|----------|-------------------|
| **[Solo Developer](examples/solo-developer/)** | 1 | IST basics — start a session, send tasks, review results |
| **[TDA Frontend + Backend](examples/tda-frontend-backend/)** | 3 | Manager-worker pattern — one manager coordinates two workers |
| **[Monorepo Manager](examples/monorepo-manager/)** | 4 | Multi-package coordination with dependency-aware phasing |

### Guides

- [Start Here](guide/README.md) — Overview and 5-minute quickstart
- [01 - First Session](guide/01-first-session.md) — Create your first IST session
- [02 - Manager-Worker](guide/02-manager-worker.md) — TDA pattern with frontend and backend workers
- [03 - Multi-Project](guide/03-multi-project.md) — Coordinating changes across multiple packages

## Quick Start

1. Click **"Open in GitHub Codespaces"** above (or use a specific devcontainer below)
2. Set your `ANTHROPIC_API_KEY` as a [Codespace secret](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces)
3. Open the terminal and follow the [guide](guide/README.md)

### Devcontainer Configurations

Each example has its own devcontainer config. When creating a Codespace, you can choose which one to use:

- **Solo Developer** — single session, simple todo app
- **TDA Frontend + Backend** — manager + 2 workers, React + Express
- **Monorepo Manager** — manager + 3 workers, multi-package project

## Prerequisites

- A GitHub account
- An Anthropic API key (set as `ANTHROPIC_API_KEY` Codespace secret)

## What is IST?

**Integrated Session Tools** is a session management layer for Claude Code that enables multi-agent development:

- **`isesh`** — Start, stop, and manage named Claude Code sessions
- **`imessenger`** — Send messages between sessions
- **`skit`** — Share prompts and tools across sessions
- **`smon`** — Monitor all sessions in real-time

Learn more at [ist-setup](https://github.com/anthropic/ist-setup).

## License

MIT
