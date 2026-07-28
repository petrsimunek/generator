import { wireguardPsk } from "./wireguard-psk.js";
import { wireguardPrivate, wireguardPublic } from "./wireguard-keys.js";
import {
  passwordComplex16,
  passwordAlphanumeric32,
} from "./passwords.js";

/**
 * Groups of generators shown stacked on the page.
 * Generators in one group render together under a shared heading.
 */
export const groups = [
  {
    id: "passwords",
    title: "Náhodná hesla",
    generators: [passwordComplex16, passwordAlphanumeric32],
  },
  {
    id: "wireguard",
    title: "WireGuard",
    generators: [wireguardPrivate, wireguardPublic, wireguardPsk],
  },
];
