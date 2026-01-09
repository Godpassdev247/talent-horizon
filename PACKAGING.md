# Packaging / Zipping (small)

This repo can get large if it includes local databases, uploaded media, and dependency folders.

## Recommended (smallest): tracked source only

If this folder is a Git repo:

```bash
git archive --format=zip -o talent-horizon-source.zip HEAD
```

This includes only tracked files (no `node_modules`, no `.venv`, no uploaded `media/`, etc.).

## Script (works with or without Git)

```bash
chmod +x ./scripts/package_zip.sh
./scripts/package_zip.sh
```

Write to a specific location (absolute or relative path):

```bash
./scripts/package_zip.sh "/Users/you/Downloads/talent-horizon-source.zip"
```

It creates `talent-horizon-source.zip` at the repo root and excludes common heavy/generated folders.

## What is excluded (by default)

- Python caches and virtualenvs: `__pycache__/`, `.venv/`, `.pytest_cache/`
- Node dependencies/build outputs: `node_modules/`, `dist/`, `build/`
- Local data: `backend/db.sqlite3`, `backend/media/`

If you *need* to include the DB or media, edit the exclude list in `scripts/package_zip.sh`.
