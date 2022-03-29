"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dntGlobalThis = exports.URLPattern = exports.Response = exports.Request = exports.Headers = exports.FormData = exports.File = exports.fetch = exports.setTimeout = exports.setInterval = exports.crypto = exports.Blob = exports.Deno = void 0;
const shim_deno_1 = require("@deno/shim-deno");
var shim_deno_2 = require("@deno/shim-deno");
Object.defineProperty(exports, "Deno", { enumerable: true, get: function () { return shim_deno_2.Deno; } });
const buffer_1 = require("buffer");
var buffer_2 = require("buffer");
Object.defineProperty(exports, "Blob", { enumerable: true, get: function () { return buffer_2.Blob; } });
const shim_crypto_1 = require("@deno/shim-crypto");
var shim_crypto_2 = require("@deno/shim-crypto");
Object.defineProperty(exports, "crypto", { enumerable: true, get: function () { return shim_crypto_2.crypto; } });
const shim_timers_1 = require("@deno/shim-timers");
var shim_timers_2 = require("@deno/shim-timers");
Object.defineProperty(exports, "setInterval", { enumerable: true, get: function () { return shim_timers_2.setInterval; } });
Object.defineProperty(exports, "setTimeout", { enumerable: true, get: function () { return shim_timers_2.setTimeout; } });
const undici_1 = require("undici");
var undici_2 = require("undici");
Object.defineProperty(exports, "fetch", { enumerable: true, get: function () { return undici_2.fetch; } });
Object.defineProperty(exports, "File", { enumerable: true, get: function () { return undici_2.File; } });
Object.defineProperty(exports, "FormData", { enumerable: true, get: function () { return undici_2.FormData; } });
Object.defineProperty(exports, "Headers", { enumerable: true, get: function () { return undici_2.Headers; } });
Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return undici_2.Request; } });
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return undici_2.Response; } });
const index_js_1 = require("./src/shims/urlpattern/index.js");
var index_js_2 = require("./src/shims/urlpattern/index.js");
Object.defineProperty(exports, "URLPattern", { enumerable: true, get: function () { return index_js_2.URLPattern; } });
const dntGlobals = {
    Deno: shim_deno_1.Deno,
    Blob: buffer_1.Blob,
    crypto: shim_crypto_1.crypto,
    setInterval: shim_timers_1.setInterval,
    setTimeout: shim_timers_1.setTimeout,
    fetch: undici_1.fetch,
    File: undici_1.File,
    FormData: undici_1.FormData,
    Headers: undici_1.Headers,
    Request: undici_1.Request,
    Response: undici_1.Response,
    URLPattern: index_js_1.URLPattern,
};
exports.dntGlobalThis = createMergeProxy(globalThis, dntGlobals);
// deno-lint-ignore ban-types
function createMergeProxy(baseObj, extObj) {
    return new Proxy(baseObj, {
        get(_target, prop, _receiver) {
            if (prop in extObj) {
                return extObj[prop];
            }
            else {
                return baseObj[prop];
            }
        },
        set(_target, prop, value) {
            if (prop in extObj) {
                delete extObj[prop];
            }
            baseObj[prop] = value;
            return true;
        },
        deleteProperty(_target, prop) {
            let success = false;
            if (prop in extObj) {
                delete extObj[prop];
                success = true;
            }
            if (prop in baseObj) {
                delete baseObj[prop];
                success = true;
            }
            return success;
        },
        ownKeys(_target) {
            const baseKeys = Reflect.ownKeys(baseObj);
            const extKeys = Reflect.ownKeys(extObj);
            const extKeysSet = new Set(extKeys);
            return [...baseKeys.filter((k) => !extKeysSet.has(k)), ...extKeys];
        },
        defineProperty(_target, prop, desc) {
            if (prop in extObj) {
                delete extObj[prop];
            }
            Reflect.defineProperty(baseObj, prop, desc);
            return true;
        },
        getOwnPropertyDescriptor(_target, prop) {
            if (prop in extObj) {
                return Reflect.getOwnPropertyDescriptor(extObj, prop);
            }
            else {
                return Reflect.getOwnPropertyDescriptor(baseObj, prop);
            }
        },
        has(_target, prop) {
            return prop in extObj || prop in baseObj;
        },
    });
}
