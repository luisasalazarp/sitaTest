import { LicensePlateGenerator } from '../../../src/domain/services/LicensePlateGenerator.js';

describe('LicensePlateGenerator', () => {
	let gen;
	beforeEach(() => { gen = new LicensePlateGenerator(); });

	test('first numeric values with padding', () => {
		expect(gen.getPlateByIndex(0)).toBe('000000');
		expect(gen.getPlateByIndex(1)).toBe('000001');
		expect(gen.getPlateByIndex(9)).toBe('000009');
		expect(gen.getPlateByIndex(10)).toBe('000010');
	});

	test('last pure numeric and transition to alphanumeric block (1 letter)', () => {
		expect(gen.getPlateByIndex(999_999)).toBe('999999');
		expect(gen.getPlateByIndex(1_000_000)).toBe('00000A'); // first with 1 letter
		expect(gen.getPlateByIndex(1_000_000 + 25)).toBe('00000Z');
		expect(gen.getPlateByIndex(1_000_000 + 26)).toBe('00001A'); // number increments
	});

	test('transition to block with more letters (e.g. 2 letters)', () => {
        // Compute start of 2-letter block: after 1_000_000 + 10^5 * 26^1
        const block1Size = Math.pow(10,5) * Math.pow(26,1); // 100000 * 26
        const startBlock2 = 1_000_000 + block1Size; // index of the first 2-letter element
        const firstTwoLetters = gen.getPlateByIndex(startBlock2); // should be 0000AA
		expect(firstTwoLetters).toBe('0000AA');
		const secondTwoLetters = gen.getPlateByIndex(startBlock2 + 1);
		expect(secondTwoLetters).toBe('0000AB');
	});

	test('accepts valid numeric string input', () => {
		expect(gen.getPlateByIndex('42')).toBe('000042');
	});

	test('rejects strings with non-digit characters', () => {
		expect(() => gen.getPlateByIndex('12A')).toThrow('Index must contain only digits.');
	});

	test('rejects negative or non-integer indexes', () => {
		expect(() => gen.getPlateByIndex(-1)).toThrow('Index must be a non-negative integer.');
		expect(() => gen.getPlateByIndex(3.14)).toThrow('Index must be a non-negative integer.');
	});

	test('rejects overly long numeric string', () => {
		expect(() => gen.getPlateByIndex('1'.repeat(13))).toThrow('Index string too long.');
	});

	test('rejects index greater than supported maximum', () => {
        // Recalculate max as in implementation
		let total = 1_000_000;
		for (let letters = 1; letters <= 6; letters++) {
			const digits = 6 - letters;
			total += Math.pow(10, digits) * Math.pow(26, letters);
		}
		const maxIndex = total - 1;
		expect(() => gen.getPlateByIndex(maxIndex + 1)).toThrow('Index out of supported range');
	});
});
