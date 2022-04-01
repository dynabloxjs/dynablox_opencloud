import * as dntShim from "../../_dnt.test_shims.js";
import { BaseClient } from "../../src/clients/BaseClient.js";
import { assertEquals } from "../../deps/deno.land/std@0.133.0/testing/asserts.js";
dntShim.Deno.test("BaseClient", async (t) => {
    const client = new BaseClient({
        credentials: {
            type: "APIKey",
            value: "TESTVALUE"
        },
        environmentURLOptions: {
            BEDEV2Url: "www.roblox.com/{0}"
        }
    });
    await t.step("authentication", () => {
        assertEquals(client.authenticationType, "APIKey");
        assertEquals(client.credentials, {
            type: "APIKey",
            value: "TESTVALUE",
        });
        client.setCredentialsValue("TESTVALUE2");
        assertEquals(client.credentials, {
            type: "APIKey",
            value: "TESTVALUE2",
        });
        assertEquals(client.rest.hasAuthentication(), true);
    });
    await t.step("default headers", () => {
        assertEquals(client.rest.defaultHeaders, undefined);
        client.setDefaultHeaders({
            test: "true",
        });
        assertEquals(client.rest.defaultHeaders, {
            test: "true",
        });
    });
    await t.step("inner RESTController", async (t) => {
        await t.step("aliases", () => {
            assertEquals(client.rest.aliases, {
                "BEDEV2Url": "www.roblox.com/{0}"
            });
        });
        await t.step("URL formatting", () => {
            assertEquals(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "www.roblox.com/test/0");
            assertEquals(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "www.roblox.com/test/0");
            assertEquals(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "www.roblox.com/test/0");
            assertEquals(client.rest.formatUrl("{BEDEV2Url:test}/0").href, "https://www.roblox.com/test/0");
            assertEquals(client.rest.formatUrl("{BEDEV2Url:test}/0", {
                test: true,
            }).href, "https://www.roblox.com/test/0?test=true");
            assertEquals(client.rest.formatUrl("{BEDEV2Url:test}/0", undefined, "wss").href, "wss://www.roblox.com/test/0");
        });
        await t.step("body formatting", async (t) => {
            await t.step("JSON", () => {
                assertEquals(client.rest.formatBody({
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
                assertEquals(client.rest.formatBody({
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
                    assertEquals(client.rest.formatBody({
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
                assertEquals(client.rest.formatBody({
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
