import { Tally } from '../../as-sdk/assembly';

export function testTallyVmReveals(): void {
  const reveals = Tally.getReveals();

  for (let index = 0; index < reveals.length; index++) {
    const reveal = reveals[index];
    console.log('Some gas used: ' + reveal.gas_used);
  }
}
