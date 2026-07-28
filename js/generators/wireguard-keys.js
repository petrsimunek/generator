import { generateKeypair } from "../lib/wireguard-crypto.js";

/** Shared so Private / Public stay a matching pair. */
let cachedPair = null;

function freshPair() {
  cachedPair = generateKeypair();
  return cachedPair;
}

function currentPair() {
  return cachedPair ?? freshPair();
}

export const wireguardPrivate = {
  id: "wireguard-private",
  title: "Private Key",
  description: "Curve25519 privátní klíč (wg genkey).",
  /** Regenerating this also refreshes these sibling outputs from the new pair. */
  linkedIds: ["wireguard-public"],

  generate() {
    return freshPair().privateKey;
  },

  getCached() {
    return currentPair().privateKey;
  },
};

export const wireguardPublic = {
  id: "wireguard-public",
  title: "Public Key",
  description: "Odvozený z privátního klíče (wg pubkey).",
  linkedIds: ["wireguard-private"],

  generate() {
    return freshPair().publicKey;
  },

  getCached() {
    return currentPair().publicKey;
  },
};
