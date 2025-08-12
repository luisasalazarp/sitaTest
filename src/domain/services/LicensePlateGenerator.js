/**
 * Domain service for generating sequential license plates.
 * Pattern follows DMV requirements: 6 characters, numbers before letters
 * From 000000 to ZZZZZZ with numbers always preceding letters
 */
export class LicensePlateGenerator {
    /**
     * Returns the plate for index n (0-based).
     * @param {number|string} index
     * @returns {string}
     */
    getPlateByIndex(index) {
        const n = Number(index);
        if (n < 0 || !Number.isInteger(n)) {
            throw new Error('Index must be a non-negative integer.');
        }

        // First numeric block (000000-999999)
        if (n < 1_000_000) {
            return String(n).padStart(6, '0');
        }

        // Calculate remaining value after numeric block
        let rest = n - 1_000_000;
        
        // Calculate which pattern block we're in
        for (let letters = 1; letters <= 6; letters++) {
            const digits = 6 - letters;
            if (digits < 0) continue;
            
            const blockSize = Math.pow(10, Math.max(0, digits)) * Math.pow(26, letters);
            
            if (rest < blockSize) {
                // Special case for all letters
                if (letters === 6) {
                    return this.generateAllLettersPlate(rest);
                }
                return this.generatePlate(rest, digits, letters);
            }
            rest -= blockSize;
        }

        throw new Error('Index exceeds maximum supported value.');
    }

    /**
     * Generates a license plate with the specified number of digits and letters.
     * @param {number} index - Position within the current block
     * @param {number} digits - Number of numeric positions
     * @param {number} letters - Number of letter positions
     * @returns {string}
     */
    generatePlate(index, digits, letters) {
        const numberSpan = Math.pow(10, digits);
        
        // Calculate numeric and letter parts
        const numberPart = String(index % numberSpan).padStart(digits, '0');
        
        let letterPart = '';
        let letterValue = Math.floor(index / numberSpan);
        
        // Convert to letters (A-Z)
        for (let i = 0; i < letters; i++) {
            letterPart = String.fromCharCode(65 + (letterValue % 26)) + letterPart;
            letterValue = Math.floor(letterValue / 26);
        }

        return numberPart + letterPart;
    }

    /**
     * Generates a plate with all letters (no numbers)
     * @param {number} index 
     * @returns {string}
     */
    generateAllLettersPlate(index) {
        let result = '';
        let value = index;
        
        for (let i = 0; i < 6; i++) {
            result = String.fromCharCode(65 + (value % 26)) + result;
            value = Math.floor(value / 26);
        }
        
        return result;
    }

    /**
     * Computes the maximum supported index.
     * @returns {number}
     */
    getMaxIndex() {
        let total = 1_000_000; // 000000-999999
        
        for (let letters = 1; letters <= 6; letters++) {
            const digits = 6 - letters;
            if (digits >= 0) {
                total += Math.pow(10, digits) * Math.pow(26, letters);
            }
        }
        return total - 1;
    }
}