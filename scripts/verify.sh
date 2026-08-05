#!/usr/bin/env bash
set -euo pipefail

echo "Running verify.sh for workspace"
echo "(This script expects dependencies installed in workspace root.)"
echo "1/4 - Types"
# tsc across packages
for p in packages/* apps/*; do
  if [ -f "$p/tsconfig.json" ]; then
    echo "Checking types in $p"
    (cd "$p" && npx tsc -p tsconfig.json)
  fi
done

echo "2/4 - Lint"
npx eslint . --ext .ts,.tsx

echo "3/4 - Format"
npx prettier --check .

echo "4/4 - Tests"
npx vitest run

echo "verify.sh completed"
