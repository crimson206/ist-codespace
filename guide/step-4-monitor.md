# Step 4: Monitor Workers in Real-Time

**Goal:** Watch AI agents write code live. This is the WOW moment.

## Open the Session Monitor

In a separate terminal:

```bash
smon watch 'mgr-*' -n mgr -d
```

This opens a live dashboard showing all sessions matching `mgr-*`. You'll see each worker's status, what tool they're currently using, and their progress.

## Tail Individual Worker Logs

Want to see exactly what a worker is doing? Open more terminals:

```bash
# Watch the core framework worker
ilogsession tail mgr-core
```

```bash
# Watch the commands worker
ilogsession tail mgr-commands
```

## What You're Seeing

- **File creation** - Workers creating `src/index.ts`, `src/commands/time.ts`, etc.
- **Tool calls** - Each `Write`, `Bash`, and `Read` call appears in the log
- **Build attempts** - Workers running `npm run build` and fixing any errors
- **Test runs** - Workers testing their own code with real commands
- **Communication** - Workers sending `[COMPLETE]` messages back to the manager

This is multiple AI agents working in parallel on the same codebase, coordinated by a manager agent. All from a single prompt you pasted.

## Troubleshooting

If a worker seems stuck:

```bash
# Check if it's still active
isesh list

# Send it a nudge via the manager
imessenger send mgr "Check on mgr-core status"
```

Next: [Step 5: Test what was built](step-5-review-test.md)
