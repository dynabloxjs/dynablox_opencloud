"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelizeObject = void 0;
function camelCaseString(str) {
    return str.split("").reverse().map((character, index, array) => {
        if (character == " " || character == "_" || character == "-")
            return;
        if (index === array.length - 1)
            return character.toLowerCase();
        const nextCharacter = array[index + 1];
        if (nextCharacter == " " || nextCharacter == "_" || nextCharacter == "-") {
            return character.toUpperCase();
        }
        return character;
    }).reverse().join("");
}
// Ported from "https://github.com/sindresorhus/camelcase-keys/blob/main/index.js" for use in Deno.
const cache = new Map();
// deno-lint-ignore ban-types
const isObject = (value) => typeof value === "object" &&
    value !== null &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date);
function camelizeObject(input, options = { deep: false, pascalCase: false }) {
    if (!isObject(input)) {
        return input;
    }
    const { exclude, pascalCase, stopPaths, deep } = options;
    const stopPathsSet = new Set(stopPaths);
    const makeMapper = (parentPath) => (key, value) => {
        if (deep && isObject(value)) {
            const path = parentPath === undefined
                ? key.toString()
                : `${parentPath}.${key}`;
            if (Array.isArray(value)) {
                const newValue = value.map((value, index) => Array.from(makeMapper(path)(index, value)));
                const valueToSet = [];
                newValue.forEach(([index, value]) => valueToSet[index] = value);
                value = valueToSet;
            }
            else if (!stopPathsSet.has(path)) {
                value = Object.fromEntries(Object.entries(value).map(([key, value]) => makeMapper(path)(key, value)));
            }
        }
        if (!Number.isInteger(key) &&
            !(exclude && exclude.includes(key))) {
            const cacheKey = pascalCase ? `${key}_` : key;
            if (cache.has(cacheKey)) {
                key = cache.get(cacheKey);
            }
            else {
                const returnValue = camelCaseString(key);
                if (key.length < 100) { // Prevent abuse
                    cache.set(cacheKey, returnValue);
                }
                key = returnValue;
            }
        }
        return [key, value];
    };
    if (Array.isArray(input)) {
        const newInput = input.map((value, index) => Array.from(makeMapper(undefined)(index, value)));
        const output = [];
        newInput.forEach(([index, value]) => output[index] = value);
        return output;
    }
    else {
        return Object.fromEntries(Object.entries(input).map(([key, value]) => makeMapper(undefined)(key, value)));
    }
}
exports.camelizeObject = camelizeObject;
