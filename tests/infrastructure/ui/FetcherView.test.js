/** @jest-environment jsdom */
import { FetcherView } from '../../../src/infrastructure/ui/FetcherView.js';

// We'll emulate minimal DOM structure used by FetcherView.

function setupDOM() {
	document.body.innerHTML = `
		<div>
			<input id="urlsInput" />
			<input id="concurrencyInput" />
			<button id="fetchButton"></button>
			<div id="results"></div>
		</div>`;
}

describe('FetcherView (DOM integration)', () => {
	beforeEach(() => {
		setupDOM();
	});

	test('invokes onFetchRequest with parsed URLs and maxConcurrency', () => {
		const handler = jest.fn();
		const view = new FetcherView({ onFetchRequest: handler });
		view.urlsInput.value = ' http://a.com , http://b.com,,http://c.com ';
		view.concurrencyInput.value = '5';
		// simulate click
		view.fetchButton.dispatchEvent(new MouseEvent('click'));
		expect(handler).toHaveBeenCalledTimes(1);
		const [urls, maxConc] = handler.mock.calls[0];
		expect(urls).toEqual(['http://a.com','http://b.com','http://c.com']);
		expect(maxConc).toBe(5);
	});

	test('Enter key on urlsInput triggers handler', () => {
		const handler = jest.fn();
		const view = new FetcherView({ onFetchRequest: handler });
		view.urlsInput.value = 'x';
		view.concurrencyInput.value = '2';
		const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
		view.urlsInput.dispatchEvent(event);
		expect(handler).toHaveBeenCalledTimes(1);
	});

	test('displayResults renders fulfilled and rejected items', () => {
		const handler = jest.fn();
		const view = new FetcherView({ onFetchRequest: handler });
		const responses = [
			{ status: 'fulfilled', value: { ok: true }, url: 'u1' },
			{ status: 'rejected', reason: new Error('boom'), url: 'u2' }
		];
		view.displayResults(responses);
		const resultsDiv = document.getElementById('results');
		expect(resultsDiv.children.length).toBe(2);
		expect(resultsDiv.innerHTML).toContain('u1');
		expect(resultsDiv.innerHTML).toContain('boom');
	});
});
