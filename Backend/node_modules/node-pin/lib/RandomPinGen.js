const crypto = require('crypto');

class RandomPinGenerator {
    /**
     * Generates a secure random PIN of specified length.
     * @param {number} pinLength - The desired length of the PIN, up to 50.
     * @returns {Promise<string>} A promise that resolves to the generated PIN.
     */
    static generate(pinLength) {
        return new Promise((resolve, reject) => {
            // Validate pinLength is within the desired range
            if (!Number.isInteger(pinLength) || pinLength < 1 || pinLength > 50) {
                reject(new Error("PIN length must be an integer between 1 and 50."));
                return;
            }

            // Calculate the number of bytes needed to ensure we can generate a PIN of the desired length
            const bytesNeeded = Math.ceil((pinLength * Math.log10(256)) / Math.log10(10));
            crypto.randomBytes(bytesNeeded, (err, buffer) => {
                if (err) {
                    reject(new Error("Failed to generate random bytes."));
                    return;
                }

                // Convert to a decimal string without leading zeros
                const pin = parseInt(buffer.toString('hex'), 16).toString().padStart(pinLength, '0');
                resolve(pin.substring(0, pinLength));
            });
        });
    }

    static generateWithCallback(pinLength, callback) {
        RandomPinGenerator.generate(pinLength)
            .then(pin => callback(null, pin)) // Pass null for error and pin as the result
            .catch(error => callback(error, null)); // Pass error and null for pin
    }
    
}

module.exports = RandomPinGenerator;
