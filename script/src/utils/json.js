"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.deserialize = void 0;
const infinity = "1e309";
/** JSON.parse with BigInt support */
function deserialize(text) {
    return JSON.parse(text.replace(/([^"]+":\s*)(\d{16,})/g, '$1"$2n"').replace(/([^"]+":\s*)inf/g, `$1${infinity}`), (_, v) => {
        if (typeof v === "string" && /^\d{16,}n$/.test(v)) {
            v = BigInt(v.slice(0, -1));
        }
        return v;
    });
}
exports.deserialize = deserialize;
/** JSON.stringify with BigInt support */
function serialize(value, space, lua) {
    return JSON.stringify(value, (_, v) => {
        if (typeof v === "bigint") {
            v = `_NUMBER_${v.toString()}n`;
        }
        else if (typeof v === "number" && !Number.isFinite(v)) {
            v = `_NUMBER_${lua ? "inf" : infinity}`;
        }
        return v;
    }, space).replace(/:"_NUMBER_(.+?)n?"/g, ":$1");
}
exports.serialize = serialize;
