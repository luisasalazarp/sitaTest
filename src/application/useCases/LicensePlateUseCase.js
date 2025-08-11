import { LicensePlateGenerator } from '../../domain/services/LicensePlateGenerator.js';

export class LicensePlateUseCase {
    /**
     * @param {LicensePlateGenerator} generator
     */
    constructor(generator) {
        this.generator = generator;
    }

    /**
     * Executes the use case to obtain the license plate by index.
     * @param {number} n
     * @returns {string}
     */
    execute(n) {
        return this.generator.getPlateByIndex(n);
    }
}