import { ConcurrencyFetcher } from '../../../src/domain/services/ConcurrencyFetcher.js';

describe('ConcurrencyFetcher.fetchUrls', () => {
    let originalFetch;

    beforeEach(() => {
        originalFetch = global.fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
        jest.clearAllMocks();
    });

    test('strictly respects the maxConcurrency limit', async () => {
        const maxConcurrency = 3;
        const urls = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'];

        let inFlight = 0;
        let peak = 0;

        global.fetch = jest.fn((url) => {
            inFlight++;
            if (inFlight > peak) peak = inFlight;
            return new Promise(resolve => {
                setTimeout(() => {
                    inFlight--;
                    resolve({ ok: true, json: () => Promise.resolve({ url }) });
                }, 5);
            });
        });

        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls(urls, maxConcurrency);

        expect(results).toHaveLength(urls.length);
        expect(peak).toBeLessThanOrEqual(maxConcurrency);
        results.forEach(r => expect(r.status).toBe('fulfilled'));
        expect(results.map(r => r.url)).toEqual(urls);
    });

    test('handles errors correctly (rejected / response !ok)', async () => {
        const urls = ['ok1', 'fail1', 'ok2', 'fail2'];
        global.fetch = jest.fn((url) => {
            if (url.startsWith('fail')) {
                return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ url }) });
        });
        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls(urls, 2);
        expect(results.map(r => r.status)).toEqual(['fulfilled', 'rejected', 'fulfilled', 'rejected']);
        const rejectedReasons = results.filter(r => r.status === 'rejected').map(r => r.reason.message);
        expect(rejectedReasons.every(m => m.includes('HTTP Error: status 500'))).toBe(true);
        expect(results.map(r => r.url)).toEqual(urls);
    });

    test('returns results in original order even if completion order differs', async () => {
        const urls = ['slow', 'fast', 'medium'];
        global.fetch = jest.fn((url) => {
            let delay;
            if (url === 'slow') delay = 30;
            else if (url === 'fast') delay = 1;
            else delay = 10;
            return new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({ url }) }), delay));
        });
        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls(urls, 2);
        expect(results.map(r => r.url)).toEqual(urls);
        expect(results.every(r => r.status === 'fulfilled')).toBe(true);
    });

    test('handles duplicated URLs preserving their positions', async () => {
        const urls = ['dup', 'x', 'dup', 'y'];
        let callCount = 0;
        global.fetch = jest.fn((url) => {
            callCount++;
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ url, callCount }) });
        });
        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls(urls, 2);
        expect(results.map(r => r.url)).toEqual(urls);
        expect(results[0].value.url).toBe('dup');
        expect(results[2].value.url).toBe('dup');
        expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    test('returns empty array when no URLs', async () => {
        global.fetch = jest.fn();
        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls([], 5);
        expect(results).toEqual([]);
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('maxConcurrency greater than number of URLs is fine', async () => {
        const urls = ['a', 'b'];
        const order = [];
        global.fetch = jest.fn((url) => new Promise(resolve => setTimeout(() => { order.push(url); resolve({ ok: true, json: () => Promise.resolve({ url }) }); }, 5)));
        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls(urls, 10);
        expect(results.every(r => r.status === 'fulfilled')).toBe(true);
        expect(results.map(r => r.url)).toEqual(urls);
    });

    test('explicit fetch rejection is captured as rejected', async () => {
        const urls = ['good', 'bad', 'good2'];
        global.fetch = jest.fn((url) => {
            if (url === 'bad') return Promise.reject(new Error('Network down'));
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ url }) });
        });
        const fetcher = new ConcurrencyFetcher();
        const results = await fetcher.fetchUrls(urls, 2);
        expect(results.map(r => r.status)).toEqual(['fulfilled', 'rejected', 'fulfilled']);
        expect(results[1].reason.message).toContain('Network down');
        expect(results.map(r => r.url)).toEqual(urls);
    });
});
