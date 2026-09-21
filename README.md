# ist (isesh) — Trial Codespace

Open this repo in **GitHub Codespaces** and you get a ready-to-use environment
with `ist` (isesh) already installed. No local setup, no tokens to paste.

> This repo is a **try-it-out sandbox**. It contains only a devcontainer — the
> ist toolchain is installed into the container image, not committed here.

---

## What's already installed (baked into the image)

| Tool | Source | Notes |
|------|--------|-------|
| Node 22 + npm + git | base image `mcr.microsoft.com/devcontainers/javascript-node:22` | |
| tmux | apt | required by the ist session flow |
| `@anthropic-ai/claude-code` | public npmjs.org | AI CLI |
| `@microwiseai/snapshot` | public npmjs.org | the installer |
| `@ist/beta` (isesh, itda, …) | `snapshot install @ist/beta` (public snapshot, **anonymous**) | the ist toolchain |

All of the above are installed in the **Dockerfile**, so a Codespaces
**Prebuild** caches them and re-opening the Codespace is fast.

**No secrets or private registries are used.** Everything installs anonymously
from public sources.

---

## First time you open the Codespace

The one thing that *can't* be pre-installed is your login — it's an interactive
Google sign-in. So, once, in the Codespace terminal:

```bash
detector-agent login
```

This opens a browser login and links the Codespace to your ist account.

Then confirm the tools and start playing:

```bash
isesh --version      # CLI is installed
itda list            # list TDA sessions
isesh start demo     # start a session named "demo"
```

The welcome banner (printed on every attach) repeats these steps.

---

## Tutorial (quick summary)

The full onboarding flow that this image reproduces:

1. **Node** — provided by the base image.
2. **tmux** — provided by the image (apt).
3. **AI CLI** — `@anthropic-ai/claude-code`, pre-installed.
4. **snapshot** — `@microwiseai/snapshot`, pre-installed.
5. **ist bundle** — `snapshot install @ist/beta`, pre-installed.
6. **You**: `detector-agent login`, then `isesh start ...`.

If you want the guided tutorial inside ist, the `@marnex/tutorial-kit` prompts
walk through logging, messaging, TDA, and smon.

---

## Enabling Prebuilds (repo/org owner, one-time)

Prebuilds make every "Open in Codespaces" fast by building the image ahead of time.

1. Go to the repo (or org) on GitHub.
2. **Settings → Codespaces → Prebuilds → Set up prebuild**.
   - Org-level: **Org Settings → Codespaces → Prebuilds**.
3. Pick this repository and the branch (e.g. `main`).
4. Region(s): choose where your users are.
5. Save. GitHub builds the devcontainer image and refreshes it on pushes that
   change `.devcontainer/**`.

After the first prebuild finishes, "Open in Codespaces" uses the cached image.

---

## Files

```
.devcontainer/
  devcontainer.json   # base image, remoteUser, postAttach welcome banner
  Dockerfile          # tmux + claude-code + snapshot + `snapshot install @ist/beta`
  welcome.sh          # printed on attach: detector-agent login + next steps
README.md
```
