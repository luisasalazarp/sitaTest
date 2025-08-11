/**
 * Domain service for generating sequential license plates.
 * Pattern: 000000 ... 999999, 00000A ... then alphanumeric shrinking numeric part while letters grow up to 6.
 */
export class LicensePlateGenerator {
    /**
     * Returns the plate for index n (0-based).
     * Validations: integer, >=0, not exceeding supported theoretical max (all letters: 26^6 - 1 after previous blocks).
     * @param {number|string} index
     * @returns {string}
     */
    getPlateByIndex(index) {
        const n = Number(index);

        // Compute theoretical maximum supported index based on sequence size.
        const MAX_INDEX = this.getMaxIndex();
        if (n > MAX_INDEX) {
            throw new Error(`Index out of supported range. Max allowed: ${MAX_INDEX}.`);
        }

        // Generate the license plate.
        return this.generatePlate(n);
    }

    /**
     * Computes the theoretical maximum supported index.
     * @returns {number} - The maximum index.
     */
    getMaxIndex() {
        let total = 1_000_000; // Numeric block
        for (let letters = 1; letters <= 6; letters++) {
            const digits = 6 - letters;
            total += Math.pow(10, digits) * Math.pow(26, letters);
        }
        return total - 1;
    }

    /**
     * Generates the license plate for a given index.
     * @param {number} n - The validated index.
     * @returns {string} - The generated license plate.
     */
    generatePlate(n) {
        // First numeric block
        if (n < 1_000_000) {
            return String(n).padStart(6, '0');
        }

        // Alphanumeric blocks
        let rest = n - 1_000_000;
        for (let letters = 1; letters <= 6; letters++) {
            const digits = 6 - letters;
            const blockSize = Math.pow(10, digits) * Math.pow(26, letters);
            if (rest < blockSize) {
                return this.generateAlphanumericPlate(rest, digits, letters);
            }
            rest -= blockSize;
        }

        // Should never reach here due to range check.
        throw new Error('Unexpected index computation error.');
    }

    /**
     * Generates an alphanumeric license plate.
     * @param {number} rest - The remaining index after numeric block.
     * @param {number} digits - The number of numeric digits.
     * @param {number} letters - The number of letters.
     * @returns {string} - The generated alphanumeric plate.
     */
    generateAlphanumericPlate(rest, digits, letters) {
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
}