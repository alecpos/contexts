import { createHash } from 'crypto';

export function generateUUIDFromStringAndNumber(
    inputString: string,
    event: string,
    number: number
) {
    const randomBytes = require('crypto').randomBytes(16); // Generate 16 random bytes as salt
    const hash = createHash('sha256');
    hash.update(
        inputString + number.toString() + event + randomBytes.toString('hex')
    ); // Combine input string, number, and salt
    return hash.digest('hex');
}
