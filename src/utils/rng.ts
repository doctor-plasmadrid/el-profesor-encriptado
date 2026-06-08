const FULL_SEED_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789?.:";

export const generateRandomSeed = (): string => {
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += FULL_SEED_ALPHABET.charAt(Math.floor(Math.random() * FULL_SEED_ALPHABET.length));
  }
  return result;
};

const hashSeed = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h;
};

export const createSeededRNG = (seedStr: string) => {
  let a = hashSeed(seedStr);
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

export const seededShuffle = <T>(array: T[], rng: () => number): T[] => {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};