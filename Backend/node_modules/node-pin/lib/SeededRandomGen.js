const seedrandom = require("seedrandom");
const crypto = require("crypto");

class SeededRandomGenerator {
  constructor(seed) {
    this.rng = seedrandom(seed);
  }

  generateRandomBytes(size) {
    const buffer = Buffer.alloc(size);
    for (let i = 0; i < size; i++) {
      buffer[i] = Math.floor(this.rng() * 256);
    }
    return buffer;
  }

  getRandomHex(size) {
    return this.generateRandomBytes(size).toString("hex");
  }

  getRandomNumber(min, max) {
    return Math.floor(this.rng() * (max - min + 1)) + min;
  }
}

module.exports = SeededRandomGenerator;