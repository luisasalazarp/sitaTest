/**
 * @fileoverview Application use case for generate plate by Index.
 * This layer coordinates the interaction between the interface and the domain business logic.
 * Applies the dependency inversion principle by injecting the domain logic.
 */

// Imports the domain service.
import { LicensePlateGenerator } from '../../domain/services/LicensePlateGenerator.js';
import { InputValidator } from '../../domain/validators/InputValidator.js';

export class LicensePlateUseCase {
    /**
     * @param {LicensePlateGenerator} generator - The domain service.
     */
    constructor(generator) {
        this.generator = generator;
    }

    /**
     * Executes the use case to obtain the license plate by index.
     * @param {number} index - The index for which to generate the license plate.
     * @returns {string}
     */
    execute(index) {
        // Validate inputs using the general Validator class.
        this.validateInputs(index);
        
        return this.generator.getPlateByIndex(index);
    }

    /**
     * Validates the input parameters.
     * @param {number} index - The index to validate.
     */
    validateInputs(index) {
        InputValidator.validateZeroOrMore(index, 'Index must be a non-negative integer.');
        const max = this.generator.getMaxIndex();
        if (index > max) {
            throw new Error(`Index out of supported range. Max allowed: ${max}.`);
        }
        // Additional validation can be added here if needed.
    }
}