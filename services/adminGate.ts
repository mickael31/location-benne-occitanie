export type AdminGateConfig = {
  enabled: boolean;
  salt: string; // base64
  passwordHash: string; // base64
  iterations: number;
};

function ensureWebCrypto() {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      'WebCrypto indisponible. Utilisez un navigateur récent (HTTPS ou localhost) ou l’app desktop.',
    );
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const cleaned = (base64 || '').trim().replace(/\s+/g, '');
  const binary = atob(cleaned);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function isGateEnabled(gate: Partial<AdminGateConfig> | undefined | null): gate is AdminGateConfig {
  return Boolean(
    gate &&
      gate.enabled === true &&
      typeof gate.salt === 'string' &&
      gate.salt.trim() &&
      typeof gate.passwordHash === 'string' &&
      gate.passwordHash.trim() &&
      typeof gate.iterations === 'number' &&
      Number.isFinite(gate.iterations) &&
      gate.iterations > 0,
  );
}

export function createSaltBase64(byteLength = 16): string {
  ensureWebCrypto();
  const salt = new Uint8Array(byteLength);
  globalThis.crypto.getRandomValues(salt);
  return bytesToBase64(salt);
}

export async function pbkdf2HashPassword(params: {
  password: string;
  saltBase64: string;
  iterations: number;
  bytes?: number;
}): Promise<string> {
  ensureWebCrypto();

  const passwordBytes = new TextEncoder().encode(params.password);
  const saltBytes = base64ToBytes(params.saltBase64);
  const iterations = Math.floor(params.iterations);
  const bytes = params.bytes ?? 32;

  const key = await globalThis.crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBytes,
      iterations,
    },
    key,
    bytes * 8,
  );

  return bytesToBase64(new Uint8Array(derivedBits));
}

export function verifyPasswordHash(params: { expectedHashBase64: string; actualHashBase64: string }): boolean {
  try {
    const a = base64ToBytes(params.expectedHashBase64);
    const b = base64ToBytes(params.actualHashBase64);
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function createGateFromPassword(params: {
  password: string;
  iterations?: number;
}): Promise<Pick<AdminGateConfig, 'enabled' | 'salt' | 'passwordHash' | 'iterations'>> {
  const iterations = params.iterations ?? 600_000;
  const salt = createSaltBase64(16);
  const passwordHash = await pbkdf2HashPassword({ password: params.password, saltBase64: salt, iterations });

  return { enabled: true, salt, passwordHash, iterations };
}

