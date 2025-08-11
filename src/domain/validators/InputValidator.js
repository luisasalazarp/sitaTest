/**
 * General-purpose validation utility class.
 */
export class InputValidator {
    /**
     * Validates that the input is a non-empty array.
     * @param {any[]} array - The input array to validate.
     * @param {string} errorMessage - The error message to throw if validation fails.
     * @throws {Error} If the input is not a valid non-empty array.
     */
    static validateNonEmptyArray(array, errorMessage = 'Input must be a non-empty array.') {
        if (!Array.isArray(array) || array.length === 0) {
            throw new Error(errorMessage);
        }
    }

    /**
     * Validates that the input is a positive integer.
     * @param {number|string} value - The input value to validate.
     * @param {string} errorMessage - The error message to throw if validation fails.
     * @throws {Error} If the input is not a valid positive integer.
     */
    static validateZeroOrMore(value, errorMessage = 'Input must be a positive integer.') {
        const n = Number(value);
        if (n < 0) {
            throw new Error(errorMessage);
        }
    }

    /**
     * Validates that the input is greater than zero.
     * @param {number|string} value - The input value to validate.
     * @param {string} errorMessage - The error message to throw if validation fails.
     * @throws {Error} If the input is not a valid number greater than zero.
     */
    static validateGreaterThanZero(value, errorMessage = 'Input must be greater than 0.') {
        const n = Number(value);
        if (!Number.isInteger(n) || n <= 0) {
            throw new Error(errorMessage);
        }
    }

    /**
     * Validates that the input string contains only digits.
     * @param {string} value - The input string to validate.
     * @param {string} errorMessage - The error message to throw if validation fails.
     * @throws {Error} If the input string contains non-digit characters.
     */
    static validateDigitString(value, errorMessage = 'Input must contain only digits.') {
        if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) {
            throw new Error(errorMessage);
        }
    }
}