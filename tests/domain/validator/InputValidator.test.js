import { InputValidator } from '../../../src/domain/validators/InputValidator';

describe('InputValidator', () => {
    describe('validateNonEmptyArray', () => {
        test('should accept valid non-empty array', () => {
            expect(() => InputValidator.validateNonEmptyArray([1, 2, 3])).not.toThrow();
        });

        test('should throw error for empty array', () => {
            expect(() => InputValidator.validateNonEmptyArray([])).toThrow('Input must be a non-empty array.');
        });

        test('should throw error for non-array input', () => {
            expect(() => InputValidator.validateNonEmptyArray('not an array')).toThrow('Input must be a non-empty array.');
            expect(() => InputValidator.validateNonEmptyArray(null)).toThrow('Input must be a non-empty array.');
            expect(() => InputValidator.validateNonEmptyArray(undefined)).toThrow('Input must be a non-empty array.');
        });

        test('should use custom error message when provided', () => {
            expect(() => InputValidator.validateNonEmptyArray([], 'Custom error')).toThrow('Custom error');
        });
    });

    describe('validateZeroOrMore', () => {
        test('should accept zero', () => {
            expect(() => InputValidator.validateZeroOrMore(0)).not.toThrow();
        });

        test('should accept positive numbers', () => {
            expect(() => InputValidator.validateZeroOrMore(1)).not.toThrow();
            expect(() => InputValidator.validateZeroOrMore(100)).not.toThrow();
        });

        test('should accept string numbers', () => {
            expect(() => InputValidator.validateZeroOrMore('0')).not.toThrow();
            expect(() => InputValidator.validateZeroOrMore('42')).not.toThrow();
        });

        test('should throw error for negative numbers', () => {
            expect(() => InputValidator.validateZeroOrMore(-1)).toThrow('Input must be a positive integer.');
            expect(() => InputValidator.validateZeroOrMore('-42')).toThrow('Input must be a positive integer.');
        });

        test('should use custom error message when provided', () => {
            expect(() => InputValidator.validateZeroOrMore(-1, 'Custom error')).toThrow('Custom error');
        });
    });

    describe('validateGreaterThanZero', () => {
        test('should accept positive integers', () => {
            expect(() => InputValidator.validateGreaterThanZero(1)).not.toThrow();
            expect(() => InputValidator.validateGreaterThanZero(42)).not.toThrow();
        });

        test('should accept string positive integers', () => {
            expect(() => InputValidator.validateGreaterThanZero('1')).not.toThrow();
            expect(() => InputValidator.validateGreaterThanZero('42')).not.toThrow();
        });

        test('should throw error for zero', () => {
            expect(() => InputValidator.validateGreaterThanZero(0)).toThrow('Input must be greater than 0.');
        });

        test('should throw error for negative numbers', () => {
            expect(() => InputValidator.validateGreaterThanZero(-1)).toThrow('Input must be greater than 0.');
        });

        test('should throw error for non-integers', () => {
            expect(() => InputValidator.validateGreaterThanZero(1.5)).toThrow('Input must be greater than 0.');
            expect(() => InputValidator.validateGreaterThanZero('1.5')).toThrow('Input must be greater than 0.');
        });

        test('should use custom error message when provided', () => {
            expect(() => InputValidator.validateGreaterThanZero(0, 'Custom error')).toThrow('Custom error');
        });
    });

    describe('validateDigitString', () => {
        test('should accept strings containing only digits', () => {
            expect(() => InputValidator.validateDigitString('123')).not.toThrow();
            expect(() => InputValidator.validateDigitString('0')).not.toThrow();
        });

        test('should accept strings with whitespace', () => {
            expect(() => InputValidator.validateDigitString('123 ')).not.toThrow();
            expect(() => InputValidator.validateDigitString(' 456')).not.toThrow();
        });

        test('should throw error for strings with non-digits', () => {
            expect(() => InputValidator.validateDigitString('12a3')).toThrow('Input must contain only digits.');
            expect(() => InputValidator.validateDigitString('abc')).toThrow('Input must contain only digits.');
            expect(() => InputValidator.validateDigitString('12.3')).toThrow('Input must contain only digits.');
        });

        test('should throw error for non-string inputs', () => {
            expect(() => InputValidator.validateDigitString(123)).toThrow('Input must contain only digits.');
            expect(() => InputValidator.validateDigitString(null)).toThrow('Input must contain only digits.');
            expect(() => InputValidator.validateDigitString(undefined)).toThrow('Input must contain only digits.');
        });

        test('should use custom error message when provided', () => {
            expect(() => InputValidator.validateDigitString('abc', 'Custom error')).toThrow('Custom error');
        });
    });
});