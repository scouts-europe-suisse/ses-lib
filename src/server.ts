// Verifying a session token, server-side.
//
// PUBLIC REPOSITORY. Read the header of index.ts before adding anything here.
//
// This is a separate entry point (`ses-lib/server`) rather than part of the
// main one, because it reaches for `node:crypto`. Exporting it from the index
// would drag Node built-ins into every browser bundle that imports a Button.
//
// WHY THE PUBLIC KEY IS A PARAMETER AND NOT A CONSTANT
//   It would be safe to publish — it is the public half, and publishing it is
//   what public keys are for. It is still passed in, for two reasons that have
//   nothing to do with secrecy. Rotating the signing pair would otherwise mean
//   releasing a new version of this library and updating every consumer, which
//   turns a two-minute operation into a coordinated one. And a key baked in
//   here would be one environment's key, so development and production could
//   not both use it. Each application reads its own from its own configuration.
//
// WHY THE FORMAT IS NOT A JWT
//   There is no `alg` header, so there is no algorithm to confuse: Ed25519 is
//   the only thing that signs and the only thing that verifies. A token is
//   `base64url(payload) "." base64url(signature)`, and the signature covers the
//   payload exactly as it appears on the wire — the bytes are verified before
//   they are parsed, never after.

import { createPublicKey, verify } from 'node:crypto';

/** What a session token asserts. Identity, and nothing else. */
export interface SessionToken {
  /** The signed-in person's address. */
  sub: string;
  name: string;
  picture?: string;
  /** The application this token was minted for. */
  aud: string;
  /** Milliseconds since the epoch. */
  iat: number;
  exp: number;
}

export interface VerifyOptions {
  /** The Ed25519 public half, SPKI PEM. */
  publicKey: string;
  /**
   * The application id this token must name. Required rather than optional:
   * a token minted for another application verifies perfectly well, and
   * accepting it would let one application's session be replayed at another.
   */
  audience: string;
  /** Tolerance for clock skew between the issuer and here. Default 30 s. */
  clockSkewMs?: number;
}

/**
 * Verify a token, returning its payload or `null`.
 *
 * Null for every failure, with no reason attached. The caller cannot act on
 * *why* a token is bad — the answer is the same in every case — and an error
 * message that distinguishes "expired" from "bad signature" is free information
 * for whoever is trying them.
 */
export function verifySessionToken (token: string, opts: VerifyOptions): SessionToken | null {
  if (typeof token !== 'string') return null;

  const dot = token.indexOf('.');
  if (dot <= 0 || token.indexOf('.', dot + 1) !== -1) return null;

  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!body || !signature) return null;

  let ok = false;
  try {
    // The signature is checked against the encoded body, before anything is
    // decoded. Parsing first would mean running JSON.parse on bytes nobody has
    // authenticated yet.
    ok = verify(null, Buffer.from(body), createPublicKey(opts.publicKey), Buffer.from(signature, 'base64url'));
  } catch {
    return null;
  }
  if (!ok) return null;

  let payload: SessionToken;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionToken;
  } catch {
    return null;
  }

  if (typeof payload?.sub !== 'string' || !payload.sub) return null;
  if (typeof payload?.exp !== 'number' || typeof payload?.aud !== 'string') return null;

  const skew = opts.clockSkewMs ?? 30_000;
  if (payload.exp + skew <= Date.now()) return null;
  if (payload.aud !== opts.audience) return null;

  return payload;
}

/**
 * The minimum an HTTP framework has to look like for the guard below. Typed
 * structurally on purpose: this library takes no framework dependency, so it
 * works with Express and with anything shaped like it.
 */
export interface GuardRequest {
  cookies?: Record<string, string | undefined>;
}
export interface GuardResponse {
  status: (code: number) => { json: (body: unknown) => unknown };
}

export interface GuardOptions extends VerifyOptions {
  /**
   * The cookie the token is held in. Defaults to `__session`, which is not a
   * style choice: Firebase Hosting forwards exactly one cookie to Cloud Run and
   * that is its name. Anything else is dropped before it reaches the server.
   */
  cookieName?: string;
}

/**
 * A guard for routes that require a signed-in person. On success it attaches
 * the payload as `req.session` and calls `next()`; otherwise it answers 401 and
 * stops. It never calls the issuer: verification is offline, which is what lets
 * an application answer while ses-login is scaled to zero.
 */
export function requireSession (opts: GuardOptions) {
  const cookieName = opts.cookieName ?? '__session';
  return (req: GuardRequest, res: GuardResponse, next: () => void): void => {
    const raw = req.cookies?.[cookieName];
    const session = raw ? verifySessionToken(raw, opts) : null;
    if (!session) {
      res.status(401).json({ error: 'Unauthorized: no valid session' });
      return;
    }
    (req as GuardRequest & { session?: SessionToken }).session = session;
    next();
  };
}
