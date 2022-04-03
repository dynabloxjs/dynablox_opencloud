> ### Active Development
> This module is currently in the initial development phase. Breaking changes may be introduced without warning before a stable 1.0.0 release. Check release notes of every release before updating.

### <p align="center">Dynablox</p>
<p align="center">
<a href="https://doc.deno.land/https://deno.land/x/dynablox_opencloud/mod.ts">docs</a>
| <a href="https://deno.land/x/dynablox_opencloud">deno.land/x</a>
| <a href="https://www.npmjs.com/package/@dynabloxjs/opencloud">npm</a>
</p>

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

For pre-release builds:

Run `npm install dynabloxjs/dynablox_opencloud#node` to install the current pre-release build.

#### Deno Installation
Steps to install Deno can be found [here](https://github.com/denoland/deno_install).

Unlike Node or Python, Deno modules only need to be imported via a path (and then cached).

Once you have done the necessary steps, import it:
```ts
import * as dynablox from "https://deno.land/x/dynablox_opencloud/mod.ts";
``` 
*NOTE*: You can also specify a version by appending `@{version}` to the module name.

... and it's done! Only the `--allow-net` flag is needed for Dynablox Open Cloud, see [more information about flags in the Deno manual](https://deno.land/manual/getting_started/permissions).

For pre-release builds:

Replace `https://deno.land/x/dynablox_opencloud/mod.ts` with `https://raw.githubusercontent.com/dynabloxjs/dynablox_opencloud/main/mod.ts`, or clone onto your machine and import `mod.ts` from the downloaded folder in your code.

### Starting Guide
*NOTE: If you are not using tooling, you are silly.*

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
    credentialsValue: "APIKEYHERE",
})
```

#### Permission Scopes
It is also possible to define **scopes** to tell the client what and what it can not access. 
This is similar to the actual Scopes system Roblox uses for OpenCloud and oAuth.

By default, all scopes are allowed.
```typescript
const client = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
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

#### Examples
##### Publishing a Place
<details>
    <summary>Deno</summary>

```typescript
import { OpenCloudClient } from "https://deno.land/x/dynablox_opencloud/mod.ts";

const client = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
    scopes: [{
        // Tell the client we have access to updating place data in the universe 13058, and no other universe.
        type: "universe-places",
        targetParts: ["13058"],
        operations: ["write"],
    }],
});

// The methods have "base" because it doesn't actually make any HTTP requests.
const place = client.getBaseUniverse(13058).getBasePlace(1818);

const fileData = await Deno.readFile("./place.rbxl");

// Updates the content of the place for the Saved version type.
const placeVersion = await place.updateContents(fileData, "Saved");

console.log(`Updated place to version ${placeVersion}`);
```

</details>

<details>
    <summary>NodeJS</summary>

```javascript
const { OpenCloudClient } = require("@dynabloxjs/opencloud");
const fs = require("fs/promises");

const client = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
    scopes: [{
        // Tell the client we have access to updating place data in the universe 13058, and no other universe.
        type: "universe-places",
        targetParts: ["13058"],
        operations: ["write"],
    }],
});

// The methods have "base" because it doesn't actually make any HTTP requests.
const place = client.getBaseUniverse(13058).getBasePlace(1818);

(async () => {
    const fileData = await fs.readFile("./place.rbxl");
    
    // Updates the content of the place for the Saved version type.
    const placeVersion = await place.updateContents(fileData, "Saved");
    
    console.log(`Updated place to version ${placeVersion}`);
})();
```

</details>

##### Accessing DataStores
<details>
    <summary>Deno</summary>

```typescript
import { OpenCloudClient } from "https://deno.land/x/dynablox_opencloud/mod.ts";

const client = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
    scopes: [{
        // Tell the client we have access to reading and listing DataStore objects on universe 13058 and not any other universe.
        type: "universe-datastores.objects",
        targetParts: ["13058"],
        operations: ["read", "list"],
    }],
});

// The method has "base" because it doesn't actually make any HTTP requests.
const datastore = client.getBaseUniverse(13058).getStandardDataStore("TestStore");

// `ServicePage` has an async iterator implementation, let's use it.
for await (const keys of datastore.listEntries()) {
    keys.forEach(({key}) => {
        console.log(key);
        if (key.startsWith("Player")) {
            const data = await datastore.getEntry(key);

            console.log(`${key} data length: ${JSON.stringify(data).length}`);
        }
    });
}

// Or:
// const keys = await datastore.listEntries().getCurrentPage();
// keys.data.forEach(({key}) => ...);
// Get more data:
// const moreKeys = await keys.getNextPage();
// moreKeys.data.forEach(({key}) => ...);
```
</details>

<details>
    <summary>NodeJS</summary>

```javascript
const { OpenCloudClient } = require("@dynabloxjs/opencloud");

const client = new OpenCloudClient({
    credentialsValue: "APIKEYHERE",
    scopes: [{
        // Tell the client we have access to reading and listing DataStore objects on universe 13058 and not any other universe.
        type: "universe-datastores.objects",
        targetParts: ["13058"],
        operations: ["read", "list"],
    }],
});

// The method has "base" because it doesn't actually make any HTTP requests.
const datastore = client.getBaseUniverse(13058).getStandardDataStore("TestStore");

(async () => {
    // `ServicePage` has an async iterator implementation, let's use it.
    for await (const keys of datastore.listEntries()) {
        keys.forEach(({key}) => {
            console.log(key);
            if (key.startsWith("Player")) {
                const data = await datastore.getEntry(key);
                
                console.log(`${key} data length: ${JSON.stringify(data).length}`);
            }
        });
    }

    // Or:
    // const keys = await datastore.listEntries().getCurrentPage();
    // keys.data.forEach(({key}) => ...);
    // Get more data:
    // const moreKeys = await keys.getNextPage();
    // moreKeys.data.forEach(({key}) => ...);
})();
```

</details>