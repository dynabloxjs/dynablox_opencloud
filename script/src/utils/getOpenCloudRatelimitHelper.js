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
exports.getOpenCloudRatelimitHelper = void 0;
const dntShim = __importStar(require("../../_dnt.shims.js"));
const RatelimitHelper_js_1 = require("../helpers/RatelimitHelper.js");
/**
 * Get a new instance of a ratelimit helper for Open Cloud.
 * @param rest - The RESTController to use for formatting URLs.
 */
function getOpenCloudRatelimitHelper(rest) {
    return new RatelimitHelper_js_1.RatelimitHelper([
        // Place Management APIs
        // Update a place's contents
        {
            methods: ["POST"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:universes}/v1/:universeId/places/:placeId/versions?*")),
            limitations: ["AuthenticatedIP"],
            duration: 60000,
            count: 10,
        },
        // DataStore APIs
        // List DataStore entries
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Get the value of a DataStore entry
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Update the value of a DataStore entry
        {
            methods: ["POST"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Increment the value of a DataStore entry
        {
            methods: ["POST"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/increment?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Delete DataStore entry
        {
            methods: ["DELETE"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // List DataStore entry versions
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/versions?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Get DataStore entry version
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/versions/version?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // List DataStores
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl("{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores?*")),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
    ]);
}
exports.getOpenCloudRatelimitHelper = getOpenCloudRatelimitHelper;
