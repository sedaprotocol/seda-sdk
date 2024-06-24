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
});
