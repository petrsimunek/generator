/**
 * WireGuard Preshared Key — same format as `wg genpsk`:
 * 32 cryptographically random bytes, Base64-encoded.
 */
export const wireguardPsk = {
  id: "wireguard-psk",
  title: "Preshared Key",
  description: "32 bajtů náhody v Base64 (wg genpsk).",

  generate() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return bytesToBase64(bytes);
  },
};

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
