/**
 * @fileoverview Application use case for fetching URLs.
 * This layer coordinates the interaction between the interface and the domain business logic.
 * Applies the dependency inversion principle by injecting the domain logic.
 */

// Imports the domain service.
import { ConcurrencyFetcher } from '../../domain/services/ConcurrencyFetcher.js';

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
        // Validates input data before calling the domain logic.
        if (!Array.isArray(urls) || urls.length === 0) {
            throw new Error('The URL list cannot be empty.');
        }
        if (typeof maxConcurrency !== 'number' || maxConcurrency < 1) {
            throw new Error('Concurrency limit must be a number greater than 0.');
        }

        // Calls the domain service to perform the task.
        return await this.concurrencyFetcher.fetchUrls(urls, maxConcurrency);
    }
}