"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.deserialize = void 0;
/** JSON.parse with BigInt support */
function deserialize(text) {
    return JSON.parse(text.replace(/([^"]+":\s*)(\d{16,})/g, '$1"$2n"'), (_, v) => {
        if (typeof v === "string" && /^\d{16,}n$/.test(v)) {
            v = BigInt(v.slice(0, -1));
        }
        return v;
    });
}
exports.deserialize = deserialize;
/** JSON.stringify with BigInt support */
function serialize(value, space) {
    return JSON.stringify(value, (_, v) => {
        if (typeof v === "bigint") {
            v = v.toString() + "n";
        }
        return v;
    }, space).replace(/:"(\d{16,}):n"/g, "$1");
}
exports.serialize = serialize;
