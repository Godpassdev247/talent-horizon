#!/usr/bin/env bash
set -euo pipefail

# Creates a lightweight source zip by excluding generated / bulky artifacts.
# Usage:
#   ./scripts/package_zip.sh
#   ./scripts/package_zip.sh talent-horizon-source.zip

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# If arg includes a '/', treat it as a path (absolute or relative).
# Otherwise, write the zip into the repo root with that filename.
OUT_ARG="${1:-talent-horizon-source.zip}"
if [[ "$OUT_ARG" == */* ]]; then
  OUT_PATH="$OUT_ARG"
else
  OUT_PATH="$ROOT_DIR/$OUT_ARG"
fi

cd "$ROOT_DIR"

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Using git archive (tracked files only): $OUT_PATH"
  mkdir -p "$(dirname "$OUT_PATH")"
  git archive --format=zip -o "$OUT_PATH" HEAD
  echo "Done. (Note: untracked files are not included.)"
  exit 0
fi

if ! command -v zip >/dev/null 2>&1; then
  echo "Error: 'zip' is not available on PATH." >&2
  echo "On macOS, it is usually available by default." >&2
  exit 1
fi

# Excludes (glob patterns). Keep these broad to avoid huge archives.
EXCLUDES=(
  ".git/*"
  "*/.git/*"
  "*/.DS_Store"
  ".DS_Store"

  # Python
  "__pycache__/*"
  "*/__pycache__/*"
  "*.pyc"
  "*.pyo"
  "*.pyd"
  ".pytest_cache/*"
  "*/.pytest_cache/*"
  ".mypy_cache/*"
  "*/.mypy_cache/*"
  ".ruff_cache/*"
  "*/.ruff_cache/*"
  ".coverage"
  "*/.coverage"
  "htmlcov/*"
  "*/htmlcov/*"
  ".tox/*"
  "*/.tox/*"
  ".nox/*"
  "*/.nox/*"
  ".venv/*"
  "*/.venv/*"
  "venv/*"
  "*/venv/*"

  # Django / local data
  "backend/db.sqlite3"
  "backend/media/*"

  # Node / frontend
  "node_modules/*"
  "*/node_modules/*"
  "frontend/client/dist/*"
  "frontend/client/build/*"
  "*/.turbo/*"
  "*/.vite/*"
  "*/.next/*"

  # Logs
  "*.log"
)

echo "Creating zip: $OUT_PATH"
mkdir -p "$(dirname "$OUT_PATH")"
# If the zip already exists, zip will update it and may keep previously-added
# entries that are now excluded. Remove it so we always produce a clean archive.
rm -f "$OUT_PATH"
# -q quiet-ish, -r recursive, -9 max compression
zip -r -9 "$OUT_PATH" . -x "${EXCLUDES[@]}"

echo "Done."