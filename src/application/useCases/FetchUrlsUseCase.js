/**
 * @fileoverview Application use case for fetching URLs.
 * This layer coordinates the interaction between the interface and the domain business logic.
 * Applies the dependency inversion principle by injecting the domain logic.
 */

// Imports the domain service.
import { ConcurrencyFetcher } from '../../domain/services/ConcurrencyFetcher.js';
import { InputValidator } from '../../domain/validators/InputValidator.js';

export class FetchUrlsUseCase {
    /**
     * @param {ConcurrencyFetcher} concurrencyFetcher - The domain service.
     */
    constructor(concurrencyFetcher) {
        // Dependency injection: the use case does not create the service, it receives it.
        this.concurrencyFetcher = concurrencyFetcher;
    }

    /**
     * Executes the use case to fetch the URLs.
     * @param {string[]} urls - The array of URLs.
     * @param {number} maxConcurrency - The concurrency limit.
     * @returns {Promise<any[]>} The fetched responses.
     */
    async execute(urls, maxConcurrency) {
        // Validate inputs using the general Validator class.
        this.validateInputs(urls, maxConcurrency);

        // Calls the domain service to perform the task.
        return await this.concurrencyFetcher.fetchUrls(urls, maxConcurrency);
    }

    /**
     * Validates the input parameters.
     * @param {string[]} urls - The array of URLs to validate.
     * @param {number} maxConcurrency - The maximum number of concurrent requests.
     */
    validateInputs(urls, maxConcurrency) {
        InputValidator.validateNonEmptyArray(urls, 'The URL list cannot be empty.');
        InputValidator.validateGreaterThanZero(maxConcurrency, 'Concurrency limit must be a number greater than 0.');
        // Additional validation can be added here if needed.
    }
}