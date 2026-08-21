# Changelog

All notable changes to `ses-lib` are documented here.

## [0.2.0] — 2026-08-21

- Added: `ses-lib/server`, a separate entry point that verifies the session tokens
  `ses-login` issues. Offline, with the public key alone, so a consuming application never
  waits on `ses-login` to answer a request. Separate from the main entry point because it
  reaches for `node:crypto`, which has no business in a browser bundle; the route guard is
  typed structurally, so this package still depends on nothing.

  The public key is a parameter rather than a constant — not for secrecy, but so that
  rotating the pair does not have to travel as a library release, and so one environment's
  key cannot be mistaken for another's.



## [0.1.0] - 2026-08-20

- Added: design tokens as a Tailwind v4 `@theme` block, implementing `design.md` — brand, age-branch,
  neutral and status palettes, Inter, and a tabular-numeral helper for money columns.
- Added: `SesLogo`, the organisation wordmark inlined once so no application fetches it at runtime.
- Added: first UI primitives — `Button`, `Card`, `PageHeader`.
- Added: `scripts/check-no-internal.sh`, the public-boundary guard, wired into a pre-commit hook and
  into CI ahead of lint and build — it is the one failure that cannot be undone by a revert.
- Added: `LICENSE`. The repository is public so private repos can install it without a deploy
  credential; publication grants no rights.
