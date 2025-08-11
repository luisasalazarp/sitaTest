/** @jest-environment jsdom */
import { LicensePlateView } from '../../../src/infrastructure/ui/LicensePlateView.js';

function setupDOM(initialValue = '0') {
	document.body.innerHTML = `
		<div>
			<input id="plateIndexInput" value="${initialValue}" />
			<button id="plateButton"></button>
			<div id="results"></div>
		</div>`;
}

describe('LicensePlateView (DOM integration)', () => {
	beforeEach(() => {
		setupDOM('7');
	});

	test('click on plateButton invokes onLicensePlateRequest with parsed number', () => {
		const handler = jest.fn();
		const view = new LicensePlateView({ onLicensePlateRequest: handler });
		// simulate click
		view.plateButton.dispatchEvent(new MouseEvent('click'));
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith(7);
	});

	test('Enter key in plateIndexInput invokes handler', () => {
		const handler = jest.fn();
		const view = new LicensePlateView({ onLicensePlateRequest: handler });
		const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
		view.plateIndexInput.dispatchEvent(event);
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler.mock.calls[0][0]).toBe(7);
	});

	test('invalid value produces NaN and passes it to handler (for later validation)', () => {
		setupDOM(''); // reset DOM with empty value
		const handler = jest.fn();
		const view = new LicensePlateView({ onLicensePlateRequest: handler });
		view.plateButton.dispatchEvent(new MouseEvent('click'));
		expect(handler).toHaveBeenCalledTimes(1);
		const arg = handler.mock.calls[0][0];
		expect(Number.isNaN(arg)).toBe(true);
	});
});
