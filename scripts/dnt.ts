import { build } from "https://deno.land/x/dnt@0.22.0/mod.ts";

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    skipSourceOutput: true,
    shims: {
        deno: true,
        undici: true,
        crypto: true,
        blob: true,
        timers: true,
        custom: [
            {
                module: "./src/shims/urlpattern/index.ts",
                globalNames: ["URLPattern"],
            }
        ],
        customDev: [
            {
                package: {
                    name: "whatwg-mimetype",
                    version: "^3.0.0"
                },
                globalNames: [],
                typesPackage: {
                    name: "@types/whatwg-mimetype",
                    version: "^2.1.1"
                }
            }
        ]
    },
    mappings: {
        "https://esm.sh/whatwg-mimetype@3.0.0": {
            name: "whatwg-mimetype",
            version: "^3.0.0"
        },
    },
    package: {
        name: "@dynabloxjs/opencloud",
        version: "0.1.6",
        description: "A Roblox OpenCloud API wrapper for Deno (and NodeJS) written in TypeScript. This is an automatically generated Node port.",
        homepage: "https://github.com/dynabloxjs/dynablox_opencloud",
        author: "Julli4n",
        bugs: {
            url: "https://github.com/dynabloxjs/dynablox_opencloud/issues"
        },
        repository: {
            type: "git",
            url: "git@github.com:JullianDev/dynablox_opencloud.git"
        },
        keywords: [
            "dynablox",
            "roblox",
            "opencloud",
            "api",
            "roblox-api",
            "roblox-dev",
            "rbx",
        ],
        license: "MIT",
    },
});

await Deno.rename("./LICENSE", "./npm/LICENSE");
await Deno.rename("./README.md", "./npm/README.md");
