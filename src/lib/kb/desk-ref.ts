// A desk ref ties a kb page to the signature of the person who wrote it.
// It is derived from the signature, never typed: same signature in, same ref out.

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32, no I L O U

function fnv1a(text: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// 40 bits from two passes → 8 characters, printed as DR-XXXX-XXXX.
export function deskRef(signature: string): string {
  const t = signature.trim();
  const a = fnv1a(t, 0x811c9dc5);
  const b = fnv1a(t, 0x9e3779b9);
  let bits = (BigInt(a) << 8n) | BigInt(b & 0xff);
  let out = '';
  for (let i = 0; i < 8; i++) {
    out = ALPHABET[Number(bits & 31n)] + out;
    bits >>= 5n;
  }
  return `DR-${out.slice(0, 4)}-${out.slice(4)}`;
}
