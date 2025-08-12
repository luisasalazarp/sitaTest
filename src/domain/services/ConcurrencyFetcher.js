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
        let nextIndex = 0;

        // Function that processes the next available URL
        const worker = async () => {
            while (true) {
                const current = nextIndex++;
                if (current >= urls.length) break;
                const url = urls[current];
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP Error: status ${response.status}`);
                    }
                    const data = await response.json();
                    responses[current] = { status: 'fulfilled', value: data, url };
                } catch (error) {
                    responses[current] = { status: 'rejected', reason: error, url };
                }
            }
        };

        // Launch up to maxConcurrency workers
        const workers = [];
        for (let i = 0; i < Math.min(maxConcurrency, urls.length); i++) {
            workers.push(worker());
        }

        await Promise.all(workers);
        return responses;
    }
}