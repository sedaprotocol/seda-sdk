export function isDataRequestHash(value: string): boolean {
  if (value.length !== 64) {
    return false;
  }

  return Boolean(value.match(/^[0-9a-f]+$/i));
}
