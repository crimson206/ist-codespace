# Todo App

A simple command-line todo application built with TypeScript. This is a practice project for learning IST with Claude Code.

## Running

```bash
npm install
npm run dev
```

## Available Commands

| Command | Description |
|---------|-------------|
| `add <title>` | Add a new todo item |
| `list` | Show all todos with completion status |
| `toggle <id>` | Toggle a todo's completed state |
| `help` | Show available commands |
| `quit` | Exit the app |

## Exercises to Try with Claude

Here are some features you can ask Claude to add:

1. **Delete a todo** — Add a `delete <id>` command
2. **Priority levels** — Add high/medium/low priority to todos
3. **Due dates** — Add optional due dates with overdue warnings
4. **Persistence** — Save todos to a JSON file and load on startup
5. **Categories** — Tag todos with categories and filter by them
