// ses-lib — shared building blocks for the Scouts Europe Suisse applications.
//
// PUBLIC REPOSITORY. Nothing organisation-internal may enter it: no Drive ID,
// no address, no member or unit name, no unit list, no pricing table, no
// business configuration, no real data in a fixture. Only generic code, the
// design tokens, UI primitives, shared types, and the public visual identity.
// A leak here is public forever. See README.md and scripts/check-no-internal.sh.
//
// Imports carry the .js extension on purpose: TypeScript maps it back to the
// .tsx source, and the emitted ESM then has a real, resolvable specifier.
//
// The design tokens live in src/theme.css and are imported separately:
//   @import "ses-lib/theme.css";

export { SesLogo } from './logo.js';
export { Button } from './ui/Button.js';
export { Card } from './ui/Card.js';
export { PageHeader } from './ui/PageHeader.js';

export type { ButtonProps } from './ui/Button.js';
export type { CardProps } from './ui/Card.js';
export type { PageHeaderProps } from './ui/PageHeader.js';
