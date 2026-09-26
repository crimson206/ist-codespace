# Chapter 3: skit — Build a Session Kit

**Goal:** Package your own prompts as a **skit** and install it into your IST
sessions. As the example, you'll build a kit of Python project conventions.

A **skit** (session kit) is a folder with a `skit.json` manifest plus the files it
lists. `skit install` copies those files to where IST sessions look for them. In the
workshop, the manager followed prompts that came from a skit (`@ist/tda-kit`).

## The Development Loop

```
write skit.json + prompts  ->  skit info  ->  skit pack --dry-run
      ->  skit install ./ --dry-run  ->  skit install ./  ->  skit prompt show <name>
      ->  (optional) skit publish
```

Everything up to `skit publish` is local and needs **no token**.

## 1. What Goes in a Skit

| Component | What it is | Installs to |
|-----------|-----------|-------------|
| `prompts` | Prompt files your sessions can read (`skit prompt show <name>`) | `~/.ist/prompts/global/` (or a profile/session scope) |
| `profiles` | Session profiles (persona + permissions) | `~/.ist/profiles/` |
| `states` | State files | `~/.ist/state/profiles/` |
| `packs` | Permission packs | `~/.sesh/permission-packs.json` |
| `clis` | CLI tools, installed globally | **npm global only** (see the caveat below) |

Most kits only need `prompts`. Start there.

## 2. Scaffold the Kit

Create the folder layout:

```bash
mkdir -p ~/py-workflow-kit/prompts && cd ~/py-workflow-kit
```

```
py-workflow-kit/
├── skit.json
├── README.md
└── prompts/
    └── py-conventions.md
```

Write `skit.json`:

```bash
cat > skit.json <<'EOF'
{
  "name": "@me/py-workflow-kit",
  "version": "0.1.0",
  "description": "Python project conventions for AI sessions",
  "type": "skit",
  "files": ["skit.json", "README.md", "prompts/**/*.md"],
  "components": {
    "prompts": [
      { "name": "py-conventions", "file": "prompts/py-conventions.md", "description": "How to work in a Python project" }
    ]
  },
  "install": { "prompts": "~/.ist/prompts/global/" }
}
EOF
```

| Field | Meaning |
|-------|---------|
| `name` | `@scope/<kit-name>`. `@me` is fine for local use. |
| `files` | What `skit pack` includes |
| `components.prompts[].name` | What you type in `skit prompt show <name>` |
| `components.prompts[].file` | Path **inside** the kit |
| `install.prompts` | Must be `~/.ist/prompts/global/`, `~/.ist/prompts/profiles/<name>/`, or `~/.ist/prompts/sessions/<name>/`. Any other path is rejected. |

Write the prompt. Every prompt starts with frontmatter (`description`, `when`),
followed by instructions the AI should act on:

```bash
cat > prompts/py-conventions.md <<'EOF'
---
description: How to work in a Python project
when:
  - Working in a Python repository
  - Installing Python dependencies
---

# Python Conventions

- Always work inside a venv: `python3 -m venv .venv && source .venv/bin/activate`.
- Install internal packages with `glpkg install <pkg> --pypi --group <group>`,
  then add them to `pyproject.toml` yourself (glpkg does not record them).
- After any install, verify with `pip show <pkg>`. Do not trust the exit code alone.
- Run `rm -rf dist/` before `glpkg publish --pypi`.
EOF
echo "# py-workflow-kit" > README.md
```

This kit targets Python projects, and that works fine: prompts are plain Markdown,
so they don't care what language your project uses.

> **Tip:** If your environment has `@microwiseai/skit-creator-kit` installed
> (`skit list` shows it), ask your AI session to follow `skit prompt show skit-new`.
> It scaffolds the same layout from a one-line description. There is no `skit new`
> CLI command.

## 3. Validate

Read the manifest back:

```bash
skit info
```

```
@me/py-workflow-kit v0.1.0
   Python project conventions for AI sessions

Components:
  prompts (1)
    └─ py-conventions - How to work in a Python project

Install paths:
  prompts → ~/.ist/prompts/global/
```

Check which files would be packed, and what would be installed where:

```bash
skit pack --dry-run
skit install ./ --dry-run
```

## 4. Install Locally and Try It

```bash
skit install ./ -v
skit list                         # @me/py-workflow-kit should appear
skit prompt show py-conventions   # prints your prompt
```

Now every IST session can read it. Try it in a session: *"Read `skit prompt show
py-conventions` and follow it."*

Edit the prompt, then run `skit install ./` again to update it. To remove the kit:

```bash
skit uninstall @me/py-workflow-kit
```

## 5. Pack and Publish (Optional)

Make a distributable tarball. Anyone can install it with no registry and no token:

```bash
skit pack                                  # -> me-py-workflow-kit-0.1.0.tgz
skit install ./me-py-workflow-kit-0.1.0.tgz
```

To share through the GitLab registry, use a scope that matches your GitLab group,
and have your token configured (`glpkg config check`, from Chapter 2):

```bash
skit publish --dry-run
skit publish
```

Others then install it with:

```bash
skit install @<your-scope>/py-workflow-kit --group <your-gitlab-group>
```

---

## Python Tools and skit: What Works and What Doesn't

> [!WARNING]
> **Caveat — `clis` is npm-only. Don't ship Python tools in a skit.**
> skit installs every `clis` entry with `glpkg install -g <package>`, which is
> always the npm path. There is no `--pypi` option. If you list a Python package
> there, `skit install --dry-run` still shows it as if it will install, but the
> real install looks it up on npm. It either fails, or installs an unrelated npm
> package that happens to have the same name.
>
> **Instead:** keep the Python tool as a normal package (Chapter 2), and have users
> install it separately:
>
> ```bash
> glpkg install <python-tool> --pypi --group <your-gitlab-group>
> ```
>
> Then put that command in your kit's prompt or README, like the `py-conventions`
> prompt above does.

> [!WARNING]
> **Caveat — `dependencies.pip` is skipped.** A `skit.json` may declare
> `"dependencies": { "pip": { ... } }`, but skit doesn't install them. It prints a
> warning **only with `-v`**. Without `-v`, the install reports success and says
> nothing about the skipped pip dependencies.

> [!CAUTION]
> **Unofficial workaround — `install.post`.** `skit.json` can list shell commands
> under `install.post`, and they run after install. You *could* put
> `glpkg install <tool> --pypi --group <group>` there. But it isn't tracked:
> `skit list` won't show the Python tool, and `skit uninstall` won't remove it. The
> command also runs in whichever Python environment is active at install time. Use
> this only if you understand those limits. Documenting the install command is safer.

### Summary

| You want to… | Use |
|--------------|-----|
| Give your sessions Python-specific instructions | a skit with `prompts` ✅ |
| Distribute a Python library or CLI | `glpkg publish --pypi` / `glpkg install --pypi` ✅ |
| Distribute an npm CLI together with your prompts | a skit with `clis` ✅ |
| Distribute a Python CLI through a skit | not supported, install it with glpkg separately ❌ |

## What You Did

- Wrote a `skit.json` and a prompt with frontmatter
- Validated with `skit info`, `skit pack --dry-run`, `skit install --dry-run`
- Installed your kit locally and read it with `skit prompt show`
- Learned where skit stops for Python, and how to fill the gap with glpkg

Back to the [course overview](README.md).
