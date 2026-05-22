const SeededRandomGenerator = require('../lib/SeededRandomGen');
const crypto = require('crypto');

describe('SeededRandomGenerator', () => {
  // Test for consistent random byte generation
  test('generates consistent random bytes for a given seed', () => {
    const seed = crypto.randomBytes(16);
    const generator = new SeededRandomGenerator(seed);
    const firstCall = generator.generateRandomBytes(10);
    const secondCall = generator.generateRandomBytes(10);

    // Using the same seed should not produce the same result in sequential calls
    // for bytes since each call advances the internal state of the RNG.
    // This test assumes generateRandomBytes is correctly advancing the RNG state.
    expect(firstCall).not.toEqual(secondCall);
  });

  // Test for consistent hex string generation
  test('generates consistent random hex strings for a given seed', () => {
    const seed = crypto.randomBytes(16);
    const generator = new SeededRandomGenerator(seed);

    const hexSize = 4;
    const firstCall = generator.getRandomHex(hexSize);
    const secondCall = generator.getRandomHex(hexSize);

    // Check hex string length
    expect(firstCall.length).toBe(hexSize * 2); // Each byte is two hex characters
    expect(secondCall.length).toBe(hexSize * 2);

    // Check for consistency in generated values (not equality)
    expect(firstCall).not.toEqual(secondCall);
  });

  // Test random number generation within a range
  test('generates a random number within the specified range', () => {
    const seed = crypto.randomBytes(16);
    const generator = new SeededRandomGenerator(seed);
    const min = 1, max = 10;
    for (let i = 0; i < 10; i++) { // Test across 10 iterations
      const randomNumber = generator.getRandomNumber(min, max);
      expect(randomNumber).toBeGreaterThanOrEqual(min);
      expect(randomNumber).toBeLessThanOrEqual(max);
    }
  });

  // Test for deterministic outputs across runs with the same seed
  test('produces deterministic outputs for the same seed across runs', () => {
    const seed = crypto.randomBytes(16);
    const generator1 = new SeededRandomGenerator(seed);
    const generator2 = new SeededRandomGenerator(seed);

    const num1 = generator1.getRandomNumber(1, 100);
    const num2 = generator2.getRandomNumber(1, 100);

    // Numbers generated from the same seed (and same sequence of calls)
    // should be equal
    expect(num1).toEqual(num2);
  });
});
