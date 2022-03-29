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
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 100,
		},
		// Get the value of a DataStore entry
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 500,
		},
		// Update the value of a DataStore entry
		{
			methods: ["POST"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 500,
		},
		// Increment the value of a DataStore entry
		{
			methods: ["POST"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/increment?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 500,
		},
		// Delete DataStore entry
		{
			methods: ["DELETE"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 500,
		},
		// List DataStore entry versions
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/versions?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 100,
		},
		// Get DataStore entry version
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores/datastore/entries/entry/versions/version?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 100,
		},
		// List DataStores
		{
			methods: ["GET"],
			pattern: new URLPattern(
				rest.formatUrl(
					"{BEDEV2Url:datastores}/v1/universes/:universeId/standard-datastores?*",
				),
			),
			limitations: ["Authenticated"],
			duration: 60_000,
			count: 100,
		},
	]);
}
