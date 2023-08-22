import Process from './process';

@inline
export function assert(expected: bool, message: string): void {
  if (!expected) {
    Process.exit_with_message(1, message);
  }
}

@inline
export function ok(message: string = "ok"): void {
  Process.exit_with_message(0, message);
}

@inline
export function error(message: string = "error"): void {
  Process.exit_with_message(1, message);
}
