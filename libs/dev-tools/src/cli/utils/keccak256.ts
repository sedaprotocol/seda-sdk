import { keccak256 as hash } from "@cosmjs/crypto";

export function keccak256(input: Uint8Array): string {
    return Buffer.from(hash(input)).toString('hex');
}