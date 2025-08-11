import { LicensePlateUseCase } from '../../../src/application/useCases/LicensePlateUseCase.js';

describe('LicensePlateUseCase', () => {
    test('delegates to generator.getPlateByIndex and returns its value', () => {
        const mockGenerator = { getPlateByIndex: jest.fn().mockReturnValue('000123') };
        const useCase = new LicensePlateUseCase(mockGenerator);
        const result = useCase.execute(123);
        expect(mockGenerator.getPlateByIndex).toHaveBeenCalledTimes(1);
        expect(mockGenerator.getPlateByIndex).toHaveBeenCalledWith(123);
        expect(result).toBe('000123');
    });

    test('works with different indices (parameter passthrough)', () => {
        const outputs = ['000000', '000001', '00000A'];
        const mockGenerator = { getPlateByIndex: jest.fn((n) => outputs[n]) };
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
        const mockGenerator = { getPlateByIndex: jest.fn(() => { throw new Error('Invalid index'); }) };
        const useCase = new LicensePlateUseCase(mockGenerator);
        expect(() => useCase.execute(-1)).toThrow('Invalid index');
    });
});