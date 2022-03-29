"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBEDEV2Error = void 0;
const JSONv2 = __importStar(require("./json.js"));
const deps_js_1 = require("../../deps.js");
async function parseBEDEV2Error(response) {
    const contentLength = response.headers.has("content-length")
        ? parseInt(response.headers.get("content-length"))
        : 0;
    if (contentLength === 0) {
        return [];
    }
    if (response.headers.has("content-type")) {
        const responseType = deps_js_1.MIMEType.parse(response.headers.get("content-type"));
        if (responseType) {
            if ((responseType.type === "text" ||
                responseType.type === "application") &&
                (responseType.subtype === "json" ||
                    responseType.subtype.endsWith("+json"))) {
                // Content type is json, parse.
                const json = await response._response.text().then((text) => JSONv2.deserialize(text.trim()));
                if (typeof json === "string") {
                    // in some contextes, it can be a stinrg
                    return [{
                            message: json,
                        }];
                }
                else if (Array.isArray(json)) {
                    return json.map((errorMessage) => {
                        return {
                            message: errorMessage,
                        };
                    });
                }
                else {
                    if ("errors" in json) {
                        if (json.errors instanceof Array) {
                            return json.errors.map((error) => {
                                return {
                                    code: error.code,
                                    message: error.message ?? "???",
                                };
                            });
                        }
                        else {
                            return Object.entries((json.errors)).map(([index, value]) => {
                                return {
                                    message: `${index}(${value.join(", ")})`,
                                };
                            });
                        }
                    }
                    if ("error" in json) {
                        if ("code" in json) {
                            return [{
                                    code: json.code,
                                    message: json.error,
                                }];
                        }
                        else if ("error_description" in json) {
                            return [{
                                    code: json.error,
                                    message: json.error_description,
                                }];
                        }
                        else if ("message" in json) {
                            return [{
                                    code: json.error,
                                    message: json.message,
                                }].concat("errorDetails" in json
                                ? json.errorDetails.map((error) => {
                                    return {
                                        code: error.datastoreErrorCode,
                                        message: error.errorDetailType,
                                    };
                                })
                                : []);
                        }
                    }
                    if ("message" in json) {
                        if ("errorCode" in json) {
                            return [{
                                    code: json.errorCode,
                                    message: json.message,
                                }];
                        }
                        else if ("code" in json) {
                            return [{
                                    code: json.code,
                                    message: json.message,
                                }];
                        }
                    }
                    if ("Error" in json) {
                        if (("Code" in json.Error) &&
                            ("Message" in json.Error)) {
                            return [{
                                    code: json.Error.Code,
                                    message: json.Error.Message,
                                }];
                        }
                    }
                    return [{
                            message: "Unknown Error",
                        }];
                }
            }
            else if (responseType.type === "text") {
                return [{
                        message: await response._response.text(),
                    }];
            }
            else {
                return [{
                        message: `<(${responseType?.type ?? "unknown"}/${responseType?.subtype ?? "unknown"})-formatted Error>`,
                    }];
            }
        }
        else {
            return [{
                    message: await response._response.text(),
                }];
        }
    }
    else {
        // Send error with text because we don't have content-type
        return [
            {
                message: await response._response.text(),
            },
        ];
    }
}
exports.parseBEDEV2Error = parseBEDEV2Error;
