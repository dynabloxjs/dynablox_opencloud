/**
 * DataStore key info.
 */
export class DataStoreKeyInfo {
	/**
	 * The scope of the key.
	 */
	public readonly scope: string;

	/**
	 * THe index of the key.
	 */
	public readonly key: string;

	/**
	 * Create a new DataStore entry version info.
	 * @param scope - The scope of the key.
	 * @param key - THe index of the key.
	 */
	constructor(
		scope: string,
		key: string,
	) {
		this.scope = scope;
		this.key = key;
	}
}
