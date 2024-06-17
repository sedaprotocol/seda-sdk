import { JSON } from 'json-as/assembly';
import Process from './process';

@json
export class RevealBody {
  // salt!: u8[];
  // exit_code!: u8;
  gas_used!: string;
  // reveal!: u8[];
}

export default class Tally {
  static getReveals(): RevealBody[] {
    const encoded_reveals = Process.args().at(2);
    console.log(encoded_reveals);
    const end_result = JSON.parse<RevealBody[]>(encoded_reveals);

    // const a = end_result.at(0).get('gas_used');
    const a = end_result.at(0).gas_used;
    console.log(a);

    return [
      {
        gas_used: 'hu',
      },
    ];
  }
}
