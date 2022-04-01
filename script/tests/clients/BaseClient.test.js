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
const dntShim = __importStar(require("../../_dnt.test_shims.js"));
const BaseClient_js_1 = require("../../src/clients/BaseClient.js");
const asserts_js_1 = require("../../deps/deno.land/std@0.133.0/testing/asserts.js");
dntShim.Deno.test("BaseClient", async (t) => {
    const client = new BaseClient_js_1.BaseClient({
        credentials: {
            type: "APIKey",
            value: "TESTVALUE"
        },
        environmentURLOptions: {
            BEDEV2Url: "www.roblox.com/{0}"
        }
    });
    await t.step("authentication", () => {
        (0, asserts_js_1.assertEquals)(client.authenticationType, "APIKey");
        (0, asserts_js_1.assertEquals)(client.credentials, {
            type: "APIKey",
            value: "TESTVALUE",
        });
        client.setCredentialsValue("TESTVALUE2");
        (0, asserts_js_1.assertEquals)(client.credentials, {
            type: "APIKey",
            value: "TESTVALUE2",
        });
        (0, asserts_js_1.assertEquals)(client.rest.hasAuthentication(), true);
    });
    await t.step("default headers", () => {
        (0, asserts_js_1.assertEquals)(client.rest.defaultHeaders, undefined);
        client.setDefaultHeaders({
            test: "true",
        });
        (0, asserts_js_1.assertEquals)(client.rest.defaultHeaders, {
            test: "true",
        });
    });
    await t.step("inner RESTController", async (t) => {
        await t.step("aliases", () => {
            (0, asserts_js_1.assertEquals)(client.rest.aliases, {
                "BEDEV2Url": "www.roblox.com/{0}"
            });
        });
        await t.step("URL formatting", () => {
            (0, asserts_js_1.assertEquals)(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "www.roblox.com/test/0");
            (0, asserts_js_1.assertEquals)(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "www.roblox.com/test/0");
            (0, asserts_js_1.assertEquals)(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "www.roblox.com/test/0");
            (0, asserts_js_1.assertEquals)(client.rest.formatUrl("{BEDEV2Url:test}/0").href, "https://www.roblox.com/test/0");
            (0, asserts_js_1.assertEquals)(client.rest.formatUrl("{BEDEV2Url:test}/0", {
                test: true,
            }).href, "https://www.roblox.com/test/0?test=true");
            (0, asserts_js_1.assertEquals)(client.rest.formatUrl("{BEDEV2Url:test}/0", undefined, "wss").href, "wss://www.roblox.com/test/0");
        });
        await t.step("body formatting", async (t) => {
            await t.step("JSON", () => {
                (0, asserts_js_1.assertEquals)(client.rest.formatBody({
                    type: "json",
                    value: {
                        test: true,
                    }
                }), {
                    type: "application/json",
                    body: `{"test":true}`
                });
            });
            await t.step("file", () => {
                (0, asserts_js_1.assertEquals)(client.rest.formatBody({
                    type: "file",
                    value: new Uint8Array([1, 2, 3]),
                }), {
                    type: undefined,
                    body: new Uint8Array([1, 2, 3])
                });
            });
            await t.step("formdata", async (t) => {
                await t.step("string value", () => {
                    const formdata = new dntShim.FormData();
                    formdata.append("test", "value");
                    (0, asserts_js_1.assertEquals)(client.rest.formatBody({
                        type: "formdata",
                        value: {
                            test: {
                                value: "value",
                            }
                        },
                    }), {
                        type: undefined,
                        body: formdata,
                    });
                });
            });
            await t.step("urlencoded", () => {
                const search = new URLSearchParams();
                search.set("test", "true");
                (0, asserts_js_1.assertEquals)(client.rest.formatBody({
                    type: "urlencoded",
                    value: {
                        test: "true",
                    },
                }), {
                    type: undefined,
                    body: search,
                });
            });
        });
    });
});
