import * as dntShim from "../../_dnt.shims.js";
import { DataStoreService } from "../services/opencloud/DataStoreService.js";
import { PlaceManagementService } from "../services/opencloud/PlaceManagementService.js";
import { RatelimitHelper } from "../helpers/RatelimitHelper.js";
/**
 * Get a new instance of a ratelimit helper for Open Cloud.
 * @param rest - The RESTController to use for formatting URLs.
 */
export function getOpenCloudRatelimitHelper(rest) {
    return new RatelimitHelper([
        // Place Management APIs
        // Update a place's contents
        {
            methods: ["POST"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${PlaceManagementService.urls.updatePlaceData(":universeId", ":placeId")}?*`)),
            limitations: ["AuthenticatedIP"],
            duration: 60000,
            count: 10,
        },
        // DataStore APIs
        // List DataStore entries
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.listDataStoreEntries(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Get the value of a DataStore entry
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.getDataStoreEntry(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Update the value of a DataStore entry
        {
            methods: ["POST"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.updateDataStoreEntry(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Increment the value of a DataStore entry
        {
            methods: ["POST"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.incrementDataStoreEntry(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Delete DataStore entry
        {
            methods: ["DELETE"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.removeDataStoreEntry(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // List DataStore entry versions
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.listDataStoreEntryVersions(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // Get DataStore entry version
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.getDataStoreEntryVersion(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
        // List DataStores
        {
            methods: ["GET"],
            pattern: new dntShim.URLPattern(rest.formatUrl(`${DataStoreService.urls.listDataStores(":universeId")}?*`)),
            limitations: ["All"],
            duration: 60000,
            count: 300,
            dependencies: ["universeId"],
        },
    ]);
}
