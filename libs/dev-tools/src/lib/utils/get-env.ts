import { config } from 'dotenv';
import { Maybe } from 'true-myth';

config();
config({ path: `${process.cwd}/.env` });

export function getEnvOrFail(key: string): string {
  return Maybe.of(process.env[key]).match({
    Just(value) {
      return value;
    },
    Nothing() {
      throw new Error(`No environment variable "${key}" found.`);
    },
  });
}
