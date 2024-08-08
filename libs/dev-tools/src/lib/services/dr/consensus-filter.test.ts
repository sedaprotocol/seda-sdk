import { expect, describe, it } from 'bun:test';
import { encodeConsensusFilter } from './consensus-filter';

describe('encodeConsensusFilter', () => {
  describe('invalid method', () => {
    it('should throw an error for an unknown mode', () => {
      expect(() => {
        // @ts-expect-error Force invalid inout
        encodeConsensusFilter({ method: 'madness' });
      }).toThrowError();
    });
  });

  describe('method: none', () => {
    it('should encode a valid JSON path', () => {
      const result = encodeConsensusFilter({
        method: 'none',
      });

      const resultAsHex = Buffer.from(result).toString('hex');

      expect(resultAsHex).toBe('00');
    });
  });

  describe('method: mode', () => {
    it('should encode a valid JSON path', () => {
      const result = encodeConsensusFilter({
        method: 'mode',
        jsonPath: '$.result.text',
      });

      const resultAsHex = Buffer.from(result).toString('hex');

      // Taken from chain unit tests
      expect(resultAsHex).toBe('01000000000000000d242e726573756c742e74657874');
    });

    it('should fail on an invalid JSON path', () => {
      expect(() => {
        // @ts-expect-error Force invalid inout
        encodeConsensusFilter({ method: 'mode', jsonPath: 'result.text' });
      }).toThrowError();
    });
  });

  describe('method: std-dev', () => {
    // Taken from chain unit tests
    it.each([
      {
        input: {
          jsonPath: '$.result.text',
          maxSigma: 1.5,
          numberType: 'uint64',
        },
        expectedResult:
          '02000000000016E36003000000000000000D242E726573756C742E74657874',
      },
      {
        input: {
          jsonPath: '$.result.text',
          maxSigma: 1.5,
          numberType: 'int64',
        },
        expectedResult:
          '02000000000016E36001000000000000000D242E726573756C742E74657874',
      },
      {
        input: {
          jsonPath: '$.result.text',
          maxSigma: 0.5,
          numberType: 'int64',
        },
        expectedResult:
          '02000000000007A12001000000000000000D242E726573756C742E74657874',
      },
    ] as const)('should encode a valid filter', ({ input, expectedResult }) => {
      const result = encodeConsensusFilter({
        method: 'std-dev',
        ...input,
      });

      const resultAsHex = Buffer.from(result).toString('hex').toUpperCase();

      expect(resultAsHex).toBe(expectedResult);
    });

    it('should fail on an invalid JSON path', () => {
      expect(() => {
        encodeConsensusFilter({
          method: 'std-dev',
          // @ts-expect-error Force invalid input
          jsonPath: 'result.text',
          maxSigma: 1.5,
          numberType: 'int32',
        });
      }).toThrowError();
    });
  });
});
