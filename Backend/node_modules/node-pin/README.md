# node-pin: Secure OTP Generation for Email Verification and More

The `node-pin` module offers a robust and secure solution for generating One-Time Passwords (OTPs), tailored specifically for authentication processes such as email verification. Built with security and ease of integration in mind, this library leverages Node.js's cryptographic modules to produce unpredictable and secure PINs, suitable for a wide array of verification and authentication scenarios.

## Random Pin Generator

### Features:
- **Secure Random PIN Generation**: Utilizes Node.js's `crypto` module to ensure each PIN is cryptographically secure, making them ideal for sensitive authentication tasks.
- **Flexible Length Configuration**: Generate PINs of any length between 1 and 50 digits, allowing for customization based on the security requirements of your application.
- **Promise-based API**: Designed with modern asynchronous patterns in mind, `node-pin` supports both callback and Promise-based workflows, ensuring seamless integration into contemporary Node.js applications.
- **Simplified Integration**: With minimal setup required, integrating `node-pin` into your project is straightforward, enabling you to add OTP generation functionality quickly and efficiently.
- **Versatile Use Cases**: While optimized for email verification, the `node-pin` module can be easily adapted for SMS verification, two-factor authentication (2FA), and other scenarios where OTPs are essential.

### Getting Started:

To begin using `node-pin` in your project, simply install the package using npm:

```bash
npm install node-pin --save
```

Then, generate a PIN by specifying the desired length:

```javascript
const { RandomPinGenerator } = require('node-pin');

// Generate a 20-digit PIN
RandomPinGenerator.generate(20).then(pin => {
  console.log(`Generated PIN: ${pin}`);
}).catch(err => {
  console.error(err);
});
```

### Callback example:

```javascript
const { RandomPinGenerator } = require('node-pin');

// Generate a 6-digit PIN using the callback method
RandomPinGenerator.generateWithCallback(6, (err, pin) => {
    if (err) {
        console.error("An error occurred:", err);
        return;
    }
    console.log(`Generated PIN: ${pin}`);
});
```

## SeededRandomGenerator

Provides a seeded random number generator capable of producing a consistent sequence of pseudo-random numbers, bytes, and hex strings based on a provided seed. This is particularly useful for scenarios requiring reproducible results.

### Features

- Generate random bytes with a given size.
- Produce random hex strings.
- Generate random numbers within a specified range.

### Usage

Creating an instance and generating seeded random data:

```javascript
const { SeededRandomGenerator } = require('node-pin');
const generator = new SeededRandomGenerator('my-seed');

// Generate random bytes
const bytes = generator.generateRandomBytes(10);
console.log(bytes);

// Generate a random hex string
const hexString = generator.getRandomHex(4);
console.log(hexString);

// Generate a random number within a range
const randomNumber = generator.getRandomNumber(1, 100);
console.log(randomNumber);
```