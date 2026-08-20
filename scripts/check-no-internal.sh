#!/usr/bin/env bash
# Guard the public boundary of ses-lib.
#
# This repository is public. Every other repository of the organisation is
# private. A leak here is public forever: deleting the file afterwards does not
# un-publish the clones, the forks, or the caches. So this check runs before a
# commit lands and again in CI, and it is meant to be annoying.
#
# It looks for the categories named in README.md and in dev-macro's safety.md:
# Shared Drive identifiers, organisation e-mail addresses, Swiss postal
# addresses, and the unit short codes used in the private applications.
#
# It is a net, not a proof. It cannot recognise a unit name it has never seen,
# or a family name that looks like any other word. The rule that actually keeps
# this repository clean is the review habit: only generic code, design tokens,
# UI primitives, shared types, and the public visual identity enter here.
#
# Usage: ./scripts/check-no-internal.sh [file...]
#        with no argument, scans every tracked file.

set -uo pipefail
cd "$(dirname "$0")/.."

# No `mapfile`: macOS still ships bash 3.2, and this must run on the developer's
# machine as well as in CI.
files=()
if [ "$#" -gt 0 ]; then
  for f in "$@"; do files+=("$f"); done
else
  while IFS= read -r f; do files+=("$f"); done < <(git ls-files)
fi

# Skip this script itself and the README: both quote the forbidden patterns on
# purpose, to explain them.
filtered=()
for f in "${files[@]}"; do
  case "$f" in
    scripts/check-no-internal.sh|README.md|LICENSE) continue ;;
  esac
  [ -f "$f" ] && filtered+=("$f")
done
[ "${#filtered[@]}" -eq 0 ] && { echo "✓ nothing to scan"; exit 0; }


# One pattern deliberately skips lock files. A Shared Drive ID looks like
# `0A` followed by base64url characters — and so do fragments of the sha512
# integrity hashes npm writes into package-lock.json, by the thousand. Scanning
# them produced pure noise on the very first run, which is how a guard gets
# switched off. The other three patterns still apply to lock files: an e-mail
# address or a unit code there would be a genuine finding.
declare -a SKIP=(
  "package-lock.json"
  ""
  ""
  ""
)

declare -a NAMES=(
  "Shared Drive ID"
  "organisation e-mail address"
  "Swiss postal address"
  "unit short code"
)
declare -a PATTERNS=(
  '0A[A-Za-z0-9_-]{17,}'
  '[A-Za-z0-9._%+-]+@scouts-europe\.ch'
  '\b(1[0-9]{3}|[2-9][0-9]{3})[[:space:]]+(Lausanne|Genève|Geneve|Fribourg|Sion|Neuchâtel|Neuchatel|Yverdon|Morges|Nyon|Vevey|Montreux)\b'
  '\b(LV|LJ|CV|BJ|BV|BR)[0-9]{1,2}\b'
)

found=0
for i in "${!PATTERNS[@]}"; do
  scan=()
  for f in "${filtered[@]}"; do
    [ -n "${SKIP[$i]}" ] && [ "$(basename "$f")" = "${SKIP[$i]}" ] && continue
    scan+=("$f")
  done
  [ "${#scan[@]}" -eq 0 ] && continue

  if hits=$(grep -nEI "${PATTERNS[$i]}" "${scan[@]}" 2>/dev/null); then
    echo "✗ ${NAMES[$i]} found — this repository is PUBLIC:" >&2
    echo "$hits" | sed 's/^/    /' >&2
    found=1
  fi
done

if [ "$found" -ne 0 ]; then
  echo >&2
  echo "  Nothing organisation-internal may enter ses-lib. If this is a false" >&2
  echo "  positive, do not loosen the pattern blindly — check what matched, and" >&2
  echo "  say in the commit message why it is safe." >&2
  exit 1
fi

echo "✓ boundary check passed on ${#filtered[@]} file(s)"
