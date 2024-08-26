import { keccak_256 } from "@noble/hashes/sha3";

export function keccak256(input: Buffer): Buffer {
    const hasher = keccak_256.create();
    hasher.update(input);
    
    return Buffer.from(hasher.digest());
}