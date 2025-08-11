/**
 * Domain service for generating sequential license plates.
 * Pattern: 000000 ... 999999, 00000A ... then alphanumeric shrinking numeric part while letters grow up to 6.
 */
export class LicensePlateGenerator {
    /**
     * Returns the plate for index n (0-based).
     * Validations: integer, >=0, not exceeding supported theoretical max (all letters: 26^6 - 1 after previous blocks).
     * @param {number|string} rawIndex
     * @returns {string}
     */
    getPlateByIndex(rawIndex) {
        // Normalize and validate input type (avoid letters or malformed strings)
        if (typeof rawIndex === 'string') {
            if (!/^\d+$/.test(rawIndex.trim())) {
                throw new Error('Index must contain only digits.');
            }
            // Prevent leading zeros large strings causing big int parse issues
            if (rawIndex.length > 12) {
                throw new Error('Index string too long.');
            }
        }
        const n = Number(rawIndex);
        if (!Number.isInteger(n) || n < 0) {
            throw new Error('Index must be a non-negative integer.');
        }

        // Compute theoretical maximum supported index based on sequence size.
        // Total = 10^6 (pure numeric) + Σ_{k=1..6} 10^(6-k) * 26^k
        // Precompute once (could be static but inexpensive here)
        const blocks = [];
        let total = 1_000_000; // numeric block
        for (let letters = 1; letters <= 6; letters++) {
            const digits = 6 - letters;
            const blockSize = Math.pow(10, digits) * Math.pow(26, letters);
            total += blockSize;
            blocks.push(blockSize);
        }
        const MAX_INDEX = total - 1; // last valid index
        if (n > MAX_INDEX) {
            throw new Error(`Index out of supported range. Max allowed: ${MAX_INDEX}.`);
        }

        // First numeric block
        if (n < 1_000_000) {
            return String(n).padStart(6, '0');
        }
        let rest = n - 1_000_000;
        for (let letters = 1; letters <= 6; letters++) {
            const digits = 6 - letters;
            const blockSize = Math.pow(10, digits) * Math.pow(26, letters);
            if (rest < blockSize) {
                const numberSpan = Math.pow(26, letters);
                const numberIndex = Math.floor(rest / numberSpan);
                const letterIndex = rest % numberSpan;
                const numberPart = digits > 0 ? String(numberIndex).padStart(digits, '0') : '';
                let tmp = letterIndex;
                let lettersPart = '';
                for (let i = 0; i < letters; i++) {
                    lettersPart = String.fromCharCode(65 + (tmp % 26)) + lettersPart;
                    tmp = Math.floor(tmp / 26);
                }
                return numberPart + lettersPart;
            }
            rest -= blockSize;
        }
        // Should never reach here due to range check.
        throw new Error('Unexpected index computation error.');
    }
}