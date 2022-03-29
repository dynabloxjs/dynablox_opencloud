### Active Development
This module is currently in active development. Nothing is going to stay consistent as it reaches a stable release.

## <p align="center">Dynablox</p>
<p align="center">[Docs](https://doc.deno.land/https://deno.land/x/dynablox_opencloud/mod.ts)</p>

An API wrapper for the OpenCloud Roblox API using the Deno runtime (with full web compatibility and mostly NodeJS compatbility).

This is a stripped-down version of the original library, for Open Cloud.

### Installation
#### Node Installation
Steps to install Node can be found [here](https://nodejs.org).<br />
Run `npm install @dynabloxjs/opencloud` to install.

Import it with CommonJS:
```js
const dynablox = require("@dynabloxjs/opencloud");
```
or ESModule:
```js
import * as dynablox from "@dynabloxjs/opencloud";
```

#### Deno Installation
Steps to install Deno can be found [here](https://github.com/denoland/deno_install).

Unlike Node or Python, Deno modules only need to be imported via a path (and then cached).

Because this is a private repository, more has to be done to remotely import it. See the [Deno manual for more information](https://deno.land/manual/linking_to_external_code/private). You can also just **download** it and import locally.

Once you have done the necessary steps, import it:
```ts
import * as dynablox from "https://deno.land/x/dynablox_opencloud/mod.ts";
``` 
... and it's done! Only the `--allow-net` flag is needed for Dynablox Open Cloud, see [more information about flags in the Deno manual](https://deno.land/manual/getting_started/permissions).

### Starting Guide
*NOTE: If you are not using tooling, you are fcked*

### All Uses (Functional Programming)
In `BaseClient`, there is almost no usage of OOP. All APIs on Open Cloud endpoints can be accessed via `<BaseClient>.services`, though with little documentation.

Import `BaseClient` from the module entrypoint, either the module name (NodeJS) or mod.ts (Deno)
Construct a new BaseClient with either API key or other credentials. 
```typescript
const client = new BaseClient({
    credentials: {
        type: "APIKey",
        value: "APIKEYHERE"
    }
})
```

### Open Cloud (API Key, OOP)
In `OpenCloudClient`, it is mostly object-orientated, with all methods available on `<OpenCloudClient>` with clear documentation, though APIs on Open Cloud endpoints are still accessible via `<BaseClient>.services`.

Import `OpenCloudClient` from the module entrypoint, either the module name (NodeJS) or mod.ts (Deno)
Construct a new OpenCloudClient with your APIKey.
```typescript
const client = new OpenCloudClient({
    credentialValue: "APIKEYHERE"
})
```

#### Permission Scopes
It is also possible to define **scopes** to tell the client what and what it can not access. 
This is similar to the actual Scopes system Roblox uses for OpenCloud and oAuth.

By default, all scopes are allowed.
```typescript
const client = new OpenCloudClient({
    credentialValue: "APIKEYHERE",
    scopes: [{
        // The scope type, see TSDoc for more options.
        scopeType: "universe-datastores.objects",
        // Allows for universe ID 13058 and datastoreName.
        // a Target part can also be "*" to allow all. Some target parts may be optional.
        targetParts: ["13058", "datastoreName"],
        // Allows for reading entry values in the DataStore.
        operations: ["read"],
        // NOTE: this is optional. If set to `true`, `operations` is ignored.
        allowAllOperations: false,
    }]
})
```

#### Ratelimiting
the OpenCloudClient also has a built-in ratelimit helper. If a ratelimit is reached, it will throw an OpenCloudClientError.

**Ratelimits are only enforced on Open Cloud endpoints, User endpoints will never be supported for this behavior.**

You can opt in for yielding behavior by setting `ratelimiterShouldYield` to `true`:
```typescript
const client = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
    ratelimiterShouldYield: true,
})
```

It also exposes the Ratelimiter helper publicly, so you can have mutiple OpenCloudClients using the same ratelimit helper instance:
```typescript
const client1 = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
});

const client2 = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
    ratelimiter: client1.ratelimiter,
});
```