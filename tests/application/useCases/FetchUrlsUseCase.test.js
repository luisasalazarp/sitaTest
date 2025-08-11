import { FetchUrlsUseCase } from '../../../src/application/useCases/FetchUrlsUseCase.js';

describe('FetchUrlsUseCase', () => {
    test('throws error if urls is not an array or is empty', async () => {
		const mockFetcher = { fetchUrls: jest.fn() };
		const useCase = new FetchUrlsUseCase(mockFetcher);
		await expect(useCase.execute([], 2)).rejects.toThrow('The URL list cannot be empty.');
		await expect(useCase.execute(null, 2)).rejects.toThrow('The URL list cannot be empty.');
		expect(mockFetcher.fetchUrls).not.toHaveBeenCalled();
	});

	test('throws error if maxConcurrency is invalid', async () => {
		const mockFetcher = { fetchUrls: jest.fn() };
		const useCase = new FetchUrlsUseCase(mockFetcher);
		await expect(useCase.execute(['a'], 0)).rejects.toThrow('Concurrency limit must be a number greater than 0.');
		await expect(useCase.execute(['a'], 'x')).rejects.toThrow('Concurrency limit must be a number greater than 0.');
		expect(mockFetcher.fetchUrls).not.toHaveBeenCalled();
	});

	test('delegates to concurrencyFetcher.fetchUrls with correct params and returns results', async () => {
		const urls = ['u1','u2'];
		const mockResult = [{status:'fulfilled', url:'u1'},{status:'fulfilled', url:'u2'}];
		const mockFetcher = { fetchUrls: jest.fn().mockResolvedValue(mockResult) };
		const useCase = new FetchUrlsUseCase(mockFetcher);
		const res = await useCase.execute(urls, 3);
		expect(mockFetcher.fetchUrls).toHaveBeenCalledTimes(1);
		expect(mockFetcher.fetchUrls).toHaveBeenCalledWith(urls, 3);
		expect(res).toBe(mockResult);
	});

	test('propagates error thrown by concurrencyFetcher', async () => {
		const mockFetcher = { fetchUrls: jest.fn().mockRejectedValue(new Error('network fail')) };
		const useCase = new FetchUrlsUseCase(mockFetcher);
		await expect(useCase.execute(['u'], 1)).rejects.toThrow('network fail');
	});
});
