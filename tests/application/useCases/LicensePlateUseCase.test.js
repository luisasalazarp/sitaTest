import { LicensePlateUseCase } from '../../../src/application/useCases/LicensePlateUseCase.js';
import { InputValidator } from '../../../src/domain/validators/InputValidator.js';

jest.mock('../../../src/domain/validators/InputValidator.js'); // Mock InputValidator

describe('LicensePlateUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('delegates to generator.getPlateByIndex and returns its value', () => {
        const mockGenerator = { 
            getPlateByIndex: jest.fn().mockReturnValue('000123'),
            getMaxIndex: jest.fn().mockReturnValue(999999)
        };
        const useCase = new LicensePlateUseCase(mockGenerator);
        const result = useCase.execute(123);
        expect(mockGenerator.getPlateByIndex).toHaveBeenCalledTimes(1);
        expect(mockGenerator.getPlateByIndex).toHaveBeenCalledWith(123);
        expect(result).toBe('000123');
    });

    test('works with different indices (parameter passthrough)', () => {
        const outputs = ['000000', '000001', '00000A'];
        const mockGenerator = { 
            getPlateByIndex: jest.fn((n) => outputs[n]),
            getMaxIndex: jest.fn().mockReturnValue(999999)
        };
        const useCase = new LicensePlateUseCase(mockGenerator);
        const r0 = useCase.execute(0);
        const r1 = useCase.execute(1);
        const r2 = useCase.execute(2);
        expect(r0).toBe('000000');
        expect(r1).toBe('000001');
        expect(r2).toBe('00000A');
        expect(mockGenerator.getPlateByIndex.mock.calls.map(c => c[0])).toEqual([0, 1, 2]);
    });

    test('propagates errors thrown by generator', () => {
        const mockGenerator = { 
            getPlateByIndex: jest.fn(() => { throw new Error('Index must be a non-negative integer.'); }),
            getMaxIndex: jest.fn().mockReturnValue(999999)
        };
        const useCase = new LicensePlateUseCase(mockGenerator);
        expect(() => useCase.execute(-1)).toThrow('Index must be a non-negative integer.');
    });

    test('validates input using InputValidator', () => {
        const mockGenerator = { 
            getPlateByIndex: jest.fn().mockReturnValue('000123'),
            getMaxIndex: jest.fn().mockReturnValue(999999)
        };
        const useCase = new LicensePlateUseCase(mockGenerator);

        // Mock InputValidator methods
        InputValidator.validateZeroOrMore.mockImplementation(() => {});

        const result = useCase.execute(123);

        // Ensure InputValidator methods are called
        expect(InputValidator.validateZeroOrMore).toHaveBeenCalledTimes(1);
        expect(InputValidator.validateZeroOrMore).toHaveBeenCalledWith(123, 'Index must be a non-negative integer.');

        // Ensure the generator is called after validation
        expect(mockGenerator.getPlateByIndex).toHaveBeenCalledTimes(1);
        expect(mockGenerator.getPlateByIndex).toHaveBeenCalledWith(123);
        expect(result).toBe('000123');
    });

    test('throws validation errors from InputValidator', () => {
        const mockGenerator = { 
            getPlateByIndex: jest.fn(),
            getMaxIndex: jest.fn().mockReturnValue(999999)
        };
        const useCase = new LicensePlateUseCase(mockGenerator);

        // Mock InputValidator to throw an error
        InputValidator.validateZeroOrMore.mockImplementation(() => {
            throw new Error('Validation failed: non-negative integer required.');
        });

        expect(() => useCase.execute(-1)).toThrow('Validation failed: non-negative integer required.');
        expect(InputValidator.validateZeroOrMore).toHaveBeenCalledTimes(1);
        expect(InputValidator.validateZeroOrMore).toHaveBeenCalledWith(-1, 'Index must be a non-negative integer.');
        expect(mockGenerator.getPlateByIndex).not.toHaveBeenCalled(); // Ensure generator is not called
    });
});