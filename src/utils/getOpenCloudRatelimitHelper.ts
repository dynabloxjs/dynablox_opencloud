import { RatelimitHelper } from "../helpers/RatelimitHelper.ts";
import type { RESTController } from "../rest/RESTController.ts";

/**
 * Get a new instance of a ratelimit helper for Open Cloud.
 * @param rest - The RESTController to use for formatting URLs.
 */
export function getOpenCloudRatelimitHelper(
	rest: RESTController,
): RatelimitHelper {
	return new RatelimitHelper([
		// Place Management APIs
		// Update a place's contents
		{
			methods: ["POST"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:universes}/v1/:universeId/places/:placeId/versions?*",
				),
			),
			limitations: ["AuthenticatedIP"],
			duration: 60_000,
			count: 10,
		},
		// DataStore APIs
		// List DataStore entries
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// Get the value of a DataStore entry
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// Update the value of a DataStore entry
		{
			methods: ["POST"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// Increment the value of a DataStore entry
		{
			methods: ["POST"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/increment?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// Delete DataStore entry
		{
			methods: ["DELETE"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// List DataStore entry versions
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/versions?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// Get DataStore entry version
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/versions/version?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
		// List DataStores
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores?*",
				),
			),
			limitations: ["All"],
			duration: 60_000,
			count: 300,
			dependencies: ["universeId"],
		},
	]);
}
