# IST Workshop: Build a CLI Tool with AI Agents

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/microwiseai/ist-codespace?quickstart=1)

Build a working CLI tool in 30 minutes without writing code. Use AI agent sessions to go from product spec to finished tool.

## What You'll Learn

- Start and manage AI coding sessions with IST
- Use the TDA (Top-Down Architecture) manager-worker pattern
- Monitor multiple AI agents building code in real-time
- Go from product spec to working software with one prompt

## Prerequisites

- A GitHub account
- An [Anthropic API key](https://console.anthropic.com/)

## Quick Start

1. Click the **Open in GitHub Codespaces** badge above
2. Set your API key: `export ANTHROPIC_API_KEY=sk-ant-...`
3. Follow the [workshop guide](guide/README.md)

## What Gets Built

**quicktool** - a developer utility CLI with three commands:

```bash
quicktool time --from UTC --to KST     # Timezone conversion
quicktool json package.json             # JSON formatting
quicktool encode --base64 hello         # Base64/URL encoding
```

## How It Works

You paste a manager prompt into an AI session. The manager:
1. Reads the product spec
2. Creates worker sessions for each phase
3. Workers write code in parallel
4. You monitor everything live

No code writing. Just orchestration.

## Project Structure

```
guide/          # Step-by-step workshop instructions
project/        # Product spec, manager prompt, and starter config
.devcontainer/  # Codespace configuration with IST pre-installed
```
