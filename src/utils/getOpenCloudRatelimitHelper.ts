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
		/*
		This is temporarily disabled.
		TODO: the OpenCloud rate limit helpers were not made to do throughput rateliiting, and per universe ratelimits.
		During the private beta, it was per API key.

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
			count: 300,
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
			count: 300,
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
			count: 300,
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
			count: 300,
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
			count: 300,
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
			count: 300,
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
			count: 300,
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
			count: 300,
		},*/
	]);
}
