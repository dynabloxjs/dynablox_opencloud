import { BaseClient } from "../../src/clients/BaseClient.ts";
import {assertEquals} from "https://deno.land/std@0.133.0/testing/asserts.ts";

Deno.test("BaseClient", async (t) => {
    const client = new BaseClient({
        credentials: {
            type: "APIKey",
            value: "TESTVALUE"
        },
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
                "BEDEV2Url": "apis.roblox.com/{0}"
            });
        });

        await t.step("URL formatting", () => {
            assertEquals(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "apis.roblox.com/test/0");
            assertEquals(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "apis.roblox.com/test/0");
            assertEquals(client.rest.formatWithAliases("{BEDEV2Url:test}/0"), "apis.roblox.com/test/0");
            assertEquals(client.rest.formatUrl("{BEDEV2Url:test}/0").href, "https://apis.roblox.com/test/0");
            assertEquals(client.rest.formatUrl("{BEDEV2Url:test}/0", {
                test: true,
            }).href, "https://apis.roblox.com/test/0?test=true");
            assertEquals(client.rest.formatUrl("{BEDEV2Url:test}/0", undefined, "wss").href, "wss://apis.roblox.com/test/0");
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

            await t.step("unknown", () => { 
                assertEquals(client.rest.formatBody({
                    type: "unknown",
                    value: "value"
                }), {
                    type: undefined,
                    body: "value"
                });
            });

            await t.step("text", () => { 
                assertEquals(client.rest.formatBody({
                    type: "text",
                    value: "value"
                }), {
                    type: undefined,
                    body: "value"
                });
            });

            await t.step("formdata", async (t) => {
                await t.step("string value", () => {
                    const formdata = new FormData();
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