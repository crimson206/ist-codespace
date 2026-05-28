# Step 2: Start the Manager

**Goal:** Launch a TDA manager session that will coordinate the build.

## Set Your API Key

If you haven't already, export your Anthropic API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Start the Manager Session

```bash
isesh start mgr -w ./project
```

This starts a new AI session named `mgr` with the `./project` directory as its workspace.

## Give It the Manager Prompt

Open the manager prompt and copy its contents:

```bash
cat project/manager-prompt.md
```

Paste the entire contents into the manager session. The manager will:

1. Read `project-brief.md` to understand the product
2. Create a worker for the CLI framework (Phase 1)
3. Create a worker for the command implementations (Phase 2)
4. Review and test everything (Phase 3)

You just kick it off. The manager handles the rest.

## Verify It's Running

```bash
isesh list
```

You should see `mgr` in the list with status `active`.

Next: [Step 3: Watch workers get created](step-3-create-workers.md)
