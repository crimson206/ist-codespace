# Advanced Course: Build Your Own Tools and Kits

> **Status: draft.** This course is under review. Commands were checked against
> `@glpkg/cli` 0.14.x and `@microwiseai/skit` 0.1.42.

In the workshop you **used** IST: you started a manager, watched workers, and tested
the result. This course is the next step. Here you **build** things yourself:
packages that your AI sessions install, and kits that give your sessions reusable
prompts.

## Why This Matters for AI-Assisted Development

When you work with AI agents, two kinds of assets pile up:

| Asset | Example | Without tooling | With tooling |
|-------|---------|-----------------|--------------|
| **Code** your agents produce or depend on | a CLI, a library, a Python utility | copy-pasted between projects | published once with `glpkg`, installed anywhere |
| **Instructions** you give your agents | "always use a venv", "run tests before reporting" | re-pasted into every session | packaged as a skit, available in every session via `skit prompt show` |

- **glpkg** moves *code* through a GitLab package registry (npm, and Python via `--pypi`).
- **skit** moves *session assets* (prompts, profiles, states, permission packs) into
  your IST sessions.

Good prompts are worth reusing. `skit` is how you stop re-typing them.

## What You'll Learn

- **Chapter 2 — glpkg:** configure a token, install packages, publish your own
  (npm first, then Python).
- **Chapter 3 — skit:** write a `skit.json`, add prompts, validate locally, and
  publish a kit.

## Prerequisites

- You finished the [workshop](../README.md) (Steps 1–6).
- A **GitLab account** and a **personal access token** with the `api` scope.
  The package registry lives on GitLab, even though this Codespace is on GitHub.
- For the Python parts: Python 3 (check with `python3 --version`).

## Install the Tools

`glpkg`, `skit`, and `pkgfind` are not part of the workshop image. Install them from
public npm:

```bash
npm install -g @glpkg/cli @microwiseai/skit @ist/pkg-finder
glpkg --version
skit --version
pkgfind --version
```

## Time

~60–90 minutes

## Course Chapters

1. **Why** (this page) — what glpkg and skit are for
2. [glpkg: install and publish packages](chapter-2-glpkg.md) — npm, then Python
3. [skit: build a session kit](chapter-3-skit.md) — prompts, profiles, and more

## Python Support at a Glance

Here is what currently works with Python, so you know what to expect:

| Task | Python support |
|------|----------------|
| Publish a Python package with `glpkg publish --pypi` | Works (with caveats, see Chapter 2) |
| Install a Python package with `glpkg install --pypi` | Works (with caveats, see Chapter 2) |
| Find a published Python package with `pkgfind` | Works |
| A skit with prompts/profiles for Python projects | Works (prompts are language-agnostic) |
| Ship a Python CLI inside a skit (`clis`) | **Not supported** (npm only) |
| Declare pip dependencies in a skit (`dependencies.pip`) | **Not supported** (skipped) |

Start with [Chapter 2: glpkg](chapter-2-glpkg.md).
