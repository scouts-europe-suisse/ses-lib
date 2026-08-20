# Changelog

All notable changes to `ses-lib` are documented here.

## [Unreleased]

## [0.1.0] - 2026-08-20

- Added: design tokens as a Tailwind v4 `@theme` block, implementing `design.md` — brand, age-branch,
  neutral and status palettes, Inter, and a tabular-numeral helper for money columns.
- Added: `SesLogo`, the organisation wordmark inlined once so no application fetches it at runtime.
- Added: first UI primitives — `Button`, `Card`, `PageHeader`.
- Added: `scripts/check-no-internal.sh`, the public-boundary guard, wired into a pre-commit hook and
  into CI ahead of lint and build — it is the one failure that cannot be undone by a revert.
- Added: `LICENSE`. The repository is public so private repos can install it without a deploy
  credential; publication grants no rights.
