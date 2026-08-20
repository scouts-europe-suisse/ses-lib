# ses-lib

Shared building blocks for the [Scouts Europe Suisse](https://github.com/scouts-europe-suisse)
applications: the design system, UI primitives, the shared logo, and — from the next release — the
client that verifies a session issued by `ses-login`.

## ⚠ This repository is public. Every other one is private.

That boundary is deliberate: `ses-lib` is consumed by git URL from private repos, and being public
means no deploy token has to be managed to install it. **Public is not a licence** — see
[`LICENSE`](LICENSE): the code is readable, not reusable, and the organisation's emblem is not
licensed for reuse.

The price of being public is that **nothing organisation-internal may ever enter this repository**:

- no Google Drive folder or Shared Drive ID,
- no e-mail address, no postal address, no phone number,
- no member, family, or unit name; no unit list,
- no pricing table or business configuration,
- no real data in a test fixture, ever — fixtures are invented.

Only generic code, design tokens, UI primitives, shared types, and the public visual identity.

**A leak in a public repository is public forever.** Deleting the file afterwards does not
un-publish the clones, the forks, or the caches. Treat every commit here as irreversible publication.

[`scripts/check-no-internal.sh`](scripts/check-no-internal.sh) enforces it before a commit lands and
again in CI. It is a net, not a proof: it cannot recognise a unit name it has never seen. The rule
that actually keeps this repository clean is the review habit.

Enable the hook once per clone:

```
git config core.hooksPath .githooks
```

## Usage

Consumers install it **by git URL** — never as a `file:` dependency, which would break every
machine but the one it was committed from:

```json
{ "dependencies": { "ses-lib": "git+https://github.com/scouts-europe-suisse/ses-lib.git" } }
```

Import the tokens once, alongside Tailwind, then use the components:

```css
@import "tailwindcss";
@import "ses-lib/theme.css";
```

```tsx
import { Button, Card, PageHeader, SesLogo } from 'ses-lib';
```

To iterate on `ses-lib` and an application at the same time, run `dev-macro/_setup/link-libs.sh`,
which uses `npm link` and never edits a `package.json`. `link-libs.sh --undo` restores the git
install.

The design tokens implement `dev-macro/_claude-memory/design.md`. That document is the source; this
package does not redefine it. If a value disagrees, the document wins and this package is the bug.

## Prerequisites

- Node.js >= 24
- npm
