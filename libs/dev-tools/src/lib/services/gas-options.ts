export const DEFAULT_GAS = 'auto';
export const DEFAULT_ADJUSTMENT_FACTOR = 1.3;
export const DEFAULT_GAS_PRICE = '10000000000';

export type GasOptions = {
  /** Integer or the string 'auto'. Default 'auto' */
  gas?: string;
  /** Default: 1.3 */
  adjustmentFactor?: number;
  /** Default 10000000000 */
  gasPrice?: string;
};
