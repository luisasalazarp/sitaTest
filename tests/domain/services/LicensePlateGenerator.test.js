import { LicensePlateGenerator } from '../../../src/domain/services/LicensePlateGenerator';

describe('LicensePlateGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = new LicensePlateGenerator();
    });

    describe('input validation', () => {
        test('should throw error for negative index', () => {
            expect(() => generator.getPlateByIndex(-1)).toThrow('Index must be a non-negative integer.');
        });

        test('should throw error for non-integer index', () => {
            expect(() => generator.getPlateByIndex(1.5)).toThrow('Index must be a non-negative integer.');
        });

        test('should accept string numbers', () => {
            expect(generator.getPlateByIndex("123")).toBe('000123');
        });
    });

    describe('numeric sequences', () => {
        test('should generate first plate as 000000', () => {
            expect(generator.getPlateByIndex(0)).toBe('000000');
        });

        test('should generate correct numeric sequences', () => {
            expect(generator.getPlateByIndex(1)).toBe('000001');
            expect(generator.getPlateByIndex(999)).toBe('000999');
            expect(generator.getPlateByIndex(999999)).toBe('999999');
        });
    });

    describe('single letter sequences', () => {
        test('should start single letter sequence correctly', () => {
            expect(generator.getPlateByIndex(1000000)).toBe('00000A');
        });

        test('should generate correct single letter sequences', () => {
            const base = 1000000;
            expect(generator.getPlateByIndex(base + 1)).toBe('00001A');
            expect(generator.getPlateByIndex(base + 99999)).toBe('99999A');
            expect(generator.getPlateByIndex(base + 100000)).toBe('00000B');
            expect(generator.getPlateByIndex(base + 2599999)).toBe('99999Z');
        });
    });

    describe('double letter sequences', () => {
        test('should start double letter sequence correctly', () => {
            const doubleLetterStart = 1000000 + (100000 * 26);
            expect(generator.getPlateByIndex(doubleLetterStart)).toBe('0000AA');
        });

        test('should generate correct double letter sequences', () => {
            const base = 1000000 + (100000 * 26);
            expect(generator.getPlateByIndex(base + 1)).toBe('0001AA');
            expect(generator.getPlateByIndex(base + 9999)).toBe('9999AA');
            expect(generator.getPlateByIndex(base + 10000)).toBe('0000AB');
        });
    });

    describe('triple letter sequences', () => {
        test('should generate correct triple letter sequences', () => {
            const base = 1000000 + (100000 * 26) + (10000 * 26 * 26);
            expect(generator.getPlateByIndex(base)).toBe('000AAA');
            expect(generator.getPlateByIndex(base + 1)).toBe('001AAA');
        });
    });

    describe('maximum values', () => {
        test('should calculate correct maximum index', () => {
            const maxPlate = generator.getPlateByIndex(generator.getMaxIndex());
            expect(maxPlate).toBe('ZZZZZZ');
        });

        test('should throw error for index beyond maximum', () => {
            expect(() => 
                generator.getPlateByIndex(generator.getMaxIndex() + 1)
            ).toThrow('Index exceeds maximum supported value.');
        });
    });

    describe('sequence transitions', () => {
        test('should handle transitions between patterns correctly', () => {
            const sequences = [
                [0, '000000'],
                [999999, '999999'],
                [1000000, '00000A'],
                [1099999, '99999A'],
                [1100000, '00000B'],
                [3599999, '99999Z'],
                [3600000, '0000AA'],
                [3609999, '9999AA'],
                [3610000, '0000AB']
            ];

            sequences.forEach(([index, expected]) => {
                expect(generator.getPlateByIndex(index)).toBe(expected);
            });
        });
    });
});