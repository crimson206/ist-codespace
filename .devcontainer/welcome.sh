#!/usr/bin/env bash
# Printed on every attach (postAttachCommand). Keep it fast — no installs here.
set -e

cat <<'BANNER'

╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   Welcome to the ist (isesh) trial Codespace 🎉                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

  ist / snapshot / claude-code are already installed in this image.

  ─────────────────────────────────────────────────────────────────
  ONE-TIME STEP (do this first, it can't be pre-baked):

     detector-agent login

  This opens an interactive Google login in your browser. It links
  this Codespace to your ist account. You only do it once per Codespace.
  ─────────────────────────────────────────────────────────────────

  Then try:

     isesh --version           # confirm the CLI is here
     itda list                 # list your TDA sessions
     isesh start <name>        # start a session (see README for the tutorial)

  Tip: this trial expects a tmux-capable terminal (tmux is installed).

BANNER

# Show installed versions if available (non-fatal).
if command -v isesh >/dev/null 2>&1; then
  echo "  Installed isesh: $(isesh --version 2>/dev/null || echo unknown)"
fi
echo ""
