const RandomPinGenerator = require('../lib/RandomPinGen');

describe('RandomPinGenerator', () => {
    // Test various lengths
    test.each([
        1, 10, 25, 50 // Add or remove lengths as desired
    ])('generates a PIN of length %p', async (length) => {
        const pin = await RandomPinGenerator.generate(length);
        expect(pin).toHaveLength(length);
    });

    // Test callback functionality
    test('generates a PIN using a callback', done => {
        RandomPinGenerator.generateWithCallback(6, (err, pin) => {
            try {
                expect(err).toBeNull();
                expect(pin).toHaveLength(6);
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    // Test for uniqueness over multiple generations
    test('generates unique PINs in a loop', async () => {
        const pins = new Set();
        const iterations = 50;
        const pinLength = 10; // Choose a length that ensures a wide enough range for uniqueness

        for (let i = 0; i < iterations; i++) {
            const pin = await RandomPinGenerator.generate(pinLength);
            pins.add(pin);
        }

        expect(pins.size).toBe(iterations); // If all generated PINs are unique, the set size should equal the number of iterations
    });
});

