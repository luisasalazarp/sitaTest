/**
 * @fileoverview Business logic to fetch URLs with a concurrency limit.
 * This is the domain layer, where the core business rules live.
 * It has no knowledge of the user interface or persistence.
 */

export class ConcurrencyFetcher {

    /**
     * Fetches a list of URLs with a maximum number of concurrent requests.
     * @param {string[]} urls - Array of URLs to fetch.
     * @param {number} maxConcurrency - Maximum simultaneous requests.
     * @returns {Promise<any[]>} An array of per-request result objects.
     */
    async fetchUrls(urls, maxConcurrency) {
        const responses = new Array(urls.length);
        // Wrap each url with its original index to support duplicates and O(1) placement
        const pendingItems = urls.map((url, index) => ({ url, index }));

        const taskRunner = async () => {
            if (pendingItems.length === 0) {
                return;
            }
            const { url, index: originalIndex } = pendingItems.shift();

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} at ${url}`);
                }
                const data = await response.json();
                responses[originalIndex] = { status: 'fulfilled', value: data, url: url };
            } catch (error) {
                responses[originalIndex] = { status: 'rejected', reason: error, url: url };
            } finally {
                if (pendingItems.length > 0) {
                    taskRunner();
                }
            }
        };

        const initialPromises = [];
        for (let i = 0; i < Math.min(urls.length, maxConcurrency); i++) {
            initialPromises.push(taskRunner());
        }

        await Promise.all(initialPromises);

        return responses;
    }
}