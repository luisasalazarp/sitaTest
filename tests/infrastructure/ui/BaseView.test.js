/** @jest-environment jsdom */
import { BaseView } from '../../../src/infrastructure/ui/BaseView.js';

function setupDOM() {
	document.body.innerHTML = `
		<div>
			<div id="results"></div>
			<button id="btn"></button>
			<input id="input" />
		</div>`;
}

describe('BaseView (DOM integration)', () => {
	beforeEach(() => {
		setupDOM();
	});

	test('displayMessage adds a div with styles and text (info)', () => {
		const view = new BaseView('results');
		view.displayMessage('Hola');
		const container = document.getElementById('results');
		expect(container.children.length).toBe(1);
		const msgDiv = container.firstChild;
		expect(msgDiv.textContent).toBe('Hola');
		expect(msgDiv.className).toMatch(/bg-blue-100/);
	});

	test('displayMessage (error) applies red classes', () => {
		const view = new BaseView('results');
		view.displayMessage('Err', true);
		const msgDiv = document.getElementById('results').firstChild;
		expect(msgDiv.className).toMatch(/bg-red-100/);
	});

	test('addActivation executes handler on click and Enter/Space keys', () => {
		const view = new BaseView('results');
		const button = document.getElementById('btn');
		const handler = jest.fn();
		view.addActivation(button, handler);
		button.dispatchEvent(new MouseEvent('click'));
		button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(3);
	});

	test('addEnterHandler triggers only on Enter', () => {
		const view = new BaseView('results');
		const input = document.getElementById('input');
		const handler = jest.fn();
		view.addEnterHandler(input, handler);
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
	});
});
