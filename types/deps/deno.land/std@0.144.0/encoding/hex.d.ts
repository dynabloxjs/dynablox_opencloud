/** Encodes `src` into `src.length * 2` bytes. */
export declare function encode(src: Uint8Array): Uint8Array;
/**
 * Decodes `src` into `src.length / 2` bytes.
 * If the input is malformed, an error will be thrown.
 */
export declare function decode(src: Uint8Array): Uint8Array;
