const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/~";

const CHARSET_COMPLEX = LOWER + UPPER + DIGITS + SYMBOLS;
const CHARSET_ALPHANUMERIC = LOWER + UPPER + DIGITS;

/**
 * Uniform random index into `charset` via rejection sampling (no modulo bias).
 */
function randomChar(charset) {
  const maxUnbiased = 256 - (256 % charset.length);
  const buf = new Uint8Array(1);
  let value;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= maxUnbiased);
  return charset[value % charset.length];
}

function generatePassword(length, charset) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChar(charset);
  }
  return result;
}

export const passwordComplex16 = {
  id: "password-complex-16",
  title: "16 znaků (komplexní)",
  description:
    "Malá a velká písmena, číslice a speciální znaky.",

  generate() {
    return generatePassword(16, CHARSET_COMPLEX);
  },
};

export const passwordAlphanumeric32 = {
  id: "password-alphanumeric-32",
  title: "32 znaků (alfanumerické)",
  description: "Pouze malá a velká písmena a číslice.",

  generate() {
    return generatePassword(32, CHARSET_ALPHANUMERIC);
  },
};
