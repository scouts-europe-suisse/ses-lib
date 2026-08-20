# ses-lib

Shared building blocks for the [Scouts Europe Suisse](https://github.com/scouts-europe-suisse)
applications: the auth client that verifies a session, the design system, UI primitives, and shared
types.

No code yet. The applications that will consume it are being built — see
[`dev-macro`](https://github.com/scouts-europe-suisse/dev-macro).

## ⚠ This repository is public. Every other one is private.

That boundary is deliberate: `ses-lib` is consumed by git URL from private repos, and being public
means no deploy token has to be managed to install it. The price is that **nothing organisation-internal
may ever enter this repository**:

- no Google Drive folder or Shared Drive ID,
- no e-mail address, no postal address, no phone number,
- no member, family, or unit name; no unit list,
- no pricing table or business configuration,
- no real data in a test fixture, ever — fixtures are invented.

Only generic code, design tokens, UI primitives, shared types, and the public visual identity.

**A leak in a public repository is public forever.** Deleting the file afterwards does not
un-publish the clones, the forks, or the caches. Treat every commit here as irreversible
publication, and grep the diff before pushing:

```
git diff --cached | grep -nE '0A[A-Za-z0-9_-]{17,}|@scouts-europe\.ch|[0-9]{4} [A-Za-zÀ-ÿ-]+$'
```

Anything organisation-specific belongs in the private app repo that needs it.

## Consuming it

```json
"dependencies": {
  "ses-lib": "git+https://github.com/scouts-europe-suisse/ses-lib.git"
}
```

Always the git URL — **never** a committed `file:` dependency. To iterate on `ses-lib` and an
application at the same time, use `dev-macro/_setup/link-libs.sh`, which links locally without
touching any `package.json`.

## License

Not chosen yet. To be settled before the first real content lands.
