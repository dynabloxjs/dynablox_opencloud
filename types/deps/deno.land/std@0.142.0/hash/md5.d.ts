export declare type Message = string | ArrayBuffer;
/** Md5 hash */
export declare class Md5 {
    #private;
    constructor();
    /**
     * Update internal state
     * @param data data to update, data cannot exceed 2^32 bytes
     */
    update(data: Message): this;
    /** Returns final hash */
    digest(): ArrayBuffer;
    /**
     * Returns hash as a string of given format
     * @param format format of output string (hex or base64). Default is hex
     */
    toString(format?: "hex" | "base64"): string;
}
