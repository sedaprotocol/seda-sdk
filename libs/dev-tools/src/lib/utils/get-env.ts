import { config } from 'dotenv';
import { Maybe } from 'true-myth';

config();
config({ path: `${process.cwd}/.env` });

export function getEnvOrFail(key: string): string {
  return getEnv(key).match({
    Just(value) {
      return value;
    },
    Nothing() {
      throw new Error(`No environment variable "${key}" found.`);
    },
  });
}

export function getEnv(key: string): Maybe<string> {
  return Maybe.of(process.env[key]);
}
