import * as readline from "readline";

// --- Types ---

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type Command = "add" | "list" | "toggle" | "help" | "quit";

// --- Todo Store ---

class TodoStore {
  private todos: Todo[] = [];
  private nextId = 1;

  add(title: string): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  list(): Todo[] {
    return [...this.todos];
  }

  toggle(id: number): Todo | undefined {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  }

  getStats(): { total: number; completed: number; pending: number } {
    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;
    return { total, completed, pending: total - completed };
  }
}

// --- Display Helpers ---

function formatTodo(todo: Todo): string {
  const status = todo.completed ? "[x]" : "[ ]";
  const date = todo.createdAt.toLocaleDateString();
  return `  ${status} #${todo.id} - ${todo.title}  (${date})`;
}

function printHelp(): void {
  console.log(`
  Available commands:
    add <title>   - Add a new todo
    list          - Show all todos
    toggle <id>   - Toggle todo completion
    help          - Show this help
    quit          - Exit the app
  `);
}

// --- Main App ---

function main(): void {
  const store = new TodoStore();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Todo App - Type 'help' for available commands\n");

  // Seed with example todos
  store.add("Learn IST basics");
  store.add("Try the manager-worker pattern");
  store.add("Build something awesome");

  const prompt = (): void => {
    rl.question("todo> ", (input: string) => {
      const trimmed = input.trim();
      const [command, ...args] = trimmed.split(" ");
      const arg = args.join(" ");

      switch (command as Command) {
        case "add":
          if (!arg) {
            console.log("  Usage: add <title>");
          } else {
            const todo = store.add(arg);
            console.log(`  Added: ${formatTodo(todo)}`);
          }
          break;

        case "list": {
          const todos = store.list();
          if (todos.length === 0) {
            console.log("  No todos yet. Use 'add <title>' to create one.");
          } else {
            console.log("\n  Your Todos:");
            console.log("  " + "-".repeat(50));
            todos.forEach((t) => console.log(formatTodo(t)));
            const stats = store.getStats();
            console.log("  " + "-".repeat(50));
            console.log(
              `  ${stats.completed}/${stats.total} completed, ${stats.pending} pending\n`
            );
          }
          break;
        }

        case "toggle": {
          const id = parseInt(arg, 10);
          if (isNaN(id)) {
            console.log("  Usage: toggle <id>");
          } else {
            const toggled = store.toggle(id);
            if (toggled) {
              console.log(`  Updated: ${formatTodo(toggled)}`);
            } else {
              console.log(`  Todo #${id} not found.`);
            }
          }
          break;
        }

        case "help":
          printHelp();
          break;

        case "quit":
          console.log("  Goodbye!");
          rl.close();
          return;

        default:
          console.log(`  Unknown command: '${command}'. Type 'help' for options.`);
      }

      prompt();
    });
  };

  prompt();
}

main();
