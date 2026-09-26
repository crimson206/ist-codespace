# Chapter 2: glpkg — Install and Publish Packages

**Goal:** Publish a small package to a GitLab package registry and install it again,
first with npm and then with Python.

`glpkg` has many subcommands, but you only need three:

| Command | What it does |
|---------|-------------|
| `glpkg config` | Save your token and map scopes to GitLab groups |
| `glpkg install` | Install packages from the GitLab registry |
| `glpkg publish` | Publish the current project to the GitLab registry |

## 1. Configure Your Token

Create a GitLab personal access token with the `api` scope
(GitLab → Preferences → Access Tokens), then save it:

```bash
glpkg config save <your-glpat-token>
glpkg config check
```

`glpkg config check` should confirm the token is configured.

## 2. Create a GitLab Project to Publish From

Packages are published to a **GitLab project**. `glpkg publish` finds that project
through your local repo's `git origin`. This Codespace's origin is GitHub, so create
a separate GitLab repo for the exercise:

```bash
cd ~
glpkg repo create <your-gitlab-user-or-group>/hello-glpkg --path ./hello-glpkg --visibility private
cd hello-glpkg
git remote -v        # origin should point to gitlab.com
```

Use `--dry-run` first if you want to preview what `glpkg repo create` will do.

---

## Part A: npm

### Publish

Create a minimal npm package. The scope (`@<your-scope>`) should match your GitLab
user or group name:

```bash
npm init -y --scope=@<your-scope>
echo 'module.exports = () => "hello from glpkg";' > index.js
git add -A && git commit -m "init"
```

Preview, then publish:

```bash
glpkg publish --dry-run
glpkg publish
```

By default, `glpkg publish` also creates a git tag and pushes. To skip that while
you experiment:

```bash
glpkg publish --git-tag false --push false
```

To bump the version as you publish:

```bash
glpkg publish --bump patch       # 1.0.0 -> 1.0.1
glpkg publish dev --bump minor   # publish under the "dev" dist-tag
```

### Install

In another directory, map the scope to its GitLab group once, then install:

```bash
glpkg config scope:set @<your-scope> <your-gitlab-group>
mkdir -p ~/try-npm && cd ~/try-npm && npm init -y
glpkg install @<your-scope>/hello-glpkg
node -e 'console.log(require("@<your-scope>/hello-glpkg")())'
```

Other useful forms:

```bash
glpkg install @<your-scope>/pkg -D    # devDependency
glpkg install @<your-scope>/pkg -g    # global
glpkg install                          # install everything in package.json
```

### Verify With pkgfind

```bash
pkgfind hello-glpkg
pkgfind info @<your-scope>/hello-glpkg
```

`pkgfind` lists matches in your local cache and in the remote registry, with versions.

---

## Part B: Python (`--pypi`)

The same three commands work for Python with `--pypi`. Python needs a little more
setup, and there are some gaps compared to npm, so read the caveats.

### Set Up a Virtual Environment

Use a venv. It gives you `python` and `pip` commands (glpkg calls both by those
names), and it avoids the "externally-managed-environment" error on recent
Debian/Ubuntu systems (PEP 668).

```bash
python3 -m venv ~/.venv-glpkg
source ~/.venv-glpkg/bin/activate
python -m pip install --upgrade pip build twine
```

If `python3 -m venv` fails because `ensurepip`/`venv` is missing, install it first:
`sudo apt-get update && sudo apt-get install -y python3-venv`.

> [!WARNING]
> **Caveat — pip is called directly.** glpkg runs `pip install …` and
> `python -m build` using whatever `pip` and `python` are on your `PATH`. Always
> activate your venv first. Without one, installs may fail under PEP 668, or land in
> the wrong interpreter.

### Publish

Create a second GitLab repo for the Python package, then add a `pyproject.toml`:

```bash
cd ~
glpkg repo create <your-gitlab-group>/hello-glpkg-py --path ./hello-glpkg-py --visibility private
cd hello-glpkg-py
mkdir hello_glpkg_py
echo 'def hello(): return "hello from glpkg (python)"' > hello_glpkg_py/__init__.py
cat > pyproject.toml <<'EOF'
[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[project]
name = "hello-glpkg-py"
version = "0.1.0"
EOF
echo "dist/" >> .gitignore
git add -A && git commit -m "init"
```

Preview first. A dry run builds the package and shows the upload URL without
uploading:

```bash
glpkg publish --pypi --dry-run
```

You should see `Build complete`, then `Would upload to: https://gitlab.com/api/v4/projects/<id>/packages/pypi`.

Now publish for real:

```bash
rm -rf dist/
glpkg publish --pypi --git-tag false --push false
```

> [!WARNING]
> **Caveat — clean `dist/` before every publish.** glpkg builds into `dist/` and then
> uploads `dist/*`, but it does not delete old builds first. Leftover files from an
> earlier version get uploaded again, and the upload can fail. Run `rm -rf dist/`
> before each publish.

> [!WARNING]
> **Caveat — publish needs `glab` and a GitLab `origin`.** glpkg finds the target
> project with `glab api projects/:id`, which reads your repo's `git origin` (glpkg
> passes your saved token to `glab`). If `glab` isn't installed, or origin isn't a
> GitLab project, publish fails, even with `--dry-run`. `glab` is not in the
> workshop image; install it from [gitlab.com/gitlab-org/cli](https://gitlab.com/gitlab-org/cli)
> and check with `glab --version`.

> [!WARNING]
> **Caveat — no dist-tags for Python.** `glpkg publish dev --pypi` does **not**
> create a "dev" channel like npm does. It only skips the git tag. Use PEP 440
> pre-release versions instead (e.g. `0.2.0rc1`). `--bump` only edits a static
> `version = "..."` in `pyproject.toml`.

### Install

Install into a fresh venv, so you can tell it really came from the registry:

```bash
python3 -m venv ~/.venv-try && source ~/.venv-try/bin/activate
glpkg install hello-glpkg-py --pypi --group <your-gitlab-group>
```

> [!WARNING]
> **Caveat — `--group` is required.** npm installs find the group from your scope
> mapping. Python installs don't, so without `--group` the command stops with an
> error. `--group` is the GitLab group whose package index glpkg reads from. If a
> package isn't found there, pip falls back to public pypi.org.

> [!WARNING]
> **Caveat — nothing is recorded.** A Python install doesn't write to
> `pyproject.toml`, `requirements.txt`, or any lock file. `-D` has no effect, and
> `glpkg install --pypi` with no package name is an error. Add the dependency to
> your `pyproject.toml` yourself.

> [!WARNING]
> **Caveat — `-g` means `pip install --user`.** That fails inside a venv. Don't use
> `-g` while a venv is active.

### Verify (Don't Skip This)

> [!IMPORTANT]
> **A failed Python install can still exit with success.** If the group lookup or
> the pip install fails, glpkg prints an error, keeps going, and still ends with
> `Installation complete` and exit code 0. Always check the result yourself.

```bash
pip show hello-glpkg-py                                   # installed locally?
python -c 'import hello_glpkg_py; print(hello_glpkg_py.hello())'
pkgfind hello-glpkg-py                                     # published in the registry?
```

- `pip show` / `import` confirm the package is **installed** in your venv.
- `pkgfind` confirms the package is **published** in the registry, with its latest
  version.

## Python Caveats Summary

| Topic | npm | Python (`--pypi`) |
|-------|-----|-------------------|
| Group discovery on install | automatic (scope mapping) | `--group` required |
| Records the dependency | `package.json` | nothing (edit `pyproject.toml` yourself) |
| `-D` | devDependency | no effect |
| `-g` | global install | `pip install --user` (breaks in a venv) |
| Dist-tags (`dev`, `beta`) | yes | no, use pre-release versions |
| Cleans old build output | n/a | no, `rm -rf dist/` yourself |
| Failed install exit code | non-zero | can be 0, verify with `pip show` |
| Publish prerequisites | token | token + `glab` + GitLab origin + `build` + `twine` |

## What You Did

- Saved a token and created GitLab projects with `glpkg`
- Published and installed an npm package
- Published and installed a Python package with `--pypi`
- Verified installs with `pip show` and published packages with `pkgfind`

Next: [Chapter 3: Build a session kit with skit](chapter-3-skit.md)
